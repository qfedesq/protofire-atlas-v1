import { atlasDatasetLabel, atlasDatasetSummary } from "@/lib/config/dataset";
import { atlasVersion } from "@/lib/config/version";
import type {
  EconomyTypeSlug,
  GlobalRankedChain,
  RankedChain,
} from "@/lib/domain/types";
import { readExternalMetricsSnapshot } from "@/lib/external-data/service";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { formatScore } from "@/lib/utils/format";

import { buildCsv } from "./csv";

const repository = createSeedChainsRepository();

type PublicMeta = {
  updated_at: string;
  atlas_version: string;
  source_note: string;
};

export function getPublicMeta(): PublicMeta {
  const externalSnapshot = readExternalMetricsSnapshot();

  return {
    updated_at: externalSnapshot.updatedAt,
    atlas_version: atlasVersion.label,
    source_note: `${atlasDatasetSummary}. Atlas publishes source-backed metrics when available and preserves the last valid snapshot otherwise.`,
  };
}

function serializeModuleBreakdown(row: {
  economy: RankedChain["economy"];
  readinessScore: RankedChain["readinessScore"];
}) {
  return row.readinessScore.moduleBreakdown.map((module) => ({
    slug: module.module.slug,
    name: module.module.name,
    status: module.status,
    weight: module.module.weight,
    contribution: Number(formatScore(module.weightedContribution)),
    max_contribution: Number(
      formatScore(
        (module.module.weight * row.economy.scoringConfig.maximumScore) / 100,
      ),
    ),
    rationale: module.rationale,
    evidence_note: module.evidenceNote,
  }));
}

function serializeEconomyRankingRow(row: RankedChain) {
  return {
    chain: {
      slug: row.chain.slug,
      name: row.chain.name,
      category: row.chain.category,
      website: row.chain.website ?? null,
      source_tvl_rank: row.chain.sourceRank,
      source_tvl_usd: row.chain.sourceTvlUsd,
    },
    economy: row.economy.slug,
    economy_name: row.economy.name,
    rank: row.benchmarkRank,
    score: Number(formatScore(row.readinessScore.totalScore)),
    modules: serializeModuleBreakdown(row),
    missing_modules: row.readinessScore.moduleBreakdown
      .filter((module) => module.status === "missing")
      .map((module) => module.module.name),
  };
}

function serializeGlobalRankingRow(row: GlobalRankedChain) {
  return {
    chain: {
      slug: row.chain.slug,
      name: row.chain.name,
      category: row.chain.category,
      website: row.chain.website ?? null,
      source_tvl_rank: row.chain.sourceRank,
      source_tvl_usd: row.chain.sourceTvlUsd,
    },
    rank: row.benchmarkRank,
    score: Number(formatScore(row.score.totalScore)),
    economy_composite_score: Number(
      formatScore(row.score.economyCompositeScore),
    ),
    ecosystem_score: Number(formatScore(row.score.ecosystemScore)),
    adoption_score: Number(formatScore(row.score.adoptionScore)),
    performance_score: Number(formatScore(row.score.performanceScore)),
    economies: Object.fromEntries(
      Object.entries(row.economyBreakdown).map(([economySlug, breakdown]) => [
        economySlug,
        {
          economy: breakdown.economy.name,
          rank: breakdown.benchmarkRank,
          score: Number(formatScore(breakdown.readinessScore.totalScore)),
          modules: serializeModuleBreakdown(breakdown),
          missing_modules: breakdown.readinessScore.moduleBreakdown
            .filter((module) => module.status === "missing")
            .map((module) => module.module.name),
        },
      ]),
    ),
    metrics: {
      tvl_usd: row.score.metrics.tvlUsd ?? row.chain.sourceTvlUsd,
      wallets: row.score.metrics.wallets,
      active_users: row.score.metrics.activeUsers,
      transactions: row.score.metrics.transactions ?? null,
      protocols: row.score.metrics.protocols,
      ecosystem_projects: row.score.metrics.ecosystemProjects,
      average_transaction_speed: row.score.metrics.averageTransactionSpeed,
      block_time: row.score.metrics.blockTime,
      throughput_indicator: row.score.metrics.throughputIndicator,
    },
  };
}

export function getPublicGlobalRankingPayload() {
  const meta = getPublicMeta();
  const rows = repository.listGlobalRankedChains();

  return {
    title: "Global Chain Ranking",
    description:
      "This ranking combines infrastructure readiness across four economies with ecosystem adoption and technical performance indicators.",
    dataset: atlasDatasetLabel,
    ...meta,
    rows: rows.map(serializeGlobalRankingRow),
  };
}

export function getPublicEconomyRankingPayload(economySlug: EconomyTypeSlug) {
  const meta = getPublicMeta();
  const economy = repository.listEconomies().find((item) => item.slug === economySlug);

  if (!economy) {
    throw new Error(`Unknown economy ${economySlug}.`);
  }

  return {
    title: `${economy.name} ranking`,
    economy: economy.slug,
    economy_name: economy.name,
    dataset: atlasDatasetLabel,
    ...meta,
    rows: repository.listRankedChains({ economy: economySlug }).map(
      serializeEconomyRankingRow,
    ),
  };
}

