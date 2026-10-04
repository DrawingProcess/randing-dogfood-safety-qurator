import type { Category, PetType, SizeType } from "@/lib/types";

export const petLabels: Record<PetType, string> = {
  dog: "강아지",
  cat: "고양이",
};

export const categoryLabels: Record<Category, string> = {
  food: "사료",
  snack: "간식",
};

export const sizeLabels: Record<SizeType, string> = {
  small: "소형견",
  medium: "중형견",
  large: "대형견",
  kitten: "키튼",
  adult: "어덜트",
  senior: "시니어",
  all: "전체",
};

export const dogSizes: SizeType[] = ["small", "medium", "large", "all"];
export const catSizes: SizeType[] = ["kitten", "adult", "senior", "all"];

export function sizeOptions(pet?: PetType) {
  if (pet === "dog") return dogSizes;
  if (pet === "cat") return catSizes;
  return [...dogSizes, ...catSizes.filter((size) => size !== "all")];
}

export function filterSizeForPet(pet?: PetType, size?: SizeType) {
  if (!pet || !size || size === "all") return undefined;
  return sizeOptions(pet).includes(size) ? size : undefined;
}
