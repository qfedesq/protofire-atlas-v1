import {
  atlasDatasetLabel,
  atlasDatasetSnapshot,
} from "@/lib/config/dataset";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import type {
  EconomyTypeSlug,
  GlobalRankedChain,
  RankedChain,
  TargetAccountRow,
} from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

const repository = createSeedChainsRepository();

type GapSummary = {
  moduleName: string;
  missingCount: number;
  partialCount: number;
};

function getRankedRows(economySlug: EconomyTypeSlug) {
  return repository.listRankedChains({ economy: economySlug });
}

function getEconomy(economySlug: EconomyTypeSlug) {
  const economy = repository
    .listEconomies()
    .find((item) => item.slug === economySlug);

  if (!economy) {
    throw new Error(`Unknown economy ${economySlug}`);
  }

  return economy;
}

function getGlobalRankedRows() {
  return repository.listGlobalRankedChains();
}

function getTargetAccountRows() {
  return repository.listTargetAccounts();
}

function formatRankingLine(row: RankedChain) {
  return `- #${row.benchmarkRank} ${row.chain.name} (${formatScore(row.readinessScore.totalScore)})`;
}

function summarizeGaps(rows: RankedChain[]): GapSummary[] {
  const firstRow = rows[0];

  if (!firstRow) {
    return [];
  }

  return firstRow.economy.modules
    .map((module) => {
      let missingCount = 0;
      let partialCount = 0;

      rows.forEach((row) => {
        const moduleBreakdown = row.readinessScore.moduleBreakdown.find(
          (item) => item.module.slug === module.slug,
        );

        if (moduleBreakdown?.status === "missing") {
          missingCount += 1;
        }

        if (moduleBreakdown?.status === "partial") {
          partialCount += 1;
        }
      });

      return {
        moduleName: module.name,
        missingCount,
        partialCount,
      };
    })
    .sort((left, right) => {
      const rightGapCount = right.missingCount + right.partialCount;
      const leftGapCount = left.missingCount + left.partialCount;

      if (rightGapCount !== leftGapCount) {
        return rightGapCount - leftGapCount;
      }

      return left.moduleName.localeCompare(right.moduleName);
    });
}

function buildHighPriorityTargets(
  rows: RankedChain[],
  moduleSlug: string,
  count: number,
) {
  return rows
    .filter((row) =>
      row.readinessScore.moduleBreakdown.some(
        (module) =>
          module.module.slug === moduleSlug && module.status !== "available",
      ),
    )
    .sort((left, right) => left.chain.sourceRank - right.chain.sourceRank)
    .slice(0, count);
}

function buildEconomyTargets(rows: RankedChain[], count: number) {
  return rows
    .filter((row) =>
      row.readinessScore.moduleBreakdown.some(
        (module) => module.status !== "available",
      ),
    )
    .sort((left, right) => {
      if (left.chain.sourceRank !== right.chain.sourceRank) {
        return left.chain.sourceRank - right.chain.sourceRank;
      }

      return left.readinessScore.totalScore - right.readinessScore.totalScore;
    })
    .slice(0, count);
}

function buildHighTvlLaggingRows(rows: RankedChain[], count: number) {
  const laggingThreshold = Math.ceil(rows.length / 2);

  return rows
    .filter(
      (row) => row.chain.sourceRank <= 10 && row.benchmarkRank >= laggingThreshold,
    )
    .sort((left, right) => {
      if (left.chain.sourceRank !== right.chain.sourceRank) {
        return left.chain.sourceRank - right.chain.sourceRank;
      }

      return right.benchmarkRank - left.benchmarkRank;
    })
    .slice(0, count);
}

function buildCommonHeader(economySlug: EconomyTypeSlug) {
  const economy = getEconomy(economySlug);

  return [
    `# ${economy.name} readiness report`,
    "",
    `- Dataset: ${atlasDatasetLabel}`,
    `- Source provider: ${atlasDatasetSnapshot.sourceProvider}`,
    `- Source metric: ${atlasDatasetSnapshot.sourceMetric}`,
    `- Snapshot date: ${atlasDatasetSnapshot.snapshotDate}`,
    `- Methodology: ${atlasDatasetSnapshot.methodology}`,
    "",
  ].join("\n");
}

