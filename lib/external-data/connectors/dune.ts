import { duneApiKey, duneChainMetricsQueryId } from "@/lib/external-data/config";
import { extractRowsFromPayload, normalizeConnectorRows } from "@/lib/external-data/utils";

import type { ExternalMetricsConnector } from "./types";

const duneMetricAliases = {
  wallets: ["wallets", "wallet_count", "monthly_active_wallets", "mau"],
  activeUsers: ["active_users", "daily_active_users", "dau", "users"],
  transactions: ["transactions", "tx_count", "daily_transactions"],
  ecosystemProjects: ["ecosystem_projects", "projects"],
  averageTransactionSpeed: ["average_transaction_speed", "avg_transaction_speed"],
  blockTime: ["block_time", "avg_block_time"],
  throughputIndicator: ["throughput_indicator", "tps", "throughput"],
} as const;

export const duneConnector: ExternalMetricsConnector = {
  id: "dune",
  async run(chains) {
    if (!duneApiKey || !duneChainMetricsQueryId) {
      return {
        rows: [],
        status: {
          connector: "Dune",
          status: "skipped",
          message: "Skipped because DUNE_API_KEY or DUNE_CHAIN_METRICS_QUERY_ID is not set.",
        },
      };
    }

    const sourceEndpoint = `https://api.dune.com/api/v1/query/${duneChainMetricsQueryId}/results`;

    try {
      const response = await fetch(sourceEndpoint, {
        headers: {
          Accept: "application/json",
          "X-Dune-API-Key": duneApiKey,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Dune request failed (${response.status}).`);
      }

      const fetchedAt = new Date().toISOString();
      const payload = await response.json();
      const rows = normalizeConnectorRows({
        rows: extractRowsFromPayload(payload),
        chains,
        sourceName: "Dune",
        sourceEndpoint,
        fetchedAt,
        normalizationNote:
          "Mapped Dune query rows onto the Atlas chain universe using chain slug, name, and source-name aliases.",
        metricAliases: duneMetricAliases,
      });

      return {
        rows,
        status: {
          connector: "Dune",
          status: "success",
          message: `Updated ${rows.length} chain snapshots from Dune.`,
        },
      };
    } catch (error) {
      return {
        rows: [],
        status: {
          connector: "Dune",
          status: "failed",
          message: error instanceof Error ? error.message : "Unknown Dune failure.",
        },
      };
    }
  },
};
