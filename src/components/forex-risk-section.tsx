import { forexRisk } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function ForexRiskSection() {
  return (
    <section
      id="risk"
      className="relative border-t border-[var(--line)] py-16 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(18,85,255,0.1),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow">{forexRisk.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight text-white md:text-5xl">
            {forexRisk.title}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#BCC7DF]">
            {forexRisk.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {forexRisk.risks.map((risk, index) => (
            <Reveal key={risk.index} delay={index * 0.05}>
              <article className="panel-glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-7">
                <span
                  aria-hidden
                  className="ticker-numeric font-display text-4xl leading-none text-[var(--blue-soft)]"
                >
                  {risk.index}
                </span>
                <h3 className="mt-5 font-display text-xl leading-snug text-white">
                  {risk.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#A9B6D0]">
                  {risk.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
