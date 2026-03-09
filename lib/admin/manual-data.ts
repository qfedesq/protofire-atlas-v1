import { chainCatalogSeeds } from "@/data/seed/catalog";
import { chainCapabilityProfileSeeds } from "@/data/seed/chain-capability-profiles";
import { chainEcosystemMetricsSeeds } from "@/data/seed/chain-ecosystem-metrics";
import { chainRoadmapSeeds } from "@/data/seed/chain-roadmaps";
import { chainEconomySeedRecords } from "@/data/seed/economies";
import { chainTechnicalProfileSeeds } from "@/data/seed/chain-technical-profiles";
import { liquidStakingMarketSnapshotSeeds } from "@/data/seed/liquid-staking-market-snapshots";
import { listActiveEconomyTypes } from "@/lib/assumptions/resolve";
import { listAllEconomyTypes } from "@/lib/config/economies";
import {
  parseChainEcosystemMetricsSeeds,
  parseChainRoadmapSeeds,
  parseChainEconomySeedRecords,
  parseChainCapabilityProfileSeeds,
  parseChainTechnicalProfileSeeds,
  parseLiquidStakingMarketSnapshotSeeds,
  validateAtlasSeedDataset,
  validateChainCapabilityProfileSeeds,
  validateChainEcosystemMetricsSeeds,
  validateChainRoadmapSeeds,
  validateChainTechnicalProfileSeeds,
  validateLiquidStakingMarketSnapshotSeeds,
} from "@/lib/domain/schemas";
import type {
  ChainCapabilityProfileSeed,
  ChainEcosystemMetricsSeed,
  ChainEconomySeedRecord,
  ChainRoadmapSeed,
  ChainTechnicalProfileSeed,
  LiquidStakingMarketSnapshotSeed,
} from "@/lib/domain/types";
import { createPersistentJsonStore } from "@/lib/storage/persistent-json-store";
import { getRuntimeManagedFilePath } from "@/lib/storage/runtime-path";

export const manualDatasetKeys = [
  "readinessRecords",
  "capabilityProfiles",
  "technicalProfiles",
  "roadmaps",
  "ecosystemMetricSeeds",
  "liquidStakingMarketSnapshots",
] as const;

export type ManualDatasetKey = (typeof manualDatasetKeys)[number];

type ManualDatasetValueMap = {
  readinessRecords: ChainEconomySeedRecord[];
  capabilityProfiles: ChainCapabilityProfileSeed[];
  technicalProfiles: ChainTechnicalProfileSeed[];
  roadmaps: ChainRoadmapSeed[];
  ecosystemMetricSeeds: ChainEcosystemMetricsSeed[];
  liquidStakingMarketSnapshots: LiquidStakingMarketSnapshotSeed[];
};

type ManualDatasetOverride<Key extends ManualDatasetKey> = {
  updatedAt: string;
  updatedBy: string;
  value: ManualDatasetValueMap[Key];
};

export type ManualDataOverrides = {
  readinessRecords?: ManualDatasetOverride<"readinessRecords">;
  capabilityProfiles?: ManualDatasetOverride<"capabilityProfiles">;
  technicalProfiles?: ManualDatasetOverride<"technicalProfiles">;
  roadmaps?: ManualDatasetOverride<"roadmaps">;
  ecosystemMetricSeeds?: ManualDatasetOverride<"ecosystemMetricSeeds">;
  liquidStakingMarketSnapshots?: ManualDatasetOverride<"liquidStakingMarketSnapshots">;
};

const manualDataOverridesFallback: ManualDataOverrides = {};

function getManualDataOverridesPath() {
  return getRuntimeManagedFilePath(
    "ATLAS_MANUAL_DATA_FILE",
    "data/admin/manual-data-overrides.json",
  );
}

function parseManualDataOverrides(input: unknown): ManualDataOverrides {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return manualDataOverridesFallback;
  }

  const record = input as Record<string, unknown>;
  const parsed: ManualDataOverrides = {};

  if (record.readinessRecords && typeof record.readinessRecords === "object") {
    const entry = record.readinessRecords as Record<string, unknown>;
    parsed.readinessRecords = {
      updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : "",
      updatedBy: typeof entry.updatedBy === "string" ? entry.updatedBy : "",
      value: parseChainEconomySeedRecords(entry.value),
    };
  }

  if (record.capabilityProfiles && typeof record.capabilityProfiles === "object") {
    const entry = record.capabilityProfiles as Record<string, unknown>;
    parsed.capabilityProfiles = {
      updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : "",
      updatedBy: typeof entry.updatedBy === "string" ? entry.updatedBy : "",
      value: parseChainCapabilityProfileSeeds(entry.value),
    };
  }

  if (record.roadmaps && typeof record.roadmaps === "object") {
    const entry = record.roadmaps as Record<string, unknown>;
    parsed.roadmaps = {
      updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : "",
      updatedBy: typeof entry.updatedBy === "string" ? entry.updatedBy : "",
      value: parseChainRoadmapSeeds(entry.value),
    };
  }

  if (record.technicalProfiles && typeof record.technicalProfiles === "object") {
    const entry = record.technicalProfiles as Record<string, unknown>;
    parsed.technicalProfiles = {
      updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : "",
      updatedBy: typeof entry.updatedBy === "string" ? entry.updatedBy : "",
      value: parseChainTechnicalProfileSeeds(entry.value),
    };
  }

  if (
    record.ecosystemMetricSeeds &&
    typeof record.ecosystemMetricSeeds === "object"
  ) {
    const entry = record.ecosystemMetricSeeds as Record<string, unknown>;
    parsed.ecosystemMetricSeeds = {
      updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : "",
      updatedBy: typeof entry.updatedBy === "string" ? entry.updatedBy : "",
      value: parseChainEcosystemMetricsSeeds(entry.value),
    };
  }

  if (
    record.liquidStakingMarketSnapshots &&
    typeof record.liquidStakingMarketSnapshots === "object"
  ) {
    const entry = record.liquidStakingMarketSnapshots as Record<string, unknown>;
    parsed.liquidStakingMarketSnapshots = {
      updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : "",
      updatedBy: typeof entry.updatedBy === "string" ? entry.updatedBy : "",
      value: parseLiquidStakingMarketSnapshotSeeds(entry.value),
    };
  }

  return parsed;
}

