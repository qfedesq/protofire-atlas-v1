import { chainCatalogSeeds } from "@/data/seed/catalog";
import { chainEcosystemMetricsSeeds } from "@/data/seed/chain-ecosystem-metrics";
import { validateChainEcosystemMetricsSeeds } from "@/lib/domain/schemas";
import type {
  ChainCatalogSeed,
  ExternalChainMetricsSnapshot,
  ExternalMetricKey,
  ExternalMetricSnapshotValue,
  ExternalMetricsSnapshot,
} from "@/lib/domain/types";

import { externalMetricsSourceNote } from "./config";

const fallbackEndpoint = "seed://chain-ecosystem-metrics";

function buildMetricValue(
  value: number,
  snapshotDate: string,
  sourceLabel: string,
): ExternalMetricSnapshotValue {
  return {
    value,
    sourceName: sourceLabel,
    sourceEndpoint: fallbackEndpoint,
    fetchedAt: `${snapshotDate}T00:00:00.000Z`,
    normalizationNote: "Curated Atlas fallback snapshot.",
    freshness: "fallback",
  };
}

function addOptionalMetric(
  target: Partial<Record<ExternalMetricKey, ExternalMetricSnapshotValue>>,
  key: ExternalMetricKey,
  value: number | null | undefined,
  snapshotDate: string,
  sourceLabel: string,
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return;
  }

  target[key] = buildMetricValue(value, snapshotDate, sourceLabel);
}

function buildFallbackChainMetrics(
  chain: ChainCatalogSeed,
): ExternalChainMetricsSnapshot {
  const seed = validateChainEcosystemMetricsSeeds(chainCatalogSeeds, chainEcosystemMetricsSeeds).find(
    (item) => item.chainSlug === chain.slug,
  );

  if (!seed) {
    throw new Error(`Missing fallback ecosystem metrics for ${chain.slug}.`);
  }

  const metrics: Partial<
    Record<ExternalMetricKey, ExternalMetricSnapshotValue>
  > = {};

  addOptionalMetric(
    metrics,
    "tvlUsd",
    seed.tvlUsd ?? chain.sourceTvlUsd,
    seed.snapshotDate,
    seed.sourceLabel,
  );
  addOptionalMetric(
    metrics,
    "wallets",
    seed.wallets,
    seed.snapshotDate,
    seed.sourceLabel,
  );
  addOptionalMetric(
    metrics,
    "activeUsers",
    seed.activeUsers,
    seed.snapshotDate,
    seed.sourceLabel,
  );
  addOptionalMetric(
    metrics,
    "transactions",
    seed.transactions,
    seed.snapshotDate,
    seed.sourceLabel,
  );
  addOptionalMetric(
    metrics,
    "protocols",
    seed.protocols,
    seed.snapshotDate,
    seed.sourceLabel,
  );
  addOptionalMetric(
    metrics,
    "ecosystemProjects",
    seed.ecosystemProjects,
    seed.snapshotDate,
    seed.sourceLabel,
  );
  addOptionalMetric(
    metrics,
    "averageTransactionSpeed",
    seed.averageTransactionSpeed,
    seed.snapshotDate,
    seed.sourceLabel,
  );
  addOptionalMetric(
    metrics,
    "blockTime",
    seed.blockTime,
    seed.snapshotDate,
    seed.sourceLabel,
  );
  addOptionalMetric(
    metrics,
    "throughputIndicator",
    seed.throughputIndicator,
    seed.snapshotDate,
    seed.sourceLabel,
  );

  return {
    chainSlug: chain.slug,
    metrics,
  };
}

export function buildFallbackExternalMetricsSnapshot(): ExternalMetricsSnapshot {
  const lastSnapshotDate =
    chainCatalogSeeds[0]?.sourceSnapshotDate ?? "2026-03-07";

  return {
    updatedAt: `${lastSnapshotDate}T00:00:00.000Z`,
    sourceNote: externalMetricsSourceNote,
    connectors: [
      {
        connector: "atlas-fallback",
        status: "success",
        message:
          "Loaded the curated Atlas ecosystem snapshot as the fallback baseline.",
      },
    ],
    chains: chainCatalogSeeds.map((chain) => buildFallbackChainMetrics(chain)),
  };
}
