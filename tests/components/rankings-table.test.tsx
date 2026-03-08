import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RankingsTable } from "@/components/tables/rankings-table";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

describe("RankingsTable", () => {
  it("renders ranked chains with module status columns", () => {
    const repository = createSeedChainsRepository();
    const rows = repository.listRankedChains({
      economy: "ai-agents",
      sort: "name",
      direction: "asc",
    });
    const economy = repository.listEconomies().find((item) => item.slug === "ai-agents");

    if (!economy) {
      throw new Error("Expected seeded AI economy config");
    }

    render(
      <RankingsTable
        economy={economy}
        rows={rows}
        sort="totalScore"
        direction="desc"
        buildSortHref={(sortKey, sortDirection) =>
          `/?economy=ai-agents&sort=${sortKey}&direction=${sortDirection}`
        }
      />,
    );

    expect(screen.getByText("Arbitrum")).toBeInTheDocument();
    expect(screen.getByText("Base")).toBeInTheDocument();
    expect(screen.getAllByText("Registry")).not.toHaveLength(0);
    expect(screen.getAllByText("available").length).toBeGreaterThan(0);
    expect(screen.getByText("#2")).toBeInTheDocument();
    expect(screen.getByText(/source TVL rank #5/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Roadmap stage:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Offer fit:/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "Sort Chain ascending" }),
    ).toHaveAttribute("href", "/?economy=ai-agents&sort=name&direction=asc");
    expect(
      screen.getByRole("link", { name: "Sort Readiness descending" }),
    ).toHaveAttribute(
      "href",
      "/?economy=ai-agents&sort=totalScore&direction=desc",
    );
    expect(
      screen.queryByRole("link", { name: /Sort Rank/i }),
    ).not.toBeInTheDocument();
    const rankHeader = screen.getByRole("columnheader", { name: "Rank" });
    expect(rankHeader).toHaveClass("sticky");
    expect(rankHeader).toHaveClass("top-0");
    expect(screen.queryByText(/Gap to leader:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/% weight/i)).not.toBeInTheDocument();
  });

  it("renders an empty state when no rows match", () => {
    const repository = createSeedChainsRepository();
    const economy = repository.listEconomies().find((item) => item.slug === "ai-agents");

    if (!economy) {
      throw new Error("Expected seeded AI economy config");
    }

    render(
      <RankingsTable
        economy={economy}
        rows={[]}
        sort="totalScore"
        direction="desc"
        buildSortHref={(sortKey, sortDirection) =>
          `/?economy=ai-agents&sort=${sortKey}&direction=${sortDirection}`
        }
      />,
    );

    expect(
      screen.getByText(
        "No chains are available for AI Agents in the current Atlas dataset.",
      ),
    ).toBeInTheDocument();
  });
});
