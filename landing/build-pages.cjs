#!/usr/bin/env node
/**
 * Static site generator for the Speedy Windshield Repair OC/LA landing site.
 *
 * Reads:   landing/speedy.html      master template (also renders standalone as the home page)
 *          landing/pages.config.cjs all page content
 *          landing/reviews.json      optional; real Google review data
 *
 * Writes:  quote-site/              index.html + <slug>/index.html per page,
 *                                   sitemap.xml, robots.txt, manifest, favicons,
 *                                   img/, vercel.json
 *
 * Design notes:
 *  - Nav and footer link lists are GENERATED from the config, so every page is
 *    linked from every other page by construction. Orphan pages (which read as
 *    doorway pages to Google) can't happen by forgetting a link.
 *  - The home page gets the exact same head treatment as every other page —
 *    canonical, OG, JSON-LD. It's the easiest page in the account to leave bare.
 *  - When reviews.json is absent, every numeric rating claim is stripped and the
 *    review cards degrade to a link to the real Google listing. aggregateRating
 *    is only ever emitted from live data.
 *
 * Env:
 *   BASE    URL prefix for asset/link rewriting (default '' = served at root)
 *   OUTDIR  output directory (default <repo>/quote-site)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const BASE = process.env.BASE !== undefined ? process.env.BASE : '';
const OUTDIR = process.env.OUTDIR
  ? path.resolve(process.env.OUTDIR)
  : path.join(ROOT, 'quote-site');

/* The literal prefix used on every asset path inside the template. Rewritten at
 * build time so the template can be opened directly from disk during design
 * work while the built site uses real root-relative (or BASE-prefixed) paths. */
const ASSET_PREFIX = '/SPEEDY';

const cfg = require('./pages.config.cjs');
const site = cfg.site;

/* ------------------------------------------------------------------ helpers */

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Text for JSON-LD / meta: strip tags, collapse whitespace. */
const plain = (s) =>
  String(s == null ? '' : s)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

function region(html, name, replacement) {
  const open = '<!--PAGE:' + name + '-->';
  const close = '<!--/PAGE:' + name + '-->';
  /* Every occurrence, not just the first. FOOTER_OC and FOOTER_LA each appear
     twice in the template — once in the "areas we serve" list and once in the
     footer column — and filling only the first left the footer columns empty
     under their headings. */
  let out = '';
  let rest = html;
  let filled = 0;
  for (;;) {
    const i = rest.indexOf(open);
    if (i === -1) break;
    const j = rest.indexOf(close, i);
    if (j === -1) {
      throw new Error('Template is missing closing marker ' + close);
    }
    out += rest.slice(0, i + open.length) + replacement;
    rest = rest.slice(j);
    filled++;
  }
  if (!filled) {
    throw new Error('Template is missing region marker ' + open);
  }
  return out + rest;
}

function url(slug) {
  const b = BASE || '';
  if (!slug || slug === '/') return b + '/';
  return b + '/' + slug;
}

function absUrl(slug) {
  const origin = 'https://' + site.domain;
  if (!slug || slug === '/') return origin + '/';
  return origin + '/' + slug;
}

/* ------------------------------------------------------- page list assembly */

const homePage = Object.assign({}, cfg.home, { slug: '/', kind: 'home' });
const servicePages = cfg.services.map((p) => Object.assign({}, p, { kind: 'service' }));
const hubPages = cfg.hubs.map((p) => Object.assign({}, p, { kind: 'hub' }));
const cityPages = cfg.cities.map((p) => Object.assign({}, p, { kind: 'city' }));

const contentPages = [homePage].concat(servicePages, hubPages, cityPages);

/* ------------------------------------------------------------- review state */

let reviews = null;
const reviewsPath = path.join(__dirname, 'reviews.json');
if (fs.existsSync(reviewsPath)) {
  try {
    const r = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
    /* Only trust it if it actually carries usable numbers. */
    if (Number(r.rating) >= 1 && Number(r.rating) <= 5 && Number(r.count) >= 1) {
      reviews = r;
    } else {
      console.warn('[build] reviews.json present but values are out of range — ignoring it.');
    }
  } catch (e) {
    console.warn('[build] reviews.json is unparseable — ignoring it. (' + e.message + ')');
  }
}

const mapsUrl = (reviews && reviews.maps_uri) || site.mapsUrl || '';

/* ------------------------------------------------------------- nav + footer */

