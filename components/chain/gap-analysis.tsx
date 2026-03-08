import { StatusBadge } from "@/components/ui/status-badge";
import type { GapAnalysisItem } from "@/lib/domain/types";

export function GapAnalysis({
  gaps,
  economyLabel,
}: {
  gaps: GapAnalysisItem[];
  economyLabel: string;
}) {
  if (gaps.length === 0) {
    return (
      <div className="border-border/70 border-t pt-4">
        <p className="text-muted text-sm leading-6">
          No missing or partial modules remain in the current Atlas assessment.
          Protofire can focus on optimization and market positioning rather than
          core {economyLabel.toLowerCase()} gap closure.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/70 divide-y border-t">
      {gaps.map((gap) => (
        <div key={gap.module.id} className="space-y-4 py-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-foreground text-lg font-semibold">
                {gap.module.name}
              </p>
              <StatusBadge status={gap.status} />
            </div>
            <p className="text-muted text-sm leading-6">
              Infrastructure gap affecting {economyLabel.toLowerCase()} positioning.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Current gap
              </p>
              <p className="text-foreground mt-2 leading-6">{gap.problem}</p>
            </div>

            <div>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Why it matters
              </p>
              <p className="text-foreground mt-2 leading-6">{gap.impact}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
