"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { Field, inputCls, btnPrimary, PasswordInput } from "@/components/app/ui";
import { riskDisclosure } from "@/lib/content";

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    referralCode: params.get("ref") ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [consented, setConsented] = useState(false);
  const [showDisclosure, setShowDisclosure] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        password: form.password,
        referralCode: form.referralCode.trim() || undefined,
      });
      router.push(`/verify-email?email=${encodeURIComponent(form.email.trim())}`);
    } catch (err) {
      if (err instanceof ApiError) {
        const detail = err.details?.map((d) => `${d.field}: ${d.message}`).join(", ");
        setError(detail ? `${err.message} — ${detail}` : err.message);
      } else {
        setError("Registration failed");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="hero-glow flex min-h-screen items-center justify-center px-4 py-24">
      <div className="panel-glass w-full max-w-md rounded-3xl p-8">
        <Link href="/" className="mb-8 flex justify-center">
          <Image src="/logo.png" alt="BIG" width={140} height={60} className="h-11 w-auto" />
        </Link>
        <h1 className="font-display text-center text-2xl font-bold text-[#E8EDFA]">
          Create your account
        </h1>
        <p className="mt-1 text-center text-sm text-[#8FA3CC]">
          Start investing from $100 and grow your team
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="Full name">
            <input className={inputCls} value={form.name} onChange={set("name")} required minLength={2} />
          </Field>
          <Field label="Email">
            <input type="email" className={inputCls} value={form.email} onChange={set("email")} required />
          </Field>
          <Field label="Mobile">
            <input className={inputCls} value={form.mobile} onChange={set("mobile")} required minLength={10} placeholder="+15550001111" />
          </Field>
          <Field label="Password">
            <PasswordInput value={form.password} onChange={set("password")} minLength={8} autoComplete="new-password" />
          </Field>
          <Field label="Confirm password">
            <PasswordInput value={form.confirmPassword} onChange={set("confirmPassword")} minLength={8} autoComplete="new-password" />
          </Field>
          <Field label="Referral code (optional)">
            <input className={inputCls} value={form.referralCode} onChange={set("referralCode")} placeholder="ABC12345" />
          </Field>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--line)] bg-[#0A1226] px-4 py-3 text-xs leading-relaxed text-[#CBD6EC]">
            <input
              type="checkbox"
              checked={consented}
              onChange={(e) => {
                if (e.target.checked) {
                  setShowDisclosure(true);
                } else {
                  setConsented(false);
                }
              }}
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#1255FF]"
            />
            <span>
              {riskDisclosure.checkboxLabel}{" "}
              <span className="font-semibold text-[#7FA8FF] underline underline-offset-2">
                Tap to read
              </span>
            </span>
          </label>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy || !consented} className={`${btnPrimary} w-full`}>
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>

        {showDisclosure && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={riskDisclosure.title}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#04070F]/85 px-4 backdrop-blur-sm"
            onClick={() => setShowDisclosure(false)}
          >
            <div
              className="panel-glass flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-6 py-4">
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-[#7FA8FF]">
                  {riskDisclosure.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowDisclosure(false)}
                  aria-label="Close"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#8FA3CC] transition hover:bg-white/5 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4" aria-hidden>
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto px-6 py-5 text-sm leading-relaxed text-[#8FA3CC]">
                <p>{riskDisclosure.intro}</p>
                <ol className="list-decimal space-y-3 pl-5">
                  {riskDisclosure.points.map((point) => (
                    <li key={point.title}>
                      <span className="font-semibold text-[#CBD6EC]">{point.title}:</span>{" "}
                      {point.body}
                    </li>
                  ))}
                </ol>
                <p className="border-t border-[var(--line)] pt-4 text-[#CBD6EC]">
                  {riskDisclosure.outro}
                </p>
              </div>

              <div className="border-t border-[var(--line)] px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setConsented(true);
                    setShowDisclosure(false);
                  }}
                  className={`${btnPrimary} w-full`}
                >
                  I Agree &amp; Accept
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-[#8FA3CC]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#7FA8FF] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
