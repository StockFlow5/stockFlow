import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const sans = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE = "https://stockflowapp.fun";
const TITLE = "StockFlow | Where stocks become stable dollars";
const DESCRIPTION =
  "Unlock liquidity from tokenized stocks without selling. Deposit xStocks on Robinhood Chain, mint sUSD, stake for yield, and lock $SF for governance.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: "%s | StockFlow" },
  description: DESCRIPTION,
  applicationName: "StockFlow",
  keywords: [
    "StockFlow",
    "sUSD",
    "stablecoin",
    "tokenized stocks",
    "xStocks",
    "Robinhood Chain",
    "DeFi",
    "borrow against stocks",
  ],
  icons: {
    icon: "/profile.png",
    apple: "/profile.png",
  },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "StockFlow",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "StockFlow" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@_StockFlow",
    creator: "@_StockFlow",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "StockFlow",
              url: SITE,
              logo: `${SITE}/profile.png`,
              description: DESCRIPTION,
              sameAs: ["https://x.com/_StockFlow", "https://github.com/StockFlow5/stockFlow"],
            }),
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
