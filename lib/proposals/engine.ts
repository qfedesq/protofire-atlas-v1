import { randomUUID } from "node:crypto";

import { getActiveProposalGeneratorSettings } from "@/lib/assumptions/resolve";
import type {
  BuyerPersonaRecord,
  EconomyTypeSlug,
  OfferLibraryItem,
  ProposalDocument,
} from "@/lib/domain/types";
import { listOfferLibrary } from "@/lib/offers/library";
import { listActiveEconomyTypes } from "@/lib/assumptions/resolve";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { saveProposalDocuments } from "@/lib/proposals/store";

const repository = createSeedChainsRepository();

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

function keywordScore(text: string, keywords: string[]) {
  const haystack = text.toLowerCase();
  const matches = keywords.filter((keyword) => haystack.includes(keyword.toLowerCase()));

  return matches.length === 0 ? 0 : Math.min(100, (matches.length / keywords.length) * 100);
}

function buildGapSeverity(chainSlug: string, economySlug: EconomyTypeSlug) {
  const profile = repository.getChainProfileBySlug(chainSlug, economySlug);

  if (!profile) {
    return 0;
  }

  const totalLift = profile.recommendedStack.recommendedModules.reduce(
    (sum, item) => sum + item.potentialScoreLift,
    0,
  );

  return clampScore((totalLift / profile.economy.scoringConfig.maximumScore) * 100);
}

function buildPersonaFit(persona: BuyerPersonaRecord, offer: OfferLibraryItem) {
  const title = persona.personTitle.toLowerCase();
  const targets = offer.targetPersonas;
  const fearKeywords = persona.structuredData.empathyMap.fearTop3;
  const needsKeywords = persona.structuredData.empathyMap.needTop3;
  const offerText = [
    offer.problemSolved,
    offer.expectedImpact,
    offer.implementationScope,
    offer.targetCustomer,
  ].join(" ");

  const titleFit = targets.some((target) => title.includes(target.toLowerCase()))
    ? 100
    : keywordScore(title, targets);
  const empathyFit = Math.max(
    keywordScore(offerText, fearKeywords),
    keywordScore(offerText, needsKeywords),
  );

  return Math.round((titleFit * 0.6 + empathyFit * 0.4));
}

function buildExpectedImpact(chainSlug: string, economySlug: EconomyTypeSlug, offer: OfferLibraryItem) {
  const profile = repository.getChainProfileBySlug(chainSlug, economySlug);

  if (!profile) {
    return 0;
  }

  const lift = profile.recommendedStack.recommendedModules.reduce(
    (sum, item) => sum + item.potentialScoreLift,
    0,
  );
  const offerBoost =
    offer.offerId === "liquid-staking" || offer.offerId === "arenas-fi" ? 10 : 0;

  return clampScore((lift / 3) * 100 + offerBoost);
}

function buildRoiPotential(offer: OfferLibraryItem) {
  if (offer.roiEstimate.toLowerCase().includes("higher")) {
    return 85;
  }

  if (offer.roiEstimate.toLowerCase().includes("lower")) {
    return 75;
  }

  return 70;
}

function buildProposalMarkdown(proposal: ProposalDocument) {
  return [
    `# ${proposal.offerName} for ${proposal.chainSlug}`,
    "",
    `Persona: ${proposal.personaName}`,
    `Wedge: ${proposal.wedgeId}`,
    `Conversion probability: ${proposal.conversionProbability}%`,
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

export async function generateProposalsForPersona(
  chainSlug: string,
  persona: BuyerPersonaRecord,
  createdBy: string,
) {
  const settings = getActiveProposalGeneratorSettings();
  const offers = listOfferLibrary();
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
      const applicability = profile.selectedWedgeApplicability.applicabilityScore;
      const gapSeverity = buildGapSeverity(chainSlug, economy.slug);
      const personaFit = buildPersonaFit(persona, offer);
      const expectedImpact = buildExpectedImpact(chainSlug, economy.slug, offer);
      const roiPotential = buildRoiPotential(offer);
      const weights = settings.weights;
      const weightedTotal =
        applicability * (weights.applicability / 100) +
        gapSeverity * (weights.gapSeverity / 100) +
        personaFit * (weights.personaFit / 100) +
        expectedImpact * (weights.expectedImpact / 100) +
        roiPotential * (weights.roiPotential / 100);
      const conversionProbability = clampScore(Math.round(weightedTotal));
      const strategicFit = clampScore(
        Math.round((applicability * 0.5 + expectedImpact * 0.3 + personaFit * 0.2)),
      );
      const firstRecommendation = profile.recommendedStack.recommendedModules[0];
      const proposal: ProposalDocument = {
        proposalId: randomUUID(),
        chainId: profile.chain.id,
        chainSlug: profile.chain.slug,
        wedgeId: economy.slug,
        personaId: persona.id,
        personaName: persona.personName,
        offerId: offer.offerId,
        offerName: offer.name,
        conversionProbability,
        strategicFit,
        roiEstimation: offer.roiEstimate,
        riskReduction:
          firstRecommendation?.directChainImpact ??
          "Reduces infrastructure execution risk for the target wedge.",
        expectedChainOutcome:
          firstRecommendation?.expectedResult ?? offer.expectedImpact,
        proposalSummary: `${offer.name} is the strongest fit for ${profile.chain.name} in ${economy.name} because it closes the current readiness blockers while aligning with ${persona.personName}'s KPI and execution pressure.`,
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
