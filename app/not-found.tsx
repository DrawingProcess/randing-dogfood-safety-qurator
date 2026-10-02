import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">페이지를 찾지 못했습니다</h1>
      <p className="mt-3 text-muted">주소가 바뀌었거나 비활성 상품일 수 있습니다.</p>
      <Link href="/products" className="mt-6 inline-flex rounded-full bg-yellow px-5 py-3 font-semibold">
        선별 상품 보기
      </Link>
    </main>
  );
}
