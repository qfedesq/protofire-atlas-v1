import { describe, expect, it } from "vitest";

import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { buildChainTechnicalProfiles, buildWedgeApplicability } from "@/lib/applicability/engine";
import { getActiveWedgeApplicabilityAssumptions } from "@/lib/assumptions/resolve";
import type { ChainTechnicalProfile } from "@/lib/domain/types";

function buildSupportedProfile(chainId: string): ChainTechnicalProfile {
  return {
    chainId,
    architectureKind: "general-evm-l1",
    capabilities: {
      smartContracts: "supported",
      tokenStandards: "supported",
      paymentRails: "supported",
      oracleSupport: "supported",
      indexingSupport: "supported",
      settlementPrimitives: "supported",
      liquidityRails: "supported",
      nativeValidatorStaking: "supported",
    },
    dataConfidence: "high",
    sourceBasis: "Vitest fully supported profile.",
    assessedAt: "2026-03-08T00:00:00.000Z",
    notes: [],
  };
}

describe("wedge applicability engine", () => {
  it("marks a fully supported chain as applicable", () => {
    const repository = createSeedChainsRepository();
    const chain = repository.listChains()[0];
    const economy = repository.listEconomies()[0];
    const applicability = buildWedgeApplicability(
      chain,
      economy,
      buildSupportedProfile(chain.id),
    );

    expect(applicability.applicabilityStatus).toBe("applicable");
    expect(applicability.manualReviewRecommended).toBe(false);
    expect(applicability.technicalConstraints).toEqual([]);
  });

  it("returns unknown when a required capability is unknown under active rules", () => {
    const repository = createSeedChainsRepository();
    const chain = repository.listChains()[0];
    const economy = repository.listEconomies()[0];
    const assumptions = getActiveWedgeApplicabilityAssumptions();
    const requiredCapability = Object.entries(
      assumptions.wedgePrerequisites[economy.slug],
    ).find(([, requirement]) => requirement === "required")?.[0];

    if (!requiredCapability) {
      throw new Error("Expected at least one required capability.");
    }

    const profile = buildSupportedProfile(chain.id);
    profile.capabilities[requiredCapability as keyof typeof profile.capabilities] =
      "unknown";

    const applicability = buildWedgeApplicability(chain, economy, profile);

    expect(applicability.applicabilityStatus).toBe("unknown");
    expect(applicability.manualReviewRecommended).toBe(true);
    expect(applicability.requiredPrerequisites.length).toBeGreaterThan(0);
  });

  it("builds fallback technical profiles for chains without an explicit profile seed", () => {
    const repository = createSeedChainsRepository();
    const chain = repository.listChains()[0];
    const profiles = buildChainTechnicalProfiles([chain], []);
    const profile = profiles.get(chain.slug);

    expect(profile).toBeDefined();
    expect(profile?.chainId).toBe(chain.id);
    expect(profile?.sourceBasis).toMatch(/fallback technical profile/i);
  });
});
