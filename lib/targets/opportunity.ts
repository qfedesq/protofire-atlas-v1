import { getActiveOpportunityScoringAssumptions } from "@/lib/assumptions/resolve";
import type {
  EconomyType,
  GlobalRankedChain,
  RankedChain,
  TargetAccountRow,
  TargetAccountsQuery,
  WedgeApplicability,
} from "@/lib/domain/types";
import { buildGapAnalysis, buildRecommendedStack } from "@/lib/recommendations/engine";

function normalizeHigherBetter(value: number, values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (max === min) {
    return 10;
  }

  return ((value - min) / (max - min)) * 10;
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getPriorityLabel(
  score: number,
  thresholds: { high: number; medium: number },
) {
  if (score >= thresholds.high) {
    return "High" as const;
  }

  if (score >= thresholds.medium) {
    return "Medium" as const;
  }

  return "Monitor" as const;
}

function buildStackFitScore(
  economy: EconomyType,
  recommendedModules: ReturnType<typeof buildRecommendedStack>["recommendedModules"],
) {
  const { stackFitComponents } = getActiveOpportunityScoringAssumptions();

  if (recommendedModules.length === 0) {
    return 0;
  }

  const liftRatio =
    recommendedModules.reduce(
      (sum, recommendation) => sum + recommendation.potentialScoreLift,
      0,
    ) /
    economy.scoringConfig.maximumScore;
  const coverageRatio = recommendedModules.length / economy.modules.length;

  return (
    liftRatio * 10 * (stackFitComponents.liftRatio / 100) +
    coverageRatio * 10 * (stackFitComponents.coverageRatio / 100)
  );
}

function getSortValue(row: TargetAccountRow, sort: TargetAccountsQuery["sort"]) {
  switch (sort) {
    case "name":
      return row.chain.name.toLowerCase();
    case "readinessGap":
      return row.readinessGap;
    case "ecosystemScore":
      return row.globalScore.ecosystemScore;
    case "opportunityScore":
    default:
      return row.opportunity.totalScore;
  }
}

export function sortTargetAccountRows(
  rows: TargetAccountRow[],
  query: Partial<TargetAccountsQuery> = {},
) {
  const sort = query.sort ?? "opportunityScore";
  const direction = query.direction ?? "desc";

  return [...rows].sort((left, right) => {
    const leftValue = getSortValue(left, sort);
    const rightValue = getSortValue(right, sort);

    if (typeof leftValue === "string" && typeof rightValue === "string") {
      const result = leftValue.localeCompare(rightValue);
      return direction === "asc" ? result : result * -1;
    }

    const delta = Number(leftValue) - Number(rightValue);

    if (delta !== 0) {
      return direction === "asc" ? delta : delta * -1;
    }

    return left.chain.name.localeCompare(right.chain.name);
  });
}

export function buildTargetAccountRows(
  economyRankings: RankedChain[],
  globalRankings: GlobalRankedChain[],
  applicabilityMatrixBySlug?: Map<string, WedgeApplicability[]>,
): TargetAccountRow[] {
  const { weights, priorityThresholds } = getActiveOpportunityScoringAssumptions();
  const globalBySlug = new Map(
    globalRankings.map((row) => [row.chain.slug, row] as const),
  );
  const tvlValues = economyRankings.map((row) => Math.log10(row.chain.sourceTvlUsd + 1));

  return economyRankings
    .map((row) => {
      const globalPosition = globalBySlug.get(row.chain.slug);
      const applicability = applicabilityMatrixBySlug
        ?.get(row.chain.slug)
        ?.find((item) => item.wedgeId === row.economy.slug);

      if (!globalPosition) {
        throw new Error(`Missing global position for ${row.chain.slug}.`);
      }

      if (!applicability) {
        throw new Error(
          `Missing applicability row for ${row.chain.slug}:${row.economy.slug}.`,
        );
      }

      if (applicability.applicabilityStatus === "not_applicable") {
        return null;
      }

      const missingModules = buildGapAnalysis(
        row.economy,
        row.readinessScore.moduleBreakdown,
      );
      const recommendedStack = buildRecommendedStack(
        row.chain,
        row.economy,
        row.readinessScore.moduleBreakdown,
      );
      const readinessGap =
        row.economy.scoringConfig.maximumScore - row.readinessScore.totalScore;
      const tvlTierScore = normalizeHigherBetter(
        Math.log10(row.chain.sourceTvlUsd + 1),
        tvlValues,
      );
      const readinessGapScore =
        (readinessGap / row.economy.scoringConfig.maximumScore) * 10;
      const stackFitScore = buildStackFitScore(
        row.economy,
        recommendedStack.recommendedModules,
      );
      const ecosystemSignalScore = average([
        globalPosition.score.ecosystemScore,
        globalPosition.score.adoptionScore,
      ]);
      const totalScore =
        tvlTierScore * (weights.tvlTier / 100) +
        readinessGapScore * (weights.readinessGap / 100) +
        stackFitScore * (weights.stackFit / 100) +
        ecosystemSignalScore * (weights.ecosystemSignal / 100);

      return {
        chain: row.chain,
        economy: row.economy,
        applicability,
        readinessRank: row.benchmarkRank,
        readinessScore: row.readinessScore,
        readinessGap,
        globalRank: globalPosition.benchmarkRank,
        globalScore: globalPosition.score,
        opportunity: {
          chainId: row.chain.id,
          economyType: row.economy.slug,
          totalScore,
          breakdown: {
            tvlTierScore,
            readinessGapScore,
            stackFitScore,
            ecosystemSignalScore,
          },
          computedAt: globalPosition.score.computedAt,
        },
        priority: getPriorityLabel(totalScore, priorityThresholds),
        missingModules,
        recommendedStack,
      };
    })
    .filter(
      (row): row is TargetAccountRow =>
        row !== null && row.recommendedStack.recommendedModules.length > 0,
    );
}
