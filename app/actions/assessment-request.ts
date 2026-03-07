"use server";

import { redirect } from "next/navigation";

import { createAssessmentRequest } from "@/lib/requests/service";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function submitAssessmentRequestAction(formData: FormData) {
  const selectedChain = asString(formData.get("selectedChain"));
  const selectedEconomy = asString(formData.get("selectedEconomy"));

  try {
    createAssessmentRequest({
      name: asString(formData.get("name")),
      workEmail: asString(formData.get("workEmail")),
      companyOrChain: asString(formData.get("companyOrChain")),
      selectedEconomy: selectedEconomy as Parameters<
        typeof createAssessmentRequest
      >[0]["selectedEconomy"],
      selectedChain,
      notes: asString(formData.get("notes")),
      website: asString(formData.get("website")),
    });

    redirect(`/chains/${selectedChain}?economy=${selectedEconomy}&request=success#assessment`);
  } catch {
    redirect(`/chains/${selectedChain}?economy=${selectedEconomy}&request=error#assessment`);
  }
}
