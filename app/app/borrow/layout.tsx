import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Borrow",
  description: "Borrow sUSD against tokenized stocks (SPYx, AAPLx, TSLAx and more) on Robinhood Chain.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
