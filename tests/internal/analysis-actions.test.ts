import { describe, expect, it, vi } from "vitest";

const mockedRedirect = vi.fn((value: string) => {
  throw new Error(`REDIRECT:${value}`);
});

vi.mock("next/navigation", () => ({
  redirect: mockedRedirect,
}));

vi.mock("@/lib/storage/atlas-persistence", () => ({
  ensureAtlasPersistence: vi.fn(async () => undefined),
}));

vi.mock("@/lib/admin/auth", () => ({
  getAuthenticatedInternalUser: vi.fn(async () => ({
    subject: "auth0|internal-user",
    email: "internal@protofire.io",
    displayName: "Internal User",
  })),
  buildInternalLoginHref: vi.fn((returnTo: string) => `/auth/login?returnTo=${encodeURIComponent(returnTo)}`),
}));

vi.mock("@/lib/analysis/service", () => ({
  runChainTechnicalAnalysis: vi.fn(async () => ({
    id: "analysis-1",
  })),
}));

vi.mock("@/lib/personas/service", () => ({
  createBuyerPersona: vi.fn(async () => ({
    id: "persona-1",
  })),
}));

vi.mock("@/lib/personas/store", () => ({
  getBuyerPersonaById: vi.fn((id: string) =>
    id === "persona-1"
      ? {
          id,
          chainSlug: "ethereum",
        }
      : null,
  ),
}));

vi.mock("@/lib/proposals/engine", () => ({
  generateProposalsForPersona: vi.fn(async () => undefined),
}));

describe("internal analysis actions", () => {
  it("preserves existing search params when createBuyerPersonaAction redirects", async () => {
    const { createBuyerPersonaAction } = await import(
      "@/app/internal/analysis/actions"
    );

    const formData = new FormData();
    formData.set("chainSlug", "ethereum");
    formData.set("chainUrl", "https://ethereum.org");
    formData.set("personName", "Taylor Test");
    formData.set("personTitle", "Ecosystem Lead");
    formData.set("returnTo", "/chains/ethereum?economy=ai-agents");

    await expect(createBuyerPersonaAction(formData)).rejects.toThrow(
      "REDIRECT:/chains/ethereum?economy=ai-agents&persona=success#internal-appendix",
    );
  });

  it("preserves existing search params when generateChainProposalsAction redirects", async () => {
    const { generateChainProposalsAction } = await import(
      "@/app/internal/analysis/actions"
    );

    const formData = new FormData();
    formData.set("chainSlug", "ethereum");
    formData.set("personaId", "persona-1");
    formData.set("returnTo", "/chains/ethereum?economy=ai-agents");

    await expect(generateChainProposalsAction(formData)).rejects.toThrow(
      "REDIRECT:/chains/ethereum?economy=ai-agents&proposal=success#internal-appendix",
    );
  });
});
