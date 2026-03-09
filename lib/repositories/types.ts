import type {
  ApplicabilityMatrixRow,
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
  WedgeApplicabilitySummary,
} from "@/lib/domain/types";

export interface ChainsRepository {
  listChains(): Chain[];
  listEconomies(): EconomyType[];
  listRankedChains(query?: Partial<RankingsQuery>): RankedChain[];
  listGlobalRankedChains(query?: Partial<GlobalRankingsQuery>): GlobalRankedChain[];
  listTargetAccounts(query?: Partial<TargetAccountsQuery>): TargetAccountRow[];
  listApplicabilityMatrixRows(): ApplicabilityMatrixRow[];
  listWedgeApplicabilitySummaries(): WedgeApplicabilitySummary[];
  getChainProfileBySlug(
    slug: string,
    economySlug?: EconomyTypeSlug,
  ): ChainProfile | null;
  getTargetAccountProfile(
    slug: string,
    economySlug?: EconomyTypeSlug,
  ): TargetAccountProfile | null;
}
