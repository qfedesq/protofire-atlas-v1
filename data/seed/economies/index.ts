import { aiAgentEconomySeedRecords } from "@/data/seed/economies/ai-agents";
import { defiEconomySeedRecords } from "@/data/seed/economies/defi-infrastructure";
import { predictionEconomySeedRecords } from "@/data/seed/economies/prediction-markets";
import { rwaEconomySeedRecords } from "@/data/seed/economies/rwa-infrastructure";
import type { ChainEconomySeedRecord } from "@/lib/domain/types";

export const chainEconomySeedRecords: ChainEconomySeedRecord[] = [
  ...aiAgentEconomySeedRecords,
  ...defiEconomySeedRecords,
  ...rwaEconomySeedRecords,
  ...predictionEconomySeedRecords,
];
