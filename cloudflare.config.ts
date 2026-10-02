import { bindings, defineConfig, defineWorker } from "cf/config";

const FALLBACK_WORKER_NAME = "mitgo-meongnyang";

type ScriptRecord = {
  id?: string;
  tag?: string;
  default_environment?: {
    script?: {
      id?: string;
      tag?: string;
    };
  };
};

type ListResponse = {
  result?: ScriptRecord[];
  result_info?: {
    page?: number;
    total_pages?: number;
  };
  errors?: { message?: string }[];
};

function envValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

async function listWorkers(
  accountId: string,
  token: string,
  path: "workers/scripts" | "workers/services",
): Promise<ScriptRecord[]> {
  const records: ScriptRecord[] = [];
  for (let page = 1; page <= 20; page += 1) {
    const apiBase =
      envValue("CLOUDFLARE_API_BASE_URL", "CF_API_BASE_URL") ??
      "https://api.cloudflare.com/client/v4";
    const url = new URL(
      `${apiBase.replace(/\/$/, "")}/accounts/${accountId}/${path}`,
    );
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", "100");
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = (await response.json().catch(() => null)) as ListResponse | null;
    if (!response.ok) {
      const message = body?.errors?.find((error) => error.message)?.message;
      throw new Error(
        message
          ? `Cloudflare Worker lookup failed (${response.status}): ${message}`
          : `Cloudflare Worker lookup failed (${response.status}).`,
      );
    }
    const pageRecords = Array.isArray(body?.result) ? body.result : [];
    records.push(...pageRecords);
    const totalPages = body?.result_info?.total_pages ?? 1;
    if (page >= totalPages || pageRecords.length === 0) break;
  }
  return records;
}

function nameForTag(records: ScriptRecord[], tag: string) {
  for (const record of records) {
    const script = record.default_environment?.script;
    const recordTag = script?.tag ?? record.tag;
    const name = script?.id ?? record.id;
    if (recordTag === tag && name) return name;
  }
  return undefined;
}

async function resolveWorkerName() {
  const override = envValue("WRANGLER_CI_OVERRIDE_NAME");
  if (override) return override;

  const tag = envValue("WRANGLER_CI_MATCH_TAG");
  if (!tag) return FALLBACK_WORKER_NAME;

  const accountId = envValue("CLOUDFLARE_ACCOUNT_ID", "CF_ACCOUNT_ID");
  const token = envValue("CLOUDFLARE_API_TOKEN", "CF_API_TOKEN");
  if (!accountId || !token) {
    throw new Error(
      "Workers Builds did not provide an account id and API token, so the connected Worker name could not be resolved.",
    );
  }

  const scripts = await listWorkers(accountId, token, "workers/scripts");
  const fromScripts = nameForTag(scripts, tag);
  if (fromScripts) return fromScripts;

  const services = await listWorkers(accountId, token, "workers/services");
  const fromServices = nameForTag(services, tag);
  if (fromServices) return fromServices;

  throw new Error(
    "No Cloudflare Worker matches the script tag for this build. Set the dashboard Worker name as WRANGLER_CI_OVERRIDE_NAME or in cloudflare.config.ts.",
  );
}

export default defineConfig(async () => ({
  worker: defineWorker({
    name: await resolveWorkerName(),
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-02",
    compatibilityFlags: ["nodejs_compat"],
    assets: { notFoundHandling: "none" },
    env: {
      ASSETS: bindings.assets(),
    },
  }),
}));
