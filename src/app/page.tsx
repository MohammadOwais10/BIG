import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { InstantDepositBar } from "@/components/instant-deposit-bar";
import { MarketTickerBand } from "@/components/market-ticker-band";
import { BusinessModelSection } from "@/components/business-model-section";
import { InvestmentSection } from "@/components/investment-section";
import { TradingViewSection } from "@/components/trading-view-section";
import { WithdrawalSection } from "@/components/withdrawal-section";
import { EarningsSection } from "@/components/earnings-section";
import { WorkedExampleSection } from "@/components/worked-example-section";
import { ForexRiskSection } from "@/components/forex-risk-section";
import { LeadershipSection } from "@/components/leadership-section";
import { CorporateSection } from "@/components/corporate-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <HeroSection />
        <InstantDepositBar />
        <MarketTickerBand />
        <BusinessModelSection />
        <InvestmentSection />
        <TradingViewSection />
        <WithdrawalSection />
        <EarningsSection />
        <WorkedExampleSection />
        <ForexRiskSection />
        <LeadershipSection />
        <CorporateSection />
      </main>
      <SiteFooter />
    </>
  );
}
