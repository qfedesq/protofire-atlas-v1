import { Panel } from "@/components/ui/panel";
import type { ScoreDriver } from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

export function ScoreDriversSection({
  drivers,
}: {
  drivers: ScoreDriver[];
}) {
  if (drivers.length === 0) {
    return (
      <Panel>
        <p className="text-muted text-sm leading-6">
          This chain already clears every module in the current Atlas model, so
          there is no remaining direct score upside from gap closure alone.
        </p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {drivers.slice(0, 3).map((driver) => (
        <Panel key={driver.module.id}>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            {driver.status === "missing" ? "Missing module" : "Partial module"}
          </p>
          <h3 className="text-foreground mt-2 text-xl font-semibold">
            {driver.module.name}
          </h3>
          <p className="text-muted mt-3 text-sm leading-6">
            Closing this gap can add up to {formatScore(driver.potentialGain)}{" "}
            points under the current active assumptions.
          </p>
          <div className="bg-surface-muted mt-5 space-y-3 rounded-2xl p-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted">Current contribution</span>
              <span className="text-foreground font-medium">
                {formatScore(driver.currentContribution)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted">Potential max</span>
              <span className="text-foreground font-medium">
                {formatScore(driver.maxContribution)}
              </span>
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}
