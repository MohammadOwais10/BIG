"use client";

import { useEffect, useState } from "react";
import { api, fmtUsd, fmtDate } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, EmptyState, Pager, inputCls } from "@/components/app/ui";

const TYPES = [
  "",
  "DEPOSIT",
  "INVESTMENT",
  "ROI",
  "DIRECT_COMMISSION",
  "LEVEL_COMMISSION",
  "WITHDRAWAL",
  "WITHDRAWAL_FEE",
  "TOP_UP",
  "REFUND",
  "ADMIN_ADJUSTMENT",
];

export default function AdminTransactions() {
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .adminTransactions(page, 20, type || undefined, userId || undefined)
      .then((r) => {
        setList(r.data.transactions);
        setTotalPages(r.data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page, type, userId]);

  return (
    <>
      <PageHeader title="Ledger" sub="Every wallet transaction across the platform" />
      <Card
        title="Transactions"
        action={
          <div className="flex gap-2">
            <input
              className={inputCls + " !w-44 py-1.5 text-xs"}
              placeholder="Filter by user ID"
              value={userId}
              onChange={(e) => { setUserId(e.target.value); setPage(1); }}
            />
            <select className={inputCls + " !w-40 py-1.5 text-xs"} value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t ? t.replaceAll("_", " ") : "All types"}</option>
              ))}
            </select>
          </div>
        }
      >
        {loading ? (
          <Spinner />
        ) : list.length === 0 ? (
          <EmptyState title="No transactions" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[#16233F] text-left text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">
                  <th className="pb-2 pr-4">User</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Direction</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {list.map((t) => (
                  <tr key={t.id} className="border-b border-[#101B34] last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-[#CBD6EC]">{t.user?.name}</p>
                      <p className="text-xs text-[#5F7099]">{t.user?.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-[#CBD6EC]">{t.type.replaceAll("_", " ")}</td>
                    <td className="py-3 pr-4"><Badge value={t.direction} /></td>
                    <td className="py-3 pr-4"><Badge value={t.status} /></td>
                    <td className="py-3 pr-4 text-[#8FA3CC]">{fmtDate(t.createdAt)}</td>
                    <td className={`ticker-numeric py-3 text-right font-semibold ${t.direction === "CREDIT" ? "text-emerald-300" : "text-red-300"}`}>
                      {t.direction === "CREDIT" ? "+" : "−"}{fmtUsd(t.amount)}
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
