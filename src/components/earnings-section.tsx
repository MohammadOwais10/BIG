import { earnings } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function EarningsSection() {
  const max = Math.max(...earnings.ladder.rows.map((row) => row.rate));

  return (
    <section
      id="earnings"
      className="relative border-t border-[var(--line)] py-16 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow">{earnings.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight text-white md:text-5xl">
            {earnings.title}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#BCC7DF]">
            {earnings.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {earnings.streams.map((stream, index) => (
            <Reveal key={stream.id} delay={index * 0.08}>
              <article className="panel-glass group relative h-full overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10">
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-2xl transition group-hover:scale-110 ${
                    index === 0
                      ? "bg-[radial-gradient(circle,rgba(18,85,255,0.18),transparent_70%)]"
                      : "bg-[radial-gradient(circle,rgba(18,85,255,0.2),transparent_70%)]"
                  }`}
                />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <p className="panel-label-muted">Stream {stream.index}</p>
                    <h3 className="mt-3 font-display text-3xl text-white md:text-4xl">
                      {stream.name}
                    </h3>
                  </div>
                  <div className="w-full rounded-2xl border border-[var(--line)] bg-[#0B1836] px-5 py-3 text-center sm:w-auto sm:shrink-0">
                    <p className="font-display text-2xl leading-none text-[var(--blue-soft)]">
                      {stream.rate}
                    </p>
                    <p className="micro-label mt-1.5">{stream.rateLabel}</p>
                  </div>
                </div>

                <p className="relative mt-6 text-base leading-relaxed text-[#BCC7DF]">
                  {stream.summary}
                </p>

                <ul className="relative mt-7 space-y-3">
                  {stream.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-[#A9B6D0]"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--blue-soft)]" />
                      {point}
                    </li>
                  ))}
                </ul>

                <dl className="relative mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
                  {stream.meta.map((item) => (
                    <div key={item.k} className="bg-[#060B19] px-4 py-4 text-center">
                      <dt className="micro-label">{item.k}</dt>
                      <dd className="mt-1.5 text-sm font-semibold text-white">
                        {item.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <section id="levels" className="panel-glass mt-8 overflow-hidden rounded-3xl">
            <div className="surface-head px-7 py-6 md:px-9">
              <p className="panel-label">{earnings.ladder.eyebrow}</p>
              <h3 className="mt-3 font-display text-2xl text-white md:text-3xl">
                {earnings.ladder.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#93A7DE]">
                {earnings.ladder.subtitle}
              </p>
            </div>

            <div className="px-7 py-7 md:px-9">
              <div className="panel-label-muted hidden grid-cols-[9rem_1fr_6rem] gap-6 pb-4 md:grid">
                <span>Level</span>
                <span>Reward as a percentage of ROI</span>
                <span className="text-right">Rate</span>
              </div>

              <div className="space-y-3">
                {earnings.ladder.rows.map((row) => (
                  <div
                    key={row.level}
                    className="grid items-center gap-3 rounded-2xl border border-[var(--line)] bg-[#070D1E]/70 px-5 py-4 md:grid-cols-[9rem_1fr_6rem] md:gap-6"
                  >
                    <div>
                      <p className="font-display text-base text-white">
                        {row.level}
                      </p>
                      <p className="mt-1 text-[10px] leading-snug text-[#8A99C4]">
                        {row.label}
                      </p>
                      <p className="mt-1.5 inline-block rounded-full bg-[rgba(127,168,255,0.12)] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--blue-soft)]">
                        {row.requirement}
                      </p>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-[#0B1732]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#1255FF,#7FA8FF)]"
                        style={{ width: `${(row.rate / max) * 100}%` }}
                      />
                    </div>

                    <div className="md:text-right">
                      <span className="micro-label block md:hidden">
                        Reward
                      </span>
                      <p className="font-display text-xl leading-none text-[var(--blue-soft)]">
                        {row.rate}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="border-t border-[var(--line)] bg-[#050A16] px-7 py-4 text-[11px] leading-relaxed text-[#8090B4] md:px-9">
              {earnings.ladder.footerNote}
            </p>
          </section>
        </Reveal>
      </div>
    </section>
  );
}