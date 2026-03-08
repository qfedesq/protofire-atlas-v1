import { describe, expect, it } from "vitest";

import { liquidStakingMarketSnapshotSeeds } from "@/data/seed/liquid-staking-market-snapshots";

function getSnapshot(chainSlug: string) {
  const snapshot = liquidStakingMarketSnapshotSeeds.find(
    (item) => item.chainSlug === chainSlug,
  );

  if (!snapshot) {
    throw new Error(`Expected snapshot for ${chainSlug}`);
  }

  return snapshot;
}

describe("liquid staking market snapshots", () => {
  it("captures verified values for the initial high-priority networks", () => {
    expect(getSnapshot("ethereum").percentStaked).toBe(30.99);
    expect(getSnapshot("base").lstProtocolCount).toBe(5);
    expect(getSnapshot("arbitrum").lstProtocolCount).toBe(6);
    expect(getSnapshot("avalanche").stakingApyPercent).toBe(6.97);
    expect(getSnapshot("polygon").marketCapUsd).toBe(1_006_333_693);
  });

  it("keeps partial coverage explicit where the source plan is still incomplete", () => {
    const bnb = getSnapshot("bnb-chain");

    expect(bnb.marketCapUsd).toBe(84_551_751_572);
    expect(bnb.lstProtocolCount).toBe(14);
    expect(bnb.percentStaked).toBeNull();
    expect(
      bnb.sources.find((source) => source.metric === "percentStaked")?.status,
    ).toBe("pending");
  });
});
