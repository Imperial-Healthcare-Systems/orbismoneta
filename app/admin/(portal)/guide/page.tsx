import Link from "next/link";

/**
 * How to use the portal.
 *
 * Written for somebody who has never seen it and is not going to read a manual
 * — short sentences, one idea each, and the answer to the question rather than
 * a description of the screen. It lives inside the portal rather than in a
 * document because a document sent by email is lost by the second week, and
 * the person who needs it is already signed in here.
 *
 * Everything on this page describes what the code actually does. If the portal
 * changes, this changes with it.
 */

export const metadata = { title: "How to use" };

function Card({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-tile)] border border-line bg-white p-6">
      <p className="font-mono text-[0.75rem] tracking-[0.12em] text-ink-3 uppercase md:text-[0.6875rem]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-[1.25rem] leading-snug font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-3.5 text-[0.9375rem] leading-relaxed text-ink-2">
        {children}
      </div>
    </section>
  );
}

/** Numbered steps. The numeral is monospaced so a column of them lines up. */
function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3.5">
          <span className="mt-0.5 font-mono text-[0.75rem] tabular text-navy-600">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

/** A short question and its answer, for the things that go wrong. */
function Q({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-medium text-ink">{q}</p>
      <p className="mt-1">{children}</p>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.8125rem] text-ink">
      {children}
    </code>
  );
}

