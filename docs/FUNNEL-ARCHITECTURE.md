# Ask Coach Amanda — Funnel Architecture

Built from the *Brand, Audience, Funnel & Automation Reference Guide* (Aug 2026).
Section references below point back to that document.

---

## 1. The one-line version

> Traffic → **Assessment** (segments + qualifies) → **Results** (delivers real value, earns the next step) → **Application** (qualifies properly) → **Strategy call** (human decision) → **Enrollment** → **Onboarding**.

Nobody is asked for money before a human conversation. Nobody is auto-rejected.
Every step either teaches something or asks something worth asking.

---

## 2. Why an assessment, and not a PDF lead magnet

The Reference Guide (§18) singles this out: an assessment *"may fit the brand particularly well because it provides insight rather than simply information."*

It also does four jobs a downloadable guide can't:

| Job | How |
|---|---|
| **Segments** | Q1 captures `primary_concern` in her own framing — the five segments from §20 |
| **Qualifies** | Age band, readiness and the safety question route her before anyone spends time |
| **Personalizes** | Results name *her* likely constraint, so the follow-up email isn't generic |
| **Earns trust** | She gets something genuinely useful before being asked for anything |

The lead magnet principle in §18 is satisfied: it helps her understand something, tells us something, and creates an appropriate next step.

---

## 3. Stage map

```
STRANGER ─→ AWARE ─→ INTERESTED ─→ QUALIFIED ─→ CONVERSATION ─→ CLIENT ─→ SUCCESS ─→ ADVOCATE
```

| Stage | Page | What we capture | Status set |
|---|---|---|---|
| Aware | `index.html` | Attribution, scroll depth, CTA clicks | `lead_source` |
| Interested | `assessment.html` (Q1–14) | 14 answers, 4 scores, segment | — |
| Interested | assessment gate | Name, email, phone, consent | `status = lead` |
| Interested | results screen | Route decision | `route` |
| Qualified | `apply.html` | Goals, history, barriers, fit answers | `application_status = submitted` |
| Conversation | `book.html` | Calendly booking | `consultation_status = booked` |
| Client | (outside this funnel) | Agreement + payment | `status = client` |

---

## 4. Routing logic

Computed on the results screen, stored as `route`:

| Condition | Route | Next step shown | Why |
|---|---|---|---|
| `safety = yes` | **`human`** | Book a complimentary call | §25 — never route a self-reported symptom into a sales flow |
| `readiness = ready` | **`apply`** | Application → call | High intent; don't slow her down |
| `readiness = curious` | **`call`** | Complimentary call | She needs to understand before applying |
| `readiness = later` | **`nurture`** | Weekly education, open door | §19 — move to the *next appropriate decision*, not to the sale |

`route = human` **overrides everything**, including high readiness.

### Suitability signal (application only)

`apply.js` scores 0–14 across time, investment, expectations, care-team connection, readiness and age band, producing `suitability_status`:

- `strong_fit` (≥11) — book straight in
- `likely_fit` (7–10) — book, Amanda reads the flags first
- `needs_review` (<7, or any red flag) — Amanda decides before the call

**This never blocks anyone.** §21: *"nuanced coaching suitability should remain a human judgment when information is unclear."* The score exists to prepare Amanda, not to gate the prospect.

Flags raised: `cannot_protect_time`, `investment_not_now`, `wants_fast_weight_loss`, `no_current_provider`, `self_reported_symptoms`.

---

## 5. Entry points → landing behaviour

| Source | URL to use | Notes |
|---|---|---|
| Paid social | `/?utm_source=meta&utm_campaign=metabolic&utm_content=<angle>` | Ad angle should match the symptom copy in the "Sound familiar?" block |
| Organic social / bio link | `/assessment?utm_source=instagram` | Warm traffic can skip the landing page |
| Referral / BNI / speaking | `/?utm_source=referral&utm_content=<event>` | High trust (§18) — these can be moved to a call sooner |
| Main website | Link from `askcoachamanda.com` nav | Sets `lead_source = main-website` automatically |
| Email list | `/assessment?utm_source=email&utm_campaign=<name>` | |

First-touch attribution is never overwritten; last-touch always is. Both post to the CRM.

---

## 6. Automation triggers

