import { z } from "zod";

import {
  defaultEconomySlug,
  getEconomyTypeBySlug,
  getRankingSortOptions,
} from "@/lib/config/economies";
import {
  capabilitySupportLevels,
  chainCapabilityExecutionEnvironments,
  chainCapabilityGasModels,
  chainCapabilityValidatorModels,
  chainAnalysisStatuses,
  chainCategories,
  chainRecordStatuses,
  chainRoadmapSourceKinds,
  chainSourceCategories,
  chainSourceMetrics,
  chainSourceProviders,
  chainTechnicalCapabilityKeys,
  dataConfidenceLevels,
  ecosystemMaturityLevels,
  economyTypeSlugs,
  externalMetricKeys,
  globalRankingsSortKeys,
  moduleAvailabilityStatuses,
  rankingsSortDirections,
  targetAccountSortKeys,
  wedgeApplicabilityStatuses,
} from "@/lib/domain/types";
import type {
  AtlasSeedDataset,
  BuyerPersonaRecord,
  ChainCatalogSeed,
  ChainCapabilityProfileSeed,
  ChainEcosystemMetricsSeed,
  ChainEconomySeedRecord,
  ChainRoadmapSeed,
  ChainTechnicalAnalysis,
  ChainTechnicalProfileSeed,
  EconomyType,
  ExternalMetricsSnapshot,
  GlobalRankingsQuery,
  LiquidStakingMarketSnapshotSeed,
  ProposalDocument,
  RankingsQuery,
  RankingsSortKey,
  TargetAccountsQuery,
} from "@/lib/domain/types";

function addUniqueFieldIssue<Item>(
  collection: Item[],
  getValue: (item: Item) => string,
  pathKey: string,
  ctx: z.RefinementCtx,
  message: string,
) {
  const seen = new Map<string, number>();

  collection.forEach((item, index) => {
    const value = getValue(item);

    if (!value) {
      return;
    }

    if (seen.has(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${message}: "${value}"`,
        path: [index, pathKey],
      });
      return;
    }

    seen.set(value, index);
  });
}

const moduleStatusSeedSchema = z.object({
  status: z.enum(moduleAvailabilityStatuses),
  evidenceNote: z.string().min(1),
  rationale: z.string().min(1),
});

const chainCatalogSeedSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  sourceName: z.string().min(1),
  sourceRank: z.number().int().positive(),
  sourceGlobalRank: z.number().int().positive().optional(),
  sourceCategory: z.enum(chainSourceCategories),
  sourceMetric: z.enum(chainSourceMetrics),
  sourceProvider: z.enum(chainSourceProviders),
  sourceSnapshotDate: z.string().min(1),
  sourceTvlUsd: z.number().nonnegative(),
  category: z.enum(chainCategories),
  website: z.string().url().optional(),
  shortDescription: z.string().min(1),
  status: z.enum(chainRecordStatuses),
});

const chainCatalogSeedsSchema = z
  .array(chainCatalogSeedSchema)
  .min(1)
  .superRefine((chains, ctx) => {
    addUniqueFieldIssue(
      chains,
      (chain) => chain.id,
      "id",
      ctx,
      "Duplicate chain id",
    );
    addUniqueFieldIssue(
      chains,
      (chain) => chain.slug,
      "slug",
      ctx,
      "Duplicate chain slug",
    );
    addUniqueFieldIssue(
      chains,
      (chain) => chain.name,
      "name",
      ctx,
      "Duplicate chain name",
    );

    const sourceRanks = chains.map((chain) => chain.sourceRank).sort((a, b) => a - b);

    sourceRanks.forEach((rank, index) => {
      if (rank !== index + 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Source ranks must be sequential starting at 1. Received ${rank} at position ${index + 1}.`,
        });
      }
    });
  });

const economyModuleSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  weight: z.number().positive(),
});

const economyDeploymentTemplateSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  objective: z.string().min(1),
});

const economyRecommendationRuleSchema = z.object({
  deploymentPhaseKey: z.string().min(1),
  missingTitle: z.string().min(1),
  partialTitle: z.string().min(1),
  whyItMatters: z.string().min(1),
  missingResult: z.string().min(1),
  partialResult: z.string().min(1),
  missingChainImpact: z.string().min(1),
  partialChainImpact: z.string().min(1),
  missingSummary: z.string().min(1),
  partialSummary: z.string().min(1),
  gapImpact: z.object({
    missing: z.string().min(1),
    partial: z.string().min(1),
  }),
});