/* Header nav: a small curated set (the highest-intent services plus both county
 * hubs). The footer carries the complete link set. */
const navHtml = cfg.nav
  .map((slug) => {
    const p = contentPages.find((x) => x.slug === slug);
    if (!p) throw new Error('nav references unknown slug: ' + slug);
    return '<a href="' + url(p.slug) + '">' + esc(p.navLabel || p.shortLabel) + '</a>';
  })
  .join('\n            ');

function linkList(pages) {
  return pages
    .map(
      (p) =>
        '<li><a href="' + url(p.slug) + '">' + esc(p.shortLabel || p.navLabel) + '</a></li>'
    )
    .join('\n              ');
}

const footerServices = linkList(servicePages);
const footerOC = linkList(
  hubPages.filter((p) => p.county === 'OC').concat(cityPages.filter((p) => p.county === 'OC'))
);
const footerLA = linkList(
  hubPages.filter((p) => p.county === 'LA').concat(cityPages.filter((p) => p.county === 'LA'))
);

/* ------------------------------------------------------------- review block */

/** 1110 → "1,110". Used everywhere a review count is shown to a human. */
const fmtCount = (n) => Number(n).toLocaleString('en-US');

function starRow(n) {
  /* Round to the nearest half star first. Without this, 4.9 renders as 4 full
     plus a half — visually 4.5 — which understates the real rating. */
  const r = Math.round(Number(n) * 2) / 2;
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  let out = '';
  for (let i = 0; i < full; i++) out += '<span class="star" aria-hidden="true">★</span>';
  if (half) out += '<span class="star star-half" aria-hidden="true">★</span>';
  return out;
}

function ratingBarHtml() {
  if (!reviews) {
    /* No live data → no numbers. Point at the real listing instead. */
    return (
      '<a class="rb-item rb-link" href="' +
      esc(mapsUrl) +
      '" target="_blank" rel="noopener">' +
      '<strong>Read our Google reviews</strong>' +
      '</a>'
    );
  }
  return (
    '<a class="rb-item rb-link" href="' +
    esc(mapsUrl) +
    '" target="_blank" rel="noopener" ' +
    'aria-label="' +
    esc(reviews.rating + ' out of 5 stars from ' + fmtCount(reviews.count) + ' Google reviews') +
    '">' +
    '<span class="stars">' +
    starRow(reviews.rating) +
    '</span>' +
    '<strong>' +
    esc(reviews.rating) +
    '</strong> <span class="rb-sub">from ' +
    esc(fmtCount(reviews.count)) +
    ' Google reviews</span>' +
    '</a>'
  );
}

function reviewsSectionHtml() {
  if (!reviews || !reviews.quotes.length) {
    return (
      '<div class="rev-empty">' +
      '<p>Speedy Windshield Repair has been serving Southern California drivers since ' +
      esc(site.established) +
      '. Every review on our Google listing is from a real customer — read them yourself:</p>' +
      '<a class="btn btn-ghost" href="' +
      esc(mapsUrl) +
      '" target="_blank" rel="noopener">See our reviews on Google</a>' +
      '</div>'
    );
  }
  const cards = reviews.quotes
    .map(
      (q) =>
        '<figure class="rev">' +
        '<div class="stars" aria-label="5 out of 5 stars">' +
        starRow(5) +
        '</div>' +
        '<blockquote>' +
        esc(q.text) +
        '</blockquote>' +
        '<figcaption>' +
        esc(q.author) +
        (q.when ? ' <span class="rev-when">· ' + esc(q.when) + '</span>' : '') +
        '</figcaption>' +
        '</figure>'
    )
    .join('\n          ');

  return (
    cards +
    '\n          <p class="rev-foot">' +
    'Verified Google reviews for Speedy Windshield Repair · ' +
    '<a href="' +
    esc(mapsUrl) +
    '" target="_blank" rel="noopener">read all ' +
    esc(fmtCount(reviews.count)) +
    ' on Google</a></p>'
  );
}

/* ------------------------------------------------------ Google listing + map
 * An embedded map of a SAN DIEGO address on an Orange County / LA page could
 * mislead, so the copy states plainly that the shop is in San Diego and that
 * OC/LA are served by mobile dispatch with no branch to visit. The value here is
 * the verified Google listing behind the rating, not a "come see us" pin.
 * Uses the keyless maps embed — no browser-exposed API key. */
