import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("home page", () => {
  it("renders the one-page economy overview and ranking sections", async () => {
    const pageModule = await import("@/app/page");
    const view = await pageModule.default({
      searchParams: Promise.resolve({
        economy: "defi-infrastructure",
      }),
    });

    render(view);

    expect(
      screen.getByText("DeFi Infrastructure Economy"),
    ).toBeInTheDocument();
    expect(screen.getByText("Required modules")).toBeInTheDocument();
    expect(screen.getByText("Deployment sequencing")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Sort Chain ascending" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Sort Readiness descending" }),
    ).toHaveAttribute(
      "href",
      "/?economy=defi-infrastructure&sort=totalScore&direction=desc",
    );
    expect(screen.queryByText("Current ranking")).not.toBeInTheDocument();
    expect(screen.queryByText(/leaderboard/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Dataset basis:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/30 seeded chains/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/4 economy wedges/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/0 runtime AI/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Scores reflect the current Atlas dataset/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Search")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Category")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Sort by")).not.toBeInTheDocument();
  });
});
