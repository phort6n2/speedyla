# Speedy Windshield Repair — Orange County & LA County landing site

Google Ads landing site for Speedy Windshield Repair's expansion into Orange County
and Los Angeles County. Static HTML/CSS/JS, no framework, one Node script to build.

**Domain:** `la.speedywindshield.com` · **Output:** `quote-site/` · **Pages:** 25

---

## ⚠️ Read this before spending a dollar on ads

Two California-specific issues surfaced during the build. Both are verified against
primary sources. Neither is a copywriting problem, and neither is fixed by rewording.

### 1. The "$300 off your deductible" offer is a criminal-statute problem

The existing San Diego landing page advertises *"Up to $300 OFF deductible."*
**California Penal Code § 551(b)** provides:

> "It is unlawful for any automotive repair dealer, contractor, or employees or agents
> thereof to knowingly offer or give any discount intended to offset a deductible
> required by a policy of insurance covering repairs to or replacement of a motor
> vehicle…"

There is a safe harbour in the same subdivision, but it is written around discounts
applied *after* the insurer has determined the claim amount — which is not how a
pre-claim advertised deductible credit works. Violations above $950 are a wobbler
carrying up to three years and a $10,000 fine.

**This site therefore contains no deductible-offset language anywhere.** The `$0`
angle is carried only by things that are true and are the *insurer's* decision:
some policies include a zero glass deductible, most carriers waive the deductible
on chip *repair*, and we bill carriers directly. See the header comment in
`landing/pages.config.cjs`.

**Action required:** have California counsel review the deductible-assistance
*programme design* — not just the ad copy — before it appears in any ad, on the
San Diego site, or here. This is not legal advice.

### 2. The BAR advertising rule collides with GHL number-pool DNI

**16 CCR § 3371.2** (effective 1 Oct 2025) requires every internet advertisement by a
registered Automotive Repair Dealer — the Bureau's guidance includes the website
itself — to display the firm name exactly as registered, the ARD registration number,
and *the telephone number on file with BAR*. Per BAR guidance reported in the trade
press, **dynamic or tracking numbers that differ from the registered number "may be
considered misleading and would not meet the regulatory requirements."**

A GHL number pool does precisely what that guidance describes.

**Mitigation built into this site:**
- A persistent compliance block in the footer of all 25 pages carries the registered
  firm name, the ARD number and the BAR-registered phone as **static text**, marked
  `class="ghl-no-swap" data-no-swap="true"` so DNI can never rewrite it.
- DNI swapping is confined to the header and CTA numbers.

**Action required:** confirm with the BAR Licensing Unit that a static registered
number in a compliance block satisfies § 3371.2 while tracking numbers appear
elsewhere on the page. If the answer is no, the fallback is a single static tracking
number *registered with BAR* as the location's number, recovering per-source
attribution from form conversions and GA4 session data instead of call-level DNI.

### Also flagged
- **California has no zero-deductible glass law.** Florida, Kentucky and South
  Carolina do; California does not. Any copy implying otherwise is false. The
  insurance section states this plainly, which is itself a differentiator.
- **"ASE-certified" is likely the wrong credential to lead with.** The auto glass
  standard-setting body is the Auto Glass Safety Council (ANSI/AGSC/AGRSS 003).
  Verify what the technicians actually hold; prefer AGSC if applicable.
- **Dropped as unsubstantiated:** "insurance preferred vendor" and "100% customer
  satisfaction rating" from the existing site.
- **No prices anywhere.** Nothing says "from $X" because no verified price floors
  were supplied. When they are, the ad and the page must show the same figure.
- **Job photos were re-cropped.** The originals had `(619) 761-4887` and "Serving San
  Diego" printed on the van door. DNI cannot rewrite pixels, so anyone calling off an
  image bypasses attribution entirely — and "Serving San Diego" undercuts an OC/LA
  page. One photo was rejected outright because the van *was* the photo.

---

## Placeholders that must be filled before launch

`landing/pages.config.cjs` → `site`:

