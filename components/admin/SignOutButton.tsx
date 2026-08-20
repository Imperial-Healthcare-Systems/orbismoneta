"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/admin/login", { method: "DELETE" });
        // Same order as signing in, for the same reason: clear the client's
        // cached route tree before navigating, or the portal renders once more
        // from a cache built when the session was still valid.
        router.refresh();
        router.push("/admin/login");
      }}
      className="flex min-h-11 items-center rounded-full border border-line px-3.5 py-1.5 text-[0.875rem] text-ink-2 transition-colors hover:border-line-strong hover:text-ink disabled:opacity-50 md:min-h-0"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
