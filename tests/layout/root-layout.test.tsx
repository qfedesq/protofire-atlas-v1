import type { ImgHTMLAttributes } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/local", () => ({
  default: () => ({ variable: "font-onest" }),
}));

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

describe("RootLayout", () => {
  it("renders the Protofire brand shell", async () => {
    const layoutModule = await import("@/app/layout");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      render(
        layoutModule.default({
          children: <div>Atlas content</div>,
        }),
      );

      expect(screen.getByAltText("Protofire")).toBeInTheDocument();
      expect(screen.getByText("Atlas")).toBeInTheDocument();
      expect(screen.getByText("V1.4")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Admin" }),
      ).toHaveAttribute("href", "/internal/admin");
      expect(screen.queryByText("Atlas overview")).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Seeded MVP dataset\. No live telemetry/i),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Atlas content")).toBeInTheDocument();
    } finally {
      consoleError.mockRestore();
    }
  });
});
