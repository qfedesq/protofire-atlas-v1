import { atlasDatasetLabel } from "@/lib/config/dataset";
import { getPublicMeta } from "@/lib/public-data/service";

export function CitationBlock() {
  const meta = getPublicMeta();

  return (
    <div className="text-muted border-border/70 border-t pt-4 text-sm leading-6">
      <p>Dataset: {atlasDatasetLabel}</p>
      <p>Atlas Model Version: {meta.atlas_version}</p>
      <p>Last Updated: {meta.updated_at}</p>
    </div>
  );
}
