"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Field, inputCls, btnPrimary, btnGhost } from "@/components/app/ui";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendCode() {
    setError(null);
    setBusy(true);
    try {
      await api.forgotPassword(email.trim());
      setStep(2);
      setInfo("Reset code sent — check your inbox");
      setCooldown(60);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send code");
    } finally {
      setBusy(false);
    }
  }

  async function onReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api.resetPassword(email.trim(), code.trim(), password);
      router.push("/login?reset=1");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="hero-glow flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel-glass w-full max-w-md rounded-3xl p-8">
        <Link href="/" className="mb-8 flex justify-center">
          <Image src="/logo.png" alt="BIG" width={140} height={60} className="h-11 w-auto" />
        </Link>
        <h1 className="font-display text-center text-2xl font-bold text-[#E8EDFA]">
          Reset password
        </h1>
        <p className="mt-1 text-center text-sm text-[#8FA3CC]">
          {step === 1
            ? "Enter your account email — we'll send a 6-digit reset code"
            : "Enter the code from your email and choose a new password"}
        </p>

        {step === 1 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendCode();
            }}
            className="mt-8 space-y-4"
          >
            <Field label="Email">
              <input
                type="email"
                className={inputCls}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
              {busy ? "Sending…" : "Send reset code"}
            </button>
          </form>
        ) : (
          <form onSubmit={onReset} className="mt-8 space-y-4">
            <Field label="Email">
              <input type="email" className={inputCls} value={email} disabled />
            </Field>
            <Field label="Reset code">
              <input
                className={inputCls + " text-center font-mono text-lg tracking-[0.5em]"}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                required
                minLength={6}
              />
            </Field>
            <Field label="New password">
              <input
                type="password"
                className={inputCls}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />
            </Field>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                {error}
              </p>
            )}
            {info && (
              <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
                {info}
              </p>
            )}

            <button type="submit" disabled={busy || code.length !== 6} className={`${btnPrimary} w-full`}>
              {busy ? "Resetting…" : "Set new password"}
            </button>
            <button type="button" onClick={sendCode} disabled={cooldown > 0 || busy} className={`${btnGhost} w-full`}>
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[#8FA3CC]">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-[#7FA8FF] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
