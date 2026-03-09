"use server";

import { redirect } from "next/navigation";

import { createAdminSession, clearAdminSession } from "@/lib/admin/auth";
import {
  manualDatasetKeys,
  resetManualDatasetOverride,
  saveManualDatasetOverride,
} from "@/lib/admin/manual-data";
import { runAtlasSyncNow } from "@/lib/admin/sync";
import {
  updateEconomyAssumptions,
  updateGlobalRankingAssumptions,
  updateGlobalRankingSubweights,
  updateAnalysisSettings,
  updateOpportunityScoringAssumptions,
  updateOpportunityScoringAdvancedAssumptions,
  updateStatusScores,
  updateWedgeApplicabilityAssumptions,
} from "@/lib/assumptions/service";
import type { EconomyTypeSlug } from "@/lib/domain/types";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function asNumber(value: FormDataEntryValue | null) {
  return Number(asString(value));
}

function asRedirectPath(value: FormDataEntryValue | null) {
  const redirectTo = asString(value);

  return redirectTo.startsWith("/internal/admin")
    ? redirectTo
    : "/internal/admin";
}

function getDatasetKey(value: FormDataEntryValue | null) {
  const key = asString(value);

  if (!manualDatasetKeys.includes(key as (typeof manualDatasetKeys)[number])) {
    throw new Error(`Unknown manual dataset "${key}".`);
  }

  return key as (typeof manualDatasetKeys)[number];
}

export async function loginAdminAction(formData: FormData) {
  const password = asString(formData.get("password"));
  const authenticated = await createAdminSession(password);

  redirect(authenticated ? "/internal/admin?auth=success" : "/internal/admin?auth=error");
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/internal/admin");
}

export async function syncAtlasDataNowAction() {
  const redirectTo = "/internal/admin";
  try {
    await runAtlasSyncNow();
    redirect(`${redirectTo}?saved=sync-now`);
  } catch {
    redirect(`${redirectTo}?error=sync-now`);
  }
}

export async function syncAtlasDataNowRedirectableAction(formData: FormData) {
  const redirectTo = asRedirectPath(formData.get("redirectTo"));
  try {
    await runAtlasSyncNow();
    redirect(`${redirectTo}?saved=sync-now`);
  } catch {
    redirect(`${redirectTo}?error=sync-now`);
  }
}

export async function updateStatusScoresAction(formData: FormData) {
  const redirectTo = asRedirectPath(formData.get("redirectTo"));
  try {
    await updateStatusScores(
      {
        missing: asNumber(formData.get("missing")),
        partial: asNumber(formData.get("partial")),
        available: asNumber(formData.get("available")),
      },
      "internal-admin",
    );

    redirect(`${redirectTo}?saved=status-scores`);
  } catch {
    redirect(`${redirectTo}?error=status-scores`);
  }
}

export async function updateEconomyAssumptionsAction(formData: FormData) {
  const redirectTo = asRedirectPath(formData.get("redirectTo"));
  const economySlug = asString(formData.get("economy")) as EconomyTypeSlug;
  const moduleWeights = JSON.parse(asString(formData.get("moduleWeights"))) as Record<
    string,
    number
  >;
  const moduleDiagnosticWeights = JSON.parse(
    asString(formData.get("moduleDiagnosticWeights")) || "{}",
  ) as Record<string, Record<string, number>>;

  try {
    Object.keys(moduleWeights).forEach((moduleSlug) => {
      moduleWeights[moduleSlug] = asNumber(formData.get(`weight:${moduleSlug}`));
    });

    Object.entries(moduleDiagnosticWeights).forEach(([moduleSlug, weights]) => {
      Object.keys(weights).forEach((dimensionSlug) => {
        weights[dimensionSlug] = asNumber(
          formData.get(`diagnostic-weight:${moduleSlug}:${dimensionSlug}`),
        );
      });
    });

    await updateEconomyAssumptions(
      economySlug,
      moduleWeights,
      {
        thresholdScore: asNumber(formData.get("thresholdScore")),
        includePartialRecommendations:
          formData.get("includePartialRecommendations") === "on",
        includeMissingRecommendations:
          formData.get("includeMissingRecommendations") === "on",
      },
      moduleDiagnosticWeights,
      "internal-admin",
      asNumber(formData.get("maximumScore")),
    );

    redirect(`${redirectTo}?saved=${economySlug}`);
  } catch {
    redirect(`${redirectTo}?error=${economySlug}`);
  }
}

export async function updateGlobalRankingAssumptionsAction(formData: FormData) {
  const redirectTo = asRedirectPath(formData.get("redirectTo"));
  try {
    await updateGlobalRankingAssumptions(
      {
        economyScore: asNumber(formData.get("economyScoreWeight")),
        ecosystem: asNumber(formData.get("ecosystemWeight")),
        adoption: asNumber(formData.get("adoptionWeight")),
        performance: asNumber(formData.get("performanceWeight")),
      },
      {
        "ai-agents": asNumber(formData.get("ai-agents")),
        "defi-infrastructure": asNumber(formData.get("defi-infrastructure")),
        "rwa-infrastructure": asNumber(formData.get("rwa-infrastructure")),
        "prediction-markets": asNumber(formData.get("prediction-markets")),
      },
      "internal-admin",
    );

    redirect(`${redirectTo}?saved=global-ranking`);
  } catch {
    redirect(`${redirectTo}?error=global-ranking`);
  }
}

