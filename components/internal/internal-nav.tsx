import Link from "next/link";

const internalLinks = [
  { href: "/internal/admin", label: "Admin" },
  { href: "/internal/applicability", label: "Applicability" },
  { href: "/internal/targets", label: "Targets" },
  { href: "/internal/opportunities", label: "Opportunities" },
  { href: "/internal/personas", label: "Personas" },
  { href: "/internal/offers", label: "Offers" },
  { href: "/internal/proposals", label: "Proposals" },
] as const;

export function InternalNav({ currentHref }: { currentHref: string }) {
  return (
    <nav className="border-border/70 flex flex-wrap gap-x-6 gap-y-2 border-b pb-4 text-sm">
      {internalLinks.map((link) => {
        const active =
          currentHref === link.href ||
          (link.href !== "/internal/admin" && currentHref.startsWith(`${link.href}/`));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "text-foreground font-semibold"
                : "text-muted hover:text-foreground transition"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
