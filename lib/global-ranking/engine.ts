import { getActiveGlobalRankingAssumptions } from "@/lib/assumptions/resolve";
import { getActiveAssumptions } from "@/lib/assumptions/store";
import { listResolvedChainEcosystemMetrics } from "@/lib/external-data/service";
import type {
  Chain,
  ChainEcosystemMetrics,
  EconomyTypeSlug,
  GlobalChainScore,
  GlobalRankedChain,
  RankedChain,
} from "@/lib/domain/types";

type RankedRowsByEconomy = Map<EconomyTypeSlug, RankedChain[]>;
type GlobalRankedChainDraft = Omit<GlobalRankedChain, "economyBreakdown">;

function normalizeHigherBetter(value: number, values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (max === min) {
    return 10;
  }

  return ((value - min) / (max - min)) * 10;
}

function normalizeLowerBetter(value: number, values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (max === min) {
    return 10;
  }

  return ((max - value) / (max - min)) * 10;
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildMetricsByChain(
  chains: Chain[],
): Map<string, ChainEcosystemMetrics> {
  return listResolvedChainEcosystemMetrics(chains);
}

function buildEconomyCompositeScore(
  chainSlug: string,
  rankedRowsByEconomy: RankedRowsByEconomy,
) {
  const { economyCompositeWeights } = getActiveGlobalRankingAssumptions();

  return (
    Object.entries(economyCompositeWeights) as [EconomyTypeSlug, number][]
  ).reduce((sum, [economySlug, weight]) => {
    const row = rankedRowsByEconomy
      .get(economySlug)
      ?.find((item) => item.chain.slug === chainSlug);

    if (!row) {
      throw new Error(`Missing ${economySlug} readiness row for ${chainSlug}.`);
    }

    return sum + row.readinessScore.totalScore * (weight / 100);
  }, 0);
}

function buildGlobalScoreDrafts(
  chains: Chain[],
  rankedRowsByEconomy: RankedRowsByEconomy,
): GlobalRankedChainDraft[] {
  const metricsByChain = buildMetricsByChain(chains);
  const assumptions = getActiveAssumptions();
  const { componentWeights } = assumptions.globalRanking;
  const allMetrics = [...metricsByChain.values()];

  const wallets = allMetrics.map((record) => record.wallets);
  const activeUsers = allMetrics.map((record) => record.activeUsers);
  const protocols = allMetrics.map((record) => record.protocols);
  const ecosystemProjects = allMetrics.map((record) => record.ecosystemProjects);
  const transactionSpeed = allMetrics.map(
    (record) => record.averageTransactionSpeed,
  );
  const blockTimes = allMetrics.map((record) => record.blockTime);
  const throughput = allMetrics.map((record) => record.throughputIndicator);

  return chains.map((chain) => {
    const metrics = metricsByChain.get(chain.slug);

    if (!metrics) {
      throw new Error(`Missing normalized metric bundle for ${chain.slug}.`);
    }

    const economyCompositeScore = buildEconomyCompositeScore(
      chain.slug,
      rankedRowsByEconomy,
    );
    const ecosystemScore = average([
      normalizeHigherBetter(metrics.protocols, protocols),
      normalizeHigherBetter(metrics.ecosystemProjects, ecosystemProjects),
    ]);
    const adoptionScore = average([
      normalizeHigherBetter(metrics.wallets, wallets),
      normalizeHigherBetter(metrics.activeUsers, activeUsers),
    ]);
    const performanceScore = average([
      normalizeLowerBetter(metrics.averageTransactionSpeed, transactionSpeed),
      normalizeLowerBetter(metrics.blockTime, blockTimes),
      normalizeHigherBetter(metrics.throughputIndicator, throughput),
    ]);
    const totalScore =
      economyCompositeScore * (componentWeights.economyScore / 100) +
      ecosystemScore * (componentWeights.ecosystem / 100) +
      adoptionScore * (componentWeights.adoption / 100) +
      performanceScore * (componentWeights.performance / 100);

    const score: GlobalChainScore = {
      chainId: chain.id,
      chainSlug: chain.slug,
      economyCompositeScore,
      ecosystemScore,
      adoptionScore,
      performanceScore,
      totalScore,
      computedAt: assumptions.updatedAt,
      metrics,
    };

    return {
      chain,
      score,
      benchmarkRank: 0,
    };
  });
}

export function buildGlobalRankedChains(
  chains: Chain[],
  rankedRowsByEconomy: RankedRowsByEconomy,
): GlobalRankedChainDraft[] {
  return buildGlobalScoreDrafts(chains, rankedRowsByEconomy)
    .sort((left, right) => {
      if (right.score.totalScore !== left.score.totalScore) {
        return right.score.totalScore - left.score.totalScore;
      }

      return left.chain.name.localeCompare(right.chain.name);
    })
    .map((row, index) => ({
      ...row,
      benchmarkRank: index + 1,
    }));
}
