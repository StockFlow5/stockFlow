import Link from "next/link";
import { Globe, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">StockFlow</span>
        </div>
        <div className="flex gap-6 text-sm text-muted">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <Link href="/app" className="hover:text-foreground">
            App
          </Link>
          <Link href="#" className="hover:text-foreground">
            Docs
          </Link>
        </div>
        <div className="flex gap-4 text-muted">
          <a href="#" aria-label="Docs" className="hover:text-foreground">
            <Globe className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Community" className="hover:text-foreground">
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} StockFlow. This is a demo interface. Smart
        contracts are placeholders until audited and deployed.
      </p>
    </footer>
  );
}
