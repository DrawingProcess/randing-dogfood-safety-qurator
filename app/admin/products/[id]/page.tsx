import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/admin-product-form";
import { BadgeManager } from "@/components/badge-manager";
import { GateForm } from "@/components/gate-form";
import { deleteProduct } from "@/lib/actions";
import { isGateOpen } from "@/lib/auth";
import { getProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "상품 수정",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isGateOpen())) return <GateForm nextPath="/admin/products" />;
  const { id } = await params;
  const { product } = await getProduct(id, { includeInactive: true });
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/admin/products" className="text-sm text-muted">상품 관리</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">상품 수정</h1>
        <Link href={`/products/${product.id}`} className="text-sm underline">고객 화면</Link>
      </div>
      <div className="mt-6">
        <AdminProductForm product={product} />
      </div>
      <BadgeManager productId={product.id} badges={product.badges} />
      <form action={deleteProduct} className="mt-6">
        <input type="hidden" name="id" value={product.id} />
        <button className="text-sm text-red-700">이 상품 삭제</button>
      </form>
    </main>
  );
}