| Field | Status |
|---|---|
| `barArd` | **`ARD-VERIFY-BEFORE-LAUNCH`** — get from the BAR certificate |
| `legalName` | must match the ARD certificate **exactly** |
| `barPhoneFormatted` / `barPhoneE164` | must be the number on file with BAR |
| `email` | `quotes@speedywindshield.com` is a guess — not published on either existing site |
| `geo.lat` / `geo.lng` | approximated from the Pacific Beach address — verify |
| `ads.conversionId` / `ads.conversionLabel` | Ads → Tools → Conversions → action → Tag setup |
| `ghl.webhook` / `ghl.locationId` / `ghl.poolId` | HighLevel inbound webhook + number pool |
| `GOOGLE_PLACE_ID` (repo variable) | **verify it resolves to the right business first** |

Empty values are safe to deploy: with no Ads ID the whole tracking block is a no-op,
with no webhook the form still reports a conversion and shows success, and with no
pool ID the DNI scripts are not emitted at all.

---

## Commands

```bash
npm run build:landing   # generate quote-site/ from the template + config
npm run verify          # 12 build/SEO/a11y/tracking assertions — exits non-zero on failure
npm run qa:render       # real browser: overflow, console errors, tap targets, screenshots
npm run qa:tracking     # real browser: full form submit, asserts dataLayer + webhook payload
npm run qa              # all of the above
npm run fetch:reviews   # Google Places (New) — needs GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID
```

`npm run verify` currently passes **0 failures, 0 warnings, 25 pages**, with worst
city-page 5-gram overlap at **2.57%** against a 5% ceiling.

---

## Layout

```
landing/
  speedy.html          master template — renders standalone as the home page
  pages.config.cjs     site config + home + 8 services + 2 county hubs
  cities.config.cjs    12 city pages (kept separate purely for size)
  build-pages.cjs      generator
  verify.cjs           build assertions
  fetch-reviews.cjs    weekly Places fetch, with the wrong-business guard
  legal-privacy.html   standalone
  legal-terms.html     standalone
  vercel-static.json   copied into the output as vercel.json
  img/                 logo, favicons, OG image, cropped job photos
qa/
  render-check.cjs     headless render audit
  tracking-check.cjs   end-to-end tracking assertions
quote-site/            GENERATED — never edit by hand
.github/workflows/refresh-reviews.yml
```

The template uses `<!--PAGE:NAME-->…<!--/PAGE:NAME-->` region markers rather than
blind regex, so it stays a valid standalone page you can open during design work.
Nav and footer link lists are **generated from the config**, which makes orphan pages
structurally impossible rather than a thing you remember to avoid.

Asset paths are written `/SPEEDY/...` in the template and rewritten at build time —
`href`, `src`, `url(` and the bare form are all handled.

---

## Pages

**Services (8):** `/windshield-replacement` · `/windshield-repair` · `/adas-calibration` ·
`/mobile-auto-glass` · `/back-glass-replacement` · `/car-window-replacement` ·
`/auto-glass-replacement` · `/insurance-claims`

**Orange County (6):** Anaheim · Santa Ana · Irvine · Huntington Beach · Costa Mesa · Fullerton
**LA County (6):** Long Beach · Torrance · Pasadena · Glendale · Santa Monica · Downey
**Hubs (2):** `/auto-glass-repair-orange-county` · `/auto-glass-repair-los-angeles-county`
Plus `/`, `/privacy`, `/terms`. City slugs follow `auto-glass-repair-<city>`.

Each city page is built on a hook genuinely specific to that place — the 710
terminating in the Port of Long Beach, Torrance blocking the SR-91 extension so
refinery trucks run at grade, the Arroyo Seco Parkway's 1940 no-shoulder geometry,
Santa Monica's parking reality, Irvine's landfill and automaker cluster. That is what
keeps copy overlap at 2.57% and keeps the set out of doorway-page territory.

