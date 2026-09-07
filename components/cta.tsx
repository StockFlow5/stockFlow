import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Cta() {
  return (
    <section className="bg-background px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-10 text-center sm:p-16">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Start earning on your stocks
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Connect your wallet, deposit tokenized equities, and mint sUSD in
          minutes.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/app"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Open the app
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
