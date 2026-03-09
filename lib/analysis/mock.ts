import type {
  AnalysisSettings,
  ChainAnalysisInputSnapshot,
} from "@/lib/domain/types";

import { buildChainTechnicalAnalysisOutput } from "./utils";

export function runMockChainTechnicalAnalysis(
  snapshot: ChainAnalysisInputSnapshot,
  settings: AnalysisSettings,
) {
  const sortedEconomies = [...snapshot.economies].sort((left, right) => {
    const leftLift = left.recommendedStack.items.reduce(
      (sum, item) => sum + item.potentialScoreLift,
      0,
    );
    const rightLift = right.recommendedStack.items.reduce(
      (sum, item) => sum + item.potentialScoreLift,
      0,
    );

    return rightLift - leftLift;
  });

  const technicalBlockers = [
    ...new Set(
      sortedEconomies.flatMap((economy) => [
        ...economy.gapAnalysis.map((gap) => gap.problem),
        ...economy.wedgeApplicability.technicalConstraints,
      ]),
    ),
  ].slice(0, 6);

  const prerequisiteSummary = [
    ...new Set(
      sortedEconomies.flatMap((economy) => economy.wedgeApplicability.requiredPrerequisites),
    ),
  ].slice(0, 6);

  const strongestOpportunities = sortedEconomies
    .filter(
      (economy) =>
        economy.wedgeApplicability.applicabilityStatus !== "not_applicable" &&
        economy.recommendedStack.items.length > 0,
    )
    .map((economy) => {
      const firstActivation = economy.recommendedStack.items[0]?.title;

      return `${economy.economy.name}${firstActivation ? ` via ${firstActivation}` : ""}`;
    })
    .slice(0, 3);

  const confidenceNotes = [
    `Deterministic baseline confidence for ${snapshot.chain.name} is ${snapshot.technicalProfile.dataConfidence}.`,
    settings.useMockWhenUnavailable
      ? "OpenAI execution was unavailable or bypassed in this environment, so Atlas used the deterministic mock analysis path."
      : "Atlas used the deterministic mock analysis path configured for this environment.",
  ];

  const manualFollowUp = sortedEconomies
    .filter(
      (economy) =>
        economy.wedgeApplicability.manualReviewRecommended ||
        economy.wedgeApplicability.applicabilityStatus === "unknown",
    )
    .map(
      (economy) =>
        `${economy.economy.name}: verify ${economy.wedgeApplicability.requiredPrerequisites[0] ?? "prerequisites"} before treating the wedge as fully actionable.`,
    )
    .slice(0, 4);

  return buildChainTechnicalAnalysisOutput(
    snapshot,
    {
      wedgeAssessments: sortedEconomies.map((economy) => ({
        wedgeId: economy.economy.slug,
        applicabilityStatus: economy.wedgeApplicability.applicabilityStatus,
        rationale: `${economy.wedgeApplicability.rationale} Atlas mock analysis kept the deterministic status and focused on whether the required prerequisites are realistically closeable.`,
        technicalConstraints: economy.wedgeApplicability.technicalConstraints,
        requiredPrerequisites: economy.wedgeApplicability.requiredPrerequisites,
        confidenceLevel: economy.wedgeApplicability.confidenceLevel,
        manualReviewRecommended: economy.wedgeApplicability.manualReviewRecommended,
      })),
      technicalBlockers,
      prerequisiteSummary,
      strongestOpportunities,
      confidenceNotes,
      manualFollowUp,
    },
    "Atlas mock technical analysis derived from deterministic applicability and readiness context.",
  );
}
