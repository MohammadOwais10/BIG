import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="BIG"
              width={140}
              height={60}
              className="h-9 w-auto sm:h-10"
              priority
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(127,168,255,0.4)] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--blue-soft)] transition hover:border-[var(--blue-soft)] hover:bg-[rgba(127,168,255,0.12)] sm:px-5 sm:py-2 sm:text-[11px]"
          >
            <span aria-hidden="true">←</span> Back to home
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
