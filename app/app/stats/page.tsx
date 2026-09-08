import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { AppPlaceholder } from "@/components/app-placeholder";


export const metadata: Metadata = {
  title: "StockFlow App | Stats",
  description:
    "Real-time protocol statistics for TVL, sUSD supply, collateral, and vault yield.",
};

export default function StatsPage() {
  return (
    <AppLayout
      title="Stats"
      subtitle="Real-time protocol metrics and TVL."
      kicker="Protocol"
      requiresWallet={false}
    >
      <AppPlaceholder
        icon="BarChart3"
        heading="Protocol statistics"
        description="Track total value locked, sUSD supply, backing reserves, and vault APY. Data refreshes on-chain as positions open and close."
        bullets={[
          "Total sUSD supply and backing ratio",
          "Collateral breakdown by token",
          "Vault APY and protocol revenue",
        ]}
      />
    </AppLayout>
  );
}
