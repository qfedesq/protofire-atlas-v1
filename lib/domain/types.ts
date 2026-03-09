export const chainCategories = ["L1", "L2"] as const;
export const chainRecordStatuses = ["active", "inactive"] as const;
export const chainSourceCategories = ["EVM"] as const;
export const chainSourceMetrics = ["TVL"] as const;
export const chainSourceProviders = ["DeFiLlama"] as const;
export const chainRoadmapSourceKinds = [
  "official-roadmap",
  "official-updates",
  "official-docs",
  "not-public",
] as const;
export const economyTypeSlugs = [
  "ai-agents",
  "defi-infrastructure",
  "rwa-infrastructure",
  "prediction-markets",
] as const;
export const liquidStakingDiagnosticSlugs = [
  "liquidity-exit",
  "peg-stability",
  "defi-moneyness",
  "security-governance",
  "validator-decentralization",
  "incentive-sustainability",
  "stress-resilience",
] as const;
export const externalMetricKeys = [
  "tvlUsd",
  "wallets",
  "activeUsers",
  "transactions",
  "protocols",
  "ecosystemProjects",
  "averageTransactionSpeed",
  "blockTime",
  "throughputIndicator",
] as const;
export const capabilitySupportLevels = [
  "supported",
  "limited",
  "unsupported",
  "unknown",
] as const;
export const dataConfidenceLevels = ["low", "medium", "high"] as const;
export const wedgeApplicabilityStatuses = [
  "applicable",
  "partially_applicable",
  "not_applicable",
  "unknown",
] as const;
export const applicabilityRequirementLevels = [
  "required",
  "preferred",
  "optional",
] as const;
export const chainAnalysisStatuses = [
  "queued",
  "running",
  "completed",
  "failed",
] as const;
export const analysisExecutionModes = ["live", "mock"] as const;
export const moduleAvailabilityStatuses = [
  "missing",
  "partial",
  "available",
] as const;
export const rankingsSortDirections = ["asc", "desc"] as const;
export const rankingsBaseSortKeys = ["totalScore", "name"] as const;
export const globalRankingsSortKeys = [
  "totalScore",
  "economyCompositeScore",
  "ecosystemScore",
  "adoptionScore",
  "performanceScore",
  "name",
] as const;
export const targetAccountSortKeys = [
  "opportunityScore",
  "readinessGap",
  "ecosystemScore",
  "name",
] as const;

export type ChainCategory = (typeof chainCategories)[number];
export type ChainRecordStatus = (typeof chainRecordStatuses)[number];
export type ChainSourceCategory = (typeof chainSourceCategories)[number];
export type ChainSourceMetric = (typeof chainSourceMetrics)[number];
export type ChainSourceProvider = (typeof chainSourceProviders)[number];
export type ChainRoadmapSourceKind = (typeof chainRoadmapSourceKinds)[number];
export type EconomyTypeSlug = (typeof economyTypeSlugs)[number];
export type LiquidStakingDiagnosticSlug =
  (typeof liquidStakingDiagnosticSlugs)[number];
export type ExternalMetricKey = (typeof externalMetricKeys)[number];
export type CapabilitySupportLevel = (typeof capabilitySupportLevels)[number];
export type DataConfidenceLevel = (typeof dataConfidenceLevels)[number];
export type WedgeApplicabilityStatus = (typeof wedgeApplicabilityStatuses)[number];
export type ApplicabilityRequirementLevel =
  (typeof applicabilityRequirementLevels)[number];
export type ChainAnalysisStatus = (typeof chainAnalysisStatuses)[number];
export type AnalysisExecutionMode = (typeof analysisExecutionModes)[number];
export type ModuleAvailabilityStatus =
  (typeof moduleAvailabilityStatuses)[number];
export type RankingsSortDirection = (typeof rankingsSortDirections)[number];
export type RankingsBaseSortKey = (typeof rankingsBaseSortKeys)[number];
export type GlobalRankingsSortKey = (typeof globalRankingsSortKeys)[number];
export type TargetAccountSortKey = (typeof targetAccountSortKeys)[number];
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
  roadmap: ChainRoadmap;
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

export type ChainRoadmapSeed = {
  chainSlug: string;
  sourceKind: ChainRoadmapSourceKind;
  sourceLabel: string;
  sourceUrl?: string;
  snapshotDate: string;
  stageLabel: string;
  stageSummary: string;
  atlasFitSummary: string;
};

