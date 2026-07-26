# Google Ads — single-campaign launch plan

Speedy Windshield Repair, Orange County + LA County. One campaign, 10 ad groups,
expand at day 30.

---

## The campaign

**`SRCH | OC+LAC | Core Glass`** — Search only.

| Setting | Value | Why |
|---|---|---|
| Networks | Search only. **Search Partners OFF, Display expansion OFF** | Partners and Display spend into junk on a new account with no conversion history |
| Locations | **Curated municipality list** (below), not the county geo-targets | "Los Angeles County" buys ~4,000 sq mi including the Antelope Valley — a 90-minute one-way dispatch that is margin-negative before the tech arrives |
| Location option | **"Presence: People in or regularly in your targeted locations"** | Google defaults to *presence or interest*, which must be changed manually. Fulfilment needs a van physically at the vehicle; someone in Phoenix researching "windshield replacement Anaheim" is not a lead |
| Location assets | **Suppressed** | The only registered address is San Diego. Showing a Pacific Beach address to a Torrance searcher kills CTR and undercuts the page |
| Bidding | **Maximize Clicks with a CPC ceiling (~$12)** for weeks 1–3, then Maximize Conversions, then tCPA from ~week 9 | An untrained tCPA on a zero-history account throttles you to no impressions |
| Ad rotation | Optimize | — |
| Budget | See below | — |
| Ad schedule | All hours initially, with bid adjustments after 2 weeks of hour-of-day data | Glass is urgent; do not guess when |

### Locations to target
**Orange County:** the county geo-target is fine — ~948 sq mi and dispatch-coherent
end to end. Note south OC (San Clemente, Dana Point, San Juan Capistrano) is your
*closest* OC territory from a San Diego dispatch, not your furthest.

**LA County:** target these municipalities only — Long Beach, Torrance, Redondo Beach,
Hermosa Beach, Manhattan Beach, El Segundo, Gardena, Carson, Santa Monica, Culver City,
Venice/West LA, Pasadena, South Pasadena, Altadena, Arcadia, Monrovia, Glendale,
Burbank, Downey, Norwalk, Bellflower, Lakewood, Whittier, Pico Rivera, Santa Fe Springs.

**Excluded locations (add explicitly):** Lancaster, Palmdale, Santa Clarita, Antelope
Valley, Avalon / Catalina Island, Angeles National Forest.

### Budget
Start **$150/day**. Third-party benchmarks put auto glass around $6.90 CPC and $36 CPL
nationally; my estimate for a new advertiser with no local Business Profile competing
against Safelite in these metros is **$8–14 CPC and $60–110 CPL for the first 60 days**.
Treat those as planning ranges, not forecasts — I have not pulled Keyword Planner for
these geos. $150/day gets you to roughly 30 conversions in 30 days, which is what Smart
Bidding needs to exit learning.

### The trade-off you are accepting
One campaign means **one budget across both counties**, so you cannot hold OC at a set
spend while LA proves out. LA has more query volume and higher CPCs, so it will
naturally absorb the larger share. That is fine for a launch — you are buying learning,
not optimising allocation. Watch the geographic report weekly; the moment OC and LA
show materially different CPLs, split into two campaigns. That is the day-30 decision.

---

---

## REVISION — prioritising windshield replacement, insurance and ADAS

Client steer: *the target is windshield replacements; better still is a replacement
where the customer is using insurance; best of all is one that also needs ADAS
calibration.* That is a value ranking, not a volume ranking, and it changes the ad
group set below. Read this section first — where it conflicts with the original ten,
this wins.

### The thing to understand before spending on it

**Two of those three cannot be targeted the same way.**

| Priority | Searchable? | How you actually get it |
|---|---|---|
| Windshield replacement | **Yes** — big, obvious head terms | Keywords |
| …using insurance | **Yes** — people search this explicitly | Keywords |
| …that also needs ADAS calibration | **No** | Bidding + geo + qualification |

The third one is the trap. **A driver whose car needs camera recalibration does not
know that.** They do not search "windshield replacement with ADAS calibration" — they
search "windshield replacement near me" exactly like everyone else, and they find out
about the camera when you tell them. Consumer awareness of ADAS is documented as low.
Standalone calibration search volume is thin and comes mostly from people already told
they need it, plus body shops looking to subcontract.

