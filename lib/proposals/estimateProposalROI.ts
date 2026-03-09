import type { OfferLibraryItem } from "@/lib/domain/types";

export function estimateProposalRoiBand(offer: OfferLibraryItem) {
  const normalized = offer.roiEstimate.toLowerCase();

  if (normalized.includes("higher")) {
    return "High";
  }

  if (normalized.includes("lower")) {
    return "Medium";
  }

  return "Medium";
}

export function estimateProposalRoi(offer: OfferLibraryItem) {
  return {
    label: offer.roiEstimate,
    band: estimateProposalRoiBand(offer),
  };
}
