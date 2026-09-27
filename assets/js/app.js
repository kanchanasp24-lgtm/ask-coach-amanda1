/* ============================================================
   ASK COACH AMANDA — Funnel core
   Attribution · tracking · lead store · submissions
   Requires config.js to be loaded first.
   ============================================================ */
(function () {
  "use strict";

  var CFG = (window.ACA && window.ACA.config) || {};
  var ACA = window.ACA = window.ACA || {};
  var KEY = "aca_lead_v1";

  /* ------------------------------------------------------------
     1. LEAD STORE
     One object follows the prospect across every step so nothing
     has to be re-asked. (Reference Guide §29.3 "preserve the
     doorway through which she entered".)
     ------------------------------------------------------------ */
  var Store = ACA.store = {
    read: function () {
      try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
      catch (e) { return {}; }
    },
    write: function (patch) {
      var next = Object.assign(Store.read(), patch, { updated_at: new Date().toISOString() });
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
      return next;
    },
    clear: function () { try { localStorage.removeItem(KEY); } catch (e) {} }
  };

  /* ------------------------------------------------------------
     2. ATTRIBUTION
     First touch is never overwritten; last touch always is.
     ------------------------------------------------------------ */
  var UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
             "gclid", "fbclid", "ref"];

  function captureAttribution() {
    var qs = new URLSearchParams(location.search);
    var last = {};
    UTM.forEach(function (k) { if (qs.get(k)) last[k] = qs.get(k); });

    var lead = Store.read();
    var patch = {};

    if (!lead.first_seen_at) {
      patch.first_seen_at   = new Date().toISOString();
      patch.landing_page    = location.pathname + location.search;
      patch.referrer        = document.referrer || "direct";
      patch.first_touch     = Object.keys(last).length ? last : { utm_source: inferSource() };
    }
    if (Object.keys(last).length) patch.last_touch = last;

    // Flattened, human-readable lead source for the CRM
    var src = (patch.first_touch || lead.first_touch || {}).utm_source || inferSource();
    if (!lead.lead_source) patch.lead_source = src;

    return Store.write(patch);
  }

  function inferSource() {
    var r = document.referrer;
    if (!r) return "direct";
    try {
      var h = new URL(r).hostname.replace(/^www\./, "");
      if (/google|bing|duckduckgo|yahoo/.test(h)) return "organic-search";
      if (/facebook|instagram|linkedin|twitter|x\.com|youtube|t\.co/.test(h)) return "social:" + h.split(".")[0];
      if (/askcoachamanda/.test(h)) return "main-website";
      return "referral:" + h;
    } catch (e) { return "referral"; }
  }

  /* ------------------------------------------------------------
     3. ANALYTICS LOADER
     ------------------------------------------------------------ */
  function loadAnalytics() {
    var a = CFG.analytics || {};
    window.dataLayer = window.dataLayer || [];

    if (a.ga4) {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(a.ga4);
      document.head.appendChild(s);
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", a.ga4, { send_page_view: true });
    }

    if (a.metaPixel) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq("init", a.metaPixel);
      window.fbq("track", "PageView");
    }
  }

  /* ------------------------------------------------------------
     4. TRACK
     One call fans out to dataLayer, GA4 and Meta.
     ------------------------------------------------------------ */
  var META_MAP = {
    assessment_start:     "InitiateCheckout",
    lead_captured:        "Lead",
    assessment_complete:  "CompleteRegistration",
    application_submit:   "SubmitApplication",
    booking_view:         "Schedule"
  };

  ACA.track = function (event, props) {
    props = props || {};
    var lead = Store.read();
    var payload = Object.assign({
      event: event,
      lead_source: lead.lead_source,
      primary_concern: lead.primary_concern,
      page: location.pathname
    }, props);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    if (window.gtag) window.gtag("event", event, payload);
    if (window.fbq && META_MAP[event]) window.fbq("track", META_MAP[event], props);
    if (CFG.analytics && CFG.analytics.debug) console.log("[ACA track]", event, payload);
  };

  /* ------------------------------------------------------------
     5. SUBMIT
     Posts the whole lead record so the CRM never receives an
     orphaned fragment. Supports Netlify Forms (automatic on
     Netlify deployment) and custom webhooks (Zapier / Make / Webhook).
     ------------------------------------------------------------ */
  ACA.submit = function (type, fields) {
    var lead = Store.write(fields || {});
    var body = Object.assign({}, lead, {
      submission_type: type,
      submitted_at: new Date().toISOString(),
      page_url: location.href,
      user_agent: navigator.userAgent
    });

    var tasks = [];

    // 1. Post to Netlify forms endpoint if an active form exists
    var formName = type === "assessment" ? "lead-assessment" : (type === "application" ? "coaching-application" : (type === "booking" ? "strategy-call-booking" : null));
    var formEl = formName ? (document.querySelector('form[name="' + formName + '"]') || document.getElementById("gate-form") || document.getElementById("apply-form") || document.getElementById("booking-form")) : null;

    if (formEl && window.location.protocol.indexOf("http") === 0) {
      try {
        var formData = new FormData(formEl);
        if (!formData.get("form-name")) formData.set("form-name", formName);
        Object.keys(body).forEach(function (k) {
          if (body[k] !== undefined && body[k] !== null && typeof body[k] !== "object") {
            formData.set(k, String(body[k]));
          }
        });
        tasks.push(
          fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
          }).catch(function (err) {
            console.warn("[ACA Netlify form notice]", err.message);
          })
        );
      } catch (e) {
        console.warn("[ACA form encode]", e);
      }
    }

    // 2. Custom Webhook (Make / Zapier / Google Apps Script)
    var url = (CFG.endpoints || {})[type] || (CFG.endpoints || {}).lead;
    if (url) {
      tasks.push(
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }).then(function (r) {
          if (!r.ok) throw new Error("Submission failed: " + r.status);
          return r.json().catch(function () { return { ok: true }; });
        })
      );
    } else {
      console.info("[ACA] Lead saved locally and queued for Netlify. Payload:", body);
    }

    if (tasks.length === 0) {
      return Promise.resolve({ preview: true, body: body });
    }

    return Promise.all(tasks).then(function (results) {
      return results[0] || { ok: true };
    });
  };

  /* Red-flag / human-review routing (Reference Guide §25) */
  ACA.escalate = function (reason, detail) {
    ACA.track("escalation_flagged", { reason: reason });
    Store.write({ escalation_reason: reason, escalation_detail: detail || "" });
    var url = (CFG.endpoints || {}).escalation;
    if (!url) { console.warn("[ACA] Escalation (no endpoint):", reason, detail); return; }
    try {
      navigator.sendBeacon(url, new Blob(
        [JSON.stringify(Object.assign({ reason: reason, detail: detail }, Store.read()))],
        { type: "application/json" }
      ));
    } catch (e) { /* non-blocking by design */ }
  };

  /* ------------------------------------------------------------
     6. CONFIG → DOM
     Any element with data-aca="path.to.value" gets filled in, and
     data-aca-href="links.book" sets an href. Keeps copy and links
     in config.js only.
     ------------------------------------------------------------ */
  function dig(path) {
    return path.split(".").reduce(function (o, k) { return (o || {})[k]; }, CFG);
  }
  function hydrate(root) {
    (root || document).querySelectorAll("[data-aca]").forEach(function (el) {
      var v = dig(el.getAttribute("data-aca"));
      if (v != null) el.textContent = v;
    });
    (root || document).querySelectorAll("[data-aca-href]").forEach(function (el) {
      var v = dig(el.getAttribute("data-aca-href"));
      if (v) el.setAttribute("href", v);
    });
    (root || document).querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ------------------------------------------------------------
     7. UI BEHAVIOURS
     ------------------------------------------------------------ */
  function wireCtaTracking() {
    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-track]");
      if (!el) return;
      ACA.track(el.getAttribute("data-track"), {
        cta_label: (el.textContent || "").trim().slice(0, 60),
        cta_location: el.getAttribute("data-track-loc") || "unknown"
      });
    });
  }

  function wireStickyCta() {
    var bar = document.querySelector(".sticky-cta");
    if (!bar) return;
    var trigger = document.querySelector("[data-sticky-after]") || document.querySelector(".hero");
    if (!trigger) return;
    var io = new IntersectionObserver(function (entries) {
      bar.classList.toggle("is-visible", !entries[0].isIntersecting);
    }, { rootMargin: "-120px 0px 0px 0px" });
    io.observe(trigger);
  }

  function wireScrollDepth() {
    var marks = [25, 50, 75, 100], hit = {};
    var onScroll = throttle(function () {
      var h = document.documentElement;
      var pct = Math.round(((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100);
      marks.forEach(function (m) {
        if (pct >= m && !hit[m]) { hit[m] = true; ACA.track("scroll_depth", { depth: m }); }
      });
    }, 400);
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function throttle(fn, ms) {
    var last = 0, t;
    return function () {
      var now = Date.now(), args = arguments;
      if (now - last >= ms) { last = now; fn.apply(null, args); }
      else { clearTimeout(t); t = setTimeout(function () { last = Date.now(); fn.apply(null, args); }, ms); }
    };
  }

  /* Shared form helpers ---------------------------------------- */
  ACA.form = {
    validate: function (form) {
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var bad = input.type === "checkbox" ? !input.checked : !String(input.value).trim();
        if (!bad && input.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value);
        if (!bad && input.type === "tel") bad = String(input.value).replace(/\D/g, "").length < 7;
        input.setAttribute("aria-invalid", bad ? "true" : "false");
        var msg = input.closest(".field, .consent-field");
        var err = msg && msg.querySelector(".field-error");
        if (err) err.hidden = !bad;
        if (bad && ok) { input.focus(); ok = false; }
      });
      return ok;
    },
    serialize: function (form) {
      var out = {};
      new FormData(form).forEach(function (v, k) {
        if (out[k] === undefined) out[k] = v;
        else out[k] = [].concat(out[k], v);
      });
      form.querySelectorAll('input[type="checkbox"]').forEach(function (c) {
        if (c.name && !(c.name in out)) out[c.name] = false;
        else if (c.name && c.value === "on") out[c.name] = true;
      });
      return out;
    },
    busy: function (btn, on, busyLabel) {
      if (!btn) return;
      if (on) {
        btn.dataset.label = btn.textContent;
        btn.textContent = busyLabel || "One moment…";
        btn.setAttribute("aria-disabled", "true");
      } else {
        if (btn.dataset.label) btn.textContent = btn.dataset.label;
        btn.removeAttribute("aria-disabled");
      }
    }
  };

  /* ------------------------------------------------------------
     8. BOOT
     ------------------------------------------------------------ */
  function boot() {
    captureAttribution();
    loadAnalytics();
    hydrate();
    wireCtaTracking();
    wireStickyCta();
    wireScrollDepth();
    ACA.track("page_view", { title: document.title });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  ACA.hydrate = hydrate;
})();
