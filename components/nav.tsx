"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { WalletButton } from "./wallet-button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Stats", href: "/#stats" },
  { label: "Compare", href: "/#compare" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Docs", href: "/docs" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/30 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/profile.png"
            alt="StockFlow"
            width={28}
            height={28}
            className="rounded object-contain"
          />
          <span className="text-lg font-semibold tracking-tight">StockFlow</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const base = link.href.split("#")[0] || link.href;
            const active = base === "/" ? pathname === "/" : pathname.startsWith(base);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors",
                  active
                    ? "text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary"
                    : "text-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/app"
            className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Open app
          </Link>
          <WalletButton size="sm" variant="outline" />
        </div>

        <button
          className="rounded p-2 text-muted transition hover:text-foreground md:hidden"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-b border-border bg-background/95 px-4 pb-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => {
              const base = link.href.split("#")[0] || link.href;
              const active = base === "/" ? pathname === "/" : pathname.startsWith(base);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-foreground"
                      : "text-muted hover:bg-card hover:text-foreground"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                  {active && <span className="h-2 w-2 rounded-full bg-primary" />}
                </Link>
              );
            })}
            <Link
              href="/app"
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              Open app
            </Link>
            <WalletButton size="sm" className="w-full" variant="outline" />
          </div>
        </div>
      )}
    </header>
  );
}
