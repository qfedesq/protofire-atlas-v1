import { BenchmarkStrip } from "@/components/chain/benchmark-strip";
import { PeerComparisonSection } from "@/components/chain/peer-comparison";
import type { ChainProfile } from "@/lib/domain/types";

export function CompetitiveAnalysisSection({
  profile,
}: {
  profile: ChainProfile;
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-accent text-xs tracking-[0.16em] uppercase">
          Competitive context
        </p>
        <h2 className="text-foreground mt-2 text-2xl font-semibold">
          How this chain compares to nearby peers
        </h2>
        <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
          Atlas compares nearby ranks in the same wedge so a chain can see who
          is ahead, how wide the gap is, and which module differences still
          explain position.
        </p>
      </div>

      <BenchmarkStrip
        rank={profile.rank}
        leader={profile.leader}
        leaderGap={profile.leaderGap}
        chainsOutranked={profile.chainsOutranked}
      />

      <PeerComparisonSection profile={profile} />
    </section>
  );
}
