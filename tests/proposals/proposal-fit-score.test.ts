import { describe, expect, it } from "vitest";

import type { BuyerPersonaRecord } from "@/lib/domain/types";
import { buildProposalFitScore } from "@/lib/proposals/scoreProposalFit";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { listOfferLibrary } from "@/lib/offers/library";

function buildPersona(): BuyerPersonaRecord {
  const now = new Date().toISOString();

  return {
    id: "persona-fit-test",
    organization: "ethereum-foundation",
    chainId: "chain-ethereum",
    chainSlug: "ethereum",
    chainUrl: "https://ethereum.org",
    protocolUrl: undefined,
    personName: "Alex Founder",
    personTitle: "Ecosystem Lead",
    linkedinProfile: undefined,
    twitterHandle: undefined,
    githubProfile: undefined,
    notes: undefined,
    markdownPath: "/tmp/persona-fit-test.md",
    markdownContent: "# Persona",
    structuredData: {
      empathyMap: {
        hear: ["Partners want safer launches."],
        fearTop3: ["Security risk", "Partner confidence", "Slow launch"],
        wantTop3: ["Safer infra", "Faster shipping", "Clear trust posture"],
        needTop3: ["Monitoring", "Security controls", "Execution support"],
        painsTop3: ["Operational risk", "Launch delays", "Trust gaps"],
        expectedGainsTop3: ["Safer launches", "Better diligence", "Higher activation"],
      },
      successMetrics: {
        topKpis: ["ecosystem launches", "partner confidence", "time to market"],
        organizationOkrs: ["Ship safer ecosystem primitives", "Increase partner adoption"],
      },
      leanCanvas: {
        problem: "Launch readiness is uneven.",
        solution: "Add missing infrastructure and trust layers.",
        valueProposition: "Move faster with lower execution risk.",
        competitors: "Internal builds and fragmented vendors.",
        strategy: "Lead with infrastructure that closes partner objections.",
        growthDrivers: "Ecosystem scale, trust, launch velocity.",
      },
      sourceSummary: ["Internal mock persona"],
    },
    modelName: "atlas-mock-persona-v1",
    executionMode: "mock",
    sourceNotes: ["Internal mock persona"],
    createdAt: now,
    updatedAt: now,
    generatedBy: "test",
  };
}

describe("proposal fit score", () => {
  it("produces a deterministic conversion score for an active offer", () => {
    const repository = createSeedChainsRepository();
    const profile = repository.getChainProfileBySlug("ethereum", "ai-agents");
    const offer = listOfferLibrary().find(
      (candidate) => candidate.offerId === "ai-security-express",
    );

    expect(profile).toBeTruthy();
    expect(offer).toBeTruthy();

    const result = buildProposalFitScore({
      profile: profile!,
      persona: buildPersona(),
      offer: offer!,
    });

    expect(result.conversionProbability).toBeGreaterThan(0);
    expect(result.strategicFit).toBeGreaterThan(0);
    expect(result.breakdown.applicability).toBeGreaterThan(0);
    expect(result.breakdown.personaFit).toBeGreaterThan(0);
  });
});
