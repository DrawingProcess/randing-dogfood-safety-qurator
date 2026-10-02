import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { hasServiceRole, isSupabaseConfigured, supabaseAnonKey, supabaseServiceKey, supabaseUrl } from "@/lib/supabase/env";

export async function createAnonServerClient() {
  if (!isSupabaseConfigured()) return null;
  const jar = await cookies();
  return createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return jar.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {
          // Server Components cannot always write cookies. Event inserts do not need a session.
        }
      },
    },
  });
}

export function createServiceClient() {
  if (!hasServiceRole()) return null;
  return createClient(supabaseUrl(), supabaseServiceKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
