import type {
  EconomyTypeSlug,
  ModuleAvailabilityStatus,
} from "@/lib/domain/types";

/**
 * Formal criteria for module status assessment.
 *
 * Each module declares explicit, auditable conditions for each status level.
 * This replaces ad-hoc subjective assessments with structured rules.
 */

export type ModuleStatusCriterion = {
  status: ModuleAvailabilityStatus;
  label: string;
  criteria: string[];
};

export type ModuleStatusCriteriaSet = {
  moduleSlug: string;
  economySlug: EconomyTypeSlug;
  levels: ModuleStatusCriterion[];
};

const aiAgentsCriteria: ModuleStatusCriteriaSet[] = [
  {
    moduleSlug: "registry",
    economySlug: "ai-agents",
    levels: [
      {
        status: "available",
        label: "Registry Infrastructure available",
        criteria: [
          "At least one production agent registry or directory protocol is deployed",
          "Agent identity and discovery primitives are accessible to developers",
          "SDK or tooling exists for agent registration",
        ],
      },
      {
        status: "partial",
        label: "Registry Infrastructure partial",
        criteria: [
          "Agent identity concepts exist but no production registry protocol",
          "Third-party tooling provides partial discovery",
          "No standardized agent registration interface",
        ],
      },
      {
        status: "missing",
        label: "Registry Infrastructure missing",
        criteria: [
          "No agent registry, identity, or discovery primitives",
          "No announced plans for agent infrastructure",
        ],
      },
    ],
  },
  {
    moduleSlug: "payments",
    economySlug: "ai-agents",
    levels: [
      {
        status: "available",
        label: "Payment Infrastructure available",
        criteria: [
          "Programmatic payment rails support agent-to-agent and agent-to-human settlement",
          "At least one payment or micropayment protocol supports agent workflows",
          "Gas sponsorship or account abstraction is available for agent operations",
        ],
      },
      {
        status: "partial",
        label: "Payment Infrastructure partial",
        criteria: [
          "Standard ERC-20 transfers exist but no agent-specific payment tooling",
          "Account abstraction is available but not yet used for agent workflows",
        ],
      },
      {
        status: "missing",
        label: "Payment Infrastructure missing",
        criteria: [
          "No programmatic payment rails suitable for agent settlement",
          "No account abstraction or gas sponsorship support",
        ],
      },
    ],
  },
  {
    moduleSlug: "indexing",
    economySlug: "ai-agents",
    levels: [
      {
        status: "available",
        label: "Indexing Infrastructure available",
        criteria: [
          "At least one production indexing service (The Graph, Goldsky, etc.) supports the chain",
          "Agent activity events can be queried and observed",
          "Real-time or near-real-time indexing is available",
        ],
      },
      {
        status: "partial",
        label: "Indexing Infrastructure partial",
        criteria: [
          "General-purpose indexing exists but is not configured for agent event types",
          "Indexing is available but with limited coverage or latency",
        ],
      },
      {
        status: "missing",
        label: "Indexing Infrastructure missing",
        criteria: [
          "No production indexing service supports the chain",
          "No subgraph or data pipeline tooling is available",
        ],
      },
    ],
  },
  {
    moduleSlug: "security",
    economySlug: "ai-agents",
    levels: [
      {
        status: "available",
        label: "Security Infrastructure available",
        criteria: [
          "Runtime monitoring and policy enforcement tools exist for agent operations",
          "At least one production security or trust framework is deployed",
          "Operator visibility and alerting tooling is available",
        ],
      },
      {
        status: "partial",
        label: "Security Infrastructure partial",
        criteria: [
          "General smart contract security tooling exists but not adapted for agent workflows",
          "Monitoring exists at the chain level but not at the agent operation level",
        ],
      },
      {
        status: "missing",
        label: "Security Infrastructure missing",
        criteria: [
          "No monitoring, policy, or trust infrastructure for agent operations",
          "No security framework beyond base chain consensus",
        ],
      },
    ],
  },
];

