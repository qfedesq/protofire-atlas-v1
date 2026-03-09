import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";
import { syncAllDataSources } from "@/lib/data-sync/syncAll";

export async function runAtlasSyncNow() {
  await ensureAtlasPersistence();
  const { snapshot, syncResults } = await syncAllDataSources();

  return {
    completedAt: snapshot.updatedAt,
    connectors: snapshot.connectors,
    syncResults,
  };
}
