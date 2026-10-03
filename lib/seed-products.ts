import { createServiceClient } from "@/lib/supabase/server";

export const SEED_PRODUCT_IDS = Array.from(
  { length: 20 },
  (_, index) => `11111111-1111-4111-8111-${String(index + 1).padStart(12, "0")}`,
);

const seedIdSet = new Set(SEED_PRODUCT_IDS);

export function isSeedProductId(id: string) {
  return seedIdSet.has(id);
}

export function withoutSeedProducts<T extends { id: string }>(products: T[]) {
  return products.filter((product) => !seedIdSet.has(product.id));
}

let purgeAttempt: Promise<void> | null = null;

export async function purgeSeedProducts() {
  if (!purgeAttempt) {
    purgeAttempt = deleteSeedRows().catch(() => {
      purgeAttempt = null;
    });
  }
  await purgeAttempt;
}

async function deleteSeedRows() {
  const client = createServiceClient();
  if (!client) return;
  const deleted = await client.from("products").delete().in("id", SEED_PRODUCT_IDS);
  if (deleted.error) throw deleted.error;
}
