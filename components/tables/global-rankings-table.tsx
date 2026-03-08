import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";

import type {
  GlobalRankedChain,
  GlobalRankingsQuery,
  RankingsSortDirection,
} from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

type GlobalRankingsTableProps = {
  rows: GlobalRankedChain[];
  sort: GlobalRankingsQuery["sort"];
  direction: RankingsSortDirection;
  buildSortHref: (
    sort: GlobalRankingsQuery["sort"],
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
  sortKey: GlobalRankingsQuery["sort"];
  sort: GlobalRankingsQuery["sort"];
  direction: RankingsSortDirection;
  buildSortHref: GlobalRankingsTableProps["buildSortHref"];
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

export function GlobalRankingsTable({
  rows,
  sort,
  direction,
  buildSortHref,
}: GlobalRankingsTableProps) {
  return (
    <div className="border-border bg-surface rounded-3xl border shadow-[var(--shadow-soft)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-border border-b">
            <tr className="text-muted">
              <th className="border-border bg-surface-muted sticky top-0 z-20 border-b px-5 py-4 font-medium">
                Rank
              </th>
              <th className="border-border bg-surface-muted sticky top-0 z-20 border-b px-5 py-4 font-medium">
                <SortableHeader
                  label="Chain"
                  sortKey="name"
                  sort={sort}
                  direction={direction}
                  buildSortHref={buildSortHref}
                />
              </th>
              <th className="border-border bg-surface-muted sticky top-0 z-20 border-b px-5 py-4 font-medium">
                <SortableHeader
                  label="Global Score"
                  sortKey="totalScore"
                  sort={sort}
                  direction={direction}
                  buildSortHref={buildSortHref}
                />
              </th>
              <th className="border-border bg-surface-muted sticky top-0 z-20 border-b px-5 py-4 font-medium">
                <SortableHeader
                  label="Economy Composite"
                  sortKey="economyCompositeScore"
                  sort={sort}
                  direction={direction}
                  buildSortHref={buildSortHref}
                />
              </th>
              <th className="border-border bg-surface-muted sticky top-0 z-20 border-b px-5 py-4 font-medium">
                <SortableHeader
                  label="Ecosystem"
                  sortKey="ecosystemScore"
                  sort={sort}
                  direction={direction}
                  buildSortHref={buildSortHref}
                />
              </th>
              <th className="border-border bg-surface-muted sticky top-0 z-20 border-b px-5 py-4 font-medium">
                <SortableHeader
                  label="Adoption"
                  sortKey="adoptionScore"
                  sort={sort}
                  direction={direction}
                  buildSortHref={buildSortHref}
                />
              </th>
              <th className="border-border bg-surface-muted sticky top-0 z-20 border-b px-5 py-4 font-medium">
                <SortableHeader
                  label="Performance"
                  sortKey="performanceScore"
                  sort={sort}
                  direction={direction}
                  buildSortHref={buildSortHref}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.chain.slug}
                className="border-border/60 border-t align-top transition hover:bg-slate-50/70"
              >
                <td className="text-muted px-5 py-4 font-medium">
                  #{row.benchmarkRank}
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/chains/${row.chain.slug}`}
                    className="text-foreground hover:text-accent text-base font-semibold transition"
                  >
                    {row.chain.name}
                  </Link>
                  <p className="text-muted mt-2 text-sm">
                    {row.chain.category} • source TVL rank #{row.chain.sourceRank}
                  </p>
                </td>
                <td className="px-5 py-4 text-foreground font-semibold">
                  {formatScore(row.score.totalScore)}
                </td>
                <td className="px-5 py-4 text-foreground font-medium">
                  {formatScore(row.score.economyCompositeScore)}
                </td>
                <td className="px-5 py-4 text-foreground font-medium">
                  {formatScore(row.score.ecosystemScore)}
                </td>
                <td className="px-5 py-4 text-foreground font-medium">
                  {formatScore(row.score.adoptionScore)}
                </td>
                <td className="px-5 py-4 text-foreground font-medium">
                  {formatScore(row.score.performanceScore)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
