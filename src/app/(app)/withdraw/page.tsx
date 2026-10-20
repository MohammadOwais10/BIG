"use client";

import { useEffect, useRef, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useToast } from "@/components/app/toast";
import { api, fmtUsd, fmtDate, newIdemKey, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, EmptyState, Pager, Field, Copyable, inputCls, btnPrimary } from "@/components/app/ui";

export default function WithdrawPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"balance" | "principal">("balance");

  const { address: walletAddress } = useAppKitAccount();

  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [investmentId, setInvestmentId] = useState("");
  const [eligibility, setEligibility] = useState<any>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const prevStatus = useRef<Record<string, string>>({});

  async function load() {
    setLoading(true);
    try {
      const [w, i, wd] = await Promise.all([
        api.wallet(),
        api.investments(1, 50),
        api.withdrawals(page, 10),
      ]);
      setWallet(w.data.wallet);
      setInvestments(i.data.investments);
      const fresh: any[] = wd.data.withdrawals;
      fresh.forEach((x) => {
        const prev = prevStatus.current[x.id];
        if (prev && prev !== "COMPLETED" && x.status === "COMPLETED") {
          toast(`Withdrawal of ${fmtUsd(x.netAmount)} USDT completed — check your wallet`, "success");
        } else if (prev && !["REJECTED", "CANCELLED"].includes(prev) && ["REJECTED", "CANCELLED"].includes(x.status)) {
          toast(`Withdrawal of ${fmtUsd(x.amount)} was rejected — funds refunded`, "info");
        }
      });
      prevStatus.current = Object.fromEntries(fresh.map((x: any) => [x.id, x.status]));
      setList(fresh);
      setTotalPages(wd.data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Poll while any withdrawal is pending — toast pops when admin pays on-chain
  const hasOpen = list.some((w) => ["PENDING", "APPROVED", "PROCESSING"].includes(w.status));
  useEffect(() => {
    if (!hasOpen) return;
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOpen, page]);

  // Prefill with connected wallet address
  useEffect(() => {
    if (walletAddress && !destination) setDestination(walletAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  useEffect(() => {
    if (!investmentId) return setEligibility(null);
    api.principalEligibility(investmentId).then((r) => setEligibility(r.data)).catch(() => setEligibility(null));
  }, [investmentId]);

  const fee = Number(amount || 0) * 0.05;
  const net = Number(amount || 0) - fee;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      if (tab === "balance") {
        await api.createWithdrawal(Number(amount), destination.trim(), newIdemKey());
        setMsg({ ok: true, text: "Withdrawal request submitted for admin approval." });
      } else {
        await api.principalWithdrawal(investmentId, destination.trim());
        setMsg({ ok: true, text: "Principal withdrawal request submitted." });
      }
      setAmount("");
      await load();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof ApiError ? err.message : "Failed" });
    } finally {
      setBusy(false);
    }
  }

  const addressField = (
    <Field label="USDT wallet address (BSC)" hint="Admin will transfer USDT to this address">
      <input
        className={inputCls + " font-mono text-xs"}
        placeholder="0x…"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        pattern="^0x[0-9a-fA-F]{40}$"
        required
      />
    </Field>
  );

  return (
    <>
      <PageHeader title="Withdraw" sub="Minimum $15 · 5% fee · principal deduction 10%→0% over 150 days" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          title="New withdrawal"
          subtitle={wallet ? `Available: ${fmtUsd(wallet.availableBalance)}` : undefined}
          action={
            <div className="flex rounded-lg border border-[#24406E] p-0.5 text-[10px] font-semibold uppercase tracking-wider">
              {(["balance", "principal"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-3 py-1 transition ${tab === t ? "bg-[#1255FF]/20 text-[#7FA8FF]" : "text-[#5F7099]"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          }
        >
          <form onSubmit={submit} className="space-y-4">
            {tab === "balance" ? (
              <>
                <Field label="Amount (USD)">
                  <input type="number" min={15} step="0.01" className={inputCls} value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </Field>
                {Number(amount) >= 15 && (
                  <p className="text-xs text-[#8FA3CC]">
                    Fee {fmtUsd(fee)} · You receive{" "}
                    <span className="font-semibold text-emerald-300">{fmtUsd(net)}</span>
                  </p>
                )}
              </>
            ) : (
              <>
                <Field label="Investment">
                  <select className={inputCls} value={investmentId} onChange={(e) => setInvestmentId(e.target.value)} required>
                    <option value="">Select investment</option>
                    {investments.map((i) => (
                      <option key={i.id} value={i.id}>
                        {fmtUsd(i.principal)} · {i.status} · {fmtDate(i.startedAt)}
                      </option>
                    ))}
                  </select>
                </Field>
                {eligibility && (
                  <div className="space-y-1 rounded-lg border border-[#24406E] bg-[#0A1226] p-3 text-xs text-[#8FA3CC]">
                    <p>Principal: {fmtUsd(eligibility.principal)}</p>
                    <p>
                      {eligibility.isEarly
                        ? `Early withdrawal — ${Number(eligibility.penaltyPercent)}% capital deduction (${fmtUsd(eligibility.penalty)})`
                        : "Past 150 days — no capital deduction"}
                    </p>
                    <p>
                      Withdrawable: {fmtUsd(eligibility.withdrawable)} · after 5% fee you receive{" "}
                      <span className="font-semibold text-emerald-300">
                        {fmtUsd(Number(eligibility.withdrawable) * 0.95)}
                      </span>
                    </p>
                    <p className="pt-1 text-[10px] text-[#5F7099]">
                      Note: withdrawing principal completes the investment — its ROI stops.
                    </p>
                  </div>
                )}
                <div className="rounded-lg border border-[#1C2C50] bg-[#0A1226]/60 p-3 text-[10px] text-[#5F7099]">
                  Capital deduction by investment age: &lt;30d → 10% · ≤60d → 8% · ≤90d → 6% ·
                  ≤120d → 4% · ≤150d → 2% · &gt;150d → free
                </div>
              </>
            )}
            {addressField}
            {msg && (
              <p className={`rounded-lg border px-4 py-2.5 text-sm ${msg.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
                {msg.text}
              </p>
            )}
            <button disabled={busy || (tab === "principal" && !investmentId)} className={`${btnPrimary} w-full`}>
              {busy ? "Submitting…" : "Request withdrawal"}
            </button>
          </form>
        </Card>

        <div className="lg:col-span-2">
          <Card title="Withdrawal history">
            {loading ? (
              <Spinner />
            ) : list.length === 0 ? (
              <EmptyState title="No withdrawals yet" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-[#16233F] text-left text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">
                      <th className="pb-2 pr-4">Kind</th>
                      <th className="pb-2 pr-4">Amount</th>
                      <th className="pb-2 pr-4">Fee</th>
                      <th className="pb-2 pr-4">Net</th>
                      <th className="pb-2 pr-4">Status</th>
                      <th className="pb-2 pr-4">Payout tx</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((w) => (
                      <tr key={w.id} className="border-b border-[#101B34] last:border-0">
                        <td className="py-3 pr-4 font-medium text-[#CBD6EC]">{w.kind ?? "BALANCE"}</td>
                        <td className="ticker-numeric py-3 pr-4">{fmtUsd(w.amount)}</td>
                        <td className="ticker-numeric py-3 pr-4 text-[#8FA3CC]">{fmtUsd(w.fee)}</td>
                        <td className="ticker-numeric py-3 pr-4 text-emerald-300">{fmtUsd(w.netAmount)}</td>
                        <td className="py-3 pr-4"><Badge value={w.status} /></td>
                        <td className="py-3 pr-4">
                          {w.payoutTxHash ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Copyable value={w.payoutTxHash} />
                              <a
                                href={`https://testnet.bscscan.com/tx/${w.payoutTxHash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-emerald-300 hover:underline"
                              >
                                ↗
                              </a>
                            </span>
                          ) : (
                            <span className="text-xs text-[#45567E]">—</span>
                          )}
                        </td>
                        <td className="py-3 text-[#8FA3CC]">{fmtDate(w.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pager page={page} totalPages={totalPages} onPage={setPage} />
          </Card>
        </div>
      </div>
    </>
  );
}
