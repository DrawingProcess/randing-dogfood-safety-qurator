"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/components/track";
import { ChickPea } from "@/components/characters";

const links = [
  { href: "/products?pet=dog", label: "강아지", pet: "dog" as const },
  { href: "/products?pet=cat", label: "고양이", pet: "cat" as const },
  { href: "/products", label: "상품", pet: null },
];

export function SiteHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/analysis") || pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-[#fff8ec]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight" onClick={() => trackEvent({ event_name: "navigation_clicked", metadata: { target: "home" } })}>
          <ChickPea className="h-9 w-11" />
          <span>믿고멍냥</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-ink hover:bg-yellow"
              onClick={() => {
                trackEvent({ event_name: "navigation_clicked", metadata: { target: link.href } });
                if (link.pet) {
                  trackEvent({ event_name: "pet_type_selected", pet_type: link.pet, metadata: { source: "header" } });
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
