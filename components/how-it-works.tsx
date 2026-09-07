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
    <section id="how-it-works" className="bg-background px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            How StockFlow works
          </h2>
          <p className="mt-4 text-lg text-muted">
            A simple three-step loop that turns on-chain equities into a stable,
            spendable dollar.
          </p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-border bg-card p-8"
            >
              <span className="text-5xl font-bold text-border">
                {step.number}
              </span>
              <step.icon className="mt-6 h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
