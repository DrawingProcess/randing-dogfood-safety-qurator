import type { SurveyResponse } from "@/lib/types";
import { platformLabel } from "@/lib/labels";
import { hasServiceRole } from "@/lib/supabase/env";
import { createServiceClient } from "@/lib/supabase/server";
import { percent } from "@/lib/utils";

export type FunnelStep = {
  key: string;
  label: string;
  count: number;
  conversionFromPrevious: number | null;
  dropoffFromPrevious: number | null;
};

export type ProductStat = {
  id: string;
  name: string;
  pet_type: string;
  category: string;
  card_clicks: number;
  detail_views: number;
  sample_cta_after: number;
};

export type CategoryStat = {
  category: "food" | "snack";
  category_views: number;
  card_clicks: number;
  detail_views: number;
  sample_cta_after: number;
  clickRate: number | null;
  ctaRate: number | null;
};

export type DashboardData = {
  configured: boolean;
  notice: string | null;
  totalVisitors: number;
  productDetail: number;
  sampleCta: number;
  samplePage: number;
  googleForm: number;
  overallConversion: number | null;
  funnel: FunnelStep[];
  products: ProductStat[];
  pet: {
    dogVisitors: number;
    catVisitors: number;
    dogSampleCta: number;
    catSampleCta: number;
    dogCtaRate: number | null;
    catCtaRate: number | null;
  };
  categories: CategoryStat[];
  concerns: Array<{ label: string; count: number }>;
  features: Array<{ label: string; count: number }>;
  sampleConcerns: Array<{ label: string; count: number }>;
  purchase: {
    channels: Array<{ label: string; count: number }>;
    frequencies: Array<{ label: string; count: number }>;
    spends: Array<{ label: string; count: number }>;
    brands: Array<{ label: string; count: number }>;
  };
  sources: Array<{ label: string; count: number }>;
  responses: SurveyResponse[];
};

function emptyDashboard(notice: string | null): DashboardData {
  const steps = [
    ["landing", "랜딩 방문", 0],
    ["detail", "상품 상세", 0],
    ["cta", "샘플 CTA", 0],
    ["sample", "샘플 페이지", 0],
    ["form", "Google Form", 0],
  ] as const;
  return {
    configured: false,
    notice,
    totalVisitors: 0,
    productDetail: 0,
    sampleCta: 0,
    samplePage: 0,
    googleForm: 0,
    overallConversion: null,
    funnel: steps.map(([key, label, count], index) => ({
      key,
      label,
      count,
      conversionFromPrevious: index === 0 ? null : null,
      dropoffFromPrevious: index === 0 ? null : null,
    })),
    products: [],
    pet: {
      dogVisitors: 0,
      catVisitors: 0,
      dogSampleCta: 0,
      catSampleCta: 0,
      dogCtaRate: null,
      catCtaRate: null,
    },
    categories: [
      { category: "food", category_views: 0, card_clicks: 0, detail_views: 0, sample_cta_after: 0, clickRate: null, ctaRate: null },
      { category: "snack", category_views: 0, card_clicks: 0, detail_views: 0, sample_cta_after: 0, clickRate: null, ctaRate: null },
    ],
    concerns: [],
    features: [],
    sampleConcerns: [],
    purchase: { channels: [], frequencies: [], spends: [], brands: [] },
    sources: [],
    responses: [],
  };
}

