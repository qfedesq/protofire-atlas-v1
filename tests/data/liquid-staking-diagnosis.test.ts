import { describe, expect, it } from "vitest";

import { chainCatalogSeeds } from "@/data/seed/catalog";
import { liquidStakingDiagnosisSeeds } from "@/data/seed/liquid-staking-diagnosis";
import { defaultLiquidStakingDiagnosticWeights } from "@/lib/config/liquid-staking-diagnosis";

describe("liquid staking diagnosis seeds", () => {
  it("covers every seeded chain in the top-30 EVM dataset", () => {
    expect(Object.keys(liquidStakingDiagnosisSeeds).sort()).toEqual(
      chainCatalogSeeds.map((chain) => chain.slug).sort(),
    );
  });

  it("keeps scores inside a 0-100 range", () => {
    Object.values(liquidStakingDiagnosisSeeds).forEach((seed) => {
      Object.values(seed.scores).forEach((score) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  it("keeps default diagnostic weights coherent", () => {
    expect(
      Object.values(defaultLiquidStakingDiagnosticWeights).reduce(
        (total, weight) => total + weight,
        0,
      ),
    ).toBe(100);
  });
});
