# HighLevel field mapping

Every key the quote form POSTs to the inbound webhook, and what to do with it in the
Speedy subaccount.

**Webhook:** `https://services.leadconnectorhq.com/hooks/bEPjxnxSU2AfYQ1PIhK1/webhook-trigger/D6EuRh5CTS1KweBrURkM`
**Location ID:** `bEPjxnxSU2AfYQ1PIhK1`

A sample request with all 31 keys populated has already been sent, so the schema is
captured and every field will appear in the mapping dropdown.

---

## 1. Standard fields — map these, do NOT create custom fields

These already exist on a GHL contact.

| JSON key | Map to standard field |
|---|---|
| `first_name` | First Name |
| `last_name` | Last Name |
| `full_name` | Name *(optional — GHL builds this from first + last anyway)* |
| `email` | Email |
| `phone` | Phone — **already E.164** (`+15555550142`), which is what GHL matches on |
| `postal_code` | Postal Code |
| `source` | Source — arrives as `landing:speedy-oc-la` |

---

## 2. Custom fields to create

All **Text (single line)** unless noted. Naming the field key to match the JSON key
keeps the mapping obvious a year from now.

### Tier 1 — attribution. Create these first; without them ad spend is unattributable.

| JSON key | Field name | Why it matters |
|---|---|---|
| `gclid` | GCLID | The Google click ID. This is what ties a booked job back to the click that paid for it, and it is what offline conversion import needs. |
| `gbraid` | GBRAID | Google sends this **instead of** `gclid` on iOS app traffic. Skipping it silently loses that whole segment. |
| `wbraid` | WBRAID | Same, for web-to-app iOS traffic. |
| `utm_source` | UTM Source | |
| `utm_medium` | UTM Medium | |
| `utm_campaign` | UTM Campaign | |
| `utm_term` | UTM Term | The actual keyword — the most useful single reporting field you will have. |
| `utm_content` | UTM Content | Which RSA/variant. |
| `landing_page` | Landing Page | First page of the session. |
| `page_path` | Page Path | Which of the 25 pages they submitted from. |

> **Check before creating `gclid`:** some GHL versions expose a standard GCLID or
> attribution field on the contact record. If yours does, map to it rather than to a
> custom field — GHL's own "Add to Google Ads" action looks at the standard field, and
> that matters for the day-30 offline conversion import. If you do not see one, a
> custom field is fine.

### Tier 2 — job qualification. This is what makes a lead quotable without a phone call.

| JSON key | Field name | Values it will contain |
|---|---|---|
| `service` | Service Requested | `windshield-replacement`, `chip-crack-repair`, `back-glass`, `door-side-glass`, `adas-calibration`, `not-sure` |
| `vehicle` | Vehicle | Free text, e.g. `2021 Toyota RAV4` |
| `vin` | VIN | 17 chars, validated and uppercased on the page. **This is the field that tells you whether there is a camera behind the glass** — i.e. whether it is a high-value ADAS job. |
| `insurance` | Using Insurance | `yes`, `no`, `not-sure` |
| `carrier` | Insurance Carrier | State Farm, GEICO, Progressive, AAA, USAA, Farmers, Allstate, Mercury, Other |

> `service` and `insurance` could be Single Options dropdowns instead of Text. **Use
> Text.** If a dropdown option ever fails to match the incoming string exactly, GHL
> drops the value silently — and you will not notice until you go looking for it.

### Tier 3 — everything else. Useful, not urgent.

| JSON key | Field name | Notes |
|---|---|---|
| `phone_formatted` | Phone (formatted) | `(555) 555-0142`, for humans reading the record |
| `page` | Submit URL | Full URL including query string |
| `referrer` | Referrer | Empty for most paid clicks |
| `submitted_at` | Submitted At | ISO 8601 UTC. Keep as **Text** — GHL's Date type will not reliably parse a full ISO timestamp |
| `gclsrc` | GCLSRC | Google click source |
| `msclkid` | MSCLKID | Microsoft Ads — only if you ever run Bing |
| `fbclid` | FBCLID | Meta |
| `ttclid` | TTCLID | TikTok |
| `li_fat_id` | LI_FAT_ID | LinkedIn |

Tier 3's platform click IDs are captured now purely so the field exists if a channel is
ever added — no code change needed later.

---

## Copy/paste build list

GHL generates the field's unique key by slugifying the name, so **these exact names
produce keys that match the incoming JSON keys** (`UTM Source` → `utm_source`,
`VIN` → `vin`). Use them verbatim and the mapping dropdown lines up one-to-one.

All 24 are **Text (single line)**. Create in this order — tier 1 first.

