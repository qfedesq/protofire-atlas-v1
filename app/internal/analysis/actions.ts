"use server";

import { redirect } from "next/navigation";

import {
  buildInternalLoginHref,
  getAuthenticatedInternalUser,
} from "@/lib/admin/auth";
import { runChainTechnicalAnalysis } from "@/lib/analysis/service";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function runChainTechnicalAnalysisAction(formData: FormData) {
  await ensureAtlasPersistence();

  const chainSlug = asString(formData.get("chainSlug"));
  const returnTo = asString(formData.get("returnTo")) || `/chains/${chainSlug}`;
  const internalUser = await getAuthenticatedInternalUser();

  if (!internalUser) {
    redirect(buildInternalLoginHref(returnTo));
  }

  if (!chainSlug) {
    redirect(`${returnTo}?analysis=error`);
  }

  const analysis = await runChainTechnicalAnalysis({
    chainSlug,
    triggeredBy: internalUser.email ?? internalUser.subject,
  });

  redirect(`/internal/analysis/${analysis.id}`);
}
