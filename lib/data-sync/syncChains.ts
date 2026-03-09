import { atlasDatasetSnapshot } from "@/lib/config/dataset";
import type { DataSourceSyncResult } from "@/lib/connectors/types";

export async function syncChains() {
  return {
    sourceId: "atlas-benchmark",
    sourceName: atlasDatasetSnapshot.sourceProvider,
    sourceUrl: "data/source/defillama-top-30-evm-chains.snapshot.json",
    status: "healthy",
    fetchedAt: `${atlasDatasetSnapshot.snapshotDate}T00:00:00.000Z`,
    recordCount: 30,
    metrics: ["benchmark_universe"],
    message:
      "Atlas keeps the top-30 EVM benchmark as a curated, versioned snapshot rather than replacing it live at runtime.",
    confidence: "high",
  } satisfies DataSourceSyncResult;
}
