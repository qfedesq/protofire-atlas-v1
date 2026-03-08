"use client";

import { useActionState, useState } from "react";
import { ChevronDown } from "lucide-react";

import type { ChainAdditionActionState } from "@/lib/requests/types";

type AddChainRequestFormProps = {
  selectedEconomy: string;
  initialState: ChainAdditionActionState;
  action: (
    state: ChainAdditionActionState,
    formData: FormData,
  ) => Promise<ChainAdditionActionState>;
};

export function AddChainRequestForm({
  selectedEconomy,
  initialState,
  action,
}: AddChainRequestFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, submitAction, isPending] = useActionState(action, initialState);
  const isExpanded = isOpen || state.status !== "idle";

  return (
    <section className="border-border bg-surface rounded-3xl border p-5 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Benchmark coverage
          </p>
          <h3 className="text-foreground mt-2 text-xl font-semibold">
            Add my chain
          </h3>
          <p className="text-muted mt-3 text-sm leading-6">
            If your chain is outside the current Top 30 EVM benchmark, submit
            the official website so Protofire can review whether it belongs in
            the next Atlas snapshot.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="border-border text-foreground hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition"
          aria-expanded={isExpanded}
          aria-controls="add-chain-request-form"
        >
          Add my chain
          <ChevronDown
            className={`h-4 w-4 transition ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isExpanded ? (
        <form
          id="add-chain-request-form"
          action={submitAction}
          className="border-border/60 mt-5 grid gap-4 border-t pt-5 lg:grid-cols-[1.5fr_0.8fr_auto]"
        >
          <input type="hidden" name="selectedEconomy" value={selectedEconomy} />
          <input type="hidden" name="captchaToken" value={state.captchaToken} />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <label className="space-y-2" htmlFor="chain-addition-website">
            <span className="text-foreground text-sm font-medium">
              Chain website
            </span>
            <input
              id="chain-addition-website"
              name="chainWebsite"
              type="url"
              required
              defaultValue={state.chainWebsite}
              placeholder="https://yourchain.org"
              className="border-border bg-white text-foreground focus:border-accent focus:outline-hidden w-full rounded-xl border px-4 py-3 text-sm"
            />
          </label>

          <label className="space-y-2" htmlFor="chain-addition-captcha">
            <span className="text-foreground text-sm font-medium">Captcha</span>
            <div className="space-y-2">
              <p className="text-muted text-sm">{state.captchaPrompt}</p>
              <input
                id="chain-addition-captcha"
                name="captchaAnswer"
                type="text"
                required
                inputMode="numeric"
                placeholder="Answer"
                className="border-border bg-white text-foreground focus:border-accent focus:outline-hidden w-full rounded-xl border px-4 py-3 text-sm"
              />
            </div>
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Submitting..." : "Submit"}
            </button>
          </div>

          {state.message ? (
            <p
              className={`lg:col-span-3 text-sm ${
                state.status === "success" ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {state.message}
            </p>
          ) : null}
        </form>
      ) : null}
    </section>
  );
}
