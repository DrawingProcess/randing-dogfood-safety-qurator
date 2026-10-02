import type { Metadata } from "next";
import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { GateForm } from "@/components/gate-form";
import { isGateOpen } from "@/lib/auth";
import { loadDashboard } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "분석",
  robots: { index: false, follow: false },
};

export default async function AnalysisPage() {
  if (!(await isGateOpen())) return <GateForm nextPath="/analysis" />;
  const data = await loadDashboard();
  return <AnalysisDashboard data={data} />;
}
