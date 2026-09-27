# Ask Coach Amanda — Email Sequences

Ready-to-load copy. Written against the voice rules in §11–13 of the Reference Guide.

**Every email follows the content formula:**
RECOGNIZE → EXPLAIN → CONNECT → ACT → EMPOWER.

**Hard language rules (§12):** no "reverse", "cure", "fix", "heal your metabolism", "get off your medications", "guaranteed", "melt", "transform in 90 days". Use *may, may support, one factor to consider, can contribute to, work toward*. Never shame. Never fear. Never promise a medical outcome.

## Merge fields

| Field | Source | Example |
|---|---|---|
| `{{first_name}}` | Gate form | Karen |
| `{{opportunity_label}}` | `opportunity_primary` | Sleep, stress & recovery |
| `{{opportunity_first_step}}` | Results screen copy | Pick a consistent wake time for seven days |
| `{{concern_phrase}}` | `primary_concern` | your waistline |
| `{{results_link}}` | Hosted results page | |
| `{{application_link}}` | `/apply.html` | |
| `{{booking_link}}` | Calendly | |

**`{{concern_phrase}}` lookup:** `weight_waist` → "your waistline" · `energy_cravings` → "your afternoon energy" · `blood_sugar` → "the numbers you've been told to watch" · `prevention` → "getting ahead of this" · `optimization` → "whether you're doing the right things"

---

# Sequence A — Assessment completed
**Trigger:** `assessment_complete` · **Applies to:** all leads · **Exit on:** application submitted, call booked, or unsubscribe

---

### A1 — Results (send within 2 minutes)

**Subject:** Your assessment results, {{first_name}}
**Preview:** The area worth your attention first — and one place to start.

> {{first_name}},
>
> Here's what your answers pointed to: **{{opportunity_label}}**.
>
> That doesn't mean the other three areas don't matter. It means that if you only had the energy to work on one thing this month, this is the one most likely to move something.
>
> [**See your full results →**]({{results_link}})
>
> One thing to try this week, and only this one:
>
> *{{opportunity_first_step}}*
>
> Not fifteen changes. One. The point isn't to overhaul your life this week — it's to see whether the pattern is what you thought it was.
>
> I'll send you something else in a couple of days that goes a layer deeper on this.
>
> — Amanda
>
> *Dr. Amanda Romine-Nelson, PharmD, RPh*
>
> P.S. Your results are educational, not a diagnosis. If anything in your health feels off, that conversation belongs with your physician — and I'll always say so.

---

### A2 — Go deeper (+2 days)

**Subject:** Why {{concern_phrase}} stopped responding
**Preview:** It usually isn't one thing. That's the actual problem.

> {{first_name}},
>
> Most people come to me having already tried the obvious fix. Ate less. Walked more. Cut the carbs. Bought the supplement. It worked for about two weeks.
>
> Here's what I think is going on, and it's not a motivation problem.
>
> Health advice arrives one piece at a time. Drink more water. Get more sleep. Lower your stress. Take this. Every piece is defensible on its own — and none of them tell you how they interact *in your body, in your week*.
>
> So you end up doing six reasonable things without knowing which two are actually load-bearing for you. When results don't come, the conclusion feels obvious: try harder. It's almost never the right conclusion.
>
> Your assessment pointed at **{{opportunity_label}}**. That's the thread worth pulling first — not because the other areas don't matter, but because sequence matters. Working on the wrong thing first is how people spend a year being disciplined and getting nowhere.
>
> More on that Thursday.
>
> — Amanda

---

### A3 — The medication question (+4 days)

**Subject:** You don't have to pick a side
**Preview:** Medication and lifestyle were never opposites.

> {{first_name}},
>
> A lot of health content online wants you to choose. Either you take the medication and give up, or you go "natural" and reject conventional medicine.
>
> I'm a pharmacist. I think that framing has done real damage.
>
> Medication can be an important tool. Lifestyle can be an important tool. The question was never which side you're on — it's what combination of appropriate tools actually supports your health, and whether you understand what each one is doing.
>
> What I've seen change things for people isn't dramatic. It's understanding *why* something was prescribed, what it may be doing, and what questions are worth taking to their next appointment. That's a different person walking into that room.
>
> To be direct about what I don't do: I don't prescribe, I don't diagnose, and I never tell anyone to stop a medication. Those decisions belong with your prescriber, full stop. What I can do is make sure you're not the least-informed person in your own care.
>
> — Amanda

---

### A4 — The invitation (+7 days)

**Subject:** Worth a 20-minute conversation?
**Preview:** No pitch. If it isn't a fit I'll tell you.

