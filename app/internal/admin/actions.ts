"use server";

import { redirect } from "next/navigation";

import { createAdminSession, clearAdminSession } from "@/lib/admin/auth";
import {
  updateEconomyAssumptions,
  updateGlobalRankingAssumptions,
  updateOpportunityScoringAssumptions,
  updateStatusScores,
} from "@/lib/assumptions/service";
import type { EconomyTypeSlug } from "@/lib/domain/types";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function asNumber(value: FormDataEntryValue | null) {
  return Number(asString(value));
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

export async function updateStatusScoresAction(formData: FormData) {
  try {
    updateStatusScores(
      {
        missing: asNumber(formData.get("missing")),
        partial: asNumber(formData.get("partial")),
        available: asNumber(formData.get("available")),
      },
      "internal-admin",
    );

    redirect("/internal/admin?saved=status-scores");
  } catch {
    redirect("/internal/admin?error=status-scores");
  }
}

export async function updateEconomyAssumptionsAction(formData: FormData) {
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

    updateEconomyAssumptions(
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
    );

    redirect(`/internal/admin?saved=${economySlug}`);
  } catch {
    redirect(`/internal/admin?error=${economySlug}`);
  }
}

export async function updateGlobalRankingAssumptionsAction(formData: FormData) {
  try {
    updateGlobalRankingAssumptions(
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

    redirect("/internal/admin?saved=global-ranking");
  } catch {
    redirect("/internal/admin?error=global-ranking");
  }
}

export async function updateOpportunityScoringAssumptionsAction(
  formData: FormData,
) {
  try {
    updateOpportunityScoringAssumptions(
      {
        tvlTier: asNumber(formData.get("tvlTier")),
        readinessGap: asNumber(formData.get("readinessGap")),
        stackFit: asNumber(formData.get("stackFit")),
        ecosystemSignal: asNumber(formData.get("ecosystemSignal")),
      },
      "internal-admin",
    );

    redirect("/internal/admin?saved=opportunity-scoring");
  } catch {
    redirect("/internal/admin?error=opportunity-scoring");
  }
}
