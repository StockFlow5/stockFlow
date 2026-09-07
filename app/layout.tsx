import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stockflow.example.com"),
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
