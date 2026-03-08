import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import type {
  EconomyType,
  RankedChain,
  RankingsSortDirection,
  RankingsSortKey,
} from "@/lib/domain/types";
import { buildRoadmapFitInsight } from "@/lib/roadmaps/roadmap-analysis";
import { formatCurrencyCompact, formatScore } from "@/lib/utils/format";

type RankingsTableProps = {
  economy: EconomyType;
  rows: RankedChain[];
  sort: RankingsSortKey;
  direction: RankingsSortDirection;
  buildSortHref: (
    sort: RankingsSortKey,
    direction: RankingsSortDirection,
  ) => string;
};

type SortableHeaderProps = {
  label: string;
  sortKey: RankingsSortKey;
  sort: RankingsSortKey;
  direction: RankingsSortDirection;
  buildSortHref: RankingsTableProps["buildSortHref"];
};

function SortableHeader({
  label,
  sortKey,
  sort,
  direction,
  buildSortHref,
}: SortableHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <Link
          href={buildSortHref(sortKey, "asc")}
          scroll={false}
          aria-label={`Sort ${label} ascending`}
          className={`rounded-full border p-1 ${
            sort === sortKey && direction === "asc"
              ? "border-accent bg-accent/10 text-accent"
              : "border-transparent text-muted hover:border-border hover:text-foreground"
          }`}
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </Link>
        <Link
          href={buildSortHref(sortKey, "desc")}
          scroll={false}
          aria-label={`Sort ${label} descending`}
          className={`rounded-full border p-1 ${
            sort === sortKey && direction === "desc"
              ? "border-accent bg-accent/10 text-accent"
              : "border-transparent text-muted hover:border-border hover:text-foreground"
          }`}
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function RankingsTable({
  economy,
  rows,
  sort,
  direction,
  buildSortHref,
}: RankingsTableProps) {
  if (rows.length === 0) {
    return (
      <div className="border-border bg-surface text-muted rounded-3xl border border-dashed px-6 py-12 text-center text-sm">
        No chains are available for {economy.shortLabel} in the current Atlas
        dataset.
      </div>
    );
  }

  return (
    <div className="border-border bg-surface rounded-3xl border shadow-[var(--shadow-soft)]">
      <div className="overflow-x-auto lg:overflow-visible">
        <table className="min-w-full text-left text-sm">
          <thead className="border-border border-b">
            <tr className="text-muted">
              <th className="border-border bg-surface-muted sticky top-0 z-20 border-b px-5 py-4 font-medium shadow-[0_1px_0_0_var(--border)]">
                Rank
              </th>
              <th className="border-border bg-surface-muted sticky top-0 z-20 border-b px-5 py-4 font-medium shadow-[0_1px_0_0_var(--border)]">
                <SortableHeader
                  label="Chain"
                  sortKey="name"
                  sort={sort}
                  direction={direction}
                  buildSortHref={buildSortHref}
                />
              </th>
              <th className="border-border bg-surface-muted sticky top-0 z-20 border-b px-5 py-4 font-medium shadow-[0_1px_0_0_var(--border)]">
                <SortableHeader
                  label="Readiness"
                  sortKey="totalScore"
                  sort={sort}
                  direction={direction}
                  buildSortHref={buildSortHref}
                />
              </th>
              {economy.modules.map((module) => (
                <th
                  key={module.id}
                  className="border-border bg-surface-muted sticky top-0 z-20 border-b px-5 py-4 font-medium shadow-[0_1px_0_0_var(--border)]"
                >
                  <SortableHeader
                    label={module.name}
                    sortKey={module.slug}
                    sort={sort}
                    direction={direction}
                    buildSortHref={buildSortHref}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const roadmapFit = buildRoadmapFitInsight(row);

              return (
                <tr
                  key={`${row.economy.slug}:${row.chain.id}`}
                  className="border-border/60 border-t align-top transition hover:bg-slate-50/70"
                >
                  <td className="text-muted px-5 py-4 font-medium">
                    #{row.benchmarkRank}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/chains/${row.chain.slug}?economy=${row.economy.slug}`}
                      className="text-foreground hover:text-accent text-base font-semibold transition"
                    >
                      {row.chain.name}
                    </Link>
                    <p className="text-foreground mt-2 text-sm font-medium">
                      {row.chain.category} • source TVL rank #{row.chain.sourceRank} ·{" "}
                      {formatCurrencyCompact(row.chain.sourceTvlUsd)}
                    </p>
                    <p className="text-foreground mt-2 text-sm font-medium">
                      Offer fit:{" "}
                      <span className="text-accent font-semibold">
                        {roadmapFit.offerFitLabel}
                      </span>
                    </p>
                    <p className="text-muted mt-2 text-sm font-medium">
                      Roadmap stage:{" "}
                      <span className="text-foreground font-medium">
                        {row.chain.roadmap.stageLabel}
                      </span>
                    </p>
                    <details className="group mt-3 max-w-md">
                      <summary className="text-accent flex cursor-pointer list-none items-center gap-2 text-sm font-semibold">
                        More details
                        <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                      </summary>
                      <div className="border-border/60 bg-surface-muted mt-3 space-y-3 rounded-2xl border p-4 text-sm leading-6">
                        <p className="text-muted">
                          &ldquo;{row.chain.shortDescription}&rdquo;
                        </p>
                        <p className="text-muted">{row.chain.roadmap.stageSummary}</p>
                        {row.chain.roadmap.sourceUrl ? (
                          <a
                            href={row.chain.roadmap.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-accent inline-flex font-medium hover:underline"
                          >
                            {row.chain.roadmap.sourceLabel}
                          </a>
                        ) : (
                          <p className="text-muted">{row.chain.roadmap.sourceLabel}</p>
                        )}
                      </div>
                    </details>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-foreground text-2xl font-semibold">
                      {formatScore(row.readinessScore.totalScore)}
                    </div>
                    <p className="text-muted mt-1 text-xs tracking-[0.14em] uppercase">
                      / 10.0
                    </p>
                  </td>
                  {row.readinessScore.moduleBreakdown.map((module) => (
                    <td key={module.module.id} className="px-5 py-4">
                      <div className="space-y-2">
                        <StatusBadge status={module.status} />
                        <div className="text-foreground text-sm font-semibold">
                          {formatScore(module.weightedContribution)}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
