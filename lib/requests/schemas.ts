import { z } from "zod";

import { economyTypeSlugs } from "@/lib/domain/types";
import type { AssessmentRequestInput } from "@/lib/requests/types";

const assessmentRequestSchema = z.object({
  name: z.string().trim().min(2),
  workEmail: z.string().trim().email(),
  companyOrChain: z.string().trim().min(2),
  selectedEconomy: z.enum(economyTypeSlugs),
  selectedChain: z.string().trim().min(1),
  notes: z.string().trim().max(1500).default(""),
  website: z.string().trim().default(""),
});

export function parseAssessmentRequestInput(
  input: unknown,
): AssessmentRequestInput {
  return assessmentRequestSchema.parse(input);
}
