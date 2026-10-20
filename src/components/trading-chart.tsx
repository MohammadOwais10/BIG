"use client";

import { useMemo, useState } from "react";
import { tradingView } from "@/lib/content";

const W = 1160;
const H = 440;
const PAD_LEFT = 18;
const PAD_RIGHT = 88;

const PRICE_TOP = 18;
const PRICE_BOTTOM = 322;
const PANE_SPLIT = 333;
const VOL_TOP = 344;
const VOL_BOTTOM = 406;

const CANDLES = 54;
const MA_PERIOD = 12;
const BASE = 1.085;
const LABEL_EVERY = 6;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const UP = "#3ddc97";
const DOWN = "#ff6b6b";

type Candle = { o: number; h: number; l: number; c: number; v: number };

const TIMEFRAMES = [
  { id: "1H", seed: 54321, vol: 0.0009, drift: 0.00008, stepMin: 60 },
  { id: "4H", seed: 4444, vol: 0.0017, drift: 0.00016, stepMin: 240 },
  { id: "1D", seed: 76543, vol: 0.0034, drift: 0.00032, stepMin: 1440 },
] as const;

type TimeframeId = (typeof TIMEFRAMES)[number]["id"];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSeries(tf: (typeof TIMEFRAMES)[number]) {
  const rand = mulberry32(tf.seed);
  const candles: Candle[] = [];
  const labels: string[] = [];
  const start = Date.UTC(2026, 0, 5, 0, 0, 0);

  let price = BASE;
  for (let i = 0; i < CANDLES; i++) {
    const o = price;
    const impulse = (rand() + rand() + rand() - 1.5) * tf.vol;
    const c = o + impulse + tf.drift;
    const h = Math.max(o, c) + rand() * tf.vol * 0.55;
    const l = Math.min(o, c) - rand() * tf.vol * 0.55;
    const v = Math.min(
      1,
      0.18 + rand() * 0.5 + (Math.abs(c - o) / tf.vol) * 0.45,
    );
    candles.push({ o, h, l, c, v });
    price = c;

    const d = new Date(start + i * tf.stepMin * 60_000);
    labels.push(
      tf.stepMin >= 1440
        ? `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
        : `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`,
    );
  }

  const ma = candles.map((_, i) => {
    const from = Math.max(0, i - (MA_PERIOD - 1));
    const slice = candles.slice(from, i + 1);
    return slice.reduce((sum, k) => sum + k.c, 0) / slice.length;
  });

  return { candles, labels, ma };
}

function niceStep(range: number, target = 5) {
  const raw = range / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return nice * mag;
}

const fmt = (v: number) => v.toFixed(4);

export function TradingChart() {
  const { symbol, market, ma: maLabel, note } = tradingView.chart;
  const [active, setActive] = useState<TimeframeId>("4H");

  const series = useMemo(() => {
    const tf = TIMEFRAMES.find((t) => t.id === active) ?? TIMEFRAMES[1];
    return buildSeries(tf);
  }, [active]);

  const { candles, labels, ma } = series;
  const last = candles[candles.length - 1];
  const first = candles[0];

  const high = Math.max(...candles.map((k) => k.h));
  const low = Math.min(...candles.map((k) => k.l));
  const changePct = ((last.c - first.o) / first.o) * 100;
  const up = changePct >= 0;

  const stats = [
    { label: "Last Price", value: fmt(last.c), color: up ? UP : DOWN },
    {
      label: "Session Change",
      value: `${up ? "+" : ""}${changePct.toFixed(2)}%`,
      color: up ? UP : DOWN,
    },
    { label: "Session High", value: fmt(high), color: "#FFFFFF" },
    { label: "Session Low", value: fmt(low), color: "#FFFFFF" },
  ];

  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const slot = chartW / CANDLES;
  const bodyW = Math.max(3, slot * 0.56);
  const xOf = (i: number) => PAD_LEFT + slot * (i + 0.5);

  const span = high - low || 0.01;
  const lo = low - span * 0.14;
  const hi = high + span * 0.14;
  const yOf = (v: number) =>
    PRICE_TOP + (1 - (v - lo) / (hi - lo)) * (PRICE_BOTTOM - PRICE_TOP);

  const step = niceStep(hi - lo);
  const ticks: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi; t += step) ticks.push(t);

  const maxV = Math.max(...candles.map((k) => k.v));
  const yVol = (v: number) => VOL_BOTTOM - (v / maxV) * (VOL_BOTTOM - VOL_TOP);

  const axisLine = "rgba(18,85,255,0.11)";
  const gridLines = Array.from(
    { length: Math.ceil(CANDLES / LABEL_EVERY) + 1 },
    (_, k) => Math.min(CANDLES, k * LABEL_EVERY),
  );

  const maPath = ma
    .map((v, i) => `${i === 0 ? "M" : "L"} ${xOf(i)} ${yOf(v)}`)
    .join(" ");

  const lastY = yOf(last.c);

  return (
    <div className="panel-glass overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(18,85,255,0.14)] px-6 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc97] opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-[#3ddc97]" />
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.1em] text-white">
            {symbol}
          </span>
          <span className="micro-label hidden sm:inline">{market}</span>
        </div>

        <div
          role="group"
          aria-label="Chart timeframe"
          className="flex items-center gap-1 rounded-xl border border-[rgba(18,85,255,0.2)] bg-[#0A1226]/80 p-1"
        >
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.id}
              type="button"
              onClick={() => setActive(tf.id)}
              aria-pressed={active === tf.id}
              className={`rounded-lg px-3 py-1.5 font-display text-[11px] font-semibold tracking-[0.14em] transition ${
                active === tf.id
                  ? "bg-[var(--blue-bright)] text-white shadow-[0_6px_18px_rgba(18,85,255,0.35)]"
                  : "text-[#8090B4] hover:text-white"
              }`}
            >
              {tf.id}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="grid grid-cols-2 gap-px border-b border-[rgba(18,85,255,0.14)] bg-[rgba(18,85,255,0.14)] sm:grid-cols-4 lg:w-56 lg:shrink-0 lg:grid-cols-1 lg:border-b-0 lg:border-r">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#070D1E] px-6 py-5">
              <p className="micro-label">{stat.label}</p>
              <p
                className="ticker-numeric mt-2 font-display text-lg"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 pt-5 text-[11px] md:px-8">
            <span className="font-display font-semibold tracking-[0.08em] text-white">
              {symbol}
              <span className="text-[#8A99C4]"> · {active}</span>
            </span>
            <span className="ticker-numeric text-[#8090B4]">
              O <span className="text-[#BCC7DF]">{fmt(last.o)}</span>
            </span>
            <span className="ticker-numeric text-[#8090B4]">
              H <span className="text-[#BCC7DF]">{fmt(last.h)}</span>
            </span>
            <span className="ticker-numeric text-[#8090B4]">
              L <span className="text-[#BCC7DF]">{fmt(last.l)}</span>
            </span>
            <span className="ticker-numeric text-[#8090B4]">
              C{" "}
              <span style={{ color: last.c >= last.o ? UP : DOWN }}>
                {fmt(last.c)}
              </span>
            </span>
            <span className="flex items-center gap-2 text-[#8090B4]">
              <span className="h-px w-5 bg-[#7FA8FF]" />
              {maLabel}
            </span>
          </div>

          <div className="overflow-x-auto px-2 pb-2 pt-1 md:px-4">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full min-w-[640px]"
              role="img"
              aria-label={`${symbol} candlestick chart on the ${active} timeframe with ${CANDLES} candles, moving average and volume`}
            >
              {ticks.map((t) => (
                <g key={t}>
                  <line
                    x1={PAD_LEFT}
                    y1={yOf(t)}
                    x2={W - PAD_RIGHT}
                    y2={yOf(t)}
                    stroke={axisLine}
                    strokeDasharray="3 7"
                  />
                  <text
                    x={W - PAD_RIGHT + 10}
                    y={yOf(t) + 4}
                    fontSize="11"
                    className="fill-[#8A99C4]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {fmt(t)}
                  </text>
                </g>
              ))}

              {gridLines.map((i) => (
                <line
                  key={`v-${i}`}
                  x1={xOf(Math.min(i, CANDLES - 1))}
                  y1={PRICE_TOP}
                  x2={xOf(Math.min(i, CANDLES - 1))}
                  y2={VOL_BOTTOM}
                  stroke="rgba(18,85,255,0.07)"
                />
              ))}

              <line
                x1={PAD_LEFT}
                y1={PANE_SPLIT}
                x2={W - PAD_RIGHT}
                y2={PANE_SPLIT}
                stroke="rgba(18,85,255,0.14)"
              />
              <text
                x={W - PAD_RIGHT + 10}
                y={VOL_TOP + 10}
                fontSize="9"
                letterSpacing="0.18em"
                className="fill-[#8A99C4]"
              >
                VOL
              </text>

              {candles.map((k, i) => {
                const rising = k.c >= k.o;
                const color = rising ? UP : DOWN;
                const top = yOf(Math.max(k.o, k.c));
                const bottom = yOf(Math.min(k.o, k.c));
                return (
                  <g key={i}>
                    <line
                      x1={xOf(i)}
                      y1={yOf(k.h)}
                      x2={xOf(i)}
                      y2={yOf(k.l)}
                      stroke={color}
                      strokeWidth="1.4"
                    />
                    <rect
                      x={xOf(i) - bodyW / 2}
                      y={top}
                      width={bodyW}
                      height={Math.max(1.5, bottom - top)}
                      fill={color}
                      rx="1"
                    />
                    <rect
                      x={xOf(i) - bodyW / 2}
                      y={yVol(k.v)}
                      width={bodyW}
                      height={Math.max(1, VOL_BOTTOM - yVol(k.v))}
                      fill={color}
                      opacity="0.38"
                      rx="1"
                    />
                  </g>
                );
              })}

              <path
                d={maPath}
                fill="none"
                stroke="#7FA8FF"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />

              <line
                x1={xOf(CANDLES - 1)}
                y1={PRICE_TOP}
                x2={xOf(CANDLES - 1)}
                y2={VOL_BOTTOM}
                stroke="rgba(127,168,255,0.3)"
                strokeDasharray="2 5"
              />

              <line
                x1={PAD_LEFT}
                y1={lastY}
                x2={W - PAD_RIGHT}
                y2={lastY}
                stroke={up ? UP : DOWN}
                strokeOpacity="0.5"
                strokeDasharray="4 6"
              />

              <circle
                cx={xOf(CANDLES - 1)}
                cy={lastY}
                r="10"
                fill={up ? UP : DOWN}
                opacity="0.16"
              />
              <circle
                cx={xOf(CANDLES - 1)}
                cy={lastY}
                r="3.5"
                fill={up ? UP : DOWN}
              />

              <rect
                x={W - PAD_RIGHT + 4}
                y={lastY - 11}
                width="76"
                height="22"
                rx="6"
                fill={up ? UP : DOWN}
              />
              <text
                x={W - PAD_RIGHT + 42}
                y={lastY + 4}
                fontSize="12"
                textAnchor="middle"
                fill="#04070F"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(last.c)}
              </text>

              {labels.map((label, i) =>
                i % LABEL_EVERY === 0 ? (
                  <text
                    key={`${label}-${i}`}
                    x={xOf(i)}
                    y={VOL_BOTTOM + 24}
                    fontSize="11"
                    textAnchor="middle"
                    className="fill-[#8A99C4]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {label}
                  </text>
                ) : null,
              )}
            </svg>
          </div>
        </div>
      </div>

      <p className="border-t border-[rgba(18,85,255,0.12)] px-6 py-5 text-[11px] leading-relaxed text-[#8090B4] md:px-8">
        {note}
      </p>
    </div>
  );
}
