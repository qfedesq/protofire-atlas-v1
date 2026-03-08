import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";
import { syncExternalMetricsSnapshot } from "@/lib/external-data/service";

export async function runAtlasSyncNow() {
  await ensureAtlasPersistence();
  const snapshot = await syncExternalMetricsSnapshot();

  return {
    completedAt: snapshot.updatedAt,
    connectors: snapshot.connectors,
  };
}
