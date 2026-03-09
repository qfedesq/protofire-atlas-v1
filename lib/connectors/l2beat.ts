import type { DataSourceSyncResult, ExternalMetricRecord } from "./types";

const l2beatSourceUrl =
  process.env.L2BEAT_CHAIN_METRICS_URL?.trim() ?? "https://api-docs.l2beat.com/";

export async function syncWithL2Beat() {
  const configuredUrl = process.env.L2BEAT_CHAIN_METRICS_URL?.trim();

  if (!configuredUrl) {
    return {
      result: {
        sourceId: "l2beat",
        sourceName: "L2BEAT",
        sourceUrl: l2beatSourceUrl,
        status: "skipped",
        fetchedAt: new Date().toISOString(),
        recordCount: 0,
        metrics: ["blockTime", "throughputIndicator"],
        message:
          "Skipped because L2BEAT_CHAIN_METRICS_URL is not configured. Atlas needs a concrete L2BEAT export endpoint or query URL before it can normalize those metrics.",
        confidence: "low",
      } satisfies DataSourceSyncResult,
      records: [] as ExternalMetricRecord[],
    };
  }

  try {
    const response = await fetch(configuredUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`L2BEAT request failed (${response.status}).`);
    }

    const fetchedAt = new Date().toISOString();
    await response.json();

    return {
      result: {
        sourceId: "l2beat",
        sourceName: "L2BEAT",
        sourceUrl: configuredUrl,
        status: "degraded",
        fetchedAt,
        recordCount: 0,
        metrics: ["blockTime", "throughputIndicator"],
        message:
          "L2BEAT responded, but Atlas still needs a field-mapping normalization step for the configured endpoint.",
        confidence: "low",
      } satisfies DataSourceSyncResult,
      records: [] as ExternalMetricRecord[],
    };
  } catch (error) {
    return {
      result: {
        sourceId: "l2beat",
        sourceName: "L2BEAT",
        sourceUrl: configuredUrl,
        status: "failed",
        fetchedAt: new Date().toISOString(),
        recordCount: 0,
        metrics: ["blockTime", "throughputIndicator"],
        message: error instanceof Error ? error.message : "Unknown L2BEAT failure.",
        confidence: "low",
      } satisfies DataSourceSyncResult,
      records: [] as ExternalMetricRecord[],
    };
  }
}
