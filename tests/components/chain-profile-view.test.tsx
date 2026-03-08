import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChainProfileView } from "@/components/chain/chain-profile-view";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

describe("ChainProfileView", () => {
  it("renders readiness sections, unified competitive analysis, and recommended stack", () => {
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
      screen.getByText("Gap analysis, score drivers, and peer comparison"),
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
      screen
        .getByText("Gap analysis, score drivers, and peer comparison")
        .closest("details"),
    ).not.toHaveAttribute("open");
  });

  it("renders the liquid staking diagnosis inside DeFi chain profiles", () => {
    const repository = createSeedChainsRepository();
    const profile = repository.getChainProfileBySlug("base", "defi-infrastructure");

    if (!profile) {
      throw new Error("Expected seeded DeFi profile for base");
    }

    render(
      <ChainProfileView
        profile={profile}
        economies={repository.listEconomies()}
        requestState="idle"
      />,
    );

    expect(screen.getAllByText("Liquid Staking Infrastructure").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { name: "7-module diagnosis" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Open diagnosis" }),
    ).toHaveAttribute("href", "#liquid-staking-diagnosis");
    const diagnosisSection = screen
      .getByRole("heading", { name: "7-module diagnosis" })
      .closest("section");

    if (!diagnosisSection) {
      throw new Error("Expected liquid staking diagnosis section");
    }

    expect(
      within(diagnosisSection).getAllByText("Liquidity & Exit").length,
    ).toBeGreaterThan(0);
    expect(
      within(diagnosisSection).getAllByText("Stress Resilience").length,
    ).toBeGreaterThan(0);
  });
});
