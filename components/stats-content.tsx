"use client";

import { NETWORK } from "@/lib/network";
import { Landmark, Coins, PiggyBank, Lock, Layers, Percent } from "lucide-react";
import { useProtocolStats } from "@/lib/protocol-stats";
import { ADDRESSES } from "@/lib/contracts";
import { AddressLink, Bar, LiveBadge, Panel, StatCard, fmtNum, fmtUsd } from "./protocol-views";

export function StatsContent() {
  const s = useProtocolStats();
  const loading = s.loading;

  const cards = [
    { icon: Landmark, label: "Total value locked", value: fmtUsd(s.tvl), sub: "PSM reserves + collateral + vault" },
    { icon: Coins, label: "sUSD supply", value: fmtNum(s.susdSupply), sub: `Backing ratio ${fmtNum(s.backingRatio, 1)}%` },
    { icon: PiggyBank, label: "Vault deposits", value: fmtUsd(s.vaultDeposits), sub: `${fmtNum(s.ssusdSupply)} ssUSD minted` },
    { icon: Layers, label: "Stock collateral", value: fmtUsd(s.collateralValue), sub: `${s.stocks.filter((x) => x.locked > 0).length} assets in use` },
    { icon: Lock, label: "$SF locked", value: fmtNum(s.sfLocked, 0), sub: `${fmtNum(s.sfSupply, 0)} SF total supply` },
    { icon: Percent, label: "PSM reserves", value: fmtUsd(s.psmReserves), sub: `USDC ${fmtNum(s.psmUsdc, 0)} · USDG ${fmtNum(s.psmUsdg, 0)}` },
  ];

  const backingParts = [
    { label: "PSM reserves (USDC/USDG)", value: s.psmReserves },
    { label: "Tokenized stock collateral", value: s.collateralValue },
  ];
  const backingTotal = backingParts.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Read directly from StockFlow contracts on {NETWORK.name}. Refreshes every 15s.</p>
        <LiveBadge loading={loading} error={s.error} onRefresh={() => s.refetch()} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} loading={loading} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <Panel title="Collateral by asset">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium">Oracle price</th>
                  <th className="pb-3 font-medium">Locked</th>
                  <th className="pb-3 font-medium">Value</th>
                  <th className="pb-3 font-medium">Share</th>
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
                    <td className="py-3 text-foreground">{fmtNum(st.locked, 4)}</td>
                    <td className="py-3 text-foreground">{fmtUsd(st.lockedValue)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <Bar value={st.lockedValue} max={s.collateralValue} />
                        </div>
                        <span className="text-xs text-muted">
                          {s.collateralValue > 0 ? fmtNum((st.lockedValue / s.collateralValue) * 100, 1) : "0.0"}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="sUSD backing">
            <div className="space-y-4">
              {backingParts.map((p) => (
                <div key={p.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-muted">{p.label}</span>
                    <span className="font-semibold text-foreground">{fmtUsd(p.value)}</span>
                  </div>
                  <Bar value={p.value} max={backingTotal} />
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                <span className="text-muted">Backing ratio</span>
                <span className="font-semibold text-primary">{fmtNum(s.backingRatio, 1)}%</span>
              </div>
            </div>
          </Panel>

          <Panel title="Contracts">
            <ul className="space-y-2 text-sm">
              {(["sUSD", "ssUSD", "SF", "PSM", "Borrow", "StakingVault", "SFLock", "Faucet"] as const).map((k) => (
                <li key={k} className="flex items-center justify-between">
                  <span className="text-foreground">{k}</span>
                  <AddressLink address={ADDRESSES[k]} />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