const economyTypeSchema = z
  .object({
    id: z.string().min(1),
    slug: z.enum(economyTypeSlugs),
    name: z.string().min(1),
    shortLabel: z.string().min(1),
    isActive: z.boolean(),
    description: z.string().min(1),
    modules: z.array(economyModuleSchema).min(1),
    scoringConfig: z.object({
      maximumScore: z.number().positive(),
      statusScores: z.object({
        missing: z.number().min(0),
        partial: z.number().min(0),
        available: z.number().min(0),
      }),
    }),
    recommendationConfig: z.object({
      thresholdScore: z.number().min(0).max(1),
      includePartialRecommendations: z.boolean(),
      includeMissingRecommendations: z.boolean(),
    }),
    deploymentTemplates: z.array(economyDeploymentTemplateSchema).min(1),
    recommendationRules: z.record(
      z.string().min(1),
      economyRecommendationRuleSchema,
    ),
  })
  .superRefine((economy, ctx) => {
    addUniqueFieldIssue(
      economy.modules,
      (module) => module.id,
      "id",
      ctx,
      "Duplicate module id",
    );
    addUniqueFieldIssue(
      economy.modules,
      (module) => module.slug,
      "slug",
      ctx,
      "Duplicate module slug",
    );
    addUniqueFieldIssue(
      economy.deploymentTemplates,
      (template) => template.key,
      "key",
      ctx,
      "Duplicate deployment template key",
    );

    const totalWeight = economy.modules.reduce(
      (sum, module) => sum + module.weight,
      0,
    );

    if (totalWeight !== 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Module weights must sum to 100. Received ${totalWeight}.`,
      });
    }

    const {
      thresholdScore,
      includeMissingRecommendations,
      includePartialRecommendations,
    } = economy.recommendationConfig;

    if (!includeMissingRecommendations && thresholdScore <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Recommendation config must allow missing modules or raise the threshold above 0.",
        path: ["recommendationConfig", "includeMissingRecommendations"],
      });
    }

    if (
      thresholdScore >= 0.5 &&
      !includePartialRecommendations &&
      includeMissingRecommendations
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Thresholds that reach partial scores must enable partial recommendations.",
        path: ["recommendationConfig", "includePartialRecommendations"],
      });
    }

    const moduleSlugs = new Set(economy.modules.map((module) => module.slug));
    const recommendationSlugs = Object.keys(economy.recommendationRules);

    recommendationSlugs.forEach((moduleSlug) => {
      if (!moduleSlugs.has(moduleSlug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Recommendation rule "${moduleSlug}" does not match any module on ${economy.slug}.`,
          path: ["recommendationRules", moduleSlug],
        });
      }
    });

    economy.modules.forEach((module, index) => {
      if (!economy.recommendationRules[module.slug]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Missing recommendation rule for "${module.slug}" on ${economy.slug}.`,
          path: ["modules", index, "slug"],
        });
      }
    });

    const templateKeys = new Set(
      economy.deploymentTemplates.map((template) => template.key),
    );

    Object.entries(economy.recommendationRules).forEach(([moduleSlug, rule]) => {
      if (!templateKeys.has(rule.deploymentPhaseKey)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Recommendation rule "${moduleSlug}" references unknown deployment phase "${rule.deploymentPhaseKey}".`,
          path: ["recommendationRules", moduleSlug, "deploymentPhaseKey"],
        });
      }
    });
  });

const economyTypesSchema = z
  .array(economyTypeSchema)
  .min(1)
  .superRefine((economies, ctx) => {
    addUniqueFieldIssue(
      economies,
      (economy) => economy.id,
      "id",
      ctx,
      "Duplicate economy id",
    );
    addUniqueFieldIssue(
      economies,
      (economy) => economy.slug,
      "slug",
      ctx,
      "Duplicate economy slug",
    );
  });

const chainEconomySeedRecordSchema = z.object({
  chainSlug: z.string().min(1),
  economyType: z.enum(economyTypeSlugs),
  moduleStatuses: z.record(z.string().min(1), moduleStatusSeedSchema),
});

const chainRoadmapSeedSchema = z.object({
  chainSlug: z.string().min(1),
  sourceKind: z.enum(chainRoadmapSourceKinds),
  sourceLabel: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  snapshotDate: z.string().min(1),
  stageLabel: z.string().min(1),
  stageSummary: z.string().min(1),
  atlasFitSummary: z.string().min(1),
});

