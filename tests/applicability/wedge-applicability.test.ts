import { describe, expect, it } from "vitest";

import { buildWedgeApplicability } from "@/lib/applicability/engine";
import { buildChainCapabilityProfiles } from "@/lib/capabilities/profiles";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import type { ChainCapabilityProfile } from "@/lib/domain/types";

function buildSupportedCapabilityProfile(
  profile: ChainCapabilityProfile,
): ChainCapabilityProfile {
  return {
    ...profile,
    smartContractSupport: "supported",
    tokenStandardSupport: "supported",
    oracleSupport: "supported",
    indexingInfrastructure: "supported",
    eventDrivenArchitecture: "supported",
    crossChainSupport: "supported",
    stakingSupport: "supported",
    liquidStakingSupport: "supported",
    lendingProtocolFeasibility: "supported",
    liquidityProtocolFeasibility: "supported",
    paymentRailsSupport: "supported",
    confidenceLevel: "high",
  };
}

describe("wedge applicability engine", () => {
  it("marks a fully supported chain capability profile as applicable", () => {
    const repository = createSeedChainsRepository();
    const chain = repository.listChains()[0];
    const economy = repository.listEconomies()[0];
    const seededProfile = repository.getChainProfileBySlug(chain.slug)?.capabilityProfile;

    if (!seededProfile) {
      throw new Error("Expected seeded capability profile.");
    }

    const applicability = buildWedgeApplicability(
      chain,
      economy,
      buildSupportedCapabilityProfile(seededProfile),
    );

    expect(applicability.applicabilityStatus).toBe("applicable");
    expect(applicability.manualReviewRecommended).toBe(false);
    expect(applicability.technicalConstraints).toEqual([]);
  });

  it("returns unknown when a required capability is unknown under active rules", () => {
    const repository = createSeedChainsRepository();
    const chain = repository.listChains()[0];
    const economy = repository.listEconomies()[0];
    const seededProfile = repository.getChainProfileBySlug(chain.slug)?.capabilityProfile;

    if (!seededProfile) {
      throw new Error("Expected seeded capability profile.");
    }

    const applicability = buildWedgeApplicability(chain, economy, {
      ...buildSupportedCapabilityProfile(seededProfile),
      smartContractSupport: "unknown",
    });

    expect(applicability.applicabilityStatus).toBe("unknown");
    expect(applicability.manualReviewRecommended).toBe(true);
    expect(applicability.requiredPrerequisites.length).toBeGreaterThan(0);
  });

  it("builds fallback capability profiles for chains without an explicit capability seed", () => {
    const repository = createSeedChainsRepository();
    const chain = repository.listChains()[0];
    const profiles = buildChainCapabilityProfiles([chain], []);
    const profile = profiles.get(chain.slug);

    expect(profile).toBeDefined();
    expect(profile?.chainId).toBe(chain.id);
    expect(profile?.notes[0]).toMatch(/fallback capability profile/i);
  });
});
