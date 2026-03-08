import { liquidStakingMarketSnapshotSeeds } from "@/data/seed/liquid-staking-market-snapshots";
import type {
  Chain,
  LiquidStakingDiagnosis,
  LiquidStakingMarketSnapshot,
} from "@/lib/domain/types";

const snapshotDate = "2026-03-07";

const snapshotSeedByChain = new Map(
  liquidStakingMarketSnapshotSeeds.map((snapshot) => [snapshot.chainSlug, snapshot]),
);

export function buildLiquidStakingMarketSnapshot(
  chain: Chain,
  diagnosis: LiquidStakingDiagnosis,
): LiquidStakingMarketSnapshot | undefined {
  const seed = snapshotSeedByChain.get(chain.slug);

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
