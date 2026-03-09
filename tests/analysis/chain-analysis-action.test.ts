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
  getAuthenticatedInternalUser: vi.fn(async () => null),
  buildInternalLoginHref: vi.fn((returnTo: string) => `/auth/login?returnTo=${encodeURIComponent(returnTo)}`),
}));

vi.mock("@/lib/analysis/service", () => ({
  runChainTechnicalAnalysis: vi.fn(async () => ({
    id: "analysis-1",
  })),
}));

describe("runChainTechnicalAnalysisAction", () => {
  it("redirects unauthenticated users to the internal login flow", async () => {
    const { runChainTechnicalAnalysisAction } = await import(
      "@/app/internal/analysis/actions"
    );

    const formData = new FormData();
    formData.set("chainSlug", "ethereum");
    formData.set("returnTo", "/chains/ethereum");

    await expect(runChainTechnicalAnalysisAction(formData)).rejects.toThrow(
      "REDIRECT:/auth/login?returnTo=%2Fchains%2Fethereum",
    );
  });
});
