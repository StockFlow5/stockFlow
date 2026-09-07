"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  ArrowRightLeft,
  PiggyBank,
  Landmark,
  TrendingUp,
  Info,
} from "lucide-react";

type Tab = "mint" | "stake" | "borrow";

export function DappInterface() {
  const { isConnected } = useAccount();
  const [tab, setTab] = useState<Tab>("mint");
  const [amount, setAmount] = useState("");

  const tabs: { key: Tab; label: string; icon: typeof PiggyBank }[] = [
    { key: "mint", label: "Mint sUSD", icon: Landmark },
    { key: "borrow", label: "Borrow", icon: TrendingUp },
    { key: "stake", label: "Stake", icon: PiggyBank },
  ];

  const tabInfo = {
    mint: {
      title: "Mint sUSD",
      description: "Swap reserves for sUSD 1:1 through the PSM.",
      asset: "USDC / USDG",
      action: "Mint sUSD",
      receive: "sUSD",
    },
    borrow: {
      title: "Borrow sUSD",
      description: "Deposit tokenized stocks and mint sUSD against them.",
      asset: "AAPLx / TSLAx / NVDAx",
      action: "Borrow sUSD",
      receive: "sUSD",
    },
    stake: {
      title: "Stake sUSD",
      description: "Stake sUSD into ssUSD to earn protocol revenue.",
      asset: "sUSD",
      action: "Stake",
      receive: "ssUSD",
    },
  };

  const active = tabInfo[tab];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          StockFlow App
        </h1>
        <p className="mt-2 text-muted">
          Mint, borrow, and stake with tokenized stock collateral.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <ConnectButton />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-2 sm:p-6">
        <div className="flex rounded-xl bg-background p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                tab === t.key
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 px-2 pb-2 sm:px-0 sm:pb-0">
          <div className="flex items-start gap-2 rounded-xl border border-border bg-background p-4 text-sm text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {active.description}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                {tab === "stake" ? "You stake" : "You deposit"}
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-lg font-medium text-foreground outline-none placeholder:text-muted"
                />
                <span className="rounded-lg bg-card px-3 py-1 text-sm font-medium text-foreground">
                  {active.asset}
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRightLeft className="h-5 w-5 text-muted" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                You receive
              </label>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                <span className="text-lg font-medium text-foreground">
                  {amount || "0.00"}
                </span>
                <span className="rounded-lg bg-card px-3 py-1 text-sm font-medium text-foreground">
                  {active.receive}
                </span>
              </div>
            </div>
          </div>

          <button
            disabled={!isConnected || !amount}
            className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isConnected ? active.action : "Connect wallet to continue"}
          </button>

          {!isConnected && (
            <p className="mt-3 text-center text-xs text-muted">
              Connect your wallet to enable {active.title.toLowerCase()}.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted">Collateral ratio</p>
          <p className="mt-1 text-xl font-semibold">—%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted">Stability fee</p>
          <p className="mt-1 text-xl font-semibold">—%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted">ssUSD APY</p>
          <p className="mt-1 text-xl font-semibold">—%</p>
        </div>
      </div>
    </div>
  );
}
