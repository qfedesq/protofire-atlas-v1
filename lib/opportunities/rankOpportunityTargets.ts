import type { OpportunityRadarRow } from "./computeOpportunityRadar";

export function rankOpportunityTargets(rows: OpportunityRadarRow[]) {
  return [...rows].sort((left, right) => {
    if (right.opportunityScore !== left.opportunityScore) {
      return right.opportunityScore - left.opportunityScore;
    }

    if (left.confidence !== right.confidence) {
      const order = { high: 3, medium: 2, low: 1 };
      return order[right.confidence] - order[left.confidence];
    }

    return left.chainName.localeCompare(right.chainName);
  });
}
