import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { StatsContent } from "@/components/stats-content";

export const metadata: Metadata = {
  title: "Stats",
  description:
    "Real-time protocol statistics for TVL, sUSD supply, collateral, and vault yield.",
};

export default function StatsPage() {
  return (
    <AppLayout
      title="Stats"
      subtitle="Live protocol metrics from Robinhood Chain Testnet."
      kicker="Protocol"
      requiresWallet={false}
    >
      <StatsContent />
    </AppLayout>
  );
}
