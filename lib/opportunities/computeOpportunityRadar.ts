import { listBuyerPersonasByChainSlug } from "@/lib/personas/store";
import { listProposalDocumentsByChainSlug } from "@/lib/proposals/store";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { estimateProposalRoiBand } from "@/lib/proposals/estimateProposalROI";
import { rankOffersForProfile } from "@/lib/offers/offerMatching";
import { listOfferLibrary } from "@/lib/offers/library";

export type OpportunityRadarRow = {
  chainId: string;
  chainSlug: string;
  chainName: string;
  wedge: string;
  opportunityScore: number;
  keyGap: string;
  recommendedOffer: string;
  recommendedOfferId: string;
  personaName: string | null;
  estimatedRoiBand: string;
  confidence: "high" | "medium" | "low";
  rationale: string;
  currentRank: number;
};

const repository = createSeedChainsRepository();

function determineConfidence(params: {
  proposalCount: number;
  personaCount: number;
  applicabilityConfidence: string;
}) {
  if (
    params.proposalCount > 0 &&
    (params.applicabilityConfidence === "high" ||
      params.applicabilityConfidence === "medium")
  ) {
    return "high" as const;
  }

  if (params.personaCount > 0 || params.applicabilityConfidence === "medium") {
    return "medium" as const;
  }

  return "low" as const;
}

export function computeOpportunityRadar() {
  const offers = listOfferLibrary().filter((offer) => offer.isActive);
  const rows: OpportunityRadarRow[] = [];

  repository
    .listTargetAccounts({
      sort: "opportunityScore",
      direction: "desc",
    })
    .forEach((target) => {
      const profile = repository.getChainProfileBySlug(
        target.chain.slug,
        target.economy.slug,
      );

      if (!profile) {
        return;
      }

      const personas = listBuyerPersonasByChainSlug(target.chain.slug);
      const proposals = listProposalDocumentsByChainSlug(target.chain.slug).filter(
        (proposal) => proposal.wedgeId === target.economy.slug,
      );
      const topProposal = proposals[0] ?? null;
      const matchedPersona =
        (topProposal
          ? personas.find((persona) => persona.id === topProposal.personaId)
          : null) ?? personas[0] ?? null;
      const matchedOffer =
        (topProposal
          ? offers.find((offer) => offer.offerId === topProposal.offerId)
          : null) ??
        rankOffersForProfile({
          profile,
          offers,
          persona: matchedPersona,
        })[0]?.offer ??
        offers.find((offer) => offer.applicableWedges.includes(target.economy.slug)) ??
        null;

      if (!matchedOffer) {
        return;
      }

      const personaName = matchedPersona?.personName ?? null;

      rows.push({
        chainId: target.chain.id,
        chainSlug: target.chain.slug,
        chainName: target.chain.name,
        wedge: target.economy.name,
        opportunityScore: Number(target.opportunity.totalScore.toFixed(1)),
        keyGap:
          target.missingModules[0]?.module.name ?? "Capability coverage review",
        recommendedOffer: matchedOffer.name,
        recommendedOfferId: matchedOffer.offerId,
        personaName,
        estimatedRoiBand: topProposal?.roiEstimation ?? estimateProposalRoiBand(matchedOffer),
        confidence: determineConfidence({
          proposalCount: proposals.length,
          personaCount: personas.length,
          applicabilityConfidence: target.applicability.confidenceLevel,
        }),
        rationale:
          topProposal?.proposalSummary ??
          `${target.chain.name} has a ${
            target.missingModules[0]?.module.name ?? "material"
          } readiness gap in ${target.economy.shortLabel} and ${
            matchedOffer.name
          } is the strongest active Protofire offer to close it.`,
        currentRank: target.readinessRank,
      });
    });

  return rows;
}
