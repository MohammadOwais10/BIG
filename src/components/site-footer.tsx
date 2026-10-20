import Image from "next/image";
import Link from "next/link";
import { brand, footerLinks, corporate } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative border-t border-[var(--line)] bg-[#02040C]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(127,168,255,0.5)] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col gap-7 rounded-3xl border border-[rgba(127,168,255,0.18)] bg-[linear-gradient(120deg,rgba(18,85,255,0.16),rgba(18,85,255,0.04))] px-7 py-9 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="panel-label">Join BeInGroup</p>
            <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
              {brand.motto}
            </h2>
          </div>
          <a
            href="mailto:contact@big.com"
            className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[linear-gradient(135deg,#1255FF,#1255FF)] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_34px_rgba(18,85,255,0.32)] transition hover:shadow-[0_14px_40px_rgba(18,85,255,0.45)]"
          >
            Become a Member
            <span className="transition group-hover:translate-x-0.5">→</span>
          </a>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_0.8fr_1fr]">
          <div>
            <Image
              src="/logo.png"
              alt={brand.name}
              width={1918}
              height={820}
              className="h-12 w-auto object-contain"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#929FC0]">
              {brand.tagline}. A trading-focused platform pairing structured
              Forex activity with a community-based partner network.
            </p>
          </div>

          <div>
            <p className="panel-label">Explore</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A9B6D0] transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="panel-label">Company</p>
            <p className="mt-5 font-display text-lg text-white">
              {corporate.entity}
            </p>
            <address className="mt-3 not-italic text-sm leading-relaxed text-[#929FC0]">
              {corporate.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>

            <p className="mt-5 text-sm leading-relaxed text-[#A9B6D0]">
              Request onboarding details and platform credentials through your
              regional representative or official member channel.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--line)] pt-7 text-xs text-[#8A99C4] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {brand.legalName} All rights reserved.
          </p>
          <p>
            {brand.name} · {brand.visionLine}
          </p>
        </div>
      </div>
    </footer>
  );
}
