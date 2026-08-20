"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

/**
 * Fetch the current figures without reloading the page.
 *
 * `router.refresh()` rather than `location.reload()`. The reload throws the
 * whole document away and builds it again — a white flash, the scroll position
 * lost, and everything downloaded a second time. The refresh asks the server
 * for this page's data and swaps in what changed, so the screen stays put and
 * only the numbers move.
 *
 * It is wrapped in `useTransition` because `refresh()` gives no promise to
 * await. The transition is pending until the new content has arrived, which is
 * what turns the label into "Refreshing…" and spins the icon for exactly as
 * long as the work takes. Without it the button would flash for a frame and
 * look like it had done nothing.
 */
export function RefreshButton({ label = "Refresh" }: { label?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
      // aria-live so a screen reader hears that it worked. Everything else
      // about this button is visual: the numbers change and the label settles.
      aria-live="polite"
      className="inline-flex h-11 items-center gap-2 rounded-[0.625rem] border border-line px-4 text-[0.875rem] font-medium text-ink-2 transition-colors hover:border-navy-600 hover:text-navy-600 disabled:cursor-wait disabled:opacity-60"
    >
      <Icon
        name="refresh"
        className={`h-4 w-4 ${pending ? "animate-spin" : ""}`}
        strokeWidth={1.8}
        aria-hidden="true"
      />
      {pending ? "Refreshing…" : label}
    </button>
  );
}
