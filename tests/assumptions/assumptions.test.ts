import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { buildDefaultAssumptionsSnapshot } from "@/lib/assumptions/defaults";
import {
  updateEconomyAssumptions,
  updateGlobalRankingAssumptions,
  updateOpportunityScoringAssumptions,
  updateStatusScores,
} from "@/lib/assumptions/service";
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
      undefined,
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
      undefined,
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

  it("persists liquid staking diagnosis weights for DeFi admin assumptions", () => {
    useTempAssumptionsFile();

    updateEconomyAssumptions(
      "defi-infrastructure",
      {
        "liquid-staking": 25,
        lending: 20,
        liquidity: 25,
        oracles: 20,
        indexing: 10,
      },
      {
        thresholdScore: 0.5,
        includePartialRecommendations: true,
        includeMissingRecommendations: true,
      },
      {
        "liquid-staking": {
          "liquidity-exit": 25,
          "peg-stability": 15,
          "defi-moneyness": 15,
          "security-governance": 15,
          "validator-decentralization": 10,
          "incentive-sustainability": 10,
          "stress-resilience": 10,
        },
      },
      "test",
    );

    const active = getActiveAssumptions();
    const repository = createSeedChainsRepository();
    const profile = repository.getChainProfileBySlug("base", "defi-infrastructure");

    if (!profile?.liquidStakingDiagnosis) {
      throw new Error("Expected DeFi liquid staking diagnosis for base");
    }

    expect(
      active.economies["defi-infrastructure"].moduleDiagnosticWeights?.[
        "liquid-staking"
      ]?.["liquidity-exit"],
    ).toBe(25);
    expect(profile.liquidStakingDiagnosis.dimensions[0]?.weight).toBe(25);
  });

  it("persists global ranking and opportunity weights", () => {
    useTempAssumptionsFile();

    updateGlobalRankingAssumptions(
      {
        economyScore: 40,
        ecosystem: 25,
        adoption: 20,
        performance: 15,
      },
      {
        "ai-agents": 20,
        "defi-infrastructure": 40,
        "rwa-infrastructure": 20,
        "prediction-markets": 20,
      },
      "test",
    );
    updateOpportunityScoringAssumptions(
      {
        tvlTier: 25,
        readinessGap: 35,
        stackFit: 25,
        ecosystemSignal: 15,
      },
      "test",
    );

    const active = getActiveAssumptions();
    const repository = createSeedChainsRepository();
    const globalRows = repository.listGlobalRankedChains();
    const targetRows = repository.listTargetAccounts();

    expect(active.globalRanking.componentWeights.economyScore).toBe(40);
    expect(
      active.globalRanking.economyCompositeWeights["defi-infrastructure"],
    ).toBe(40);
    expect(active.opportunityScoring.weights.readinessGap).toBe(35);
    expect(globalRows[0]?.score.totalScore).toBeGreaterThan(0);
    expect(targetRows[0]?.opportunity.totalScore).toBeGreaterThan(0);
  });

  it("rejects invalid global ranking weights", () => {
    useTempAssumptionsFile();

    expect(() =>
      updateGlobalRankingAssumptions(
        {
          economyScore: 50,
          ecosystem: 20,
          adoption: 20,
          performance: 20,
        },
        {
          "ai-agents": 25,
          "defi-infrastructure": 25,
          "rwa-infrastructure": 25,
          "prediction-markets": 25,
        },
        "test",
      ),
    ).toThrow(/Global ranking weights must sum to 100/);
  });
});
