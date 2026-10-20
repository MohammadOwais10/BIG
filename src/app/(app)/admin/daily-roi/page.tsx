"use client";

import { useEffect, useState } from "react";
import { api, fmtUsd, fmtDate, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, StatCard, Badge, Spinner, EmptyState, Pager, Field, inputCls, btnPrimary, btnGhost } from "@/components/app/ui";
import { useToast } from "@/components/app/toast";

const today = () => new Date().toISOString().slice(0, 10);
const pct = (v: any) => `${Number(v ?? 0).toFixed(4)}%`;

export default function DailyRoiPage() {
  const [date, setDate] = useState(today());
  const [rate, setRate] = useState("");
  const [reason, setReason] = useState("");
  const [cycle, setCycle] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [exclusions, setExclusions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [exUserId, setExUserId] = useState("");
  const [exReason, setExReason] = useState("");
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const [c, h, p, x] = await Promise.all([
        api.dailyRoiCycle(date),
        api.dailyRoiHistory(1, 10),
        api.dailyRoiPayouts(date, page, 15),
        api.dailyRoiExclusions(date),
      ]);
      setCycle(c.data);
      setHistory(h.data.rates);
      setPayouts(p.data.payouts);
      setTotalPages(p.data.totalPages || 1);
      setExclusions(x.data.exclusions ?? []);
      if (c.data.rate) setRate(String(c.data.rate.ratePercent));
      setValidation(null);
    } catch {
      /* keep previous state */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    api.adminUsers(1, 100).then((r) => setUsers(r.data.users ?? [])).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, page]);

  async function run(action: () => Promise<any>, okText: string) {
    setBusy(true);
    setMsg(null);
    try {
      const r = await action();
      setMsg({ ok: true, text: r.message || okText });
      toast(r.message || okText, "success");
      await load();
      return r;
    } catch (e) {
      const text = e instanceof ApiError ? e.message : "Failed";
      setMsg({ ok: false, text });
      toast(text, "error");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function validate() {
    setBusy(true);
    setMsg(null);
    try {
      const r = await api.dailyRoiValidate({ roiDate: date, ratePercent: Number(rate) });
      setValidation(r.data);
      if (r.data.valid) toast(`Rate valid — projected cycle-end ~${pct(r.data.projections.projectedEndPercent)}`, "info");
      else toast(r.data.errors[0] ?? "Invalid rate", "error");
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Validation failed", "error");
    } finally {
      setBusy(false);
    }
  }

  const proj = cycle?.projections;
  const currentRate = cycle?.rate;
  const locked = currentRate && ["PROCESSED", "LOCKED"].includes(currentRate.status);

  return (
    <>
      <PageHeader title="Daily ROI Management" sub="Variable daily rate · 30-day cycle · 10%–12% monthly target" />

      <Card className="mb-6">
        <p className="text-[11px] leading-relaxed text-[#8FA3CC]">
          <span className="font-semibold text-[#E8EDFA]">Workflow:</span> pick a date → save a draft
          rate within the allowed range → validate → publish → process payouts. Every eligible
          investment gets <span className="text-emerald-300">principal × rate%</span> for that date.
          Published rates are immutable and payouts are idempotent — re-processing is safe and
          never double-credits. The 10% minimum is a monitored target, not a guaranteed yield.
        </p>
      </Card>

      {/* Cycle stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Eligible principal" value={fmtUsd(proj?.totalEligiblePrincipal)} accent />
        <StatCard label="Est. daily payout" value={fmtUsd(proj?.estimatedDailyPayout)} />
        <StatCard label="Paid this cycle" value={fmtUsd(proj?.paidThisCycle)} />
        <StatCard label="Projected cycle-end" value={pct(proj?.projectedEndPercent)} accent />
        <StatCard label="Min achievable" value={pct(proj?.projectedMinPercent)} />
        <StatCard label="Max achievable" value={pct(proj?.projectedMaxPercent)} />
        <StatCard label="Remaining days (min–max)" value={proj ? `${proj.minRemainingDays}–${proj.maxRemainingDays}` : "—"} />
        <StatCard
          label={`Rate for ${date}`}
          value={currentRate ? pct(currentRate.ratePercent) : "—"}
          accent={currentRate?.status === "PUBLISHED"}
        />
      </div>

      {/* Smart rate suggestion + weekend note */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {proj?.suggestion?.suggested != null && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs">
            <span className="text-emerald-300 font-semibold">
              Suggested today: {pct(proj.suggestion.suggested)}
            </span>
            <span className="text-[#8FA3CC]">
              {proj.suggestion.noInvestments
                ? " · no active investments — default min rate"
                : ` · range ${pct(proj.suggestion.suggestedMin)}–${pct(proj.suggestion.suggestedMax)} · ${proj.suggestion.remainingWorkdays} working days left in cycle`}
            </span>
            <button
              className="ml-3 rounded-md border border-emerald-500/40 px-2 py-0.5 text-[10px] text-emerald-300 hover:bg-emerald-500/10"
              onClick={() => setRate(String(proj.suggestion.suggested))}
            >
              Use suggested
            </button>
          </div>
        )}
        {proj?.isWeekend && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
            Weekend — this date normally carries no ROI payout
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Rate control */}
        <Card title="Set daily rate" subtitle={cycle ? `Allowed range: ${cycle.projections.limits.min}% – ${cycle.projections.limits.max}%` : undefined}>
          <div className="space-y-4">
            <Field label="ROI date">
              <input type="date" className={inputCls} value={date} onChange={(e) => { setDate(e.target.value); setPage(1); }} />
            </Field>
            <Field label="Daily ROI %">
              <input
                type="number"
                step="0.000001"
                min={Number(proj?.limits?.min ?? 0.1)}
                max={Number(proj?.limits?.max ?? 1)}
                className={inputCls}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0.35"
                disabled={locked}
              />
            </Field>
            <Field label="Reason (optional)">
              <input className={inputCls} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Rate rationale" disabled={locked} />
            </Field>

            {locked && (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
                This rate is {currentRate.status} — payouts exist, so it cannot be changed.
              </p>
            )}

            {msg && (
              <p className={`rounded-lg border px-4 py-2.5 text-sm ${msg.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
                {msg.text}
              </p>
            )}

            {/* Validation results */}
            {validation && (
              <div className={`rounded-xl border p-4 text-xs ${validation.valid ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                <p className={`mb-2 font-semibold ${validation.valid ? "text-emerald-300" : "text-red-300"}`}>
                  {validation.valid ? "Rate is valid — safe to publish" : "Rate rejected"}
                </p>
                {validation.errors.map((e: string, i: number) => (
                  <p key={i} className="text-red-300">• {e}</p>
                ))}
                {validation.warnings.map((w: string, i: number) => (
                  <p key={i} className="text-amber-300">⚠ {w}</p>
                ))}
                <p className="mt-2 text-[#8FA3CC]">
                  Projected cycle-end: {pct(validation.projections.projectedEndPercent)} ·
                  min {pct(validation.projections.projectedMinPercent)} ·
                  max {pct(validation.projections.projectedMaxPercent)} ·
                  est. payout {fmtUsd(validation.projections.estimatedDailyPayout)}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                disabled={busy || locked || !rate}
                onClick={() => run(() => api.dailyRoiSaveDraft({ roiDate: date, ratePercent: Number(rate), reason: reason || undefined }), "Draft saved")}
                className={btnGhost}
              >
                Save draft
              </button>
              <button disabled={busy || locked || !rate} onClick={validate} className={btnGhost}>
                Validate rate
              </button>
              <button
                disabled={busy || locked || !rate}
                onClick={() => run(() => api.dailyRoiPublish({ roiDate: date, ratePercent: Number(rate), reason: reason || undefined }), "Rate published")}
                className={btnPrimary}
              >
                Publish ROI
              </button>
            </div>

            {currentRate?.status === "PUBLISHED" && (
              <>
                <button
                  disabled={busy}
                  onClick={() => run(() => api.dailyRoiProcess(date), "Payouts processed")}
                  className={`${btnPrimary} w-full !border-emerald-500/50 !text-emerald-300`}
                >
                  Process payouts for {date}
                </button>
                <p className="text-[10px] text-[#5F7099]">
                  You can process any time — wallets are credited between 6:00–8:00 PM.
                  Outside the window the request is queued and runs automatically.
                </p>
              </>
            )}
          </div>
        </Card>

        {/* Rate history */}
        <Card title="Rate history" subtitle="Published rates are never overwritten">
          {loading ? (
            <Spinner />
          ) : history.length === 0 ? (
            <EmptyState title="No rates yet" />
          ) : (
            <ul className="space-y-2">
              {history.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 px-4 py-3">
                  <div>
                    <p className="ticker-numeric font-display text-base font-semibold text-[#E8EDFA]">{pct(r.ratePercent)}</p>
                    <p className="text-[11px] text-[#5F7099]">
                      {String(r.roiDate).slice(0, 10)}
                      {r.previousRate != null && <span> · prev {pct(r.previousRate)}</span>}
                      {r.reason && <span> · {r.reason}</span>}
                    </p>
                  </div>
                  <Badge value={r.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Per-date user exclusions */}
      <Card
        title={`Excluded users — ${date}`}
        subtitle="Selected users get no ROI for this date (recorded as SKIPPED; re-add + reprocess to restore)"
        className="mt-6"
      >
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <Field label="User">
              <select className={inputCls} value={exUserId} onChange={(e) => setExUserId(e.target.value)}>
                <option value="">Select user…</option>
                {users
                  .filter((u) => !exclusions.some((x) => x.userId === u.id))
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} · {u.email}
                    </option>
                  ))}
              </select>
            </Field>
          </div>
          <div className="min-w-[180px] flex-1">
            <Field label="Reason (optional)">
              <input className={inputCls} value={exReason} onChange={(e) => setExReason(e.target.value)} placeholder="Why excluded" />
            </Field>
          </div>
          <button
            className={btnGhost}
            disabled={busy || !exUserId}
            onClick={() =>
              run(
                () => api.dailyRoiSetExclusion({ roiDate: date, userId: exUserId, excluded: true, reason: exReason || undefined }),
                "User excluded"
              ).then(() => { setExUserId(""); setExReason(""); })
            }
          >
            Exclude for this date
          </button>
        </div>
        {exclusions.length === 0 ? (
          <p className="text-xs text-[#5F7099]">No exclusions — every eligible user gets ROI for this date.</p>
        ) : (
          <ul className="divide-y divide-[#16233F]">
            {exclusions.map((x) => (
              <li key={x.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#CBD6EC]">{x.user?.name}</p>
                  <p className="truncate text-xs text-[#5F7099]">{x.user?.email}{x.reason ? ` · ${x.reason}` : ""}</p>
                </div>
                <button
                  className="text-xs text-red-300 hover:underline"
                  disabled={busy}
                  onClick={() =>
                    run(() => api.dailyRoiSetExclusion({ roiDate: date, userId: x.userId, excluded: false }), "Exclusion removed")
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Payouts for the selected date */}
      <div className="mt-6">
        <Card title={`Payouts — ${date}`}>
          {loading ? (
            <Spinner />
          ) : payouts.length === 0 ? (
            <EmptyState title="No payouts for this date" hint="Publish a rate and process payouts" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-[#16233F] text-left text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">
                    <th className="pb-2 pr-4">User</th>
                    <th className="pb-2 pr-4">Principal</th>
                    <th className="pb-2 pr-4">Rate</th>
                    <th className="pb-2 pr-4">Credited</th>
                    <th className="pb-2 pr-4">Cycle</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id} className="border-b border-[#101B34] last:border-0">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-[#CBD6EC]">{p.user?.name}</p>
                        <p className="text-xs text-[#5F7099]">{p.user?.email}</p>
                      </td>
                      <td className="ticker-numeric py-3 pr-4 text-[#8FA3CC]">{fmtUsd(p.eligiblePrincipal)}</td>
                      <td className="ticker-numeric py-3 pr-4 text-[#8FA3CC]">{pct(p.ratePercent)}</td>
                      <td className="ticker-numeric py-3 pr-4 font-semibold text-emerald-300">+{fmtUsd(p.creditedAmount)}</td>
                      <td className="py-3 pr-4 text-[#8FA3CC]">#{p.cycleIndex + 1}</td>
                      <td className="py-3">
                        <Badge value={p.status} />
                        {p.failureReason && <p className="mt-0.5 text-[10px] text-red-300/80">{p.failureReason}</p>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pager page={page} totalPages={totalPages} onPage={setPage} />
        </Card>
      </div>
    </>
  );
}
