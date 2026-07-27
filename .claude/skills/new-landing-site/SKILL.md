---
name: new-landing-site
description: Build a new Google Ads landing site for a client from this repo's generator, or migrate one off HighLevel landing pages. Use when asked to spin up a landing site for an auto glass shop or similar local service business, clone this site for another client, or set up the GHL webhook, Google Ads conversion and call tracking for a new location.
---

# New client landing site

This repo is the template. `la.speedywindshield.com` is the reference build.
The machinery is client-agnostic; the content is not.

## What is reusable and what is not

**Reuse unchanged** — `landing/build-pages.cjs` (generator), `landing/verify.cjs`
(assertions), `qa/tracking-check.cjs`, `qa/render-check.cjs`,
`landing/fetch-reviews.cjs`, `landing/ads-sheet.cjs`.

**Rewrite per client** — `landing/pages.config.cjs` and `landing/cities.config.cjs`
(all page content), the `:root` colour block in `landing/speedy.html`, and
`landing/img/`.

**Re-derive per client, never copy** — the compliance block and the ad copy rules.
See "Compliance" below. Copying California auto-glass compliance to a client in
another state or vertical is a legal problem, not a shortcut.

## Architecture, in one paragraph

`landing/speedy.html` is a valid standalone page AND the master template.
Content is injected between region markers `<!--PAGE:NAME-->…<!--/PAGE:NAME-->`,
and `{{TOKENS}}` are substituted from `site` in `pages.config.cjs`. Asset paths
are written as `/SPEEDY/...` in the template and rewritten at build time, so the
template opens correctly from disk during design work. Images are content-hashed
(md5, 8 chars) and served `immutable, max-age=31536000` — never reuse a filename
and expect a change to appear.

`region()` fills **every** occurrence of a marker, not the first. Two markers
appear twice in the template.

## Build order for a new client

1. **Copy the repo.** New GitHub repo, new Vercel project.
2. **Fill `site` in `pages.config.cjs`.** Every field in the checklist below.
3. **Palette.** Replace the `:root` variables. Compute contrast — do not
   estimate it. Body text needs 4.5:1, large text 3:1, and any colour carrying a
   border or an icon needs 3:1. The reference build's cyan failed at 2.62:1 and
   could not be used for text; the orange had to darken to `#CB4E1A` to reach
   4.52:1.
4. **Content.** Home, service pages, county/region hubs, city pages.
5. **Reviews.** Put the client's Google Place ID in `fetch-reviews.cjs`, set the
   `GOOGLE_PLACES_API_KEY` secret, run `npm run check:placeid` to confirm it
   resolves to the right business before trusting it.
6. **Verify, then deploy.** See the gates below.

## Per-client checklist

Every one of these is wrong until changed. A site that ships with the reference
client's phone number sends leads to the wrong business.

| Where | Field |
|---|---|
| `site` | `domain`, `legalName`, `brandShort`, `email` |
| `site` | `phoneFormatted` / `phoneE164` — the DNI-swapped number |
| `site` | `barPhoneFormatted` / `barPhoneE164`, `barArd` — registered number, or blank |
| `site` | `callAsset` — the Google call-forwarding number, excluded from DNI |
| `site` | `address`, `geo.lat` / `geo.lng` (verify these, they are easy to leave approximate) |
| `site.ads` | `conversionId` (`AW-…`), `conversionLabel`, `leadValue` |
| `site.ghl` | `webhook`, `locationId`, `poolId` |
| `fetch-reviews.cjs` | Place ID and the `EXPECT_*` guards |
| `landing/img/` | logo, OG image, favicons, photography |
| `ads-sheet.cjs` | the `GROUPS` data block |

## Form

The form is currently auto-glass shaped: vehicle, VIN, insurance, carrier,
service. For another glass client it is already correct. For a different
vertical the field list, labels, validation rules and options need to become
config-driven first — do that work in the template, do not fork it.

Required fields must live **outside** the collapsible drawer. A required field
inside a collapsed section means the visitor presses submit and the error lands
on something they cannot see. `verify.cjs` asserts this.

## Tracking

Report form conversions **from the page**, calls from GHL. Never both — GHL's
Ads integration is offline-import only and does not fire on Inbound Webhook,
which is exactly why the split exists. If "Add to Google Ads" is left on inside
the GHL form workflow, every lead counts twice.

The conversion fires only after the webhook confirms delivery, and dedupes on a
`transaction_id` built from the click ID plus the last 10 digits of the phone.
Retesting from the same browser with the same phone will fire nothing.

Attribution captures 8 click IDs and 5 UTMs into `sessionStorage`. Absent
parameters are sent as empty strings so the key set stays stable — GHL builds
its mapping picker from the captured sample request, so **send one sample with
every key populated** before mapping fields, or the click IDs never appear in
the dropdown. See `docs/ghl-field-mapping.md`.

## Compliance

Re-derive from primary sources for the client's state and vertical. For the
reference build these were: California Penal Code § 551(b) (insurance
inducements — blocks deductible-offset language), 16 CCR § 3371.2 (registered
firm name, registration number and registered telephone in internet
advertising, and DNI may be treated as misleading), California Insurance Code
§ 758.5 (the insurer cannot require its own shop).

The rules encoded in `ads-sheet.cjs` — no deductible offset, no carrier
affiliation claims, no unqualified drive-away time, no invented prices, no
superlatives — are insurance/auto-glass specific. Replace them; do not inherit
them silently.

## Verification gates

All four must pass before deploy. They exist because each caught a real defect.

```
npm run build:landing
npm run verify        # 14 sections, must be 0 failures 0 warnings
npm run qa:tracking   # 18 assertions in a real browser
npm run qa:render     # overflow, console errors, tap targets
npm run build:adsheet # refuses to write if any asset breaks Google's limits
```

When changing the template on an existing site, snapshot `quote-site/` first and
diff after rebuilding. An empty diff proves a refactor changed nothing.

## Deployment

**Vercel production deploys from `main`.** Pushing to a feature branch produces
a preview deployment on a `*.vercel.app` URL and does **not** update the client's
domain. This has silently swallowed several rounds of fixes — if the client says
"it still isn't there", check `git log origin/main` before re-debugging the code.

Root `vercel.json` sets `outputDirectory: "quote-site"`.

## Things that look like bugs and are not

- **No conversion in Google Ads after a test submit.** Google only records
  conversions it can attribute to an ad click. A direct visit has no `gclid`, so
  the tag fires and Google discards it. Reporting also lags ~3h, and conversions
  are dated to the click, not the submit.
- **"Add the Google tag / event snippet" in the Ads UI.** A status message that
  persists until the action records attributable activity. Not a diagnosis.
- **Only 2–5 review quotes.** The Places API returns at most 5 reviews. That is
  the ceiling, not a filter bug.
- **A lead arriving with blank `service` or `insurance`.** Impossible from this
  form — both always carry a value, defaults included. It came from somewhere
  else, usually a GHL workflow whose trigger is broader than the Inbound Webhook,
  or a direct POST to the webhook URL (which is public in page source and cannot
  be defended from the page).
