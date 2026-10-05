"use client";

import { NETWORK } from "@/lib/network";
import Link from "next/link";
import { Sparkles, Trophy, Coins, PiggyBank, Lock, TrendingUp, CheckCircle2, Circle } from "lucide-react";
import { useProtocolStats } from "@/lib/protocol-stats";
import { cn } from "@/lib/utils";
import { WalletButton } from "./wallet-button";
import { Bar, LiveBadge, Panel, StatCard, fmtNum, fmtUsd } from "./protocol-views";

const RULES = [
  { key: "susd", label: "Hold sUSD", rate: 1, unit: "per sUSD", icon: Coins, href: "/app/psm/" },
  { key: "debt", label: "Borrow against xStocks", rate: 3, unit: "per sUSD borrowed", icon: TrendingUp, href: "/app/borrow/" },
  { key: "ssusd", label: "Stake in vault", rate: 2, unit: "per ssUSD", icon: PiggyBank, href: "/app/vaults/" },
  { key: "sfLocked", label: "Lock $SF", rate: 5, unit: "per SF locked", icon: Lock, href: "/app/sf/" },
] as const;

const TIERS = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 1_000 },
  { name: "Gold", min: 10_000 },
  { name: "Diamond", min: 100_000 },
];

export function SeasonContent() {
  const s = useProtocolStats();
  const u = s.user;

  const lines = RULES.map((r) => {
    const amount = u[r.key];
    return { ...r, amount, points: amount * r.rate };
  });
  const total = lines.reduce((a, l) => a + l.points, 0);
  const tier = [...TIERS].reverse().find((t) => total >= t.min) ?? TIERS[0];
  const next = TIERS.find((t) => t.min > total);

  const quests = [
    { label: "Mint sUSD via PSM", done: u.susd > 0 || u.debt > 0 },
    { label: "Open a borrow position", done: u.debt > 0 },
    { label: "Stake sUSD in the vault", done: u.ssusd > 0 },
    { label: "Lock $SF for voting power", done: u.sfLocked > 0 },
  ];
  const questsDone = quests.filter((q) => q.done).length;

  const protocolPoints = s.susdSupply * 1 + s.vaultDeposits * 2 + s.sfLocked * 5;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Points are computed from live testnet positions — no snapshots, no off-chain tracking.</p>
        <LiveBadge loading={s.loading} error={s.error} onRefresh={() => s.refetch()} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={Sparkles} label="Season 1 points (you)" value={s.live ? fmtNum(total, 0) : "—"} sub={s.live ? `${tier.name} tier` : "Connect wallet"} loading={s.loading} />
        <StatCard icon={Trophy} label="Quests completed" value={s.live ? `${questsDone}/${quests.length}` : "—"} sub="Complete all four to unlock the Season 1 badge" loading={s.loading} />
        <StatCard icon={Coins} label="Protocol-wide points" value={fmtNum(protocolPoints, 0)} sub={`${fmtUsd(s.tvl)} TVL on testnet`} loading={s.loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <Panel title="Your point sources">
          {s.live ? (
            <div className="space-y-4">
              {lines.map((l) => (
                <div key={l.key} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <l.icon className="h-5 w-5 text-primary" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground">{l.label}</span>
                      <span className="font-semibold text-primary">{fmtNum(l.points, 0)} pts</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted">
                      <span>{fmtNum(l.amount)} × {l.rate} {l.unit}</span>
                      <Link href={l.href} className="hover:text-primary">Earn more →</Link>
                    </div>
                    <div className="mt-2"><Bar value={l.points} max={total || 1} /></div>
                  </div>
                </div>
              ))}
              {next && (
                <div className="border-t border-border pt-4 text-sm">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-muted">Progress to {next.name}</span>
                    <span className="text-foreground">{fmtNum(total, 0)} / {fmtNum(next.min, 0)}</span>
                  </div>
                  <Bar value={total} max={next.min} className="bg-accent" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-sm text-muted">
              <p>Connect on {NETWORK.name} to see your points, tier and quests.</p>
              <WalletButton />
            </div>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Quests">
            <ul className="space-y-3">
              {quests.map((q) => (
                <li key={q.label} className="flex items-center gap-3 text-sm">
                  {q.done ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 flex-shrink-0 text-muted" />
                  )}
                  <span className={cn(q.done ? "text-foreground" : "text-muted")}>{q.label}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Point rules">
            <ul className="space-y-2 text-sm">
              {RULES.map((r) => (
                <li key={r.key} className="flex items-center justify-between">
                  <span className="text-muted">{r.label}</span>
                  <span className="font-semibold text-foreground">{r.rate}× {r.unit.replace("per ", "/ ")}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">
              Tiers: {TIERS.map((t) => `${t.name} ≥ ${fmtNum(t.min, 0)}`).join(" · ")}. Season 1 runs on testnet; a future $SF allocation will consider these positions.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
