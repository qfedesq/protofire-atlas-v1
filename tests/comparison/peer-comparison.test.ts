import { describe, expect, it } from "vitest";

import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

describe("peer comparison", () => {
  it("builds nearby peers and score drivers for a mid-ranked chain", () => {
    const repository = createSeedChainsRepository();
    const rankedRows = repository.listRankedChains({
      economy: "defi-infrastructure",
    });
    const middleRow = rankedRows[10];

    if (!middleRow) {
      throw new Error("Expected a middle ranked row in the seeded dataset");
    }

    const profile = repository.getChainProfileBySlug(
      middleRow.chain.slug,
      "defi-infrastructure",
    );

    if (!profile) {
      throw new Error("Expected seeded profile");
    }

    expect(profile.peers).toHaveLength(3);
    expect(profile.peers.some((peer) => peer.relativePosition === "above")).toBe(
      true,
    );
    expect(profile.peers.some((peer) => peer.relativePosition === "below")).toBe(
      true,
    );
    expect(profile.scoreDrivers.length).toBeGreaterThan(0);
    expect(profile.scoreDrivers[0]!.potentialGain).toBeGreaterThanOrEqual(
      profile.scoreDrivers.at(-1)!.potentialGain,
    );
  });
});
