import type { Metadata } from "next";
import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";

import { siteConfig } from "@/lib/config/site";
import { atlasVersion } from "@/lib/config/version";

import "./globals.css";

const onest = localFont({
  src: "./fonts/onest-latin-variable.woff2",
  variable: "--font-primary-sans",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${onest.variable} antialiased`}>
        <div className="min-h-screen">
          <header className="protofire-topbar border-b backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
              <Link href="/" className="flex items-center gap-4">
                <Image
                  src="/brand/protofire-logotype-brand-monochrome-light.svg"
                  alt="Protofire"
                  width={144}
                  height={24}
                  className="h-6 w-auto"
                />
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.18em] text-slate-200 uppercase">
                  Atlas
                </span>
              </Link>
              <nav className="flex items-center gap-6 text-sm text-slate-300">
                <Link className="transition hover:text-white" href="/">
                  Atlas overview
                </Link>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.18em] text-slate-200 uppercase">
                  {atlasVersion.label}
                </span>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
            {children}
          </main>
          <footer className="border-border/80 bg-white/70 border-t backdrop-blur">
            <div className="text-muted mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-6 text-sm lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <p>
                Seeded MVP dataset. No live telemetry, scraping, or runtime AI
                in product logic.
              </p>
              <p>Built for chains evaluating infrastructure readiness by economy.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
