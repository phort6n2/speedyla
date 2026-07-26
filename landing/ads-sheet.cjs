#!/usr/bin/env node
/* Emits docs/google-ads-build-sheet.md — the paste-ready version of the plan in
 * docs/google-ads-launch.md. That doc explains the reasoning; this one is just
 * blocks you copy into the Google Ads UI, ad group by ad group.
 *
 * The RSA assets live here rather than in the markdown so they can be length-
 * checked on every run. Google silently truncates nothing — it rejects the
 * asset — so an over-length headline is a build error, not a warning.
 *
 *   node landing/ads-sheet.cjs
 */
'use strict';

const fs = require('fs');
const path = require('path');
const cfg = require('./pages.config.cjs');

const ORIGIN = 'https://' + cfg.site.domain;
const LIM = { headline: 30, description: 90, path: 15 };

/* ------------------------------------------------------------------ content */

const GROUPS = [
{
  name: 'SVC | WS Replacement — Core',
  page: '/windshield-replacement',
  share: '~25%',
  paths: ['Windshield', 'Mobile'],
  note: 'Highest-volume head term in the account. Bid "windshield replacement cost" down 30% — that is a price shopper, not a buyer.',
  keywords: [
    '[windshield replacement]',
    '[windshield replacement near me]',
    '[new windshield]',
    '[auto windshield replacement]',
    '"replace windshield"',
    '"windshield replacement quote"',
    '"front windshield replacement"',
    '"windshield replacement same day"',
    '"cracked windshield replacement"',
    '"windshield replacement shop near me"',
    '"windshield replacement cost"',
    '"windshield replacement open now"'
  ],
  headlines: [
    'Windshield Replacement',
    'Mobile Windshield Service',
    'We Come To You',
    'Replaced In Your Driveway',
    'Same-Day Appointments',
    'Mobile At No Extra Charge',
    'Free Quote In Under A Minute',
    'Orange County & LA County',
    'Camera Recalibration Too',
    'We Bill Your Carrier Direct',
    'Lifetime Workmanship Warranty',
    '4.9 Stars On Google',
    '1,100+ Google Reviews',
    'Send Your VIN, Get A Price',
    'Book Today For Tomorrow'
  ],
  descriptions: [
    'We replace your windshield where the car already is. Home, office, jobsite. No extra fee.',
    'Send us the VIN and we quote the exact glass your car takes. No guessing, no bait price.',
    'Cameras behind the glass are recalibrated on the same visit. One appointment, one tech.',
    'Workmanship warranted for as long as you own the vehicle. Quote takes under a minute.'
  ]
},
{
  name: 'SVC | WS Replacement — Insurance',
  page: '/insurance-claims',
  share: '~15%',
  paths: ['Insurance', 'Claim'],
  note: 'Most legally sensitive ad group in the account. Carrier names are fine as keywords and NOT in ad copy. Do not add "windshield replacement no deductible" until counsel clears the deductible programme.',
  keywords: [
    '[windshield replacement insurance]',
    '[does insurance cover windshield replacement]',
    '"windshield replacement with insurance"',
    '"is windshield replacement covered by insurance"',
    '"insurance approved auto glass shop"',
    '"auto glass insurance claim"',
    '"file windshield insurance claim"',
    '"comprehensive deductible windshield"',
    '"geico windshield replacement"',
    '"state farm windshield replacement"',
    '"usaa windshield replacement"',
    '"aaa windshield replacement"'
  ],
  headlines: [
    'Windshield Insurance Claim',
    'We Bill Your Carrier Direct',
    'We Check Your Coverage First',
    'Your Claim, Handled For You',
    'Mobile Windshield Replacement',
    'You Pick The Glass Shop',
    'Insurance Code 758.5',
    'We Come To You',
    'Calibration Billed Too',
    'Know The Cost Before We Go',
    'Same-Day Appointments',
    '4.9 Stars On Google',
    'Lifetime Workmanship Warranty',
    'Orange County & LA County'
  ],
  descriptions: [
    'We verify your coverage before dispatch, so you know your cost before anyone shows up.',
    'We file and bill your carrier directly. You approve the work and we handle the paperwork.',
    'Your insurer cannot require you to use its shop. California Insurance Code 758.5.',
    'Calibration is part of the claim, not a surprise line item. We bill it with the glass.'
  ]
},
{
  name: 'SVC | WS Replacement — OEM & Vehicle',
  page: '/windshield-replacement',
  share: '~10%',
  paths: ['OEM-Glass', 'Windshield'],
  note: 'Your ADAS proxy — the closest thing to a keyword meaning "expensive job". Bid these up. Honda and Acura are deliberate: Torrance is American Honda\'s US HQ city.',
  keywords: [
    '"oem windshield replacement"',
    '"oem glass windshield"',
    '"tesla windshield replacement"',
    '"bmw windshield replacement"',
    '"mercedes windshield replacement"',
    '"lexus windshield replacement"',
    '"audi windshield replacement"',
    '"honda windshield replacement"',
    '"acura windshield replacement"',
    '"windshield replacement with camera"',
    '"windshield replacement lane assist"',
    '"heads up display windshield replacement"',
    '"acoustic windshield replacement"'
  ],
  headlines: [
    'OEM Windshield Replacement',
    'OEM & OEM-Equivalent Glass',
    'Glass Matched To Your VIN',
    'Camera & Sensor Glass',
    'Lane Assist Recalibrated',
    'Heads-Up Display Glass',
    'Acoustic Windshields Stocked',
    'Tesla, BMW, Lexus, Acura',
    'Mobile At No Extra Charge',
    'One Visit, Glass & Calibration',
    'Lifetime Workmanship Warranty',
    '4.9 Stars On Google',
    'Orange County & LA County',
    'Send Your VIN, Get A Price'
  ],
  descriptions: [
    'Send the VIN and we identify the exact glass your car takes, brackets and sensors.',
    'Camera, rain sensor, acoustic layer, heads-up display. We order the glass your car needs.',
    'We recalibrate the forward camera on the same visit, so you drive away finished.',
    'OEM and OEM-equivalent options quoted side by side. You choose, we order it that day.'
  ]
},
{
  name: 'SVC | ADAS Calibration',
  page: '/adas-calibration',
  share: '~5%',
  paths: ['ADAS', 'Calibration'],
  note: 'Do NOT judge this on lead count. Its value is a few high-ticket consumer jobs plus body shops and recon lots wanting a mobile subcontractor — a B2B line worth more than the retail clicks.',
  keywords: [
    '[adas calibration]',
    '[adas calibration near me]',
    '[windshield camera calibration]',
    '"adas calibration after windshield replacement"',
    '"windshield calibration cost"',
    '"adas recalibration"',
    '"forward collision camera recalibration"',
    '"mobile adas calibration for shops"',
    '"adas calibration subcontractor"',
    '"adas calibration service for body shops"'
  ],
  headlines: [
    'Mobile ADAS Calibration',
    'Windshield Camera Calibration',
    'Static & Dynamic Calibration',
    'We Bring The Targets To You',
    'Calibration After Glass Work',
    'For Body Shops & Dealers',
    'Subcontract Your Calibrations',
    'Pre & Post Scan Report',
    'Lane Assist & Collision Camera',
    'Orange County & LA County',
    'Same-Week Scheduling',
    '4.9 Stars On Google',
    'Documented For The Claim',
    'We Come To Your Shop'
  ],
  descriptions: [
    'We bring the targets and the scan tool to your bay. No towing a finished car across town.',
    'Static and dynamic calibration for forward cameras, with a pre and post scan report.',
    'Body shops and recon lots: subcontract your calibrations instead of turning work away.',
    'Replaced the glass elsewhere and got told it needs calibration? We do that part alone.'
  ]
},
{
  name: 'SVC | Chip & Crack Repair',
  page: '/windshield-repair',
  share: '~10%',
  paths: ['Chip-Repair', 'Mobile'],
  note: 'Cheapest conversion in the account. A large share of "windshield repair" searchers actually need a replacement — the page handles that with a size test and a branch to the replacement page.',
  keywords: [
    '[windshield repair]',
    '[windshield chip repair]',
    '[windshield crack repair]',
    '[windshield chip repair near me]',
    '"rock chip repair"',
    '"windshield repair near me"',
    '"fix windshield chip"',
    '"chip in windshield repair"',
    '"small crack in windshield fix"',
    '"windshield crack repair cost"'
  ],
  negatives: ['"kit"', '"diy"', '"resin"', '"toothpaste"', '"nail polish"', '"super glue"'],
  headlines: [
    'Windshield Chip Repair',
    'Rock Chip Repair',
    'Stop The Crack Spreading',
    'Repaired In Your Driveway',
    'We Come To You',
    'Often No Deductible To Pay',
    'Same-Day Chip Repair',
    'Cheaper Than A Replacement',
    'Mobile At No Extra Charge',
    'Quarter-Size Or Smaller',
    'Orange County & LA County',
    '4.9 Stars On Google',
    'Free Quote In Under A Minute',
    'Book Today For Tomorrow'
  ],
  descriptions: [
    'Most carriers waive the deductible on chip repair, so it often costs you nothing to claim.',
    'A chip spreads with the next cold morning or speed bump. Repaired now it stays a chip.',
    'Chip smaller than a quarter and out of your sightline? It repairs. We tell you either way.',
    'We come to your home or office. Under an hour, and the glass keeps its factory seal.'
  ]
},
{
  name: 'SVC | Auto Glass (Category)',
  page: '/auto-glass-replacement',
  share: '~10%',
  paths: ['Auto-Glass', 'Mobile'],
  note: 'The ad group negatives here are essential, not optional. Without them this group eats queries that belong to every other ad group and the account loses its routing.',
  keywords: [
    '[auto glass repair]',
    '[auto glass near me]',
    '[auto glass replacement]',
    '"auto glass shop near me"',
    '"car glass replacement"',
    '"auto glass replacement cost"',
    '"auto glass company near me"',
    '"automotive glass replacement"',
    '"best auto glass shop"'
  ],
  negatives: ['"windshield"', '"back glass"', '"rear window"', '"side window"', '"door glass"',
              '"calibration"', '"adas"', '"mobile"', '"tint"'],
  headlines: [
    'Mobile Auto Glass Service',
    'Auto Glass Replacement',
    'We Come To You',
    'Every Window On The Car',
    'Windshield, Door, Back Glass',
    'Same-Day Appointments',
    'We Bill Your Carrier Direct',
    'Mobile At No Extra Charge',
    'Lifetime Workmanship Warranty',
    'Certified Glass Technicians',
    '4.9 Stars On Google',
    '1,100+ Google Reviews',
    'Orange County & LA County',
    'Free Quote In Under A Minute'
  ],
  descriptions: [
    'Windshields, door glass, back glass, quarter glass. We carry it and install it curbside.',
    'One number for every piece of glass on the vehicle, replaced where the car is parked.',
    'Send the VIN and get the exact glass and the exact price. No shop visit to find out.',
    'Workmanship warranted for as long as you own the vehicle. Quote takes under a minute.'
  ]
},
{
  name: 'SVC | Mobile Auto Glass',
  page: '/mobile-auto-glass',
  share: '~5%',
  paths: ['Mobile', 'We-Come-To-You'],
  note: 'Mobile is the fulfilment model, not one service among many — it is the only structural advantage over a shop with a storefront. That is why the mobile angle also appears in every other ad group\'s headlines.',
  keywords: [
    '[mobile auto glass]',
    '[mobile windshield replacement]',
    '[mobile windshield repair]',
    '"mobile auto glass near me"',
    '"mobile auto glass service"',
    '"windshield replacement that comes to you"',
    '"at home windshield replacement"',
    '"onsite windshield replacement"',
    '"come to you auto glass"'
  ],
  headlines: [
    'Mobile Auto Glass',
    'We Come To You',
    'No Extra Charge For Mobile',
    'Glass Done In Your Driveway',
    'We Work At Your Office Lot',
    'Never Visit A Shop',
    'Same-Day Mobile Service',
    'Windshields At Your Curb',
    'Calibration Done On Site Too',
    'Orange County & LA County',
    '4.9 Stars On Google',
    'Lifetime Workmanship Warranty',
    'Pick Your Time Window',
    'Free Quote In Under A Minute'
  ],
  descriptions: [
    'Our van carries the glass, the adhesive and the calibration targets. Nothing gets towed.',
    'Home driveway, office lot, jobsite. Pick the address and a time window that works.',
    'Mobile is how we work, not an upsell. There is no callout fee and no shop to drive to.',
    'Even the camera recalibration happens on site, so one visit finishes the whole job.'
  ]
},
{
  name: 'GEO | Irvine',
  page: '/auto-glass-repair-irvine',
  share: '~7%',
  paths: ['Irvine', 'Auto-Glass'],
  note: 'Highest-value geo in the account: median household income ~$129k and the newest fleet in either county, so the best ADAS attach rate you will find. Compounds with the +20% Irvine location bid adjustment.',
  keywords: [
    '[auto glass repair irvine]',
    '[windshield replacement irvine]',
    '"windshield repair irvine"',
    '"auto glass irvine ca"',
    '"mobile auto glass irvine"',
    '"mobile windshield replacement irvine"',
    '"auto glass shop irvine"',
    '"car window replacement irvine"'
  ],
  negatives: ['"irvine welsh"', '"irvine ky"', '"irvine kentucky"', '"irvine scotland"', '"uc irvine"', '"uci"'],
  headlines: [
    'Irvine Auto Glass Repair',
    'Windshield Replacement Irvine',
    'Mobile Auto Glass In Irvine',
    'We Come To You In Irvine',
    'Irvine Spectrum To Woodbridge',
    'Same-Day Service In Irvine',
    'Glass At Your Irvine Office',
    'Camera Recalibration Too',
    'We Bill Your Carrier Direct',
    'Mobile At No Extra Charge',
    '4.9 Stars On Google',
    'Lifetime Workmanship Warranty',
    'Free Quote In Under A Minute',
    'Irvine Business Parks Served'
  ],
  descriptions: [
    'We replace glass in the Irvine business park lots while you stay at your desk.',
    'Newer cars mean cameras behind the glass. We recalibrate on the same visit, same tech.',
    'From Woodbridge to Great Park to the Spectrum. Pick an address and a time window.',
    'Send the VIN and get the exact glass and price before we dispatch a van to Irvine.'
  ]
},
{
  name: 'GEO | Orange County',
  page: '/auto-glass-repair-orange-county',
  share: '~7%',
  paths: ['Orange-County', 'Auto-Glass'],
  note: 'Orange County, FL is the Orlando metro and it is large. The geo negatives below are not optional.',
  keywords: [
    '[auto glass repair orange county]',
    '[windshield replacement orange county]',
    '"auto glass orange county"',
    '"mobile auto glass orange county"',
    '"windshield repair orange county"',
    '"orange county auto glass shop"',
    '"windshield replacement oc"',
    '"auto glass repair oc"'
  ],
  negatives: ['"florida"', '"fl"', '"orlando"', '"ny"', '"new york"', '"nc"', '"tx"', '"va"'],
  headlines: [
    'Orange County Auto Glass',
    'OC Windshield Replacement',
    'Mobile Across Orange County',
    'We Come To You In OC',
    'Irvine To San Clemente',
    'Same-Day Service In OC',
    'Mobile At No Extra Charge',
    'Camera Recalibration Too',
    'We Bill Your Carrier Direct',
    'Lifetime Workmanship Warranty',
    '4.9 Stars On Google',
    '1,100+ Google Reviews',
    'Free Quote In Under A Minute',
    'Every OC City Covered'
  ],
  descriptions: [
    'Anaheim to San Clemente, Huntington Beach to Yorba Linda. Our vans cover the county.',
    'We replace the glass where the car is parked anywhere in Orange County. No shop visit.',
    'Send the VIN and get the exact glass and the exact price before a van leaves.',
    'Cameras recalibrated on the same visit. Workmanship warranted as long as you own it.'
  ]
},
{
  name: 'GEO | Los Angeles',
  page: '/auto-glass-repair-los-angeles-county',
  share: '~6%',
  paths: ['LA-County', 'Auto-Glass'],
  note: 'Keep exact-heavy and cap at roughly 15% of campaign spend. The most expensive terms in the account, and they pull the whole county including the areas you geo-blocked.',
  keywords: [
    '[auto glass repair los angeles]',
    '[windshield replacement los angeles]',
    '[auto glass repair los angeles county]',
    '"auto glass los angeles"',
    '"mobile auto glass los angeles"',
    '"windshield repair los angeles"',
    '"windshield replacement la county"',
    '"los angeles auto glass shop"'
  ],
  headlines: [
    'LA County Auto Glass',
    'Windshield Replacement In LA',
    'Mobile Auto Glass, LA County',
    'We Come To You In LA County',
    'Long Beach To Santa Monica',
    'South Bay & San Gabriel Valley',
    'Same-Day LA Appointments',
    'Mobile At No Extra Charge',
    'Camera Recalibration Too',
    'We Bill Your Carrier Direct',
    'Lifetime Workmanship Warranty',
    '4.9 Stars On Google',
    'Free Quote In Under A Minute',
    'Skip The LA Shop Traffic'
  ],
  descriptions: [
    'Long Beach, Torrance, Santa Monica, Pasadena, Downey. We bring the glass to the car.',
    'Nobody in LA wants to drive across town twice for a windshield. We come to the car.',
    'Send the VIN and get the exact glass and the exact price before we dispatch a van.',
    'Cameras recalibrated on the same visit. Workmanship warranted as long as you own it.'
  ]
}
];

