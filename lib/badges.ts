import type { BadgeType } from "@/lib/types";

export const badgeCatalog: Record<
  BadgeType,
  { label: string; emoji: string; description: string }
> = {
  ingredient_checked: {
    label: "성분 확인",
    emoji: "🟡",
    description:
      "주요 원재료와 성분 표시를 자체 기준에 따라 확인한 표시입니다. 안전을 단정하는 표시는 아닙니다.",
  },
  manufacturing_checked: {
    label: "제조정보 확인",
    emoji: "🏭",
    description:
      "제조국, 제조사, 제조 방식처럼 보호자가 비교하기 어려운 제조 정보를 정리했다는 표시입니다.",
  },
  korea_made: {
    label: "국내 제조",
    emoji: "🇰🇷",
    description: "제조국이 대한민국으로 표시된 상품에 붙입니다.",
  },
  single_protein: {
    label: "단일 단백질",
    emoji: "🥩",
    description: "동물성 주원료 단백질이 한 가지로 표시된 상품에 붙입니다.",
  },
  handmade: {
    label: "수제간식",
    emoji: "🍪",
    description: "수제 방식으로 만들었다고 확인한 간식에 붙입니다.",
  },
};

export const badgeOrder = Object.keys(badgeCatalog) as BadgeType[];

export function badgeEmoji(type: string) {
  return type in badgeCatalog ? badgeCatalog[type as BadgeType].emoji : "";
}

export function badgeChipClass(type: string) {
  if (type === "manufacturing_checked") return "bg-[#c4a032] text-ink";
  if (type === "ingredient_checked") return "bg-yellow text-ink";
  return "bg-[#fff3c4] text-ink";
}
