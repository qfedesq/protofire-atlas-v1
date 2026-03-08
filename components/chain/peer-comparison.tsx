import Link from "next/link";

import type { ChainProfile } from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

export function PeerComparisonSection({
  profile,
}: {
  profile: ChainProfile;
}) {
  if (profile.peers.length === 0) {
    return (
      <div className="border-border/70 border-t pt-4">
        <p className="text-muted text-sm leading-6">
          No nearby peers are available in the current benchmark slice for this
          chain and economy.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/70 divide-y border-t">
      {profile.peers.map((peer) => (
        <div key={`${profile.economy.slug}:${peer.chain.slug}`} className="space-y-4 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-accent text-xs tracking-[0.16em] uppercase">
                {peer.relativePosition === "above"
                  ? "Nearby chain ahead"
                  : "Nearby chain behind"}
              </p>
              <h3 className="text-foreground mt-2 text-2xl font-semibold">
                {peer.chain.name}
              </h3>
            </div>
            <p className="text-muted text-sm">
              Rank #{peer.rank} · Score {formatScore(peer.totalScore)}
            </p>
          </div>

          <p className="text-muted text-sm leading-6">
            Gap versus {profile.chain.name}: {formatScore(peer.scoreGap)} points.
          </p>

          <div className="border-l border-[var(--border)] pl-4">
            {peer.decisiveModules.length === 0 ? (
              <p className="text-muted text-sm leading-6">
                This peer has no material module delta in the current readiness
                model.
              </p>
            ) : (
              <div className="space-y-3">
                {peer.decisiveModules.map((delta) => (
                  <div key={`${peer.chain.slug}:${delta.module.id}`} className="text-sm">
                    <p className="text-foreground font-medium">{delta.module.name}</p>
                    <p className="text-muted mt-1 leading-6">
                      {profile.chain.name}: {delta.currentStatus} | {peer.chain.name}:{" "}
                      {delta.peerStatus}
                    </p>
                    <p className="text-muted mt-1 leading-6">
                      This module explains up to {formatScore(delta.weightedGap)}{" "}
                      points of the nearby rank gap.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/chains/${peer.chain.slug}?economy=${profile.economy.slug}&from=peer-comparison`}
            className="text-accent inline-flex text-sm font-semibold hover:underline"
          >
            Open comparison profile
          </Link>
        </div>
      ))}
    </div>
  );
}
