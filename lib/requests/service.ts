import { randomUUID } from "node:crypto";

import { appendIntentEvent } from "@/lib/intent/store";
import { verifyArithmeticCaptcha } from "@/lib/requests/captcha";
import {
  parseAssessmentRequestInput,
  parseChainAdditionRequestInput,
} from "@/lib/requests/schemas";
import {
  appendAssessmentRequest,
  appendChainAdditionRequest,
} from "@/lib/requests/store";
import type {
  AssessmentRequestInput,
  ChainAdditionRequestInput,
} from "@/lib/requests/types";

export async function createAssessmentRequest(input: AssessmentRequestInput) {
  const parsed = parseAssessmentRequestInput(input);

  if (parsed.website.length > 0) {
    throw new Error("Spam protection triggered.");
  }

  const request = await appendAssessmentRequest({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name: parsed.name,
    workEmail: parsed.workEmail,
    companyOrChain: parsed.companyOrChain,
    selectedEconomy: parsed.selectedEconomy,
    selectedChain: parsed.selectedChain,
    notes: parsed.notes,
  });

  await appendIntentEvent({
    type: "assessment_request_submitted",
    economy: parsed.selectedEconomy,
    chainSlug: parsed.selectedChain,
    context: "chain-profile-form",
  });

  return request;
}

export async function createChainAdditionRequest(input: ChainAdditionRequestInput) {
  const parsed = parseChainAdditionRequestInput(input);

  if (parsed.website.length > 0) {
    throw new Error("Spam protection triggered.");
  }

  if (!verifyArithmeticCaptcha(parsed.captchaToken, parsed.captchaAnswer)) {
    throw new Error("Captcha validation failed.");
  }

  const request = await appendChainAdditionRequest({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    chainWebsite: parsed.chainWebsite,
    selectedEconomy: parsed.selectedEconomy,
  });

  await appendIntentEvent({
    type: "chain_addition_request_submitted",
    economy: parsed.selectedEconomy,
    context: "ranking-add-chain",
  });

  return request;
}
