import { z } from "zod";

import type { ActiveAssumptions } from "@/lib/assumptions/types";
import { economyTypes } from "@/lib/config/economies";
import { liquidStakingDiagnosticDimensions } from "@/lib/config/liquid-staking-diagnosis";
import { economyTypeSlugs, moduleAvailabilityStatuses } from "@/lib/domain/types";

const recommendationConfigSchema = z.object({
  thresholdScore: z.number().min(0).max(1),
  includePartialRecommendations: z.boolean(),
  includeMissingRecommendations: z.boolean(),
});

const activeAssumptionsSchema = z.object({
  updatedAt: z.string().min(1),
  updatedBy: z.string().min(1),
  statusScores: z.object({
    missing: z.number().min(0).max(1),
    partial: z.number().min(0).max(1),
    available: z.number().min(0).max(1),
  }),
  economies: z.record(
    z.enum(economyTypeSlugs),
    z.object({
      moduleWeights: z.record(z.string().min(1), z.number().min(0)),
      moduleDiagnosticWeights: z
        .record(z.string().min(1), z.record(z.string().min(1), z.number().min(0)))
        .default({}),
      recommendationConfig: recommendationConfigSchema,
    }),
  ),
});

function assertOrderedStatusScores(statusScores: ActiveAssumptions["statusScores"]) {
  if (
    !(
      statusScores.missing <= statusScores.partial &&
      statusScores.partial <= statusScores.available
    )
  ) {
    throw new Error(
      "Status scores must remain ordered as missing <= partial <= available.",
    );
  }
}

export function validateActiveAssumptions(
  input: unknown,
): ActiveAssumptions {
  const parsed = activeAssumptionsSchema.parse(input);

  assertOrderedStatusScores(parsed.statusScores);

  economyTypes.forEach((economy) => {
    const configured = parsed.economies[economy.slug];

    if (!configured) {
      throw new Error(`Missing active assumptions for ${economy.slug}.`);
    }

    const moduleSlugs = economy.modules.map((module) => module.slug).sort();
    const configuredSlugs = Object.keys(configured.moduleWeights).sort();

    if (
      moduleSlugs.length !== configuredSlugs.length ||
      moduleSlugs.some((slug, index) => slug !== configuredSlugs[index])
    ) {
      throw new Error(
        `Module weight set for ${economy.slug} does not match the configured module catalog.`,
      );
    }

    const totalWeight = Object.values(configured.moduleWeights).reduce(
      (total, weight) => total + weight,
      0,
    );

    if (totalWeight !== 100) {
      throw new Error(
        `Module weights for ${economy.slug} must sum to 100. Received ${totalWeight}.`,
      );
    }

    if (economy.slug === "defi-infrastructure") {
      const configuredDiagnostics =
        configured.moduleDiagnosticWeights?.["liquid-staking"];
      const diagnosticSlugs = liquidStakingDiagnosticDimensions.map(
        (dimension) => dimension.slug,
      );

      if (!configuredDiagnostics) {
        throw new Error(
          "Liquid staking diagnostic weights must be configured for defi-infrastructure.",
        );
      }

      const configuredDiagnosticSlugs = Object.keys(configuredDiagnostics).sort();
      const expectedDiagnosticSlugs = [...diagnosticSlugs].sort();

      if (
        configuredDiagnosticSlugs.length !== expectedDiagnosticSlugs.length ||
        configuredDiagnosticSlugs.some(
          (slug, index) => slug !== expectedDiagnosticSlugs[index],
        )
      ) {
        throw new Error(
          "Liquid staking diagnostic weights do not match the configured 7-module diagnosis catalog.",
        );
      }

      const diagnosticWeightTotal = Object.values(configuredDiagnostics).reduce(
        (total, weight) => total + weight,
        0,
      );

      if (diagnosticWeightTotal !== 100) {
        throw new Error(
          `Liquid staking diagnostic weights must sum to 100. Received ${diagnosticWeightTotal}.`,
        );
      }
    }

    const statusThresholds = configured.recommendationConfig;
    const partialScore = parsed.statusScores.partial;
    const missingScore = parsed.statusScores.missing;

    if (
      statusThresholds.thresholdScore >= partialScore &&
      !statusThresholds.includePartialRecommendations
    ) {
      throw new Error(
        `${economy.slug} recommendation threshold reaches partial scores, but partial recommendations are disabled.`,
      );
    }

    if (
      statusThresholds.thresholdScore >= missingScore &&
      !statusThresholds.includeMissingRecommendations
    ) {
      throw new Error(
        `${economy.slug} recommendation threshold reaches missing scores, but missing recommendations are disabled.`,
      );
    }
  });

  return parsed;
}

export function validateStatusScoreKey(key: string) {
  if (!moduleAvailabilityStatuses.includes(key as (typeof moduleAvailabilityStatuses)[number])) {
    throw new Error(`Unknown status score key "${key}".`);
  }

  return key as keyof ActiveAssumptions["statusScores"];
}
