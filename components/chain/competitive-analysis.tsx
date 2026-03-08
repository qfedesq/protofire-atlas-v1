import { GapAnalysis } from "@/components/chain/gap-analysis";
import { PeerComparisonSection } from "@/components/chain/peer-comparison";
import { ScoreDriversSection } from "@/components/chain/score-drivers";
import type { ChainProfile } from "@/lib/domain/types";

export function CompetitiveAnalysisSection({
  profile,
}: {
  profile: ChainProfile;
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Gap analysis
          </p>
          <h3 className="text-foreground mt-2 text-xl font-semibold">
            What is still blocking readiness
          </h3>
        </div>
        <GapAnalysis
          gaps={profile.gapAnalysis}
          economyLabel={profile.economy.name}
        />
      </div>

      <div className="border-border/70 border-t pt-8">
        <div className="space-y-4">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              What moves your score
            </p>
            <h3 className="text-foreground mt-2 text-xl font-semibold">
              Highest-upside module improvements
            </h3>
          </div>
          <ScoreDriversSection drivers={profile.scoreDrivers} />
        </div>
      </div>

      <div className="border-border/70 border-t pt-8">
        <div className="space-y-4">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Peer comparison
            </p>
            <h3 className="text-foreground mt-2 text-xl font-semibold">
              Nearby chains in the same economy wedge
            </h3>
            <p className="text-muted mt-3 text-sm leading-6">
              Atlas compares the closest ranks above and below this chain to
              show where module gaps are still costing position.
            </p>
          </div>
          <PeerComparisonSection profile={profile} />
        </div>
      </div>
    </div>
  );
}
