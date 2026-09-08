import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CircleDollarSign,
  TrendingUp,
  PiggyBank,
  Activity,
  Shield,
  Zap,
} from "lucide-react";

const heroStats = [
  { label: "Total TVL", value: "$—", sub: "Across reserves & vaults" },
  { label: "sUSD backed", value: "150%", sub: "Min. collateral ratio" },
  { label: "ssUSD APY", value: "~6%", sub: "Protocol revenue share" },
];

const cards = [
  {
    icon: CircleDollarSign,
    title: "Hold",
    description: "Stable dollars backed by tokenized equities and reserves.",
    metric: "$1.00",
    metricLabel: "Target peg",
  },
  {
    icon: PiggyBank,
    title: "Stake",
    description: "Earn variable protocol revenue from stability fees.",
    metric: "~6%",
    metricLabel: "Est. APY",
  },
  {
    icon: TrendingUp,
    title: "Borrow",
    description: "Use your tokenized stocks as collateral to mint sUSD.",
    metric: "~3%",
    metricLabel: "Borrow APR",
  },
];

const infra = [
  { label: "Robinhood Chain", icon: Activity },
  { label: "Chainlink", icon: Shield },
  { label: "Uniswap", icon: Zap },
];

const ticker = [
  "sUSD Backed",
  "Tokenized Equities",
  "On-Chain Reserves",
  "PSM 1:1 Redeem",
  "ssUSD Yield",
  "Over-Collateralized",
  "Robinhood Chain",
  "Arbitrum L2",
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pt-24 pb-8 sm:px-6 lg:px-8 lg:pt-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              StockFlow
            </p>

            <h1 className="mt-6 font-sans text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              Where stocks become{" "}
              <span className="italic text-primary">stable dollars.</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted lg:text-xl">
              sUSD is backed by tokenized equities and reserves. Stake into
              ssUSD to earn variable protocol revenue — transparent and on
              chain.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/app"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-6px_rgba(45,212,191,0.45)] transition hover:bg-primary/90 hover:shadow-[0_0_32px_-4px_rgba(45,212,191,0.55)]"
              >
                Open app
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-primary px-7 text-sm font-semibold text-primary transition hover:bg-primary/10"
              >
                Read docs
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border/60 pt-8">
              {heroStats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-semibold text-foreground sm:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted">{s.label}</p>
                  <p className="text-[10px] text-muted/70">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-primary/25 via-primary/5 to-accent/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 shadow-2xl shadow-primary/10 backdrop-blur">
              <Image
                src="/hero.png"
                alt="StockFlow"
                width={640}
                height={480}
                className="w-full"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.title}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-primary/40 hover:bg-card"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition group-hover:bg-primary/20">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {c.description}
                </p>
                <p className="mt-4 text-2xl font-semibold text-accent">
                  {c.metric}
                </p>
                <p className="text-xs text-muted">{c.metricLabel}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-muted">
          {infra.map((p) => (
            <span key={p.label} className="flex items-center gap-2">
              <p.icon className="h-4 w-4 text-primary" />
              {p.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-20 -mx-4 overflow-hidden border-y border-border bg-card/40 backdrop-blur sm:-mx-6 lg:-mx-8">
        <div className="animate-marquee flex whitespace-nowrap py-4">
          {[...ticker, ...ticker].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="mx-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted"
            >
              <span className="h-1 w-1 rounded-full bg-primary" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
