import type {
  AnalysisSettings,
  ChainAnalysisInputSnapshot,
} from "@/lib/domain/types";

const analysisPromptTemplates = {
  "technical-applicability-v1": {
    label: "Technical applicability baseline review",
    instructions(
      snapshot: ChainAnalysisInputSnapshot,
      settings: AnalysisSettings,
    ) {
      return [
        "You are assisting Protofire Atlas with an internal chain-level technical analysis.",
        "Your job is to evaluate the provided deterministic Atlas baseline, not to replace it.",
        "Keep readiness and applicability separate. Applicability means whether a wedge is technically feasible on the chain, even if readiness is low.",
        "Do not invent unsupported ecosystem facts. If the provided snapshot is insufficient, keep the wedge conservative and mark manual review when needed.",
        "Return a structured response only.",
        `Sensitivity: ${settings.sensitivity}. Opportunity threshold: ${settings.opportunityThreshold}. Manual review threshold: ${settings.manualReviewThreshold}.`,
        `Analyze all ${snapshot.economies.length} wedges, but prioritize the strongest Protofire opportunities and the main technical blockers.`,
      ].join(" ");
    },
  },
  "strategic-proposal-v1": {
    label: "Strategic proposal and buyer analysis",
    instructions(
      snapshot: ChainAnalysisInputSnapshot,
      settings: AnalysisSettings,
    ) {
      return [
        "You are assisting Protofire Atlas with an internal strategic analysis for one chain.",
        "Keep deterministic Atlas scores and applicability separate from your AI-assisted reasoning.",
        "Use the provided capability profile, wedge applicability baseline, buyer personas, and offer library as the only analysis context.",
        "Do not invent external facts that are not already present in the snapshot.",
        "Analyze only the active wedges included in the snapshot.",
        "Prioritize the most conversion-ready Protofire opportunity, explain the buyer incentives, and produce a concise proposal draft.",
        "If persona coverage is weak, say so and keep confidence lower instead of inventing precision.",
        "Return a structured response only.",
        `Sensitivity: ${settings.sensitivity}. Opportunity threshold: ${settings.opportunityThreshold}. Manual review threshold: ${settings.manualReviewThreshold}.`,
      ].join(" ");
    },
  },
} as const;

export function listAnalysisPromptTemplateKeys() {
  return Object.keys(analysisPromptTemplates) as Array<
    keyof typeof analysisPromptTemplates
  >;
}

export function resolveAnalysisPromptTemplate(
  key: string,
) {
  return (
    analysisPromptTemplates[
      key as keyof typeof analysisPromptTemplates
    ] ?? analysisPromptTemplates["technical-applicability-v1"]
  );
}
