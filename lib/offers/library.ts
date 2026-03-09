import type { OfferLibraryItem } from "@/lib/domain/types";

import { listOfferIndex } from "./offerIndex";

export function listOfferLibrary(): OfferLibraryItem[] {
  return listOfferIndex();
}

export function getOfferById(offerId: string) {
  return listOfferLibrary().find((offer) => offer.offerId === offerId) ?? null;
}
