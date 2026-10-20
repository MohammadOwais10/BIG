"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import { bscTestnet } from "@reown/appkit/networks";
import type { ReactNode } from "react";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? "0268bdf2515ec528e27d6e1b8ee87e88";

export const USDT_CONTRACT =
  (process.env.NEXT_PUBLIC_USDT_CONTRACT ??
    "0x1F71139BACbf9Ab15d239342f7783C69951736f7") as `0x${string}`;

export const DEPOSIT_WALLET = (process.env.NEXT_PUBLIC_PLATFORM_WALLET ??
  "") as `0x${string}`;

export const USDT_DECIMALS = 18;

const queryClient = new QueryClient();

export const wagmiAdapter = new WagmiAdapter({
  networks: [bscTestnet],
  projectId,
  ssr: true,
});

let appKitInitialized = false;

export function ensureAppKit() {
  if (appKitInitialized || typeof window === "undefined") return;
  appKitInitialized = true;

  createAppKit({
    adapters: [wagmiAdapter],
    networks: [bscTestnet],
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
