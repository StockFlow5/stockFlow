import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { AppPlaceholder } from "@/components/app-placeholder";


export const metadata: Metadata = {
  title: "StockFlow App | Borrow sUSD",
  description:
    "Deposit tokenized equities as collateral and mint sUSD against your stock portfolio.",
};

export default function BorrowPage() {
  return (
    <AppLayout
      title="Borrow sUSD"
      subtitle="Use your tokenized stocks as collateral."
      kicker="Navigation"
      requiresWallet={false}
    >
      <AppPlaceholder
        icon="TrendingUp"
        heading="Open a borrowing position"
        description="Choose a stock token to deposit, set your collateral ratio, and mint sUSD. Your position is monitored on-chain for liquidation safety."
        bullets={[
          "Deposit AAPL, NVDA, TSLA, or other approved xStocks",
          "Mint sUSD up to the protocol collateral factor",
          "Repay anytime to unlock your collateral",
        ]}
      />
    </AppLayout>
  );
}
