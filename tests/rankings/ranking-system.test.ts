import { describe, expect, it } from "vitest";

import {
  createEconomyRankingColumns,
  createGlobalRankingColumns,
  createOpportunityRankingColumns,
} from "@/components/tables/ranking-column-definitions";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import {
  getDefaultVisibleColumnIds,
  resolveVisibleColumnIds,
  toggleColumnBranchVisibility,
} from "@/lib/rankings/table";

describe("ranking system", () => {
  it("keeps only summary global columns visible by default and a minimal opportunity view", () => {
    const globalColumns = createGlobalRankingColumns();
    const globalDefaults = getDefaultVisibleColumnIds(globalColumns);
    const opportunityDefaults = getDefaultVisibleColumnIds(
      createOpportunityRankingColumns(),
    );

    expect(globalDefaults).toEqual([
      "chain",
      "totalScore",
      "economyCompositeScore",
      "ai-agents-readiness",
      "defi-infrastructure-readiness",
      "rwa-infrastructure-readiness",
      "prediction-markets-readiness",
      "ecosystemScore",
      "adoptionScore",
      "performanceScore",
    ]);
    expect(globalDefaults).toContain("ai-agents-readiness");
    expect(globalDefaults).not.toContain("defi-infrastructure:liquid-staking");
    expect(globalDefaults).not.toContain("rwa-infrastructure:asset-registry");
    expect(globalDefaults).not.toContain("prediction-markets:oracles");
    expect(globalDefaults).not.toContain("wallets");
    expect(globalDefaults).not.toContain("activeUsers");
    expect(globalDefaults).not.toContain("protocols");
    expect(globalDefaults).not.toContain("ecosystemProjects");
    expect(globalDefaults).not.toContain("averageTransactionSpeed");
    expect(globalDefaults).not.toContain("blockTime");
    expect(globalDefaults).not.toContain("throughputIndicator");
    expect(opportunityDefaults).toEqual([
      "chain",
      "opportunityScore",
      "economy",
      "priority",
      "readinessGap",
      "recommendedStack",
    ]);
  });

  it("inserts child columns immediately after each global master branch", () => {
    const columns = createGlobalRankingColumns();
    const defaults = getDefaultVisibleColumnIds(columns);

    const withAiModules = toggleColumnBranchVisibility(
      defaults,
      "ai-agents-readiness",
      columns,
    );

    expect(withAiModules).toEqual([
      "chain",
      "totalScore",
      "economyCompositeScore",
      "ai-agents-readiness",
      "ai-agents:registry",
      "ai-agents:payments",
      "ai-agents:indexing",
      "ai-agents:security",
      "defi-infrastructure-readiness",
      "rwa-infrastructure-readiness",
      "prediction-markets-readiness",
      "ecosystemScore",
      "adoptionScore",
      "performanceScore",
    ]);

    const withPerformanceMetrics = toggleColumnBranchVisibility(
      defaults,
      "performanceScore",
      columns,
    );

    expect(withPerformanceMetrics.slice(-4)).toEqual([
      "performanceScore",
      "averageTransactionSpeed",
      "blockTime",
      "throughputIndicator",
    ]);
  });

  it("preserves the sticky chain column even when requested columns change", () => {
    const repository = createSeedChainsRepository();
    const economy = repository.listEconomies().find((item) => item.slug === "ai-agents");

    if (!economy) {
      throw new Error("Expected seeded AI economy config");
    }

    const columns = createEconomyRankingColumns(economy);
    const visibleColumns = resolveVisibleColumnIds(["payments"], columns);

    expect(visibleColumns[0]).toBe("chain");
    expect(visibleColumns).toContain("payments");
    expect(visibleColumns).not.toContain("registry");
  });
});
