"use client";

import { useEffect, useRef, useState } from "react";
import { api, fmtUsd, fmtDate, ApiError } from "@/lib/api";
import { useToast } from "@/components/app/toast";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, EmptyState, Copyable, btnGhost } from "@/components/app/ui";
import { DepositCard, useDepositConfig } from "@/components/app/deposit-section";

export default function DepositPage() {
  const config = useDepositConfig();
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const toast = useToast();
  const prevStatus = useRef<Record<string, string>>({});

  async function load() {
    try {
      const d = await api.deposits(1, 20);
      const fresh: any[] = d.data.deposits;
      // Toast when a deposit transitions to CREDITED (e.g. by the cron)
      fresh.forEach((dep) => {
        const prev = prevStatus.current[dep.id];
        if (prev && prev !== "CREDITED" && dep.status === "CREDITED") {
          toast(
            Number(dep.amount) >= 100
              ? `Deposit of ${fmtUsd(dep.amount)} USDT confirmed — auto-invested`
              : `Deposit of ${fmtUsd(dep.amount)} USDT confirmed — wallet credited`,
            "success"
          );
        }
      });
      prevStatus.current = Object.fromEntries(fresh.map((x: any) => [x.id, x.status]));
      setDeposits(fresh);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Auto-refresh while any deposit is still pending — the backend cron credits
  // it as soon as confirmations are reached
  const hasPending = deposits.some((d) => d.status === "PENDING");
  useEffect(() => {
    if (!hasPending) return;
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPending]);

  async function recheck(id: string) {
    try {
      const r = await api.recheckDeposit(id);
      setMsg({
        ok: true,
        text: r.data.investment
          ? "Deposit confirmed — auto-invested."
          : r.data.deposit.status === "CREDITED"
            ? "Deposit confirmed — wallet credited."
            : `Still confirming (${r.data.deposit.confirmations}/${config?.requiredConfirmations ?? 12})`,
      });
      await load();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof ApiError ? e.message : "Failed" });
    }
  }

  return (
    <>
      <PageHeader title="Deposit" sub="Send USDT on BSC Testnet — deposits ≥ $100 auto-invest" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <DepositCard config={config} onCredited={load} />
          {msg && (
            <p className={`mt-4 rounded-lg border px-4 py-2.5 text-sm ${msg.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
              {msg.text}
            </p>
          )}
        </div>

        <Card title="Deposit history">
          {loading ? (
            <Spinner />
          ) : deposits.length === 0 ? (
            <EmptyState title="No deposits yet" hint="Send USDT to the platform wallet" />
          ) : (
            <ul className="space-y-3">
              {deposits.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 p-4">
                  <div>
                    <p className="ticker-numeric font-display text-lg font-semibold text-[#E8EDFA]">
                      {fmtUsd(d.amount)} <span className="text-xs text-[#5F7099]">USDT</span>
                    </p>
                    <p className="text-xs text-[#5F7099]">
                      {fmtDate(d.createdAt)} · {d.confirmations}/{config?.requiredConfirmations ?? 12} confirmations
                    </p>
                    <p className="mt-0.5">
                      {(() => {
                        const isTron = d.network === "TRC20" || d.txHash?.startsWith("trc20:");
                        const rawHash = (d.txHash ?? "").replace(/^trc20:/, "");
                        return (
                          <>
                            <Copyable value={rawHash} />
                            <a
                              href={
                                isTron
                                  ? `https://nile.tronscan.org/#/transaction/${rawHash}`
                                  : `https://testnet.bscscan.com/tx/${rawHash}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="ml-1.5 font-mono text-[10px] text-emerald-300 hover:underline"
                            >
                              ↗
                            </a>
                          </>
                        );
                      })()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge value={d.status} />
                    {d.status === "PENDING" && (
                      <button onClick={() => recheck(d.id)} className={btnGhost}>
                        Recheck
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
