"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Spinner, Field, inputCls, btnPrimary } from "@/components/app/ui";
import { useToast } from "@/components/app/toast";

type KycMe = {
  status: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
};

const KYC_BADGE: Record<KycMe["status"], { label: string; cls: string }> = {
  NONE: { label: "Not submitted", cls: "border-[#3A5078] text-[#9FB8EE]" },
  PENDING: { label: "Under review", cls: "border-amber-500/40 text-amber-300" },
  APPROVED: { label: "Verified", cls: "border-emerald-500/40 text-emerald-300" },
  REJECTED: { label: "Rejected", cls: "border-red-500/40 text-red-300" },
};

function WithdrawalSecurityCard() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  const has = !!user?.hasWithdrawalPassword;
  const unlockAt = user?.withdrawalPasswordUnlockAt ? new Date(user.withdrawalPasswordUnlockAt) : null;
  const locked = !!unlockAt && unlockAt.getTime() > Date.now();

  async function sendOtp() {
    setBusy(true);
    try {
      await api.requestWithdrawalPasswordOtp();
      setOtpSent(true);
      toast("OTP sent to your email", "success");
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Could not send OTP", "error");
    } finally {
      setBusy(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== pw2) return toast("Passwords do not match", "error");
    setBusy(true);
    try {
      await api.setWithdrawalPassword(pw, has ? otp : undefined);
      await refreshUser();
      toast("Withdrawal password saved — unlocks after the lock period", "success");
      setPw(""); setPw2(""); setOtp(""); setOtpSent(false);
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Failed", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card title="Withdrawal security" subtitle="A separate password required on every withdrawal">
      <div className="space-y-4">
        <p className="text-sm">
          {!has ? (
            <span className="text-amber-300">Not set — required before your first withdrawal.</span>
          ) : locked ? (
            <span className="text-amber-300">
              Recently changed — withdrawals unlock at {unlockAt!.toLocaleString()}.
            </span>
          ) : (
            <span className="text-emerald-300">Active — withdrawals are unlocked.</span>
          )}
        </p>

        {has && !otpSent && (
          <button type="button" onClick={sendOtp} disabled={busy} className={btnGhostCls}>
            {busy ? "Sending…" : "Change password (emails an OTP)"}
          </button>
        )}

        {(!has || otpSent) && (
          <form onSubmit={save} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {has && (
              <Field label="Email OTP code">
                <input className={inputCls} value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </Field>
            )}
            <Field label="New withdrawal password">
              <input
                type="password"
                className={inputCls}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                minLength={6}
                autoComplete="new-password"
                required
              />
            </Field>
            <Field label="Confirm password">
              <input
                type="password"
                className={inputCls}
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                minLength={6}
                autoComplete="new-password"
                required
              />
            </Field>
            <div className="sm:col-span-2">
              <button type="submit" disabled={busy} className={btnPrimary}>
                {busy ? "Saving…" : has ? "Change password" : "Set password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}

const btnGhostCls =
  "rounded-xl border border-[#24406E] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#9FB8EE] transition hover:border-[#1255FF] disabled:opacity-50";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [kyc, setKyc] = useState<KycMe | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [mobile, setMobile] = useState(user?.mobile ?? "");

  useEffect(() => {
    setName(user?.name ?? "");
    setMobile(user?.mobile ?? "");
  }, [user]);

  useEffect(() => {
    api
      .kycMe()
      .then((r) => setKyc(r.data.kyc ?? { status: "NONE" }))
      .catch(() => setKyc({ status: "NONE" }));
  }, []);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("avatar", f);
      await api.updateAvatar(form);
      await refreshUser();
      toast("Profile photo updated", "success");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateMe({ name: name.trim() || undefined, mobile: mobile.trim() || undefined });
      await refreshUser();
      toast("Profile updated", "success");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Update failed", "error");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <Spinner />;

  const badge = KYC_BADGE[kyc?.status ?? "NONE"];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="My Profile" sub="Account details, KYC status and profile photo" />

      {/* Photo + identity */}
      <Card>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            title="Change profile photo"
            className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-[#24406E] bg-[#0A1226]"
          >
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-4xl font-bold text-[#7FA8FF]">
                {user.name?.[0]?.toUpperCase()}
              </span>
            )}
            <span className="absolute inset-0 flex items-end justify-center bg-black/50 pb-2 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
              {uploading ? "UPLOADING…" : "CHANGE"}
            </span>
          </button>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onPick} />

          <div className="w-full space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-xl font-bold text-[#E8EDFA]">{user.name}</h2>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase ${badge.cls}`}
              >
                KYC: {badge.label}
              </span>
            </div>
            <p className="text-sm text-[#9FB8EE]">{user.email}</p>
            <div className="grid grid-cols-1 gap-2 pt-1 text-sm sm:grid-cols-2">
              <p className="text-[#5F7099]">
                Mobile: <span className="text-[#9FB8EE]">{user.mobile || "—"}</span>
              </p>
              <p className="text-[#5F7099]">
                Referral code: <span className="font-mono text-[#9FB8EE]">{user.referralCode}</span>
              </p>
            </div>
            {kyc?.status === "REJECTED" && (
              <p className="text-xs text-red-400">KYC rejected{kyc.rejectionReason ? `: ${kyc.rejectionReason}` : ""}</p>
            )}
            {kyc?.status !== "APPROVED" && (
              <Link href="/kyc" className="inline-block text-xs font-semibold text-[#7FA8FF] hover:underline">
                {kyc?.status === "REJECTED" || kyc?.status === "PENDING" ? "View KYC status →" : "Complete KYC →"}
              </Link>
            )}
          </div>
        </div>
      </Card>

      {/* Edit details */}
      <div className="mt-4">
        <Card title="Edit details">
          <form onSubmit={onSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required />
            </Field>
            <Field label="Mobile">
              <input className={inputCls} value={mobile} onChange={(e) => setMobile(e.target.value)} maxLength={20} />
            </Field>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className={btnPrimary}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </Card>
      </div>

      {/* Withdrawal password */}
      <div className="mt-4">
        <WithdrawalSecurityCard />
      </div>
    </div>
  );
}
