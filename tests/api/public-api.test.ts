import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { GET as getPublicChain } from "@/app/api/public/chains/[slug]/route";
import { GET as getPublicGlobalRanking } from "@/app/api/public/rankings/global/route";

describe("public API", () => {
  it("returns the public global ranking payload", async () => {
    const response = await getPublicGlobalRanking();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.atlas_version).toMatch(/^V1\./);
    expect(payload.rows[0]).toMatchObject({
      rank: expect.any(Number),
      score: expect.any(Number),
    });
    expect(payload.rows[0].economies["ai-agents"]).toBeDefined();
  });

  it("returns the public chain payload", async () => {
    const response = await getPublicChain(new NextRequest("https://atlas.test"), {
      params: Promise.resolve({ slug: "ethereum" }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.chain.slug).toBe("ethereum");
    expect(payload.global_score).toEqual(expect.any(Number));
    expect(payload.economies).toHaveLength(4);
  });
});
