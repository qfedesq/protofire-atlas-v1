import { describe, expect, it } from "vitest";

import { economyTypes } from "@/lib/config/economies";
import { buildEconomyReadinessSummary } from "@/lib/utils/economy-summary";

describe("buildEconomyReadinessSummary", () => {
  it("normalizes the economy label and module list for chain page headers", () => {
    const aiAgents = economyTypes.find((economy) => economy.slug === "ai-agents");
    const defi = economyTypes.find(
      (economy) => economy.slug === "defi-infrastructure",
    );
    const rwa = economyTypes.find(
      (economy) => economy.slug === "rwa-infrastructure",
    );
    const predictionMarkets = economyTypes.find(
      (economy) => economy.slug === "prediction-markets",
    );

    if (!aiAgents || !defi || !rwa || !predictionMarkets) {
      throw new Error("Expected all seeded economies");
    }

    expect(buildEconomyReadinessSummary(aiAgents)).toBe(
      "AI Agents Readiness: Registry, Payments, Indexing, Security",
    );
    expect(buildEconomyReadinessSummary(defi)).toBe(
      "DeFi Infrastructure Readiness: Liquid Staking Infrastructure, Lending Infrastructure, Liquidity Layer, Oracle Infrastructure, Indexing Layer",
    );
    expect(buildEconomyReadinessSummary(rwa)).toBe(
      "RWA Infrastructure Readiness: Asset Registry, Compliance Layer, Oracle Feeds, Settlement Infrastructure",
    );
    expect(buildEconomyReadinessSummary(predictionMarkets)).toBe(
      "Prediction Markets Readiness: Oracle Layer, Market Contracts, Indexing Infrastructure, Liquidity Integration",
    );
  });
});
