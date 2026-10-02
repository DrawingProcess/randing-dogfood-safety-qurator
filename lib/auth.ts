import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const GATE_COOKIE = "mmn_gate";

export function gateToken() {
  const password = process.env.ANALYSIS_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("mitgo-gate-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function isGateOpen() {
  const token = gateToken();
  if (!token) return false;
  const jar = await cookies();
  const value = jar.get(GATE_COOKIE)?.value;
  if (!value) return false;
  return safeEqual(value, token);
}

export function safeNextPath(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "/analysis";
  if (!next.startsWith("/") || next.startsWith("//")) return "/analysis";
  return next;
}
