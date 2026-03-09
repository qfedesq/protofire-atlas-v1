import { chainMetadataBySlug } from "@/data/seed/chain-metadata";
import type {
  ChainCapabilityProfileSeed,
  ChainCapabilityProfileSourceReferences,
  DataConfidenceLevel,
} from "@/lib/domain/types";

const lastUpdated = "2026-03-09T00:00:00.000Z";

function createSourceReferences(
  chainSlug: string,
): ChainCapabilityProfileSourceReferences {
  const website =
    chainMetadataBySlug[chainSlug]?.website ??
    `seed://atlas-chain-capability-review/${chainSlug}`;

  return {
    isEvm: "data/source/defillama-top-30-evm-chains.snapshot.json",
    smartContractSupport: website,
    tokenStandardSupport: website,
    oracleSupport: website,
    indexingInfrastructure: website,
    eventDrivenArchitecture: website,
    crossChainSupport: website,
    validatorModel: website,
    stakingSupport: website,
    liquidStakingSupport: website,
    lendingProtocolFeasibility: website,
    liquidityProtocolFeasibility: website,
    paymentRailsSupport: website,
    gasModel: website,
    executionEnvironment: website,
    ecosystemMaturity: website,
  };
}

function createProfile(
  chainSlug: string,
  overrides: Partial<Omit<ChainCapabilityProfileSeed, "chainSlug" | "sourceReferences" | "lastUpdated">>,
): ChainCapabilityProfileSeed {
  return {
    chainSlug,
    isEvm: true,
    smartContractSupport: "supported",
    tokenStandardSupport: "supported",
    oracleSupport: "supported",
    indexingInfrastructure: "supported",
    eventDrivenArchitecture: "supported",
    crossChainSupport: "supported",
    validatorModel: "native-pos",
    stakingSupport: "supported",
    liquidStakingSupport: "supported",
    lendingProtocolFeasibility: "supported",
    liquidityProtocolFeasibility: "supported",
    paymentRailsSupport: "supported",
    gasModel: "native-evm-gas",
    executionEnvironment: "evm-l1",
    ecosystemMaturity: "mature",
    confidenceLevel: "high",
    notes: [],
    ...overrides,
    sourceReferences: createSourceReferences(chainSlug),
    lastUpdated,
  };
}

function createRollupProfile(
  chainSlug: string,
  overrides: Partial<Omit<ChainCapabilityProfileSeed, "chainSlug" | "sourceReferences" | "lastUpdated">> = {},
) {
  return createProfile(chainSlug, {
    validatorModel: "rollup-sequencer",
    stakingSupport: "unsupported",
    liquidStakingSupport: "unsupported",
    gasModel: "rollup-gas",
    executionEnvironment: "evm-l2-rollup",
    crossChainSupport: "supported",
    ecosystemMaturity: "developing",
    ...overrides,
  });
}

function createBitcoinEvmProfile(
  chainSlug: string,
  confidenceLevel: DataConfidenceLevel = "medium",
  overrides: Partial<Omit<ChainCapabilityProfileSeed, "chainSlug" | "sourceReferences" | "lastUpdated" | "confidenceLevel">> = {},
) {
  return createProfile(chainSlug, {
    oracleSupport: "limited",
    indexingInfrastructure: "limited",
    eventDrivenArchitecture: "limited",
    crossChainSupport: "limited",
    validatorModel: "bitcoin-anchored",
    stakingSupport: "unsupported",
    liquidStakingSupport: "unsupported",
    lendingProtocolFeasibility: "limited",
    liquidityProtocolFeasibility: "limited",
    gasModel: "bitcoin-anchored-gas",
    executionEnvironment: "bitcoin-evm",
    ecosystemMaturity: "developing",
    confidenceLevel,
    ...overrides,
  });
}

function notes(
  ...items: string[]
): string[] {
  return items;
}