const chainRoadmapSeedsSchema = z
  .array(chainRoadmapSeedSchema)
  .min(1)
  .superRefine((roadmaps, ctx) => {
    addUniqueFieldIssue(
      roadmaps,
      (roadmap) => roadmap.chainSlug,
      "chainSlug",
      ctx,
      "Duplicate chain roadmap record",
    );
  });

const chainEcosystemMetricsSeedSchema = z.object({
  chainSlug: z.string().min(1),
  tvlUsd: z.number().nonnegative().optional(),
  wallets: z.number().int().nonnegative(),
  activeUsers: z.number().int().nonnegative(),
  transactions: z.number().nonnegative().optional(),
  protocols: z.number().int().nonnegative(),
  ecosystemProjects: z.number().int().nonnegative(),
  averageTransactionSpeed: z.number().positive(),
  blockTime: z.number().positive(),
  throughputIndicator: z.number().positive(),
  snapshotDate: z.string().min(1),
  sourceLabel: z.string().min(1),
});

const chainEcosystemMetricsSeedsSchema = z
  .array(chainEcosystemMetricsSeedSchema)
  .min(1)
  .superRefine((records, ctx) => {
    addUniqueFieldIssue(
      records,
      (record) => record.chainSlug,
      "chainSlug",
      ctx,
      "Duplicate chain ecosystem metrics record",
    );
  });

const liquidStakingMetricSourceSchema = z.object({
  metric: z.string().min(1),
  provider: z.string().min(1),
  url: z.string().url(),
  snapshotDate: z.string().min(1),
  status: z.enum(["captured", "pending", "not-applicable"]),
  note: z.string().min(1),
});

const liquidStakingMarketSnapshotSeedSchema = z.object({
  chainSlug: z.string().min(1),
  nativeTokenSymbol: z.string().min(1).nullable().optional(),
  marketCapUsd: z.number().nonnegative().nullable().optional(),
  percentStaked: z.number().nonnegative().nullable().optional(),
  stakingApyPercent: z.number().nonnegative().nullable().optional(),
  stakersCount: z.number().int().nonnegative().nullable().optional(),
  lstProtocolCount: z.number().int().nonnegative().nullable().optional(),
  lstToStakedPercent: z.number().nonnegative().nullable().optional(),
  sources: z.array(liquidStakingMetricSourceSchema).min(1),
});

const liquidStakingMarketSnapshotSeedsSchema = z
  .array(liquidStakingMarketSnapshotSeedSchema)
  .min(1)
  .superRefine((records, ctx) => {
    addUniqueFieldIssue(
      records,
      (record) => record.chainSlug,
      "chainSlug",
      ctx,
      "Duplicate chain liquid staking snapshot record",
    );
  });

const chainTechnicalProfileSeedSchema = z.object({
  chainSlug: z.string().min(1),
  architectureKind: z.enum([
    "general-evm-l1",
    "general-evm-l2",
    "bitcoin-evm",
    "enterprise-evm",
    "specialized-evm",
  ]),
  capabilities: z.record(
    z.enum(chainTechnicalCapabilityKeys),
    z.enum(capabilitySupportLevels),
  ),
  dataConfidence: z.enum(dataConfidenceLevels),
  sourceBasis: z.string().min(1),
  assessedAt: z.string().min(1),
  notes: z.array(z.string().min(1)).min(1),
});

const chainTechnicalProfileSeedsSchema = z
  .array(chainTechnicalProfileSeedSchema)
  .min(1)
  .superRefine((records, ctx) => {
    addUniqueFieldIssue(
      records,
      (record) => record.chainSlug,
      "chainSlug",
      ctx,
      "Duplicate chain technical profile record",
    );
  });

const chainCapabilityProfileSourceReferencesSchema = z.object({
  isEvm: z.string().min(1),
  smartContractSupport: z.string().min(1),
  tokenStandardSupport: z.string().min(1),
  oracleSupport: z.string().min(1),
  indexingInfrastructure: z.string().min(1),
  eventDrivenArchitecture: z.string().min(1),
  crossChainSupport: z.string().min(1),
  validatorModel: z.string().min(1),
  stakingSupport: z.string().min(1),
  liquidStakingSupport: z.string().min(1),
  lendingProtocolFeasibility: z.string().min(1),
  liquidityProtocolFeasibility: z.string().min(1),
  paymentRailsSupport: z.string().min(1),
  gasModel: z.string().min(1),
  executionEnvironment: z.string().min(1),
  ecosystemMaturity: z.string().min(1),
});

