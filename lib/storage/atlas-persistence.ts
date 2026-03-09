import { initializeChainAnalysisSystem } from "@/lib/analysis/service";
import { initializeManualDataOverridesStore } from "@/lib/admin/manual-data";
import { initializeActiveAssumptionsStore } from "@/lib/assumptions/store";
import { initializeExternalMetricsSnapshotStore } from "@/lib/external-data/store";
import { initializeIntentEventsStore } from "@/lib/intent/store";
import { initializeBuyerPersonaStore } from "@/lib/personas/store";
import { initializeProposalDocumentsStore } from "@/lib/proposals/store";
import { initializeRequestsStores } from "@/lib/requests/store";

let initialized = false;
let initializationPromise: Promise<void> | null = null;

export async function ensureAtlasPersistence() {
  if (initialized) {
    return;
  }

  if (!initializationPromise) {
    initializationPromise = (async () => {
      await initializeActiveAssumptionsStore();
      await initializeManualDataOverridesStore();
      await initializeExternalMetricsSnapshotStore();
      await initializeChainAnalysisSystem();
      await initializeBuyerPersonaStore();
      await initializeProposalDocumentsStore();
      await initializeRequestsStores();
      await initializeIntentEventsStore();
      initialized = true;
    })().finally(() => {
      initializationPromise = null;
    });
  }

  await initializationPromise;
}
