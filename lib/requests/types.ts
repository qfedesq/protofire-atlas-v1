import type { EconomyTypeSlug } from "@/lib/domain/types";

export type AssessmentRequestInput = {
  name: string;
  workEmail: string;
  companyOrChain: string;
  selectedEconomy: EconomyTypeSlug;
  selectedChain: string;
  notes: string;
  website: string;
};

export type AssessmentRequest = Omit<AssessmentRequestInput, "website"> & {
  id: string;
  createdAt: string;
};