> {{first_name}},
>
> You took the assessment about a week ago. If the one change stuck — genuinely, good. That may be all you needed, and I mean that.
>
> If it didn't, or if it worked for four days and then a hard week arrived, that's the pattern worth talking about. It's the most common reason people end up working with me, and it isn't a discipline problem.
>
> The complimentary call is twenty minutes. I read your assessment beforehand. You tell me what you've tried and what keeps getting in the way. By the end you'll know whether coaching makes sense for you right now — and if it doesn't, I'll say so and point you somewhere more useful.
>
> [**Pick a time →**]({{booking_link}})
>
> — Amanda
>
> P.S. If you already know you want to work on this properly, the [short application]({{application_link}}) gets us further in the same twenty minutes.

---

### A5 — What 90 days looks like (+12 days)

**Subject:** What actually changes in 90 days
**Preview:** Mostly not what people expect.

> {{first_name}},
>
> People assume the answer is a number on a scale. Sometimes that changes. But when clients tell me what was different at the end, it's usually this:
>
> They stopped guessing. They knew which two things mattered for them, why those two, and what to do when a week went sideways instead of starting over from zero. They walked into appointments with questions instead of nerves.
>
> That's the actual transformation — from a collection of health tips to a plan you understand. Weight and waist measurements often follow, but I won't promise you a number, and you should be careful with anyone who does.
>
> If that sounds like what you're after: [**twenty minutes, whenever suits**]({{booking_link}}).
>
> If not, no problem at all — I'll keep sending things worth reading.
>
> — Amanda

**After A5:** move to Sequence E (nurture).

---

# Sequence B — Applied, not yet booked
**Trigger:** `application_submit` with no `booking_complete` within 20 minutes · **Exit:** booking confirmed

### B1 — Received (immediate)

**Subject:** Got your application, {{first_name}}
> Your application is in and I'll read it properly before we speak — that's the whole point of it.
>
> The last step is picking a time: [**Amanda's calendar →**]({{booking_link}})
>
> Twenty minutes. Nothing to prepare.
>
> — Amanda

### B2 — Reminder (+1 day)
**Subject:** One step left
> {{first_name}} — your application came through yesterday but I don't have a time on the calendar yet.
>
> [**Grab a slot here →**]({{booking_link}})
>
> If none of the times work, reply and tell me roughly when you're free. We'll sort it out.

### B3 — Last touch (+3 days)
**Subject:** Still want to talk this through?
> {{first_name}}, I'll stop nudging after this one.
>
> Your application is saved, so nothing is lost if the timing has shifted. When you're ready: [**here's the calendar**]({{booking_link}}), or just reply to this email and we'll find a time.
>
> Either way — the assessment was worth doing, and that one change still stands.
>
> — Amanda

**Then:** stop. Move to Sequence E.

---

# Sequence C — Call booked
**Trigger:** `booking_complete` · **Exit:** call held

### C1 — Confirmed (immediate)
**Subject:** You're on the calendar — {{call_datetime}}
> Confirmed for **{{call_datetime}}**. Here's the link: {{call_link}}
>
> **What to expect.** I'll have read your assessment and application. We'll talk about what you've tried, what's getting in the way, and what working together would actually look like. If it's not a fit, I'll tell you — that's a useful outcome too.
>
> **Worth having handy** (all optional): a rough sense of your current medications and supplements, any numbers you've been told to watch, and an honest picture of what your typical week looks like.
>
> Need to move it? Use the reschedule link in this email. No explanation needed.
>
> — Amanda

### C2 — 24 hours before
**Subject:** Tomorrow at {{call_time}}
> Quick reminder — we're speaking tomorrow at **{{call_time}}**. Link: {{call_link}}
>
> One thing that makes these calls better: come with the version of your week that's actually true, not the version you wish were true. I'm not here to grade anyone.
>
> — Amanda

### C3 — 1 hour before *(SMS if she consented, otherwise email)*
> Hi {{first_name}} — Amanda here. We're on in an hour: {{call_link}} See you shortly.

### C4 — After the call *(choose one — Amanda selects the outcome)*

**C4a · Good fit, ready**
**Subject:** Next steps from our call
> {{first_name}}, good conversation. As promised, here's everything in one place: {{program_summary_link}}
>
> The agreement and payment link are below. Once that's done I'll send your intake straight away and we'll get your first session scheduled — I don't like leaving a gap between deciding and starting.
>
> {{enrollment_link}}
>
> Questions before you commit? Reply here. That's not a stalling tactic, I'd genuinely rather you asked.

