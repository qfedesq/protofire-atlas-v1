export const chainCategories = ["L1", "L2"] as const;
export const chainRecordStatuses = ["active", "inactive"] as const;
export const chainSourceCategories = ["EVM"] as const;
export const chainSourceMetrics = ["TVL"] as const;
export const chainSourceProviders = ["DeFiLlama"] as const;
export const economyTypeSlugs = [
  "ai-agents",
  "defi-infrastructure",
  "rwa-infrastructure",
  "prediction-markets",
] as const;
export const moduleAvailabilityStatuses = [
  "missing",
  "partial",
  "available",
] as const;
export const rankingsSortDirections = ["asc", "desc"] as const;
export const rankingsBaseSortKeys = ["totalScore", "name"] as const;

export type ChainCategory = (typeof chainCategories)[number];
export type ChainRecordStatus = (typeof chainRecordStatuses)[number];
export type ChainSourceCategory = (typeof chainSourceCategories)[number];
export type ChainSourceMetric = (typeof chainSourceMetrics)[number];
export type ChainSourceProvider = (typeof chainSourceProviders)[number];
export type EconomyTypeSlug = (typeof economyTypeSlugs)[number];
export type ModuleAvailabilityStatus =
  (typeof moduleAvailabilityStatuses)[number];
export type RankingsSortDirection = (typeof rankingsSortDirections)[number];
export type RankingsBaseSortKey = (typeof rankingsBaseSortKeys)[number];
export type EconomyModuleSlug = string;
export type RankingsSortKey = RankingsBaseSortKey | EconomyModuleSlug;
export type RankingsCategoryFilter = "All" | ChainCategory;

export type Chain = {
  id: string;
  slug: string;
  name: string;
  sourceName: string;
  sourceRank: number;
  sourceGlobalRank?: number;
  sourceCategory: ChainSourceCategory;
  sourceMetric: ChainSourceMetric;
  sourceProvider: ChainSourceProvider;
  sourceSnapshotDate: string;
  sourceTvlUsd: number;
  category: ChainCategory;
  website?: string;
  shortDescription: string;
  status: ChainRecordStatus;
};

export type ChainCatalogSeed = {
  id: string;
  slug: string;
  name: string;
  sourceName: string;
  sourceRank: number;
  sourceGlobalRank?: number;
  sourceCategory: ChainSourceCategory;
  sourceMetric: ChainSourceMetric;
  sourceProvider: ChainSourceProvider;
  sourceSnapshotDate: string;
  sourceTvlUsd: number;
  category: ChainCategory;
  website?: string;
  shortDescription: string;
  status: ChainRecordStatus;
};

export type ModuleStatusSeed = {
  status: ModuleAvailabilityStatus;
  evidenceNote: string;
  rationale: string;
};

// AI-agent seed source derived from the current top-30 EVM snapshot.
export type ChainSeed = ChainCatalogSeed & {
  modules: Record<string, ModuleStatusSeed>;
};

export type ChainEconomySeedRecord = {
  chainSlug: string;
  economyType: EconomyTypeSlug;
  moduleStatuses: Record<string, ModuleStatusSeed>;
};

export type EconomyModule = {
  id: string;
  slug: EconomyModuleSlug;
  name: string;
  description: string;
  weight: number;
};

export type EconomyScoringConfig = {
  maximumScore: number;
  statusScores: Record<ModuleAvailabilityStatus, number>;
};

export type EconomyDeploymentTemplate = {
  key: string;
  name: string;
  objective: string;
};

export type EconomyRecommendationRule = {
  deploymentPhaseKey: string;
  missingTitle: string;
  partialTitle: string;
  whyItMatters: string;
  missingResult: string;
  partialResult: string;
  missingChainImpact: string;
  partialChainImpact: string;
  missingSummary: string;
  partialSummary: string;
  gapImpact: Record<Exclude<ModuleAvailabilityStatus, "available">, string>;
};

