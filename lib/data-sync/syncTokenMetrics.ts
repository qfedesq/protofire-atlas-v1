import { syncWithCoinGecko } from "@/lib/connectors/coingecko";

export async function syncTokenMetrics() {
  return syncWithCoinGecko();
}
