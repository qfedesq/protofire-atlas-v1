import { describe, expect, it } from "vitest";

import {
  parseGlobalRankingsQuery,
  parseRankingsQuery,
  parseTargetAccountsQuery,
} from "@/lib/domain/schemas";

describe("rankings query parsing", () => {
  it("uses safe defaults when params are missing", () => {
    const query = parseRankingsQuery(undefined);

    expect(query).toEqual({
      economy: "ai-agents",
      q: "",
      category: "All",
      sort: "totalScore",
      direction: "desc",
    });
  });

  it("normalizes the first value when arrays are passed in search params", () => {
    const query = parseRankingsQuery({
      economy: ["prediction-markets", "ignored"],
      q: ["base", "ignored"],
      category: ["L2"],
      sort: ["indexing"],
      direction: ["asc"],
    });

    expect(query).toEqual({
      economy: "prediction-markets",
      q: "base",
      category: "L2",
      sort: "indexing",
      direction: "asc",
    });
  });

  it("falls back to total score when the selected economy does not support the requested sort key", () => {
    const query = parseRankingsQuery({
      economy: "rwa-infrastructure",
      sort: "liquid-staking",
    });

    expect(query.sort).toBe("totalScore");
  });

  it("parses global ranking query params with safe defaults", () => {
    const query = parseGlobalRankingsQuery({
      sort: ["ecosystemScore"],
      direction: ["asc"],
    });

    expect(query).toEqual({
      sort: "ecosystemScore",
      direction: "asc",
    });
  });

  it("parses target-account query params with safe defaults", () => {
    const query = parseTargetAccountsQuery(undefined);

    expect(query).toEqual({
      sort: "opportunityScore",
      direction: "desc",
    });
  });
});
