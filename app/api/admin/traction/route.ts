import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { resetTraction } from "@/lib/analytics";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * Erase the traction figures.
 *
 * DELETE rather than POST because that is exactly what it does, and the method
 * is the first thing anybody reads in a log.
 *
 * Three guards, and none of them is theatre:
 *
 *   - `isAdmin()` here as well as on the page. The layout protects the screen;
 *     this URL can be reached by anything at all.
 *   - a typed phrase in the body. The session cookie is SameSite=lax, so a
 *     cross-site POST cannot carry it, but a bookmarklet or a pasted snippet
 *     running in an already-signed-in tab can. Requiring words that only the
 *     confirmation panel sends means no single stray request erases a year of
 *     figures.
 *   - the count is returned, so the interface can say what actually went
 *     rather than "done".
 */

const PHRASE = "ERASE TRACTION";

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "No database is connected, so there is nothing to reset." },
      { status: 503 },
    );
  }

  let body: { confirm?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.confirm !== PHRASE) {
    return NextResponse.json(
      { error: "The reset was not confirmed." },
      { status: 422 },
    );
  }

  try {
    const removed = await resetTraction();
    return NextResponse.json({ ok: true, removed }, { status: 200 });
  } catch (err) {
    console.error("[admin] traction reset failed:", err);
    return NextResponse.json(
      { error: "The database refused the reset. Nothing was erased." },
      { status: 500 },
    );
  }
}