function getValidatedDatasetValue<Key extends ManualDatasetKey>(
  key: Key,
  value: ManualDatasetValueMap[Key],
) {
  switch (key) {
    case "readinessRecords":
      return validateAtlasSeedDataset({
        chains: chainCatalogSeeds,
        economies: listAllEconomyTypes(),
        records: value as ChainEconomySeedRecord[],
      }).records as ManualDatasetValueMap[Key];
    case "roadmaps":
      return validateChainRoadmapSeeds(
        chainCatalogSeeds,
        value as ChainRoadmapSeed[],
      ) as ManualDatasetValueMap[Key];
    case "capabilityProfiles":
      return validateChainCapabilityProfileSeeds(
        chainCatalogSeeds,
        value as ChainCapabilityProfileSeed[],
      ) as ManualDatasetValueMap[Key];
    case "technicalProfiles":
      return validateChainTechnicalProfileSeeds(
        chainCatalogSeeds,
        value as ChainTechnicalProfileSeed[],
      ) as ManualDatasetValueMap[Key];
    case "ecosystemMetricSeeds":
      return validateChainEcosystemMetricsSeeds(
        chainCatalogSeeds,
        value as ChainEcosystemMetricsSeed[],
      ) as ManualDatasetValueMap[Key];
    case "liquidStakingMarketSnapshots":
      return validateLiquidStakingMarketSnapshotSeeds(
        chainCatalogSeeds,
        value as LiquidStakingMarketSnapshotSeed[],
      ) as ManualDatasetValueMap[Key];
    default:
      throw new Error(`Unsupported manual dataset key "${key}".`);
  }
}

const manualDataOverridesStore = createPersistentJsonStore<ManualDataOverrides>({
  key: "manual-data-overrides",
  getFilePath: getManualDataOverridesPath,
  fallback: manualDataOverridesFallback,
  validate: parseManualDataOverrides,
});

export async function initializeManualDataOverridesStore() {
  return manualDataOverridesStore.initialize();
}

export function getManualDataOverrides() {
  return manualDataOverridesStore.getSnapshot();
}

export async function saveManualDatasetOverride<Key extends ManualDatasetKey>(
  key: Key,
  value: ManualDatasetValueMap[Key],
  updatedBy: string,
) {
  await initializeManualDataOverridesStore();
  const current = getManualDataOverrides();
  const nextValue = getValidatedDatasetValue(key, value);
  const nextOverrides: ManualDataOverrides = {
    ...current,
    [key]: {
      updatedAt: new Date().toISOString(),
      updatedBy,
      value: nextValue,
    },
  };

  return manualDataOverridesStore.save(nextOverrides);
}

export async function resetManualDatasetOverride(key: ManualDatasetKey) {
  await initializeManualDataOverridesStore();
  const current = getManualDataOverrides();
  const nextOverrides = { ...current };

  delete nextOverrides[key];

  return manualDataOverridesStore.save(nextOverrides);
}

export function getResolvedChainEconomySeedRecords() {
  const activeEconomySlugs = new Set(listActiveEconomyTypes().map((economy) => economy.slug));

  return (
    getManualDataOverrides().readinessRecords?.value ?? chainEconomySeedRecords
  ).filter((record) => activeEconomySlugs.has(record.economyType));
}

export function getResolvedChainCapabilityProfileSeeds() {
  return (
    getManualDataOverrides().capabilityProfiles?.value ?? chainCapabilityProfileSeeds
  );
}

export function getResolvedChainRoadmapSeeds() {
  return getManualDataOverrides().roadmaps?.value ?? chainRoadmapSeeds;
}

export function getResolvedChainRoadmapSeedsBySlug() {
  return new Map(
    getResolvedChainRoadmapSeeds().map((seed) => [seed.chainSlug, seed] as const),
  );
}

export function getResolvedChainTechnicalProfileSeeds() {
  return (
    getManualDataOverrides().technicalProfiles?.value ?? chainTechnicalProfileSeeds
  );
}

export function getResolvedChainEcosystemMetricsSeeds() {
  return (
    getManualDataOverrides().ecosystemMetricSeeds?.value ??
    chainEcosystemMetricsSeeds
  );
}

export function getResolvedLiquidStakingMarketSnapshotSeeds() {
  return (
    getManualDataOverrides().liquidStakingMarketSnapshots?.value ??
    liquidStakingMarketSnapshotSeeds
  );
}
