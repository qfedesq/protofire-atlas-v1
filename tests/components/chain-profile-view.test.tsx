import type { AnchorHTMLAttributes, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ChainProfileView } from "@/components/chain/chain-profile-view";
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

describe("ChainProfileView", () => {
  it("renders readiness sections, roadmap fit, unified competitive analysis, and recommended stack", () => {
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
      screen.getByText("Current stage and best score lever"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Roadmap fit, gaps, score drivers, peers, and stack"),
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
    expect(screen.getAllByText("Atlas score lift").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Target Atlas lift").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Diagnostic gap").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Activation plan").length).toBeGreaterThan(0);
    expect(
      screen
        .getByText("Roadmap fit, gaps, score drivers, peers, and stack")
        .closest("details"),
    ).not.toHaveAttribute("open");
    expect(
      screen.getByText("AI Agents modules").closest("details"),
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
    expect(screen.getAllByText("7-module diagnosis").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "Open diagnosis" }),
    ).toHaveAttribute("href", "#liquid-staking-diagnosis");
    expect(
      screen.getAllByText("7-module diagnosis")[0]?.closest("details"),
    ).not.toHaveAttribute("open");
    expect(screen.getByText("LST market snapshot").closest("details")).not.toHaveAttribute(
      "open",
    );
    expect(screen.getAllByText("Liquidity & Exit").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Stress Resilience").length).toBeGreaterThan(0);
  });
});
