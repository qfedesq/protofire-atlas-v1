import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";

import type {
  RankingsSortDirection,
  TargetAccountRow,
  TargetAccountsQuery,
} from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

type TargetsTableProps = {
  rows: TargetAccountRow[];
  sort: TargetAccountsQuery["sort"];
  direction: RankingsSortDirection;
  buildSortHref: (
    sort: TargetAccountsQuery["sort"],
    direction: RankingsSortDirection,
  ) => string;
};

function SortableHeader({
  label,
  sortKey,
  sort,
  direction,
  buildSortHref,
}: {
  label: string;
  sortKey: TargetAccountsQuery["sort"];
  sort: TargetAccountsQuery["sort"];
  direction: RankingsSortDirection;
  buildSortHref: TargetsTableProps["buildSortHref"];
}) {
  return (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <Link
          href={buildSortHref(sortKey, "asc")}
          scroll={false}
          className={`rounded-lg border p-1 ${
            sort === sortKey && direction === "asc"
              ? "border-accent bg-accent/10 text-accent"
              : "border-transparent text-muted hover:border-border hover:text-foreground"
          }`}
          aria-label={`Sort ${label} ascending`}
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </Link>
        <Link
          href={buildSortHref(sortKey, "desc")}
          scroll={false}
          className={`rounded-lg border p-1 ${
            sort === sortKey && direction === "desc"
              ? "border-accent bg-accent/10 text-accent"
              : "border-transparent text-muted hover:border-border hover:text-foreground"
          }`}
          aria-label={`Sort ${label} descending`}
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function TargetsTable({
  rows,
  sort,
  direction,
  buildSortHref,
}: TargetsTableProps) {
  return (
    <div className="border-border bg-surface rounded-3xl border shadow-[var(--shadow-soft)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-border border-b">
            <tr className="text-muted">
              <th className="bg-surface-muted sticky top-0 z-20 px-5 py-4 font-medium">
                <SortableHeader
                  label="Chain"
                  sortKey="name"
                  sort={sort}
                  direction={direction}
                  buildSortHref={buildSortHref}
                />
              </th>
              <th className="bg-surface-muted sticky top-0 z-20 px-5 py-4 font-medium">
                Economy
              </th>
              <th className="bg-surface-muted sticky top-0 z-20 px-5 py-4 font-medium">
                <SortableHeader
                  label="Opportunity Score"
                  sortKey="opportunityScore"
                  sort={sort}
                  direction={direction}
                  buildSortHref={buildSortHref}
                />
              </th>
              <th className="bg-surface-muted sticky top-0 z-20 px-5 py-4 font-medium">
                Current rank
              </th>
              <th className="bg-surface-muted sticky top-0 z-20 px-5 py-4 font-medium">
                <SortableHeader
                  label="Readiness gap"
                  sortKey="readinessGap"
                  sort={sort}
                  direction={direction}
                  buildSortHref={buildSortHref}
                />
              </th>
              <th className="bg-surface-muted sticky top-0 z-20 px-5 py-4 font-medium">
                <SortableHeader
                  label="Ecosystem size"
                  sortKey="ecosystemScore"
                  sort={sort}
                  direction={direction}
                  buildSortHref={buildSortHref}
                />
              </th>
              <th className="bg-surface-muted sticky top-0 z-20 px-5 py-4 font-medium">
                Missing modules
              </th>
              <th className="bg-surface-muted sticky top-0 z-20 px-5 py-4 font-medium">
                Recommended stack
              </th>
              <th className="bg-surface-muted sticky top-0 z-20 px-5 py-4 font-medium">
                Priority
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.chain.slug}:${row.economy.slug}`}
                className="border-border/60 border-t align-top transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <Link
                    href={`/internal/account/${row.chain.slug}?economy=${row.economy.slug}`}
                    className="text-foreground hover:text-accent text-base font-semibold transition"
                  >
                    {row.chain.name}
                  </Link>
                  <p className="text-muted mt-2 text-sm">
                    Global rank #{row.globalRank}
                  </p>
                </td>
                <td className="px-5 py-4 text-foreground font-medium">
                  {row.economy.shortLabel}
                </td>
                <td className="px-5 py-4 text-foreground font-semibold">
                  {formatScore(row.opportunity.totalScore)}
                </td>
                <td className="px-5 py-4 text-foreground font-medium">
                  #{row.readinessRank}
                </td>
                <td className="px-5 py-4 text-foreground font-medium">
                  {formatScore(row.readinessGap)}
                </td>
                <td className="px-5 py-4 text-foreground font-medium">
                  {formatScore(row.globalScore.ecosystemScore)}
                </td>
                <td className="px-5 py-4 text-muted">
                  {row.missingModules.slice(0, 2).map((gap) => gap.module.name).join(", ") ||
                    "None"}
                </td>
                <td className="px-5 py-4 text-muted">
                  {row.recommendedStack.recommendedModules
                    .slice(0, 2)
                    .map((module) => module.module.name)
                    .join(", ") || "Optimization"}
                </td>
                <td className="px-5 py-4 text-foreground font-semibold">
                  {row.priority}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
