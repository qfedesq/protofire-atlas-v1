import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { createArithmeticCaptcha } from "@/lib/requests/captcha";
import { listIntentEvents } from "@/lib/intent/store";
import {
  createAssessmentRequest,
  createChainAdditionRequest,
} from "@/lib/requests/service";
import {
  listAssessmentRequests,
  listChainAdditionRequests,
} from "@/lib/requests/store";

const originalRequestsFile = process.env.ATLAS_REQUESTS_FILE;
const originalChainAdditionRequestsFile =
  process.env.ATLAS_CHAIN_ADDITION_REQUESTS_FILE;
const originalIntentFile = process.env.ATLAS_INTENT_FILE;

afterEach(() => {
  process.env.ATLAS_REQUESTS_FILE = originalRequestsFile;
  process.env.ATLAS_CHAIN_ADDITION_REQUESTS_FILE =
    originalChainAdditionRequestsFile;
  process.env.ATLAS_INTENT_FILE = originalIntentFile;
});

describe("assessment request service", () => {
  const validIssuedAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  it("stores validated requests and emits an intent event", () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "atlas-requests-"));
    process.env.ATLAS_REQUESTS_FILE = join(
      tempDirectory,
      "assessment-requests.json",
    );
    process.env.ATLAS_INTENT_FILE = join(tempDirectory, "intent-events.json");

    createAssessmentRequest({
      name: "Jane Founder",
      workEmail: "jane@chain.io",
      companyOrChain: "Chain Labs",
      selectedEconomy: "ai-agents",
      selectedChain: "base",
      notes: "Need help improving the agent readiness posture.",
      website: "",
    });

    const requests = listAssessmentRequests();
    const intentEvents = listIntentEvents();

    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({
      selectedEconomy: "ai-agents",
      selectedChain: "base",
    });
    expect(intentEvents[0]).toMatchObject({
      type: "assessment_request_submitted",
      economy: "ai-agents",
      chainSlug: "base",
    });
  });

  it("rejects honeypot submissions", () => {
    expect(() =>
      createAssessmentRequest({
        name: "Spam Bot",
        workEmail: "spam@example.com",
        companyOrChain: "Spam",
        selectedEconomy: "ai-agents",
        selectedChain: "base",
        notes: "",
        website: "https://spam.invalid",
      }),
    ).toThrow("Spam protection triggered.");
  });

  it("stores validated add-my-chain requests and emits an intent event", () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "atlas-chain-additions-"));
    const captcha = createArithmeticCaptcha({
      firstNumber: 4,
      secondNumber: 5,
      operator: "+",
      issuedAt: validIssuedAt,
    });

    process.env.ATLAS_CHAIN_ADDITION_REQUESTS_FILE = join(
      tempDirectory,
      "chain-addition-requests.json",
    );
    process.env.ATLAS_INTENT_FILE = join(tempDirectory, "intent-events.json");

    createChainAdditionRequest({
      chainWebsite: "https://newchain.xyz",
      selectedEconomy: "defi-infrastructure",
      captchaAnswer: "9",
      captchaToken: captcha.token,
      website: "",
    });

    const requests = listChainAdditionRequests();
    const intentEvents = listIntentEvents();

    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({
      chainWebsite: "https://newchain.xyz",
      selectedEconomy: "defi-infrastructure",
    });
    expect(intentEvents[0]).toMatchObject({
      type: "chain_addition_request_submitted",
      economy: "defi-infrastructure",
      context: "ranking-add-chain",
    });
  });

  it("rejects add-my-chain requests with invalid captcha answers", () => {
    const captcha = createArithmeticCaptcha({
      firstNumber: 7,
      secondNumber: 2,
      operator: "-",
      issuedAt: validIssuedAt,
    });

    expect(() =>
      createChainAdditionRequest({
        chainWebsite: "https://badcaptcha.xyz",
        selectedEconomy: "ai-agents",
        captchaAnswer: "99",
        captchaToken: captcha.token,
        website: "",
      }),
    ).toThrow("Captcha validation failed.");
  });

  it("rejects add-my-chain honeypot submissions", () => {
    const captcha = createArithmeticCaptcha({
      firstNumber: 3,
      secondNumber: 3,
      operator: "+",
      issuedAt: validIssuedAt,
    });

    expect(() =>
      createChainAdditionRequest({
        chainWebsite: "https://spamchain.xyz",
        selectedEconomy: "rwa-infrastructure",
        captchaAnswer: "6",
        captchaToken: captcha.token,
        website: "https://spam.invalid",
      }),
    ).toThrow("Spam protection triggered.");
  });
});
