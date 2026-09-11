"use client";

import { SimulationProvider } from "@/components/simulation-context";

export default function AppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SimulationProvider>{children}</SimulationProvider>;
}
