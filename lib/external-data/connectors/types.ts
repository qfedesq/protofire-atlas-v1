import type {
  ChainCatalogSeed,
  ExternalConnectorSyncStatus,
  ExternalMetricKey,
} from "@/lib/domain/types";

import type { NormalizedConnectorMetricRow } from "@/lib/external-data/utils";

export type ConnectorMetricAliasMap = Partial<
  Record<ExternalMetricKey, string[]>
>;

export type ExternalMetricsConnectorResult = {
  rows: NormalizedConnectorMetricRow[];
  status: ExternalConnectorSyncStatus;
};

export type ExternalMetricsConnector = {
  id: string;
  run: (chains: ChainCatalogSeed[]) => Promise<ExternalMetricsConnectorResult>;
};
