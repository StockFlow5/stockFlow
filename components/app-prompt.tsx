"use client";

import Link from "next/link";
import { WalletButton } from "./wallet-button";
import { Wallet } from "lucide-react";

interface AppPromptProps {
  title: string;
  description: string;
}

export function AppPrompt({ title, description }: AppPromptProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-8 backdrop-blur-xl lg:p-12">
      <div className="absolute top-0 right-0 h-80 w-80 -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/15 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/2 rounded-full bg-accent/10 blur-[80px]" />
      <div className="relative grid items-center gap-12 lg:grid-cols-2">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Personal dashboard
          </p>
          <h2 className="mt-3 font-sans text-3xl font-medium tracking-tight text-foreground lg:text-4xl">
            {title}
          </h2>
          <p className="mt-4 leading-relaxed text-muted">{description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <WalletButton variant="outline" />
            <Link
              href="/app/stats/"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background/60 px-5 text-sm font-semibold text-foreground transition hover:bg-background"
            >
              View protocol stats
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-primary/30 bg-background/60 lg:h-72 lg:w-72">
            <div className="absolute h-44 w-44 rounded-full border border-primary/20 lg:h-56 lg:w-56" />
            <div className="absolute h-32 w-32 rounded-full border border-primary/20 lg:h-40 lg:w-40" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary lg:h-24 lg:w-24">
              <Wallet className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
