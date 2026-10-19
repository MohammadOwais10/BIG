import { businessModel } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function BusinessModelSection() {
  return (
    <section id="model" className="relative py-16 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(880px_420px_at_50%_0%,rgba(18,85,255,0.1),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow">{businessModel.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight text-white md:text-5xl">
            {businessModel.title}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#BCC7DF]">
            {businessModel.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {businessModel.panels.map((panel, index) => (
            <Reveal key={panel.index} delay={index * 0.08}>
              <article className="panel-glass group relative h-full overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10">
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-2xl transition group-hover:scale-110 ${
                    index === 0
                      ? "bg-[radial-gradient(circle,rgba(18,85,255,0.18),transparent_70%)]"
                      : "bg-[radial-gradient(circle,rgba(18,85,255,0.2),transparent_70%)]"
                  }`}
                />
                <p className="panel-label relative">{panel.eyebrow}</p>
                <h3 className="relative mt-3 font-display text-2xl text-white md:text-3xl">
                  {panel.title}
                </h3>
                <p className="relative mt-5 text-base leading-relaxed text-[#BCC7DF]">
                  {panel.body}
                </p>
                <ul className="relative mt-7 space-y-3">
                  {panel.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-[#A9B6D0]"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--blue-soft)]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
