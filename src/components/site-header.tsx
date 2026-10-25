"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/content";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
       
           "border-b border-[var(--line)] bg-[#04070F]/82 backdrop-blur-xl"
          
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="BIG"
            width={148}
            height={64}
            className="h-10 w-auto object-contain transition group-hover:brightness-110"
            priority
          />
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-8 lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#CBD6EC] transition hover:text-[var(--blue-soft)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border border-[rgba(127,168,255,0.4)] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--blue-soft)] transition hover:border-[var(--blue-soft)] hover:bg-[rgba(127,168,255,0.12)] sm:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(135deg,#1255FF,#1255FF)] px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_60px_rgba(18,85,255,0.32)]"
          >
            <span className="relative z-10">Become a member</span>
            <span className="relative z-10">→</span>
            <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] transition group-hover:translate-x-[120%] duration-700" />
          </Link>
        </div>
      </div>
    </header>
  );
}
