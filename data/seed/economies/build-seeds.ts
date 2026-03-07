import { chainCatalogSeeds } from "@/data/seed/catalog";
import type {
  ChainEconomySeedRecord,
  EconomyModuleSlug,
  EconomyTypeSlug,
  ModuleAvailabilityStatus,
  ModuleStatusSeed,
} from "@/lib/domain/types";

type EconomyStatusCopy = {
  available: {
    evidence: string;
    rationale: string;
  };
  partial: {
    evidence: string;
    rationale: string;
  };
  missing: {
    evidence: string;
    rationale: string;
  };
};

type EconomyStatusMatrix = Record<
  string,
  Record<EconomyModuleSlug, ModuleAvailabilityStatus>
>;

function createModuleStatusSeed(
  chainName: string,
  copy: EconomyStatusCopy,
  status: ModuleAvailabilityStatus,
): ModuleStatusSeed {
  return {
    status,
    evidenceNote: `Seeded demo assessment: For ${chainName}, ${copy[status].evidence}`,
    rationale: copy[status].rationale,
  };
}

export function buildEconomySeedRecords(
  economyType: EconomyTypeSlug,
  matrix: EconomyStatusMatrix,
  copyByModule: Record<EconomyModuleSlug, EconomyStatusCopy>,
): ChainEconomySeedRecord[] {
  return chainCatalogSeeds.map((chain) => {
    const moduleMatrix = matrix[chain.slug];

    if (!moduleMatrix) {
      throw new Error(`Missing status matrix for ${economyType}:${chain.slug}`);
    }

    return {
      chainSlug: chain.slug,
      economyType,
      moduleStatuses: Object.fromEntries(
        Object.entries(moduleMatrix).map(([moduleSlug, status]) => [
          moduleSlug,
          createModuleStatusSeed(chain.name, copyByModule[moduleSlug]!, status),
        ]),
      ),
    };
  });
}
