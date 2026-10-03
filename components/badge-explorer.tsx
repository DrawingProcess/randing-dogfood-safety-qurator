"use client";

import { useState } from "react";
import { badgeCatalog, badgeChipClass, badgeOrder } from "@/lib/badges";

export function BadgeExplorer() {
  const [open, setOpen] = useState(badgeOrder[0]);
  const current = badgeCatalog[open];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {badgeOrder.map((type) => {
          const badge = badgeCatalog[type];
          const selected = open === type;
          return (
            <button
              key={type}
              type="button"
              aria-pressed={selected}
              onClick={() => setOpen(type)}
              className={`rounded-full border px-3 py-2 text-sm font-medium ${selected ? `border-transparent ${badgeChipClass(type)}` : "border-line bg-card"}`}
            >
              {badge.emoji} {badge.label}
            </button>
          );
        })}
      </div>
      <p className="mt-4 max-w-2xl rounded-2xl bg-card p-4 text-sm leading-6 text-muted">{current.description}</p>
    </div>
  );
}