export const chainCapabilityProfileSeeds: ChainCapabilityProfileSeed[] = [
  createProfile("ethereum", {
    notes: notes(
      "Full EVM execution, deepest oracle/indexing coverage, and native staking make both active wedges technically applicable.",
    ),
  }),
  createProfile("bnb-chain", {
    ecosystemMaturity: "mature",
    paymentRailsSupport: "supported",
    notes: notes(
      "High-activity EVM execution and payments coverage support both active wedges.",
    ),
  }),
  createRollupProfile("base", {
    oracleSupport: "supported",
    indexingInfrastructure: "supported",
    lendingProtocolFeasibility: "supported",
    liquidityProtocolFeasibility: "supported",
    paymentRailsSupport: "supported",
    ecosystemMaturity: "mature",
    notes: notes(
      "Rollup architecture supports AI and DeFi, but liquid staking remains dependent on base-layer ETH staking rather than native validator rails.",
    ),
  }),
  createProfile("plasma", {
    oracleSupport: "limited",
    indexingInfrastructure: "limited",
    eventDrivenArchitecture: "limited",
    lendingProtocolFeasibility: "limited",
    confidenceLevel: "medium",
    ecosystemMaturity: "developing",
    executionEnvironment: "specialized-evm",
    notes: notes(
      "Technically EVM-capable, but Atlas has lower confidence in reusable middleware depth outside capital concentration.",
    ),
  }),
  createRollupProfile("arbitrum", {
    oracleSupport: "supported",
    indexingInfrastructure: "supported",
    paymentRailsSupport: "supported",
    lendingProtocolFeasibility: "supported",
    liquidityProtocolFeasibility: "supported",
    ecosystemMaturity: "mature",
  }),
  createProfile("avalanche", {
    crossChainSupport: "supported",
    notes: notes(
      "Subnet and C-Chain flexibility preserve applicability for both active wedges.",
    ),
  }),
  createRollupProfile("katana", {
    oracleSupport: "limited",
    indexingInfrastructure: "limited",
    liquidityProtocolFeasibility: "supported",
    ecosystemMaturity: "developing",
    confidenceLevel: "medium",
  }),
  createProfile("polygon", {
    validatorModel: "hybrid",
    ecosystemMaturity: "mature",
  }),
  createRollupProfile("mantle", {
    oracleSupport: "supported",
    indexingInfrastructure: "supported",
    ecosystemMaturity: "developing",
  }),
  createRollupProfile("ink", {
    oracleSupport: "limited",
    indexingInfrastructure: "limited",
    lendingProtocolFeasibility: "limited",
    confidenceLevel: "medium",
  }),
  createProfile("monad", {
    oracleSupport: "limited",
    indexingInfrastructure: "limited",
    crossChainSupport: "limited",
    lendingProtocolFeasibility: "limited",
    liquidityProtocolFeasibility: "limited",
    ecosystemMaturity: "emerging",
    confidenceLevel: "medium",
  }),
  createRollupProfile("scroll", {
    oracleSupport: "supported",
    indexingInfrastructure: "supported",
    liquidityProtocolFeasibility: "supported",
    ecosystemMaturity: "developing",
  }),
  createProfile("cronos", {
    paymentRailsSupport: "supported",
    oracleSupport: "limited",
    indexingInfrastructure: "limited",
    ecosystemMaturity: "developing",
  }),
  createProfile("berachain", {
    stakingSupport: "supported",
    liquidStakingSupport: "supported",
    lendingProtocolFeasibility: "supported",
    liquidityProtocolFeasibility: "supported",
    ecosystemMaturity: "developing",
  }),
  createRollupProfile("optimism", {
    oracleSupport: "supported",
    indexingInfrastructure: "supported",
    ecosystemMaturity: "mature",
  }),
  createProfile("gnosis", {
    paymentRailsSupport: "supported",
    lendingProtocolFeasibility: "limited",
    liquidityProtocolFeasibility: "limited",
    ecosystemMaturity: "developing",
  }),
  createRollupProfile("linea", {
    oracleSupport: "supported",
    indexingInfrastructure: "supported",
    ecosystemMaturity: "developing",
  }),
  createProfile("hedera", {
    smartContractSupport: "limited",
    tokenStandardSupport: "limited",
    oracleSupport: "limited",
    indexingInfrastructure: "limited",
    eventDrivenArchitecture: "limited",
    crossChainSupport: "limited",
    validatorModel: "custom",
    liquidStakingSupport: "unsupported",
    lendingProtocolFeasibility: "limited",
    liquidityProtocolFeasibility: "limited",
    paymentRailsSupport: "supported",
    gasModel: "custom",
    executionEnvironment: "enterprise-evm",
    ecosystemMaturity: "developing",
    confidenceLevel: "medium",
  }),
  createProfile("plume", {
    oracleSupport: "supported",
    lendingProtocolFeasibility: "limited",
    liquidityProtocolFeasibility: "limited",
    executionEnvironment: "specialized-evm",
    ecosystemMaturity: "developing",
  }),
  createBitcoinEvmProfile("rootstock"),
  createRollupProfile("megaeth", {
    oracleSupport: "limited",
    indexingInfrastructure: "limited",
    eventDrivenArchitecture: "limited",
    lendingProtocolFeasibility: "limited",
    liquidityProtocolFeasibility: "limited",
    ecosystemMaturity: "emerging",
    confidenceLevel: "medium",
  }),
  createBitcoinEvmProfile("bitlayer"),
  createBitcoinEvmProfile("bob", "medium", {
    crossChainSupport: "supported",
    liquidityProtocolFeasibility: "supported",
  }),
  createRollupProfile("unichain", {
    oracleSupport: "limited",
    indexingInfrastructure: "limited",
    ecosystemMaturity: "developing",
    confidenceLevel: "medium",
  }),
  createProfile("ai-layer", {
    oracleSupport: "limited",
    indexingInfrastructure: "limited",
    eventDrivenArchitecture: "limited",
    crossChainSupport: "limited",
    stakingSupport: "limited",
    liquidStakingSupport: "limited",
    lendingProtocolFeasibility: "limited",
    liquidityProtocolFeasibility: "limited",
    paymentRailsSupport: "limited",
    executionEnvironment: "specialized-evm",
    ecosystemMaturity: "emerging",
    confidenceLevel: "low",
  }),
  createRollupProfile("mode", {
    oracleSupport: "supported",
    indexingInfrastructure: "supported",
    ecosystemMaturity: "developing",
  }),
  createProfile("ethereal", {
    oracleSupport: "limited",
    indexingInfrastructure: "limited",
    eventDrivenArchitecture: "limited",
    crossChainSupport: "limited",
    liquidStakingSupport: "limited",
    lendingProtocolFeasibility: "limited",
    liquidityProtocolFeasibility: "limited",
    paymentRailsSupport: "limited",
    executionEnvironment: "specialized-evm",
    ecosystemMaturity: "emerging",
    confidenceLevel: "low",
  }),
  createBitcoinEvmProfile("hemi", "medium", {
    crossChainSupport: "supported",
  }),
  createProfile("sonic", {
    ecosystemMaturity: "developing",
    paymentRailsSupport: "supported",
    oracleSupport: "supported",
    indexingInfrastructure: "supported",
  }),
  createRollupProfile("fraxtal", {
    oracleSupport: "supported",
    indexingInfrastructure: "supported",
    paymentRailsSupport: "supported",
    ecosystemMaturity: "developing",
  }),
];