const defiInfrastructureCriteria: ModuleStatusCriteriaSet[] = [
  {
    moduleSlug: "liquid-staking",
    economySlug: "defi-infrastructure",
    levels: [
      {
        status: "available",
        label: "Liquid Staking available",
        criteria: [
          "At least one liquid staking protocol is live with > $10M TVL",
          "Staking derivatives are composable with other DeFi protocols",
          "Validator integration and reward distribution are automated",
        ],
      },
      {
        status: "partial",
        label: "Liquid Staking partial",
        criteria: [
          "Liquid staking protocol exists but with < $10M TVL or limited DeFi composability",
          "Native staking is supported but no liquid staking derivative is widely adopted",
        ],
      },
      {
        status: "missing",
        label: "Liquid Staking missing",
        criteria: [
          "No liquid staking protocol deployed",
          "Chain architecture does not support native staking (e.g., L2 rollups)",
        ],
      },
    ],
  },
  {
    moduleSlug: "lending",
    economySlug: "defi-infrastructure",
    levels: [
      {
        status: "available",
        label: "Lending Infrastructure available",
        criteria: [
          "At least 2 active lending protocols with combined TVL > $10M",
          "Lending markets support major ecosystem assets",
          "Liquidation infrastructure is functional and tested",
        ],
      },
      {
        status: "partial",
        label: "Lending Infrastructure partial",
        criteria: [
          "1 lending protocol exists or total lending TVL < $10M",
          "Lending markets have limited asset support",
        ],
      },
      {
        status: "missing",
        label: "Lending Infrastructure missing",
        criteria: [
          "No active lending protocol deployed on the chain",
        ],
      },
    ],
  },
  {
    moduleSlug: "liquidity",
    economySlug: "defi-infrastructure",
    levels: [
      {
        status: "available",
        label: "Liquidity Layer available",
        criteria: [
          "At least 2 active DEXes or AMMs with combined TVL > $20M",
          "Concentrated liquidity or advanced AMM models are available",
          "Liquidity routing or aggregation exists",
        ],
      },
      {
        status: "partial",
        label: "Liquidity Layer partial",
        criteria: [
          "1 DEX/AMM exists or total liquidity TVL < $20M",
          "Only basic constant-product AMMs are available",
        ],
      },
      {
        status: "missing",
        label: "Liquidity Layer missing",
        criteria: [
          "No active DEX or AMM deployed on the chain",
        ],
      },
    ],
  },
  {
    moduleSlug: "oracles",
    economySlug: "defi-infrastructure",
    levels: [
      {
        status: "available",
        label: "Oracle Infrastructure available",
        criteria: [
          "At least one production oracle provider (Chainlink, Pyth, etc.) supports the chain",
          "Price feeds cover major ecosystem assets",
          "Oracle latency and update frequency meet DeFi requirements",
        ],
      },
      {
        status: "partial",
        label: "Oracle Infrastructure partial",
        criteria: [
          "Oracle provider is available but with limited feed coverage",
          "Only one oracle provider with no redundancy",
        ],
      },
      {
        status: "missing",
        label: "Oracle Infrastructure missing",
        criteria: [
          "No production oracle provider supports the chain",
        ],
      },
    ],
  },
  {
    moduleSlug: "indexing",
    economySlug: "defi-infrastructure",
    levels: [
      {
        status: "available",
        label: "Indexing Infrastructure available",
        criteria: [
          "At least one production indexing service supports the chain",
          "DeFi protocol events are indexed and queryable",
        ],
      },
      {
        status: "partial",
        label: "Indexing Infrastructure partial",
        criteria: [
          "Indexing exists but with limited DeFi protocol coverage",
          "Indexing latency limits real-time DeFi applications",
        ],
      },
      {
        status: "missing",
        label: "Indexing Infrastructure missing",
        criteria: [
          "No production indexing service supports the chain for DeFi data",
        ],
      },
    ],
  },
];

export const moduleStatusCriteria: ModuleStatusCriteriaSet[] = [
  ...aiAgentsCriteria,
  ...defiInfrastructureCriteria,
];

export function getModuleStatusCriteria(
  economySlug: EconomyTypeSlug,
  moduleSlug: string,
): ModuleStatusCriteriaSet | undefined {
  return moduleStatusCriteria.find(
    (criteria) =>
      criteria.economySlug === economySlug &&
      criteria.moduleSlug === moduleSlug,
  );
}

export type ModuleStatusValidationWarning = {
  chainSlug: string;
  economySlug: EconomyTypeSlug;
  moduleSlug: string;
  currentStatus: ModuleAvailabilityStatus;
  issue: string;
};

export function validateModuleStatusAssessments(
  assessments: Array<{
    chainSlug: string;
    economySlug: EconomyTypeSlug;
    moduleSlug: string;
    status: ModuleAvailabilityStatus;
    evidenceNote?: string;
  }>,
): ModuleStatusValidationWarning[] {
  const warnings: ModuleStatusValidationWarning[] = [];

  for (const assessment of assessments) {
    const criteria = getModuleStatusCriteria(
      assessment.economySlug,
      assessment.moduleSlug,
    );

    if (!criteria) {
      continue;
    }

    if (!assessment.evidenceNote || assessment.evidenceNote.trim().length < 10) {
      warnings.push({
        chainSlug: assessment.chainSlug,
        economySlug: assessment.economySlug,
        moduleSlug: assessment.moduleSlug,
        currentStatus: assessment.status,
        issue: `No evidence note or insufficient evidence for ${assessment.status} status. Module status assessments require documented justification.`,
      });
    }
  }

  return warnings;
}
