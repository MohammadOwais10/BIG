"use client";

import { useEffect, useState } from "react";
import { api, fmtDate, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, EmptyState, Pager, inputCls, btnPrimary } from "@/components/app/ui";
import { useToast } from "@/components/app/toast";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [openCount, setOpenCount] = useState(0);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reply, setReply] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const r = await api.adminSupport(page, 20, status || undefined);
      setTickets(r.data.tickets);
      setTotalPages(r.data.totalPages || 1);
      setOpenCount(r.data.openCount ?? 0);
    } catch {
      /* keep */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  async function respond(id: string, body: { reply?: string; status?: string }, ok: string) {
    setBusy(true);
    try {
      await api.adminReplyTicket(id, body);
      toast(ok, "success");
      setReply((r) => ({ ...r, [id]: "" }));
      await load();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Failed", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Support tickets" sub={`${openCount} open ticket${openCount === 1 ? "" : "s"}`} />

      <Card
        action={
          <select
            className="rounded-lg border border-[#24406E] bg-[#0A1226] px-3 py-1.5 text-xs text-[#9FB8EE]"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All</option>
            <option value="OPEN">Open</option>
            <option value="ANSWERED">Answered</option>
            <option value="CLOSED">Closed</option>
          </select>
        }
      >
        {loading ? (
          <Spinner />
        ) : tickets.length === 0 ? (
          <EmptyState title="No tickets" hint="User tickets appear here" />
        ) : (
          <ul className="space-y-3">
            {tickets.map((t) => (
              <li key={t.id} className="rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#E8EDFA]">{t.subject}</p>
                    <p className="truncate text-[10px] text-[#5F7099]">
                      {t.user?.name} · {t.user?.email} · {fmtDate(t.createdAt)}
                    </p>
                  </div>
                  <Badge value={t.status} />
                </div>

                <button
                  className="mt-2 text-[11px] text-[#7FA8FF] hover:underline"
                  onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                >
                  {expanded === t.id ? "Hide" : "View & reply"}
                </button>

                {expanded === t.id && (
                  <div className="mt-2 space-y-3 border-t border-[#16233F] pt-3 text-xs">
                    <p className="whitespace-pre-wrap text-[#8FA3CC]">{t.message}</p>
                    {t.adminReply && (
                      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                          Your reply {t.repliedAt ? `· ${fmtDate(t.repliedAt)}` : ""}
                        </p>
                        <p className="whitespace-pre-wrap text-[#CBD6EC]">{t.adminReply}</p>
                      </div>
                    )}
                    <textarea
                      className={inputCls + " min-h-[80px] resize-y"}
                      placeholder="Write a reply…"
                      value={reply[t.id] ?? ""}
                      onChange={(e) => setReply((r) => ({ ...r, [t.id]: e.target.value }))}
                      maxLength={2000}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={busy || !(reply[t.id] ?? "").trim()}
                        onClick={() => respond(t.id, { reply: reply[t.id].trim(), status: "ANSWERED" }, "Replied")}
                        className={btnPrimary}
                      >
                        Send reply
                      </button>
                      {t.status !== "CLOSED" && (
                        <button
                          disabled={busy}
                          onClick={() => respond(t.id, { status: "CLOSED" }, "Ticket closed")}
                          className="rounded-lg border border-[#24406E] px-4 py-2 text-xs text-[#9FB8EE] hover:border-[#7FA8FF]"
                        >
                          Close ticket
                        </button>
                      )}
                      {t.status === "CLOSED" && (
                        <button
                          disabled={busy}
                          onClick={() => respond(t.id, { status: "OPEN" }, "Ticket reopened")}
                          className="rounded-lg border border-[#24406E] px-4 py-2 text-xs text-[#9FB8EE] hover:border-[#7FA8FF]"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
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
