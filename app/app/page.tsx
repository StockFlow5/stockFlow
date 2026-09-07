import { Nav } from "@/components/nav";
import { DappInterface } from "@/components/dapp-interface";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "StockFlow App | Mint, Borrow, Stake",
  description:
    "Deposit tokenized equities and mint sUSD, or stake into ssUSD to earn protocol revenue.",
};

export default function AppPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <DappInterface />
      </main>
      <Footer />
    </>
  );
}
