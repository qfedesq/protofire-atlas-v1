import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("embed pages", () => {
  it("renders the global ranking embed", async () => {
    const pageModule = await import("@/app/embed/rankings/global/page");

    render(pageModule.default());

    expect(screen.getByText("Global Chain Ranking")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });

  it("renders the chain scorecard embed", async () => {
    const pageModule = await import("@/app/embed/chains/[slug]/scorecard/page");
    const view = await pageModule.default({
      params: Promise.resolve({ slug: "base" }),
      searchParams: Promise.resolve({}),
    });

    render(view);

    expect(screen.getByText(/Share-ready summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Base · AI Agents/i)).toBeInTheDocument();
  });
});
