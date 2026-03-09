import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChainProfileView } from "@/components/chain/chain-profile-view";
import { IntentBeacon } from "@/components/intent/intent-beacon";
import { getAuthenticatedInternalUser } from "@/lib/admin/auth";
import { getLatestChainTechnicalAnalysis } from "@/lib/analysis/service";
import { siteConfig } from "@/lib/config/site";
import { parseEconomySelection } from "@/lib/domain/schemas";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

type ChainProfilePageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const repository = createSeedChainsRepository();

function getSingleSearchParam(
  value: string | string[] | undefined,
) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateStaticParams() {
  await ensureAtlasPersistence();
  return repository.listChains().map((chain) => ({
    slug: chain.slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: ChainProfilePageProps): Promise<Metadata> {
  await ensureAtlasPersistence();
  const { slug } = await params;
  const economySlug = parseEconomySelection(
    searchParams ? await searchParams : undefined,
  );
  const profile = repository.getChainProfileBySlug(slug, economySlug);

  if (!profile) {
    return {
      title: "Chain not found",
    };
  }

  return {
    title: `${profile.chain.name} | ${profile.economy.shortLabel}`,
    description: `${profile.chain.name} readiness score, gap analysis, recommended stack, and phased Protofire deployment plan for ${profile.economy.name}.`,
    alternates: {
      canonical: `/chains/${profile.chain.slug}?economy=${profile.economy.slug}`,
    },
    openGraph: {
      title: `${profile.chain.name} | ${profile.economy.shortLabel}`,
      description: `${profile.chain.name} readiness score, missing infrastructure, and Protofire activation path for ${profile.economy.name}.`,
      url: `${siteConfig.siteUrl}/chains/${profile.chain.slug}?economy=${profile.economy.slug}`,
      siteName: siteConfig.name,
      type: "article",
    },
  };
}

export default async function ChainProfilePage({
  params,
  searchParams,
}: ChainProfilePageProps) {
  await ensureAtlasPersistence();
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const economySlug = parseEconomySelection(resolvedSearchParams);
  const requestState = getSingleSearchParam(resolvedSearchParams?.request);
  const source = getSingleSearchParam(resolvedSearchParams?.from);
  const profile = repository.getChainProfileBySlug(slug, economySlug);
  const internalUser = await getAuthenticatedInternalUser();

  if (!profile) {
    notFound();
  }

  return (
    <>
      <IntentBeacon
        type="chain_profile_viewed"
        economy={profile.economy.slug}
        chainSlug={profile.chain.slug}
        context="chain-profile"
      />
      {source === "peer-comparison" ? (
        <IntentBeacon
          type="peer_comparison_navigation"
          economy={profile.economy.slug}
          chainSlug={profile.chain.slug}
          context="peer-comparison"
        />
      ) : null}
      <ChainProfileView
        profile={profile}
        economies={repository.listEconomies()}
        internalUser={internalUser}
        latestAnalysis={
          internalUser ? getLatestChainTechnicalAnalysis(profile.chain.slug) : null
        }
        requestState={
          requestState === "success"
            ? "success"
            : requestState === "error"
              ? "error"
              : "idle"
        }
      />
    </>
  );
}
