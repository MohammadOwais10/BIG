import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

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
  metadataBase: new URL("https://beingroup.com"),
  title: "BeInGroup Global | Trading-Powered Investment & Partner Network",
  description:
    "BeInGroup Global — invest from 100 USD, earn 10%–12% ROI, 5% direct commission and level rewards across 20 levels. Full withdrawal and risk terms published.",
  openGraph: {
    title: "BeInGroup Global",
    description:
      "Participate in trading · Earn through structure · Grow with the network.",
    images: [{ url: "/logo.png", width: 1918, height: 820, type: "image/png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeInGroup Global",
    description:
      "Participate in trading · Earn through structure · Grow with the network.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full bg-[var(--background)] font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#1255FF] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <div className="grain" aria-hidden />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
