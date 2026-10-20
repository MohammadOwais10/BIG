"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { Spinner } from "./ui";

const userNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/deposit", label: "Deposit" },
  { href: "/invest", label: "Invest" },
  { href: "/wallet", label: "Wallet" },
  { href: "/withdraw", label: "Withdraw" },
  { href: "/team", label: "Team" },
  { href: "/rewards", label: "Rewards" },
  { href: "/roi", label: "ROI History" },
  { href: "/support", label: "Support" },
];

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/investments", label: "Investments" },
  { href: "/admin/withdrawals", label: "Withdrawals" },
  { href: "/admin/deposits", label: "Deposits" },
  { href: "/admin/daily-roi", label: "Daily ROI" },
  { href: "/admin/support", label: "Support" },
  { href: "/admin/transactions", label: "Ledger" },
  { href: "/admin/audit", label: "Audit Logs" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // Role-based guard: admins stay in /admin, users stay out of it
  useEffect(() => {
    if (loading || !user) return;
    if (user.role === "ADMIN" && !pathname.startsWith("/admin")) {
      router.replace("/admin");
    } else if (user.role !== "ADMIN" && pathname.startsWith("/admin")) {
      router.replace("/dashboard");
    }
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return (
      <div className="hero-glow flex min-h-screen items-center justify-center">
        <Spinner label="Loading your account…" />
      </div>
    );
  }

  const isAdmin = user.role === "ADMIN";

  const link = (item: { href: string; label: string }) => {
    const active = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`block truncate rounded-xl px-4 py-2.5 text-sm font-medium transition ${
          active
            ? "bg-[#1255FF]/15 text-[#7FA8FF] shadow-[inset_0_0_0_1px_rgba(18,85,255,0.35)]"
            : "text-[#9FB8EE] hover:bg-white/5 hover:text-[#E8EDFA]"
        }`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <div className="hero-glow min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[var(--line)] bg-[#04070F]/90 backdrop-blur-xl lg:flex">
        <Link href="/" className="flex items-center gap-3 px-6 py-6">
          <Image src="/logo.png" alt="BIG" width={120} height={52} className="h-9 w-auto" />
        </Link>
        <nav className="flex-1 space-y-1 overflow-y-auto px-4">
          {isAdmin ? adminNav.map(link) : userNav.map(link)}
        </nav>
        <div className="border-t border-[var(--line)] px-4 py-4">
          <div className="mb-3 px-2">
            <p className="truncate text-sm font-semibold text-[#E8EDFA]">{user.name}</p>
            <p className="truncate text-xs text-[#5F7099]">{user.email}</p>
          </div>
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="w-full rounded-xl border border-[#24406E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9FB8EE] transition hover:border-red-500/50 hover:text-red-300"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--line)] bg-[#04070F]/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link href={isAdmin ? "/admin" : "/dashboard"}>
          <Image src="/logo.png" alt="BIG" width={100} height={42} className="h-8 w-auto" />
        </Link>
        <button
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className="rounded-lg border border-[#24406E] px-3 py-1.5 text-xs font-semibold text-[#9FB8EE]"
        >
          Sign out
        </button>
      </header>

      {/* Mobile nav */}
      <nav className="sticky top-[57px] z-20 flex gap-1 overflow-x-auto border-b border-[var(--line)] bg-[#04070F]/90 px-3 py-2 backdrop-blur-xl lg:hidden">
        {(isAdmin ? adminNav : userNav).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
              pathname === item.href
                ? "bg-[#1255FF]/15 text-[#7FA8FF]"
                : "text-[#9FB8EE]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="px-4 py-8 lg:ml-64 lg:px-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl font-bold text-[#E8EDFA]">{title}</h1>
      {sub && <p className="mt-1 text-sm text-[#8FA3CC]">{sub}</p>}
    </div>
  );
}
