import type { AnchorHTMLAttributes, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ChainAnalysisPanel } from "@/components/internal/chain-analysis-panel";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("ChainAnalysisPanel", () => {
  it("renders the deterministic baseline separately from the AI-assisted layer", () => {
    const repository = createSeedChainsRepository();
    const profile = repository.getChainProfileBySlug("ethereum", "ai-agents");

    if (!profile) {
      throw new Error("Expected seeded Ethereum AI profile.");
    }

    render(
      <ChainAnalysisPanel
        chainSlug="ethereum"
        chainName="Ethereum"
        applicabilityRows={profile.wedgeApplicabilityMatrix}
        latestAnalysis={{
          id: "analysis-1",
          chainId: profile.chain.id,
          chainSlug: profile.chain.slug,
          triggeredBy: "vitest@example.com",
          modelName: "gpt-5.4",
          executionMode: "mock",
          analysisType: "gpt-5.4-technical-analysis",
          status: "completed",
          inputSnapshot: {
            chain: {
              id: profile.chain.id,
              slug: profile.chain.slug,
              name: profile.chain.name,
            },
            technicalProfile: profile.technicalProfile,
            globalPosition: {
              benchmarkRank: profile.globalPosition.benchmarkRank,
              score: {
                totalScore: profile.globalPosition.score.totalScore,
              },
            },
            economies: [],
            assumptionsVersion: "1.24.0@test",
            sourceSnapshotDate: profile.chain.sourceSnapshotDate,
          },
          outputSummary: "Ethereum analysis completed.",
          outputStructuredData: {
            wedgeAssessments: profile.wedgeApplicabilityMatrix,
            technicalBlockers: ["Indexing maturity"],
            prerequisiteSummary: ["Required prerequisite: Oracle support"],
            strongestOpportunities: ["AI Agent Economy via Upgrade Agent Indexing Layer"],
            confidenceNotes: ["Mock mode"],
            manualFollowUp: ["Review indexing architecture"],
          },
          createdAt: "2026-03-08T00:00:00.000Z",
          completedAt: "2026-03-08T00:05:00.000Z",
          errorMessage: null,
        }}
        internalUser={{
          provider: "auth0",
          subject: "auth0|user",
          email: "vitest@example.com",
          displayName: "Vitest User",
        }}
      />,
    );

    expect(screen.getByText("Deterministic layer")).toBeInTheDocument();
    expect(screen.getByText("AI-assisted layer")).toBeInTheDocument();
    expect(screen.getByText("Wedge applicability baseline")).toBeInTheDocument();
    expect(screen.getByText("Latest technical analysis")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Run gpt-5.4 Technical Analysis/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ethereum analysis completed.")).toBeInTheDocument();
  });
});
