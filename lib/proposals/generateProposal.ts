import { randomUUID } from "node:crypto";

import { listActiveEconomyTypes } from "@/lib/assumptions/resolve";
import type {
  BuyerPersonaRecord,
  ProposalDocument,
} from "@/lib/domain/types";
import { listOfferLibrary } from "@/lib/offers/library";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

import { estimateProposalRoi } from "./estimateProposalROI";
import { buildProposalFitScore } from "./scoreProposalFit";
import { buildProposalMarkdown, buildProposalSummary } from "./proposalTemplates";
import { saveProposalDocuments } from "./proposalStorage";

const repository = createSeedChainsRepository();

export async function generateProposalsForPersona(
  chainSlug: string,
  persona: BuyerPersonaRecord,
  createdBy: string,
) {
  const offers = listOfferLibrary().filter((offer) => offer.isActive);
  const proposals: ProposalDocument[] = [];

  for (const economy of listActiveEconomyTypes()) {
    const profile = repository.getChainProfileBySlug(chainSlug, economy.slug);

    if (!profile) {
      continue;
    }

    if (profile.selectedWedgeApplicability.applicabilityStatus === "not_applicable") {
      continue;
    }

    const matchingOffers = offers.filter((offer) =>
      offer.applicableWedges.includes(economy.slug),
    );

    for (const offer of matchingOffers) {
      const fit = buildProposalFitScore({
        profile,
        persona,
        offer,
      });
      const firstRecommendation = profile.recommendedStack.recommendedModules[0];
      const roi = estimateProposalRoi(offer);
      const proposal: ProposalDocument = {
        proposalId: randomUUID(),
        chainId: profile.chain.id,
        chainSlug: profile.chain.slug,
        wedgeId: economy.slug,
        personaId: persona.id,
        personaName: persona.personName,
        offerId: offer.offerId,
        offerName: offer.name,
        conversionProbability: fit.conversionProbability,
        strategicFit: fit.strategicFit,
        roiEstimation: roi.label,
        riskReduction:
          firstRecommendation?.directChainImpact ??
          "Reduces infrastructure execution risk for the target wedge.",
        expectedChainOutcome:
          firstRecommendation?.expectedResult ?? offer.expectedImpact,
        proposalSummary: buildProposalSummary({
          profile,
          persona,
          offer,
        }),
        markdownContent: "",
        createdAt: new Date().toISOString(),
        createdBy,
      };

      proposals.push({
        ...proposal,
        markdownContent: buildProposalMarkdown(proposal),
      });
    }
  }

  const sorted = proposals.sort((left, right) => {
    if (right.conversionProbability !== left.conversionProbability) {
      return right.conversionProbability - left.conversionProbability;
    }

    return right.strategicFit - left.strategicFit;
  });

  await saveProposalDocuments(sorted);

  return sorted;
}