function mapBlockHtml() {
  const q = encodeURIComponent(
    site.address.street + ', ' + site.address.city + ', ' +
    site.address.region + ' ' + site.address.zip
  );
  const embed = 'https://maps.google.com/maps?q=' + q + '&z=15&output=embed';

  const heading = reviews
    ? esc(reviews.rating) + ' stars from ' + esc(fmtCount(reviews.count)) +
      ' Google reviews'
    : 'Our Google listing';

  const ratingRow = reviews
    ? '<div><div class="big">' + esc(reviews.rating) + '</div>' +
      '<div class="stars" aria-label="' +
      esc(reviews.rating + ' out of 5 stars') + '">' + starRow(reviews.rating) + '</div>' +
      '<p class="mapnote" style="margin:6px 0 0">from ' +
      esc(fmtCount(reviews.count)) + ' reviews on Google</p></div>'
    : '';

  return (
    '<div class="sec-head center">' +
      '<span class="eyebrow">Verified on Google</span>' +
      '<h2>' + heading + '</h2>' +
      '<p class="lead">Our shop and our Google listing are in San Diego. Orange County and ' +
      'Los Angeles County are served by mobile dispatch — there is no branch to visit in ' +
      'either county, and the rating below is the same team that comes to you.</p>' +
    '</div>' +
    '<div class="mapgrid">' +
      '<div class="mapframe">' +
        '<iframe src="' + esc(embed) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
        'title="Map showing Speedy Windshield Repair in San Diego, California"></iframe>' +
      '</div>' +
      '<div class="mapinfo">' +
        ratingRow +
        '<dl>' +
          '<div><dt>Registered shop</dt><dd>' + esc(site.address.street) + '<br>' +
            esc(site.address.city) + ', ' + esc(site.address.region) + ' ' + esc(site.address.zip) + '</dd></div>' +
          '<div><dt>Service area</dt><dd>Orange County &amp; Los Angeles County — mobile only</dd></div>' +
          '<div><dt>Hours</dt><dd>Mon–Fri 8:00am–6:30pm · Sat 8:00am–4:00pm · Sun closed</dd></div>' +
        '</dl>' +
        (mapsUrl
          ? '<a class="btn btn-ghost" href="' + esc(mapsUrl) + '" target="_blank" rel="noopener">' +
            'View our Google listing</a>'
          : '') +
      '</div>' +
    '</div>'
  );
}

/* ---------------------------------------------------------------- FAQ block */

function faqHtml(faq) {
  return faq
    .map(
      (f, i) =>
        '<div class="faq">' +
        '<button type="button" aria-expanded="false" aria-controls="faq-a-' +
        i +
        '" id="faq-q-' +
        i +
        '">' +
        '<span>' +
        esc(f.q) +
        '</span><span class="chev" aria-hidden="true"></span>' +
        '</button>' +
        '<div class="ans" id="faq-a-' +
        i +
        '" role="region" aria-labelledby="faq-q-' +
        i +
        '"><div class="ans-in">' +
        f.a +
        '</div></div>' +
        '</div>'
    )
    .join('\n          ');
}

/* ------------------------------------------------------------- JSON-LD */

function openingHours() {
  return site.hours
    .filter((h) => !h.closed)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes
    }));
}

function localBusinessLd(page) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'AutoGlassShop',
    '@id': 'https://' + site.domain + '/#business',
    name: site.name,
    telephone: site.phoneE164,
    url: absUrl(page.slug),
    image: 'https://' + site.domain + '/img/' + site.ogImage,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.zip,
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng
    },
    areaServed: cfg.areaServed.map((c) => ({ '@type': 'City', name: c })),
    openingHoursSpecification: openingHours()
  };
  if (site.email) ld.email = site.email;
  if (mapsUrl) ld.hasMap = mapsUrl;
  if (site.sameAs && site.sameAs.length) ld.sameAs = site.sameAs;

  /* Only ever attach a rating when we actually have live review data. */
  if (reviews) {
    ld.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(reviews.rating),
      reviewCount: String(reviews.count),
      bestRating: '5',
      worstRating: '1'
    };
  }
  return ld;
}

function faqLd(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((f) => ({
      '@type': 'Question',
      name: plain(f.q),
      acceptedAnswer: { '@type': 'Answer', text: plain(f.a) }
    }))
  };
}

