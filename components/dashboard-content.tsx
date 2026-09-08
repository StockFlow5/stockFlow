"use client";

import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { WalletButton } from "./wallet-button";
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  Activity,
  Shield,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { DappInterface, type Tab } from "./dapp-interface";
import { RecentActivity, type ActivityItem } from "./recent-activity";

export function DashboardContent() {
  const { isConnected } = useAccount();
  const [susdBalance, setSusdBalance] = useState(0);
  const [collateral, setCollateral] = useState(0);
  const [ssusdStaked, setSsusdStaked] = useState(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const balances: Record<Tab, number> = {
    mint: 10000,
    borrow: 5000,
    stake: susdBalance,
  };

  const totalPosition = useMemo(
    () => susdBalance + collateral + ssusdStaked,
    [susdBalance, collateral, ssusdStaked]
  );

  const metrics = [
    {
      icon: Wallet,
      label: "Wallet sUSD",
      value: `$${susdBalance.toFixed(2)}`,
      sub: "Liquid stable balance",
    },
    {
      icon: TrendingUp,
      label: "Deposited collateral",
      value: `$${collateral.toFixed(2)}`,
      sub: "Tokenized equities",
    },
    {
      icon: PiggyBank,
      label: "ssUSD staked",
      value: `$${ssusdStaked.toFixed(2)}`,
      sub: "Earning protocol yield",
    },
  ];

  const protocolCards = [
    {
      icon: Shield,
      label: "Collateral ratio",
      value: "150%",
      sub: "Minimum for borrows",
    },
    {
      icon: Activity,
      label: "Stability fee",
      value: "3.5%",
      sub: "Borrow APR",
    },
    {
      icon: Zap,
      label: "ssUSD APY",
      value: "6.2%",
      sub: "Protocol revenue share",
    },
  ];

  const handleSimulate = (tab: Tab, amount: string, receive: string) => {
    const n = parseFloat(amount);
    if (Number.isNaN(n) || n <= 0) return;

    if (tab === "mint") {
      setSusdBalance((prev) => prev + n);
    }

    if (tab === "borrow") {
      setSusdBalance((prev) => prev + n);
      setCollateral((prev) => prev + n);
    }

    if (tab === "stake") {
      setSsusdStaked((prev) => prev + n);
      setSusdBalance((prev) => Math.max(0, prev - n));
    }

    setActivities((prev) => [
      {
        type: tab,
        amount: n.toFixed(2),
        receive,
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-8">
      {!isConnected && (
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Wallet not connected
            </p>
            <p className="text-sm text-muted">
              Connect for live balances, or simulate below without one.
            </p>
          </div>
          <WalletButton size="sm" variant="outline" />
        </div>
      )}

      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card/60 to-accent/10 p-6 backdrop-blur lg:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-[80px]" />
        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Portfolio overview
            </p>
            <p className="mt-2 text-4xl font-semibold text-foreground sm:text-5xl">
              ${totalPosition.toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-muted">Total position value</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Health: Safe
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted">
                <Activity className="h-3.5 w-3.5 text-accent" />
                Net APY ~6%
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur transition hover:border-primary/30"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <m.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="text-xs text-muted">{m.label}</p>
                </div>
                <p className="mt-2 text-xl font-semibold text-foreground">
                  {m.value}
                </p>
                <p className="text-[10px] text-muted">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <DappInterface balances={balances} onSimulate={handleSimulate} />

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
            <h3 className="text-sm font-semibold text-foreground">
              Protocol parameters
            </h3>
            <div className="mt-4 space-y-3">
              {protocolCards.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <p.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">{p.label}</p>
                      <p className="text-[10px] text-muted/70">{p.sub}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {p.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
            <h3 className="text-sm font-semibold text-foreground">
              On-chain markets
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              {[
                { pair: "sUSD / USDC", price: "$1.000", change: "+0.02%" },
                { pair: "ssUSD / sUSD", price: "1.024", change: "+0.12%" },
                { pair: "SF / ETH", price: "—", change: "—" },
              ].map((m) => (
                <div
                  key={m.pair}
                  className="flex items-center justify-between rounded-xl bg-background/40 px-3 py-2"
                >
                  <span className="text-muted">{m.pair}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-foreground">{m.price}</span>
                    <span className="text-xs text-primary">{m.change}</span>
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl border border-border/60 bg-background/60 py-2 text-xs font-semibold text-muted transition hover:bg-background">
              View all markets
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <RecentActivity activities={activities} />
        </aside>
      </div>
    </div>
  );
}
