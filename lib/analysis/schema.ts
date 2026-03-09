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
});

export type ChainTechnicalAnalysisStructuredOutput = z.infer<
  typeof chainTechnicalAnalysisStructuredOutputSchema
>;
