import { describe, expect, it, vi } from "vitest";

const mockedNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound: mockedNotFound,
}));

vi.mock("@/lib/admin/auth", () => ({
  getAuthenticatedInternalUser: vi.fn(async () => null),
}));

describe("chain profile page", () => {
  it("delegates to Next.js notFound for unknown slugs", async () => {
    const pageModule = await import("@/app/chains/[slug]/page");

    await expect(
      pageModule.default({
        params: Promise.resolve({ slug: "unknown-chain" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockedNotFound).toHaveBeenCalledTimes(1);
  });
});
