import type {
  BuyerPersonaInput,
  BuyerPersonaStructuredOutput,
  ChainProfile,
} from "@/lib/domain/types";

export function buildMockBuyerPersona(
  input: BuyerPersonaInput,
  profile: ChainProfile,
): BuyerPersonaStructuredOutput {
  const economyLabel = profile.economy.shortLabel;
  const topGap = profile.gapAnalysis[0]?.module.name ?? "infrastructure depth";

  return {
    empathyMap: {
      hear: [
        `${profile.chain.name} needs clearer proof that ${economyLabel} infrastructure can support ecosystem growth.`,
        "Protocol teams want stronger launch rails before committing engineering resources.",
        "Leadership is being asked how quickly the chain can close readiness gaps.",
      ],
      fearTop3: [
        `Falling behind competing chains on ${economyLabel} readiness.`,
        "Launching ecosystem initiatives without the right infrastructure in place.",
        "Spending growth budget before the technical base is credible.",
      ],
      wantTop3: [
        "Higher ecosystem confidence from builders and partners.",
        "A concrete activation path with low execution ambiguity.",
        "A credible story for why the chain can win this wedge.",
      ],
      needTop3: [
        `A plan to close ${topGap.toLowerCase()}.`,
        "Near-term wins that improve external perception and internal KPIs.",
        "A partner that can deploy the missing rails with clear ownership.",
      ],
      painsTop3: [
        "Fragmented infrastructure maturity across modules.",
        "Pressure to show measurable progress without long roadmap drift.",
        "Difficulty translating technical gaps into commercial decisions.",
      ],
      expectedGainsTop3: [
        "Clearer ranking movement in Atlas.",
        "Lower partner friction for ecosystem activation.",
        "Better internal alignment around infrastructure priorities.",
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
        "Protofire turns ranking blockers into a concrete infrastructure rollout tied to partner and ecosystem outcomes.",
      competitors:
        "Peer chains with stronger infrastructure completeness in the selected wedge.",
      strategy:
        "Sequence quick infrastructure wins that improve readiness and make the ecosystem narrative easier to sell.",
      growthDrivers:
        "Protocol launch velocity, capital formation, developer trust, and ecosystem signaling.",
      },
    sourceSummary: [
      input.chainUrl,
      profile.chain.roadmap.sourceUrl ?? profile.chain.roadmap.sourceLabel,
      input.linkedinProfile ?? "Manual internal persona input",
    ],
  };
}