So you cannot buy ADAS jobs with keywords. You get them four other ways:

1. **Value-based bidding via offline conversion import — this is the real answer.**
   Push booked-job revenue back to Google from GHL against the stored `gclid`. Once
   Google can see that some clicks turn into $1,200 camera-equipped replacements and
   others into $150 chip repairs, Smart Bidding will find the expensive ones by itself
   — using signals you cannot see or target manually. The site already captures and
   stores `gclid`, `gbraid` and `wbraid`, so this is GHL configuration, not development.
   **Do this by day 30. It matters more than any keyword decision in this document.**
2. **Weight geography toward the newest vehicle fleets.** ADAS attach rate tracks
   vehicle age, which tracks income. Irvine (median household income ~$129k), Newport
   Beach, Santa Monica, Torrance (~$116k) and Pasadena run far newer fleets than
   Santa Ana, Anaheim, Fullerton or Downey. Same query, very different job value.
   Bid up the former, bid down the latter.
3. **Vehicle-brand and OEM-glass keywords as a proxy.** Someone searching "OEM
   windshield replacement" or "Tesla windshield replacement" is self-selecting into a
   newer, camera-equipped, less price-sensitive vehicle.
4. **Qualify on the form, not in the ad.** The quote form already asks for the VIN,
   which resolves the exact glass and whether there is a camera behind it. That is how
   you know what the job is worth before dispatching — and it is what feeds step 1.

### Revised ad groups

Three windshield-replacement ad groups instead of one, so you can bid the
high-value intent separately from the generic head term.

| # | Ad group | Page | Budget share |
|---|---|---|---|
| 1 | `SVC \| WS Replacement — Core` | `/windshield-replacement` | ~25% |
| 2 | `SVC \| WS Replacement — Insurance` | `/insurance-claims` | ~15% |
| 3 | `SVC \| WS Replacement — OEM & Vehicle` | `/windshield-replacement` | ~10% |
| 4 | `SVC \| ADAS Calibration` | `/adas-calibration` | ~5% |
| 5 | `SVC \| Chip & Crack Repair` | `/windshield-repair` | ~10% |
| 6 | `SVC \| Auto Glass (Category)` | `/auto-glass-replacement` | ~10% |
| 7 | `SVC \| Mobile Auto Glass` | `/mobile-auto-glass` | ~5% |
| 8 | `GEO \| Irvine` | `/auto-glass-repair-irvine` | ~7% |
| 9 | `GEO \| Orange County` | `/auto-glass-repair-orange-county` | ~7% |
| 10 | `GEO \| Los Angeles` | `/auto-glass-repair-los-angeles-county` | ~6% |

**Ad group 2 — WS Replacement, insurance intent** → `/insurance-claims`
`[windshield replacement insurance]` · `[does insurance cover windshield replacement]` ·
`"windshield replacement with insurance"` · `"is windshield replacement covered by insurance"` ·
`"insurance approved auto glass shop"` · `"auto glass insurance claim"` ·
`"file windshield insurance claim"` · `"comprehensive deductible windshield"` ·
`"geico windshield replacement"` · `"state farm windshield replacement"` ·
`"usaa windshield replacement"` · `"aaa windshield replacement"`
> Carrier names are fine as **keywords**. They are a trademark and affiliation problem
> in **ad copy** — see §5.4. And read the § 551(b) constraints before writing a single
> line for this ad group; it is the most legally sensitive in the account.
> **Do not bid `"windshield replacement no deductible"`** until counsel has cleared the
> programme — that query invites exactly the claim you cannot make.

**Ad group 3 — WS Replacement, OEM & vehicle intent** → `/windshield-replacement`
`"oem windshield replacement"` · `"oem glass windshield"` · `"tesla windshield replacement"` ·
`"bmw windshield replacement"` · `"mercedes windshield replacement"` ·
`"lexus windshield replacement"` · `"audi windshield replacement"` ·
`"honda windshield replacement"` · `"acura windshield replacement"` ·
`"windshield replacement with camera"` · `"windshield replacement lane assist"` ·
`"heads up display windshield replacement"` · `"acoustic windshield replacement"`
> This is your ADAS proxy. Honda and Acura are in there deliberately because Torrance is
> American Honda's US headquarters city with an unusual per-capita concentration of
> those vehicles. Bid these up — they are the closest thing to a keyword that means
> "expensive job".

