import Link from "next/link";
import { BadgeExplorer } from "@/components/badge-explorer";
import { CategoryLinks } from "@/components/category-links";
import { PeekingPets, quoteCharacters } from "@/components/characters";
import { ProductCard } from "@/components/product-card";
import { SampleCtaLink } from "@/components/sample-cta";
import { categoryLabels, petLabels } from "@/lib/labels";
import type { Product } from "@/lib/types";

const quoteFaceClass = "h-[clamp(1.55rem,4.4vw,3.4rem)] w-[clamp(1.55rem,4.4vw,3.4rem)] shrink-0";

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

const comparisonBoxClass =
  "flex min-h-[clamp(3.4rem,12vw,8.5rem)] min-w-[clamp(4.4rem,14vw,9.5rem)] items-center justify-center rounded-[clamp(0.7rem,1.6vw,1rem)] bg-white px-[clamp(0.45rem,1.2vw,1.25rem)] py-[clamp(0.45rem,1.3vw,1.5rem)] text-center text-[clamp(0.52rem,1.7vw,1.75rem)] font-extrabold leading-snug";

export function LandingPage({
  groups,
}: {
  groups: Array<{ title: string; pet: "dog" | "cat"; category: "food" | "snack"; products: Product[] }>;
}) {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-[82rem] px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(1.25rem,4vw,5rem)]">
        <p className="inline-flex max-w-full rounded-full bg-[#fff6e4] px-[clamp(0.55rem,1.4vw,1rem)] py-[clamp(0.25rem,0.7vw,0.5rem)] text-[clamp(0.55rem,1.35vw,1rem)] font-medium leading-snug text-ink">
          믿고 먹이는 사료, 믿고 고르는 간식 큐레이션 마켓 믿고멍냥
        </p>
        <div className="mt-[clamp(0.75rem,2.2vw,2.5rem)] grid grid-cols-2 items-center gap-[clamp(0.6rem,2.4vw,3rem)]">
          <h1 className="min-w-0 text-[clamp(0.78rem,3.4vw,3.5rem)] font-extrabold leading-[1.25] tracking-tight">
            <span className="block whitespace-nowrap">아이가 매일 먹는 사료,</span>
            <span className="block whitespace-nowrap">아무거나 고르지 마세요.</span>
          </h1>
          <div className="flex min-w-0 w-full flex-col">
            <p className="text-[clamp(0.58rem,1.7vw,1.35rem)] leading-[1.55] text-ink">
              성분부터 제조 정보까지 꼼꼼하게 살펴보고 선별한 <span className="whitespace-nowrap">사료와</span> 간식만 모았습니다.
            </p>
            <div className="relative mt-[clamp(1.35rem,3.6vw,2.8rem)]">
              <div className="pointer-events-none absolute inset-x-0 bottom-full z-10 h-[clamp(1.15rem,3.1vw,2.15rem)] overflow-hidden">
                <PeekingPets className="absolute bottom-0 left-1/2 h-[clamp(1.7rem,4.6vw,3rem)] w-auto -translate-x-1/2" />
              </div>
              <SampleCtaLink
                source="landing"
                className="relative inline-flex min-h-[clamp(1.15rem,5.2vw,4.75rem)] w-full items-center justify-center whitespace-nowrap rounded-full bg-yellow px-[clamp(0.35rem,1.6vw,2rem)] text-center text-[clamp(0.42rem,1.7vw,1.5rem)] font-extrabold text-ink"
              >
                샘플 받아보기 →
              </SampleCtaLink>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[82rem] px-[clamp(0.75rem,2vw,1.5rem)] pb-[clamp(1.5rem,4vw,4rem)] pt-[clamp(0.25rem,1vw,0.5rem)]">
        <h2 className="text-[clamp(0.85rem,2.6vw,2.75rem)] font-extrabold leading-snug">안심 사료를 찾기 위한 과정, 어떠셨나요?</h2>
        <div className="mt-[clamp(0.7rem,2vw,2rem)] grid grid-cols-2 gap-[clamp(0.35rem,1vw,0.75rem)]">
          {problems.map((quote, index) => {
            const Face = quoteCharacters[index];
            const fromRight = index % 2 === 1;
            return (
              <div key={quote} className={`flex items-center gap-[clamp(0.28rem,0.9vw,0.75rem)] ${fromRight ? "flex-row-reverse" : ""}`}>
                <Face className={quoteFaceClass} />
                <blockquote className="min-w-0 flex-1 rounded-[clamp(0.7rem,1.6vw,1rem)] bg-[#fff6e4] px-[clamp(0.55rem,1.4vw,1.25rem)] py-[clamp(0.55rem,1.3vw,1.25rem)] text-left text-[clamp(0.58rem,1.6vw,1.35rem)] leading-[1.55]">
                  “{quote}”
                </blockquote>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[82rem] px-[clamp(0.75rem,2vw,1.5rem)] pb-[clamp(1.75rem,5vw,5rem)]">
        <h2 className="text-[clamp(0.85rem,2.6vw,2.75rem)] font-extrabold leading-snug">믿고멍냥은 다릅니다.</h2>
        <div className="mt-[clamp(1.4rem,4vw,3.25rem)] grid grid-cols-2 gap-[clamp(0.4rem,1.2vw,1rem)]">
          <article className="rounded-[clamp(0.8rem,2vw,1.75rem)] bg-[#fffaf2] p-[clamp(0.55rem,1.8vw,2rem)]">
            <h3 className="text-center text-[clamp(0.7rem,2.2vw,2.75rem)] font-extrabold">기존 소비 방식</h3>
            <div className="mt-[clamp(0.55rem,1.8vw,2rem)] grid grid-cols-[auto_1fr] items-center gap-[clamp(0.4rem,1.6vw,2.5rem)]">
              <p className={comparisonBoxClass}>
                <span>
                  최소 6단계의
                  <br />
                  구매 절차
                </span>
              </p>
              <ol className="space-y-[clamp(0.15rem,0.55vw,0.75rem)] text-[clamp(0.5rem,1.45vw,1.35rem)] font-medium">
                {usualSteps.map((step, index) => (
                  <li key={step}>
                    {index + 1}. {step}
                  </li>
                ))}
              </ol>
            </div>
          </article>
          <article className="relative rounded-[clamp(0.8rem,2vw,1.75rem)] bg-yellow p-[clamp(0.55rem,1.8vw,2rem)]">
            <div className="pointer-events-none absolute inset-x-0 bottom-full z-10 h-[clamp(1.2rem,3.3vw,2.25rem)] overflow-hidden">
              <PeekingPets className="absolute bottom-0 left-1/2 h-[clamp(1.75rem,4.8vw,3.15rem)] w-auto -translate-x-1/2" />
            </div>
            <h3 className="text-center text-[clamp(0.7rem,2.2vw,2.75rem)] font-extrabold">믿고멍냥</h3>
            <div className="mt-[clamp(0.55rem,1.8vw,2rem)] grid grid-cols-[auto_1fr] items-center gap-[clamp(0.35rem,1.4vw,2rem)]">
              <p className={comparisonBoxClass}>
                <span>
                  검색 단계
                  <br />
                  간소화
                </span>
              </p>
              <ul className="space-y-[clamp(0.25rem,0.8vw,1rem)] text-[clamp(0.5rem,1.55vw,1.5rem)] font-semibold leading-snug">
                {oursBenefits.map((item) => (
                  <li key={item} className="flex items-center gap-[clamp(0.25rem,0.8vw,1rem)]">
                    <span
                      aria-hidden
                      className="flex h-[clamp(0.7rem,1.6vw,2rem)] w-[clamp(0.7rem,1.6vw,2rem)] shrink-0 items-center justify-center rounded-[0.15rem] border-[clamp(1.5px,0.25vw,2.5px)] border-ink text-[clamp(0.45rem,1.1vw,1.25rem)] font-extrabold leading-none"
                    >
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-[clamp(0.5rem,1.6vw,2rem)] rounded-[clamp(0.55rem,1.2vw,1rem)] bg-white/80 px-[clamp(0.4rem,1.2vw,1rem)] py-[clamp(0.3rem,0.9vw,0.75rem)] text-center text-[clamp(0.5rem,1.4vw,1.25rem)] font-extrabold">
              필터 설정 → 구매, 오직 2단계의 구매 절차
            </p>
          </article>
        </div>
      </section>

      <section id="products" className="border-t border-line bg-[#fff8ec]">
        <div className="mx-auto max-w-[82rem] px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(1.5rem,4vw,4rem)]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-[clamp(1rem,2.6vw,2.25rem)] font-extrabold">골라 둔 먹거리</h2>
              <p className="mt-2 text-[clamp(0.75rem,1.5vw,1rem)] text-muted">강아지와 고양이용 사료 및 간식만 먼저 보여드립니다.</p>
            </div>
            <CategoryLinks
              links={[
                { href: "/products?pet=dog&category=food", label: "🐶 강아지 사료", pet: "dog", category: "food" },
                { href: "/products?pet=dog&category=snack", label: "🐶 강아지 간식", pet: "dog", category: "snack" },
                { href: "/products?pet=cat&category=food", label: "🐱 고양이 사료", pet: "cat", category: "food" },
                { href: "/products?pet=cat&category=snack", label: "🐱 고양이 간식", pet: "cat", category: "snack" },
              ]}
            />
          </div>
          <div className="mt-[clamp(1rem,2.2vw,2rem)] grid grid-cols-1 gap-[clamp(0.75rem,1.6vw,2rem)] md:grid-cols-2">
            {groups.map((group) => (
              <section key={group.title} className="rounded-[clamp(0.85rem,1.6vw,1.5rem)] bg-white p-[clamp(0.65rem,1.4vw,1.25rem)] shadow-[0_8px_24px_rgba(80,60,20,0.04)]">
                <h3 className="mb-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.8rem,1.8vw,1.25rem)] font-bold">
                  {group.pet === "dog" ? "🐶" : "🐱"} {petLabels[group.pet]} {categoryLabels[group.category]}
                </h3>
                {group.products.length === 0 ? (
                  <p className="rounded-2xl bg-[#fff8ec] px-4 py-6 text-sm text-muted">아직 선별한 상품이 없습니다.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-[clamp(0.4rem,1vw,1rem)]">
                    {group.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[82rem] px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(1.5rem,4vw,4rem)]">
          <h2 className="text-[clamp(1rem,2.6vw,2.25rem)] font-extrabold">어려운 성분표 대신, 한눈에 확인하세요.</h2>
          <p className="mt-3 max-w-2xl text-[clamp(0.75rem,1.5vw,1rem)] leading-7 text-muted">뱃지는 믿고멍냥의 자체 선별·확인 기준입니다. 안전을 단정하는 표시가 아닙니다.</p>
          <div className="mt-6">
            <BadgeExplorer />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[82rem] px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(1.5rem,4vw,4rem)]">
        <h2 className="max-w-3xl text-[clamp(1rem,2.6vw,2.25rem)] font-extrabold leading-snug">아이에게 먹이는 것이니까, 판매하는 것보다 선별하는 것을 먼저 생각합니다.</h2>
        <p className="mt-4 max-w-2xl text-[clamp(0.75rem,1.5vw,1rem)] leading-7 text-muted">
          우리가 정한 기준을 충족하지 못하거나 보호자가 확인하기 어려운 정보가 있는 제품은 큐레이션 대상에서 제외할 수 있습니다. 상품 정보와 기준을 최대한 투명하게 공개하겠습니다.
        </p>
      </section>

      <section className="px-[clamp(0.75rem,2vw,1.5rem)] pb-[clamp(1.75rem,4vw,4rem)]">
        <div className="mx-auto max-w-[82rem] rounded-[clamp(1rem,3vw,2rem)] bg-yellow px-[clamp(1rem,2.4vw,2.5rem)] py-[clamp(1.25rem,3vw,3rem)] text-ink">
          <h2 className="text-[clamp(1rem,2.6vw,2.25rem)] font-extrabold">선별한 사료와 간식을 둘러보세요.</h2>
          <Link
            href="/products"
            className="mt-[clamp(0.75rem,2vw,2rem)] inline-flex rounded-full bg-white px-[clamp(0.9rem,1.8vw,1.75rem)] py-[clamp(0.55rem,1.2vw,0.9rem)] text-[clamp(0.75rem,1.6vw,1.125rem)] font-extrabold text-ink"
          >
            큐레이션 사료 / 간식 보러가기
          </Link>
        </div>
      </section>
    </div>
  );
}
