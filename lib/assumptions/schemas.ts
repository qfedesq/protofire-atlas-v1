import { z } from "zod";

import { buildDefaultAssumptionsSnapshot } from "@/lib/assumptions/defaults";
import type { ActiveAssumptions } from "@/lib/assumptions/types";
import { economyTypes } from "@/lib/config/economies";
import { liquidStakingDiagnosticDimensions } from "@/lib/config/liquid-staking-diagnosis";
import {
  applicabilityRequirementLevels,
  capabilitySupportLevels,
  chainTechnicalCapabilityKeys,
  dataConfidenceLevels,
  economyTypeSlugs,
  moduleAvailabilityStatuses,
} from "@/lib/domain/types";

const globalRankingWeightsSchema = z.object({
  economyScore: z.number().min(0),
  ecosystem: z.number().min(0),
  adoption: z.number().min(0),
  performance: z.number().min(0),
});

const opportunityScoringWeightsSchema = z.object({
  tvlTier: z.number().min(0),
  readinessGap: z.number().min(0),
  stackFit: z.number().min(0),
  ecosystemSignal: z.number().min(0),
});

const globalRankingSubweightsSchema = z.object({
  protocols: z.number().min(0),
  ecosystemProjects: z.number().min(0),
  wallets: z.number().min(0),
  activeUsers: z.number().min(0),
  averageTransactionSpeed: z.number().min(0),
  blockTime: z.number().min(0),
  throughputIndicator: z.number().min(0),
});

const opportunityStackFitComponentSchema = z.object({
  liftRatio: z.number().min(0),
  coverageRatio: z.number().min(0),
});

const opportunityPriorityThresholdsSchema = z.object({
  high: z.number().min(0).max(10),
  medium: z.number().min(0).max(10),
});

const recommendationConfigSchema = z.object({
  thresholdScore: z.number().min(0).max(1),
  includePartialRecommendations: z.boolean(),
  includeMissingRecommendations: z.boolean(),
});

const applicabilityCapabilityWeightsSchema = z.record(
  z.enum(chainTechnicalCapabilityKeys),
  z.number().min(0),
);

const applicabilityPrerequisitesSchema = z.record(
  z.enum(chainTechnicalCapabilityKeys),
  z.enum(applicabilityRequirementLevels),
);

const wedgeApplicabilitySchema = z.object({
  signalScores: z.record(z.enum(capabilitySupportLevels), z.number().min(0).max(100)),
  wedgeCapabilityWeights: z.record(
    z.enum(economyTypeSlugs),
    applicabilityCapabilityWeightsSchema,
  ),
  wedgePrerequisites: z.record(
    z.enum(economyTypeSlugs),
    applicabilityPrerequisitesSchema,
  ),
  thresholds: z.object({
    applicableMinimum: z.number().min(0).max(100),
    partialMinimum: z.number().min(0).max(100),
  }),
  confidence: z.object({
    minimumConfidenceForDefinitiveStatus: z.enum(dataConfidenceLevels),
    unknownWhenRequiredCapabilityIsUnknown: z.boolean(),
    manualReviewBelowScore: z.number().min(0).max(100),
  }),
});

const analysisSettingsSchema = z.object({
  modelName: z.string().min(1),
  promptTemplateKey: z.string().min(1),
  sensitivity: z.number().min(0).max(1),
  opportunityThreshold: z.number().min(0).max(10),
  manualReviewThreshold: z.number().min(0).max(10),
  useMockWhenUnavailable: z.boolean(),
});

