import { withdrawal } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function WithdrawalSection() {
  return (
    <section
      id="withdrawal"
      className="relative border-y border-[var(--line)] py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_380px_at_80%_10%,rgba(18,85,255,0.12),transparent_62%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#93A7DE]">
              {withdrawal.eyebrow}
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.02] tracking-tight text-white md:text-5xl">
              {withdrawal.title}
            </h2>
            <p className="max-w-2xl mt-4 text-lg leading-relaxed text-[#929FC0]">
              {withdrawal.intro}
            </p>
          </Reveal>
          
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal delay={0.08}>
            <div className="panel-glass h-full overflow-hidden rounded-3xl">
              <div className="grid grid-cols-[1fr_auto] border-b border-[var(--line)] bg-[#0A1226] text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--blue-soft)]">
                <div className="px-6 py-4">Rule</div>
                <div className="border-l border-[var(--line)] px-6 py-4 text-right">
                  Value
                </div>
              </div>
              {withdrawal.rules.map((rule) => (
                <div
                  key={rule.label}
                  className="border-b border-[var(--line)] bg-[#070D1E]/70 last:border-b-0"
                >
                  <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 px-6 py-5">
                    <p className="text-sm font-medium text-white">
                      {rule.label}
                    </p>
                    <p
                      className={`font-display text-2xl leading-none ${
                        rule.value === "0%"
                          ? "text-[#7FA8FF]"
                          : "text-[var(--blue-soft)]"
                      }`}
                    >
                      {rule.value}
                    </p>
                  </div>
                  <p className="border-t border-[var(--line)] px-6 pb-5 pt-4 text-xs leading-relaxed text-[#93A7DE]">
                    {rule.detail}
                  </p>
                </div>
              ))}
              <p className="border-t border-[var(--line)] bg-[#050A16] px-6 py-4 text-[11px] leading-relaxed text-[#8090B4]">
                {withdrawal.feeNote}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="panel-glass h-full rounded-3xl p-7 md:p-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--blue-soft)]">
                The 6-Month Lock Period
              </p>

              <div className="mt-9">
                <div className="relative">
                  <div className="absolute left-3 right-3 top-3 h-px bg-[var(--line)]" />
                  <div className="absolute left-3 top-3 h-px w-[calc(50%-0.375rem)] bg-[linear-gradient(90deg,#FF636E,#1255FF)]" />

                  <div className="relative grid grid-cols-2">
                    <div className="flex flex-col items-start">
                      <span className="size-6 rounded-full border-2 border-[#FF636E] bg-[#070D1E] shadow-[0_0_0_4px_rgba(255,99,110,0.12)]" />
                      <p className="mt-5 font-display text-xl text-white">
                        Month 0
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#FF9AA2]">
                        Investment starts
                      </p>
                    </div>

                    <div className="flex flex-col items-end text-right">
                      <span className="size-6 rounded-full border-2 border-[#7FA8FF] bg-[#070D1E] shadow-[0_0_0_4px_rgba(127,168,255,0.12)]" />
                      <p className="mt-5 font-display text-xl text-white">
                        Month 6
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#7FA8FF]">
                        Penalty released
                      </p>
                    </div>
                  </div>
                </div>

   
              </div>

              <div className="mt-9 space-y-4">
                {[withdrawal.timeline.phaseOne, withdrawal.timeline.phaseTwo].map(
                  (phase) => (
                    <article
                      key={phase.window}
                      className={`rounded-2xl border p-6 ${
                        phase.tone === "restricted"
                          ? "border-[rgba(255,99,110,0.3)] bg-[rgba(255,99,110,0.05)]"
                          : "border-[rgba(127,168,255,0.3)] bg-[rgba(127,168,255,0.05)]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#93A7DE]">
                          {phase.window}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                            phase.tone === "restricted"
                              ? "bg-[rgba(255,99,110,0.16)] text-[#FF9AA2]"
                              : "bg-[rgba(127,168,255,0.16)] text-[#9DBBFF]"
                          }`}
                        >
                          {phase.fee}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-xl text-white">
                        {phase.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#A9B6D0]">
                        {phase.detail}
                      </p>
                    </article>
                  )
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}