const SHARED_NEGATIVES = {
  'NEG — Global Waste': [
    'windshield wiper', 'wiper blade', 'wiper blades', 'washer fluid', 'windshield washer',
    'rain sensor', 'windshield sticker', 'registration sticker', 'windshield decal',
    'windshield banner', 'sun shade', 'windshield cover', 'repair kit', 'diy', 'resin',
    'how to', 'do it yourself', 'jobs', 'hiring', 'salary', 'training', 'course', 'school',
    'apprentice', 'wholesale', 'supplier', 'distributor', 'junkyard', 'salvage',
    'used windshield', 'car insurance quote', 'auto insurance', 'home window', 'house window',
    'shower door', 'storefront glass', 'plexiglass', 'sunroof', 'side mirror', 'mirror glass',
    'headlight', 'rv', 'motorhome', 'boat', 'forklift', 'tractor', 'motorcycle', 'semi truck'
  ],
  'NEG — Geo Confusion': [
    'glendale az', 'glendale arizona', 'glendale heights', 'orange county florida',
    'orange county fl', 'orlando', 'orange county ny', 'long beach ny', 'long beach island',
    'pasadena tx', 'pasadena texas', 'santa ana winds', 'santa ana zoo', 'santa monica pier',
    'robert downey', 'downey jr', 'downy', 'fabric softener', 'cal state fullerton',
    'irvine spectrum'
  ],
  'NEG — Tint (no page yet)': ['tint', 'tinting', 'window film', 'ceramic tint', 'limo tint']
};

