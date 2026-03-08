import type { ChainProfile, OutreachBrief, TargetAccountRow } from "@/lib/domain/types";

function summarizePeerComparison(profile: ChainProfile) {
  const peer = profile.peers[0];

  if (!peer) {
    return `${profile.chain.name} is already at the top of the nearby benchmark set for ${profile.economy.name}.`;
  }

  const decisiveModules = peer.decisiveModules
    .slice(0, 2)
    .map((module) => module.module.name)
    .join(", ");

  return `${peer.chain.name} currently sits ${peer.relativePosition} ${profile.chain.name} because of stronger ${decisiveModules.toLowerCase()} coverage.`;
}

function summarizeProtofireOpportunity(row: TargetAccountRow) {
  const recommendations = row.recommendedStack.recommendedModules
    .slice(0, 2)
    .map((module) => module.title.replace(/^Activate |^Upgrade /, ""))
    .join(" + ");

  return recommendations.length > 0
    ? `Deploy ${recommendations}.`
    : "Focus on optimization, positioning, and packaging instead of foundational rollout.";
}

export function buildOutreachBrief(
  profile: ChainProfile,
  opportunity: TargetAccountRow,
): OutreachBrief {
  const keyGaps = opportunity.missingModules
    .slice(0, 3)
    .map((gap) => gap.module.name);

  return {
    chainName: profile.chain.name,
    economyName: profile.economy.name,
    globalRank: profile.globalPosition.benchmarkRank,
    economyRank: profile.rank,
    keyGaps,
    peerSummary: summarizePeerComparison(profile),
    protofireOpportunity: summarizeProtofireOpportunity(opportunity),
    suggestedOutreachAngle:
      keyGaps.length > 0
        ? `Closing ${keyGaps.slice(0, 2).join(" and ").toLowerCase()} would improve ${profile.chain.name}'s ${profile.economy.shortLabel} position inside the current Atlas benchmark.`
        : `${profile.chain.name} already clears the seeded readiness model, so the outreach angle is acceleration and go-to-market packaging.`,
  };
}
