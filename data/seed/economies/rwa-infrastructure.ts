import { buildEconomySeedRecords } from "@/data/seed/economies/build-seeds";

const rwaStatusMatrix = {
  ethereum: {
    "asset-registry": "available",
    compliance: "partial",
    oracles: "available",
    settlement: "available",
  },
  "bnb-chain": {
    "asset-registry": "partial",
    compliance: "missing",
    oracles: "partial",
    settlement: "available",
  },
  base: {
    "asset-registry": "partial",
    compliance: "partial",
    oracles: "available",
    settlement: "available",
  },
  plasma: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  arbitrum: {
    "asset-registry": "partial",
    compliance: "partial",
    oracles: "available",
    settlement: "available",
  },
  avalanche: {
    "asset-registry": "available",
    compliance: "partial",
    oracles: "partial",
    settlement: "available",
  },
  katana: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  polygon: {
    "asset-registry": "partial",
    compliance: "partial",
    oracles: "available",
    settlement: "available",
  },
  mantle: {
    "asset-registry": "partial",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  ink: {
    "asset-registry": "partial",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  monad: {
    "asset-registry": "partial",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  scroll: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  cronos: {
    "asset-registry": "partial",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  berachain: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  optimism: {
    "asset-registry": "partial",
    compliance: "partial",
    oracles: "partial",
    settlement: "available",
  },
  gnosis: {
    "asset-registry": "partial",
    compliance: "partial",
    oracles: "partial",
    settlement: "partial",
  },
  linea: {
    "asset-registry": "partial",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  hedera: {
    "asset-registry": "partial",
    compliance: "available",
    oracles: "partial",
    settlement: "partial",
  },
  plume: {
    "asset-registry": "available",
    compliance: "partial",
    oracles: "available",
    settlement: "partial",
  },
  rootstock: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  megaeth: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  bitlayer: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  bob: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  unichain: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  "ai-layer": {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  mode: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  ethereal: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  hemi: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  sonic: {
    "asset-registry": "partial",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
  fraxtal: {
    "asset-registry": "missing",
    compliance: "missing",
    oracles: "partial",
    settlement: "partial",
  },
} as const;

const rwaCopyByModule = {
  "asset-registry": {
    available: {
      evidence:
        "asset registry infrastructure is treated as available for the RWA benchmark.",
      rationale:
        "Tokenized assets can already anchor to a credible issuance and identity layer, which lowers friction for new issuer programs.",
    },
    partial: {
      evidence:
        "asset registry infrastructure is treated as partially available for the RWA benchmark.",
      rationale:
        "Some issuance support exists, but asset identity and lifecycle handling still need hardening before the chain can market a stronger RWA posture.",
    },
    missing: {
      evidence:
        "asset registry infrastructure is treated as missing for the RWA benchmark.",
      rationale:
        "Without a canonical asset registry, tokenized issuance remains fragmented and harder for issuers and partners to coordinate around.",
    },
  },
  compliance: {
    available: {
      evidence:
        "compliance infrastructure is treated as available for the RWA benchmark.",
      rationale:
        "Permissioning and policy controls are already strong enough to support more demanding asset workflows.",
    },
    partial: {
      evidence:
        "compliance infrastructure is treated as partially available for the RWA benchmark.",
      rationale:
        "Some policy controls exist, but the chain still needs a more explicit compliance layer before larger issuer programs become easier to support.",
    },
    missing: {
      evidence:
        "compliance infrastructure is treated as missing for the RWA benchmark.",
      rationale:
        "Without stronger compliance rails, the chain has a weak answer to transfer controls, auditability, and regulated workflow requirements.",
    },
  },
  oracles: {
    available: {
      evidence:
        "oracle verification is treated as available for the RWA benchmark.",
      rationale:
        "External data support is already credible enough to anchor valuation and verification workflows for tokenized assets.",
    },
    partial: {
      evidence:
        "oracle verification is treated as partially available for the RWA benchmark.",
      rationale:
        "Some external data coverage exists, but it still needs more structured packaging before a broader RWA stack can rely on it.",
    },
    missing: {
      evidence:
        "oracle verification is treated as missing for the RWA benchmark.",
      rationale:
        "Without external verification rails, tokenized assets face larger trust gaps around valuation and real-world status changes.",
    },
  },
  settlement: {
    available: {
      evidence:
        "settlement infrastructure is treated as available for the RWA benchmark.",
      rationale:
        "Transfer and servicing rails are already strong enough to support more complete tokenized asset transaction flows.",
    },
    partial: {
      evidence:
        "settlement infrastructure is treated as partially available for the RWA benchmark.",
      rationale:
        "Basic settlement is possible, but the chain still needs a more dependable operating layer for transfers and post-trade servicing.",
    },
    missing: {
      evidence:
        "settlement infrastructure is treated as missing for the RWA benchmark.",
      rationale:
        "Without clearer settlement rails, the chain can support issuance stories more easily than full end-to-end asset workflows.",
    },
  },
} as const;

export const rwaEconomySeedRecords = buildEconomySeedRecords(
  "rwa-infrastructure",
  rwaStatusMatrix,
  rwaCopyByModule,
);
