import { chainCatalogSeeds } from "@/data/seed/catalog";
import type {
  Chain,
  ChainEcosystemMetrics,
  ExternalMetricsSnapshot,
} from "@/lib/domain/types";

import { buildFallbackExternalMetricsSnapshot } from "./baseline";
import { artemisConnector } from "./connectors/artemis";
import { defiLlamaConnector } from "./connectors/defillama";
import { duneConnector } from "./connectors/dune";
import { tokenTerminalConnector } from "./connectors/token-terminal";
import {
  saveExternalMetricsSnapshot,
  getExternalMetricsSnapshot,
  initializeExternalMetricsSnapshotStore,
} from "./store";
import { mergeSnapshotRows } from "./utils";

function buildChainMetrics(
  chain: Chain,
  snapshot: ExternalMetricsSnapshot,
): ChainEcosystemMetrics {
  const chainSnapshot = snapshot.chains.find((item) => item.chainSlug === chain.slug);

  if (!chainSnapshot) {
    throw new Error(`Missing external metrics snapshot for ${chain.slug}.`);
  }

  const { metrics } = chainSnapshot;

  return {
    chainId: chain.id,
    tvlUsd: metrics.tvlUsd?.value ?? chain.sourceTvlUsd,
    wallets: metrics.wallets?.value ?? 0,
    activeUsers: metrics.activeUsers?.value ?? 0,
    transactions: metrics.transactions?.value,
    protocols: metrics.protocols?.value ?? 0,
    ecosystemProjects: metrics.ecosystemProjects?.value ?? 0,
    averageTransactionSpeed: metrics.averageTransactionSpeed?.value ?? 0,
    blockTime: metrics.blockTime?.value ?? 0,
    throughputIndicator: metrics.throughputIndicator?.value ?? 0,
    snapshotDate: snapshot.updatedAt.slice(0, 10),
    sourceLabel: snapshot.sourceNote,
    provenance: {
      tvlUsd: metrics.tvlUsd,
      wallets: metrics.wallets,
      activeUsers: metrics.activeUsers,
      transactions: metrics.transactions,
      protocols: metrics.protocols,
      ecosystemProjects: metrics.ecosystemProjects,
      averageTransactionSpeed: metrics.averageTransactionSpeed,
      blockTime: metrics.blockTime,
      throughputIndicator: metrics.throughputIndicator,
    },
  };
}

export function listResolvedChainEcosystemMetrics(
  chains: Chain[],
): Map<string, ChainEcosystemMetrics> {
  const snapshot = getExternalMetricsSnapshot();

  return new Map(
    chains.map((chain) => [chain.slug, buildChainMetrics(chain, snapshot)] as const),
  );
}

export function readExternalMetricsSnapshot() {
  return getExternalMetricsSnapshot();
}

export async function syncExternalMetricsSnapshot() {
  await initializeExternalMetricsSnapshotStore();
  const fallbackSnapshot = buildFallbackExternalMetricsSnapshot();
  const currentSnapshot = getExternalMetricsSnapshot();
  let nextSnapshot = mergeSnapshotRows(
    fallbackSnapshot,
    currentSnapshot.chains.map((chain) => ({
      chainSlug: chain.chainSlug,
      metrics: chain.metrics,
    })),
    currentSnapshot.connectors,
    new Date().toISOString(),
  );
  const connectors = [
    defiLlamaConnector,
    duneConnector,
    artemisConnector,
    tokenTerminalConnector,
  ];
  const connectorStatuses: ExternalMetricsSnapshot["connectors"] = [];

  for (const connector of connectors) {
    const result = await connector.run(chainCatalogSeeds);
    connectorStatuses.push(result.status);

    if (result.rows.length > 0) {
      nextSnapshot = mergeSnapshotRows(
        nextSnapshot,
        result.rows,
        connectorStatuses,
        new Date().toISOString(),
      );
    }
  }

  nextSnapshot = {
    ...nextSnapshot,
    connectors: connectorStatuses,
  };

  return saveExternalMetricsSnapshot(nextSnapshot);
}
