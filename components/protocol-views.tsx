"use client";

import Link from "next/link";
import { RefreshCcw, ExternalLink, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPLORER } from "@/lib/onchain";

export const fmtUsd = (n: number, d = 2) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}`;
export const fmtNum = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  loading,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-sm text-muted">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </span>
        {label}
      </div>
      <div className={cn("mt-3 text-2xl font-semibold text-foreground", loading && "animate-pulse text-muted")}>
        {loading ? "—" : value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-xl", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function LiveBadge({ loading, error, onRefresh }: { loading: boolean; error: boolean; onRefresh: () => void }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
          error ? "border-red-500/30 text-red-400" : "border-primary/30 text-primary"
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", error ? "bg-red-400" : "bg-primary", loading && "animate-pulse")} />
        {error ? "RPC error" : "Live · Robinhood Testnet"}
      </span>
      <button
        onClick={onRefresh}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition hover:text-foreground"
        aria-label="Refresh"
      >
        <RefreshCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
      </button>
    </div>
  );
}

export function AddressLink({ address, label }: { address: string; label?: string }) {
  return (
    <Link
      href={`${EXPLORER}/address/${address}`}
      target="_blank"
      className="inline-flex items-center gap-1 font-mono text-xs text-muted transition hover:text-primary"
    >
      {label ?? `${address.slice(0, 6)}…${address.slice(-4)}`}
      <ExternalLink className="h-3 w-3" />
    </Link>
  );
}

export function Bar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-background/80">
      <div className={cn("h-full rounded-full bg-primary transition-all", className)} style={{ width: `${pct}%` }} />
    </div>
  );
}
