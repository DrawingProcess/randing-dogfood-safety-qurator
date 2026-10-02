"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { importSurvey, lockGate } from "@/lib/actions";
import type { DashboardData } from "@/lib/metrics";
import { categoryLabels, petLabels } from "@/lib/labels";
import type { Category, PetType } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

export function AnalysisDashboard({ data }: { data: DashboardData }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-forest">믿고멍냥 분석</p>
          <h1 className="mt-1 text-3xl font-bold">고객검증 대시보드</h1>
        </div>
        <div className="flex gap-2 text-sm">
          <Link href="/admin/products" className="rounded-full border border-line bg-card px-4 py-2">상품 관리</Link>
          <form action={lockGate}>
            <button className="rounded-full bg-yellow px-4 py-2 font-semibold">잠그기</button>
          </form>
        </div>
      </div>
      {data.notice ? <p className="mt-4 rounded-2xl bg-yellow px-4 py-3 text-sm">{data.notice}</p> : null}

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi label="총 방문자" value={data.totalVisitors} />
        <Kpi label="상품 상세 조회" value={data.productDetail} />
        <Kpi label="샘플 CTA 클릭" value={data.sampleCta} />
        <Kpi label="샘플 신청 페이지 진입" value={data.samplePage} />
        <Kpi label="Google Form 이동" value={data.googleForm} />
        <Kpi label="전체 전환율" value={formatPercent(data.overallConversion)} />
      </section>

      <section className="mt-8 rounded-3xl border border-line bg-card p-5">
        <h2 className="text-xl font-bold">퍼널</h2>
        <p className="mt-1 text-sm text-muted">같은 세션 기준입니다. 전환율은 바로 이전 단계 대비입니다.</p>
        <ol className="mt-4 space-y-3">
          {data.funnel.map((step, index) => (
            <li key={step.key}>
              {index > 0 ? (
                <p className="mb-2 text-sm text-forest">
                  ↓ {formatPercent(step.conversionFromPrevious)} 전환 · 이탈 {formatPercent(step.dropoffFromPrevious)}
                </p>
              ) : null}
              <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
                <span className="font-semibold">{step.label}</span>
                <span className="text-lg font-bold">{step.count.toLocaleString("ko-KR")}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">상품별</h2>
        <div className="mt-3 overflow-x-auto rounded-3xl border border-line bg-card">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">상품명</th>
                <th className="px-4 py-3 font-medium">조회수</th>
                <th className="px-4 py-3 font-medium">상세페이지 조회</th>
                <th className="px-4 py-3 font-medium">샘플 CTA 이후 클릭</th>
                <th className="px-4 py-3 font-medium">Pet Type</th>
                <th className="px-4 py-3 font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              {data.products.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-muted">아직 상품 이벤트가 없습니다.</td></tr>
              ) : data.products.map((product) => (
                <tr key={product.id} className="border-t border-line">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.card_clicks}</td>
                  <td className="px-4 py-3">{product.detail_views}</td>
                  <td className="px-4 py-3">{product.sample_cta_after}</td>
                  <td className="px-4 py-3">{petLabels[product.pet_type as PetType] ?? product.pet_type}</td>
                  <td className="px-4 py-3">{categoryLabels[product.category as Category] ?? product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-card p-5">
          <h2 className="text-xl font-bold">강아지 / 고양이</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Dog visitors" value={data.pet.dogVisitors} />
            <Row label="Cat visitors" value={data.pet.catVisitors} />
            <Row label="Dog sample CTA rate" value={formatPercent(data.pet.dogCtaRate)} />
            <Row label="Cat sample CTA rate" value={formatPercent(data.pet.catCtaRate)} />
          </dl>
        </article>
        <article className="rounded-3xl border border-line bg-card p-5">
          <h2 className="text-xl font-bold">사료 / 간식</h2>
          <div className="mt-4 space-y-4">
            {data.categories.map((item) => (
              <div key={item.category}>
                <p className="font-semibold">{categoryLabels[item.category]}</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  조회 {item.category_views} · 클릭 {item.card_clicks} · 클릭률 {formatPercent(item.clickRate)} · 상세 {item.detail_views} · CTA 전환 {formatPercent(item.ctaRate)}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <CountList title="가장 많이 선택된 고민" items={data.concerns} empty="설문 응답이 아직 없습니다." />
        <CountList title="가장 원하는 기능" items={data.features} empty="설문 응답이 아직 없습니다." />
        <article className="rounded-3xl border border-line bg-card p-5">
          <h2 className="font-bold">현재 구매 행동</h2>
          <Mini title="주요 구매 채널" items={data.purchase.channels} />
          <Mini title="구매 빈도" items={data.purchase.frequencies} />
          <Mini title="월평균 지출" items={data.purchase.spends} />
          <Mini title="현재 브랜드" items={data.purchase.brands} />
        </article>
      </section>

      <section className="mt-8 rounded-3xl border border-line bg-card p-5">
        <h2 className="font-bold">샘플 신청 폼에서 고른 고민</h2>
        <p className="mt-1 text-sm text-muted">Google Form 이전, 사이트 안에서 선택한 항목입니다.</p>
        <CountItems items={data.sampleConcerns} empty="완료된 샘플 폼이 없습니다." />
      </section>

      <Responses responses={data.responses} />
      <SurveyImport />
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="rounded-3xl border border-line bg-card p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold">{typeof value === "number" ? value.toLocaleString("ko-KR") : value}</p>
    </article>
  );
}

function Row({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt>{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function CountList({ title, items, empty }: { title: string; items: Array<{ label: string; count: number }>; empty: string }) {
  return (
    <article className="rounded-3xl border border-line bg-card p-5">
      <h2 className="font-bold">{title}</h2>
      <CountItems items={items} empty={empty} />
    </article>
  );
}

function CountItems({ items, empty }: { items: Array<{ label: string; count: number }>; empty: string }) {
  if (!items.length) return <p className="mt-3 text-sm text-muted">{empty}</p>;
  return (
    <ul className="mt-3 space-y-2 text-sm">
      {items.map((item) => (
        <li key={item.label} className="flex justify-between gap-3">
          <span>{item.label}</span>
          <span className="font-semibold">{item.count}</span>
        </li>
      ))}
    </ul>
  );
}

function Mini({ title, items }: { title: string; items: Array<{ label: string; count: number }> }) {
  return (
    <div className="mt-3">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-sm text-muted">{items.length ? items.slice(0, 3).map((item) => `${item.label} ${item.count}`).join(" · ") : "데이터 없음"}</p>
    </div>
  );
}

function Responses({ responses }: { responses: DashboardData["responses"] }) {
  const [query, setQuery] = useState("");
  const [pet, setPet] = useState<"all" | PetType>("all");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return responses.filter((row) => {
      if (pet !== "all" && row.pet_type !== pet) return false;
      if (!needle) return true;
      const concern = row.main_concerns.join(" ");
      const haystack = [row.breed, row.current_food, row.current_brand, concern, row.other_opinion].join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [responses, query, pet]);

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold">고객 의견</h2>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="사료, 고민, 의견 검색" className="flex-1 rounded-2xl border border-line bg-card px-4 py-3" />
        <select value={pet} onChange={(event) => setPet(event.target.value as "all" | PetType)} className="rounded-2xl border border-line bg-card px-4 py-3">
          <option value="all">전체 반려동물</option>
          <option value="dog">강아지</option>
          <option value="cat">고양이</option>
        </select>
      </div>
      <div className="mt-3 overflow-x-auto rounded-3xl border border-line bg-card">
        <table className="min-w-full text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">반려동물</th>
              <th className="px-4 py-3 font-medium">현재 사료</th>
              <th className="px-4 py-3 font-medium">가장 큰 고민</th>
              <th className="px-4 py-3 font-medium">기타 의견</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-muted">표시할 응답이 없습니다.</td></tr>
            ) : filtered.map((row) => (
              <tr key={row.id} className="border-t border-line align-top">
                <td className="px-4 py-3">{[row.pet_type ? petLabels[row.pet_type] : "", row.breed].filter(Boolean).join(" · ") || "—"}</td>
                <td className="px-4 py-3">{row.current_brand || row.current_food || "—"}</td>
                <td className="px-4 py-3">{row.main_concerns.join(", ") || "—"}</td>
                <td className="px-4 py-3">{row.other_opinion || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SurveyImport() {
  const [state, action, pending] = useActionState(importSurvey, null);
  return (
    <section className="mt-8 rounded-3xl border border-line bg-card p-5">
      <h2 className="font-bold">설문 응답 가져오기</h2>
      <p className="mt-1 text-sm leading-6 text-muted">Google Form 응답을 JSON 배열로 붙여 넣습니다. response_id가 같으면 갱신됩니다. 자동 동기화는 이후 단계입니다.</p>
      <form action={action} className="mt-3 space-y-3">
        <textarea name="payload" className="min-h-36 w-full rounded-2xl border border-line px-4 py-3 font-mono text-xs" placeholder='[{"response_id":"abc","pet_type":"dog","main_concerns":["성분"],"desired_features":["안심 마크"],"other_opinion":"..."}]' />
        {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        {state?.ok ? <p className="text-sm text-forest">가져왔습니다.</p> : null}
        <button disabled={pending} className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">JSON 저장</button>
      </form>
    </section>
  );
}
