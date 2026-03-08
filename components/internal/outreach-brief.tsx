import { Panel } from "@/components/ui/panel";
import type { OutreachBrief } from "@/lib/domain/types";

export function OutreachBriefSection({
  brief,
}: {
  brief: OutreachBrief;
}) {
  return (
    <Panel className="space-y-5">
      <div>
        <p className="text-accent text-xs tracking-[0.16em] uppercase">
          Outreach brief
        </p>
        <h2 className="text-foreground mt-2 text-2xl font-semibold">
          Deterministic GTM summary
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Snapshot
          </p>
          <div className="border-border/70 divide-y border-t text-sm">
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-muted">Chain</span>
              <span className="text-foreground font-medium">
                {brief.chainName}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-muted">Economy</span>
              <span className="text-foreground font-medium">
                {brief.economyName}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-muted">Global rank</span>
              <span className="text-foreground font-medium">#{brief.globalRank}</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-muted">Economy rank</span>
              <span className="text-foreground font-medium">
                #{brief.economyRank}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Key gaps
          </p>
          <ul className="border-border/70 space-y-3 border-t pt-3 text-sm leading-6">
            {brief.keyGaps.map((gap) => (
              <li key={gap} className="text-foreground">
                {gap}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div>
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Peer comparison
          </p>
          <p className="text-muted mt-3 text-sm leading-6">{brief.peerSummary}</p>
        </div>
        <div>
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Protofire opportunity
          </p>
          <p className="text-muted mt-3 text-sm leading-6">
            {brief.protofireOpportunity}
          </p>
        </div>
        <div>
          <p className="text-muted text-xs tracking-[0.14em] uppercase">
            Suggested outreach angle
          </p>
          <p className="text-muted mt-3 text-sm leading-6">
            {brief.suggestedOutreachAngle}
          </p>
        </div>
      </div>
    </Panel>
  );
}
