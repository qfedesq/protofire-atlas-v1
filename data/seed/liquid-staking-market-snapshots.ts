import type {
  LiquidStakingMarketSnapshotSeed,
  LiquidStakingMetricSource,
} from "@/lib/domain/types";

const snapshotDate = "2026-03-07";

type MetricSourceOverrides = Record<
  string,
  Partial<LiquidStakingMetricSource>
>;

type SnapshotOverrides = Partial<
  Omit<LiquidStakingMarketSnapshotSeed, "chainSlug" | "sources">
>;

function createSources(
  overrides: MetricSourceOverrides = {},
): LiquidStakingMetricSource[] {
  const baseSources: LiquidStakingMetricSource[] = [
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
      url: "https://api.llama.fi/protocols",
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
      note: "Derived as liquid staking TVL over the current staking market cap once both inputs are captured.",
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

  return baseSources.map((source) => ({
    ...source,
    ...overrides[source.metric],
  }));
}

function createSnapshot(
  chainSlug: string,
  nativeTokenSymbol?: string | null,
  overrides: SnapshotOverrides = {},
  sourceOverrides: MetricSourceOverrides = {},
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
    ...overrides,
    sources: createSources(sourceOverrides),
  };
}

const ethBasedL2SourceOverrides = (
  chainLabel: string,
  lstProtocolCount: number,
  lstToStakedPercent: number,
): MetricSourceOverrides => ({
  marketCapUsd: {
    provider: "CoinGecko",
    url: "https://api.coingecko.com/api/v3/coins/ethereum",
    status: "captured",
    note: `${chainLabel} uses ETH as its native token in Atlas, so the market cap snapshot reuses the CoinGecko ETH market cap captured on ${snapshotDate}.`,
  },
  percentStaked: {
    provider: "Staking Rewards",
    url: "https://r.jina.ai/http://stakingrewards.com/asset/ethereum-2-0",
    status: "captured",
    note: `${chainLabel} inherits ETH staking base-layer conditions in Atlas. The current ETH staking ratio snapshot is 30.99%.`,
  },
  stakingApyPercent: {
    provider: "Staking Rewards",
    url: "https://r.jina.ai/http://stakingrewards.com/asset/ethereum-2-0",
    status: "captured",
    note: `${chainLabel} inherits ETH staking base-layer conditions in Atlas. The current ETH reward-rate floor snapshot is 2.78%.`,
  },
  stakersCount: {
    provider: "Staking Rewards",
    url: "https://r.jina.ai/http://stakingrewards.com/asset/ethereum-2-0",
    status: "captured",
    note: `${chainLabel} reuses Ethereum participation depth as the closest public staking proxy. Staking Rewards currently shows 865k active validators.`,
  },
  lstProtocolCount: {
    provider: "DeFiLlama",
    url: "https://api.llama.fi/protocols",
    status: "captured",
    note: `DeFiLlama currently tracks ${lstProtocolCount} liquid staking protocols on ${chainLabel}.`,
  },
  lstToStakedPercent: {
    provider: "Atlas derived from DeFiLlama + Staking Rewards",
    url: "https://github.com/qfedesq/protofire-atlas-v1",
    status: "captured",
    note: `Derived from ${chainLabel} liquid staking TVL over the current ETH staking market cap. Current snapshot: ${lstToStakedPercent}%.`,
  },
});