const chainCapabilityProfileSeedSchema = z.object({
  chainSlug: z.string().min(1),
  isEvm: z.boolean(),
  smartContractSupport: z.enum(capabilitySupportLevels),
  tokenStandardSupport: z.enum(capabilitySupportLevels),
  oracleSupport: z.enum(capabilitySupportLevels),
  indexingInfrastructure: z.enum(capabilitySupportLevels),
  eventDrivenArchitecture: z.enum(capabilitySupportLevels),
  crossChainSupport: z.enum(capabilitySupportLevels),
  validatorModel: z.enum(chainCapabilityValidatorModels),
  stakingSupport: z.enum(capabilitySupportLevels),
  liquidStakingSupport: z.enum(capabilitySupportLevels),
  lendingProtocolFeasibility: z.enum(capabilitySupportLevels),
  liquidityProtocolFeasibility: z.enum(capabilitySupportLevels),
  paymentRailsSupport: z.enum(capabilitySupportLevels),
  gasModel: z.enum(chainCapabilityGasModels),
  executionEnvironment: z.enum(chainCapabilityExecutionEnvironments),
  ecosystemMaturity: z.enum(ecosystemMaturityLevels),
  confidenceLevel: z.enum(dataConfidenceLevels),
  notes: z.array(z.string()),
  sourceReferences: chainCapabilityProfileSourceReferencesSchema,
  lastUpdated: z.string().min(1),
});

const chainCapabilityProfileSeedsSchema = z
  .array(chainCapabilityProfileSeedSchema)
  .min(1)
  .superRefine((records, ctx) => {
    addUniqueFieldIssue(
      records,
      (record) => record.chainSlug,
      "chainSlug",
      ctx,
      "Duplicate chain capability profile record",
    );
  });

const externalMetricProvenanceSchema = z.object({
  sourceName: z.string().min(1),
  sourceEndpoint: z.string().min(1),
  fetchedAt: z.string().min(1),
  normalizationNote: z.string().min(1),
  freshness: z.enum(["source-backed", "fallback"]),
});

const externalMetricSnapshotValueSchema = externalMetricProvenanceSchema.extend({
  value: z.number().nonnegative(),
});

const externalChainMetricsSnapshotSchema = z.object({
  chainSlug: z.string().min(1),
  metrics: z.partialRecord(
    z.enum(externalMetricKeys),
    externalMetricSnapshotValueSchema,
  ),
});

const externalMetricsSnapshotSchema = z.object({
  updatedAt: z.string().min(1),
  sourceNote: z.string().min(1),
  connectors: z.array(
    z.object({
      connector: z.string().min(1),
      status: z.enum(["success", "skipped", "failed"]),
      message: z.string().min(1),
    }),
  ),
  chains: z.array(externalChainMetricsSnapshotSchema),
});

const wedgeApplicabilitySchema = z.object({
  chainId: z.string().min(1),
  chainSlug: z.string().min(1),
  wedgeId: z.enum(economyTypeSlugs),
  applicabilityStatus: z.enum(wedgeApplicabilityStatuses),
  applicabilityScore: z.number().min(0).max(100),
  rationale: z.string().min(1),
  technicalConstraints: z.array(z.string()),
  requiredPrerequisites: z.array(z.string()),
  assessedAt: z.string().min(1),
  sourceBasis: z.string().min(1),
  confidenceLevel: z.enum(dataConfidenceLevels),
  manualReviewRecommended: z.boolean(),
});

const chainCapabilityProfileSchema = chainCapabilityProfileSeedSchema.extend({
  chainId: z.string().min(1),
});

const buyerPersonaStructuredOutputSchema = z.object({
  empathyMap: z.object({
    hear: z.array(z.string()),
    fearTop3: z.array(z.string()).length(3),
    wantTop3: z.array(z.string()).length(3),
    needTop3: z.array(z.string()).length(3),
    painsTop3: z.array(z.string()).length(3),
    expectedGainsTop3: z.array(z.string()).length(3),
  }),
  successMetrics: z.object({
    topKpis: z.array(z.string()).length(3),
    organizationOkrs: z.array(z.string()).min(1),
  }),
  leanCanvas: z.object({
    problem: z.string().min(1),
    solution: z.string().min(1),
    valueProposition: z.string().min(1),
    competitors: z.string().min(1),
    strategy: z.string().min(1),
    growthDrivers: z.string().min(1),
  }),
  sourceSummary: z.array(z.string()).min(1),
});

