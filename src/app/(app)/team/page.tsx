"use client";

import { useEffect, useState } from "react";
import { api, fmtUsd, fmtDate } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/app/app-shell";
import { Card, StatCard, Badge, Spinner, EmptyState, Pager, btnGhost } from "@/components/app/ui";

function TreeNode({ node }: { node: any }) {
  const [open, setOpen] = useState(true);
  const active = (node.activeInvested ?? 0) > 0;
  const kids = node.children ?? [];

  return (
    <li>
      <div className="mb-2 inline-flex items-center gap-3 rounded-xl border border-[#1C2C50] bg-[#0A1226]/70 px-4 py-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1255FF]/20 text-[10px] font-bold text-[#7FA8FF]">
          L{node.level}
        </span>
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-[#E8EDFA]">
            {node.name}
            {active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="Active investor" />}
          </p>
          <p className="text-[10px] text-[#5F7099]">
            {node.referralCode} · {node.activeDirects ?? 0}/{node.directs ?? 0} active directs
            {(node.invested ?? 0) > 0 && ` · invested ${fmtUsd(node.invested)}`}
          </p>
        </div>
        <Badge value={node.status} />
        {kids.length > 0 && (
          <button
            onClick={() => setOpen(!open)}
            className="ml-1 rounded-lg border border-[#24406E] px-2 py-0.5 text-[10px] text-[#7FA8FF] hover:bg-[#1255FF]/10"
          >
            {open ? "−" : `+${kids.length}`}
          </button>
        )}
      </div>
      {open && kids.length > 0 && (
        <ul className="ml-6 space-y-2 border-l border-[#24406E] pl-4">
          {kids.map((c: any) => (
            <TreeNode key={c.id} node={c} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function TeamPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [commStats, setCommStats] = useState<any>(null);
  const [tree, setTree] = useState<any>(null);
  const [direct, setDirect] = useState<any[]>([]);
  const [level, setLevel] = useState<number | null>(null);
  const [levelUsers, setLevelUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.referralStats().then((r) => setStats(r.data)).catch(() => {});
    api.commissionStats().then((r) => setCommStats(r.data)).catch(() => {});
    api.referralTree().then((r) => setTree(r.data.tree)).catch(() => {});
  }, []);

  useEffect(() => {
    if (level === null) {
      api.referrals(page, 10).then((r) => {
        setDirect(r.data.referrals);
        setTotalPages(r.data.totalPages || 1);
      }).catch(() => {});
    } else {
      api.referralsByLevel(level, page, 10).then((r) => {
        setLevelUsers(r.data.referrals);
        setTotalPages(r.data.totalPages || 1);
      }).catch(() => {});
    }
  }, [level, page]);

  const listShown = level === null ? direct : levelUsers;

  return (
    <>
      <PageHeader title="Team" sub="Your referral network across 20 levels" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active directs"
          value={`${stats?.activeDirects ?? "—"} / ${stats?.directReferrals ?? "—"}`}
        />
        <StatCard label="Total team" value={stats?.totalTeamSize ?? "—"} accent />
        <StatCard label="Direct income" value={fmtUsd(commStats?.totalDirectIncome)} />
        <StatCard label="Level income" value={fmtUsd(commStats?.totalLevelIncome)} />
      </div>

      {/* Level unlock progress */}
      {stats?.levelUnlocks && (
        <Card
          title="Level income unlocks"
          subtitle={`${stats.unlockedLevels}/20 levels unlocked — levels open sequentially`}
          className="mt-6"
        >
          <p className="mb-3 rounded-lg border border-[#1C2C50] bg-[#0A1226]/60 px-3 py-2 text-[11px] leading-relaxed text-[#8FA3CC]">
            You earn a % of your downline&apos;s daily ROI up to 20 levels. A level unlocks only
            when <span className="text-[#E8EDFA]">every member of the previous level</span> meets
            the direct-referral rule: <span className="text-emerald-300">2 active directs</span> for
            levels 1–5, <span className="text-emerald-300">1 active direct</span> for levels 6–20.
            &quot;Active&quot; means the member has a live investment — registered-only or
            fully-withdrawn members don&apos;t count. One unqualified member locks everything below.
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-10">
            {stats.levelUnlocks.map((l: any) => (
              <div
                key={l.level}
                title={l.unlocked ? `${l.qualifiedMembers}/${l.members} members qualified` : (l.lockReason ?? "Locked")}
                className={`rounded-xl border px-3 py-2.5 text-center ${
                  l.unlocked
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-[#1C2C50] bg-[#0A1226]/60 opacity-60"
                }`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-wider ${l.unlocked ? "text-emerald-300" : "text-[#5F7099]"}`}>
                  L{l.level}
                </p>
                <p className={`ticker-numeric text-sm font-semibold ${l.unlocked ? "text-[#E8EDFA]" : "text-[#5F7099]"}`}>
                  {l.percent}%
                </p>
                <p className="text-[9px] text-[#5F7099]">
                  {l.unlocked
                    ? `${l.qualifiedMembers}/${l.members} members`
                    : `${l.requiredDirects} directs/member`}
                </p>
              </div>
            ))}
          </div>
          {(() => {
            const next = stats.levelUnlocks.find((l: any) => !l.unlocked);
            return next?.lockReason ? (
              <p className="mt-3 text-xs text-amber-300/90">
                Next blocker: {next.lockReason} — Level {next.level} stays locked until then.
              </p>
            ) : null;
          })()}
        </Card>
      )}

      <Card
        title="Referral tree"
        subtitle="Your full downline — click − / + to collapse or expand a branch"
        className="mt-6"
      >
        {!tree ? (
          <Spinner />
        ) : !tree.children?.length ? (
          <EmptyState
            title="No downline yet"
            hint="Share your referral code — your team will grow here level by level"
          />
        ) : (
          <>
            <p className="mb-3 flex flex-wrap gap-4 rounded-lg border border-[#1C2C50] bg-[#0A1226]/60 px-3 py-2 text-[11px] text-[#8FA3CC]">
              <span>
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                active investor (earning ROI)
              </span>
              <span>L# = level depth under you</span>
              <span>invested = member&apos;s own investment</span>
              <span>active direct = member with money invested (counts for ranks &amp; level unlocks)</span>
            </p>
            <div className="max-h-[560px] overflow-auto pr-2">
              <div className="mb-2 inline-flex items-center gap-3 rounded-xl border border-[#1255FF]/50 bg-[#1255FF]/10 px-4 py-2">
                <p className="text-sm font-semibold text-[#7FA8FF]">{tree.name} (you)</p>
              </div>
              <ul className="ml-2 space-y-2">
                {tree.children.map((c: any) => (
                  <TreeNode key={c.id} node={c} />
                ))}
              </ul>
            </div>
          </>
        )}
      </Card>

      <div className="mt-6">
        <Card
          title="Members"
          action={
            <select
              className="rounded-lg border border-[#24406E] bg-[#0A1226] px-3 py-1.5 text-xs text-[#9FB8EE]"
              value={level === null ? "" : level}
              onChange={(e) => {
                setLevel(e.target.value === "" ? null : Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="">Direct (L1)</option>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Level {i + 1}
                </option>
              ))}
            </select>
          }
        >
          {listShown.length === 0 ? (
            <EmptyState
              title="No members at this level yet"
              hint="Share your referral code to grow your team"
            />
          ) : (
            <ul className="divide-y divide-[#16233F]">
              {listShown.map((u) => (
                <li key={u.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-[#E8EDFA]">{u.name}</p>
                    <p className="text-xs text-[#5F7099]">{u.referralCode} · joined {fmtDate(u.createdAt)}</p>
                  </div>
                  <Badge value={u.status} />
                </li>
              ))}
            </ul>
          )}
          <Pager page={page} totalPages={totalPages} onPage={setPage} />
        </Card>
      </div>

      <Card title="Share your referral link" className="mt-6">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <code className="break-all rounded-xl border border-[#24406E] bg-[#0A1226] px-4 py-2.5 font-mono text-xs text-[#7FA8FF]">
            {typeof window !== "undefined"
              ? `${window.location.origin}/register?ref=${user?.referralCode}`
              : `…/register?ref=${user?.referralCode}`}
          </code>
          <button
            className={btnGhost}
            onClick={() => {
              navigator.clipboard?.writeText(
                `${window.location.origin}/register?ref=${user?.referralCode}`
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
          <code className="rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 px-3 py-1.5 font-mono text-xs text-[#5F7099]">
            code: {user?.referralCode}
          </code>
          <p className="text-xs text-[#5F7099]">
            You earn 5% on every direct referral investment, plus level income up to 20 levels —
            each member in the chain needs 2 active directs (levels 1–5) or 1 direct (levels 6–20).
          </p>
        </div>
      </Card>
    </>
  );
}
