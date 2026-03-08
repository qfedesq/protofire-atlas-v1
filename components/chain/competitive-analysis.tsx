import { BenchmarkStrip } from "@/components/chain/benchmark-strip";
import { PeerComparisonSection } from "@/components/chain/peer-comparison";
import type { ChainProfile } from "@/lib/domain/types";

export function CompetitiveAnalysisSection({
  profile,
}: {
  profile: ChainProfile;
}) {
  return (
    <div className="space-y-4">
      <p className="text-muted mt-1 max-w-4xl text-sm leading-6">
        Atlas compares nearby ranks in the same wedge so a chain can see who is
        ahead, how wide the gap is, and which module differences still explain
        position.
      </p>
      <BenchmarkStrip
        rank={profile.rank}
        leader={profile.leader}
        leaderGap={profile.leaderGap}
        chainsOutranked={profile.chainsOutranked}
      />

      <PeerComparisonSection profile={profile} />
    </div>
  );
}
