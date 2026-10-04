import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SampleCtaLink } from "@/components/sample-cta";
import { TrackOnMount } from "@/components/track";
import { categoryLabels, petLabels, sizeLabels } from "@/lib/labels";
import { getProduct } from "@/lib/products";
import { badgeChipClass, badgeEmoji } from "@/lib/badges";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { product } = await getProduct(id);
  if (!product) return { title: "상품을 찾을 수 없습니다" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { product } = await getProduct(id);
  if (!product || product.status !== "active") notFound();
  const images = product.images.length ? product.images : [{ id: "primary", image_url: product.image_url, alt_text: product.name, sort_order: 0, product_id: product.id, created_at: product.created_at }];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <TrackOnMount event_name="product_detail_viewed" page={`/products/${product.id}`} product_id={product.id} pet_type={product.pet_type} metadata={{ category: product.category }} />
      <Link href="/products" className="text-sm text-muted">선별 상품</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {images.map((image) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={image.id} src={image.image_url} alt={image.alt_text || product.name} className="w-full rounded-[2rem] border border-line bg-[#fff4d2] object-cover" />
          ))}
        </div>
        <div>
          <p className="text-sm text-muted">
            {petLabels[product.pet_type]} · {categoryLabels[product.category]} · {sizeLabels[product.size_type]}
          </p>
          <h1 className="mt-2 text-xl font-bold leading-tight sm:text-3xl">{product.name}</h1>
          <p className="mt-3 text-lg">{product.description}</p>
          <p className="mt-4 text-2xl font-bold">{formatPrice(product.price)}</p>
          <p className="mt-2 text-sm text-muted">정식 오픈 전이라 이 화면에서는 결제할 수 없습니다.</p>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <Info label="브랜드" value={product.brand} />
            <Info label="제조사" value={product.manufacturer} />
            <Info label="제조국" value={product.country_of_origin} />
            <Info label="제조 방식" value={product.manufacturing_method} />
            <Info label="주요 단백질" value={product.main_protein} />
            <Info label="수제 여부" value={product.is_handmade ? "수제" : "일반 제조"} />
          </dl>
          <h2 className="mt-8 text-lg font-bold">확인 뱃지</h2>
          <ul className="mt-3 space-y-3">
            {product.badges.map((badge) => (
              <li key={badge.id} className="rounded-2xl border border-line bg-card p-4">
                <p className={`inline-flex rounded-full px-2.5 py-1 text-sm font-semibold ${badgeChipClass(badge.badge_type)}`}>
                  {badgeEmoji(badge.badge_type)} {badge.badge_label}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted">{badge.description}</p>
              </li>
            ))}
          </ul>
          <h2 className="mt-8 text-lg font-bold">상품 정보</h2>
          <p className="mt-3 leading-8 text-muted">{product.detail_description}</p>
          <div className="mt-10 rounded-3xl bg-yellow/60 p-5">
            <p className="font-semibold">정식 판매 전에 의견을 듣고 있습니다.</p>
            <p className="mt-2 text-sm leading-6 text-muted">샘플은 판매 상품이 아닙니다. 관심 있는 보호자에게 먹거리를 보내며 선택 기준을 확인하는 이벤트입니다.</p>
            <SampleCtaLink source="product_detail" productId={product.id} petType={product.pet_type} className="mt-4 inline-flex rounded-full bg-white px-5 py-3 font-semibold text-ink">
              안심 먹거리 샘플 받아보기 →
            </SampleCtaLink>
          </div>
        </div>
      </div>
      <p className="mt-12 text-[11px] leading-5 text-muted">
        사료 및 간식은 실제 판매하지 않으며, 임의로 배치한 타사의 제품들입니다. 어떠한 연관성도 존재하지 않습니다.
      </p>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-3">
      <dt className="text-muted">{label}</dt>
      <dd className="mt-1 font-semibold">{value || "—"}</dd>
    </div>
  );
}
