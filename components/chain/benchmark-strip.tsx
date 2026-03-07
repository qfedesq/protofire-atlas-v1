import { Panel } from "@/components/ui/panel";
import { formatDelta } from "@/lib/utils/format";

type BenchmarkStripProps = {
  rank: number;
  leader: string;
  leaderGap: number;
  chainsOutranked: number;
};

export function BenchmarkStrip({
  rank,
  leader,
  leaderGap,
  chainsOutranked,
}: BenchmarkStripProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Panel>
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          Position
        </p>
        <p className="text-foreground mt-3 text-3xl font-semibold">#{rank}</p>
        <p className="text-muted mt-2 text-sm">
          Deterministic rank in the current seeded Atlas dataset.
        </p>
      </Panel>
      <Panel>
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          Leader gap
        </p>
        <p className="text-foreground mt-3 text-3xl font-semibold">
          {formatDelta(leaderGap)}
        </p>
        <p className="text-muted mt-2 text-sm">
          Points behind {leader} on the 0-10 readiness scale.
        </p>
      </Panel>
      <Panel>
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          Chains outranked
        </p>
        <p className="text-foreground mt-3 text-3xl font-semibold">
          {chainsOutranked}
        </p>
        <p className="text-muted mt-2 text-sm">
          Competitive context from the same seeded benchmark.
        </p>
      </Panel>
    </div>
  );
}
