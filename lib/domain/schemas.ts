import { z } from "zod";

import {
  defaultEconomySlug,
  getEconomyTypeBySlug,
  getRankingSortOptions,
} from "@/lib/config/economies";
import {
  chainCategories,
  chainRecordStatuses,
  chainSourceCategories,
  chainSourceMetrics,
  chainSourceProviders,
  economyTypeSlugs,
  moduleAvailabilityStatuses,
  rankingsSortDirections,
} from "@/lib/domain/types";
import type {
  AtlasSeedDataset,
  ChainCatalogSeed,
  ChainEconomySeedRecord,
  EconomyType,
  RankingsQuery,
  RankingsSortKey,
} from "@/lib/domain/types";

function addUniqueFieldIssue<Item>(
  collection: Item[],
  getValue: (item: Item) => string,
  pathKey: string,
  ctx: z.RefinementCtx,
  message: string,
) {
  const seen = new Map<string, number>();

  collection.forEach((item, index) => {
    const value = getValue(item);

    if (!value) {
      return;
    }

    if (seen.has(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${message}: "${value}"`,
        path: [index, pathKey],
      });
      return;
    }

    seen.set(value, index);
  });
}

const moduleStatusSeedSchema = z.object({
  status: z.enum(moduleAvailabilityStatuses),
  evidenceNote: z.string().min(1),
  rationale: z.string().min(1),
});

const chainCatalogSeedSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  sourceName: z.string().min(1),
  sourceRank: z.number().int().positive(),
  sourceGlobalRank: z.number().int().positive().optional(),
  sourceCategory: z.enum(chainSourceCategories),
  sourceMetric: z.enum(chainSourceMetrics),
  sourceProvider: z.enum(chainSourceProviders),
  sourceSnapshotDate: z.string().min(1),
  sourceTvlUsd: z.number().nonnegative(),
  category: z.enum(chainCategories),
  website: z.string().url().optional(),
  shortDescription: z.string().min(1),
  status: z.enum(chainRecordStatuses),
});

const chainCatalogSeedsSchema = z
  .array(chainCatalogSeedSchema)
  .min(1)
  .superRefine((chains, ctx) => {
    addUniqueFieldIssue(
      chains,
      (chain) => chain.id,
      "id",
      ctx,
      "Duplicate chain id",
    );
    addUniqueFieldIssue(
      chains,
      (chain) => chain.slug,
      "slug",
      ctx,
      "Duplicate chain slug",
    );
    addUniqueFieldIssue(
      chains,
      (chain) => chain.name,
      "name",
      ctx,
      "Duplicate chain name",
    );

    const sourceRanks = chains.map((chain) => chain.sourceRank).sort((a, b) => a - b);

    sourceRanks.forEach((rank, index) => {
      if (rank !== index + 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Source ranks must be sequential starting at 1. Received ${rank} at position ${index + 1}.`,
        });
      }
    });
  });

const economyModuleSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  weight: z.number().positive(),
});

const economyDeploymentTemplateSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  objective: z.string().min(1),
});

const economyRecommendationRuleSchema = z.object({
  deploymentPhaseKey: z.string().min(1),
  missingTitle: z.string().min(1),
  partialTitle: z.string().min(1),
  whyItMatters: z.string().min(1),
  missingResult: z.string().min(1),
  partialResult: z.string().min(1),
  missingChainImpact: z.string().min(1),
  partialChainImpact: z.string().min(1),
  missingSummary: z.string().min(1),
  partialSummary: z.string().min(1),
  gapImpact: z.object({
    missing: z.string().min(1),
    partial: z.string().min(1),
  }),
});

