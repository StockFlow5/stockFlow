import { BarChart3, Coins, Lock } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Lock,
    title: "Deposit tokenized equities",
    description:
      "Lock approved stock tokens as collateral. Every position is visible on chain under protocol liquidation rules.",
  },
  {
    number: "02",
    icon: Coins,
    title: "Mint sUSD",
    description:
      "Borrow sUSD against your collateral. The protocol maintains over-collateralization to protect the peg.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Stake & earn",
    description:
      "Swap reserves for sUSD and stake into ssUSD. Revenue from stability fees grows the redemption value over time.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            How it works
          </p>
          <h2 className="mt-3 font-sans text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Three steps to on-chain stability
          </h2>
          <p className="mt-4 text-lg text-muted">
            A simple loop that turns tokenized equities into a stable,
            spendable dollar.
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative rounded-2xl border border-border/60 bg-card/60 p-8 backdrop-blur transition hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-semibold text-muted">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
          <div className="pointer-events-none absolute top-12 left-0 hidden h-0.5 w-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 md:block" />
        </div>
      </div>
    </section>
  );
}
