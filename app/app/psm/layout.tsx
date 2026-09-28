import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PSM",
  description: "Mint and redeem sUSD 1:1 with USDC through the StockFlow Peg Stability Module.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