**Ad group 4 — ADAS Calibration** → `/adas-calibration`
Small budget, and **do not judge it on lead count.** Its value is (a) the handful of
high-ticket consumer jobs, and (b) body shops and used-car reconditioning operations
looking for a mobile calibration subcontractor, which is a B2B revenue line worth more
than the retail clicks.
`[adas calibration]` · `[adas calibration near me]` · `[windshield camera calibration]` ·
`"adas calibration after windshield replacement"` · `"windshield calibration cost"` ·
`"adas recalibration"` · `"forward collision camera recalibration"` ·
`"mobile adas calibration for shops"` · `"adas calibration subcontractor"` ·
`"adas calibration service for body shops"`

### Bid adjustments to set on day one

Location bid adjustments inside the single campaign, reflecting fleet age rather than
population:

| Bid up | Bid down |
|---|---|
| Irvine, Newport Beach **+20%** | Santa Ana **−15%** |
| Santa Monica, Manhattan/Hermosa Beach **+20%** | Downey, Norwalk, Bellflower **−15%** |
| Torrance, Redondo Beach **+15%** | Fullerton, Anaheim (flatland) **−10%** |
| Pasadena, San Marino, Arcadia **+15%** | — |

Revisit after 60 days against booked-job value, not CPL. These are informed starting
positions, not measurements.

### What this defers, and what it costs

Moving to three windshield ad groups pushes four things to day 30:

- **`Car Window / Door Glass`** — deliberately dropped from launch. It is the *lowest*
  value work on the site: mostly cash-pay because a single door glass usually costs
  less than a comprehensive deductible, no camera, no insurance billing. It converts
  well and it is urgent, so it will be worth adding — just not while budget is meant to
  be finding replacement jobs.
- **`Back Glass / Rear Window`** — same logic, plus genuinely low volume.
- **`GEO | Anaheim`** and **`GEO | Long Beach`** — the two highest-*volume* cities, but
  both run older fleets than Irvine. Volume is not what you asked for.

Be clear-eyed that this is a trade: you will get **fewer total leads** than the original
ten would have produced, at a **higher average job value**. If the phone goes quiet in
week two, the fastest fix is re-adding car window and back glass, not raising bids.

---

## The original 10 ad groups (superseded by the revision above — kept for the keyword lists)

Match types are **phrase and exact only for the first 60 days.** No broad — "windshield
wiper replacement" is the single highest-volume waste term in this vertical and a
near-perfect broad-match trap for "windshield replacement".

Volume labels are qualitative estimates from vertical experience, not measured data.

### 1. `SVC | Windshield Replacement` → `/windshield-replacement`
Highest-volume head term in the account.
`[windshield replacement]` · `[windshield replacement near me]` · `[new windshield]` ·
`[auto windshield replacement]` · `"replace windshield"` · `"windshield replacement quote"` ·
`"front windshield replacement"` · `"windshield replacement same day"` ·
`"windshield replacement with insurance"` · `"windshield replacement cost"` *(bid −30%, price shopper)* ·
`"windshield replacement open now"` *(low volume, highest intent)*

### 2. `SVC | Chip & Crack Repair` → `/windshield-repair`
Cheapest conversion in the account and the deductible-waiver angle is genuinely true.
`[windshield repair]` · `[windshield chip repair]` · `[windshield crack repair]` ·
`[windshield chip repair near me]` · `"rock chip repair"` · `"windshield repair near me"` ·
`"fix windshield chip"` · `"chip in windshield repair"` · `"small crack in windshield fix"` ·
`"windshield crack repair cost"`
**Ad group negatives:** `"kit"`, `"diy"`, `"resin"`, `"toothpaste"`, `"nail polish"`, `"super glue"`
> A large share of people searching "windshield repair" actually need a replacement. The
> page handles that with an explicit size test and a branch to the replacement page.

### 3. `SVC | Auto Glass (Category)` → `/auto-glass-replacement`
High volume, broad intent — this is the shop-comparison searcher.
`[auto glass repair]` · `[auto glass near me]` · `[auto glass replacement]` ·
`"auto glass shop near me"` · `"car glass replacement"` · `"auto glass replacement cost"` ·
`"auto glass company near me"` · `"automotive glass replacement"` · `"best auto glass shop"`
**Ad group negatives (essential, or this eats the account):** `"windshield"`, `"back glass"`,
`"rear window"`, `"side window"`, `"door glass"`, `"calibration"`, `"adas"`, `"mobile"`, `"tint"`

