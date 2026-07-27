/**
 * All page content for the Speedy Windshield Repair OC/LA landing site.
 *
 * COMPLIANCE RULES BAKED INTO THIS COPY — read before editing:
 *
 *  1. NO deductible-offset offers. California Penal Code § 551(b) makes it
 *     unlawful for an automotive repair dealer to "knowingly offer or give any
 *     discount intended to offset a deductible required by a policy of
 *     insurance." The client's existing San Diego page advertises "up to $300
 *     OFF deductible"; that language is deliberately absent here. The $0 angle
 *     is carried only by facts about the INSURER's decision (some policies
 *     carry a zero glass deductible; most carriers waive it on chip repair)
 *     and by direct billing.
 *
 *  2. NO claim that California law makes glass free. It does not. Florida,
 *     Kentucky and South Carolina mandate zero-deductible glass; California
 *     does not.
 *
 *  3. NO invented prices. Nothing says "from $X" anywhere, because no verified
 *     price floors were supplied. Add them only once the client confirms real
 *     numbers, and then the page and the ad must show the same figure.
 *
 *  4. NO carrier logos and no "approved/preferred/authorized shop" claims.
 *     Carrier names appear only as a factual direct-billing list, always with
 *     the non-affiliation disclaimer.
 *
 *  5. NO unqualified drive-away time. Safe drive-away time is set by the
 *     urethane manufacturer's spec, so copy says "we tell you the real safe
 *     drive-away time" rather than naming minutes.
 *
 *  6. "Lifetime warranty" is always defined on-page (see the warranty section
 *     in the template) rather than asserted bare.
 */

