#!/usr/bin/env node
/**
 * Migration safety net: compare the URLs a client's ads and old site already
 * use against what this build actually serves, and report what would 404.
 *
 * A Google Ads final URL that 404s gets the ad disapproved for "Destination
 * not working" — usually within hours, with no warning first. That ad group
 * stops serving and the landing page history goes with it. This is the check
 * that has to happen BEFORE the DNS cutover, not after.
 *
 * The authoritative URL list is the Ads account, not the old site: a final URL
 * can be referenced by an ad without being linked anywhere crawlable. Export
 * final URLs at keyword, ad AND sitelink level and feed them in with --file.
 *
 *   node landing/check-urls.cjs --file old-urls.txt      # one URL or path per line
 *   node landing/check-urls.cjs --sitemap https://old.example.com/sitemap.xml
 *   node landing/check-urls.cjs --file a.txt --sitemap https://old.example.com/sitemap.xml
 *
 * Exits non-zero if any input URL would 404, so it can gate a cutover.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const cfg = require(path.join(__dirname, 'pages.config.cjs'));
const OUTDIR = process.env.OUTDIR
  ? path.resolve(process.env.OUTDIR)
  : path.join(__dirname, '..', 'quote-site');

const args = process.argv.slice(2);
const argVal = (flag) => {
  const i = args.indexOf(flag);
  return i === -1 ? null : args[i + 1];
};

function normPath(u) {
  let s = String(u || '').trim();
  if (!s) return '';
  s = s.replace(/^https?:\/\/[^/]+/i, '');
  s = s.split('#')[0].split('?')[0];
  if (!s.startsWith('/')) s = '/' + s;
  if (s.length > 1) s = s.replace(/\/+$/, '');
  return s;
}

/* ------------------------------------------------------- what this build serves */

function builtSlugs() {
  const out = new Set();
  if (!fs.existsSync(OUTDIR)) {
    console.error('No build found at ' + OUTDIR + ' — run `npm run build:landing` first.');
    process.exit(2);
  }
  (function walk(dir, prefix) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (e.name === 'img') continue;
        walk(path.join(dir, e.name), prefix + '/' + e.name);
      } else if (e.name === 'index.html') {
        out.add(prefix === '' ? '/' : prefix);
      }
    }
  })(OUTDIR, '');
  return out;
}

const migration = cfg.migration || { preserve: [], redirects: [] };
const redirectMap = new Map(
  (migration.redirects || []).map((r) => [normPath(r.from), normPath(r.to)])
);

/* ------------------------------------------------------------------- inputs */

function readFileUrls(file) {
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    /* Tolerate a pasted Ads export: take the first column that looks like a URL. */
    .map((l) => {
      const m = l.match(/https?:\/\/\S+/);
      return m ? m[0] : l.split(/[\t,]/)[0];
    });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'landing-migration-check' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchText(new URL(res.headers.location, url).href));
        }
        if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
        let b = '';
        res.on('data', (d) => (b += d));
        res.on('end', () => resolve(b));
      })
      .on('error', reject);
  });
}

/* ---------------------------------------------------------------------- run */

(async () => {
  const urls = [];
  const file = argVal('--file');
  const sitemap = argVal('--sitemap');

  if (file) urls.push(...readFileUrls(file));
  if (sitemap) {
    try {
      const xml = await fetchText(sitemap);
      urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
    } catch (e) {
      console.error('Could not read sitemap ' + sitemap + ': ' + e.message);
      process.exit(2);
    }
  }
  if (!urls.length) {
    console.error('Nothing to check. Pass --file <path> and/or --sitemap <url>.');
    console.error('Export final URLs from Google Ads at keyword, ad and sitelink level.');
    process.exit(2);
  }

  const slugs = builtSlugs();
  const seen = new Set();
  const served = [];
  const redirected = [];
  const broken = [];

  for (const raw of urls) {
    const p = normPath(raw);
    if (!p || seen.has(p)) continue;
    seen.add(p);
    if (slugs.has(p)) served.push(p);
    else if (redirectMap.has(p)) {
      const to = redirectMap.get(p);
      if (slugs.has(to)) redirected.push(p + '  ->  ' + to);
      else broken.push(p + '  (redirect points at ' + to + ', which does not exist)');
    } else broken.push(p);
  }

  const say = (label, rows) => {
    if (!rows.length) return;
    console.log('\n' + label + ' (' + rows.length + ')');
    rows.forEach((r) => console.log('  ' + r));
  };

  say('SERVED — same path, nothing to do', served);
  say('REDIRECTED — 301 configured', redirected);
  say('WOULD 404 — fix before cutover', broken);

  /* Slugs declared as must-keep but missing from the build. */
  const missingPreserved = (migration.preserve || [])
    .map(normPath)
    .filter((p) => !slugs.has(p));
  say('DECLARED IN migration.preserve BUT NOT BUILT', missingPreserved);

  const bad = broken.length + missingPreserved.length;
  console.log(
    '\n' +
      (bad ? 'FAILED' : 'PASSED') +
      ' — ' +
      seen.size +
      ' URL(s) checked, ' +
      served.length +
      ' served, ' +
      redirected.length +
      ' redirected, ' +
      bad +
      ' broken\n'
  );
  if (bad) {
    console.log('Fix each by either naming the page with that slug, or adding');
    console.log('{ from, to } to migration.redirects in landing/pages.config.cjs.\n');
  }
  process.exit(bad ? 1 : 0);
})();
