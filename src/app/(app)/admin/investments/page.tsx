"use client";

import { useEffect, useState } from "react";
import { api, fmtUsd, fmtDate, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, EmptyState, Pager, inputCls } from "@/components/app/ui";

const STATUSES = ["", "ACTIVE", "CAPPED", "COMPLETED", "CANCELLED"];

export default function AdminInvestments() {
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await api.adminInvestments(page, 15, status || undefined);
      setList(r.data.investments);
      setTotalPages(r.data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  async function changeStatus(id: string, s: string) {
    try {
      await api.adminUpdateInvestmentStatus(id, s);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed");
    }
  }

  return (
    <>
      <PageHeader title="Investments" sub="Monitor and manage all user investments" />
      <Card
        title="All investments"
        action={
          <select className={inputCls + " !w-36 py-1.5 text-xs"} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s || "All statuses"}</option>
            ))}
          </select>
        }
      >
        {error && <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</p>}
        {loading ? (
          <Spinner />
        ) : list.length === 0 ? (
          <EmptyState title="No investments" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[#16233F] text-left text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">
                  <th className="pb-2 pr-4">User</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2 pr-4">Earned</th>
                  <th className="pb-2 pr-4">Cap</th>
                  <th className="pb-2 pr-4">Started</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((i) => (
                  <tr key={i.id} className="border-b border-[#101B34] last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-[#CBD6EC]">{i.user?.name}</p>
                      <p className="text-xs text-[#5F7099]">{i.user?.email}</p>
                    </td>
                    <td className="ticker-numeric py-3 pr-4">{fmtUsd(i.amount)}</td>
                    <td className="ticker-numeric py-3 pr-4 text-emerald-300">{fmtUsd(i.totalRoiEarned)}</td>
                    <td className="ticker-numeric py-3 pr-4 text-[#8FA3CC]">{fmtUsd(i.earningCap)}</td>
                    <td className="py-3 pr-4 text-[#8FA3CC]">{fmtDate(i.startedAt)}</td>
                    <td className="py-3 pr-4"><Badge value={i.status} /></td>
                    <td className="py-3">
                      <select
                        className="rounded-lg border border-[#24406E] bg-[#0A1226] px-2 py-1 text-xs text-[#9FB8EE]"
                        value=""
                        onChange={(e) => e.target.value && changeStatus(i.id, e.target.value)}
                      >
                        <option value="">Set…</option>
                        {["ACTIVE", "CAPPED", "COMPLETED", "CANCELLED"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager page={page} totalPages={totalPages} onPage={setPage} />
      </Card>
    </>
  );
}
