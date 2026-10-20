"use client";

import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { btnPrimary } from "@/components/app/ui";

export function WalletConnect() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <button onClick={() => open()} className={btnPrimary}>
        Connect wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#1C2C50] bg-[#0A1226]/60 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      <span className="font-mono text-xs text-[#7FA8FF]">
        {address?.slice(0, 6)}…{address?.slice(-4)}
      </span>
      <button
        onClick={() => disconnect()}
        className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-[#5F7099] transition hover:text-red-300"
      >
        Disconnect
      </button>
    </div>
  );
}
