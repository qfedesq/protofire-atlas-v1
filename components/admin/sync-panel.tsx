import { syncAtlasDataNowRedirectableAction } from "@/app/internal/admin/actions";
import type { ExternalConnectorSyncStatus } from "@/lib/domain/types";
import { Panel } from "@/components/ui/panel";

type SyncPanelProps = {
  redirectTo: string;
  snapshotUpdatedAt: string;
  connectorStatuses: ExternalConnectorSyncStatus[];
};

export function SyncPanel({
  redirectTo,
  snapshotUpdatedAt,
  connectorStatuses,
}: SyncPanelProps) {
  return (
    <Panel className="space-y-4">
      <div>
        <p className="text-muted text-xs tracking-[0.16em] uppercase">
          Source-backed refresh
        </p>
        <h2 className="text-foreground mt-2 text-2xl font-semibold">
          Sync supported Atlas sources
        </h2>
        <p className="text-muted mt-3 text-sm leading-6">
          Refreshes the external chain metrics snapshot Atlas uses for TVL,
          protocols, wallets, active users, and technical signals. This runs the
          in-process connector workflow and preserves the last valid snapshot
          when a source fails.
        </p>
        <p className="text-muted mt-2 text-sm leading-6">
          Current snapshot updated at <span className="text-foreground">{snapshotUpdatedAt}</span>.
        </p>
      </div>

      <div className="space-y-2 text-sm">
        {connectorStatuses.map((status) => (
          <div
            key={status.connector}
            className="border-border/70 flex flex-wrap items-start justify-between gap-3 border-t pt-3 first:border-t-0 first:pt-0"
          >
            <div>
              <p className="text-foreground font-medium">{status.connector}</p>
              <p className="text-muted mt-1 leading-6">{status.message}</p>
            </div>
            <p className="text-foreground text-xs font-medium tracking-[0.16em] uppercase">
              {status.status}
            </p>
          </div>
        ))}
      </div>

      <form action={syncAtlasDataNowRedirectableAction}>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
        >
          SYNC NOW
        </button>
      </form>
    </Panel>
  );
}
