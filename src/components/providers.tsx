"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { Web3Provider } from "@/lib/web3";
import { ToastProvider } from "@/components/app/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Web3Provider>
        <ToastProvider>{children}</ToastProvider>
      </Web3Provider>
    </AuthProvider>
  );
}
