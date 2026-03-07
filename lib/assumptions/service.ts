import type { EconomyTypeSlug } from "@/lib/domain/types";
import { validateStatusScoreKey } from "@/lib/assumptions/schemas";
import { getActiveAssumptions, saveActiveAssumptions } from "@/lib/assumptions/store";
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

export function updateStatusScores(
  entries: Record<string, number>,
  updatedBy: string,
) {
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

export function updateEconomyAssumptions(
  economySlug: EconomyTypeSlug,
  moduleWeights: Record<string, number>,
  recommendationConfig: ActiveAssumptions["economies"][EconomyTypeSlug]["recommendationConfig"],
  updatedBy: string,
) {
  const current = getActiveAssumptions();

  return saveActiveAssumptions(
    withAudit(
      {
        ...current,
        economies: {
          ...current.economies,
          [economySlug]: {
            moduleWeights,
            recommendationConfig,
          },
        },
      },
      updatedBy,
    ),
  );
}
