import { Wallet, TrendingUp, PiggyBank, Layers } from "lucide-react";

const stats = [
  {
    icon: Wallet,
    label: "Total TVL",
    value: "$—",
    sub: "Backed reserves across sources",
  },
  {
    icon: TrendingUp,
    label: "sUSD circulating",
    value: "$—",
    sub: "Supply minted against backing",
  },
  {
    icon: PiggyBank,
    label: "ssUSD target APR",
    value: "—",
    sub: "Yield paid to stakers",
  },
  {
    icon: Layers,
    label: "Stock tokens supported",
    value: "—",
    sub: "Approved collateral types",
  },
];

const reserves = [
  { label: "PSM reserves", value: "$—", sub: "USDC / USDG" },
  { label: "Stocks collateral", value: "$—", sub: "Tokenized equities" },
  { label: "DEX liquidity", value: "$—", sub: "sUSD pools" },
];

export function Stats() {
  return (
    <section id="stats" className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[140px]" />
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Protocol overview
            </p>
            <h2 className="mt-3 font-sans text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Backed by what you&apos;d buy anyway
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted">
              Tokenized equity collateral and reserves, verifiable on chain in
              real time.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur transition hover:border-primary/40"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <s.icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted">{s.label}</p>
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-foreground">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-muted">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {reserves.map((r) => (
            <div
              key={r.label}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur transition hover:border-primary/30"
            >
              <p className="text-sm text-muted">{r.label}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {r.value}
              </p>
              <p className="mt-1 text-xs text-muted">{r.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
