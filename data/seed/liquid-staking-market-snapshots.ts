import type {
  LiquidStakingMarketSnapshotSeed,
  LiquidStakingMetricSource,
} from "@/lib/domain/types";

const snapshotDate = "2026-03-07";

function createSources(): LiquidStakingMetricSource[] {
  return [
    {
      metric: "marketCapUsd",
      provider: "DeFiLlama",
      url: "https://api-docs.defillama.com/",
      snapshotDate,
      status: "pending",
      note: "DeFiLlama chain and coin surfaces are the preferred snapshot source for chain market cap and TVL normalization.",
    },
    {
      metric: "percentStaked",
      provider: "Staking Rewards API",
      url: "https://api-docs.stakingrewards.com/",
      snapshotDate,
      status: "pending",
      note: "Preferred source for staking ratio snapshots where chain coverage exists.",
    },
    {
      metric: "stakingApyPercent",
      provider: "Staking Rewards API",
      url: "https://api-docs.stakingrewards.com/",
      snapshotDate,
      status: "pending",
      note: "Preferred source for staking reward rate and yield snapshots where chain coverage exists.",
    },
    {
      metric: "stakersCount",
      provider: "Chain-specific explorer or validator API",
      url: "https://docs.beaconcha.in/",
      snapshotDate,
      status: "pending",
      note: "Ethereum can use Beaconcha; non-Ethereum networks still require chain-specific validator or staking explorer coverage.",
    },
    {
      metric: "lstProtocolCount",
      provider: "DeFiLlama protocol category snapshot",
      url: "https://defillama.com/protocols/Liquid%20Staking",
      snapshotDate,
      status: "pending",
      note: "Preferred source for counting tracked liquid staking protocols per chain from the current curated snapshot.",
    },
    {
      metric: "lstToStakedPercent",
      provider: "Atlas derived metric",
      url: "https://github.com/qfedesq/protofire-atlas-v1",
      snapshotDate,
      status: "pending",
      note: "Derived as LST market value over the current staked market value once both inputs are captured.",
    },
    {
      metric: "defiTvlUsd",
      provider: "DeFiLlama",
      url: "https://api-docs.defillama.com/",
      snapshotDate,
      status: "captured",
      note: "Already seeded from the top-30 EVM chain selection snapshot.",
    },
    {
      metric: "globalLstHealthScore",
      provider: "Atlas liquid staking diagnosis",
      url: "https://github.com/qfedesq/protofire-atlas-v1",
      snapshotDate,
      status: "captured",
      note: "Derived internally from the current 7-module liquid staking diagnosis weights and scores.",
    },
  ];
}

function createSnapshot(
  chainSlug: string,
  nativeTokenSymbol?: string | null,
): LiquidStakingMarketSnapshotSeed {
  return {
    chainSlug,
    nativeTokenSymbol: nativeTokenSymbol ?? null,
    marketCapUsd: null,
    percentStaked: null,
    stakingApyPercent: null,
    stakersCount: null,
    lstProtocolCount: null,
    lstToStakedPercent: null,
    sources: createSources(),
  };
}

export const liquidStakingMarketSnapshotSeeds: LiquidStakingMarketSnapshotSeed[] =
  [
    createSnapshot("ethereum", "ETH"),
    createSnapshot("bnb-chain", "BNB"),
    createSnapshot("base", "ETH"),
    createSnapshot("plasma"),
    createSnapshot("arbitrum", "ETH"),
    createSnapshot("avalanche", "AVAX"),
    createSnapshot("katana"),
    createSnapshot("polygon", "POL"),
    createSnapshot("mantle", "MNT"),
    createSnapshot("ink"),
    createSnapshot("monad"),
    createSnapshot("scroll", "ETH"),
    createSnapshot("cronos", "CRO"),
    createSnapshot("berachain", "BERA"),
    createSnapshot("optimism", "ETH"),
    createSnapshot("gnosis"),
    createSnapshot("linea", "ETH"),
    createSnapshot("hedera", "HBAR"),
    createSnapshot("plume", "PLUME"),
    createSnapshot("rootstock", "RBTC"),
    createSnapshot("megaeth"),
    createSnapshot("bitlayer"),
    createSnapshot("bob"),
    createSnapshot("unichain"),
    createSnapshot("ai-layer"),
    createSnapshot("mode", "ETH"),
    createSnapshot("ethereal"),
    createSnapshot("hemi"),
    createSnapshot("sonic", "S"),
    createSnapshot("fraxtal"),
  ];
