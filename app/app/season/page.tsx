import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { AppPlaceholder } from "@/components/app-placeholder";


export const metadata: Metadata = {
  title: "StockFlow App | Season 1",
  description:
    "Season 1 rewards, quests, and early-user incentives for StockFlow.",
};

export default function SeasonPage() {
  return (
    <AppLayout
      title="Season 1"
      subtitle="Early-user rewards and protocol quests."
      kicker="Protocol"
      requiresWallet={false}
    >
      <AppPlaceholder
        icon="Sparkles"
        heading="Season 1 rewards"
        description="Participate in the launch season to earn points, badges, and a future $SF airdrop based on protocol usage and referrals."
        bullets={[
          "Earn points for borrowing, staking, and referrals",
          "Claim badges for hitting milestones",
          "Season 1 concludes at protocol milestone targets",
        ]}
      />
    </AppLayout>
  );
}
