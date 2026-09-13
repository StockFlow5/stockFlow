"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { cn } from "@/lib/utils";
import { Footer } from "./footer";
import { AppPrompt } from "./app-prompt";
import { WalletButton } from "./wallet-button";
import {
  LayoutDashboard,
  ArrowRightLeft,
  TrendingUp,
  Lock,
  DollarSign,
  Shield,
  BarChart3,
  Sparkles,
  FileText,
  Code,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const nav = [
  {
    title: "Navigation",
    items: [
      { label: "Dashboard", href: "/app/", icon: LayoutDashboard },
      { label: "PSM", href: "/app/psm/", icon: ArrowRightLeft },
      { label: "Borrow", href: "/app/borrow/", icon: TrendingUp },
      { label: "Vaults", href: "/app/vaults/", icon: Lock },
      { label: "$SF", href: "/app/sf/", icon: DollarSign },
    ],
  },
  {
    title: "Protocol",
    items: [
      { label: "Risk", href: "/app/risk/", icon: Shield },
      { label: "Stats", href: "/app/stats/", icon: BarChart3 },
      { label: "Season 1", href: "/app/season/", icon: Sparkles },
    ],
  },
];

const company = [
  { label: "Docs", href: "/docs", icon: FileText },
  { label: "GitHub", href: "https://github.com/StockFlow5/app", icon: Code },
  { label: "X", href: "https://x.com/StockFlowfun", icon: X },
];

interface AppLayoutProps {
  title: string;
  subtitle: string;
  kicker?: string;
  prompt?: { title: string; description: string };
  requiresWallet?: boolean;
  children: React.ReactNode;
}

export function AppLayout({
  title,
  subtitle,
  kicker = "Your account",
  prompt,
  requiresWallet = true,
  children,
}: AppLayoutProps) {
  const { isConnected } = useAccount();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-border bg-card/90 px-5 py-6 backdrop-blur-xl lg:flex">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/profile.png"
            alt="StockFlow"
            width={36}
            height={36}
            className="rounded-xl object-contain"
          />
          <span className="text-xl font-semibold tracking-tight">StockFlow</span>
        </Link>

        <SidebarNav pathname={pathname} />

        <div className="flex flex-col gap-3">
          <WalletButton size="sm" className="w-full" variant="outline" />
          <div className="flex items-center justify-between px-1 pt-2 text-muted">
            {company.map((c) => (
              <a
                key={c.label}
                href={c.href}
                aria-label={c.label}
                target={c.href.startsWith("/") ? undefined : "_blank"}
                rel={c.href.startsWith("/") ? undefined : "noopener noreferrer"}
                className="rounded p-2 transition hover:bg-background/60 hover:text-foreground"
              >
                <c.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-card/95 px-5 py-6 backdrop-blur-xl transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/profile.png"
              alt="StockFlow"
              width={36}
              height={36}
              className="rounded-xl object-contain"
            />
            <span className="text-xl font-semibold tracking-tight">StockFlow</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded p-2 text-muted transition hover:bg-background/60"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8">
          <SidebarNav pathname={pathname} />
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <WalletButton size="sm" className="w-full" variant="outline" />
          <div className="flex items-center justify-between px-1 pt-2 text-muted">
            {company.map((c) => (
              <a
                key={c.label}
                href={c.href}
                aria-label={c.label}
                className="rounded p-2 transition hover:bg-background/60 hover:text-foreground"
              >
                <c.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-30 border-b border-border bg-card/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded p-2 text-muted transition hover:bg-background/60"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/profile.png"
                  alt="StockFlow"
                  width={28}
                  height={28}
                  className="rounded-lg object-contain"
                />
                <span className="text-lg font-semibold tracking-tight">StockFlow</span>
              </Link>
            </div>
            <WalletButton size="sm" variant="outline" />
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {kicker}
            </p>
            <h1 className="mt-1 text-balance font-sans text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {subtitle}
            </p>
          </header>

          {requiresWallet && !isConnected ? (
            <AppPrompt
              title={prompt?.title ?? "Your dashboard starts with your wallet"}
              description={
                prompt?.description ??
                "This page is built from your onchain balances, positions, and rewards. Connect your wallet to continue, or browse StockFlow's public protocol stats instead."
              }
            />
          ) : (
            children
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}

function SidebarNav({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-1 flex-col gap-8">
      {nav.map((group) => (
        <div key={group.title}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            {group.title}
          </p>
          <nav className="flex flex-col gap-1">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-primary/10 text-foreground"
                      : "text-muted hover:bg-background/60 hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition",
                      active ? "text-primary" : "text-muted group-hover:text-foreground"
                    )}
                  />
                  {item.label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}
