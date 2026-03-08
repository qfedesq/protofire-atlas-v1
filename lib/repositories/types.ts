import type {
  Chain,
  ChainProfile,
  EconomyType,
  EconomyTypeSlug,
  GlobalRankedChain,
  RankedChain,
  TargetAccountProfile,
  TargetAccountRow,
  TargetAccountsQuery,
  GlobalRankingsQuery,
  RankingsQuery,
} from "@/lib/domain/types";

export interface ChainsRepository {
  listChains(): Chain[];
  listEconomies(): EconomyType[];
  listRankedChains(query?: Partial<RankingsQuery>): RankedChain[];
  listGlobalRankedChains(query?: Partial<GlobalRankingsQuery>): GlobalRankedChain[];
  listTargetAccounts(query?: Partial<TargetAccountsQuery>): TargetAccountRow[];
  getChainProfileBySlug(
    slug: string,
    economySlug?: EconomyTypeSlug,
  ): ChainProfile | null;
  getTargetAccountProfile(
    slug: string,
    economySlug?: EconomyTypeSlug,
  ): TargetAccountProfile | null;
}
