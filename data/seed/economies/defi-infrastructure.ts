import { buildEconomySeedRecords } from "@/data/seed/economies/build-seeds";

const defiStatusMatrix = {
  ethereum: {
    lending: "available",
    liquidity: "available",
    oracles: "available",
    indexing: "available",
    "liquid-staking": "available",
  },
  "bnb-chain": {
    lending: "available",
    liquidity: "available",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "partial",
  },
  base: {
    lending: "partial",
    liquidity: "available",
    oracles: "available",
    indexing: "partial",
    "liquid-staking": "partial",
  },
  plasma: {
    lending: "partial",
    liquidity: "available",
    oracles: "missing",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  arbitrum: {
    lending: "available",
    liquidity: "available",
    oracles: "available",
    indexing: "available",
    "liquid-staking": "partial",
  },
  avalanche: {
    lending: "available",
    liquidity: "available",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "partial",
  },
  katana: {
    lending: "partial",
    liquidity: "available",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "partial",
  },
  polygon: {
    lending: "partial",
    liquidity: "available",
    oracles: "available",
    indexing: "partial",
    "liquid-staking": "partial",
  },
  mantle: {
    lending: "partial",
    liquidity: "available",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "partial",
  },
  ink: {
    lending: "partial",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  monad: {
    lending: "partial",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  scroll: {
    lending: "missing",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  cronos: {
    lending: "partial",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "partial",
  },
  berachain: {
    lending: "partial",
    liquidity: "available",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "partial",
  },
  optimism: {
    lending: "partial",
    liquidity: "available",
    oracles: "available",
    indexing: "available",
    "liquid-staking": "partial",
  },
  gnosis: {
    lending: "partial",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  linea: {
    lending: "partial",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  hedera: {
    lending: "missing",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  plume: {
    lending: "missing",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  rootstock: {
    lending: "partial",
    liquidity: "partial",
    oracles: "partial",
    indexing: "missing",
    "liquid-staking": "missing",
  },
  megaeth: {
    lending: "missing",
    liquidity: "partial",
    oracles: "missing",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  bitlayer: {
    lending: "missing",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  bob: {
    lending: "partial",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  unichain: {
    lending: "missing",
    liquidity: "partial",
    oracles: "partial",
    indexing: "missing",
    "liquid-staking": "missing",
  },
  "ai-layer": {
    lending: "missing",
    liquidity: "partial",
    oracles: "missing",
    indexing: "missing",
    "liquid-staking": "missing",
  },
  mode: {
    lending: "partial",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  ethereal: {
    lending: "missing",
    liquidity: "partial",
    oracles: "missing",
    indexing: "missing",
    "liquid-staking": "missing",
  },
  hemi: {
    lending: "partial",
    liquidity: "partial",
    oracles: "partial",
    indexing: "missing",
    "liquid-staking": "missing",
  },
  sonic: {
    lending: "partial",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "missing",
  },
  fraxtal: {
    lending: "partial",
    liquidity: "partial",
    oracles: "partial",
    indexing: "partial",
    "liquid-staking": "missing",
  },
} as const;

const defiCopyByModule = {
  lending: {
    available: {
      evidence:
        "lending infrastructure is treated as available for the DeFi benchmark.",
      rationale:
        "Reusable borrowing and collateral rails are already strong enough to support lending-led DeFi growth without foundational rework.",
    },
    partial: {
      evidence:
        "lending infrastructure is treated as partially available for the DeFi benchmark.",
      rationale:
        "Some lending support exists, but Protofire would still need to strengthen market depth and protocol reuse before positioning it as a clear ecosystem primitive.",
    },
    missing: {
      evidence:
        "lending infrastructure is treated as missing for the DeFi benchmark.",
      rationale:
        "Without a stronger lending base, the chain cannot support a broader credit, leverage, and collateral-reuse loop across DeFi protocols.",
    },
  },
  liquidity: {
    available: {
      evidence:
        "liquidity rails are treated as available for the DeFi benchmark.",
      rationale:
        "Pool and routing support are already credible enough to underpin swaps, TVL formation, and protocol launch confidence.",
    },
    partial: {
      evidence:
        "liquidity rails are treated as partially available for the DeFi benchmark.",
      rationale:
        "Liquidity exists in parts, but routing quality and pool depth still need hardening before the chain can market a stronger DeFi base layer.",
    },
    missing: {
      evidence:
        "liquidity rails are treated as missing for the DeFi benchmark.",
      rationale:
        "Without dependable liquidity infrastructure, the chain struggles to retain capital and give DeFi teams a clear launch path.",
    },
  },
  oracles: {
    available: {
      evidence:
        "oracle infrastructure is treated as available for the DeFi benchmark.",
      rationale:
        "Reference data coverage is strong enough to support price-sensitive DeFi protocols without major ecosystem-level blockers.",
    },
    partial: {
      evidence:
        "oracle infrastructure is treated as partially available for the DeFi benchmark.",
      rationale:
        "Core data feeds exist, but coverage and packaging still need work before more complex DeFi products can launch with confidence.",
    },
    missing: {
      evidence:
        "oracle infrastructure is treated as missing for the DeFi benchmark.",
      rationale:
        "A weak oracle posture leaves lending, derivatives, and staking products without the data guarantees they need to scale safely.",
    },
  },
  indexing: {
    available: {
      evidence:
        "indexing infrastructure is treated as available for the DeFi benchmark.",
      rationale:
        "Queryable protocol and position data are already strong enough to support analytics, dashboards, and ecosystem operations.",
    },
    partial: {
      evidence:
        "indexing infrastructure is treated as partially available for the DeFi benchmark.",
      rationale:
        "Searchable state exists, but it still needs more protocol-level structure before DeFi teams can operate against it with less custom work.",
    },
    missing: {
      evidence:
        "indexing infrastructure is treated as missing for the DeFi benchmark.",
      rationale:
        "Without clearer indexing, protocol teams face higher integration cost and weaker visibility into pools, positions, and ecosystem activity.",
    },
  },
  "liquid-staking": {
    available: {
      evidence:
        "liquid staking infrastructure is treated as available for the DeFi benchmark.",
      rationale:
        "Staked assets can already stay productive inside DeFi flows, which improves capital efficiency and supports a stronger TVL narrative.",
    },
    partial: {
      evidence:
        "liquid staking infrastructure is treated as partially available for the DeFi benchmark.",
      rationale:
        "Some liquid staking support exists, but it still needs better standardization and protocol integrations before it becomes a first-class chain primitive.",
    },
    missing: {
      evidence:
        "liquid staking infrastructure is treated as missing for the DeFi benchmark.",
      rationale:
        "Without liquid staking rails, staked capital is less reusable across DeFi, which weakens both yield composability and TVL retention.",
    },
  },
} as const;

export const defiEconomySeedRecords = buildEconomySeedRecords(
  "defi-infrastructure",
  defiStatusMatrix,
  defiCopyByModule,
);