function breadcrumbLd(page) {
  if (page.slug === '/') return null;
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') }];
  items.push({
    '@type': 'ListItem',
    position: 2,
    name: plain(page.shortLabel || page.navLabel),
    item: absUrl(page.slug)
  });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
}

function jsonLdHtml(page) {
  const blocks = [localBusinessLd(page), faqLd(page), breadcrumbLd(page)].filter(Boolean);
  return blocks
    .map(
      (b) =>
        '<script type="application/ld+json">' +
        JSON.stringify(b).replace(/</g, '\\u003c') +
        '</script>'
    )
    .join('\n');
}

/* ------------------------------------------------ BAR compliance block state
 * 16 CCR § 3371.2 requires a registered Automotive Repair Dealer's internet
 * advertising to show the registered firm name, the ARD registration number and
 * the BAR-registered phone. With no ARD number configured we cannot show a real
 * one, and a placeholder on a live page is worse than omitting it — so the block
 * degrades to plain name / phone / address (still DNI-excluded, which the Google
 * call asset needs anyway).
 *
 * Set site.barArd to the real number to restore the full compliance block. */
function applyBarBlock(s) {
  if (site.barArd) return s;
  /* Drop the ARD line AND the registered-telephone line entirely — with no ARD
   * number there is nothing to comply with, and leaving a bare unlabelled number
   * next to the call-asset number just reads as two random phone numbers.
   * The call-asset line stays: Google verifies that number appears on the site. */
  return s
    .replace(/ · Bureau of Automotive Repair ARD Registration <b>\{\{BAR_ARD\}\}<\/b>/g, '')
    .replace(/\s*Registered telephone: <a[^>]*>\{\{BAR_PHONE\}\}<\/a><br>/g, '');
}

/* ------------------------------------------------------------ page renderer */

const template = fs.readFileSync(path.join(__dirname, 'speedy.html'), 'utf8');

