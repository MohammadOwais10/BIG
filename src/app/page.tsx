import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { MarketTickerBand } from "@/components/market-ticker-band";
import { InvestmentSection } from "@/components/investment-section";
import { WithdrawalSection } from "@/components/withdrawal-section";
import { EarningsSection } from "@/components/earnings-section";
import { WorkedExampleSection } from "@/components/worked-example-section";
import { GettingStartedSection } from "@/components/getting-started-section";
import { MissionSection } from "@/components/mission-section";
import { LeadershipSection } from "@/components/leadership-section";
import { CorporateSection } from "@/components/corporate-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <MarketTickerBand />
        <InvestmentSection />
        <WithdrawalSection />
        <EarningsSection />
        <WorkedExampleSection />
        <GettingStartedSection />
        <MissionSection />
        <LeadershipSection />
        <CorporateSection />
      </main>
      <SiteFooter />
    </>
  );
}
