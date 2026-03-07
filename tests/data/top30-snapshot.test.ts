import { describe, expect, it } from "vitest";

import top30EvmChainsSnapshot from "@/data/source/defillama-top-30-evm-chains.snapshot.json";
import { chainCatalogSeeds } from "@/data/seed/catalog";
import { chainEconomySeedRecords } from "@/data/seed/economies";
import { economyTypeSlugs } from "@/lib/domain/types";

describe("top 30 EVM snapshot dataset", () => {
  it("keeps a documented DeFiLlama top-30 EVM snapshot with sequential source ranks", () => {
    expect(top30EvmChainsSnapshot.sourceProvider).toBe("DeFiLlama");
    expect(top30EvmChainsSnapshot.sourceMetric).toBe("TVL");
    expect(top30EvmChainsSnapshot.sourceCategory).toBe("EVM");
    expect(top30EvmChainsSnapshot.chains).toHaveLength(30);

    top30EvmChainsSnapshot.chains.forEach((chain, index) => {
      expect(chain.sourceRank).toBe(index + 1);
      expect(chain.sourceCategory).toBe("EVM");
      expect(chain.sourceMetric).toBe("TVL");
      expect(chain.sourceProvider).toBe("DeFiLlama");
      expect(chain.sourceTvlUsd).toBeGreaterThan(0);
    });
  });

  it("keeps the editable chain catalog aligned with the source snapshot ordering", () => {
    expect(chainCatalogSeeds).toHaveLength(30);
    expect(chainCatalogSeeds.map((chain) => chain.slug)).toEqual(
      top30EvmChainsSnapshot.chains.map((chain) => chain.slug),
    );
  });

  it("creates one readiness record per chain for every supported economy", () => {
    chainCatalogSeeds.forEach((chain) => {
      const chainRecords = chainEconomySeedRecords.filter(
        (record) => record.chainSlug === chain.slug,
      );

      expect(chainRecords).toHaveLength(economyTypeSlugs.length);
      expect(chainRecords.map((record) => record.economyType).sort()).toEqual(
        [...economyTypeSlugs].sort(),
      );
    });
  });
});
