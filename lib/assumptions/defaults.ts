import {
  defaultRecommendationConfig,
  economyTypes,
  moduleStatusScoreMap,
} from "@/lib/config/economies";
import { defaultLiquidStakingDiagnosticWeights } from "@/lib/config/liquid-staking-diagnosis";
import type { ActiveAssumptions } from "@/lib/assumptions/types";

export function buildDefaultAssumptionsSnapshot(): ActiveAssumptions {
  return {
    updatedAt: "2026-03-07T00:00:00.000Z",
    updatedBy: "seed",
    statusScores: moduleStatusScoreMap,
    economies: Object.fromEntries(
      economyTypes.map((economy) => [
        economy.slug,
        {
          moduleWeights: Object.fromEntries(
            economy.modules.map((module) => [module.slug, module.weight]),
          ),
          moduleDiagnosticWeights:
            economy.slug === "defi-infrastructure"
              ? {
                  "liquid-staking": defaultLiquidStakingDiagnosticWeights,
                }
              : {},
          recommendationConfig: defaultRecommendationConfig,
        },
      ]),
    ) as ActiveAssumptions["economies"],
    globalRanking: {
      componentWeights: {
        economyScore: 50,
        ecosystem: 20,
        adoption: 20,
        performance: 10,
      },
      economyCompositeWeights: {
        "ai-agents": 25,
        "defi-infrastructure": 25,
        "rwa-infrastructure": 25,
        "prediction-markets": 25,
      },
    },
    opportunityScoring: {
      weights: {
        tvlTier: 30,
        readinessGap: 30,
        stackFit: 25,
        ecosystemSignal: 15,
      },
    },
  };
}
