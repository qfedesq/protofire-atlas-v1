import { buildEconomySeedRecords } from "@/data/seed/economies/build-seeds";

const predictionStatusMatrix = {
  ethereum: {
    oracles: "available",
    "market-contracts": "available",
    indexing: "available",
    liquidity: "available",
  },
  "bnb-chain": {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "available",
  },
  base: {
    oracles: "partial",
    "market-contracts": "available",
    indexing: "partial",
    liquidity: "available",
  },
  plasma: {
    oracles: "missing",
    "market-contracts": "partial",
    indexing: "missing",
    liquidity: "partial",
  },
  arbitrum: {
    oracles: "available",
    "market-contracts": "available",
    indexing: "available",
    liquidity: "available",
  },
  avalanche: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "missing",
    liquidity: "partial",
  },
  katana: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "partial",
  },
  polygon: {
    oracles: "partial",
    "market-contracts": "available",
    indexing: "partial",
    liquidity: "available",
  },
  mantle: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "partial",
  },
  ink: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "partial",
  },
  monad: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "missing",
  },
  scroll: {
    oracles: "partial",
    "market-contracts": "missing",
    indexing: "partial",
    liquidity: "missing",
  },
  cronos: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "partial",
  },
  berachain: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "partial",
  },
  optimism: {
    oracles: "partial",
    "market-contracts": "available",
    indexing: "available",
    liquidity: "partial",
  },
  gnosis: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "partial",
  },
  linea: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "partial",
  },
  hedera: {
    oracles: "missing",
    "market-contracts": "missing",
    indexing: "partial",
    liquidity: "missing",
  },
  plume: {
    oracles: "missing",
    "market-contracts": "missing",
    indexing: "partial",
    liquidity: "missing",
  },
  rootstock: {
    oracles: "missing",
    "market-contracts": "missing",
    indexing: "missing",
    liquidity: "partial",
  },
  megaeth: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "missing",
    liquidity: "missing",
  },
  bitlayer: {
    oracles: "missing",
    "market-contracts": "missing",
    indexing: "partial",
    liquidity: "missing",
  },
  bob: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "partial",
  },
  unichain: {
    oracles: "partial",
    "market-contracts": "missing",
    indexing: "missing",
    liquidity: "partial",
  },
  "ai-layer": {
    oracles: "missing",
    "market-contracts": "missing",
    indexing: "missing",
    liquidity: "partial",
  },
  mode: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "partial",
  },
  ethereal: {
    oracles: "missing",
    "market-contracts": "missing",
    indexing: "missing",
    liquidity: "partial",
  },
  hemi: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "partial",
  },
  sonic: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "partial",
  },
  fraxtal: {
    oracles: "partial",
    "market-contracts": "partial",
    indexing: "partial",
    liquidity: "partial",
  },
} as const;

const predictionCopyByModule = {
  oracles: {
    available: {
      evidence:
        "oracle resolution infrastructure is treated as available for the prediction-market benchmark.",
      rationale:
        "Outcome resolution support is strong enough that markets can settle against trusted external signals without major chain-level blockers.",
    },
    partial: {
      evidence:
        "oracle resolution infrastructure is treated as partially available for the prediction-market benchmark.",
      rationale:
        "Some outcome resolution support exists, but it still needs stronger packaging before prediction builders can rely on it as a default chain primitive.",
    },
    missing: {
      evidence:
        "oracle resolution infrastructure is treated as missing for the prediction-market benchmark.",
      rationale:
        "Without clearer resolution rails, the chain has a weak answer to how markets will settle against trusted external outcomes.",
    },
  },
  "market-contracts": {
    available: {
      evidence:
        "market contract infrastructure is treated as available for the prediction-market benchmark.",
      rationale:
        "Reusable market creation and position logic are already strong enough to support prediction builders without foundational rework.",
    },
    partial: {
      evidence:
        "market contract infrastructure is treated as partially available for the prediction-market benchmark.",
      rationale:
        "Some market logic exists, but it still needs hardening before the chain can market prediction products as easier to launch.",
    },
    missing: {
      evidence:
        "market contract infrastructure is treated as missing for the prediction-market benchmark.",
      rationale:
        "Without reusable market contracts, builders must recreate too much of the core prediction stack before they can launch.",
    },
  },
  indexing: {
    available: {
      evidence:
        "indexing infrastructure is treated as available for the prediction-market benchmark.",
      rationale:
        "Market and position data are already queryable enough to support discovery, analytics, and operational monitoring.",
    },
    partial: {
      evidence:
        "indexing infrastructure is treated as partially available for the prediction-market benchmark.",
      rationale:
        "Searchable market state exists, but it still needs more structure before prediction products can rely on it with less custom work.",
    },
    missing: {
      evidence:
        "indexing infrastructure is treated as missing for the prediction-market benchmark.",
      rationale:
        "Without indexed market data, prediction products are harder to discover, monitor, and integrate into wallets and dashboards.",
    },
  },
  liquidity: {
    available: {
      evidence:
        "liquidity support is treated as available for the prediction-market benchmark.",
      rationale:
        "The chain has enough liquidity support to help active markets sustain tighter pricing and deeper participation.",
    },
    partial: {
      evidence:
        "liquidity support is treated as partially available for the prediction-market benchmark.",
      rationale:
        "Some liquidity support exists, but it still needs stronger routing or incentives before market quality becomes a clear strength.",
    },
    missing: {
      evidence:
        "liquidity support is treated as missing for the prediction-market benchmark.",
      rationale:
        "Without stronger liquidity rails, prediction markets remain thinner and produce weaker price signals across the ecosystem.",
    },
  },
} as const;

export const predictionEconomySeedRecords = buildEconomySeedRecords(
  "prediction-markets",
  predictionStatusMatrix,
  predictionCopyByModule,
);
