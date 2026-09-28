import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { DashboardContent } from "@/components/dashboard-content";

export const metadata: Metadata = {
  title: "App",
  description:
    "Deposit tokenized equities and mint sUSD, or stake into ssUSD to earn protocol revenue.",
};

export default function AppPage() {
  return (
    <AppLayout
      title="Overview"
      subtitle="Your balances, positions, and opportunities in one place."
      kicker="Your account"
      requiresWallet={false}
    >
      <DashboardContent />
    </AppLayout>
  );
}