function buildEconomyOpportunitySection(
  economySlug: EconomyTypeSlug,
  rows: RankedChain[],
) {
  const gapSummary = summarizeGaps(rows);
  const topGaps = gapSummary.slice(0, 3);
  const topGapModules = topGaps.map((gap) => gap.moduleName).join(", ");
  const targetModule = rows[0]?.economy.modules.find(
    (module) => module.name === topGaps[0]?.moduleName,
  );
  const targets = targetModule
    ? buildHighPriorityTargets(rows, targetModule.slug, 5)
    : [];

  return [
    "## Protofire opportunity framing",
    "",
    `The heaviest recurring readiness gaps in this wedge are ${topGapModules.toLowerCase()}.`,
    "",
    "High-TVL chains with visible infrastructure gaps:",
    ...targets.map(
      (row) =>
        `- ${row.chain.name}: source rank #${row.chain.sourceRank}, readiness ${formatScore(row.readinessScore.totalScore)}`,
    ),
    "",
  ].join("\n");
}

export function buildEconomyReportMarkdown(economySlug: EconomyTypeSlug) {
  const rows = getRankedRows(economySlug);
  const gapSummary = summarizeGaps(rows);

  return [
    buildCommonHeader(economySlug),
    "## Ranking summary",
    "",
    `Atlas ranks ${rows.length} EVM chains for this economy wedge using a deterministic weighted module model.`,
    "",
    "## Top chains",
    "",
    ...rows.slice(0, 10).map(formatRankingLine),
    "",
    "## Lagging chains",
    "",
    ...rows.slice(-10).map(formatRankingLine),
    "",
    "## Major gap patterns",
    "",
    ...gapSummary.map(
      (gap) =>
        `- ${gap.moduleName}: ${gap.missingCount} missing, ${gap.partialCount} partial`,
    ),
    "",
    buildEconomyOpportunitySection(economySlug, rows),
  ].join("\n");
}

export function buildLiquidStakingLandscapeReportMarkdown() {
  const rows = getRankedRows("defi-infrastructure");
  const liquidStakingRows = rows.map((row) => {
    const liquidStakingModule = row.readinessScore.moduleBreakdown.find(
      (item) => item.module.slug === "liquid-staking",
    );

    if (!liquidStakingModule) {
      throw new Error(`Missing liquid staking module for ${row.chain.slug}`);
    }

    return {
      chain: row.chain,
      totalScore: row.readinessScore.totalScore,
      status: liquidStakingModule.status,
    };
  });
  const available = liquidStakingRows.filter((row) => row.status === "available");
  const partial = liquidStakingRows.filter((row) => row.status === "partial");
  const missing = liquidStakingRows.filter((row) => row.status === "missing");
  const partialTargets = [...partial, ...missing]
    .sort((left, right) => left.chain.sourceRank - right.chain.sourceRank)
    .slice(0, 10);

  return [
    "# Liquid staking landscape report",
    "",
    `- Dataset: ${atlasDatasetLabel}`,
    `- Source provider: ${atlasDatasetSnapshot.sourceProvider}`,
    `- Snapshot date: ${atlasDatasetSnapshot.snapshotDate}`,
    `- Methodology: ${atlasDatasetSnapshot.methodology}`,
    "",
    "## Landscape summary",
    "",
    `Liquid staking is treated as a first-class DeFi primitive in Atlas. Current distribution across the top 30 EVM chains:`,
    `- available: ${available.length}`,
    `- partial: ${partial.length}`,
    `- missing: ${missing.length}`,
    "",
    "## Strongest liquid staking positions",
    "",
    ...available.map(
      (row) =>
        `- ${row.chain.name}: source rank #${row.chain.sourceRank}, DeFi readiness ${formatScore(row.totalScore)}`,
    ),
    "",
    "## Highest-priority liquid staking opportunities",
    "",
    ...partialTargets.map(
      (row) =>
        `- ${row.chain.name}: ${row.status}, source rank #${row.chain.sourceRank}, DeFi readiness ${formatScore(row.totalScore)}`,
    ),
    "",
    "## Protofire opportunity framing",
    "",
    "Chains with strong TVL but partial or missing liquid staking infrastructure are the clearest targets for capital-efficiency, staking-derivative, and liquidity-composability proposals.",
    "",
  ].join("\n");
}

