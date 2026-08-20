import Link from "next/link";
import { RefreshButton } from "@/components/admin/RefreshButton";
import { getAllInsightsForAdmin } from "@/lib/insights-store";
import { isSupabaseConfigured } from "@/lib/supabase";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { SeedButton } from "@/components/admin/SeedButton";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

function when(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminInsightsPage() {
  const configured = isSupabaseConfigured();
  const insights = configured ? await getAllInsightsForAdmin() : [];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.03em]">
            Insights
          </h1>
          <p className="text-[0.9375rem] text-ink-2">
            {insights.length === 0
              ? "Nothing here yet."
              : `${insights.length} post${insights.length === 1 ? "" : "s"} — ${
                  insights.filter((i) => i.status === "published").length
                } published.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <Link
            href="/admin/insights/new"
            className="h-11 rounded-[0.625rem] bg-navy-600 px-5 text-[0.9375rem] leading-[2.75rem] font-medium text-white transition-colors hover:bg-navy-700"
          >
            Write a new post
          </Link>
        </div>
      </div>

      {!configured && <SetupNotice />}

      {/*
        The one-time import.

        It only appears while the table is empty, because that is the only time
        it is safe or meaningful. The eight articles are in the repository and
        the public site is already serving them; this copies them into the
        database so they become editable, and after that the database is the
        only source and this button has nothing to offer.
      */}
      {configured && insights.length === 0 && <SeedButton />}

      {insights.length > 0 && (
        <div className="min-w-0 overflow-hidden rounded-[var(--radius-tile)] border border-line bg-white">
          {/*
            The table scrolls inside this box rather than pushing the page
            sideways. Five columns do not fit a phone and squeezing them is
            worse than sliding them — the headline column stays readable and
            the rest is a swipe away.
          */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-[0.875rem]">
              <thead>
                <tr className="border-b border-line text-[0.75rem] md:text-[0.6875rem] tracking-[0.08em] text-ink-3 uppercase">
                  <th className="px-5 py-3 text-left font-medium">Headline</th>
                  <th className="px-3 py-3 text-left font-medium">Category</th>
                  <th className="px-3 py-3 text-left font-medium">Status</th>
                  <th className="px-3 py-3 text-left font-medium">Published</th>
                  <th className="px-5 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {insights.map((insight) => (
                  <tr
                    key={insight.slug}
                    className="border-b border-line last:border-0"
                  >
                    <td className="max-w-[24rem] px-5 py-4">
                      <Link
                        href={`/admin/insights/${insight.slug}`}
                        className="font-medium text-ink hover:text-navy-600"
                      >
                        {insight.title}
                      </Link>
                      <p className="mt-0.5 truncate font-mono text-[0.75rem] text-ink-3">
                        /insights/{insight.slug}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-ink-2">{insight.category}</td>
                    <td className="px-3 py-4">
                      <span
                        className={
                          insight.status === "published"
                            ? "rounded-full bg-positive/10 px-2.5 py-1 text-[0.75rem] font-medium text-positive"
                            : "rounded-full bg-surface-2 px-2.5 py-1 text-[0.75rem] font-medium text-ink-3"
                        }
                      >
                        {insight.status === "published" ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td className="px-3 py-4 tabular text-ink-2">
                      {when(insight.publishedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        {insight.status === "published" && (
                          <Link
                            href={`/insights/${insight.slug}`}
                            target="_blank"
                            className="flex min-h-11 items-center text-[0.8125rem] text-ink-2 hover:text-navy-600 md:min-h-0"
                          >
                            View ↗
                          </Link>
                        )}
                        <Link
                          href={`/admin/insights/${insight.slug}`}
                          className="flex min-h-11 items-center text-[0.8125rem] text-navy-600 hover:underline md:min-h-0"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          slug={insight.slug}
                          title={insight.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
