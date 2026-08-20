/**
 * Client-side tracking. One function, called from the browser.
 *
 * Everything about this is deliberately unimportant: it never throws, never
 * blocks, never awaits, and if it fails nothing tells the reader. A marketing
 * site that broke because a counter could not be written would be a worse site
 * than one with a slightly low number.
 */

/**
 * The endpoint, deliberately not called anything with "track", "analytics",
 * "collect" or "beacon" in it.
 *
 * Content blockers work from filter lists, and the generic rules in those
 * lists match on path shape as well as on host — a first-party POST to
 * `/api/track` is a well-known pattern and gets caught by rules that were
 * never aimed at this site. There is nothing clever going on here and nothing
 * is hidden from anybody: the request is same-origin, it sets no cookie and it
 * stores no identifier. It is simply named after what it is to this site
 * rather than after a category that filter lists pattern-match.
 *
 * This does not defeat a blocker that filters by behaviour rather than by URL,
 * and it is not meant to. It recovers the visits lost to a generic path rule,
 * which is most of them.
 */
const ENDPOINT = "/api/pulse";

export function track(
  name: "pageview" | "cta_click" | (string & {}),
  options: { path?: string; label?: string; referrer?: string } = {},
): void {
  if (typeof window === "undefined") return;

  /*
    Automation, skipped at the source.

    `navigator.webdriver` is true in anything driven by WebDriver or the
    DevTools protocol — Playwright, Puppeteer, Selenium — and is set by the
    browser itself, so it is one of the few honest signals available. It is
    checked here rather than server-side because those tools routinely spoof
    the user agent to look like an ordinary Chrome, which is precisely what
    slipped past the server's bot filter during setup and put a dozen fake
    page views in the table.
  */
  if (navigator.webdriver) return;

  const payload = JSON.stringify({
    name,
    path: options.path ?? window.location.pathname,
    label: options.label,
    referrer: options.referrer,
  });

  try {
    /*
      `keepalive` is the important flag.

      A click on the Digital Currency Hub button navigates away, and a normal
      fetch is cancelled when the page unloads — so the one event the client
      most wants counted is exactly the one that would go missing. `keepalive`
      hands the request to the browser to finish after the document is gone.
    */
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* an ad blocker, an offline tab, a locked-down browser — all fine */
  }
}
