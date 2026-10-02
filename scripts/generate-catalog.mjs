import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const badgeCopy = {
  ingredient_checked: {
    badge_label: "성분 확인",
    description:
      "주요 원재료와 성분 표시를 자체 기준에 따라 확인한 상품입니다. 안전을 단정하는 표시는 아닙니다.",
  },
  manufacturing_checked: {
    badge_label: "제조정보 확인",
    description:
      "제조국, 제조사, 제조 방식처럼 보호자가 비교하기 어려운 제조 정보를 정리한 상품입니다.",
  },
  korea_made: {
    badge_label: "국내 제조",
    description: "제조국이 대한민국으로 표시된 상품입니다.",
  },
  single_protein: {
    badge_label: "단일 단백질",
    description: "동물성 주원료 단백질이 한 가지로 표시된 상품입니다.",
  },
  handmade: {
    badge_label: "수제간식",
    description: "수제 방식으로 만들었다고 확인한 간식입니다.",
  },
};

const products = [
  product({
    n: 1,
    name: "노란병아리 소형견 닭고기 키블",
    brand: "노란병아리키친",
    pet_type: "dog",
    category: "food",
    size_type: "small",
    price: 28000,
    protein: "닭고기",
    method: "저온 건조 키블",
    summary: "작은 알갱이로 만든 닭고기 단일 단백질 키블",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein"],
  }),
  product({
    n: 2,
    name: "콩콩테이블 연어 키블",
    brand: "콩콩테이블",
    pet_type: "dog",
    category: "food",
    size_type: "medium",
    price: 34000,
    protein: "연어",
    method: "압출 후 건조",
    summary: "연어를 주원료로 표시한 중형견 키블",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made"],
  }),
  product({
    n: 3,
    name: "포슬포슬 소고기 든든 키블",
    brand: "포슬포슬공방",
    pet_type: "dog",
    category: "food",
    size_type: "large",
    price: 36000,
    protein: "소고기",
    method: "오븐 건조 키블",
    summary: "알이 큰 소고기 단일 단백질 키블",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein"],
  }),
  product({
    n: 4,
    name: "살랑살랑 오리 부드러운 키블",
    brand: "살랑살랑푸드",
    pet_type: "dog",
    category: "food",
    size_type: "all",
    price: 32000,
    protein: "오리고기",
    method: "저온 건조 키블",
    summary: "여러 체구에서 먹기 쉽게 만든 오리 키블",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made"],
  }),
  product({
    n: 5,
    name: "동글동글 양고기 퍼피 키블",
    brand: "동글동글키친",
    pet_type: "dog",
    category: "food",
    size_type: "small",
    price: 30000,
    protein: "양고기",
    method: "작은 알 압출 건조",
    summary: "퍼피 시기에 맞춰 알을 작게 만든 양고기 키블",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein"],
  }),
  product({
    n: 6,
    name: "노란병아리 칠면조 중형견 키블",
    brand: "노란병아리키친",
    pet_type: "dog",
    category: "food",
    size_type: "medium",
    price: 33000,
    protein: "칠면조",
    method: "오븐 건조 키블",
    summary: "칠면조를 주단백질로 표시한 중형견 키블",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein"],
  }),
  product({
    n: 7,
    name: "포슬포슬 수제 닭가슴살 육포",
    brand: "포슬포슬공방",
    pet_type: "dog",
    category: "snack",
    size_type: "all",
    price: 12000,
    protein: "닭가슴살",
    method: "수제 건조",
    handmade: true,
    summary: "닭가슴살만 사용해 말린 수제 육포",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein", "handmade"],
  }),
  product({
    n: 8,
    name: "콩콩테이블 오리 져키",
    brand: "콩콩테이블",
    pet_type: "dog",
    category: "snack",
    size_type: "all",
    price: 14000,
    protein: "오리고기",
    method: "슬라이스 건조",
    summary: "오리고기를 얇게 말린 져키",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein"],
  }),
  product({
    n: 9,
    name: "살랑살랑 연어 한입 트릿",
    brand: "살랑살랑푸드",
    pet_type: "dog",
    category: "snack",
    size_type: "small",
    price: 15000,
    protein: "연어",
    method: "한입 크기 건조",
    summary: "작게 자른 연어 트릿",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made"],
  }),
  product({
    n: 10,
    name: "동글동글 소고기 큐브",
    brand: "동글동글키친",
    pet_type: "dog",
    category: "snack",
    size_type: "all",
    price: 16000,
    protein: "소고기",
    method: "수제 큐브 건조",
    handmade: true,
    summary: "소고기를 네모나게 말린 수제 큐브",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein", "handmade"],
  }),
  product({
    n: 11,
    name: "노란병아리 고구마 닭고기 스틱",
    brand: "노란병아리키친",
    pet_type: "dog",
    category: "snack",
    size_type: "medium",
    price: 13000,
    protein: "닭고기",
    method: "수제 스틱 건조",
    handmade: true,
    summary: "고구마와 닭고기를 말아 말린 수제 스틱",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "handmade"],
  }),
  product({
    n: 12,
    name: "콩콩테이블 키튼 닭고기 키블",
    brand: "콩콩테이블",
    pet_type: "cat",
    category: "food",
    size_type: "kitten",
    price: 29000,
    protein: "닭고기",
    method: "작은 알 키블",
    summary: "키튼용으로 알을 작게 만든 닭고기 키블",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein"],
  }),
  product({
    n: 13,
    name: "살랑살랑 어덜트 참치 키블",
    brand: "살랑살랑푸드",
    pet_type: "cat",
    category: "food",
    size_type: "adult",
    price: 31000,
    protein: "참치",
    method: "압출 후 건조",
    summary: "참치를 주원료로 표시한 어덜트 키블",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made"],
  }),
  product({
    n: 14,
    name: "포슬포슬 시니어 연어 키블",
    brand: "포슬포슬공방",
    pet_type: "cat",
    category: "food",
    size_type: "senior",
    price: 34000,
    protein: "연어",
    method: "부드러운 키블 건조",
    summary: "시니어 고양이를 위한 연어 단일 단백질 키블",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein"],
  }),
  product({
    n: 15,
    name: "노란병아리 실내묘 닭고기 키블",
    brand: "노란병아리키친",
    pet_type: "cat",
    category: "food",
    size_type: "adult",
    price: 30000,
    protein: "닭고기",
    method: "저온 건조 키블",
    summary: "실내 생활을 염두에 둔 닭고기 키블",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein"],
  }),
  product({
    n: 16,
    name: "동글동글 오리 키튼 키블",
    brand: "동글동글키친",
    pet_type: "cat",
    category: "food",
    size_type: "kitten",
    price: 32000,
    protein: "오리고기",
    method: "작은 알 키블",
    summary: "오리고기를 주단백질로 표시한 키튼 키블",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made"],
  }),
  product({
    n: 17,
    name: "포슬포슬 수제 닭고기 캣큐브",
    brand: "포슬포슬공방",
    pet_type: "cat",
    category: "snack",
    size_type: "all",
    price: 11000,
    protein: "닭고기",
    method: "수제 큐브 건조",
    handmade: true,
    summary: "닭고기로 만든 고양이 수제 큐브",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein", "handmade"],
  }),
  product({
    n: 18,
    name: "콩콩테이블 참치 살코기 트릿",
    brand: "콩콩테이블",
    pet_type: "cat",
    category: "snack",
    size_type: "adult",
    price: 13000,
    protein: "참치",
    method: "살코기 건조",
    summary: "참치 살코기를 말린 트릿",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made"],
  }),
  product({
    n: 19,
    name: "살랑살랑 연어 필렛 트릿",
    brand: "살랑살랑푸드",
    pet_type: "cat",
    category: "snack",
    size_type: "all",
    price: 14000,
    protein: "연어",
    method: "필렛 건조",
    summary: "연어 필렛을 작게 자른 트릿",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein"],
  }),
  product({
    n: 20,
    name: "노란병아리 닭가슴살 수제 트릿",
    brand: "노란병아리키친",
    pet_type: "cat",
    category: "snack",
    size_type: "all",
    price: 12000,
    protein: "닭가슴살",
    method: "수제 건조",
    handmade: true,
    summary: "닭가슴살만 말린 고양이 수제 트릿",
    badges: ["ingredient_checked", "manufacturing_checked", "korea_made", "single_protein", "handmade"],
  }),
];