function renderPage(page) {
  let s = template;

  const title = page.title;
  const desc = page.desc;

  /* ---- head ---- */
  s = s.replace(/<title>[\s\S]*?<\/title>/, '<title>' + esc(title) + '</title>');
  s = s.replace(
    /<meta name="description" content="[\s\S]*?">/,
    '<meta name="description" content="' + esc(desc) + '">'
  );
  s = s.replace(
    /<link rel="canonical" href="[\s\S]*?">/,
    '<link rel="canonical" href="' + esc(absUrl(page.slug)) + '">'
  );
  s = s.replace(
    /<meta property="og:title" content="[\s\S]*?">/,
    '<meta property="og:title" content="' + esc(page.ogTitle || title) + '">'
  );
  s = s.replace(
    /<meta property="og:description" content="[\s\S]*?">/,
    '<meta property="og:description" content="' + esc(desc) + '">'
  );
  s = s.replace(
    /<meta property="og:url" content="[\s\S]*?">/,
    '<meta property="og:url" content="' + esc(absUrl(page.slug)) + '">'
  );
  s = s.replace(
    /<meta name="twitter:title" content="[\s\S]*?">/,
    '<meta name="twitter:title" content="' + esc(page.ogTitle || title) + '">'
  );
  s = s.replace(
    /<meta name="twitter:description" content="[\s\S]*?">/,
    '<meta name="twitter:description" content="' + esc(desc) + '">'
  );

  /* ---- content regions ---- */
  s = region(s, 'EYEBROW', page.eyebrow);   // authored HTML — already entity-encoded
  s = region(s, 'H1', page.h1);
  s = region(s, 'SUB', page.sub);
  s = region(s, 'BODY', page.body);
  s = region(s, 'FAQ', faqHtml(page.faq));
  s = region(s, 'JSONLD', jsonLdHtml(page));
  s = region(s, 'NAV', navHtml);
  s = region(s, 'FOOTER_SERVICES', footerServices);
  s = region(s, 'FOOTER_OC', footerOC);
  s = region(s, 'FOOTER_LA', footerLA);
  s = region(s, 'RATINGBAR', ratingBarHtml());
  s = region(s, 'REVIEWS', reviewsSectionHtml());
  s = region(s, 'MAPBLOCK', mapBlockHtml());

  /* ---- pre-select the matching service in the quote form ----
   * An ad for back glass should land on a form that already says back glass.
   * Remove any hardcoded selected first so exactly one option carries it. */
  s = s.replace(/(<select[^>]*id="svc"[\s\S]*?<\/select>)/, function (block) {
    let b = block.replace(/\s+selected(?=[\s>])/g, '');
    if (page.svcValue) {
      const re = new RegExp('(<option value="' + page.svcValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '")');
      b = b.replace(re, '$1 selected');
    }
    return b;
  });

  /* ---- rating claims outside the managed regions ----
   * With no live data, any prose that asserts a star rating must go. */
  if (!reviews) {
    s = s.replace(/<!--RATING-CLAIM-->[\s\S]*?<!--\/RATING-CLAIM-->/g, '');
  } else {
    s = s
      .replace(/\{\{RATING\}\}/g, esc(reviews.rating))
      .replace(/\{\{REVIEW_COUNT\}\}/g, esc(fmtCount(reviews.count)));
  }

  s = applyBarBlock(s);

  /* ---- site-wide tokens ---- */
  s = s
    .replace(/\{\{PHONE_E164\}\}/g, esc(site.phoneE164))
    .replace(/\{\{PHONE\}\}/g, esc(site.phoneFormatted))
    .replace(/\{\{PHONE_DIGITS\}\}/g, esc(site.phoneE164.replace(/\D/g, '')))
    .replace(/\{\{CALL_ASSET_E164\}\}/g, esc(site.callAsset.e164))
    .replace(/\{\{CALL_ASSET\}\}/g, esc(site.callAsset.formatted))
    .replace(/\{\{BAR_PHONE_E164\}\}/g, esc(site.barPhoneE164))
    .replace(/\{\{BAR_PHONE\}\}/g, esc(site.barPhoneFormatted))
    .replace(/\{\{BAR_ARD\}\}/g, esc(site.barArd))
    .replace(/\{\{BRAND_SHORT\}\}/g, esc(site.brandShort || site.legalName))
    .replace(/\{\{ORIGIN\}\}/g, 'https://' + site.domain)
    .replace(/\{\{LEGAL_NAME\}\}/g, esc(site.legalName))
    .replace(/\{\{EMAIL\}\}/g, esc(site.email))
    .replace(/\{\{DOMAIN\}\}/g, esc(site.domain))
    .replace(/\{\{MAPS_URL\}\}/g, esc(mapsUrl))
    .replace(/\{\{YEAR\}\}/g, String(new Date().getFullYear()))
    .replace(/\{\{ESTABLISHED\}\}/g, esc(site.established))
    .replace(/\{\{ADDRESS_STREET\}\}/g, esc(site.address.street))
    .replace(/\{\{ADDRESS_CITY\}\}/g, esc(site.address.city))
    .replace(/\{\{ADDRESS_REGION\}\}/g, esc(site.address.region))
    .replace(/\{\{ADDRESS_ZIP\}\}/g, esc(site.address.zip))
    .replace(/\{\{GHL_LOCATION_ID\}\}/g, esc(site.ghl.locationId))
    .replace(/\{\{GHL_POOL_ID\}\}/g, esc(site.ghl.poolId))
    .replace(/\{\{LEAD_WEBHOOK\}\}/g, site.ghl.webhook)
    .replace(/\{\{ADS_ID\}\}/g, esc(site.ads.conversionId))
    .replace(/\{\{ADS_LABEL\}\}/g, esc(site.ads.conversionLabel))
    .replace(/\{\{GA4_ID\}\}/g, esc(site.ads.ga4Id))
    .replace(/\{\{LEAD_VALUE\}\}/g, String(Number(site.ads.leadValue) || 0))
    .replace(/\{\{PAGE_PATH\}\}/g, esc(page.slug === '/' ? '/' : '/' + page.slug))
    .replace(/\{\{SOURCE_TAG\}\}/g, esc('landing:speedy-oc-la'));

  /* ---- GHL number pool: only emit the DNI scripts once configured ---- */
  if (!site.ghl.locationId || !site.ghl.poolId) {
    s = s.replace(/<!--DNI-->[\s\S]*?<!--\/DNI-->/g, '');
  }

  /* ---- asset/link prefix rewrite ----
   * Rewrite EVERY attribute, not just href — a missed src= means every image
   * 404s from a root-served build. The bare form (no trailing slash) has to be
   * handled too or "/SPEEDY" is left dangling in the output. */
  s = s
    .replace(new RegExp('="' + ASSET_PREFIX + '/', 'g'), '="' + (BASE ? BASE + '/' : '/'))
    .replace(new RegExp('="' + ASSET_PREFIX + '(?=["#?])', 'g'), '="' + (BASE || '/'))
    .replace(new RegExp('\\("' + ASSET_PREFIX + '/', 'g'), '("' + (BASE ? BASE + '/' : '/'))
    .replace(new RegExp("url\\(" + ASSET_PREFIX + "/", 'g'), 'url(' + (BASE ? BASE + '/' : '/'));

  return s;
}

