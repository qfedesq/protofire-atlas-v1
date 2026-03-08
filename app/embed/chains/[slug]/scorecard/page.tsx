import { notFound } from "next/navigation";

import { ShareableScorecard } from "@/components/chain/shareable-scorecard";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { defaultEconomySlug } from "@/lib/config/economies";

const repository = createSeedChainsRepository();

export default async function EmbedChainScorecardPage({
  params,
}: PageProps<"/embed/chains/[slug]/scorecard">) {
  const { slug } = await params;
  const profile = repository.getChainProfileBySlug(slug, defaultEconomySlug);

  if (!profile) {
    notFound();
  }

  return <ShareableScorecard profile={profile} />;
}
