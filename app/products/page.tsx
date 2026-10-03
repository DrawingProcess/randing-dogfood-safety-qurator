import type { Metadata } from "next";
import { ProductFilters } from "@/components/category-links";
import { ProductCard } from "@/components/product-card";
import { TrackOnMount } from "@/components/track";
import { listProducts } from "@/lib/products";
import { asCategory, asPetType, asSizeType } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "선별 상품",
  description: "믿고멍냥이 성분과 제조 정보를 확인해 고른 강아지·고양이 사료와 간식입니다.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ pet?: string; category?: string; size?: string }>;
}) {
  const params = await searchParams;
  const pet = asPetType(params.pet);
  const category = asCategory(params.category);
  const size = asSizeType(params.size);
  const { products, source } = await listProducts({ pet, category, size });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <TrackOnMount
        event_name="category_view"
        page="/products"
        pet_type={pet ?? null}
        metadata={{
          ...(category ? { category } : {}),
          ...(pet ? { pet_type: pet } : {}),
          ...(size ? { size } : {}),
          source: "products_page",
        }}
      />
      <h1 className="text-xl font-bold sm:text-3xl">선별 상품</h1>
      <p className="mt-2 max-w-2xl leading-7 text-muted">결제는 아직 열리지 않았습니다. 성분과 제조 정보를 비교해 보는 탐색 화면입니다.</p>
      {source === "seed" ? <p className="mt-3 text-sm text-muted">Supabase가 연결되면 저장된 상품을 보여줍니다.</p> : null}
      <div className="mt-6">
        <ProductFilters pet={pet} category={category} size={size} />
      </div>
      {products.length === 0 ? (
        <p className="mt-10 rounded-3xl bg-card p-6 text-muted">이 조건에 맞는 선별 상품이 없습니다.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
