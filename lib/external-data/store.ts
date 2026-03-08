import { parseExternalMetricsSnapshot } from "@/lib/domain/schemas";
import type { ExternalMetricsSnapshot } from "@/lib/domain/types";
import { createPersistentJsonStore } from "@/lib/storage/persistent-json-store";

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
  return externalMetricsSnapshotStore.getSnapshot();
}

export async function saveExternalMetricsSnapshot(
  snapshot: ExternalMetricsSnapshot,
): Promise<ExternalMetricsSnapshot> {
  return externalMetricsSnapshotStore.save(snapshot);
}
