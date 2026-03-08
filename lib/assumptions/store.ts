import { buildDefaultAssumptionsSnapshot } from "@/lib/assumptions/defaults";
import { validateActiveAssumptions } from "@/lib/assumptions/schemas";
import type { ActiveAssumptions } from "@/lib/assumptions/types";
import { createPersistentJsonStore } from "@/lib/storage/persistent-json-store";
import { getRuntimeManagedFilePath } from "@/lib/storage/runtime-path";

function getActiveAssumptionsFilePath() {
  return getRuntimeManagedFilePath(
    "ATLAS_ASSUMPTIONS_FILE",
    "data/admin/active-assumptions.json",
  );
}

const activeAssumptionsStore = createPersistentJsonStore<ActiveAssumptions>({
  key: "active-assumptions",
  getFilePath: getActiveAssumptionsFilePath,
  fallback: buildDefaultAssumptionsSnapshot(),
  validate: validateActiveAssumptions,
});

export async function initializeActiveAssumptionsStore() {
  return activeAssumptionsStore.initialize();
}

export function getActiveAssumptions(): ActiveAssumptions {
  return activeAssumptionsStore.getSnapshot();
}

export async function saveActiveAssumptions(
  nextAssumptions: ActiveAssumptions,
) {
  return activeAssumptionsStore.save(nextAssumptions);
}
