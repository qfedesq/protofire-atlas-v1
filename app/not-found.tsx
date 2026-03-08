import Link from "next/link";

import { Panel } from "@/components/ui/panel";

export default function NotFound() {
  return (
    <Panel className="mx-auto max-w-2xl text-center">
      <p className="text-accent text-xs tracking-[0.16em] uppercase">404</p>
      <h1 className="text-foreground mt-3 text-3xl font-semibold">
        Requested page not found
      </h1>
      <p className="text-muted mt-4 text-sm leading-6">
        This MVP only includes the one-page Atlas overview and seeded chain
        profiles for the current benchmark set.
      </p>
      <Link
        href="/"
        className="bg-accent text-accent-foreground hover:bg-accent/90 mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition"
      >
        Back to Atlas
      </Link>
    </Panel>
  );
}
