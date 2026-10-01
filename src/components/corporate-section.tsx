import { corporate } from "@/lib/content";
import { Reveal } from "@/components/reveal";

const fields = [
  { k: "Entity", v: corporate.entity },
  { k: "Type", v: corporate.entityType },
  { k: "Jurisdiction", v: corporate.jurisdiction },
];

export function CorporateSection() {
  return (
    <section id="corporate" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(880px_420px_at_30%_0%,rgba(18,85,255,0.1),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#93A7DE]">
            Corporate Information
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#BCC7DF]">
            Registered office and governance details for members, partners,
            and regulators.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="surface mt-14 overflow-hidden rounded-3xl">
            <div className="grid gap-px bg-[rgba(127,168,255,0.12)] lg:grid-cols-[1.15fr_0.85fr]">
              <div className="bg-[#070D1E] px-8 py-10 md:px-11">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--blue-soft)]">
                  Registered Office Address
                </p>
                <address className="mt-5 not-italic font-display text-3xl leading-[1.2] tracking-tight text-white md:text-4xl">
                  {corporate.address.map((line, index) => (
                    <span
                      key={line}
                      className={
                        index === corporate.address.length - 1
                          ? "block text-[#7FA8FF]"
                          : "block"
                      }
                    >
                      {line}
                    </span>
                  ))}
                </address>

                <p className="mt-9 max-w-xl text-base leading-relaxed text-[#BCC7DF]">
                  {corporate.statement}
                </p>
              </div>

              <dl className="bg-[#070D1E]">
                {fields.map((field, index) => (
                  <div
                    key={field.k}
                    className={`flex flex-col gap-2 px-8 py-6 md:px-10 ${
                      index !== fields.length - 1
                        ? "border-b border-[rgba(127,168,255,0.12)]"
                        : ""
                    }`}
                  >
                    <dt className="text-[9.5px] font-medium uppercase tracking-[0.2em] text-[#6E7E9F]">
                      {field.k}
                    </dt>
                    <dd className="font-display text-xl leading-snug text-white">
                      {field.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
