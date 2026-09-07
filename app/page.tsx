import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Features } from "@/components/features";
import { Comparison } from "@/components/comparison";
import { Stats } from "@/components/stats";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Stats />
        <HowItWorks />
        <Features />
        <Comparison />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
