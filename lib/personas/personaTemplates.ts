import type {
  BuyerPersonaInput,
  BuyerPersonaStructuredOutput,
  ChainProfile,
} from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

function describeGapSeverity(profile: ChainProfile) {
  const gapCount = profile.gapAnalysis.length;
  const totalModules = profile.economy.modules.length;

  if (gapCount === 0) {
    return "no open infrastructure gaps";
  }

  if (gapCount >= totalModules - 1) {
    return "critical infrastructure gaps across nearly all modules";
  }

  if (gapCount > totalModules / 2) {
    return "significant infrastructure gaps in the majority of modules";
  }

  return `${gapCount} infrastructure gap${gapCount > 1 ? "s" : ""} in targeted modules`;
}

function describeChainScale(profile: ChainProfile) {
  const tvl = profile.chain.sourceTvlUsd;

  if (tvl > 10_000_000_000) {
    return "a top-tier chain by TVL";
  }

  if (tvl > 1_000_000_000) {
    return "a mid-tier chain with meaningful TVL";
  }

  if (tvl > 100_000_000) {
    return "an emerging chain with growing TVL";
  }

  return "an early-stage chain building ecosystem traction";
}

function describeTitleContext(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("cto") || normalized.includes("technical")) {
    return {
      perspective: "technical architecture and engineering capacity",
      pressure: "delivering technically sound infrastructure on aggressive timelines",
      metric: "engineering velocity and system reliability",
    };
  }

  if (normalized.includes("ecosystem") || normalized.includes("bd") || normalized.includes("business")) {
    return {
      perspective: "ecosystem growth and partner activation",
      pressure: "demonstrating ecosystem readiness to attract builders and capital",
      metric: "partner pipeline and ecosystem expansion rate",
    };
  }

  if (normalized.includes("finance") || normalized.includes("treasury")) {
    return {
      perspective: "capital efficiency and deployment ROI",
      pressure: "justifying infrastructure spend against measurable ecosystem returns",
      metric: "cost-per-deployment and capital utilization",
    };
  }

  if (normalized.includes("product")) {
    return {
      perspective: "product strategy and developer experience",
      pressure: "shipping usable infrastructure before the competitive window closes",
      metric: "developer adoption and product-market fit signals",
    };
  }

  return {
    perspective: "strategic positioning and infrastructure readiness",
    pressure: "balancing growth ambition with infrastructure maturity",
    metric: "ecosystem credibility and deployment throughput",
  };
}

export function buildPersonaStructuredTemplate(
  input: BuyerPersonaInput,
  profile: ChainProfile,
): BuyerPersonaStructuredOutput {
  const economyLabel = profile.economy.shortLabel;
  const chainName = profile.chain.name;
  const chainCategory = profile.chain.category;
  const topGap = profile.gapAnalysis[0]?.module.name ?? "infrastructure depth";
  const secondGap = profile.gapAnalysis[1]?.module.name;
  const gapSeverity = describeGapSeverity(profile);
  const chainScale = describeChainScale(profile);
  const readinessScore = formatScore(profile.readinessScore.totalScore);
  const maxScore = profile.economy.scoringConfig.maximumScore;
  const titleContext = describeTitleContext(input.personTitle);
  const personaTitle = input.personTitle;

  const gapList = profile.gapAnalysis
    .slice(0, 3)
    .map((gap) => gap.module.name.toLowerCase())
    .join(", ");

  return {
    empathyMap: {
      hear: [
        `${chainName} is ${chainScale} with ${gapSeverity} in ${economyLabel}.`,
        `As ${personaTitle}, ${input.personName ?? "this persona"} is focused on ${titleContext.perspective}.`,
        `The chain's current ${economyLabel} readiness score is ${readinessScore}/${maxScore}, which shapes internal prioritization.`,
      ],
      fearTop3: [
        `Losing competitive position as a ${chainCategory} because ${gapList || "infrastructure"} gaps persist.`,
        `${titleContext.pressure} without clear external delivery support.`,
        `Ecosystem partners perceiving ${chainName} as not ready for production ${economyLabel} workloads.`,
      ],
      wantTop3: [
        `Close ${topGap.toLowerCase()}${secondGap ? ` and ${secondGap.toLowerCase()}` : ""} gaps to unblock ecosystem activation.`,
        `A concrete deployment plan tied to ${titleContext.metric}.`,
        `External validation that ${chainName}'s ${economyLabel} posture is competitive.`,
      ],
      needTop3: [
        `A scoped plan to close ${topGap.toLowerCase()} that maps to measurable outcomes.`,
        `A delivery partner that can execute without consuming internal ${chainCategory === "L2" ? "rollup" : "chain"} team bandwidth.`,
        "Near-term infrastructure wins that compound into ecosystem credibility.",
      ],
      painsTop3: [
        `${gapSeverity.charAt(0).toUpperCase() + gapSeverity.slice(1)} creates execution friction for ${personaTitle}.`,
        `Translating a ${readinessScore}/${maxScore} readiness score into clear investment decisions.`,
        `Internal teams are stretched across ${economyLabel} and other priorities simultaneously.`,
      ],
      expectedGainsTop3: [
        `Readiness score improvement from ${readinessScore} toward ${maxScore} in ${economyLabel}.`,
        "Reduced time-to-activation for ecosystem partners and protocols.",
        `Stronger competitive position among ${chainCategory} chains in ${economyLabel}.`,
      ],
    },
    successMetrics: {
      topKpis: [
        titleContext.metric.charAt(0).toUpperCase() + titleContext.metric.slice(1),
        `${economyLabel} readiness score movement`,
        "Infrastructure gap closure rate",
      ],
      organizationOkrs: [
        `Close ${profile.gapAnalysis.length > 0 ? profile.gapAnalysis.length : "identified"} ${economyLabel} infrastructure gaps this quarter.`,
        `Improve ${economyLabel} readiness to enable production partner deployments.`,
        `Convert infrastructure investment into measurable ${titleContext.metric}.`,
      ],
    },
    leanCanvas: {
      problem:
        `${chainName} has ${gapSeverity} that limit ${economyLabel} ecosystem activation and partner confidence.`,
      solution:
        `Close the highest-impact ${economyLabel} gaps (${gapList || "key modules"}) with a scoped infrastructure program.`,
      valueProposition:
        `Turn ${chainName}'s ${readinessScore}/${maxScore} ${economyLabel} score into a competitive advantage through targeted infrastructure deployment.`,
      competitors:
        `Peer ${chainCategory} chains with stronger ${economyLabel} infrastructure completeness and active ecosystem programs.`,
      strategy:
        `Sequence ${topGap.toLowerCase()} closure first, then expand coverage to remaining gaps for maximum ecosystem signal.`,
      growthDrivers:
        `Protocol adoption velocity, partner pipeline conversion, ${titleContext.metric}, and ecosystem signaling.`,
    },
    sourceSummary: [],
  };
}
