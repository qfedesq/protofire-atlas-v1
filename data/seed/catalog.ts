import { chainSeedRecords } from "@/data/seed/chains";
import type { ChainCatalogSeed } from "@/lib/domain/types";

export const chainCatalogSeeds: ChainCatalogSeed[] = chainSeedRecords.map(
  ({
    id,
    slug,
    name,
    sourceName,
    sourceRank,
    sourceGlobalRank,
    sourceCategory,
    sourceMetric,
    sourceProvider,
    sourceSnapshotDate,
    sourceTvlUsd,
    category,
    website,
    shortDescription,
    status,
  }) => ({
    id,
    slug,
    name,
    sourceName,
    sourceRank,
    sourceGlobalRank,
    sourceCategory,
    sourceMetric,
    sourceProvider,
    sourceSnapshotDate,
    sourceTvlUsd,
    category,
    website,
    shortDescription,
    status,
  }),
);
