import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { RiskContent } from "@/components/risk-content";

export const metadata: Metadata = {
  title: "Risk",
  description:
    "Protocol risk parameters, collateral factors, and liquidation mechanics.",
};

export default function RiskPage() {
  return (
    <AppLayout
      title="Risk"
      subtitle="Collateral factors, liquidation thresholds, and live positions."
      kicker="Protocol"
      requiresWallet={false}
    >
      <RiskContent />
    </AppLayout>
  );
}
