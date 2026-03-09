import type { OpportunityRadarRow } from "./computeOpportunityRadar";

export function explainOpportunity(row: OpportunityRadarRow) {
  return `${row.chainName} is a ${row.confidence}-confidence ${row.wedge} target because ${row.keyGap.toLowerCase()} remains open and ${row.recommendedOffer} is the clearest current Protofire fit.`;
}
