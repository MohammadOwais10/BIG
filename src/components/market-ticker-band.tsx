"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  formatChange,
  formatPrice,
  markets,
  type Quote,
} from "@/lib/markets";

const REFRESH_MS = 60_000;

export function MarketTickerBand() {
  const [quotes, setQuotes] = useState<Record<string, Quote> | null>(null);
  const [status, setStatus] = useState<"live" | "error">("live");
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (signal: AbortSignal) => {
    const ids = markets.map((market) => market.id).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

    const response = await fetch(url, { signal, cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Price feed responded with ${response.status}`);
    }

    const data: Record<string, { usd?: number; usd_24h_change?: number }> =
      await response.json();

    const next: Record<string, Quote> = {};
    for (const market of markets) {
      const price = data[market.id]?.usd;
      if (typeof price === "number") {
        next[market.symbol] = {
          price,
          change24h: data[market.id]?.usd_24h_change ?? 0,
        };
      }
    }

    setQuotes(next);
    setStatus("live");
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await load(controller.signal);
      } catch (error) {
        if (!active || controller.signal.aborted) return;
        console.error("Unable to load market prices", error);
        setStatus("error");
      }
    };

    run();
    const interval = setInterval(run, REFRESH_MS);

    return () => {
      active = false;
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [load]);

  const track = [0, 1].map((loop) => (
    <span key={loop} className="flex items-center">
      {markets.map((market) => {
        const quote = quotes?.[market.symbol];
        const isUp = (quote?.change24h ?? 0) >= 0;

        return (
          <span
            key={`${loop}-${market.symbol}`}
            className="group flex items-center gap-2.5 px-6 py-1.5 whitespace-nowrap"
          >
            <span className="font-display text-[13px] font-semibold tracking-[0.06em] text-[#DCE6FF] transition-colors group-hover:text-white">
              {market.symbol}
              <span className="text-[10px] font-medium tracking-[0.14em] text-[#5C6E92]">
                /USDT
              </span>
            </span>

            <span className="ticker-numeric font-display text-[13px] font-medium text-white">
              {quote ? formatPrice(quote.price) : "—"}
            </span>

            <span
              className={`ticker-numeric inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-display text-[10.5px] font-semibold ${
                !quote
                  ? "bg-white/5 text-[#5C6E92]"
                  : isUp
                    ? "bg-[#3ddc97]/12 text-[#3ddc97]"
                    : "bg-[#ff6b6b]/12 text-[#ff6b6b]"
              }`}
            >
              {quote ? (
                <>
                  <svg
                    viewBox="0 0 8 5"
                    className={`size-2 ${isUp ? "" : "rotate-180"}`}
                    aria-hidden
                  >
                    <path
                      d="M4 0L8 5H0L4 0Z"
                      fill="currentColor"
                    />
                  </svg>
                  {formatChange(quote.change24h)}
                </>
              ) : (
                "--"
              )}
            </span>

            <span className="ml-3 h-3.5 w-px bg-white/10" />
          </span>
        );
      })}
    </span>
  ));

  return (
    <div className="relative w-full overflow-hidden border-y border-[rgba(18,85,255,0.22)] bg-[#050A16]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_140%_at_50%_0%,rgba(18,85,255,0.16),transparent_62%)]" />

      <div className="relative flex items-stretch">
        <div className="relative min-w-0 flex-1 overflow-hidden py-3.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#050A16] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#050A16] to-transparent" />
          <div className="marquee-track flex w-max items-center whitespace-nowrap">
            {track}
          </div>
        </div>
      </div>

      <span className="sr-only" role="status">
        {status === "error"
          ? "Live market prices are temporarily unavailable."
          : "Live market prices in USDT."}
      </span>
    </div>
  );
}
