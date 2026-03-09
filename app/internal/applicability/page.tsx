import Link from "next/link";

import { WedgeApplicabilityTable } from "@/components/internal/wedge-applicability-table";
import { requireAuthenticatedInternalUser } from "@/lib/admin/auth";
import { buildApplicabilityInsights } from "@/lib/applicability/insights";
import { createSeedChainsRepository } from "@/lib/repositories/seed-chains-repository";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

const repository = createSeedChainsRepository();

export default async function InternalApplicabilityPage() {
  await ensureAtlasPersistence();
  await requireAuthenticatedInternalUser("/internal/applicability");

  const summaries = repository.listWedgeApplicabilitySummaries();
  const rows = repository.listApplicabilityMatrixRows();
  const insights = buildApplicabilityInsights(rows, repository.listEconomies());

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Internal applicability
            </p>
            <h1 className="text-foreground text-3xl font-semibold">
              Wedge applicability matrix
            </h1>
            <p className="text-muted max-w-4xl text-sm leading-6">
              This matrix is the deterministic technical fit layer that sits
              before readiness. It asks whether each wedge is realistically
              deployable on the chain at all, rather than how mature the chain
              already is.
            </p>
          </div>
          <Link
            href="/internal/admin/data-sources"
            className="text-accent text-sm font-medium hover:underline"
          >
            Open admin controls
          </Link>
        </div>
      </section>

      <section className="border-border/70 space-y-4 border-t pt-6">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Summary
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Applicability by wedge
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-border/70 border-b">
                <th className="py-3 pr-4 text-xs font-medium tracking-[0.16em] uppercase text-muted">
                  Wedge
                </th>
                <th className="py-3 pr-4 text-xs font-medium tracking-[0.16em] uppercase text-muted">
                  Applicable
                </th>
                <th className="py-3 pr-4 text-xs font-medium tracking-[0.16em] uppercase text-muted">
                  Partial
                </th>
                <th className="py-3 pr-4 text-xs font-medium tracking-[0.16em] uppercase text-muted">
                  Not applicable
                </th>
                <th className="py-3 pr-4 text-xs font-medium tracking-[0.16em] uppercase text-muted">
                  Unknown
                </th>
                <th className="py-3 text-xs font-medium tracking-[0.16em] uppercase text-muted">
                  Manual review
                </th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((summary) => (
                <tr
                  key={summary.wedge.slug}
                  className="border-border/60 border-b last:border-b-0"
                >
                  <td className="text-foreground py-4 pr-4 font-semibold">
                    {summary.wedge.name}
                  </td>
                  <td className="py-4 pr-4">{summary.applicable}</td>
                  <td className="py-4 pr-4">{summary.partiallyApplicable}</td>
                  <td className="py-4 pr-4">{summary.notApplicable}</td>
                  <td className="py-4 pr-4">{summary.unknown}</td>
                  <td className="py-4">{summary.manualReviewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-border/70 space-y-6 border-t pt-6">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Matrix
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Per-chain wedge assessments
          </h2>
        </div>

        <div className="space-y-8">
          {rows.map((row) => (
            <div key={row.chain.slug} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-foreground text-lg font-semibold">
                    {row.chain.name}
                  </h3>
                  <p className="text-muted text-sm leading-6">
                    Architecture: {row.technicalProfile.architectureKind} ·
                    Confidence: {row.technicalProfile.dataConfidence}
                  </p>
                </div>
                <Link
                  href={`/chains/${row.chain.slug}`}
                  className="text-accent text-sm font-medium hover:underline"
                >
                  Open chain page
                </Link>
              </div>
              <WedgeApplicabilityTable rows={row.wedges} showSourceBasis />
            </div>
          ))}
        </div>
      </section>

      <section className="border-border/70 space-y-6 border-t pt-6">
        <div>
          <p className="text-muted text-xs tracking-[0.16em] uppercase">
            Review queue
          </p>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">
            Strong readiness, weak applicability confidence, and manual review
          </h2>
        </div>

        {[
          {
            title: "Strong readiness with weak applicability confidence",
            rows: insights.strongReadinessWeakConfidence,
          },
          {
            title: "Wedge assumption revision candidates",
            rows: insights.assumptionRevisionCandidates,
          },
          {
            title: "Manual review flags",
            rows: insights.manualReviewFlags,
          },
        ].map((group) => (
          <div key={group.title} className="space-y-3">
            <h3 className="text-foreground text-lg font-semibold">{group.title}</h3>
            {group.rows.length > 0 ? (
              <ul className="space-y-3 text-sm">
                {group.rows.map((row) => (
                  <li
                    key={`${group.title}:${row.chainSlug}:${row.wedgeName}`}
                    className="border-border/60 border-b pb-3 last:border-b-0"
                  >
                    <p className="text-foreground font-medium">
                      {row.chainName} · {row.wedgeName}
                    </p>
                    <p className="text-muted leading-6">
                      Readiness {row.readinessScore.toFixed(1)} · Applicability{" "}
                      {row.applicabilityStatus} · Confidence {row.confidenceLevel}
                    </p>
                    <p className="text-muted leading-6">{row.reason}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-sm leading-6">No current flags.</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
