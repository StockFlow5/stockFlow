import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { AppPlaceholder } from "@/components/app-placeholder";


export const metadata: Metadata = {
  title: "StockFlow App | Vaults",
  description:
    "Stake into ssUSD vaults to earn protocol revenue from stability fees and reserve yield.",
};

export default function VaultsPage() {
  return (
    <AppLayout
      title="Vaults"
      subtitle="Stake ssUSD and earn protocol revenue."
      kicker="Navigation"
      requiresWallet={false}
    >
      <AppPlaceholder
        icon="Lock"
        heading="Stake into ssUSD vaults"
        description="Deposit ssUSD to receive a share of protocol revenue. Rewards accrue through a rebasing share price and can be redeemed at any time."
        bullets={[
          "Deposit ssUSD into the protocol vault",
          "Earn a share of stability fees and reserve yield",
          "Withdraw instantly to your wallet",
        ]}
      />
    </AppLayout>
  );
}