export function getPublicChainPayload(slug: string) {
  const meta = getPublicMeta();
  const globalPosition = repository
    .listGlobalRankedChains()
    .find((row) => row.chain.slug === slug);

  if (!globalPosition) {
    return null;
  }

  const economies = repository.listEconomies().map((economy) => {
    const profile = repository.getChainProfileBySlug(slug, economy.slug);

    if (!profile) {
      throw new Error(`Missing public profile for ${slug}:${economy.slug}.`);
    }

    return {
      economy: economy.slug,
      economy_name: economy.name,
      rank: profile.rank,
      score: Number(formatScore(profile.readinessScore.totalScore)),
      modules: serializeModuleBreakdown({
        economy: profile.economy,
        readinessScore: profile.readinessScore,
      }),
      missing_modules: profile.gapAnalysis
        .filter((gap) => gap.status === "missing")
        .map((gap) => gap.module.name),
      recommended_stack: profile.recommendedStack.recommendedModules.map(
        (recommendation) => ({
          title: recommendation.title,
          module: recommendation.module.name,
          score_lift: Number(formatScore(recommendation.potentialScoreLift)),
          expected_result: recommendation.expectedResult,
        }),
      ),
    };
  });

  return {
    chain: {
      slug: globalPosition.chain.slug,
      name: globalPosition.chain.name,
      category: globalPosition.chain.category,
      website: globalPosition.chain.website ?? null,
      source_tvl_rank: globalPosition.chain.sourceRank,
      source_tvl_usd: globalPosition.chain.sourceTvlUsd,
    },
    global_rank: globalPosition.benchmarkRank,
    global_score: Number(formatScore(globalPosition.score.totalScore)),
    dataset: atlasDatasetLabel,
    ...meta,
    economies,
  };
}

export function getPublicResearchPayload(economySlug: EconomyTypeSlug) {
  const meta = getPublicMeta();
  const ranking = repository.listRankedChains({ economy: economySlug });
  const economy = ranking[0]?.economy;

  if (!economy) {
    throw new Error(`Unknown research economy ${economySlug}.`);
  }

  const moduleGapSummary = economy.modules.map((module) => {
    const missing = ranking.filter((row) =>
      row.readinessScore.moduleBreakdown.some(
        (item) => item.module.slug === module.slug && item.status === "missing",
      ),
    ).length;
    const partial = ranking.filter((row) =>
      row.readinessScore.moduleBreakdown.some(
        (item) => item.module.slug === module.slug && item.status === "partial",
      ),
    ).length;

    return {
      module: module.name,
      missing,
      partial,
    };
  });

  return {
    title: `${economy.name} research snapshot`,
    economy: economy.slug,
    economy_name: economy.name,
    dataset: atlasDatasetLabel,
    ...meta,
    top_chains: ranking.slice(0, 10).map(serializeEconomyRankingRow),
    lagging_chains: ranking.slice(-10).map(serializeEconomyRankingRow),
    common_gaps: moduleGapSummary,
  };
}

export function getPublicGapsPayload(economySlug: EconomyTypeSlug) {
  const meta = getPublicMeta();
  const ranking = repository.listRankedChains({ economy: economySlug });
  const economy = ranking[0]?.economy;

  if (!economy) {
    throw new Error(`Unknown gaps economy ${economySlug}.`);
  }

  return {
    title: `${economy.name} gap dataset`,
    economy: economy.slug,
    economy_name: economy.name,
    dataset: atlasDatasetLabel,
    ...meta,
    rows: ranking.map((row) => ({
      chain: row.chain.name,
      slug: row.chain.slug,
      rank: row.benchmarkRank,
      score: Number(formatScore(row.readinessScore.totalScore)),
      missing_modules: row.readinessScore.moduleBreakdown
        .filter((module) => module.status === "missing")
        .map((module) => module.module.name),
      weak_modules: row.readinessScore.moduleBreakdown
        .filter((module) => module.status === "partial")
        .map((module) => module.module.name),
    })),
  };
}

export function buildPublicGlobalRankingCsv() {
  const payload = getPublicGlobalRankingPayload();

  return buildCsv(
    [
      "rank",
      "chain",
      "global_score",
      "economy_composite",
      "ecosystem_score",
      "adoption_score",
      "performance_score",
      "wallets",
      "active_users",
      "protocols",
      "ecosystem_projects",
      "avg_transaction_speed",
      "block_time",
      "throughput_indicator",
      "updated_at",
      "atlas_version",
    ],
    payload.rows.map((row) => [
      row.rank,
      row.chain.name,
      row.score,
      row.economy_composite_score,
      row.ecosystem_score,
      row.adoption_score,
      row.performance_score,
      row.metrics.wallets,
      row.metrics.active_users,
      row.metrics.protocols,
      row.metrics.ecosystem_projects,
      row.metrics.average_transaction_speed,
      row.metrics.block_time,
      row.metrics.throughput_indicator,
      payload.updated_at,
      payload.atlas_version,
    ]),
  );
}

export function buildPublicEconomyRankingCsv(economySlug: EconomyTypeSlug) {
  const payload = getPublicEconomyRankingPayload(economySlug);

  return buildCsv(
    [
      "rank",
      "chain",
      "economy",
      "score",
      "missing_modules",
      "updated_at",
      "atlas_version",
    ],
    payload.rows.map((row) => [
      row.rank,
      row.chain.name,
      row.economy_name,
      row.score,
      row.missing_modules.join(" | "),
      payload.updated_at,
      payload.atlas_version,
    ]),
  );
}
