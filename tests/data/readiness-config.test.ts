import { describe, expect, it } from "vitest";

import { economyTypes } from "@/lib/config/economies";
import { parseEconomyTypes } from "@/lib/domain/schemas";

describe("economy config validation", () => {
  it("keeps the current economy catalog valid and weighted to 100 per wedge", () => {
    const parsedEconomies = parseEconomyTypes(economyTypes);

    expect(parsedEconomies).toHaveLength(4);
    parsedEconomies.forEach((economy) => {
      const totalWeight = economy.modules.reduce(
        (sum, module) => sum + module.weight,
        0,
      );

      expect(totalWeight).toBe(100);
      expect(Object.keys(economy.recommendationRules)).toHaveLength(
        economy.modules.length,
      );
    });
  });

  it("rejects invalid total module weight within an economy", () => {
    const invalidEconomies = economyTypes.map((economy) =>
      economy.slug === "defi-infrastructure"
        ? {
            ...economy,
            modules: economy.modules.map((module, index) => ({
              ...module,
              weight: index === 0 ? 30 : module.weight,
            })),
          }
        : economy,
    );

    expect(() => parseEconomyTypes(invalidEconomies)).toThrow(
      /weights must sum to 100/i,
    );
  });
});
