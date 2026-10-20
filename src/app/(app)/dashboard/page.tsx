"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, fmtUsd } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/app/app-shell";
import { Card, StatCard, Badge, Spinner, EmptyState, btnPrimary, btnGhost } from "@/components/app/ui";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [dailyRoi, setDailyRoi] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any>(null);
  const [refStats, setRefStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    api.dashboard().then((r) => setData(r.data)).catch(() => setData({}));
    api.transactions(1, 6).then((r) => setRecentTx(r.data.transactions)).catch(() => {});
    api.myDailyRoi(1, 5).then((r) => setDailyRoi(r.data.payouts)).catch(() => {});
    api.myRewards().then((r) => setRewards(r.data)).catch(() => {});
    api.referralStats().then((r) => setRefStats(r.data)).catch(() => {});
  }, []);

  const referralLink = user
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${user.referralCode}`
    : "";

  const nextRank = rewards?.ranks?.find((r: any) => !r.claimed && !r.qualified);
  const claimedCount = rewards?.ranks?.filter((r: any) => r.claimed).length ?? 0;
  const unlockedLv = refStats?.unlockedLevels ?? 0;
  const referralIncome =
    Number(data?.totalDirectIncome ?? 0) + Number(data?.totalLevelIncome ?? 0);

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0] ?? "there"}`}
        sub="Your investment overview"
      />

      {!data ? (
        <Spinner />
      ) : (
        <>
          {/* Row 1: Balance hero + key stats */}
          <div className="grid gap-4 lg:grid-cols-4">
            <Card className="lg:col-span-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5F7099]">
                Wallet balance
              </p>
              <p className="ticker-numeric mt-2 font-display text-3xl font-bold text-[#7FA8FF]">
                {fmtUsd(data.walletBalance)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/deposit" className={btnPrimary}>Deposit</Link>
                <Link href="/invest" className={btnGhost}>Invest</Link>
                <Link href="/withdraw" className={btnGhost}>Withdraw</Link>
              </div>
            </Card>
            <StatCard label="Total invested" value={fmtUsd(data.totalInvestment)} />
            <StatCard label="Total ROI earned" value={fmtUsd(data.totalRoi)} accent />
            <StatCard
              label="Team income (total)"
              value={fmtUsd(referralIncome)}
              hint={`Direct + level · ${data.teamSize ?? 0} team members`}
            />
          </div>

          {/* Row 2: income breakdown */}
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard label="Direct income (5%)" value={fmtUsd(data.totalDirectIncome)} />
            <StatCard label="Level income" value={fmtUsd(data.totalLevelIncome)} />
            <StatCard label="Rank rewards" value={fmtUsd(rewards?.totalEarned)} />
            <StatCard label="Withdrawn" value={fmtUsd(data.totalWithdrawal)} />
            <StatCard label="Active investments" value={data.activeInvestments ?? 0} />
          </div>

          {/* Row 3: progress widgets */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Daily ROI */}
            <Card title="Daily ROI" subtitle="Latest daily payouts">
              {dailyRoi.length === 0 ? (
                <EmptyState title="No daily ROI yet" hint="Admin publishes the daily rate" />
              ) : (
                <ul className="divide-y divide-[#16233F]">
                  {dailyRoi.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="ticker-numeric text-sm font-medium text-[#CBD6EC]">
                          {String(p.roiDate).slice(0, 10)}
                        </p>
                        <p className="text-[10px] text-[#5F7099]">
                          {fmtUsd(p.eligiblePrincipal)} @ {Number(p.ratePercent)}%
                        </p>
                      </div>
                      <span className="ticker-numeric text-sm font-semibold text-emerald-300">
                        +{fmtUsd(p.creditedAmount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Rank progress */}
            <Card
              title="Rank progress"
              subtitle={nextRank ? `Next: Rank ${nextRank.rank} — ${fmtUsd(nextRank.reward)}` : "All ranks claimed"}
            >
              <div className="mb-3 flex items-center gap-1">
                {rewards?.ranks?.map((r: any) => (
                  <div
                    key={r.rank}
                    title={`Rank ${r.rank} — ${fmtUsd(r.reward)}`}
                    className={`h-2 flex-1 rounded-full ${
                      r.claimed ? "bg-emerald-400" : r.qualified ? "bg-amber-400" : "bg-[#1C2C50]"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-[#8FA3CC]">
                {claimedCount}/10 ranks claimed · {rewards?.activeDirects ?? 0} active directs ·{" "}
                {rewards?.legs?.length ?? 0} legs
              </p>
              {nextRank && (
                <p className="mt-2 text-xs text-[#5F7099]">
                  Need {nextRank.directsRequired} directs +{" "}
                  {nextRank.alternatives.map((a: any) => `${a.count} legs × ${fmtUsd(a.volume)}`).join(" or ")}
                </p>
              )}
              <Link href="/rewards" className="mt-3 inline-block text-xs font-semibold text-[#7FA8FF] hover:underline">
                View rank details →
              </Link>
            </Card>

            {/* Level unlocks */}
            <Card title="Level income" subtitle={`${unlockedLv}/20 levels earning`}>
              <div className="mb-3 flex flex-wrap gap-1">
                {refStats?.levelUnlocks?.map((l: any) => (
                  <div
                    key={l.level}
                    title={`L${l.level} — ${l.percent}% of downline ROI`}
                    className={`h-6 w-6 rounded-md text-center text-[9px] font-bold leading-6 ${
                      l.unlocked
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-[#101B34] text-[#5F7099]"
                    }`}
                  >
                    {l.level}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#5F7099]">
                Each member in the chain needs 2 directs (L1–5) or 1 direct (L6–20) for income to flow up.
              </p>
              <Link href="/team" className="mt-3 inline-block text-xs font-semibold text-[#7FA8FF] hover:underline">
                View team →
              </Link>
            </Card>
          </div>

          {/* Row 4: referral + activity */}
          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            <Card title="Your referral link" subtitle="Earn 5% on every direct referral's investment" className="lg:col-span-2">
              <div className="space-y-3">
                <div className="rounded-xl border border-[#24406E] bg-[#0A1226] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5F7099]">
                    Share this link
                  </p>
                  <p className="mt-1 break-all font-mono text-xs leading-relaxed text-[#7FA8FF]">
                    {referralLink}
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 px-4 py-2.5">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#5F7099]">
                    Referral code
                  </span>
                  <code className="font-mono text-sm font-semibold text-[#E8EDFA]">
                    {user?.referralCode}
                  </code>
                </div>
                <div className="flex gap-2">
                  <button
                    className={btnGhost}
                    onClick={() => {
                      navigator.clipboard?.writeText(user?.referralCode ?? "");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                  >
                    {copied ? "Copied!" : "Copy code"}
                  </button>
                  <button
                    className={btnGhost}
                    onClick={() => {
                      navigator.clipboard?.writeText(referralLink);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 1500);
                    }}
                  >
                    {copiedLink ? "Copied!" : "Copy link"}
                  </button>
                </div>
              </div>
            </Card>

            <Card title="Recent activity" className="lg:col-span-3">
              {recentTx.length === 0 ? (
                <EmptyState title="No transactions yet" hint="Make your first investment to get started" />
              ) : (
                <ul className="divide-y divide-[#16233F]">
                  {recentTx.map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#E8EDFA]">
                          {t.type.replaceAll("_", " ")}
                        </p>
                        <p className="text-xs text-[#5F7099]">{new Date(t.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <Badge value={t.status} />
                        <span
                          className={`ticker-numeric text-sm font-semibold ${
                            t.direction === "CREDIT" ? "text-emerald-300" : "text-red-300"
                          }`}
                        >
                          {t.direction === "CREDIT" ? "+" : "−"}
                          {fmtUsd(t.amount)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/wallet" className="mt-4 inline-block text-xs font-semibold text-[#7FA8FF] hover:underline">
                View all transactions →
              </Link>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
