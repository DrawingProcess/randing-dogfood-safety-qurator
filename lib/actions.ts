"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GATE_COOKIE, gateToken, isGateOpen, safeNextPath } from "@/lib/auth";
import { badgeCatalog } from "@/lib/badges";
import { createServiceClient } from "@/lib/supabase/server";
import { hasServiceRole } from "@/lib/supabase/env";
import { normalizeSurveyRow } from "@/lib/survey";
import { badgeTypes, categories, petTypes, productStatuses, sizeTypes, type BadgeType } from "@/lib/types";
import { isUuid } from "@/lib/utils";

export type ActionState = { error?: string; ok?: boolean } | null;

function samePassword(input: string, expected: string) {
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let index = 0; index < input.length; index += 1) {
    mismatch |= input.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function unlockGate(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const expected = process.env.ANALYSIS_PASSWORD;
  const password = String(formData.get("password") ?? "");
  if (!expected) return { error: "ANALYSIS_PASSWORD 환경변수가 설정되지 않았습니다." };
  if (!samePassword(password, expected)) return { error: "비밀번호가 올바르지 않습니다." };
  const token = gateToken();
  if (!token) return { error: "게이트를 열 수 없습니다." };
  const jar = await cookies();
  jar.set(GATE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === "production",
  });
  redirect(safeNextPath(formData.get("next")));
}

export async function lockGate() {
  const jar = await cookies();
  jar.delete(GATE_COOKIE);
  redirect("/analysis");
}

async function requireAdmin() {
  if (!(await isGateOpen())) return { error: "분석 페이지 비밀번호로 다시 들어와 주세요." } as const;
  if (!hasServiceRole()) return { error: "Supabase service role 키가 있어야 저장할 수 있습니다." } as const;
  const client = createServiceClient();
  if (!client) return { error: "Supabase에 연결하지 못했습니다." } as const;
  return { client } as const;
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function oneOf<T extends string>(value: string, allowed: readonly T[]) {
  return allowed.find((item) => item === value);
}

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };
  const idValue = text(formData, "id");
  const id = idValue && isUuid(idValue) ? idValue : crypto.randomUUID();
  const petType = oneOf(text(formData, "pet_type"), petTypes);
  const category = oneOf(text(formData, "category"), categories);
  const sizeType = oneOf(text(formData, "size_type"), sizeTypes);
  const status = oneOf(text(formData, "status"), productStatuses) ?? "active";
  const name = text(formData, "name");
  const price = Number(text(formData, "price"));
  if (!name || !petType || !category || !sizeType || !Number.isFinite(price) || price < 0) {
    return { error: "상품명, 분류, 가격을 확인해 주세요." };
  }

  const imageUrl = text(formData, "image_url");
  const file = formData.get("image");

  const payload = {
    id,
    name,
    description: text(formData, "description"),
    detail_description: text(formData, "detail_description"),
    category,
    pet_type: petType,
    size_type: sizeType,
    price: Math.round(price),
    brand: text(formData, "brand"),
    manufacturer: text(formData, "manufacturer"),
    country_of_origin: text(formData, "country_of_origin"),
    is_handmade: formData.get("is_handmade") === "on",
    manufacturing_method: text(formData, "manufacturing_method"),
    main_protein: text(formData, "main_protein"),
    image_url: imageUrl,
    status,
  };

  const saved = await auth.client.from("products").upsert(payload);
  if (saved.error) return { error: saved.error.message };

  if (file instanceof File && file.size > 0) {
    const safeName = file.name.replace(/[^\w.\-]+/g, "-").slice(0, 80);
    const path = `${id}/${crypto.randomUUID()}-${safeName}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const uploaded = await auth.client.storage.from("product-images").upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (uploaded.error) return { error: `이미지 업로드에 실패했습니다. ${uploaded.error.message}` };
    const publicUrl = auth.client.storage.from("product-images").getPublicUrl(path).data.publicUrl;
    const imageSaved = await auth.client.from("product_images").insert({
      product_id: id,
      image_url: publicUrl,
      sort_order: 0,
      alt_text: name,
    });
    if (imageSaved.error) return { error: imageSaved.error.message };
    await auth.client.from("products").update({ image_url: publicUrl }).eq("id", id);
  }

  if (!idValue) {
    const selected = formData.getAll("badge_type").map(String);
    const rows = selected
      .filter((type): type is BadgeType => badgeTypes.includes(type as BadgeType))
      .map((type) => ({
        product_id: id,
        badge_type: type,
        badge_label: badgeCatalog[type].label,
        description: badgeCatalog[type].description,
      }));
    if (rows.length) {
      const badges = await auth.client.from("product_badges").insert(rows);
      if (badges.error) return { error: badges.error.message };
    }
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/admin/products");
  redirect(`/admin/products/${id}`);
}

export async function deleteProduct(formData: FormData) {
  const auth = await requireAdmin();
  if ("error" in auth) return;
  const id = text(formData, "id");
  if (!isUuid(id)) return;
  await auth.client.from("products").delete().eq("id", id);
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function addBadge(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };
  const productId = text(formData, "product_id");
  const type = oneOf(text(formData, "badge_type"), badgeTypes);
  if (!isUuid(productId) || !type) return { error: "뱃지 종류를 선택해 주세요." };
  const description = text(formData, "description") || badgeCatalog[type].description;
  const inserted = await auth.client.from("product_badges").insert({
    product_id: productId,
    badge_type: type,
    badge_label: badgeCatalog[type].label,
    description,
  });
  if (inserted.error) return { error: inserted.error.message };
  revalidatePath(`/products/${productId}`);
  revalidatePath(`/admin/products/${productId}`);
  return { ok: true };
}

export async function deleteBadge(formData: FormData) {
  const auth = await requireAdmin();
  if ("error" in auth) return;
  const id = text(formData, "id");
  const productId = text(formData, "product_id");
  if (!isUuid(id)) return;
  await auth.client.from("product_badges").delete().eq("id", id);
  revalidatePath(`/products/${productId}`);
  revalidatePath(`/admin/products/${productId}`);
}

export async function importSurvey(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };
  const raw = text(formData, "payload");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: "JSON 배열 형식이 아닙니다." };
  }
  if (!Array.isArray(parsed) || parsed.length === 0) return { error: "응답 배열을 넣어 주세요." };
  if (parsed.length > 500) return { error: "한 번에 500건까지 가져올 수 있습니다." };
  const rows = parsed
    .filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object" && !Array.isArray(row))
    .map((row) => normalizeSurveyRow(row));
  if (!rows.length) return { error: "가져올 응답이 없습니다." };
  const withId = rows.filter((row) => row.response_id);
  const withoutId = rows.filter((row) => !row.response_id);
  if (withId.length) {
    const saved = await auth.client.from("survey_responses").upsert(withId, { onConflict: "response_id" });
    if (saved.error) return { error: saved.error.message };
  }
  if (withoutId.length) {
    const saved = await auth.client.from("survey_responses").insert(withoutId);
    if (saved.error) return { error: saved.error.message };
  }
  revalidatePath("/analysis");
  return { ok: true };
}
