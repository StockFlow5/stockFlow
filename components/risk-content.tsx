"use client";

import { NETWORK } from "@/lib/network";
import { Shield, Activity, Scale, AlertTriangle } from "lucide-react";
import { useProtocolStats } from "@/lib/protocol-stats";
import { cn } from "@/lib/utils";
import { WalletButton } from "./wallet-button";
import { AddressLink, Bar, LiveBadge, Panel, StatCard, fmtNum, fmtUsd } from "./protocol-views";

function healthTone(hf: number) {
  if (!isFinite(hf)) return { label: "No debt", cls: "text-primary", bar: "bg-primary" };
  if (hf >= 1.5) return { label: "Safe", cls: "text-primary", bar: "bg-primary" };
  if (hf >= 1.1) return { label: "Caution", cls: "text-accent", bar: "bg-accent" };
  return { label: "At risk", cls: "text-red-400", bar: "bg-red-400" };
}

export function RiskContent() {
  const s = useProtocolStats();
  const loading = s.loading;
  const u = s.user;
  const tone = healthTone(u.healthFactor);
  const borrowDebt = Math.max(0, s.susdSupply - s.psmReserves);
  const utilization = s.collateralValue > 0 ? (borrowDebt / s.collateralValue) * 100 : 0;
  const weightedLtv =
    s.collateralValue > 0
      ? s.stocks.reduce((a, st) => a + st.maxLTV * st.lockedValue, 0) / s.collateralValue
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Risk parameters and oracle prices read from the Borrow contract on-chain.</p>
        <LiveBadge loading={loading} error={s.error} onRefresh={() => s.refetch()} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Shield} label="Backing ratio" value={`${fmtNum(s.backingRatio, 1)}%`} sub="Reserves + collateral / sUSD supply" loading={loading} />
        <StatCard icon={Scale} label="Weighted max LTV" value={`${fmtNum(weightedLtv, 1)}%`} sub="Across collateral in use" loading={loading} />
        <StatCard icon={Activity} label="Stock collateral" value={fmtUsd(s.collateralValue)} sub={`${fmtNum(s.susdSupply)} sUSD outstanding`} loading={loading} />
        <StatCard icon={AlertTriangle} label="Liquidation buffer" value={s.stocks.length ? `${fmtNum(Math.min(...s.stocks.map((x) => x.liqThreshold - x.maxLTV)), 0)}%` : "—"} sub="Min. gap LTV → liq. threshold" loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <Panel title="Collateral parameters">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium">Oracle price</th>
                  <th className="pb-3 font-medium">Max LTV</th>
                  <th className="pb-3 font-medium">Liq. threshold</th>
                  <th className="pb-3 font-medium">Locked value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {s.stocks.map((st) => (
                  <tr key={st.symbol}>
                    <td className="py-3">
                      <div className="font-semibold text-foreground">{st.symbol}</div>
                      <AddressLink address={st.address} />
                    </td>
                    <td className="py-3 text-foreground">{fmtUsd(st.price)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16"><Bar value={st.maxLTV} max={100} /></div>
                        <span className="text-foreground">{fmtNum(st.maxLTV, 0)}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16"><Bar value={st.liqThreshold} max={100} className="bg-accent" /></div>
                        <span className="text-foreground">{fmtNum(st.liqThreshold, 0)}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-foreground">{fmtUsd(st.lockedValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Your position">
            {s.live ? (
              <div className="space-y-4 text-sm">
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-muted">Health factor</span>
                    <span className={cn("font-semibold", tone.cls)}>
                      {isFinite(u.healthFactor) ? fmtNum(u.healthFactor) : "∞"} · {tone.label}
                    </span>
                  </div>
                  <Bar value={isFinite(u.healthFactor) ? Math.min(u.healthFactor, 3) : 3} max={3} className={tone.bar} />
                </div>
                <Row label="Collateral value" value={fmtUsd(u.collateralValue)} />
                <Row label="Debt (sUSD)" value={fmtUsd(u.debt)} />
                <Row label="Utilization" value={`${fmtNum(u.collateralValue > 0 ? (u.debt / u.collateralValue) * 100 : 0, 1)}%`} />
                <p className="text-xs text-muted">Liquidation occurs when health factor drops below 1.0.</p>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-muted">
                <p>Connect on {NETWORK.name} to see your live health factor, collateral and debt.</p>
                <WalletButton />
              </div>
            )}
          </Panel>

          <Panel title="Protocol guardrails">
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />Borrows capped at per-asset max LTV enforced by the Borrow contract.</li>
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />Positions below health factor 1.0 become liquidatable.</li>
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />PSM redemptions 1:1 against USDC/USDG reserves.</li>
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />Protocol-wide debt utilization: {fmtNum(utilization, 1)}% of stock collateral.</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
