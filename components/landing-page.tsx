import Link from "next/link";
import { BadgeExplorer } from "@/components/badge-explorer";
import { CategoryLinks } from "@/components/category-links";
import { ProductCard } from "@/components/product-card";
import { SampleCtaLink } from "@/components/sample-cta";
import { categoryLabels, petLabels } from "@/lib/labels";
import type { Product } from "@/lib/types";

const problems = [
  "이 사료 성분 논란 있었던 것 같은데...?",
  "성분표에서 뭐부터 확인해야 하지...?",
  "수제 간식이라고 하는데 국산 맞겠지...?",
  "원재료 표시가 왜 이렇게 찾기 힘들어...?",
];

const usualSteps = [
  "사료 직접 검색",
  "성분 이슈 탐색",
  "성분표 분석 및 비교",
  "기호도를 위한 후기 확인",
  "상품 선택",
  "소비 및 구매 결정",
];

const oursBenefits = [
  "이미 선별된 사료 및 간식",
  "세분화된 카테고리 큐레이션",
  "견종, 나이, 기호도, 식성 표시",
];

export function LandingPage({ groups }: { groups: Array<{ title: string; pet: "dog" | "cat"; category: "food" | "snack"; products: Product[] }> }) {
  const preview = groups.filter((group) => group.products.length > 0);

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-[82rem] px-4 py-12 sm:py-16 lg:py-20">
        <p className="inline-flex rounded-full bg-[#fff6e4] px-4 py-2 text-sm font-medium text-ink sm:text-base">
          믿고 먹이는 사료, 믿고 고르는 간식 큐레이션 마켓 믿고멍냥
        </p>
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(24rem,0.8fr)] lg:gap-12">
          <h1 className="text-[2.15rem] font-extrabold leading-[1.2] tracking-tight sm:text-[2.85rem] lg:text-[3.5rem]">
            <span className="lg:whitespace-nowrap">
              우리 아이가 매일 먹는 <span className="whitespace-nowrap">사료,</span>
            </span>
            <br />
            아무거나 고르지 마세요.
          </h1>
          <div className="flex w-full flex-col lg:w-[34rem] lg:justify-self-end">
            <p className="text-xl leading-8 text-ink sm:text-[1.35rem] sm:leading-9">
              성분부터 제조 정보까지 꼼꼼하게 살펴보고 선별한 <span className="whitespace-nowrap">사료와</span> 간식만 모았습니다.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex min-h-14 w-full items-center justify-center whitespace-nowrap rounded-full bg-[#fff6e4] px-4 py-4 text-center text-[clamp(0.95rem,3.6vw,1.5rem)] font-extrabold text-ink sm:min-h-[4.25rem] sm:px-8 sm:py-5 lg:min-h-[4.75rem]"
            >
              큐레이션 사료 / 간식 보러가기
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[82rem] px-4 pb-16 pt-4">
        <h2 className="text-[1.85rem] font-extrabold leading-snug sm:text-4xl lg:text-[2.75rem]">안심 사료를 찾기 위한 과정, 어떠셨나요?</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {problems.map((quote) => (
            <blockquote key={quote} className="rounded-2xl bg-[#fff6e4] px-5 py-5 text-xl leading-8 sm:text-[1.35rem] sm:leading-9">
              “{quote}”
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[82rem] px-4 pb-20">
        <h2 className="text-[1.85rem] font-extrabold leading-snug sm:text-4xl lg:text-[2.75rem]">믿고멍냥은 다릅니다.</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="rounded-[1.75rem] bg-[#fffaf2] p-6 sm:p-8">
            <h3 className="text-center text-2xl font-extrabold sm:text-[1.75rem]">기존 소비 방식</h3>
            <div className="mt-8 grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-10">
              <p className="shrink-0 text-[1.65rem] font-extrabold leading-snug sm:w-[11rem] sm:text-3xl">
                최소 6단계의
                <br />
                구매 절차
              </p>
              <ol className="space-y-3 text-xl font-medium sm:text-[1.35rem]">
                {usualSteps.map((step, index) => (
                  <li key={step}>
                    {index + 1}. {step}
                  </li>
                ))}
              </ol>
            </div>
          </article>
          <article className="rounded-[1.75rem] bg-yellow p-6 sm:p-8">
            <h3 className="text-center text-2xl font-extrabold sm:text-[1.75rem]">믿고멍냥</h3>
            <div className="mt-8 grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
              <p className="rounded-2xl bg-white px-5 py-6 text-center text-2xl font-extrabold leading-snug sm:max-w-[9.5rem] sm:text-[1.75rem]">
                검색 단계
                <br />
                간소화
              </p>
              <ul className="space-y-3 text-xl font-medium sm:text-[1.35rem]">
                {oursBenefits.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden className="mt-0.5 font-extrabold">☑</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-8 rounded-2xl bg-white/80 px-4 py-3 text-center text-lg font-extrabold sm:text-xl">
              필터 설정 → 구매, 오직 2단계의 구매 절차
            </p>
          </article>
        </div>
      </section>

      <section id="products" className="border-t border-line bg-[#fff8ec]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">골라 둔 먹거리</h2>
              <p className="mt-2 text-muted">강아지와 고양이, 사료와 간식만 먼저 보여드립니다.</p>
            </div>
            <CategoryLinks
              links={[
                { href: "/products?pet=dog&category=food", label: "🐶 강아지 사료", pet: "dog", category: "food" },
                { href: "/products?pet=dog&category=snack", label: "🐶 강아지 간식", pet: "dog", category: "snack" },
                { href: "/products?pet=cat&category=food", label: "🐱 고양이 사료", pet: "cat", category: "food", className: "rounded-full bg-leaf px-3 py-2" },
                { href: "/products?pet=cat&category=snack", label: "🐱 고양이 간식", pet: "cat", category: "snack", className: "rounded-full bg-leaf px-3 py-2" },
              ]}
            />
          </div>
          <div className="mt-8 space-y-10">
            {preview.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 text-xl font-bold">
                  {group.pet === "dog" ? "🐶" : "🐱"} {petLabels[group.pet]} {categoryLabels[group.category]}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-extrabold sm:text-4xl">어려운 성분표 대신, 한눈에 확인하세요.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted">뱃지는 믿고멍냥의 자체 선별·확인 기준입니다. 안전을 단정하는 표시가 아닙니다.</p>
          <div className="mt-6">
            <BadgeExplorer />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="max-w-3xl text-3xl font-extrabold leading-snug sm:text-4xl">우리 아이에게 먹이는 것이니까, 판매하는 것보다 선별하는 것을 먼저 생각합니다.</h2>
        <p className="mt-5 max-w-2xl leading-8 text-muted">
          우리가 정한 기준을 충족하지 못하거나 보호자가 확인하기 어려운 정보가 있는 제품은 큐레이션 대상에서 제외할 수 있습니다. 상품 정보와 기준을 최대한 투명하게 공개하겠습니다.
        </p>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-forest px-6 py-12 text-white sm:px-10">
          <h2 className="text-3xl font-extrabold sm:text-4xl">먼저 경험해보세요.</h2>
          <p className="mt-4 max-w-2xl leading-8 text-white/85">
            아직 정식 서비스를 준비하고 있습니다. 서비스가 정식으로 시작되기 전 안심 먹거리에 관심 있는 보호자분들을 대상으로 <strong className="text-white">무료 샘플을 보내드리는 이벤트를 진행합니다.</strong> 어떤 먹거리를 선별하면 좋을지 보호자님의 의견도 함께 듣고 있습니다.
          </p>
          <SampleCtaLink source="landing" className="mt-8 inline-flex rounded-full bg-yellow px-7 py-3.5 text-lg font-extrabold text-ink">
            안심 먹거리 샘플 받아보기 →
          </SampleCtaLink>
        </div>
      </section>
    </div>
  );
}
