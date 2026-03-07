import { describe, expect, it } from "vitest";

import { getEconomyTypeBySlug } from "@/lib/config/economies";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import {
  buildChainModuleStatuses,
  buildReadinessScore,
  getStatusFactor,
  getWeightedContribution,
} from "@/lib/scoring/readiness-score";
import type { Chain } from "@/lib/domain/types";

describe("readiness scoring", () => {
  it("maps statuses to deterministic factors", () => {
    expect(getStatusFactor("missing")).toBe(0);
    expect(getStatusFactor("partial")).toBe(0.5);
    expect(getStatusFactor("available")).toBe(1);
  });

  it("computes weighted contribution from module weight and status", () => {
    expect(getWeightedContribution(25, "missing")).toBe(0);
    expect(getWeightedContribution(25, "partial")).toBe(1.25);
    expect(getWeightedContribution(25, "available")).toBe(2.5);
  });

  it("computes total score from an economy-specific module breakdown", () => {
    const chain: Chain = {
      id: "chain-test",
      slug: "test-chain",
      name: "Test Chain",
      sourceName: "Test Chain",
      sourceRank: 1,
      sourceCategory: "EVM",
      sourceMetric: "TVL",
      sourceProvider: "DeFiLlama",
      sourceSnapshotDate: "2026-03-07",
      sourceTvlUsd: 100,
      category: "L2",
      shortDescription: "Used for deterministic scoring tests.",
      status: "active",
    };
    const economy = getEconomyTypeBySlug("defi-infrastructure");

    const moduleStatuses = buildChainModuleStatuses(chain, economy, {
      lending: {
        status: "available",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Lending is ready.",
      },
      liquidity: {
        status: "partial",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Liquidity needs refinement.",
      },
      oracles: {
        status: "available",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Oracle support is ready.",
      },
      indexing: {
        status: "missing",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Indexing is absent.",
      },
      "liquid-staking": {
        status: "partial",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Liquid staking needs standardization.",
      },
    });

    const readinessScore = buildReadinessScore(
      chain.id,
      economy,
      moduleStatuses,
    );

    expect(readinessScore.totalScore).toBe(6.5);
    expect(readinessScore.moduleBreakdown).toHaveLength(5);
  });

  it("uses total score descending with chain-name tie breaking for AI rankings", () => {
    const repository = createSeedChainsRepository();
    const rankedChains = repository.listRankedChains({ economy: "ai-agents" });
    const rowsWithSevenPointFive = rankedChains
      .filter((row) => row.readinessScore.totalScore === 7.5)
      .map((row) => row.chain.name);

    expect(rankedChains[0]?.chain.name).toBe("Arbitrum");
    expect(rankedChains).toHaveLength(30);
    expect(rowsWithSevenPointFive).toEqual(["Base", "Optimism"]);
  });

  it("applies calibrated DeFi weights to representative top chains", () => {
    const repository = createSeedChainsRepository();
    const rankedChains = repository.listRankedChains({
      economy: "defi-infrastructure",
    });
    const ethereum = rankedChains.find((row) => row.chain.slug === "ethereum");
    const arbitrum = rankedChains.find((row) => row.chain.slug === "arbitrum");
    const optimism = rankedChains.find((row) => row.chain.slug === "optimism");

    expect(ethereum?.readinessScore.totalScore).toBe(10);
    expect(arbitrum?.readinessScore.totalScore).toBeCloseTo(8.75);
    expect(optimism?.readinessScore.totalScore).toBeCloseTo(7.75);
    expect(arbitrum?.benchmarkRank).toBe(2);
    expect(optimism?.benchmarkRank).toBe(3);
  });
});
