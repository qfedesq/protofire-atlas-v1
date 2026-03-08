import type { EconomyType } from "@/lib/domain/types";

function getReadinessLabel(economy: EconomyType) {
  switch (economy.slug) {
    case "ai-agents":
    case "prediction-markets":
      return economy.shortLabel;
    default:
      return economy.name.replace(/\s+Economy$/, "");
  }
}

export function buildEconomyReadinessSummary(economy: EconomyType) {
  const moduleSummary = economy.modules.map((module) => module.name).join(", ");

  return `${getReadinessLabel(economy)} Readiness: ${moduleSummary}`;
}
