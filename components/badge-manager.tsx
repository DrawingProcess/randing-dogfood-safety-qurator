"use client";

import { useActionState } from "react";
import { addBadge, deleteBadge } from "@/lib/actions";
import { badgeCatalog, badgeOrder } from "@/lib/badges";
import type { ProductBadge } from "@/lib/types";

export function BadgeManager({ productId, badges }: { productId: string; badges: ProductBadge[] }) {
  const [state, action, pending] = useActionState(addBadge, null);
  return (
    <section className="mt-8 rounded-3xl border border-line bg-card p-5">
      <h2 className="text-lg font-bold">안심 마크</h2>
      <ul className="mt-3 space-y-2">
        {badges.length === 0 ? <li className="text-sm text-muted">아직 없습니다.</li> : null}
        {badges.map((badge) => (
          <li key={badge.id} className="flex items-start justify-between gap-3 rounded-2xl bg-background px-3 py-2">
            <div>
              <p className="font-semibold">{badge.badge_label}</p>
              <p className="text-sm text-muted">{badge.description}</p>
            </div>
            <form action={deleteBadge}>
              <input type="hidden" name="id" value={badge.id} />
              <input type="hidden" name="product_id" value={productId} />
              <button className="text-sm text-red-700">삭제</button>
            </form>
          </li>
        ))}
      </ul>
      <form action={action} className="mt-4 grid gap-3">
        <input type="hidden" name="product_id" value={productId} />
        <select name="badge_type" className="rounded-2xl border border-line bg-white px-4 py-3">
          {badgeOrder.map((type) => (
            <option key={type} value={type}>{badgeCatalog[type].label}</option>
          ))}
        </select>
        <textarea name="description" placeholder="설명을 바꾸지 않으면 기본 문구를 사용합니다" className="min-h-20 rounded-2xl border border-line px-4 py-3" />
        {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        {state?.ok ? <p className="text-sm text-forest">추가했습니다.</p> : null}
        <button disabled={pending} className="w-fit rounded-full bg-yellow px-4 py-2 font-semibold disabled:opacity-50">뱃지 추가</button>
      </form>
    </section>
  );
}
