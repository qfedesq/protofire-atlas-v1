import { listAllEconomyTypes } from "@/lib/config/economies";
import { InternalNav } from "@/components/internal/internal-nav";
import { Panel } from "@/components/ui/panel";
import { requireAuthenticatedInternalUser } from "@/lib/admin/auth";
import { listOfferLibrary } from "@/lib/offers/library";
import { ensureAtlasPersistence } from "@/lib/storage/atlas-persistence";

import { updateOfferOverrideAction } from "./actions";

export default async function InternalOffersPage() {
  await ensureAtlasPersistence();
  await requireAuthenticatedInternalUser("/internal/offers");
  const offers = listOfferLibrary();
  const economies = listAllEconomyTypes();

  return (
    <div className="space-y-6">
      <InternalNav currentHref="/internal/offers" />

      <Panel className="space-y-4">
        <div>
          <p className="text-accent text-xs tracking-[0.16em] uppercase">
            Offer library
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-semibold">
            Protofire offers
          </h1>
          <p className="text-muted mt-3 max-w-4xl text-sm leading-6">
            Markdown-backed offers with lightweight activation and tagging controls.
            Content stays in `/offers`; this screen only manages runtime metadata.
          </p>
        </div>
      </Panel>

      <Panel className="space-y-5">
        <ul className="divide-border/60 divide-y">
          {offers.map((offer) => (
            <li key={offer.offerId} className="py-5">
              <form action={updateOfferOverrideAction} className="space-y-4">
                <input type="hidden" name="offerId" value={offer.offerId} />
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-foreground font-semibold">{offer.name}</p>
                    <p className="text-muted text-sm">{offer.problemSolved}</p>
                    <p className="text-muted text-sm">
                      Source: <code>{offer.sourceFile}</code>
                    </p>
                  </div>
                  <label className="text-foreground flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={offer.isActive}
                    />
                    Active
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-muted text-xs tracking-[0.16em] uppercase">
                      Wedge tags
                    </label>
                    <input
                      name="applicableWedges"
                      defaultValue={offer.applicableWedges.join(", ")}
                      className="border-border text-foreground w-full border bg-white px-3 py-2 text-sm outline-none"
                    />
                    <p className="text-muted text-xs">
                      Allowed: {economies.map((economy) => economy.slug).join(", ")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-muted text-xs tracking-[0.16em] uppercase">
                      Persona tags
                    </label>
                    <input
                      name="targetPersonas"
                      defaultValue={offer.targetPersonas.join(", ")}
                      className="border-border text-foreground w-full border bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm">
                  <p className="text-muted">Price: {offer.priceRange}</p>
                  <p className="text-muted">ROI: {offer.roiEstimate}</p>
                  <p className="text-muted">Target: {offer.targetCustomer}</p>
                </div>

                <button
                  type="submit"
                  className="border-border text-foreground hover:border-accent hover:text-accent inline-flex border px-4 py-2 text-sm font-medium transition"
                >
                  Save offer metadata
                </button>
              </form>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
