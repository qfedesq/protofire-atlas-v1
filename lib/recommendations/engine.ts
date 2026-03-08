import type {
  Chain,
  DeploymentPlan,
  DeploymentPhase,
  DeploymentPhaseKpi,
  EconomyType,
  GapAnalysisItem,
  ModuleBreakdown,
  RecommendedStack,
  RecommendationItem,
} from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

const timelineSteps = [
  "Weeks 1-2",
  "Weeks 3-4",
  "Weeks 5-6",
  "Weeks 7-8",
  "Weeks 9-10",
] as const;

function buildTargetStateLabel(recommendations: RecommendationItem[]) {
  const hasMissing = recommendations.some(
    (recommendation) => recommendation.currentStatus === "missing",
  );
  const hasPartial = recommendations.some(
    (recommendation) => recommendation.currentStatus === "partial",
  );

  if (hasMissing && hasPartial) {
    return "Missing + partial -> available";
  }

  if (hasMissing) {
    return "Missing -> available";
  }

  return "Partial -> available";
}

function buildDeploymentPhaseKpis(
  recommendations: RecommendationItem[],
): DeploymentPhaseKpi[] {
  const totalLift = recommendations.reduce(
    (sum, recommendation) => sum + recommendation.potentialScoreLift,
    0,
  );

  return [
    {
      label: "Target Atlas lift",
      value: `+${formatScore(totalLift)} pts`,
    },
    {
      label: "Modules closed",
      value: String(recommendations.length),
    },
    {
      label: "Target state",
      value: buildTargetStateLabel(recommendations),
    },
  ];
}

function hasGap(
  module: ModuleBreakdown,
): module is ModuleBreakdown & { status: GapAnalysisItem["status"] } {
  return module.status !== "available";
}

function shouldRecommendModule(
  economy: EconomyType,
  module: ModuleBreakdown,
): module is ModuleBreakdown & { status: GapAnalysisItem["status"] } {
  const moduleScore = economy.scoringConfig.statusScores[module.status];

  if (module.status === "missing") {
    return (
      economy.recommendationConfig.includeMissingRecommendations &&
      moduleScore <= economy.recommendationConfig.thresholdScore
    );
  }

  if (module.status === "partial") {
    return (
      economy.recommendationConfig.includePartialRecommendations &&
      moduleScore <= economy.recommendationConfig.thresholdScore
    );
  }

  return false;
}

export function buildGapAnalysis(
  economy: EconomyType,
  moduleBreakdown: ModuleBreakdown[],
): GapAnalysisItem[] {
  return moduleBreakdown.filter(hasGap).map((module) => ({
    module: module.module,
    status: module.status,
    problem:
      module.status === "missing"
        ? `${module.module.name} is missing. ${module.rationale}`
        : `${module.module.name} is only partially available. ${module.rationale}`,
    impact: economy.recommendationRules[module.module.slug]!.gapImpact[
      module.status
    ],
  }));
}

function buildRecommendationItems(
  economy: EconomyType,
  moduleBreakdown: ModuleBreakdown[],
): RecommendationItem[] {
  return moduleBreakdown
    .filter((module) => shouldRecommendModule(economy, module))
    .map((module) => {
      const rule = economy.recommendationRules[module.module.slug]!;
      const isMissing = module.status === "missing";

      return {
        module: module.module,
        title: isMissing ? rule.missingTitle : rule.partialTitle,
        whyItMatters: rule.whyItMatters,
        expectedResult: isMissing ? rule.missingResult : rule.partialResult,
        directChainImpact: isMissing
          ? rule.missingChainImpact
          : rule.partialChainImpact,
        deploymentPhaseKey: rule.deploymentPhaseKey,
        narrativeSummary: isMissing ? rule.missingSummary : rule.partialSummary,
        currentStatus: module.status,
        potentialScoreLift:
          (module.module.weight * economy.scoringConfig.maximumScore) / 100 -
          module.weightedContribution,
        kpis: [],
      };
    })
    .sort((left, right) => {
      const phaseDelta =
        economy.deploymentTemplates.findIndex(
          (template) => template.key === left.deploymentPhaseKey,
        ) -
        economy.deploymentTemplates.findIndex(
          (template) => template.key === right.deploymentPhaseKey,
        );

      if (phaseDelta !== 0) {
        return phaseDelta;
      }

      return (
        economy.modules.findIndex((module) => module.slug === left.module.slug) -
        economy.modules.findIndex((module) => module.slug === right.module.slug)
      );
    });
}

