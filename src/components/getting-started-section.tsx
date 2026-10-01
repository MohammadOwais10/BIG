import { gettingStarted } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function GettingStartedSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(820px_420px_at_70%_0%,rgba(43,107,255,0.1),transparent_62%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#93A7DE]">
            {gettingStarted.eyebrow}
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl tracking-tight text-white md:text-5xl">
            {gettingStarted.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {gettingStarted.steps.map((step, index) => (
            <Reveal key={step.index} delay={index * 0.07}>
              <article className="panel-glass group relative h-full overflow-hidden rounded-3xl p-7">
                <div className="absolute right-5 top-4 font-display text-5xl text-white/5">
                  {step.index}
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1255FF] text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-6 font-display text-xl text-white md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#A9B6D0]">
                  {step.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}