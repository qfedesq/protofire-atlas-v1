import type {
  ChainAnalysisInputSnapshot,
  ChainTechnicalAnalysisOutput,
} from "@/lib/domain/types";

import type { ChainTechnicalAnalysisStructuredOutput } from "./schema";

export function buildChainTechnicalAnalysisOutput(
  snapshot: ChainAnalysisInputSnapshot,
  structured: ChainTechnicalAnalysisStructuredOutput,
  sourceBasis: string,
): ChainTechnicalAnalysisOutput {
  const baselineByWedge = new Map(
    snapshot.economies.map((economy) => [
      economy.economy.slug,
      economy.wedgeApplicability,
    ]),
  );
  const assessedAt = new Date().toISOString();

  return {
    wedgeAssessments: structured.wedgeAssessments.map((assessment) => {
      const baseline = baselineByWedge.get(assessment.wedgeId);

      if (!baseline) {
        throw new Error(
          `Missing deterministic wedge applicability for ${assessment.wedgeId}.`,
        );
      }

      return {
        ...baseline,
        applicabilityStatus: assessment.applicabilityStatus,
        rationale: assessment.rationale,
        technicalConstraints: assessment.technicalConstraints,
        requiredPrerequisites: assessment.requiredPrerequisites,
        confidenceLevel: assessment.confidenceLevel,
        manualReviewRecommended: assessment.manualReviewRecommended,
        assessedAt,
        sourceBasis,
      };
    }),
    technicalBlockers: structured.technicalBlockers,
    prerequisiteSummary: structured.prerequisiteSummary,
    strongestOpportunities: structured.strongestOpportunities,
    confidenceNotes: structured.confidenceNotes,
    manualFollowUp: structured.manualFollowUp,
    infrastructureAnalysis: structured.infrastructureAnalysis,
    buyerPersonaAnalysis: structured.buyerPersonaAnalysis,
    recommendedOffer: structured.recommendedOffer,
    proposalDraft: structured.proposalDraft,
    confidenceScore: structured.confidenceScore,
  };
}

export function buildChainTechnicalAnalysisSummary(
  snapshot: ChainAnalysisInputSnapshot,
  output: ChainTechnicalAnalysisOutput,
) {
  const strongestOpportunity = output.strongestOpportunities[0];
  const mainBlocker = output.technicalBlockers[0];
  const recommendedOffer = output.recommendedOffer?.offerName;

  if (recommendedOffer && strongestOpportunity) {
    return `${snapshot.chain.name} is most actionable around ${strongestOpportunity}, with ${recommendedOffer} as the strongest current Protofire offer.`;
  }

  if (strongestOpportunity && mainBlocker) {
    return `${snapshot.chain.name} is most actionable around ${strongestOpportunity}, while ${mainBlocker.toLowerCase()} remains the main technical blocker.`;
  }

  if (strongestOpportunity) {
    return `${snapshot.chain.name} is most actionable around ${strongestOpportunity}.`;
  }

  if (mainBlocker) {
    return `${snapshot.chain.name} still needs manual technical review around ${mainBlocker.toLowerCase()}.`;
  }

  return `${snapshot.chain.name} technical analysis completed without a dominant blocker or opportunity in the current Atlas snapshot.`;
}
