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

export default function AdminWithdrawals() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { writeContract, data: payTxHash, isPending: sending, error: sendError } = useWriteContract();
  const { isLoading: confirming, isSuccess: mined } = useWaitForTransactionReceipt({ hash: payTxHash });

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
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const r = await api.adminWithdrawals(page, 15, status || undefined);
      setList(r.data.withdrawals);
      setTotalPages(r.data.totalPages || 1);
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
