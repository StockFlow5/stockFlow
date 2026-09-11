"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import {
  TrendingUp,
  Lock,
  DollarSign,
  Shield,
  BarChart3,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { WalletButton } from "./wallet-button";

const icons: Record<string, LucideIcon> = {
  TrendingUp,
  Lock,
  DollarSign,
  Shield,
  BarChart3,
  Sparkles,
};

interface AppPlaceholderProps {
  icon?: string;
  heading: string;
  description: string;
  bullets?: string[];
}

export function AppPlaceholder({
  icon,
  heading,
  description,
  bullets,
}: AppPlaceholderProps) {
  const Icon = icon ? icons[icon] : undefined;
  const { isConnected } = useAccount();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-8 backdrop-blur-xl lg:p-12">
      <div className="absolute top-0 right-0 h-72 w-72 -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-56 w-56 -translate-x-1/3 translate-y-1/2 rounded-full bg-accent/10 blur-[80px]" />
      <div className="relative mx-auto max-w-2xl text-center">
        {Icon && (
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        )}
        <h2 className="font-sans text-2xl font-medium tracking-tight text-foreground">
          {heading}
        </h2>
        <p className="mt-3 text-muted">{description}</p>
        {bullets && bullets.length > 0 && (
          <ul className="mx-auto mt-6 inline-block max-w-md text-left text-sm text-muted">
            {bullets.map((b, i) => (
              <li key={i} className="mb-2 flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                {b}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-col items-center gap-3">
          {!isConnected && (
            <>
              <p className="text-sm text-muted">Connect your wallet to use this feature.</p>
              <WalletButton />
            </>
          )}
          <Link
            href="/app/"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background/60 px-5 text-sm font-semibold text-foreground transition hover:bg-background"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
