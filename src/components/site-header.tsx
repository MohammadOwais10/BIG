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
        scrolled
          ? "border-b border-[var(--line)] bg-[#04070F]/82 backdrop-blur-xl"
          : "bg-transparent"
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

        <Link
          href="#contact"
          className="blue-border relative inline-flex shrink-0 items-center overflow-hidden rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--blue-soft)] transition hover:shadow-[0_0_40px_rgba(18,85,255,0.3)] sm:px-5 sm:text-[11px] sm:tracking-[0.18em]"
        >
          <span className="relative z-10 whitespace-nowrap">
            Become a Member
          </span>
        </Link>
      </div>
    </header>
  );
}
