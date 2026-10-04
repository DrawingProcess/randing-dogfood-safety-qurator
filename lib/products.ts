import catalog from "@/data/catalog.json";
import type { Product, ProductFilter } from "@/lib/types";
import { createAnonServerClient, createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { purgeSeedProducts, withoutSeedProducts } from "@/lib/seed-products";

type CatalogFile = { products: Product[] };

const seedProducts = (catalog as CatalogFile).products;

function matches(product: Product, filter: ProductFilter) {
  if (!filter.includeInactive && product.status !== "active") return false;
  if (filter.pet && product.pet_type !== filter.pet) return false;
  if (filter.category && product.category !== filter.category) return false;
  if (filter.size && product.size_type !== filter.size && product.size_type !== "all") return false;
  return true;
}

function fromSeed(filter: ProductFilter = {}) {
  return seedProducts.filter((product) => matches(product, filter));
}

function normalize(row: Product & { product_badges?: Product["badges"]; product_images?: Product["images"] }): Product {
  const images = [...(row.product_images ?? row.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  return {
    ...row,
    price: Number(row.price),
    is_handmade: Boolean(row.is_handmade),
    manufacturing_method: row.manufacturing_method ?? "",
    badges: row.product_badges ?? row.badges ?? [],
    images,
    image_url: row.image_url || images[0]?.image_url || "",
  };
}

export async function listProducts(filter: ProductFilter = {}): Promise<{
  products: Product[];
  source: "supabase" | "seed";
  error?: string;
}> {
  await purgeSeedProducts();

  if (!isSupabaseConfigured()) {
    return { products: fromSeed(filter), source: "seed" };
  }

  const client = filter.includeInactive ? createServiceClient() : await createAnonServerClient();
  if (!client) {
    return {
      products: fromSeed(filter),
      source: "seed",
      error: "비공개 상품을 보려면 Supabase service role 키가 필요합니다.",
    };
  }

  let query = client.from("products").select("*, product_badges(*), product_images(*)").order("created_at");
  if (!filter.includeInactive) query = query.eq("status", "active");
  if (filter.pet) query = query.eq("pet_type", filter.pet);
  if (filter.category) query = query.eq("category", filter.category);
  if (filter.size) query = query.or(`size_type.eq.${filter.size},size_type.eq.all`);

  const { data, error } = await query;
  if (error) {
    return { products: fromSeed(filter), source: "seed", error: error.message };
  }
  return {
    products: withoutSeedProducts(((data ?? []) as Product[]).map((row) => normalize(row))),
    source: "supabase",
  };
}

export async function getProduct(id: string, options?: { includeInactive?: boolean }) {
  const result = await listProducts({ includeInactive: options?.includeInactive });
  return {
    product: result.products.find((item) => item.id === id) ?? null,
    source: result.source,
    error: result.error,
  };
}

export function previewGroups(products: Product[]) {
  const groups = [
    { title: "강아지 사료", pet: "dog" as const, category: "food" as const, limit: 2 },
    { title: "강아지 간식", pet: "dog" as const, category: "snack" as const, limit: 2 },
    { title: "고양이 사료", pet: "cat" as const, category: "food" as const, limit: 2 },
    { title: "고양이 간식", pet: "cat" as const, category: "snack" as const, limit: 2 },
  ];
  return groups.map((group) => ({
    ...group,
    products: products
      .filter((product) => product.pet_type === group.pet && product.category === group.category)
      .slice(0, group.limit),
  }));
}
