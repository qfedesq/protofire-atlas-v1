import { getActiveProposalGeneratorSettings } from "@/lib/assumptions/resolve";
import type {
  BuyerPersonaRecord,
  ChainProfile,
  OfferLibraryItem,
} from "@/lib/domain/types";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

function keywordScore(text: string, keywords: string[]) {
  const haystack = text.toLowerCase();
  const matches = keywords.filter((keyword) => haystack.includes(keyword.toLowerCase()));

  return matches.length === 0 ? 0 : Math.min(100, (matches.length / keywords.length) * 100);
}

export function buildGapSeverity(profile: ChainProfile) {
  const totalLift = profile.recommendedStack.recommendedModules.reduce(
    (sum, item) => sum + item.potentialScoreLift,
    0,
  );

  return clampScore((totalLift / profile.economy.scoringConfig.maximumScore) * 100);
}

export function buildPersonaFit(persona: BuyerPersonaRecord, offer: OfferLibraryItem) {
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

  return Math.round(titleFit * 0.6 + empathyFit * 0.4);
}

export function buildExpectedImpact(profile: ChainProfile, offer: OfferLibraryItem) {
  const lift = profile.recommendedStack.recommendedModules.reduce(
    (sum, item) => sum + item.potentialScoreLift,
    0,
  );
  const offerBoost =
    offer.offerId === "liquid-staking" || offer.offerId === "arenas-fi" ? 10 : 0;

  return clampScore((lift / 3) * 100 + offerBoost);
}

export function buildProposalFitScore(params: {
  profile: ChainProfile;
  persona: BuyerPersonaRecord;
  offer: OfferLibraryItem;
}) {
  const { profile, persona, offer } = params;
  const settings = getActiveProposalGeneratorSettings();
  const applicability = profile.selectedWedgeApplicability.applicabilityScore;
  const gapSeverity = buildGapSeverity(profile);
  const personaFit = buildPersonaFit(persona, offer);
  const expectedImpact = buildExpectedImpact(profile, offer);
  const roiPotential = offer.roiEstimate.toLowerCase().includes("higher")
    ? 85
    : offer.roiEstimate.toLowerCase().includes("lower")
      ? 75
      : 70;
  const weights = settings.weights;
  const weightedTotal =
    applicability * (weights.applicability / 100) +
    gapSeverity * (weights.gapSeverity / 100) +
    personaFit * (weights.personaFit / 100) +
    expectedImpact * (weights.expectedImpact / 100) +
    roiPotential * (weights.roiPotential / 100);

  return {
    conversionProbability: clampScore(Math.round(weightedTotal)),
    strategicFit: clampScore(
      Math.round(applicability * 0.5 + expectedImpact * 0.3 + personaFit * 0.2),
    ),
    breakdown: {
      applicability,
      gapSeverity,
      personaFit,
      expectedImpact,
      roiPotential,
    },
  };
}
