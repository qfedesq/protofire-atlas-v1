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

export type ChainAdditionRequestInput = {
  chainWebsite: string;
  selectedEconomy: EconomyTypeSlug;
  captchaAnswer: string;
  captchaToken: string;
  website: string;
};

export type ChainAdditionRequest = Omit<
  ChainAdditionRequestInput,
  "captchaAnswer" | "captchaToken" | "website"
> & {
  id: string;
  createdAt: string;
};

export type ChainAdditionActionState = {
  status: "idle" | "success" | "error";
  message: string;
  chainWebsite: string;
  captchaPrompt: string;
  captchaToken: string;
};