**C4b · Good fit, needs time**
**Subject:** No rush, {{first_name}}
> Thanks for being straightforward about the timing. Here's what we discussed, so it's not lost: {{recap}}
>
> The one thing I'd start with regardless of whether we work together: *{{opportunity_first_step}}*
>
> I'll check in around {{followup_month}}. If things shift before then, you know where I am.

**C4c · Not the right fit**
**Subject:** Following up on our call
> {{first_name}}, thanks for the honest conversation. As I said, I don't think this program is the right thing for you right now — and I'd rather say that than take you on.
>
> What I'd suggest instead: {{referral_or_resource}}
>
> If your situation changes, the door is genuinely open.
>
> — Amanda

---

# Sequence D — No-show
**Trigger:** call time passes, not marked held. **Tone rule: no shame (§12).**

### D1 — Same day
**Subject:** Missed you today
> {{first_name}} — we had a call today and I didn't manage to connect with you. No problem at all; days get away from people.
>
> [**Here's the calendar if you'd like to pick another time →**]({{booking_link}})
>
> And if you've decided this isn't for you, that's completely fine — you don't owe me an email.
>
> — Amanda

### D2 — +3 days *(final)*
**Subject:** Leaving this here
> Not chasing you, {{first_name}} — just closing the loop. Your assessment and application are saved, so if you want to pick this up later nothing needs redoing: {{booking_link}}
>
> — Amanda

**Then:** stop. Move to Sequence E.

---

# Sequence E — Nurture
**Trigger:** `route = nurture`, or the end of Sequence A/B/D · **Cadence:** one email every 7–10 days

Rotate across the four content pillars (§10), following RECOGNIZE → EXPLAIN → CONNECT → ACT → EMPOWER. One idea per email. No sales pressure — a soft footer link only.

**Working subject bank:**

1. The 3 p.m. crash is usually a 9 a.m. problem
2. "Natural" doesn't mean necessary — how I think about supplements
3. Why the plan works until the week gets hard
4. What to actually ask at your next appointment
5. Progress that never shows up on a scale
6. The difference between a setback and starting over
7. Protein, fiber and the boring reason meals stop holding you
8. Sleep isn't a separate category from food

**Standard footer for every nurture email:**
> Whenever you'd like to talk properly, [here's my calendar]({{booking_link}}). No pressure — the education is yours either way.

---

# Sequence F — Client onboarding
**Trigger:** agreement signed / payment complete · **First action: stop every prospect sequence immediately (§23).**

> §24: *"The final transformation may take 90 days. The client's confidence in her decision should begin on Day 1."*

| When | Send | Purpose |
|---|---|---|
| Immediately | **Welcome + one clear first action** | Confirmation, what happens next, something to *do* today |
| Same day | Agreement, payment receipt, portal access, scheduling link | Administrative completion — no loose ends |
| Day 1 | **Intake form** | Only fields with a coaching purpose (§26) |
| Day 2 | Confirmation the intake was read, plus one thing Amanda already noticed | Proves a human is on the other end |
| Day 3–5 | **First session** | Goals, baseline, patterns, initial actions |
| Day 7 | **Early win check-in** | §24.7 — meaningful evidence of progress early |
| Day 14, 30, 60 | Progress markers | Beyond the scale (§9) |
| Day 80 | Completion conversation scheduled | Review, maintenance plan, next-step options |
| Day 90 | Wrap-up + feedback + testimonial ask + referral ask | §24.10 |

**Sales-to-coaching continuity (§24.5):** the first session must carry over why she reached out, what she's already tried, and what she said on the strategy call. She should never have to repeat the sales conversation.

---

# Internal notifications (to Amanda, not the prospect)

| Trigger | Subject | Contains |
|---|---|---|
| `escalation_flagged` | 🔴 Review needed — {{first_name}} | Reason, full assessment, contact details |
| `application_submit` | New application — {{first_name}} ({{suitability_status}}) | Full application, scores, flags |
| `suitability_status = needs_review` | ⚠️ Application needs your call — {{first_name}} | Which flags fired and why |
| No human contact within 24h of `lead_captured` | Lead going cold — {{first_name}} | Prevents §22's "falling through the cracks" |

---

## Compliance checklist — run before any send

- [ ] No claim to cure, reverse, fix, heal or prevent a condition
- [ ] No promise of weight loss, a number, or a timeline
- [ ] No instruction to start, stop or change a medication
- [ ] No interpretation of a symptom or a lab value
- [ ] No shame, blame, fear or urgency manufactured from health anxiety
- [ ] Hedged language used where a claim would otherwise appear
- [ ] Unsubscribe link present, and it works
- [ ] Sequence stops when the recipient replies, books, applies or enrolls
