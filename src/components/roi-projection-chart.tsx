"use client";

import { packageTerms } from "@/lib/content";

const W = 1160;
const H = 420;
const PAD_LEFT = 74;
const PAD_RIGHT = 96;
const PAD_TOP = 28;
const PAD_BOTTOM = 52;

const START = 100;

function project(rate: number, months: number[]) {
  return months.map((m) => START * Math.pow(1 + rate / 100, m));
}

function niceCeil(value: number) {
  const step = 25;
  return Math.ceil(value / step) * step;
}

export function RoiProjectionChart() {
  const { months, floorRate, targetRate } = packageTerms.projection;
  const floor = project(floorRate, months);
  const target = project(targetRate, months);

  const max = niceCeil(Math.max(...target) * 1.06);
  const min = 0;

  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const chartH = H - PAD_TOP - PAD_BOTTOM;
  const xOf = (i: number) => PAD_LEFT + (i / (months.length - 1)) * chartW;
  const yOf = (v: number) => PAD_TOP + (1 - (v - min) / (max - min)) * chartH;

  const line = (series: number[]) =>
    series
      .map((v, i) => `${i === 0 ? "M" : "L"} ${xOf(i)} ${yOf(v)}`)
      .join(" ");

  const floorPath = line(floor);
  const targetPath = line(target);
  const baseline = PAD_TOP + chartH;

  const bandPath = `${targetPath} ${floor
    .slice()
    .reverse()
    .map((v, ri) => {
      const i = floor.length - 1 - ri;
      return `L ${xOf(i)} ${yOf(v)}`;
    })
    .join(" ")} Z`;

  const targetArea = `${targetPath} L ${xOf(months.length - 1)} ${baseline} L ${xOf(0)} ${baseline} Z`;

  const ticks: number[] = [];
  for (let t = min; t <= max; t += 50) ticks.push(t);

  const lastIndex = months.length - 1;
  const lastTarget = target[lastIndex];
  const lastFloor = floor[lastIndex];

  return (
    <div className="panel-glass overflow-hidden rounded-3xl">
      <div className="border-b border-[rgba(43,107,255,0.14)] px-7 py-6 md:px-9 md:py-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--blue-soft)]">
          Projection
        </p>
        <h3 className="mt-2.5 font-display text-xl text-white md:text-2xl">
          {packageTerms.projection.title}
        </h3>
      </div>


      <div className="grid grid-cols-2 gap-px bg-[rgba(43,107,255,0.14)] md:grid-cols-4">
        <div className="bg-[#070D1E] px-7 py-5">
          <p className="text-[9.5px] font-medium uppercase tracking-[0.18em] text-[#6E7E9F]">
            Invested
          </p>
          <p className="ticker-numeric mt-2 font-display text-lg text-white">
            ${START.toFixed(2)}
          </p>
        </div>
        <div className="bg-[#070D1E] px-7 py-5">
          <p className="text-[9.5px] font-medium uppercase tracking-[0.18em] text-[#6E7E9F]">
            Balance · Floor
          </p>
          <p className="ticker-numeric mt-2 font-display text-lg text-[#93A7DE]">
            ${lastFloor.toFixed(2)}
          </p>
        </div>
        <div className="bg-[#070D1E] px-7 py-5">
          <p className="text-[9.5px] font-medium uppercase tracking-[0.18em] text-[#6E7E9F]">
            Balance · Target
          </p>
          <p className="ticker-numeric mt-2 font-display text-lg text-white">
            ${lastTarget.toFixed(2)}
          </p>
        </div>
        <div className="bg-[#070D1E] px-7 py-5">
          <p className="text-[9.5px] font-medium uppercase tracking-[0.18em] text-[#6E7E9F]">
            Interest · Target
          </p>
          <p className="ticker-numeric mt-2 font-display text-lg text-[#3ddc97]">
            +${(lastTarget - START).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="px-4 pb-2 pt-6 md:px-7">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label={`Projected balance over ${months.length - 1} months, floor ${floorRate}% and target ${targetRate}% monthly`}
        >
          <defs>
            <linearGradient id="roi-target-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1255FF" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#1255FF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="roi-band" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7FA8FF" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#7FA8FF" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD_LEFT}
                y1={yOf(t)}
                x2={W - PAD_RIGHT}
                y2={yOf(t)}
                stroke={t === 0 ? "rgba(127,168,255,0.22)" : "rgba(43,107,255,0.11)"}
                strokeDasharray={t === 0 ? undefined : "3 7"}
              />
              <text
                x={PAD_LEFT - 14}
                y={yOf(t) + 4}
                textAnchor="end"
                fontSize="11"
                className="fill-[#6E7E9F]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                ${t}
              </text>
            </g>
          ))}

          <path d={targetArea} fill="url(#roi-target-area)" />
          <path d={bandPath} fill="url(#roi-band)" />

          <path
            d={targetPath}
            fill="none"
            stroke="#7FA8FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={floorPath}
            fill="none"
            stroke="#5C6E92"
            strokeWidth="1.75"
            strokeDasharray="6 5"
            strokeLinecap="round"
          />

          {floor.map((v, i) => (
            <circle
              key={`f-${i}`}
              cx={xOf(i)}
              cy={yOf(v)}
              r="3"
              fill="#0A1226"
              stroke="#5C6E92"
              strokeWidth="1.5"
            />
          ))}
          {target.map((v, i) => (
            <circle
              key={`t-${i}`}
              cx={xOf(i)}
              cy={yOf(v)}
              r="3.5"
              fill="#0A1226"
              stroke="#7FA8FF"
              strokeWidth="1.75"
            />
          ))}

          <line
            x1={xOf(lastIndex)}
            y1={PAD_TOP - 8}
            x2={xOf(lastIndex)}
            y2={baseline}
            stroke="rgba(127,168,255,0.28)"
            strokeDasharray="2 5"
          />
          <circle cx={xOf(lastIndex)} cy={yOf(lastTarget)} r="5.5" fill="#7FA8FF" />
          <circle
            cx={xOf(lastIndex)}
            cy={yOf(lastTarget)}
            r="11"
            fill="rgba(127,168,255,0.16)"
          />
          <circle cx={xOf(lastIndex)} cy={yOf(lastFloor)} r="4" fill="#5C6E92" />

          <text
            x={xOf(lastIndex) + 14}
            y={yOf(lastTarget) + 4}
            fontSize="13"
            className="fill-white"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            ${lastTarget.toFixed(2)}
          </text>
          <text
            x={xOf(lastIndex) + 14}
            y={yOf(lastFloor) + 4}
            fontSize="12"
            className="fill-[#8090B4]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            ${lastFloor.toFixed(2)}
          </text>

          {months.map((m, i) => (
            <text
              key={m}
              x={xOf(i)}
              y={baseline + 28}
              fontSize="11"
              textAnchor="middle"
              className="fill-[#6E7E9F]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {m === 0 ? "Invest" : `Month ${m}`}
            </text>
          ))}
        </svg>
      </div>

      <p className="border-t border-[rgba(43,107,255,0.12)] px-7 py-5 text-[11px] leading-relaxed text-[#8090B4] md:px-9">
        {packageTerms.projection.note}
      </p>
    </div>
  );
}
