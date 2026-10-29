"use client";

import { useEffect, useState } from "react";
import { api, fmtDate, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, Field, inputCls, btnPrimary } from "@/components/app/ui";
import { useToast } from "@/components/app/toast";

const DOC_TYPES = [
  { value: "PASSPORT", label: "Passport" },
  { value: "DRIVING_LICENSE", label: "Driving license" },
  { value: "NATIONAL_ID", label: "National ID" },
];

function FileField({ label, hint, onChange }: { label: string; hint?: string; onChange: (f: File | null) => void }) {
  const [name, setName] = useState("");
  return (
    <Field label={label} hint={hint}>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={inputCls + " file:mr-3 file:rounded-md file:border-0 file:bg-[#1255FF]/20 file:px-3 file:py-1 file:text-xs file:text-[#7FA8FF]"}
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          setName(f?.name ?? "");
          onChange(f);
        }}
        required={!hint?.includes("optional")}
      />
      {name && <p className="mt-1 text-[10px] text-[#5F7099]">{name}</p>}
    </Field>
  );
}

export default function KycPage() {
  const [kyc, setKyc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [docType, setDocType] = useState("NATIONAL_ID");
  const [docNumber, setDocNumber] = useState("");
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const toast = useToast();

  async function load() {
    try {
      const r = await api.kycMe();
      setKyc(r.data.kyc);
    } catch {
      setKyc(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!idFront || !selfie) {
      setMsg({ ok: false, text: "ID front photo and selfie are required." });
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append("documentType", docType);
      form.append("documentNumber", docNumber.trim());
      form.append("idFront", idFront);
      if (idBack) form.append("idBack", idBack);
      form.append("selfie", selfie);
      await api.kycSubmit(form);
      toast("KYC submitted for review", "success");
      await load();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof ApiError ? err.message : "Submit failed" });
    } finally {
      setBusy(false);
    }
  }

  const showForm = !kyc || kyc.status === "REJECTED";

  return (
    <>
      <PageHeader title="KYC Verification" sub="Submit a government ID + selfie — required before withdrawals" />

      <div className="grid gap-6 lg:grid-cols-2">
        {loading ? (
          <Card title="Status"><Spinner /></Card>
        ) : kyc && (
          <Card title="Your KYC status" subtitle={`Submitted ${fmtDate(kyc.submittedAt)}`}>
            <div className="space-y-3">
              <Badge value={kyc.status} />
              {kyc.status === "REJECTED" && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  Rejected{kyc.rejectionReason ? `: ${kyc.rejectionReason}` : ""} — resubmit below.
                </p>
              )}
              {kyc.status === "PENDING" && (
                <p className="text-sm text-[#8FA3CC]">Under review — you will be able to withdraw once approved.</p>
              )}
              {kyc.status === "APPROVED" && (
                <p className="text-sm text-emerald-300">Verified — withdrawals are unlocked.</p>
              )}
            </div>
          </Card>
        )}

        {showForm && !loading && (
          <Card title="Submit documents" subtitle="JPG/PNG/WEBP · max 5MB each">
            <form onSubmit={submit} className="space-y-4">
              <Field label="Document type">
                <select className={inputCls} value={docType} onChange={(e) => setDocType(e.target.value)}>
                  {DOC_TYPES.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Document number">
                <input className={inputCls} value={docNumber} onChange={(e) => setDocNumber(e.target.value)} required minLength={4} />
              </Field>
              <FileField label="ID front photo" onChange={setIdFront} />
              <FileField label="ID back photo (optional)" hint="optional" onChange={setIdBack} />
              <FileField label="Selfie holding the ID" onChange={setSelfie} />
              {msg && (
                <p className={`rounded-lg border px-4 py-2.5 text-sm ${msg.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
                  {msg.text}
                </p>
              )}
              <button disabled={busy} className={`${btnPrimary} w-full`}>
                {busy ? "Uploading…" : kyc ? "Resubmit KYC" : "Submit KYC"}
              </button>
            </form>
          </Card>
        )}
      </div>
    </>
  );
}
