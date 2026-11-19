"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import { bsc, bscTestnet } from "@reown/appkit/networks";
import type { ReactNode } from "react";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? "0268bdf2515ec528e27d6e1b8ee87e88";

// Live deploys set NEXT_PUBLIC_BSC_NETWORK=mainnet; local dev stays on testnet.
const BSC_NETWORK =
  (process.env.NEXT_PUBLIC_BSC_NETWORK ?? "testnet") === "mainnet" ? bsc : bscTestnet;

export const USDT_CONTRACT =
  (process.env.NEXT_PUBLIC_USDT_CONTRACT ??
    "0x1F71139BACbf9Ab15d239342f7783C69951736f7") as `0x${string}`;

export const DEPOSIT_WALLET = (process.env.NEXT_PUBLIC_PLATFORM_WALLET ??
  "") as `0x${string}`;

export const USDT_DECIMALS = 18;

// TRON (TRC20) USDT — manual admin payouts via TronLink
export const TRON_USDT_CONTRACT = process.env.NEXT_PUBLIC_TRON_USDT_CONTRACT ?? "";
export const TRON_USDT_DECIMALS = Number(process.env.NEXT_PUBLIC_TRON_USDT_DECIMALS ?? 6);

// Block explorers — defaults are testnet; production sets the mainnet URLs.
const BSC_TX_EXPLORER =
  process.env.NEXT_PUBLIC_BSC_EXPLORER_TX ?? "https://testnet.bscscan.com/tx/";
const TRON_TX_EXPLORER =
  process.env.NEXT_PUBLIC_TRON_EXPLORER_TX ?? "https://nile.tronscan.org/#/transaction/";

export function txExplorerUrl(network: string | undefined | null, hash: string) {
  return `${network === "TRC20" ? TRON_TX_EXPLORER : BSC_TX_EXPLORER}${hash}`;
}

const queryClient = new QueryClient();

export const wagmiAdapter = new WagmiAdapter({
  networks: [BSC_NETWORK],
  projectId,
  ssr: true,
});

let appKitInitialized = false;

export function ensureAppKit() {
  if (appKitInitialized || typeof window === "undefined") return;
  appKitInitialized = true;

  createAppKit({
    adapters: [wagmiAdapter],
    networks: [BSC_NETWORK],
    projectId,
    metadata: {
      name: "BIG",
      description: "BIG Investment Platform",
      url: typeof window !== "undefined" ? window.location.origin : "https://big.com",
      icons: [`${typeof window !== "undefined" ? window.location.origin : ""}/logo.png`],
    },
    features: {
      analytics: false,
      email: false,
      socials: false,
    },
    themeMode: "dark",
    themeVariables: {
      "--w3m-accent": "#1255FF",
      "--w3m-border-radius-master": "2px",
    },
  });
}

export function Web3Provider({ children }: { children: ReactNode }) {
  ensureAppKit();
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
