"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { Field, inputCls, btnPrimary, PasswordInput } from "@/components/app/ui";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const justReset = params.get("reset") === "1";
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const user = await login(identifier.trim(), password);
      router.push(user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.errorCode === "EMAIL_NOT_VERIFIED") {
        router.push(`/verify-email?email=${encodeURIComponent(identifier.trim())}`);
        return;
      }
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="hero-glow flex min-h-screen items-center justify-center px-4">
      <div className="panel-glass w-full max-w-md rounded-3xl p-8">
        <Link href="/" className="mb-8 flex justify-center">
          <Image src="/logo.png" alt="BIG" width={140} height={60} className="h-11 w-auto" />
        </Link>
        <h1 className="font-display text-center text-2xl font-bold text-[#E8EDFA]">
          Welcome back
        </h1>
        <p className="mt-1 text-center text-sm text-[#8FA3CC]">
          Sign in with your email or mobile number
        </p>

        {justReset && (
          <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
            Password reset successful — sign in with your new password
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <Field label="Email or Mobile">
            <input
              className={inputCls}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com"
              autoComplete="username"
              required
            />
          </Field>
          <Field label="Password">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>
          <div className="-mt-2 text-right">
            <Link href="/forgot-password" className="text-xs font-semibold text-[#7FA8FF] hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8FA3CC]">
          No account yet?{" "}
          <Link href="/register" className="font-semibold text-[#7FA8FF] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