### 4. `SVC | Mobile Auto Glass` → `/mobile-auto-glass`
Not one service among many — it is the entire fulfilment model and your only structural
advantage over a shop with a storefront.
`[mobile auto glass]` · `[mobile windshield replacement]` · `[mobile windshield repair]` ·
`"mobile auto glass near me"` · `"mobile auto glass service"` ·
`"windshield replacement that comes to you"` · `"at home windshield replacement"` ·
`"onsite windshield replacement"` · `"come to you auto glass"`
> Put the mobile angle in the RSA headline rotation of **every** ad group, not just this one.

### 5. `SVC | Car Window / Door Glass` → `/car-window-replacement`
Break-in driven, extremely urgent, and mostly **cash-pay** — a single door glass usually
costs less than a comprehensive deductible, so do not lead these ads with insurance.
`[car window replacement]` · `[side window replacement]` · `[door glass replacement]` ·
`"car window replacement near me"` · `"broken car window replacement"` ·
`"broken car window near me"` · `"smashed car window repair"` ·
`"driver side window replacement"` · `"car window glass replacement"`
**Ad group negatives (critical):** `"regulator"`, `"window motor"`, `"won't roll up"`,
`"wont go up"`, `"off track"`, `"switch"` — those are mechanical faults, not glass, and
they are a large slice of "car window repair" queries

### 6. `SVC | Back Glass / Rear Window` → `/back-glass-replacement`
Lower volume, but the highest urgency on the site — the vehicle is open to weather and theft.
`[back glass replacement]` · `[rear windshield replacement]` · `[back windshield replacement]` ·
`"rear window replacement car"` · `"rear windshield replacement near me"` ·
`"shattered rear windshield"` · `"broken back windshield"` · `"back glass repair"` ·
`"truck back glass replacement"`
> "Back glass" is trade jargon. Keep it in the H1 for the exact match, but the ads should
> say **"back windshield"** and **"rear window"**, which is what people actually type.

### 7. `GEO | Orange County` → `/auto-glass-repair-orange-county`
`[auto glass repair orange county]` · `[windshield replacement orange county]` ·
`"auto glass orange county"` · `"mobile auto glass orange county"` ·
`"windshield repair orange county"` · `"orange county auto glass shop"` ·
`"windshield replacement oc"` · `"auto glass repair oc"`
**Mandatory negatives:** `"florida"`, `"fl"`, `"orlando"`, `"ny"`, `"new york"`, `"nc"`, `"tx"`, `"va"`
> Orange County, FL is the Orlando metro and it is large. This is a real budget leak.

### 8. `GEO | Los Angeles` → `/auto-glass-repair-los-angeles-county`
Keep exact-heavy and cap at roughly 15% of campaign spend. These are the most expensive
terms in the account and they pull the whole county, including the areas you geo-blocked.
`[auto glass repair los angeles]` · `[windshield replacement los angeles]` ·
`[auto glass repair los angeles county]` · `"auto glass los angeles"` ·
`"mobile auto glass los angeles"` · `"windshield repair los angeles"` ·
`"windshield replacement la county"` · `"los angeles auto glass shop"`

### 9. `GEO | Anaheim` → `/auto-glass-repair-anaheim`
Largest city in Orange County — the highest-volume geo ad group you have.
`[auto glass repair anaheim]` · `[windshield replacement anaheim]` ·
`"windshield repair anaheim"` · `"auto glass anaheim ca"` ·
`"mobile windshield replacement anaheim"` · `"car window replacement anaheim"` ·
`"auto glass shop anaheim"` · `"anaheim hills windshield replacement"`

### 10. `GEO | Long Beach` → `/auto-glass-repair-long-beach`
Largest of your LA-county targets, and the 710 corridor makes it genuinely chip-heavy.
`[auto glass repair long beach]` · `[windshield replacement long beach]` ·
`"windshield repair long beach"` · `"auto glass long beach ca"` ·
`"mobile windshield replacement long beach"` · `"car window replacement long beach"` ·
`"broken car window long beach"` · `"back glass replacement long beach"`
**Mandatory negatives:** `"ny"`, `"new york"`, `"island"`, `"washington"`, `"mississippi"`, `"aquarium"`

