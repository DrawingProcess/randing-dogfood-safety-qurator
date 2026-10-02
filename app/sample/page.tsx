import type { Metadata } from "next";
import { SampleForm } from "@/components/sample-form";
import { isUuid } from "@/lib/utils";

export const metadata: Metadata = {
  title: "안심 먹거리 샘플",
  description: "정식 오픈 전, 우리 아이에 맞는 먹거리를 준비하기 위해 보호자 의견을 듣습니다.",
};

export default async function SamplePage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const params = await searchParams;
  const productId = params.product && isUuid(params.product) ? params.product : undefined;
  return <SampleForm googleFormUrl={process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ?? ""} productId={productId} />;
}