const buyerPersonaRecordSchema = z.object({
  id: z.string().min(1),
  organization: z.string().min(1),
  chainId: z.string().min(1),
  chainSlug: z.string().min(1),
  chainUrl: z.string().url(),
  protocolUrl: z.string().url().nullish(),
  personName: z.string().min(1),
  personTitle: z.string().min(1),
  linkedinProfile: z.string().url().nullish(),
  twitterHandle: z.string().min(1).nullish(),
  githubProfile: z.string().url().nullish(),
  notes: z.string().min(1).nullish(),
  markdownPath: z.string().min(1),
  markdownContent: z.string().min(1),
  structuredData: buyerPersonaStructuredOutputSchema,
  modelName: z.string().min(1),
  executionMode: z.enum(["live", "mock"]),
  sourceNotes: z.array(z.string()).min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  generatedBy: z.string().min(1),
});

const proposalDocumentSchema = z.object({
  proposalId: z.string().min(1),
  chainId: z.string().min(1),
  chainSlug: z.string().min(1),
  wedgeId: z.enum(economyTypeSlugs),
  personaId: z.string().min(1),
  personaName: z.string().min(1),
  offerId: z.string().min(1),
  offerName: z.string().min(1),
  opportunityFitScore: z.number().min(0).max(100),
  strategicFit: z.number().min(0).max(100),
  roiEstimation: z.string().min(1),
  riskReduction: z.string().min(1),
  expectedChainOutcome: z.string().min(1),
  proposalSummary: z.string().min(1),
  markdownContent: z.string().min(1),
  createdAt: z.string().min(1),
  createdBy: z.string().min(1),
});

const chainTechnicalAnalysisSchema = z.object({
  id: z.string().min(1),
  chainId: z.string().min(1),
  chainSlug: z.string().min(1),
  triggeredBy: z.string().min(1),
  modelName: z.string().min(1),
  executionMode: z.enum(["live", "mock"]),
  analysisType: z.literal("gpt-5.4-strategic-analysis"),
  status: z.enum(chainAnalysisStatuses),
  inputSnapshot: z.object({
    chain: z.object({
      id: z.string().min(1),
      slug: z.string().min(1),
      name: z.string().min(1),
    }),
    technicalProfile: z.object({
      chainId: z.string().min(1),
      architectureKind: z.enum([
        "general-evm-l1",
        "general-evm-l2",
        "bitcoin-evm",
        "enterprise-evm",
        "specialized-evm",
      ]),
      capabilities: z.record(
        z.enum(chainTechnicalCapabilityKeys),
        z.enum(capabilitySupportLevels),
      ),
      dataConfidence: z.enum(dataConfidenceLevels),
      sourceBasis: z.string().min(1),
      assessedAt: z.string().min(1),
      notes: z.array(z.string()),
    }),
    capabilityProfile: chainCapabilityProfileSchema,
    globalPosition: z.object({
      benchmarkRank: z.number().int().positive(),
      score: z.object({
        totalScore: z.number(),
      }),
    }),
    economies: z.array(
      z.object({
        economy: z.object({
          slug: z.enum(economyTypeSlugs),
          name: z.string().min(1),
        }),
        readinessScore: z.object({
          totalScore: z.number(),
        }),
        wedgeApplicability: wedgeApplicabilitySchema,
        gapAnalysis: z.array(
          z.object({
            problem: z.string().min(1),
            impact: z.string().min(1),
          }),
        ),
        recommendedStack: z.object({
          narrativeSummary: z.string().min(1),
          items: z.array(
            z.object({
              title: z.string().min(1),
              deploymentPhase: z.string().min(1),
              potentialScoreLift: z.number(),
            }),
          ),
        }),
      }),
    ),
    personas: z.array(
      z.object({
        id: z.string().min(1),
        organization: z.string().min(1),
        personaName: z.string().min(1),
        personaTitle: z.string().min(1),
        chainSlug: z.string().min(1),
        protocolUrl: z.string().url().optional(),
        linkedinProfile: z.string().url().optional(),
        twitterHandle: z.string().min(1).optional(),
        fears: z.array(z.string()),
        wants: z.array(z.string()),
        needs: z.array(z.string()),
        pains: z.array(z.string()),
        expectedGains: z.array(z.string()),
        topKpis: z.array(z.string()),
      }),
    ),
    offers: z.array(
      z.object({
        offerId: z.string().min(1),
        name: z.string().min(1),
        problemSolved: z.string().min(1),
        expectedImpact: z.string().min(1),
        targetPersonas: z.array(z.string()),
        roiEstimate: z.string().min(1),
        technicalRequirements: z.array(z.string()),
        applicableWedges: z.array(z.enum(economyTypeSlugs)),
      }),
    ),
    assumptionsVersion: z.string().min(1),
    sourceSnapshotDate: z.string().min(1),
  }),
  outputSummary: z.string().nullable(),
  outputStructuredData: z
    .object({
      wedgeAssessments: z.array(wedgeApplicabilitySchema),
      technicalBlockers: z.array(z.string()),
      prerequisiteSummary: z.array(z.string()),
      strongestOpportunities: z.array(z.string()),
      confidenceNotes: z.array(z.string()),
      manualFollowUp: z.array(z.string()),
      infrastructureAnalysis: z.string().min(1),
      buyerPersonaAnalysis: z.string().min(1),
      recommendedOffer: z
        .object({
          offerId: z.string().min(1),
          offerName: z.string().min(1),
          rationale: z.string().min(1),
        })
        .nullable(),
      proposalDraft: z
        .object({
          headline: z.string().min(1),
          summary: z.string().min(1),
          whyItSolvesPersonaFears: z.string().min(1),
          kpiImprovementCase: z.string().min(1),
          expectedRoi: z.string().min(1),
          strategicAdvantage: z.string().min(1),
        })
        .nullable(),
      confidenceScore: z.number().min(0).max(100),
    })
    .nullable(),
  createdAt: z.string().min(1),
  completedAt: z.string().nullable(),
  errorMessage: z.string().nullable(),
});

