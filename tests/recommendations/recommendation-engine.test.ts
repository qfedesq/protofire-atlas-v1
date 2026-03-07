import { describe, expect, it } from "vitest";

import { getEconomyTypeBySlug } from "@/lib/config/economies";
import {
  buildDeploymentPlan,
  buildGapAnalysis,
  buildRecommendedStack,
} from "@/lib/recommendations/engine";
import {
  buildChainModuleStatuses,
  buildReadinessScore,
} from "@/lib/scoring/readiness-score";
import type { Chain } from "@/lib/domain/types";

describe("recommendation engine", () => {
  const chain: Chain = {
    id: "chain-recommendation-test",
    slug: "recommendation-test",
    name: "Recommendation Test",
    sourceName: "Recommendation Test",
    sourceRank: 1,
    sourceCategory: "EVM",
    sourceMetric: "TVL",
    sourceProvider: "DeFiLlama",
    sourceSnapshotDate: "2026-03-07",
    sourceTvlUsd: 100,
    category: "L2",
    shortDescription: "Used for recommendation tests.",
    status: "active",
  };

  it("builds AI-agent gap analysis from missing and partial modules", () => {
    const economy = getEconomyTypeBySlug("ai-agents");
    const moduleStatuses = buildChainModuleStatuses(chain, economy, {
      registry: {
        status: "missing",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Registry is missing.",
      },
      payments: {
        status: "partial",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Payments are only partially available.",
      },
      indexing: {
        status: "missing",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Indexing is missing.",
      },
      security: {
        status: "partial",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Security is partially available.",
      },
    });
    const readinessScore = buildReadinessScore(
      chain.id,
      economy,
      moduleStatuses,
    );
    const gaps = buildGapAnalysis(economy, readinessScore.moduleBreakdown);

    expect(gaps).toHaveLength(4);
    expect(gaps[0]?.problem).toContain("Registry is missing");
    expect(gaps[1]?.status).toBe("partial");
  });

  it("maps DeFi missing and partial modules to deterministic stack recommendations", () => {
    const economy = getEconomyTypeBySlug("defi-infrastructure");
    const moduleStatuses = buildChainModuleStatuses(chain, economy, {
      lending: {
        status: "missing",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Lending is missing.",
      },
      liquidity: {
        status: "partial",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Liquidity is only partially available.",
      },
      oracles: {
        status: "missing",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Oracle coverage is missing.",
      },
      indexing: {
        status: "partial",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Indexing is only partially available.",
      },
      "liquid-staking": {
        status: "missing",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Liquid staking is missing.",
      },
    });
    const readinessScore = buildReadinessScore(
      chain.id,
      economy,
      moduleStatuses,
    );
    const stack = buildRecommendedStack(chain, economy, readinessScore.moduleBreakdown);

    expect(stack.recommendedModules.map((item) => item.title)).toEqual([
      "Activate Lending Infrastructure Stack",
      "Activate Oracle Layer",
      "Upgrade DeFi Indexing Layer",
      "Upgrade Liquidity Infrastructure Stack",
      "Activate Liquid Staking Stack",
    ]);
    expect(stack.recommendedModules[0]?.expectedResult).toContain(
      "lending base layer",
    );
    expect(stack.recommendedModules[4]?.directChainImpact).toContain(
      "retain staked capital",
    );
  });

  it("groups active phases into deterministic deployment phases with two-week timelines", () => {
    const economy = getEconomyTypeBySlug("prediction-markets");
    const moduleStatuses = buildChainModuleStatuses(chain, economy, {
      oracles: {
        status: "partial",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Oracle coverage is partial.",
      },
      "market-contracts": {
        status: "missing",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Market contracts are missing.",
      },
      indexing: {
        status: "partial",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Indexing is partial.",
      },
      liquidity: {
        status: "missing",
        evidenceNote: "Seeded demo assessment.",
        rationale: "Liquidity is missing.",
      },
    });
    const readinessScore = buildReadinessScore(
      chain.id,
      economy,
      moduleStatuses,
    );
    const stack = buildRecommendedStack(chain, economy, readinessScore.moduleBreakdown);
    const plan = buildDeploymentPlan(chain, economy, stack);

    expect(stack.deploymentPhases.map((phase) => phase.title)).toEqual([
      "Foundation",
      "Resolution",
      "Liquidity",
    ]);
    expect(stack.deploymentPhases.map((phase) => phase.timelineLabel)).toEqual([
      "Weeks 1-2",
      "Weeks 3-4",
      "Weeks 5-6",
    ]);
    expect(plan.ctaText).toContain("Prediction Markets");
  });
});
