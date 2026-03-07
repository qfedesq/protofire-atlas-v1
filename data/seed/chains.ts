import top30EvmChainsSnapshot from "@/data/source/defillama-top-30-evm-chains.snapshot.json";
import { chainMetadataBySlug } from "@/data/seed/chain-metadata";
import type {
  ChainCatalogSeed,
  ChainSeed,
  EconomyModuleSlug,
  ModuleAvailabilityStatus,
} from "@/lib/domain/types";

type SnapshotChainRecord = Pick<
  ChainCatalogSeed,
  | "id"
  | "slug"
  | "name"
  | "sourceName"
  | "sourceRank"
  | "sourceGlobalRank"
  | "sourceCategory"
  | "sourceMetric"
  | "sourceProvider"
  | "sourceSnapshotDate"
  | "sourceTvlUsd"
>;

type ModuleCopy = {
  evidence: string;
  rationale: string;
};

const top30SnapshotChains = top30EvmChainsSnapshot.chains as SnapshotChainRecord[];

const aiAgentStatusMatrix: Record<
  string,
  Record<EconomyModuleSlug, ModuleAvailabilityStatus>
> = {
  ethereum: {
    registry: "available",
    payments: "available",
    indexing: "available",
    security: "partial",
  },
  "bnb-chain": {
    registry: "partial",
    payments: "available",
    indexing: "partial",
    security: "partial",
  },
  base: {
    registry: "available",
    payments: "available",
    indexing: "partial",
    security: "partial",
  },
  plasma: {
    registry: "partial",
    payments: "available",
    indexing: "missing",
    security: "partial",
  },
  arbitrum: {
    registry: "available",
    payments: "available",
    indexing: "available",
    security: "partial",
  },
  avalanche: {
    registry: "partial",
    payments: "partial",
    indexing: "partial",
    security: "available",
  },
  katana: {
    registry: "partial",
    payments: "available",
    indexing: "partial",
    security: "partial",
  },
  polygon: {
    registry: "partial",
    payments: "available",
    indexing: "partial",
    security: "partial",
  },
  mantle: {
    registry: "partial",
    payments: "available",
    indexing: "partial",
    security: "missing",
  },
  ink: {
    registry: "partial",
    payments: "partial",
    indexing: "partial",
    security: "partial",
  },
  monad: {
    registry: "missing",
    payments: "partial",
    indexing: "partial",
    security: "partial",
  },
  scroll: {
    registry: "missing",
    payments: "partial",
    indexing: "partial",
    security: "partial",
  },
  cronos: {
    registry: "partial",
    payments: "available",
    indexing: "partial",
    security: "partial",
  },
  berachain: {
    registry: "partial",
    payments: "partial",
    indexing: "partial",
    security: "partial",
  },
  optimism: {
    registry: "available",
    payments: "partial",
    indexing: "available",
    security: "partial",
  },
  gnosis: {
    registry: "partial",
    payments: "partial",
    indexing: "partial",
    security: "available",
  },
  linea: {
    registry: "partial",
    payments: "partial",
    indexing: "partial",
    security: "partial",
  },
  hedera: {
    registry: "missing",
    payments: "partial",
    indexing: "partial",
    security: "partial",
  },
  plume: {
    registry: "missing",
    payments: "partial",
    indexing: "partial",
    security: "partial",
  },
  rootstock: {
    registry: "partial",
    payments: "partial",
    indexing: "missing",
    security: "partial",
  },
  megaeth: {
    registry: "missing",
    payments: "partial",
    indexing: "missing",
    security: "partial",
  },
  bitlayer: {
    registry: "missing",
    payments: "partial",
    indexing: "partial",
    security: "partial",
  },
  bob: {
    registry: "partial",
    payments: "partial",
    indexing: "partial",
    security: "partial",
  },
  unichain: {
    registry: "partial",
    payments: "partial",
    indexing: "missing",
    security: "partial",
  },
  "ai-layer": {
    registry: "partial",
    payments: "partial",
    indexing: "missing",
    security: "partial",
  },
  mode: {
    registry: "partial",
    payments: "partial",
    indexing: "partial",
    security: "partial",
  },
  ethereal: {
    registry: "missing",
    payments: "partial",
    indexing: "missing",
    security: "partial",
  },
  hemi: {
    registry: "partial",
    payments: "partial",
    indexing: "missing",
    security: "partial",
  },
  sonic: {
    registry: "missing",
    payments: "partial",
    indexing: "partial",
    security: "available",
  },
  fraxtal: {
    registry: "partial",
    payments: "partial",
    indexing: "partial",
    security: "partial",
  },
};

