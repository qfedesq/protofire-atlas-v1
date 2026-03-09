import type { ExternalMetricKey } from "@/lib/domain/types";

export type SourceHealthStatus = "healthy" | "degraded" | "failed" | "skipped";

export type ExternalMetricRecord = {
  chainSlug: string;
  metricKey: ExternalMetricKey | string;
  value: number;
  sourceName: string;
  sourceUrl: string;
  fetchedAt: string;
  normalizationNote: string;
};

export type DataSourceSyncResult = {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  status: SourceHealthStatus;
  fetchedAt: string;
  recordCount: number;
  metrics: string[];
  message: string;
  confidence: "high" | "medium" | "low";
};
