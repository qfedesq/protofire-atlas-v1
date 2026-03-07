import type { ChainCategory } from "@/lib/domain/types";

type ChainMetadata = {
  category: ChainCategory;
  website?: string;
  shortDescription: string;
  status: "active";
};

export const chainMetadataBySlug: Record<string, ChainMetadata> = {
  ethereum: {
    category: "L1",
    website: "https://ethereum.org",
    shortDescription:
      "Settlement-heavy EVM base layer with the deepest protocol surface, liquidity, and builder distribution.",
    status: "active",
  },
  "bnb-chain": {
    category: "L1",
    website: "https://www.bnbchain.org",
    shortDescription:
      "High-throughput EVM chain with strong retail liquidity and broad protocol coverage across core DeFi primitives.",
    status: "active",
  },
  base: {
    category: "L2",
    website: "https://base.org",
    shortDescription:
      "Fast-growing L2 with strong consumer distribution and one of the clearest paths to new onchain application demand.",
    status: "active",
  },
  plasma: {
    category: "L1",
    shortDescription:
      "EVM chain with outsized TVL concentration and a capital base large enough to matter for infrastructure wedge analysis.",
    status: "active",
  },
  arbitrum: {
    category: "L2",
    website: "https://arbitrum.io",
    shortDescription:
      "Mature L2 with broad protocol coverage, strong builder tooling, and durable liquidity depth across EVM DeFi.",
    status: "active",
  },
  avalanche: {
    category: "L1",
    website: "https://www.avax.network",
    shortDescription:
      "Flexible EVM chain with credible institutional positioning and enough ecosystem breadth to support multiple readiness wedges.",
    status: "active",
  },
  katana: {
    category: "L2",
    shortDescription:
      "High-TVL EVM environment with meaningful capital formation but a less mature cross-economy infrastructure story than the largest majors.",
    status: "active",
  },
  polygon: {
    category: "L1",
    website: "https://polygon.technology",
    shortDescription:
      "Large EVM footprint with broad enterprise familiarity and strong base settlement rails for ecosystem activation.",
    status: "active",
  },
  mantle: {
    category: "L2",
    website: "https://www.mantle.xyz",
    shortDescription:
      "Capital-oriented L2 with real liquidity weight, but still maturing across discovery, observability, and trust layers.",
    status: "active",
  },
  ink: {
    category: "L2",
    shortDescription:
      "Emerging L2 with fast TVL growth and a meaningful opportunity to convert liquidity into broader infrastructure depth.",
    status: "active",
  },
  monad: {
    category: "L1",
    website: "https://monad.xyz",
    shortDescription:
      "New high-performance EVM chain with capital attention, but an infrastructure stack that still needs broader proof across wedges.",
    status: "active",
  },
  scroll: {
    category: "L2",
    website: "https://scroll.io",
    shortDescription:
      "Promising zkEVM L2 with enough ecosystem traction to matter, but still earlier in productized infrastructure readiness.",
    status: "active",
  },
  cronos: {
    category: "L1",
    website: "https://cronos.org",
    shortDescription:
      "Consumer-facing EVM chain with usable liquidity and payments posture, though not yet a clear leader in deeper infrastructure readiness.",
    status: "active",
  },
  berachain: {
    category: "L1",
    website: "https://www.berachain.com",
    shortDescription:
      "Capital-attracting EVM chain with strong DeFi momentum and a growing need for supporting infrastructure layers.",
    status: "active",
  },
  optimism: {
    category: "L2",
    website: "https://www.optimism.io",
    shortDescription:
      "Coordination-heavy L2 with ecosystem legitimacy and a solid foundation for multiple readiness wedges.",
    status: "active",
  },
  gnosis: {
    category: "L1",
    website: "https://www.gnosis.io",
    shortDescription:
      "Operationally mature EVM chain with strong wallet and payments DNA, but smaller protocol depth than the leading majors.",
    status: "active",
  },
  linea: {
    category: "L2",
    website: "https://linea.build",
    shortDescription:
      "zkEVM L2 with credible builder interest and a balanced profile, though still behind the largest rollups on ecosystem depth.",
    status: "active",
  },
  hedera: {
    category: "L1",
    website: "https://hedera.com",
    shortDescription:
      "Enterprise-facing network with EVM compatibility and meaningful institutional relevance for RWA and payments analysis.",
    status: "active",
  },
  plume: {
    category: "L1",
    website: "https://plume.org",
    shortDescription:
      "EVM chain with a strong RWA narrative and enough TVL to justify direct infrastructure readiness benchmarking.",
    status: "active",
  },
  rootstock: {
    category: "L2",
    website: "https://rootstock.io",
    shortDescription:
      "Bitcoin-linked EVM environment with a focused DeFi base, but less ecosystem breadth than higher-ranked majors.",
    status: "active",
  },
  megaeth: {
    category: "L2",
    website: "https://megaeth.com",
    shortDescription:
      "Performance-focused EVM environment with rising capital interest and an early-stage infrastructure stack.",
    status: "active",
  },
  bitlayer: {
    category: "L2",
    website: "https://www.bitlayer.org",
    shortDescription:
      "Bitcoin-adjacent EVM network with growing TVL and an opportunity to harden protocol infrastructure around that capital base.",
    status: "active",
  },
  bob: {
    category: "L2",
    website: "https://buildonbob.xyz",
    shortDescription:
      "Hybrid-focused L2 with a credible DeFi foothold, but still building out broader infrastructure maturity.",
    status: "active",
  },
  unichain: {
    category: "L2",
    shortDescription:
      "Early but credible L2 entrant with exchange distribution potential and a still-maturing infrastructure stack.",
    status: "active",
  },
  "ai-layer": {
    category: "L1",
    shortDescription:
      "Niche EVM chain with sufficient TVL to enter the snapshot, but a thinner ecosystem and lower infrastructure maturity than the leaders.",
    status: "active",
  },
  mode: {
    category: "L2",
    website: "https://www.mode.network",
    shortDescription:
      "DeFi-oriented L2 with usable liquidity but less mature cross-wedge infrastructure than larger rollup peers.",
    status: "active",
  },
  ethereal: {
    category: "L1",
    shortDescription:
      "Emerging EVM chain with measurable capital formation and a highly incomplete infrastructure story across most wedges.",
    status: "active",
  },
  hemi: {
    category: "L2",
    website: "https://hemi.xyz",
    shortDescription:
      "New EVM environment with enough traction to matter, but still early in turning capital inflows into reusable ecosystem primitives.",
    status: "active",
  },
  sonic: {
    category: "L1",
    website: "https://www.soniclabs.com",
    shortDescription:
      "High-performance EVM chain with credible transaction posture and a growing need for more productized infrastructure layers.",
    status: "active",
  },
  fraxtal: {
    category: "L2",
    website: "https://frax.finance",
    shortDescription:
      "Focused L2 with protocol-native distribution and an infrastructure posture that remains uneven beyond core DeFi support.",
    status: "active",
  },
};
