import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vaults",
  description: "Stake sUSD into StockFlow vaults and receive ssUSD to earn protocol revenue.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