export function buildEconomyRankingExport(economySlug: EconomyTypeSlug) {
  return getRankedRows(economySlug).map((row) => ({
    chain: row.chain.name,
    slug: row.chain.slug,
    sourceRank: row.chain.sourceRank,
    readinessRank: row.benchmarkRank,
    totalScore: Number(formatScore(row.readinessScore.totalScore)),
    modules: Object.fromEntries(
      row.readinessScore.moduleBreakdown.map((module) => [
        module.module.slug,
        {
          status: module.status,
          weightedContribution: Number(
            formatScore(module.weightedContribution),
          ),
        },
      ]),
    ),
  }));
}

export function buildEconomyRankingExportCsv(economySlug: EconomyTypeSlug) {
  const rows = getRankedRows(economySlug);
  const firstRow = rows[0];

  if (!firstRow) {
    return "";
  }

  const headers = [
    "chain",
    "slug",
    "source_rank",
    "readiness_rank",
    "total_score",
    ...firstRow.economy.modules.flatMap((module) => [
      `${module.slug}_status`,
      `${module.slug}_weighted_contribution`,
    ]),
  ];

  const lines = rows.map((row) => [
    row.chain.name,
    row.chain.slug,
    String(row.chain.sourceRank),
    String(row.benchmarkRank),
    formatScore(row.readinessScore.totalScore),
    ...row.readinessScore.moduleBreakdown.flatMap((module) => [
      module.status,
      formatScore(module.weightedContribution),
    ]),
  ]);

  return [headers.join(","), ...lines.map((line) => line.join(","))].join("\n");
}

export function buildTargetChainsByEconomyReportMarkdown() {
  const economySlugs: EconomyTypeSlug[] = [
    "ai-agents",
    "defi-infrastructure",
    "rwa-infrastructure",
    "prediction-markets",
  ];

  return [
    "# Target chains by economy",
    "",
    `- Dataset: ${atlasDatasetLabel}`,
    `- Snapshot date: ${atlasDatasetSnapshot.snapshotDate}`,
    "",
    ...economySlugs.flatMap((economySlug) => {
      const economy = getEconomy(economySlug);
      const targets = buildEconomyTargets(getRankedRows(economySlug), 5);

      return [
        `## ${economy.name}`,
        "",
        ...targets.map((row) => {
          const primaryRecommendation = row.readinessScore.moduleBreakdown.find(
            (module) => module.status !== "available",
          );

          return `- ${row.chain.name}: source rank #${row.chain.sourceRank}, readiness #${row.benchmarkRank} (${formatScore(row.readinessScore.totalScore)}), primary gap ${primaryRecommendation?.module.name ?? "none"}.`;
        }),
        "",
      ];
    }),
  ].join("\n");
}

export function buildHighTvlLaggingChainsReportMarkdown() {
  const economySlugs: EconomyTypeSlug[] = [
    "ai-agents",
    "defi-infrastructure",
    "rwa-infrastructure",
    "prediction-markets",
  ];

  return [
    "# High-TVL lagging chains",
    "",
    `- Dataset: ${atlasDatasetLabel}`,
    `- Snapshot date: ${atlasDatasetSnapshot.snapshotDate}`,
    "",
    ...economySlugs.flatMap((economySlug) => {
      const economy = getEconomy(economySlug);
      const laggingRows = buildHighTvlLaggingRows(getRankedRows(economySlug), 5);

      return [
        `## ${economy.name}`,
        "",
        ...(laggingRows.length === 0
          ? ["- No top-10 TVL chain is currently lagging below the midpoint."]
          : laggingRows.map((row) => {
              const topGaps = row.readinessScore.moduleBreakdown
                .filter((module) => module.status !== "available")
                .slice(0, 2)
                .map((module) => module.module.name)
                .join(", ");

              return `- ${row.chain.name}: source rank #${row.chain.sourceRank}, readiness #${row.benchmarkRank} (${formatScore(row.readinessScore.totalScore)}), major gaps ${topGaps.toLowerCase()}.`;
            })),
        "",
      ];
    }),
  ].join("\n");
}

