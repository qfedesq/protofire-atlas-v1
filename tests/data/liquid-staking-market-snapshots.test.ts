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
    expect(getSnapshot("mantle").marketCapUsd).toBe(2_202_078_627);
    expect(getSnapshot("berachain").stakersCount).toBe(69);
    expect(getSnapshot("sonic").stakingApyPercent).toBe(6);
  });

  it("keeps partial coverage explicit where the source plan is still incomplete", () => {
    const bnb = getSnapshot("bnb-chain");
    const rootstock = getSnapshot("rootstock");

    expect(bnb.marketCapUsd).toBe(84_373_859_356);
    expect(bnb.lstProtocolCount).toBe(14);
    expect(bnb.percentStaked).toBe(19.3);
    expect(bnb.stakingApyPercent).toBe(7.11);
    expect(bnb.stakersCount).toBe(20_000);
    expect(
      bnb.sources.find((source) => source.metric === "percentStaked")?.status,
    ).toBe("captured");
    expect(
      rootstock.sources.find((source) => source.metric === "percentStaked")
        ?.status,
    ).toBe("not-applicable");
    expect(
      rootstock.sources.find((source) => source.metric === "stakersCount")
        ?.status,
    ).toBe("not-applicable");
  });
});
