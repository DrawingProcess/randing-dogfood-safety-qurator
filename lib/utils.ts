export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ko-KR").format(price)}원`;
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function asPetType(value: string | undefined | null) {
  return value === "dog" || value === "cat" ? value : undefined;
}

export function asCategory(value: string | undefined | null) {
  return value === "food" || value === "snack" ? value : undefined;
}

export function asSizeType(value: string | undefined | null) {
  const sizes = ["small", "medium", "large", "kitten", "adult", "senior", "all"] as const;
  return sizes.find((size) => size === value);
}

export function percent(part: number, whole: number) {
  if (!whole) return null;
  return part / whole;
}

export function formatPercent(value: number | null) {
  if (value === null) return "—";
  return `${Math.round(value * 100)}%`;
}
