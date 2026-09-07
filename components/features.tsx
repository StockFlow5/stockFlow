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
    <section id="features" className="border-y border-border bg-card/30 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Why StockFlow
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
              className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40"
            >
              <feature.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-base font-medium">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