const economyTypeSchema = z
  .object({
    id: z.string().min(1),
    slug: z.enum(economyTypeSlugs),
    name: z.string().min(1),
    shortLabel: z.string().min(1),
    description: z.string().min(1),
    modules: z.array(economyModuleSchema).min(1),
    scoringConfig: z.object({
      maximumScore: z.number().positive(),
      statusScores: z.object({
        missing: z.number().min(0),
        partial: z.number().min(0),
        available: z.number().min(0),
      }),
    }),
    recommendationConfig: z.object({
      thresholdScore: z.number().min(0).max(1),
      includePartialRecommendations: z.boolean(),
      includeMissingRecommendations: z.boolean(),
    }),
    deploymentTemplates: z.array(economyDeploymentTemplateSchema).min(1),
    recommendationRules: z.record(
      z.string().min(1),
      economyRecommendationRuleSchema,
    ),
  })
  .superRefine((economy, ctx) => {
    addUniqueFieldIssue(
      economy.modules,
      (module) => module.id,
      "id",
      ctx,
      "Duplicate module id",
    );
    addUniqueFieldIssue(
      economy.modules,
      (module) => module.slug,
      "slug",
      ctx,
      "Duplicate module slug",
    );
    addUniqueFieldIssue(
      economy.deploymentTemplates,
      (template) => template.key,
      "key",
      ctx,
      "Duplicate deployment template key",
    );

    const totalWeight = economy.modules.reduce(
      (sum, module) => sum + module.weight,
      0,
    );

    if (totalWeight !== 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Module weights must sum to 100. Received ${totalWeight}.`,
      });
    }

    const {
      thresholdScore,
      includeMissingRecommendations,
      includePartialRecommendations,
    } = economy.recommendationConfig;

    if (!includeMissingRecommendations && thresholdScore <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Recommendation config must allow missing modules or raise the threshold above 0.",
        path: ["recommendationConfig", "includeMissingRecommendations"],
      });
    }

    if (
      thresholdScore >= 0.5 &&
      !includePartialRecommendations &&
      includeMissingRecommendations
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Thresholds that reach partial scores must enable partial recommendations.",
        path: ["recommendationConfig", "includePartialRecommendations"],
      });
    }

    const moduleSlugs = new Set(economy.modules.map((module) => module.slug));
    const recommendationSlugs = Object.keys(economy.recommendationRules);

    recommendationSlugs.forEach((moduleSlug) => {
      if (!moduleSlugs.has(moduleSlug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Recommendation rule "${moduleSlug}" does not match any module on ${economy.slug}.`,
          path: ["recommendationRules", moduleSlug],
        });
      }
    });

    economy.modules.forEach((module, index) => {
      if (!economy.recommendationRules[module.slug]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Missing recommendation rule for "${module.slug}" on ${economy.slug}.`,
          path: ["modules", index, "slug"],
        });
      }
    });

    const templateKeys = new Set(
      economy.deploymentTemplates.map((template) => template.key),
    );

    Object.entries(economy.recommendationRules).forEach(([moduleSlug, rule]) => {
      if (!templateKeys.has(rule.deploymentPhaseKey)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Recommendation rule "${moduleSlug}" references unknown deployment phase "${rule.deploymentPhaseKey}".`,
          path: ["recommendationRules", moduleSlug, "deploymentPhaseKey"],
        });
      }
    });
  });

const economyTypesSchema = z
  .array(economyTypeSchema)
  .min(1)
  .superRefine((economies, ctx) => {
    addUniqueFieldIssue(
      economies,
      (economy) => economy.id,
      "id",
      ctx,
      "Duplicate economy id",
    );
    addUniqueFieldIssue(
      economies,
      (economy) => economy.slug,
      "slug",
      ctx,
      "Duplicate economy slug",
    );
  });

const chainEconomySeedRecordSchema = z.object({
  chainSlug: z.string().min(1),
  economyType: z.enum(economyTypeSlugs),
  moduleStatuses: z.record(z.string().min(1), moduleStatusSeedSchema),
});

const chainEconomySeedRecordsSchema = z
  .array(chainEconomySeedRecordSchema)
  .min(1)
  .superRefine((records, ctx) => {
    addUniqueFieldIssue(
      records,
      (record) => `${record.chainSlug}:${record.economyType}`,
      "chainSlug",
      ctx,
      "Duplicate chain economy record",
    );
  });

