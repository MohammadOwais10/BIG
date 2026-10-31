"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { api, ApiError } from "@/lib/api";
import { USDT_CONTRACT, USDT_DECIMALS } from "@/lib/web3";
import { Card, Field, inputCls, btnPrimary, btnGhost } from "@/components/app/ui";
import { WalletConnect } from "@/components/app/wallet-connect";
import { useToast } from "@/components/app/toast";

const ERC20_ABI = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const;

const NETWORK_LABELS: Record<string, string> = {
  BEP20: "BNB Smart Chain (BEP20)",
  TRC20: "Tron (TRC20)",
};

function hashValid(hash: string, network: string) {
  const h = hash.trim().replace(/^0x/i, network === "TRC20" ? "" : "0x");
  return network === "TRC20" ? /^[0-9a-fA-F]{64}$/.test(h) : /^0x[0-9a-fA-F]{64}$/.test(h);
}

// Fresh chain txs take a few seconds to reach the indexer — retry before failing.
async function submitWithRetry(hash: string, network: string, attempt = 0): Promise<any> {
  try {
    return await api.submitDeposit(hash, network);
  } catch (e) {
    const text = e instanceof ApiError ? e.message : "";
    if (attempt < 6 && /not found|on Tron|on-chain/i.test(text)) {
      await new Promise((r) => setTimeout(r, 3000));
      return submitWithRetry(hash, network, attempt + 1);
    }
    throw e;
  }
}

export function useDepositConfig() {
  const [config, setConfig] = useState<any>(null);
  useEffect(() => {
    api.depositConfig().then((r) => setConfig(r.data)).catch(() => {});
  }, []);
  return config;
}

