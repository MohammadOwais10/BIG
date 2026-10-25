"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";
import { Field, inputCls, btnPrimary, btnGhost } from "@/components/app/ui";

function VerifyForm() {
  const { verifyEmail } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await verifyEmail(email.trim(), code.trim());
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setError(null);
    setInfo(null);
    try {
      await api.resendOtp(email.trim());
      setInfo("New code sent — check your inbox");
      setCooldown(60);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend code");
    }
  }

  return (
    <div className="hero-glow flex min-h-screen items-center justify-center px-4 py-24">
      <div className="panel-glass w-full max-w-md rounded-3xl p-8">
        <Link href="/" className="mb-8 flex justify-center">
          <Image src="/logo.png" alt="BIG" width={140} height={60} className="h-11 w-auto" />
        </Link>
        <h1 className="font-display text-center text-2xl font-bold text-[#E8EDFA]">
          Verify your email
        </h1>
        <p className="mt-1 text-center text-sm text-[#8FA3CC]">
          We sent a 6-digit code to your email — enter it below to activate your account
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="Email">
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Verification code">
            <input
              className={inputCls + " text-center font-mono text-lg tracking-[0.5em]"}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              inputMode="numeric"
              required
              minLength={6}
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
            {busy ? "Verifying…" : "Verify & continue"}
          </button>

          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0 || !email}
            className={`${btnGhost} w-full`}
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8FA3CC]">
          Wrong email?{" "}
          <Link href="/register" className="font-semibold text-[#7FA8FF] hover:underline">
            Register again
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
