import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import type {
  EconomyType,
  GlobalRankedChain,
  GlobalRankingsSortKey,
  RankedChain,
  RankingsSortKey,
  TargetAccountRow,
  TargetAccountSortKey,
} from "@/lib/domain/types";
import type { RankingColumnDefinition } from "@/lib/rankings/table";
import { buildRoadmapFitInsight } from "@/lib/roadmaps/roadmap-analysis";
import {
  formatCountCompact,
  formatCurrencyCompact,
  formatScore,
} from "@/lib/utils/format";

function EconomyChainCell({ row }: { row: RankedChain }) {
  const roadmapFit = buildRoadmapFitInsight({
    chain: row.chain,
    economy: row.economy,
    readinessScore: row.readinessScore,
  });

  return (
    <div className="min-w-[18rem] max-w-[24rem] space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            #{row.benchmarkRank}
          </p>
          <Link
            href={`/chains/${row.chain.slug}?economy=${row.economy.slug}`}
            className="text-foreground hover:text-accent mt-2 inline-flex text-base font-semibold transition"
          >
            {row.chain.name}
          </Link>
        </div>
      </div>
      <p className="text-foreground text-sm font-medium">
        {row.chain.category} • source TVL rank #{row.chain.sourceRank} ·{" "}
        {formatCurrencyCompact(row.chain.sourceTvlUsd)}
      </p>
      <p className="text-foreground text-sm font-medium">
        Offer fit:{" "}
        <Link
          href={`/chains/${row.chain.slug}?economy=${row.economy.slug}#suggested-activations`}
          className="text-accent font-semibold hover:underline"
        >
          {roadmapFit.offerFitLabel}
        </Link>
      </p>
      <p className="text-muted text-sm font-medium">
        Roadmap stage:{" "}
        <span className="text-foreground">{row.chain.roadmap.stageLabel}</span>
      </p>
      <details className="group">
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
    </div>
  );
}

function GlobalChainCell({ row }: { row: GlobalRankedChain }) {
  return (
    <div className="min-w-[18rem] max-w-[22rem] space-y-2">
      <p className="text-muted text-xs tracking-[0.16em] uppercase">
        #{row.benchmarkRank}
      </p>
      <Link
        href={`/chains/${row.chain.slug}`}
        className="text-foreground hover:text-accent inline-flex text-base font-semibold transition"
      >
        {row.chain.name}
      </Link>
      <p className="text-muted text-sm">
        {row.chain.category} • source TVL rank #{row.chain.sourceRank} ·{" "}
        {formatCurrencyCompact(row.chain.sourceTvlUsd)}
      </p>
    </div>
  );
}

function OpportunityChainCell({
  row,
  rowIndex,
}: {
  row: TargetAccountRow;
  rowIndex: number;
}) {
  return (
    <div className="min-w-[18rem] max-w-[22rem] space-y-2">
      <p className="text-muted text-xs tracking-[0.16em] uppercase">
        #{rowIndex + 1}
      </p>
      <Link
        href={`/internal/account/${row.chain.slug}?economy=${row.economy.slug}`}
        className="text-foreground hover:text-accent inline-flex text-base font-semibold transition"
      >
        {row.chain.name}
      </Link>
      <p className="text-muted text-sm">
        Global rank #{row.globalRank} • source TVL rank #{row.chain.sourceRank}
      </p>
    </div>
  );
}

export function createEconomyRankingColumns(
  economy: EconomyType,
): RankingColumnDefinition<RankedChain, RankingsSortKey>[] {
  return [
    {
      id: "chain",
      label: "Chain",
      defaultVisible: true,
      canHide: false,
      widthClassName: "min-w-[22rem]",
      sortKey: "name",
      renderCell: (row) => <EconomyChainCell row={row} />,
    },
    {
      id: "readiness",
      label: "Readiness",
      description: "Current wedge score on the 0-10 Atlas scale.",
      defaultVisible: true,
      align: "right",
      sortKey: "totalScore",
      widthClassName: "min-w-[9rem]",
      renderCell: (row) => (
        <div className="space-y-1">
          <p className="text-foreground text-3xl font-semibold">
            {formatScore(row.readinessScore.totalScore)}
          </p>
          <p className="text-muted text-xs tracking-[0.14em] uppercase">/ 10.0</p>
        </div>
      ),
    },
    ...economy.modules.map(
      (module): RankingColumnDefinition<RankedChain, RankingsSortKey> => ({
        id: module.slug,
        label: module.name,
        description: `Module status and weighted contribution for ${module.name}.`,
        defaultVisible: true,
        align: "right",
        sortKey: module.slug,
        widthClassName: "min-w-[11rem]",
        renderCell: (row) => {
          const breakdown = row.readinessScore.moduleBreakdown.find(
            (item) => item.module.slug === module.slug,
          );

          if (!breakdown) {
            return null;
          }

          return (
            <div className="space-y-2">
              <StatusBadge status={breakdown.status} />
              <p className="text-foreground text-lg font-semibold">
                {formatScore(breakdown.weightedContribution)}
              </p>
            </div>
          );
        },
      }),
    ),
  ];
}

