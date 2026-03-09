import { z } from "zod";

import {
  dataConfidenceLevels,
  economyTypeSlugs,
  wedgeApplicabilityStatuses,
} from "@/lib/domain/types";

export const chainTechnicalAnalysisStructuredOutputSchema = z.object({
  wedgeAssessments: z.array(
    z.object({
      wedgeId: z.enum(economyTypeSlugs),
      applicabilityStatus: z.enum(wedgeApplicabilityStatuses),
      rationale: z.string().min(1),
      technicalConstraints: z.array(z.string()).default([]),
      requiredPrerequisites: z.array(z.string()).default([]),
      confidenceLevel: z.enum(dataConfidenceLevels),
      manualReviewRecommended: z.boolean(),
    }),
  ),
  technicalBlockers: z.array(z.string()),
  prerequisiteSummary: z.array(z.string()),
  strongestOpportunities: z.array(z.string()),
  confidenceNotes: z.array(z.string()),
  manualFollowUp: z.array(z.string()),
  infrastructureAnalysis: z.string().min(1),
  buyerPersonaAnalysis: z.string().min(1),
  recommendedOffer: z
    .object({
      offerId: z.string().min(1),
      offerName: z.string().min(1),
      rationale: z.string().min(1),
    })
    .nullable(),
  proposalDraft: z
    .object({
      headline: z.string().min(1),
      summary: z.string().min(1),
      whyItSolvesPersonaFears: z.string().min(1),
      kpiImprovementCase: z.string().min(1),
      expectedRoi: z.string().min(1),
      strategicAdvantage: z.string().min(1),
    })
    .nullable(),
  confidenceScore: z.number().min(0).max(100),
});

export type ChainTechnicalAnalysisStructuredOutput = z.infer<
  typeof chainTechnicalAnalysisStructuredOutputSchema
>;
