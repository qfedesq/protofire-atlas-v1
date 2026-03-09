import { describe, expect, it } from "vitest";

import { parseOfferMarkdown } from "@/lib/offers/parseOfferMarkdown";

describe("offer markdown parsing", () => {
  it("extracts structured offer fields from markdown", () => {
    const offer = parseOfferMarkdown({
      fileName: "liquid-staking.md",
      sourceFile: "/Users/qfedesq/Desktop/Atlas/offers/liquid-staking.md",
    });

    expect(offer.offerId).toBe("liquid-staking");
    expect(offer.name).toBe("Liquid Staking Stack");
    expect(offer.isActive).toBe(true);
    expect(offer.applicableWedges).toEqual(["defi-infrastructure"]);
    expect(offer.targetPersonas).toContain("Ecosystem Lead");
    expect(offer.technicalRequirements).toContain("Validator integration");
    expect(offer.expectedImpact).toMatch(/DeFi readiness/i);
  });
});
