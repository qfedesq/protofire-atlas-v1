import { parseExternalMetricsSnapshot } from "@/lib/domain/schemas";
import type { ExternalMetricsSnapshot } from "@/lib/domain/types";
import { createPersistentJsonStore } from "@/lib/storage/persistent-json-store";
import { readJsonFile } from "@/lib/storage/json-file";

import { buildFallbackExternalMetricsSnapshot } from "./baseline";
import { externalMetricsSnapshotPath } from "./config";

const externalMetricsSnapshotStore =
  createPersistentJsonStore<ExternalMetricsSnapshot>({
    key: "external-metrics-snapshot",
    getFilePath: () => externalMetricsSnapshotPath,
    fallback: buildFallbackExternalMetricsSnapshot,
    validate: parseExternalMetricsSnapshot,
  });

export async function initializeExternalMetricsSnapshotStore() {
  return externalMetricsSnapshotStore.initialize();
}

export function getExternalMetricsSnapshot(): ExternalMetricsSnapshot {
  try {
    return externalMetricsSnapshotStore.getSnapshot();
  } catch {
    return parseExternalMetricsSnapshot(
      readJsonFile(
        externalMetricsSnapshotPath,
        buildFallbackExternalMetricsSnapshot(),
      ),
    );
  }
}

export async function saveExternalMetricsSnapshot(
  snapshot: ExternalMetricsSnapshot,
): Promise<ExternalMetricsSnapshot> {
  return externalMetricsSnapshotStore.save(snapshot);
}
