import { runtimeEnv } from "@/lib/runtime-env";

export function supabaseUrl() {
  return runtimeEnv("NEXT_PUBLIC_SUPABASE_URL");
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
