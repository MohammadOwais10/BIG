"use client";

import { useEffect, useState } from "react";
import { api, fmtUsd, fmtDate, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, EmptyState, Pager, inputCls } from "@/components/app/ui";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await api.adminUsers(page, 10, search || undefined, status || undefined);
      setUsers(r.data.users);
      setTotalPages(r.data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, status]);

  async function openUser(id: string) {
    const r = await api.adminUser(id);
    setSelected(r.data.user);
  }

  async function toggleStatus(u: any) {
    try {
      await api.adminUpdateUserStatus(u.id, u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE");
      await load();
      if (selected?.id === u.id) openUser(u.id);
    } catch (e) {
      setMsg({ ok: false, text: e instanceof ApiError ? e.message : "Failed" });
    }
  }

  return (
    <>
      <PageHeader title="Users" sub="Search, manage and adjust user accounts" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="All users"
            action={
              <div className="flex gap-2">
                <input
                  className={inputCls + " !w-48 py-1.5 text-xs"}
                  placeholder="Search name/email…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
                <select
                  className={inputCls + " !w-32 py-1.5 text-xs"}
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                >
                  <option value="">All</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            }
          >
            {loading ? (
              <Spinner />
            ) : users.length === 0 ? (
              <EmptyState title="No users found" />
            ) : (
              <ul className="divide-y divide-[#16233F]">
                {users.map((u) => (
                  <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <button onClick={() => openUser(u.id)} className="min-w-0 text-left">
                      <p className="truncate text-sm font-medium text-[#E8EDFA] hover:text-[#7FA8FF]">{u.name}</p>
                      <p className="truncate text-xs text-[#5F7099]">
                        {u.email} · {u.referralCode}
                        {u.referredBy ? ` · by ${u.referredBy.name}` : ""}
                      </p>
                    </button>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge value={u.role} />
                      <Badge value={u.status} />
                      <button
                        onClick={() => toggleStatus(u)}
                        className="rounded-lg border border-[#24406E] px-2.5 py-1 text-[10px] font-semibold uppercase text-[#9FB8EE] hover:border-[#1255FF]"
                      >
                        {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Pager page={page} totalPages={totalPages} onPage={setPage} />
          </Card>
        </div>

        <Card title="User detail" subtitle={selected ? selected.email : "Select a user"}>
          {!selected ? (
            <EmptyState title="No user selected" hint="Click a user from the list" />
          ) : (
            <div className="space-y-4">
              <div>
                <p className="font-display text-lg font-semibold text-[#E8EDFA]">{selected.name}</p>
                <p className="text-xs text-[#5F7099]">
                  {selected.mobile} · joined {fmtDate(selected.createdAt)}
                </p>
                <div className="mt-2 flex gap-2">
                  <Badge value={selected.role} />
                  <Badge value={selected.status} />
                </div>
              </div>

              <div className="rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 p-4 text-sm">
                <p className="text-[10px] uppercase tracking-widest text-[#5F7099]">Wallet</p>
                <p className="ticker-numeric mt-1 text-lg font-semibold text-emerald-300">
                  {fmtUsd(selected.wallet?.availableBalance)}
                </p>
                <p className="text-xs text-[#8FA3CC]">
                  locked {fmtUsd(selected.wallet?.lockedBalance)}
                </p>
              </div>

              {msg && (
                <p className={`rounded-lg border px-3 py-2 text-xs ${msg.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
                  {msg.text}
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
