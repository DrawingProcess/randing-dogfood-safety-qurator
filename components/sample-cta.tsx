"use client";

import Link from "next/link";
import type { PetType } from "@/lib/types";
import { trackEvent } from "@/components/track";

export function SampleCtaLink({
  source,
  productId,
  petType,
  className,
  children,
}: {
  source: string;
  productId?: string;
  petType?: PetType;
  className?: string;
  children: React.ReactNode;
}) {
  const href = productId ? `/sample?product=${productId}` : "/sample";
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackEvent({
          event_name: "sample_cta_clicked",
          product_id: productId,
          pet_type: petType,
          metadata: { source },
        })
      }
    >
      {children}
    </Link>
  );
}