const chainEconomySeedRecordsSchema = z
  .array(chainEconomySeedRecordSchema)
  .min(1)
  .superRefine((records, ctx) => {
    addUniqueFieldIssue(
      records,
      (record) => `${record.chainSlug}:${record.economyType}`,
      "chainSlug",
      ctx,
      "Duplicate chain economy record",
    );
  });

const rankingsBaseSearchSchema = z.object({
  economy: z.enum(economyTypeSlugs).default(defaultEconomySlug),
  q: z.string().trim().default(""),
  category: z.union([z.literal("All"), z.enum(chainCategories)]).default("All"),
  direction: z.enum(rankingsSortDirections).default("desc"),
});

const economySelectionSchema = z.object({
  economy: z.enum(economyTypeSlugs).default(defaultEconomySlug),
});

const globalRankingsSearchSchema = z.object({
  sort: z.enum(globalRankingsSortKeys).default("totalScore"),
  direction: z.enum(rankingsSortDirections).default("desc"),
});

const targetAccountsSearchSchema = z.object({
  sort: z.enum(targetAccountSortKeys).default("opportunityScore"),
  direction: z.enum(rankingsSortDirections).default("desc"),
});

type SearchParamValue = string | string[] | undefined;
type SearchParamRecord = Record<string, SearchParamValue> | undefined;

function firstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

function parseSortKey(
  value: SearchParamValue,
  economy: EconomyType,
): RankingsSortKey {
  const first = firstValue(value);
  const allowedSortKeys = new Set(
    getRankingSortOptions(economy).map((option) => option.value),
  );

  return allowedSortKeys.has(first as RankingsSortKey)
    ? (first as RankingsSortKey)
    : "totalScore";
}

export function parseChainCatalogSeeds(input: unknown): ChainCatalogSeed[] {
  return chainCatalogSeedsSchema.parse(input);
}

export function parseEconomyTypes(input: unknown): EconomyType[] {
  return economyTypesSchema.parse(input);
}

export function parseChainEconomySeedRecords(
  input: unknown,
): ChainEconomySeedRecord[] {
  return chainEconomySeedRecordsSchema.parse(input);
}

export function parseChainRoadmapSeeds(input: unknown): ChainRoadmapSeed[] {
  return chainRoadmapSeedsSchema.parse(input);
}

