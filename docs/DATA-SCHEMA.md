# Data Schema

Every submission POSTs **one JSON object** containing the complete lead record — not just the fields from that form. This means a webhook consumer never receives an orphaned fragment, and Amanda never sees a contact record with holes in it.

Guiding rule (§26): *before collecting a field, ask why we need it, how we'll use it, and whether it improves the journey, the coaching, or required recordkeeping.* Nothing here is collected "just in case."

---

## Envelope — on every POST

| Field | Type | Example |
|---|---|---|
| `submission_type` | string | `assessment` · `application` · `lead` · `escalation` |
| `submitted_at` | ISO 8601 | `2026-09-08T14:22:10.441Z` |
| `page_url` | string | `https://.../assessment.html` |
| `user_agent` | string | |
| `updated_at` | ISO 8601 | Last write to the local record |

---

## Attribution — set on first page view, never re-asked

| Field | Type | Notes |
|---|---|---|
| `first_seen_at` | ISO 8601 | First touch, never overwritten |
| `landing_page` | string | Path + query of the entry page |
| `referrer` | string | `direct` if none |
| `first_touch` | object | `{utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid, ref}` |
| `last_touch` | object | Same shape; overwritten on every visit carrying UTMs |
| `lead_source` | string | Flattened for the CRM: `meta`, `referral`, `organic-search`, `social:instagram`, `main-website`, `direct` |

---

## Identity — assessment gate

| Field | Type | Required |
|---|---|---|
| `first_name` | string | ✅ |
| `last_name` | string | |
| `email` | string | ✅ |
| `phone` | string | Optional at the gate, required on the application |
| `consent` | boolean | ✅ |
| `consent_at` | ISO 8601 | Timestamp of the tick |

---

## Assessment

| Field | Type | Values |
|---|---|---|
| `primary_concern` | string | `weight_waist` · `energy_cravings` · `blood_sugar` · `prevention` · `optimization` |
| `age_band` | string | `under_40` · `40_49` · `50_59` · `60_69` · `70_plus` |
| `readiness` | string | `ready` · `curious` · `later` |
| `assessment_answers` | object | All 14 raw answers, keyed by question id |
| `assessment_scores` | object | Raw points: `{fuel, recovery, movement, consistency}` |
| `assessment_percents` | object | Normalised 0–100, comparable across dimensions |
| `opportunity_primary` | string | `fuel` · `recovery` · `movement` · `consistency` |
| `opportunity_secondary` | string | Same set |
| `no_clear_constraint` | boolean | True when the top area scores under 25% — she gets the optimization result, not a false constraint |
| `assessment_completed_at` | ISO 8601 | |

### Derived flags

| Field | Type | Meaning |
|---|---|---|
| `route` | string | `apply` · `call` · `nurture` · `human` |
| `red_flag` | boolean | Self-reported new/undiscussed symptoms → human first, always |
| `age_in_band` | boolean | 40–69 |
| `on_medication` | boolean | Pillar 4 relevance |
| `supplement_question` | boolean | |
| `marker_flagged` | boolean | A provider has flagged a marker |

**Raw answer keys inside `assessment_answers`:**
`primary_concern`, `age_band`, `breakfast`, `afternoon`, `satiety`, `sleep`, `stress_eating`, `movement`, `post_meal`, `derailers[]`, `when_stalls`, `context[]`, `readiness`, `safety`

---

## Application

| Field | Type | Values |
|---|---|---|
| `primary_goal` | text | What would need to be different in 90 days |
| `already_tried` | text | |
| `primary_barrier` | text | |
| `care_team` | string | `yes` · `occasionally` · `no` |
| `health_context` | text | Optional, volunteered only |
| `time_commitment` | string | `yes` · `tight` · `no` |
| `investment` | string | `full` · `plan` · `unsure` · `no` |
| `expectations` | string | `sustainable` · `both` · `fast` |
| `preferred_contact` | string | `email` · `text` · `phone` |
| `application_status` | string | `submitted` |
| `application_submitted_at` | ISO 8601 | |
| `offer_discussed` | string | From `config.offer.name` |

### Suitability

| Field | Type | Notes |
|---|---|---|
| `suitability_score` | int | 0–14 |
| `suitability_max` | int | 14 |
| `suitability_status` | string | `strong_fit` · `likely_fit` · `needs_review` |
| `suitability_flags` | array | `cannot_protect_time` · `investment_not_now` · `wants_fast_weight_loss` · `no_current_provider` · `self_reported_symptoms` |

> A score is a **signal for Amanda**, never a gate. Nobody is auto-rejected (§21).

---

## Consultation

| Field | Type | Values |
|---|---|---|
| `consultation_status` | string | `booked` · `held` · `no_show` · `rescheduled` · `cancelled` |
| `consultation_booked_at` | ISO 8601 | Set by the Calendly confirmation event |

Statuses after `booked` are set by the CRM, not the funnel pages.

---

## Escalation

| Field | Type | Notes |
|---|---|---|
| `escalation_reason` | string | `self_reported_new_symptoms` · `application_flags` |
| `escalation_detail` | string | Human-readable context |

Escalations POST to a **separate endpoint** via `sendBeacon` so they survive the page unloading, and they never block the user's next step.

---

## Handling notes

**Health information.** `health_context`, `on_medication`, `supplement_question` and `marker_flagged` are volunteered health details. Store them where Amanda's client records live, restrict access, and don't push them into ad platforms, lookalike audiences, or any analytics tool. The tracking layer in `app.js` deliberately sends only non-identifying counts and segment labels to GA4 / Meta — keep it that way.

**Retention.** Agree a retention period for non-clients (90 days after last engagement is a reasonable default) and delete on request.

**Never send to ad platforms:** email, phone, `health_context`, `assessment_answers`, `red_flag`, or anything under Escalation.