---

## Routing discipline (do not skip this)

Service and geo ad groups live in the same campaign, so they will fight over
geo-modified queries. **Add every targeted city and county name as a phrase negative in
all six service ad groups.** That forces "windshield replacement anaheim" into the
Anaheim ad group and onto the Anaheim page, which is what earns the ad-relevance and
landing-page-experience components of Quality Score.

Likewise add `anaheim` and `long beach` as phrase negatives in the two hub ad groups.

---

## Account-level shared negative lists

**`NEG — Global Waste`**
`"windshield wiper"` · `"wiper blade"` · `"wiper blades"` · `"washer fluid"` ·
`"windshield washer"` · `"rain sensor"` · `"windshield sticker"` · `"registration sticker"` ·
`"windshield decal"` · `"windshield banner"` · `"sun shade"` · `"windshield cover"` ·
`"repair kit"` · `"diy"` · `"resin"` · `"how to"` · `"do it yourself"` · `"jobs"` ·
`"hiring"` · `"salary"` · `"training"` · `"course"` · `"school"` · `"apprentice"` ·
`"wholesale"` · `"supplier"` · `"distributor"` · `"junkyard"` · `"salvage"` ·
`"used windshield"` · `"car insurance quote"` · `"auto insurance"` · `"home window"` ·
`"house window"` · `"shower door"` · `"storefront glass"` · `"plexiglass"` · `"sunroof"` ·
`"side mirror"` · `"mirror glass"` · `"headlight"` · `"rv"` · `"motorhome"` · `"boat"` ·
`"forklift"` · `"tractor"` · `"motorcycle"` · `"semi truck"`

**`NEG — Geo Confusion`**
`"glendale az"` · `"glendale arizona"` · `"glendale heights"` · `"orange county florida"` ·
`"orange county fl"` · `"orlando"` · `"orange county ny"` · `"long beach ny"` ·
`"long beach island"` · `"pasadena tx"` · `"pasadena texas"` · `"santa ana winds"` ·
`"santa ana zoo"` · `"santa monica pier"` · `"robert downey"` · `"downey jr"` · `"downy"` ·
`"fabric softener"` · `"cal state fullerton"` · `"irvine spectrum"`

**`NEG — Tint (no page yet)`**
`"tint"` · `"tinting"` · `"window film"` · `"ceramic tint"` · `"limo tint"`
> The business does window tint but there is no tint page, so those clicks would land on
> a mismatched page. Add a tint page later, then remove this list.

---

## Ad copy rules

Reflecting the compliance findings in the repo README — these are not stylistic.

**Never write, in any headline, description or asset:**
- "We cover your deductible" / "deductible assistance" / "$300 toward your deductible"
- "We'll waive your deductible"
- "$0 out of pocket" or "free windshield" as an unqualified claim
- Anything implying California law makes glass free — **it does not**
- "GEICO-approved", "USAA preferred provider", "State Farm authorized" — carrier names
  are fine as *keywords*, but in ad copy they are a trademark and affiliation problem
- A specific drive-away time in minutes — that is set by the adhesive spec
- "#1", "best in Orange County", "lowest price guaranteed"

