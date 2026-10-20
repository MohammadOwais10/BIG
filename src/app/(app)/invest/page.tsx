"use client";

import { useEffect, useState } from "react";
import { api, fmtUsd, fmtDate, newIdemKey, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, EmptyState, Pager, Field, inputCls, btnPrimary } from "@/components/app/ui";

export default function InvestPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [topUp, setTopUp] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [w, inv] = await Promise.all([
        api.wallet(),
        api.investments(page, 10),
      ]);
      setWallet(w.data.wallet);
      setList(inv.data.investments);
      setTotalPages(inv.data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function invest(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      await api.createInvestment(Number(amount), newIdemKey());
      setMsg({ ok: true, text: "Investment created — 5% direct commission paid to your referrer." });
      setAmount("");
      await load();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof ApiError ? err.message : "Failed" });
    } finally {
      setBusy(false);
    }
  }

  async function doTopUp(investmentId: string) {
    const amt = Number(topUp[investmentId] || 0);
    setMsg(null);
    setBusy(true);
    try {
      await api.topUpInvestment(investmentId, amt);
      setMsg({ ok: true, text: "Top-up successful — a new investment cycle started." });
      await load();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof ApiError ? err.message : "Failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Invest" sub="Minimum $100 · total income capped at 10x of invested amount" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="New investment" subtitle={wallet ? `Available: ${fmtUsd(wallet.availableBalance)}` : undefined}>
          <form onSubmit={invest} className="space-y-4">
            <Field label="Amount (USD)">
              <input
                type="number"
                min={100}
                step="0.01"
                className={inputCls}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                required
              />
            </Field>
            {amount && Number(amount) >= 100 && (
              <p className="text-xs text-[#8FA3CC]">
                Earning cap: <span className="font-semibold text-[#7FA8FF]">{fmtUsd(Number(amount) * 10)}</span>
              </p>
            )}
            <button disabled={busy} className={`${btnPrimary} w-full`}>
              {busy ? "Processing…" : "Invest now"}
            </button>
            {wallet && Number(wallet.availableBalance) < 100 && (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
                Low balance — <a href="/deposit" className="font-semibold underline">deposit USDT</a> to invest.
              </p>
            )}
          </form>
        </Card>

        <div className="lg:col-span-2">
          <Card title="Your investments">
            {msg && (
              <p
                className={`mb-4 rounded-lg border px-4 py-2.5 text-sm ${
                  msg.ok
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-red-500/30 bg-red-500/10 text-red-300"
                }`}
              >
                {msg.text}
              </p>
            )}
            {loading ? (
              <Spinner />
            ) : list.length === 0 ? (
              <EmptyState title="No investments yet" hint="Deposit USDT, then create your first investment" />
            ) : (
              <ul className="space-y-4">
                {list.map((inv) => {
                  const capPct = Math.min(
                    100,
                    (Number(inv.totalRoiEarned) / Number(inv.earningCap)) * 100,
                  );
                  return (
                    <li key={inv.id} className="rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="ticker-numeric font-display text-lg font-semibold text-[#E8EDFA]">
                            {fmtUsd(inv.amount)}
                          </p>
                          <p className="text-xs text-[#5F7099]">Started {fmtDate(inv.startedAt)}</p>
                        </div>
                        <Badge value={inv.status} />
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] text-[#8FA3CC]">
                          <span>Earned {fmtUsd(inv.totalRoiEarned)}</span>
                          <span>Cap {fmtUsd(inv.earningCap)}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#16233F]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#1749D8] to-[#1255FF]"
                            style={{ width: `${capPct}%` }}
                          />
                        </div>
                      </div>
                      {inv.status === "CAPPED" && (
                        <div className="mt-3 flex items-center gap-2">
                          <input
                            type="number"
                            min={100}
                            placeholder="Top-up $"
                            className={`${inputCls} max-w-36`}
                            value={topUp[inv.id] ?? ""}
                            onChange={(e) =>
                              setTopUp((s) => ({ ...s, [inv.id]: e.target.value }))
                            }
                          />
                          <button
                            disabled={busy || Number(topUp[inv.id] || 0) < 100}
                            onClick={() => doTopUp(inv.id)}
                            className={btnPrimary}
                          >
                            Top up
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            <Pager page={page} totalPages={totalPages} onPage={setPage} />
          </Card>
        </div>
      </div>
    </>
  );
}
