"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { categoryLabels, petLabels, sizeLabels } from "@/lib/labels";
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
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-xs text-muted">
          {petLabels[product.pet_type]} · {categoryLabels[product.category]} · {sizeLabels[product.size_type]}
        </p>
        <h3 className="text-lg font-bold leading-6">{product.name}</h3>
        <p className="text-sm leading-6 text-muted">{product.description}</p>
        <ul className="flex flex-wrap gap-1.5">
          {product.badges.slice(0, 4).map((badge) => (
            <li key={badge.id} className="rounded-full bg-leaf px-2.5 py-1 text-xs font-medium text-forest">
              {badge.badge_label}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <p className="font-semibold">{formatPrice(product.price)}</p>
          <Link
            href={`/products/${product.id}`}
            className="rounded-full bg-yellow px-3 py-2 text-sm font-semibold"
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
