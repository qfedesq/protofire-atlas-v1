import { getRuntimeManagedFilePath } from "@/lib/storage/runtime-path";

export const externalMetricsSnapshotPath =
  getRuntimeManagedFilePath(
    "ATLAS_EXTERNAL_METRICS_FILE",
    "data/source/external-chain-metrics.snapshot.json",
  );

export const externalMetricsSourceNote =
  "Atlas uses source-backed external metrics where a connector returns valid data and preserves the last valid snapshot or Atlas baseline fallback when a source is unavailable.";

export const duneChainMetricsQueryId =
  process.env.DUNE_CHAIN_METRICS_QUERY_ID?.trim() ?? "";
export const duneApiKey = process.env.DUNE_API_KEY?.trim() ?? "";

export const artemisChainMetricsUrl =
  process.env.ARTEMIS_CHAIN_METRICS_URL?.trim() ?? "";
export const artemisApiKey = process.env.ARTEMIS_API_KEY?.trim() ?? "";

export const tokenTerminalChainMetricsUrl =
  process.env.TOKEN_TERMINAL_CHAIN_METRICS_URL?.trim() ?? "";
export const tokenTerminalApiKey =
  process.env.TOKEN_TERMINAL_API_KEY?.trim() ?? "";
