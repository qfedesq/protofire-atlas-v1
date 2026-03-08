import type {
  EconomyCompositeWeights,
  EconomyRecommendationConfig,
  EconomyTypeSlug,
  GlobalRankingComponentWeights,
  ModuleAvailabilityStatus,
  OpportunityScoringWeights,
} from "@/lib/domain/types";

export type ActiveStatusScores = Record<ModuleAvailabilityStatus, number>;

export type EconomyAssumptionSet = {
  moduleWeights: Record<string, number>;
  moduleDiagnosticWeights?: Record<string, Record<string, number>>;
  recommendationConfig: EconomyRecommendationConfig;
};

export type GlobalRankingAssumptionSet = {
  componentWeights: GlobalRankingComponentWeights;
  economyCompositeWeights: EconomyCompositeWeights;
};

export type OpportunityScoringAssumptionSet = {
  weights: OpportunityScoringWeights;
};

export type ActiveAssumptions = {
  updatedAt: string;
  updatedBy: string;
  statusScores: ActiveStatusScores;
  economies: Record<EconomyTypeSlug, EconomyAssumptionSet>;
  globalRanking: GlobalRankingAssumptionSet;
  opportunityScoring: OpportunityScoringAssumptionSet;
};
