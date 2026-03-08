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
        "border-border/80 flex flex-wrap gap-6 border-b pb-1",
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
              "border-b-2 px-1 py-3 text-sm font-medium transition",
              isActive
                ? "border-[var(--brand-orange)] text-foreground"
                : "border-transparent text-muted hover:text-foreground",
            )}
          >
            {economy.shortLabel}
          </Link>
        );
      })}
    </nav>
  );
}
