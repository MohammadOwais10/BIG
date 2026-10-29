"use client";

import { useEffect, useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { api, fmtUsd, fmtDate, ApiError } from "@/lib/api";
import { USDT_CONTRACT, USDT_DECIMALS } from "@/lib/web3";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, EmptyState, Pager, inputCls } from "@/components/app/ui";
import { WalletConnect } from "@/components/app/wallet-connect";
import { Copyable } from "@/components/app/ui";
import { useToast } from "@/components/app/toast";

const STATUSES = ["", "PENDING", "APPROVED", "PROCESSING", "COMPLETED", "REJECTED", "CANCELLED"];

const ERC20_ABI = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const;

const VAULT_ABI = [
  {
    type: "function",
    name: "emergencyWithdraw",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

export default function AdminWithdrawals() {
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const { writeContract, data: payTxHash, isPending: sending, error: sendError } = useWriteContract();
  const { isLoading: confirming, isSuccess: mined } = useWaitForTransactionReceipt({ hash: payTxHash });
  const { writeContract: writeSweep, data: sweepHash, isPending: sweepingEvm, error: sweepError } = useWriteContract();
  const { isSuccess: sweepMined } = useWaitForTransactionReceipt({ hash: sweepHash });

  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState<any>(null);
  const [submittedHash, setSubmittedHash] = useState<string | null>(null);
  const [awaitingConnect, setAwaitingConnect] = useState<any>(null);
  const [treasury, setTreasury] = useState<any>(null);
  const [sweepingTron, setSweepingTron] = useState<string | null>(null);
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const [r, t] = await Promise.all([
        api.adminWithdrawals(page, 15, status || undefined),
        api.adminPayoutTreasury().catch(() => null),
      ]);
      setList(r.data.withdrawals);
      setTotalPages(r.data.totalPages || 1);
      if (t) setTreasury(t.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  // Once payout tx is mined, mark the withdrawal completed with the txHash
  useEffect(() => {
    if (mined && payTxHash && paying && submittedHash !== payTxHash) {
      setSubmittedHash(payTxHash);
      api
        .adminCompleteWithdrawal(paying.id, payTxHash)
        .then(() => {
          setMsg({ ok: true, text: "Payout verified on-chain — withdrawal completed." });
          toast(`Withdrawal of ${fmtUsd(paying.netAmount)} USDT paid and completed`, "success");
          setPaying(null);
          load();
        })
        .catch((e) => {
          const text = e instanceof ApiError ? e.message : "Verification failed";
          setMsg({ ok: false, text });
          toast(text, "error");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mined, payTxHash, paying]);

  // Vault sweep — emergencyWithdraw pays the CONNECTED wallet (must be owner).
  function sweepVault(v: any) {
    if (v.network === "TRC20") {
      sweepTronVault(v);
      return;
    }
    if (!isConnected || !address) return open();
    writeSweep({
      address: v.contract as `0x${string}`,
      abi: VAULT_ABI,
      functionName: "emergencyWithdraw",
      args: [address as `0x${string}`, parseUnits(String(v.balanceUsdt), USDT_DECIMALS)],
    });
  }

  async function sweepTronVault(v: any) {
    const tw = (window as any).tronWeb;
    if (!tw?.ready) return toast("Connect TronLink first — must be the vault owner wallet", "error");
    setSweepingTron(v.network);
    try {
      const to = tw.defaultAddress.base58;
      const c = await tw.contract().at(v.contract);
      const raw = BigInt(Math.round(Number(v.balanceUsdt) * 1e6));
      const txid = await c.emergencyWithdraw(to, raw.toString()).send({ feeLimit: 50_000_000 });
      toast(`Vault swept — ${fmtUsd(v.balanceUsdt)} USDT sent to ${to.slice(0, 12)}…`, "success");
      setTimeout(load, 4000);
    } catch (e: any) {
      toast(e?.message || "Sweep failed — connected wallet must be the vault owner", "error");
    } finally {
      setSweepingTron(null);
    }
  }

  useEffect(() => {
    if (sweepMined && sweepHash) {
      toast("Vault swept — USDT sent to your connected wallet", "success");
      setTimeout(load, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sweepMined, sweepHash]);

  function startPay(w: any) {
    setPaying(w);
    setMsg(null);
    writeContract({
      address: USDT_CONTRACT,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [w.destinationAddress as `0x${string}`, parseUnits(String(w.netAmount), USDT_DECIMALS)],
    });
  }

  // Approve = connect wallet (if needed) → send USDT to the user's address →
  // tx confirmed → backend verifies and completes. No separate step.
  function approveAndPay(w: any) {
    if (!isConnected) {
      setAwaitingConnect(w);
      open();
      return;
    }
    startPay(w);
  }

  // Wallet just connected and a withdrawal was waiting — trigger the transfer
  useEffect(() => {
    if (isConnected && awaitingConnect) {
      startPay(awaitingConnect);
      setAwaitingConnect(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  async function act(id: string, action: "approve" | "reject") {
    setMsg(null);
    try {
      if (action === "approve") await api.adminApproveWithdrawal(id);
      else {
        const reason = rejectReason[id]?.trim();
        if (!reason) {
          setMsg({ ok: false, text: "Rejection reason is required." });
          return;
        }
        await api.adminRejectWithdrawal(id, reason);
      }
      setMsg({ ok: true, text: `Withdrawal ${action}d.` });
      await load();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof ApiError ? e.message : "Failed" });
    }
  }

  return (
    <>
      <PageHeader title="Withdrawals" sub="Approve requests, then pay USDT on-chain to the user's address" />
      <Card
        title="Queue"
        action={
          <select className={inputCls + " !w-36 py-1.5 text-xs"} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s || "All statuses"}</option>
            ))}
          </select>
        }
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8FA3CC]">
              Payout wallet
            </p>
            <p className="mt-0.5 text-xs text-[#5F7099]">
              {isConnected ? "Connected — USDT payouts will be sent from this wallet" : "Connect a wallet holding USDT to pay withdrawals"}
            </p>
          </div>
          <WalletConnect />
        </div>
        {treasury?.autoClaimEnabled && (
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8FA3CC]">
              Payout vaults <span className="normal-case text-[#5F7099]">(auto-claim under ${treasury.autoClaimMaxUsd})</span>
            </p>
            {treasury.vaults.length === 0 && (
              <p className="text-xs text-[#5F7099]">No payout contract configured yet</p>
            )}
            {treasury.vaults.map((v: any) => (
              <div key={v.network} className="flex items-center gap-2">
                <p className="text-xs text-[#CBD6EC]">
                  {v.network}:{" "}
                  <span className="font-semibold text-emerald-300">
                    {v.balanceUsdt == null ? "—" : fmtUsd(v.balanceUsdt)}
                  </span>{" "}
                  <span className="text-[#5F7099]">USDT</span>
                </p>
                {v.contract && Number(v.balanceUsdt) > 0 && (
                  <button
                    onClick={() => sweepVault(v)}
                    disabled={sweepingEvm || sweepingTron === v.network}
                    className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 hover:bg-amber-500/20 disabled:opacity-50"
                  >
                    {sweepingEvm || sweepingTron === v.network ? "Sweeping…" : "Sweep"}
                  </button>
                )}
              </div>
            ))}
            <p className="w-full text-[10px] text-[#5F7099]">
              Sweep sends the whole vault balance to your connected wallet — must be the vault owner.
            </p>
            {sweepError && (
              <p className="w-full text-[10px] text-red-300">{sweepError.message.split("\n")[0]}</p>
            )}
          </div>
        )}
        {msg && (
          <p className={`mb-4 rounded-lg border px-4 py-2.5 text-sm ${msg.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
            {msg.text}
          </p>
        )}
        {sendError && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
            {sendError.message.split("\n")[0]}
          </p>
        )}
        {loading ? (
          <Spinner />
        ) : list.length === 0 ? (
          <EmptyState title="Nothing in this queue" />
        ) : (
          <ul className="space-y-4">
            {list.map((w) => (
              <li key={w.id} className="rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#E8EDFA]">
                      {w.user?.name} <span className="text-[#5F7099]">· {w.user?.email}</span>
                    </p>
                    <p className="ticker-numeric mt-1 text-xs text-[#8FA3CC]">
                      Requested {fmtUsd(w.amount)} · fee {fmtUsd(w.fee)} · net{" "}
                      <span className="font-semibold text-emerald-300">{fmtUsd(w.netAmount)}</span>
                      {w.kind === "PRINCIPAL" && Number(w.principalPenalty) > 0 && (
                        <span className="text-amber-300"> · principal penalty {fmtUsd(w.principalPenalty)}</span>
                      )}
                    </p>
                    <p className="text-[11px] text-[#5F7099]">
                      {w.kind ?? "BALANCE"} · {fmtDate(w.createdAt)}
                    </p>
                    {w.destinationAddress && (
                      <p className="mt-1">
                        <Copyable value={w.destinationAddress} label="to" />
                      </p>
                    )}
                    {w.payoutTxHash && (
                      <p className="mt-0.5">
                        <Copyable value={w.payoutTxHash} label="tx" />
                        <a
                          href={`https://testnet.bscscan.com/tx/${w.payoutTxHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 font-mono text-[10px] text-emerald-300 hover:underline"
                        >
                          BscScan ↗
                        </a>
                      </p>
                    )}
                  </div>
                  <Badge value={w.status} />
                </div>

                {/* PENDING: Approve → wallet connect → USDT transfer → auto-complete.
                    Approved-but-unpaid: Pay button. Paid ones never show pay again. */}
                {(w.status === "PENDING" || w.status === "PROCESSING") && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() =>
                        w.destinationAddress ? approveAndPay(w) : act(w.id, "approve")
                      }
                      disabled={sending || (confirming && paying?.id === w.id)}
                      className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      {paying?.id === w.id && (sending || confirming)
                        ? confirming
                          ? "Confirming on-chain…"
                          : "Confirm in wallet…"
                        : awaitingConnect?.id === w.id
                          ? "Connect wallet…"
                          : "Approve"}
                    </button>
                    <input
                      className={`${inputCls} !w-52 py-1.5 text-xs`}
                      placeholder="Rejection reason"
                      value={rejectReason[w.id] ?? ""}
                      onChange={(e) => setRejectReason((s) => ({ ...s, [w.id]: e.target.value }))}
                    />
                    <button
                      onClick={() => act(w.id, "reject")}
                      className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {w.status === "APPROVED" && !w.payoutTxHash && w.destinationAddress && (
                  <div className="mt-3">
                    <button
                      onClick={() => approveAndPay(w)}
                      disabled={sending || (confirming && paying?.id === w.id)}
                      className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 disabled:opacity-50"
                    >
                      {paying?.id === w.id && (sending || confirming)
                        ? confirming
                          ? "Confirming on-chain…"
                          : "Confirm in wallet…"
                        : `Pay ${fmtUsd(w.netAmount)} USDT`}
                    </button>
                  </div>
                )}
                {w.status === "REJECTED" && w.rejectionReason && (
                  <p className="mt-2 text-xs text-red-300/80">Reason: {w.rejectionReason}</p>
                )}
              </li>
            ))}
          </ul>
        )}
        <Pager page={page} totalPages={totalPages} onPage={setPage} />
      </Card>
    </>
  );
}
