import { mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { chainEconomySeedRecords } from "@/data/seed/economies";
import {
  resetManualDatasetOverride,
  saveManualDatasetOverride,
} from "@/lib/admin/manual-data";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

const originalManualDataFile = process.env.ATLAS_MANUAL_DATA_FILE;

describe("manual Atlas datasets", () => {
  beforeEach(() => {
    process.env.ATLAS_MANUAL_DATA_FILE = join(
      mkdtempSync(join(tmpdir(), "atlas-manual-data-")),
      "manual-overrides.json",
    );
  });

  afterEach(() => {
    if (originalManualDataFile) {
      process.env.ATLAS_MANUAL_DATA_FILE = originalManualDataFile;
      return;
    }

    delete process.env.ATLAS_MANUAL_DATA_FILE;
  });

  it("lets admin override readiness records and changes the repository output", async () => {
    const repository = createSeedChainsRepository();
    const originalProfile = repository.getChainProfileBySlug("base", "ai-agents");

    if (!originalProfile) {
      throw new Error("Expected seeded base AI Agents profile.");
    }

    const downgradedRecords = chainEconomySeedRecords.map((record) => {
      if (record.chainSlug !== "base" || record.economyType !== "ai-agents") {
        return record;
      }

      return {
        ...record,
        moduleStatuses: Object.fromEntries(
          Object.entries(record.moduleStatuses).map(([moduleSlug, status]) => [
            moduleSlug,
            {
              ...status,
              status: "missing" as const,
              rationale: `Manual override for ${moduleSlug}.`,
              evidenceNote: `Manual override for ${moduleSlug}.`,
            },
          ]),
        ),
      };
    });

    await saveManualDatasetOverride(
      "readinessRecords",
      downgradedRecords,
      "vitest",
    );

    const overriddenRepository = createSeedChainsRepository();
    const overriddenProfile = overriddenRepository.getChainProfileBySlug(
      "base",
      "ai-agents",
    );

    if (!overriddenProfile) {
      throw new Error("Expected overridden base AI Agents profile.");
    }

    expect(overriddenProfile.readinessScore.totalScore).toBe(0);
    expect(overriddenProfile.readinessScore.totalScore).toBeLessThan(
      originalProfile.readinessScore.totalScore,
    );

    await resetManualDatasetOverride("readinessRecords");

    const resetRepository = createSeedChainsRepository();
    const resetProfile = resetRepository.getChainProfileBySlug(
      "base",
      "ai-agents",
    );

    if (!resetProfile) {
      throw new Error("Expected reset base AI Agents profile.");
    }

    expect(resetProfile.readinessScore.totalScore).toBe(
      originalProfile.readinessScore.totalScore,
    );
  });
});