/* ------------------------------------------------- content-hashed image URLs
 * quote-site/img/* is served with `immutable, max-age=31536000`. That is the
 * right header for performance and completely wrong if the filename never
 * changes: re-crop a photo, keep the name, and every browser that already saw
 * it keeps the stale copy for a year. Hashing the filename means changed bytes
 * get a new URL, so the cache is busted automatically and unchanged files stay
 * cached. Learned the hard way. */
function hashImages(outdir) {
  const imgDir = path.join(outdir, 'img');
  if (!fs.existsSync(imgDir)) return {};
  const map = {};
  for (const name of fs.readdirSync(imgDir)) {
    const full = path.join(imgDir, name);
    if (!fs.statSync(full).isFile()) continue;
    const ext = path.extname(name);
    const base = name.slice(0, -ext.length);
    if (/\.[0-9a-f]{8}$/.test(base)) continue;               // already hashed
    const h = crypto.createHash('md5').update(fs.readFileSync(full)).digest('hex').slice(0, 8);
    const hashed = base + '.' + h + ext;
    fs.renameSync(full, path.join(imgDir, hashed));
    map[name] = hashed;
  }
  return map;
}

/** Rewrite every img/<name> reference in the generated text files. */
function applyImageHashes(outdir, map) {
  const names = Object.keys(map).sort((a, b) => b.length - a.length);  // longest first
  if (!names.length) return;
  const targets = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== 'img') walk(full); }
      else if (/\.(html|webmanifest|xml|json|txt)$/.test(e.name)) targets.push(full);
    }
  })(outdir);
  for (const f of targets) {
    let s = fs.readFileSync(f, 'utf8'), changed = false;
    for (const n of names) {
      const re = new RegExp('img/' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (re.test(s)) { s = s.replace(re, 'img/' + map[n]); changed = true; }
    }
    if (changed) fs.writeFileSync(f, s);
  }
}

