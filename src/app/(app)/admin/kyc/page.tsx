"use client";

import { useEffect, useState } from "react";
import { api, fmtDate, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, EmptyState, Pager, inputCls, btnPrimary, btnGhost } from "@/components/app/ui";
import { useToast } from "@/components/app/toast";

const STATUSES = ["", "PENDING", "APPROVED", "REJECTED"];

function DocImage({ label, url }: { label: string; url?: string | null }) {
  if (!url) return null;
  return (
    <div>
      <p className="mb-1 text-[10px] uppercase tracking-wider text-[#5F7099]">{label}</p>
      <a href={url} target="_blank" rel="noreferrer">
        <img
          src={url}
          alt={label}
          className="h-28 w-auto rounded-lg border border-[#24406E] object-cover transition hover:opacity-80"
        />
      </a>
    </div>
  );
}

export default function AdminKyc() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const r = await api.adminKycList(page, 20, status || undefined);
      setItems(r.data.items);
      setTotalPages(r.data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  async function act(id: string, approve: boolean) {
    setBusy(id);
    try {
      if (approve) {
        await api.adminKycApprove(id);
        toast("KYC approved", "success");
      } else {
        const r = reason[id]?.trim();
        if (!r) {
          toast("Rejection reason required", "error");
          setBusy(null);
          return;
        }
        await api.adminKycReject(id, r);
        toast("KYC rejected", "info");
      }
      await load();
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Failed", "error");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <PageHeader title="KYC Review" sub="Approve identity documents to unlock user withdrawals" />
      <Card
        title="Submissions"
        action={
          <select className={inputCls + " !w-36 py-1.5 text-xs"} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s || "All statuses"}</option>
            ))}
          </select>
        }
      >
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <EmptyState title="No KYC submissions" />
        ) : (
          <div className="space-y-4">
            {items.map((k) => (
              <div key={k.id} className="rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#CBD6EC]">
                      {k.user?.name} <span className="text-[#5F7099]">· {k.user?.email}</span>
                    </p>
                    <p className="mt-1 text-xs text-[#8FA3CC]">
                      {k.documentType} · <span className="font-mono">{k.documentNumber}</span>
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-[#8FA3CC] sm:grid-cols-3">
                      <p>Mobile: <span className="font-mono">{k.user?.mobile ?? "—"}</span></p>
                      <p>Ref code: <span className="font-mono">{k.user?.referralCode ?? "—"}</span></p>
                      <p>Status: {k.user?.status ?? "—"}</p>
                      <p>Wallet: ${Number(k.user?.wallet?.availableBalance ?? 0).toFixed(2)}</p>
                      <p>Investments: {k.user?._count?.investments ?? 0}</p>
                      <p>Joined: {fmtDate(k.user?.createdAt)}</p>
                    </div>
                    <p className="mt-1.5 text-[10px] text-[#5F7099]">Submitted {fmtDate(k.submittedAt)}</p>
                    {k.rejectionReason && (
                      <p className="mt-1 text-xs text-red-300">Reason: {k.rejectionReason}</p>
                    )}
                  </div>
                  <Badge value={k.status} />
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                  <DocImage label="ID front" url={k.idFrontUrl} />
                  <DocImage label="ID back" url={k.idBackUrl} />
                  <DocImage label="Selfie" url={k.selfieUrl} />
                </div>

                {k.status === "PENDING" && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => act(k.id, true)}
                      disabled={busy === k.id}
                      className={btnPrimary}
                    >
                      {busy === k.id ? "…" : "Approve"}
                    </button>
                    <input
                      className={inputCls + " min-w-0 flex-1"}
                      placeholder="Rejection reason…"
                      value={reason[k.id] ?? ""}
                      onChange={(e) => setReason((p) => ({ ...p, [k.id]: e.target.value }))}
                    />
                    <button
                      onClick={() => act(k.id, false)}
                      disabled={busy === k.id}
                      className={btnGhost + " !border-red-500/40 !text-red-300"}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <Pager page={page} totalPages={totalPages} onPage={setPage} />
      </Card>
    </>
  );
}
