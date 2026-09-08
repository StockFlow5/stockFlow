import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { AppPlaceholder } from "@/components/app-placeholder";


export const metadata: Metadata = {
  title: "StockFlow App | $SF",
  description:
    "Protocol token, governance, and fee sharing for the StockFlow ecosystem.",
};

export default function SfPage() {
  return (
    <AppLayout
      title="$SF"
      subtitle="Protocol token and governance."
      kicker="Navigation"
      requiresWallet={false}
    >
      <AppPlaceholder
        icon="DollarSign"
        heading="Governance & fee share"
        description="$SF holders can vote on protocol parameters and earn a portion of protocol revenue distributed to stakers."
        bullets={[
          "Lock $SF to participate in governance",
          "Earn fee share from protocol revenue",
          "Veto risky collateral or parameter changes",
        ]}
      />
    </AppLayout>
  );
}