/* Every targeted city/county name, phrase-negative in the seven service ad groups so
   geo-modified queries route to the geo ad group and its matching page. */
const ROUTING_NEGATIVES = ['irvine', 'orange county', 'oc', 'los angeles', 'la county'];

const SITELINKS = [
  ['Mobile Service', 'We come to you at no extra charge', 'Home, office or jobsite', '/mobile-auto-glass'],
  ['Insurance Claims', 'We bill your carrier direct', 'We check coverage before dispatch', '/insurance-claims'],
  ['ADAS Calibration', 'Camera recalibrated on the same visit', 'Static and dynamic, mobile', '/adas-calibration'],
  ['Chip Repair', 'Stop a chip before it spreads', 'Often no deductible to pay', '/windshield-repair'],
  ['Orange County', 'Every OC city, mobile service', 'Anaheim to San Clemente', '/auto-glass-repair-orange-county'],
  ['LA County', 'South Bay to San Gabriel Valley', 'Long Beach to Pasadena', '/auto-glass-repair-los-angeles-county']
];

const CALLOUTS = [
  'Mobile at no extra charge', 'Lifetime workmanship warranty', 'We bill your carrier direct',
  'Same-day appointments', 'Camera recalibration on site', '4.9 stars on Google',
  'OEM and OEM-equivalent glass', 'Orange County & LA County'
];

