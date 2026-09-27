/* ============================================================
   ASK COACH AMANDA — "Why do I feel metabolically stuck?"
   Assessment engine.

   IMPORTANT (Reference Guide §18, §25):
   This assessment is EDUCATIONAL, NOT DIAGNOSTIC. It never names
   a condition, never interprets a lab value, and never tells
   anyone to change a medication. It surfaces which area is most
   likely worth attention first, and routes to a human when the
   answers say a human is needed.
   ============================================================ */
(function () {
  "use strict";

  var ACA = window.ACA = window.ACA || {};
  var CFG = ACA.config || {};

  /* ------------------------------------------------------------
     DIMENSIONS — the four "dot" areas we score
     ------------------------------------------------------------ */
  var DIMENSIONS = {
    fuel: {
      label: "Fuel &amp; blood sugar",
      max: 11,
      headline: "Your fuel pattern looks like the most useful place to start.",
      what: "The way your meals are built and spaced through the day is one of the strongest levers you have over hunger, cravings and afternoon energy. When meals are light on protein and fiber, or when the first real meal comes late, many people find their appetite and energy get harder to manage later in the day &mdash; and it can feel like a willpower problem when it may be a fuel problem.",
      look: [
        "What the first real meal of the day actually contains &mdash; and when it happens.",
        "Whether protein and fiber show up at every meal, not just at dinner.",
        "The gap between meals, and what tends to fill it.",
        "How you feel 90 minutes after eating &mdash; steady, or hunting for something else."
      ],
      first: "For one week, notice what you eat before 10&nbsp;a.m. and how you feel at 3&nbsp;p.m. Don't change anything yet. Just connect those two data points. Most people are surprised by the pattern."
    },
    recovery: {
      label: "Sleep, stress &amp; recovery",
      max: 8,
      headline: "Sleep and stress look like the most useful place to start.",
      what: "Sleep and stress aren't a separate category from nutrition &mdash; they shape it. After a short or broken night, or during a genuinely stressful stretch, hunger, cravings and the appeal of quick energy commonly shift. That's a physiological pattern many people experience, not a character flaw. Working on food while recovery is the actual constraint tends to be frustrating and slow.",
      look: [
        "How many hours you're actually asleep &mdash; not in bed.",
        "Whether you're waking during the night, and roughly when.",
        "What your evening looks like in the 90 minutes before bed.",
        "Which specific stressors reliably change how you eat."
      ],
      first: "Pick the easier of these two: a consistent wake time for seven days, or a fixed point in the evening when screens and work stop. One, not both. Changing recovery often makes the food work noticeably easier."
    },
    movement: {
      label: "Movement &amp; daily activity",
      max: 6,
      headline: "Daily movement looks like the most useful place to start.",
      what: "This isn't about a gym program. Everyday movement &mdash; how much you're upright, how often you break up long stretches of sitting, whether anything you do asks something of your muscles &mdash; is one factor that can influence energy, appetite signals and how your body handles a meal. It's also usually the easiest thing to add to a full schedule, because it doesn't need an hour.",
      look: [
        "How many hours of the workday you're genuinely seated without a break.",
        "Whether anything in your week is strength-based.",
        "What happens in the 20 minutes after your largest meal.",
        "Whether movement is currently something you schedule or something you hope for."
      ],
      first: "Attach a 10-minute walk to something that already happens every day &mdash; after lunch, after dinner, after the last call. Anchoring a new habit to an existing one is far more durable than relying on motivation."
    },
    consistency: {
      label: "Consistency &amp; real life",
      max: 14,
      headline: "Consistency &mdash; not knowledge &mdash; looks like the real constraint.",
      what: "Your answers suggest you already know a lot of the right things. The gap is between knowing and doing it repeatedly when a week gets hard. That's an extremely common place to be stuck, and it usually doesn't get solved by finding a better plan. It gets solved by building a smaller plan that survives travel, deadlines, family and a bad night's sleep &mdash; and by having a defined way back after an off day.",
      look: [
        "Which specific situations reliably break your routine.",
        "Whether one off day tends to become an off week.",
        "How many things you're currently trying to change at once.",
        "What your plan is for the weeks you already know will be hard."
      ],
      first: "Name your single most reliable derailer, then decide the one thing you'd keep doing anyway during it. Not the full routine &mdash; the one thing. That's the difference between a setback and starting over."
    }
  };

  /* Shown when nothing scores high enough to call a constraint.
     Matches the "health optimization / clarity" segment in §20 —
     she's doing a lot and wants to know if it's the right lot. */
  var NO_CLEAR_CONSTRAINT = {
    label: "No single obvious constraint",
    headline: "Nothing here stands out as an obvious constraint &mdash; which is its own useful answer.",
    what: "Based on what you told us, your fuel, recovery, movement and consistency patterns all look reasonably solid. That means the question worth asking isn't \"what am I doing wrong?\" &mdash; it's whether the right things are being done in the right order, and whether something outside these four areas deserves a look. That's a genuinely different conversation, and it's often the most interesting one.",
    look: [
      "Whether your results have plateaued despite the inputs staying good.",
      "What changed &mdash; and when &mdash; relative to what used to work.",
      "Anything you've been told to watch that hasn't been connected to your daily habits yet.",
      "Whether the effort you're spending is proportionate to what it's returning."
    ],
    first: "Write down the three healthy things you're most consistent about, and next to each one, what you believe it's doing for you. The gaps in that second column are usually where the useful conversation starts.",
    LOW: true
  };

  var LOW_THRESHOLD = 25; // percent

  var DIM_PRIORITY = ["fuel", "recovery", "movement", "consistency"];

  /* ------------------------------------------------------------
     QUESTIONS
     score: { dimension: points }
     ------------------------------------------------------------ */
  /* ------------------------------------------------------------
     QUESTIONS — The 10-Question Metabolic Health Scorecard
     Directly from Dr. Amanda's approved scorecard (Sept 2026)
     score: points (0 to 3) + dimension weights
     ------------------------------------------------------------ */
  var QUESTIONS = [
    {
      id: "q1_weight_waist",
      type: "single",
      numberLabel: "Scorecard Question 1 of 10",
      q: "1. Weight &amp; Waistline",
      help: "Despite trying to make healthier choices, I struggle to lose weight or inches &mdash; or notice that more of my weight seems to collect around my waist.",
      options: [
        { v: "0", t: "0 &mdash; Rarely / Never", score: { consistency: 0 }, points: 0 },
        { v: "1", t: "1 &mdash; Sometimes", score: { consistency: 1 }, points: 1 },
        { v: "2", t: "2 &mdash; Often", score: { consistency: 2 }, points: 2 },
        { v: "3", t: "3 &mdash; Very Often / Almost Always", score: { consistency: 3 }, points: 3 }
      ]
    },
    {
      id: "q2_hunger",
      type: "single",
      numberLabel: "Scorecard Question 2 of 10",
      q: "2. Hunger Between Meals",
      help: "I get hungry again soon after eating or find it difficult to comfortably go several hours between meals without needing a snack.",
      options: [
        { v: "0", t: "0 &mdash; Rarely / Never", score: { fuel: 0 }, points: 0 },
        { v: "1", t: "1 &mdash; Sometimes", score: { fuel: 1 }, points: 1 },
        { v: "2", t: "2 &mdash; Often", score: { fuel: 2 }, points: 2 },
        { v: "3", t: "3 &mdash; Very Often / Almost Always", score: { fuel: 3 }, points: 3 }
      ]
    },
    {
      id: "q3_cravings",
      type: "single",
      numberLabel: "Scorecard Question 3 of 10",
      q: "3. Sugar &amp; Carbohydrate Cravings",
      help: "I regularly crave sweets, bread, chips, pasta, or other carbohydrate-rich foods &mdash; especially later in the day or when I'm tired or stressed.",
      options: [
        { v: "0", t: "0 &mdash; Rarely / Never", score: { fuel: 0 }, points: 0 },
        { v: "1", t: "1 &mdash; Sometimes", score: { fuel: 1 }, points: 1 },
        { v: "2", t: "2 &mdash; Often", score: { fuel: 2 }, points: 2 },
        { v: "3", t: "3 &mdash; Very Often / Almost Always", score: { fuel: 3 }, points: 3 }
      ]
    },
    {
      id: "q4_energy",
      type: "single",
      numberLabel: "Scorecard Question 4 of 10",
      q: "4. Energy Stability",
      help: "My energy is inconsistent throughout the day &mdash; I experience afternoon crashes, feel tired after meals, or depend on caffeine or food for a quick energy boost.",
      options: [
        { v: "0", t: "0 &mdash; Rarely / Never", score: { fuel: 0, recovery: 0 }, points: 0 },
        { v: "1", t: "1 &mdash; Sometimes", score: { fuel: 1, recovery: 0 }, points: 1 },
        { v: "2", t: "2 &mdash; Often", score: { fuel: 2, recovery: 1 }, points: 2 },
        { v: "3", t: "3 &mdash; Very Often / Almost Always", score: { fuel: 3, recovery: 1 }, points: 3 }
      ]
    },
    {
      id: "q5_markers",
      type: "single",
      numberLabel: "Scorecard Question 5 of 10",
      q: "5. Blood Sugar &amp; Metabolic Markers",
      help: "I've been told that one or more health markers &mdash; such as blood sugar, A1C, triglycerides, cholesterol, blood pressure, or waist circumference &mdash; could use improvement.",
      options: [
        { v: "0", t: "0 &mdash; No / Not that I'm aware of", score: { fuel: 0 }, points: 0 },
        { v: "1", t: "1 &mdash; I've been told to keep an eye on something", score: { fuel: 1 }, points: 1 },
        { v: "2", t: "2 &mdash; Yes, one or more markers have been a concern", score: { fuel: 2 }, points: 2 },
        { v: "3", t: "3 &mdash; Yes, this is something I'm actively trying to improve", score: { fuel: 3 }, points: 3 }
      ]
    },
    {
      id: "q6_post_meal",
      type: "single",
      numberLabel: "Scorecard Question 6 of 10",
      q: "6. How You Feel After Eating",
      help: "After some meals, I feel overly full, sluggish, sleepy, or like I need something sweet shortly afterward rather than feeling comfortably satisfied and energized.",
      options: [
        { v: "0", t: "0 &mdash; Rarely / Never", score: { fuel: 0 }, points: 0 },
        { v: "1", t: "1 &mdash; Sometimes", score: { fuel: 1 }, points: 1 },
        { v: "2", t: "2 &mdash; Often", score: { fuel: 2 }, points: 2 },
        { v: "3", t: "3 &mdash; Very Often / Almost Always", score: { fuel: 3 }, points: 3 }
      ]
    },
    {
      id: "q7_sleep",
      type: "single",
      numberLabel: "Scorecard Question 7 of 10",
      q: "7. Sleep &amp; Recovery",
      help: "I regularly get less sleep than I need, wake up feeling unrefreshed, or notice that poor sleep makes my hunger, cravings, energy, or food choices harder to manage the next day.",
      options: [
        { v: "0", t: "0 &mdash; Rarely / Never", score: { recovery: 0 }, points: 0 },
        { v: "1", t: "1 &mdash; Sometimes", score: { recovery: 1 }, points: 1 },
        { v: "2", t: "2 &mdash; Often", score: { recovery: 2 }, points: 2 },
        { v: "3", t: "3 &mdash; Very Often / Almost Always", score: { recovery: 3 }, points: 3 }
      ]
    },
    {
      id: "q8_movement",
      type: "single",
      numberLabel: "Scorecard Question 8 of 10",
      q: "8. Movement &amp; Sedentary Time",
      help: "I spend long periods sitting during the day and don't consistently incorporate movement &mdash; especially walking or other activity around or after meals.",
      options: [
        { v: "0", t: "0 &mdash; Rarely / Never", score: { movement: 0 }, points: 0 },
        { v: "1", t: "1 &mdash; Sometimes", score: { movement: 1 }, points: 1 },
        { v: "2", t: "2 &mdash; Often", score: { movement: 2 }, points: 2 },
        { v: "3", t: "3 &mdash; Very Often / Almost Always", score: { movement: 3 }, points: 3 }
      ]
    },
    {
      id: "q9_stress",
      type: "single",
      numberLabel: "Scorecard Question 9 of 10",
      q: "9. Stress &amp; Metabolic Health",
      help: "When I'm stressed, overwhelmed, or exhausted, it becomes noticeably harder to manage my eating, cravings, sleep, movement, or other healthy routines.",
      options: [
        { v: "0", t: "0 &mdash; Rarely / Never", score: { recovery: 0 }, points: 0 },
        { v: "1", t: "1 &mdash; Sometimes", score: { recovery: 1 }, points: 1 },
        { v: "2", t: "2 &mdash; Often", score: { recovery: 2 }, points: 2 },
        { v: "3", t: "3 &mdash; Very Often / Almost Always", score: { recovery: 3 }, points: 3 }
      ]
    },
    {
      id: "q10_piecing_together",
      type: "single",
      numberLabel: "Scorecard Question 10 of 10",
      q: "10. The \"I've Tried Everything\" Question",
      help: "I've tried different diets, eating plans, supplements, exercise routines, fasting, or other health strategies &mdash; but I still feel like I'm piecing things together and don't know what my body actually needs.",
      options: [
        { v: "0", t: "0 &mdash; Not like me", score: { consistency: 0 }, points: 0 },
        { v: "1", t: "1 &mdash; A little like me", score: { consistency: 1 }, points: 1 },
        { v: "2", t: "2 &mdash; Definitely like me", score: { consistency: 2 }, points: 2 },
        { v: "3", t: "3 &mdash; This describes me extremely well", score: { consistency: 3 }, points: 3 }
      ]
    },
    {
      id: "age_band",
      type: "single",
      numberLabel: "Profile Context",
      q: "Which age range are you in?",
      help: "This program is specifically designed around metabolic shifts that occur for women in their 40s, 50s, and 60s.",
      options: [
        { v: "under_40", t: "Under 40" },
        { v: "40_49",    t: "40&ndash;49" },
        { v: "50_59",    t: "50&ndash;59" },
        { v: "60_69",    t: "60&ndash;69" },
        { v: "70_plus",  t: "70 or older" }
      ]
    },
    {
      id: "context",
      type: "multi",
      numberLabel: "Clinical Context",
      q: "Which of these are true for you right now?",
      help: "Select everything that applies. This helps Dr. Amanda understand your clinical background.",
      options: [
        { v: "on_medication",       t: "I take one or more prescription medications" },
        { v: "supplement_question", t: "I take supplements and I'm not sure I need all of them" },
        { v: "marker_flagged",      t: "A provider has told me a metabolic marker needs attention", s: "A1C, blood sugar, cholesterol, triglycerides, blood pressure." },
        { v: "none",                t: "None of these", exclusive: true }
      ]
    },
    {
      id: "readiness",
      type: "single",
      numberLabel: "Coaching Readiness",
      q: "How ready are you to work on your metabolic health over the next 90 days?",
      help: "Be candid &mdash; every answer is valid and helps us customize your next step.",
      options: [
        { v: "ready",   t: "Ready now &mdash; I want a personalized plan and accountability" },
        { v: "curious", t: "Interested, but I want to explore what's involved first" },
        { v: "later",   t: "Gathering information for down the road" }
      ]
    },
    {
      id: "safety",
      type: "single",
      numberLabel: "Health Check",
      q: "Are you currently experiencing new or concerning symptoms you haven't discussed with a healthcare provider?",
      help: "Coaching is health education, not medical care. This question ensures your safety.",
      options: [
        { v: "no",  t: "No" },
        { v: "yes", t: "Yes &mdash; there's something I haven't raised with my doctor yet" }
      ]
    }
  ];


  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */
  var state = { i: 0, answers: {}, scores: { fuel: 0, recovery: 0, movement: 0, consistency: 0 } };
  var previewMode = false;

  var el = {};
  function $(id) { return document.getElementById(id); }

  /* ------------------------------------------------------------
     RENDER — question
     ------------------------------------------------------------ */
  function renderQuestion() {
    var q = QUESTIONS[state.i];
    var chosen = state.answers[q.id];

    el.progressNow.textContent = state.i < 10 ? "Scorecard Question " + (state.i + 1) + " of 10" : "Profile Step " + (state.i - 9) + " of 4";
    el.progressPct.textContent = Math.round((state.i / QUESTIONS.length) * 100) + "%";
    el.progressBar.style.width = Math.max((state.i / QUESTIONS.length) * 100, 2.5) + "%";

    el.qText.innerHTML = q.q;
    el.qHelp.innerHTML = q.help || "";
    el.qHelp.hidden = !q.help;

    el.choices.innerHTML = "";
    el.choices.setAttribute("role", q.type === "multi" ? "group" : "radiogroup");

    q.options.forEach(function (opt) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "choice" + (q.type === "multi" ? " choice--multi" : "");
      b.setAttribute("aria-pressed", isChosen(chosen, opt.v, q.type) ? "true" : "false");
      b.dataset.value = opt.v;
      b.innerHTML =
        '<span class="choice__box" aria-hidden="true"></span>' +
        '<span class="choice__text">' + opt.t +
        (opt.s ? '<span class="choice__sub">' + opt.s + "</span>" : "") +
        "</span>";
      b.addEventListener("click", function () { choose(q, opt, b); });
      el.choices.appendChild(b);
    });

    el.back.hidden = state.i === 0;
    el.next.hidden = q.type !== "multi";
    // :has() handles this in CSS; set it explicitly for older engines too
    el.next.parentNode.hidden = el.back.hidden && el.next.hidden;
    el.next.setAttribute("aria-disabled", (chosen && chosen.length) ? "false" : "true");
    el.qText.focus();
  }

  function isChosen(chosen, v, type) {
    return type === "multi" ? Array.isArray(chosen) && chosen.indexOf(v) > -1 : chosen === v;
  }

  function choose(q, opt, btn) {
    if (q.type === "multi") {
      var cur = state.answers[q.id] || [];
      var exclusive = q.options.filter(function (o) { return o.exclusive; }).map(function (o) { return o.v; });

      if (opt.exclusive) {
        cur = cur.indexOf(opt.v) > -1 ? [] : [opt.v];
      } else {
        cur = cur.filter(function (v) { return exclusive.indexOf(v) === -1; });
        cur = cur.indexOf(opt.v) > -1
          ? cur.filter(function (v) { return v !== opt.v; })
          : cur.concat(opt.v);
      }
      state.answers[q.id] = cur;

      [].forEach.call(el.choices.children, function (c) {
        c.setAttribute("aria-pressed", cur.indexOf(c.dataset.value) > -1 ? "true" : "false");
      });
      el.next.setAttribute("aria-disabled", cur.length ? "false" : "true");
      return;
    }

    state.answers[q.id] = opt.v;
    btn.setAttribute("aria-pressed", "true");
    [].forEach.call(el.choices.children, function (c) {
      if (c !== btn) c.setAttribute("aria-pressed", "false");
    });
    setTimeout(advance, 220);
  }

  function advance() {
    if (state.i === 0) ACA.track("assessment_start", {});
    if (state.i < QUESTIONS.length - 1) {
      state.i++;
      renderQuestion();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      finishQuestions();
    }
  }

  function back() {
    if (state.i > 0) { state.i--; renderQuestion(); }
  }

  /* ------------------------------------------------------------
     SCORING TIERS — The 4 Metabolic Momentum Tiers (from Word doc)
     ------------------------------------------------------------ */
  var TIERS = [
    {
      min: 0, max: 7,
      badgeClass: "score-tier-badge--green",
      badgeLabel: "🟢 0–7: Strong Metabolic Foundations",
      headline: "Many of your current patterns appear supportive of metabolic health.",
      summary: "You may already have several strong foundations in place. Your opportunity is less about overhauling everything and more about identifying smaller, strategic areas where you can optimize and protect the progress you've made."
    },
    {
      min: 8, max: 15,
      badgeClass: "score-tier-badge--yellow",
      badgeLabel: "🟡 8–15: Some Metabolic Clues Are Showing Up",
      headline: "Your answers suggest there are several areas worth paying closer attention to.",
      summary: "You may be noticing changes in energy, hunger, cravings, waistline, sleep, or health markers even though you're already trying to make healthier choices. This is a good time to get curious about which patterns are connected rather than simply trying harder."
    },
    {
      min: 16, max: 22,
      badgeClass: "score-tier-badge--orange",
      badgeLabel: "🟠 16–22: Your Metabolic Health Deserves Attention",
      headline: "Several patterns suggest your body may not be managing energy as efficiently or consistently as you'd like.",
      summary: "This doesn't mean something is 'wrong' with you. It does mean there are meaningful opportunities to improve how nutrition, movement, sleep, stress, and lifestyle factors work together. Instead of adding another random diet or tip, this is the time to identify which changes matter most for you."
    },
    {
      min: 23, max: 30,
      badgeClass: "score-tier-badge--red",
      badgeLabel: "🔴 23–30: It's Time to Connect the Dots",
      headline: "Metabolic-health challenges are showing up across several connected areas of your life.",
      summary: "You may be experiencing the combination of stubborn weight or waist changes, cravings, unstable energy, health-marker concerns, sleep challenges, or difficulty finding an approach that actually sticks. More effort isn't the answer — a personalized strategy is."
    }
  ];

  /* ------------------------------------------------------------
     SCORING
     ------------------------------------------------------------ */
  function computeScores() {
    var s = { fuel: 0, recovery: 0, movement: 0, consistency: 0 };
    var totalPoints = 0;

    QUESTIONS.forEach(function (q) {
      var a = state.answers[q.id];
      if (a == null) return;
      var picked = q.type === "multi" ? a : [a];
      picked.forEach(function (v) {
        var opt = q.options.filter(function (o) { return o.v === v; })[0];
        if (opt) {
          if (typeof opt.points === "number") totalPoints += opt.points;
          if (opt.score) {
            Object.keys(opt.score).forEach(function (k) { s[k] += opt.score[k]; });
          }
        }
      });
    });

    state.scores = s;
    state.totalScore = totalPoints;

    // Determine Tier
    var matchedTier = TIERS[0];
    for (var t = 0; t < TIERS.length; t++) {
      if (totalPoints >= TIERS[t].min && totalPoints <= TIERS[t].max) {
        matchedTier = TIERS[t];
        break;
      }
    }
    state.tier = matchedTier;

    // Normalised 0–100 so the four bars are comparable
    var pct = {};
    DIM_PRIORITY.forEach(function (k) {
      pct[k] = Math.min(Math.round((s[k] / DIMENSIONS[k].max) * 100), 100);
    });
    state.percents = pct;

    var ranked = DIM_PRIORITY.slice().sort(function (a, b) {
      if (pct[b] !== pct[a]) return pct[b] - pct[a];
      return DIM_PRIORITY.indexOf(a) - DIM_PRIORITY.indexOf(b);
    });
    state.primary = ranked[0];
    state.secondary = ranked[1];
    return state;
  }

  function routing() {
    var a = state.answers;
    var redFlag = a.safety === "yes";
    var ctx = a.context || [];
    var inBand = ["40_49", "50_59", "60_69"].indexOf(a.age_band) > -1;

    var route;
    if (redFlag) route = "human";                       // talk to a person first
    else if (a.readiness === "ready") route = "apply";
    else if (a.readiness === "curious") route = "call";
    else route = "nurture";

    return {
      route: route,
      red_flag: redFlag,
      age_in_band: inBand,
      on_medication: ctx.indexOf("on_medication") > -1,
      supplement_question: ctx.indexOf("supplement_question") > -1,
      marker_flagged: ctx.indexOf("marker_flagged") > -1
    };
  }

  /* ------------------------------------------------------------
     EMAIL GATE
     ------------------------------------------------------------ */
  function finishQuestions() {
    computeScores();
    var r = routing();

    ACA.store.write({
      total_score: state.totalScore,
      score_tier: state.tier.badgeLabel,
      age_band: state.answers.age_band,
      readiness: state.answers.readiness,
      assessment_answers: state.answers,
      assessment_scores: state.scores,
      assessment_percents: state.percents,
      opportunity_primary: state.primary,
      opportunity_secondary: state.secondary,
      route: r.route,
      red_flag: r.red_flag,
      age_in_band: r.age_in_band,
      on_medication: r.on_medication,
      supplement_question: r.supplement_question,
      marker_flagged: r.marker_flagged,
      assessment_completed_at: new Date().toISOString()
    });

    ACA.track("assessment_questions_complete", {
      total_score: state.totalScore,
      opportunity_primary: state.primary,
      route: r.route
    });

    el.progressNow.textContent = "Almost there";
    el.progressPct.textContent = "100%";
    el.progressBar.style.width = "100%";

    el.stepQuestions.hidden = true;
    el.stepGate.hidden = false;
    $("gate-preview").innerHTML = state.tier.badgeLabel;
    window.scrollTo({ top: 0, behavior: "smooth" });
    $("lead-first").focus();
  }

  function submitGate(e) {
    e.preventDefault();
    var form = e.target;
    if (!ACA.form.validate(form)) return;

    var btn = form.querySelector("button[type=submit]");
    ACA.form.busy(btn, true, "Building your scorecard results…");

    // Populate Netlify hidden inputs
    if (document.getElementById("f-total-score")) document.getElementById("f-total-score").value = state.totalScore;
    if (document.getElementById("f-score-tier")) document.getElementById("f-score-tier").value = state.tier.badgeLabel;
    if (document.getElementById("f-primary-concern") && state.primary) document.getElementById("f-primary-concern").value = (DIMENSIONS[state.primary] || {}).title || "";
    if (document.getElementById("f-secondary-concern") && state.secondary) document.getElementById("f-secondary-concern").value = (DIMENSIONS[state.secondary] || {}).title || "";
    if (document.getElementById("f-red-flag")) document.getElementById("f-red-flag").value = state.redFlag ? "yes" : "no";
    if (document.getElementById("f-lead-source")) document.getElementById("f-lead-source").value = (ACA.store.read() || {}).lead_source || "direct";

    var fields = ACA.form.serialize(form);
    var payload = {
      first_name: fields.first_name,
      last_name: fields.last_name || "",
      email: fields.email,
      phone: fields.phone || "",
      total_score: state.totalScore,
      score_tier: state.tier.badgeLabel,
      primary_concern: (DIMENSIONS[state.primary] || {}).title || "",
      secondary_concern: (DIMENSIONS[state.secondary] || {}).title || "",
      red_flag: !!state.redFlag,
      consent: !!fields.consent,
      consent_at: new Date().toISOString()
    };

    ACA.track("lead_captured", { source_step: "assessment_gate", total_score: state.totalScore });

    ACA.submit("assessment", payload)
      .catch(function (err) { console.error("[ACA] assessment submit failed", err); })
      .then(function () {
        ACA.form.busy(btn, false);
        showResults();
      });
  }

  /* ------------------------------------------------------------
     RESULTS
     ------------------------------------------------------------ */
  function showResults() {
    var r = routing();
    var lead = ACA.store.read();
    var lowSignal = state.totalScore <= 7;
    var primary = DIMENSIONS[state.primary];
    var secondary = DIMENSIONS[state.secondary];

    el.stepGate.hidden = true;
    el.stepResults.hidden = false;
    el.progressWrap.hidden = true;
    if (el.intro) el.intro.hidden = true;

    $("r-name").textContent = lead.first_name ? lead.first_name + ", here is your scorecard analysis" : "Here is your scorecard analysis";

    // Score and Tier
    if ($("r-total-score")) $("r-total-score").textContent = state.totalScore + " / 30";
    if ($("r-tier-badge")) {
      $("r-tier-badge").className = "score-tier-badge " + state.tier.badgeClass;
      $("r-tier-badge").textContent = state.tier.badgeLabel;
    }

    $("r-headline").innerHTML = state.tier.headline;
    $("r-what").innerHTML = state.tier.summary + "<br><br><strong>Primary Constraint:</strong> " + primary.what;

    var lookList = $("r-look");
    lookList.innerHTML = "";
    primary.look.forEach(function (t) {
      var li = document.createElement("li");
      li.innerHTML = t;
      lookList.appendChild(li);
    });

    $("r-first").innerHTML = primary.first;
    var secondBlock = $("r-second-block");
    if (lowSignal) {
      secondBlock.hidden = true;
    } else {
      secondBlock.hidden = false;
      $("r-second-label").innerHTML = secondary.label;
      $("r-second-text").innerHTML = secondary.what.split(". ").slice(0, 2).join(". ") + ".";
    }

    // Score bars
    var bars = $("r-bars");
    bars.innerHTML = "";
    DIM_PRIORITY.forEach(function (k) {
      var pct = state.percents[k];
      var row = document.createElement("div");
      row.className = "score-row";
      row.innerHTML =
        '<div class="score-label">' + DIMENSIONS[k].label + "</div>" +
        '<div class="score-track"><div class="score-fill' + (k === state.primary ? " score-fill--top" : "") + '"></div></div>' +
        '<div class="score-val">' + pct + "%</div>";
      bars.appendChild(row);
      requestAnimationFrame(function () {
        row.querySelector(".score-fill").style.width = Math.max(pct, 4) + "%";
      });
    });


    // Context notes
    var notes = $("r-notes");
    notes.innerHTML = "";
    if (r.on_medication || r.supplement_question) {
      notes.insertAdjacentHTML("beforeend",
        '<div class="note mt5"><strong>You mentioned medications or supplements.</strong> That&rsquo;s exactly the kind of thing a pharmacist&rsquo;s perspective is useful for &mdash; understanding what you take, whether a supplement has a reasonable purpose for you, and what&rsquo;s worth asking at your next appointment. Any actual medication change stays between you and your prescriber.</div>');
    }
    if (r.marker_flagged) {
      notes.insertAdjacentHTML("beforeend",
        '<div class="note mt5"><strong>A marker has been flagged for you.</strong> Keep working with the provider who raised it. Coaching focuses on the daily factors you can influence alongside their care &mdash; it doesn&rsquo;t interpret or manage lab results.</div>');
    }
    if (!r.age_in_band) {
      notes.insertAdjacentHTML("beforeend",
        '<div class="note mt5">This program is built around what tends to change for women roughly 40&ndash;65. That doesn&rsquo;t rule you out &mdash; it just means the strategy call should confirm it&rsquo;s the right fit before anything else.</div>');
    }

    // Safety escalation
    if (r.red_flag) {
      $("r-alert").hidden = false;
      if (!previewMode) {
        ACA.escalate("self_reported_new_symptoms", "Assessment safety question answered 'yes'.");
      }
    }

    renderCta(r);

    ACA.store.write({ no_clear_constraint: lowSignal });

    if (!previewMode) ACA.track("assessment_complete", {
      no_clear_constraint: lowSignal,
      opportunity_primary: state.primary,
      opportunity_secondary: state.secondary,
      route: r.route,
      score_fuel: state.percents.fuel,
      score_recovery: state.percents.recovery,
      score_movement: state.percents.movement,
      score_consistency: state.percents.consistency
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderCta(r) {
    var box = $("r-cta");
    var L = (CFG.links || {});
    var html;

    if (r.red_flag) {
      html =
        "<h3>Let&rsquo;s talk before anything else</h3>" +
        "<p>Because of what you flagged above, the right next step is a conversation rather than an application. Book a complimentary call and Amanda will help you figure out what belongs with your healthcare provider and what coaching can genuinely support.</p>" +
        '<a class="btn btn--primary btn--lg" href="' + L.book + '" data-track="cta_click" data-track-loc="results-human">Book a complimentary call</a>';
    } else if (r.route === "apply") {
      html =
        "<h3>You said you&rsquo;re ready. Here&rsquo;s the next step.</h3>" +
        "<p>The Metabolic Momentum Method&trade; is a 90-day program and Amanda takes a limited number of clients at a time, so it starts with a short application &mdash; about four minutes &mdash; followed by a strategy call to confirm it&rsquo;s a genuine fit.</p>" +
        '<a class="btn btn--primary btn--lg" href="' + L.apply + '" data-track="cta_click" data-track-loc="results-apply">Apply for the program</a>' +
        '<p class="cta-note" style="justify-content:center">Applying doesn&rsquo;t commit you to anything. No payment is taken before the call.</p>';
    } else if (r.route === "call") {
      html =
        "<h3>Want to understand what this would actually look like?</h3>" +
        "<p>That&rsquo;s what the complimentary strategy call is for. Twenty minutes, no pitch &mdash; Amanda reviews your results with you, answers what you want to ask, and tells you honestly whether coaching is the right move right now.</p>" +
        '<a class="btn btn--primary btn--lg" href="' + L.book + '" data-track="cta_click" data-track-loc="results-call">Book a complimentary call</a>' +
        '<p class="cta-note" style="justify-content:center">Or <a href="' + L.apply + '">skip ahead to the application</a> if you already know.</p>';
    } else {
      html =
        "<h3>No pressure &mdash; take what&rsquo;s useful</h3>" +
        "<p>You said you&rsquo;re gathering information, so that&rsquo;s what we&rsquo;ll send: short, practical emails about the area your results pointed to. No sequence of sales pressure. When you&rsquo;re ready for a conversation, the door is open.</p>" +
        '<a class="btn btn--primary" href="' + L.book + '" data-track="cta_click" data-track-loc="results-nurture">Book a call when you\'re ready</a>' +
        '<p class="cta-note" style="justify-content:center">Your results are on their way to your inbox too.</p>';
    }

    box.innerHTML = html;
  }

  /* ------------------------------------------------------------
     BOOT
     ------------------------------------------------------------ */
  /* ------------------------------------------------------------
     PREVIEW MODE  —  ?preview=fuel|recovery|movement|consistency|none|flag
     Jumps straight to a rendered results screen with sample answers so
     Amanda (and QA) can review every variant without retaking the quiz.
     Nothing is submitted and no tracking conversion is counted.
     ------------------------------------------------------------ */
  var PREVIEW_ANSWERS = {
    fuel:        { breakfast:"skip", afternoon:"crash", satiety:"lt2", sleep:"rested", stress_eating:"steady", movement:"strength", post_meal:"usually", derailers:[], when_stalls:"adjust" },
    recovery:    { breakfast:"protein", afternoon:"steady", satiety:"gt4", sleep:"broken", stress_eating:"more", movement:"cardio", post_meal:"sometimes", derailers:["work"], when_stalls:"adjust" },
    movement:    { breakfast:"protein", afternoon:"steady", satiety:"gt4", sleep:"rested", stress_eating:"steady", movement:"seated", post_meal:"never", derailers:[], when_stalls:"adjust" },
    consistency: { breakfast:"unsure", afternoon:"mixed", satiety:"3_4", sleep:"tired", stress_eating:"unsure", movement:"cardio", post_meal:"sometimes", derailers:["work","travel","social","allnone","fade"], when_stalls:"restart" },
    none:        { breakfast:"protein", afternoon:"steady", satiety:"gt4", sleep:"rested", stress_eating:"steady", movement:"strength", post_meal:"usually", derailers:[], when_stalls:"adjust" }
  };

  function runPreview(which) {
    previewMode = true;
    var flag = which === "flag";
    var key = flag ? "recovery" : (PREVIEW_ANSWERS[which] ? which : "fuel");
    state.answers = Object.assign({
      primary_concern: "weight_waist",
      age_band: "50_59",
      readiness: flag ? "ready" : "ready",
      context: ["on_medication"],
      safety: flag ? "yes" : "no"
    }, PREVIEW_ANSWERS[key]);

    computeScores();
    ACA.store.write({ first_name: "Preview", assessment_answers: state.answers });
    el.progressWrap.hidden = true;
    el.stepQuestions.hidden = true;
    el.stepGate.hidden = true;
    showResults();

    var banner = document.createElement("div");
    banner.className = "note note--gold";
    banner.style.margin = "0 0 24px";
    banner.innerHTML = "<strong>Preview mode &mdash; sample answers, nothing submitted.</strong> " +
      'Variants: <a href="?preview=fuel">fuel</a> &middot; <a href="?preview=recovery">recovery</a> &middot; ' +
      '<a href="?preview=movement">movement</a> &middot; <a href="?preview=consistency">consistency</a> &middot; ' +
      '<a href="?preview=none">no clear constraint</a> &middot; <a href="?preview=flag">safety flag</a> &middot; ' +
      '<a href="assessment.html">take it properly</a>';
    el.stepResults.insertBefore(banner, el.stepResults.firstChild);
  }

  function boot() {
    el = {
      intro: $("quiz-intro"),
      progressWrap: $("progress-wrap"),
      progressNow: $("progress-now"),
      progressPct: $("progress-pct"),
      progressBar: $("progress-bar"),
      stepQuestions: $("step-questions"),
      stepGate: $("step-gate"),
      stepResults: $("step-results"),
      qText: $("q-text"),
      qHelp: $("q-help"),
      choices: $("q-choices"),
      back: $("q-back"),
      next: $("q-next")
    };
    if (!el.stepQuestions) return;

    el.back.addEventListener("click", back);
    el.next.addEventListener("click", function () {
      if (el.next.getAttribute("aria-disabled") === "true") return;
      advance();
    });
    $("gate-form").addEventListener("submit", submitGate);

    var preview = new URLSearchParams(location.search).get("preview");
    if (preview) { runPreview(preview); return; }

    renderQuestion();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  ACA.assessment = { QUESTIONS: QUESTIONS, DIMENSIONS: DIMENSIONS, state: state };
})();
