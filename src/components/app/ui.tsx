"use client";

import { useState, type ReactNode } from "react";

export function Card({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`surface rounded-2xl ${className}`}>
      {(title || action) && (
        <div className="surface-head flex flex-wrap items-center justify-between gap-3 rounded-t-2xl px-5 py-4">
          <div className="min-w-0">
            {title && (
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-[#E8EDFA]">
                {title}
              </h3>
            )}
            {subtitle && <p className="mt-0.5 text-xs text-[#8FA3CC]">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="surface surface-hover rounded-2xl p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8FA3CC]">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-xl font-semibold ticker-numeric sm:text-2xl ${
          accent ? "blue-text" : "text-[#E8EDFA]"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-[#5F7099]">{hint}</p>}
    </div>
  );
}

const badgeColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  PENDING: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  APPROVED: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  PROCESSING: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  REJECTED: "bg-red-500/15 text-red-300 border-red-500/30",
  CANCELLED: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  CAPPED: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  SUSPENDED: "bg-red-500/15 text-red-300 border-red-500/30",
  INACTIVE: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  ADMIN: "bg-[#1255FF]/15 text-[#7FA8FF] border-[#1255FF]/40",
  USER: "bg-[#1255FF]/10 text-[#9FB8EE] border-[#24406E]",
  CREDIT: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  DEBIT: "bg-red-500/15 text-red-300 border-red-500/30",
};

export function Badge({ value }: { value: string }) {
  const cls = badgeColors[value] ?? "bg-[#1255FF]/10 text-[#9FB8EE] border-[#24406E]";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${cls}`}
    >
      {value}
    </span>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-sm text-[#8FA3CC]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#24406E] border-t-[#1255FF]" />
      {label}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#24406E] px-6 py-10 text-center">
      <p className="text-sm font-medium text-[#CBD6EC]">{title}</p>
      {hint && <p className="mt-1 text-xs text-[#5F7099]">{hint}</p>}
    </div>
  );
}

export function Pager({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-xs text-[#8FA3CC]">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="rounded-lg border border-[#24406E] px-3 py-1.5 transition enabled:hover:border-[#1255FF] disabled:opacity-40"
        >
          Prev
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="rounded-lg border border-[#24406E] px-3 py-1.5 transition enabled:hover:border-[#1255FF] disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8FA3CC]">
        {label}
      </span>
      {children}
      {hint && <p className="mt-1 text-xs text-[#5F7099]">{hint}</p>}
    </label>
  );
}

export function Copyable({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <span className="inline-flex max-w-full items-center gap-1.5">
      {label && <span className="text-[10px] uppercase tracking-wider text-[#5F7099]">{label}</span>}
      <span className="truncate font-mono text-[11px] text-[#7FA8FF]">
        {value.slice(0, 12)}…{value.slice(-8)}
      </span>
      <button
        type="button"
        title="Copy"
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="text-[10px] font-semibold uppercase tracking-wider text-[#5F7099] transition hover:text-[#7FA8FF]"
      >
        {copied ? "✓" : "copy"}
      </button>
    </span>
  );
}

export const inputCls =
  "w-full rounded-xl border border-[#24406E] bg-[#0A1226] px-4 py-2.5 text-sm text-[#E8EDFA] outline-none transition placeholder:text-[#45567E] focus:border-[#1255FF] focus:ring-2 focus:ring-[#1255FF]/25";

export const btnPrimary =
  "blue-border relative overflow-hidden rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#7FA8FF] transition hover:shadow-[0_0_40px_rgba(18,85,255,0.3)] disabled:opacity-50";

export const btnGhost =
  "rounded-xl border border-[#24406E] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#9FB8EE] transition hover:border-[#1255FF] disabled:opacity-50";
