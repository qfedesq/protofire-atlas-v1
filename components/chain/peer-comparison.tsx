import Link from "next/link";

import { Panel } from "@/components/ui/panel";
import type { ChainProfile } from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

export function PeerComparisonSection({
  profile,
}: {
  profile: ChainProfile;
}) {
  if (profile.peers.length === 0) {
    return (
      <Panel>
        <p className="text-muted text-sm leading-6">
          No nearby peers are available in the current benchmark slice for this
          chain and economy.
        </p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {profile.peers.map((peer) => (
        <Panel key={`${profile.economy.slug}:${peer.chain.slug}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-accent text-xs tracking-[0.16em] uppercase">
                {peer.relativePosition === "above"
                  ? "Nearby chain ahead"
                  : "Nearby chain behind"}
              </p>
              <h3 className="text-foreground mt-2 text-xl font-semibold">
                {peer.chain.name}
              </h3>
            </div>
            <p className="text-muted text-sm">#{peer.rank}</p>
          </div>
          <p className="text-muted mt-3 text-sm leading-6">
            Score {formatScore(peer.totalScore)}. Gap versus {profile.chain.name}:{" "}
            {formatScore(peer.scoreGap)} points.
          </p>
          <div className="mt-5 space-y-3">
            {peer.decisiveModules.length === 0 ? (
              <p className="text-muted text-sm leading-6">
                This peer has no material module delta in the current readiness
                model.
              </p>
            ) : (
              peer.decisiveModules.map((delta) => (
                <div
                  key={`${peer.chain.slug}:${delta.module.id}`}
                  className="bg-surface-muted rounded-2xl p-4 text-sm"
                >
                  <p className="text-foreground font-medium">
                    {delta.module.name}
                  </p>
                  <p className="text-muted mt-1 leading-6">
                    {profile.chain.name}: {delta.currentStatus} | {peer.chain.name}:{" "}
                    {delta.peerStatus}
                  </p>
                  <p className="text-muted mt-2 leading-6">
                    This module explains up to {formatScore(delta.weightedGap)}{" "}
                    points of the nearby rank gap.
                  </p>
                </div>
              ))
            )}
          </div>
          <Link
            href={`/chains/${peer.chain.slug}?economy=${profile.economy.slug}&from=peer-comparison`}
            className="text-accent mt-5 inline-flex text-sm font-semibold hover:underline"
          >
            Open comparison profile
          </Link>
        </Panel>
      ))}
    </div>
  );
}