export function parseChainEcosystemMetricsSeeds(
  input: unknown,
): ChainEcosystemMetricsSeed[] {
  return chainEcosystemMetricsSeedsSchema.parse(input);
}

export function parseLiquidStakingMarketSnapshotSeeds(
  input: unknown,
): LiquidStakingMarketSnapshotSeed[] {
  return liquidStakingMarketSnapshotSeedsSchema.parse(input);
}

export function parseChainTechnicalProfileSeeds(
  input: unknown,
): ChainTechnicalProfileSeed[] {
  return chainTechnicalProfileSeedsSchema.parse(input);
}

export function parseChainCapabilityProfileSeeds(
  input: unknown,
): ChainCapabilityProfileSeed[] {
  return chainCapabilityProfileSeedsSchema.parse(input);
}

export function parseExternalMetricsSnapshot(
  input: unknown,
): ExternalMetricsSnapshot {
  return externalMetricsSnapshotSchema.parse(input);
}

export function parseChainTechnicalAnalysis(
  input: unknown,
): ChainTechnicalAnalysis {
  return chainTechnicalAnalysisSchema.parse(input);
}

export function parseBuyerPersonaRecord(input: unknown): BuyerPersonaRecord {
  return buyerPersonaRecordSchema.parse(input);
}

export function parseProposalDocument(input: unknown): ProposalDocument {
  return proposalDocumentSchema.parse(input);
}

export function validateChainRoadmapSeeds(
  chains: ChainCatalogSeed[],
  roadmaps: ChainRoadmapSeed[],
) {
  const parsedChains = parseChainCatalogSeeds(chains);
  const parsedRoadmaps = parseChainRoadmapSeeds(roadmaps);
  const roadmapBySlug = new Map(
    parsedRoadmaps.map((roadmap) => [roadmap.chainSlug, roadmap] as const),
  );

  parsedChains.forEach((chain) => {
    if (!roadmapBySlug.has(chain.slug)) {
      throw new Error(`Missing roadmap record for ${chain.slug}.`);
    }
  });

  parsedRoadmaps.forEach((roadmap) => {
    if (!parsedChains.some((chain) => chain.slug === roadmap.chainSlug)) {
      throw new Error(`Unknown chain slug "${roadmap.chainSlug}" in roadmap seed.`);
    }
  });

  return parsedRoadmaps;
}

export function validateChainTechnicalProfileSeeds(
  chains: ChainCatalogSeed[],
  profiles: ChainTechnicalProfileSeed[],
) {
  const parsedChains = parseChainCatalogSeeds(chains);
  const parsedProfiles = parseChainTechnicalProfileSeeds(profiles);
  const profileBySlug = new Map(
    parsedProfiles.map((profile) => [profile.chainSlug, profile] as const),
  );

  parsedChains.forEach((chain) => {
    if (!profileBySlug.has(chain.slug)) {
      throw new Error(`Missing technical profile for ${chain.slug}.`);
    }
  });

  parsedProfiles.forEach((profile) => {
    if (!parsedChains.some((chain) => chain.slug === profile.chainSlug)) {
      throw new Error(
        `Unknown chain slug "${profile.chainSlug}" in technical profile seed.`,
      );
    }
  });

  return parsedProfiles;
}

export function validateChainCapabilityProfileSeeds(
  chains: ChainCatalogSeed[],
  profiles: ChainCapabilityProfileSeed[],
) {
  const parsedChains = parseChainCatalogSeeds(chains);
  const parsedProfiles = parseChainCapabilityProfileSeeds(profiles);
  const profileBySlug = new Map(
    parsedProfiles.map((profile) => [profile.chainSlug, profile] as const),
  );

  parsedChains.forEach((chain) => {
    if (!profileBySlug.has(chain.slug)) {
      throw new Error(`Missing capability profile for ${chain.slug}.`);
    }
  });

  parsedProfiles.forEach((profile) => {
    if (!parsedChains.some((chain) => chain.slug === profile.chainSlug)) {
      throw new Error(
        `Unknown chain slug "${profile.chainSlug}" in capability profile seed.`,
      );
    }
  });

  return parsedProfiles;
}

