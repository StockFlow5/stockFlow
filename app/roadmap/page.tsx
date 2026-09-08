import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Check, Circle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "StockFlow Roadmap",
  description:
    "StockFlow protocol roadmap: testnet, mainnet, integrations, and governance.",
};

const phases = [
  {
    phase: "Phase 1: Testnet",
    status: "completed",
    items: [
      "Core CDP vault contracts",
      "PSM mock reserves",
      "StockFlow frontend MVP",
      "Robinhood Chain integration",
    ],
  },
  {
    phase: "Phase 2: Security & Oracles",
    status: "in-progress",
    items: [
      "Smart contract audit",
      "Chainlink price feed integration",
      "Liquidation bot & keeper network",
      "Bug bounty program",
    ],
  },
  {
    phase: "Phase 3: Mainnet",
    status: "upcoming",
    items: [
      "sUSD & ssUSD launch",
      "Tokenized stock collateral onboarding",
      "DEX liquidity & PSM activation",
      "Season 1 rewards distribution",
    ],
  },
  {
    phase: "Phase 4: Governance",
    status: "upcoming",
    items: [
      "$SF governance token launch",
      "DAO-controlled collateral parameters",
      "Protocol revenue sharing",
      "Cross-chain expansion",
    ],
  },
];

const statusIcon = {
  completed: Check,
  "in-progress": Clock,
  upcoming: Circle,
};

const statusClass = {
  completed: "text-emerald-400",
  "in-progress": "text-primary",
  upcoming: "text-muted",
};

const statusLabel = {
  completed: "Completed",
  "in-progress": "In progress",
  upcoming: "Upcoming",
};

export default function RoadmapPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8 lg:pt-32">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 right-0 h-[400px] w-[400px] translate-x-1/3 -translate-y-1/4 rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/3 translate-y-1/4 rounded-full bg-accent/10 blur-[80px]" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Roadmap
            </p>
            <h1 className="mt-4 font-sans text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              Where StockFlow is headed
            </h1>
            <p className="mt-4 text-lg text-muted">
              A phased path from testnet prototype to a fully governed stablecoin
              protocol backed by tokenized equities.
            </p>
          </div>
        </section>

        <section className="border-t border-border/60 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8">
            {phases.map((p, i) => {
              const Icon = statusIcon[p.status as keyof typeof statusIcon];
              return (
                <div
                  key={p.phase}
                  className="relative rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur"
                >
                  {i !== phases.length - 1 && (
                    <div className="absolute left-8 top-[4.5rem] hidden h-full w-px bg-border/60 md:block" />
                  )}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/60">
                      <Icon className={`h-5 w-5 ${statusClass[p.status as keyof typeof statusClass]}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="font-sans text-xl font-medium tracking-tight text-foreground">
                          {p.phase}
                        </h2>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            p.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : p.status === "in-progress"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted/10 text-muted"
                          }`}
                        >
                          {statusLabel[p.status as keyof typeof statusLabel]}
                        </span>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {p.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2 text-sm text-muted"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
