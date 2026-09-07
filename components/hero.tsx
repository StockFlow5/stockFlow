import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Wallet } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted">
              Built on Robinhood Chain
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Where stocks become{" "}
              <span className="text-primary">stable dollars</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              Deposit tokenized equities and mint sUSD. Your collateral stays on
              chain, fully transparent, while you earn protocol revenue through
              staking.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/app"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Launch App
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition hover:bg-card/80"
              >
                Learn more
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-medium">Hold</h3>
              <p className="mt-2 text-sm text-muted">
                Stable dollars backed by tokenized equities and reserves.
              </p>
              <p className="mt-3 text-2xl font-semibold text-accent">$1.00</p>
              <p className="text-xs text-muted">Target peg</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <Shield className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-medium">Stake</h3>
              <p className="mt-2 text-sm text-muted">
                Earn variable protocol revenue from stability fees.
              </p>
              <p className="mt-3 text-2xl font-semibold text-accent">~6%</p>
              <p className="text-xs text-muted">Est. APY</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 sm:col-span-2">
              <Wallet className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-medium">Borrow</h3>
              <p className="mt-2 text-sm text-muted">
                Use your tokenized stocks as collateral to mint sUSD.
              </p>
              <p className="mt-3 text-2xl font-semibold text-accent">~3%</p>
              <p className="text-xs text-muted">Borrow APR</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
