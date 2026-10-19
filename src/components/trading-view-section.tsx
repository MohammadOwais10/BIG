import { tradingView } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { TradingChart } from "@/components/trading-chart";

export function TradingViewSection() {
  return (
    <section
      id="trading"
      className="relative overflow-hidden border-t border-[var(--line)] py-16 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_640px_at_50%_0%,rgba(18,85,255,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl lg:max-w-xl">
            <p className="eyebrow">{tradingView.eyebrow}</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.02] tracking-tight text-white md:text-5xl">
              {tradingView.title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#BCC7DF]">
              {tradingView.intro}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="panel-label">Deployed Strategies</p>
            <ul className="mt-4 flex flex-wrap gap-2 lg:justify-end">
              {tradingView.strategies.map((strategy) => (
                <li
                  key={strategy}
                  className="rounded-full border border-[rgba(127,168,255,0.24)] bg-[rgba(18,85,255,0.12)] px-4 py-1.5 text-[12px] font-medium text-[#DCE6FF]"
                >
                  {strategy}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.14} className="mt-12">
          <TradingChart />
        </Reveal>

      </div>
    </section>
  );
}
