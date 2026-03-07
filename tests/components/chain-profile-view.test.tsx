import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChainProfileView } from "@/components/chain/chain-profile-view";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

describe("ChainProfileView", () => {
  it("renders readiness sections, gap analysis, and recommended stack", () => {
    const repository = createSeedChainsRepository();
    const profile = repository.getChainProfileBySlug("base", "ai-agents");

    if (!profile) {
      throw new Error("Expected seeded profile for base");
    }

    render(
      <ChainProfileView
        profile={profile}
        economies={repository.listEconomies()}
        requestState="idle"
      />,
    );

    expect(
      screen.getByText("Deterministic Protofire activation stack"),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Upgrade Agent Indexing Layer").length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("AI Agents modules")).toBeInTheDocument();
    expect(
      screen.getByText("What is still blocking readiness"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Highest-upside module improvements"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Nearby chains in the same economy wedge"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Request infrastructure assessment"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Direct chain impact").length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText(/Source TVL rank: #3/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Open suggested activations" }),
    ).toHaveAttribute("href", "#suggested-activations");
    expect(
      screen.getByText("What is still blocking readiness").closest("details"),
    ).not.toHaveAttribute("open");
    expect(
      screen
        .getByText("Highest-upside module improvements")
        .closest("details"),
    ).not.toHaveAttribute("open");
    expect(
      screen
        .getByText("Nearby chains in the same economy wedge")
        .closest("details"),
    ).not.toHaveAttribute("open");
  });
});
