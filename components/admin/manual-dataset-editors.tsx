import {
  resetManualDatasetAction,
  updateManualDatasetAction,
} from "@/app/internal/admin/actions";
import type {
  ManualDataOverrides,
  ManualDatasetKey,
} from "@/lib/admin/manual-data";
import { Panel } from "@/components/ui/panel";

type ManualDatasetConfig = {
  key: ManualDatasetKey;
  title: string;
  description: string;
  sourceNote: string;
  payload: unknown;
};

type ManualDatasetEditorsProps = {
  overrides: ManualDataOverrides;
  redirectTo: string;
  datasets: ManualDatasetConfig[];
};

function getOverrideMeta(
  overrides: ManualDataOverrides,
  datasetKey: ManualDatasetKey,
) {
  return overrides[datasetKey];
}

export function ManualDatasetEditors({
  overrides,
  redirectTo,
  datasets,
}: ManualDatasetEditorsProps) {
  return (
    <div className="space-y-4">
      {datasets.map((dataset) => {
        const override = getOverrideMeta(overrides, dataset.key);

        return (
          <Panel key={dataset.key} className="space-y-4">
            <div className="space-y-2">
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Manual dataset
              </p>
              <h2 className="text-foreground text-2xl font-semibold">
                {dataset.title}
              </h2>
              <p className="text-muted max-w-4xl text-sm leading-6">
                {dataset.description}
              </p>
              <p className="text-muted text-sm leading-6">
                Current source mode:{" "}
                <span className="text-foreground">
                  {override ? "Manual override active" : "Built-in Atlas dataset"}
                </span>
                . {dataset.sourceNote}
              </p>
              {override ? (
                <p className="text-muted text-sm leading-6">
                  Override updated at {override.updatedAt} by {override.updatedBy}.
                </p>
              ) : null}
            </div>

            <form action={updateManualDatasetAction} className="space-y-4">
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <input type="hidden" name="dataset" value={dataset.key} />
              <label
                htmlFor={`manual-${dataset.key}`}
                className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
              >
                JSON payload
              </label>
              <textarea
                id={`manual-${dataset.key}`}
                name="payload"
                defaultValue={JSON.stringify(dataset.payload, null, 2)}
                rows={18}
                spellCheck={false}
                className="border-border text-foreground focus:border-accent min-h-[24rem] w-full rounded-2xl border bg-white px-4 py-3 font-mono text-xs leading-6 outline-none"
                required
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
                >
                  Save manual override
                </button>
              </div>
            </form>

            <form action={resetManualDatasetAction}>
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <input type="hidden" name="dataset" value={dataset.key} />
              <button
                type="submit"
                className="border-border text-foreground hover:border-accent hover:text-accent inline-flex rounded-xl border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!override}
              >
                Reset to built-in dataset
              </button>
            </form>
          </Panel>
        );
      })}
    </div>
  );
}
