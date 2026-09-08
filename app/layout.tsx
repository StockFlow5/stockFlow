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

export const metadata: Metadata = {
  metadataBase: new URL("https://stockflowapp.fun"),
  title: "StockFlow | Where stocks become stable dollars",
  description:
    "Mint sUSD by depositing tokenized equities on Robinhood Chain. Transparent, on-chain collateral. Earn yield by staking.",
  icons: {
    icon: "/profile.png",
    apple: "/profile.png",
  },
  openGraph: {
    title: "StockFlow | Where stocks become stable dollars",
    description:
      "A stable dollar backed by tokenized stocks. Deposit equities, mint sUSD, and earn protocol revenue.",
    images: ["/banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "StockFlow | Where stocks become stable dollars",
    description:
      "A stable dollar backed by tokenized stocks. Deposit equities, mint sUSD, and earn protocol revenue.",
    images: ["/banner.png"],
  },
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