function tally(values: Array<string | null | undefined>) {
  const map = new Map<string, number>();
  for (const value of values) {
    const label = value?.trim();
    if (!label) continue;
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function tallyLists(lists: unknown[]) {
  const values: string[] = [];
  for (const list of lists) {
    if (Array.isArray(list)) {
      for (const item of list) {
        if (typeof item === "string") values.push(item);
      }
    }
  }
  return tally(values);
}

function asNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

export async function loadDashboard(): Promise<DashboardData> {
  if (!hasServiceRole()) {
    return emptyDashboard("Supabase service role 키가 설정되면 이벤트와 설문 집계가 표시됩니다.");
  }
  const client = createServiceClient();
  if (!client) return emptyDashboard("Supabase에 연결하지 못했습니다.");

  const [funnelRes, productRes, petRes, categoryRes, surveyRes, sampleRes, sourceRes] = await Promise.all([
    client.from("analytics_funnel").select("*").single(),
    client.from("analytics_product_stats").select("*").order("detail_views", { ascending: false }),
    client.from("analytics_pet_type_stats").select("*").single(),
    client.from("analytics_category_stats").select("*"),
    client.from("survey_responses").select("*").order("created_at", { ascending: false }).limit(500),
    client.from("analytics_events").select("metadata").eq("event_name", "sample_form_completed").limit(2000),
    client.from("analytics_events").select("session_id, metadata").not("metadata->>acq_platform", "is", null).limit(4000),
  ]);

  if (funnelRes.error) {
    return emptyDashboard(`집계를 읽지 못했습니다. 마이그레이션 적용 여부를 확인해 주세요. (${funnelRes.error.message})`);
  }

  const funnelRow = funnelRes.data;
  const counts = [
    asNumber(funnelRow.landing_visitors),
    asNumber(funnelRow.product_detail),
    asNumber(funnelRow.sample_cta),
    asNumber(funnelRow.sample_page),
    asNumber(funnelRow.google_form),
  ];
  const labels = ["랜딩 방문", "상품 상세", "샘플 CTA", "샘플 페이지", "Google Form"];
  const keys = ["landing", "detail", "cta", "sample", "form"];
  const funnel: FunnelStep[] = counts.map((count, index) => {
    const previous = index === 0 ? null : counts[index - 1];
    const conversion = previous === null ? null : percent(count, previous);
    return {
      key: keys[index],
      label: labels[index],
      count,
      conversionFromPrevious: conversion,
      dropoffFromPrevious: conversion === null ? null : 1 - conversion,
    };
  });

  const responses = ((surveyRes.data ?? []) as SurveyResponse[]).map((row) => ({
    ...row,
    main_concerns: Array.isArray(row.main_concerns) ? row.main_concerns : [],
    desired_features: Array.isArray(row.desired_features) ? row.desired_features : [],
    free_text: row.free_text && typeof row.free_text === "object" ? row.free_text : {},
  }));

  const categories = ((categoryRes.data ?? []) as Array<Omit<CategoryStat, "clickRate" | "ctaRate">>).map((row) => ({
    category: row.category,
    category_views: asNumber(row.category_views),
    card_clicks: asNumber(row.card_clicks),
    detail_views: asNumber(row.detail_views),
    sample_cta_after: asNumber(row.sample_cta_after),
    clickRate: percent(asNumber(row.card_clicks), asNumber(row.category_views)),
    ctaRate: percent(asNumber(row.sample_cta_after), asNumber(row.detail_views)),
  }));

  const dogVisitors = asNumber(petRes.data?.dog_visitors);
  const catVisitors = asNumber(petRes.data?.cat_visitors);
  const dogSampleCta = asNumber(petRes.data?.dog_sample_cta);
  const catSampleCta = asNumber(petRes.data?.cat_sample_cta);

  const sampleConcerns = tallyLists(
    (sampleRes.data ?? []).map((row) => {
      const metadata = row.metadata as { concerns?: unknown } | null;
      return metadata?.concerns;
    }),
  );

  const seenSessions = new Set<string>();
  const sourcePlatforms: string[] = [];
  for (const row of sourceRes.error ? [] : sourceRes.data ?? []) {
    if (seenSessions.has(row.session_id)) continue;
    const metadata = row.metadata as { acq_platform?: unknown } | null;
    if (typeof metadata?.acq_platform !== "string" || !metadata.acq_platform) continue;
    seenSessions.add(row.session_id);
    sourcePlatforms.push(platformLabel(metadata.acq_platform));
  }

  return {
    configured: true,
    notice: null,
    totalVisitors: asNumber(funnelRow.total_visitors),
    productDetail: counts[1],
    sampleCta: counts[2],
    samplePage: counts[3],
    googleForm: counts[4],
    overallConversion: percent(counts[4], counts[0]),
    funnel,
    products: ((productRes.data ?? []) as ProductStat[]).map((row) => ({
      ...row,
      card_clicks: asNumber(row.card_clicks),
      detail_views: asNumber(row.detail_views),
      sample_cta_after: asNumber(row.sample_cta_after),
    })),
    pet: {
      dogVisitors,
      catVisitors,
      dogSampleCta,
      catSampleCta,
      dogCtaRate: percent(dogSampleCta, dogVisitors),
      catCtaRate: percent(catSampleCta, catVisitors),
    },
    categories,
    concerns: tallyLists(responses.map((row) => row.main_concerns)),
    features: tallyLists(responses.map((row) => row.desired_features)),
    sampleConcerns,
    purchase: {
      channels: tally(responses.map((row) => row.purchase_channel)),
      frequencies: tally(responses.map((row) => row.purchase_frequency)),
      spends: tally(responses.map((row) => row.monthly_spend)),
      brands: tally(responses.map((row) => row.current_brand)),
    },
    sources: tally(sourcePlatforms),
    responses,
  };
}
