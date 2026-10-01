import { earnings } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function EarningsSection() {
  const max = earnings.ladder.rows[0].rate;

  return (
    <section id="earnings" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#93A7DE]">
            {earnings.eyebrow}
          </p>
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
              <article className="panel-glass group relative h-full overflow-hidden rounded-3xl p-8 md:p-10">
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-2xl transition group-hover:scale-110 ${
                    index === 0
                      ? "bg-[radial-gradient(circle,rgba(43,107,255,0.18),transparent_70%)]"
                      : "bg-[radial-gradient(circle,rgba(18,85,255,0.2),transparent_70%)]"
                  }`}
                />
                <div className="relative flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8090B4]">
                      Stream {stream.index}
                    </p>
                    <h3 className="mt-3 font-display text-3xl text-white md:text-4xl">
                      {stream.name}
                    </h3>
                  </div>
                  <div className="shrink-0 rounded-2xl border border-[var(--line)] bg-[#0B1836] px-5 py-3 text-center">
                    <p className="font-display text-2xl leading-none text-[var(--blue-soft)]">
                      {stream.rate}
                    </p>
                    <p className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-[#8090B4]">
                      {stream.rateLabel}
                    </p>
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

                <dl className="relative mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)]">
                  {stream.meta.map((item) => (
                    <div key={item.k} className="bg-[#060B19] px-4 py-4 text-center">
                      <dt className="text-[9px] uppercase tracking-[0.18em] text-[#6E7E9F]">
                        {item.k}
                      </dt>
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
          <div id="levels" className="panel-glass mt-8 overflow-hidden rounded-3xl">
            <div className="border-b border-[var(--line)] bg-[#0A1226] px-7 py-6 md:px-9">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#93A7DE]">
                {earnings.ladder.eyebrow}
              </p>
              <h3 className="mt-3 font-display text-2xl text-white md:text-3xl">
                {earnings.ladder.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#93A7DE]">
                {earnings.ladder.subtitle}
              </p>
            </div>

            <div className="px-7 py-7 md:px-9">
              <div className="hidden grid-cols-[9rem_1fr_6rem] gap-6 pb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6E7E9F] md:grid">
                <span>Level</span>
                <span>Percentage of downline trade income</span>
                <span className="text-right">Share</span>
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
                      <p className="mt-1 text-[10px] leading-snug text-[#6E7E9F]">
                        {row.label}
                      </p>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-[#0B1732]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#1255FF,#7FA8FF)]"
                        style={{ width: `${(row.rate / max) * 100}%` }}
                      />
                    </div>

                    <p className="font-display text-xl leading-none text-[var(--blue-soft)] md:text-right">
                      {row.rate}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="border-t border-[var(--line)] bg-[#050A16] px-7 py-4 text-[11px] leading-relaxed text-[#8090B4] md:px-9">
              {earnings.ladder.footerNote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}