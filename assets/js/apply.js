/* ============================================================
   ASK COACH AMANDA — Coaching application
   Prefill · custom radio groups · suitability scoring · routing

   Suitability here is a SIGNAL, not a decision. Per Reference
   Guide §21: "Automation may identify obvious fit factors, but
   nuanced coaching suitability should remain a human judgment."
   Nobody is auto-rejected. Low scores are flagged for Amanda and
   still get a conversation.
   ============================================================ */
(function () {
  "use strict";

  var ACA = window.ACA = window.ACA || {};
  var CFG = ACA.config || {};

  /* ------------------------------------------------------------
     PREFILL — never make her retype what she already gave us
     ------------------------------------------------------------ */
  function prefill(form) {
    var lead = ACA.store.read();
    [["first_name", lead.first_name], ["last_name", lead.last_name],
     ["email", lead.email], ["phone", lead.phone]].forEach(function (pair) {
      var input = form.elements[pair[0]];
      if (input && pair[1]) input.value = pair[1];
    });

    if (lead.assessment_completed_at) {
      var banner = document.createElement("div");
      banner.className = "note";
      banner.style.marginBottom = "var(--s6)";
      banner.innerHTML = "<strong>Your assessment is attached to this application.</strong> " +
        "Amanda will see your results before the call, so you don&rsquo;t need to repeat any of it here.";
      form.parentNode.insertBefore(banner, form);
    }
  }

  /* ------------------------------------------------------------
     RADIO GROUPS built from buttons (accessible + on-brand)
     ------------------------------------------------------------ */
  var radios = {};

  function wireRadios(root) {
    root.querySelectorAll("[data-radio]").forEach(function (group) {
      var name = group.getAttribute("data-radio");
      group.querySelectorAll(".choice").forEach(function (btn) {
        btn.addEventListener("click", function () {
          radios[name] = btn.dataset.value;
          group.querySelectorAll(".choice").forEach(function (b) {
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
          });
          var err = group.parentNode.querySelector(".field-error");
          if (err) err.hidden = true;
        });
        btn.addEventListener("keydown", function (e) {
          if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
          e.preventDefault();
          var all = [].slice.call(group.querySelectorAll(".choice"));
          var i = all.indexOf(btn) + (e.key === "ArrowDown" ? 1 : -1);
          (all[(i + all.length) % all.length]).focus();
        });
      });
    });
  }

  function validateRadios(root) {
    var ok = true;
    root.querySelectorAll("[data-radio]").forEach(function (group) {
      var name = group.getAttribute("data-radio");
      var err = group.parentNode.querySelector(".field-error");
      var missing = !radios[name];
      if (err) err.hidden = !missing;
      if (missing && ok) {
        group.querySelector(".choice").focus();
        ok = false;
      }
    });
    return ok;
  }

  /* ------------------------------------------------------------
     SUITABILITY SIGNAL
     ------------------------------------------------------------ */
  function suitability(lead) {
    var pts = 0;
    var flags = [];

    if (radios.time_commitment === "yes") pts += 3;
    else if (radios.time_commitment === "tight") pts += 1;
    else flags.push("cannot_protect_time");

    if (radios.investment === "full") pts += 3;
    else if (radios.investment === "plan") pts += 2;
    else if (radios.investment === "unsure") pts += 1;
    else flags.push("investment_not_now");

    if (radios.expectations === "sustainable") pts += 3;
    else if (radios.expectations === "both") pts += 2;
    else flags.push("wants_fast_weight_loss");

    if (radios.care_team === "yes") pts += 2;
    else if (radios.care_team === "occasionally") pts += 1;
    else flags.push("no_current_provider");

    if (lead.readiness === "ready") pts += 2;
    if (lead.age_in_band) pts += 1;
    if (lead.red_flag) flags.push("self_reported_symptoms");

    var status = pts >= 11 ? "strong_fit" : pts >= 7 ? "likely_fit" : "needs_review";
    if (flags.indexOf("self_reported_symptoms") > -1) status = "needs_review";

    return { score: pts, max: 14, status: status, flags: flags };
  }

  /* ------------------------------------------------------------
     SUBMIT
     ------------------------------------------------------------ */
  function submit(e) {
    e.preventDefault();
    var form = e.target;
    var okFields = ACA.form.validate(form);
    var okRadios = validateRadios(form);
    if (!okFields || !okRadios) return;

    var btn = form.querySelector("button[type=submit]");
    ACA.form.busy(btn, true, "Sending your application…");

    var fields = ACA.form.serialize(form);
    var lead = ACA.store.read();
    if (document.getElementById("a-hidden-score")) document.getElementById("a-hidden-score").value = lead.total_score || "";
    if (document.getElementById("a-hidden-tier")) document.getElementById("a-hidden-tier").value = lead.score_tier || "";
    if (document.getElementById("a-hidden-concern")) document.getElementById("a-hidden-concern").value = lead.primary_concern || "";
    if (document.getElementById("a-hidden-source")) document.getElementById("a-hidden-source").value = lead.lead_source || "direct";

    var fit = suitability(Object.assign({}, lead, radios));

    var payload = Object.assign({}, fields, radios, {
      application_submitted_at: new Date().toISOString(),
      suitability_score: fit.score,
      suitability_max: fit.max,
      suitability_status: fit.status,
      suitability_flags: fit.flags,
      application_status: "submitted",
      offer_discussed: (CFG.offer || {}).name
    });

    ACA.track("application_submit", {
      suitability_status: fit.status,
      suitability_score: fit.score,
      investment: radios.investment,
      time_commitment: radios.time_commitment
    });

    if (fit.flags.length) {
      ACA.escalate("application_flags", fit.flags.join(", "));
    }

    ACA.submit("application", payload)
      .catch(function (err) { console.error("[ACA] application submit failed", err); })
      .then(function () {
        location.href = (CFG.links || {}).book || "book.html";
      });
  }

  /* ------------------------------------------------------------
     BOOT
     ------------------------------------------------------------ */
  function boot() {
    var form = document.getElementById("apply-form");
    if (!form) return;
    prefill(form);
    wireRadios(form);
    form.addEventListener("submit", submit);
    ACA.track("application_view", {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
