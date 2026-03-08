import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AddChainRequestForm } from "@/components/requests/add-chain-request-form";

describe("AddChainRequestForm", () => {
  it("expands and collapses the mini form from the ranking CTA", () => {
    render(
      <AddChainRequestForm
        selectedEconomy="ai-agents"
        initialState={{
          status: "idle",
          message: "",
          chainWebsite: "",
          captchaPrompt: "What is 2 + 2?",
          captchaToken: "token",
        }}
        action={async (state) => state}
      />,
    );

    const trigger = screen.getByRole("button", { name: /Add my chain/i });

    expect(screen.queryByLabelText("Chain website")).not.toBeInTheDocument();

    fireEvent.click(trigger);

    expect(screen.getByLabelText("Chain website")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Answer")).toBeInTheDocument();
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();

    fireEvent.click(trigger);

    expect(screen.queryByLabelText("Chain website")).not.toBeInTheDocument();
  });
});
