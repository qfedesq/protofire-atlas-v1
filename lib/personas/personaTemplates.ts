import type {
  BuyerPersonaInput,
  BuyerPersonaStructuredOutput,
  ChainProfile,
} from "@/lib/domain/types";

export function buildPersonaStructuredTemplate(
  input: BuyerPersonaInput,
  profile: ChainProfile,
): BuyerPersonaStructuredOutput {
  const economyLabel = profile.economy.shortLabel;
  const topGap = profile.gapAnalysis[0]?.module.name ?? "infrastructure depth";
  const personaTitle = input.personTitle;

  return {
    empathyMap: {
      hear: [
        `${profile.chain.name} needs clearer proof that ${economyLabel} infrastructure can support ecosystem growth.`,
        `${personaTitle} is expected to justify why the current infrastructure roadmap is enough for partner activation.`,
        "Protocol teams want stronger launch rails before committing engineering resources.",
      ],
      fearTop3: [
        `Falling behind competing chains on ${economyLabel} readiness.`,
        "Launching ecosystem initiatives before the infrastructure base is credible.",
        "Missing the window to convert roadmap momentum into builder adoption.",
      ],
      wantTop3: [
        "Higher ecosystem confidence from builders and strategic partners.",
        "A concrete activation path with low execution ambiguity.",
        "A credible external story for why the chain can win this wedge.",
      ],
      needTop3: [
        `A plan to close ${topGap.toLowerCase()}.`,
        "Near-term wins tied to measurable partner and ecosystem outcomes.",
        "A delivery partner that can own missing infrastructure without roadmap drift.",
      ],
      painsTop3: [
        "Fragmented infrastructure maturity across critical modules.",
        "Pressure to show measurable progress without overextending internal teams.",
        "Difficulty translating technical gaps into commercial decisions.",
      ],
      expectedGainsTop3: [
        "Clearer ranking movement in Atlas.",
        "Lower partner friction for ecosystem activation.",
        "Better internal alignment around what should ship next.",
      ],
    },
    successMetrics: {
      topKpis: [
        "Partner protocol launches",
        "Qualified ecosystem pipeline",
        `${economyLabel} readiness score movement`,
      ],
      organizationOkrs: [
        "Increase wedge-specific ecosystem credibility in the next two quarters.",
        "Launch missing infrastructure that shortens partner time-to-market.",
        "Convert infrastructure investment into measurable ecosystem adoption.",
      ],
    },
    leanCanvas: {
      problem:
        "The chain has growth ambition, but infrastructure gaps still slow partner confidence and ecosystem execution.",
      solution:
        "Close the highest-friction Atlas gaps with a scoped Protofire activation program.",
      valueProposition:
        "Protofire turns ranking blockers into a concrete rollout tied to partner and ecosystem outcomes.",
      competitors:
        "Peer chains with stronger infrastructure completeness in the selected wedge.",
      strategy:
        "Sequence fast infrastructure wins that improve readiness and make the ecosystem narrative easier to sell.",
      growthDrivers:
        "Protocol launch velocity, capital formation, developer trust, and ecosystem signaling.",
    },
    sourceSummary: [],
  };
}
