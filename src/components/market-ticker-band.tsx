"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  formatChange,
  formatPrice,
  markets,
  type Quote,
} from "@/lib/markets";

const REFRESH_MS = 60_000;

type RateTable = Record<string, number>;

async function fetchRates(date: string, signal: AbortSignal): Promise<RateTable> {
  const urls = [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/usd.json`,
    `https://${date}.currency-api.pages.dev/v1/currencies/usd.json`,
  ];

  let lastError: unknown = new Error("FX feed unavailable");
  for (const url of urls) {
    try {
      const response = await fetch(url, { signal, cache: "no-store" });
      if (!response.ok) {
        throw new Error(`FX feed responded with ${response.status}`);
      }
      const data = (await response.json()) as { usd?: RateTable };
      if (data.usd && typeof data.usd === "object") {
        return data.usd;
      }
    } catch (error) {
      if (signal.aborted) throw error;
      lastError = error;
    }
  }
  throw lastError;
}

function pairPrice(rates: RateTable, base: string, quote: string) {
  const baseRate = base === "usd" ? 1 : rates[base];
  const quoteRate = quote === "usd" ? 1 : rates[quote];
  if (typeof baseRate !== "number" || typeof quoteRate !== "number") return null;
  return quoteRate / baseRate;
}

export function MarketTickerBand() {
  const [quotes, setQuotes] = useState<Record<string, Quote> | null>(null);
  const [status, setStatus] = useState<"live" | "error">("live");
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (signal: AbortSignal) => {
    const today = await fetchRates("latest", signal);

    let previous: RateTable | null = null;
    for (let daysBack = 1; daysBack <= 4 && !previous; daysBack++) {
      const date = new Date(Date.now() - daysBack * 86_400_000)
        .toISOString()
        .slice(0, 10);
      previous = await fetchRates(date, signal).catch(() => null);
    }

    const next: Record<string, Quote> = {};
    for (const market of markets) {
      const price = pairPrice(today, market.base, market.quote);
      if (price == null || !Number.isFinite(price)) continue;
      const prevPrice = previous
        ? pairPrice(previous, market.base, market.quote)
        : null;
      next[market.pair] = {
        price,
        change24h:
          prevPrice && prevPrice > 0 ? (price / prevPrice - 1) * 100 : 0,
      };
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
        console.error("Unable to load exchange rates", error);
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
        const quote = quotes?.[market.pair];
        const isUp = (quote?.change24h ?? 0) >= 0;
        const [base, counter] = market.pair.split("/");

        return (
          <span
            key={`${loop}-${market.pair}`}
            className="group flex items-center gap-2.5 px-6 py-1.5 whitespace-nowrap"
          >
            <span className="font-display text-[13px] font-semibold tracking-[0.06em] text-[#DCE6FF] transition-colors group-hover:text-white">
              {base}
              <span className="text-[10px] font-medium tracking-[0.14em] text-[#8A99C4]">
                /{counter}
              </span>
            </span>

            <span className="ticker-numeric font-display text-[13px] font-medium text-white">
              {quote ? formatPrice(quote.price) : "—"}
            </span>

            <span
              className={`ticker-numeric inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-display text-[10.5px] font-semibold ${
                !quote
                  ? "bg-white/5 text-[#8A99C4]"
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
          ? "Live foreign exchange rates are temporarily unavailable."
          : "Live foreign exchange rates."}
      </span>
    </div>
  );
}
