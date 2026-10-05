export type Acquisition = {
  platform: string;
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
  landing: string;
};

const ACQUISITION_KEY = "mmn_acquisition";

const UTM_PLATFORMS: Record<string, string> = {
  instagram: "instagram",
  ig: "instagram",
  facebook: "facebook",
  fb: "facebook",
  youtube: "youtube",
  yt: "youtube",
  tiktok: "tiktok",
  tt: "tiktok",
  threads: "threads",
  twitter: "x",
  x: "x",
  google: "google",
  naver: "naver",
  kakao: "kakao",
  kakaotalk: "kakao",
  daum: "kakao",
  linkedin: "linkedin",
};

const HOST_PLATFORMS: Array<[string, string]> = [
  ["instagram.com", "instagram"],
  ["facebook.com", "facebook"],
  ["fb.com", "facebook"],
  ["youtube.com", "youtube"],
  ["youtu.be", "youtube"],
  ["tiktok.com", "tiktok"],
  ["threads.net", "threads"],
  ["twitter.com", "x"],
  ["x.com", "x"],
  ["t.co", "x"],
  ["google.com", "google"],
  ["google.co.kr", "google"],
  ["naver.com", "naver"],
  ["kakao.com", "kakao"],
  ["daum.net", "kakao"],
  ["linkedin.com", "linkedin"],
];

function clip(value: string, max = 80) {
  return value.trim().slice(0, max);
}

function normalizeToken(value: string) {
  return value.trim().toLowerCase();
}

function hostMatches(host: string, domain: string) {
  return host === domain || host.endsWith(`.${domain}`);
}

function platformFromHost(host: string) {
  const normalized = host.replace(/^www\./, "").toLowerCase();
  for (const [domain, platform] of HOST_PLATFORMS) {
    if (hostMatches(normalized, domain)) return platform;
  }
  return "other";
}

function platformFromSource(source: string) {
  const key = normalizeToken(source);
  if (UTM_PLATFORMS[key]) return UTM_PLATFORMS[key];
  const safe = key.replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
  return safe || "other";
}

function referrerHost(referrer: string, origin: string) {
  if (!referrer) return "";
  try {
    const url = new URL(referrer);
    if (url.origin === origin) return "";
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

export function classifyAcquisition(input: { href: string; referrer?: string; origin?: string }): Acquisition {
  const href = input.href || "/";
  const url = new URL(href, input.origin || "https://midgo-pet.sjchoi-dp.workers.dev");
  const origin = input.origin || url.origin;
  const utmSource = clip(url.searchParams.get("utm_source") ?? "");
  const utmMedium = clip(url.searchParams.get("utm_medium") ?? "");
  const utmCampaign = clip(url.searchParams.get("utm_campaign") ?? "");
  const host = referrerHost(input.referrer ?? "", origin);
  const landing = clip(url.pathname || "/", 200);

  if (utmSource) {
    return {
      platform: platformFromSource(utmSource),
      source: utmSource,
      medium: utmMedium || "campaign",
      campaign: utmCampaign,
      referrer: host,
      landing,
    };
  }
  if (host) {
    const platform = platformFromHost(host);
    return {
      platform,
      source: host,
      medium: platform === "google" || platform === "naver" ? "organic" : "referral",
      campaign: "",
      referrer: host,
      landing,
    };
  }
  return {
    platform: "direct",
    source: "direct",
    medium: "direct",
    campaign: "",
    referrer: "",
    landing,
  };
}

function isAcquisition(value: unknown): value is Acquisition {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return typeof row.platform === "string" && row.platform.length > 0 && typeof row.source === "string";
}

export function readStoredAcquisition() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ACQUISITION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isAcquisition(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function getAcquisition(): Acquisition {
  const stored = readStoredAcquisition();
  if (stored) return stored;
  const created = classifyAcquisition({
    href: window.location.href,
    referrer: document.referrer,
    origin: window.location.origin,
  });
  window.localStorage.setItem(ACQUISITION_KEY, JSON.stringify(created));
  return created;
}

export function acquisitionMetadata(acq: Acquisition) {
  const metadata: Record<string, string> = {
    acq_platform: acq.platform,
    acq_source: acq.source,
    acq_medium: acq.medium,
  };
  if (acq.campaign) metadata.acq_campaign = acq.campaign;
  if (acq.referrer) metadata.acq_referrer = acq.referrer;
  if (acq.landing) metadata.acq_landing = acq.landing;
  return metadata;
}