**Safe and strong, because each is verifiable:**
- "We come to you — mobile service at no extra charge"
- "Camera recalibration on the same visit"
- "We bill your carrier direct"
- "Most carriers waive the deductible on chip repair" *(the insurer's decision, not a discount from you)*
- "We check your coverage before we dispatch"
- "Workmanship warranted for as long as you own the vehicle"
- "Your insurer can't require you to use its shop (Ins. Code § 758.5)"

**RSA structure per ad group:** 12–15 headlines, 4 descriptions, pin nothing except one
headline containing the ad group's head keyword in position 1. Add sitelinks to
`/mobile-auto-glass`, `/insurance-claims`, `/adas-calibration` and the relevant county
hub; callouts for "Mobile at no extra charge", "Lifetime workmanship warranty",
"We bill your carrier direct"; and a structured snippet for Services.

---

## Conversion setup

| Action | Source | Category | Count | Primary? |
|---|---|---|---|---|
| Form — Quote Request | **the page**, via gtag | Submit lead form | One | Primary |
| Call — GHL pool (60s+) | GHL Number Pool Calling | Phone call leads | One | Primary |
| Click-to-Call tap | gtag `tel:` click | Phone call leads | One | **Secondary only** |
| Job Booked | GHL → offline import via GCLID | Qualified lead | One | Primary (phase 2) |

Three things that will otherwise bite you:

1. **Set the form conversion action to "page load", not "click".** The page fires it
   explicitly via `gtag`, only after the GHL webhook confirms the lead landed.
2. **Turn off any "Add to Google Ads" action inside GHL's form workflow.** The page owns
   form conversions; GHL owns calls. If both report, every lead counts twice. This is
   the first thing a future contractor will re-break.
3. **Keep `Click-to-Call Tap` as Secondary.** A tap is not a call — mis-taps and
   no-answers all fire it, and counting it as Primary corrupts Smart Bidding.

Gate the GHL call conversion at **60 seconds**. Auto glass gets heavy sub-30-second
volume: wrong numbers, price-only hangups, out-of-area callers.

**Weekly reconciliation:** compare Ads reported conversions against GHL new
opportunities. Google should run 5–15% higher (multi-touch, cross-device). **If Google
is near 2× GHL, you have a duplicate** — start with items 1–3 above.

---

## Day 30: what to add

In rough priority order.

1. **Split into two campaigns**, OC and LAC, if their CPLs have diverged. This is the
   main reason to revisit.
2. **The 10 remaining city ad groups** — Santa Ana, Irvine, Huntington Beach, Costa Mesa,
   Fullerton, Torrance, Pasadena, Glendale, Santa Monica, Downey. The pages are already
   built and linked.
3. **`SVC | ADAS Calibration`** at $10–15/day, isolated. Consumer volume is genuinely
   thin — most calibrations are triggered by a replacement rather than searched for —
   so inside the main campaign it would be starved and look like a failure. Worth
   running separately for the high-ticket jobs *and* for body shops and dealers
   searching for a mobile calibration subcontractor, which is a B2B revenue line.
4. **`SVC | Insurance & Coverage`** — deliberately held back at launch. It is the
   riskiest messaging on the site (§ 551(b), Google misrepresentation), and isolating it
   later means you can pause the whole insurance angle in one click without touching
   revenue-producing ad groups.
5. **Offline conversion import** — upload Job Booked and Job Completed with revenue back
   to Ads from GHL via the stored GCLID. This is the highest-leverage change available,
   because raw lead CPL is a poor objective here: price shoppers, out-of-area callers
   and mechanical-window enquiries all register as leads and never book. The site
   already captures and stores `gclid`, `gbraid` and `wbraid`, so this is a GHL
   configuration job, not a development one.
6. **A Spanish path.** Santa Ana and Downey are majority-Hispanic markets with real
   Spanish query volume ("parabrisas", "cambio de parabrisas"). Sending those searchers
   to an English page is a landing-page-experience hit, so the keywords are held back
   until `/es` pages exist. Bilingual phone answering is worth more than the keywords in
   month one — a lot of Spanish-preferring searchers search in English and call in Spanish.
7. **Local Services Ads** — auto glass is generally eligible under automotive services
   and LSA CPL is reported well below Search. Worth checking eligibility in parallel.
8. **Brand defence** at $5/day once you have any brand volume at all.

**Do not launch Performance Max** in the first 90 days. With no conversion history, no
Business Profile in either county and a legally sensitive offer, it will spend into
brand and junk queries and give you no query-level control at exactly the moment you
need it.

---

## Blocking items before spend

From the README, repeated because they gate the account rather than the site:

1. **California counsel on the deductible-assistance programme** (Penal Code § 551(b)).
   Blocks all insurance messaging, including on the existing San Diego page.
2. **BAR ARD number and exact registered firm name.** Currently the footer publicly
   reads `ARD-VERIFY-BEFORE-LAUNCH`.
3. **BAR ruling on the static-registered-number-plus-DNI configuration** (16 CCR
   § 3371.2). Blocks the call-tracking design.
4. **Verified cash price floors**, if any ad is going to say "from $X". The ad and the
   page must show the same figure.
5. **What the technicians actually hold** — AGSC / AGRSS is the auto glass standard;
   ASE is primarily mechanical and collision.
