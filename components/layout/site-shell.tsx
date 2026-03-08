"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/lib/config/site";
import { atlasVersion } from "@/lib/config/version";

export function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEmbedRoute = pathname?.startsWith("/embed");

  return (
    <div className="min-h-screen">
      {isEmbedRoute ? null : (
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
              <span className="text-xs font-medium tracking-[0.18em] text-slate-200 uppercase">
                Atlas
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm text-slate-300">
              <Link
                className="transition hover:text-white"
                href="/#global-ranking"
              >
                Global ranking
              </Link>
              <Link
                className="transition hover:text-white"
                href="/internal/admin"
              >
                Admin
              </Link>
              <span className="text-xs font-medium tracking-[0.18em] text-slate-200 uppercase">
                {atlasVersion.label}
              </span>
            </nav>
          </div>
        </header>
      )}

      <main
        className={
          isEmbedRoute
            ? "mx-auto w-full max-w-6xl px-4 py-4"
            : "mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12"
        }
      >
        {children}
      </main>

      {isEmbedRoute ? null : (
        <footer className="border-border/80 bg-white/70 border-t backdrop-blur">
          <div className="text-muted mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-6 text-sm lg:px-8">
            <p>{siteConfig.footerTagline}</p>
          </div>
        </footer>
      )}
    </div>
  );
}
