import type {
  LiquidStakingDiagnosisSeed,
  LiquidStakingDiagnosticSlug,
} from "@/lib/domain/types";

const dimensionOrder: LiquidStakingDiagnosticSlug[] = [
  "liquidity-exit",
  "peg-stability",
  "defi-moneyness",
  "security-governance",
  "validator-decentralization",
  "incentive-sustainability",
  "stress-resilience",
];

function createSeed(scores: number[]): LiquidStakingDiagnosisSeed {
  return {
    scores: Object.fromEntries(
      dimensionOrder.map((slug, index) => [slug, scores[index] ?? 0]),
    ) as Record<LiquidStakingDiagnosticSlug, number>,
  };
}

export const liquidStakingDiagnosisSeeds: Record<
  string,
  LiquidStakingDiagnosisSeed
> = {
  ethereum: createSeed([88, 84, 82, 81, 76, 74, 78]),
  "bnb-chain": createSeed([64, 61, 59, 57, 52, 48, 46]),
  base: createSeed([66, 63, 62, 58, 51, 49, 47]),
  plasma: createSeed([42, 39, 35, 41, 38, 36, 33]),
  arbitrum: createSeed([71, 68, 67, 63, 57, 54, 52]),
  avalanche: createSeed([68, 64, 61, 60, 56, 52, 50]),
  katana: createSeed([57, 54, 52, 49, 47, 46, 43]),
  polygon: createSeed([65, 62, 60, 57, 53, 50, 48]),
  mantle: createSeed([61, 58, 56, 53, 50, 47, 45]),
  ink: createSeed([44, 41, 39, 42, 38, 35, 34]),
  monad: createSeed([41, 38, 37, 40, 36, 34, 33]),
  scroll: createSeed([46, 43, 40, 44, 39, 36, 35]),
  cronos: createSeed([58, 55, 53, 51, 48, 46, 44]),
  berachain: createSeed([67, 63, 65, 58, 52, 49, 47]),
  optimism: createSeed([66, 63, 61, 58, 52, 49, 47]),
  gnosis: createSeed([48, 45, 39, 47, 43, 37, 36]),
  linea: createSeed([45, 42, 38, 43, 39, 36, 34]),
  hedera: createSeed([43, 40, 36, 41, 37, 35, 33]),
  plume: createSeed([40, 37, 35, 39, 36, 34, 32]),
  rootstock: createSeed([50, 47, 42, 49, 44, 39, 38]),
  megaeth: createSeed([38, 35, 33, 37, 34, 31, 30]),
  bitlayer: createSeed([41, 38, 34, 40, 35, 33, 31]),
  bob: createSeed([44, 40, 37, 42, 38, 35, 33]),
  unichain: createSeed([39, 36, 34, 38, 35, 32, 31]),
  "ai-layer": createSeed([34, 31, 30, 35, 31, 28, 27]),
  mode: createSeed([46, 42, 39, 44, 40, 36, 35]),
  ethereal: createSeed([35, 32, 29, 34, 30, 27, 26]),
  hemi: createSeed([42, 38, 35, 40, 36, 33, 32]),
  sonic: createSeed([49, 46, 41, 47, 43, 39, 37]),
  fraxtal: createSeed([52, 49, 46, 50, 45, 42, 40]),
};
