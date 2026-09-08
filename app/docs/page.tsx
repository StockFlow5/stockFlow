import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "StockFlow Docs",
  description:
    "Documentation for StockFlow: a stable dollar backed by tokenized equities on Robinhood Chain.",
};

const sections = [
  {
    title: "What is StockFlow?",
    body: [
      "StockFlow is a decentralized stablecoin protocol on Robinhood Chain. It lets users mint sUSD by depositing tokenized equities and other approved reserves.",
      "The protocol is designed to be transparent, composable, and capital efficient: every unit of sUSD is over-collateralized by on-chain assets, and protocol revenue flows to ssUSD stakers.",
    ],
  },
  {
    title: "sUSD stablecoin",
    body: [
      "sUSD is the primary stable asset of StockFlow. It targets a $1.00 peg through a combination of over-collateralized loans and a Peg Stability Module (PSM).",
      "Anyone can mint sUSD by locking collateral in a vault, or acquire it permissionlessly on decentralized exchanges and through the PSM.",
    ],
  },
  {
    title: "ssUSD staking",
    body: [
      "ssUSD represents staked sUSD. When you stake sUSD into the protocol, you receive ssUSD which accrues revenue from stability fees and reserve yield.",
      "Rewards are reflected in a growing redemption value, meaning ssUSD becomes worth more sUSD over time without requiring manual harvests.",
    ],
  },
  {
    title: "Collateral & vaults",
    body: [
      "Approved collateral types include tokenized stocks such as AAPLx, TSLAx, and NVDAx, plus stable reserve assets. Each collateral has a minimum collateral ratio and liquidation threshold.",
      "Vaults are non-custodial: your collateral is locked in a smart contract and can be withdrawn once the borrowed sUSD is repaid.",
    ],
  },
  {
    title: "Borrowing & liquidation",
    body: [
      "Users deposit approved collateral and mint sUSD up to a safe loan-to-value ratio. If the collateral value drops below the liquidation threshold, anyone can repay the debt and claim the collateral at a discount.",
      "Liquidations keep the system solvent and protect the sUSD peg.",
    ],
  },
  {
    title: "Peg Stability Module (PSM)",
    body: [
      "The PSM allows users to swap approved stable reserves for sUSD 1:1 and vice versa. It acts as a direct redemption and issuance mechanism when sUSD trades slightly off-peg.",
      "This reduces the need for forced liquidations and keeps sUSD close to its target price.",
    ],
  },
  {
    title: "Risk",
    body: [
      "All DeFi protocols carry risk. Key risks include smart contract bugs, oracle manipulation, collateral volatility, and governance failure. StockFlow aims to mitigate these through audits, Chainlink price feeds, conservative collateral parameters, and a time-locked governance process.",
    ],
  },
  {
    title: "Season 1 rewards",
    body: [
      "Season 1 rewards distribute SF governance tokens to early users who mint sUSD, provide liquidity, and stake into ssUSD. Rewards are tracked on-chain and can be claimed through the protocol rewards contract once live.",
    ],
  },
];

export default function DocsPage() {
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
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Documentation
            </p>
            <h1 className="mt-4 font-sans text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              How StockFlow works
            </h1>
            <p className="mt-4 text-lg text-muted">
              A stable dollar backed by tokenized equities, built on Robinhood
              Chain.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/app"
                className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Open the app
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-border px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-12">
            {sections.map((section) => (
              <article key={section.title}>
                <h2 className="font-sans text-2xl font-medium tracking-tight text-foreground">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