export type ChainRoadmap = Omit<ChainRoadmapSeed, "chainSlug">;

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

export type LiquidStakingDiagnosticDimension = {
  id: string;
  slug: LiquidStakingDiagnosticSlug;
  name: string;
  description: string;
  defaultWeight: number;
};

export type LiquidStakingDiagnosisSeed = {
  scores: Record<LiquidStakingDiagnosticSlug, number>;
};

export type LiquidStakingDiagnosisItem = {
  dimension: LiquidStakingDiagnosticDimension;
  weight: number;
  score: number;
  rationale: string;
  risk: string;
};

export type LiquidStakingDiagnosis = {
  weightedScore: number;
  dimensions: LiquidStakingDiagnosisItem[];
};

export type LiquidStakingMetricSource = {
  metric: string;
  provider: string;
  url: string;
  snapshotDate: string;
  status: "captured" | "pending" | "not-applicable";
  note: string;
};

export type LiquidStakingMarketSnapshotSeed = {
  chainSlug: string;
  nativeTokenSymbol?: string | null;
  marketCapUsd?: number | null;
  percentStaked?: number | null;
  stakingApyPercent?: number | null;
  stakersCount?: number | null;
  lstProtocolCount?: number | null;
  lstToStakedPercent?: number | null;
  sources: LiquidStakingMetricSource[];
};

export type LiquidStakingMarketSnapshot = {
  nativeTokenSymbol?: string | null;
  marketCapUsd?: number | null;
  percentStaked?: number | null;
  stakingApyPercent?: number | null;
  stakersCount?: number | null;
  globalLstHealthScore: number;
  lstProtocolCount?: number | null;
  lstToStakedPercent?: number | null;
  defiTvlUsd: number;
  snapshotDate: string;
  sources: LiquidStakingMetricSource[];
};

export const chainTechnicalCapabilityKeys = [
  "smartContracts",
  "tokenStandards",
  "paymentRails",
  "oracleSupport",
  "indexingSupport",
  "settlementPrimitives",
  "liquidityRails",
  "nativeValidatorStaking",
] as const;

export type ChainTechnicalCapabilityKey =
  (typeof chainTechnicalCapabilityKeys)[number];

export type ChainTechnicalCapabilities = Record<
  ChainTechnicalCapabilityKey,
  CapabilitySupportLevel
>;

export type ChainTechnicalProfileSeed = {
  chainSlug: string;
  architectureKind:
    | "general-evm-l1"
    | "general-evm-l2"
    | "bitcoin-evm"
    | "enterprise-evm"
    | "specialized-evm";
  capabilities: ChainTechnicalCapabilities;
  dataConfidence: DataConfidenceLevel;
  sourceBasis: string;
  assessedAt: string;
  notes: string[];
};

export type ChainTechnicalProfile = Omit<ChainTechnicalProfileSeed, "chainSlug"> & {
  chainId: string;
};

export type ChainEcosystemMetricsSeed = {
  chainSlug: string;
  tvlUsd?: number;
  wallets: number;
  activeUsers: number;
  transactions?: number;
  protocols: number;
  ecosystemProjects: number;
  averageTransactionSpeed: number;
  blockTime: number;
  throughputIndicator: number;
  snapshotDate: string;
  sourceLabel: string;
};

export type ExternalMetricProvenance = {
  sourceName: string;
  sourceEndpoint: string;
  fetchedAt: string;
  normalizationNote: string;
  freshness: "source-backed" | "fallback";
};

export type ExternalMetricSnapshotValue = ExternalMetricProvenance & {
  value: number;
};

export type ExternalChainMetricsSnapshot = {
  chainSlug: string;
  metrics: Partial<Record<ExternalMetricKey, ExternalMetricSnapshotValue>>;
};

export type ExternalConnectorSyncStatus = {
  connector: string;
  status: "success" | "skipped" | "failed";
  message: string;
};

export type ExternalMetricsSnapshot = {
  updatedAt: string;
  sourceNote: string;
  connectors: ExternalConnectorSyncStatus[];
  chains: ExternalChainMetricsSnapshot[];
};

