"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { useSimulation } from "@/components/simulation-context";
import { RecentActivity } from "@/components/recent-activity";
import { WalletButton } from "@/components/wallet-button";
import { ModeNote, TestnetPanel, TxStatus } from "@/components/tx-panel";
import { useOnchain } from "@/lib/onchain";
import { Lock, TrendingUp, PiggyBank, ArrowRightLeft, CheckCircle2, RefreshCcw, Info } from "lucide-react";

export default function VaultsPage() {
  const sim = useSimulation();
  const onchain = useOnchain();
  const { live } = onchain;
  const susdBalance = live ? onchain.balances.susd : sim.susdBalance;
  const ssusdStaked = live ? onchain.balances.ssusd : sim.ssusdStaked;
  const { activities, vault } = sim;
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success">("idle");

  const n = parseFloat(amount) || 0;
  const canSubmit = n > 0 && n <= susdBalance && status !== "pending";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStatus("pending");
    if (live) {
      const hash = await onchain.run({ kind: "stake", amount });
      setStatus(hash ? "success" : "idle");
      return;
    }
    setTimeout(() => {
      vault(n);
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
      title="Vaults"
      subtitle="Stake ssUSD and earn protocol revenue."
      kicker="Navigation"
      requiresWallet={false}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: PiggyBank,
                label: "ssUSD staked",
                value: `$${ssusdStaked.toFixed(2)}`,
                sub: "Your staked balance",
              },
              {
                icon: TrendingUp,
                label: "Vault APY",
                value: "8.2%",
                sub: "Protocol revenue share",
              },
              {
                icon: Lock,
                label: "Total locked",
                value: `$${(ssusdStaked * 1.2).toFixed(2)}`,
                sub: "Across all vaults",
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
                Deposit sUSD into the ssUSD vault and receive vault shares that
                accrue protocol revenue.
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Deposit
                  </label>
                  <button
                    type="button"
                    disabled={susdBalance <= 0}
                    onClick={() => setAmount(susdBalance.toFixed(2))}
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
                    sUSD
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  Balance: {susdBalance.toFixed(2)} sUSD
                </p>
              </div>

              <div className="flex justify-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/60">
                  <ArrowRightLeft className="h-4 w-4 text-primary" />
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
                    ssUSD vault share
                  </span>
                </div>
              </div>

              <button
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_0_20px_-6px_rgba(45,212,191,0.35)] transition hover:bg-primary/90 hover:shadow-[0_0_28px_-4px_rgba(45,212,191,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "pending" ? "Confirming..." : "Deposit to vault"}
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
                          Vault deposit simulated
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          Deposited {parseFloat(amount).toFixed(2)} sUSD →{" "}
                          {parseFloat(amount).toFixed(2)} ssUSD vault share
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
              Vault strategy
            </h3>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <div className="flex items-center justify-between">
                <span>Vault APY</span>
                <span className="font-semibold text-foreground">8.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Lock period</span>
                <span className="font-semibold text-foreground">None</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Withdraw fee</span>
                <span className="font-semibold text-foreground">0.1%</span>
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
