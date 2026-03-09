import type { BuyerPersonaInput } from "@/lib/domain/types";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

import { buildPersonaSourceBasis } from "./personaSources";
import { buildPersonaStructuredTemplate } from "./personaTemplates";

const repository = createSeedChainsRepository();

export function buildPersonaProfile(input: BuyerPersonaInput) {
  const profile = repository.getChainProfileBySlug(input.chainSlug);

  if (!profile) {
    throw new Error(`Unknown chain "${input.chainSlug}" for persona builder.`);
  }

  const sourceBasis = buildPersonaSourceBasis(input, profile);
  const structuredData = buildPersonaStructuredTemplate(input, profile);

  return {
    profile,
    organization: sourceBasis.organization,
    structuredData: {
      ...structuredData,
      sourceSummary: sourceBasis.sources,
    },
    sourceNotes: sourceBasis.sources,
  };
}
