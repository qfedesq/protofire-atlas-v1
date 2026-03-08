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
} from "@/lib/rankings/table";

describe("ranking system", () => {
  it("keeps all global columns visible by default and a minimal opportunity view", () => {
    const globalColumns = createGlobalRankingColumns();
    const globalDefaults = getDefaultVisibleColumnIds(globalColumns);
    const opportunityDefaults = getDefaultVisibleColumnIds(
      createOpportunityRankingColumns(),
    );

    expect(globalDefaults).toEqual(globalColumns.map((column) => column.id));
    expect(globalDefaults).toContain("ai-agents-readiness");
    expect(globalDefaults).toContain("defi-infrastructure:liquid-staking");
    expect(globalDefaults).toContain("rwa-infrastructure:asset-registry");
    expect(globalDefaults).toContain("prediction-markets:oracles");
    expect(opportunityDefaults).toEqual([
      "chain",
      "opportunityScore",
      "economy",
      "priority",
      "readinessGap",
      "recommendedStack",
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
