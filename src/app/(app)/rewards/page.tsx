"use client";

import { useEffect, useState } from "react";
import { api, fmtUsd, fmtDate } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, StatCard, Spinner, EmptyState, Copyable } from "@/components/app/ui";

export default function RewardsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .myRewards()
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader title="Rank Rewards" sub="One-time milestone rewards from your team volume" />
        <Spinner />
      </>
    );
  }

  const nextRank = data?.ranks?.find((r: any) => !r.claimed && !r.qualified);

  return (
    <>
      <PageHeader title="Rank Rewards" sub="Grow directs + leg volume to unlock one-time rewards" />

      <Card className="mb-6">
        <p className="text-[11px] leading-relaxed text-[#8FA3CC]">
          <span className="font-semibold text-[#E8EDFA]">How it works:</span> every direct referral is
          one <span className="text-emerald-300">leg</span>. A leg&apos;s volume is the total
          investment of that member&apos;s whole team. When you reach the required directs and enough
          legs cross the volume target, the reward is credited{" "}
          <span className="text-[#E8EDFA]">once — automatically</span>. Rewards count toward your 10x
          income cap.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active directs" value={data?.activeDirects ?? "—"} />
        <StatCard label="Legs" value={data?.legs?.length ?? "—"} />
        <StatCard label="Rewards earned" value={fmtUsd(data?.totalEarned)} accent />
        <StatCard
          label="Next rank"
          value={nextRank ? `Rank ${nextRank.rank}` : "—"}
          hint={
            nextRank
              ? `${data?.activeDirects ?? 0}/${nextRank.directsRequired} directs · ${fmtUsd(nextRank.reward)} reward`
              : "All ranks achieved"
          }
        />
      </div>

      {/* Next rank progress */}
      {nextRank && data?.legs?.length > 0 && (
        <Card title={`Progress to Rank ${nextRank.rank}`} className="mt-6">
          <div className="space-y-3">
            <p className="text-xs text-[#8FA3CC]">
              Directs:{" "}
              <span className={data.activeDirects >= nextRank.directsRequired ? "text-emerald-300" : "text-amber-300"}>
                {data.activeDirects}/{nextRank.directsRequired}
              </span>
            </p>
            {nextRank.alternatives.map((alt: any, i: number) => {
              const qualifying = data.legs.filter((l: any) => Number(l.volume) >= Number(alt.volume)).length;
              const pct = Math.min(100, Math.round((qualifying / alt.count) * 100));
              return (
                <div key={i}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-[#8FA3CC]">
                      Option {nextRank.alternatives.length > 1 ? String.fromCharCode(65 + i) : ""} — {alt.count} legs × {fmtUsd(alt.volume)}
                    </span>
                    <span className={qualifying >= alt.count ? "text-emerald-300" : "text-[#5F7099]"}>
                      {qualifying}/{alt.count} legs
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#0A1226]">
                    <div
                      className={`h-1.5 rounded-full ${qualifying >= alt.count ? "bg-emerald-400" : "bg-[#1255FF]"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Rank table */}
      <Card title="Rank milestones" className="mt-6">
        {!data?.ranks?.length ? (
          <EmptyState title="No rank data" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[#16233F] text-left text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">
                  <th className="pb-2 pr-4">Rank</th>
                  <th className="pb-2 pr-4">Directs</th>
                  <th className="pb-2 pr-4">Leg volume needed</th>
                  <th className="pb-2 pr-4">Reward</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.ranks.map((r: any) => (
                  <tr key={r.rank} className="border-b border-[#101B34] last:border-0">
                    <td className="py-3 pr-4 font-semibold text-[#CBD6EC]">Rank {r.rank}</td>
                    <td className="ticker-numeric py-3 pr-4 text-[#8FA3CC]">
                      {r.directsRequired}
                      <span className={`ml-1 text-[10px] ${data.activeDirects >= r.directsRequired ? "text-emerald-300" : "text-red-300/70"}`}>
                        ({data.activeDirects})
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-[#8FA3CC]">
                      {r.alternatives.map((a: any, i: number) => (
                        <span key={i}>
                          {i > 0 && <span className="text-[#5F7099]"> or </span>}
                          {a.count} legs × {fmtUsd(a.volume)}
                        </span>
                      ))}
                    </td>
                    <td className="ticker-numeric py-3 pr-4 font-semibold text-emerald-300">{fmtUsd(r.reward)}</td>
                    <td className="py-3">
                      {r.claimed ? (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                          Claimed
                        </span>
                      ) : r.qualified ? (
                        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          Qualified
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider text-[#5F7099]">Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Leg volumes */}
      <Card title="Your legs" subtitle="Each direct referral is one leg — volume = total team investment" className="mt-6">
        {!data?.legs?.length ? (
          <EmptyState title="No legs yet" hint="Refer people — each direct becomes a leg" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.legs.map((l: any) => (
              <div key={l.directUserId} className="rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 px-4 py-3">
                <p className="text-sm font-medium text-[#E8EDFA]">{l.name}</p>
                <p className="text-[10px] text-[#5F7099]">{l.referralCode}</p>
                <p className="ticker-numeric mt-1 font-display text-lg font-semibold text-[#7FA8FF]">{fmtUsd(l.volume)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Claimed rewards */}
      {data?.claimed?.length > 0 && (
        <Card title="Claimed rewards" className="mt-6">
          <ul className="divide-y divide-[#16233F]">
            {data.claimed.map((c: any) => (
              <li key={c.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[#CBD6EC]">Rank {c.rank} milestone</p>
                  <p className="text-xs text-[#5F7099]">{fmtDate(c.createdAt)}</p>
                </div>
                <span className="ticker-numeric font-semibold text-emerald-300">+{fmtUsd(c.reward)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
