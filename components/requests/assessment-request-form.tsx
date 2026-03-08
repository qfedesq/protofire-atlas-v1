import type { EconomyTypeSlug } from "@/lib/domain/types";

type AssessmentRequestFormProps = {
  chainName: string;
  chainSlug: string;
  economyLabel: string;
  economySlug: EconomyTypeSlug;
  requestState?: "idle" | "success" | "error";
  action: (formData: FormData) => Promise<void>;
};

export function AssessmentRequestForm({
  chainName,
  chainSlug,
  economyLabel,
  economySlug,
  requestState = "idle",
  action,
}: AssessmentRequestFormProps) {
  return (
    <form action={action} className="grid gap-4 lg:grid-cols-2">
      <input type="hidden" name="selectedChain" value={chainSlug} />
      <input type="hidden" name="selectedEconomy" value={economySlug} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="space-y-2">
        <label
          htmlFor="request-name"
          className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
        >
          Name
        </label>
        <input
          id="request-name"
          name="name"
          className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
          placeholder="Your name"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="request-email"
          className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
        >
          Work email
        </label>
        <input
          id="request-email"
          name="workEmail"
          type="email"
          className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
          placeholder="you@company.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="request-company"
          className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
        >
          Company / chain
        </label>
        <input
          id="request-company"
          name="companyOrChain"
          defaultValue={chainName}
          className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="request-economy"
          className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
        >
          Selected economy
        </label>
        <input
          id="request-economy"
          value={economyLabel}
          readOnly
          className="border-border text-foreground w-full rounded-2xl border bg-surface-muted px-4 py-3 text-sm outline-none"
        />
      </div>

      <div className="space-y-2 lg:col-span-2">
        <label
          htmlFor="request-notes"
          className="text-muted text-xs font-medium tracking-[0.16em] uppercase"
        >
          Notes
        </label>
        <textarea
          id="request-notes"
          name="notes"
          rows={5}
          className="border-border text-foreground focus:border-accent w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
          placeholder={`What would you like Protofire to assess for ${chainName} in ${economyLabel}?`}
        />
      </div>

      <div className="lg:col-span-2">
        <button
          type="submit"
          className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
        >
          Request Infrastructure Assessment
        </button>
      </div>

      {requestState === "success" ? (
        <p className="text-accent text-sm lg:col-span-2">
          Request received. Protofire can now review {chainName} for{" "}
          {economyLabel} using the current Atlas dataset and assumptions.
        </p>
      ) : null}

      {requestState === "error" ? (
        <p className="text-rose-600 text-sm lg:col-span-2">
          Request could not be stored. Please verify the fields and try again.
        </p>
      ) : null}
    </form>
  );
}