module.exports = {
  site: {
    domain: 'la.speedywindshield.com',

    /* Display name. legalName must match the BAR ARD registration certificate
     * exactly — VERIFY against the certificate before launch (16 CCR § 3371.2). */
    name: 'Speedy Windshield Repair',
    legalName: 'Speedy Windshield Repair',
    /* Short conversational form of the name, used in body copy where the full
       registered name would read stiffly ("A Speedy tech will call you"). */
    brandShort: 'Speedy',

    /* Header / CTA / form-error number — THIS is the one the GHL number pool
     * swaps. A 949 area code, so it reads local to Orange County rather than
     * advertising a San Diego number on an OC/LA landing page. */
    phoneFormatted: '(949) 400-0096',
    phoneE164: '+19494000096',

    /* The BAR-registered line, shown only when barArd is set. Left as the San
     * Diego number because that is the registered place of business — confirm
     * against what BAR actually has on file before switching the ARD block on. */
    barPhoneFormatted: '(619) 761-4887',
    barPhoneE164: '+16197614887',

    /* California Bureau of Automotive Repair ARD registration number.
     * EMPTY = the compliance block degrades to plain name/phone/address.
     * Fill it in and the full 16 CCR § 3371.2 block renders automatically —
     * it is on the shop's BAR certificate and on its invoices. */
    barArd: '',

    /* Google Ads call-asset number. Google verifies this number actually appears
     * on the site, so it is rendered in the footer and marked ghl-no-swap —
     * if DNI ever rewrote it, call-asset verification would fail.
     * A 949 area code, which also reads as local to Orange County. */
    callAsset: { formatted: '(949) 736-5211', e164: '+19497365211' },

    email: 'Speedywindshieldrepairsd@gmail.com',

    address: {
      street: '2710 Garnet Ave Suite 201',
      city: 'San Diego',
      region: 'CA',
      zip: '92109'
    },
    /* Approximate, from the Pacific Beach address. VERIFY before launch. */
    geo: { lat: 32.7989, lng: -117.2402 },

    hours: [
      { days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:30' },
      { days: ['Saturday'], opens: '08:00', closes: '16:00' },
      { days: ['Sunday'], closed: true }
    ],

    established: '2018',
    mapsUrl: '',            /* filled from reviews.json once the Place ID is verified */
    sameAs: ['https://speedywindshieldrepairsd.com/'],

    ogImage: 'og-image.png',
    themeColor: '#0A2650',

    /* Google Ads — paste from Ads → Tools → Conversions → action → Tag setup.
     * Empty is safe: the whole tracking block no-ops until these are filled. */
    ads: {
      /* "Submit lead form" conversion action. From Ads → Tools → Conversions →
       * the action → Tag setup → Use Google tag, which shows:
       *   send_to: 'AW-10977214637/tZMWCPuP6dYcEK2BrPIo'
       * The page builds that send_to itself and adds a transaction_id, value and
       * dedupe, so Google's bare event snippet is not pasted in anywhere. */
      conversionId:    'AW-10977214637',
      conversionLabel: 'tZMWCPuP6dYcEK2BrPIo',
      ga4Id: '',
      /* Set this once average booked-job value is known — it lets Smart Bidding
       * optimise toward revenue rather than raw lead count. */
      leadValue: 0
    },

    /* HighLevel. Empty webhook = form still reports the conversion and shows
     * success. Empty pool/location = the DNI scripts are not emitted at all. */
    ghl: {
      /* Inbound Webhook (premium trigger). This URL is visible in page source —
       * unavoidable for any browser-side post. It is write-only, but anyone can
       * call it, so keep spam filtering on in GHL. */
      webhook: 'https://services.leadconnectorhq.com/hooks/bEPjxnxSU2AfYQ1PIhK1/webhook-trigger/D6EuRh5CTS1KweBrURkM',
      locationId: 'bEPjxnxSU2AfYQ1PIhK1',
      /* Number pool for DNI. Swaps the primary (949) 400-0096 number in the
       * header, CTAs and sticky bar so GHL can attribute calls and report call
       * conversions to Google Ads via its Number Pool Calling trigger.
       *
       * The footer call-asset number (949) 736-5211 carries ghl-no-swap and is
       * asserted by verify.cjs on every page — Google verifies that number
       * appears on the site, so DNI must never rewrite it.
       *
       * NOTE: BAR has not yet confirmed the § 3371.2 position on tracking
       * numbers differing from the registered number. See the README. */
      poolId: '8OhDwbZ3BY05Z9OihVz9'
    }
  },

  /* ==================== migration from an existing site ====================
   * Fill this in BEFORE the first deploy when a client is moving off an
   * existing landing page (HighLevel, Unbounce, WordPress, anything).
   *
   * The rule for anything an ad points at is EXACT PARITY: the new site serves
   * the same path the old site served. Not a redirect to it — the same path.
   *   - A final URL that 404s gets the ad disapproved for "Destination not
   *     working", usually within hours and with no warning.
   *   - A final URL redirecting off-domain is a policy violation outright.
   *   - Even a same-domain redirect adds a hop the crawler follows before it
   *     scores landing page experience, for no benefit.
   *
   * So the default posture is: name the page with the old slug. Do not rename
   * and redirect.
   *
   * The authoritative URL list is the Google Ads account, not the old site — a
   * final URL can be referenced by an ad without being linked anywhere
   * crawlable. Export final URLs at keyword, ad and sitelink level, then:
   *   npm run check:urls -- --file ads-final-urls.txt
   *
   * preserve  slugs that must exist unchanged because ads point at them.
   *           Verified to exist on every build.
   * redirects ONLY for legacy URLs no ad depends on — old organic pages, a
   *           Google Business Profile link, printed material. Emitted as 301
   *           into the root vercel.json. check:urls treats a redirect as a
   *           failure unless you pass --allow-redirects.
   *
   * Empty here: this site was a new build, not a migration. */
  migration: {
    preserve: [],
    redirects: [
      // { from: '/old-organic-page', to: '/windshield-replacement' },
    ]
  },

  /* Cities named in LocalBusiness.areaServed */
  areaServed: [
    'Anaheim','Santa Ana','Irvine','Huntington Beach','Costa Mesa','Fullerton',
    'Long Beach','Torrance','Pasadena','Glendale','Santa Monica','Downey',
    'Orange County','Los Angeles County'
  ],

  /* Header nav — the highest-intent services plus both county hubs.
   * The footer carries the complete link set, so nothing is orphaned. */
  nav: [
    'windshield-replacement',
    'windshield-repair',
    'adas-calibration',
    'mobile-auto-glass',
    'auto-glass-repair-orange-county',
    'auto-glass-repair-los-angeles-county'
  ],

  /* ===================================================================== */
  home: {
    navLabel: 'Home',
    shortLabel: 'Home',
    title: 'Mobile Auto Glass — Orange County & LA County | Speedy',
    desc: 'Mobile windshield replacement, chip repair and ADAS recalibration across Orange County and LA County. We come to you at no extra charge and bill your carrier direct.',
    eyebrow: 'Orange County &amp; LA County · Mobile service',
    h1: 'Mobile windshield replacement across Orange County &amp; LA County',
    sub: '<p>Cracked windshield? We come to you at no extra charge<span class="sub-more"> — your driveway, your office lot, your job site — fit the glass, recalibrate the camera behind it, and bill your insurance direct</span>.</p>',
    svcValue: 'windshield-replacement',
    body: `
<h2>A mobile glass shop, not a shop you drive to</h2>
<p>Speedy Windshield Repair has been replacing and repairing auto glass in Southern California since 2018. We're now taking work across Orange County and Los Angeles County — and in these two counties we operate purely mobile. There is no waiting room, no shuttle, and no morning lost to dropping your car off. You tell us where the vehicle is parked and we bring the glass, the urethane and the calibration equipment to it.</p>
<p>That matters more than it sounds. A cracked windshield is a structural part of your vehicle — it's bonded in, it supports the roof in a rollover, and on most cars built in the last decade it holds the camera that aims lane-keeping and automatic emergency braking. Driving across the county on a spreading crack to reach a shop is the exact thing you should not be doing.</p>

<h2>What we handle</h2>
<ul>
  <li><strong>Windshield replacement</strong> — including acoustic, heated, heads-up-display and camera-equipped glass</li>
  <li><strong>Chip and crack repair</strong> — resin injection, usually around half an hour</li>
  <li><strong>ADAS camera recalibration</strong> — static, dynamic, or both, on the same visit as the glass</li>
  <li><strong>Back glass and rear windows</strong> — including defroster grids and embedded antennas</li>
  <li><strong>Door, side and quarter glass</strong> — the usual after a break-in, with the glass vacuumed out of the door cavity and seats</li>
</ul>

<div class="callout">
  <h3>The honest version of the insurance question</h3>
  <p>California has no law making windshields free. Some drivers here do pay nothing, but that's because they bought a full-glass endorsement — not because of a statute, whatever you may have read in an ad. What is broadly true is that comprehensive coverage pays for glass minus your deductible, and that <strong>most carriers waive the deductible on chip repair</strong> because repairing is far cheaper for them than replacing. We check your actual policy before we dispatch anyone, and no claim gets filed until you tell us to.</p>
</div>

<h2>Why drivers pick us over the national chains</h2>
<p>The chains are competent and they're everywhere. What they're not is flexible. We're small enough that the person who quotes you is connected to the person who shows up, we'll tell you when a repair will do instead of upselling you a replacement, and we do the ADAS recalibration ourselves rather than booking you a second appointment somewhere else a week later.</p>
<p>We also won't quote you a number and then change it in your driveway. If your vehicle needs a specific piece of glass — and camera-equipped, acoustic and HUD windshields all cost genuinely different amounts — we'd rather find that out from your VIN up front than surprise you later.</p>
`,
    faq: [
      { q: 'Do you actually come to me, or is there a shop I need to visit?',
        a: '<p>In Orange County and Los Angeles County we are mobile only — there is no shop for you to drive to. We come to your home, your workplace, or wherever the vehicle is parked, and mobile service is included rather than being an add-on fee. Our registered place of business is in San Diego, which is why you will see a San Diego address in our footer.</p>' },
      { q: 'Will filing a glass claim raise my premium?',
        a: '<p>Comprehensive glass claims are generally treated differently from at-fault accident claims, but how your specific carrier treats them is between you and your carrier, and we are not going to promise you otherwise. What we will do is check what your policy actually covers and what your deductible actually is before anything is filed, so you can make that call with real numbers in front of you.</p>' },
      { q: 'Can you repair my chip or does it need a whole new windshield?',
        a: '<p>Rough rule: a chip smaller than a quarter, or a crack shorter than a dollar bill, that is not directly in the driver\'s line of sight and not running to the edge of the glass, is usually repairable. Damage at the edge tends to keep spreading because that is where the stress is, and anything in the driver\'s primary sightline can leave optical distortion even after a good repair. Send us a photo and we will tell you honestly which one you are looking at.</p>' },
      { q: 'How soon can it be safely driven after a replacement?',
        a: '<p>That is set by the urethane adhesive manufacturer\'s safe drive-away time, not by us, and it varies with the specific adhesive, the temperature and the humidity on the day. We will tell you the real figure for your job before we start. We will not quote you a flat number in an advert, because anyone who does is either guessing or ignoring the adhesive spec.</p>' },
      { q: 'Which insurers do you bill directly?',
        a: '<p>We bill GEICO, State Farm, USAA, AAA, Farmers and Progressive directly, among others — you generally will not need to pay us and claim it back. We are not affiliated with, endorsed by or sponsored by any insurance company; we list these names only to tell you whose paperwork we handle.</p>' }
    ]
  },

  /* ================================ SERVICES ================================ */
  services: [
    {
      slug: 'windshield-replacement',
      navLabel: 'Windshields',
      shortLabel: 'Windshield replacement',
      title: 'Mobile Windshield Replacement | Orange County & LA | Speedy',
      desc: 'Mobile windshield replacement across Orange County and LA County. Camera recalibration on the same visit, direct insurance billing, workmanship warranty.',
      eyebrow: 'Windshield replacement',
      h1: 'Mobile windshield replacement in Orange County &amp; LA County',
      sub: '<p>Crack gone too far to repair? We bring the right glass to wherever your car is parked, bond it to the adhesive maker\'s specification, and recalibrate the camera behind it before we leave.</p>',
      svcValue: 'windshield-replacement',
      body: `
<h2>When a windshield has to be replaced rather than repaired</h2>
<p>A crack that has run past about the length of a dollar bill, damage sitting right at the edge of the glass, anything directly in the driver's primary line of sight, or a chip that has already been repaired once and started moving again — those are replacement territory. Edge damage in particular keeps travelling, because the perimeter of a windshield is where the structural stress concentrates.</p>
<p>If you are not sure which side of that line you are on, send us a photo before you book anything. We would rather do a thirty-minute repair than sell you glass you did not need.</p>

<h2>The glass has to match your specific vehicle</h2>
<p>"A windshield" is not one part. On a modern car it may be acoustic laminated, heated, tinted at the top band, shaped for a heads-up display, and carry a bracket for a forward-facing camera, a rain sensor, and a humidity sensor. Fitting the wrong variant produces a windshield that technically fills the hole and then rattles, whistles, fogs, or leaves your driver-assist features unable to calibrate.</p>
<p>This is why we ask for your VIN. It resolves the exact glass your car left the factory with, which means the quote you get is the price you pay rather than a figure that changes when the technician arrives and looks at the bracket.</p>

<h2>What actually happens on the visit</h2>
<ul>
  <li>We protect the paint, dash and cowl, then cut out the old glass and remove the trim and any sensors</li>
  <li>The pinchweld is cleaned back and primed — this is the step that decides whether the bond holds, and it is the step most often rushed</li>
  <li>Fresh urethane is laid to spec and the new glass is set</li>
  <li>Sensors, trim and mouldings go back on</li>
  <li>If your vehicle has a camera behind the glass, we recalibrate it and hand you the scan report</li>
  <li>We tell you the safe drive-away time for the adhesive we used, on the day, in the conditions</li>
</ul>

<div class="callout">
  <h3>Do not skip the recalibration</h3>
  <p>If there is a camera behind your windshield, moving the glass moves the camera. Even a small angular error changes where the car thinks the road is — which is a problem when that camera is what triggers automatic emergency braking. Some shops will replace the glass and send you elsewhere for calibration, or quietly skip it. We do it on the same visit and give you the before-and-after scan report so you can see it was actually done.</p>
</div>

<h2>Insurance, plainly</h2>
<p>If you carry comprehensive coverage it generally pays for glass minus your deductible, and we bill your carrier directly so you are not chasing a reimbursement. We verify your coverage and your deductible before dispatching anyone, and nothing is filed until you agree. If you are paying out of pocket, say so and we will quote you a cash number for the exact glass your vehicle takes.</p>
`,
      faq: [
        { q: 'How long does a windshield replacement take?',
          a: '<p>The fitting itself is usually somewhere around an hour to ninety minutes for most vehicles. If your car needs a camera recalibration afterwards, allow additional time for that on the same visit. The longer part is often the adhesive cure — see the safe drive-away question below.</p>' },
        { q: 'Can you do it in my apartment or office car park?',
          a: '<p>Usually yes, and this is most of what we do. We need reasonable access around the vehicle and somewhere it can sit undisturbed while the urethane sets. Some subterranean garages prohibit vehicle work in the building rules, and heavy rain is a genuine problem for a bond that needs a clean dry surface. Tell us where the car will be and we will tell you honestly whether it will work or whether we should find a nearby surface lot.</p>' },
        { q: 'Is OEM glass better than aftermarket?',
          a: '<p>OEM glass comes from the vehicle manufacturer\'s supplier with their branding. Quality aftermarket glass is made to the same safety standards and is what most insurers will authorise. Where it genuinely matters is on vehicles with cameras, heads-up displays or complex acoustic layers, where fit tolerances and optical clarity affect calibration and how the glass reads to your eye. We will tell you which is sensible for your specific car and what your policy will and will not cover.</p>' },
        { q: 'What is the safe drive-away time?',
          a: '<p>It is the minimum time the urethane needs before the bond can hold the glass in a crash, and it is specified by the adhesive manufacturer, not by the shop. It varies with the product, the temperature and the humidity, so we give you the real figure for your job rather than a number from an advert. Please do not take the car until we have told you it is safe.</p>' },
        { q: 'Do you warranty the work?',
          a: '<p>Yes. For as long as you own the vehicle we warrant our workmanship — leaks, wind noise, and moulding or trim failures caused by our installation. It does not cover fresh impact damage, cracks spreading from damage that predates our work, or defects in the glass itself, which carry the manufacturer\'s warranty.</p>' }
      ]
    },

    {
      slug: 'windshield-repair',
      navLabel: 'Chip repair',
      shortLabel: 'Chip & crack repair',
      title: 'Windshield Repair — Chips & Cracks | Orange County & LA | Speedy',
      desc: 'Mobile windshield chip and crack repair across Orange County and LA County. Usually about 30 minutes, and most carriers waive the deductible on repair.',
      eyebrow: 'Chip &amp; crack repair',
      h1: 'Windshield repair for chips and cracks — we come to you',
      sub: '<p>Caught the rock chip early? A resin repair takes about half an hour, keeps your original factory glass in the car, and most carriers waive the deductible on repair because it costs them far less than a replacement.</p>',
      svcValue: 'chip-crack-repair',
      body: `
<h2>Can yours be repaired? Here is the actual test</h2>
<p>Most people searching for "windshield repair" genuinely do not know whether they need a repair or a replacement, and plenty of shops are happy to leave that ambiguity in place. So here is the honest rule of thumb, and you can apply it in your own driveway right now:</p>
<ul>
  <li><strong>Smaller than a quarter?</strong> A bullseye or star chip that size is usually a straightforward repair.</li>
  <li><strong>Crack shorter than a dollar bill?</strong> Often repairable, depending on where it sits.</li>
  <li><strong>Not in the driver's primary line of sight?</strong> Repairs leave a small amount of visual distortion. Directly in your eyeline, that distortion is itself a problem, so replacement is often the better answer even when a repair is technically possible.</li>
  <li><strong>Not touching the edge of the glass?</strong> Edge damage sits where the structural stress is highest and tends to keep spreading. It generally means replacement.</li>
  <li><strong>Only one or two spots?</strong> A windscreen peppered with a dozen chips is a replacement, not a morning of individual repairs.</li>
</ul>
<p>If your damage fails that test, you want <a href="/SPEEDY/windshield-replacement">windshield replacement</a> instead — and we would rather tell you that up front than take a repair booking we know will not hold.</p>

<h2>Why fixing it this week actually matters</h2>
<p>A chip is a stress concentration in a sheet of laminated glass that flexes every time you go over a driveway lip or slam a door. Southern California adds two specific accelerators: the temperature swing between a car sitting in full sun and the cold blast when you turn the air conditioning on, and the freeway expansion joints that put a small shock through the body at speed. A chip that was a dot in April becomes a twelve-inch crack across your sightline in July, and at that point the repairable window has closed and you are buying glass.</p>

<div class="callout">
  <h3>The deductible point, stated accurately</h3>
  <p>Most carriers waive the deductible on a chip <em>repair</em>, because paying for a half-hour resin injection is dramatically cheaper for them than paying for a new windshield plus a camera recalibration. That is the insurer's own commercial decision, not a discount from us — we cannot and do not offer to offset anybody's deductible. We will confirm how your specific policy treats repair before we dispatch, and it usually takes about five minutes on the phone.</p>
</div>

<h2>What the repair involves</h2>
<p>We clean the damage out, draw the air from the break under vacuum, inject a clear resin under pressure so it fills the fracture right into the legs of the star, cure it with ultraviolet light, then scrape and polish the surface flush. Done properly, it restores most of the structural integrity of the laminate and stops the crack travelling. It will not vanish completely — expect a faint mark where the impact point was. Any shop promising an invisible repair is overselling it.</p>
`,
      faq: [
        { q: 'Will the chip disappear completely?',
          a: '<p>No, and be suspicious of anyone who says it will. A good repair fills the fracture, stops it spreading and restores clarity to the point where you stop noticing it in normal driving, but a faint mark usually remains at the original impact point. The purpose is structural and preventative, not cosmetic perfection.</p>' },
        { q: 'How long does a chip repair take?',
          a: '<p>Around thirty minutes for a single chip, and you can drive immediately afterwards — there is no adhesive curing involved as there is with a replacement. It is genuinely something we can do in your office car park during a lunch break.</p>' },
        { q: 'What if the repair does not hold?',
          a: '<p>Occasionally a repair fails or the crack starts moving again, usually because the damage was more extensive under the surface than it appeared. If that happens we will tell you what we can credit toward the replacement you now need. Ask us to confirm the specifics before you book so there are no surprises.</p>' },
        { q: 'Is a DIY chip repair kit worth trying first?',
          a: '<p>Honestly, rarely. The kits cannot pull a proper vacuum, so they tend to trap air in the fracture, and once resin has been cured badly into a break a professional repair becomes much harder or impossible. If you were going to have it repaired anyway, a failed kit attempt can be the thing that turns a repairable chip into a replacement.</p>' }
      ]
    },

    {
      slug: 'adas-calibration',
      navLabel: 'ADAS',
      shortLabel: 'ADAS calibration',
      title: 'ADAS Calibration After Windshield Replacement | OC & LA | Speedy',
      desc: 'Mobile ADAS camera recalibration across Orange County and LA County, done on the same visit as your glass, with a pre- and post-scan report.',
      eyebrow: 'ADAS calibration',
      h1: 'ADAS calibration after windshield replacement',
      sub: '<p>The camera that aims your lane-keeping and automatic braking is mounted to the windshield. Move the glass and you move the camera — so it has to be recalibrated. We do it on the same visit and give you the scan report.</p>',
      svcValue: 'adas-calibration',
      body: `
<h2>No, you are not being upsold</h2>
<p>If a shop just told you your new windshield needs a calibration and your instinct was that you are being worked, that is a reasonable instinct and the answer is still that the calibration is real. Here is why, without the jargon.</p>
<p>On most vehicles built in roughly the last decade, a forward-facing camera sits in a bracket bonded to the inside of the windshield, usually behind the mirror. That camera is what the car uses to see lane markings, the vehicle in front, and pedestrians. Lane-keeping assist, adaptive cruise control, forward-collision warning and automatic emergency braking all read from it.</p>
<p>The camera's aim is calibrated to the exact position it was mounted in. Replace the windshield and the bracket is now sitting in a very slightly different place — a fraction of a degree is enough. A fraction of a degree at the camera becomes feet of error a hundred yards down the road. The car does not know it is wrong. It will confidently steer to a lane edge that is not where it thinks, or brake late, or brake at nothing.</p>

<h2>Static, dynamic, or both</h2>
<p><strong>Static calibration</strong> is done stationary, with a printed target board set at a manufacturer-specified distance, height and angle in front of the vehicle, on level ground. <strong>Dynamic calibration</strong> is done by driving the vehicle at a specified speed on well-marked road while the system relearns. Which one your vehicle needs is decided by the manufacturer, not by preference — some require static, some dynamic, and a good number require static followed by dynamic.</p>

<div class="callout">
  <h3>The scan report is the thing to ask for</h3>
  <p>A calibration you cannot see the evidence of is a calibration you should not pay for. We run a pre-scan before the work and a post-scan afterwards, and we hand you both. That documents which systems reported faults, that the calibration completed, and that no codes were left stored. If anybody replaces your glass and cannot produce that, ask them why.</p>
</div>

<h2>What we need to do it properly</h2>
<p>Static calibration has real physical requirements — level ground, enough clear space in front of the vehicle for the target at the specified distance, and controlled lighting without strong glare or deep shadow across the target. A sloped street or a cramped tandem parking space will not produce a valid calibration, and we would rather move to a suitable nearby surface lot than complete a procedure we know is compromised. Tell us where the vehicle will be and we will tell you whether it will work.</p>

<h2>Body shops, dealers and used-car lots</h2>
<p>We also take calibration work as a subcontractor. If you are a collision shop, a dealer, or a reconditioning operation that needs mobile calibration on your own site rather than sending vehicles out, call us and ask for trade work — it is a different conversation from a retail booking, and we are set up for volume.</p>
`,
      faq: [
        { q: 'Does every windshield replacement need a calibration?',
          a: '<p>No — only vehicles with a camera or sensor mounted to the windshield, which in practice means most cars from roughly the mid-2010s onward but not all of them. If your vehicle has lane-keeping assist, adaptive cruise or automatic emergency braking, assume it does. We identify it from your VIN before the appointment so nobody is guessing.</p>' },
        { q: 'What happens if I skip it?',
          a: '<p>Sometimes the car throws a dashboard warning and disables the features, which is annoying but at least honest. The worse outcome is that the systems stay active and are quietly miscalibrated — steering assist that tracks slightly off, or automatic braking that reads distances wrong. You would be relying on a safety system that is aiming at the wrong place.</p>' },
        { q: 'Can calibration be done at my home or office?',
          a: '<p>Often, yes, provided there is level ground and enough clear space in front of the vehicle for the target board at the manufacturer\'s specified distance, without harsh glare. Where that is not available we will suggest a nearby surface lot rather than complete a procedure that would not be valid.</p>' },
        { q: 'Will my insurance cover the calibration?',
          a: '<p>Where the calibration is required as part of a covered glass replacement, carriers commonly cover it, since it is a necessary part of putting the vehicle back to the condition it was in. We confirm it with your carrier as part of the same claim rather than leaving you to find out afterwards.</p>' }
      ]
    },

    {
      slug: 'mobile-auto-glass',
      navLabel: 'Mobile service',
      shortLabel: 'Mobile auto glass',
      title: 'Mobile Auto Glass Service | Orange County & LA County | Speedy',
      desc: 'Mobile auto glass across Orange County and LA County at no extra charge. We work at your home, office or job site — there is no shop to drive to.',
      eyebrow: 'Mobile service',
      h1: 'Mobile auto glass — we come to you across OC &amp; LA',
      sub: '<p>There is no shop for you to drive to in Orange County or Los Angeles County. We are a mobile operation, mobile service is included rather than surcharged, and we will tell you straight whether we can work where your car is parked.</p>',
      svcValue: 'windshield-replacement',
      body: `
<h2>The practical questions nobody answers on their website</h2>
<p>If you have already decided you do not want to spend a morning in a waiting room, you do not need convincing that mobile service is good. You need to know whether it will actually work where your car is. So:</p>

<h3>Where we can work</h3>
<ul>
  <li><strong>Residential driveways</strong> — the easiest case, and most of what we do</li>
  <li><strong>Office and business car parks</strong> — very common; we work while you work</li>
  <li><strong>Apartment and condo surface lots</strong> — generally fine in a standard bay</li>
  <li><strong>Job sites</strong> — yes, provided the vehicle can sit still for the cure</li>
  <li><strong>Street parking</strong> — often workable, but time-limited zones and street-sweeping days are the constraint, so tell us the block</li>
</ul>

<h3>Where it gets difficult, and we would rather say so</h3>
<ul>
  <li><strong>Subterranean and tandem garages</strong> — many buildings prohibit vehicle work in their rules, and tight bays do not leave the access a windshield needs. Static ADAS calibration also needs clear space in front of the car.</li>
  <li><strong>Steep driveways and sloped streets</strong> — a problem for calibration specifically, which needs level ground to be valid.</li>
  <li><strong>Heavy rain</strong> — a urethane bond needs a clean dry surface. We would rather move your appointment than fit glass we do not trust.</li>
</ul>
<p>None of these are usually dealbreakers. Most of the time the answer is a nearby surface lot, or your office rather than your building.</p>

<h2>What we need from you</h2>
<p>Keys, access to the vehicle, and for it to stay put through the adhesive cure. That is genuinely it — we bring our own power, water and equipment. You do not need to be standing there for the whole appointment, though we do need to reach you at the end to walk you through the safe drive-away time.</p>

<div class="callout">
  <h3>Mobile is not a surcharge here</h3>
  <p>A lot of shops advertise mobile service and then attach a trip fee, so people reasonably assume everyone does. We do not — the mobile visit is how we work, not an upgrade. It is also worth saying that not driving on a spreading crack is the safer choice regardless of convenience.</p>
</div>

<h2>Which jobs we do mobile</h2>
<p>All of them: <a href="/SPEEDY/windshield-replacement">windshield replacement</a>, <a href="/SPEEDY/windshield-repair">chip and crack repair</a>, <a href="/SPEEDY/back-glass-replacement">back glass</a>, <a href="/SPEEDY/car-window-replacement">door and side windows</a>, and <a href="/SPEEDY/adas-calibration">ADAS recalibration</a>. The only genuine constraints are the physical ones above, plus rare vehicles needing a specialist part we have to order in first.</p>
`,
      faq: [
        { q: 'Does mobile service cost more?',
          a: '<p>No. Mobile is how we operate in Orange County and LA County rather than an optional extra, and there is no trip charge. If anyone has quoted you a mobile surcharge, that is a different business model, not an industry standard.</p>' },
        { q: 'Do I have to be there the whole time?',
          a: '<p>No. Plenty of customers hand over keys at the office and get on with their day. We do need to speak to you before we leave, because you need to know the safe drive-away time for the adhesive we used before you move the car.</p>' },
        { q: 'What happens if it rains on my appointment?',
          a: '<p>For a replacement, we will usually move it. A urethane bond needs a clean dry surface and we are not going to compromise a structural bond to keep a slot. Chip repairs are often still fine under cover. We will call you rather than turning up and improvising.</p>' },
        { q: 'How far do you travel?',
          a: '<p>We cover Orange County and the parts of Los Angeles County we can reach and service properly — broadly the South Bay, the Westside, Long Beach and the Gateway cities, the San Gabriel Valley, and the Glendale–Burbank corridor. We do not currently serve the Antelope Valley. Send us your ZIP and you will get a straight yes or no rather than a maybe.</p>' }
      ]
    },

    {
      slug: 'back-glass-replacement',
      navLabel: 'Back glass',
      shortLabel: 'Back glass replacement',
      title: 'Back Glass Replacement — Rear Windows | OC & LA | Speedy',
      desc: 'Mobile back glass and rear window replacement across Orange County and LA County, including defroster grids and embedded antennas. Glass cleaned out of the cabin.',
      eyebrow: 'Back glass &amp; rear windows',
      h1: 'Back glass replacement across Orange County &amp; LA County',
      sub: '<p>Rear glass does not crack — it goes all at once, into thousands of pebbles across your back seat. We replace it, match the defroster grid and antenna, and vacuum the glass out of the cabin and the trunk seams.</p>',
      svcValue: 'back-glass',
      body: `
<h2>If your back window just went, read this first</h2>
<p>Most people arriving here are standing next to a car with no rear window, glass across the parcel shelf and back seats, and a vehicle that is now open to the weather and to anyone walking past. Two immediate things:</p>
<ul>
  <li><strong>Do not brush it out with your hands.</strong> Tempered glass breaks into small cubes with genuinely sharp corners, and they get into seat seams, seatbelt reels and the trunk channel where you will find them for months.</li>
  <li><strong>Get it covered if the car has to sit.</strong> If we cannot reach you until tomorrow, tape plastic sheeting over the opening — it will not stop a determined thief but it keeps the weather out and makes the car a less obvious target.</li>
</ul>
<p>Then call us. Back glass is one of the jobs where speed genuinely matters, because an open car overnight in most of LA and OC is an invitation.</p>

<h2>Why rear glass behaves so differently from a windshield</h2>
<p>Your windshield is laminated — two layers of glass bonded to a plastic interlayer, which is why it cracks and holds together rather than falling out. Back glass is almost always tempered, which is engineered to shatter into small blunt-ish cubes rather than dagger shards. That is much safer in a collision, and it is why there is no such thing as repairing a chip in your rear window. Once it goes, it is all gone.</p>

<h2>The two things that make back glass a specialist job</h2>
<p><strong>The defroster grid.</strong> Those fine horizontal lines are a heating element printed onto the glass, wired to tabs at the edges. The replacement has to have the correct grid for your vehicle and the tabs have to be reconnected properly, or you have a rear window that never clears.</p>
<p><strong>The embedded antenna.</strong> On a lot of vehicles the radio — sometimes also the keyless entry — runs through an antenna printed into the rear glass. Fit a piece of glass without it, or leave the connection off, and the owner discovers weeks later that their radio has been poor since the glass was done and nobody mentioned why.</p>
<p>We check both against your VIN before ordering, and we test them before we leave.</p>

<div class="callout">
  <h3>Cleanup is part of the job, not a favour</h3>
  <p>We vacuum the cabin, the seat seams, the parcel shelf and the trunk channel. Tempered glass migrates, and finding cubes in your kid's car seat a fortnight later is exactly the kind of thing that makes people never call a shop again.</p>
</div>

<h2>Insurance or cash</h2>
<p>Back glass is usually a comprehensive claim, and we bill carriers directly. If it was a break-in you may also be weighing whether to claim at all — worth checking your deductible against the cash price first, and we will give you both numbers so you can decide. Vandalism and theft claims are handled differently by different carriers, so we confirm your specific coverage before filing anything.</p>
`,
      faq: [
        { q: 'Can a back window be repaired instead of replaced?',
          a: '<p>No. Tempered glass shatters completely by design rather than cracking, so there is nothing left to repair. If your rear glass is damaged but somehow still in one piece, it is on borrowed time and should be replaced before it lets go on the freeway.</p>' },
        { q: 'Will my rear defroster still work afterwards?',
          a: '<p>Yes, provided the correct glass is fitted and the tabs are reconnected properly. We match the defroster grid to your specific vehicle from the VIN and test it before we leave. The same applies to any antenna printed into the glass.</p>' },
        { q: 'How fast can you get to me?',
          a: '<p>We treat an open vehicle as urgent and will get to you as soon as we have the right glass in hand. The variable is the part, not our schedule — common vehicles are usually quick, while less common models or rear glass with unusual heating or antenna configurations can take longer to source. We will give you a real timeframe on the call rather than a hopeful one.</p>' },
        { q: 'Do you clean up all the broken glass?',
          a: '<p>Yes, that is included. We vacuum the seats and their seams, the parcel shelf, the trunk channel and the door cavities where the cubes collect. We would rather spend the extra ten minutes than have you finding glass for the next month.</p>' }
      ]
    },

    {
      slug: 'car-window-replacement',
      navLabel: 'Side windows',
      shortLabel: 'Car window replacement',
      title: 'Car Window Replacement — Door & Side Glass | OC & LA | Speedy',
      desc: 'Mobile car window replacement across Orange County and LA County. Door, side and quarter glass, vacuumed out of the door cavity. Often cheaper than your deductible.',
      eyebrow: 'Door &amp; side glass',
      h1: 'Car window replacement for door and side glass',
      sub: '<p>Broken into overnight? Door glass is usually cheaper than a comprehensive deductible, which is why most people simply pay cash and never involve their insurer at all. We come to you, fit the glass, and vacuum out the door.</p>',
      svcValue: 'door-side-glass',
      body: `
<h2>The thing most shops will not tell you</h2>
<p>If someone put your side window through last night, you are probably assuming this is an insurance claim. For a single door glass, it very often should not be. A comprehensive deductible is commonly several hundred dollars, and a single side window frequently costs less than that — which means filing a claim would have you paying the whole thing anyway, plus having a claim on your record for no benefit.</p>
<p>So ask us for the cash price first. If it comes in under your deductible, pay it, keep it off your policy entirely, and be done. If the damage is worse than one window — several windows, or glass plus interior or bodywork damage — then a claim starts making sense and we will bill your carrier directly.</p>

<h2>What we replace</h2>
<ul>
  <li><strong>Front door glass</strong>, driver or passenger — the most common break-in target</li>
  <li><strong>Rear door glass</strong></li>
  <li><strong>Quarter and vent glass</strong> — the small fixed panes, often what gets popped on older vehicles</li>
  <li><strong>Fixed rear side glass</strong> on SUVs and wagons</li>
</ul>

<h2>What we do not do — worth being clear</h2>
<p>A lot of people searching for "car window repair" have a window that will not go up or down. That is almost always mechanical rather than glass — a failed regulator, a dead window motor, a cable off its track, or a bad switch. The glass itself is fine. We are a glass shop, so that is not our work, and we would rather say so now than send a technician out to tell you in person. If your glass is intact and the window just will not move, you want a general mechanic or an auto electrician.</p>

<div class="callout">
  <h3>The door cavity is where the glass hides</h3>
  <p>When a side window breaks, most of it falls down inside the door, on top of the regulator mechanism and the drain holes. If it is not cleared out you get rattles, a window that grinds, and blocked drains that let water sit in the bottom of the door. We pull the door card and vacuum the cavity properly. It is the difference between a repair that is finished and one that comes back.</p>
</div>

<h2>Getting the car secure today</h2>
<p>An open window makes the car a target for a second attempt, and thieves do come back to the same street. We prioritise these jobs for that reason. If we genuinely cannot reach you until the following day, we would rather tell you to tape sheeting over the opening and move the car somewhere lit and visible than pretend we can be there in an hour.</p>
`,
      faq: [
        { q: 'Should I file an insurance claim for one broken window?',
          a: '<p>Usually not. A single door glass often costs less than a typical comprehensive deductible, so a claim means you pay the full amount regardless and carry a claim for nothing. Ask us for the cash price and compare it to your deductible before deciding. If several windows went, or there is interior or body damage too, a claim is more likely to make sense.</p>' },
        { q: 'My window will not roll up but the glass is fine. Can you help?',
          a: '<p>That is a mechanical fault rather than a glass one — usually the regulator, the motor, a cable, or the switch. We are a glass shop, so it is not work we take, and we would rather tell you now than charge you for a call-out to say the same thing. A general mechanic or auto electrician is who you want.</p>' },
        { q: 'How long does a door glass take?',
          a: '<p>Typically under an hour for most vehicles, including pulling the door card and vacuuming the cavity. There is no adhesive cure on a door glass the way there is on a windshield, so you can normally drive straight away.</p>' },
        { q: 'Can you get to me today?',
          a: '<p>We push to, because an open car is a security problem and not just an inconvenience. It depends on whether we have your specific glass to hand — common vehicles usually yes. You will get a straight answer on the call.</p>' }
      ]
    },

    {
      slug: 'auto-glass-replacement',
      navLabel: 'Auto glass',
      shortLabel: 'Auto glass replacement',
      title: 'Auto Glass Replacement & Repair | Orange County & LA | Speedy',
      desc: 'Mobile auto glass replacement and repair across Orange County and LA County. Windshields, back glass, side windows and ADAS recalibration from one team.',
      eyebrow: 'Auto glass',
      h1: 'Auto glass replacement across Orange County &amp; LA County',
      sub: '<p>Not sure which piece of glass you need or what it is called? Start here — pick what broke and we will take you to the right page, or just call and describe it to us.</p>',
      svcValue: 'not-sure',
      body: `
<h2>Which glass are we talking about?</h2>
<p>People describe auto glass in all sorts of ways, and the trade names do not help. Here is the plain-English version so you can get to the right place:</p>
<ul>
  <li><strong>The big one at the front, cracked or chipped.</strong> If the damage is small and fresh, see <a href="/SPEEDY/windshield-repair">chip and crack repair</a>. If it is long, at the edge, or in your eyeline, see <a href="/SPEEDY/windshield-replacement">windshield replacement</a>.</li>
  <li><strong>The rear window, now in pieces.</strong> That is <a href="/SPEEDY/back-glass-replacement">back glass replacement</a> — also called the back windshield or rear window.</li>
  <li><strong>A side window, usually after a break-in.</strong> That is <a href="/SPEEDY/car-window-replacement">car window replacement</a> — door glass, side glass or quarter glass.</li>
  <li><strong>Your car's driver-assist warning lights came on after glass work.</strong> That is <a href="/SPEEDY/adas-calibration">ADAS calibration</a>.</li>
  <li><strong>You would rather we came to you.</strong> We always do — see <a href="/SPEEDY/mobile-auto-glass">mobile service</a>.</li>
</ul>

<h2>Who we are, since you are probably comparing shops</h2>
<p>Speedy Windshield Repair has been doing auto glass in Southern California since 2018, out of a registered shop in San Diego. In Orange County and Los Angeles County we operate mobile only — every job happens where your vehicle is, and mobile service is included rather than surcharged.</p>
<p>What that means practically: one team handles the glass and the camera recalibration, so you are not booked into a second appointment somewhere else to finish the job. We quote from your VIN so the price does not change when we arrive. And we will tell you when a repair will do instead of selling you a replacement, which is the single easiest way for a glass shop to make more money from you than it should.</p>

<div class="callout">
  <h3>Two things worth knowing before you choose any shop</h3>
  <p><strong>Ask whether they do the ADAS calibration themselves.</strong> If your car has a camera behind the windshield and the shop subcontracts calibration out, your one-visit job becomes two appointments, and the handoff is where calibrations get skipped.</p>
  <p><strong>Ask what the warranty actually covers.</strong> "Lifetime warranty" means nothing until somebody writes down which failures are included. Ours covers our workmanship — leaks, wind noise and moulding failures from our install — for as long as you own the vehicle, and we say plainly that it does not cover fresh impact damage or defects in the glass itself.</p>
</div>

<h2>Insurance and payment</h2>
<p>We bill GEICO, State Farm, USAA, AAA, Farmers and Progressive directly, among others, so you generally do not pay us and claim it back. We verify what your policy covers and what your deductible is before dispatching anyone, and nothing is filed until you say so. Paying out of pocket is completely normal here too, particularly on door glass — just tell us and we will quote a cash number.</p>
<p>We are not affiliated with, endorsed by or sponsored by any insurance company. Those names appear only to tell you whose paperwork we handle.</p>
`,
      faq: [
        { q: 'What is the difference between auto glass repair and replacement?',
          a: '<p>Repair injects resin into a small chip or short crack in your existing windshield and keeps the original factory glass in the car. Replacement removes the glass and bonds in a new piece. Repair is faster, cheaper and usually deductible-free; it only works while the damage is still small, not at the edge, and not in the driver\'s line of sight.</p>' },
        { q: 'Do you work on all makes and models?',
          a: '<p'+'>Effectively yes — domestic, European and Asian, cars, SUVs and light trucks, including vehicles with acoustic, heated, heads-up-display and camera-equipped glass. Rare or older models sometimes need glass ordered in, which we will tell you about up front rather than on the day.</p>' },
        { q: 'Can you tell me a price over the phone?',
          a: '<p>For most vehicles, yes, once we know which glass and which variant your car takes — that is why we ask for the VIN. Camera-equipped, acoustic and heads-up-display windshields genuinely cost different amounts, so a number given without knowing which you have is a guess that changes later. We would rather spend two minutes on the VIN and give you a figure that holds.</p>' },
        { q: 'Is there a shop I can come to in Orange County or LA?',
          a: '<p>No — in these two counties we are mobile only, by design. Our registered place of business is in San Diego, which is the address you will see in our footer and in our BAR registration. Everything in OC and LA happens at your home, office or job site.</p>' }
      ]
    },

    {
      slug: 'insurance-claims',
      navLabel: 'Insurance',
      shortLabel: 'Insurance claims',
      title: 'Auto Glass Insurance Claim Help | Orange County & LA | Speedy',
      desc: 'We verify your glass coverage and deductible before dispatch and bill your carrier directly. Straight answers on what California drivers actually pay.',
      eyebrow: 'Insurance claims',
      h1: 'Auto glass insurance claim, handled for you',
      sub: '<p>Give us your carrier and your vehicle and we will check what your policy covers and what your deductible actually is — before anyone is dispatched, and before any claim is filed.</p>',
      svcValue: 'windshield-replacement',
      body: `
<h2>We check the coverage first, not after</h2>
<p>The usual sequence at a glass shop is that you book, the technician arrives, and only then does anyone work out what your insurer will pay. We do it the other way round. Tell us your carrier, your policy number and your vehicle, and we will confirm what is covered and what your deductible is before we send anyone. Nothing is filed until you tell us to go ahead — so if the numbers do not work for you, you have lost nothing but a phone call.</p>

<h2>Your insurer cannot choose your shop</h2>
<p>This is worth knowing before you ring your carrier, because a lot of drivers are steered without realising it. Under <strong>California Insurance Code § 758.5</strong>:</p>
<ul>
  <li>Your insurer <strong>cannot require</strong> you to have the vehicle repaired at a specific shop.</li>
  <li>It <strong>cannot suggest or recommend</strong> a specific shop unless you asked for a referral, or you were told in writing that you have the right to choose your own.</li>
  <li>Once you have chosen a shop, it <strong>cannot try to steer you</strong> to a different one.</li>
  <li>If you choose your own shop, it <strong>cannot reduce</strong> your reasonable repair cost to whatever its own shop would have charged.</li>
</ul>
<p>That statute regulates insurers, not repair shops. It does not mean your carrier can never mention a shop — it means the circumstances in which it may are limited, and that the choice is legally yours. If you would like us to do the work, you are allowed to say so.</p>

<div class="callout">
  <h3>What California law does <em>not</em> do</h3>
  <p>It does not make your windshield free. You may have seen advertising implying otherwise. Florida, Kentucky and South Carolina require insurers to cover glass with no deductible; <strong>California has no equivalent law.</strong> If your glass is fully covered in California, it is because your policy includes a full-glass endorsement you bought — not because of a statute. We would rather tell you that plainly than let you find out when the bill arrives.</p>
</div>

<h2>What is usually true about glass coverage</h2>
<ul>
  <li><strong>Comprehensive coverage</strong> is the part of your policy that pays for glass. Liability-only policies do not cover your own glass at all.</li>
  <li><strong>Your deductible applies</strong> to a replacement unless you carry a full-glass endorsement.</li>
  <li><strong>Most carriers waive the deductible on chip repair</strong>, because a resin repair costs them far less than a new windshield plus a camera recalibration. That is the insurer's commercial decision — we cannot offer to cover anybody's deductible ourselves.</li>
  <li><strong>Calibration is usually covered</strong> where it is required as part of a covered replacement, since the vehicle is not back to its prior condition without it.</li>
</ul>

<h2>Which carriers we bill directly</h2>
<p>GEICO, State Farm, USAA, AAA, Farmers and Progressive, among others. Direct billing means we invoice them and you pay only your deductible, if you have one — no paying up front and chasing a reimbursement.</p>
<p><em>Speedy Windshield Repair is not affiliated with, endorsed by or sponsored by any insurance company. Carrier names appear here only to indicate that we bill those insurers directly.</em></p>

<h2>No insurance, or not worth claiming?</h2>
<p>Both are common and neither is a problem. Plenty of our work is cash-pay — especially <a href="/SPEEDY/car-window-replacement">door glass</a>, which frequently costs less than a comprehensive deductible, making a claim pointless. Tell us the vehicle and we will quote you a real cash number with mobile service included.</p>
`,
      faq: [
        { q: 'Will a glass claim increase my premium?',
          a: '<p>Comprehensive glass claims are generally treated differently from at-fault accident claims, but how your particular carrier and policy handle it is between you and them, and we are not going to make you a promise on someone else\'s behalf. What we can do is establish exactly what is covered and what you would pay before anything is filed, so you can make the decision with real figures.</p>' },
        { q: 'Can my insurer make me use their preferred shop?',
          a: '<p>No. Under California Insurance Code § 758.5 an insurer cannot require you to use a specific shop, cannot recommend one unless you asked for a referral or were notified in writing of your right to choose, cannot steer you away once you have chosen, and cannot cut your reasonable repair cost down to what its own shop would have charged. The choice is yours to make.</p>' },
        { q: 'Do I pay you or does my insurance?',
          a: '<p>For the carriers we bill directly, we invoice them and you pay only your deductible if your policy has one. You should not need to pay the full amount and claim it back.</p>' },
        { q: 'What if my deductible is more than the repair costs?',
          a: '<p>Then filing a claim makes no sense and we will tell you so. This comes up constantly on single door windows. Ask us for the cash price, compare it to your deductible, and if cash is cheaper, pay cash and keep the claim off your record.</p>' },
        { q: 'What do you need from me to check my coverage?',
          a: '<p>Your carrier, your policy number, and the vehicle — the VIN is ideal because it also tells us the exact glass and whether there is a camera to recalibrate. It usually takes a few minutes, and we make no claim until you have seen the numbers and agreed.</p>' }
      ]
    }
  ],

  /* ================================== HUBS ================================== */
  hubs: [
    {
      slug: 'auto-glass-repair-orange-county',
      county: 'OC',
      navLabel: 'Orange County',
      shortLabel: 'All of Orange County',
      title: 'Auto Glass Repair Orange County | Mobile Service | Speedy',
      desc: 'Mobile auto glass repair across Orange County — Anaheim to San Clemente. Windshields, chip repair, back and side glass, ADAS recalibration. We come to you.',
      eyebrow: 'Orange County',
      h1: 'Auto glass repair in Orange County — mobile, county-wide',
      sub: '<p>From Fullerton down to San Clemente, we cover Orange County end to end. There is no shop to drive to: tell us where the vehicle is parked and we bring the glass and the calibration gear to it.</p>',
      svcValue: 'windshield-replacement',
      body: `
<h2>Where we go in Orange County</h2>
<p>Orange County is about 948 square miles and, unlike LA County, it is coherent to serve end to end — no mountain passes, no hour-long dispatch into a high desert. We take work across the whole county.</p>
<p>We have dedicated pages for the cities we get asked about most: <a href="/SPEEDY/auto-glass-repair-anaheim">Anaheim</a>, <a href="/SPEEDY/auto-glass-repair-santa-ana">Santa Ana</a>, <a href="/SPEEDY/auto-glass-repair-irvine">Irvine</a>, <a href="/SPEEDY/auto-glass-repair-huntington-beach">Huntington Beach</a>, <a href="/SPEEDY/auto-glass-repair-costa-mesa">Costa Mesa</a> and <a href="/SPEEDY/auto-glass-repair-fullerton">Fullerton</a>. We also regularly work in Newport Beach, Orange, Garden Grove, Tustin, Brea, Placentia, La Habra, Yorba Linda, Westminster, Fountain Valley, Mission Viejo, Lake Forest, Laguna Niguel, San Juan Capistrano, Dana Point and San Clemente.</p>
<p>If your city is not on that list, it does not mean no. Send us your ZIP and you will get a straight answer.</p>

<div class="callout">
  <h3>South Orange County is closer to us than you would think</h3>
  <p>We dispatch out of San Diego, which means San Clemente, Dana Point and San Juan Capistrano are among our <em>nearest</em> Orange County territory rather than our furthest. South county customers often assume a San Diego shop is a stretch — for us it is the short run up the 5.</p>
</div>

<h2>What Orange County drivers actually call us about</h2>
<p>Two patterns dominate. The first is freeway chip damage — the 5, the 405, the 55, the 91 and the 57 all carry heavy truck traffic, and sitting behind a gravel or construction load at 65mph is how most windshields in this county get hit. Those chips are cheap and quick to fix in the first week and expensive to ignore for a month.</p>
<p>The second is camera recalibration, because Orange County has one of the newer vehicle fleets in Southern California. A large share of the windshields we replace here have a forward-facing camera bonded behind them, which means the job is not finished when the glass goes in. We do the <a href="/SPEEDY/adas-calibration">recalibration</a> on the same visit rather than sending you elsewhere.</p>

<h2>Mobile, at your home or your office</h2>
<p>A great deal of our Orange County work happens in business parks during the workday — Irvine especially, but also the Anaheim resort corridor, South Coast Metro and the Santa Ana civic and industrial areas. Leave the car in your employer's lot, hand us the keys, and it is done by the time you finish. There is no charge for coming to you.</p>
`,
      faq: [
        { q: 'Do you cover all of Orange County?',
          a: '<p>Yes, from the north county cities down through the coast and south county. Orange County is compact enough to dispatch across properly, which is not something we can honestly say about every part of LA County. Send your ZIP if you want it confirmed for your address.</p>' },
        { q: 'Is there an Orange County shop I can visit?',
          a: '<p>No. We are mobile only in Orange County — every job happens where your vehicle is. Our registered place of business is in San Diego, which is the address in our footer and on our BAR registration.</p>' },
        { q: 'Can you come to my office in an Irvine or Anaheim business park?',
          a: '<p>Yes, and that is a large part of what we do here. A standard surface bay is all we need. If your building is a subterranean garage, tell us — many prohibit vehicle work in their rules, and static camera calibration needs level ground and clear space in front of the car, so we may suggest a nearby surface lot instead.</p>' },
        { q: 'How quickly can you get to Orange County?',
          a: '<p>It depends more on sourcing your specific glass than on the drive. Common vehicles are usually quick; unusual variants, or windshields with particular camera, acoustic or heads-up-display configurations, can take longer to get hold of. You will get a real timeframe on the call.</p>' }
      ]
    },

    {
      slug: 'auto-glass-repair-los-angeles-county',
      county: 'LA',
      navLabel: 'LA County',
      shortLabel: 'All of LA County',
      title: 'Auto Glass Repair Los Angeles County | Mobile | Speedy',
      desc: 'Mobile auto glass repair across Los Angeles County — South Bay, Westside, Long Beach, Gateway Cities, San Gabriel Valley and the Glendale–Burbank corridor.',
      eyebrow: 'Los Angeles County',
      h1: 'Auto glass repair in Los Angeles County — mobile service',
      sub: '<p>We cover the parts of LA County we can genuinely reach and service well: the South Bay, the Westside, Long Beach and the Gateway Cities, the San Gabriel Valley, and the Glendale–Burbank corridor.</p>',
      svcValue: 'windshield-replacement',
      body: `
<h2>Being straight about our LA County coverage</h2>
<p>Los Angeles County is around 4,000 square miles, and any mobile glass company claiming to cover all of it equally is either exaggerating or about to cancel on somebody. So here is our actual envelope:</p>
<ul>
  <li><strong>South Bay</strong> — <a href="/SPEEDY/auto-glass-repair-torrance">Torrance</a>, Redondo Beach, Hermosa Beach, Manhattan Beach, Gardena, Carson, El Segundo</li>
  <li><strong>Westside</strong> — <a href="/SPEEDY/auto-glass-repair-santa-monica">Santa Monica</a>, Venice, Culver City, West LA, Mar Vista</li>
  <li><strong>Long Beach &amp; the Gateway Cities</strong> — <a href="/SPEEDY/auto-glass-repair-long-beach">Long Beach</a>, <a href="/SPEEDY/auto-glass-repair-downey">Downey</a>, Norwalk, Bellflower, Lakewood, Whittier, Pico Rivera, Signal Hill</li>
  <li><strong>San Gabriel Valley</strong> — <a href="/SPEEDY/auto-glass-repair-pasadena">Pasadena</a>, South Pasadena, Alhambra, Arcadia, Monrovia, Sierra Madre</li>
  <li><strong>Glendale–Burbank corridor</strong> — <a href="/SPEEDY/auto-glass-repair-glendale">Glendale</a>, Burbank, Eagle Rock</li>
</ul>
<p><strong>We do not currently serve the Antelope Valley</strong> — Lancaster, Palmdale and the high desert. That is a ninety-minute-plus run each way from anywhere we stage, and we would rather tell you no now than take your booking and disappoint you. Catalina Island is likewise out.</p>
<p>Not sure which side of the line you are on? Send your ZIP and we will tell you plainly.</p>

<div class="callout">
  <h3>Why we would rather under-promise</h3>
  <p>Cancelling on somebody with a broken window is worse than never taking the job. LA County is big enough that honest coverage limits are a feature, not a weakness — it is the reason we can commit to the areas we do list.</p>
</div>

<h2>What breaks glass in LA County</h2>
<p>The mix here is different from Orange County. Street parking and break-ins drive a great deal of <a href="/SPEEDY/car-window-replacement">door glass</a> and <a href="/SPEEDY/back-glass-replacement">back glass</a> work — considerably more than windshields in some neighbourhoods. The 710 corridor and the port approaches generate genuine rock-chip volume from heavy truck traffic, and the freeway construction that is permanently underway somewhere in this county does the rest.</p>
<p>Then there is the commute itself. LA drivers spend more time in traffic than almost anyone in the country, which means more hours sitting directly behind other people's tyres. A chip you pick up on the 405 in the morning has all day in the sun and then a cold blast of air conditioning to help it spread.</p>

<h2>Where we can actually work, in an LA context</h2>
<p>This is the practical problem that matters here more than anywhere else. Residential driveways and office surface lots are straightforward. Street parking is usually workable but we need to know the block, because time-limited zones and street-sweeping days decide the appointment. Subterranean and tandem garages are the difficulty — many buildings ban vehicle work outright in their rules, and static camera calibration needs level ground and clear space in front of the vehicle that a tight garage bay will not give.</p>
<p>None of that is usually a dealbreaker. Most often the answer is your office instead of your building, or a nearby surface lot. Tell us the situation and we will solve it on the phone rather than in your driveway.</p>
`,
      faq: [
        { q: 'Do you cover the whole of LA County?',
          a: '<p>No, and we would rather say so. We cover the South Bay, the Westside, Long Beach and the Gateway Cities, the San Gabriel Valley, and the Glendale–Burbank corridor. We do not serve the Antelope Valley — Lancaster, Palmdale and the high desert — or Catalina. Send your ZIP for a straight answer on your address.</p>' },
        { q: 'Can you work on a street-parked car in LA?',
          a: '<p>Usually, but we need to know the block. Time-limited parking and street-sweeping days set the appointment window, and for a windshield the car needs to sit still while the adhesive cures. If your street will not work, an office lot or a nearby surface lot normally will.</p>' },
        { q: 'My building has a subterranean garage. Is that a problem?',
          a: '<p>Sometimes. Many buildings prohibit vehicle work in their rules, low ceilings and tight bays restrict access, and static camera calibration needs level ground with clear space in front of the car. Tell us the building and we will work out whether we can do it there or should meet you at a surface lot nearby.</p>' },
        { q: 'Is there an LA County shop I can drive to?',
          a: '<p>No — in LA County we are mobile only. Our registered place of business is in San Diego, which is the address shown in our footer and on our BAR registration. Everything here happens where your vehicle is.</p>' }
      ]
    }
  ],

  /* ================================= CITIES =================================
   * Populated from verified local research — see cities.config.cjs.
   * Kept in a separate file purely because twelve city pages of genuinely
   * distinct local copy is a lot of text to keep in one module. */
  cities: require('./cities.config.cjs')
};
