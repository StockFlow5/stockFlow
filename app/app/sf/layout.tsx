import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "$SF",
  description: "Lock $SF governance tokens for voting power and protocol fee share.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
