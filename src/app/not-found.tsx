import Link from "next/link";
import { navLinks } from "@/lib/content";

export default function NotFound() {
  return (
    <main className="hero-glow flex min-h-[100svh] flex-col items-center justify-center px-6 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 font-display text-4xl leading-[1.02] tracking-tight text-white md:text-6xl">
        This page does not exist.
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-[#BCC7DF]">
        The link may be outdated, or the address may be mistyped. Every
        published figure lives on the home page.
      </p>

      <Link
        href="/"
        className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#1255FF] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_50px_rgba(18,85,255,0.35)] transition hover:shadow-[0_18px_56px_rgba(18,85,255,0.45)]"
      >
        Back to home
        <span className="transition group-hover:translate-x-0.5">→</span>
      </Link>

      <nav className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={`/${link.href}`}
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#CBD6EC] transition hover:text-[var(--blue-soft)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
