"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { categoryLabels, petLabels, sizeLabels } from "@/lib/labels";
import { badgeChipClass, badgeEmoji } from "@/lib/badges";
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/components/track";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-[0_10px_30px_rgba(80,60,20,0.05)]">
      <Link
        href={`/products/${product.id}`}
        className="block bg-[#fff4d2]"
        onClick={() =>
          trackEvent({
            event_name: "product_card_clicked",
            product_id: product.id,
            pet_type: product.pet_type,
            metadata: { category: product.category, name: product.name },
          })
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image_url} alt={product.images[0]?.alt_text || product.name} className="aspect-square w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-[clamp(0.35rem,1vw,0.75rem)] p-[clamp(0.55rem,1.2vw,1rem)]">
        <p className="text-[clamp(0.6rem,1.1vw,0.75rem)] text-muted">
          {petLabels[product.pet_type]} · {categoryLabels[product.category]} · {sizeLabels[product.size_type]}
        </p>
        <h3 className="text-[clamp(0.7rem,1.5vw,1.125rem)] font-bold leading-snug">{product.name}</h3>
        <p className="hidden text-sm leading-6 text-muted md:block">{product.description}</p>
        <ul className="flex flex-wrap gap-1.5">
          {product.badges.slice(0, 4).map((badge) => (
            <li key={badge.id} className={`rounded-full px-[clamp(0.35rem,0.8vw,0.65rem)] py-[clamp(0.1rem,0.3vw,0.25rem)] text-[clamp(0.55rem,0.95vw,0.75rem)] font-medium ${badgeChipClass(badge.badge_type)}`}>
              {badgeEmoji(badge.badge_type)} {badge.badge_label}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col items-start gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p className="text-[clamp(0.7rem,1.3vw,1rem)] font-semibold">{formatPrice(product.price)}</p>
          <Link
            href={`/products/${product.id}`}
            className="rounded-full bg-leaf px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.3rem,0.7vw,0.5rem)] text-[clamp(0.6rem,1.1vw,0.875rem)] font-semibold"
            onClick={() =>
              trackEvent({
                event_name: "product_card_clicked",
                product_id: product.id,
                pet_type: product.pet_type,
                metadata: { category: product.category, source: "detail_link" },
              })
            }
          >
            상품 상세보기
          </Link>
        </div>
      </div>
    </article>
  );
}
