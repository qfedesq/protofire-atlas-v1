import { getActiveWedgeApplicabilityAssumptions } from "@/lib/assumptions/resolve";
import type {
  ApplicabilityRequirementLevel,
  CapabilitySupportLevel,
  Chain,
  ChainTechnicalCapabilityKey,
  ChainTechnicalProfile,
  ChainTechnicalProfileSeed,
  DataConfidenceLevel,
  EconomyType,
  WedgeApplicability,
  WedgeApplicabilityStatus,
  WedgeApplicabilitySummary,
} from "@/lib/domain/types";

const confidenceOrder: Record<DataConfidenceLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

const capabilityLabels: Record<ChainTechnicalCapabilityKey, string> = {
  smartContracts: "Smart contract execution",
  tokenStandards: "Token standard compatibility",
  paymentRails: "Payment rail support",
  oracleSupport: "Oracle support",
  indexingSupport: "Indexing feasibility",
  settlementPrimitives: "Settlement primitives",
  liquidityRails: "Liquidity rail support",
  nativeValidatorStaking: "Native validator staking support",
};

function describeCapabilityConstraint(
  key: ChainTechnicalCapabilityKey,
  level: CapabilitySupportLevel,
) {
  const prefix =
    level === "limited"
      ? "Limited"
      : level === "unsupported"
        ? "Missing"
        : "Unclear";

  return `${prefix} ${capabilityLabels[key].toLowerCase()}`;
}

function describeRequiredPrerequisite(
  key: ChainTechnicalCapabilityKey,
  requirement: ApplicabilityRequirementLevel,
) {
  const lead =
    requirement === "required"
      ? "Required prerequisite"
      : requirement === "preferred"
        ? "Preferred prerequisite"
        : "Optional signal";

  return `${lead}: ${capabilityLabels[key]}`;
}

function buildFallbackTechnicalProfile(chain: Chain): ChainTechnicalProfile {
  return {
    chainId: chain.id,
    architectureKind:
      chain.category === "L2" ? "general-evm-l2" : "general-evm-l1",
    capabilities: {
      smartContracts: "supported",
      tokenStandards: "supported",
      paymentRails: "supported",
      oracleSupport: "supported",
      indexingSupport: "supported",
      settlementPrimitives: "supported",
      liquidityRails: "supported",
      nativeValidatorStaking:
        chain.category === "L2" ? "unsupported" : "supported",
    },
    dataConfidence: "medium",
    sourceBasis:
      "Atlas fallback technical profile derived from chain category when no explicit chain profile is present.",
    assessedAt: chain.sourceSnapshotDate,
    notes: [
      "Fallback technical profile. Add an explicit chain technical profile seed if Atlas needs more nuanced applicability handling.",
    ],
  };
}

export function buildChainTechnicalProfiles(
  chains: Chain[],
  profileSeeds: ChainTechnicalProfileSeed[],
) {
  const profileBySlug = new Map(
    profileSeeds.map((profile) => [profile.chainSlug, profile] as const),
  );

  return new Map(
    chains.map((chain) => {
      const seeded = profileBySlug.get(chain.slug);

      if (!seeded) {
        return [chain.slug, buildFallbackTechnicalProfile(chain)] as const;
      }

      return [
        chain.slug,
        {
          ...seeded,
          chainId: chain.id,
        },
      ] as const;
    }),
  );
}

function buildApplicabilityStatus(
  score: number,
  confidenceLevel: DataConfidenceLevel,
  requiredUnknown: boolean,
  thresholds: ReturnType<typeof getActiveWedgeApplicabilityAssumptions>["thresholds"],
  confidence: ReturnType<typeof getActiveWedgeApplicabilityAssumptions>["confidence"],
): WedgeApplicabilityStatus {
  if (
    confidenceOrder[confidenceLevel] <
    confidenceOrder[confidence.minimumConfidenceForDefinitiveStatus]
  ) {
    return "unknown";
  }

  if (requiredUnknown && confidence.unknownWhenRequiredCapabilityIsUnknown) {
    return "unknown";
  }

  if (score >= thresholds.applicableMinimum) {
    return "applicable";
  }

  if (score >= thresholds.partialMinimum) {
    return "partially_applicable";
  }

  return "not_applicable";
}

function buildApplicabilityRationale(
  chain: Chain,
  economy: EconomyType,
  status: WedgeApplicabilityStatus,
  constraints: string[],
  prerequisites: string[],
  profile: ChainTechnicalProfile,
) {
  const baseLead =
    status === "applicable"
      ? `${chain.name} is technically applicable for ${economy.name} in the current Atlas model.`
      : status === "partially_applicable"
        ? `${chain.name} can support ${economy.name}, but technical constraints still limit full applicability.`
        : status === "not_applicable"
          ? `${chain.name} lacks key technical prerequisites for ${economy.name} under the current Atlas rules.`
          : `${chain.name} needs manual review before Atlas can make a definitive ${economy.name} applicability call.`;

  const constraintLead =
    constraints.length > 0
      ? `Main constraints: ${constraints.slice(0, 3).join("; ")}.`
      : "No blocking technical constraints surfaced in the deterministic baseline.";
  const prerequisiteLead =
    prerequisites.length > 0
      ? `Priority prerequisites: ${prerequisites.slice(0, 2).join("; ")}.`
      : "Core prerequisites clear the current applicability threshold.";

  return `${baseLead} ${constraintLead} ${prerequisiteLead} Confidence is ${profile.dataConfidence}.`;
}

