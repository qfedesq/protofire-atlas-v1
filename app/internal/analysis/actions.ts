"use server";

import { redirect } from "next/navigation";

import {
  buildInternalLoginHref,
  getAuthenticatedInternalUser,
} from "@/lib/admin/auth";
import { runChainTechnicalAnalysis } from "@/lib/analysis/service";
import { createBuyerPersona } from "@/lib/personas/service";
import { getBuyerPersonaById } from "@/lib/personas/store";
import { generateProposalsForPersona } from "@/lib/proposals/engine";
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

export async function createBuyerPersonaAction(formData: FormData) {
  await ensureAtlasPersistence();

  const chainSlug = asString(formData.get("chainSlug"));
  const returnTo = asString(formData.get("returnTo")) || `/chains/${chainSlug}`;
  const internalUser = await getAuthenticatedInternalUser();

  if (!internalUser) {
    redirect(buildInternalLoginHref(returnTo));
  }

  const chainUrl = asString(formData.get("chainUrl"));
  const personName = asString(formData.get("personName"));
  const personTitle = asString(formData.get("personTitle"));

  if (!chainSlug || !chainUrl || !personName || !personTitle) {
    redirect(`${returnTo}?persona=error`);
  }

  await createBuyerPersona(
    {
      chainSlug,
      chainUrl,
      protocolUrl: asString(formData.get("protocolUrl")) || undefined,
      personName,
      personTitle,
      linkedinProfile: asString(formData.get("linkedinProfile")) || undefined,
      twitterHandle: asString(formData.get("twitterHandle")) || undefined,
      githubProfile: asString(formData.get("githubProfile")) || undefined,
    },
    internalUser.email ?? internalUser.subject,
  );

  redirect(`${returnTo}?persona=success#internal-appendix`);
}

export async function generateChainProposalsAction(formData: FormData) {
  await ensureAtlasPersistence();

  const chainSlug = asString(formData.get("chainSlug"));
  const returnTo = asString(formData.get("returnTo")) || `/chains/${chainSlug}`;
  const personaId = asString(formData.get("personaId"));
  const internalUser = await getAuthenticatedInternalUser();

  if (!internalUser) {
    redirect(buildInternalLoginHref(returnTo));
  }

  const persona = getBuyerPersonaById(personaId);

  if (!chainSlug || !persona || persona.chainSlug !== chainSlug) {
    redirect(`${returnTo}?proposal=error#internal-appendix`);
  }

  await generateProposalsForPersona(
    chainSlug,
    persona,
    internalUser.email ?? internalUser.subject,
  );

  redirect(`${returnTo}?proposal=success#internal-appendix`);
}
