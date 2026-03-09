import type {
  EconomyDeploymentTemplate,
  EconomyModule,
  EconomyType,
  EconomyTypeSlug,
  ModuleAvailabilityStatus,
  RankingsSortOption,
} from "@/lib/domain/types";
import { recommendationRulesByEconomy } from "@/lib/recommendations/rules";

function createModule(
  id: string,
  slug: string,
  name: string,
  description: string,
  weight: number,
): EconomyModule {
  return {
    id,
    slug,
    name,
    description,
    weight,
  };
}

function createTemplate(
  key: string,
  name: string,
  objective: string,
): EconomyDeploymentTemplate {
  return {
    key,
    name,
    objective,
  };
}

export const moduleStatusScoreMap: Record<ModuleAvailabilityStatus, number> = {
  missing: 0,
  partial: 0.5,
  available: 1,
};

export const defaultScoringConfig = {
  maximumScore: 10,
  statusScores: moduleStatusScoreMap,
} as const;

export const defaultRecommendationConfig = {
  thresholdScore: 0.5,
  includePartialRecommendations: true,
  includeMissingRecommendations: true,
} as const;

export const defaultEconomySlug: EconomyTypeSlug = "ai-agents";

export const economyTypes: EconomyType[] = [
  {
    id: "economy-ai-agents",
    slug: "ai-agents",
    name: "AI Agent Economy",
    shortLabel: "AI Agents",
    isActive: true,
    description:
      "Infrastructure required for chains to support agent identity, settlement, observability, and trust as a commercial onchain economy.",
    modules: [
      createModule(
        "module-registry",
        "registry",
        "Registry",
        "Identity and discovery infrastructure that lets agents register, resolve, and coordinate across the chain ecosystem.",
        25,
      ),
      createModule(
        "module-payments",
        "payments",
        "Payments",
        "Programmable payment rails for agent-to-agent settlement, recurring execution, and reliable fee abstraction.",
        25,
      ),
      createModule(
        "module-indexing",
        "indexing",
        "Indexing",
        "Queryable state and event indexing so agents can discover contracts, monitor flows, and coordinate in real time.",
        25,
      ),
      createModule(
        "module-security",
        "security",
        "Security",
        "Monitoring, policy, and trust controls that reduce operational risk for autonomous onchain agents.",
        25,
      ),
    ],
    scoringConfig: defaultScoringConfig,
    recommendationConfig: defaultRecommendationConfig,
    deploymentTemplates: [
      createTemplate(
        "foundation",
        "Foundation",
        "Establish the minimum discovery and transaction rails required for an agent economy to function credibly.",
      ),
      createTemplate(
        "enablement",
        "Enablement",
        "Add visibility and searchable state so agent workflows can discover and react to onchain activity.",
      ),
      createTemplate(
        "assurance",
        "Assurance",
        "Layer in monitoring and trust controls so the chain can market a safer agent operating environment.",
      ),
    ],
    recommendationRules: recommendationRulesByEconomy["ai-agents"],
  },
  {
    id: "economy-defi-infrastructure",
    slug: "defi-infrastructure",
    name: "DeFi Infrastructure Economy",
    shortLabel: "DeFi",
    isActive: true,
    description:
      "Infrastructure required for chains to support lending, liquidity, composability, and liquid staking as a competitive DeFi economy.",
    modules: [
      createModule(
        "module-liquid-staking",
        "liquid-staking",
        "Liquid Staking Infrastructure",
        "Staking derivatives, validator integrations, and reward flows that keep staked assets productive inside DeFi.",
        25,
      ),
      createModule(
        "module-lending",
        "lending",
        "Lending Infrastructure",
        "Money market and collateral rails that enable borrowing, leverage, and reusable credit primitives across the ecosystem.",
        20,
      ),
      createModule(
        "module-liquidity",
        "liquidity",
        "Liquidity Layer",
        "Pool, routing, and trading infrastructure that helps protocols attract and retain usable TVL.",
        25,
      ),
      createModule(
        "module-defi-oracles",
        "oracles",
        "Oracle Infrastructure",
        "External data and reference pricing needed for lending, trading, collateral management, and settlement.",
        20,
      ),
      createModule(
        "module-defi-indexing",
        "indexing",
        "Indexing Layer",
        "Queryable protocol, pool, and position data that improves composability and ecosystem operations.",
        10,
      ),
    ],
    scoringConfig: defaultScoringConfig,
    recommendationConfig: defaultRecommendationConfig,
    deploymentTemplates: [
      createTemplate(
        "foundation",
        "Foundation",
        "Stand up the core lending and oracle rails required for a credible DeFi base layer.",
      ),
      createTemplate(
        "enablement",
        "Enablement",
        "Improve protocol observability and queryability so DeFi teams can operate against shared chain infrastructure.",
      ),
      createTemplate(
        "liquidity",
        "Liquidity",
        "Deepen routing and pool support so new protocols can launch against stronger capital formation rails.",
      ),
      createTemplate(
        "capital-efficiency",
        "Capital Efficiency",
        "Keep staked assets productive and composable through liquid staking integrations and yield routing.",
      ),
    ],
    recommendationRules: recommendationRulesByEconomy["defi-infrastructure"],
  },
  {
    id: "economy-rwa-infrastructure",
    slug: "rwa-infrastructure",
    name: "RWA Infrastructure Economy",
    shortLabel: "RWA",
    isActive: false,
    description:
      "Infrastructure required for chains to support tokenized asset issuance, compliance, verification, and settlement workflows.",
    modules: [
      createModule(
        "module-asset-registry",
        "asset-registry",
        "Asset Registry",
        "Canonical issuance and asset identity infrastructure for tokenized real-world assets.",
        30,
      ),
      createModule(
        "module-compliance",
        "compliance",
        "Compliance Layer",
        "Permissioning, policy, and auditability controls for regulated or policy-aware asset workflows.",
        30,
      ),
      createModule(
        "module-rwa-oracles",
        "oracles",
        "Oracle Feeds",
        "Reference pricing and verification data for valuation, asset state changes, and external event checks.",
        20,
      ),
      createModule(
        "module-settlement",
        "settlement",
        "Settlement Infrastructure",
        "Transfer, servicing, and post-trade rails needed to operate tokenized assets beyond issuance.",
        20,
      ),
    ],
    scoringConfig: defaultScoringConfig,
    recommendationConfig: defaultRecommendationConfig,
    deploymentTemplates: [
      createTemplate(
        "issuance",
        "Issuance",
        "Create the registry and asset identity layer required for tokenized asset creation and servicing.",
      ),
      createTemplate(
        "compliance",
        "Compliance",
        "Add the policy and control rails needed for regulated or permissioned asset workflows.",
      ),
      createTemplate(
        "verification",
        "Verification",
        "Improve external data integrity so issued assets can sync to trusted reference events and values.",
      ),
      createTemplate(
        "settlement",
        "Settlement",
        "Stand up the transfer and servicing rails required for complete RWA transaction flows.",
      ),
    ],
    recommendationRules: recommendationRulesByEconomy["rwa-infrastructure"],
  },
  {
    id: "economy-prediction-markets",
    slug: "prediction-markets",
    name: "Prediction Market Economy",
    shortLabel: "Prediction Markets",
    isActive: false,
    description:
      "Infrastructure required for chains to support market creation, resolution, liquidity, and indexing for outcome-driven products.",
    modules: [
      createModule(
        "module-prediction-oracles",
        "oracles",
        "Oracle Layer",
        "Resolution infrastructure that lets markets settle against trusted external outcomes.",
        35,
      ),
      createModule(
        "module-market-contracts",
        "market-contracts",
        "Market Contracts",
        "Reusable contract rails for market creation, position management, and settlement hooks.",
        30,
      ),
      createModule(
        "module-prediction-indexing",
        "indexing",
        "Indexing Infrastructure",
        "Queryable market and position data for discovery, analytics, and operations.",
        15,
      ),
      createModule(
        "module-prediction-liquidity",
        "liquidity",
        "Liquidity Integration",
        "Liquidity support that helps markets maintain usable depth and more reliable pricing.",
        20,
      ),
    ],
    scoringConfig: defaultScoringConfig,
    recommendationConfig: defaultRecommendationConfig,
    deploymentTemplates: [
      createTemplate(
        "foundation",
        "Foundation",
        "Launch reusable market contracts so new prediction products do not need bespoke core infrastructure.",
      ),
      createTemplate(
        "resolution",
        "Resolution",
        "Improve resolution data and indexed market visibility so outcome settlement becomes easier to trust and operate.",
      ),
      createTemplate(
        "liquidity",
        "Liquidity",
        "Strengthen market depth so prediction products can sustain activity and clearer price signals.",
      ),
    ],
    recommendationRules: recommendationRulesByEconomy["prediction-markets"],
  },
];

const economyTypesBySlug = new Map(
  economyTypes.map((economy) => [economy.slug, economy] as const),
);

export function listEconomyTypes() {
  return economyTypes.filter((economy) => economy.isActive);
}

export function listAllEconomyTypes() {
  return [...economyTypes];
}

export function getEconomyTypeBySlug(slug?: EconomyTypeSlug) {
  return economyTypesBySlug.get(slug ?? defaultEconomySlug) ?? economyTypes[0]!;
}

export function getRankingSortOptions(
  economy: EconomyType,
): RankingsSortOption[] {
  return [
    { value: "totalScore", label: "Total score" },
    { value: "name", label: "Chain name" },
    ...economy.modules.map((module) => ({
      value: module.slug,
      label: `${module.name} score`,
    })),
  ];
}