export function createGlobalRankingColumns(): RankingColumnDefinition<
  GlobalRankedChain,
  GlobalRankingsSortKey
>[] {
  return [
    {
      id: "chain",
      label: "Chain",
      defaultVisible: true,
      canHide: false,
      widthClassName: "min-w-[21rem]",
      sortKey: "name",
      renderCell: (row) => <GlobalChainCell row={row} />,
    },
    {
      id: "totalScore",
      label: "Global Score",
      description: "Holistic Atlas score across economies, ecosystem, adoption, and performance.",
      defaultVisible: true,
      align: "right",
      sortKey: "totalScore",
      widthClassName: "min-w-[9rem]",
      renderCell: (row) => (
        <span className="text-foreground text-2xl font-semibold">
          {formatScore(row.score.totalScore)}
        </span>
      ),
    },
    {
      id: "economyCompositeScore",
      label: "Economy Composite",
      description: "Weighted composite of AI Agents, DeFi, RWA, and Prediction Market readiness.",
      defaultVisible: true,
      align: "right",
      sortKey: "economyCompositeScore",
      widthClassName: "min-w-[10rem]",
      renderCell: (row) => formatScore(row.score.economyCompositeScore),
    },
    {
      id: "ecosystemScore",
      label: "Ecosystem Score",
      description: "Vitality score built from protocols and ecosystem project density.",
      defaultVisible: true,
      align: "right",
      sortKey: "ecosystemScore",
      widthClassName: "min-w-[9rem]",
      renderCell: (row) => formatScore(row.score.ecosystemScore),
    },
    {
      id: "adoptionScore",
      label: "Adoption Score",
      description: "Wallet and active-user signals normalized into the Atlas scale.",
      defaultVisible: true,
      align: "right",
      sortKey: "adoptionScore",
      widthClassName: "min-w-[9rem]",
      renderCell: (row) => formatScore(row.score.adoptionScore),
    },
    {
      id: "performanceScore",
      label: "Performance Score",
      description: "Technical performance score from transaction speed, block time, and throughput.",
      defaultVisible: true,
      align: "right",
      sortKey: "performanceScore",
      widthClassName: "min-w-[9rem]",
      renderCell: (row) => formatScore(row.score.performanceScore),
    },
    {
      id: "wallets",
      label: "Wallets",
      description: "Seeded wallet count snapshot used by the global model.",
      defaultVisible: true,
      align: "right",
      widthClassName: "min-w-[9rem]",
      renderCell: (row) => formatCountCompact(row.score.metrics.wallets),
    },
    {
      id: "activeUsers",
      label: "Active Users",
      description: "Seeded active-user snapshot used by the global model.",
      defaultVisible: true,
      align: "right",
      widthClassName: "min-w-[9rem]",
      renderCell: (row) => formatCountCompact(row.score.metrics.activeUsers),
    },
    {
      id: "protocols",
      label: "Protocols",
      description: "Protocol count used for ecosystem activity scoring.",
      defaultVisible: true,
      align: "right",
      widthClassName: "min-w-[8rem]",
      renderCell: (row) => formatCountCompact(row.score.metrics.protocols),
    },
    {
      id: "ecosystemProjects",
      label: "Ecosystem Projects",
      description: "Project count used for ecosystem activity scoring.",
      defaultVisible: true,
      align: "right",
      widthClassName: "min-w-[11rem]",
      renderCell: (row) => formatCountCompact(row.score.metrics.ecosystemProjects),
    },
    {
      id: "averageTransactionSpeed",
      label: "Avg Tx Speed",
      description: "Average transaction speed input for performance scoring.",
      defaultVisible: true,
      align: "right",
      widthClassName: "min-w-[9rem]",
      renderCell: (row) => `${row.score.metrics.averageTransactionSpeed}s`,
    },
    {
      id: "blockTime",
      label: "Block Time",
      description: "Average block time input for performance scoring.",
      defaultVisible: true,
      align: "right",
      widthClassName: "min-w-[8rem]",
      renderCell: (row) => `${row.score.metrics.blockTime}s`,
    },
    {
      id: "throughputIndicator",
      label: "Throughput",
      description: "Throughput indicator input for performance scoring.",
      defaultVisible: true,
      align: "right",
      widthClassName: "min-w-[8rem]",
      renderCell: (row) =>
        formatCountCompact(row.score.metrics.throughputIndicator),
    },
  ];
}

