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
        "border-border/80 flex flex-wrap gap-x-10 gap-y-4 border-b",
        className,
      )}
    >
      {economies.map((economy) => {
        const isActive = economy.slug === selectedEconomy;

        return (
          <Link
            key={economy.slug}
            href={buildHref(economy.slug)}
            aria-current={isActive ? "page" : undefined}
            className="group min-w-0 pb-4"
          >
            <span
              className={cn(
                "block text-base transition md:text-[1.15rem]",
                isActive
                  ? "text-foreground font-semibold"
                  : "text-muted hover:text-foreground",
              )}
            >
              {economy.shortLabel}
            </span>
            <span
              className={cn(
                "mt-5 block h-[3px] w-full transition",
                isActive
                  ? "bg-[var(--brand-orange)]"
                  : "bg-border/80 group-hover:bg-foreground/25",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
