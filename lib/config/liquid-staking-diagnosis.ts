import type {
  LiquidStakingDiagnosticDimension,
  LiquidStakingDiagnosticSlug,
} from "@/lib/domain/types";

function createDimension(
  id: string,
  slug: LiquidStakingDiagnosticSlug,
  name: string,
  description: string,
  defaultWeight: number,
): LiquidStakingDiagnosticDimension {
  return {
    id,
    slug,
    name,
    description,
    defaultWeight,
  };
}

export const liquidStakingDiagnosticDimensions: LiquidStakingDiagnosticDimension[] =
  [
    createDimension(
      "lst-liquidity-exit",
      "liquidity-exit",
      "Liquidity & Exit",
      "How reliably LST holders can exit size without sharp discounts, thin routing, or unstable redemption depth.",
      18,
    ),
    createDimension(
      "lst-peg-stability",
      "peg-stability",
      "Peg Stability",
      "How consistently the token tracks target value across market stress, queue pressure, and redemption path constraints.",
      16,
    ),
    createDimension(
      "lst-defi-moneyness",
      "defi-moneyness",
      "DeFi Moneyness",
      "How deeply the LST is treated as productive collateral across lending, liquidity, and trading venues.",
      14,
    ),
    createDimension(
      "lst-security-governance",
      "security-governance",
      "Security & Governance",
      "Audit posture, control quality, and governance discipline around the staking system and its upgrade surface.",
      14,
    ),
    createDimension(
      "lst-validator-decentralization",
      "validator-decentralization",
      "Validator Decentralization",
      "How concentrated validator exposure remains and whether delegation breadth can support scaled staking demand.",
      14,
    ),
    createDimension(
      "lst-incentive-sustainability",
      "incentive-sustainability",
      "Incentive Sustainability",
      "How much current usage depends on emissions versus durable utility, yield quality, and repeatable user demand.",
      12,
    ),
    createDimension(
      "lst-stress-resilience",
      "stress-resilience",
      "Stress Resilience",
      "How the LST system behaves under market shocks, redemption surges, and correlated liquidity drawdowns.",
      12,
    ),
  ];

export const defaultLiquidStakingDiagnosticWeights = Object.fromEntries(
  liquidStakingDiagnosticDimensions.map((dimension) => [
    dimension.slug,
    dimension.defaultWeight,
  ]),
) as Record<LiquidStakingDiagnosticSlug, number>;
