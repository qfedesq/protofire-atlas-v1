import type { ScoreDriver } from "@/lib/domain/types";
import { formatScore } from "@/lib/utils/format";

export function ScoreDriversSection({
  drivers,
}: {
  drivers: ScoreDriver[];
}) {
  if (drivers.length === 0) {
    return (
      <div className="border-border/70 border-t pt-4">
        <p className="text-muted text-sm leading-6">
          This chain already clears every module in the current Atlas model, so
          there is no remaining direct score upside from gap closure alone.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-border/70 border-b">
            <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
              Module
            </th>
            <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
              Status
            </th>
            <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
              Current contribution
            </th>
            <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
              Potential max
            </th>
            <th className="py-3 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
              Atlas score lift
            </th>
          </tr>
        </thead>
        <tbody>
          {drivers.slice(0, 3).map((driver) => (
            <tr
              key={driver.module.id}
              className="border-border/60 border-b last:border-b-0"
            >
              <td className="py-4 pr-4 text-foreground font-semibold">
                {driver.module.name}
              </td>
              <td className="py-4 pr-4 text-foreground capitalize">
                {driver.status}
              </td>
              <td className="py-4 pr-4 text-foreground">
                {formatScore(driver.currentContribution)}
              </td>
              <td className="py-4 pr-4 text-foreground">
                {formatScore(driver.maxContribution)}
              </td>
              <td className="py-4 text-foreground font-semibold">
                +{formatScore(driver.potentialGain)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
