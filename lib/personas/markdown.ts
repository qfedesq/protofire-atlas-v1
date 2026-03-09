import type { BuyerPersonaInput, BuyerPersonaRecord } from "@/lib/domain/types";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildPersonaMarkdownPath(input: BuyerPersonaInput) {
  const organization = slugify(input.organizationName ?? input.chainSlug);
  const persona = slugify(`${input.personName}-${input.personTitle}`);

  return {
    organization,
    relativePath: `${organization}/${persona}.md`,
  };
}

export function buildPersonaMarkdown(record: BuyerPersonaRecord) {
  const { empathyMap, successMetrics, leanCanvas, sourceSummary } =
    record.structuredData;

  return [
    `# ${record.personName}`,
    "",
    `Organization: ${record.organization}`,
    `Title: ${record.personTitle}`,
    `Chain: ${record.chainSlug}`,
    record.protocolUrl ? `Protocol URL: ${record.protocolUrl}` : null,
    record.linkedinProfile ? `LinkedIn: ${record.linkedinProfile}` : null,
    record.twitterHandle ? `Twitter: ${record.twitterHandle}` : null,
    record.githubProfile ? `GitHub: ${record.githubProfile}` : null,
    record.notes ? `Notes: ${record.notes}` : null,
    "",
    "## EMPATHY MAP",
    "",
    "### What do they hear",
    ...empathyMap.hear.map((item) => `- ${item}`),
    "",
    "### What do they fear (top 3)",
    ...empathyMap.fearTop3.map((item) => `- ${item}`),
    "",
    "### What do they want (top 3)",
    ...empathyMap.wantTop3.map((item) => `- ${item}`),
    "",
    "### What do they need (top 3)",
    ...empathyMap.needTop3.map((item) => `- ${item}`),
    "",
    "### What are their pains (top 3)",
    ...empathyMap.painsTop3.map((item) => `- ${item}`),
    "",
    "### Expected gains (top 3)",
    ...empathyMap.expectedGainsTop3.map((item) => `- ${item}`),
    "",
    "## SUCCESS METRICS",
    "",
    "### Top 3 KPIs",
    ...successMetrics.topKpis.map((item) => `- ${item}`),
    "",
    "### Organization OKRs (next 6–12 months)",
    ...successMetrics.organizationOkrs.map((item) => `- ${item}`),
    "",
    "## LEAN CANVAS",
    "",
    `Problem: ${leanCanvas.problem}`,
    `Solution: ${leanCanvas.solution}`,
    `Value proposition: ${leanCanvas.valueProposition}`,
    `Competitors: ${leanCanvas.competitors}`,
    `Strategy: ${leanCanvas.strategy}`,
    `Growth drivers: ${leanCanvas.growthDrivers}`,
    "",
    "## Sources",
    ...sourceSummary.map((item) => `- ${item}`),
    "",
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}
