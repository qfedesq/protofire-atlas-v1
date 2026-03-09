import type { ChainCatalogSeed } from "@/lib/domain/types";
import { tokenTerminalConnector } from "@/lib/external-data/connectors/token-terminal";

import type { DataSourceSyncResult, ExternalMetricRecord } from "./types";

const sourceUrl = process.env.TOKEN_TERMINAL_CHAIN_METRICS_URL?.trim() ?? "https://docs.tokenterminal.com/reference/introduction";

export async function syncWithTokenTerminal(chains: ChainCatalogSeed[]) {
  const result = await tokenTerminalConnector.run(chains);
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
      sourceId: "token-terminal",
      sourceName: "Token Terminal",
      sourceUrl,
      status:
        result.status.status === "success"
          ? "healthy"
          : result.status.status === "failed"
            ? "failed"
            : "skipped",
      fetchedAt,
      recordCount: records.length,
      metrics: ["ecosystemProjects", "protocols", "wallets", "activeUsers"],
      message: result.status.message,
      confidence: result.status.status === "success" ? "medium" : "low",
    } satisfies DataSourceSyncResult,
    records,
  };
}
