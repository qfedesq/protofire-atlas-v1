import type { DeploymentPlan } from "@/lib/domain/types";

type DeploymentPlanSectionProps = {
  plan: DeploymentPlan;
  layout?: "stacked" | "grid";
};

export function DeploymentPlanSection({
  plan,
}: DeploymentPlanSectionProps) {
  if (plan.phases.length === 0) {
    return (
      <div className="border-border/70 border-t pt-4">
        <p className="text-muted text-sm leading-6">
          No phased rollout is required from the current Atlas dataset. Protofire
          can move directly into benchmarking and readiness messaging support.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/70 divide-y border-t">
      {plan.phases.map((phase) => (
        <div key={phase.id} className="space-y-4 py-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-accent text-xs tracking-[0.16em] uppercase">
                {phase.label}
              </p>
              <h3 className="text-foreground mt-2 text-2xl font-semibold">
                {phase.title}
              </h3>
            </div>
            <p className="text-muted text-sm">{phase.timelineLabel}</p>
          </div>

          <dl className="grid gap-4 border-l border-[var(--border)] pl-4 md:grid-cols-3 md:border-l-0 md:pl-0">
            {phase.kpis.map((kpi) => (
              <div key={`${phase.id}-${kpi.label}`}>
                <dt className="text-muted text-xs tracking-[0.16em] uppercase">
                  {kpi.label}
                </dt>
                <dd className="text-foreground mt-2 text-2xl font-semibold">
                  {kpi.value}
                </dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="text-muted text-xs tracking-[0.16em] uppercase">
              Objective
            </p>
            <p className="text-foreground mt-2 text-sm leading-6">
              {phase.objective}
            </p>
          </div>

          <div>
            <p className="text-muted text-xs tracking-[0.16em] uppercase">Tasks</p>
            <ul className="mt-3 space-y-3 text-sm text-foreground">
              {phase.tasks.map((task) => (
                <li key={task} className="flex gap-3">
                  <span className="bg-accent mt-2 h-1.5 w-1.5 shrink-0" />
                  <span className="leading-6">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
