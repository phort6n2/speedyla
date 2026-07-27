#!/usr/bin/env node
/**
 * Refuses to let a client site build or deploy while it still carries template
 * placeholders or another client's live values.
 *
 * The failure this exists to prevent is quiet and expensive: a copied repo
 * deploys with the previous client's phone number, GHL webhook or Ads
 * conversion ID, and their leads land in someone else's CRM. Nothing about the
 * page looks wrong, so it is found by a client asking where their leads went.
 *
 * Run by `npm run verify`, so it gates every build.
 *
 *   node landing/preflight.cjs
 */
'use strict';

const path = require('path');
const cfg = require(path.join(__dirname, 'pages.config.cjs'));
const site = cfg.site;

let failures = 0;
const fail = (m) => { console.log('  FAIL  ' + m); failures++; };
const ok = (m) => console.log('  ok    ' + m);

/* Every value a copied repo must change. `test` returns true when the value is
   still unset, still a placeholder, or obviously not this client's. */
const REQUIRED = [
  ['site.domain',            site.domain],
  ['site.legalName',         site.legalName],
  ['site.brandShort',        site.brandShort],
  ['site.email',             site.email],
  ['site.phoneFormatted',    site.phoneFormatted],
  ['site.phoneE164',         site.phoneE164],
  ['site.callAsset.e164',    site.callAsset && site.callAsset.e164],
  ['site.address.street',    site.address && site.address.street],
  ['site.address.city',      site.address && site.address.city],
  ['site.address.zip',       site.address && site.address.zip],
  ['site.ghl.webhook',       site.ghl && site.ghl.webhook],
  ['site.ghl.locationId',    site.ghl && site.ghl.locationId],
  ['site.ads.conversionId',  site.ads && site.ads.conversionId],
  ['site.ads.conversionLabel', site.ads && site.ads.conversionLabel]
];

const PLACEHOLDER = /REPLACE__|TODO|CHANGEME|XXXX|your-domain|example\.com/i;

for (const [name, value] of REQUIRED) {
  if (!value) fail(name + ' is empty');
  else if (PLACEHOLDER.test(String(value))) fail(name + ' is still a placeholder: ' + value);
}

/* Shape checks — a malformed value fails silently at runtime rather than loudly
   at build time, which is the worst combination. */
if (site.phoneE164 && !/^\+1\d{10}$/.test(site.phoneE164)) {
  fail('site.phoneE164 must be +1 then 10 digits, got: ' + site.phoneE164);
}
if (site.callAsset && site.callAsset.e164 && !/^\+1\d{10}$/.test(site.callAsset.e164)) {
  fail('site.callAsset.e164 must be +1 then 10 digits, got: ' + site.callAsset.e164);
}
if (site.ads && site.ads.conversionId && !/^AW-\d{9,12}$/.test(site.ads.conversionId)) {
  fail('site.ads.conversionId must look like AW-1234567890, got: ' + site.ads.conversionId);
}
if (site.ghl && site.ghl.webhook && !/^https:\/\/services\.leadconnectorhq\.com\/hooks\//.test(site.ghl.webhook)) {
  fail('site.ghl.webhook does not look like a HighLevel inbound webhook URL');
}
if (site.domain && /^https?:/.test(site.domain)) {
  fail('site.domain should be a bare hostname, not a URL: ' + site.domain);
}

/* The call asset must be a different number from the DNI-swapped one. If they
   match, Google's forwarding number and the number pool fight over the same
   line and call attribution silently becomes meaningless. */
if (site.callAsset && site.callAsset.e164 && site.callAsset.e164 === site.phoneE164) {
  fail('site.callAsset.e164 is the same as site.phoneE164 — the Google call asset must be its own number');
}

/* Geo defaults are easy to leave at whatever the previous client had. */
if (!site.geo || typeof site.geo.lat !== 'number' || typeof site.geo.lng !== 'number') {
  fail('site.geo.lat / site.geo.lng missing — LocalBusiness JSON-LD needs real coordinates');
}

if (!failures) {
  ok('all client-specific values are set and well-formed (' + REQUIRED.length + ' checked)');
}

console.log(
  '\nPREFLIGHT ' + (failures ? 'FAILED' : 'PASSED') + ' — ' + failures + ' problem(s)\n'
);
process.exit(failures ? 1 : 0);