export default function GuidePage() {
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.03em]">
          How to use this portal
        </h1>
        <p className="text-[0.9375rem] text-ink-2">
          Everything you can do here, in the order you are likely to need it.
          Nothing on this page can break the website — reading it is safe.
        </p>
      </div>

      <Card eyebrow="Start here" title="What this portal is for">
        <p>Two things, and nothing else:</p>
        <p>
          <strong className="font-medium text-ink">Insights</strong> — write,
          edit and publish articles. Whatever you publish appears on the public
          site immediately, on the{" "}
          <Link
            href="/insights"
            target="_blank"
            className="text-navy-600 underline underline-offset-2"
          >
            Insights page
          </Link>
          .
        </p>
        <p>
          <strong className="font-medium text-ink">Traction</strong> — see how
          many people are visiting the site and which buttons they press.
        </p>
        <p>
          The rest of the website — the home page, the products, the leadership
          team — is not edited here. Those changes go through your developer.
        </p>
      </Card>

      <Card eyebrow="Writing" title="Publishing an article">
        <Steps
          items={[
            <>
              Go to <strong className="font-medium text-ink">Insights</strong>{" "}
              and press{" "}
              <strong className="font-medium text-ink">Write a new post</strong>
              .
            </>,
            <>
              Type the{" "}
              <strong className="font-medium text-ink">headline</strong>. The
              web address is made from it automatically — &ldquo;Stablecoins in
              2026&rdquo; becomes <Code>/insights/stablecoins-in-2026</Code>.
            </>,
            <>
              Choose a{" "}
              <strong className="font-medium text-ink">category</strong>, or
              type a new one. Anything you type becomes a category the moment a
              published post uses it.
            </>,
            <>
              Write a one or two sentence{" "}
              <strong className="font-medium text-ink">summary</strong>. This is
              what people read on the card before they decide to click.
            </>,
            <>
              Add a{" "}
              <strong className="font-medium text-ink">cover image</strong> if
              you have one, then build the article out of blocks — see below.
            </>,
            <>
              Press <strong className="font-medium text-ink">Publish</strong> to
              put it live, or{" "}
              <strong className="font-medium text-ink">Save draft</strong> to
              come back to it. A draft is invisible to the public.
            </>,
          ]}
        />
        <p className="rounded-[0.625rem] bg-surface-2 p-4 text-[0.875rem]">
          <strong className="font-medium text-ink">
            One rule worth knowing.
          </strong>{" "}
          Once a post is live, changing the headline no longer changes its web
          address. That is deliberate: the address may already have been shared
          or posted on LinkedIn, and changing it would break every one of those
          links.
        </p>
      </Card>

      <Card eyebrow="Writing" title="Blocks, links and images">
        <p>
          An article is built from blocks, added one under another. Each block
          has controls to move it up, move it down, or delete it.
        </p>
        <ul className="flex flex-col gap-2">
          {[
            ["Paragraph", "ordinary text"],
            ["Heading", "a section title inside the article"],
            ["List", "bullet points"],
            ["Pull quote", "a sentence set large, to break up a long piece"],
            ["Callout", "a boxed note the reader should not miss"],
            ["Image", "a picture, with a description"],
          ].map(([name, what]) => (
            <li key={name} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-600/45"
              />
              <span>
                <strong className="font-medium text-ink">{name}</strong> —{" "}
                {what}
              </span>
            </li>
          ))}
        </ul>
        <p>
          <strong className="font-medium text-ink">To add a link</strong>, write
          it inside any paragraph, list item or callout like this:
        </p>
        <p>
          <Code>[the words you want to link](https://example.com)</Code>
        </p>
        <p>
          Pages on this site work the same way —{" "}
          <Code>[our platforms page](/solutions/platforms)</Code>. Links to
          other websites open in a new tab by themselves; you do not have to do
          anything.
        </p>
        <p>
          <strong className="font-medium text-ink">Images</strong> upload
          straight from your computer, up to 8MB, as PNG, JPEG, WebP, GIF or
          AVIF. Always fill in the description box. That text is what a blind
          reader hears, what shows if the picture fails to load, and what search
          engines read.
        </p>
      </Card>

      <Card eyebrow="Numbers" title="What the traction figures mean">
        <p>
          <strong className="font-medium text-ink">Page views</strong> — every
          page anybody opened. If one person reads four pages that is four page
          views, and if they reload one of them it is five.
        </p>
        <p>
          <strong className="font-medium text-ink">Visitors today</strong> — how
          many separate people have been on the site since midnight. Exact.
        </p>
        <p>
          <strong className="font-medium text-ink">Visitors a day</strong> — the
          average number of people per day, across this week and across the last
          thirty. Today is left out of that average, because a day that is only
          half over would drag it down.
        </p>
        <p className="rounded-[0.625rem] bg-surface-2 p-4 text-[0.875rem]">
          <strong className="font-medium text-ink">
            Why there is no &ldquo;visitors this month&rdquo; number.
          </strong>{" "}
          The site counts people without cookies and without storing anything
          that identifies anybody — which is why visitors are never asked to
          accept tracking. The way that works is that the label a visitor is
          counted under is thrown away every midnight. So the site can tell you
          exactly how many people came today, but it genuinely cannot tell
          whether someone who came on Tuesday is the same person who came on
          Friday. Adding thirty days together would report one loyal reader as
          thirty people, so it is not offered.
        </p>
        <p>
          <strong className="font-medium text-ink">Button clicks</strong> —
          people pressing &ldquo;Explore Digital Currency Hub&rdquo; and
          &ldquo;Discuss Lending Integration&rdquo;. <em>Total</em> is how many
          clicks there were; <em>People</em> is how many different people did
          it.
        </p>
        <p>
          Treat every number as a floor rather than a headcount. Some visitors
          use ad blockers, which stop the count happening at all. Robots and
          testing tools are deliberately excluded, and so is anything you look
          at inside this portal.
        </p>
      </Card>

      <Card eyebrow="Numbers" title="Starting the figures from zero">
        <p>
          At the top of the{" "}
          <Link
            href="/admin"
            className="text-navy-600 underline underline-offset-2"
          >
            Traction
          </Link>{" "}
          page, beside Refresh, there is a Reset. It erases every page view and
          click recorded so far, and starts counting again from the next visit.
        </p>
        <p>
          It exists for one moment: the day the site goes live. Building and
          testing a website means opening its pages hundreds of times, and none
          of that is an audience. Clearing it once means the first month you
          report is real.
        </p>
        <p>
          It asks you to type a phrase before it will do anything, because it
          cannot be undone — those figures are the only copy. It never touches
          your articles.
        </p>
      </Card>

      <Card eyebrow="Problems" title="If something looks wrong">
        <div className="flex flex-col gap-4">
          <Q q="I published a post and it is not on the site.">
            Reload the page once. If it is still missing, open{" "}
            <strong className="font-medium text-ink">Insights</strong> and check
            it says <em>Published</em> and not <em>Draft</em> — a draft is
            invisible on purpose.
          </Q>
          <Q q="My image does not appear.">
            Check that it uploaded — the editor shows a preview when it did.
            Very large files can fail on a slow connection; 8MB is the limit.
          </Q>
          <Q q="All the numbers are zero.">
            Nothing you do inside this portal is counted, so looking at the
            dashboard will never move it. Open the public site in a normal
            browser, then come back and reload. If it is still zero the day
            after the site went live, tell your developer.
          </Q>
          <Q q="It signed me out.">
            Sessions last twelve hours. Signing in again is all that is needed.
            Changing the password also signs everybody out everywhere, which is
            what a password change should do.
          </Q>
          <Q q="I deleted a post by mistake.">
            It is gone, and so is its web address. There is no undo. If it had
            been shared, anyone following that link now sees a &ldquo;not
            found&rdquo; page — so if you only wanted it off the site, turning
            it back into a draft is the gentler move.
          </Q>
        </div>
      </Card>
    </div>
  );
}
