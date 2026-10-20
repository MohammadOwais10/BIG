"use client";

import { useEffect, useState } from "react";
import { api, fmtUsd, fmtDate } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, StatCard, Badge, Spinner, EmptyState, Pager } from "@/components/app/ui";

export default function RoiPage() {
  const [summary, setSummary] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.roiSummary().then((r) => setSummary(r.data)).catch(() => setSummary({}));
  }, []);

  const [daily, setDaily] = useState<any[]>([]);
  const [dailyLoading, setDailyLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .roiHistory(page, 15)
      .then((r) => {
        setHistory(r.data.earnings);
        setTotalPages(r.data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    setDailyLoading(true);
    api
      .myDailyRoi()
      .then((r) => setDaily(r.data.payouts))
      .catch(() => setDaily([]))
      .finally(() => setDailyLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="ROI" sub="Earnings history and daily ROI payouts" />

      <Card className="mb-6">
        <p className="text-[11px] leading-relaxed text-[#8FA3CC]">
          <span className="font-semibold text-[#E8EDFA]">How daily ROI works:</span> the admin
          publishes a rate every day (0.3334%–0.40%). Your daily ROI = investment principal ×
          that day&apos;s rate. Each investment runs a 30-day cycle targeting ~10% (capped at 12%).
          All earnings count toward your 10x income cap — top up to keep earning after it.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Current period"
          value={summary?.period ?? "—"}
          hint={summary?.currentRoiPercent ? `${summary.currentRoiPercent}% applicable` : "Global rate applies"}
        />
        <StatCard label="Total ROI earned" value={fmtUsd(summary?.totalRoiEarned)} accent />
        <StatCard label="ROI events" value={summary?.totalRoiEvents ?? "—"} />
        <StatCard
          label="This month"
          value={fmtUsd(
            (summary?.thisMonthEarnings ?? []).reduce(
              (s: number, e: any) => s + Number(e.roiAmount),
              0,
            ),
          )}
        />
      </div>

      <Card title="Earning history" className="mt-6">
        {loading ? (
          <Spinner />
        ) : history.length === 0 ? (
          <EmptyState
            title="No ROI earned yet"
            hint="ROI is credited monthly on active investments"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-[#16233F] text-left text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">
                  <th className="pb-2 pr-4">Period</th>
                  <th className="pb-2 pr-4">Investment</th>
                  <th className="pb-2 pr-4">Rate</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Processed</th>
                  <th className="pb-2 text-right">Earned</th>
                </tr>
              </thead>
              <tbody>
                {history.map((e) => (
                  <tr key={e.id} className="border-b border-[#101B34] last:border-0">
                    <td className="py-3 pr-4 font-medium text-[#CBD6EC]">{e.period}</td>
                    <td className="ticker-numeric py-3 pr-4 text-[#8FA3CC]">
                      {fmtUsd(e.investment?.amount)}
                    </td>
                    <td className="py-3 pr-4 text-[#8FA3CC]">{Number(e.roiPercent)}%</td>
                    <td className="py-3 pr-4">
                      <Badge value={e.investment?.status ?? "ACTIVE"} />
                    </td>
                    <td className="py-3 pr-4 text-[#8FA3CC]">{fmtDate(e.createdAt)}</td>
                    <td className="ticker-numeric py-3 text-right font-semibold text-emerald-300">
                      +{fmtUsd(e.roiAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager page={page} totalPages={totalPages} onPage={setPage} />
      </Card>

      <Card title="Daily ROI payouts" subtitle="Variable daily rate set by admin" className="mt-6">
        {dailyLoading ? (
          <Spinner />
        ) : daily.length === 0 ? (
          <EmptyState title="No daily payouts yet" hint="Admin publishes the daily rate each day" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-[#16233F] text-left text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Investment</th>
                  <th className="pb-2 pr-4">Principal</th>
                  <th className="pb-2 pr-4">Rate</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 text-right">Credited</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((p) => (
                  <tr key={p.id} className="border-b border-[#101B34] last:border-0">
                    <td className="py-3 pr-4 font-medium text-[#CBD6EC]">{String(p.roiDate).slice(0, 10)}</td>
                    <td className="ticker-numeric py-3 pr-4 text-[#8FA3CC]">{fmtUsd(p.investment?.amount)}</td>
                    <td className="ticker-numeric py-3 pr-4 text-[#8FA3CC]">{fmtUsd(p.eligiblePrincipal)}</td>
                    <td className="ticker-numeric py-3 pr-4 text-[#8FA3CC]">{Number(p.ratePercent)}%</td>
                    <td className="py-3 pr-4"><Badge value={p.status} /></td>
                    <td className="ticker-numeric py-3 text-right font-semibold text-emerald-300">+{fmtUsd(p.creditedAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
