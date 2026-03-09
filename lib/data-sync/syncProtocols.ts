import { chainCatalogSeeds } from "@/data/seed/catalog";
import { syncWithDefiLlama } from "@/lib/connectors/defillama";
import { syncWithTokenTerminal } from "@/lib/connectors/tokenterminal";

export async function syncProtocols() {
  const [defillama, tokenTerminal] = await Promise.all([
    syncWithDefiLlama(chainCatalogSeeds),
    syncWithTokenTerminal(chainCatalogSeeds),
  ]);

  return [defillama, tokenTerminal];
}
