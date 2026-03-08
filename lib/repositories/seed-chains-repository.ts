import { listActiveEconomyTypes } from "@/lib/assumptions/resolve";
import { buildPeerComparison, buildScoreDrivers } from "@/lib/comparison/peer-comparison";
import { chainCatalogSeeds } from "@/data/seed/catalog";
import { chainEconomySeedRecords } from "@/data/seed/economies";
import { chainRoadmapSeedsBySlug, chainRoadmapSeeds } from "@/data/seed/chain-roadmaps";
import {
  defaultEconomySlug,
} from "@/lib/config/economies";
import {
  validateAtlasSeedDataset,
  validateChainRoadmapSeeds,
} from "@/lib/domain/schemas";
import { buildLiquidStakingDiagnosis } from "@/lib/liquid-staking/diagnosis";
import { buildLiquidStakingMarketSnapshot } from "@/lib/liquid-staking/market-snapshot";
import type {
  Chain,
  ChainCatalogSeed,
  ChainEconomySeedRecord,
  ChainProfile,
  EconomyType,
  EconomyTypeSlug,
  RankedChain,
  RankingsSortDirection,
  RankingsSortKey,
  RankingsQuery,
} from "@/lib/domain/types";
import {
  buildDeploymentPlan,
  buildGapAnalysis,
  buildRecommendedStack,
} from "@/lib/recommendations/engine";
import {
  buildChainModuleStatuses,
  buildReadinessScore,
} from "@/lib/scoring/readiness-score";
import type { ChainsRepository } from "@/lib/repositories/types";

type EconomyDataset = {
  economy: EconomyType;
  rankedChains: RankedChain[];
  rankedChainsBySlug: Map<string, RankedChain>;
  leader: RankedChain;
};

type SeedRepositoryDataset = {
  chains: Chain[];
  economies: EconomyType[];
  economyDatasets: Map<EconomyTypeSlug, EconomyDataset>;
};

function buildChain(seed: ChainCatalogSeed): Chain {
  const roadmapSeed = chainRoadmapSeedsBySlug.get(seed.slug);

  if (!roadmapSeed) {
    throw new Error(`Missing roadmap seed for ${seed.slug}`);
  }

  return {
    id: seed.id,
    slug: seed.slug,
    name: seed.name,
    sourceName: seed.sourceName,
    sourceRank: seed.sourceRank,
    sourceGlobalRank: seed.sourceGlobalRank,
    sourceCategory: seed.sourceCategory,
    sourceMetric: seed.sourceMetric,
    sourceProvider: seed.sourceProvider,
    sourceSnapshotDate: seed.sourceSnapshotDate,
    sourceTvlUsd: seed.sourceTvlUsd,
    category: seed.category,
    website: seed.website,
    shortDescription: seed.shortDescription,
    status: seed.status,
    roadmap: {
      sourceKind: roadmapSeed.sourceKind,
      sourceLabel: roadmapSeed.sourceLabel,
      sourceUrl: roadmapSeed.sourceUrl,
      snapshotDate: roadmapSeed.snapshotDate,
      stageLabel: roadmapSeed.stageLabel,
      stageSummary: roadmapSeed.stageSummary,
      atlasFitSummary: roadmapSeed.atlasFitSummary,
    },
  };
}

function getRecordLookup(records: ChainEconomySeedRecord[]) {
  return new Map(
    records.map((record) => [`${record.chainSlug}:${record.economyType}`, record]),
  );
}

function buildRankedChain(
  chain: Chain,
  economy: EconomyType,
  record: ChainEconomySeedRecord,
): RankedChain {
  const moduleStatuses = buildChainModuleStatuses(
    chain,
    economy,
    record.moduleStatuses,
  );
  const readinessScore = buildReadinessScore(chain.id, economy, moduleStatuses);

  return {
    chain,
    economy,
    readinessScore,
    benchmarkRank: 0,
    leaderGap: 0,
  };
}

function getSortValue(chain: RankedChain, sort: RankingsSortKey) {
  if (sort === "name") {
    return chain.chain.name.toLowerCase();
  }

  if (sort === "totalScore") {
    return chain.readinessScore.totalScore;
  }

  return (
    chain.readinessScore.moduleBreakdown.find(
      (module) => module.module.slug === sort,
    )?.weightedContribution ?? 0
  );
}

function compareRankedChains(
  left: RankedChain,
  right: RankedChain,
  sort: RankingsSortKey,
  direction: RankingsSortDirection,
) {
  const leftValue = getSortValue(left, sort);
  const rightValue = getSortValue(right, sort);

  if (typeof leftValue === "string" && typeof rightValue === "string") {
    const result = leftValue.localeCompare(rightValue);
    return direction === "asc" ? result : result * -1;
  }

  const numericDelta = Number(leftValue) - Number(rightValue);

  if (numericDelta !== 0) {
    return direction === "asc" ? numericDelta : numericDelta * -1;
  }

  return left.chain.name.localeCompare(right.chain.name);
}

function sortByBenchmarkRank(rows: RankedChain[]) {
  return [...rows].sort((left, right) => {
    if (right.readinessScore.totalScore !== left.readinessScore.totalScore) {
      return right.readinessScore.totalScore - left.readinessScore.totalScore;
    }

    return left.chain.name.localeCompare(right.chain.name);
  });
}

