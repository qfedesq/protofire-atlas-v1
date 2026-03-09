import type {
  BuyerPersonaRecord,
  ChainProfile,
  OfferLibraryItem,
  ProposalDocument,
} from "@/lib/domain/types";

export function buildProposalSummary(params: {
  profile: ChainProfile;
  persona: BuyerPersonaRecord;
  offer: OfferLibraryItem;
}) {
  const { profile, persona, offer } = params;
  return `${offer.name} is the strongest fit for ${profile.chain.name} in ${profile.economy.name} because it closes the current readiness blockers while aligning with ${persona.personName}'s KPI and execution pressure.`;
}

export function buildProposalMarkdown(proposal: ProposalDocument) {
  return [
    `# ${proposal.offerName} for ${proposal.chainSlug}`,
    "",
    `Persona: ${proposal.personaName}`,
    `Wedge: ${proposal.wedgeId}`,
    `Opportunity fit score: ${proposal.opportunityFitScore}%`,
    `Strategic fit: ${proposal.strategicFit}%`,
    "",
    "## Summary",
    proposal.proposalSummary,
    "",
    "## Expected chain outcome",
    proposal.expectedChainOutcome,
    "",
    "## Risk reduction",
    proposal.riskReduction,
    "",
    "## ROI",
    proposal.roiEstimation,
    "",
  ].join("\n");
}
