import Image from "next/image";
import Link from "next/link";
import { brand, navLinks, withdrawal } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative border-t border-[var(--line)] bg-[#02040C]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(127,168,255,0.5)] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.7fr_1fr]">
          <div>
            <Image
              src="/logo.png"
              alt={brand.name}
              width={1918}
              height={820}
              className="h-12 w-auto object-contain"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#929FC0]">
              {brand.tagline}. Minimum investment 100 USD · 10–12% monthly ROI ·
              5% direct commission · 20 levels of team income.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--blue-soft)]">
              Navigate
            </p>
            <ul className="mt-5 space-y-2.5">
              {navLinks.map((link) => (
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
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--blue-soft)]">
              Contact
            </p>
            <p className="mt-5 text-sm leading-relaxed text-[#A9B6D0]">
              Request onboarding details and platform credentials through your
              regional representative or official member channel.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[#8090B4]">
              Withdrawals from {withdrawal.rules[0].value} · {withdrawal.rules[1].value}{" "}
              processing fee · {withdrawal.rules[2].value} deduction before 6
              months.
            </p>
            <a
              href="mailto:contact@big.com"
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#1255FF,#1255FF)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFFFFF] transition shadow-[0_10px_30px_rgba(43,107,255,0.25)] hover:shadow-[0_12px_36px_rgba(43,107,255,0.4)]"
            >
              Become a Member
              <span className="transition group-hover:translate-x-0.5">→</span>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--line)] pt-7 text-xs text-[#6E7E9F] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p>
            {brand.name} · {brand.visionLine}
          </p>
        </div>
      </div>
    </footer>
  );
}