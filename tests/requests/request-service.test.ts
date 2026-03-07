import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { listIntentEvents } from "@/lib/intent/store";
import { createAssessmentRequest } from "@/lib/requests/service";
import { listAssessmentRequests } from "@/lib/requests/store";

const originalRequestsFile = process.env.ATLAS_REQUESTS_FILE;
const originalIntentFile = process.env.ATLAS_INTENT_FILE;

afterEach(() => {
  process.env.ATLAS_REQUESTS_FILE = originalRequestsFile;
  process.env.ATLAS_INTENT_FILE = originalIntentFile;
});

describe("assessment request service", () => {
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
});
