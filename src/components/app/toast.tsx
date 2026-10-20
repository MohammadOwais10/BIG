"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Toast = { id: number; text: string; kind: "success" | "error" | "info" };

const ToastCtx = createContext<(text: string, kind?: Toast["kind"]) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const push = useCallback((text: string, kind: Toast["kind"] = "success") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex w-80 flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
                t.kind === "success"
                  ? "border-emerald-500/40 bg-[#06160f]/95 shadow-emerald-500/10"
                  : t.kind === "error"
                    ? "border-red-500/40 bg-[#160a0a]/95 shadow-red-500/10"
                    : "border-[#1255FF]/40 bg-[#0a1128]/95 shadow-blue-500/10"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  t.kind === "success"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : t.kind === "error"
                      ? "bg-red-500/20 text-red-300"
                      : "bg-[#1255FF]/20 text-[#7FA8FF]"
                }`}
              >
                {t.kind === "success" ? "✓" : t.kind === "error" ? "✕" : "i"}
              </span>
              <p className="text-xs leading-relaxed text-[#E8EDFA]">{t.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}
