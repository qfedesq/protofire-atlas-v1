import { chainCatalogSeeds } from "@/data/seed/catalog";
import { syncWithDefiLlama } from "@/lib/connectors/defillama";

export async function syncTVL() {
  return syncWithDefiLlama(chainCatalogSeeds);
}
