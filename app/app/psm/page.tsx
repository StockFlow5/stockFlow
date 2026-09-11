"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { useSimulation } from "@/components/simulation-context";
import { RecentActivity } from "@/components/recent-activity";
import { WalletButton } from "@/components/wallet-button";
import { ModeNote, TestnetPanel, TxStatus } from "@/components/tx-panel";
import { useOnchain } from "@/lib/onchain";
import { RefreshCcw, ArrowRightLeft, Wallet, CheckCircle2, Info } from "lucide-react";

type Mode = "mint" | "redeem";

export default function PsmPage() {
  const sim = useSimulation();
  const onchain = useOnchain();
  const { live } = onchain;
  const usdcBalance = live ? onchain.balances.usdc : sim.usdcBalance;
  const susdBalance = live ? onchain.balances.susd : sim.susdBalance;
  const { activities, psmMint, psmRedeem } = sim;
  const [mode, setMode] = useState<Mode>("mint");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success">("idle");

  const balance = mode === "mint" ? usdcBalance : susdBalance;
  const paySymbol = mode === "mint" ? "USDC" : "sUSD";
  const receiveSymbol = mode === "mint" ? "sUSD" : "USDC";
  const n = parseFloat(amount) || 0;
  const canSubmit = n > 0 && n <= balance && status !== "pending";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStatus("pending");
    if (live) {
      const hash = await onchain.run(
        mode === "mint"
          ? { kind: "psmMint", amount }
          : { kind: "psmRedeem", amount }
      );
      setStatus(hash ? "success" : "idle");
      return;
    }
    setTimeout(() => {
      if (mode === "mint") psmMint(n);
      else psmRedeem(n);
      setStatus("success");
    }, 1200);
  };

  const reset = () => {
    setAmount("");
    setStatus("idle");
    onchain.resetTx();
  };

  return (
    <AppLayout
      title="PSM"
      subtitle="Mint or redeem sUSD 1:1 through the Peg Stability Module."
      kicker="Navigation"
      requiresWallet={false}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: Wallet,
                label: "USDC reserves",
                value: `$${usdcBalance.toFixed(2)}`,
                sub: "PSM backing",
              },
              {
                icon: ArrowRightLeft,
                label: "sUSD supply",
                value: `$${susdBalance.toFixed(2)}`,
                sub: "Your liquid balance",
              },
              {
                icon: RefreshCcw,
                label: "Peg",
                value: "$1.000",
                sub: "Target price",
              },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur"
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

          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur sm:p-8">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
            <div className="relative space-y-6">
              <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/60 p-4 text-sm text-muted">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                The Peg Stability Module lets you mint sUSD 1:1 with USDC, or
                redeem sUSD back to USDC when reserves are available.
              </div>

              <div className="flex rounded-2xl bg-background p-1">
                {(
                  [
                    { key: "mint", label: "Mint sUSD" },
                    { key: "redeem", label: "Redeem USDC" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setMode(t.key);
                      reset();
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-2 py-3 text-sm font-semibold transition ${
                      mode === t.key
                        ? "bg-primary text-primary-foreground shadow-[0_0_16px_-4px_rgba(45,212,191,0.45)]"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    {mode === "mint" ? "Deposit" : "Redeem"}
                  </label>
                  <button
                    type="button"
                    disabled={balance <= 0}
                    onClick={() => setAmount(balance.toFixed(2))}
                    className="text-xs font-semibold text-primary transition hover:text-primary/80 disabled:opacity-50"
                  >
                    MAX
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-4 py-3 focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/30">
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
                    {paySymbol}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  Balance: {balance.toFixed(2)} {paySymbol}
                </p>
              </div>

              <div className="flex justify-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/60">
                  {mode === "mint" ? (
                    <ArrowRightLeft className="h-4 w-4 text-primary" />
                  ) : (
                    <RefreshCcw className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Receive
                </label>
                <div className="mt-2 flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                  <span className="text-lg font-medium text-foreground">
                    {amount || "0.00"}
                  </span>
                  <span className="rounded-lg bg-card px-3 py-1 text-sm font-semibold text-foreground">
                    {receiveSymbol}
                  </span>
                </div>
              </div>

              <button
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_0_20px_-6px_rgba(45,212,191,0.35)] transition hover:bg-primary/90 hover:shadow-[0_0_28px_-4px_rgba(45,212,191,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "pending"
                  ? "Confirming..."
                  : mode === "mint"
                  ? "Mint sUSD"
                  : "Redeem USDC"}
              </button>

              <ModeNote live={live} />
              {live && <TxStatus tx={onchain.tx} />}

              {status === "success" && (
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {mode === "mint" ? "PSM mint complete" : "PSM redeem complete"}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {n.toFixed(2)} {paySymbol} → {n.toFixed(2)}{" "}
                          {receiveSymbol}
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
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
            <h3 className="text-sm font-semibold text-foreground">
              PSM parameters
            </h3>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <div className="flex items-center justify-between">
                <span>Mint fee</span>
                <span className="font-semibold text-foreground">0.00%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Redeem fee</span>
                <span className="font-semibold text-foreground">0.10%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Peg</span>
                <span className="font-semibold text-foreground">1:1</span>
              </div>
            </div>
          </div>
          <WalletButton className="w-full" variant="outline" />
          <TestnetPanel onchain={onchain} />
          <RecentActivity activities={activities} />
        </aside>
      </div>
    </AppLayout>
  );
}
