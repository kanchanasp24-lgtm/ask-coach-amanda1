# Ask Coach Amanda — Netlify, Gmail & WhatsApp Setup Guide

This guide details how the **Metabolic Momentum Method™** funnel captures leads and delivers instant notifications to Dr. Amanda Romine-Nelson's **Gmail** and **WhatsApp**.

---

## 1. Verified Live Details (Extracted from `askcoachamanda.com`)

| Item | Live Production Value | Notes |
| :--- | :--- | :--- |
| **Calendly Booking URL** | `https://calendly.com/beagoodday-com/20-min-call-with-dr-amanda` | Verified HTTP 200 OK (20-min Strategy Call) |
| **Contact Email** | `contact@AskCoachAmanda.com` | Primary inbound email |
| **Direct Phone** | `978-400-3320` (`+1-978-400-3320`) | Direct phone & SMS |
| **WhatsApp Direct Link** | `https://wa.me/19784003320` | One-click WhatsApp chat |
| **Main Website** | `https://askcoachamanda.com/` | WordPress / Divi root |
| **YouTube** | `https://www.youtube.com/channel/UCBv82ApWEK8eegISUryBG9Q` | Channel with 18+ metabolic videos |
| **LinkedIn** | `https://www.linkedin.com/in/amandarominenelson/` | Professional profile |
| **Facebook** | `https://www.facebook.com/askcoachamanda` | Official Facebook page |
| **Instagram** | `https://www.instagram.com/AskCoachAmanda/` | Official Instagram |
| **Twitter / X** | `https://twitter.com/AskCoachAmanda` | Official Twitter handle |

---

## 2. How the Funnel Captures & Routes Data

```
Prospect fills 10-Question Scorecard (assessment.html)
                       │
                       ▼
             Results Gate Form Submitted
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
[Netlify Forms Handler]     [Client-side Webhook]
  - Form: lead-assessment     - config.endpoints.assessment
  - Auto-saved to Netlify     - Custom Zapier / Make webhook
         │                           │
         ├───────────────────────────┤
         ▼                           ▼
1. INSTANT GMAIL NOTIFICATION   2. INSTANT WHATSAPP NOTIFICATION
   (Lead info + Score + Tier)      (Lead info + Direct ping)
```

The funnel captures user data at two main steps:
1. **The 10-Question Scorecard Gate (`assessment.html`)**:
   - `first_name`, `last_name`, `email`, `phone`
   - `total_score` (0–30), `score_tier` (🟢 0–7, 🟡 8–15, 🟠 16–22, 🔴 23–30)
   - `primary_concern` (e.g. Energy & Afternoon Crashes), `secondary_concern`
   - `red_flag` (new/concerning symptoms flag)
   - `consent` (SMS & email consent timestamp)
2. **The Coaching Application (`apply.html`)**:
   - `primary_goal` (90-day goal), `already_tried`, `primary_barrier`
   - `care_team` (physician status), `health_context`
   - `time_commitment` (2x 45-min + 2x 15-min sessions/mo)
   - `investment` ($1,997 or 3x $697)
3. **The Strategy Call Booking (`book.html`)**:
   - Embedded Calendly widget: `https://calendly.com/beagoodday-com/20-min-call-with-dr-amanda`
   - Automatically prefilled with prospect's name, email, and attribution tags.

---

## 3. Connecting Dr. Amanda's Gmail via Netlify (30 seconds)

When you deploy this folder to **Netlify** (drag-and-drop or via GitHub):

1. Log into your **Netlify Dashboard** and select your site.
2. Go to: **Site Configuration** > **Forms** (or **Site settings** > **Notifications** > **Emails**).
3. Click **Add notification** > **Email notification**.
4. Configure:
   - **Event**: `New form submission`
   - **Form**: `Any form` (or select `lead-assessment` and `coaching-application`)
   - **Email address**: Enter Dr. Amanda's email (`contact@AskCoachAmanda.com` or her direct Gmail).
5. Click **Save**.

> **Result:** Every time a woman completes the scorecard or application, Netlify immediately emails Dr. Amanda's Gmail with the complete submission details!

---

## 4. Connecting Dr. Amanda's WhatsApp (3 minutes)

There are two powerful ways Dr. Amanda receives WhatsApp notifications:

### Method A: Automated WhatsApp Alerts via Zapier / Make.com (Recommended)
You can receive an instant WhatsApp alert whenever a lead completes the scorecard or coaching application:

1. In **Zapier** or **Make.com**, create a free new scenario/zap:
   - **Trigger**: **Webhooks by Zapier** (Catch Hook) or **Netlify** (New Submission).
     - Copy the generated Webhook URL.
   - **Action**: **WhatsApp Notifications by Twilio** (or **WhatsApp Cloud API**).
     - To: `+19784003320` (Dr. Amanda's phone)
     - Message text:
       ```
       🔔 NEW METABOLIC SCORECARD LEAD!
       Name: {{first_name}} {{last_name}}
       Email: {{email}}
       Phone: {{phone}}
       Score: {{total_score}}/30 ({{score_tier}})
       Primary Area: {{primary_concern}}
       Submitted At: {{submitted_at}}
       ```
2. Paste that Webhook URL into [`assets/js/config.js`](file:///c:/Users/ABCOM/Documents/landing%20page/assets/js/config.js):
   ```javascript
   endpoints: {
     lead:        "https://hooks.zapier.com/hooks/catch/XXXXXX/YYYYYY/",
     assessment:  "https://hooks.zapier.com/hooks/catch/XXXXXX/YYYYYY/",
     application: "https://hooks.zapier.com/hooks/catch/XXXXXX/YYYYYY/"
   }
   ```
   *Note: If using Netlify's built-in webhook, you can also paste the Zapier Webhook URL directly in Netlify Site Settings > Notifications > Add Webhook!*

### Method B: Direct Prospect-to-Coach WhatsApp Chat
On `thank-you.html`, `book.html`, and `index.html`, we have added direct **"Chat with Dr. Amanda on WhatsApp"** buttons linked to `https://wa.me/19784003320`.
- On `thank-you.html`, the message is automatically personalized with the prospect's name:
  `"Hi Dr. Amanda, this is [Name]. I just took the Metabolic Health Scorecard and wanted to connect!"`
- This allows prospects to immediately initiate a 1-on-1 dialogue on WhatsApp.

---

## 5. Calendly Strategy Call Confirmation

The Calendly event link configured is:
`https://calendly.com/beagoodday-com/20-min-call-with-dr-amanda`

Inside Calendly:
1. In the event settings, Amanda's connected Google Calendar / Outlook calendar receives the calendar event automatically.
2. In Calendly **Workflows**:
   - Email reminders are sent to the invitee 24 hours and 1 hour before the call.
   - Text (SMS) reminders can be enabled in Calendly under **Workflows > Send text to invitee**.

---

## 6. Testing Locally

The dev server is running locally at `http://localhost:3000`. You can test the entire flow end-to-end:
1. **Landing Page**: [`http://localhost:3000/index.html`](http://localhost:3000/index.html)
2. **Scorecard**: [`http://localhost:3000/assessment.html`](http://localhost:3000/assessment.html)
3. **Application**: [`http://localhost:3000/apply.html`](http://localhost:3000/apply.html)
4. **Booking**: [`http://localhost:3000/book.html`](http://localhost:3000/book.html)
5. **Confirmation**: [`http://localhost:3000/thank-you.html`](http://localhost:3000/thank-you.html)
