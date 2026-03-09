import type { EconomyTypeSlug, OfferLibraryItem } from "@/lib/domain/types";

import { loadOffers } from "./loadOffers";

export function listOfferIndex() {
  return loadOffers();
}

export function listActiveOffers() {
  return listOfferIndex().filter((offer) => offer.isActive);
}

export function getOfferIndexById(offerId: string) {
  return listOfferIndex().find((offer) => offer.offerId === offerId) ?? null;
}

export function listOffersByWedge(wedge: EconomyTypeSlug) {
  return listActiveOffers().filter((offer) => offer.applicableWedges.includes(wedge));
}

export function listOffersByPersona(personaTitle: string) {
  const normalizedTitle = personaTitle.toLowerCase();

  return listActiveOffers().filter((offer) =>
    offer.targetPersonas.some((target) =>
      normalizedTitle.includes(target.toLowerCase()),
    ),
  );
}

export function buildOfferIndexMap(offers: OfferLibraryItem[]) {
  return new Map(offers.map((offer) => [offer.offerId, offer] as const));
}
