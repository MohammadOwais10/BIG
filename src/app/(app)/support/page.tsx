"use client";

import { useEffect, useRef, useState } from "react";
import { api, fmtDate, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, EmptyState, Pager, Field, inputCls, btnPrimary } from "@/components/app/ui";
import { useToast } from "@/components/app/toast";

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const r = await api.supportMy(page, 10);
      setTickets(r.data.tickets);
      setTotalPages(r.data.totalPages || 1);
    } catch {
      /* keep */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const form = new FormData();
      form.append("subject", subject.trim());
      form.append("message", message.trim());
      if (image) form.append("image", image);
      await api.supportCreate(form);
      toast("Ticket submitted — admin will respond soon", "success");
      setSubject("");
      setMessage("");
      setImage(null);
      if (fileRef.current) fileRef.current.value = "";
      setPage(1);
      await load();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Failed to submit", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Support" sub="Raise a ticket — admin replies here" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="New ticket">
          <form onSubmit={submit} className="space-y-4">
            <Field label="Subject">
              <input
                className={inputCls}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Deposit not credited"
                minLength={3}
                maxLength={200}
                required
              />
            </Field>
            <Field label="Message">
              <textarea
                className={inputCls + " min-h-[120px] resize-y"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question…"
                minLength={5}
                maxLength={2000}
                required
              />
            </Field>
            <Field label="Attach screenshot (optional)">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={inputCls + " file:mr-3 file:rounded-md file:border-0 file:bg-[#1255FF]/20 file:px-3 file:py-1 file:text-xs file:text-[#7FA8FF]"}
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </Field>
            <button disabled={busy} className={`${btnPrimary} w-full`}>
              {busy ? "Submitting…" : "Submit ticket"}
            </button>
          </form>
        </Card>

        <div className="lg:col-span-2">
          <Card title="My tickets">
            {loading ? (
              <Spinner />
            ) : tickets.length === 0 ? (
              <EmptyState title="No tickets yet" hint="Create a ticket if you need help from admin" />
            ) : (
              <ul className="space-y-3">
                {tickets.map((t) => (
                  <li key={t.id} className="rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#E8EDFA]">{t.subject}</p>
                        <p className="text-[10px] text-[#5F7099]">{fmtDate(t.createdAt)}</p>
                      </div>
                      <Badge value={t.status} />
                    </div>
                    <button
                      className="mt-2 text-[11px] text-[#7FA8FF] hover:underline"
                      onClick={() => setOpen(open === t.id ? null : t.id)}
                    >
                      {open === t.id ? "Hide details" : "View details"}
                    </button>
                    {open === t.id && (
                      <div className="mt-2 space-y-2 border-t border-[#16233F] pt-2 text-xs">
                        <p className="whitespace-pre-wrap text-[#8FA3CC]">{t.message}</p>
                        {t.imageUrl && (
                          <img
                            src={t.imageUrl}
                            alt="Attachment"
                            onClick={() => setImgUrl(t.imageUrl)}
                            className="h-24 w-auto cursor-zoom-in rounded-lg border border-[#24406E] object-cover transition hover:opacity-80"
                          />
                        )}
                        {t.adminReply ? (
                          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                              Admin reply {t.repliedAt ? `· ${fmtDate(t.repliedAt)}` : ""}
                            </p>
                            <p className="whitespace-pre-wrap text-[#CBD6EC]">{t.adminReply}</p>
                          </div>
                        ) : (
                          <p className="text-[#5F7099]">Waiting for admin reply…</p>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <Pager page={page} totalPages={totalPages} onPage={setPage} />
          </Card>
        </div>
      </div>

      {imgUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setImgUrl(null)}
        >
          <img
            src={imgUrl}
            alt="Attachment"
            className="max-h-[90vh] max-w-[90vw] rounded-lg border border-[#24406E] object-contain"
          />
        </div>
      )}
    </>
  );
}