export type EconomyRecommendationConfig = {
  thresholdScore: number;
  includePartialRecommendations: boolean;
  includeMissingRecommendations: boolean;
};

export type EconomyType = {
  id: string;
  slug: EconomyTypeSlug;
  name: string;
  shortLabel: string;
  description: string;
  modules: EconomyModule[];
  scoringConfig: EconomyScoringConfig;
  recommendationConfig: EconomyRecommendationConfig;
  deploymentTemplates: EconomyDeploymentTemplate[];
  recommendationRules: Record<EconomyModuleSlug, EconomyRecommendationRule>;
};

export type ChainModuleStatus = {
  chainId: string;
  economyType: EconomyTypeSlug;
  moduleId: string;
  moduleSlug: EconomyModuleSlug;
  status: ModuleAvailabilityStatus;
  score: number;
  evidenceNote: string;
  rationale: string;
};

export type ModuleBreakdown = {
  module: EconomyModule;
  status: ModuleAvailabilityStatus;
  score: number;
  weightedContribution: number;
  evidenceNote: string;
  rationale: string;
};

export type ChainEconomyReadiness = {
  chainId: string;
  economyType: EconomyTypeSlug;
  totalScore: number;
  moduleBreakdown: ModuleBreakdown[];
};

export type GapAnalysisItem = {
  module: EconomyModule;
  status: Exclude<ModuleAvailabilityStatus, "available">;
  problem: string;
  impact: string;
};

export type RecommendationItem = {
  module: EconomyModule;
  title: string;
  whyItMatters: string;
  expectedResult: string;
  directChainImpact: string;
  deploymentPhaseKey: string;
  narrativeSummary: string;
};

export type DeploymentPhase = {
  id: string;
  key: string;
  label: string;
  title: string;
  timelineLabel: string;
  objective: string;
  tasks: string[];
};

export type RecommendedStack = {
  chainId: string;
  economyType: EconomyTypeSlug;
  recommendedModules: RecommendationItem[];
  deploymentPhases: DeploymentPhase[];
  narrativeSummary: string;
};

export type DeploymentPlan = {
  chainId: string;
  economyType: EconomyTypeSlug;
  phases: DeploymentPhase[];
  ctaText: string;
};

export type ScoreDriver = {
  module: EconomyModule;
  status: Exclude<ModuleAvailabilityStatus, "available">;
  potentialGain: number;
  currentContribution: number;
  maxContribution: number;
};

export type PeerComparisonDelta = {
  module: EconomyModule;
  currentStatus: ModuleAvailabilityStatus;
  peerStatus: ModuleAvailabilityStatus;
  weightedGap: number;
};

export type PeerComparisonItem = {
  chain: Chain;
  rank: number;
  totalScore: number;
  relativePosition: "above" | "below";
  scoreGap: number;
  decisiveModules: PeerComparisonDelta[];
};

export type RankedChain = {
  chain: Chain;
  economy: EconomyType;
  readinessScore: ChainEconomyReadiness;
  benchmarkRank: number;
  leaderGap: number;
};

export type ChainProfile = {
  chain: Chain;
  economy: EconomyType;
  readinessScore: ChainEconomyReadiness;
  gapAnalysis: GapAnalysisItem[];
  rank: number;
  leader: string;
  leaderGap: number;
  chainsOutranked: number;
  scoreDrivers: ScoreDriver[];
  peers: PeerComparisonItem[];
  recommendedStack: RecommendedStack;
  deploymentPlan: DeploymentPlan;
};

export type RankingsQuery = {
  economy: EconomyTypeSlug;
  q: string;
  category: RankingsCategoryFilter;
  sort: RankingsSortKey;
  direction: RankingsSortDirection;
  limit?: number;
};

export type RankingsSortOption = {
  value: RankingsSortKey;
  label: string;
};

export type AtlasSeedDataset = {
  chains: ChainCatalogSeed[];
  economies: EconomyType[];
  records: ChainEconomySeedRecord[];
};