export async function updateOpportunityScoringAssumptionsAction(
  formData: FormData,
) {
  const redirectTo = asRedirectPath(formData.get("redirectTo"));
  try {
    await updateOpportunityScoringAssumptions(
      {
        tvlTier: asNumber(formData.get("tvlTier")),
        readinessGap: asNumber(formData.get("readinessGap")),
        stackFit: asNumber(formData.get("stackFit")),
        ecosystemSignal: asNumber(formData.get("ecosystemSignal")),
      },
      "internal-admin",
    );

    redirect(`${redirectTo}?saved=opportunity-scoring`);
  } catch {
    redirect(`${redirectTo}?error=opportunity-scoring`);
  }
}

export async function updateGlobalRankingSubweightsAction(formData: FormData) {
  const redirectTo = asRedirectPath(formData.get("redirectTo"));
  try {
    await updateGlobalRankingSubweights(
      {
        protocols: asNumber(formData.get("ecosystem:protocols")),
        ecosystemProjects: asNumber(formData.get("ecosystem:ecosystemProjects")),
      },
      {
        wallets: asNumber(formData.get("adoption:wallets")),
        activeUsers: asNumber(formData.get("adoption:activeUsers")),
      },
      {
        averageTransactionSpeed: asNumber(
          formData.get("performance:averageTransactionSpeed"),
        ),
        blockTime: asNumber(formData.get("performance:blockTime")),
        throughputIndicator: asNumber(
          formData.get("performance:throughputIndicator"),
        ),
      },
      "internal-admin",
    );

    redirect(`${redirectTo}?saved=global-ranking-subweights`);
  } catch {
    redirect(`${redirectTo}?error=global-ranking-subweights`);
  }
}

export async function updateOpportunityScoringAdvancedAssumptionsAction(
  formData: FormData,
) {
  const redirectTo = asRedirectPath(formData.get("redirectTo"));
  try {
    await updateOpportunityScoringAdvancedAssumptions(
      {
        liftRatio: asNumber(formData.get("stackFit:liftRatio")),
        coverageRatio: asNumber(formData.get("stackFit:coverageRatio")),
      },
      {
        high: asNumber(formData.get("priority:high")),
        medium: asNumber(formData.get("priority:medium")),
      },
      "internal-admin",
    );

    redirect(`${redirectTo}?saved=opportunity-advanced`);
  } catch {
    redirect(`${redirectTo}?error=opportunity-advanced`);
  }
}

export async function updateWedgeApplicabilityAssumptionsAction(
  formData: FormData,
) {
  const redirectTo = asRedirectPath(formData.get("redirectTo"));

  try {
    const wedgeApplicability = JSON.parse(
      asString(formData.get("wedgeApplicability")),
    );
    wedgeApplicability.signalScores = {
      supported: asNumber(formData.get("signal:supported")),
      limited: asNumber(formData.get("signal:limited")),
      unsupported: asNumber(formData.get("signal:unsupported")),
      unknown: asNumber(formData.get("signal:unknown")),
    };
    wedgeApplicability.thresholds = {
      applicableMinimum: asNumber(formData.get("threshold:applicableMinimum")),
      partialMinimum: asNumber(formData.get("threshold:partialMinimum")),
    };
    wedgeApplicability.confidence = {
      minimumConfidenceForDefinitiveStatus: asString(
        formData.get("confidence:minimumConfidenceForDefinitiveStatus"),
      ),
      unknownWhenRequiredCapabilityIsUnknown:
        formData.get("confidence:unknownWhenRequiredCapabilityIsUnknown") === "on",
      manualReviewBelowScore: asNumber(
        formData.get("confidence:manualReviewBelowScore"),
      ),
    };
    wedgeApplicability.wedgeCapabilityWeights = JSON.parse(
      asString(formData.get("wedgeCapabilityWeights")),
    );
    wedgeApplicability.wedgePrerequisites = JSON.parse(
      asString(formData.get("wedgePrerequisites")),
    );

    await updateWedgeApplicabilityAssumptions(
      wedgeApplicability,
      "internal-admin",
    );

    redirect(`${redirectTo}?saved=wedge-applicability`);
  } catch {
    redirect(`${redirectTo}?error=wedge-applicability`);
  }
}

export async function updateAnalysisSettingsAction(formData: FormData) {
  const redirectTo = asRedirectPath(formData.get("redirectTo"));

  try {
    await updateAnalysisSettings(
      {
        modelName: asString(formData.get("modelName")),
        promptTemplateKey: asString(formData.get("promptTemplateKey")),
        sensitivity: asNumber(formData.get("sensitivity")),
        opportunityThreshold: asNumber(formData.get("opportunityThreshold")),
        manualReviewThreshold: asNumber(formData.get("manualReviewThreshold")),
        useMockWhenUnavailable:
          formData.get("useMockWhenUnavailable") === "on",
      },
      "internal-admin",
    );

    redirect(`${redirectTo}?saved=analysis-settings`);
  } catch {
    redirect(`${redirectTo}?error=analysis-settings`);
  }
}

export async function updateManualDatasetAction(formData: FormData) {
  const redirectTo = asRedirectPath(formData.get("redirectTo"));

  try {
    const dataset = getDatasetKey(formData.get("dataset"));
    const payload = JSON.parse(asString(formData.get("payload")));

    await saveManualDatasetOverride(dataset, payload, "internal-admin");
    redirect(`${redirectTo}?saved=manual-dataset:${dataset}`);
  } catch {
    redirect(`${redirectTo}?error=manual-dataset:${asString(formData.get("dataset"))}`);
  }
}

export async function resetManualDatasetAction(formData: FormData) {
  const redirectTo = asRedirectPath(formData.get("redirectTo"));

  try {
    const dataset = getDatasetKey(formData.get("dataset"));

    await resetManualDatasetOverride(dataset);
    redirect(`${redirectTo}?saved=manual-reset:${dataset}`);
  } catch {
    redirect(`${redirectTo}?error=manual-reset:${asString(formData.get("dataset"))}`);
  }
}
