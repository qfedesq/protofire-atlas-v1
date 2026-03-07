import { describe, expect, it } from "vitest";

import {
  buildEconomyRankingExport,
  buildEconomyRankingExportCsv,
  buildEconomyReportMarkdown,
  buildHighTvlLaggingChainsReportMarkdown,
  buildLiquidStakingLandscapeReportMarkdown,
  buildTargetChainsByEconomyReportMarkdown,
} from "@/lib/reports/report-generator";

describe("report generator", () => {
  it("builds economy reports with dataset basis and ranking sections", () => {
    const report = buildEconomyReportMarkdown("ai-agents");

    expect(report).toContain("# AI Agent Economy readiness report");
    expect(report).toContain("Dataset: Top 30 EVM chains by TVL");
    expect(report).toContain("Source provider: DeFiLlama");
    expect(report).toContain("## Top chains");
    expect(report).toContain("## Protofire opportunity framing");
  });

  it("exports one ranking row per chain for an economy", () => {
    const rows = buildEconomyRankingExport("defi-infrastructure");
    const csv = buildEconomyRankingExportCsv("defi-infrastructure");

    expect(rows).toHaveLength(30);
    expect(rows[0]).toMatchObject({
      sourceRank: 1,
      readinessRank: 1,
    });
    expect(rows[0]?.modules).toHaveProperty("liquid-staking");
    expect(csv).toContain("chain,slug,source_rank,readiness_rank,total_score");
    expect(csv).toContain("liquid-staking_status");
  });

  it("builds a dedicated liquid staking landscape report for the DeFi wedge", () => {
    const report = buildLiquidStakingLandscapeReportMarkdown();

    expect(report).toContain("# Liquid staking landscape report");
    expect(report).toContain("Liquid staking is treated as a first-class DeFi primitive");
    expect(report).toContain("## Highest-priority liquid staking opportunities");
    expect(report).toContain("Protofire opportunity framing");
  });

  it("builds GTM target and lagging-chain reports", () => {
    const targetReport = buildTargetChainsByEconomyReportMarkdown();
    const laggingReport = buildHighTvlLaggingChainsReportMarkdown();

    expect(targetReport).toContain("# Target chains by economy");
    expect(targetReport).toContain("## AI Agent Economy");
    expect(laggingReport).toContain("# High-TVL lagging chains");
    expect(laggingReport).toContain("## DeFi Infrastructure Economy");
  });
});
