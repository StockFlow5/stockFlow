import Link from "next/link";
import Image from "next/image";
import { Globe, Code, X } from "lucide-react";

const nav = [
  { label: "Home", href: "/" },
  { label: "App", href: "/app" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Docs", href: "/docs" },
];

const social = [
  { label: "Docs", href: "/docs", icon: Globe },
  { label: "GitHub", href: "https://github.com/StockFlow5/app", icon: Code },
  { label: "X", href: "https://x.com/StockFlowfun", icon: X },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/profile.png"
              alt="StockFlow"
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
            <span className="text-lg font-semibold">StockFlow</span>
          </div>

          <nav className="flex flex-wrap gap-6 text-sm text-muted">
            {nav.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className="transition hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-3">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target={s.href.startsWith("/") ? undefined : "_blank"}
                rel={s.href.startsWith("/") ? undefined : "noopener noreferrer"}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/80 text-muted transition hover:border-primary/40 hover:text-foreground"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted">
          © {new Date().getFullYear()} StockFlow. This is a demo interface. Smart
          contracts are placeholders until audited and deployed.
        </p>
      </div>
    </footer>
  );
}
