import { syncExternalMetricsSnapshot } from "@/lib/external-data/service";

import { syncChains } from "./syncChains";
import { syncDeveloperSignals } from "./syncDeveloperSignals";
import { syncProtocols } from "./syncProtocols";
import { syncTVL } from "./syncTVL";
import { syncTokenMetrics } from "./syncTokenMetrics";

export async function syncAllDataSources() {
  const snapshot = await syncExternalMetricsSnapshot();
  const [chains, tvl, protocols, tokenMetrics, developerSignals] =
    await Promise.all([
      syncChains(),
      syncTVL(),
      syncProtocols(),
      syncTokenMetrics(),
      syncDeveloperSignals(),
    ]);

  return {
    snapshot,
    syncResults: [
      chains,
      tvl.result,
      ...protocols.map((item) => item.result),
      tokenMetrics.result,
      developerSignals.result,
    ],
  };
}
