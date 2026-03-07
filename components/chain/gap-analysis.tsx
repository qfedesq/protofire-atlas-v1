import { AlertTriangle } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import type { GapAnalysisItem } from "@/lib/domain/types";

export function GapAnalysis({
  gaps,
  economyLabel,
}: {
  gaps: GapAnalysisItem[];
  economyLabel: string;
}) {
  return (
    <div className="space-y-4">
      {gaps.length === 0 ? (
        <Panel>
          <p className="text-muted text-sm leading-6">
            No missing or partial modules remain in the current seeded
            assessment. Protofire can focus on optimization and market
            positioning rather than core {economyLabel.toLowerCase()} gap
            closure.
          </p>
        </Panel>
      ) : (
        gaps.map((gap) => (
          <Panel key={gap.module.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-rose-50 p-3 text-rose-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-foreground text-lg font-semibold">
                    {gap.module.name}
                  </p>
                  <p className="text-muted text-sm">
                    Infrastructure gap affecting {economyLabel.toLowerCase()}{" "}
                    positioning
                  </p>
                </div>
              </div>
              <StatusBadge status={gap.status} />
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-foreground text-sm font-medium">
                  Current gap
                </p>
                <p className="text-muted mt-2 text-sm leading-6">
                  {gap.problem}
                </p>
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">
                  Why it matters
                </p>
                <p className="text-muted mt-2 text-sm leading-6">
                  {gap.impact}
                </p>
              </div>
            </div>
          </Panel>
        ))
      )}
    </div>
  );
}
