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
          maximumScore: economy.scoringConfig.maximumScore,
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
        economyScore: 55,
        ecosystem: 20,
        adoption: 15,
        performance: 10,
      },
      economyCompositeWeights: {
        "ai-agents": 45,
        "defi-infrastructure": 55,
        "rwa-infrastructure": 0,
        "prediction-markets": 0,
      },
      ecosystemSubweights: {
        protocols: 55,
        ecosystemProjects: 45,
      },
      adoptionSubweights: {
        wallets: 50,
        activeUsers: 50,
      },
      performanceSubweights: {
        averageTransactionSpeed: 30,
        blockTime: 30,
        throughputIndicator: 40,
      },
    },
    opportunityScoring: {
      weights: {
        tvlTier: 35,
        readinessGap: 20,
        stackFit: 25,
        ecosystemSignal: 20,
      },
      stackFitComponents: {
        liftRatio: 70,
        coverageRatio: 30,
      },
      priorityThresholds: {
        high: 7.5,
        medium: 5.5,
      },
    },
    wedgeApplicability: {
      signalScores: {
        supported: 100,
        limited: 60,
        unsupported: 0,
        unknown: 35,
      },
      wedgeCapabilityWeights: {
        "ai-agents": {
          smartContracts: 20,
          tokenStandards: 10,
          paymentRails: 25,
          oracleSupport: 10,
          indexingSupport: 20,
          settlementPrimitives: 10,
          liquidityRails: 0,
          nativeValidatorStaking: 5,
        },
        "defi-infrastructure": {
          smartContracts: 15,
          tokenStandards: 5,
          paymentRails: 5,
          oracleSupport: 20,
          indexingSupport: 10,
          settlementPrimitives: 10,
          liquidityRails: 20,
          nativeValidatorStaking: 15,
        },
        "rwa-infrastructure": {
          smartContracts: 10,
          tokenStandards: 20,
          paymentRails: 10,
          oracleSupport: 20,
          indexingSupport: 10,
          settlementPrimitives: 25,
          liquidityRails: 5,
          nativeValidatorStaking: 0,
        },
        "prediction-markets": {
          smartContracts: 15,
          tokenStandards: 5,
          paymentRails: 5,
          oracleSupport: 25,
          indexingSupport: 20,
          settlementPrimitives: 5,
          liquidityRails: 20,
          nativeValidatorStaking: 5,
        },
      },
      wedgePrerequisites: {
        "ai-agents": {
          smartContracts: "required",
          tokenStandards: "preferred",
          paymentRails: "required",
          oracleSupport: "preferred",
          indexingSupport: "required",
          settlementPrimitives: "preferred",
          liquidityRails: "optional",
          nativeValidatorStaking: "optional",
        },
        "defi-infrastructure": {
          smartContracts: "required",
          tokenStandards: "preferred",
          paymentRails: "preferred",
          oracleSupport: "required",
          indexingSupport: "preferred",
          settlementPrimitives: "preferred",
          liquidityRails: "required",
          nativeValidatorStaking: "preferred",
        },
        "rwa-infrastructure": {
          smartContracts: "required",
          tokenStandards: "required",
          paymentRails: "preferred",
          oracleSupport: "required",
          indexingSupport: "preferred",
          settlementPrimitives: "required",
          liquidityRails: "optional",
          nativeValidatorStaking: "optional",
        },
        "prediction-markets": {
          smartContracts: "required",
          tokenStandards: "preferred",
          paymentRails: "preferred",
          oracleSupport: "required",
          indexingSupport: "required",
          settlementPrimitives: "optional",
          liquidityRails: "required",
          nativeValidatorStaking: "optional",
        },
      },
      thresholds: {
        applicableMinimum: 75,
        partialMinimum: 45,
      },
      confidence: {
        minimumConfidenceForDefinitiveStatus: "medium",
        unknownWhenRequiredCapabilityIsUnknown: true,
        manualReviewBelowScore: 60,
      },
    },
    analysisSettings: {
      modelName: "gpt-5.4",
      promptTemplateKey: "strategic-proposal-v1",
      sensitivity: 0.6,
      opportunityThreshold: 6,
      manualReviewThreshold: 5,
      useMockWhenUnavailable: true,
    },
    proposalGenerator: {
      weights: {
        applicability: 30,
        gapSeverity: 25,
        personaFit: 20,
        expectedImpact: 15,
        roiPotential: 10,
      },
      priorityThresholds: {
        high: 75,
        medium: 55,
      },
    },
  };
}
