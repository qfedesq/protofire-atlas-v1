import { readJsonFile, writeJsonFile } from "@/lib/storage/json-file";
import { parseExternalMetricsSnapshot } from "@/lib/domain/schemas";
import type { ExternalMetricsSnapshot } from "@/lib/domain/types";

import { buildFallbackExternalMetricsSnapshot } from "./baseline";
import { externalMetricsSnapshotPath } from "./config";

export function getExternalMetricsSnapshot(): ExternalMetricsSnapshot {
  return parseExternalMetricsSnapshot(
    readJsonFile(
      externalMetricsSnapshotPath,
      buildFallbackExternalMetricsSnapshot(),
    ),
  );
}

export function saveExternalMetricsSnapshot(
  snapshot: ExternalMetricsSnapshot,
): ExternalMetricsSnapshot {
  const validatedSnapshot = parseExternalMetricsSnapshot(snapshot);
  writeJsonFile(externalMetricsSnapshotPath, validatedSnapshot);

  return validatedSnapshot;
}
