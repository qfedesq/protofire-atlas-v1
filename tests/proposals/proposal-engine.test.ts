import os from "node:os";
import path from "node:path";

import { describe, expect, it, vi } from "vitest";

import type { BuyerPersonaRecord } from "@/lib/domain/types";
import { generateProposalsForPersona } from "@/lib/proposals/engine";
import { listProposalDocuments } from "@/lib/proposals/store";

function buildPersona(): BuyerPersonaRecord {
  const now = new Date().toISOString();

  return {
    id: "persona-ethereum-ecosystem",
    organization: "ethereum-foundation",
    chainId: "chain-ethereum",
    chainSlug: "ethereum",
    chainUrl: "https://ethereum.org",
    protocolUrl: "https://ethereum.org/apps",
    personName: "Alex Founder",
    personTitle: "Ecosystem Lead",
    linkedinProfile: "https://linkedin.com/in/alex-founder",
    twitterHandle: "@alexfounder",
    githubProfile: "https://github.com/alexfounder",
    markdownPath: "/tmp/personas/ethereum/alex-founder.md",
    markdownContent: "# Alex Founder",
    structuredData: {
      empathyMap: {
        hear: ["Partners want safer launches."],
        fearTop3: ["Security risk", "Partner confidence", "Slow launch"],
        wantTop3: ["Safer infra", "Faster shipping", "Clear trust posture"],
        needTop3: ["Monitoring", "Security controls", "Execution support"],
        painsTop3: ["Operational risk", "Launch delays", "Trust gaps"],
        expectedGainsTop3: ["Safer launches", "Better partner diligence", "Higher activation"],
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
      sourceSummary: ["Internal mock persona for proposal engine coverage."],
    },
    modelName: "atlas-mock-persona-v1",
    executionMode: "mock",
    sourceNotes: ["Mock test persona"],
    createdAt: now,
    updatedAt: now,
    generatedBy: "test",
  };
}

describe("proposal engine", () => {
  it("generates and persists deterministic proposals for active wedges only", async () => {
    vi.stubEnv(
      "ATLAS_PROPOSALS_FILE",
      path.join(os.tmpdir(), `atlas-proposals-${Date.now()}.json`),
    );

    const proposals = await generateProposalsForPersona(
      "ethereum",
      buildPersona(),
      "test",
    );

    expect(proposals.length).toBeGreaterThan(0);
    expect(
      new Set(proposals.map((proposal) => proposal.wedgeId)),
    ).toEqual(new Set(["ai-agents", "defi-infrastructure"]));
    expect(proposals[0]?.conversionProbability).toBeGreaterThan(0);
    expect(proposals[0]?.markdownContent).toContain("# ");
    expect(listProposalDocuments().length).toBeGreaterThan(0);

    vi.unstubAllEnvs();
  });
});
