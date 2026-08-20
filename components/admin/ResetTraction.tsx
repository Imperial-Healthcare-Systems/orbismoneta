"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

/**
 * Start the figures from zero — the control beside Refresh.
 *
 * The two belong together: they are the only things on this screen that act on
 * the numbers rather than describe them. Refresh is the one you press often
 * and Reset is the one you press once, so they are the same size and one of
 * them is red.
 *
 * The button itself does nothing destructive. It opens a panel that says how
 * many events are about to go and asks for a phrase to be typed. Typing is the
 * point — a second button is dismissed as fast as the first, and this cannot be
 * undone.
 *
 * The obvious use is handing the site over: the checks that prove the portal
 * works look exactly like visits to the database, and nobody wants their first
 * month to open with the developer's testing in it.
 */

const PHRASE = "ERASE TRACTION";

export function ResetTraction({ events }: { events: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);

  /**
   * Shut the panel and forget what happened in it.
   *
   * Clearing `done` matters: it is what lets the button fall back to the live
   * count. Left set, the button would stay enabled after a reset and offer to
   * erase the nothing that is now there.
   */
  const close = () => {
    setOpen(false);
    setTyped("");
    setError(null);
    setDone(null);
  };

  /*
    Escape closes it, and so does a click anywhere else.

    Both because this panel covers content and holds a destructive button:
    somebody who opened it by accident should be able to get out of it the way
    every other panel on a computer gets closed, without hunting for Cancel.
  */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onClick = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const nothingToErase = events === 0 && done === null;

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        disabled={nothingToErase}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={
          nothingToErase
            ? "Nothing has been recorded yet"
            : "Erase every recorded page view and click"
        }
        className="inline-flex h-11 items-center gap-2 rounded-[0.625rem] border border-line px-4 text-[0.875rem] font-medium text-ink-2 transition-colors hover:border-critical hover:text-critical disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon
          name="refresh"
          className="h-4 w-4"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        Reset
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Reset the traction figures"
          /*
            Width is capped against the viewport as well as in rem, so on a
            360px phone the panel stays on screen instead of hanging off the
            right edge it is anchored to.
          */
          className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-[min(24rem,calc(100vw-2rem))] rounded-[var(--radius-tile)] border border-critical/40 bg-white p-5 shadow-[0_18px_40px_-12px_rgba(10,21,51,0.25)]"
        >
          {done !== null ? (
            <>
              <p className="text-[0.9375rem] font-medium text-ink">
                The figures are back to zero
              </p>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-2">
                {done.toLocaleString("en-GB")} recorded{" "}
                {done === 1 ? "event was" : "events were"} erased. Counting
                starts again with the next visit. Nothing about the website
                changed, and no article was touched.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-4 h-11 rounded-[0.625rem] border border-line px-4 text-[0.875rem] font-medium text-ink-2 transition-colors hover:border-navy-600 hover:text-navy-600"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <p className="text-[0.9375rem] font-medium text-ink">
                Erase {events.toLocaleString("en-GB")} recorded{" "}
                {events === 1 ? "event" : "events"}?
              </p>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-2">
                Every page view, every click and the whole 30-day chart go, and
                that history has no other copy. Your articles, drafts and images
                are untouched. This cannot be undone.
              </p>

              <label className="mt-4 block">
                <span className="text-[0.8125rem] text-ink-2">
                  Type <span className="font-mono text-ink">{PHRASE}</span> to
                  confirm
                </span>
                <input
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  className="mt-1.5 h-11 w-full rounded-[0.625rem] border border-line px-3 font-mono text-[0.875rem] text-ink outline-none focus-visible:border-navy-600"
                />
              </label>

              {error && (
                <p role="alert" className="mt-3 text-[0.875rem] text-critical">
                  {error}
                </p>
              )}

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  disabled={busy || typed.trim().toUpperCase() !== PHRASE}
                  onClick={async () => {
                    setBusy(true);
                    setError(null);
                    const response = await fetch("/api/admin/traction", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ confirm: PHRASE }),
                    });
                    const data = await response.json().catch(() => ({}));
                    if (!response.ok) {
                      setError(
                        data.error ?? "The reset failed. Nothing was erased.",
                      );
                      setBusy(false);
                      return;
                    }
                    setDone(data.removed ?? events);
                    setBusy(false);
                    router.refresh();
                  }}
                  className="h-11 rounded-[0.625rem] bg-critical px-4 text-[0.875rem] font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy ? "Erasing…" : "Erase the figures"}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="h-11 px-2 text-[0.875rem] text-ink-3 transition-colors hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
