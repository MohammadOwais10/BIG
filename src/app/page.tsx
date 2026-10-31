"use client";

import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { InstantDepositBar } from "@/components/instant-deposit-bar";
import { MarketTickerBand } from "@/components/market-ticker-band";
import { InvestmentSection } from "@/components/investment-section";
import { TradingViewSection } from "@/components/trading-view-section";
import { WithdrawalSection } from "@/components/withdrawal-section";
import { EarningsSection } from "@/components/earnings-section";
import { ForexRiskSection } from "@/components/forex-risk-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <SiteHeader />
      <main id="main">
        <HeroSection />
        <InstantDepositBar />
        <MarketTickerBand />
        <InvestmentSection />
        <TradingViewSection />
        <WithdrawalSection />
        <EarningsSection />
        <ForexRiskSection />
      </main>
      <SiteFooter />
    </>
  );
}
