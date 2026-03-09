import type {
  CapabilitySupportLevel,
  Chain,
  ChainCapabilityProfile,
  ChainCapabilityProfileSeed,
  ChainTechnicalCapabilities,
  ChainTechnicalProfile,
} from "@/lib/domain/types";

function deriveSettlementPrimitives(
  profile: Pick<
    ChainCapabilityProfile,
    "smartContractSupport" | "tokenStandardSupport" | "paymentRailsSupport"
  >,
): CapabilitySupportLevel {
  if (
    profile.smartContractSupport === "unsupported" ||
    profile.tokenStandardSupport === "unsupported"
  ) {
    return "unsupported";
  }

  if (
    profile.smartContractSupport === "limited" ||
    profile.tokenStandardSupport === "limited" ||
    profile.paymentRailsSupport === "limited"
  ) {
    return "limited";
  }

  if (
    profile.smartContractSupport === "unknown" ||
    profile.tokenStandardSupport === "unknown" ||
    profile.paymentRailsSupport === "unknown"
  ) {
    return "unknown";
  }

  return "supported";
}

function buildFallbackCapabilityProfile(chain: Chain): ChainCapabilityProfile {
  return {
    chainId: chain.id,
    chainSlug: chain.slug,
    isEvm: true,
    smartContractSupport: "supported",
    tokenStandardSupport: "supported",
    oracleSupport: "supported",
    indexingInfrastructure: "supported",
    eventDrivenArchitecture: "supported",
    crossChainSupport: chain.category === "L2" ? "supported" : "limited",
    validatorModel: chain.category === "L2" ? "rollup-sequencer" : "native-pos",
    stakingSupport: chain.category === "L2" ? "unsupported" : "supported",
    liquidStakingSupport: chain.category === "L2" ? "unsupported" : "supported",
    lendingProtocolFeasibility: "supported",
    liquidityProtocolFeasibility: "supported",
    paymentRailsSupport: "supported",
    gasModel: chain.category === "L2" ? "rollup-gas" : "native-evm-gas",
    executionEnvironment: chain.category === "L2" ? "evm-l2-rollup" : "evm-l1",
    ecosystemMaturity: chain.category === "L2" ? "developing" : "mature",
    confidenceLevel: "medium",
    notes: [
      "Fallback capability profile derived from chain category because no explicit capability record was provided.",
    ],
    sourceReferences: {
      isEvm: "seed://atlas/fallback",
      smartContractSupport: "seed://atlas/fallback",
      tokenStandardSupport: "seed://atlas/fallback",
      oracleSupport: "seed://atlas/fallback",
      indexingInfrastructure: "seed://atlas/fallback",
      eventDrivenArchitecture: "seed://atlas/fallback",
      crossChainSupport: "seed://atlas/fallback",
      validatorModel: "seed://atlas/fallback",
      stakingSupport: "seed://atlas/fallback",
      liquidStakingSupport: "seed://atlas/fallback",
      lendingProtocolFeasibility: "seed://atlas/fallback",
      liquidityProtocolFeasibility: "seed://atlas/fallback",
      paymentRailsSupport: "seed://atlas/fallback",
      gasModel: "seed://atlas/fallback",
      executionEnvironment: "seed://atlas/fallback",
      ecosystemMaturity: "seed://atlas/fallback",
    },
    lastUpdated: chain.sourceSnapshotDate,
  };
}

export function buildChainCapabilityProfiles(
  chains: Chain[],
  capabilitySeeds: ChainCapabilityProfileSeed[],
) {
  const seedBySlug = new Map(
    capabilitySeeds.map((profile) => [profile.chainSlug, profile] as const),
  );

  return new Map(
    chains.map((chain) => {
      const seeded = seedBySlug.get(chain.slug);

      if (!seeded) {
        return [chain.slug, buildFallbackCapabilityProfile(chain)] as const;
      }

      return [
        chain.slug,
        {
          ...seeded,
          chainId: chain.id,
          chainSlug: chain.slug,
        },
      ] as const;
    }),
  );
}

export function deriveTechnicalCapabilitiesFromCapabilityProfile(
  profile: ChainCapabilityProfile,
): ChainTechnicalCapabilities {
  return {
    smartContracts: profile.smartContractSupport,
    tokenStandards: profile.tokenStandardSupport,
    paymentRails: profile.paymentRailsSupport,
    oracleSupport: profile.oracleSupport,
    indexingSupport: profile.indexingInfrastructure,
    settlementPrimitives: deriveSettlementPrimitives(profile),
    liquidityRails: profile.liquidityProtocolFeasibility,
    nativeValidatorStaking: profile.stakingSupport,
  };
}

function mapExecutionEnvironmentToArchitectureKind(
  profile: ChainCapabilityProfile,
): ChainTechnicalProfile["architectureKind"] {
  switch (profile.executionEnvironment) {
    case "evm-l1":
      return "general-evm-l1";
    case "evm-l2-rollup":
      return "general-evm-l2";
    case "bitcoin-evm":
      return "bitcoin-evm";
    case "enterprise-evm":
      return "enterprise-evm";
    case "specialized-evm":
      return "specialized-evm";
    default:
      return "general-evm-l1";
  }
}

export function buildDerivedTechnicalProfile(
  capabilityProfile: ChainCapabilityProfile,
): ChainTechnicalProfile {
  return {
    chainId: capabilityProfile.chainId,
    architectureKind: mapExecutionEnvironmentToArchitectureKind(capabilityProfile),
    capabilities: deriveTechnicalCapabilitiesFromCapabilityProfile(
      capabilityProfile,
    ),
    dataConfidence: capabilityProfile.confidenceLevel,
    sourceBasis:
      "Derived by Atlas from the chain capability profile to preserve compatibility with the legacy technical applicability baseline.",
    assessedAt: capabilityProfile.lastUpdated,
    notes: capabilityProfile.notes,
  };
}

export function buildDerivedTechnicalProfiles(
  capabilityProfilesBySlug: Map<string, ChainCapabilityProfile>,
) {
  return new Map(
    [...capabilityProfilesBySlug.entries()].map(([slug, profile]) => [
      slug,
      buildDerivedTechnicalProfile(profile),
    ]),
  );
}