function buildDeploymentPhases(
  economy: EconomyType,
  recommendations: RecommendationItem[],
): DeploymentPhase[] {
  const activeTemplates = economy.deploymentTemplates.filter((template) =>
    recommendations.some(
      (recommendation) =>
        recommendation.deploymentPhaseKey === template.key,
    ),
  );

  return activeTemplates.map((template, index) => {
    const phaseRecommendations = recommendations.filter(
      (recommendation) => recommendation.deploymentPhaseKey === template.key,
    );

    return {
      id: `${economy.slug}-phase-${index + 1}`,
      key: template.key,
      label: `Phase ${index + 1}`,
      title: template.name,
      timelineLabel:
        timelineSteps[index] ??
        `Weeks ${index * 2 + 1}-${index * 2 + 2}`,
      objective: template.objective,
      kpis: buildDeploymentPhaseKpis(phaseRecommendations),
      tasks: phaseRecommendations.map((recommendation) => recommendation.title),
    };
  });
}

function buildNarrativeSummary(
  chainName: string,
  economy: EconomyType,
  recommendations: RecommendationItem[],
) {
  if (recommendations.length === 0) {
    return `${chainName} clears every seeded module in the ${economy.name} model. Protofire would focus on optimization, packaging, and go-to-market positioning instead of foundational gap closure.`;
  }

  const moduleNames = recommendations.map(
    (recommendation) => recommendation.module.name,
  );
  const summaryList =
    moduleNames.length === 1
      ? moduleNames[0]
      : `${moduleNames.slice(0, -1).join(", ")} and ${moduleNames.at(-1)}`;

  return `${chainName} should close ${summaryList.toLowerCase()} gaps first to improve its ${economy.name.toLowerCase()} readiness before broader ecosystem activation.`;
}

export function buildRecommendedStack(
  chain: Chain,
  economy: EconomyType,
  moduleBreakdown: ModuleBreakdown[],
): RecommendedStack {
  const recommendationDrafts = buildRecommendationItems(economy, moduleBreakdown);
  const deploymentPhases = buildDeploymentPhases(economy, recommendationDrafts);
  const phaseByKey = new Map(
    deploymentPhases.map((phase) => [phase.key, phase] as const),
  );
  const recommendedModules = recommendationDrafts.map((recommendation) => {
    const phase = phaseByKey.get(recommendation.deploymentPhaseKey);

    return {
      ...recommendation,
      kpis: [
        {
          label: "Atlas score lift",
          value: `+${formatScore(recommendation.potentialScoreLift)} pts`,
        },
        {
          label: "Gap closure",
          value:
            recommendation.currentStatus === "missing"
              ? "Missing -> available"
              : "Partial -> available",
        },
        {
          label: "Delivery window",
          value: phase
            ? `${phase.label} · ${phase.timelineLabel}`
            : recommendation.deploymentPhaseKey,
        },
      ],
    };
  });

  return {
    chainId: chain.id,
    economyType: economy.slug,
    recommendedModules,
    deploymentPhases,
    narrativeSummary: buildNarrativeSummary(
      chain.name,
      economy,
      recommendedModules,
    ),
  };
}

export function buildDeploymentPlan(
  chain: Chain,
  economy: EconomyType,
  stack: RecommendedStack,
): DeploymentPlan {
  return {
    chainId: chain.id,
    economyType: economy.slug,
    phases: stack.deploymentPhases,
    ctaText:
      stack.recommendedModules.length === 0
        ? `Talk to Protofire about refining ${chain.name}'s current ${economy.name} posture.`
        : `Talk to Protofire about activating ${stack.recommendedModules.length} readiness modules for ${chain.name}'s ${economy.shortLabel} stack.`,
  };
}
