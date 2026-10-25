"use client";

import { useEffect, useRef } from "react";

export function TradingChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "FX:EURUSD",
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      withdateranges: true,
      details: false,
      hotlist: false,
      calendar: false,
      studies: [],
      support_host: "https://www.tradingview.com",
      backgroundColor: "rgba(4, 7, 15, 1)",
      gridColor: "rgba(18, 85, 255, 0.12)",
    });

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="panel-glass overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(18,85,255,0.14)] px-6 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc97] opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-[#3ddc97]" />
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.1em] text-white">
            LIVE MARKET CHART
          </span>
          <span className="micro-label hidden sm:inline">EUR/USD</span>
        </div>
        <span className="micro-label">Powered by TradingView</span>
      </div>

      <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[640px]">
        <div ref={containerRef} className="h-full w-full" />
      </div>

      <p className="border-t border-[rgba(18,85,255,0.12)] px-6 py-4 text-[11px] leading-relaxed text-[#8090B4] md:px-8">
        Live Forex market data powered by TradingView. Real-time quotes and charts are streamed directly from the market.
      </p>
    </div>
  );
}
