# Ask Coach Amanda — Metabolic Momentum Funnel

A complete client-acquisition funnel for **The Metabolic Momentum Method™**, built from the *Brand, Audience, Funnel & Automation Reference Guide* (Aug 2026).

Static HTML, CSS and vanilla JS. No build step, no framework, no dependencies. Drop it on any host.

---

## The funnel

```
  index.html          Landing page — video slot, story, program, pricing, FAQ
       ↓
  assessment.html     "Why do I feel metabolically stuck?" — 14 questions,
                      4-dimension scoring, email gate, personalised results
       ↓  routes by readiness + safety
  apply.html          Coaching application + suitability signal
       ↓
  book.html           Calendly strategy call, prefilled
       ↓
  thank-you.html      Route-aware confirmation (booked / nurture / lead)
```

Full logic: [`docs/FUNNEL-ARCHITECTURE.md`](docs/FUNNEL-ARCHITECTURE.md)
Email copy: [`docs/EMAIL-SEQUENCES.md`](docs/EMAIL-SEQUENCES.md)
Field reference: [`docs/DATA-SCHEMA.md`](docs/DATA-SCHEMA.md)

---

## Files

```
index.html            Landing page
assessment.html       Assessment + results
apply.html            Application
book.html             Calendly booking
thank-you.html        Confirmation

assets/css/brand.css   Design system — palette, type, buttons, forms
assets/css/funnel.css  Page components — hero, video slot, quiz, pricing
assets/js/config.js    ⚠️ THE ONLY FILE YOU NORMALLY EDIT
assets/js/app.js       Attribution, tracking, lead store, submissions
assets/js/assessment.js Questions, scoring, routing, results
assets/js/apply.js     Application, suitability, prefill

docs/                  Funnel architecture, email sequences, data schema
```

---

## Setup — five things

Everything below lives in **`assets/js/config.js`**.

### 1. Lead endpoints (required)

Create one inbound webhook in Make.com, Zapier or GoHighLevel and paste the URL:

```js
endpoints: {
  lead:        "https://hook.eu2.make.com/xxxxx",
  assessment:  "https://hook.eu2.make.com/xxxxx",
  application: "https://hook.eu2.make.com/xxxxx",
  escalation:  "https://hook.eu2.make.com/yyyyy"   // route to Amanda directly
}
```

The same URL can serve all four — `submission_type` tells you which is which. **Keep `escalation` separate** so a flagged symptom never sits in a marketing queue.

Leave them empty and the funnel runs in preview mode: every payload is logged to the browser console instead of being sent. Useful for demos.

### 2. Calendly (required)

```js
calendly: { url: "https://calendly.com/beagoodday-com/20-min-call-with-dr-amanda" }
```

Name, email and attribution prefill automatically. `book.html` listens for Calendly's confirmation event, records `consultation_status = booked`, and forwards to the thank-you page.

### 3. Analytics (required — the current site has none)

```js
analytics: { ga4: "G-XXXXXXXXXX", metaPixel: "123456789012345" }
```

`app.js` loads both and fires: `page_view`, `cta_click`, `scroll_depth`, `assessment_start`, `lead_captured`, `assessment_complete`, `application_view`, `application_submit`, `booking_view`, `booking_complete`, `thank_you_view`, `escalation_flagged`.

**Mark these as GA4 conversions:** `lead_captured`, `assessment_complete`, `application_submit`, `booking_complete`.

Set `analytics.debug = true` to log every event to the console while testing.

### 4. Amanda's video

In `index.html`, find the block marked `⬇⬇ CLIENT VIDEO GOES HERE ⬇⬇` in the hero. Delete the `<div class="video-placeholder">` and paste the embed — YouTube, Vimeo and self-hosted snippets are all written out in the comment.

The slot is 16:9, sits above the fold on desktop, and already handles responsive sizing.

**Compress the file.** The current main site serves an 11.6 MB hero image (`DSC060331.jpg`, 6000×4000) with lazy-loading on an above-the-fold element. Don't repeat that here.

Suggested script for a 60–90 second welcome:
1. Who this is for — say "women 40 to 65 who feel stuck" out loud
2. The one thing that makes her different — pharmacist who connects the dots
3. What connecting the dots actually means, with one concrete example
4. What happens on a strategy call, and that "no" is a fine outcome

### 5. Pricing

```js
offer: { priceFull: "$1,997", pricePlan: "3 payments of $697", showPricing: true }
```

