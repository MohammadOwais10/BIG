import { leadership } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function LeadershipSection() {
  return (
    <section
      id="leadership"
      className="relative border-t border-[var(--line)] py-16 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_0%,rgba(18,85,255,0.1),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="eyebrow">Leadership Team</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.02] tracking-tight text-white md:text-5xl">
              Who is accountable for what
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#BCC7DF]">
              Every part of the plan is owned by a named function. These are
              the three areas a member can hold the platform to, and what each
              one is answerable for.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {leadership.map((person, index) => (
            <Reveal key={person.name} delay={index * 0.07}>
              <article className="panel-glass group relative flex h-full flex-col overflow-hidden rounded-3xl">
                <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-7 py-6">
                  <div>
                    <p className="micro-label">{person.focus}</p>
                    <h3 className="mt-2 font-display text-xl leading-snug text-white">
                      {person.name}
                    </h3>
                  </div>
                  <span className="ticker-numeric flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--line)] bg-[radial-gradient(circle_at_30%_20%,rgba(127,168,255,0.32),rgba(6,20,13,0.95))] font-display text-lg text-[var(--blue-soft)] shadow-[0_0_28px_rgba(18,85,255,0.12)] transition group-hover:shadow-[0_0_40px_rgba(18,85,255,0.22)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-7 py-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--blue-soft)]">
                    {person.role}
                  </p>
                  <p className="-mx-7 mt-5 border-t border-[var(--line)] px-7 pt-5 font-display text-sm text-white">
                    {person.experience}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#A9B6D0]">
                    {person.bio}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