const activeAssumptionsSchema = z.object({
  updatedAt: z.string().min(1),
  updatedBy: z.string().min(1),
  statusScores: z.object({
    missing: z.number().min(0).max(1),
    partial: z.number().min(0).max(1),
    available: z.number().min(0).max(1),
  }),
  economies: z.record(
    z.enum(economyTypeSlugs),
    z.object({
      maximumScore: z.number().positive(),
      moduleWeights: z.record(z.string().min(1), z.number().min(0)),
      moduleDiagnosticWeights: z
        .record(z.string().min(1), z.record(z.string().min(1), z.number().min(0)))
        .default({}),
      recommendationConfig: recommendationConfigSchema,
    }),
  ),
  globalRanking: z.object({
    componentWeights: globalRankingWeightsSchema,
    economyCompositeWeights: z.record(z.enum(economyTypeSlugs), z.number().min(0)),
    ecosystemSubweights: globalRankingSubweightsSchema.pick({
      protocols: true,
      ecosystemProjects: true,
    }),
    adoptionSubweights: globalRankingSubweightsSchema.pick({
      wallets: true,
      activeUsers: true,
    }),
    performanceSubweights: globalRankingSubweightsSchema.pick({
      averageTransactionSpeed: true,
      blockTime: true,
      throughputIndicator: true,
    }),
  }),
  opportunityScoring: z.object({
    weights: opportunityScoringWeightsSchema,
    stackFitComponents: opportunityStackFitComponentSchema,
    priorityThresholds: opportunityPriorityThresholdsSchema,
  }),
  wedgeApplicability: wedgeApplicabilitySchema,
  analysisSettings: analysisSettingsSchema,
});

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asObjectRecord(value: unknown): Record<string, unknown> {
  return isObject(value) ? value : {};
}

function mergeActiveAssumptionsWithDefaults(input: unknown): ActiveAssumptions {
  const defaults = buildDefaultAssumptionsSnapshot();

  if (!isObject(input)) {
    return defaults;
  }

  const record = input;
  const inputEconomies = asObjectRecord(record.economies);
  const inputGlobalRanking = asObjectRecord(record.globalRanking);
  const inputOpportunity = asObjectRecord(record.opportunityScoring);
  const inputApplicability = asObjectRecord(record.wedgeApplicability);
  const inputAnalysisSettings = asObjectRecord(record.analysisSettings);

  return {
    ...defaults,
    ...record,
    statusScores: {
      ...defaults.statusScores,
      ...(isObject(record.statusScores) ? record.statusScores : {}),
    },
    economies: Object.fromEntries(
      economyTypes.map((economy) => {
        const currentEconomy = defaults.economies[economy.slug];
        const incomingEconomy = asObjectRecord(inputEconomies[economy.slug]);

        return [
          economy.slug,
          {
            ...currentEconomy,
            ...incomingEconomy,
            moduleWeights: {
              ...currentEconomy.moduleWeights,
              ...(isObject(incomingEconomy.moduleWeights)
                ? incomingEconomy.moduleWeights
                : {}),
            },
            moduleDiagnosticWeights: {
              ...currentEconomy.moduleDiagnosticWeights,
              ...asObjectRecord(incomingEconomy.moduleDiagnosticWeights),
            },
            recommendationConfig: {
              ...currentEconomy.recommendationConfig,
              ...asObjectRecord(incomingEconomy.recommendationConfig),
            },
          },
        ];
      }),
    ) as ActiveAssumptions["economies"],
    globalRanking: {
      ...defaults.globalRanking,
      ...inputGlobalRanking,
      componentWeights: {
        ...defaults.globalRanking.componentWeights,
        ...(isObject(inputGlobalRanking.componentWeights)
          ? inputGlobalRanking.componentWeights
          : {}),
      },
      economyCompositeWeights: {
        ...defaults.globalRanking.economyCompositeWeights,
        ...(isObject(inputGlobalRanking.economyCompositeWeights)
          ? inputGlobalRanking.economyCompositeWeights
          : {}),
      },
      ecosystemSubweights: {
        ...defaults.globalRanking.ecosystemSubweights,
        ...(isObject(inputGlobalRanking.ecosystemSubweights)
          ? inputGlobalRanking.ecosystemSubweights
          : {}),
      },
      adoptionSubweights: {
        ...defaults.globalRanking.adoptionSubweights,
        ...(isObject(inputGlobalRanking.adoptionSubweights)
          ? inputGlobalRanking.adoptionSubweights
          : {}),
      },
      performanceSubweights: {
        ...defaults.globalRanking.performanceSubweights,
        ...(isObject(inputGlobalRanking.performanceSubweights)
          ? inputGlobalRanking.performanceSubweights
          : {}),
      },
    },
    opportunityScoring: {
      ...defaults.opportunityScoring,
      ...inputOpportunity,
      weights: {
        ...defaults.opportunityScoring.weights,
        ...(isObject(inputOpportunity.weights) ? inputOpportunity.weights : {}),
      },
      stackFitComponents: {
        ...defaults.opportunityScoring.stackFitComponents,
        ...(isObject(inputOpportunity.stackFitComponents)
          ? inputOpportunity.stackFitComponents
          : {}),
      },
      priorityThresholds: {
        ...defaults.opportunityScoring.priorityThresholds,
        ...(isObject(inputOpportunity.priorityThresholds)
          ? inputOpportunity.priorityThresholds
          : {}),
      },
    },
    wedgeApplicability: {
      ...defaults.wedgeApplicability,
      ...inputApplicability,
      signalScores: {
        ...defaults.wedgeApplicability.signalScores,
        ...(isObject(inputApplicability.signalScores)
          ? inputApplicability.signalScores
          : {}),
      },
      wedgeCapabilityWeights: Object.fromEntries(
        economyTypes.map((economy) => {
          const incomingWeights = asObjectRecord(
            asObjectRecord(inputApplicability.wedgeCapabilityWeights)[economy.slug],
          );

          return [
            economy.slug,
            {
              ...defaults.wedgeApplicability.wedgeCapabilityWeights[economy.slug],
              ...incomingWeights,
            },
          ];
        }),
      ) as ActiveAssumptions["wedgeApplicability"]["wedgeCapabilityWeights"],
      wedgePrerequisites: Object.fromEntries(
        economyTypes.map((economy) => {
          const incomingPrerequisites = asObjectRecord(
            asObjectRecord(inputApplicability.wedgePrerequisites)[economy.slug],
          );

          return [
            economy.slug,
            {
              ...defaults.wedgeApplicability.wedgePrerequisites[economy.slug],
              ...incomingPrerequisites,
            },
          ];
        }),
      ) as ActiveAssumptions["wedgeApplicability"]["wedgePrerequisites"],
      thresholds: {
        ...defaults.wedgeApplicability.thresholds,
        ...(isObject(inputApplicability.thresholds)
          ? inputApplicability.thresholds
          : {}),
      },
      confidence: {
        ...defaults.wedgeApplicability.confidence,
        ...(isObject(inputApplicability.confidence)
          ? inputApplicability.confidence
          : {}),
      },
    },
    analysisSettings: {
      ...defaults.analysisSettings,
      ...inputAnalysisSettings,
    },
  };
}

