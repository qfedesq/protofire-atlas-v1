import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("home page", () => {
  it("renders the one-page global ranking with economy breakdown columns", async () => {
    const pageModule = await import("@/app/page");
    const view = await pageModule.default({
      searchParams: Promise.resolve({}),
    });

    render(view);

    expect(
      screen.getByText("Holistic chain leaderboard"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/One global ranking, with the active economy readiness models/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /AI Agents Readiness/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /DeFi Readiness/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /RWA Readiness/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", {
        name: /Prediction Markets Readiness/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Performance Score/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Collapse Global Score/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /RWA Asset Registry/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /AI Agents Registry/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /Avg Tx Speed/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Sort Chain ascending" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add my chain/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Columns")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Sort Global Score descending" }),
    ).toHaveAttribute("href", "/#global-ranking");
    expect(screen.queryByText("Current ranking")).not.toBeInTheDocument();
    expect(screen.queryByText(/Dataset basis:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/30 seeded chains/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/4 economy wedges/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/0 runtime AI/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Open global chain ranking/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Required modules")).not.toBeInTheDocument();
    expect(screen.queryByText("Deployment sequencing")).not.toBeInTheDocument();
    expect(screen.queryByText("7-module LST weights")).not.toBeInTheDocument();
  });
});
