import type {
  BuyerPersonaRecord,
  ChainProfile,
  OfferLibraryItem,
} from "@/lib/domain/types";

export type OfferMatchResult = {
  offer: OfferLibraryItem;
  score: number;
  reasons: string[];
};

function computeGapModuleMatchScore(
  profile: ChainProfile,
  offer: OfferLibraryItem,
) {
  if (offer.targetModules.length === 0) {
    return 0;
  }

  const gapSlugs = new Set(
    profile.gapAnalysis.map((item) => item.module.slug),
  );
  const matches = offer.targetModules.filter((slug) => gapSlugs.has(slug));

  return matches.length / offer.targetModules.length;
}

function computePersonaScore(
  offer: OfferLibraryItem,
  persona?: BuyerPersonaRecord | null,
) {
  if (!persona) {
    return 0.4;
  }

  const title = persona.personTitle.toLowerCase();
  const titleMatch = offer.targetPersonas.some((target) =>
    title.includes(target.toLowerCase()),
  );

  return titleMatch ? 1 : 0.2;
}

export function scoreOfferMatch(params: {
  profile: ChainProfile;
  offer: OfferLibraryItem;
  persona?: BuyerPersonaRecord | null;
}) {
  const { profile, offer, persona } = params;

  const wedgeScore = offer.applicableWedges.includes(profile.economy.slug) ? 1 : 0;
  const gapScore = computeGapModuleMatchScore(profile, offer);
  const personaScore = computePersonaScore(offer, persona);
  const gapCoverage =
    profile.gapAnalysis.length > 0
      ? offer.targetModules.filter((slug) =>
          profile.gapAnalysis.some((gap) => gap.module.slug === slug),
        ).length / profile.gapAnalysis.length
      : 0;

  const score = Math.round(
    (wedgeScore * 0.35 + gapScore * 0.35 + personaScore * 0.15 + gapCoverage * 0.15) *
      100,
  );

  const matchedModules = offer.targetModules.filter((slug) =>
    profile.gapAnalysis.some((gap) => gap.module.slug === slug),
  );

  const reasons = [
    wedgeScore > 0 ? `Tagged for ${profile.economy.shortLabel}.` : null,
    matchedModules.length > 0
      ? `Directly addresses ${matchedModules.length} infrastructure gap${matchedModules.length > 1 ? "s" : ""}: ${matchedModules.join(", ")}.`
      : null,
    persona && personaScore > 0.5
      ? `Aligned with ${persona.personName}'s role as ${persona.personTitle}.`
      : null,
    gapCoverage > 0.5 ? "Covers the majority of the chain's open infrastructure gaps." : null,
  ].filter((value): value is string => Boolean(value));

  return {
    score,
    reasons,
  };
}

export function rankOffersForProfile(params: {
  profile: ChainProfile;
  offers: OfferLibraryItem[];
  persona?: BuyerPersonaRecord | null;
}) {
  const results = params.offers
    .filter((offer) => offer.isActive)
    .map((offer) => {
      const { score, reasons } = scoreOfferMatch({
        profile: params.profile,
        offer,
        persona: params.persona,
      });

      return {
        offer,
        score,
        reasons,
      } satisfies OfferMatchResult;
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.offer.name.localeCompare(right.offer.name);
    });

  return results;
}
