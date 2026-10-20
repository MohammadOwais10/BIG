"use client";

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
  const [manualHash, setManualHash] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  useEffect(() => setConfig(initialConfig), [initialConfig]);

  useEffect(() => {
    api.depositConfig(network).then((r) => setConfig(r.data)).catch(() => {});
  }, [network]);

  const depositWallet = (config?.depositWallet || "") as `0x${string}`;
  const isTron = network === "TRC20";
  const networks = config?.availableNetworks ?? [];

  useEffect(() => {
    if (mined && txHash && !submitted) {
      setSubmitted(true);
      submitHash(txHash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mined, txHash]);

  async function submitHash(hash: string) {
    try {
      const r = await api.submitDeposit(hash, network);
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
              Send from TronLink, Binance or any exchange — select <b>USDT-TRC20</b>. Then paste
              your transaction hash below.
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

      <div className="mt-6 border-t border-[#16233F] pt-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8FA3CC]">
          Already sent? Paste {network} tx hash
        </p>
        <div className="flex gap-2">
          <input
            className={inputCls + " font-mono text-xs"}
            placeholder={isTron ? "64-char Tron tx id…" : "0x…"}
            value={manualHash}
            onChange={(e) => setManualHash(e.target.value)}
          />
          <button
            disabled={!hashValid(manualHash, network)}
            onClick={() => submitHash(manualHash.trim())}
            className={btnGhost}
          >
            Submit
          </button>
        </div>
      </div>
    </Card>
  );
}