export function createOpportunityRankingColumns(): RankingColumnDefinition<
  TargetAccountRow,
  TargetAccountSortKey
>[] {
  return [
    {
      id: "chain",
      label: "Chain",
      defaultVisible: true,
      canHide: false,
      widthClassName: "min-w-[20rem]",
      sortKey: "name",
      renderCell: (row, rowIndex) => (
        <OpportunityChainCell row={row} rowIndex={rowIndex} />
      ),
    },
    {
      id: "opportunityScore",
      label: "Opportunity Score",
      description: "Composite GTM score from TVL tier, readiness gap, stack fit, and ecosystem signal.",
      defaultVisible: true,
      align: "right",
      sortKey: "opportunityScore",
      widthClassName: "min-w-[10rem]",
      renderCell: (row) => (
        <span className="text-foreground text-2xl font-semibold">
          {formatScore(row.opportunity.totalScore)}
        </span>
      ),
    },
    {
      id: "economy",
      label: "Economy Focus",
      description: "Current wedge with the strongest Protofire fit for this target row.",
      defaultVisible: true,
      widthClassName: "min-w-[10rem]",
      renderCell: (row) => row.economy.shortLabel,
    },
    {
      id: "priority",
      label: "Priority",
      description: "Deterministic GTM priority label derived from the opportunity score.",
      defaultVisible: true,
      widthClassName: "min-w-[8rem]",
      renderCell: (row) => row.priority,
    },
    {
      id: "currentRank",
      label: "Current Rank",
      description: "Current economy rank for the selected wedge.",
      defaultVisible: false,
      align: "right",
      widthClassName: "min-w-[8rem]",
      renderCell: (row) => `#${row.readinessRank}`,
    },
    {
      id: "tvlTier",
      label: "TVL Tier",
      description: "Opportunity contribution coming from the chain’s TVL tier.",
      defaultVisible: false,
      align: "right",
      widthClassName: "min-w-[8rem]",
      renderCell: (row) => formatScore(row.opportunity.breakdown.tvlTierScore),
    },
    {
      id: "readinessGap",
      label: "Readiness Gap",
      description: "Opportunity contribution coming from open readiness distance to the maximum score.",
      defaultVisible: true,
      align: "right",
      sortKey: "readinessGap",
      widthClassName: "min-w-[9rem]",
      renderCell: (row) => formatScore(row.readinessGap),
    },
    {
      id: "stackFit",
      label: "Stack Fit",
      description: "Opportunity contribution coming from Protofire stack fit under the current model.",
      defaultVisible: false,
      align: "right",
      widthClassName: "min-w-[8rem]",
      renderCell: (row) => formatScore(row.opportunity.breakdown.stackFitScore),
    },
    {
      id: "ecosystemSignal",
      label: "Ecosystem Signal",
      description: "Opportunity contribution from ecosystem and adoption strength.",
      defaultVisible: false,
      align: "right",
      sortKey: "ecosystemScore",
      widthClassName: "min-w-[9rem]",
      renderCell: (row) =>
        formatScore(row.opportunity.breakdown.ecosystemSignalScore),
    },
    {
      id: "recommendedWedge",
      label: "Recommended Wedge",
      description: "Best current wedge to lead with in outreach.",
      defaultVisible: false,
      widthClassName: "min-w-[12rem]",
      renderCell: (row) => row.economy.name,
    },
    {
      id: "recommendedStack",
      label: "Recommended Stack",
      description: "Top Protofire modules to lead with in the initial conversation.",
      defaultVisible: true,
      widthClassName: "min-w-[14rem]",
      renderCell: (row) =>
        row.recommendedStack.recommendedModules
          .slice(0, 2)
          .map((module) => module.module.name)
          .join(", ") || "Optimization",
    },
  ];
}
