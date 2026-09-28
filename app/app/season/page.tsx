import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { SeasonContent } from "@/components/season-content";

export const metadata: Metadata = {
  title: "Season 1",
  description:
    "Season 1 rewards, quests, and early-user incentives for StockFlow.",
};

export default function SeasonPage() {
  return (
    <AppLayout
      title="Season 1"
      subtitle="Earn points from live testnet positions."
      kicker="Protocol"
      requiresWallet={false}
    >
      <SeasonContent />
    </AppLayout>
  );
}
