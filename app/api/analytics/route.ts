import { NextResponse } from "next/server";
import { createAnonServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { eventNames, petTypes, type EventName, type PetType } from "@/lib/types";
import { isUuid } from "@/lib/utils";

function sanitizeMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const entries = Object.entries(value as Record<string, unknown>).slice(0, 30);
  const metadata: Record<string, unknown> = {};
  for (const [key, item] of entries) {
    if (!/^[a-zA-Z0-9_]{1,40}$/.test(key)) continue;
    if (typeof item === "string") metadata[key] = item.slice(0, 500);
    else if (typeof item === "number" || typeof item === "boolean" || item === null) metadata[key] = item;
    else if (Array.isArray(item)) {
      metadata[key] = item.filter((entry) => typeof entry === "string").slice(0, 20).map((entry) => entry.slice(0, 80));
    }
  }
  return metadata;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const input = body as Record<string, unknown>;
  const sessionId = typeof input.session_id === "string" ? input.session_id : "";
  const eventName = typeof input.event_name === "string" ? input.event_name : "";
  if (!isUuid(sessionId) || !eventNames.includes(eventName as EventName)) {
    return NextResponse.json({ error: "invalid event" }, { status: 400 });
  }
  const productId = typeof input.product_id === "string" && isUuid(input.product_id) ? input.product_id : null;
  const petType = typeof input.pet_type === "string" && petTypes.includes(input.pet_type as PetType)
    ? (input.pet_type as PetType)
    : null;
  const page = typeof input.page === "string" ? input.page.slice(0, 200) : "";

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ stored: false }, { status: 202 });
  }
  const client = await createAnonServerClient();
  if (!client) return NextResponse.json({ stored: false }, { status: 202 });

  const { error } = await client.from("analytics_events").insert({
    session_id: sessionId,
    event_name: eventName,
    page,
    product_id: productId,
    pet_type: petType,
    metadata: sanitizeMetadata(input.metadata),
  });
  if (error) return NextResponse.json({ stored: false }, { status: 202 });
  return NextResponse.json({ stored: true }, { status: 201 });
}
