# Admin portal — setup and use

The portal lives at **`/admin`**. It does two things: publishes and edits
insight posts, and shows how the site is being used.

Nothing here is switched on by default. Until the four environment variables
below are set, `/admin` says so plainly and the public site carries on serving
the eight articles that are checked into the repository — so a half-finished
setup never takes the website down.

---

## 1. Create the Supabase project

1. Sign up at [supabase.com](https://supabase.com) and create a project. The
   free tier is far beyond what this site will use.
2. Open **SQL Editor → New query**, paste the whole of
   [`supabase/schema.sql`](../supabase/schema.sql), and press **Run**.
   That creates two tables, one function and the image bucket. It is written to
   be safe to run again — re-running it will not drop anything.
3. Open **Project Settings → API** and copy two values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** secret → `SUPABASE_SERVICE_ROLE_KEY`

> **The service_role key is not the anon key.** It bypasses every access rule in
> the database. It belongs only in the server environment — never in client
> code, never in the repository, never in a message. If it is ever exposed,
> rotate it in the same dashboard immediately.

## 2. Set the environment variables

| Name | Value |
| --- | --- |
| `ADMIN_PASSWORD` | the portal password — held with the project credentials, not written here |
| `ADMIN_SESSION_SECRET` | any long random string (optional but recommended) |
| `NEXT_PUBLIC_SUPABASE_URL` | from step 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | from step 1 |

> This file is in a public repository. The password is deliberately not printed
> in it — writing it here would publish it just as surely as hardcoding it in
> the source, which is the thing the whole arrangement below is designed to
> avoid.

**Locally** — copy `.env.example` to `.env.local`, fill it in, restart
`npm run dev`.

**On Vercel** — Project → Settings → Environment Variables, add all four to
Production (and Preview if you want the portal there too), then redeploy. A new
variable does not reach a build that has already happened.

Why the password is not in the code: this repository is on GitHub, so a
fallback value in a source file would be the same as publishing it. The app
reads `ADMIN_PASSWORD` and refuses every login when it is missing. To change the
password later, change the variable and redeploy — everyone signed in is signed
out automatically, because the session signing key is derived from it.

## 3. Import the existing articles — once

Sign in at `/admin`, go to **Insights**, and press **Import articles**. That
copies the eight articles from the code into the database so they become
editable. The site keeps serving them throughout.

The button only appears while the table is empty, and the import refuses to run
over a table that already has rows — so it cannot overwrite your edits with the
originals by accident.

---

## Writing a post

**Insights → Write a new post.**

- **Headline** sets the web address automatically. On a post that is already
  live the address stops following the headline, because changing it would
  break every link anyone has shared.
- **Category** offers what already exists and accepts anything you type. Typing
  a new one creates it — it appears in the filter row on `/insights` as soon as
  a published post uses it, and disappears again if no post does. There is no
  separate "manage categories" screen because there is nothing to manage.
- **The article** is built from blocks — paragraph, heading, list, pull quote,
  callout, image. Add, reorder and delete them with the controls on each block.
- **Links** go inside any paragraph, list item or callout as
  `[the words you want to link](https://the-address)`. Addresses on this site
  work too: `[our platforms page](/solutions/platforms)`. External links open in
  a new tab automatically.
- **Images** upload straight from your computer, up to 8MB, PNG/JPEG/WebP/GIF/AVIF.
  Always fill in the description — it is what a blind reader hears and what
  shows if the image fails to load.
- **Save draft** stores it without publishing. A draft has no web address and
  appears nowhere on the public site.
- **Publish** puts it live immediately. The timestamp under the headline
  ("3 minutes ago") counts from the publication date and updates by itself while
  the page is open.

## Reading the traction figures

- **Page views** — every page opened, repeat visits and reloads included. A
  reload is a genuine view and every analytics tool counts it that way.
- **Visitors today** — individual people so far today. Exact.
- **Visitors a day** — the daily average across this week and across 30 days,
  with today left out because a part-finished day drags the average down, and
  with any days before the site's first recorded visit left out too.
- **Button clicks** — the "Explore Digital Currency Hub" and "Discuss Lending
  Integration" buttons on `/solutions/platforms`. Any button wrapped in
  `TrackedLink` appears here automatically once it is first clicked.

Counted without cookies. Each event stores a one-way hash of the visitor's
network address, browser, language and platform, mixed with a salt that changes
at midnight UTC — so nobody can be identified and nobody can be followed from
one day to the next. That is why the site needs no tracking consent banner.

**There is no "visitors this month" total, on purpose.** Because the salt is
thrown away each midnight, the database cannot tell whether Tuesday's visitor
and Friday's are the same person, so summing the days would report one loyal
reader as thirty people. The daily rate is the honest form of that question. A
true monthly headcount would need a lasting identifier for every reader, which
makes the data personal and puts a consent banner on every page — a bad trade
for a marketing site.

Read all of it as a floor rather than a census:

- content blockers stop some visits being counted at all;
- crawlers, monitors and test tooling are skipped by user agent, and anything
  driven by WebDriver (Playwright, Selenium) refuses to report itself at all;
- views of this portal are never counted;
- nor is anything opened while the site runs on a developer's machine — local
  work shares this same database, and it should not appear in your figures.
  Set `TRACTION_COUNT_DEV=1` in `.env.local` if you need to test the counter
  locally.
- everyone behind one office network on the same browser and platform still
  counts as one visitor. That is the cost of not identifying anybody.

---

---

## Starting the figures from zero

Setting the site up writes real rows — the checks that prove the portal works
are, to the database, indistinguishable from visits. Clear them before anyone
is shown the numbers.

**In the portal:** Traction → **Reset**, beside the Refresh button at the top. It
says how many events are about to go, asks for a phrase to be typed, and
reports how many it erased. Articles are never touched.

That is the one anybody should need. The SQL below does the same thing for
anyone who would rather work in the database:

```sql
-- Every recorded page view and click. Posts are untouched.
truncate table public.events restart identity;
```

`restart identity` sets the row counter back to 1, so the table looks new
rather than starting at id 47.

To start the articles over as well — only before handover, never afterwards,
because it deletes anything written in the portal:

```sql
delete from public.insights;
```

Then sign in and press **Import articles** again to reload the eight from the
repository.

None of this can be undone. On a live site, `truncate` throws away the only
copy of the traction history.

## Before the client takes it over

- **Rotate the service role key** — Supabase → Project Settings → API Keys →
  Legacy API keys → Rotate. Then update `SUPABASE_SERVICE_ROLE_KEY` in Vercel
  and redeploy. Do this if the key has ever been pasted into a chat, a ticket
  or an email, which is nearly always.
- **Change `ADMIN_PASSWORD`** to something the client chooses, in Vercel.
  Everyone signed in is signed out automatically, because the session signing
  key is derived from it.
- **Set `ADMIN_SESSION_SECRET`** if it is still unset, so the session key and
  the visitor salt do not both follow the password.

## Where things are

| Path | What it is |
| --- | --- |
| `supabase/schema.sql` | tables, the `traction()` function, the image bucket |
| `lib/supabase.ts` | the only module that holds the service role key |
| `lib/insights-store.ts` | reads/writes posts; falls back to the repo when unconfigured |
| `lib/analytics.ts` | how visitors are hashed and traction is read |
| `lib/admin-auth.ts` | password check and signed session cookie |
| `app/admin/(portal)/` | every screen behind the password |
| `app/admin/(portal)/guide/` | the How to use screen, written for the client |
| `components/admin/ResetTraction.tsx` | the reset, with its typed confirmation |
| `components/admin/RefreshButton.tsx` | re-reads the figures without reloading the page |
| `app/api/admin/` | save, delete, upload, import — each verifies the session itself |
| `app/api/pulse/` | the public endpoint that records an event |

## If something looks wrong

**"No database connected yet"** — the two Supabase variables are missing from
this environment, or the deploy predates them.

**A published post is not on `/insights`** — the listing is cached for 60
seconds and publishing clears that cache immediately, so this should not
happen. If it does, check that the save actually succeeded (the bar at the foot
of the editor says so) and reload once.

**An uploaded image does not appear** — `next.config.ts` allows the Supabase
hostname from `NEXT_PUBLIC_SUPABASE_URL`. If that variable changed, the site
needs a rebuild, not just a restart.

If you are pointing at a *local* Supabase (anything on `localhost` or a private
network address), `next/image` will refuse it with a 400 and log "hostname
resolved to private IP". That is Next 16 refusing to fetch images from inside
your own network, which is a sensible default against SSRF. Hosted Supabase is
a public hostname and is unaffected; for local work only, set
`images.dangerouslyAllowLocalIP: true` — and do not commit it.

**The numbers are zero** — nothing is counted on `/admin`, and obvious bots are
skipped. Open the public site in a normal browser and reload the dashboard.
Note that ad blockers block the tracking request, so the real figures are a
floor, not an exact count.
