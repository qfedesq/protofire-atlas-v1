import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  buildEconomyRankingExport,
  buildEconomyRankingExportCsv,
  buildEconomyReportMarkdown,
  buildGlobalChainRankingExportCsv,
  buildHighTvlLaggingChainsReportMarkdown,
  buildLiquidStakingLandscapeReportMarkdown,
  buildTopEcosystemOpportunitiesReportMarkdown,
  buildTopTargetAccountsExportCsv,
  buildTargetChainsByEconomyReportMarkdown,
} from "@/lib/reports/report-generator";

const workspaceRoot = process.cwd();
const reportsDirectory = join(workspaceRoot, "reports");
const exportsDirectory = join(reportsDirectory, "exports");
const topLevelExportsDirectory = join(workspaceRoot, "exports");

mkdirSync(exportsDirectory, { recursive: true });
mkdirSync(topLevelExportsDirectory, { recursive: true });

const reportFiles = [
  {
    path: join(reportsDirectory, "ai-agent-readiness-report.md"),
    content: buildEconomyReportMarkdown("ai-agents"),
  },
  {
    path: join(reportsDirectory, "defi-infrastructure-readiness-report.md"),
    content: buildEconomyReportMarkdown("defi-infrastructure"),
  },
  {
    path: join(reportsDirectory, "liquid-staking-landscape-report.md"),
    content: buildLiquidStakingLandscapeReportMarkdown(),
  },
  {
    path: join(reportsDirectory, "target-chains-by-economy.md"),
    content: buildTargetChainsByEconomyReportMarkdown(),
  },
  {
    path: join(reportsDirectory, "high-tvl-lagging-chains.md"),
    content: buildHighTvlLaggingChainsReportMarkdown(),
  },
  {
    path: join(reportsDirectory, "top-ecosystem-opportunities.md"),
    content: buildTopEcosystemOpportunitiesReportMarkdown(),
  },
];

reportFiles.forEach((reportFile) => {
  writeFileSync(reportFile.path, `${reportFile.content}\n`);
});

const exportFiles = [
  {
    path: join(exportsDirectory, "ai-agents-ranking.json"),
    content: buildEconomyRankingExport("ai-agents"),
  },
  {
    path: join(exportsDirectory, "defi-infrastructure-ranking.json"),
    content: buildEconomyRankingExport("defi-infrastructure"),
  },
  {
    path: join(exportsDirectory, "rwa-infrastructure-ranking.json"),
    content: buildEconomyRankingExport("rwa-infrastructure"),
  },
  {
    path: join(exportsDirectory, "prediction-markets-ranking.json"),
    content: buildEconomyRankingExport("prediction-markets"),
  },
  {
    path: join(exportsDirectory, "ai-agents-ranking.csv"),
    content: buildEconomyRankingExportCsv("ai-agents"),
  },
  {
    path: join(exportsDirectory, "defi-infrastructure-ranking.csv"),
    content: buildEconomyRankingExportCsv("defi-infrastructure"),
  },
  {
    path: join(exportsDirectory, "rwa-infrastructure-ranking.csv"),
    content: buildEconomyRankingExportCsv("rwa-infrastructure"),
  },
  {
    path: join(exportsDirectory, "prediction-markets-ranking.csv"),
    content: buildEconomyRankingExportCsv("prediction-markets"),
  },
  {
    path: join(topLevelExportsDirectory, "global-chain-ranking.csv"),
    content: buildGlobalChainRankingExportCsv(),
  },
  {
    path: join(topLevelExportsDirectory, "top-target-accounts.csv"),
    content: buildTopTargetAccountsExportCsv(),
  },
];

exportFiles.forEach((exportFile) => {
  const content =
    typeof exportFile.content === "string"
      ? exportFile.content
      : JSON.stringify(exportFile.content, null, 2);

  writeFileSync(exportFile.path, `${content}\n`);
});

console.log(`Generated ${reportFiles.length} reports and ${exportFiles.length} exports.`);