/* ------------------------------------------------------------------- output */

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function writeFile(rel, content) {
  const full = path.join(OUTDIR, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
}

/* ---- build assertions: fail loudly rather than shipping duplicates ---- */
function assertUnique(field, label) {
  const seen = new Map();
  for (const p of contentPages) {
    const v = plain(p[field]).toLowerCase();
    if (!v) throw new Error('Page "' + p.slug + '" has an empty ' + label + '.');
    if (seen.has(v)) {
      throw new Error(
        'Duplicate ' + label + ' between "' + seen.get(v) + '" and "' + p.slug + '": ' + v
      );
    }
    seen.set(v, p.slug);
  }
}

function build() {
  assertUnique('title', 'title');
  assertUnique('desc', 'meta description');
  assertUnique('h1', 'H1');

  /* Slug collisions would silently overwrite a page. */
  const slugs = new Set();
  for (const p of contentPages) {
    if (slugs.has(p.slug)) throw new Error('Duplicate slug: ' + p.slug);
    slugs.add(p.slug);
  }

  rmrf(OUTDIR);
  fs.mkdirSync(OUTDIR, { recursive: true });

  /* pages */
  for (const p of contentPages) {
    const html = renderPage(p);
    writeFile(p.slug === '/' ? 'index.html' : p.slug + '/index.html', html);
  }

  /* standalone legal pages — same token + prefix treatment */
  for (const legal of [
    { file: 'legal-privacy.html', slug: 'privacy' },
    { file: 'legal-terms.html', slug: 'terms' }
  ]) {
    const src = path.join(__dirname, legal.file);
    if (!fs.existsSync(src)) {
      console.warn('[build] missing ' + legal.file + ' — skipping /' + legal.slug);
      continue;
    }
    let s = fs.readFileSync(src, 'utf8');
    /* Same generated link lists as every other page, so the legal pages can't
     * silently fall out of the internal link graph when a slug is added. */
    s = region(s, 'FOOTER_SERVICES', footerServices);
    s = region(s, 'FOOTER_OC', footerOC);
    s = region(s, 'FOOTER_LA', footerLA);
    s = applyBarBlock(s);
    s = s
      .replace(/\{\{PHONE_E164\}\}/g, esc(site.phoneE164))
      .replace(/\{\{PHONE\}\}/g, esc(site.phoneFormatted))
      .replace(/\{\{CALL_ASSET_E164\}\}/g, esc(site.callAsset.e164))
      .replace(/\{\{CALL_ASSET\}\}/g, esc(site.callAsset.formatted))
      .replace(/\{\{BAR_PHONE_E164\}\}/g, esc(site.barPhoneE164))
      .replace(/\{\{BAR_PHONE\}\}/g, esc(site.barPhoneFormatted))
      .replace(/\{\{BAR_ARD\}\}/g, esc(site.barArd))
      .replace(/\{\{BRAND_SHORT\}\}/g, esc(site.brandShort || site.legalName))
    .replace(/\{\{ORIGIN\}\}/g, 'https://' + site.domain)
    .replace(/\{\{LEGAL_NAME\}\}/g, esc(site.legalName))
      .replace(/\{\{EMAIL\}\}/g, esc(site.email))
      .replace(/\{\{DOMAIN\}\}/g, esc(site.domain))
      .replace(/\{\{YEAR\}\}/g, String(new Date().getFullYear()))
      .replace(/\{\{ADDRESS_STREET\}\}/g, esc(site.address.street))
      .replace(/\{\{ADDRESS_CITY\}\}/g, esc(site.address.city))
      .replace(/\{\{ADDRESS_REGION\}\}/g, esc(site.address.region))
      .replace(/\{\{ADDRESS_ZIP\}\}/g, esc(site.address.zip))
      .replace(/\{\{CANONICAL\}\}/g, esc(absUrl(legal.slug)))
      .replace(new RegExp('="' + ASSET_PREFIX + '/', 'g'), '="' + (BASE ? BASE + '/' : '/'))
      .replace(new RegExp('="' + ASSET_PREFIX + '(?=["#?])', 'g'), '="' + (BASE || '/'));
    writeFile(legal.slug + '/index.html', s);
  }

  /* 404 — Vercel serves /404.html for any unmatched path. A typo'd final URL or
     an expired ad otherwise lands on Vercel's generic page: no logo, no phone,
     no way back, which on a paid click is a guaranteed bounce. Deliberately
     standalone rather than rendered through the template — it must keep working
     even if the template is mid-edit, and it carries no form or tracking. */
  writeFile(
    '404.html',
    '<!doctype html>\n<html lang="en">\n<head>\n' +
      '<meta charset="utf-8">\n' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
      '<meta name="robots" content="noindex,follow">\n' +
      '<title>Page not found — ' + esc(site.legalName) + '</title>\n' +
      '<style>\n' +
      'body{margin:0;background:#F5FCFE;color:#0B1B2B;font:400 17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}\n' +
      '.w{max-width:640px;margin:0 auto;padding:56px 20px 72px;text-align:center}\n' +
      'h1{font-size:clamp(28px,6vw,40px);line-height:1.15;margin:24px 0 12px;letter-spacing:-.02em}\n' +
      'p{color:#4C5C6B;margin:0 0 28px}\n' +
      '.cta{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 26px;' +
      'border-radius:12px;background:#CB4E1A;color:#fff;font-weight:700;text-decoration:none;font-size:18px}\n' +
      '.cta.alt{background:#fff;color:#0A2650;border:2px solid #C9DCE8;margin-left:10px}\n' +
      'nav{margin-top:40px;border-top:1px solid #D8E7EF;padding-top:28px}\n' +
      'nav b{display:block;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#4C5C6B;margin-bottom:14px}\n' +
      'nav a{display:inline-block;margin:0 10px 12px;color:#0A2650;font-weight:600}\n' +
      '@media(max-width:520px){.cta,.cta.alt{display:flex;margin:0 0 12px}}\n' +
      '</style>\n</head>\n<body>\n<div class="w">\n' +
      /* plain img/… path: applyImageHashes() rewrites it to the content-hashed
         filename below, the same as every other page. */
      '<img src="' + (BASE ? BASE : '') + '/img/logo-wordmark.webp" width="156" height="64" alt="' +
      esc(site.legalName) + '">\n' +
      '<h1>That page has moved or never existed</h1>\n' +
      '<p>We still come to you across Orange County and LA County. Call us and we will quote your glass on the phone.</p>\n' +
      '<a class="cta" href="tel:' + esc(site.phoneE164) + '">Call ' + esc(site.phoneFormatted) + '</a>' +
      '<a class="cta alt" href="' + url('/') + '">Get a free quote</a>\n' +
      '<nav><b>Popular pages</b>\n' +
      [
        ['windshield-replacement', 'Windshield replacement'],
        ['windshield-repair', 'Chip &amp; crack repair'],
        ['adas-calibration', 'ADAS calibration'],
        ['mobile-auto-glass', 'Mobile auto glass'],
        ['auto-glass-repair-orange-county', 'Orange County'],
        ['auto-glass-repair-los-angeles-county', 'LA County']
      ]
        .map((x) => '<a href="' + url(x[0]) + '">' + x[1] + '</a>')
        .join('\n') +
      '\n</nav>\n</div>\n</body>\n</html>\n'
  );

  /* images + static assets */
  copyDir(path.join(__dirname, 'img'), path.join(OUTDIR, 'img'));

  /* favicon.ico is served from the root (browsers probe /favicon.ico directly) and
   * must NOT be content-hashed, so it is copied out and the img/ copy removed —
   * otherwise the same 60KB ships twice. */
  const icoSrc = path.join(__dirname, 'img', 'favicon.ico');
  if (fs.existsSync(icoSrc)) {
    fs.copyFileSync(icoSrc, path.join(OUTDIR, 'favicon.ico'));
    const dupe = path.join(OUTDIR, 'img', 'favicon.ico');
    if (fs.existsSync(dupe)) fs.unlinkSync(dupe);
  }

  /* manifest */
  writeFile(
    'site.webmanifest',
    JSON.stringify(
      {
        name: site.name,
        short_name: 'Speedy Glass',
        icons: [
          { src: url('img/icon-192.png'), sizes: '192x192', type: 'image/png' },
          { src: url('img/icon-512.png'), sizes: '512x512', type: 'image/png' }
        ],
        theme_color: site.themeColor,
        background_color: '#FFFFFF',
        display: 'browser',
        start_url: url('/')
      },
      null,
      2
    )
  );

  /* sitemap — content pages only. The legal pages are deliberately noindex, and
     submitting a noindex URL just files a "Submitted URL marked noindex" error in
     Search Console against a report you want clean enough to read. */
  const today = new Date().toISOString().slice(0, 10);
  const sitemapUrls = contentPages.map((p) => ({
    loc: absUrl(p.slug),
    pri: p.slug === '/' ? '1.0' : p.kind === 'city' ? '0.7' : '0.8'
  }));

  writeFile(
    'sitemap.xml',
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      sitemapUrls
        .map(
          (u) =>
            '  <url><loc>' +
            u.loc +
            '</loc><lastmod>' +
            today +
            '</lastmod><priority>' +
            u.pri +
            '</priority></url>'
        )
        .join('\n') +
      '\n</urlset>\n'
  );

  writeFile(
    'robots.txt',
    'User-agent: *\nAllow: /\n\nSitemap: https://' + site.domain + '/sitemap.xml\n'
  );

  /* vercel.json — read by Vercel because Root Directory points at this folder */
  const vjson = path.join(__dirname, 'vercel-static.json');
  if (fs.existsSync(vjson)) {
    fs.copyFileSync(vjson, path.join(OUTDIR, 'vercel.json'));
  }

  const imgMap = hashImages(OUTDIR);
  applyImageHashes(OUTDIR, imgMap);

  console.log('[build] wrote ' + contentPages.length + ' content pages + 2 legal → ' + OUTDIR);
  console.log('[build] content-hashed ' + Object.keys(imgMap).length + ' images (cache-busting)');
  console.log(
    '[build] reviews: ' +
      (reviews
        ? reviews.rating + '★ from ' + reviews.count + ' (' + reviews.quotes.length + ' quotes)'
        : 'NO DATA — rating claims stripped, aggregateRating omitted')
  );
  if (!site.ads.conversionId) {
    console.log('[build] NOTE: Google Ads conversion ID not set — tracking is a safe no-op.');
  }
  if (!site.ghl.webhook) {
    console.log('[build] NOTE: GHL webhook not set — form reports conversion and shows success.');
  }
}

build();