Facts that are easy to "correct" back into being wrong are listed at the top of
`landing/cities.config.cjs`. **Read that comment before editing city copy.** Toyota
left Torrance in 2014; Lakewood Blvd is not SR-19; Glendale has no Metro rail; I-710
does not enter Downey.

---

## Tracking

| Event | Reported by |
|---|---|
| Form submission | **The page**, via `gtag` |
| Phone calls | **GHL**, via its Number Pool Calling trigger |

Do not let both report form submissions. If GHL has an "Add to Google Ads" action on
the form workflow, **turn it off** — otherwise every lead counts twice. GHL's Ads
integration is offline-import only and fires from an allowlisted set of triggers that
does not include Inbound Webhook, which is exactly why forms are reported from the page.

- 8 click IDs + 5 UTMs captured, `gbraid`/`wbraid` included — Google sends those
  *instead of* `gclid` on iOS and consent-mode traffic.
- Stored in `sessionStorage`, so attribution survives navigation across the mini-site.
- Conversion fires **only after the webhook confirms delivery**. A conversion for a
  lead that never arrived is worse than a missed one.
- Deduped on `transaction_id` + `localStorage`, so a refresh, a double-click or a
  second tab cannot report twice.
- Phone normalised to E.164 for both the webhook and enhanced conversions.
- Set the conversion action to **page load, not click**, in the Ads UI.
- Each page pre-selects its own service in the form dropdown, so an ADAS ad lands on
  a form that already says ADAS.

---

## Deploy

One Vercel project (`speedyla`), its own domain, git-connected to this repo.

**Deployment is configured in `vercel.json` at the repo root**, not in the Vercel
dashboard:

```json
{ "outputDirectory": "quote-site", "trailingSlash": false, "headers": [ … ] }
```

With no `buildCommand`, Vercel treats this as a static deploy and serves
`quote-site/` directly. Nothing needs setting in the dashboard, and the config is
version-controlled rather than living as invisible project state — which also
sidesteps the Root Directory picker only reading the default branch.

Because Root Directory is *not* set, **the repo-root `vercel.json` is the one Vercel
reads**, so the cache and security headers live there. `landing/vercel-static.json`
is still copied to `quote-site/vercel.json` for the alternative setup (Root Directory
= `quote-site`), but in the current configuration it is inert — edit the root file.

Production deploys from the **`main`** branch. Pushing to `main` deploys live;
pushing any other branch produces a preview URL only.

Vercel gotcha still worth knowing: Production Branch now lives under
Settings → Environments → Production → Branch Tracking, not Settings → Git.

---

## Reviews

`fetch-reviews.cjs` pulls the real Google rating, count and quotes once a week from
Places API (New) and bakes them into the HTML. One API call per week; the key never
reaches the browser.

**The wrong-business guard is not optional.** A client-supplied Place ID once resolved
to a different company two doors down and published *their* rating across every page —
silently, because the numbers looked plausible. The script asserts the resolved
`displayName` and `formattedAddress` before writing anything, and any failure exits 0
leaving the last good data in place rather than blanking the site.

Reviews are the San Diego listing, shown as the company's Google reviews rather than
as OC/LA-specific ones. With no `reviews.json` present the build **strips every rating
claim**, omits `aggregateRating`, and links to the real listing instead.

Scheduled workflows only run from the **default branch** — on a feature branch GitHub
does not register the cron at all.

---

## Design

Light theme, derived from the actual logo rather than invented: navy `#004B81`,
cyan `#00ACE4`, orange `#FE6221`, sampled from the PNG colormap.

Every text/surface pair was contrast-checked with real WCAG math, which changed two
decisions. Cyan `#00ACE4` is **2.62:1 on white** — it fails even the 3:1 non-text
threshold, so it is confined to fills, tints and large graphics and never carries text
or an input border. Brand orange `#FE6221` is 3.01:1, so white text on it fails AA;
the CTA uses `#CB4E1A` (**4.52:1**), which still reads as the same brand orange.
Navy on white is 9.04:1 and carries all body text and links.