export function buildWedgeApplicability(
  chain: Chain,
  economy: EconomyType,
  profile: ChainTechnicalProfile,
): WedgeApplicability {
  const assumptions = getActiveWedgeApplicabilityAssumptions();
  const weights = assumptions.wedgeCapabilityWeights[economy.slug];
  const prerequisites = assumptions.wedgePrerequisites[economy.slug];

  const applicabilityScore = Object.entries(weights).reduce(
    (sum, [capabilityKey, weight]) => {
      const supportLevel =
        profile.capabilities[capabilityKey as ChainTechnicalCapabilityKey];
      const supportScore = assumptions.signalScores[supportLevel];

      return sum + supportScore * (weight / 100);
    },
    0,
  );

  const requiredUnknown = (
    Object.entries(prerequisites) as [
      ChainTechnicalCapabilityKey,
      ApplicabilityRequirementLevel,
    ][]
  ).some(
    ([capabilityKey, requirement]) =>
      requirement === "required" &&
      profile.capabilities[capabilityKey] === "unknown",
  );

  const applicabilityStatus = buildApplicabilityStatus(
    applicabilityScore,
    profile.dataConfidence,
    requiredUnknown,
    assumptions.thresholds,
    assumptions.confidence,
  );

  const technicalConstraints = (
    Object.entries(profile.capabilities) as [
      ChainTechnicalCapabilityKey,
      CapabilitySupportLevel,
    ][]
  )
    .filter(([, supportLevel]) => supportLevel !== "supported")
    .filter(([capabilityKey]) => weights[capabilityKey] > 0)
    .map(([capabilityKey, supportLevel]) =>
      describeCapabilityConstraint(capabilityKey, supportLevel),
    );

  const requiredPrerequisites = (
    Object.entries(prerequisites) as [
      ChainTechnicalCapabilityKey,
      ApplicabilityRequirementLevel,
    ][]
  )
    .filter(([, requirement]) => requirement !== "optional")
    .filter(([capabilityKey]) => profile.capabilities[capabilityKey] !== "supported")
    .map(([capabilityKey, requirement]) =>
      describeRequiredPrerequisite(capabilityKey, requirement),
    );

  const manualReviewRecommended =
    applicabilityStatus === "unknown" ||
    profile.dataConfidence === "low" ||
    applicabilityScore < assumptions.confidence.manualReviewBelowScore;

  return {
    chainId: chain.id,
    chainSlug: chain.slug,
    wedgeId: economy.slug,
    applicabilityStatus,
    applicabilityScore,
    rationale: buildApplicabilityRationale(
      chain,
      economy,
      applicabilityStatus,
      technicalConstraints,
      requiredPrerequisites,
      profile,
    ),
    technicalConstraints,
    requiredPrerequisites,
    assessedAt: profile.assessedAt,
    sourceBasis: profile.sourceBasis,
    confidenceLevel: profile.dataConfidence,
    manualReviewRecommended,
  };
}

export function buildWedgeApplicabilityMatrix(
  chains: Chain[],
  economies: EconomyType[],
  technicalProfilesBySlug?: Map<string, ChainTechnicalProfile>,
) {
  return new Map(
    chains.map((chain) => {
      const technicalProfile =
        technicalProfilesBySlug?.get(chain.slug) ?? buildFallbackTechnicalProfile(chain);

      return [
        chain.slug,
        economies.map((economy) =>
          buildWedgeApplicability(chain, economy, technicalProfile),
        ),
      ] as const;
    }),
  );
}

export function buildWedgeApplicabilitySummaries(
  economies: EconomyType[],
  matrixByChain: Map<string, WedgeApplicability[]>,
): WedgeApplicabilitySummary[] {
  return economies.map((economy) => {
    const rows = [...matrixByChain.values()]
      .flat()
      .filter((row) => row.wedgeId === economy.slug);

    return {
      wedge: economy,
      applicable: rows.filter((row) => row.applicabilityStatus === "applicable")
        .length,
      partiallyApplicable: rows.filter(
        (row) => row.applicabilityStatus === "partially_applicable",
      ).length,
      notApplicable: rows.filter((row) => row.applicabilityStatus === "not_applicable")
        .length,
      unknown: rows.filter((row) => row.applicabilityStatus === "unknown").length,
      manualReviewCount: rows.filter((row) => row.manualReviewRecommended).length,
    };
  });
}
