import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { GET as getEconomyBadge } from "@/app/badge/chains/[slug]/[economy]/route";
import { GET as getGlobalBadge } from "@/app/badge/chains/[slug]/global/route";

describe("badge routes", () => {
  it("renders a global badge as SVG", async () => {
    const response = await getGlobalBadge(new NextRequest("https://atlas.test"), {
      params: Promise.resolve({ slug: "ethereum" }),
    });
    const svg = await response.text();

    expect(response.headers.get("content-type")).toContain("image/svg+xml");
    expect(svg).toContain("Ethereum Global Score");
  });

  it("renders an economy badge as SVG", async () => {
    const response = await getEconomyBadge(new NextRequest("https://atlas.test"), {
      params: Promise.resolve({ slug: "ethereum", economy: "ai-agents" }),
    });
    const svg = await response.text();

    expect(response.headers.get("content-type")).toContain("image/svg+xml");
    expect(svg).toContain("AI Agents Rank");
  });
});
