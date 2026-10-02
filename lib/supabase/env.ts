import { runtimeEnv } from "@/lib/runtime-env";

export function normalizeSupabaseUrl(value: string) {
  const trimmed = value.trim();
  const dashboard = trimmed.match(/supabase\.com\/dashboard\/project\/([a-z0-9]+)/i);
  if (dashboard) return `https://${dashboard[1]}.supabase.co`;
  return trimmed.replace(/\/+$/, "").replace(/\/rest\/v1$/i, "");
}

export function supabaseUrl() {
  return normalizeSupabaseUrl(runtimeEnv("NEXT_PUBLIC_SUPABASE_URL"));
}

export function supabaseAnonKey() {
  return runtimeEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function supabaseServiceKey() {
  return runtimeEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}

export function hasServiceRole() {
  return Boolean(supabaseUrl() && supabaseServiceKey());
}
