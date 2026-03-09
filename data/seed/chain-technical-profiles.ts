import type {
  ChainTechnicalCapabilities,
  ChainTechnicalProfileSeed,
} from "@/lib/domain/types";

const assessedAt = "2026-03-08T00:00:00.000Z";
const sourceBasis =
  "Atlas technical applicability review using chain architecture, current dataset coverage, and ecosystem primitive availability.";

function createCapabilities(
  overrides: Partial<ChainTechnicalCapabilities> = {},
): ChainTechnicalCapabilities {
  return {
    smartContracts: "supported",
    tokenStandards: "supported",
    paymentRails: "supported",
    oracleSupport: "supported",
    indexingSupport: "supported",
    settlementPrimitives: "supported",
    liquidityRails: "supported",
    nativeValidatorStaking: "supported",
    ...overrides,
  };
}

function createProfile(
  chainSlug: string,
  architectureKind: ChainTechnicalProfileSeed["architectureKind"],
  capabilities: ChainTechnicalCapabilities,
  dataConfidence: ChainTechnicalProfileSeed["dataConfidence"],
  notes: string[],
): ChainTechnicalProfileSeed {
  return {
    chainSlug,
    architectureKind,
    capabilities,
    dataConfidence,
    sourceBasis,
    assessedAt,
    notes:
      notes.length > 0
        ? notes
        : [
            "Atlas technical applicability review relies on the default capability profile for this chain category until a more specific chain note is added.",
          ],
  };
}

const generalL1 = (chainSlug: string, notes: string[] = []) =>
  createProfile(chainSlug, "general-evm-l1", createCapabilities(), "high", notes);

const generalL2 = (chainSlug: string, notes: string[] = []) =>
  createProfile(
    chainSlug,
    "general-evm-l2",
    createCapabilities({
      nativeValidatorStaking: "unsupported",
    }),
    "high",
    [
      "Rollup architecture supports most wedge primitives but does not expose a native validator staking primitive for chain-native liquid staking.",
      ...notes,
    ],
  );

const specializedL1 = (
  chainSlug: string,
  overrides: Partial<ChainTechnicalCapabilities>,
  dataConfidence: ChainTechnicalProfileSeed["dataConfidence"],
  notes: string[],
) =>
  createProfile(
    chainSlug,
    "specialized-evm",
    createCapabilities(overrides),
    dataConfidence,
    notes,
  );

const bitcoinEvm = (
  chainSlug: string,
  overrides: Partial<ChainTechnicalCapabilities> = {},
  dataConfidence: ChainTechnicalProfileSeed["dataConfidence"] = "medium",
  notes: string[] = [],
) =>
  createProfile(
    chainSlug,
    "bitcoin-evm",
    createCapabilities({
      oracleSupport: "limited",
      indexingSupport: "limited",
      liquidityRails: "limited",
      nativeValidatorStaking: "unsupported",
      ...overrides,
    }),
    dataConfidence,
    [
      "Bitcoin-linked EVM design supports deployment, but broader wedge coverage is still constrained by thinner oracle, liquidity, and indexing depth.",
      ...notes,
    ],
  );

const enterpriseEvm = (
  chainSlug: string,
  overrides: Partial<ChainTechnicalCapabilities>,
  dataConfidence: ChainTechnicalProfileSeed["dataConfidence"],
  notes: string[],
) =>
  createProfile(
    chainSlug,
    "enterprise-evm",
    createCapabilities(overrides),
    dataConfidence,
    notes,
  );

export const chainTechnicalProfileSeeds: ChainTechnicalProfileSeed[] = [
  generalL1("ethereum", [
    "Broadest EVM primitive coverage in the current Atlas benchmark.",
  ]),
  generalL1("bnb-chain"),
  generalL2("base"),
  specializedL1(
    "plasma",
    {
      oracleSupport: "limited",
      indexingSupport: "limited",
    },
    "medium",
    [
      "Capital concentration exists, but Atlas has lower confidence in broad reusable primitive coverage than for the largest majors.",
    ],
  ),
  generalL2("arbitrum"),
  generalL1("avalanche"),
  generalL2("katana", [
    "Ecosystem breadth is still maturing beyond capital formation.",
  ]),
  generalL1("polygon"),
  generalL2("mantle"),
  generalL2("ink", [
    "Infrastructure surface is still young despite recent TVL growth.",
  ]),
  createProfile(
    "monad",
    "general-evm-l1",
    createCapabilities({
      oracleSupport: "limited",
      indexingSupport: "limited",
      liquidityRails: "limited",
    }),
    "medium",
    [
      "Execution model is EVM-compatible, but Atlas keeps medium confidence while production primitives mature.",
    ],
  ),
  generalL2("scroll"),
  generalL1("cronos", [
    "Payments and consumer rails are strong, but some deeper infrastructure still needs more proof.",
  ]),
  generalL1("berachain"),
  generalL2("optimism"),
  generalL1("gnosis", [
    "Operational maturity is strong even with a smaller protocol surface than the leaders.",
  ]),
  generalL2("linea"),
  enterpriseEvm(
    "hedera",
    {
      smartContracts: "limited",
      tokenStandards: "limited",
      oracleSupport: "limited",
      indexingSupport: "limited",
      liquidityRails: "limited",
    },
    "medium",
    [
      "EVM compatibility exists through Hedera Smart Contract Service, but Atlas treats several primitives as partially proven relative to the benchmark.",
    ],
  ),
  specializedL1(
    "plume",
    {
      liquidityRails: "limited",
    },
    "high",
    [
      "Chain is architecturally well aligned to RWA workflows, but still earlier on general-purpose liquidity depth.",
    ],
  ),
  bitcoinEvm("rootstock"),
  createProfile(
    "megaeth",
    "general-evm-l2",
    createCapabilities({
      oracleSupport: "limited",
      indexingSupport: "limited",
      liquidityRails: "limited",
      nativeValidatorStaking: "unsupported",
    }),
    "medium",
    [
      "Performance orientation is clear, but Atlas keeps medium confidence while ecosystem primitives mature.",
    ],
  ),
  bitcoinEvm("bitlayer"),
  bitcoinEvm("bob"),
  generalL2("unichain", [
    "Exchange distribution is promising, but Atlas still scores confidence below the most mature rollups.",
  ]),
  specializedL1(
    "ai-layer",
    {
      oracleSupport: "limited",
      indexingSupport: "limited",
      liquidityRails: "limited",
      nativeValidatorStaking: "limited",
    },
    "low",
    [
      "Atlas has enough evidence to include the chain, but several cross-wedge primitives still need manual review.",
    ],
  ),
  generalL2("mode"),
  specializedL1(
    "ethereal",
    {
      oracleSupport: "limited",
      indexingSupport: "limited",
      liquidityRails: "limited",
      paymentRails: "limited",
    },
    "low",
    [
      "Emerging chain with capital signals, but Atlas still lacks enough confidence for definitive applicability on every wedge.",
    ],
  ),
  bitcoinEvm(
    "hemi",
    {
      oracleSupport: "limited",
      indexingSupport: "limited",
    },
    "medium",
  ),
  generalL1("sonic"),
  generalL2("fraxtal", [
    "Protocol-native distribution is credible, but cross-economy primitive depth is still uneven.",
  ]),
];
