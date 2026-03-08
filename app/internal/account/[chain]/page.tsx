import { notFound, redirect } from "next/navigation";

import { GapAnalysis } from "@/components/chain/gap-analysis";
import { PeerComparisonSection } from "@/components/chain/peer-comparison";
import { RecommendedStackSection } from "@/components/stack/recommended-stack";
import { DeploymentPlanSection } from "@/components/stack/deployment-plan";
import { OutreachBriefSection } from "@/components/internal/outreach-brief";
import { Panel } from "@/components/ui/panel";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { parseEconomySelection } from "@/lib/domain/schemas";
import { formatScore } from "@/lib/utils/format";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";

const repository = createSeedChainsRepository();

type AccountPageProps = {
  params: Promise<{ chain: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountIntelligencePage({
  params,
  searchParams,
}: AccountPageProps) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/internal/admin");
  }

  const { chain } = await params;
  const parsedSearchParams = searchParams ? await searchParams : undefined;
  const economy = parsedSearchParams?.economy
    ? parseEconomySelection(parsedSearchParams)
    : undefined;
  const account = repository.getTargetAccountProfile(chain, economy);

  if (!account) {
    notFound();
  }

  const { profile, opportunity, outreachBrief } = account;

  return (
    <div className="space-y-6">
      <Panel className="space-y-4">
        <p className="text-accent text-xs tracking-[0.16em] uppercase">
          Account intelligence
        </p>
        <h1 className="text-foreground text-3xl font-semibold">
          {profile.chain.name}
        </h1>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-muted text-xs tracking-[0.14em] uppercase">
              Global rank
            </p>
            <p className="text-foreground mt-2 text-3xl font-semibold">
              #{profile.globalPosition.benchmarkRank}
            </p>
          </div>
          <div>
            <p className="text-muted text-xs tracking-[0.14em] uppercase">
              Opportunity score
            </p>
            <p className="text-foreground mt-2 text-3xl font-semibold">
              {formatScore(opportunity.opportunity.totalScore)}
            </p>
          </div>
          <div>
            <p className="text-muted text-xs tracking-[0.14em] uppercase">
              Economy focus
            </p>
            <p className="text-foreground mt-2 text-3xl font-semibold">
              {profile.economy.shortLabel}
            </p>
          </div>
          <div>
            <p className="text-muted text-xs tracking-[0.14em] uppercase">
              Priority
            </p>
            <p className="text-foreground mt-2 text-3xl font-semibold">
              {opportunity.priority}
            </p>
          </div>
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Gap analysis
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Missing modules and nearby benchmark pressure
          </h2>
        </div>
        <GapAnalysis
          gaps={profile.gapAnalysis}
          economyLabel={profile.economy.name}
        />
        <PeerComparisonSection profile={profile} />
      </Panel>

      <Panel className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Protofire opportunity
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Recommended wedge and deployment path
          </h2>
        </div>
        <RecommendedStackSection
          stack={profile.recommendedStack}
          layout="grid"
        />
        <DeploymentPlanSection plan={profile.deploymentPlan} layout="grid" />
      </Panel>

      <OutreachBriefSection brief={outreachBrief} />
    </div>
  );
}
