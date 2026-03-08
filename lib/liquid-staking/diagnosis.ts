import { liquidStakingDiagnosisSeeds } from "@/data/seed/liquid-staking-diagnosis";
import {
  defaultLiquidStakingDiagnosticWeights,
  liquidStakingDiagnosticDimensions,
} from "@/lib/config/liquid-staking-diagnosis";
import { getActiveAssumptions } from "@/lib/assumptions/store";
import type {
  LiquidStakingDiagnosis,
  LiquidStakingDiagnosticDimension,
  LiquidStakingDiagnosticSlug,
} from "@/lib/domain/types";

type ScoreBucket = "strong" | "developing" | "fragile";

type DimensionCopy = {
  strong: string;
  developing: string;
  fragile: string;
};

const rationaleByDimension: Record<
  LiquidStakingDiagnosticSlug,
  DimensionCopy
> = {
  "liquidity-exit": {
    strong:
      "Exit quality is already credible enough to handle larger LST flows without relying on thin, incentive-led liquidity alone.",
    developing:
      "Exit quality is serviceable in normal conditions, but deeper LST-specific routing and redemption depth are still needed.",
    fragile:
      "Exit quality is still shallow, so larger redemptions can push users into discount-heavy execution paths.",
  },
  "peg-stability": {
    strong:
      "Peg behavior is steady enough that temporary demand shocks are less likely to break confidence in the liquid staking wrapper.",
    developing:
      "Peg behavior is workable today, but temporary queue pressure or thin depth can still widen discounts.",
    fragile:
      "Peg anchoring remains too sensitive to stressed liquidity or slow redemption paths, which weakens trust in the wrapper.",
  },
  "defi-moneyness": {
    strong:
      "The LST is already close to a first-class DeFi asset, with better odds of being reused as collateral and liquidity base capital.",
    developing:
      "The LST is usable in DeFi, but it is not yet positioned as core collateral or routing money across the ecosystem.",
    fragile:
      "The LST is not yet treated as money-like collateral, so its utility inside the wider DeFi stack remains shallow.",
  },
  "security-governance": {
    strong:
      "Governance and control posture are strong enough to market the staking system as a more durable institutional primitive.",
    developing:
      "Governance and security controls are improving, but formal hardening is still needed before the chain can sell stronger trust guarantees.",
    fragile:
      "Control quality is still too thin, which leaves governance and operational risk too exposed for a maturing LST market.",
  },
  "validator-decentralization": {
    strong:
      "Validator breadth is healthy enough that the staking layer can scale without concentrating too much supply in a narrow operator set.",
    developing:
      "Validator structure is functional today, but concentration should fall further as staking demand expands.",
    fragile:
      "Validator concentration is still too high, leaving the LST exposed to governance and liveness concentration risk.",
  },
  "incentive-sustainability": {
    strong:
      "Usage depends less on emissions and more on durable utility, which gives the LST a more stable path to sticky demand.",
    developing:
      "Current growth is real, but incentives still explain too much of the LST's retained activity.",
    fragile:
      "Demand still leans heavily on emissions, so retention can fade quickly once short-term incentives roll off.",
  },
  "stress-resilience": {
    strong:
      "Shock handling is solid enough that the chain can market the LST as more resilient under wider DeFi volatility.",
    developing:
      "Stress handling is acceptable, but redemption surges and liquidity shocks can still create visible fragility.",
    fragile:
      "The current setup still struggles under stress scenarios, especially when liquidity and redemption queues tighten together.",
  },
};

const riskByDimension: Record<LiquidStakingDiagnosticSlug, DimensionCopy> = {
  "liquidity-exit": {
    strong:
      "Risk remains mainly around abrupt TVL spikes that outpace market-making depth.",
    developing:
      "Risk: larger exits can still widen execution discounts before liquidity catches up.",
    fragile:
      "Risk: exit quality can break down quickly under moderate size, leaving the LST hard to unwind cleanly.",
  },
  "peg-stability": {
    strong:
      "Risk remains concentrated in exceptional queue or redemption bottlenecks rather than day-to-day usage.",
    developing:
      "Risk: queue opacity and thin depth can still amplify temporary peg slippage.",
    fragile:
      "Risk: confidence shocks can widen the peg fast because arbitrage and redemption pathways are still too weak.",
  },
  "defi-moneyness": {
    strong:
      "Risk remains mostly around incomplete protocol coverage rather than fundamental utility.",
    developing:
      "Risk: without better collateral utility, the LST stays adjacent to DeFi instead of central to it.",
    fragile:
      "Risk: without money-like utility, demand stays structurally shallow and easy to displace.",
  },
  "security-governance": {
    strong:
      "Risk remains manageable if control quality continues to improve with ecosystem scale.",
    developing:
      "Risk: weaker formal controls can slow institutional trust and larger partner integrations.",
    fragile:
      "Risk: governance and security gaps can become a direct blocker to broader LST adoption.",
  },
  "validator-decentralization": {
    strong:
      "Risk remains around future concentration if growth outpaces delegation diversification.",
    developing:
      "Risk: concentration can still tighten if new stake clusters around a small validator group.",
    fragile:
      "Risk: concentration remains too high, increasing governance and validator dependency risk.",
  },
  "incentive-sustainability": {
    strong:
      "Risk remains limited to pockets of mercenary liquidity rather than the full LST base.",
    developing:
      "Risk: if incentives fade before utility deepens, liquidity can decay faster than expected.",
    fragile:
      "Risk: once subsidies compress, demand can unwind quickly because utility still does not carry the product.",
  },
  "stress-resilience": {
    strong:
      "Risk remains concentrated in extreme market dislocations rather than normal stress bands.",
    developing:
      "Risk: run-to-stable scenarios can still expose queue pressure and weak exit pathways.",
    fragile:
      "Risk: stress events can still push the system into visible fragility around redemption and exit timing.",
  },
};

function getScoreBucket(score: number): ScoreBucket {
  if (score >= 75) {
    return "strong";
  }

  if (score >= 55) {
    return "developing";
  }

  return "fragile";
}

export function getActiveLiquidStakingDiagnosticWeights() {
  const assumptions = getActiveAssumptions();
  const configured =
    assumptions.economies["defi-infrastructure"]?.moduleDiagnosticWeights?.[
      "liquid-staking"
    ];

  return configured ?? defaultLiquidStakingDiagnosticWeights;
}

export function buildLiquidStakingDiagnosis(
  chainSlug: string,
): LiquidStakingDiagnosis | undefined {
  const seed = liquidStakingDiagnosisSeeds[chainSlug];

  if (!seed) {
    return undefined;
  }

  const activeWeights = getActiveLiquidStakingDiagnosticWeights();
  const dimensions = liquidStakingDiagnosticDimensions.map((dimension) => {
    const score = seed.scores[dimension.slug];
    const bucket = getScoreBucket(score);

    return {
      dimension,
      weight: activeWeights[dimension.slug] ?? dimension.defaultWeight,
      score,
      rationale: rationaleByDimension[dimension.slug][bucket],
      risk: riskByDimension[dimension.slug][bucket],
    };
  });

  const weightedScore =
    dimensions.reduce(
      (total, dimension) => total + dimension.score * (dimension.weight / 100),
      0,
    );

  return {
    weightedScore,
    dimensions,
  };
}

export function listLiquidStakingDiagnosticDimensions() {
  return liquidStakingDiagnosticDimensions;
}

export function getLiquidStakingDiagnosticDimensionBySlug(
  slug: LiquidStakingDiagnosticDimension["slug"],
) {
  return liquidStakingDiagnosticDimensions.find((dimension) => dimension.slug === slug);
}
