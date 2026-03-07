import {
  defaultScoringConfig,
  moduleStatusScoreMap,
} from "@/lib/config/economies";
import type {
  Chain,
  ChainEconomyReadiness,
  ChainModuleStatus,
  EconomyType,
  ModuleAvailabilityStatus,
} from "@/lib/domain/types";

export function getStatusFactor(
  status: ModuleAvailabilityStatus,
  economy: Pick<EconomyType, "scoringConfig"> = {
    scoringConfig: defaultScoringConfig,
  },
) {
  return economy.scoringConfig.statusScores[status] ?? moduleStatusScoreMap[status];
}

export function getWeightedContribution(
  weight: number,
  status: ModuleAvailabilityStatus,
  economy: Pick<EconomyType, "scoringConfig"> = {
    scoringConfig: defaultScoringConfig,
  },
) {
  return (
    weight *
    getStatusFactor(status, economy) *
    (economy.scoringConfig.maximumScore / 100)
  );
}

export function buildChainModuleStatuses(
  chain: Chain,
  economy: EconomyType,
  moduleDetails: Record<
    string,
    Pick<ChainModuleStatus, "status" | "evidenceNote" | "rationale">
  >,
): ChainModuleStatus[] {
  return economy.modules.map((module) => {
    const detail = moduleDetails[module.slug];

    if (!detail) {
      throw new Error(
        `Missing module detail for ${economy.slug}:${module.slug} on ${chain.slug}`,
      );
    }

    return {
      chainId: chain.id,
      economyType: economy.slug,
      moduleId: module.id,
      moduleSlug: module.slug,
      status: detail.status,
      score: getStatusFactor(detail.status, economy),
      evidenceNote: detail.evidenceNote,
      rationale: detail.rationale,
    };
  });
}

export function buildReadinessScore(
  chainId: string,
  economy: EconomyType,
  moduleStatuses: ChainModuleStatus[],
): ChainEconomyReadiness {
  const moduleBreakdown = economy.modules.map((module) => {
    const status = moduleStatuses.find(
      (moduleStatus) => moduleStatus.moduleId === module.id,
    );

    if (!status) {
      throw new Error(
        `Missing module status for ${economy.slug}:${module.slug} on ${chainId}`,
      );
    }

    return {
      module,
      status: status.status,
      score: status.score,
      weightedContribution: getWeightedContribution(
        module.weight,
        status.status,
        economy,
      ),
      evidenceNote: status.evidenceNote,
      rationale: status.rationale,
    };
  });

  return {
    chainId,
    economyType: economy.slug,
    totalScore: moduleBreakdown.reduce(
      (total, module) => total + module.weightedContribution,
      0,
    ),
    moduleBreakdown,
  };
}
