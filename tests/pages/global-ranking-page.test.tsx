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
        /This ranking combines infrastructure readiness across four economies/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ethereum" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Sort Global Score descending" }),
    ).toBeInTheDocument();
  });
});