const SNIPPETS = [
  'Windshield replacement', 'Chip and crack repair', 'ADAS calibration',
  'Back glass replacement', 'Door and side glass', 'Mobile auto glass'
];

/* ------------------------------------------------------------- validation */

let failures = 0;
const bad = (m) => { console.error('FAIL ' + m); failures++; };

/* Google rejects an over-length asset outright, so treat it as a build error. */
for (const g of GROUPS) {
  const seen = new Set();
  for (const h of g.headlines) {
    if (h.length > LIM.headline) bad(`headline ${h.length}/${LIM.headline} — "${h}" (${g.name})`);
    if (seen.has(h)) bad(`duplicate headline "${h}" (${g.name})`);
    seen.add(h);
  }
  for (const d of g.descriptions) {
    if (d.length > LIM.description) bad(`description ${d.length}/${LIM.description} — "${d}" (${g.name})`);
  }
  for (const p of g.paths) {
    if (p.length > LIM.path) bad(`path ${p.length}/${LIM.path} — "${p}" (${g.name})`);
  }
  if (g.headlines.length < 12) bad(`${g.name} has only ${g.headlines.length} headlines (Google wants 12–15)`);
  if (g.descriptions.length !== 4) bad(`${g.name} has ${g.descriptions.length} descriptions, expected 4`);

  /* Every final URL must be a page that actually built. A 404 behind a live ad
     burns budget silently and tanks the landing page experience score. */
  const out = path.join(__dirname, '..', 'quote-site', g.page.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(out)) bad(`${g.name} points at ${g.page} which does not exist in quote-site/`);
}

