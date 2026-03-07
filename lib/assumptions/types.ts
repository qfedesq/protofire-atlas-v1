import type {
  EconomyRecommendationConfig,
  EconomyTypeSlug,
  ModuleAvailabilityStatus,
} from "@/lib/domain/types";

export type ActiveStatusScores = Record<ModuleAvailabilityStatus, number>;

export type EconomyAssumptionSet = {
  moduleWeights: Record<string, number>;
  recommendationConfig: EconomyRecommendationConfig;
};

export type ActiveAssumptions = {
  updatedAt: string;
  updatedBy: string;
  statusScores: ActiveStatusScores;
  economies: Record<EconomyTypeSlug, EconomyAssumptionSet>;
};
