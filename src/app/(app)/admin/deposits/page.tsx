"use client";

import { useEffect, useState } from "react";
import { api, fmtUsd, fmtDate, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/app/app-shell";
import { Card, Badge, Spinner, EmptyState, Pager, Field, Copyable, inputCls, btnPrimary } from "@/components/app/ui";

const STATUSES = ["", "PENDING", "CONFIRMED", "CREDITED", "REJECTED"];

function WalletPool({
  network,
  label,
  hint,
  wallets,
  onChanged,
}: {
  network: string;
  label: string;
  hint: string;
  wallets: any[];
  onChanged: () => void;
}) {
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await api.adminAddDepositWallet(network, address.trim());
      setAddress("");
      setMsg({ ok: true, text: "Wallet added to the pool." });
      onChanged();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof ApiError ? err.message : "Failed" });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      await api.adminRemoveDepositWallet(id);
      onChanged();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof ApiError ? err.message : "Failed" });
    }
  }

  return (
    <Card title={`${label} wallets`} subtitle={hint}>
      <form onSubmit={add} className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-72 flex-1">
          <Field label={`Add ${network} receiving address`}>
            <input
              className={inputCls + " font-mono text-xs"}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={network === "BEP20" ? "0x…" : "T…"}
              required
            />
          </Field>
        </div>
        <button disabled={saving} className={btnPrimary}>
          {saving ? "Adding…" : "Add wallet"}
        </button>
      </form>

      {wallets.length === 0 ? (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
          No {network} wallet configured — users can&apos;t deposit on this network.
        </p>
      ) : (
        <ul className="space-y-2">
          {wallets.map((w) => (
            <li
              key={w.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#1C2C50] bg-[#0A1226]/70 px-4 py-2.5"
            >
              <span className="break-all font-mono text-xs text-[#9FB8EE]">{w.address}</span>
              <button
                onClick={() => remove(w.id)}
                className="shrink-0 text-xs font-semibold text-red-300/90 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {msg && (
        <p className={`mt-3 rounded-lg border px-4 py-2 text-xs ${msg.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
          {msg.text}
        </p>
      )}
    </Card>
  );
}

export default function AdminDeposits() {
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [pools, setPools] = useState<{ BEP20: any[]; TRC20: any[] }>({ BEP20: [], TRC20: [] });

  async function loadPools() {
    const r = await api.adminDepositWallets();
    setPools(r.data);
  }
  useEffect(() => {
    loadPools().catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .adminDeposits(page, 20, status || undefined)
      .then((r) => {
        setList(r.data.deposits);
        setTotalPages(r.data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page, status]);

  return (
    <>
      <PageHeader
        title="Crypto deposits"
        sub="USDT on BEP20 + TRC20 — a random pool wallet is shown to each depositor"
      />

      <p className="mb-4 rounded-lg border border-[#1C2C50] bg-[#0A1226]/60 px-3 py-2 text-[11px] leading-relaxed text-[#8FA3CC]">
        Add multiple receiving wallets per network. Every deposit session shows the user{" "}
        <span className="text-[#E8EDFA]">one random address</span> — verification accepts a USDT
        transfer to <span className="text-[#E8EDFA]">any active wallet</span> in that network&apos;s pool.
      </p>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <WalletPool
          network="BEP20"
          label="BEP20 (BNB Smart Chain)"
          hint="0x… addresses on BSC"
          wallets={pools.BEP20}
          onChanged={loadPools}
        />
        <WalletPool
          network="TRC20"
          label="TRC20 (Tron)"
          hint="T… addresses on Tron"
          wallets={pools.TRC20}
          onChanged={loadPools}
        />
      </div>

      <Card
        title="Deposits"
        action={
          <select className={inputCls + " !w-36 py-1.5 text-xs"} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s || "All statuses"}</option>
            ))}
          </select>
        }
      >
        {loading ? (
          <Spinner />
        ) : list.length === 0 ? (
          <EmptyState title="No deposits" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[#16233F] text-left text-[10px] uppercase tracking-[0.16em] text-[#5F7099]">
                  <th className="pb-2 pr-4">User</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2 pr-4">Network</th>
                  <th className="pb-2 pr-4">Confirmations</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2">Tx</th>
                </tr>
              </thead>
              <tbody>
                {list.map((d) => (
                  <tr key={d.id} className="border-b border-[#101B34] last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-[#CBD6EC]">{d.user?.name}</p>
                      <p className="text-xs text-[#5F7099]">{d.user?.email}</p>
                    </td>
                    <td className="ticker-numeric py-3 pr-4 font-semibold text-emerald-300">
                      +{fmtUsd(d.amount)} USDT
                    </td>
                    <td className="py-3 pr-4 text-[10px] font-semibold uppercase text-[#8FA3CC]">
                      {d.network || "BEP20"}
                    </td>
                    <td className="ticker-numeric py-3 pr-4 text-[#8FA3CC]">{d.confirmations}</td>
                    <td className="py-3 pr-4"><Badge value={d.status} /></td>
                    <td className="py-3 pr-4 text-[#8FA3CC]">{fmtDate(d.createdAt)}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Copyable value={d.txHash} />
                        <a
                          href={d.network === "TRC20"
                            ? `https://nile.tronscan.org/#/transaction/${d.txHash.replace(/^trc20:/, "")}`
                            : `https://testnet.bscscan.com/tx/${d.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-emerald-300 hover:underline"
                        >
                          ↗
                        </a>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager page={page} totalPages={totalPages} onPage={setPage} />
      </Card>
    </>
  );
}
