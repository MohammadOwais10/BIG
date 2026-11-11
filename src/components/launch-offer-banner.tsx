"use client";

import { motion, useReducedMotion } from "framer-motion";

const offers = [
  { id: "1,000", gift: "50" },
  { id: "5,000", gift: "250" },
];

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" rx="1" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

export function LaunchOfferBanner() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Grand launch offer"
      className="relative overflow-hidden border-y border-[rgba(245,185,66,0.28)] bg-[#070B18]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_220px_at_50%_0%,rgba(245,185,66,0.16),transparent_65%)]" />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-8 lg:flex-row lg:justify-between lg:gap-10 lg:px-10"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <span className="relative hidden size-2.5 shrink-0 sm:inline-flex">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f5b942] opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#f5b942]" />
          </span>
          <div>
            <p className="animate-blink font-display text-sm font-bold uppercase tracking-[0.3em] text-[#ffd98e]">
              Grand Launch Offer
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a99c4]">
              Activate a new ID before{" "}
              <span className="font-semibold text-[#ffd98e]">December 31</span>{" "}
              and claim your gift hamper.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="surface surface-hover relative flex items-center gap-4 overflow-hidden rounded-2xl px-5 py-4"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(245,185,66,0.12)] text-[#f5b942]">
                <GiftIcon className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a99c4]">
                  New ID · {offer.id} USDT
                </p>
                <p className="mt-0.5 font-display text-[15px] font-bold text-[#e8edfa]">
                  Get{" "}
                  <span className="ticker-numeric text-[#ffd98e]">
                    {offer.gift} USDT
                  </span>{" "}
                  gift hamper
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
