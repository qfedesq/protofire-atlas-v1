import type { ChainRoadmapSeed } from "@/lib/domain/types";

const snapshotDate = "2026-03-07";

function officialRoadmap(
  chainSlug: string,
  sourceLabel: string,
  sourceUrl: string,
  stageLabel: string,
  stageSummary: string,
  atlasFitSummary: string,
): ChainRoadmapSeed {
  return {
    chainSlug,
    sourceKind: "official-roadmap",
    sourceLabel,
    sourceUrl,
    snapshotDate,
    stageLabel,
    stageSummary,
    atlasFitSummary,
  };
}

function officialUpdates(
  chainSlug: string,
  sourceLabel: string,
  sourceUrl: string,
  stageLabel: string,
  stageSummary: string,
  atlasFitSummary: string,
): ChainRoadmapSeed {
  return {
    chainSlug,
    sourceKind: "official-updates",
    sourceLabel,
    sourceUrl,
    snapshotDate,
    stageLabel,
    stageSummary,
    atlasFitSummary,
  };
}

function officialDocs(
  chainSlug: string,
  sourceLabel: string,
  sourceUrl: string,
  stageLabel: string,
  stageSummary: string,
  atlasFitSummary: string,
): ChainRoadmapSeed {
  return {
    chainSlug,
    sourceKind: "official-docs",
    sourceLabel,
    sourceUrl,
    snapshotDate,
    stageLabel,
    stageSummary,
    atlasFitSummary,
  };
}

function notPublic(
  chainSlug: string,
  stageLabel: string,
  stageSummary: string,
  atlasFitSummary: string,
): ChainRoadmapSeed {
  return {
    chainSlug,
    sourceKind: "not-public",
    sourceLabel: "No public roadmap verified",
    snapshotDate,
    stageLabel,
    stageSummary,
    atlasFitSummary,
  };
}

