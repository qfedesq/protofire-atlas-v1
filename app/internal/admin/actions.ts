"use server";

import { redirect } from "next/navigation";

import { createAdminSession, clearAdminSession } from "@/lib/admin/auth";
import { updateEconomyAssumptions, updateStatusScores } from "@/lib/assumptions/service";
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

  try {
    Object.keys(moduleWeights).forEach((moduleSlug) => {
      moduleWeights[moduleSlug] = asNumber(formData.get(`weight:${moduleSlug}`));
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
      "internal-admin",
    );

    redirect(`/internal/admin?saved=${economySlug}`);
  } catch {
    redirect(`/internal/admin?error=${economySlug}`);
  }
}
