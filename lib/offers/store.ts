import type { EconomyTypeSlug } from "@/lib/domain/types";
import { createPersistentJsonStore } from "@/lib/storage/persistent-json-store";
import { getRuntimeManagedFilePath } from "@/lib/storage/runtime-path";

export type OfferOverrideRecord = {
  offerId: string;
  isActive: boolean;
  applicableWedges?: EconomyTypeSlug[];
  targetPersonas?: string[];
  updatedAt: string;
  updatedBy: string;
};

function getOfferOverridesFilePath() {
  return getRuntimeManagedFilePath(
    "ATLAS_OFFER_OVERRIDES_FILE",
    "data/runtime/offer-overrides.json",
  );
}

function validateOfferOverrides(input: unknown) {
  if (!Array.isArray(input)) {
    return [] as OfferOverrideRecord[];
  }

  return input.flatMap((item) => {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return [];
    }

    const record = item as Record<string, unknown>;
    const offerId = typeof record.offerId === "string" ? record.offerId : "";
    const updatedAt =
      typeof record.updatedAt === "string" ? record.updatedAt : new Date(0).toISOString();
    const updatedBy = typeof record.updatedBy === "string" ? record.updatedBy : "unknown";

    if (!offerId) {
      return [];
    }

    return [
      {
        offerId,
        isActive:
          typeof record.isActive === "boolean" ? record.isActive : true,
        applicableWedges: Array.isArray(record.applicableWedges)
          ? record.applicableWedges.filter(
              (value): value is EconomyTypeSlug => typeof value === "string",
            )
          : undefined,
        targetPersonas: Array.isArray(record.targetPersonas)
          ? record.targetPersonas.filter(
              (value): value is string => typeof value === "string" && value.length > 0,
            )
          : undefined,
        updatedAt,
        updatedBy,
      } satisfies OfferOverrideRecord,
    ];
  });
}

const offerOverridesStore = createPersistentJsonStore<OfferOverrideRecord[]>({
  key: "offer-overrides",
  getFilePath: getOfferOverridesFilePath,
  fallback: [],
  validate: validateOfferOverrides,
});

export async function initializeOfferOverridesStore() {
  return offerOverridesStore.initialize();
}

export function listOfferOverrides() {
  return offerOverridesStore.getSnapshot();
}

export function getOfferOverrideById(offerId: string) {
  return listOfferOverrides().find((record) => record.offerId === offerId) ?? null;
}

export async function upsertOfferOverride(record: OfferOverrideRecord) {
  const next = [
    record,
    ...listOfferOverrides().filter((item) => item.offerId !== record.offerId),
  ].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  await offerOverridesStore.save(next);

  return record;
}
