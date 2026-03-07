import type {
  ChainProfile,
  ModuleBreakdown,
  PeerComparisonDelta,
  PeerComparisonItem,
  RankedChain,
  ScoreDriver,
} from "@/lib/domain/types";
import { getWeightedContribution } from "@/lib/scoring/readiness-score";

function hasDriverGap(
  module: ModuleBreakdown,
): module is ModuleBreakdown & { status: ScoreDriver["status"] } {
  return module.status !== "available";
}

function buildPeerOffsets(limit: number) {
  const offsets: number[] = [];

  for (let step = 1; offsets.length < limit * 2; step += 1) {
    offsets.push(-step, step);
  }

  return offsets;
}

export function buildScoreDrivers(profile: Pick<ChainProfile, "economy" | "readinessScore">): ScoreDriver[] {
  return profile.readinessScore.moduleBreakdown
    .filter(hasDriverGap)
    .map((module) => {
      const maxContribution = getWeightedContribution(
        module.module.weight,
        "available",
        profile.economy,
      );

      return {
        module: module.module,
        status: module.status,
        potentialGain: maxContribution - module.weightedContribution,
        currentContribution: module.weightedContribution,
        maxContribution,
      };
    })
    .sort((left, right) => {
      if (right.potentialGain !== left.potentialGain) {
        return right.potentialGain - left.potentialGain;
      }

      if (left.status !== right.status) {
        return left.status === "missing" ? -1 : 1;
      }

      return left.module.name.localeCompare(right.module.name);
    });
}

function buildPeerDeltas(current: RankedChain, peer: RankedChain) {
  const decisiveModules: PeerComparisonDelta[] = current.economy.modules
    .map((module) => {
      const currentBreakdown = current.readinessScore.moduleBreakdown.find(
        (item) => item.module.slug === module.slug,
      );
      const peerBreakdown = peer.readinessScore.moduleBreakdown.find(
        (item) => item.module.slug === module.slug,
      );

      if (!currentBreakdown || !peerBreakdown) {
        return null;
      }

      const weightedGap =
        peerBreakdown.weightedContribution - currentBreakdown.weightedContribution;

      if (
        (peer.benchmarkRank < current.benchmarkRank && weightedGap <= 0) ||
        (peer.benchmarkRank > current.benchmarkRank && weightedGap >= 0)
      ) {
        return null;
      }

      return {
        module,
        currentStatus: currentBreakdown.status,
        peerStatus: peerBreakdown.status,
        weightedGap: Math.abs(weightedGap),
      };
    })
    .filter((item): item is PeerComparisonDelta => item !== null)
    .sort((left, right) => right.weightedGap - left.weightedGap)
    .slice(0, 2);

  return decisiveModules;
}

export function buildPeerComparison(
  current: RankedChain,
  rankedChains: RankedChain[],
  limit = 3,
): PeerComparisonItem[] {
  const currentIndex = rankedChains.findIndex(
    (row) => row.chain.slug === current.chain.slug,
  );

  if (currentIndex === -1) {
    return [];
  }

  const peers = buildPeerOffsets(limit)
    .map((offset) => rankedChains[currentIndex + offset] ?? null)
    .filter((item): item is RankedChain => item !== null)
    .slice(0, limit)
    .sort((left, right) => left.benchmarkRank - right.benchmarkRank);

  return peers.map((peer) => ({
    chain: peer.chain,
    rank: peer.benchmarkRank,
    totalScore: peer.readinessScore.totalScore,
    relativePosition:
      peer.benchmarkRank < current.benchmarkRank ? "above" : "below",
    scoreGap: Math.abs(peer.readinessScore.totalScore - current.readinessScore.totalScore),
    decisiveModules: buildPeerDeltas(current, peer),
  }));
}
