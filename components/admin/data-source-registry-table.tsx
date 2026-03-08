import type { DataSourceRegistryGroup } from "@/lib/admin/data-source-registry";

export function DataSourceRegistryTable({
  groups,
}: {
  groups: DataSourceRegistryGroup[];
}) {
  function getDefaultCurrentProvenance(entry: DataSourceRegistryGroup["entries"][number]) {
    switch (entry.originType) {
      case "external API":
      case "external query source":
        return "Synced external snapshot with Atlas fallback preservation.";
      case "internal manual/admin-managed assumption":
        return "Active Atlas admin-managed configuration.";
      case "internal Atlas-derived metric":
        return "Derived inside Atlas from the active inputs and assumptions.";
      case "seed/fallback dataset":
        return "Atlas-managed manual or fallback dataset.";
      default:
        return "Atlas dataset provenance.";
    }
  }

  function getDefaultEditScope(entry: DataSourceRegistryGroup["entries"][number]) {
    switch (entry.originType) {
      case "internal manual/admin-managed assumption":
        return "Editable from this page";
      case "seed/fallback dataset":
        return "Editable when this dataset is manual";
      case "internal Atlas-derived metric":
        return "Indirect only via inputs";
      default:
        return "No direct edit";
    }
  }

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.title} className="space-y-4">
          <div>
            <p className="text-muted text-xs tracking-[0.16em] uppercase">
              {group.title}
            </p>
            <p className="text-muted mt-2 max-w-4xl text-sm leading-6">
              {group.description}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-border/70 border-b">
                  <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                    Metric
                  </th>
                  <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                    Source category
                  </th>
                  <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                    Current provenance
                  </th>
                  <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                    Admin edit path
                  </th>
                  <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                    Source
                  </th>
                  <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                    Reference
                  </th>
                  <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                    Origin type
                  </th>
                  <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                    Refresh behavior
                  </th>
                  <th className="py-3 pr-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                    Last updated
                  </th>
                  <th className="py-3 text-xs font-semibold tracking-[0.16em] uppercase text-muted">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.entries.map((entry) => (
                  <tr
                    key={`${group.title}:${entry.metricName}`}
                    className="border-border/60 border-b align-top last:border-b-0"
                  >
                    <td className="py-4 pr-4">
                      <p className="text-foreground font-semibold">
                        {entry.metricName}
                      </p>
                      <p className="text-muted mt-2 max-w-sm leading-6">
                        {entry.description}
                      </p>
                    </td>
                    <td className="text-foreground py-4 pr-4">
                      {entry.sourceCategory}
                    </td>
                    <td className="text-muted py-4 pr-4 leading-6">
                      {entry.currentProvenance ??
                        getDefaultCurrentProvenance(entry)}
                    </td>
                    <td className="text-foreground py-4 pr-4">
                      {entry.adminEditScope ?? getDefaultEditScope(entry)}
                    </td>
                    <td className="text-foreground py-4 pr-4">
                      {entry.sourceName}
                    </td>
                    <td className="text-muted py-4 pr-4">{entry.sourceReference}</td>
                    <td className="text-foreground py-4 pr-4">{entry.originType}</td>
                    <td className="text-muted py-4 pr-4 leading-6">
                      {entry.refreshBehavior}
                    </td>
                    <td className="text-foreground py-4 pr-4">{entry.lastUpdated}</td>
                    <td className="text-muted py-4 leading-6">
                      {entry.notes ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
