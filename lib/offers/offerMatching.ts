import type {
  BuyerPersonaRecord,
  ChainProfile,
  OfferLibraryItem,
} from "@/lib/domain/types";

function normalize(text: string) {
  return text.trim().toLowerCase();
}

function keywordScore(haystack: string, needles: string[]) {
  if (needles.length === 0) {
    return 0;
  }

  const normalizedHaystack = normalize(haystack);
  const matches = needles.filter((needle) =>
    normalizedHaystack.includes(normalize(needle)),
  );

  return matches.length / needles.length;
}

export type OfferMatchResult = {
  offer: OfferLibraryItem;
  score: number;
  reasons: string[];
};

export function scoreOfferMatch(params: {
  profile: ChainProfile;
  offer: OfferLibraryItem;
  persona?: BuyerPersonaRecord | null;
}) {
  const { profile, offer, persona } = params;
  const firstGap = profile.gapAnalysis[0]?.module.name ?? "";
  const gapText = profile.gapAnalysis.map((item) => item.module.name).join(" ");
  const wedgeScore = offer.applicableWedges.includes(profile.economy.slug) ? 1 : 0;
  const gapScore = keywordScore(`${firstGap} ${gapText}`, [
    ...offer.technicalRequirements,
    offer.problemSolved,
  ]);
  const personaScore = persona
    ? keywordScore(
        `${persona.personTitle} ${persona.structuredData.empathyMap.fearTop3.join(" ")} ${persona.structuredData.empathyMap.needTop3.join(" ")}`,
        [...offer.targetPersonas, offer.problemSolved, offer.expectedImpact],
      )
    : 0.4;
  const impactScore = keywordScore(offer.expectedImpact, [
    profile.economy.name,
    ...profile.gapAnalysis.map((item) => item.impact),
  ]);

  const score = Math.round(
    (wedgeScore * 0.35 + gapScore * 0.3 + personaScore * 0.2 + impactScore * 0.15) *
      100,
  );

  const reasons = [
    wedgeScore > 0 ? `Tagged for ${profile.economy.shortLabel}.` : null,
    gapScore > 0.3 ? "Matches the current infrastructure blockers." : null,
    persona && personaScore > 0.3
      ? `Aligned with ${persona.personName}'s stated pressures and KPI context.`
      : null,
    impactScore > 0.3 ? "Expected impact overlaps with the current chain outcome target." : null,
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
