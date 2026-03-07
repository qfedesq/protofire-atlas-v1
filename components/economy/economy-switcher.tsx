import Link from "next/link";

import { cn } from "@/lib/utils/cn";
import type { EconomyType } from "@/lib/domain/types";

type EconomySwitcherProps = {
  economies: EconomyType[];
  selectedEconomy: string;
  buildHref: (economySlug: EconomyType["slug"]) => string;
  className?: string;
};

export function EconomySwitcher({
  economies,
  selectedEconomy,
  buildHref,
  className,
}: EconomySwitcherProps) {
  return (
    <nav
      aria-label="Economy selector"
      className={cn(
        "border-border bg-white/75 flex flex-wrap gap-2 rounded-3xl border p-2 backdrop-blur-sm",
        className,
      )}
    >
      {economies.map((economy) => {
        const isActive = economy.slug === selectedEconomy;

        return (
          <Link
            key={economy.slug}
            href={buildHref(economy.slug)}
            className={cn(
              "rounded-2xl px-4 py-3 text-sm font-medium transition",
              isActive
                ? "bg-[var(--brand-black)] text-white shadow-[0_12px_30px_rgba(8,9,10,0.16)]"
                : "text-muted hover:bg-surface hover:text-foreground",
            )}
          >
            {economy.shortLabel}
          </Link>
        );
      })}
    </nav>
  );
}