export type ChainEcosystemMetrics = Omit<ChainEcosystemMetricsSeed, "chainSlug"> & {
  chainId: string;
  provenance: Partial<Record<ExternalMetricKey, ExternalMetricProvenance>>;
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

export type WedgeApplicability = {
  chainId: string;
  chainSlug: string;
  wedgeId: EconomyTypeSlug;
  applicabilityStatus: WedgeApplicabilityStatus;
  applicabilityScore: number;
  rationale: string;
  technicalConstraints: string[];
  requiredPrerequisites: string[];
  assessedAt: string;
  sourceBasis: string;
  confidenceLevel: DataConfidenceLevel;
  manualReviewRecommended: boolean;
};

export type WedgeApplicabilitySummary = {
  wedge: EconomyType;
  applicable: number;
  partiallyApplicable: number;
  notApplicable: number;
  unknown: number;
  manualReviewCount: number;
};

export type ApplicabilityMatrixRow = {
  chain: Chain;
  technicalProfile: ChainTechnicalProfile;
  wedges: WedgeApplicability[];
};

export type RecommendationItem = {
  module: EconomyModule;
  title: string;
  whyItMatters: string;
  expectedResult: string;
  directChainImpact: string;
  deploymentPhaseKey: string;
  narrativeSummary: string;
  currentStatus: Exclude<ModuleAvailabilityStatus, "available">;
  potentialScoreLift: number;
  kpis: RecommendationKpi[];
};

export type RecommendationKpi = {
  label: string;
  value: string;
};

export type DeploymentPhaseKpi = {
  label: string;
  value: string;
};

export type DeploymentPhase = {
  id: string;
  key: string;
  label: string;
  title: string;
  timelineLabel: string;
  objective: string;
  kpis: DeploymentPhaseKpi[];
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

export type GlobalRankingComponentWeights = {
  economyScore: number;
  ecosystem: number;
  adoption: number;
  performance: number;
};

export type GlobalRankingSubmetricWeights = {
  protocols: number;
  ecosystemProjects: number;
  wallets: number;
  activeUsers: number;
  averageTransactionSpeed: number;
  blockTime: number;
  throughputIndicator: number;
};

export type EconomyCompositeWeights = Record<EconomyTypeSlug, number>;

export type OpportunityScoringWeights = {
  tvlTier: number;
  readinessGap: number;
  stackFit: number;
  ecosystemSignal: number;
};

export type OpportunityStackFitComponentWeights = {
  liftRatio: number;
  coverageRatio: number;
};

export type OpportunityPriorityThresholds = {
  high: number;
  medium: number;
};

export type ApplicabilityCapabilityWeights = Record<
  ChainTechnicalCapabilityKey,
  number
>;

export type WedgeApplicabilityThresholds = {
  applicableMinimum: number;
  partialMinimum: number;
};

export type WedgeApplicabilityConfidenceConfig = {
  minimumConfidenceForDefinitiveStatus: DataConfidenceLevel;
  unknownWhenRequiredCapabilityIsUnknown: boolean;
  manualReviewBelowScore: number;
};

export type WedgeApplicabilityAssumptionSet = {
  signalScores: Record<CapabilitySupportLevel, number>;
  wedgeCapabilityWeights: Record<EconomyTypeSlug, ApplicabilityCapabilityWeights>;
  wedgePrerequisites: Record<
    EconomyTypeSlug,
    Record<ChainTechnicalCapabilityKey, ApplicabilityRequirementLevel>
  >;
  thresholds: WedgeApplicabilityThresholds;
  confidence: WedgeApplicabilityConfidenceConfig;
};

export type AnalysisSettings = {
  modelName: string;
  promptTemplateKey: string;
  sensitivity: number;
  opportunityThreshold: number;
  manualReviewThreshold: number;
  useMockWhenUnavailable: boolean;
};

export type GlobalChainScore = {
  chainId: string;
  chainSlug: string;
  economyCompositeScore: number;
  ecosystemScore: number;
  adoptionScore: number;
  performanceScore: number;
  totalScore: number;
  computedAt: string;
  metrics: ChainEcosystemMetrics;
};

export type GlobalRankedChain = {
  chain: Chain;
  score: GlobalChainScore;
  benchmarkRank: number;
  economyBreakdown: Record<
    EconomyTypeSlug,
    {
      economy: EconomyType;
      readinessScore: ChainEconomyReadiness;
      benchmarkRank: number;
    }
  >;
};

export type OpportunityScoreBreakdown = {
  tvlTierScore: number;
  readinessGapScore: number;
  stackFitScore: number;
  ecosystemSignalScore: number;
};

export type OpportunityScore = {
  chainId: string;
  economyType: EconomyTypeSlug;
  totalScore: number;
  breakdown: OpportunityScoreBreakdown;
  computedAt: string;
};

export type OpportunityPriority = "High" | "Medium" | "Monitor";

export type TargetAccountRow = {
  chain: Chain;
  economy: EconomyType;
  applicability: WedgeApplicability;
  readinessRank: number;
  readinessScore: ChainEconomyReadiness;
  readinessGap: number;
  globalRank: number;
  globalScore: GlobalChainScore;
  opportunity: OpportunityScore;
  priority: OpportunityPriority;
  missingModules: GapAnalysisItem[];
  recommendedStack: RecommendedStack;
};

export type OutreachBrief = {
  chainName: string;
  economyName: string;
  globalRank: number;
  economyRank: number;
  keyGaps: string[];
  peerSummary: string;
  protofireOpportunity: string;
  suggestedOutreachAngle: string;
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
  technicalProfile: ChainTechnicalProfile;
  readinessScore: ChainEconomyReadiness;
  selectedWedgeApplicability: WedgeApplicability;
  wedgeApplicabilityMatrix: WedgeApplicability[];
  globalPosition: GlobalRankedChain;
  gapAnalysis: GapAnalysisItem[];
  rank: number;
  leader: string;
  leaderGap: number;
  chainsOutranked: number;
  scoreDrivers: ScoreDriver[];
  peers: PeerComparisonItem[];
  liquidStakingDiagnosis?: LiquidStakingDiagnosis;
  liquidStakingMarketSnapshot?: LiquidStakingMarketSnapshot;
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

export type GlobalRankingsQuery = {
  sort: GlobalRankingsSortKey;
  direction: RankingsSortDirection;
};

export type TargetAccountsQuery = {
  sort: TargetAccountSortKey;
  direction: RankingsSortDirection;
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

export type TargetAccountProfile = {
  profile: ChainProfile;
  opportunity: TargetAccountRow;
  recommendedEconomy: EconomyType;
  outreachBrief: OutreachBrief;
};

export type ChainAnalysisInputEconomySnapshot = {
  economy: {
    slug: EconomyTypeSlug;
    name: string;
  };
  readinessScore: {
    totalScore: number;
  };
  wedgeApplicability: WedgeApplicability;
  gapAnalysis: Array<{
    problem: string;
    impact: string;
  }>;
  recommendedStack: {
    narrativeSummary: string;
    items: Array<{
      title: string;
      deploymentPhase: string;
      potentialScoreLift: number;
    }>;
  };
};

export type ChainAnalysisInputChainSnapshot = {
  id: string;
  slug: string;
  name: string;
};

export type ChainAnalysisInputGlobalPositionSnapshot = {
  benchmarkRank: number;
  score: {
    totalScore: number;
  };
};

export type ChainAnalysisInputSnapshot = {
  chain: ChainAnalysisInputChainSnapshot;
  technicalProfile: ChainTechnicalProfile;
  globalPosition: ChainAnalysisInputGlobalPositionSnapshot;
  economies: ChainAnalysisInputEconomySnapshot[];
  assumptionsVersion: string;
  sourceSnapshotDate: string;
};

export type ChainTechnicalAnalysisOutput = {
  wedgeAssessments: WedgeApplicability[];
  technicalBlockers: string[];
  prerequisiteSummary: string[];
  strongestOpportunities: string[];
  confidenceNotes: string[];
  manualFollowUp: string[];
};

export type ChainTechnicalAnalysis = {
  id: string;
  chainId: string;
  chainSlug: string;
  triggeredBy: string;
  modelName: string;
  executionMode: AnalysisExecutionMode;
  analysisType: "gpt-5.4-technical-analysis";
  status: ChainAnalysisStatus;
  inputSnapshot: ChainAnalysisInputSnapshot;
  outputSummary: string | null;
  outputStructuredData: ChainTechnicalAnalysisOutput | null;
  createdAt: string;
  completedAt: string | null;
  errorMessage: string | null;
};
