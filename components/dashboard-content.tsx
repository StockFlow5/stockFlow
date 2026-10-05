"use client";

import { NETWORK } from "@/lib/network";

import Link from "next/link";
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
import { RecentActivity } from "./recent-activity";
import { useSimulation } from "./simulation-context";
import { TestnetPanel } from "./tx-panel";
import { useOnchain } from "@/lib/onchain";

function HealthBadge({ collateral, debt }: { collateral: number; debt: number }) {
  const health = debt > 0 ? (collateral / debt) * 100 : 0;
  let colorClass = "text-emerald-400";
  let label = "Safe";
  if (debt <= 0) {
    label = "No debt";
  } else if (health < 120) {
    colorClass = "text-rose-400";
    label = "At risk";
  } else if (health < 150) {
    colorClass = "text-amber-400";
    label = "Caution";
  }
  const value = debt > 0 ? `${health.toFixed(0)}%` : "—";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted">
      <Shield className={`h-3.5 w-3.5 ${colorClass}`} />
      Health: {label} <span className={colorClass}>({value})</span>
    </span>
  );
}

export function DashboardContent() {
  const { isConnected } = useAccount();
  const sim = useSimulation();
  const onchain = useOnchain();
  const { live } = onchain;
  const { activities, psmMint, borrow, stake } = sim;
  const susdBalance = live ? onchain.balances.susd : sim.susdBalance;
  const usdcBalance = live ? onchain.balances.usdc : sim.usdcBalance;
  const collateral = live ? onchain.balances.collateralValue : sim.collateral;
  const debt = live ? onchain.balances.debt : sim.debt;
  const ssusdStaked = live ? onchain.balances.ssusd : sim.ssusdStaked;
  const totalPosition = live
    ? susdBalance + collateral + ssusdStaked
    : sim.totalPosition;

  const balances: Record<Tab, number> = {
    mint: usdcBalance,
    borrow: live ? onchain.balances.stocks.AAPLx : Math.max(0, 10000 - debt),
    stake: susdBalance,
  };

  const handleExecute = async (tab: Tab, amount: string) => {
    const hash =
      tab === "mint"
        ? await onchain.run({ kind: "psmMint", amount })
        : tab === "stake"
        ? await onchain.run({ kind: "stake", amount })
        : await onchain.run({
            kind: "borrow",
            stock: "AAPLx",
            collateral: amount,
            amount: (parseFloat(amount) * 220 * 0.7 * 0.995).toFixed(6),
          });
    return hash !== null;
  };

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

  const handleSimulate = (tab: Tab, amount: string) => {
    const n = parseFloat(amount);
    if (Number.isNaN(n) || n <= 0) return;
    if (tab === "mint") psmMint(n);
    if (tab === "borrow") borrow(n, n / 0.66);
    if (tab === "stake") stake(n);
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
              Connect on {NETWORK.name} for live on-chain balances, or simulate below without one.
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
              <HealthBadge collateral={collateral} debt={debt} />
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
        <DappInterface
          balances={balances}
          onSimulate={handleSimulate}
          live={live}
          tx={onchain.tx}
          onExecute={handleExecute}
          onReset={onchain.resetTx}
        />

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
            <Link
              href="/app/stats/"
              className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl border border-border/60 bg-background/60 py-2 text-xs font-semibold text-muted transition hover:bg-background"
            >
              View all markets
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <TestnetPanel onchain={onchain} />
          <RecentActivity activities={activities} />
        </aside>
      </div>
    </div>
  );
}
