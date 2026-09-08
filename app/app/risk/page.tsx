import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { AppPlaceholder } from "@/components/app-placeholder";


export const metadata: Metadata = {
  title: "StockFlow App | Risk",
  description:
    "Protocol risk parameters, collateral factors, and liquidation mechanics.",
};

export default function RiskPage() {
  return (
    <AppLayout
      title="Risk"
      subtitle="Collateral factors, liquidation thresholds, and protocol guardrails."
      kicker="Protocol"
      requiresWallet={false}
    >
      <AppPlaceholder
        icon="Shield"
        heading="Protocol risk overview"
        description="StockFlow maintains over-collateralization and liquidation buffers to keep sUSD backed in all market conditions."
        bullets={[
          "Minimum 150% collateral ratio for borrows",
          "Real-time Chainlink price feeds for every collateral type",
          "Keeper-run liquidations protect the peg",
        ]}
      />
    </AppLayout>
  );
}
