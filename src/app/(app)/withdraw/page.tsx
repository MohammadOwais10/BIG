"use client";

import { useEffect, useRef, useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useToast } from "@/components/app/toast";
import { api, fmtUsd, fmtDate, newIdemKey, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, EmptyState, Pager, Field, Copyable, inputCls, btnPrimary, btnGhost } from "@/components/app/ui";

// Signed-claim payout vault — same ABI on BSC (BEP20) and Tron (TRC20)
const PAYOUT_ABI = [
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "expiry", type: "uint256" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
  },
] as const;

function explorerTxUrl(network: string, hash: string) {
  return network === "TRC20"
    ? `https://nile.tronscan.org/#/transaction/${hash}`
    : `https://testnet.bscscan.com/tx/${hash}`;
}

// Card shown for a PROCESSING withdrawal that carries a signed voucher.
// The user calls contract.claim() themselves — the backend only signed it.
function ClaimCard({ w, onDone }: { w: any; onDone: () => void }) {
  const { address } = useAppKitAccount();
  const { open } = useAppKit();
  const { writeContract, data: txHash, isPending: sending, error: sendError } = useWriteContract();
  const { isLoading: confirming, isSuccess: mined } = useWaitForTransactionReceipt({ hash: txHash });
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [manualHash, setManualHash] = useState("");
  const finalized = useRef(false);

  const isTron = w.network === "TRC20";
  const expired = w.claimExpiry ? Date.parse(w.claimExpiry) < Date.now() : false;
  const expirySec = Math.floor(Date.parse(w.claimExpiry) / 1000);

  async function finalize(hash?: string, attempt = 0, silent = false) {
    if (finalized.current) return;
    try {
      await api.submitClaimTx(w.id, hash);
      finalized.current = true;
      toast(`${fmtUsd(w.netAmount)} USDT claimed — check your wallet`, "success");
      onDone();
    } catch (e) {
      const text = e instanceof ApiError ? e.message : "Payout verification failed — retry in a few seconds";
      // Chain indexers lag a few seconds behind a fresh tx — retry quietly.
      if (attempt < 5 && /not found|on-chain|verify/i.test(text)) {
        setTimeout(() => finalize(hash, attempt + 1, silent), 3000);
        return;
      }
      if (!silent) setErr(text);
    }
  }

  // Auto-verify: backend scans the vault's recent txs — catches claims that
  // settled before the wallet/UI handshake (or claimed from another tab).
  useEffect(() => {
    if (expired) return;
    const t = setInterval(() => finalize(undefined, 0, true), 7000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired]);

  useEffect(() => {
    if (mined && txHash) finalize(txHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mined, txHash]);

  function claimBsc() {
    setErr(null);
    if (!address) return open();
    if (address.toLowerCase() !== w.destinationAddress.toLowerCase()) {
      return setErr("Connect the same wallet you set as the destination address.");
    }
    writeContract({
      address: w.claimContract as `0x${string}`,
      abi: PAYOUT_ABI,
      functionName: "claim",
      args: [
        w.destinationAddress as `0x${string}`,
        BigInt(w.claimAmountRaw),
        BigInt(w.claimNonce),
        BigInt(expirySec),
        w.claimSignature as `0x${string}`,
      ],
    });
  }

  async function claimTron() {
    setErr(null);
    const tw = (window as any).tronWeb;
    if (!tw?.ready) {
      return setErr("TronLink wallet not detected — install TronLink and connect it to the Nile testnet.");
    }
    setBusy(true);
    try {
      const c = await tw.contract().at(w.claimContract);
      const txid = await c
        .claim(w.destinationAddress, w.claimAmountRaw, w.claimNonce, expirySec, w.claimSignature)
        .send({ feeLimit: 100_000_000 });
      await finalize(txid);
    } catch (e: any) {
      setErr(e?.message || "Tron claim failed");
    } finally {
      setBusy(false);
    }
  }

  async function revoucher() {
    setErr(null);
    setBusy(true);
    try {
      await api.reissueVoucher(w.id);
      toast("New claim voucher issued", "success");
      onDone();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not reissue voucher");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card
      title={`Claim ${fmtUsd(w.netAmount)} USDT`}
      subtitle={`${isTron ? "Tron (TRC20)" : "BNB Smart Chain (BEP20)"} · voucher expires ${fmtDate(w.claimExpiry)}`}
    >
      <div className="space-y-3">
        {expired ? (
          <>
            <p className="text-sm text-amber-300">This claim voucher has expired. Request a new one — it is free.</p>
            <button onClick={revoucher} disabled={busy} className={btnPrimary}>
              {busy ? "Requesting…" : "Get new voucher"}
            </button>
          </>
        ) : (
          <>
            <p className="text-xs text-[#8FA3CC]">
              Withdrawal approved. Call the payout contract once — USDT goes straight to{" "}
              <span className="font-mono">{w.destinationAddress.slice(0, 10)}…</span>
            </p>
            {isTron ? (
              <button onClick={claimTron} disabled={busy} className={btnPrimary}>
                {busy ? "Claiming…" : "Claim via TronLink"}
              </button>
            ) : (
              <button onClick={claimBsc} disabled={sending || confirming} className={btnPrimary}>
                {sending ? "Confirm in wallet…" : confirming ? "Confirming…" : "Claim USDT now"}
              </button>
            )}
          </>
        )}
        {err && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{err}</p>}
        {sendError && <p className="text-xs text-red-300">{sendError.message.split("\n")[0]}</p>}
        <details className="text-xs text-[#5F7099]">
          <summary className="cursor-pointer hover:text-[#8FA3CC]">Already claimed? submit the tx hash</summary>
          <div className="mt-2 flex gap-2">
            <input
              className={inputCls + " font-mono text-xs"}
              placeholder="0x… transaction hash"
              value={manualHash}
              onChange={(e) => setManualHash(e.target.value)}
            />
            <button onClick={() => manualHash.trim() && finalize(manualHash.trim())} className={btnGhost}>
              Verify
            </button>
          </div>
        </details>
      </div>
    </Card>
  );
}

export default function WithdrawPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [kyc, setKyc] = useState<any>(null);
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"balance" | "principal">("balance");

  const { address: walletAddress } = useAppKitAccount();
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [principalAmount, setPrincipalAmount] = useState("");
  const [wdPassword, setWdPassword] = useState("");
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
      const [w, i, wd, k] = await Promise.all([
        api.wallet(),
        api.investments(1, 50),
        api.withdrawals(page, 10),
        api.kycMe().catch(() => null),
      ]);
      setWallet(w.data.wallet);
      setInvestments(i.data.investments);
      setKyc(k?.data?.kyc ?? null);
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
        const r = await api.createWithdrawal(Number(amount), destination.trim(), newIdemKey(), wdPassword);
        const text = r.data?.claim
          ? "Withdrawal approved — claim your USDT below."
          : "Withdrawal request submitted for admin approval.";
        setMsg({ ok: true, text });
        toast(text, "success");
      } else {
        const r = await api.principalWithdrawal(
          investmentId,
          destination.trim(),
          principalAmount ? Number(principalAmount) : undefined,
          wdPassword
        );
        const text = r.data?.claim
          ? "Withdrawal approved — claim your USDT below."
          : "Principal withdrawal request submitted.";
        setMsg({ ok: true, text });
        toast(text, "success");
      }
      setAmount("");
      setPrincipalAmount("");
      setInvestmentId("");
      setWdPassword("");
      await load();
    } catch (err) {
      const text = err instanceof ApiError ? err.message : "Failed";
      setMsg({ ok: false, text });
      toast(text, "error");
    } finally {
      setBusy(false);
    }
  }

  const pendingClaims = list.filter((w) => w.status === "PROCESSING" && w.claimSignature);

  // Investments with an in-flight principal request are locked until it settles;
  // completed partial withdrawals leave the investment usable for the remainder.
  const lockedPrincipal = new Set(
    list
      .filter((w) => w.kind === "PRINCIPAL" && ["PENDING", "APPROVED", "PROCESSING"].includes(w.status))
      .map((w) => w.investmentId)
  );
  const withdrawableInvestments = investments.filter(
    (i) => !["COMPLETED", "CANCELLED"].includes(i.status) && !lockedPrincipal.has(i.id)
  );

  const addressField = (
    <Field label="USDT wallet address" hint="BSC (0x…) or Tron (T…)">
      <input
        className={inputCls + " font-mono text-xs"}
        placeholder="0x… or T…"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        pattern="^(0x[0-9a-fA-F]{40}|T[1-9A-HJ-NP-Za-km-z]{33})$"
        required
      />
    </Field>
  );

  return (
    <>
      <PageHeader title="Withdraw" sub="Minimum $15 · 5% fee · instant on-chain claim under the auto-payout cap" />

      {pendingClaims.length > 0 && (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {pendingClaims.map((w) => (
            <ClaimCard key={w.id} w={w} onDone={load} />
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {kyc?.status !== "APPROVED" ? (
          <Card title="KYC required" subtitle="Withdrawals unlock after verification">
            <div className="space-y-3">
              <Badge value={kyc?.status ?? "NOT_SUBMITTED"} />
              <p className="text-sm text-[#8FA3CC]">
                {kyc?.status === "PENDING"
                  ? "Your KYC is under review — withdrawals unlock once admin approves it."
                  : kyc?.status === "REJECTED"
                    ? `Your KYC was rejected${kyc.rejectionReason ? `: ${kyc.rejectionReason}` : ""}. Resubmit to continue.`
                    : "Submit a government ID + selfie to unlock withdrawals."}
              </p>
              {kyc?.status !== "PENDING" && (
                <a href="/kyc" className={`${btnPrimary} inline-block`}>
                  Go to KYC verification
                </a>
              )}
            </div>
          </Card>
        ) : !user?.hasWithdrawalPassword ? (
          <Card title="Withdrawal password required" subtitle="One-time setup — short security lock applies">
            <div className="space-y-3">
              <p className="text-sm text-[#8FA3CC]">
                Set a separate withdrawal password in your profile. For security, withdrawals stay
                locked briefly after the password is set or changed.
              </p>
              <a href="/profile" className={`${btnPrimary} inline-block`}>
                Set withdrawal password
              </a>
            </div>
          </Card>
        ) : (
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
                  <select
                    className={inputCls}
                    value={investmentId}
                    onChange={(e) => {
                      setInvestmentId(e.target.value);
                      setPrincipalAmount("");
                    }}
                    required
                  >
                    <option value="">Select investment</option>
                    {withdrawableInvestments.map((i) => (
                      <option key={i.id} value={i.id}>
                        {fmtUsd(i.principal)} · {i.status} · {fmtDate(i.startedAt)}
                      </option>
                    ))}
                  </select>
                  {withdrawableInvestments.length === 0 && (
                    <p className="mt-1 text-xs text-[#5F7099]">No investment with withdrawable principal.</p>
                  )}
                </Field>
                {eligibility && (
                  <div className="space-y-1 rounded-lg border border-[#24406E] bg-[#0A1226] p-3 text-sm text-[#8FA3CC]">
                    <p className="flex justify-between">
                      <span>You can withdraw</span>
                      <span className="font-semibold text-[#E8EDFA]">{fmtUsd(eligibility.withdrawable)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>You receive (5% fee)</span>
                      <span className="font-semibold text-emerald-300">
                        {fmtUsd(Number(eligibility.withdrawable) * 0.95)}
                      </span>
                    </p>
                    {eligibility.isEarly && (
                      <p className="text-[10px] text-[#5F7099]">
                        Includes {Number(eligibility.penaltyPercent)}% early-withdrawal deduction.
                      </p>
                    )}
                  </div>
                )}
                {eligibility && Number(eligibility.withdrawable) > 0 && (
                  <>
                    <Field label={`Amount (USD) — blank = all ${fmtUsd(eligibility.withdrawable)}`}>
                      <input
                        type="number"
                        min={10}
                        step="0.01"
                        max={Number(eligibility.withdrawable)}
                        className={inputCls}
                        placeholder={fmtUsd(eligibility.withdrawable)}
                        value={principalAmount}
                        onChange={(e) => setPrincipalAmount(e.target.value)}
                      />
                    </Field>
                    {Number(principalAmount) > 0 && (
                      <p className="text-xs text-[#8FA3CC]">
                        You receive{" "}
                        <span className="font-semibold text-emerald-300">
                          {fmtUsd(Number(principalAmount) * 0.95)}
                        </span>
                        {Number(principalAmount) < Number(eligibility.withdrawable) && (
                          <span className="text-[#5F7099]"> · rest keeps earning ROI</span>
                        )}
                      </p>
                    )}
                  </>
                )}
                <details className="text-[10px] text-[#5F7099]">
                  <summary className="cursor-pointer hover:text-[#8FA3CC]">Deduction &amp; rules</summary>
                  <p className="mt-1 rounded-lg border border-[#1C2C50] bg-[#0A1226]/60 p-3">
                    Early withdrawal deduction by age: &lt;30d → 10% · ≤60d → 8% · ≤90d → 6% ·
                    ≤120d → 4% · ≤150d → 2% · &gt;150d → free. Full withdrawal closes the
                    investment; partial leaves ROI on the rest.
                  </p>
                </details>
              </>
            )}
            {addressField}
            <Field label="Withdrawal password">
              <input
                type="password"
                className={inputCls}
                value={wdPassword}
                onChange={(e) => setWdPassword(e.target.value)}
                autoComplete="off"
                required
              />
            </Field>
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
        )}

        <div className="lg:col-span-2">
          <Card title="Withdrawal history">
            {loading ? (
              <Spinner />
            ) : list.length === 0 ? (
              <EmptyState title="No withdrawals yet" />
            ) : (
              <>
              {/* Mobile: stacked cards instead of a scrolling table */}
              <ul className="divide-y divide-[#16233F] md:hidden">
                {list.map((w) => (
                  <li key={w.id} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-[#CBD6EC]">{w.kind ?? "BALANCE"}</p>
                      <Badge value={w.status} />
                    </div>
                    <p className="ticker-numeric mt-1 text-xs text-[#8FA3CC]">
                      {fmtUsd(w.amount)} · fee {fmtUsd(w.fee)} · net{" "}
                      <span className="text-emerald-300">{fmtUsd(w.netAmount)}</span>
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[#5F7099]">{fmtDate(w.createdAt)}</span>
                      {w.payoutTxHash && (
                        <span className="inline-flex items-center gap-1">
                          <Copyable value={w.payoutTxHash} />
                          <a
                            href={explorerTxUrl(w.network ?? "BEP20", w.payoutTxHash)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-emerald-300 hover:underline"
                          >
                            ↗
                          </a>
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="hidden overflow-x-auto md:block">
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
                                href={explorerTxUrl(w.network ?? "BEP20", w.payoutTxHash)}
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
              </>
            )}
            <Pager page={page} totalPages={totalPages} onPage={setPage} />
          </Card>
        </div>
      </div>
    </>
  );
}
