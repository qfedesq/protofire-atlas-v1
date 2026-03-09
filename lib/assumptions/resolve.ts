import { economyTypes, listEconomyTypes } from "@/lib/config/economies";
import type { ActiveAssumptions } from "@/lib/assumptions/types";
import type { EconomyType } from "@/lib/domain/types";

import { getActiveAssumptions } from "./store";

function applyAssumptionsToEconomy(
  economy: EconomyType,
  assumptions: ActiveAssumptions,
): EconomyType {
  const economyAssumptions = assumptions.economies[economy.slug];

  if (!economyAssumptions) {
    throw new Error(`Missing assumption set for ${economy.slug}.`);
  }

  return {
    ...economy,
    modules: economy.modules.map((module) => ({
      ...module,
      weight: economyAssumptions.moduleWeights[module.slug] ?? module.weight,
    })),
    scoringConfig: {
      ...economy.scoringConfig,
      maximumScore: economyAssumptions.maximumScore,
      statusScores: assumptions.statusScores,
    },
    recommendationConfig: economyAssumptions.recommendationConfig,
  };
}

export function listActiveEconomyTypes() {
  const assumptions = getActiveAssumptions();

  return listEconomyTypes().map((economy) =>
    applyAssumptionsToEconomy(economy, assumptions),
  );
}

export function getActiveEconomyTypeBySlug(slug: EconomyType["slug"]) {
  return (
    listActiveEconomyTypes().find((economy) => economy.slug === slug) ??
    applyAssumptionsToEconomy(economyTypes[0]!, getActiveAssumptions())
  );
}

export function getActiveGlobalRankingAssumptions() {
  return getActiveAssumptions().globalRanking;
}

export function getActiveOpportunityScoringAssumptions() {
  return getActiveAssumptions().opportunityScoring;
}

export function getActiveWedgeApplicabilityAssumptions() {
  return getActiveAssumptions().wedgeApplicability;
}

export function getActiveAnalysisSettings() {
  return getActiveAssumptions().analysisSettings;
}

export function getActiveProposalGeneratorSettings() {
  return getActiveAssumptions().proposalGenerator;
}