export function validateAtlasSeedDataset(
  input: AtlasSeedDataset,
): AtlasSeedDataset {
  const chains = parseChainCatalogSeeds(input.chains);
  const economies = parseEconomyTypes(input.economies);
  const records = parseChainEconomySeedRecords(input.records);

  const chainSlugs = new Set(chains.map((chain) => chain.slug));
  const economyBySlug = new Map(
    economies.map((economy) => [economy.slug, economy] as const),
  );
  const recordLookup = new Map(
    records.map((record) => [`${record.chainSlug}:${record.economyType}`, record]),
  );

  records.forEach((record, index) => {
    if (!chainSlugs.has(record.chainSlug)) {
      throw new Error(
        `Unknown chain slug "${record.chainSlug}" in record ${index + 1}.`,
      );
    }

    const economy = economyBySlug.get(record.economyType);

    if (!economy) {
      throw new Error(
        `Unknown economy slug "${record.economyType}" in record ${index + 1}.`,
      );
    }

    const moduleSlugs = economy.modules.map((module) => module.slug).sort();
    const recordModuleSlugs = Object.keys(record.moduleStatuses).sort();

    if (
      moduleSlugs.length !== recordModuleSlugs.length ||
      moduleSlugs.some((slug, moduleIndex) => slug !== recordModuleSlugs[moduleIndex])
    ) {
      throw new Error(
        `Module statuses for ${record.chainSlug}:${record.economyType} do not match the configured module catalog.`,
      );
    }
  });

  chains.forEach((chain) => {
    economies.forEach((economy) => {
      if (!recordLookup.has(`${chain.slug}:${economy.slug}`)) {
        throw new Error(
          `Missing seeded record for ${chain.slug}:${economy.slug}.`,
        );
      }
    });
  });

  return {
    chains,
    economies,
    records,
  };
}

export function validateChainEcosystemMetricsSeeds(
  chains: ChainCatalogSeed[],
  metrics: ChainEcosystemMetricsSeed[],
) {
  const parsedChains = parseChainCatalogSeeds(chains);
  const parsedMetrics = parseChainEcosystemMetricsSeeds(metrics);
  const metricBySlug = new Map(
    parsedMetrics.map((record) => [record.chainSlug, record] as const),
  );

  parsedChains.forEach((chain) => {
    if (!metricBySlug.has(chain.slug)) {
      throw new Error(`Missing ecosystem metrics record for ${chain.slug}.`);
    }
  });

  parsedMetrics.forEach((record) => {
    if (!parsedChains.some((chain) => chain.slug === record.chainSlug)) {
      throw new Error(
        `Unknown chain slug "${record.chainSlug}" in ecosystem metrics seed.`,
      );
    }
  });

  return parsedMetrics;
}

export function validateLiquidStakingMarketSnapshotSeeds(
  chains: ChainCatalogSeed[],
  records: LiquidStakingMarketSnapshotSeed[],
) {
  const parsedChains = parseChainCatalogSeeds(chains);
  const parsedRecords = parseLiquidStakingMarketSnapshotSeeds(records);

  parsedRecords.forEach((record) => {
    if (!parsedChains.some((chain) => chain.slug === record.chainSlug)) {
      throw new Error(
        `Unknown chain slug "${record.chainSlug}" in liquid staking snapshot seed.`,
      );
    }
  });

  return parsedRecords;
}

export function parseEconomySelection(
  searchParams: SearchParamRecord,
) {
  const parsed = economySelectionSchema.parse({
    economy: firstValue(searchParams?.economy),
  });

  return parsed.economy;
}

export function parseRankingsQuery(
  searchParams: SearchParamRecord,
): RankingsQuery {
  const base = rankingsBaseSearchSchema.parse({
    economy: firstValue(searchParams?.economy),
    q: firstValue(searchParams?.q),
    category: firstValue(searchParams?.category),
    direction: firstValue(searchParams?.direction),
  });
  const economy = getEconomyTypeBySlug(base.economy);

  return {
    ...base,
    sort: parseSortKey(searchParams?.sort, economy),
  };
}

export function parseGlobalRankingsQuery(
  searchParams: SearchParamRecord,
): GlobalRankingsQuery {
  return globalRankingsSearchSchema.parse({
    sort: firstValue(searchParams?.sort),
    direction: firstValue(searchParams?.direction),
  });
}

export function parseTargetAccountsQuery(
  searchParams: SearchParamRecord,
): TargetAccountsQuery {
  return targetAccountsSearchSchema.parse({
    sort: firstValue(searchParams?.sort),
    direction: firstValue(searchParams?.direction),
  });
}
