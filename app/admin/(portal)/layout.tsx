import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { BrandMark } from "@/components/BrandMark";

/**
 * The gate.
 *
 * `(portal)` is a route group holding everything that requires a session, so
 * /admin/login can sit outside it and still be under /admin. Adding a page
 * inside this folder puts it behind the password automatically, which is the
 * right default — a new admin screen that forgot to check would otherwise be
 * public.
 *
 * This is a real boundary, not an optimistic one. Next's authentication guide
 * is explicit that a check in proxy/middleware is a redirect convenience and
 * not a defence; the API routes each verify for themselves as well, because
 * this layout protects pages and not endpoints.
 */
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Traction" },
  { href: "/admin/insights", label: "Insights" },
  // Last, because it is the one item nobody needs twice — but on every screen,
  // because the person who needs it is already signed in and will not go
  // hunting for a document somebody emailed them months ago.
  { href: "/admin/guide", label: "How to use" },
];

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-white/85 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[76rem] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 md:h-16 md:flex-nowrap md:gap-6 md:px-6 md:py-0">
          <Link
            href="/admin"
            className="flex min-h-11 shrink-0 items-center gap-2.5 md:min-h-0"
          >
            {/*
              The supplied artwork, through the same component the public site
              uses, so a future logo change is one file rather than two.
              tone="light" names the ground it sits on — this bar is white —
              not the colour of the mark itself.
            */}
            <BrandMark tone="light" className="h-6 md:h-7" />
            <span className="hidden rounded-full sm:inline-block bg-navy-50 px-2 py-0.5 font-mono text-[0.75rem] md:text-[0.625rem] tracking-[0.12em] text-navy-600 uppercase">
              Admin
            </span>
          </Link>

          <nav className="order-last flex w-full items-center gap-1 md:order-none md:w-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center rounded-full px-3 text-[0.875rem] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink md:min-h-0 md:px-3.5 md:py-1.5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <Link
              href="/insights"
              target="_blank"
              className="flex min-h-11 items-center rounded-full px-3 text-[0.875rem] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink md:min-h-0 md:px-3.5 md:py-1.5"
            >
              View site ↗
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[76rem] px-6 py-10">{children}</div>
    </div>
  );
}