export const liquidStakingMarketSnapshotSeeds: LiquidStakingMarketSnapshotSeed[] =
  [
    createSnapshot(
      "ethereum",
      "ETH",
      {
        marketCapUsd: 237_730_524_448,
        percentStaked: 30.99,
        stakingApyPercent: 2.78,
        stakersCount: 865_000,
        lstProtocolCount: 48,
        lstToStakedPercent: 39.39,
      },
      {
        marketCapUsd: {
          provider: "CoinGecko",
          url: "https://api.coingecko.com/api/v3/coins/ethereum",
          status: "captured",
          note: "CoinGecko ETH market cap snapshot captured on 2026-03-07.",
        },
        percentStaked: {
          provider: "Staking Rewards",
          url: "https://r.jina.ai/http://stakingrewards.com/asset/ethereum-2-0",
          status: "captured",
          note: "Staking Rewards snapshot shows a 30.99% ETH staking ratio.",
        },
        stakingApyPercent: {
          provider: "Staking Rewards",
          url: "https://r.jina.ai/http://stakingrewards.com/asset/ethereum-2-0",
          status: "captured",
          note: "Staking Rewards snapshot shows a 2.78% reward-rate floor for ETH staking.",
        },
        stakersCount: {
          provider: "Staking Rewards",
          url: "https://r.jina.ai/http://stakingrewards.com/asset/ethereum-2-0",
          status: "captured",
          note: "Staking Rewards currently shows 865k active validators. Atlas uses that as the closest public staking participation proxy.",
        },
        lstProtocolCount: {
          provider: "DeFiLlama",
          url: "https://api.llama.fi/protocols",
          status: "captured",
          note: "DeFiLlama currently tracks 48 liquid staking protocols on Ethereum.",
        },
        lstToStakedPercent: {
          provider: "Atlas derived from DeFiLlama + Staking Rewards",
          url: "https://github.com/qfedesq/protofire-atlas-v1",
          status: "captured",
          note: "Derived from $29.01B liquid staking TVL over $73.65B staking market cap. Current snapshot: 39.39%.",
        },
      },
    ),
    createSnapshot(
      "bnb-chain",
      "BNB",
      {
        marketCapUsd: 84_551_751_572,
        lstProtocolCount: 14,
      },
      {
        marketCapUsd: {
          provider: "CoinGecko",
          url: "https://api.coingecko.com/api/v3/coins/binancecoin",
          status: "captured",
          note: "CoinGecko BNB market cap snapshot captured on 2026-03-07.",
        },
        percentStaked: {
          provider: "Official validator source pending",
          url: "https://www.bnbchain.org/en",
          status: "pending",
          note: "BNB staking ratio still needs a stable official validator or staking source for a reproducible snapshot.",
        },
        stakingApyPercent: {
          provider: "Official validator source pending",
          url: "https://www.bnbchain.org/en",
          status: "pending",
          note: "BNB staking APY still needs a stable official validator or staking source for a reproducible snapshot.",
        },
        stakersCount: {
          provider: "Official validator source pending",
          url: "https://www.bnbchain.org/en",
          status: "pending",
          note: "BNB staking participation count still needs a stable official validator or staking source for a reproducible snapshot.",
        },
        lstProtocolCount: {
          provider: "DeFiLlama",
          url: "https://api.llama.fi/protocols",
          status: "captured",
          note: "DeFiLlama currently tracks 14 liquid staking protocols on Binance.",
        },
      },
    ),
    createSnapshot(
      "base",
      "ETH",
      {
        marketCapUsd: 237_730_524_448,
        percentStaked: 30.99,
        stakingApyPercent: 2.78,
        stakersCount: 865_000,
        lstProtocolCount: 5,
        lstToStakedPercent: 0,
      },
      ethBasedL2SourceOverrides("Base", 5, 0),
    ),
    createSnapshot("plasma"),
    createSnapshot(
      "arbitrum",
      "ETH",
      {
        marketCapUsd: 237_730_524_448,
        percentStaked: 30.99,
        stakingApyPercent: 2.78,
        stakersCount: 865_000,
        lstProtocolCount: 6,
        lstToStakedPercent: 0,
      },
      ethBasedL2SourceOverrides("Arbitrum", 6, 0),
    ),
    createSnapshot(
      "avalanche",
      "AVAX",
      {
        marketCapUsd: 3_845_286_195,
        percentStaked: 50.72,
        stakingApyPercent: 6.97,
        stakersCount: 715,
        lstProtocolCount: 6,
        lstToStakedPercent: 11.42,
      },
      {
        marketCapUsd: {
          provider: "CoinGecko",
          url: "https://api.coingecko.com/api/v3/coins/avalanche-2",
          status: "captured",
          note: "CoinGecko AVAX market cap snapshot captured on 2026-03-07.",
        },
        percentStaked: {
          provider: "Staking Rewards",
          url: "https://r.jina.ai/http://stakingrewards.com/asset/avalanche",
          status: "captured",
          note: "Staking Rewards snapshot shows a 50.72% Avalanche staking ratio.",
        },
        stakingApyPercent: {
          provider: "Staking Rewards",
          url: "https://r.jina.ai/http://stakingrewards.com/asset/avalanche",
          status: "captured",
          note: "Staking Rewards snapshot shows a 6.97% Avalanche reward rate.",
        },
        stakersCount: {
          provider: "Staking Rewards",
          url: "https://r.jina.ai/http://stakingrewards.com/asset/avalanche",
          status: "captured",
          note: "Staking Rewards currently shows 715 active validators. Atlas uses that as the closest public Avalanche staking participation proxy.",
        },
        lstProtocolCount: {
          provider: "DeFiLlama",
          url: "https://api.llama.fi/protocols",
          status: "captured",
          note: "DeFiLlama currently tracks 6 liquid staking protocols on Avalanche.",
        },
        lstToStakedPercent: {
          provider: "Atlas derived from DeFiLlama + Staking Rewards",
          url: "https://github.com/qfedesq/protofire-atlas-v1",
          status: "captured",
          note: "Derived from $242.15M liquid staking TVL over $2.12B staking market cap. Current snapshot: 11.42%.",
        },
      },
    ),
    createSnapshot("katana"),
    createSnapshot(
      "polygon",
      "POL",
      {
        marketCapUsd: 1_006_333_693,
        percentStaked: 31.92,
        stakingApyPercent: 3.72,
        stakersCount: 104,
        lstProtocolCount: 1,
        lstToStakedPercent: 0,
      },
      {
        marketCapUsd: {
          provider: "CoinGecko",
          url: "https://api.coingecko.com/api/v3/coins/polygon-ecosystem-token",
          status: "captured",
          note: "CoinGecko POL market cap snapshot captured on 2026-03-07.",
        },
        percentStaked: {
          provider: "Staking Rewards",
          url: "https://r.jina.ai/http://stakingrewards.com/asset/matic-network",
          status: "captured",
          note: "Staking Rewards currently publishes Polygon staking under the MATIC asset page. The current staking ratio snapshot is 31.92%.",
        },
        stakingApyPercent: {
          provider: "Staking Rewards",
          url: "https://r.jina.ai/http://stakingrewards.com/asset/matic-network",
          status: "captured",
          note: "Staking Rewards currently publishes Polygon staking under the MATIC asset page. The current reward rate snapshot is 3.72%.",
        },
        stakersCount: {
          provider: "Staking Rewards",
          url: "https://r.jina.ai/http://stakingrewards.com/asset/matic-network",
          status: "captured",
          note: "Staking Rewards currently shows 104 active validators. Atlas uses that as the closest public Polygon staking participation proxy.",
        },
        lstProtocolCount: {
          provider: "DeFiLlama",
          url: "https://api.llama.fi/protocols",
          status: "captured",
          note: "DeFiLlama currently tracks 1 liquid staking protocol on Polygon.",
        },
        lstToStakedPercent: {
          provider: "Atlas derived from DeFiLlama + Staking Rewards",
          url: "https://github.com/qfedesq/protofire-atlas-v1",
          status: "captured",
          note: "Derived from current liquid staking TVL over $321.28M staking market cap. Current snapshot rounds to 0.00%.",
        },
      },
    ),
    createSnapshot("mantle", "MNT"),
    createSnapshot("ink"),
    createSnapshot("monad"),
    createSnapshot(
      "scroll",
      "ETH",
      {
        marketCapUsd: 237_730_524_448,
        percentStaked: 30.99,
        stakingApyPercent: 2.78,
        stakersCount: 865_000,
        lstProtocolCount: 0,
        lstToStakedPercent: 0,
      },
      ethBasedL2SourceOverrides("Scroll", 0, 0),
    ),
    createSnapshot("cronos", "CRO"),
    createSnapshot("berachain", "BERA"),
    createSnapshot(
      "optimism",
      "ETH",
      {
        marketCapUsd: 237_730_524_448,
        percentStaked: 30.99,
        stakingApyPercent: 2.78,
        stakersCount: 865_000,
        lstProtocolCount: 1,
        lstToStakedPercent: 0,
      },
      ethBasedL2SourceOverrides("Optimism", 1, 0),
    ),
    createSnapshot("gnosis"),
    createSnapshot(
      "linea",
      "ETH",
      {
        marketCapUsd: 237_730_524_448,
        percentStaked: 30.99,
        stakingApyPercent: 2.78,
        stakersCount: 865_000,
        lstProtocolCount: 0,
        lstToStakedPercent: 0,
      },
      ethBasedL2SourceOverrides("Linea", 0, 0),
    ),
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
