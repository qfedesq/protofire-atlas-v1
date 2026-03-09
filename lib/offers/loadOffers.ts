import { readdirSync } from "node:fs";
import { join } from "node:path";

import type { OfferLibraryItem } from "@/lib/domain/types";

import { parseOfferMarkdown } from "./parseOfferMarkdown";
import { getOfferOverrideById } from "./store";

const offersDirectory = join(process.cwd(), "offers");

export function loadOffers(): OfferLibraryItem[] {
  return readdirSync(offersDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .sort()
    .map((fileName) => {
      const sourceFile = join(offersDirectory, fileName);
      const baseOffer = parseOfferMarkdown({
        fileName,
        sourceFile,
      });
      const override = getOfferOverrideById(baseOffer.offerId);

      return {
        ...baseOffer,
        isActive: override?.isActive ?? baseOffer.isActive,
        applicableWedges: override?.applicableWedges ?? baseOffer.applicableWedges,
        targetPersonas: override?.targetPersonas ?? baseOffer.targetPersonas,
      };
    });
}
