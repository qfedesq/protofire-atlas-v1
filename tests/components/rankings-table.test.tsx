import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createEconomyRankingColumns } from "@/components/tables/ranking-column-definitions";
import { RankingsTable } from "@/components/tables/rankings-table";
import { getDefaultVisibleColumnIds } from "@/lib/rankings/table";
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

    const columns = createEconomyRankingColumns(economy);

    render(
      <RankingsTable
        economy={economy}
        rows={rows}
        sort="totalScore"
        direction="desc"
        visibleColumnIds={getDefaultVisibleColumnIds(columns)}
        buildSortHref={(sortKey, sortDirection) =>
          `/?economy=ai-agents&sort=${sortKey}&direction=${sortDirection}`
        }
        buildColumnsHref={(columnIds) =>
          `/?economy=ai-agents&columns=${columnIds.join(",")}`
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
    expect(screen.getAllByText("More details").length).toBeGreaterThan(0);
    const arbitrumCell = screen
      .getByRole("link", { name: "Arbitrum" })
      .closest("td");

    if (!arbitrumCell) {
      throw new Error("Expected Arbitrum table cell");
    }

    expect(
      within(arbitrumCell)
        .getAllByRole("link")
        .some((link) =>
          link.getAttribute("href")?.includes(
            "/chains/arbitrum?economy=ai-agents#suggested-activations",
          ),
        ),
    ).toBe(true);
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
    const chainHeader = screen.getByRole("columnheader", { name: /Chain/i });
    expect(chainHeader).toHaveClass("sticky");
    expect(chainHeader).toHaveClass("top-0");
    expect(screen.queryByText(/Gap to leader:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/% weight/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/DeFiLlama snapshot 2026-03-07/i)).not.toBeInTheDocument();
    expect(screen.getByText("Columns")).toBeInTheDocument();
  });

  it("renders an empty state when no rows match", () => {
    const repository = createSeedChainsRepository();
    const economy = repository.listEconomies().find((item) => item.slug === "ai-agents");

    if (!economy) {
      throw new Error("Expected seeded AI economy config");
    }

    const columns = createEconomyRankingColumns(economy);

    render(
      <RankingsTable
        economy={economy}
        rows={[]}
        sort="totalScore"
        direction="desc"
        visibleColumnIds={getDefaultVisibleColumnIds(columns)}
        buildSortHref={(sortKey, sortDirection) =>
          `/?economy=ai-agents&sort=${sortKey}&direction=${sortDirection}`
        }
        buildColumnsHref={(columnIds) =>
          `/?economy=ai-agents&columns=${columnIds.join(",")}`
        }
      />,
    );

    expect(
      screen.getByText(
        "No chains are available for AI Agents in the current Atlas dataset.",
      ),
    ).toBeInTheDocument();
  });

  it("renders only the selected visible columns from the shared ranking system", () => {
    const repository = createSeedChainsRepository();
    const economy = repository.listEconomies().find((item) => item.slug === "ai-agents");

    if (!economy) {
      throw new Error("Expected seeded AI economy config");
    }

    const view = render(
      <RankingsTable
        economy={economy}
        rows={repository.listRankedChains({
          economy: "ai-agents",
          sort: "totalScore",
          direction: "desc",
        })}
        sort="totalScore"
        direction="desc"
        visibleColumnIds={["chain", "readiness", "registry", "payments"]}
        buildSortHref={(sortKey, sortDirection) =>
          `/?economy=ai-agents&sort=${sortKey}&direction=${sortDirection}`
        }
        buildColumnsHref={(columnIds) =>
          `/?economy=ai-agents&columns=${columnIds.join(",")}`
        }
      />,
    );

    const scoped = within(view.container);

    expect(
      scoped.getAllByRole("link", { name: "Sort Registry descending" }).length,
    ).toBeGreaterThan(0);
    expect(
      scoped.getAllByRole("columnheader", { name: /Registry/i }).length,
    ).toBeGreaterThan(0);
    expect(
      scoped.queryByRole("link", { name: "Sort Indexing descending" }),
    ).not.toBeInTheDocument();
    expect(
      scoped.queryByRole("link", { name: "Sort Security descending" }),
    ).not.toBeInTheDocument();
  });
});
