import { join } from "node:path";

import { buildDefaultAssumptionsSnapshot } from "@/lib/assumptions/defaults";
import { validateActiveAssumptions } from "@/lib/assumptions/schemas";
import type { ActiveAssumptions } from "@/lib/assumptions/types";
import { readJsonFile, writeJsonFile } from "@/lib/storage/json-file";

function getActiveAssumptionsFilePath() {
  return (
    process.env.ATLAS_ASSUMPTIONS_FILE ??
    join(process.cwd(), "data", "admin", "active-assumptions.json")
  );
}

export function getActiveAssumptions(): ActiveAssumptions {
  return validateActiveAssumptions(
    readJsonFile(getActiveAssumptionsFilePath(), buildDefaultAssumptionsSnapshot()),
  );
}

export function saveActiveAssumptions(
  nextAssumptions: ActiveAssumptions,
) {
  const validated = validateActiveAssumptions(nextAssumptions);
  writeJsonFile(getActiveAssumptionsFilePath(), validated);

  return validated;
}
