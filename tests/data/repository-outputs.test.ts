import { describe, expect, it } from "vitest";

import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

describe("seed repository outputs", () => {
  it("preserves benchmark rank even when the listing is sorted differently", () => {
    const repository = createSeedChainsRepository();
    const rows = repository.listRankedChains({
      economy: "ai-agents",
      sort: "name",
      direction: "asc",
    });
    const baseRow = rows.find((row) => row.chain.slug === "base");

    expect(baseRow?.benchmarkRank).toBe(3);
    expect(baseRow?.chain.sourceRank).toBe(3);
  });

  it("builds chain profiles from the same benchmark data per economy", () => {
    const repository = createSeedChainsRepository();
    const aiProfile = repository.getChainProfileBySlug("arbitrum", "ai-agents");
    const defiProfile = repository.getChainProfileBySlug(
      "arbitrum",
      "defi-infrastructure",
    );

    expect(aiProfile?.rank).toBe(1);
    expect(aiProfile?.leader).toBe("Arbitrum");
    expect(aiProfile?.leaderGap).toBe(0);
    expect(aiProfile?.chain.sourceRank).toBe(5);
    expect(aiProfile?.chain.roadmap.stageLabel).toBeTruthy();

    expect(defiProfile?.economy.slug).toBe("defi-infrastructure");
    expect(defiProfile?.readinessScore.moduleBreakdown).toHaveLength(5);
  });

  it("switches rankings when the economy changes", () => {
    const repository = createSeedChainsRepository();
    const aiRows = repository.listRankedChains({ economy: "ai-agents" });
    const rwaRows = repository.listRankedChains({ economy: "rwa-infrastructure" });

    expect(aiRows[0]?.economy.slug).toBe("ai-agents");
    expect(rwaRows[0]?.economy.slug).toBe("rwa-infrastructure");
    expect(aiRows).toHaveLength(30);
    expect(rwaRows).toHaveLength(30);
    expect(aiRows[0]?.chain.slug).not.toBeUndefined();
    expect(rwaRows[0]?.chain.slug).not.toBeUndefined();
  });
});