| # | Field Name | Type | JSON key | Tier |
|---|---|---|---|---|
| 1 | `GCLID` | Text | `gclid` | 1 |
| 2 | `GBRAID` | Text | `gbraid` | 1 |
| 3 | `WBRAID` | Text | `wbraid` | 1 |
| 4 | `UTM Source` | Text | `utm_source` | 1 |
| 5 | `UTM Medium` | Text | `utm_medium` | 1 |
| 6 | `UTM Campaign` | Text | `utm_campaign` | 1 |
| 7 | `UTM Term` | Text | `utm_term` | 1 |
| 8 | `UTM Content` | Text | `utm_content` | 1 |
| 9 | `Landing Page` | Text | `landing_page` | 1 |
| 10 | `Page Path` | Text | `page_path` | 1 |
| 11 | `Service` | Text | `service` | 2 |
| 12 | `Vehicle` | Text | `vehicle` | 2 |
| 13 | `VIN` | Text | `vin` | 2 |
| 14 | `Insurance` | Text | `insurance` | 2 |
| 15 | `Carrier` | Text | `carrier` | 2 |
| 16 | `Phone Formatted` | Text | `phone_formatted` | 3 |
| 17 | `Page` | Text | `page` | 3 |
| 18 | `Referrer` | Text | `referrer` | 3 |
| 19 | `Submitted At` | Text | `submitted_at` | 3 |
| 20 | `GCLSRC` | Text | `gclsrc` | 3 |
| 21 | `MSCLKID` | Text | `msclkid` | 3 |
| 22 | `FBCLID` | Text | `fbclid` | 3 |
| 23 | `TTCLID` | Text | `ttclid` | 3 |
| 24 | `LI FAT ID` | Text | `li_fat_id` | 3 |

Names only, for fast entry:

```
GCLID
GBRAID
WBRAID
UTM Source
UTM Medium
UTM Campaign
UTM Term
UTM Content
Landing Page
Page Path
Service
Vehicle
VIN
Insurance
Carrier
Phone Formatted
Page
Referrer
Submitted At
GCLSRC
MSCLKID
FBCLID
TTCLID
LI FAT ID
```

### Standard fields — do not create these

| JSON key | Existing GHL field |
|---|---|
| `first_name` | First Name |
| `last_name` | Last Name |
| `full_name` | Name |
| `email` | Email |
| `phone` | Phone |
| `postal_code` | Postal Code |
| `source` | Source |
---

## 3. The one setting that will otherwise double-count every lead

**Inside the workflow this webhook triggers, do NOT add a Google Ads conversion
action.**

Form conversions are reported **from the page** via `gtag`, immediately after the
webhook confirms the lead was delivered. If GHL also reports the same submission, every
lead counts twice and Smart Bidding optimises against inflated data.

| Event | Reported by |
|---|---|
| Form submission | **The page**, via `gtag` |
| Phone calls | **GHL**, via its Number Pool Calling trigger |

This split is not arbitrary: GHL's Google Ads integration is offline-import only and
fires from an allowlisted set of triggers that does **not** include Inbound Webhook.
That is precisely why forms are reported from the page.

**Weekly check:** compare Google Ads conversions against GHL new opportunities. Google
should run 5–15% higher (multi-touch, cross-device). **If Google is near 2× GHL, you
have a duplicate.**

---

## 4. Google Ads conversion action — settings that matter

When you create it:

| Setting | Value | Why |
|---|---|---|
| Goal | Submit lead form | |
| Conversion name | e.g. `Form — Quote Request (LA site)` | |
| Value | Use a value, or 0 for now | Swap to real job value at day 30 via offline import |
| Count | **One** | A quote request is one lead however many times the tab is refreshed |
| Click-through window | 30 days | Glass decisions take hours to days; longer windows import stale credit |
| **Attribution** | Data-driven | |
| **Fire on** | **Page load, NOT click** | The page fires it explicitly with `gtag`, only after delivery is confirmed |
| Enhanced conversions | **On**, "from a website using the Google tag" | The page already sends hashed email + E.164 phone |

Then take the **Conversion ID** (`AW-XXXXXXXXXX`) and **label** (the part after the
slash in `send_to`) from *Tag setup → Use Google tag*, and put them in
`landing/pages.config.cjs` → `site.ads`:

```js
ads: {
  conversionId:    'AW-XXXXXXXXXX',
  conversionLabel: 'AbC-D_efGh12',
  ga4Id: '',
  leadValue: 0
}
```

Until those are filled the whole tracking block is a guarded no-op — the form still
delivers leads, it just reports nothing.

### Verify it end to end
Load a page with a fake click ID, submit the form, and check both sides:

```
https://la.speedywindshield.com/windshield-replacement?gclid=TEST123&utm_source=google&utm_medium=cpc
```

- Lead appears in GHL with `gclid = TEST123` on the contact
- Ads → Conversions shows the action moving out of "No recent conversions" within 3–24h

**Google only records a conversion for a real ad click.** A direct visit has no genuine
`gclid`, so nothing will appear in Ads no matter how many times you submit the form.
Test the GHL side by hand; test the Ads side with a real click on a live ad.

`npm run qa:tracking` already asserts the whole chain in a real browser against a stubbed
webhook — dataLayer contents, payload keys, E.164 normalisation, dedupe, and that the
conversion fires only after delivery.
