import { missionVision, principles } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function MissionSection() {
  return (
    <section id="mission" className="relative border-t border-[var(--line)] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow">Mission &amp; Vision</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight text-white md:text-5xl">
            Building a technology-driven trading ecosystem.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {[missionVision.mission, missionVision.vision].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <article className="panel-glass group relative h-full overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(18,85,255,0.18),transparent_70%)] transition group-hover:scale-110" />
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-[#0B1836] text-sm font-semibold text-[var(--blue-soft)]">
                  {i === 0 ? "01" : "02"}
                </div>
                <h3 className="font-display text-2xl text-white md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#BCC7DF]">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-20 lg:mt-24">
            <p className="eyebrow">{principles.eyebrow}</p>
            <h3 className="mt-4 max-w-3xl font-display text-3xl tracking-tight text-white md:text-4xl">
              {principles.title}
            </h3>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {principles.items.map((item) => (
                <article
                  key={item.title}
                  className="panel-glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-7"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(18,85,255,0.18),transparent_70%)] transition group-hover:scale-110" />
                  <span
                    aria-hidden
                    className="ticker-numeric relative font-display text-5xl leading-none text-transparent [-webkit-text-stroke:1px_rgba(127,168,255,0.4)]"
                  >
                    {item.index}
                  </span>
                  <h4 className="relative mt-6 font-display text-xl text-white">
                    {item.title}
                  </h4>
                  <p className="relative mt-3 text-sm leading-relaxed text-[#A9B6D0]">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
