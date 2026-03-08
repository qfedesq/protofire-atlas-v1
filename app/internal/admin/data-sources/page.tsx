import Link from "next/link";
import { redirect } from "next/navigation";

import { DataSourceRegistryTable } from "@/components/admin/data-source-registry-table";
import { Panel } from "@/components/ui/panel";
import { getDataSourceRegistry } from "@/lib/admin/data-source-registry";
import { getAdminAccessState, isAdminAuthenticated } from "@/lib/admin/auth";

export default async function AdminDataSourcesPage() {
  const access = getAdminAccessState();

  if (!access.enabled) {
    redirect("/internal/admin");
  }

  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/internal/admin");
  }

  const groups = getDataSourceRegistry();

  return (
    <div className="space-y-6">
      <Panel className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-accent text-xs tracking-[0.16em] uppercase">
              Internal admin
            </p>
            <h1 className="text-foreground mt-2 text-3xl font-semibold">
              Data source registry
            </h1>
            <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
              Operational registry of every blockchain-related metric Atlas uses,
              including source type, connector reference, refresh behavior, and
              current provenance notes.
            </p>
          </div>
          <Link href="/internal/admin" className="text-accent text-sm font-medium hover:underline">
            Back to admin
          </Link>
        </div>
      </Panel>

      <Panel>
        <DataSourceRegistryTable groups={groups} />
      </Panel>
    </div>
  );
}
