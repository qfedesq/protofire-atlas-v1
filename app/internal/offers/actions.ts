"use server";

import { redirect } from "next/navigation";

import {
  buildInternalLoginHref,
  getAuthenticatedInternalUser,
} from "@/lib/admin/auth";
import { listAllEconomyTypes } from "@/lib/config/economies";
import type { EconomyTypeSlug } from "@/lib/domain/types";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";
import { upsertOfferOverride } from "@/lib/offers/store";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function parseEconomySlugs(value: string) {
  const allowed = new Set(listAllEconomyTypes().map((economy) => economy.slug));

  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is EconomyTypeSlug => allowed.has(item as EconomyTypeSlug));
}

export async function updateOfferOverrideAction(formData: FormData) {
  await ensureAtlasPersistence();
  const internalUser = await getAuthenticatedInternalUser();
  const redirectTo = "/internal/offers";

  if (!internalUser) {
    redirect(buildInternalLoginHref(redirectTo));
  }

  const offerId = asString(formData.get("offerId"));

  if (!offerId) {
    redirect(`${redirectTo}?error=offer`);
  }

  await upsertOfferOverride({
    offerId,
    isActive: formData.get("isActive") === "on",
    applicableWedges: parseEconomySlugs(asString(formData.get("applicableWedges"))),
    targetPersonas: asString(formData.get("targetPersonas"))
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    updatedAt: new Date().toISOString(),
    updatedBy: internalUser.email ?? internalUser.subject,
  });

  redirect(`${redirectTo}?saved=offer`);
}
