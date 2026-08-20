"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Delete, with the confirmation inline rather than in a `confirm()` dialog.
 *
 * The native dialog is easy to dismiss without reading and does not say what
 * is about to go. This makes the headline part of the question, and the
 * destructive button only exists after the first click — so the dangerous
 * action is never one stray click away in a table of rows that all look alike.
 */
export function DeleteButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex min-h-11 items-center text-[0.8125rem] text-ink-3 transition-colors hover:text-critical md:min-h-0"
      >
        Delete
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <span className="text-[0.75rem] text-ink-2">
        Delete &ldquo;{title.slice(0, 30)}…&rdquo;?
      </span>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const response = await fetch(`/api/admin/insights/${slug}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            setBusy(false);
            setConfirming(false);
            return;
          }
          router.refresh();
        }}
        className="rounded-full bg-critical px-2.5 py-1 text-[0.75rem] font-medium text-white disabled:opacity-50"
      >
        {busy ? "Deleting…" : "Yes, delete"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-[0.75rem] text-ink-3 hover:text-ink"
      >
        Cancel
      </button>
    </span>
  );
}
