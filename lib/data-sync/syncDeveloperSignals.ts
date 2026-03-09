import { syncWithL2Beat } from "@/lib/connectors/l2beat";

export async function syncDeveloperSignals() {
  return syncWithL2Beat();
}
