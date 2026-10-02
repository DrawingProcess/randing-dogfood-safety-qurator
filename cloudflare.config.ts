import { bindings, defineConfig, defineWorker } from "cf/config";

// Workers Builds sets this to the dashboard Worker name. Deploy fails when
// the config name does not match that Worker.
const workerName = process.env.WRANGLER_CI_OVERRIDE_NAME || "mitgo-meongnyang";

export default defineConfig({
  worker: defineWorker({
    name: workerName,
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-02",
    compatibilityFlags: ["nodejs_compat"],
    assets: { notFoundHandling: "none" },
    env: {
      ASSETS: bindings.assets(),
    },
  }),
});
