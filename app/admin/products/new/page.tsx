import type { Metadata } from "next";
import Link from "next/link";
import { AdminProductForm } from "@/components/admin-product-form";
import { GateForm } from "@/components/gate-form";
import { isGateOpen } from "@/lib/auth";

export const metadata: Metadata = {
  title: "상품 추가",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  if (!(await isGateOpen())) return <GateForm nextPath="/admin/products/new" />;
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/admin/products" className="text-sm text-muted">상품 관리</Link>
      <h1 className="mt-2 text-3xl font-bold">상품 추가</h1>
      <div className="mt-6">
        <AdminProductForm />
      </div>
    </main>
  );
}
