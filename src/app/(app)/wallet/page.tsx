"use client";

import { useEffect, useState } from "react";
import { api, fmtUsd, fmtDate } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, StatCard, Badge, Spinner, EmptyState, Pager, inputCls } from "@/components/app/ui";

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

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [tx, setTx] = useState<any[]>([]);
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.wallet().then((r) => setWallet(r.data.wallet)),
      api.transactions(page, 15, type || undefined).then((r) => {
        setTx(r.data.transactions);
        setTotalPages(r.data.totalPages || 1);
      }),
    ]).finally(() => setLoading(false));
  }, [page, type]);

  return (
    <>
      <PageHeader title="Wallet" sub="Balances and the immutable transaction ledger" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Available balance" value={fmtUsd(wallet?.availableBalance)} accent />
        <StatCard label="Locked (withdrawals)" value={fmtUsd(wallet?.lockedBalance)} />
        <StatCard
          label="Total"
          value={fmtUsd(Number(wallet?.availableBalance ?? 0) + Number(wallet?.lockedBalance ?? 0))}
        />
      </div>

      <Card
        title="Transaction ledger"
        className="mt-6"
        action={
          <select className={inputCls + " !w-auto py-1.5 text-xs"} value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t ? t.replaceAll("_", " ") : "All types"}
              </option>
            ))}
          </select>
        }
      >
        {loading ? (
          <Spinner />
        ) : tx.length === 0 ? (
          <EmptyState title="No transactions" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-[#16233F] text-left text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Description</th>
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {tx.map((t) => (
                  <tr key={t.id} className="border-b border-[#101B34] last:border-0">
                    <td className="py-3 pr-4 font-medium text-[#CBD6EC]">
                      {t.type.replaceAll("_", " ")}
                    </td>
                    <td className="py-3 pr-4 text-[#8FA3CC]">{t.description ?? "—"}</td>
                    <td className="py-3 pr-4 text-[#8FA3CC]">{fmtDate(t.createdAt)}</td>
                    <td className="py-3 pr-4">
                      <Badge value={t.status} />
                    </td>
                    <td
                      className={`ticker-numeric py-3 text-right font-semibold ${
                        t.direction === "CREDIT" ? "text-emerald-300" : "text-red-300"
                      }`}
                    >
                      {t.direction === "CREDIT" ? "+" : "−"}
                      {fmtUsd(t.amount)}
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