const aiAgentCopyByModule: Record<
  EconomyModuleSlug,
  Record<ModuleAvailabilityStatus, ModuleCopy>
> = {
  registry: {
    available: {
      evidence:
        "registry infrastructure is treated as available for the AI-agent benchmark.",
      rationale:
        "Agent identity and discovery can already be launched against a credible chain-level registration surface.",
    },
    partial: {
      evidence:
        "registry infrastructure is treated as partially available for the AI-agent benchmark.",
      rationale:
        "Some discovery patterns exist, but Protofire would still need to standardize agent identity and routing before the chain can market a cleaner agent story.",
    },
    missing: {
      evidence:
        "registry infrastructure is treated as missing for the AI-agent benchmark.",
      rationale:
        "Without a clearer registration layer, agent identity and discovery still depend on fragmented integrations instead of a canonical chain primitive.",
    },
  },
  payments: {
    available: {
      evidence:
        "payment rails are treated as available for the AI-agent benchmark.",
      rationale:
        "Machine-to-machine settlement is already credible enough to support paid agent flows, recurring execution, and service monetization.",
    },
    partial: {
      evidence:
        "payment rails are treated as partially available for the AI-agent benchmark.",
      rationale:
        "Programmatic settlement can work, but the chain still needs cleaner packaging before agent monetization feels turnkey.",
    },
    missing: {
      evidence:
        "payment rails are treated as missing for the AI-agent benchmark.",
      rationale:
        "Without clearer settlement flows, the chain has a weak answer to how agent activity becomes durable transaction volume.",
    },
  },
  indexing: {
    available: {
      evidence:
        "indexing infrastructure is treated as available for the AI-agent benchmark.",
      rationale:
        "Queryable state and event coverage are strong enough to support discovery, monitoring, and orchestration for agent workflows.",
    },
    partial: {
      evidence:
        "indexing infrastructure is treated as partially available for the AI-agent benchmark.",
      rationale:
        "State access exists, but the chain still needs a more explicit agent-facing observability layer before broader activation becomes easier.",
    },
    missing: {
      evidence:
        "indexing infrastructure is treated as missing for the AI-agent benchmark.",
      rationale:
        "Without stronger indexing, agent builders face higher integration cost and weaker runtime visibility into chain activity.",
    },
  },
  security: {
    available: {
      evidence:
        "security and trust controls are treated as available for the AI-agent benchmark.",
      rationale:
        "The chain already has a credible assurance layer for safer autonomous execution and partner diligence.",
    },
    partial: {
      evidence:
        "security and trust controls are treated as partially available for the AI-agent benchmark.",
      rationale:
        "Security foundations exist, but the chain still needs a clearer trust posture for production agent activity.",
    },
    missing: {
      evidence:
        "security and trust controls are treated as missing for the AI-agent benchmark.",
      rationale:
        "Without a visible monitoring and trust layer, the chain cannot credibly market safer autonomous activity.",
    },
  },
};

export const chainSeedRecords: ChainSeed[] = top30SnapshotChains.map(
  (snapshotChain) => {
    const metadata = chainMetadataBySlug[snapshotChain.slug];
    const moduleStatuses = aiAgentStatusMatrix[snapshotChain.slug];

    if (!metadata) {
      throw new Error(`Missing chain metadata for ${snapshotChain.slug}`);
    }

    if (!moduleStatuses) {
      throw new Error(`Missing AI-agent status matrix for ${snapshotChain.slug}`);
    }

    return {
      id: snapshotChain.id,
      slug: snapshotChain.slug,
      name: snapshotChain.name,
      sourceName: snapshotChain.sourceName,
      sourceRank: snapshotChain.sourceRank,
      sourceGlobalRank: snapshotChain.sourceGlobalRank,
      sourceCategory: snapshotChain.sourceCategory,
      sourceMetric: snapshotChain.sourceMetric,
      sourceProvider: snapshotChain.sourceProvider,
      sourceSnapshotDate: snapshotChain.sourceSnapshotDate,
      sourceTvlUsd: snapshotChain.sourceTvlUsd,
      category: metadata.category,
      website: metadata.website,
      shortDescription: metadata.shortDescription,
      status: metadata.status,
      modules: Object.fromEntries(
        Object.entries(moduleStatuses).map(([moduleSlug, status]) => [
          moduleSlug,
          {
            status,
            evidenceNote: `Seeded demo assessment: For ${snapshotChain.name}, ${aiAgentCopyByModule[moduleSlug][status].evidence}`,
            rationale: aiAgentCopyByModule[moduleSlug][status].rationale,
          },
        ]),
      ),
    };
  },
);
