import { randomUUID } from "node:crypto";

import { appendIntentEvent } from "@/lib/intent/store";
import { parseAssessmentRequestInput } from "@/lib/requests/schemas";
import { appendAssessmentRequest } from "@/lib/requests/store";
import type { AssessmentRequestInput } from "@/lib/requests/types";

export function createAssessmentRequest(input: AssessmentRequestInput) {
  const parsed = parseAssessmentRequestInput(input);

  if (parsed.website.length > 0) {
    throw new Error("Spam protection triggered.");
  }

  const request = appendAssessmentRequest({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name: parsed.name,
    workEmail: parsed.workEmail,
    companyOrChain: parsed.companyOrChain,
    selectedEconomy: parsed.selectedEconomy,
    selectedChain: parsed.selectedChain,
    notes: parsed.notes,
  });

  appendIntentEvent({
    type: "assessment_request_submitted",
    economy: parsed.selectedEconomy,
    chainSlug: parsed.selectedChain,
    context: "chain-profile-form",
  });

  return request;
}
