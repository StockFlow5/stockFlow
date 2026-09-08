"use client";

import { useState } from "react";
import {
  ArrowRightLeft,
  PiggyBank,
  Landmark,
  TrendingUp,
  Info,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";

export type Tab = "mint" | "stake" | "borrow";

export interface DappInterfaceProps {
  balances?: Record<Tab, number>;
  onSimulate?: (tab: Tab, amount: string, receive: string) => void;
}

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

export function DappInterface({ balances, onSimulate }: DappInterfaceProps) {
  const [tab, setTab] = useState<Tab>("mint");
  const balance = balances?.[tab] ?? 0;
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success">("idle");
  const [result, setResult] = useState<{ amount: string; receive: string } | null>(
    null
  );

  const active = tabInfo[tab];

  const reset = () => {
    setStatus("idle");
    setResult(null);
    setAmount("");
  };

  const selectTab = (key: Tab) => {
    setTab(key);
    setStatus("idle");
    setResult(null);
  };

  const amountNum = parseFloat(amount) || 0;
  const canSubmit = amountNum > 0 && amountNum <= balance && status !== "pending";

  const handleAction = () => {
    if (!canSubmit) return;
    setStatus("pending");
    setResult(null);
    setTimeout(() => {
      setResult({ amount, receive: active.receive });
      onSimulate?.(tab, amount, active.receive);
      setStatus("success");
    }, 1200);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 backdrop-blur">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />

      <div className="relative border-b border-border/60 bg-background/40 p-2 sm:p-3">
        <div className="flex rounded-2xl bg-background p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => selectTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                tab === t.key
                  ? "bg-primary text-primary-foreground shadow-[0_0_16px_-4px_rgba(45,212,191,0.45)]"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/60 p-4 text-sm text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {active.description}
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                {tab === "stake" ? "You stake" : "You deposit"}
              </label>
              <button
                type="button"
                disabled={balance <= 0}
                onClick={() => {
                  if (balance > 0) setAmount(balance.toFixed(2));
                }}
                className="text-xs font-semibold text-primary transition hover:text-primary/80 disabled:opacity-50"
              >
                MAX
              </button>
            </div>
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-4 py-3 transition focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/30">
              <input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-lg font-medium text-foreground outline-none placeholder:text-muted [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="rounded-lg bg-card px-3 py-1 text-sm font-semibold text-foreground">
                {active.asset}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted">
              Balance: {balance.toFixed(2)} {active.asset}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/60">
              <ArrowRightLeft className="h-4 w-4 text-primary" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              You receive
            </label>
            <div className="mt-2 flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-3">
              <span className="text-lg font-medium text-foreground">
                {amount || "0.00"}
              </span>
              <span className="rounded-lg bg-card px-3 py-1 text-sm font-semibold text-foreground">
                {active.receive}
              </span>
            </div>
          </div>
        </div>

        <button
          disabled={!canSubmit}
          onClick={handleAction}
          className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_0_20px_-6px_rgba(45,212,191,0.35)] transition hover:bg-primary/90 hover:shadow-[0_0_28px_-4px_rgba(45,212,191,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "pending" ? "Confirming..." : active.action}
        </button>

        <p className="mt-3 text-center text-xs text-muted">
          No real transaction is executed — this is a UI simulation.
        </p>

        {status === "success" && result && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Simulated {active.title.toLowerCase()}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {tab === "stake"
                      ? "Staked"
                      : tab === "borrow"
                      ? "Borrowed"
                      : "Minted"}{" "}
                    {result.amount} {active.asset} → {result.amount}{" "}
                    {result.receive}
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="rounded-full p-2 text-primary transition hover:bg-primary/20"
                aria-label="Reset"
              >
                <RefreshCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
