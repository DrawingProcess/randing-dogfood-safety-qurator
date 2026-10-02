import { bindings, defineConfig, defineWorker } from "cf/config";

const runtimeBindingNames = [
  "ANALYSIS_PASSWORD",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_GOOGLE_FORM_URL",
] as const;

function runtimeBindings() {
  const env: Record<string, ReturnType<typeof bindings.assets> | ReturnType<typeof bindings.text>> = {
    ASSETS: bindings.assets(),
  };

  for (const name of runtimeBindingNames) {
    const value = process.env[name];
    if (value) env[name] = bindings.text(value);
  }

  return env;
}

export default defineConfig({
  worker: defineWorker({
    name: "trust-paw",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-02",
    compatibilityFlags: ["nodejs_compat", "nodejs_compat_populate_process_env"],
    assets: { notFoundHandling: "none" },
    env: runtimeBindings(),
  }),
});
