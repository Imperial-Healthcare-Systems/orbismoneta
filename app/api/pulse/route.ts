import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/analytics";

/**
 * The tracking endpoint. Public, because the pages that call it are public.
 *
 * It takes the smallest thing that could work: a name, a path, an optional
 * label. Everything that could identify anybody — the address the request came
 * from, the browser it came from — is derived server-side and immediately
 * hashed, so the browser cannot lie about who it is and this route cannot be
 * used to write somebody else's identity into the table.
 *
 * The same-origin check is the only gate. It is not a strong one: `origin` is
 * set by the browser and anything that is not a browser can claim what it
 * likes. It stops the accidental case — another site embedding a script that
 * points here — and the deliberate case is bounded by what an attacker would
 * get for the trouble, which is a wrong number on a dashboard.
 */

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return new NextResponse(null, { status: 403 });
      }
    } catch {
      return new NextResponse(null, { status: 403 });
    }
  }

  let body: { name?: string; path?: string; label?: string; referrer?: string };
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const name = String(body.name ?? "").slice(0, 40);
  const path = String(body.path ?? "").slice(0, 300);
  if (!name || !path) return new NextResponse(null, { status: 400 });

  await recordEvent(
    {
      name,
      path,
      label: body.label ? String(body.label).slice(0, 120) : null,
      referrer: body.referrer ? String(body.referrer) : null,
    },
    request.headers,
  );

  // 204: the caller is a fire-and-forget beacon and has nothing to do with a
  // response body. Keeping it empty also keeps the round trip off the critical
  // path of whatever the reader is actually doing.
  return new NextResponse(null, { status: 204 });
}
