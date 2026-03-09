import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { computeOpportunityRadar } from "@/lib/opportunities/computeOpportunityRadar";
import { rankOpportunityTargets } from "@/lib/opportunities/rankOpportunityTargets";

describe("opportunity radar", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("ranks deterministic opportunity targets across active wedges", () => {
    vi.stubEnv(
      "ATLAS_BUYER_PERSONAS_FILE",
      path.join(os.tmpdir(), `atlas-opportunity-personas-${Date.now()}.json`),
    );
    vi.stubEnv(
      "ATLAS_PROPOSALS_FILE",
      path.join(os.tmpdir(), `atlas-opportunity-proposals-${Date.now()}.json`),
    );
    vi.stubEnv(
      "ATLAS_OFFER_OVERRIDES_FILE",
      path.join(os.tmpdir(), `atlas-opportunity-offers-${Date.now()}.json`),
    );

    const ranked = rankOpportunityTargets(computeOpportunityRadar());

    expect(ranked.length).toBeGreaterThan(0);
    expect(new Set(ranked.map((row) => row.wedge))).toEqual(
      new Set(["AI Agent Economy", "DeFi Infrastructure Economy"]),
    );
    expect(ranked[0]?.opportunityScore).toBeGreaterThanOrEqual(
      ranked[1]?.opportunityScore ?? 0,
    );
    expect(ranked[0]?.recommendedOffer).toBeTruthy();
  });
});
