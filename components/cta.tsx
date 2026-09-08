import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Cta() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />
      </div>
      <div className="mx-auto max-w-4xl rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card/60 to-accent/10 p-10 text-center shadow-2xl shadow-primary/10 backdrop-blur sm:p-16">
        <h2 className="font-sans text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Start earning on your{" "}
          <span className="italic text-primary">stocks.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Connect your wallet, deposit tokenized equities, and mint sUSD in minutes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/app"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-6px_rgba(45,212,191,0.45)] transition hover:bg-primary/90 hover:shadow-[0_0_32px_-4px_rgba(45,212,191,0.55)]"
          >
            Open the app
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-primary px-8 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            Read docs
          </Link>
        </div>
      </div>
    </section>
  );
}