export const chainRoadmapSeeds: ChainRoadmapSeed[] = [
  officialRoadmap(
    "ethereum",
    "Ethereum roadmap",
    "https://ethereum.org/en/roadmap/",
    "Protocol scaling",
    "Ethereum's official roadmap remains centered on scaling, UX simplification, and safer execution around the rollup-centric stack.",
    "Atlas should emphasize application-layer infrastructure that helps chains compete on readiness without needing Ethereum-scale base-layer depth.",
  ),
  officialRoadmap(
    "bnb-chain",
    "BNB Chain roadmap",
    "https://www.bnbchain.org/en/roadmap",
    "Liquidity and app growth",
    "BNB Chain's public roadmap keeps pushing throughput, retail UX, and liquidity expansion across the ecosystem surface.",
    "Atlas should emphasize modules that make existing volume more reusable across higher-value economies, not just faster to transact.",
  ),
  officialUpdates(
    "base",
    "Base updates",
    "https://www.base.org/updates",
    "Distribution and consumer expansion",
    "Base's official update flow points toward distribution, consumer product depth, and broadening app-layer usage on top of the network.",
    "Atlas should emphasize infrastructure that turns distribution into durable discoverability, payments, and operational observability.",
  ),
  notPublic(
    "plasma",
    "Foundation buildout",
    "No public roadmap page was verified for Plasma in the current Atlas snapshot, so the stage is based on the current chain surface and seeded posture.",
    "Atlas should emphasize foundational modules that convert concentrated TVL into reusable ecosystem infrastructure and clearer ecosystem packaging.",
  ),
  officialUpdates(
    "arbitrum",
    "Arbitrum updates",
    "https://arbitrum.io/",
    "Ecosystem scaling",
    "Arbitrum's official surface continues to emphasize ecosystem depth, developer breadth, and making the chain a durable home for large protocol categories.",
    "Atlas should emphasize the modules that preserve Arbitrum's lead by making higher-value economies easier to launch against shared infrastructure.",
  ),
  officialUpdates(
    "avalanche",
    "Avalanche updates",
    "https://www.avax.network/blog",
    "Institutional and app expansion",
    "Avalanche's official updates continue to push subnets, institutional relevance, and more specialized application environments.",
    "Atlas should emphasize infrastructure layers that let Avalanche translate custom environments into stronger shared readiness signals.",
  ),
  notPublic(
    "katana",
    "Liquidity capture",
    "No public roadmap page was verified for Katana in the current Atlas snapshot, so the stage is based on current liquidity concentration and seeded posture.",
    "Atlas should emphasize modules that turn capital inflows into protocol reuse, indexing depth, and more repeatable ecosystem onboarding.",
  ),
  officialRoadmap(
    "polygon",
    "Polygon roadmap",
    "https://polygon.technology/roadmap",
    "Internet-scale network services",
    "Polygon's official roadmap still centers on scaling the chain stack into broader payments, application, and enterprise usage.",
    "Atlas should emphasize modules that make Polygon's broad distribution easier to activate as concrete economy readiness.",
  ),
  officialUpdates(
    "mantle",
    "Mantle updates",
    "https://www.mantle.xyz/blog",
    "Capital efficiency and ecosystem expansion",
    "Mantle's official update stream keeps leaning into treasury-backed ecosystem expansion and broader capital efficiency infrastructure.",
    "Atlas should emphasize modules that help Mantle turn capital weight into durable lending, indexing, and liquid staking posture.",
  ),
  notPublic(
    "ink",
    "Foundation buildout",
    "No public roadmap page was verified for Ink in the current Atlas snapshot, so the stage is based on early TVL formation and current seeded readiness.",
    "Atlas should emphasize the highest-leverage foundational modules before the chain tries to market cross-economy breadth.",
  ),
  notPublic(
    "monad",
    "Performance launch",
    "No public roadmap page was verified for Monad in the current Atlas snapshot, so the stage is based on official positioning and the current seeded readiness model.",
    "Atlas should emphasize modules that make performance claims operationally credible for higher-value ecosystem categories.",
  ),
  officialRoadmap(
    "scroll",
    "Scroll roadmap",
    "https://scroll.io/blog/scroll-2024-roadmap",
    "Security-first expansion",
    "Scroll's official roadmap emphasizes measured ecosystem expansion with continued focus on zkEVM execution quality and developer adoption.",
    "Atlas should emphasize the modules that help Scroll convert technical credibility into more visible economy readiness.",
  ),
  notPublic(
    "cronos",
    "Consumer and payments expansion",
    "No public roadmap page was verified for Cronos in the current Atlas snapshot, so the stage is based on current product positioning and seeded readiness.",
    "Atlas should emphasize reusable payments, indexing, and liquidity modules that deepen Cronos beyond consumer access alone.",
  ),
  notPublic(
    "berachain",
    "DeFi ecosystem expansion",
    "No public roadmap page was verified for Berachain in the current Atlas snapshot, so the stage is based on the current DeFi-heavy ecosystem posture.",
    "Atlas should emphasize the modules that let Berachain turn DeFi momentum into broader ecosystem infrastructure defensibility.",
  ),
  officialUpdates(
    "optimism",
    "Optimism updates",
    "https://www.optimism.io/blog",
    "Superchain interoperability",
    "Optimism's official updates keep pushing Superchain coordination, interoperability, and shared infrastructure across the ecosystem.",
    "Atlas should emphasize modules that make cross-chain coordination immediately usable for concrete economy launch paths.",
  ),
  officialDocs(
    "gnosis",
    "Gnosis docs",
    "https://docs.gnosis.io/",
    "Operational hardening",
    "Gnosis continues to present a mature operational base centered on wallets, payments, and reliable infrastructure surfaces.",
    "Atlas should emphasize modules that add deeper protocol breadth on top of Gnosis's already mature operational posture.",
  ),
  officialDocs(
    "linea",
    "Linea docs",
    "https://docs.linea.build/",
    "Builder expansion",
    "Linea's official docs and positioning are oriented toward builder growth, zkEVM adoption, and ecosystem surface expansion.",
    "Atlas should emphasize modules that help Linea turn builder attention into durable protocol infrastructure readiness.",
  ),
  officialRoadmap(
    "hedera",
    "Hedera roadmap",
    "https://hedera.com/roadmap",
    "Institutional distribution",
    "Hedera's public roadmap stays focused on enterprise-grade network services, governance, and institutional utility.",
    "Atlas should emphasize RWA, compliance, and settlement layers that align with Hedera's institutional direction.",
  ),
  notPublic(
    "plume",
    "RWA ecosystem expansion",
    "No public roadmap page was verified for Plume in the current Atlas snapshot, so the stage is based on the chain's current RWA-centered positioning.",
    "Atlas should emphasize issuance, compliance, and settlement modules that help Plume convert narrative leadership into infrastructure depth.",
  ),
  officialUpdates(
    "rootstock",
    "Rootstock blog",
    "https://rootstock.io/blog/",
    "Bitcoin DeFi expansion",
    "Rootstock's official updates remain oriented toward bitcoin-linked DeFi utility and deeper protocol coverage around that niche.",
    "Atlas should emphasize the modules that make Rootstock's focused capital base more reusable across lending and indexing flows.",
  ),
  notPublic(
    "megaeth",
    "Performance launch",
    "No public roadmap page was verified for MegaETH in the current Atlas snapshot, so the stage is based on current launch messaging and seeded readiness.",
    "Atlas should emphasize modules that make early performance positioning credible for operators, builders, and capital allocators.",
  ),
  officialDocs(
    "bitlayer",
    "Bitlayer docs",
    "https://docs.bitlayer.org/",
    "Bitcoin liquidity expansion",
    "Bitlayer's official docs focus on turning bitcoin-adjacent liquidity and execution into a broader application environment.",
    "Atlas should emphasize infrastructure that makes bitcoin-sourced liquidity easier to compose across reusable protocol layers.",
  ),
  officialUpdates(
    "bob",
    "BOB updates",
    "https://buildonbob.xyz/",
    "Hybrid liquidity expansion",
    "BOB's official positioning emphasizes hybrid bitcoin and EVM liquidity, with room to deepen the supporting infrastructure stack.",
    "Atlas should emphasize modules that turn hybrid liquidity into stronger protocol reuse and more dependable developer surfaces.",
  ),
  notPublic(
    "unichain",
    "Distribution launch",
    "No public roadmap page was verified for Unichain in the current Atlas snapshot, so the stage is based on current launch posture and seeded readiness.",
    "Atlas should emphasize modules that convert distribution advantages into observable, reusable ecosystem infrastructure.",
  ),
  notPublic(
    "ai-layer",
    "Niche foundation buildout",
    "No public roadmap page was verified for AI Layer in the current Atlas snapshot, so the stage is based on the current narrow ecosystem surface.",
    "Atlas should emphasize foundational modules before trying to position the chain across multiple higher-value economies.",
  ),
  officialUpdates(
    "mode",
    "Mode updates",
    "https://www.mode.network/",
    "DeFi positioning",
    "Mode's official positioning remains focused on DeFi adoption, but the supporting infrastructure stack still looks uneven versus larger peers.",
    "Atlas should emphasize the modules that move Mode from narrative-led DeFi positioning into stronger operational readiness.",
  ),
  notPublic(
    "ethereal",
    "Foundation buildout",
    "No public roadmap page was verified for Ethereal in the current Atlas snapshot, so the stage is based on early readiness and current seeded posture.",
    "Atlas should emphasize core modules that make the chain legible and operable before broader go-to-market claims.",
  ),
  officialUpdates(
    "hemi",
    "Hemi updates",
    "https://hemi.xyz/",
    "Interoperability expansion",
    "Hemi's official positioning keeps pointing toward interoperability and broader coordination across ecosystems.",
    "Atlas should emphasize modules that make that coordination discoverable, safer, and easier to launch against.",
  ),
  officialUpdates(
    "sonic",
    "Sonic updates",
    "https://www.soniclabs.com/blog",
    "Performance and app expansion",
    "Sonic's official updates continue to emphasize throughput, developer experience, and turning performance into app adoption.",
    "Atlas should emphasize modules that keep performance claims tied to real protocol readiness and reusable infrastructure.",
  ),
  officialUpdates(
    "fraxtal",
    "Fraxtal updates",
    "https://frax.finance/blog",
    "Protocol distribution",
    "Fraxtal's official positioning still leans on protocol-native distribution and deeper integration across the Frax stack.",
    "Atlas should emphasize modules that extend that distribution advantage into broader ecosystem readiness and composability.",
  ),
];

export const chainRoadmapSeedsBySlug = new Map(
  chainRoadmapSeeds.map((seed) => [seed.chainSlug, seed] as const),
);