function assertOrderedStatusScores(statusScores: ActiveAssumptions["statusScores"]) {
  if (
    !(
      statusScores.missing <= statusScores.partial &&
      statusScores.partial <= statusScores.available
    )
  ) {
    throw new Error(
      "Status scores must remain ordered as missing <= partial <= available.",
    );
  }
}

function assertWeightsSumToHundred(
  weights: Record<string, number>,
  label: string,
) {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);

  if (total !== 100) {
    throw new Error(`${label} must sum to 100. Received ${total}.`);
  }
}

export function validateActiveAssumptions(
  input: unknown,
): ActiveAssumptions {
  const parsed = activeAssumptionsSchema.parse(
    mergeActiveAssumptionsWithDefaults(input),
  );

  assertOrderedStatusScores(parsed.statusScores);
  assertWeightsSumToHundred(
    parsed.globalRanking.componentWeights,
    "Global ranking weights",
  );
  assertWeightsSumToHundred(
    parsed.globalRanking.economyCompositeWeights,
    "Economy composite weights",
  );
  assertWeightsSumToHundred(
    parsed.opportunityScoring.weights,
    "Opportunity scoring weights",
  );
  assertWeightsSumToHundred(
    parsed.globalRanking.ecosystemSubweights,
    "Global ecosystem subweights",
  );
  assertWeightsSumToHundred(
    parsed.globalRanking.adoptionSubweights,
    "Global adoption subweights",
  );
  assertWeightsSumToHundred(
    parsed.globalRanking.performanceSubweights,
    "Global performance subweights",
  );
  assertWeightsSumToHundred(
    parsed.opportunityScoring.stackFitComponents,
    "Opportunity stack-fit subweights",
  );

  if (parsed.opportunityScoring.priorityThresholds.high <= parsed.opportunityScoring.priorityThresholds.medium) {
    throw new Error(
      "Opportunity priority thresholds must keep high above medium.",
    );
  }

  if (
    parsed.wedgeApplicability.thresholds.applicableMinimum <=
    parsed.wedgeApplicability.thresholds.partialMinimum
  ) {
    throw new Error(
      "Applicability thresholds must keep applicable above partially applicable.",
    );
  }

  const signalScores = parsed.wedgeApplicability.signalScores;

  if (
    !(
      signalScores.unsupported <= signalScores.unknown &&
      signalScores.unknown <= signalScores.limited &&
      signalScores.limited <= signalScores.supported
    )
  ) {
    throw new Error(
      "Applicability signal scores must remain ordered as unsupported <= unknown <= limited <= supported.",
    );
  }

  economyTypes.forEach((economy) => {
    const configured = parsed.economies[economy.slug];

    if (!configured) {
      throw new Error(`Missing active assumptions for ${economy.slug}.`);
    }

    const moduleSlugs = economy.modules.map((module) => module.slug).sort();
    const configuredSlugs = Object.keys(configured.moduleWeights).sort();

    if (
      moduleSlugs.length !== configuredSlugs.length ||
      moduleSlugs.some((slug, index) => slug !== configuredSlugs[index])
    ) {
      throw new Error(
        `Module weight set for ${economy.slug} does not match the configured module catalog.`,
      );
    }

    assertWeightsSumToHundred(
      configured.moduleWeights,
      `Module weights for ${economy.slug}`,
    );

    if (configured.maximumScore <= 0) {
      throw new Error(`Maximum score for ${economy.slug} must be positive.`);
    }

    if (economy.slug === "defi-infrastructure") {
      const configuredDiagnostics =
        configured.moduleDiagnosticWeights?.["liquid-staking"];
      const diagnosticSlugs = liquidStakingDiagnosticDimensions.map(
        (dimension) => dimension.slug,
      );

      if (!configuredDiagnostics) {
        throw new Error(
          "Liquid staking diagnostic weights must be configured for defi-infrastructure.",
        );
      }

      const configuredDiagnosticSlugs = Object.keys(configuredDiagnostics).sort();
      const expectedDiagnosticSlugs = [...diagnosticSlugs].sort();

      if (
        configuredDiagnosticSlugs.length !== expectedDiagnosticSlugs.length ||
        configuredDiagnosticSlugs.some(
          (slug, index) => slug !== expectedDiagnosticSlugs[index],
        )
      ) {
        throw new Error(
          "Liquid staking diagnostic weights do not match the configured 7-module diagnosis catalog.",
        );
      }

      assertWeightsSumToHundred(
        configuredDiagnostics,
        "Liquid staking diagnostic weights",
      );
    }

    const statusThresholds = configured.recommendationConfig;
    const partialScore = parsed.statusScores.partial;
    const missingScore = parsed.statusScores.missing;

    if (
      statusThresholds.thresholdScore >= partialScore &&
      !statusThresholds.includePartialRecommendations
    ) {
      throw new Error(
        `${economy.slug} recommendation threshold reaches partial scores, but partial recommendations are disabled.`,
      );
    }

    if (
      statusThresholds.thresholdScore >= missingScore &&
      !statusThresholds.includeMissingRecommendations
    ) {
      throw new Error(
        `${economy.slug} recommendation threshold reaches missing scores, but missing recommendations are disabled.`,
      );
    }

    assertWeightsSumToHundred(
      parsed.wedgeApplicability.wedgeCapabilityWeights[economy.slug],
      `Applicability capability weights for ${economy.slug}`,
    );
  });

  return parsed;
}

export function validateStatusScoreKey(key: string) {
  if (!moduleAvailabilityStatuses.includes(key as (typeof moduleAvailabilityStatuses)[number])) {
    throw new Error(`Unknown status score key "${key}".`);
  }

  return key as keyof ActiveAssumptions["statusScores"];
}