Every event below fires from the page and lands on the webhook with the **entire** lead record attached, so no automation ever receives an orphaned fragment.

| Event | Fires when | Immediate action (§29.5 — "avoid unnecessary silence") |
|---|---|---|
| `page_view` | Any page load | — |
| `assessment_start` | First question answered | — |
| `lead_captured` | Gate form submitted | Tag `assessment-started`; begin Sequence A |
| `assessment_complete` | Results rendered | Send **Email A1** (results) within 2 minutes |
| `escalation_flagged` | Safety = yes, or application flags | Notify Amanda directly; suppress promotional sends |
| `application_view` | Application page opened | — |
| `application_submit` | Application submitted | Notify Amanda with the full application; begin Sequence B |
| `booking_view` | Booking page opened | — |
| `booking_complete` | Calendly confirms | Stop Sequence B; begin Sequence C (call prep) |

### Stop conditions (§22, §29.12)

Automation must stop or switch when:

- She books → stop "please book" reminders
- She applies → stop "apply" nudges
- She enrolls → **stop every prospect sequence immediately** and start onboarding
- She replies to a human → pause the sequence, hand to Amanda
- She opts out → stop everything

> §22: *"Ignore replies because a sequence is running"* is listed as a thing automation **must not** do. Build the reply-detection pause first, not last.

---

## 7. Tags

Keep the list small enough that a human can read a contact record and understand it (§29.7).

**Segment** (one, from Q1)
`concern-weight-waist` · `concern-energy-cravings` · `concern-blood-sugar` · `concern-prevention` · `concern-optimization`

**Assessment outcome** (one)
`opportunity-fuel` · `opportunity-recovery` · `opportunity-movement` · `opportunity-consistency` · `opportunity-none-clear`

**Journey status** (one, replaces the previous)
`lead` → `applied` → `call-booked` → `call-held` → `client` → `alumni`

**Context** (any)
`on-medication` · `supplement-question` · `marker-flagged` · `age-in-band` · `age-out-of-band`

**Handling** (any)
`needs-human-review` · `escalation` · `not-ready` · `not-a-fit` · `no-show` · `rescheduled`

---

## 8. Escalate to a human when (§25)

Hard rules. The automation stops and Amanda is notified:

- The safety question is answered **yes**
- A complex medication question arrives by any channel
- Anyone asks whether coaching is medically appropriate for them
- A client reports new or concerning symptoms
- Suitability comes back `needs_review`
- Significant dissatisfaction, a refund request, or a payment problem
- **The system is uncertain how to respond**

> **When uncertain: route rather than guess.**

Automation must never diagnose, interpret a symptom as harmless, tell anyone to change a medication, guarantee an outcome, or present itself as Amanda when it isn't.

---

## 9. What to measure (§29.16)

The current main site runs **no analytics at all** — no GA4, no pixel, nothing. Fixing that is prerequisite to every optimisation below.

**Funnel conversion**

| Step | Metric | Healthy starting benchmark |
|---|---|---|
| Landing → assessment start | Start rate | 25–40% |
| Assessment start → questions done | Completion rate | 55–75% |
| Questions done → email given | Gate conversion | 60–80% |
| Results → application | Application rate | 15–30% of `route=apply` |
| Application → call booked | Booking rate | 60–80% |
| Booked → held | Show rate | 70–85% |
| Held → enrolled | Close rate | Amanda's number to set |

Treat these as starting hypotheses, not targets. Real baselines come after 100 assessment completions.

**Also track:** cost per assessment completion by source, `suitability_status` distribution, which `opportunity_*` segment converts best, no-show rate by lead source, and time from `lead_captured` to first human contact.

---

## 10. Deliberately not built

Per §17 of the project brief and the guide's own restraint principle — *"no workflow should be built simply because it is technically possible"*:

- No SMS blast sequences
- No countdown timers or false scarcity
- No chatbot answering health questions
- No auto-rejection of any applicant
- No retargeting of anyone who flagged a symptom
- No "buy now" button anywhere in the funnel

---

## 11. What a human still does

Automation handles: delivery, reminders, tagging, routing, record-keeping, follow-up timing.

Amanda handles: the strategy call, every suitability judgment that isn't obvious, every medication or symptom question, every complaint, and every decision about whether someone should become a client.

> **Automate the process. Personalize the relationship.**
