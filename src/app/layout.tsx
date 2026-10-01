import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://big.com"),
  title: "BIG | Transparent Investment & Earning Plan",
  description:
    "BIG — invest from 100 USD, earn 10%–12% monthly ROI, 5% direct commission and level income across 20 levels. Full withdrawal rules published.",
  openGraph: {
    title: "BIG",
    description: "Invest · Earn · Withdraw · Grow — a fully published plan.",
    images: [{ url: "/logo.png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full bg-[var(--background)] font-sans antialiased">
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
