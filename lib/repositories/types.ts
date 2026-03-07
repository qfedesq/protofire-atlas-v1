import type {
  Chain,
  ChainProfile,
  EconomyType,
  EconomyTypeSlug,
  RankedChain,
  RankingsQuery,
} from "@/lib/domain/types";

export interface ChainsRepository {
  listChains(): Chain[];
  listEconomies(): EconomyType[];
  listRankedChains(query?: Partial<RankingsQuery>): RankedChain[];
  getChainProfileBySlug(
    slug: string,
    economySlug?: EconomyTypeSlug,
  ): ChainProfile | null;
}
