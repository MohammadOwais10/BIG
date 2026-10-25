"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { brand, hero } from "@/lib/content";
import { Cubes } from "@/components/cubes";

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="hero-glow relative flex min-h-[100svh] flex-col items-center justify-center overflow-x-clip overflow-y-hidden px-6 py-24 sm:py-32 lg:px-10 lg:py-40">
      <div className="absolute inset-0 z-[1]">
        <Cubes
          gridSize={20}
          maxAngle={270}
          radius={2.4}
          gap={0.08}
          edgeStyle="solid"
          faceColor="#04070f" 
          edgeColor="#24406e"
          rippleColor="#1255ff"
          rippleSpeed={1.2}
          autoAnimate
          rippleOnClick={true}
        />
      </div>
      <div className="pointer-events-none absolute -right-24 top-16 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(18,85,255,0.18),transparent_68%)] blur-2xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(18,85,255,0.12),transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[420px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(18,85,255,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,15,0.92)_0%,rgba(4,7,15,0.78)_45%,rgba(4,7,15,0.98)_100%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(18,85,255,0.22),transparent_70%)] blur-2xl" />
          <Image
            src="/logo.png"
            alt={`${brand.name} emblem`}
            width={1918}
            height={820}
            className="relative h-24 w-auto object-contain sm:h-32 lg:h-40"
            priority
          />
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1 }}
          className="mt-6 font-display text-[clamp(2rem,5.2vw,4rem)] leading-[1.0] tracking-[-0.02em] text-white"
        >
          <span className="block">{hero.headlineLine1}</span>
          <span className="blue-text mt-2 block">{hero.headlineLine2}</span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.16 }}
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-[#BAC6DE] md:text-lg"
        >
          {hero.body}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.22 }}
          className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4 md:gap-6"
        >
          <a
            href="#earnings"
            className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[linear-gradient(135deg,#1255FF,#1255FF)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFFFFF] shadow-[0_16px_50px_rgba(18,85,255,0.35)] sm:w-auto sm:px-7 sm:py-3.5 sm:text-[12px]"
          >
            <span className="relative z-10">{hero.primaryCta}</span>
            <span className="relative z-10 transition group-hover:translate-x-0.5">
              →
            </span>
            <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] transition group-hover:translate-x-[120%] duration-700" />
          </a>
          <a
            href="#package"
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[rgba(127,168,255,0.45)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--blue-soft)] transition hover:border-[var(--blue-soft)] hover:bg-[rgba(127,168,255,0.1)] sm:w-auto sm:px-7 sm:py-3.5 sm:text-[12px]"
          >
            {hero.secondaryCta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
