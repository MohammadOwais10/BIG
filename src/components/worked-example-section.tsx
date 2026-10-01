import { workedExample } from "@/lib/content";
import { Reveal } from "@/components/reveal";

const toneStyles: Record<string, string> = {
  root: "border-[var(--blue-bright)] bg-[rgba(18,85,255,0.1)]",
  mid: "border-[var(--line)] bg-[#0A1226]/80",
  leaf: "border-[var(--line)] bg-[#070D1E]/80",
};

export function WorkedExampleSection() {
  return (
    <section
      id="example"
      className="relative border-y border-[var(--line)] py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_440px_at_30%_0%,rgba(18,85,255,0.12),transparent_62%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#93A7DE]">
            {workedExample.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight text-white md:text-5xl">
            {workedExample.title}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#BCC7DF]">
            {workedExample.intro}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
            {workedExample.assumptions.map((item) => (
              <div key={item.k} className="bg-[#050A16] px-5 py-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#6E7E9F]">
                  {item.k}
                </p>
                <p className="mt-2 font-display text-xl text-[var(--blue-soft)]">
                  {item.v}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {workedExample.steps.map((step, index) => (
            <Reveal key={step.index} delay={index * 0.08}>
              <article className="panel-glass h-full rounded-3xl p-8">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[#0B1836] text-sm font-semibold text-[var(--blue-soft)]">
                    {step.index}
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8090B4]">
                      {step.tag}
                    </p>
                    <h3 className="mt-1 font-display text-2xl text-white">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[#93A7DE]">
                  {step.summary}
                </p>
                <ul className="mt-6 space-y-3">
                  {step.lines.map((line) => (
                    <li
                      key={line.text}
                      className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                        line.tone === "highlight"
                          ? "border border-[rgba(127,168,255,0.32)] bg-[rgba(18,85,255,0.1)] font-medium text-white"
                          : "border border-[var(--line)] bg-[#070D1E]/70 text-[#A9B6D0]"
                      }`}
                    >
                      {line.text}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="panel-glass mt-8 overflow-hidden rounded-3xl">
            <div className="border-b border-[var(--line)] bg-[#0A1226] px-7 py-6 md:px-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--blue-soft)]">
                Payout Map
              </p>
              <h3 className="mt-3 font-display text-2xl text-white md:text-3xl">
                Who receives what
              </h3>
            </div>

            <div className="grid gap-10 px-7 py-9 lg:grid-cols-[1fr_1.1fr] lg:px-9">
              <div className="relative">
                <div className="flex flex-col items-center">
                  {workedExample.tree.members.map((member, index) => (
                    <div key={member.id} className="flex w-full flex-col items-center">
                      {index > 0 && (
                        <div className="flex flex-col items-center">
                          <span className="h-8 w-px bg-[var(--line)]" />
                          <span className="rounded-full border border-[var(--line)] bg-[#070D1E] px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-[#8090B4]">
                            {member.role}
                          </span>
                          <span className="h-8 w-px bg-[var(--line)]" />
                        </div>
                      )}
                      <div
                        className={`w-full max-w-xs rounded-2xl border px-6 py-5 ${toneStyles[member.tone]}`}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8090B4]">
                          {member.label}
                        </p>
                        <p className="mt-2 font-display text-2xl text-white">
                          {member.invested}
                        </p>
                        <p className="mt-2 text-xs text-[#93A7DE]">
                          Receives{" "}
                          <span className="font-semibold text-[var(--blue-soft)]">
                            {member.earned}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4">
                <div className="overflow-hidden rounded-2xl border border-[var(--line)]">
                  <div className="grid grid-cols-[1fr_auto] bg-[#0A1226] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--blue-soft)]">
                    <span>Flow</span>
                    <span className="text-right">Amount</span>
                  </div>
                  {workedExample.tree.flows.map((flow) => (
                    <div
                      key={`${flow.from}-${flow.to}-${flow.label}`}
                      className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-[var(--line)] bg-[#070D1E]/70 px-5 py-4"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm text-white">
                          {flow.from}
                        </span>
                        <span className="text-[#6E7E9F]">→</span>
                        <span className="font-mono text-sm text-white">
                          {flow.to}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${
                            flow.kind === "direct"
                              ? "bg-[rgba(18,85,255,0.2)] text-[var(--blue-soft)]"
                              : "bg-[rgba(18,85,255,0.22)] text-[#9DBBFF]"
                          }`}
                        >
                          {flow.label}
                        </span>
                      </div>
                      <span className="font-display text-lg text-white">
                        {flow.amount}
                      </span>
                    </div>
                  ))}
                </div>

                <dl className="space-y-3">
                  {workedExample.tree.summary.map((row) => (
                    <div
                      key={row.k}
                      className="rounded-2xl border border-[var(--line)] bg-[#060B19]/80 px-5 py-4"
                    >
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--blue-soft)]">
                        {row.k}
                      </dt>
                      <dd className="mt-2 font-mono text-sm text-[#C3CFE6]">
                        {row.v}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="text-[11px] leading-relaxed text-[#8090B4]">
                  {workedExample.tree.note}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}