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
