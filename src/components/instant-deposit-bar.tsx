"use client";

import { motion, useReducedMotion } from "framer-motion";

export function InstantDepositBar() {
  const reduce = useReducedMotion();

  return (
    <section className="relative border-y border-[var(--line)] bg-[radial-gradient(900px_220px_at_50%_0%,rgba(18,85,255,0.18),transparent_70%)]">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-6 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--blue-soft)] sm:text-[11px] lg:px-10"
      >
        <span className="hidden h-px w-12 bg-gradient-to-r from-transparent to-[rgba(127,168,255,0.7)] sm:inline-block" />
        <span>Insta Deposit & Withdrawals Through Smart Contract</span>
        <span className="hidden h-px w-12 bg-gradient-to-l from-transparent to-[rgba(127,168,255,0.7)] sm:inline-block" />
      </motion.div>
    </section>
  );
}
