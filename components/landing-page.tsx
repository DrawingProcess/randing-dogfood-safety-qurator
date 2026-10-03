import Link from "next/link";
import { BadgeExplorer } from "@/components/badge-explorer";
import { CategoryLinks } from "@/components/category-links";
import { ChickPea } from "@/components/characters";
import { ProductCard } from "@/components/product-card";
import { SampleCtaLink } from "@/components/sample-cta";
import { categoryLabels, petLabels } from "@/lib/labels";
import type { Product } from "@/lib/types";

const problems = [
  "이 사료 성분 괜찮은 거 맞아?",
  "이 간식 논란 있었던 제품 아닌가?",
  "수제간식이라고 하는데 어디서 만든 거지?",
  "성분표를 봐도 뭐가 뭔지 모르겠는데...",
];

const solutions = [
  { title: "성분 정보 확인", body: "주요 원재료와 성분 정보를 확인합니다." },
  { title: "관련 이력 확인", body: "제품 선택에 참고할 수 있는 논란 및 관련 정보를 확인합니다." },
  { title: "제조 정보 확인", body: "제조국, 제조 방식 등의 정보를 명확하게 보여드립니다." },
  { title: "안심 마크", body: "복잡한 제품 정보를 직관적인 뱃지로 보여드립니다." },
];

const usual = ["수많은 상품", "직접 검색", "성분 비교", "후기 검색", "논란 검색", "상품 선택"];
const ours = ["선별", "큐레이션", "비교하기 쉬운 정보", "구매"];

export function LandingPage({ groups }: { groups: Array<{ title: string; pet: "dog" | "cat"; category: "food" | "snack"; products: Product[] }> }) {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-leaf px-3 py-1 text-sm font-medium text-forest">강아지와 고양이를 위한 반려동물 먹거리 큐레이션 마켓</p>
          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">우리 아이가 먹는 건데, 아무거나 고르지 마세요.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">성분부터 제조 정보까지 꼼꼼하게 살펴보고 선별한 사료와 간식만 모았습니다.</p>
          <Link href="/products" className="mt-8 inline-flex rounded-full bg-yellow px-5 py-3 font-semibold">
            선별 상품 보기
          </Link>
        </div>
        <div className="rounded-[2rem] border border-line bg-card p-6">
          <ChickPea className="mx-auto h-52 w-full max-w-sm" />
          <p className="text-center text-sm text-muted">작은 병아리와 완두콩처럼, 먹거리는 작게 살펴보고 고릅니다.</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="max-w-2xl text-3xl font-bold leading-snug">사료 하나 고르려고 검색을 몇 번이나 해보셨나요?</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {problems.map((quote) => (
              <blockquote key={quote} className="rounded-3xl border border-line bg-background p-5 text-lg leading-8">
                “{quote}”
              </blockquote>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-lg leading-8">
            수많은 제품 중에서 <strong>우리 아이에게 괜찮은 제품을 직접 찾아야 하는 것.</strong> 반려동물 먹거리를 고르는 일이 생각보다 쉽지 않습니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">그래서, 우리가 먼저 골라놓았습니다.</h2>
        <p className="mt-4 max-w-2xl leading-8 text-muted">모든 사료와 간식을 판매하는 대신 우리가 정한 기준에 따라 확인하고 선별한 제품만 판매합니다.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((item) => (
            <article key={item.title} className="rounded-3xl border border-line bg-card p-5">
              <div className="mb-4 h-2 w-10 rounded-full bg-leaf" />
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="max-w-3xl text-3xl font-bold leading-snug">상품을 많이 파는 마켓이 아니라, 고를 필요가 적은 마켓</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-line p-6">
              <h3 className="text-lg font-bold">일반 쇼핑몰</h3>
              <ol className="mt-4 space-y-3">
                {usual.map((step, index) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4efe4] text-sm">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </article>
            <article className="rounded-3xl border border-forest/20 bg-leaf/40 p-6">
              <h3 className="text-lg font-bold">믿고멍냥</h3>
              <ol className="mt-4 space-y-3">
                {ours.map((step, index) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow text-sm font-semibold">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </article>
          </div>
          <p className="mt-8 text-xl font-semibold">“뭘 살지”보다 “뭘 먹일지”에 집중할 수 있도록.</p>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold">골라 둔 먹거리</h2>
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
          {groups
            .filter((group) => group.products.length > 0)
            .map((group) => (
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
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold">어려운 성분표 대신, 한눈에 확인하세요.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted">뱃지는 믿고멍냥의 자체 선별·확인 기준입니다. 안전을 단정하는 표시가 아닙니다.</p>
          <div className="mt-6">
            <BadgeExplorer />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="max-w-3xl text-3xl font-bold leading-snug">우리 아이에게 먹이는 것이니까, 판매하는 것보다 선별하는 것을 먼저 생각합니다.</h2>
        <p className="mt-5 max-w-2xl leading-8 text-muted">
          우리가 정한 기준을 충족하지 못하거나 보호자가 확인하기 어려운 정보가 있는 제품은 큐레이션 대상에서 제외할 수 있습니다. 상품 정보와 기준을 최대한 투명하게 공개하겠습니다.
        </p>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-forest px-6 py-12 text-white sm:px-10">
          <h2 className="text-3xl font-bold">먼저 경험해보세요.</h2>
          <p className="mt-4 max-w-2xl leading-8 text-white/85">
            아직 정식 서비스를 준비하고 있습니다. 서비스가 정식으로 시작되기 전 안심 먹거리에 관심 있는 보호자분들을 대상으로 <strong className="text-white">무료 샘플을 보내드리는 이벤트를 진행합니다.</strong> 어떤 먹거리를 선별하면 좋을지 보호자님의 의견도 함께 듣고 있습니다.
          </p>
          <SampleCtaLink source="landing" className="mt-8 inline-flex rounded-full bg-yellow px-5 py-3 font-semibold text-ink">
            안심 먹거리 샘플 받아보기 →
          </SampleCtaLink>
        </div>
      </section>
    </div>
  );
}
