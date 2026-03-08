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
              <p className="text-muted mt-4 text-sm leading-6">
                {phase.objective}
              </p>
              <ul className="text-foreground mt-5 space-y-3 text-sm">
                {phase.tasks.map((task) => (
                  <li key={task} className="flex gap-3">
                    <span className="bg-accent mt-1 h-2 w-2 rounded-full" />
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
