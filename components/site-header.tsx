"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/components/track";

const links = [{ href: "/products", label: "product" }];

export function SiteHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/analysis") || pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-[#fff8ec]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-bold tracking-tight" onClick={() => trackEvent({ event_name: "navigation_clicked", metadata: { target: "home" } })}>
          믿고멍냥
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-ink hover:bg-yellow"
              onClick={() => trackEvent({ event_name: "navigation_clicked", metadata: { target: link.href } })}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
