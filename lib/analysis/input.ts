import { getActiveAnalysisSettings } from "@/lib/assumptions/resolve";
import { getActiveAssumptions } from "@/lib/assumptions/store";
import { atlasVersion } from "@/lib/config/version";
import type { ChainAnalysisInputSnapshot, EconomyTypeSlug } from "@/lib/domain/types";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

const repository = createSeedChainsRepository();

export function buildChainAnalysisInputSnapshot(chainSlug: string): ChainAnalysisInputSnapshot {
  const assumptions = getActiveAssumptions();
  const chain = repository.listChains().find((item) => item.slug === chainSlug);
  const globalPosition = repository
    .listGlobalRankedChains()
    .find((item) => item.chain.slug === chainSlug);
  const economies = repository.listEconomies();

  if (!chain || !globalPosition) {
    throw new Error(`Unknown chain analysis target "${chainSlug}".`);
  }

  const profiles = economies.map((economy) => {
    const profile = repository.getChainProfileBySlug(
      chainSlug,
      economy.slug as EconomyTypeSlug,
    );

    if (!profile) {
      throw new Error(
        `Missing chain profile for ${chainSlug} in ${economy.slug}.`,
      );
    }

    return {
      economy: {
        slug: profile.economy.slug,
        name: profile.economy.name,
      },
      readinessScore: {
        totalScore: profile.readinessScore.totalScore,
      },
      wedgeApplicability: profile.selectedWedgeApplicability,
      gapAnalysis: profile.gapAnalysis.map((gap) => ({
        problem: gap.problem,
        impact: gap.impact,
      })),
      recommendedStack: {
        narrativeSummary: profile.recommendedStack.narrativeSummary,
        items: profile.recommendedStack.recommendedModules.map((item) => ({
          title: item.title,
          deploymentPhase: item.deploymentPhaseKey,
          potentialScoreLift: item.potentialScoreLift,
        })),
      },
    };
  });

  return {
    chain: {
      id: chain.id,
      slug: chain.slug,
      name: chain.name,
    },
    technicalProfile:
      repository
        .listApplicabilityMatrixRows()
        .find((row) => row.chain.slug === chainSlug)?.technicalProfile ??
      repository.getChainProfileBySlug(chainSlug)?.technicalProfile ??
      (() => {
        throw new Error(`Missing technical profile for ${chainSlug}.`);
      })(),
    globalPosition: {
      benchmarkRank: globalPosition.benchmarkRank,
      score: {
        totalScore: globalPosition.score.totalScore,
      },
    },
    economies: profiles,
    assumptionsVersion: `${atlasVersion.semver}@${assumptions.updatedAt}`,
    sourceSnapshotDate: chain.sourceSnapshotDate,
  };
}

export function getCurrentAnalysisModelName() {
  return getActiveAnalysisSettings().modelName;
}
