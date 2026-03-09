import { describe, expect, it } from "vitest";

import { buildPersonaProfile } from "@/lib/personas/buildPersonaProfile";

describe("persona profile builder", () => {
  it("builds a structured persona with source basis and deterministic sections", () => {
    const persona = buildPersonaProfile({
      chainSlug: "ethereum",
      chainUrl: "https://ethereum.org",
      organizationName: "Ethereum Foundation",
      personName: "Taylor",
      personTitle: "Ecosystem Lead",
      linkedinProfile: "https://linkedin.com/in/taylor",
      notes: "Met at EthCC.",
    });

    expect(persona.organization).toBe("Ethereum Foundation");
    expect(persona.structuredData.empathyMap.fearTop3).toHaveLength(3);
    expect(persona.structuredData.successMetrics.topKpis).toHaveLength(3);
    expect(persona.structuredData.leanCanvas.problem).toMatch(/infrastructure gap/i);
    expect(persona.sourceNotes).toContain("https://ethereum.org");
    expect(persona.sourceNotes.some((note) => note.includes("EthCC"))).toBe(true);
  });
});
