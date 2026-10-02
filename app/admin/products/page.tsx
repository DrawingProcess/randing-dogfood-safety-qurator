import type { Metadata } from "next";
import Link from "next/link";
import { GateForm } from "@/components/gate-form";
import { isGateOpen } from "@/lib/auth";
import { categoryLabels, petLabels } from "@/lib/labels";
import { listProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "상품 관리",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  if (!(await isGateOpen())) return <GateForm nextPath="/admin/products" />;
  const { products, source, error } = await listProducts({ includeInactive: true });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">상품 관리</h1>
        <div className="flex gap-2 text-sm">
          <Link href="/analysis" className="rounded-full border border-line bg-card px-4 py-2">분석</Link>
          <Link href="/admin/products/new" className="rounded-full bg-yellow px-4 py-2 font-semibold">상품 추가</Link>
        </div>
      </div>
      {source === "seed" ? <p className="mt-4 rounded-2xl bg-yellow px-4 py-3 text-sm">지금은 시드 상품만 보입니다. {error ?? "Supabase service role을 연결하면 추가와 수정이 저장됩니다."}</p> : null}
      <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-card">
        <table className="min-w-full text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">상품</th>
              <th className="px-4 py-3 font-medium">분류</th>
              <th className="px-4 py-3 font-medium">가격</th>
              <th className="px-4 py-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${product.id}`} className="font-semibold underline-offset-2 hover:underline">{product.name}</Link>
                  <p className="text-muted">{product.brand}</p>
                </td>
                <td className="px-4 py-3">{petLabels[product.pet_type]} · {categoryLabels[product.category]}</td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">{product.status === "active" ? "활성" : "비활성"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
