"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { useSimulation } from "@/components/simulation-context";
import { RecentActivity } from "@/components/recent-activity";
import { WalletButton } from "@/components/wallet-button";
import { ModeNote, TestnetPanel, TxStatus } from "@/components/tx-panel";
import { useOnchain } from "@/lib/onchain";
import {
  DollarSign,
  Lock,
  Unlock,
  CheckCircle2,
  RefreshCcw,
  Info,
} from "lucide-react";

export default function SfPage() {
  const sim = useSimulation();
  const onchain = useOnchain();
  const { live } = onchain;
  const sfBalance = live ? onchain.balances.sf : sim.sfBalance;
  const sfLocked = live ? onchain.balances.sfLocked : sim.sfLocked;
  const { activities, lockSF, unlockSF } = sim;
  const [mode, setMode] = useState<"lock" | "unlock">("lock");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success">("idle");

  const balance = mode === "lock" ? sfBalance : sfLocked;
  const n = parseFloat(amount) || 0;
  const canSubmit = n > 0 && n <= balance && status !== "pending";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStatus("pending");
    if (live) {
      const hash = await onchain.run(
        mode === "lock" ? { kind: "lock", amount } : { kind: "unlock", amount }
      );
      setStatus(hash ? "success" : "idle");
      return;
    }
    setTimeout(() => {
      if (mode === "lock") lockSF(n);
      else unlockSF(n);
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
      title="$SF"
      subtitle="Protocol token and governance."
      kicker="Navigation"
      requiresWallet={false}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: DollarSign,
                label: "$SF wallet",
                value: `${sfBalance.toFixed(2)} SF`,
                sub: "Available to lock",
              },
              {
                icon: Lock,
                label: "$SF locked",
                value: `${sfLocked.toFixed(2)} gSF`,
                sub: "Governance power",
              },
              {
                icon: Unlock,
                label: "Voting power",
                value: `${(sfLocked * 1.5).toFixed(2)}`,
                sub: "1 gSF = 1.5 votes",
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
                Lock $SF to receive gSF governance tokens, vote on protocol
                parameters, and earn fee share.
              </div>

              <div className="flex rounded-2xl bg-background p-1">
                {(
                  [
                    { key: "lock", label: "Lock" },
                    { key: "unlock", label: "Unlock" },
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
                    {mode === "lock" ? "Lock" : "Unlock"}
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
                    SF
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  Balance: {balance.toFixed(2)} {mode === "lock" ? "SF" : "gSF"}
                </p>
              </div>

              <button
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_0_20px_-6px_rgba(45,212,191,0.35)] transition hover:bg-primary/90 hover:shadow-[0_0_28px_-4px_rgba(45,212,191,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "pending"
                  ? "Confirming..."
                  : mode === "lock"
                  ? "Lock $SF"
                  : "Unlock $SF"}
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
                          {mode === "lock" ? "$SF locked" : "$SF unlocked"}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {n.toFixed(2)} {mode === "lock" ? "SF" : "gSF"} {"→"} {mode === "lock" ? "gSF" : "SF"}
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
              Governance
            </h3>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <div className="flex items-center justify-between">
                <span>Vote weight</span>
                <span className="font-semibold text-foreground">1.5x</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fee share</span>
                <span className="font-semibold text-foreground">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Lock period</span>
                <span className="font-semibold text-foreground">Flexible</span>
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
