import { Reveal } from "@/components/reveal";

export function BusinessModelSection() {
  return (
    <section id="model" className="relative py-16 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_480px_at_50%_0%,rgba(18,85,255,0.12),transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Business Model</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.02] tracking-tight text-white md:text-5xl lg:text-6xl">
            Changing the Way People Think About Trading
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#BCC7DF] md:text-lg">
            BIG aims to make trading accessible to everyone by simplifying the trading journey and managing trading activities on behalf of its users, so you don’t need to be an expert trader to get started.
          </p>
          <div className="mt-6">
            <span className="inline-flex items-center rounded-full border border-[rgba(127,168,255,0.5)] bg-[linear-gradient(135deg,rgba(18,85,255,0.25),rgba(18,85,255,0.12))] px-6 py-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--blue-soft)]">
              No Trading Experience? Start Here.
            </span>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-2">
          <Reveal>
            <article className="group relative h-full overflow-hidden rounded-[2rem] border border-[rgba(127,168,255,0.35)] bg-[radial-gradient(400px_320px_at_100%_0%,rgba(18,85,255,0.18),transparent_70%),linear-gradient(165deg,rgba(14,26,54,0.92),rgba(6,11,25,0.72))] p-8 shadow-[0_50px_140px_rgba(4,10,30,0.6)] sm:p-10">
              <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(18,85,255,0.22),transparent_70%)] blur-2xl transition group-hover:scale-110" />
              <div className="relative">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(127,168,255,0.5)] text-sm font-semibold text-[var(--blue-soft)]">
                  01
                </span>
                <p className="mt-6 text-sm uppercase tracking-[0.28em] text-[#93a7de]">
                  Managed Trading
                </p>
                <h3 className="mt-3 font-display text-3xl text-white md:text-4xl">
                  Capital Deployed With Expert Execution
                </h3>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#BCC7DF]">
                  Funds are utilized in structured Forex trading activities managed by our trading team and technology infrastructure, following defined strategies and risk-management procedures.
                </p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  <li className="flex items-center gap-3 rounded-full border border-[rgba(127,168,255,0.28)] px-4 py-2 text-sm text-[#C9D4F0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue-soft)]" />
                    Scalable Strategy Set
                  </li>
                  <li className="flex items-center gap-3 rounded-full border border-[rgba(127,168,255,0.28)] px-4 py-2 text-sm text-[#C9D4F0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue-soft)]" />
                    Risk-Controlled Approach
                  </li>
                  <li className="flex items-center gap-3 rounded-full border border-[rgba(127,168,255,0.28)] px-4 py-2 text-sm text-[#C9D4F0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue-soft)]" />
                    AI-Assisted Execution
                  </li>
                  <li className="flex items-center gap-3 rounded-full border border-[rgba(127,168,255,0.28)] px-4 py-2 text-sm text-[#C9D4F0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue-soft)]" />
                    Professionally Managed
                  </li>
                </ul>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="group relative h-full overflow-hidden rounded-[2rem] border border-[rgba(127,168,255,0.35)] bg-[radial-gradient(400px_320px_at_100%_0%,rgba(18,85,255,0.16),transparent_70%),linear-gradient(165deg,rgba(12,22,48,0.92),rgba(6,11,25,0.72))] p-8 shadow-[0_50px_140px_rgba(4,10,30,0.6)] sm:p-10">
              <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(18,85,255,0.2),transparent_70%)] blur-2xl transition group-hover:scale-110" />
              <div className="relative">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(127,168,255,0.5)] text-sm font-semibold text-[var(--blue-soft)]">
                  02
                </span>
                <p className="mt-6 text-sm uppercase tracking-[0.28em] text-[#93a7de]">
                  Partner Network
                </p>
                <h3 className="mt-3 font-display text-3xl text-white md:text-4xl">
                  Grow Together With Referrals Rewards
                </h3>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#BCC7DF]">
                  Become a partner and help expand the BIG community. Earn defined rewards through our structured compensation plan while others benefit from managed trading.
                </p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  <li className="flex items-center gap-3 rounded-full border border-[rgba(127,168,255,0.28)] px-4 py-2 text-sm text-[#C9D4F0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue-soft)]" />
                    Direct Referral Rewards
                  </li>
                  <li className="flex items-center gap-3 rounded-full border border-[rgba(127,168,255,0.28)] px-4 py-2 text-sm text-[#C9D4F0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue-soft)]" />
                    20-Level Network Plan
                  </li>
                  <li className="flex items-center gap-3 rounded-full border border-[rgba(127,168,255,0.28)] px-4 py-2 text-sm text-[#C9D4F0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue-soft)]" />
                    Transparent Payouts
                  </li>
                  <li className="flex items-center gap-3 rounded-full border border-[rgba(127,168,255,0.28)] px-4 py-2 text-sm text-[#C9D4F0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue-soft)]" />
                    Community Driven Growth
                  </li>
                </ul>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
