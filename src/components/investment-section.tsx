import { packageTerms } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function InvestmentSection() {
  return (
    <section id="package" className="relative border-t border-[var(--line)] py-16 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(18,85,255,0.1),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow">{packageTerms.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight text-white md:text-5xl">
            {packageTerms.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#BCC7DF]">
            {packageTerms.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {packageTerms.terms.map((term, index) => (
            <Reveal key={term.label} delay={index * 0.06} className="h-full">
              <article className="panel-glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-7">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(18,85,255,0.18),transparent_70%)] transition group-hover:scale-110" />
                <p className="panel-label relative">{term.label}</p>
                <p className="relative mt-4 font-display text-4xl leading-none text-[var(--blue-soft)]">
                  {term.value}
                </p>
                <p className="relative -mx-7 mt-5 border-t border-[var(--line)] px-7 pt-5 text-sm leading-relaxed text-[#A9B6D0]">
                  {term.note}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <div className="panel-glass mt-6 flex flex-col gap-4 rounded-3xl px-7 py-6 md:flex-row md:items-center md:justify-between md:px-9">
            <div>
              <p className="panel-label">{packageTerms.rewardDepth.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#A9B6D0]">
                {packageTerms.rewardDepth.note}
              </p>
            </div>
            <p className="shrink-0 font-display text-4xl leading-none text-[var(--blue-soft)]">
              {packageTerms.rewardDepth.value}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-20 lg:mt-24">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="panel-label">How It Works</p>
                <h3 className="mt-3 font-display text-3xl text-white md:text-4xl">
                  {packageTerms.howItWorks.title}
                </h3>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-[#8090B4]">
                Four stages, in the same order for every member.
              </p>
            </div>

            <ol className="mt-12 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
              {packageTerms.howItWorks.steps.map((step, index) => (
                <li key={step.title}>
                  <div
                    className={`flex items-center ${
                      index < packageTerms.howItWorks.steps.length - 1
                        ? "lg:w-[calc(100%+2rem)]"
                        : ""
                    }`}
                  >
                    <p
                      aria-hidden
                      className="ticker-numeric shrink-0 font-display text-6xl leading-none text-transparent [-webkit-text-stroke:1px_rgba(127,168,255,0.45)] md:text-7xl"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    {index < packageTerms.howItWorks.steps.length - 1 ? (
                      <span
                        aria-hidden
                        className="ml-3 hidden h-px flex-1 bg-[rgba(127,168,255,0.4)] lg:block"
                      />
                    ) : null}
                  </div>

                  <p className="mt-6 font-display text-lg text-white">
                    {step.title}
                  </p>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#A9B6D0]">
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
              {packageTerms.caps.map((cap) => (
                <div
                  key={cap.title}
                  className={`bg-[#070D1E] p-6 ${
                    cap.state === "capped"
                      ? "border-t-2 border-t-[#FF636E]"
                      : cap.state === "topup"
                        ? "border-t-2 border-t-[var(--blue-soft)]"
                        : "border-t-2 border-t-[#7FA8FF]"
                  }`}
                >
                  <p className="text-sm font-semibold text-white">
                    {cap.title}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#93A7DE]">
                    {cap.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-[rgba(255,99,110,0.28)] bg-[rgba(255,99,110,0.05)] px-6 py-5 md:px-8">
            <p className="panel-label" style={{ color: "#FF9AA2" }}>
              Important Information
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#BCC7DF]">
              {packageTerms.disclaimer}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