/* Compliance — the README rules, restated as patterns. Two phrases are allowed
   because they describe the insurer's decision rather than a discount from us. */
const ALLOWED = new Set([
  'Most carriers waive the deductible on chip repair, so it often costs you nothing to claim.',
  'Often No Deductible To Pay'
]);
const BANNED = [
  [/deductible/i, 'deductible claim'], [/\$\d|\$0/, 'a price'], [/free windshield/i, 'free glass claim'],
  [/\bapproved\b|preferred provider|authorized/i, 'carrier affiliation'],
  [/\bbest\b|#1|lowest price/i, 'superlative'], [/guarantee/i, 'guarantee'],
  [/\bminutes\b/i, 'a drive-away time']
];
for (const g of GROUPS) {
  for (const s of g.headlines.concat(g.descriptions)) {
    if (ALLOWED.has(s)) continue;
    for (const [re, what] of BANNED) {
      if (re.test(s)) bad(`${what} in "${s}" (${g.name})`);
    }
  }
}

if (failures) {
  console.error(`\n${failures} problem(s) — sheet not written.`);
  process.exit(1);
}

/* ---------------------------------------------------------------- emit */

const L = [];
const put = (...x) => L.push(...x);
const block = (lines) => put('```', ...lines, '```', '');

put('# Google Ads — paste sheet',
    '',
    'Generated by `landing/ads-sheet.cjs`. Every headline, description and path in here',
    'is length-checked against Google\'s limits and scanned against the ad copy rules on',
    'each run, and every final URL is checked to exist in `quote-site/`.',
    '',
    'The reasoning behind these choices is in `docs/google-ads-launch.md` — this file is',
    'just the blocks to copy.',
    '',
    '**Campaign:** `SRCH | OC+LAC | Core Glass` · Search only · $150/day · Maximize Clicks',
    'with a ~$12 CPC ceiling · Presence-only location targeting · Search Partners and',
    'Display expansion OFF.',
    '',
    '> Paste keywords into the Google Ads keyword box as-is — it reads one per line and',
    '> understands `[exact]` and `"phrase"`. Headlines and descriptions have to go in one',
    '> field at a time; they are listed in the order to enter them.',
    '',
    '---',
    '');

GROUPS.forEach((g, i) => {
  put(`## ${i + 1}. ${g.name}`,
      '',
      `**Final URL** — paste into the ad group's ad:`,
      '');
  block([ORIGIN + g.page]);
  put(`**Display path** (the two boxes after the domain): \`${g.paths[0]}\` and \`${g.paths[1]}\``,
      '',
      `**Budget share:** ${g.share}`,
      '');
  if (g.note) put('> ' + g.note, '');

  put(`### Keywords (${g.keywords.length})`, '');
  block(g.keywords);

  if (g.negatives) {
    put(`### Ad group negatives (${g.negatives.length}) — add these to THIS ad group only`, '');
    block(g.negatives);
  }

  put(`### Headlines (${g.headlines.length}) — pin #1 to position 1, pin nothing else`, '');
  block(g.headlines);

  put(`### Descriptions (${g.descriptions.length})`, '');
  block(g.descriptions);

  put('---', '');
});

put('## Shared negative lists',
    '',
    'Build each as a shared list under Tools → Shared library → Negative keyword lists,',
    'then attach all three to the campaign.',
    '');
for (const [name, words] of Object.entries(SHARED_NEGATIVES)) {
  put(`### \`${name}\` (${words.length})`, '');
  block(words);
}

put('### Routing negatives — add to all seven SVC ad groups',
    '',
    'Service and geo ad groups share one campaign, so they compete for geo-modified',
    'queries. These force "windshield replacement irvine" into the Irvine ad group and',
    'onto the Irvine page, which is what earns the ad relevance and landing page',
    'experience components of Quality Score.',
    '');
block(ROUTING_NEGATIVES.map((w) => '"' + w + '"'));
put('Also add `"irvine"` to the two county hub ad groups, so the hubs do not outbid the',
    'city page for its own name.',
    '',
    '---',
    '');

put('## Campaign assets', '', '### Sitelinks', '');
put('| Text | Description 1 | Description 2 | Final URL |', '|---|---|---|---|');
for (const [t, d1, d2, u] of SITELINKS) put(`| ${t} | ${d1} | ${d2} | \`${ORIGIN}${u}\` |`);
put('');
put('### Callouts', '');
block(CALLOUTS);
put('### Structured snippet — header "Services"', '');
block(SNIPPETS);
put(`### Call asset`, '',
    `Use **${cfg.site.callAsset.formatted}** — the Google call-forwarding number, already`,
    'in the site footer and deliberately excluded from dynamic number insertion. Schedule',
    'it to real answering hours and turn call reporting on.',
    '');

const outFile = path.join(__dirname, '..', 'docs', 'google-ads-build-sheet.md');
fs.writeFileSync(outFile, L.join('\n').replace(/\n{3,}/g, '\n\n') + '\n');

const nH = GROUPS.reduce((n, g) => n + g.headlines.length, 0);
const nD = GROUPS.reduce((n, g) => n + g.descriptions.length, 0);
const nK = GROUPS.reduce((n, g) => n + g.keywords.length, 0);
console.log(`[ads-sheet] ${GROUPS.length} ad groups, ${nK} keywords, ${nH} headlines, ${nD} descriptions`);
console.log(`[ads-sheet] all assets within limits, all final URLs exist → ${path.relative(process.cwd(), outFile)}`);