const rankingsBaseSearchSchema = z.object({
  economy: z.enum(economyTypeSlugs).default(defaultEconomySlug),
  q: z.string().trim().default(""),
  category: z.union([z.literal("All"), z.enum(chainCategories)]).default("All"),
  direction: z.enum(rankingsSortDirections).default("desc"),
});

const economySelectionSchema = z.object({
  economy: z.enum(economyTypeSlugs).default(defaultEconomySlug),
});

type SearchParamValue = string | string[] | undefined;
type SearchParamRecord = Record<string, SearchParamValue> | undefined;

function firstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

function parseSortKey(
  value: SearchParamValue,
  economy: EconomyType,
): RankingsSortKey {
  const first = firstValue(value);
  const allowedSortKeys = new Set(
    getRankingSortOptions(economy).map((option) => option.value),
  );

  return allowedSortKeys.has(first as RankingsSortKey)
    ? (first as RankingsSortKey)
    : "totalScore";
}

export function parseChainCatalogSeeds(input: unknown): ChainCatalogSeed[] {
  return chainCatalogSeedsSchema.parse(input);
}

export function parseEconomyTypes(input: unknown): EconomyType[] {
  return economyTypesSchema.parse(input);
}

export function parseChainEconomySeedRecords(
  input: unknown,
): ChainEconomySeedRecord[] {
  return chainEconomySeedRecordsSchema.parse(input);
}

export function validateAtlasSeedDataset(
  input: AtlasSeedDataset,
): AtlasSeedDataset {
  const chains = parseChainCatalogSeeds(input.chains);
  const economies = parseEconomyTypes(input.economies);
  const records = parseChainEconomySeedRecords(input.records);

  const chainSlugs = new Set(chains.map((chain) => chain.slug));
  const economyBySlug = new Map(
    economies.map((economy) => [economy.slug, economy] as const),
  );
  const recordLookup = new Map(
    records.map((record) => [`${record.chainSlug}:${record.economyType}`, record]),
  );

  records.forEach((record, index) => {
    if (!chainSlugs.has(record.chainSlug)) {
      throw new Error(
        `Unknown chain slug "${record.chainSlug}" in record ${index + 1}.`,
      );
    }

    const economy = economyBySlug.get(record.economyType);

    if (!economy) {
      throw new Error(
        `Unknown economy slug "${record.economyType}" in record ${index + 1}.`,
      );
    }

    const moduleSlugs = economy.modules.map((module) => module.slug).sort();
    const recordModuleSlugs = Object.keys(record.moduleStatuses).sort();

    if (
      moduleSlugs.length !== recordModuleSlugs.length ||
      moduleSlugs.some((slug, moduleIndex) => slug !== recordModuleSlugs[moduleIndex])
    ) {
      throw new Error(
        `Module statuses for ${record.chainSlug}:${record.economyType} do not match the configured module catalog.`,
      );
    }
  });

  chains.forEach((chain) => {
    economies.forEach((economy) => {
      if (!recordLookup.has(`${chain.slug}:${economy.slug}`)) {
        throw new Error(
          `Missing seeded record for ${chain.slug}:${economy.slug}.`,
        );
      }
    });
  });

  return {
    chains,
    economies,
    records,
  };
}

export function parseEconomySelection(
  searchParams: SearchParamRecord,
) {
  const parsed = economySelectionSchema.parse({
    economy: firstValue(searchParams?.economy),
  });

  return parsed.economy;
}

export function parseRankingsQuery(
  searchParams: SearchParamRecord,
): RankingsQuery {
  const base = rankingsBaseSearchSchema.parse({
    economy: firstValue(searchParams?.economy),
    q: firstValue(searchParams?.q),
    category: firstValue(searchParams?.category),
    direction: firstValue(searchParams?.direction),
  });
  const economy = getEconomyTypeBySlug(base.economy);

  return {
    ...base,
    sort: parseSortKey(searchParams?.sort, economy),
  };
}
