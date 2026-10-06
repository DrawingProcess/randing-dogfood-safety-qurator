"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/analysis") || pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[82rem] flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-semibold text-ink">믿고멍냥</p>
          <p className="mt-1 max-w-md leading-6">강아지와 고양이를 위한 반려동물 먹거리 큐레이션 마켓. 상품 정보는 자체 확인 기준입니다.</p>
          <a
            href="https://www.instagram.com/midgo.pet/"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block underline-offset-4 hover:underline"
          >
            Instagram @midgo.pet
          </a>
        </div>
        <Link href="/products" className="underline-offset-4 hover:underline">
          선별 상품 보기
        </Link>
      </div>
    </footer>
  );
}
