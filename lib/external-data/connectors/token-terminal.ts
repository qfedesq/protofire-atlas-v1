import {
  tokenTerminalApiKey,
  tokenTerminalChainMetricsUrl,
} from "@/lib/external-data/config";
import { extractRowsFromPayload, normalizeConnectorRows } from "@/lib/external-data/utils";

import type { ExternalMetricsConnector } from "./types";

const tokenTerminalMetricAliases = {
  ecosystemProjects: ["ecosystem_projects", "projects", "protocols"],
  protocols: ["protocols", "protocol_count"],
  wallets: ["wallets", "active_wallets"],
  activeUsers: ["active_users", "daily_active_users"],
  transactions: ["transactions", "tx_count"],
} as const;

export const tokenTerminalConnector: ExternalMetricsConnector = {
  id: "token-terminal",
  async run(chains) {
    if (!tokenTerminalChainMetricsUrl) {
      return {
        rows: [],
        status: {
          connector: "Token Terminal",
          status: "skipped",
          message: "Skipped because TOKEN_TERMINAL_CHAIN_METRICS_URL is not set.",
        },
      };
    }

    try {
      const response = await fetch(tokenTerminalChainMetricsUrl, {
        headers: {
          Accept: "application/json",
          ...(tokenTerminalApiKey
            ? { Authorization: `Bearer ${tokenTerminalApiKey}` }
            : {}),
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Token Terminal request failed (${response.status}).`);
      }

      const fetchedAt = new Date().toISOString();
      const payload = await response.json();
      const rows = normalizeConnectorRows({
        rows: extractRowsFromPayload(payload),
        chains,
        sourceName: "Token Terminal",
        sourceEndpoint: tokenTerminalChainMetricsUrl,
        fetchedAt,
        normalizationNote:
          "Mapped Token Terminal rows onto the Atlas chain universe using chain slug, name, and source-name aliases.",
        metricAliases: tokenTerminalMetricAliases,
      });

      return {
        rows,
        status: {
          connector: "Token Terminal",
          status: "success",
          message: `Updated ${rows.length} chain snapshots from Token Terminal.`,
        },
      };
    } catch (error) {
      return {
        rows: [],
        status: {
          connector: "Token Terminal",
          status: "failed",
          message:
            error instanceof Error
              ? error.message
              : "Unknown Token Terminal failure.",
        },
      };
    }
  },
};
