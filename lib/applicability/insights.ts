import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import type {
  ApplicabilityMatrixRow,
  EconomyType,
  WedgeApplicability,
} from "@/lib/domain/types";

export type ApplicabilityInsightRow = {
  chainName: string;
  chainSlug: string;
  wedgeName: string;
  readinessScore: number;
  applicabilityStatus: WedgeApplicability["applicabilityStatus"];
  confidenceLevel: WedgeApplicability["confidenceLevel"];
  reason: string;
};

const repository = createSeedChainsRepository();

function buildInsightRow(
  chainSlug: string,
  wedge: WedgeApplicability,
  wedgeName: string,
  reason: string,
): ApplicabilityInsightRow | null {
  const profile = repository.getChainProfileBySlug(chainSlug, wedge.wedgeId);

  if (!profile) {
    return null;
  }

  return {
    chainName: profile.chain.name,
    chainSlug: profile.chain.slug,
    wedgeName,
    readinessScore: profile.readinessScore.totalScore,
    applicabilityStatus: wedge.applicabilityStatus,
    confidenceLevel: wedge.confidenceLevel,
    reason,
  };
}

export function buildApplicabilityInsights(
  rows: ApplicabilityMatrixRow[],
  economies: EconomyType[],
) {
  const economyNameBySlug = new Map(
    economies.map((economy) => [economy.slug, economy.name] as const),
  );

  const strongReadinessWeakConfidence: ApplicabilityInsightRow[] = [];
  const assumptionRevisionCandidates: ApplicabilityInsightRow[] = [];
  const manualReviewFlags: ApplicabilityInsightRow[] = [];

  rows.forEach((row) => {
    row.wedges.forEach((wedge) => {
      const wedgeName = economyNameBySlug.get(wedge.wedgeId) ?? wedge.wedgeId;
      const insightRow = buildInsightRow(
        row.chain.slug,
        wedge,
        wedgeName,
        wedge.rationale,
      );

      if (!insightRow) {
        return;
      }

      if (
        insightRow.readinessScore >= 6 &&
        (wedge.confidenceLevel === "low" || wedge.manualReviewRecommended)
      ) {
        strongReadinessWeakConfidence.push(insightRow);
      }

      if (
        insightRow.readinessScore >= 6 &&
        (wedge.applicabilityStatus === "not_applicable" ||
          wedge.applicabilityStatus === "unknown")
      ) {
        assumptionRevisionCandidates.push({
          ...insightRow,
          reason:
            "Readiness remains relatively high while applicability is not definitive. Review the wedge assumptions and technical profile inputs.",
        });
      }

      if (wedge.manualReviewRecommended) {
        manualReviewFlags.push({
          ...insightRow,
          reason:
            "Deterministic applicability flagged this chain-wedge pair for manual review.",
        });
      }
    });
  });

  return {
    strongReadinessWeakConfidence,
    assumptionRevisionCandidates,
    manualReviewFlags,
  };
}
