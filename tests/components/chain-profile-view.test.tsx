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
  it("renders the chain page as four public decision blocks", () => {
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

    expect(screen.getByText("Ranking")).toBeInTheDocument();
    expect(screen.getByText("What’s missing")).toBeInTheDocument();
    expect(screen.getAllByText("What Protofire can deploy").length).toBeGreaterThan(0);
    expect(screen.getByText("Expected impact")).toBeInTheDocument();
    expect(
      screen.getByText("AI Agents Readiness: Registry, Payments, Indexing, Security"),
    ).toBeInTheDocument();
    expect(screen.getByText("Rank #3 for AI Agents")).toBeInTheDocument();
    expect(
      screen.getAllByText("Upgrade Agent Indexing Layer").length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("How the score is built")).toBeInTheDocument();
    expect(screen.getByText("Current module notes")).toBeInTheDocument();
    expect(screen.getByText("What is still limiting the score")).toBeInTheDocument();
    expect(screen.getByText("Recommended stack")).toBeInTheDocument();
    expect(screen.getByText("Deployment plan")).toBeInTheDocument();
    expect(screen.getByText("How this chain compares")).toBeInTheDocument();
    expect(screen.getByText("Broader ecosystem position")).toBeInTheDocument();
    expect(
      screen.getByText("Request infrastructure assessment"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Direct chain impact").length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText(/Source TVL rank/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Open suggested activations" }),
    ).toHaveAttribute("href", "#suggested-activations");
    expect(screen.getAllByText("Atlas score lift").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Target Atlas lift").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Diagnostic gap").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Activation plan").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Ranking").closest("details"),
    ).toHaveAttribute("open");
    expect(
      screen.getByText("What’s missing").closest("details"),
    ).toHaveAttribute("open");
    expect(
      screen.getAllByText("What Protofire can deploy")[0]?.closest("details"),
    ).toHaveAttribute("open");
    expect(
      screen.getByText("Expected impact").closest("details"),
      ).toHaveAttribute("open");
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
    expect(screen.getAllByText("DeFi liquid staking blockers").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "Open diagnosis" }),
    ).toHaveAttribute("href", "#liquid-staking-diagnosis");
    expect(
      screen.getByText(
        "DeFi Infrastructure Readiness: Liquid Staking Infrastructure, Lending Infrastructure, Liquidity Layer, Oracle Infrastructure, Indexing Layer",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Liquidity & Exit").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Stress Resilience").length).toBeGreaterThan(0);
  });
});
