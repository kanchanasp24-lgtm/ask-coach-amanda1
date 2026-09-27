/* ============================================================
   ASK COACH AMANDA — Funnel configuration
   ------------------------------------------------------------
   THIS IS THE ONLY FILE THE TEAM SHOULD NEED TO EDIT when links,
   prices or tracking IDs change.  Per the Reference Guide §15/§16:
   offer details live in one editable place, never hard-coded
   through the funnel.
   ============================================================ */

window.ACA = window.ACA || {};

window.ACA.config = {

  /* --- Brand ------------------------------------------------ */
  brand: {
    name: "Ask Coach Amanda",
    founder: "Dr. Amanda Romine-Nelson, PharmD, RPh",
    phone: "978-400-3320",
    phoneHref: "tel:+19784003320",
    email: "contact@AskCoachAmanda.com",
    whatsapp: "https://wa.me/19784003320",
    site: "https://askcoachamanda.com/"
  },

  /* --- Destinations ----------------------------------------- */
  links: {
    home:        "index.html",
    assessment:  "assessment.html",
    apply:       "apply.html",
    book:        "book.html",
    thanks:      "thank-you.html",
    notReady:    "thank-you.html?path=nurture",
    privacy:     "https://askcoachamanda.com/privacy-policy/",
    mainSite:    "https://askcoachamanda.com/",
    whatsapp:    "https://wa.me/19784003320",
    linkedin:    "https://www.linkedin.com/in/amandarominenelson/",
    facebook:    "https://www.facebook.com/askcoachamanda",
    instagram:   "https://www.instagram.com/AskCoachAmanda/",
    twitter:     "https://twitter.com/AskCoachAmanda",
    youtube:     "https://www.youtube.com/channel/UCBv82ApWEK8eegISUryBG9Q"
  },

  /* --- Scheduling ------------------------------------------- */
  // Live Calendly event URL verified from askcoachamanda.com
  calendly: {
    url: "https://calendly.com/beagoodday-com/20-min-call-with-dr-amanda",
    utmSource: "funnel"
  },

  /* --- Current offer (Reference Guide §16) ------------------- */
  offer: {
    name: "The Metabolic Momentum Method™",
    category: "Personalized Metabolic Health Coaching",
    duration: "90 days",
    priceFull: "$1,997",
    pricePlan: "3 payments of $697",
    showPricing: true,          // set false to gate price behind the call
    applicationRequired: true,
    consultationRequired: true
  },

  /* --- Where leads are posted -------------------------------- */
  // Point this at a Make.com / Zapier / GoHighLevel inbound webhook.
  // It receives one JSON object per submission containing every
  // field in docs/DATA-SCHEMA.md.  Leave empty to run the funnel in
  // preview mode (submissions are logged to the console only).
  endpoints: {
    lead:        "",   // assessment email capture
    assessment:  "",   // completed assessment + scores
    application: "",   // coaching application
    escalation:  ""    // red-flag / human-review notifications
  },

  /* --- Analytics -------------------------------------------- */
  // The current site runs no analytics at all. Add the IDs here and
  // the loader in app.js wires up GA4 + Meta automatically.
  analytics: {
    ga4:        "",   // e.g. "G-XXXXXXXXXX"
    metaPixel:  "",   // e.g. "123456789012345"
    debug:      false // true → log every tracked event to the console
  },

  /* --- Consent ---------------------------------------------- */
  consent: {
    smsText: "I agree to receive occasional emails and texts from Ask Coach Amanda about my request. Message and data rates may apply. Reply STOP to opt out."
  }
};
