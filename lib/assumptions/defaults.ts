import {
  defaultRecommendationConfig,
  economyTypes,
  moduleStatusScoreMap,
} from "@/lib/config/economies";
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
          recommendationConfig: defaultRecommendationConfig,
        },
      ]),
    ) as ActiveAssumptions["economies"],
  };
}
