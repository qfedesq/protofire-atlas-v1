import { Panel } from "@/components/ui/panel";
import type { DeploymentPlan } from "@/lib/domain/types";

type DeploymentPlanSectionProps = {
  plan: DeploymentPlan;
};

export function DeploymentPlanSection({ plan }: DeploymentPlanSectionProps) {
  return (
    <div className="space-y-4">
      {plan.phases.length === 0 ? (
        <Panel>
          <p className="text-muted text-sm leading-6">
            No phased rollout is required from the current seeded dataset.
            Protofire can move directly into benchmarking and readiness
            messaging support.
          </p>
        </Panel>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {plan.phases.map((phase) => (
            <Panel key={phase.id}>
              <p className="text-accent text-xs tracking-[0.16em] uppercase">
                {phase.label}
              </p>
              <h3 className="text-foreground mt-2 text-xl font-semibold">
                {phase.title}
              </h3>
              <p className="text-muted mt-1 text-sm">{phase.timelineLabel}</p>
              <div className="border-border/70 bg-surface-muted mt-5 overflow-hidden rounded-2xl border">
                {phase.kpis.map((kpi) => (
                  <div
                    key={`${phase.id}-${kpi.label}`}
                    className="border-border/70 grid gap-3 border-b px-5 py-4 last:border-b-0 sm:grid-cols-[1fr_auto]"
                  >
                    <p className="text-muted text-[11px] font-semibold tracking-[0.18em] uppercase">
                      {kpi.label}
                    </p>
                    <p className="text-foreground text-right text-2xl font-semibold tracking-tight">
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-muted mt-4 text-sm leading-6">
                {phase.objective}
              </p>
              <ul className="text-foreground mt-5 space-y-3 text-sm">
                {phase.tasks.map((task) => (
                  <li key={task} className="flex gap-3">
                    <span className="bg-accent mt-1 h-2 w-2 rounded-sm" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
