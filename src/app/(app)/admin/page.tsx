"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, fmtUsd } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, StatCard, Spinner, btnGhost } from "@/components/app/ui";

const today = () => new Date().toISOString().slice(0, 10);

export default function AdminDashboard() {
  const [s, setS] = useState<any>(null);
  const [cycle, setCycle] = useState<any>(null);

  useEffect(() => {
    api.adminDashboard().then((r) => setS(r.data)).catch(() => setS({}));
    api.dailyRoiCycle(today()).then((r) => setCycle(r.data)).catch(() => {});
  }, []);

  if (!s) return <Spinner label="Loading platform stats…" />;

  const netFlow = Number(s.totalDeposits ?? 0) - Number(s.totalPaidOut ?? 0);
  const rate = cycle?.rate;

  return (
    <>
      <PageHeader title="Admin overview" sub="Platform-wide statistics" />

      {/* Action queue */}
      <Card title="Action queue" subtitle="Items needing admin attention" className="mb-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/admin/withdrawals" className="rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 px-4 py-3 hover:border-[#2F4C85]">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">Pending withdrawals</p>
            <p className={`ticker-numeric mt-1 font-display text-2xl font-bold ${s.pendingWithdrawals > 0 ? "text-amber-300" : "text-[#E8EDFA]"}`}>
              {s.pendingWithdrawals}
            </p>
          </Link>
          <Link href="/admin/deposits" className="rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 px-4 py-3 hover:border-[#2F4C85]">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">Pending deposits</p>
            <p className={`ticker-numeric mt-1 font-display text-2xl font-bold ${s.pendingDeposits > 0 ? "text-amber-300" : "text-[#E8EDFA]"}`}>
              {s.pendingDeposits ?? 0}
            </p>
          </Link>
          <Link href="/admin/daily-roi" className="rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 px-4 py-3 hover:border-[#2F4C85]">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">Today's daily ROI</p>
            <p className="ticker-numeric mt-1 font-display text-2xl font-bold text-[#E8EDFA]">
              {rate ? `${Number(rate.ratePercent)}%` : "—"}
            </p>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${rate?.status === "PUBLISHED" || rate?.status === "PROCESSED" ? "text-emerald-300" : "text-amber-300"}`}>
              {rate ? rate.status : "Not set"}
            </p>
          </Link>
        </div>
      </Card>

      {/* Money flow */}
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5F7099]">Money flow</p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="USDT deposited" value={fmtUsd(s.totalDeposits)} accent />
        <StatCard label="Invested volume" value={fmtUsd(s.totalPlatformVolume)} accent />
        <StatCard label="Total paid out" value={fmtUsd(s.totalPaidOut)} />
        <StatCard label="Net inflow" value={fmtUsd(netFlow)} />
      </div>

      {/* Distributed */}
      <p className="mb-3 mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5F7099]">Distributed to users</p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Daily ROI" value={fmtUsd(s.totalDailyRoi)} accent />
        <StatCard label="ROI (legacy)" value={fmtUsd(s.totalRoiDistributed)} />
        <StatCard label="Direct commissions" value={fmtUsd(s.totalDirectCommissions)} />
        <StatCard label="Level commissions" value={fmtUsd(s.totalLevelCommissions)} />
        <StatCard label="Rank rewards" value={fmtUsd(s.totalRankRewards)} hint={`${s.rankRewardsCount ?? 0} claimed`} />
      </div>

      {/* Users & investments */}
      <p className="mb-3 mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5F7099]">Users & investments</p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total users" value={s.totalUsers} />
        <StatCard label="Active users" value={s.activeUsers} accent />
        <StatCard label="Total investments" value={s.totalInvestments} />
        <StatCard label="Active investments" value={s.activeInvestments} />
        <StatCard label="Completed withdrawals" value={s.completedWithdrawals} />
      </div>
    </>
  );
}