function topic(name) {
  const code = name.charCodeAt(name.length - 1);
  const hasBatchim = code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
  return `${name}${hasBatchim ? "은" : "는"}`;
}

function product(input) {
  const id = `11111111-1111-4111-8111-${String(input.n).padStart(12, "0")}`;
  const handmade = Boolean(input.handmade);
  const file = `${input.pet_type}-${input.category}-${String(input.n).padStart(2, "0")}.svg`;
  return {
    id,
    name: input.name,
    description: input.summary,
    category: input.category,
    pet_type: input.pet_type,
    size_type: input.size_type,
    price: input.price,
    brand: input.brand,
    manufacturer: `${input.brand} 제조실`,
    country_of_origin: "대한민국",
    is_handmade: handmade,
    manufacturing_method: input.method,
    main_protein: input.protein,
    image_url: `/products/${file}`,
    detail_description: `${topic(input.name)} ${input.brand} 제조실에서 ${input.method} 방식으로 만든 예시 상품입니다. 주요 단백질은 ${input.protein}이고, 제조국은 대한민국입니다. 성분 표시와 제조 정보는 자체 확인 기준에 따라 정리한 것이며, 안전을 단정하는 정보는 아닙니다.`,
    status: "active",
    created_at: "2026-03-01T00:00:00.000Z",
    updated_at: "2026-03-01T00:00:00.000Z",
    image_file: file,
    palette: input.n,
    badges: input.badges.map((type, index) => ({
      id: `22222222-2222-4222-8222-${String(input.n).padStart(6, "0")}${String(index + 1).padStart(6, "0")}`,
      product_id: id,
      badge_type: type,
      badge_label: badgeCopy[type].badge_label,
      description: badgeCopy[type].description,
      created_at: "2026-03-01T00:00:00.000Z",
    })),
    images: [
      {
        id: `33333333-3333-4333-8333-${String(input.n).padStart(12, "0")}`,
        product_id: id,
        image_url: `/products/${file}`,
        sort_order: 0,
        alt_text: `${input.name} 예시 이미지`,
        created_at: "2026-03-01T00:00:00.000Z",
      },
    ],
  };
}

