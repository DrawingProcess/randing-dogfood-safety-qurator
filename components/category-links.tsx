"use client";

import Link from "next/link";
import type { Category, PetType, SizeType } from "@/lib/types";
import { trackEvent } from "@/components/track";

export function CategoryLinks({
  links,
}: {
  links: Array<{ href: string; label: string; pet: PetType; category: Category; className?: string }>;
}) {
  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={link.className ?? "rounded-full bg-leaf px-3 py-2"}
          onClick={() => {
            trackEvent({
              event_name: "category_view",
              pet_type: link.pet,
              page: "/products",
              metadata: { category: link.category, pet_type: link.pet, source: "landing" },
            });
            trackEvent({ event_name: "pet_type_selected", pet_type: link.pet, metadata: { source: "landing_category" } });
          }}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export function ProductFilters({
  pet,
  category,
  size,
}: {
  pet?: PetType;
  category?: Category;
  size?: SizeType;
}) {
  const pets: Array<{ value?: PetType; label: string }> = [
    { label: "전체" },
    { value: "dog", label: "강아지" },
    { value: "cat", label: "고양이" },
  ];
  const cats: Array<{ value?: Category; label: string }> = [
    { label: "전체" },
    { value: "food", label: "사료" },
    { value: "snack", label: "간식" },
  ];
  const sizes: Array<{ value: SizeType; label: string; pets: PetType[] }> = [
    { value: "small", label: "소형견", pets: ["dog"] },
    { value: "medium", label: "중형견", pets: ["dog"] },
    { value: "large", label: "대형견", pets: ["dog"] },
    { value: "kitten", label: "키튼", pets: ["cat"] },
    { value: "adult", label: "어덜트", pets: ["cat"] },
    { value: "senior", label: "시니어", pets: ["cat"] },
  ];
  const visibleSizes = sizes.filter((item) => !pet || item.pets.includes(pet));

  function href(next: { pet?: PetType; category?: Category; size?: SizeType }) {
    const params = new URLSearchParams();
    if (next.pet) params.set("pet", next.pet);
    if (next.category) params.set("category", next.category);
    if (next.size) params.set("size", next.size);
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  }

  function track(next: { pet?: PetType; category?: Category; size?: SizeType }) {
    if (next.pet) trackEvent({ event_name: "pet_type_selected", pet_type: next.pet, page: "/products", metadata: { source: "filter" } });
    trackEvent({
      event_name: "category_view",
      pet_type: next.pet,
      page: "/products",
      metadata: {
        ...(next.category ? { category: next.category } : {}),
        ...(next.pet ? { pet_type: next.pet } : {}),
        ...(next.size ? { size: next.size } : {}),
        source: "filter",
      },
    });
  }

  return (
    <div className="space-y-4">
      <FilterRow label="반려동물">
        {pets.map((item) => (
          <FilterChip key={item.label} href={href({ pet: item.value, category, size: item.value === pet ? size : undefined })} active={pet === item.value} onClick={() => track({ pet: item.value, category })}>
            {item.label}
          </FilterChip>
        ))}
      </FilterRow>
      <FilterRow label="종류">
        {cats.map((item) => (
          <FilterChip key={item.label} href={href({ pet, category: item.value, size })} active={category === item.value} onClick={() => track({ pet, category: item.value, size })}>
            {item.label}
          </FilterChip>
        ))}
      </FilterRow>
      <FilterRow label="크기·연령">
        <FilterChip href={href({ pet, category })} active={!size} onClick={() => track({ pet, category })}>
          전체
        </FilterChip>
        {visibleSizes.map((item) => (
          <FilterChip key={item.value} href={href({ pet, category, size: item.value })} active={size === item.value} onClick={() => track({ pet, category, size: item.value })}>
            {item.label}
          </FilterChip>
        ))}
      </FilterRow>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({ href, active, onClick, children }: { href: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className={`rounded-full border px-3 py-2 text-sm ${active ? "border-[#c4a032] bg-yellow font-semibold" : "border-line bg-card"}`}>
      {children}
    </Link>
  );
}
