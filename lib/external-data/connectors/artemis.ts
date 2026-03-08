import { artemisApiKey, artemisChainMetricsUrl } from "@/lib/external-data/config";
import { extractRowsFromPayload, normalizeConnectorRows } from "@/lib/external-data/utils";

import type { ExternalMetricsConnector } from "./types";

const artemisMetricAliases = {
  wallets: ["wallets", "active_wallets", "monthly_active_wallets"],
  activeUsers: ["active_users", "daily_active_users", "users"],
  transactions: ["transactions", "tx_count", "daily_transactions"],
  throughputIndicator: ["throughput_indicator", "tps"],
  blockTime: ["block_time"],
} as const;

export const artemisConnector: ExternalMetricsConnector = {
  id: "artemis",
  async run(chains) {
    if (!artemisChainMetricsUrl) {
      return {
        rows: [],
        status: {
          connector: "Artemis",
          status: "skipped",
          message: "Skipped because ARTEMIS_CHAIN_METRICS_URL is not set.",
        },
      };
    }

    try {
      const response = await fetch(artemisChainMetricsUrl, {
        headers: {
          Accept: "application/json",
          ...(artemisApiKey ? { Authorization: `Bearer ${artemisApiKey}` } : {}),
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Artemis request failed (${response.status}).`);
      }

      const fetchedAt = new Date().toISOString();
      const payload = await response.json();
      const rows = normalizeConnectorRows({
        rows: extractRowsFromPayload(payload),
        chains,
        sourceName: "Artemis",
        sourceEndpoint: artemisChainMetricsUrl,
        fetchedAt,
        normalizationNote:
          "Mapped Artemis ecosystem activity rows onto the Atlas chain universe using chain slug, name, and source-name aliases.",
        metricAliases: artemisMetricAliases,
      });

      return {
        rows,
        status: {
          connector: "Artemis",
          status: "success",
          message: `Updated ${rows.length} chain snapshots from Artemis.`,
        },
      };
    } catch (error) {
      return {
        rows: [],
        status: {
          connector: "Artemis",
          status: "failed",
          message:
            error instanceof Error ? error.message : "Unknown Artemis failure.",
        },
      };
    }
  },
};
