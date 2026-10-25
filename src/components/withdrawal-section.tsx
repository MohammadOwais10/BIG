import { withdrawal } from "@/lib/content";
import { Reveal } from "@/components/reveal";

const W = 1160;
const H = 300;
const PAD_LEFT = 58;
const PAD_RIGHT = 40;
const PAD_TOP = 36;
const PAD_BOTTOM = 46;

const MAX_DAYS = 165;
const MAX_RATE = 10;
const DAY_MARKS = [30, 60, 90, 120, 150];
const RAMP = ["#FF636E", "#FF8E6B", "#FFC163", "#B9D76B", "#7FE0A0", "#3DDC97"];

const chartW = W - PAD_LEFT - PAD_RIGHT;
const chartH = H - PAD_TOP - PAD_BOTTOM;

const xOf = (day: number) => PAD_LEFT + (day / MAX_DAYS) * chartW;
const yOf = (value: number) => PAD_TOP + (1 - value / MAX_RATE) * chartH;

function buildPaths() {
  const rates = withdrawal.deductions.rows.map((row) => row.rate);
  let line = `M ${xOf(0)} ${yOf(rates[0])}`;
  rates.forEach((rate, index) => {
    const end = (index + 1) * 30;
    line += ` L ${xOf(end)} ${yOf(rate)}`;
    if (index < rates.length - 1) {
      line += ` L ${xOf(end)} ${yOf(rates[index + 1])}`;
    }
  });
  const area = `${line} L ${xOf(MAX_DAYS)} ${yOf(0)} L ${xOf(0)} ${yOf(0)} Z`;
  return { line, area };
}

export function WithdrawalSection() {
  const { line, area } = buildPaths();
  const baseline = yOf(0);

  return (
    <section
      id="withdrawal"
      className="relative border-t border-[var(--line)] py-16 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_380px_at_80%_10%,rgba(18,85,255,0.12),transparent_62%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="eyebrow">{withdrawal.eyebrow}</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.02] tracking-tight text-white md:text-5xl">
              {withdrawal.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#BCC7DF]">
              {withdrawal.intro}
            </p>
            <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[var(--blue-soft)]">
              Insta deposit &amp; withdrawals through smart contract
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid grid-cols-2 gap-4">
              {withdrawal.rules.map((rule) => (
                <div
                  key={rule.label}
                  className="panel-glass min-w-0 rounded-2xl px-5 py-5 sm:min-w-[13rem] sm:px-6"
                >
                  <p className="micro-label">{rule.label}</p>
                  <p className="mt-3 font-display text-3xl leading-none text-[var(--blue-soft)]">
                    {rule.value}
                  </p>
                  <p className="mt-3 text-[11px] leading-relaxed text-[#93A7DE]">
                    {rule.detail}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="panel-glass mt-12 overflow-hidden rounded-3xl">
            <div className="surface-head px-7 py-6 md:px-9">
              <p className="panel-label">{withdrawal.deductions.eyebrow}</p>
              <h3 className="mt-3 font-display text-2xl text-white md:text-3xl">
                {withdrawal.deductions.title}
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#93A7DE]">
                {withdrawal.deductions.intro}
              </p>
            </div>

            <div className="overflow-x-auto px-4 pb-2 pt-7 md:px-8">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full min-w-[680px]"
                role="img"
                aria-label="Capital deduction falling from 10% before 30 days to 0% after 150 days"
              >
                <defs>
                  <linearGradient id="deduct-stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF636E" />
                    <stop offset="55%" stopColor="#FFC163" />
                    <stop offset="100%" stopColor="#3DDC97" />
                  </linearGradient>
                  <linearGradient id="deduct-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF636E" stopOpacity="0.26" />
                    <stop offset="100%" stopColor="#3DDC97" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {[0, 2, 4, 6, 8, 10].map((tick) => (
                  <g key={tick}>
                    <line
                      x1={PAD_LEFT}
                      y1={yOf(tick)}
                      x2={W - PAD_RIGHT}
                      y2={yOf(tick)}
                      stroke={tick === 0 ? "rgba(127,168,255,0.24)" : "rgba(18,85,255,0.11)"}
                      strokeDasharray={tick === 0 ? undefined : "3 7"}
                    />
                    <text
                      x={PAD_LEFT - 12}
                      y={yOf(tick) + 4}
                      textAnchor="end"
                      fontSize="11"
                      className="fill-[#8A99C4]"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {tick}%
                    </text>
                  </g>
                ))}

                {DAY_MARKS.map((day) => (
                  <line
                    key={day}
                    x1={xOf(day)}
                    y1={PAD_TOP - 14}
                    x2={xOf(day)}
                    y2={baseline}
                    stroke="rgba(18,85,255,0.16)"
                    strokeDasharray="2 6"
                  />
                ))}

                <path d={area} fill="url(#deduct-area)" />
                <path
                  d={line}
                  fill="none"
                  stroke="url(#deduct-stroke)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {withdrawal.deductions.rows.map((row, index) => {
                  const midDay = index * 30 + 15;
                  const end = (index + 1) * 30;
                  return (
                    <g key={row.window}>
                      <circle
                        cx={xOf(end)}
                        cy={yOf(row.rate)}
                        r="4.5"
                        fill="#0A1226"
                        stroke={RAMP[index]}
                        strokeWidth="2"
                      />
                      <text
                        x={xOf(midDay)}
                        y={yOf(row.rate) - 14}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="600"
                        fill={RAMP[index]}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {row.rate === 0 ? "" : row.deduction}
                      </text>
                    </g>
                  );
                })}

                <text
                  x={xOf(MAX_DAYS) - 8}
                  y={yOf(0) - 14}
                  textAnchor="end"
                  fontSize="12"
                  fontWeight="600"
                  fill="#3DDC97"
                >
                  Free withdrawal
                </text>

                {[0, ...DAY_MARKS].map((day) => (
                  <text
                    key={day}
                    x={xOf(day)}
                    y={baseline + 26}
                    textAnchor={day === 0 ? "start" : day === 150 ? "end" : "middle"}
                    fontSize="11"
                    className="fill-[#8A99C4]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {day === 0 ? "Day 0" : day === 150 ? "Day 150+" : `Day ${day}`}
                  </text>
                ))}
              </svg>
            </div>

            <div className="grid gap-3 px-7 pb-7 pt-3 sm:grid-cols-2 md:px-9 xl:grid-cols-6">
              {withdrawal.deductions.rows.map((row, index) => (
                <div
                  key={row.window}
                  className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[#070D1E]/70 px-4 pb-4 pt-5"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{ backgroundColor: RAMP[index] }}
                  />
                  <p className="text-[11px] leading-snug text-[#93A7DE]">
                    {row.window}
                  </p>
                  <p
                    className="mt-2 font-display text-2xl leading-none"
                    style={{ color: RAMP[index] }}
                  >
                    {row.deduction}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#0B1732]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(row.rate / MAX_RATE) * 100}%`,
                        backgroundColor: RAMP[index],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-px border-t border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
              <p className="bg-[#050A16] px-7 py-4 text-[11px] leading-relaxed text-[#8090B4] md:px-9">
                {withdrawal.feeNote}
              </p>
              <p className="bg-[#050A16] px-7 py-4 text-[11px] leading-relaxed text-[#8090B4] md:px-9">
                {withdrawal.deductions.note}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
