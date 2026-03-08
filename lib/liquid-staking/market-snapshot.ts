import type {
  Chain,
  LiquidStakingDiagnosis,
  LiquidStakingMarketSnapshot,
} from "@/lib/domain/types";
import { getResolvedLiquidStakingMarketSnapshotSeeds } from "@/lib/admin/manual-data";

const snapshotDate = "2026-03-07";

function getSnapshotSeedByChain() {
  return new Map(
    getResolvedLiquidStakingMarketSnapshotSeeds().map((snapshot) => [
      snapshot.chainSlug,
      snapshot,
    ]),
  );
}

export function buildLiquidStakingMarketSnapshot(
  chain: Chain,
  diagnosis: LiquidStakingDiagnosis,
): LiquidStakingMarketSnapshot | undefined {
  const seed = getSnapshotSeedByChain().get(chain.slug);

  if (!seed) {
    return undefined;
  }

  return {
    nativeTokenSymbol: seed.nativeTokenSymbol ?? null,
    marketCapUsd: seed.marketCapUsd ?? null,
    percentStaked: seed.percentStaked ?? null,
    stakingApyPercent: seed.stakingApyPercent ?? null,
    stakersCount: seed.stakersCount ?? null,
    globalLstHealthScore: Math.round(diagnosis.weightedScore),
    lstProtocolCount: seed.lstProtocolCount ?? null,
    lstToStakedPercent: seed.lstToStakedPercent ?? null,
    defiTvlUsd: chain.sourceTvlUsd,
    snapshotDate,
    sources: seed.sources,
  };
}