function buildEconomyDataset(
  chains: Chain[],
  economy: EconomyType,
  records: Map<string, ChainEconomySeedRecord>,
): EconomyDataset {
  const rankedChainDrafts = chains.map((chain) => {
    const record = records.get(`${chain.slug}:${economy.slug}`);

    if (!record) {
      throw new Error(`Missing seed record for ${economy.slug}:${chain.slug}`);
    }

    return buildRankedChain(chain, economy, record);
  });
  const benchmarkRanking = sortByBenchmarkRank(rankedChainDrafts);
  const leader = benchmarkRanking[0];

  if (!leader) {
    throw new Error(`No leader found for ${economy.slug}`);
  }

  const rankedChains = benchmarkRanking.map((row, index) => ({
    ...row,
    benchmarkRank: index + 1,
    leaderGap: leader.readinessScore.totalScore - row.readinessScore.totalScore,
  }));

  return {
    economy,
    rankedChains,
    rankedChainsBySlug: new Map(
      rankedChains.map((row) => [row.chain.slug, row] as const),
    ),
    leader,
  };
}

function buildSeedRepositoryDataset(): SeedRepositoryDataset {
  const validatedDataset = validateAtlasSeedDataset({
    chains: chainCatalogSeeds,
    economies: listActiveEconomyTypes(),
    records: chainEconomySeedRecords,
  });
  validateChainRoadmapSeeds(validatedDataset.chains, chainRoadmapSeeds);
  const chains = validatedDataset.chains
    .map((seed) => buildChain(seed))
    .sort((left, right) => left.name.localeCompare(right.name));
  const recordLookup = getRecordLookup(validatedDataset.records);

  return {
    chains,
    economies: [...validatedDataset.economies],
    economyDatasets: new Map(
      validatedDataset.economies.map((economy) => [
        economy.slug,
        buildEconomyDataset(chains, economy, recordLookup),
      ]),
    ),
  };
}

export class SeedChainsRepository implements ChainsRepository {
  private getDataset() {
    return buildSeedRepositoryDataset();
  }

  listChains() {
    return [...this.getDataset().chains];
  }

  listEconomies() {
    return [...this.getDataset().economies];
  }

  listRankedChains(query?: Partial<RankingsQuery>) {
    const datasetBundle = this.getDataset();
    const economySlug = query?.economy ?? defaultEconomySlug;
    const dataset =
      datasetBundle.economyDatasets.get(economySlug) ??
      datasetBundle.economyDatasets.get(defaultEconomySlug);

    if (!dataset) {
      throw new Error(`Unknown economy dataset: ${economySlug}`);
    }

    const q = query?.q?.trim().toLowerCase() ?? "";
    const category = query?.category ?? "All";
    const sort = query?.sort ?? "totalScore";
    const direction = query?.direction ?? "desc";
    const limit = query?.limit;

    const filtered = dataset.rankedChains.filter((row) => {
      const matchesQuery =
        q.length === 0 ||
        row.chain.name.toLowerCase().includes(q) ||
        row.chain.shortDescription.toLowerCase().includes(q);
      const matchesCategory =
        category === "All" ? true : row.chain.category === category;

      return matchesQuery && matchesCategory;
    });

    const sorted = [...filtered].sort((left, right) =>
      compareRankedChains(left, right, sort, direction),
    );

    return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
  }

  getChainProfileBySlug(
    slug: string,
    economySlug: EconomyTypeSlug = defaultEconomySlug,
  ): ChainProfile | null {
    const datasetBundle = this.getDataset();
    const dataset =
      datasetBundle.economyDatasets.get(economySlug) ??
      datasetBundle.economyDatasets.get(defaultEconomySlug);

    if (!dataset) {
      return null;
    }

    const rankedChain = dataset.rankedChainsBySlug.get(slug);

    if (!rankedChain) {
      return null;
    }

    const gapAnalysis = buildGapAnalysis(
      rankedChain.economy,
      rankedChain.readinessScore.moduleBreakdown,
    );
    const recommendedStack = buildRecommendedStack(
      rankedChain.chain,
      rankedChain.economy,
      rankedChain.readinessScore.moduleBreakdown,
    );
    const deploymentPlan = buildDeploymentPlan(
      rankedChain.chain,
      rankedChain.economy,
      recommendedStack,
    );

    const liquidStakingDiagnosis =
      rankedChain.economy.slug === "defi-infrastructure"
        ? buildLiquidStakingDiagnosis(rankedChain.chain.slug)
        : undefined;

    return {
      chain: rankedChain.chain,
      economy: rankedChain.economy,
      readinessScore: rankedChain.readinessScore,
      gapAnalysis,
      rank: rankedChain.benchmarkRank,
      leader: dataset.leader.chain.name,
      leaderGap: rankedChain.leaderGap,
      chainsOutranked: dataset.rankedChains.length - rankedChain.benchmarkRank,
      scoreDrivers: buildScoreDrivers({
        economy: rankedChain.economy,
        readinessScore: rankedChain.readinessScore,
      }),
      peers: buildPeerComparison(rankedChain, dataset.rankedChains),
      liquidStakingDiagnosis,
      liquidStakingMarketSnapshot:
        liquidStakingDiagnosis && rankedChain.economy.slug === "defi-infrastructure"
          ? buildLiquidStakingMarketSnapshot(
              rankedChain.chain,
              liquidStakingDiagnosis,
            )
          : undefined,
      recommendedStack,
      deploymentPlan,
    };
  }
}

export function createSeedChainsRepository() {
  return new SeedChainsRepository();
}
