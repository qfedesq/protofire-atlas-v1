"use server";

import { createArithmeticCaptcha } from "@/lib/requests/captcha";
import { createChainAdditionRequest } from "@/lib/requests/service";
import type {
  ChainAdditionActionState,
  ChainAdditionRequestInput,
} from "@/lib/requests/types";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function submitChainAdditionRequestAction(
  previousState: ChainAdditionActionState,
  formData: FormData,
): Promise<ChainAdditionActionState> {
  const nextCaptcha = createArithmeticCaptcha();
  const chainWebsite = asString(formData.get("chainWebsite"));

  try {
    createChainAdditionRequest({
      chainWebsite,
      selectedEconomy: asString(
        formData.get("selectedEconomy"),
      ) as ChainAdditionRequestInput["selectedEconomy"],
      captchaAnswer: asString(formData.get("captchaAnswer")),
      captchaToken: asString(formData.get("captchaToken")),
      website: asString(formData.get("website")),
    });

    return {
      status: "success",
      message:
        "Chain request submitted. Protofire can review the website and decide whether to add this chain to the Atlas benchmark.",
      chainWebsite: "",
      captchaPrompt: nextCaptcha.prompt,
      captchaToken: nextCaptcha.token,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : previousState.message || "Unable to submit this chain request.",
      chainWebsite,
      captchaPrompt: nextCaptcha.prompt,
      captchaToken: nextCaptcha.token,
    };
  }
}
