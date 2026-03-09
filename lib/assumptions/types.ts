import type {
  AnalysisSettings,
  EconomyCompositeWeights,
  EconomyRecommendationConfig,
  EconomyTypeSlug,
  GlobalRankingComponentWeights,
  GlobalRankingSubmetricWeights,
  ModuleAvailabilityStatus,
  OpportunityPriorityThresholds,
  OpportunityScoringWeights,
  OpportunityStackFitComponentWeights,
  ProposalGeneratorSettings,
  WedgeApplicabilityAssumptionSet,
} from "@/lib/domain/types";

export type ActiveStatusScores = Record<ModuleAvailabilityStatus, number>;

export type EconomyAssumptionSet = {
  maximumScore: number;
  moduleWeights: Record<string, number>;
  moduleDiagnosticWeights?: Record<string, Record<string, number>>;
  recommendationConfig: EconomyRecommendationConfig;
};

export type MetricReferenceBounds = {
  min: number;
  max: number;
};

export type GlobalRankingAssumptionSet = {
  componentWeights: GlobalRankingComponentWeights;
  economyCompositeWeights: EconomyCompositeWeights;
  ecosystemSubweights: Pick<
    GlobalRankingSubmetricWeights,
    "protocols" | "ecosystemProjects"
  >;
  adoptionSubweights: Pick<
    GlobalRankingSubmetricWeights,
    "wallets" | "activeUsers"
  >;
  performanceSubweights: Pick<
    GlobalRankingSubmetricWeights,
    "averageTransactionSpeed" | "blockTime" | "throughputIndicator"
  >;
  referenceBounds?: {
    protocols?: MetricReferenceBounds;
    ecosystemProjects?: MetricReferenceBounds;
    wallets?: MetricReferenceBounds;
    activeUsers?: MetricReferenceBounds;
    averageTransactionSpeed?: MetricReferenceBounds;
    blockTime?: MetricReferenceBounds;
    throughputIndicator?: MetricReferenceBounds;
  };
};

export type OpportunityScoringAssumptionSet = {
  weights: OpportunityScoringWeights;
  stackFitComponents: OpportunityStackFitComponentWeights;
  priorityThresholds: OpportunityPriorityThresholds;
};

export type ActiveAssumptions = {
  updatedAt: string;
  updatedBy: string;
  statusScores: ActiveStatusScores;
  economies: Record<EconomyTypeSlug, EconomyAssumptionSet>;
  globalRanking: GlobalRankingAssumptionSet;
  opportunityScoring: OpportunityScoringAssumptionSet;
  wedgeApplicability: WedgeApplicabilityAssumptionSet;
  analysisSettings: AnalysisSettings;
  proposalGenerator: ProposalGeneratorSettings;
};
