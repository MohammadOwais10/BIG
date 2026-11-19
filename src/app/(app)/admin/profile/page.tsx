"use client";

import { useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Field, inputCls, btnPrimary } from "@/components/app/ui";
import { useToast } from "@/components/app/toast";

export default function AdminProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarBusy(true);
    try {
      const form = new FormData();
      form.append("avatar", f);
      await api.updateAvatar(form);
      await refreshUser();
      toast("Profile photo updated", "success");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Upload failed", "error");
    } finally {
      setAvatarBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) return toast("Passwords do not match", "error");
    setBusy(true);
    try {
      await api.changePassword(current, next);
      toast("Password changed — please log in again", "success");
      setTimeout(() => logout(), 800);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Failed to change password", "error");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="My profile" sub="Admin account settings" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Account details">
          <div className="flex flex-col items-center py-4 text-center">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={avatarBusy}
              title="Change photo"
              className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-[#24406E] bg-[#0A1226] transition hover:border-[#1255FF] disabled:opacity-50"
            >
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#7FA8FF]">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#CBD6EC] opacity-0 transition group-hover:opacity-100">
                {avatarBusy ? "…" : "Edit"}
              </span>
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onPick} />
            <p className="mt-4 text-base font-semibold text-[#E8EDFA]">{user?.name}</p>
            <p className="mt-0.5 truncate text-xs text-[#5F7099]">{user?.email}</p>
            <p className="mt-2.5 inline-block rounded-full border border-[#1255FF]/40 bg-[#1255FF]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7FA8FF]">
              {user?.role}
            </p>
          </div>
        </Card>

        <Card title="Change password" subtitle="For your admin login — other sessions get logged out">
          <form onSubmit={changePassword} className="space-y-4">
            <Field label="Current password">
              <input
                type="password"
                className={inputCls}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
            <Field label="New password" hint="Minimum 8 characters">
              <input
                type="password"
                className={inputCls}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                minLength={8}
                maxLength={64}
                autoComplete="new-password"
                required
              />
            </Field>
            <Field label="Confirm new password">
              <input
                type="password"
                className={inputCls}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={8}
                maxLength={64}
                autoComplete="new-password"
                required
              />
            </Field>
            <button disabled={busy} className={`${btnPrimary} w-full`}>
              {busy ? "Changing…" : "Change password"}
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
