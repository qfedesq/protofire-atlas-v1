import { chainSeedRecords } from "@/data/seed/chains";
import type { ChainEconomySeedRecord } from "@/lib/domain/types";

export const aiAgentEconomySeedRecords: ChainEconomySeedRecord[] =
  chainSeedRecords.map((chain) => ({
    chainSlug: chain.slug,
    economyType: "ai-agents",
    moduleStatuses: chain.modules,
  }));
