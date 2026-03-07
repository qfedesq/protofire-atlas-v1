import type {
  EconomyRecommendationRule,
  EconomyTypeSlug,
} from "@/lib/domain/types";

function createRule(
  rule: EconomyRecommendationRule,
): EconomyRecommendationRule {
  return rule;
}

export const recommendationRulesByEconomy: Record<
  EconomyTypeSlug,
  Record<string, EconomyRecommendationRule>
> = {
  "ai-agents": {
    registry: createRule({
      deploymentPhaseKey: "foundation",
      missingTitle: "Activate Agent Registry",
      partialTitle: "Upgrade Agent Registry",
      whyItMatters:
        "A registry is the discovery layer for an agent economy. Without it, agents cannot publish identity, capabilities, or routing metadata in a consistent way.",
      missingResult:
        "Creates a canonical discovery surface so wallets, apps, and service agents can resolve who is available and what each agent can do.",
      partialResult:
        "Converts fragmented registry patterns into a chain-level standard that is easier for ecosystem builders to adopt and trust.",
      missingChainImpact:
        "Gives the chain a visible agent identity layer, improving onboarding clarity, ecosystem coordination, and partner confidence.",
      partialChainImpact:
        "Reduces fragmentation across existing discovery patterns so more teams can launch against the same agent registration standard.",
      missingSummary:
        "Launch a net-new registry module to make agent identity and discovery legible across the chain ecosystem.",
      partialSummary:
        "Tighten the existing registry posture so discovery works like a first-class ecosystem capability instead of an ad hoc integration.",
      gapImpact: {
        missing:
          "The chain lacks a clear discovery layer, so agent onboarding and ecosystem coordination remain fragmented.",
        partial:
          "Discovery is possible but inconsistent, which weakens ecosystem confidence and slows partner adoption.",
      },
    }),
    payments: createRule({
      deploymentPhaseKey: "foundation",
      missingTitle: "Activate Payment Rails",
      partialTitle: "Upgrade Payment Rails",
      whyItMatters:
        "Agent economies need reliable machine-to-machine settlement. If payments are unclear, the chain cannot convert agent activity into durable volume.",
      missingResult:
        "Introduces dependable settlement paths for agent services, usage billing, and automated value exchange.",
      partialResult:
        "Improves fee abstraction and transaction reliability so existing payment flows become commercially credible for production agents.",
      missingChainImpact:
        "Increases the chain's ability to capture agent transaction volume, paid usage, and recurring settlement activity.",
      partialChainImpact:
        "Makes existing transaction demand easier to monetize by lowering settlement friction for agent builders and operators.",
      missingSummary:
        "Stand up a payments layer that makes recurring settlement and service monetization straightforward for agent builders.",
      partialSummary:
        "Refine the current payment posture so agents can settle value with less operational friction and clearer commercial guarantees.",
      gapImpact: {
        missing:
          "Without agent-ready payments, the chain cannot translate automation demand into dependable transaction volume.",
        partial:
          "Settlement works in parts, but friction still limits how confidently builders can monetize agent workflows.",
      },
    }),
    indexing: createRule({
      deploymentPhaseKey: "enablement",
      missingTitle: "Activate Agent Indexing Layer",
      partialTitle: "Upgrade Agent Indexing Layer",
      whyItMatters:
        "Indexing gives agents and operators searchable state, event history, and workflow visibility. It is the observability layer for production automation.",
      missingResult:
        "Enables searchable chain activity so agents can discover contracts, track events, and coordinate in response to onchain state.",
      partialResult:
        "Turns generic indexing access into an agent-focused discovery and monitoring surface that reduces integration cost for ecosystem teams.",
      missingChainImpact:
        "Improves ecosystem visibility, making the chain easier to integrate, monitor, and operate as agent activity grows.",
      partialChainImpact:
        "Shortens implementation time for builders by turning generic data access into a clearer agent discovery and monitoring layer.",
      missingSummary:
        "Deploy a dedicated indexing layer so agents can query the chain without custom integration work on every workflow.",
      partialSummary:
        "Package the current indexing posture into a more usable agent discovery service with clearer developer ergonomics.",
      gapImpact: {
        missing:
          "The chain lacks a visible observability layer for agents, making discovery, state sync, and monitoring too expensive to operationalize.",
        partial:
          "Indexing exists, but it is not yet opinionated enough to support fast agent adoption across the wider ecosystem.",
      },
    }),
    security: createRule({
      deploymentPhaseKey: "assurance",
      missingTitle: "Activate Security Monitoring and Trust Layer",
      partialTitle: "Upgrade Security Monitoring and Trust Layer",
      whyItMatters:
        "Autonomous activity increases perceived risk. Chains need trust signals, monitoring, and policy controls before business leads will treat agent flows as deployable.",
      missingResult:
        "Adds the operational safeguards needed to position the chain as a safer environment for autonomous agents and agent-facing applications.",
      partialResult:
        "Strengthens existing controls into a clearer trust posture that can support external messaging, partner diligence, and production launch confidence.",
      missingChainImpact:
        "Raises confidence in the chain's operational posture, making partner conversations and ecosystem activation easier to advance.",
      partialChainImpact:
        "Improves the chain's credibility with founders, operators, and ecosystem teams evaluating whether agent activity is safe to launch.",
      missingSummary:
        "Introduce a dedicated trust layer so the chain can market safer autonomous activity instead of relying on generic security messaging.",
      partialSummary:
        "Expand current security controls into an explicit agent trust posture that is easier for partners and ecosystem teams to evaluate.",
      gapImpact: {
        missing:
          "The chain cannot credibly claim safe autonomous activity without a visible trust and monitoring layer.",
        partial:
          "Security foundations exist, but the trust story for agents is still too weak for confident ecosystem activation.",
      },
    }),
  },
  "defi-infrastructure": {
    lending: createRule({
      deploymentPhaseKey: "foundation",
      missingTitle: "Activate Lending Infrastructure Stack",
      partialTitle: "Upgrade Lending Infrastructure Stack",
      whyItMatters:
        "Lending markets are one of the base capital loops of a DeFi economy. Without them, collateral reuse, leverage, and protocol depth stay constrained.",
      missingResult:
        "Introduces a lending base layer that lets builders launch borrowing, collateral, and leverage primitives on top of the chain.",
      partialResult:
        "Turns fragmented or thin lending support into a clearer market infrastructure layer that more protocols can build on with confidence.",
      missingChainImpact:
        "Expands the chain's ability to attract credit, leverage, and capital-efficient protocol activity instead of relying only on spot liquidity.",
      partialChainImpact:
        "Improves protocol confidence that lending activity can scale without every team rebuilding the same money market patterns.",
      missingSummary:
        "Stand up a lending base layer so DeFi builders can launch with reusable collateral and credit infrastructure.",
      partialSummary:
        "Harden the current lending posture into a clearer chain-level primitive for ecosystem DeFi protocols.",
      gapImpact: {
        missing:
          "Without chain-level lending rails, the DeFi economy cannot compound liquidity into deeper borrowing and leverage activity.",
        partial:
          "Lending exists in parts, but the current market structure is still too thin to support a stronger DeFi flywheel.",
      },
    }),
    liquidity: createRule({
      deploymentPhaseKey: "liquidity",
      missingTitle: "Activate Liquidity Infrastructure Stack",
      partialTitle: "Upgrade Liquidity Infrastructure Stack",
      whyItMatters:
        "Liquidity infrastructure determines whether protocols can price assets, route trades, and support usable TVL across the ecosystem.",
      missingResult:
        "Adds the base routing and pool infrastructure needed for swaps, liquidity formation, and token-to-token composability.",
      partialResult:
        "Strengthens thin or fragmented liquidity into a more coherent routing layer that reduces slippage and integration risk for DeFi teams.",
      missingChainImpact:
        "Makes it easier for the chain to capture TVL and trading activity by improving the reliability of core liquidity rails.",
      partialChainImpact:
        "Improves capital efficiency across existing pools so more protocols can launch without being blocked by fragmented depth.",
      missingSummary:
        "Deploy a dedicated liquidity layer so DeFi apps have a credible base for swaps, pools, and TVL formation.",
      partialSummary:
        "Consolidate the current liquidity posture into stronger routing and pool infrastructure for ecosystem-wide use.",
      gapImpact: {
        missing:
          "A weak liquidity layer limits TVL growth, protocol launch confidence, and the chain's ability to retain capital.",
        partial:
          "Liquidity exists, but fragmentation still caps routing quality and weakens DeFi composability.",
      },
    }),
    oracles: createRule({
      deploymentPhaseKey: "foundation",
      missingTitle: "Activate Oracle Layer",
      partialTitle: "Upgrade Oracle Layer",
      whyItMatters:
        "Lending, derivatives, and liquid staking all depend on timely price and reference data. Weak oracle coverage keeps DeFi primitives shallow.",
      missingResult:
        "Introduces dependable external data rails so protocols can price assets, manage collateral, and settle with fewer trust gaps.",
      partialResult:
        "Improves oracle coverage and packaging so more DeFi products can rely on consistent reference data without custom integrations.",
      missingChainImpact:
        "Raises protocol confidence that more sophisticated DeFi products can launch safely on the chain.",
      partialChainImpact:
        "Reduces launch friction for lending, derivatives, and staking products that need stronger data guarantees.",
      missingSummary:
        "Add a chain-level oracle layer so pricing and collateral logic can support a broader DeFi stack.",
      partialSummary:
        "Strengthen current oracle coverage so DeFi protocols can depend on consistent data inputs at launch.",
      gapImpact: {
        missing:
          "Without dependable oracle coverage, capital formation stays narrow because core DeFi protocols cannot price or liquidate safely.",
        partial:
          "Oracle support exists, but gaps still force builders into custom data work and reduce protocol confidence.",
      },
    }),
    indexing: createRule({
      deploymentPhaseKey: "enablement",
      missingTitle: "Activate DeFi Indexing Layer",
      partialTitle: "Upgrade DeFi Indexing Layer",
      whyItMatters:
        "DeFi ecosystems need searchable state for positions, pools, lending events, and protocol analytics. Indexing is the operational layer for composability.",
      missingResult:
        "Adds queryable state and event infrastructure so wallets, dashboards, and protocols can observe DeFi activity without bespoke backend work.",
      partialResult:
        "Turns generic indexing into a more useful DeFi operations layer for positions, pool discovery, and ecosystem monitoring.",
      missingChainImpact:
        "Improves protocol operability and ecosystem visibility, making the chain easier to integrate into analytics, dashboards, and routing surfaces.",
      partialChainImpact:
        "Shortens time-to-launch for teams that need better position data and protocol observability to ship production DeFi products.",
      missingSummary:
        "Deploy a DeFi indexing layer so positions, pools, and protocol events become easier to query across the chain.",
      partialSummary:
        "Package current indexing into a stronger DeFi operations layer for protocol analytics and monitoring.",
      gapImpact: {
        missing:
          "Without a clear indexing layer, DeFi teams face higher integration costs and weaker visibility into ecosystem activity.",
        partial:
          "Data access exists, but it is still too generic to support faster ecosystem-level DeFi adoption.",
      },
    }),
    "liquid-staking": createRule({
      deploymentPhaseKey: "capital-efficiency",
      missingTitle: "Activate Liquid Staking Stack",
      partialTitle: "Upgrade Liquid Staking Stack",
      whyItMatters:
        "Liquid staking keeps staked assets productive across DeFi protocols. It is a direct lever on capital efficiency, TVL retention, and yield composability.",
      missingResult:
        "Introduces staking derivatives, validator integrations, and distribution flows that let staked capital remain usable inside DeFi.",
      partialResult:
        "Upgrades early liquid staking support into a more standardized yield layer that integrates better with pools, lending, and trading surfaces.",
      missingChainImpact:
        "Increases the chain's ability to retain staked capital inside its own DeFi economy instead of leaking yield activity elsewhere.",
      partialChainImpact:
        "Improves capital efficiency across the existing DeFi stack by making staked assets easier to route into new liquidity and lending products.",
      missingSummary:
        "Launch liquid staking as a first-class DeFi primitive so staked capital can participate in broader protocol activity.",
      partialSummary:
        "Standardize and deepen the current liquid staking posture so more DeFi teams can compose around staked assets.",
      gapImpact: {
        missing:
          "Without liquid staking, staked assets are less productive and the chain loses a key capital-efficiency wedge inside DeFi.",
        partial:
          "Liquid staking exists, but weak integration and standardization still limit its effect on TVL and protocol composability.",
      },
    }),
  },
  "rwa-infrastructure": {
    "asset-registry": createRule({
      deploymentPhaseKey: "issuance",
      missingTitle: "Activate Asset Registry Stack",
      partialTitle: "Upgrade Asset Registry Stack",
      whyItMatters:
        "Tokenized real-world assets need a clear issuance and asset identity layer before investors, issuers, and operators can coordinate around them.",
      missingResult:
        "Introduces a canonical registry for asset issuance, metadata, and token lifecycle management.",
      partialResult:
        "Turns fragmented asset records into a clearer issuance layer that is easier for issuers, investors, and service providers to rely on.",
      missingChainImpact:
        "Improves the chain's ability to position itself as a credible base for tokenized asset issuance and servicing.",
      partialChainImpact:
        "Reduces fragmentation around asset identity so more RWA issuers can launch on shared infrastructure rather than bespoke rails.",
      missingSummary:
        "Stand up an asset registry layer so tokenized assets have a canonical source of issuance and metadata truth.",
      partialSummary:
        "Harden the current registry posture into a clearer issuance primitive for tokenized real-world assets.",
      gapImpact: {
        missing:
          "Without a canonical asset registry, RWA issuance stays fragmented and harder for institutional counterparties to trust.",
        partial:
          "Registry support exists, but fragmentation still weakens interoperability and issuer confidence.",
      },
    }),
    compliance: createRule({
      deploymentPhaseKey: "compliance",
      missingTitle: "Activate Compliance Infrastructure",
      partialTitle: "Upgrade Compliance Infrastructure",
      whyItMatters:
        "RWA activity depends on permissioning, policy controls, and auditability. Compliance rails are part of the infrastructure, not an optional add-on.",
      missingResult:
        "Adds the policy and eligibility layer needed to support permissioned issuance, transfers, and institutional workflows.",
      partialResult:
        "Strengthens existing compliance controls into a clearer operating layer that can support broader issuer and partner requirements.",
      missingChainImpact:
        "Improves the chain's ability to serve regulated asset workflows and partner conversations that require stronger compliance posture.",
      partialChainImpact:
        "Makes current RWA efforts easier to operationalize by reducing policy gaps and manual workflow risk.",
      missingSummary:
        "Deploy a compliance layer so tokenized assets can move through policy-aware workflows from day one.",
      partialSummary:
        "Expand the current compliance posture into a more defensible operating layer for institutional RWA programs.",
      gapImpact: {
        missing:
          "Without compliance infrastructure, the chain has a weak answer to issuer policy, transfer restrictions, and audit expectations.",
        partial:
          "Compliance controls exist in parts, but the current posture is still too weak for more demanding RWA workflows.",
      },
    }),
    oracles: createRule({
      deploymentPhaseKey: "verification",
      missingTitle: "Activate Oracle Verification Layer",
      partialTitle: "Upgrade Oracle Verification Layer",
      whyItMatters:
        "RWA products need external data for pricing, reference values, and verification events. Weak oracle coverage increases trust gaps around issued assets.",
      missingResult:
        "Introduces reference data and verification rails so issued assets can sync to offchain conditions with clearer integrity checks.",
      partialResult:
        "Improves the reliability and packaging of external data so more RWA products can operate with fewer manual dependencies.",
      missingChainImpact:
        "Raises confidence that tokenized assets on the chain can maintain pricing and verification integrity over time.",
      partialChainImpact:
        "Makes the existing RWA stack easier to trust by reducing uncertainty around data inputs and verification workflows.",
      missingSummary:
        "Add oracle verification so tokenized assets can anchor to external facts and valuation signals more credibly.",
      partialSummary:
        "Strengthen current oracle coverage so RWA products can rely on clearer verification and pricing rails.",
      gapImpact: {
        missing:
          "Without external verification data, RWA products face larger trust gaps around valuation, status changes, and settlement conditions.",
        partial:
          "Oracle support exists, but weak coverage still limits which RWA products can launch with confidence.",
      },
    }),
    settlement: createRule({
      deploymentPhaseKey: "settlement",
      missingTitle: "Activate Settlement Layer",
      partialTitle: "Upgrade Settlement Layer",
      whyItMatters:
        "Issuance alone is not enough for RWAs. Chains also need dependable settlement flows for transfers, servicing, and post-trade operations.",
      missingResult:
        "Adds the core settlement rails needed to move tokenized assets through transfers, servicing, and lifecycle events.",
      partialResult:
        "Turns fragmented settlement support into a more coherent operating layer for asset movement and post-trade workflows.",
      missingChainImpact:
        "Improves the chain's ability to support complete RWA transaction flows instead of stopping at issuance.",
      partialChainImpact:
        "Raises operational credibility by making current asset flows easier to settle, service, and reconcile.",
      missingSummary:
        "Deploy a settlement layer so RWA programs can operate beyond asset issuance into real transaction workflows.",
      partialSummary:
        "Strengthen the current settlement posture so tokenized assets can move and reconcile with less workflow friction.",
      gapImpact: {
        missing:
          "Without dependable settlement infrastructure, the chain cannot support end-to-end RWA transaction flows in a credible way.",
        partial:
          "Settlement works in parts, but weak operational rails still limit larger RWA programs.",
      },
    }),
  },
  "prediction-markets": {
    oracles: createRule({
      deploymentPhaseKey: "resolution",
      missingTitle: "Activate Oracle Infrastructure",
      partialTitle: "Upgrade Oracle Infrastructure",
      whyItMatters:
        "Prediction markets depend on reliable event resolution. Without strong oracle rails, market outcomes remain too hard to trust.",
      missingResult:
        "Introduces the resolution layer needed to settle prediction markets against clear external outcomes.",
      partialResult:
        "Improves oracle packaging so existing market infrastructure can resolve faster and with fewer integrity concerns.",
      missingChainImpact:
        "Makes the chain a more credible venue for prediction markets by improving trust in how outcomes are resolved.",
      partialChainImpact:
        "Reduces uncertainty around market settlement, which helps more builders launch outcome-driven applications.",
      missingSummary:
        "Add an oracle resolution layer so prediction markets can settle against trusted external outcomes.",
      partialSummary:
        "Strengthen current oracle support so market resolution becomes easier for builders and users to trust.",
      gapImpact: {
        missing:
          "Without dependable resolution data, prediction markets cannot reach credible settlement at scale.",
        partial:
          "Resolution works in parts, but reliability gaps still weaken trust in market outcomes.",
      },
    }),
    "market-contracts": createRule({
      deploymentPhaseKey: "foundation",
      missingTitle: "Activate Prediction Market Stack",
      partialTitle: "Upgrade Prediction Market Stack",
      whyItMatters:
        "Chains need reusable market contracts before builders can create outcome markets without rebuilding the core stack every time.",
      missingResult:
        "Introduces a canonical market contract layer for market creation, position management, and settlement hooks.",
      partialResult:
        "Turns fragmented market logic into a clearer contract foundation that more prediction apps can reuse.",
      missingChainImpact:
        "Improves the chain's ability to attract prediction market builders by lowering the cost of launching new markets.",
      partialChainImpact:
        "Reduces product launch friction by turning partial market support into a clearer ecosystem primitive.",
      missingSummary:
        "Deploy a reusable market contract stack so new outcome markets can launch without bespoke core infrastructure.",
      partialSummary:
        "Harden current market contracts into a clearer base layer for ecosystem-level prediction products.",
      gapImpact: {
        missing:
          "Without reusable market contracts, prediction builders face too much foundational work to launch at speed.",
        partial:
          "Market logic exists, but it is still too fragmented to support broader ecosystem adoption.",
      },
    }),
    indexing: createRule({
      deploymentPhaseKey: "resolution",
      missingTitle: "Activate Prediction Market Indexing Layer",
      partialTitle: "Upgrade Prediction Market Indexing Layer",
      whyItMatters:
        "Prediction apps need indexed positions, markets, and event history so users and protocols can discover live market state.",
      missingResult:
        "Adds searchable market and position data so wallets, apps, and analytics surfaces can track prediction activity in real time.",
      partialResult:
        "Turns generic indexing into a more useful market operations layer for active positions, discovery, and monitoring.",
      missingChainImpact:
        "Improves discoverability and operational visibility, making the chain easier to integrate into prediction apps and dashboards.",
      partialChainImpact:
        "Shortens launch time for market builders that need clearer indexing for analytics, monitoring, and user-facing products.",
      missingSummary:
        "Deploy a prediction-focused indexing layer so market state and positions become easier to query across the ecosystem.",
      partialSummary:
        "Package current indexing into a stronger discovery and monitoring layer for prediction markets.",
      gapImpact: {
        missing:
          "Without indexed market data, prediction products are harder to discover, monitor, and operate at ecosystem level.",
        partial:
          "Indexing exists, but it still lacks the structure needed for smoother market discovery and operations.",
      },
    }),
    liquidity: createRule({
      deploymentPhaseKey: "liquidity",
      missingTitle: "Activate Liquidity Rails",
      partialTitle: "Upgrade Liquidity Rails",
      whyItMatters:
        "Prediction markets need liquidity support so markets can price efficiently and retain trader attention over time.",
      missingResult:
        "Introduces liquidity rails that help new and existing markets sustain tighter pricing and more usable depth.",
      partialResult:
        "Improves current liquidity support so prediction markets can maintain better pricing and participation quality.",
      missingChainImpact:
        "Raises the chain's ability to sustain active markets instead of hosting thin, low-signal outcomes.",
      partialChainImpact:
        "Improves trader experience and market resilience by making existing liquidity support more dependable.",
      missingSummary:
        "Deploy liquidity rails so prediction markets can hold attention with tighter spreads and deeper participation.",
      partialSummary:
        "Strengthen current liquidity support so outcome markets price and retain activity more effectively.",
      gapImpact: {
        missing:
          "Without dedicated liquidity support, prediction markets stay thin and struggle to produce reliable price signals.",
        partial:
          "Liquidity exists, but weak depth still limits market quality and user confidence.",
      },
    }),
  },
};
