import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("global ranking page", () => {
  it("renders the public global chain leaderboard", async () => {
    const pageModule = await import("@/app/rankings/global/page");
    const view = await pageModule.default({
      searchParams: Promise.resolve({}),
    });

    render(view);

    expect(screen.getByText("Holistic chain leaderboard")).toBeInTheDocument();
    expect(
      screen.getByText(
        /This ranking combines infrastructure readiness across the active economies/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /AI Agents Readiness/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", {
        name: /DeFi Liquid Staking Infrastructure/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /RWA Asset Registry/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Performance Score/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /Block Time/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ethereum" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Sort Global Score descending" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Columns")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Atlas uses a curated snapshot and active scoring assumptions/i),
    ).not.toBeInTheDocument();
  });
});
