import { buildScoreDrivers } from "@/lib/comparison/peer-comparison";
import type {
  Chain,
  ChainEconomyReadiness,
  EconomyType,
  ScoreDriver,
} from "@/lib/domain/types";

export type RoadmapFitInsight = {
  roadmap: Chain["roadmap"];
  topDriver: ScoreDriver | null;
  offerFitLabel: string;
  summary: string;
};

type RoadmapFitInput = {
  chain: Chain;
  economy: EconomyType;
  readinessScore: ChainEconomyReadiness;
};

function getTopDriver(input: Pick<RoadmapFitInput, "economy" | "readinessScore">) {
  return buildScoreDrivers(input)[0] ?? null;
}

export function buildRoadmapFitInsight(
  input: RoadmapFitInput,
): RoadmapFitInsight {
  const topDriver = getTopDriver(input);

  if (!topDriver) {
    return {
      roadmap: input.chain.roadmap,
      topDriver: null,
      offerFitLabel: "Optimization and positioning",
      summary: `${input.chain.roadmap.atlasFitSummary} The current ${input.economy.shortLabel} posture is already near the top of the Atlas model, so the commercial opportunity is tighter positioning and refinement instead of a foundational rollout.`,
    };
  }

  return {
    roadmap: input.chain.roadmap,
    topDriver,
    offerFitLabel: topDriver.module.name,
    summary: `${input.chain.roadmap.atlasFitSummary} For ${input.economy.shortLabel}, ${topDriver.module.name} is the clearest score lever because it is still ${topDriver.status}.`,
  };
}
