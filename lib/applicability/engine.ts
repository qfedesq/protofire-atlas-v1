import { getActiveWedgeApplicabilityAssumptions } from "@/lib/assumptions/resolve";
import { buildDerivedTechnicalProfile } from "@/lib/capabilities/profiles";
import type {
  ApplicabilityRequirementLevel,
  CapabilitySupportLevel,
  Chain,
  ChainCapabilityProfile,
  ChainTechnicalCapabilityKey,
  ChainTechnicalProfile,
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
  profile: ChainCapabilityProfile,
): WedgeApplicability {
  const assumptions = getActiveWedgeApplicabilityAssumptions();
  const weights = assumptions.wedgeCapabilityWeights[economy.slug];
  const prerequisites = assumptions.wedgePrerequisites[economy.slug];
  const technicalProfile = buildDerivedTechnicalProfile(profile);

  const applicabilityScore = Object.entries(weights).reduce(
    (sum, [capabilityKey, weight]) => {
      const supportLevel =
        technicalProfile.capabilities[capabilityKey as ChainTechnicalCapabilityKey];
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
      technicalProfile.capabilities[capabilityKey] === "unknown",
  );

  const applicabilityStatus = buildApplicabilityStatus(
    applicabilityScore,
    profile.confidenceLevel,
    requiredUnknown,
    assumptions.thresholds,
    assumptions.confidence,
  );

  const technicalConstraints = (
    Object.entries(technicalProfile.capabilities) as [
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
    .filter(
      ([capabilityKey]) =>
        technicalProfile.capabilities[capabilityKey] !== "supported",
    )
    .map(([capabilityKey, requirement]) =>
      describeRequiredPrerequisite(capabilityKey, requirement),
    );

  const manualReviewRecommended =
    applicabilityStatus === "unknown" ||
    profile.confidenceLevel === "low" ||
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
      technicalProfile,
    ),
    technicalConstraints,
    requiredPrerequisites,
    assessedAt: profile.lastUpdated,
    sourceBasis:
      "Atlas deterministic wedge applicability derived from the current chain capability profile and active applicability assumptions.",
    confidenceLevel: profile.confidenceLevel,
    manualReviewRecommended,
  };
}

export function buildWedgeApplicabilityMatrix(
  chains: Chain[],
  economies: EconomyType[],
  capabilityProfilesBySlug: Map<string, ChainCapabilityProfile>,
) {
  return new Map(
    chains.map((chain) => {
      const capabilityProfile = capabilityProfilesBySlug.get(chain.slug);

      if (!capabilityProfile) {
        throw new Error(`Missing capability profile for ${chain.slug}`);
      }

      return [
        chain.slug,
        economies.map((economy) =>
          buildWedgeApplicability(chain, economy, capabilityProfile),
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

export function buildApplicabilityMatrixRows(
  chains: Chain[],
  capabilityProfilesBySlug: Map<string, ChainCapabilityProfile>,
  applicabilityMatrixBySlug: Map<string, WedgeApplicability[]>,
) {
  return chains.map((chain) => {
    const capabilityProfile = capabilityProfilesBySlug.get(chain.slug);
    const wedges = applicabilityMatrixBySlug.get(chain.slug) ?? [];

    if (!capabilityProfile) {
      throw new Error(`Missing capability profile for ${chain.slug}`);
    }

    return {
      chain,
      technicalProfile: buildDerivedTechnicalProfile(capabilityProfile),
      capabilityProfile,
      wedges,
    };
  });
}
