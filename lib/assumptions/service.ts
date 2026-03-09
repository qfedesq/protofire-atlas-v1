import type {
  EconomyCompositeWeights,
  EconomyTypeSlug,
  GlobalRankingComponentWeights,
  GlobalRankingSubmetricWeights,
  OpportunityScoringWeights,
  OpportunityPriorityThresholds,
  OpportunityStackFitComponentWeights,
  ProposalGeneratorSettings,
  WedgeApplicabilityAssumptionSet,
  AnalysisSettings,
} from "@/lib/domain/types";
import { validateStatusScoreKey } from "@/lib/assumptions/schemas";
import {
  getActiveAssumptions,
  initializeActiveAssumptionsStore,
  saveActiveAssumptions,
} from "@/lib/assumptions/store";
import type { ActiveAssumptions } from "@/lib/assumptions/types";

function withAudit(
  assumptions: ActiveAssumptions,
  updatedBy: string,
): ActiveAssumptions {
  return {
    ...assumptions,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
}

export async function updateStatusScores(
  entries: Record<string, number>,
  updatedBy: string,
) {
  await initializeActiveAssumptionsStore();
  const current = getActiveAssumptions();
  const nextStatusScores = { ...current.statusScores };

  Object.entries(entries).forEach(([key, value]) => {
    nextStatusScores[validateStatusScoreKey(key)] = value;
  });

  return saveActiveAssumptions(
    withAudit(
      {
        ...current,
        statusScores: nextStatusScores,
      },
      updatedBy,
    ),
  );
}

export async function updateEconomyAssumptions(
  economySlug: EconomyTypeSlug,
  moduleWeights: Record<string, number>,
  recommendationConfig: ActiveAssumptions["economies"][EconomyTypeSlug]["recommendationConfig"],
  moduleDiagnosticWeights: ActiveAssumptions["economies"][EconomyTypeSlug]["moduleDiagnosticWeights"] | undefined,
  updatedBy: string,
  maximumScore?: number,
) {
  await initializeActiveAssumptionsStore();
  const current = getActiveAssumptions();
  const currentEconomy = current.economies[economySlug];

  return saveActiveAssumptions(
    withAudit(
      {
        ...current,
        economies: {
          ...current.economies,
          [economySlug]: {
            ...currentEconomy,
            maximumScore: maximumScore ?? currentEconomy.maximumScore,
            moduleWeights,
            moduleDiagnosticWeights:
              moduleDiagnosticWeights ?? currentEconomy.moduleDiagnosticWeights ?? {},
            recommendationConfig,
          },
        },
      },
      updatedBy,
    ),
  );
}

export async function updateGlobalRankingAssumptions(
  componentWeights: GlobalRankingComponentWeights,
  economyCompositeWeights: EconomyCompositeWeights,
  updatedBy: string,
) {
  await initializeActiveAssumptionsStore();
  const current = getActiveAssumptions();

  return saveActiveAssumptions(
    withAudit(
      {
        ...current,
        globalRanking: {
          ...current.globalRanking,
          componentWeights,
          economyCompositeWeights,
        },
      },
      updatedBy,
    ),
  );
}

export async function updateOpportunityScoringAssumptions(
  weights: OpportunityScoringWeights,
  updatedBy: string,
) {
  await initializeActiveAssumptionsStore();
  const current = getActiveAssumptions();

  return saveActiveAssumptions(
    withAudit(
      {
        ...current,
        opportunityScoring: {
          ...current.opportunityScoring,
          weights,
        },
      },
      updatedBy,
    ),
  );
}

export async function updateGlobalRankingSubweights(
  ecosystemSubweights: Pick<GlobalRankingSubmetricWeights, "protocols" | "ecosystemProjects">,
  adoptionSubweights: Pick<GlobalRankingSubmetricWeights, "wallets" | "activeUsers">,
  performanceSubweights: Pick<
    GlobalRankingSubmetricWeights,
    "averageTransactionSpeed" | "blockTime" | "throughputIndicator"
  >,
  updatedBy: string,
) {
  await initializeActiveAssumptionsStore();
  const current = getActiveAssumptions();

  return saveActiveAssumptions(
    withAudit(
      {
        ...current,
        globalRanking: {
          ...current.globalRanking,
          ecosystemSubweights,
          adoptionSubweights,
          performanceSubweights,
        },
      },
      updatedBy,
    ),
  );
}

export async function updateOpportunityScoringAdvancedAssumptions(
  stackFitComponents: OpportunityStackFitComponentWeights,
  priorityThresholds: OpportunityPriorityThresholds,
  updatedBy: string,
) {
  await initializeActiveAssumptionsStore();
  const current = getActiveAssumptions();

  return saveActiveAssumptions(
    withAudit(
      {
        ...current,
        opportunityScoring: {
          ...current.opportunityScoring,
          stackFitComponents,
          priorityThresholds,
        },
      },
      updatedBy,
    ),
  );
}

export async function updateWedgeApplicabilityAssumptions(
  wedgeApplicability: WedgeApplicabilityAssumptionSet,
  updatedBy: string,
) {
  await initializeActiveAssumptionsStore();
  const current = getActiveAssumptions();

  return saveActiveAssumptions(
    withAudit(
      {
        ...current,
        wedgeApplicability,
      },
      updatedBy,
    ),
  );
}

export async function updateAnalysisSettings(
  analysisSettings: AnalysisSettings,
  updatedBy: string,
) {
  await initializeActiveAssumptionsStore();
  const current = getActiveAssumptions();

  return saveActiveAssumptions(
    withAudit(
      {
        ...current,
        analysisSettings,
      },
      updatedBy,
    ),
  );
}

export async function updateProposalGeneratorSettings(
  proposalGenerator: ProposalGeneratorSettings,
  updatedBy: string,
) {
  await initializeActiveAssumptionsStore();
  const current = getActiveAssumptions();

  return saveActiveAssumptions(
    withAudit(
      {
        ...current,
        proposalGenerator,
      },
      updatedBy,
    ),
  );
}
