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
