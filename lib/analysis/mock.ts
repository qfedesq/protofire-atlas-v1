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

  const primaryPersona = snapshot.personas[0] ?? null;
  const recommendedOffer =
    primaryPersona
      ? snapshot.offers.find((offer) =>
          sortedEconomies.some(
            (economy) =>
              offer.applicableWedges.includes(economy.economy.slug) &&
              economy.wedgeApplicability.applicabilityStatus !== "not_applicable",
          ),
        ) ?? null
      : null;

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
      infrastructureAnalysis: `${snapshot.chain.name} is technically strongest where Atlas already sees applicable wedges and closeable infrastructure gaps. The main blockers cluster around ${technicalBlockers[0] ?? "missing prerequisites"} and the clearest wedge path is ${strongestOpportunities[0] ?? "manual review"}.`,
      buyerPersonaAnalysis: primaryPersona
        ? `${primaryPersona.personaName} is likely optimizing for ${primaryPersona.topKpis[0] ?? "ecosystem growth"} while trying to avoid ${primaryPersona.fears[0] ?? "execution risk"}. Protofire should frame the offer in KPI movement and partner confidence terms.`
        : "No stored buyer persona exists for this chain yet, so buyer-side confidence is lower and Atlas should trigger a persona pass before treating offer selection as final.",
      recommendedOffer: recommendedOffer
        ? {
            offerId: recommendedOffer.offerId,
            offerName: recommendedOffer.name,
            rationale: primaryPersona
              ? `${recommendedOffer.name} best matches the current wedge blockers and the stored persona priorities.`
              : `${recommendedOffer.name} is the strongest deterministic fit across the active wedges.`,
          }
        : null,
      proposalDraft: recommendedOffer
        ? {
            headline: `${recommendedOffer.name} for ${snapshot.chain.name}`,
            summary: `${recommendedOffer.name} closes the current infrastructure blocker while improving the buyer's confidence that the chain can win the most actionable wedge.`,
            whyItSolvesPersonaFears: primaryPersona
              ? `It directly addresses ${primaryPersona.fears[0] ?? "execution risk"} by turning a known infrastructure blocker into a concrete activation path.`
              : "It reduces ambiguity around the chain's highest-impact missing infrastructure.",
            kpiImprovementCase: primaryPersona
              ? `The proposal is aligned to move ${primaryPersona.topKpis[0] ?? "the top KPI"} by removing the blocker that is slowing partner confidence.`
              : "The proposal supports measurable readiness and ecosystem KPI movement.",
            expectedRoi: recommendedOffer.roiEstimate,
            strategicAdvantage:
              "The chain can improve partner-facing infrastructure credibility without waiting for a broader ecosystem reset.",
          }
        : null,
      confidenceScore: primaryPersona ? 72 : 58,
    },
    "Atlas mock strategic analysis derived from deterministic applicability, readiness context, stored personas, and the offer library.",
  );
}