Pricing is currently written into `index.html` (the investment panel and the FAQ) and `apply.html`. If the number changes, update it there and in `config.js`. The reference guide flags the payment plan as still under consideration — decide before launch.

---

## Run it locally

```bash
cd askcoachamanda-funnel
python -m http.server 8777
# open http://localhost:8777
```

A real server is needed — `file://` will block `fetch` and the Calendly embed.

---

## Deploy

**Recommended — a subdirectory of the main domain.** Keeps the domain authority and lets one pixel see the whole journey.

| Host | How |
|---|---|
| Netlify / Vercel / Cloudflare Pages | Drag the folder in. Point `metabolic.askcoachamanda.com` at it. |
| WordPress (current stack) | Upload to `/wp-content/funnel/` and serve at `askcoachamanda.com/metabolic/`. **Do not** rebuild these pages in Divi — the point is to escape the 380 KB / 33-script page weight. |
| GoHighLevel | Paste each page into a blank custom-code funnel step. Keep `config.js` as the single source of links. |

Update `<link rel="canonical">` in `index.html` to the final URL.

---

## Pre-launch checklist

**Configuration**
- [ ] All four endpoints set and a test payload received in the CRM
- [ ] Calendly URL live, and a test booking reaches Amanda's calendar
- [ ] GA4 and Meta IDs in, conversions marked
- [ ] Amanda's video embedded and compressed
- [ ] Pricing confirmed and consistent across all three places
- [ ] Privacy policy URL correct

**Flow — walk it end to end as a real prospect**
- [ ] Assessment: complete once with heavy fuel answers, once with heavy sleep answers, once answering "already doing well" — three different results
- [ ] Answer the safety question **yes** → results show the alert, CTA switches to a call, escalation fires
- [ ] Set readiness to `later` → nurture route, not the application
- [ ] Application prefills the name and email from the assessment
- [ ] Booking page prefills, and confirming redirects to the thank-you page

**Compliance — non-negotiable**
- [ ] No claim to cure, reverse, fix or prevent anything
- [ ] No promised weight-loss number or timeline
- [ ] Medical disclaimer in every footer
- [ ] Assessment described as educational, never diagnostic
- [ ] Escalation path tested and reaching a human

**Technical**
- [ ] Mobile: hero, sticky CTA, quiz choices, forms
- [ ] Pinch-zoom works — the main site currently blocks it with `user-scalable=0`; this funnel does not, keep it that way
- [ ] Keyboard: tab through the assessment, arrow keys inside application radio groups
- [ ] `noindex` on assessment, apply, book and thank-you (already set)

---

## Design system

**Palette** — exactly the brand guide's five, plus tints derived from them.

| Token | Hex | Use |
|---|---|---|
| `--teal` | `#347C81` | Primary buttons, links, accents |
| `--mint` | `#72B7A6` | Secondary surfaces, diagram, tints |
| `--slate` | `#595F5F` | Neutral (body text uses a darker `--ink` for contrast) |
| `--gold` | `#E6BF5A` | Highlights, the final CTA — accent only, never text on white |
| `--white` | `#FFFFFF` | |
| `--teal-ink` | `#143A3D` | Headings, dark sections |

**Type** — Playfair Display (headings, weight 500) + Inter (body), matching the reference funnel. Base size is 17px, deliberately larger than default: the core audience is 40–65.

**Accessibility** — body text is 14.2:1 on white, focus rings on every interactive element, the assessment is fully keyboard-operable, and zoom is never blocked.

---

## Design decisions worth knowing

**Why an assessment instead of a PDF.** The reference guide singles it out (§18): it provides insight rather than information. It also segments, qualifies and personalises in a single step, which no downloadable guide does.

**Why pricing is shown.** It pre-qualifies. The application asks about investment directly so the strategy call is a fit conversation, not a price reveal. Set `showPricing: false` if Amanda would rather hold it back.

**Why nobody is auto-rejected.** §21 is explicit that nuanced suitability is a human judgment. The suitability score prepares Amanda; it never blocks a prospect.

**Why the safety question overrides everything.** §25 requires escalation, not a sales sequence, when someone reports symptoms they haven't raised with a provider. It's also simply the right thing to do.

**Why there are no countdown timers or scarcity mechanics.** §12 rules out anything that reads as a weight-loss infomercial. The trust this brand runs on is worth more than the conversion lift.

---

> **Connect the dots. Create momentum. Build wellness that sticks.**
> **Automate the process. Personalize the relationship.**