export function buildGlobalChainRankingExportCsv() {
  const rows = getGlobalRankedRows();
  const headers = [
    "chain",
    "slug",
    "source_rank",
    "global_rank",
    "global_score",
    "economy_composite_score",
    "ecosystem_score",
    "adoption_score",
    "performance_score",
  ];
  const lines = rows.map((row) => [
    row.chain.name,
    row.chain.slug,
    String(row.chain.sourceRank),
    String(row.benchmarkRank),
    formatScore(row.score.totalScore),
    formatScore(row.score.economyCompositeScore),
    formatScore(row.score.ecosystemScore),
    formatScore(row.score.adoptionScore),
    formatScore(row.score.performanceScore),
  ]);

  return [headers.join(","), ...lines.map((line) => line.join(","))].join("\n");
}

export function buildTopTargetAccountsExportCsv() {
  const rows = getTargetAccountRows();
  const headers = [
    "chain",
    "economy",
    "opportunity_score",
    "global_rank",
    "readiness_rank",
    "priority",
    "readiness_gap",
    "missing_modules",
    "recommended_stack",
  ];
  const lines = rows.map((row) => [
    row.chain.name,
    row.economy.slug,
    formatScore(row.opportunity.totalScore),
    String(row.globalRank),
    String(row.readinessRank),
    row.priority,
    formatScore(row.readinessGap),
    row.missingModules.map((gap) => gap.module.slug).join("|"),
    row.recommendedStack.recommendedModules
      .map((recommendation) => recommendation.module.slug)
      .join("|"),
  ]);

  return [headers.join(","), ...lines.map((line) => line.join(","))].join("\n");
}

function buildTargetSummary(row: TargetAccountRow) {
  return `- ${row.chain.name} (${row.economy.shortLabel}): opportunity ${formatScore(row.opportunity.totalScore)}, readiness #${row.readinessRank}, global #${row.globalRank}, gaps ${row.missingModules
    .slice(0, 2)
    .map((gap) => gap.module.name.toLowerCase())
    .join(", ")}.`;
}

function buildGlobalSummaryLine(row: GlobalRankedChain) {
  return `- #${row.benchmarkRank} ${row.chain.name} (${formatScore(row.score.totalScore)})`;
}

export function buildTopEcosystemOpportunitiesReportMarkdown() {
  const globalRows = getGlobalRankedRows();
  const targetRows = getTargetAccountRows();
  const topTargets = targetRows.slice(0, 10);
  const byEconomy = new Map<EconomyTypeSlug, TargetAccountRow[]>();

  targetRows.forEach((row) => {
    const current = byEconomy.get(row.economy.slug) ?? [];
    current.push(row);
    byEconomy.set(row.economy.slug, current);
  });

  return [
    "# Top ecosystem opportunities",
    "",
    `- Dataset: ${atlasDatasetLabel}`,
    `- Snapshot date: ${atlasDatasetSnapshot.snapshotDate}`,
    "",
    "## Global chain leaders",
    "",
    ...globalRows.slice(0, 10).map(buildGlobalSummaryLine),
    "",
    "## Top commercial opportunities",
    "",
    ...topTargets.map(buildTargetSummary),
    "",
    ...(["ai-agents", "defi-infrastructure", "rwa-infrastructure", "prediction-markets"] as EconomyTypeSlug[]).flatMap(
      (economySlug) => {
        const economy = getEconomy(economySlug);
        const rows = (byEconomy.get(economySlug) ?? []).slice(0, 5);

        return [
          `## ${economy.name}`,
          "",
          ...rows.map(buildTargetSummary),
          "",
        ];
      },
    ),
  ].join("\n");
}
