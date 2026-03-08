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
    <div className="border-border/70 grid gap-4 border-t pt-4 md:grid-cols-3">
      <div>
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          Current rank
        </p>
        <p className="text-foreground mt-2 text-2xl font-semibold">#{rank}</p>
      </div>
      <div>
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          Leader gap
        </p>
        <p className="text-foreground mt-2 text-2xl font-semibold">
          {formatDelta(leaderGap)}
        </p>
        <p className="text-muted mt-1 text-sm">Points behind {leader}</p>
      </div>
      <div>
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          Chains outranked
        </p>
        <p className="text-foreground mt-2 text-2xl font-semibold">
          {chainsOutranked}
        </p>
      </div>
    </div>
  );
}
