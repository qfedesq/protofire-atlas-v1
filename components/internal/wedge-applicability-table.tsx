import { getEconomyTypeBySlug } from "@/lib/config/economies";
import type { WedgeApplicability } from "@/lib/domain/types";

function formatApplicabilityStatus(value: WedgeApplicability["applicabilityStatus"]) {
  switch (value) {
    case "applicable":
      return "Applicable";
    case "partially_applicable":
      return "Partially applicable";
    case "not_applicable":
      return "Not applicable";
    case "unknown":
    default:
      return "Unknown";
  }
}

function formatConfidence(value: WedgeApplicability["confidenceLevel"]) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function WedgeApplicabilityTable({
  rows,
  showSourceBasis = false,
}: {
  rows: WedgeApplicability[];
  showSourceBasis?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-border/70 border-b">
            <th className="py-3 pr-4 text-xs font-medium tracking-[0.16em] uppercase text-muted">
              Wedge
            </th>
            <th className="py-3 pr-4 text-xs font-medium tracking-[0.16em] uppercase text-muted">
              Applicability
            </th>
            <th className="py-3 pr-4 text-xs font-medium tracking-[0.16em] uppercase text-muted">
              Confidence
            </th>
            <th className="py-3 pr-4 text-xs font-medium tracking-[0.16em] uppercase text-muted">
              Prerequisites
            </th>
            <th className="py-3 pr-4 text-xs font-medium tracking-[0.16em] uppercase text-muted">
              Technical constraints
            </th>
            {showSourceBasis ? (
              <th className="py-3 text-xs font-medium tracking-[0.16em] uppercase text-muted">
                Source basis
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const wedge = getEconomyTypeBySlug(row.wedgeId);

            return (
              <tr
                key={`${row.chainSlug}:${row.wedgeId}`}
                className="border-border/60 border-b align-top last:border-b-0"
              >
                <td className="py-4 pr-4">
                  <p className="text-foreground font-semibold">
                    {wedge?.name ?? row.wedgeId}
                  </p>
                  <p className="text-muted mt-1 leading-6">{row.rationale}</p>
                </td>
                <td className="text-foreground py-4 pr-4">
                  {formatApplicabilityStatus(row.applicabilityStatus)}
                  {row.manualReviewRecommended ? (
                    <p className="text-muted mt-1 text-xs">
                      Manual review recommended
                    </p>
                  ) : null}
                </td>
                <td className="text-foreground py-4 pr-4">
                  {formatConfidence(row.confidenceLevel)}
                </td>
                <td className="text-muted py-4 pr-4 leading-6">
                  {row.requiredPrerequisites.length > 0
                    ? row.requiredPrerequisites.join(", ")
                    : "None"}
                </td>
                <td className="text-muted py-4 pr-4 leading-6">
                  {row.technicalConstraints.length > 0
                    ? row.technicalConstraints.join(", ")
                    : "None"}
                </td>
                {showSourceBasis ? (
                  <td className="text-muted py-4 leading-6">{row.sourceBasis}</td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