function svg(item) {
  const palettes = [
    ["#FFF3C4", "#F6C945", "#8ED96A"],
    ["#FFF8EC", "#F3D77A", "#B6E89A"],
    ["#F8FFE8", "#D7EF9A", "#F2C14E"],
    ["#FFF6E8", "#F0B429", "#C8F5A4"],
  ];
  const [bg, bag, accent] = palettes[item.palette % palettes.length];
  const pet = item.pet_type === "dog" ? "강아지" : "고양이";
  const kind = item.category === "food" ? "사료" : "간식";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" role="img" aria-label="${item.name}">
  <rect width="640" height="640" rx="48" fill="${bg}"/>
  <circle cx="470" cy="150" r="46" fill="#FAE78B"/>
  <circle cx="452" cy="142" r="6" fill="#2A241B"/>
  <circle cx="486" cy="142" r="6" fill="#2A241B"/>
  <path d="M450 164c8 10 22 10 32 0" fill="none" stroke="#2A241B" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="168" cy="168" rx="28" ry="36" fill="#BCFF88" transform="rotate(-18 168 168)"/>
  <path d="M150 250h300c18 0 30 14 30 32v250c0 22-16 38-38 38H158c-22 0-38-16-38-38V282c0-18 12-32 30-32z" fill="${bag}"/>
  <path d="M150 250h300c18 0 30 14 30 32v42H120v-42c0-18 12-32 30-32z" fill="${accent}"/>
  <rect x="230" y="360" width="180" height="110" rx="24" fill="#FFFDF8"/>
  <text x="320" y="408" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#2A241B">${pet}</text>
  <text x="320" y="448" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#2A241B">${kind}</text>
</svg>
`;
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function seedSql(items) {
  const ids = items.map((item) => sqlString(item.id)).join(", ");
  const productRows = items
    .map(
      (item) =>
        `(${[
          sqlString(item.id),
          sqlString(item.name),
          sqlString(item.description),
          `'${item.category}'::product_category`,
          `'${item.pet_type}'::pet_type`,
          `'${item.size_type}'::size_type`,
          item.price,
          sqlString(item.brand),
          sqlString(item.manufacturer),
          sqlString(item.country_of_origin),
          item.is_handmade ? "true" : "false",
          sqlString(item.manufacturing_method),
          sqlString(item.main_protein),
          sqlString(item.image_url),
          sqlString(item.detail_description),
          `'${item.status}'::product_status`,
          sqlString(item.created_at),
          sqlString(item.updated_at),
        ].join(", ")})`,
    )
    .join(",\n");
  const badgeRows = items
    .flatMap((item) => item.badges)
    .map(
      (badge) =>
        `(${[
          sqlString(badge.id),
          sqlString(badge.product_id),
          sqlString(badge.badge_type),
          sqlString(badge.badge_label),
          sqlString(badge.description),
          sqlString(badge.created_at),
        ].join(", ")})`,
    )
    .join(",\n");
  const imageRows = items
    .flatMap((item) => item.images)
    .map(
      (image) =>
        `(${[
          sqlString(image.id),
          sqlString(image.product_id),
          sqlString(image.image_url),
          image.sort_order,
          sqlString(image.alt_text),
          sqlString(image.created_at),
        ].join(", ")})`,
    )
    .join(",\n");

  return `-- Generated by scripts/generate-catalog.mjs. Fictional products only.
delete from public.product_badges where product_id in (${ids});
delete from public.product_images where product_id in (${ids});
delete from public.products where id in (${ids});

insert into public.products (
  id, name, description, category, pet_type, size_type, price, brand, manufacturer,
  country_of_origin, is_handmade, manufacturing_method, main_protein, image_url,
  detail_description, status, created_at, updated_at
) values
${productRows};

insert into public.product_badges (
  id, product_id, badge_type, badge_label, description, created_at
) values
${badgeRows};

insert into public.product_images (
  id, product_id, image_url, sort_order, alt_text, created_at
) values
${imageRows};
`;
}

const root = process.cwd();
await mkdir(path.join(root, "data"), { recursive: true });
await mkdir(path.join(root, "public", "products"), { recursive: true });
await mkdir(path.join(root, "supabase"), { recursive: true });

const catalog = products.map((item) => {
  const copy = { ...item };
  delete copy.image_file;
  delete copy.palette;
  return copy;
});
await writeFile(path.join(root, "data", "catalog.json"), `${JSON.stringify({ products: catalog }, null, 2)}\n`);
await writeFile(path.join(root, "supabase", "seed.sql"), seedSql(catalog));
await Promise.all(
  products.map((item) => writeFile(path.join(root, "public", "products", item.image_file), svg(item))),
);
console.log(`wrote ${products.length} products`);
