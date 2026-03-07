import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { buildDefaultAssumptionsSnapshot } from "@/lib/assumptions/defaults";
import { updateEconomyAssumptions, updateStatusScores } from "@/lib/assumptions/service";
import { getActiveAssumptions } from "@/lib/assumptions/store";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { writeJsonFile } from "@/lib/storage/json-file";

const originalAssumptionsFile = process.env.ATLAS_ASSUMPTIONS_FILE;

afterEach(() => {
  process.env.ATLAS_ASSUMPTIONS_FILE = originalAssumptionsFile;
});

function useTempAssumptionsFile() {
  const tempDirectory = mkdtempSync(join(tmpdir(), "atlas-assumptions-"));
  const assumptionsFile = join(tempDirectory, "active-assumptions.json");
  writeJsonFile(assumptionsFile, buildDefaultAssumptionsSnapshot());
  process.env.ATLAS_ASSUMPTIONS_FILE = assumptionsFile;
}

describe("active assumptions", () => {
  it("persists updated weights and status mappings", () => {
    useTempAssumptionsFile();

    updateStatusScores(
      {
        missing: 0,
        partial: 0.4,
        available: 1,
      },
      "test",
    );

    updateEconomyAssumptions(
      "ai-agents",
      {
        registry: 30,
        payments: 25,
        indexing: 20,
        security: 25,
      },
      {
        thresholdScore: 0.4,
        includePartialRecommendations: true,
        includeMissingRecommendations: true,
      },
      "test",
    );

    const active = getActiveAssumptions();
    const repository = createSeedChainsRepository();
    const economy = repository.listEconomies().find((item) => item.slug === "ai-agents");

    if (!economy) {
      throw new Error("Expected active AI economy");
    }

    expect(active.statusScores.partial).toBe(0.4);
    expect(active.economies["ai-agents"].moduleWeights.registry).toBe(30);
    expect(active.updatedBy).toBe("test");
    expect(economy.modules.find((module) => module.slug === "registry")?.weight).toBe(
      30,
    );
  });

  it("changes recommendation behavior when partial modules are disabled", () => {
    useTempAssumptionsFile();

    updateEconomyAssumptions(
      "ai-agents",
      {
        registry: 25,
        payments: 25,
        indexing: 25,
        security: 25,
      },
      {
        thresholdScore: 0,
        includePartialRecommendations: false,
        includeMissingRecommendations: true,
      },
      "test",
    );

    const repository = createSeedChainsRepository();
    const profile = repository.getChainProfileBySlug("base", "ai-agents");

    if (!profile) {
      throw new Error("Expected seeded profile");
    }

    expect(
      profile.recommendedStack.recommendedModules.every(
        (module) => module.module.slug !== "indexing",
      ),
    ).toBe(true);
  });
});
