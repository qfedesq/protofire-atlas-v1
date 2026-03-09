import type { ChainCatalogSeed } from "@/lib/domain/types";
import { defiLlamaConnector } from "@/lib/external-data/connectors/defillama";

import type { DataSourceSyncResult, ExternalMetricRecord } from "./types";

const sourceUrl = "https://api.llama.fi/";

export async function syncWithDefiLlama(chains: ChainCatalogSeed[]) {
  const result = await defiLlamaConnector.run(chains);
  const fetchedAt = new Date().toISOString();
  const records: ExternalMetricRecord[] = result.rows.flatMap((row) =>
    Object.entries(row.metrics).flatMap(([metricKey, metricValue]) =>
      metricValue
        ? [
            {
              chainSlug: row.chainSlug,
              metricKey,
              value: metricValue.value,
              sourceName: metricValue.sourceName,
              sourceUrl: metricValue.sourceEndpoint,
              fetchedAt: metricValue.fetchedAt,
              normalizationNote: metricValue.normalizationNote,
            } satisfies ExternalMetricRecord,
          ]
        : [],
    ),
  );

  return {
    result: {
      sourceId: "defillama",
      sourceName: "DeFiLlama",
      sourceUrl,
      status:
        result.status.status === "success"
          ? "healthy"
          : result.status.status === "failed"
            ? "failed"
            : "skipped",
      fetchedAt,
      recordCount: records.length,
      metrics: ["tvlUsd", "protocols"],
      message: result.status.message,
      confidence: "high",
    } satisfies DataSourceSyncResult,
    records,
  };
}
