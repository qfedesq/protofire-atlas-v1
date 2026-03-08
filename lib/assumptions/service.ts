import type {
  EconomyCompositeWeights,
  EconomyTypeSlug,
  GlobalRankingComponentWeights,
  OpportunityScoringWeights,
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
          weights,
        },
      },
      updatedBy,
    ),
  );
}
