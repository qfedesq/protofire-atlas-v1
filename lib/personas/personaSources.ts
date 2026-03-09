import type { BuyerPersonaInput, ChainProfile } from "@/lib/domain/types";

export function buildPersonaSourceBasis(
  input: BuyerPersonaInput,
  profile: ChainProfile,
) {
  const sources = [
    input.chainUrl,
    profile.chain.roadmap.sourceUrl ?? profile.chain.roadmap.sourceLabel,
    input.protocolUrl ?? "No protocol URL provided",
    input.linkedinProfile ?? "No LinkedIn profile provided",
    input.twitterHandle
      ? `https://x.com/${input.twitterHandle.replace(/^@/, "")}`
      : "No Twitter handle provided",
    input.githubProfile ?? "No GitHub profile provided",
    input.notes ? `Internal notes: ${input.notes}` : "No internal notes provided",
  ];

  return {
    organization: input.organizationName?.trim() || profile.chain.name,
    sources,
  };
}