export function DepositCard({
  config: initialConfig,
  onCredited,
}: {
  config: any;
  onCredited?: () => void;
}) {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { writeContract, data: txHash, isPending: sending, error: sendError } = useWriteContract();
  const { isLoading: confirming, isSuccess: mined } = useWaitForTransactionReceipt({ hash: txHash });

  const [network, setNetwork] = useState("BEP20");
  const [config, setConfig] = useState<any>(initialConfig);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tronReady, setTronReady] = useState(false);
  const [tronBusy, setTronBusy] = useState(false);
  const toast = useToast();

  useEffect(() => setConfig(initialConfig), [initialConfig]);

  useEffect(() => {
    api.depositConfig(network).then((r) => setConfig(r.data)).catch(() => {});
  }, [network]);

  const depositWallet = (config?.depositWallet || "") as `0x${string}`;
  const isTron = network === "TRC20";
  const networks = config?.availableNetworks ?? [];

  // TronLink exposes window.tronWeb once connected
  useEffect(() => {
    if (!isTron) return;
    const tw = (window as any).tronWeb;
    setTronReady(Boolean(tw?.ready && tw.defaultAddress?.base58));
  }, [isTron]);

  useEffect(() => {
    if (mined && txHash && !submitted) {
      setSubmitted(true);
      submitHash(txHash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mined, txHash]);

  async function submitHash(hash: string) {
    try {
      const r = await submitWithRetry(hash, network);
      if (r.data.duplicate) {
        setMsg({ ok: true, text: "This transaction was already verified earlier — it can only be credited once." });
        toast("Already used — this deposit was credited before", "info");
        onCredited?.();
        return;
      }
      const invested = Boolean(r.data.investment);
      const credited = r.data.deposit.status === "CREDITED";
      setMsg({
        ok: true,
        text: invested
          ? "Deposit confirmed — automatically invested (min $100)."
          : credited
            ? "Deposit confirmed — credited to your wallet (below min investment)."
            : `Deposit recorded. Awaiting ${config?.requiredConfirmations ?? 12} confirmations — auto-invest will happen shortly.`,
      });
      toast(
        invested
          ? `Deposit of ${r.data.deposit.amount} USDT confirmed — auto-invested`
          : credited
            ? `Deposit of ${r.data.deposit.amount} USDT confirmed — wallet credited`
            : "Deposit submitted — will auto-invest after confirmations",
        credited ? "success" : "info"
      );
      onCredited?.();
    } catch (e) {
      const text = e instanceof ApiError ? e.message : "Submission failed";
      setMsg({ ok: false, text });
      toast(text, "error");
    }
  }

  function sendUsdt(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setSubmitted(false);
    writeContract({
      address: USDT_CONTRACT,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [depositWallet, parseUnits(amount || "0", USDT_DECIMALS)],
    });
  }

  async function connectTron() {
    const tl = (window as any).tronLink;
    if (!tl) {
      toast("TronLink not detected — install the TronLink extension", "error");
      return;
    }
    try {
      await tl.request({ method: "tron_requestAccounts" });
      setTronReady(Boolean((window as any).tronWeb?.ready));
    } catch {
      toast("TronLink connection rejected", "error");
    }
  }

  async function sendTron(e: React.FormEvent) {
    e.preventDefault();
    const tw = (window as any).tronWeb;
    if (!tw?.ready) return toast("Connect TronLink first", "error");
    if (!config?.contract) return toast("TRC20 USDT is not configured", "error");
    setTronBusy(true);
    setMsg(null);
    try {
      const c = await tw.contract().at(config.contract);
      const raw = Math.round(Number(amount || "0") * 10 ** (config.usdtDecimals ?? 6));
      const txid = await c.transfer(depositWallet, raw).send({ feeLimit: 15_000_000 });
      await submitHash(txid);
    } catch (err: any) {
      const text = err?.message || "Tron send failed";
      setMsg({ ok: false, text });
      toast(text, "error");
    } finally {
      setTronBusy(false);
    }
  }

  return (
    <Card
      title="Deposit USDT"
      subtitle={config ? `${NETWORK_LABELS[config.network] ?? config.network} · ${config.requiredConfirmations} confirmations required` : undefined}
    >
      {networks.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {networks.map((n: any) => (
            <button
              key={n.code}
              type="button"
              disabled={!n.enabled}
              onClick={() => { setNetwork(n.code); setMsg(null); }}
              className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                network === n.code
                  ? "border-[#1255FF] bg-[#1255FF]/15 text-[#7FA8FF]"
                  : n.enabled
                    ? "border-[#1C2C50] text-[#8FA3CC] hover:border-[#24406E]"
                    : "cursor-not-allowed border-[#1C2C50] text-[#3d4d75] opacity-50"
              }`}
            >
              {n.label}
              {!n.enabled && <span className="block text-[9px] font-normal">not configured</span>}
            </button>
          ))}
        </div>
      )}

      {depositWallet ? (
        <div className="mb-5 rounded-xl border border-[#1255FF]/40 bg-[#1255FF]/8 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8FA3CC]">
            Send USDT ({network}) to this address
          </p>
          <p className="mt-1.5 break-all font-mono text-xs leading-relaxed text-[#7FA8FF]">
            {depositWallet}
          </p>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(depositWallet);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="mt-2 text-xs font-semibold text-[#7FA8FF] hover:underline"
          >
            {copied ? "Copied!" : "Copy address"}
          </button>
          {isTron && (
            <p className="mt-2 text-[10px] leading-relaxed text-[#5F7099]">
              Or send from Binance/any exchange — select <b>USDT-TRC20</b>, then paste your tx hash below.
            </p>
          )}
        </div>
      ) : (
        <p className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
          {network} deposit wallet is being configured by the admin.
        </p>
      )}

      {!isTron &&
        (!isConnected ? (
          <div className="space-y-4">
            <p className="text-sm text-[#8FA3CC]">
              Connect your wallet (Binance Web3, MetaMask, WalletConnect) to deposit USDT — or send
              directly to the address above and paste your tx hash below.
            </p>
            <WalletConnect />
          </div>
        ) : (
          <form onSubmit={sendUsdt} className="space-y-4">
            <WalletConnect />

            <Field label="Amount (USDT)" hint="Deposits of $100 or more are invested automatically">
              <input
                type="number"
                min="0.01"
                step="0.01"
                className={inputCls}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                required
              />
            </Field>

            <button type="submit" disabled={sending || confirming || !amount || !depositWallet} className={`${btnPrimary} w-full`}>
              {sending
                ? "Confirm in wallet…"
                : confirming
                  ? "Waiting for confirmation…"
                  : `Send ${amount || "0"} USDT`}
            </button>

            <button type="button" onClick={() => open()} className={`${btnGhost} w-full`}>
              Switch wallet
            </button>
          </form>
        ))}

      {isTron && depositWallet && (
        <form onSubmit={sendTron} className="space-y-4">
          {!tronReady ? (
            <>
              <p className="text-sm text-[#8FA3CC]">
                Connect TronLink to deposit USDT — or send directly to the address above and paste
                your tx hash below.
              </p>
              <button type="button" onClick={connectTron} className={`${btnPrimary} w-full`}>
                Connect TronLink
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                <p className="font-mono text-[10px] text-emerald-300">
                  TronLink: {(window as any).tronWeb?.defaultAddress?.base58}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTronReady(false);
                    toast("Disconnected — switch account in TronLink then connect again", "info");
                  }}
                  className="text-[10px] font-semibold uppercase tracking-wider text-[#8FA3CC] hover:text-red-300"
                >
                  Disconnect
                </button>
              </div>
              <Field label="Amount (USDT)" hint="Deposits of $100 or more are invested automatically">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={inputCls}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100.00"
                  required
                />
              </Field>
              <button type="submit" disabled={tronBusy || !amount} className={`${btnPrimary} w-full`}>
                {tronBusy ? "Confirm in TronLink…" : `Send ${amount || "0"} USDT`}
              </button>
            </>
          )}
        </form>
      )}

      {sendError && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
          {sendError.message.split("\n")[0]}
        </p>
      )}
      {msg && (
        <p className={`mt-4 rounded-lg border px-4 py-2.5 text-sm ${msg.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
          {msg.text}
        </p>
      )}
      {txHash && !isTron && (
        <p className="mt-3 break-all font-mono text-[10px] text-[#5F7099]">tx: {txHash}</p>
      )}
    </Card>
  );
}

export function ManualDepositCard({ onCredited }: { onCredited?: () => void }) {
  const [network, setNetwork] = useState("BEP20");
  const [config, setConfig] = useState<any>(null);
  const [qr, setQr] = useState("");
  const [hash, setHash] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const toast = useToast();
  const isTron = network === "TRC20";

  useEffect(() => {
    api.depositConfig(network).then((r) => setConfig(r.data)).catch(() => {});
  }, [network]);

  const depositWallet = (config?.depositWallet || "") as string;
  const networks = config?.availableNetworks ?? [];

  useEffect(() => {
    if (!depositWallet) {
      setQr("");
      return;
    }
    QRCode.toDataURL(depositWallet, {
      width: 220,
      margin: 0,
      color: { dark: "#0A1226", light: "#FFFFFF" },
    })
      .then(setQr)
      .catch(() => setQr(""));
  }, [depositWallet]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const h = hash.trim();
    if (!hashValid(h, network)) {
      toast("Invalid tx hash for this network", "error");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const r = await submitWithRetry(h, network);
      if (r.data.duplicate) {
        setMsg({ ok: true, text: "This transaction was already verified earlier — it can only be credited once." });
        toast("Already used — this deposit was credited before", "info");
        onCredited?.();
        return;
      }
      const invested = Boolean(r.data.investment);
      const credited = r.data.deposit.status === "CREDITED";
      setMsg({
        ok: true,
        text: invested
          ? "Deposit confirmed — automatically invested (min $100)."
          : credited
            ? "Deposit confirmed — credited to your wallet (below min investment)."
            : `Deposit recorded. Awaiting ${config?.requiredConfirmations ?? 12} confirmations — auto-invest will happen shortly.`,
      });
      toast(
        invested
          ? `Deposit of ${r.data.deposit.amount} USDT confirmed — auto-invested`
          : credited
            ? `Deposit of ${r.data.deposit.amount} USDT confirmed — wallet credited`
            : "Deposit submitted — will auto-invest after confirmations",
        credited ? "success" : "info"
      );
      setHash("");
      onCredited?.();
    } catch (e) {
      const text = e instanceof ApiError ? e.message : "Submission failed";
      setMsg({ ok: false, text });
      toast(text, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card
      title="Manual deposit"
      subtitle="Send from an exchange or another wallet — then paste the tx hash"
    >
      {networks.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {networks.map((n: any) => (
            <button
              key={n.code}
              type="button"
              disabled={!n.enabled}
              onClick={() => { setNetwork(n.code); setMsg(null); }}
              className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                network === n.code
                  ? "border-[#1255FF] bg-[#1255FF]/15 text-[#7FA8FF]"
                  : n.enabled
                    ? "border-[#1C2C50] text-[#8FA3CC] hover:border-[#24406E]"
                    : "cursor-not-allowed border-[#1C2C50] text-[#3d4d75] opacity-50"
              }`}
            >
              {n.label}
              {!n.enabled && <span className="block text-[9px] font-normal">not configured</span>}
            </button>
          ))}
        </div>
      )}

      {depositWallet ? (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="shrink-0 rounded-xl bg-white p-3">
            {qr ? (
              <img src={qr} alt={`${network} deposit QR`} className="h-40 w-40" />
            ) : (
              <div className="h-40 w-40 animate-pulse rounded bg-[#E8EDFA]/20" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8FA3CC]">
              Scan QR or send USDT ({network}) to
            </p>
            <p className="mt-1.5 break-all font-mono text-xs leading-relaxed text-[#7FA8FF]">
              {depositWallet}
            </p>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(depositWallet);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="mt-2 text-xs font-semibold text-[#7FA8FF] hover:underline"
            >
              {copied ? "Copied!" : "Copy address"}
            </button>
            <p className="mt-3 text-[10px] leading-relaxed text-[#5F7099]">
              {isTron
                ? "Send USDT-TRC20 only — e.g. Binance → Withdraw → select TRON (TRC20)."
                : "Send USDT-BEP20 only — e.g. Binance → Withdraw → select BSC (BEP20)."}
              {" "}Wrong network se bhejne pe funds lost ho sakte hain.
            </p>
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
          {network} deposit wallet is being configured by the admin.
        </p>
      )}

      <form onSubmit={submit} className="mt-5 border-t border-[#16233F] pt-5">
        <Field label={`${network} transaction hash`} hint="Deposit history mein credit hone tak thoda wait lag sakta hai">
          <input
            className={inputCls + " font-mono text-xs"}
            placeholder={isTron ? "64-char Tron tx id…" : "0x…"}
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            autoComplete="off"
            required
          />
        </Field>
        <button type="submit" disabled={busy || !hashValid(hash, network)} className={`${btnPrimary} mt-4 w-full`}>
          {busy ? "Verifying…" : "Verify deposit"}
        </button>
      </form>

      {msg && (
        <p className={`mt-4 rounded-lg border px-4 py-2.5 text-sm ${msg.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
          {msg.text}
        </p>
      )}
    </Card>
  );
}
