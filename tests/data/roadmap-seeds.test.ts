import { describe, expect, it } from "vitest";

import { chainRoadmapSeeds } from "@/data/seed/chain-roadmaps";
import { chainCatalogSeeds } from "@/data/seed/catalog";
import { validateChainRoadmapSeeds } from "@/lib/domain/schemas";

describe("chain roadmap seeds", () => {
  it("covers every seeded chain in the top-30 benchmark", () => {
    const parsedRoadmaps = validateChainRoadmapSeeds(
      chainCatalogSeeds,
      chainRoadmapSeeds,
    );

    expect(parsedRoadmaps).toHaveLength(chainCatalogSeeds.length);
    expect(parsedRoadmaps.some((roadmap) => roadmap.sourceUrl)).toBe(true);
  });

  it("keeps official source labels explicit when no roadmap page is verified", () => {
    const unresolved = chainRoadmapSeeds.filter(
      (roadmap) => roadmap.sourceKind === "not-public",
    );

    expect(unresolved.length).toBeGreaterThan(0);
    unresolved.forEach((roadmap) => {
      expect(roadmap.sourceLabel).toMatch(/no public roadmap verified/i);
    });
  });
});
