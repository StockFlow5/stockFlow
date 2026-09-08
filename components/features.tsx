import { Eye, Globe, Zap, PiggyBank } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Fully transparent",
    description:
      "Collateral and reserves are verifiable on Robinhood Chain, not hidden in monthly attestations.",
  },
  {
    icon: Globe,
    title: "24/7 markets",
    description:
      "Tokenized stocks settle around the clock, so your vault and liquidity never sleep.",
  },
  {
    icon: Zap,
    title: "Fast finality",
    description:
      "Built on an Arbitrum L2. Liquidations and mints settle in sub-second time.",
  },
  {
    icon: PiggyBank,
    title: "Real yield",
    description:
      "Stability fees and reserve yield flow directly to ssUSD stakers through a rebasing share price.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative border-y border-border/60 px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[140px]" />
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Why StockFlow
          </p>
          <h2 className="mt-3 font-sans text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Stable dollars, redesigned
          </h2>
          <p className="mt-4 text-lg text-muted">
            Designed for users who want stability without leaving the on-chain
            economy.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition group-hover:bg-primary/20">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
