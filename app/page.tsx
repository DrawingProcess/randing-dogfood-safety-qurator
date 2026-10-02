import { LandingPage } from "@/components/landing-page";
import { TrackOnMount } from "@/components/track";
import { listProducts, previewGroups } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { products } = await listProducts();
  return (
    <>
      <TrackOnMount event_name="page_view" page="/" />
      <LandingPage groups={previewGroups(products)} />
    </>
  );
}
