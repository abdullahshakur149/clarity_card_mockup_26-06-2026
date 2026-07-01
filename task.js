/* ============================================================================
   CLARITY — LAUNCHPAD (GAMIFIED VERSION)  ·  WEEK PLAN / TASK BOARD
   ----------------------------------------------------------------------------
   Owner   : Abdullah (gamified version)
   Parallel: Sajood (traditional version) — same journey, different feel
   Source  : Zay's direction call + Owais's "zero traditional forms" mandate
   Date    : 2026-06-30   (review with Zay tomorrow on Onboarding + Intelligence)

   This file is the living plan. It is NOT shipped code — it's the task board the
   team can read. Status values: 'todo' | 'doing' | 'review' | 'done' | 'blocked'.
   ========================================================================== */

window.ClarityTasks = (function () {

  /* ──────────────────────────────────────────────────────────────────────
     DIRECTION & GUARDRAILS  (the rules every task must respect)
     ────────────────────────────────────────────────────────────────────── */
  const DIRECTION = {
    scope: 'Launchpad ONLY. Enterprise is fully out of scope.',
    repo:  'No work in the real Clarity repo this week. Mockup only. Write code ' +
           'ONLY where static HTML cannot deliver dynamic data, transitions, or ' +
           'interactivity. Nothing merges to Clarity until the full flow is approved.',
    build: 'Build into the ROOT app (working copy of v2). v1 = old, v2 = reference.',
    theme: 'Keep the existing gamified colour theme (cream / ember / token system).',
    api:   'Mock ALL API outputs — no real API calls. Report structure mirrors the ' +
           'rolled-back Lovable version Zay restores.',
    goal:  'Every screen clickable & interactive. A stakeholder can click login → ' +
           'published campaign with ZERO dead ends by end of week.',

    /* Owais — non-negotiable for the gamified version */
    noForms: 'ZERO traditional forms. Every input, question, and step must feel ' +
             'like a game mechanic — card flip, selection, challenge, reward, ' +
             'progression. If it feels like filling a form, it is wrong.',

    /* Design inspiration to mine for mechanics & step-by-step guidance */
    inspiration: ['GTA (mission intros, map waypoints)',
                  'IGI (handler briefings, objective checklists)',
                  'COD (loadout selection, progression/unlocks)'],
  };

  /* ──────────────────────────────────────────────────────────────────────
     WORLD / METAPHOR  (locked — anchors every screen's language & visuals)
     ────────────────────────────────────────────────────────────────────── */
  const METAPHOR = {
    theme: 'MISSION CONTROL / LAUNCH SEQUENCE. The product is literally "Launchpad".',
    map: {
      login:      'Pre-flight clearance (game-framed auth)',
      onboarding: 'Pre-flight checks (Business / Goals / Launch)',
      strategy:   'Mission planning (Strategic Plan)',
      persona:    'Crew / target dossier (Persona Studio)',
      gtm:        'Flight plan (GTM Strategy)',
      content:    'Build (Content Studio) — Aria takes the controls here',
      campaign:   'LAUNCH (Campaign) → publish',
      library:    'Flight log (Library)',
    },
    phases: 'Mirror existing Plan → Launch → Grow → Scale tracker.',
  };

  /* ──────────────────────────────────────────────────────────────────────
     CHARACTERS  (locked)
     ────────────────────────────────────────────────────────────────────── */
  const CHARACTERS = {
    launchDirector: {
      role:   'NEW onboarding guide — a Mission Handler / "Launch Director".',
      style:  'COMMS-HUD / radio handler: avatar chip + dialogue panel styled as ' +
              'mission comms (IGI-style). NOT a full illustrated body. Scales as an ' +
              'overlay across every onboarding + intelligence screen.',
      tone:   'Authoritative, warm, mission-focused. Briefs the user step by step.',
      owns:   'Login → Onboarding → Intelligence (Understand layer).',
      handoff:'At Content Studio, hands controls to Aria ("your creative co-pilot").',
      name:   'CAPCOM (NASA "capsule communicator" — the single voice to the crew). LOCKED.',
    },
    aria: 'Existing companion (illustrated character). Owns Content Studio onward.',
  };

  /* ──────────────────────────────────────────────────────────────────────
     IMAGE MAP  (Onboarding&Intelligence/ — the MVP we are re-gamifying)
     1-3 = our themed onboarding mock. 4-19 = the Lovable reference app
     ("Launchpad / Growth OS", clarity-coress.lovable.app) — the structure &
     data model Zay told us to mirror. ALL of it is forms today = our target.
     ────────────────────────────────────────────────────────────────────── */
  const IMAGE_MAP = {
    '1.png':  'Login — traditional form (purple theme). Re-skin + game-frame.',
    '2.png':  'Onboarding Step 1/3 Business — what you do, name, 6 type cards.',
    '3.png':  'Onboarding Step 2/3 Goals — priority chips + 90-day goal → "Plan my week".',
    '4.png':  'Dashboard ("Your journey": Plan→Launch→Grow→Scale; stat cards; next moves). ' +
              'Sidebar = HOME / UNDERSTAND (My Market, My Customers, Competition) / ' +
              'PLAN (My Plan, My Pricing) / DO (Tasks, Calendar) / GROW (Marketing, Content, Try New Ideas).',
    '5-6.png':  '"Try a New Idea" wizard — Your idea → Who\'s it for (audience INFERRED, price) → Run the test.',
    '7.png':    'Recent jobs / Reports panel — runs queue, statuses (QUEUED), Retry. This is the report engine.',
    '8.png':    'My Market — empty state (Category/Competitors/Avg Price/Signals cards) + "Start scan".',
    '9-12.png': '"Scan my market" wizard — Where & what (region search + INTERACTIVE WORLD MAP country ' +
                'picker) → What to look for (focus chips) → Run the scan (summary) → Run workflow.',
    '13.png':   'My Customers — customer sketches table, discovery channels, "best customer".',
    '14-15.png':'"Sketch my customer" wizard — name + describe (INFERRED) → Build the sketch → Run workflow. (= Persona seed)',
    '16-19.png':'Competition — reuses the "Scan my market" wizard (region picker incl. EMEA/APAC/LATAM/MENA/ANZ).',
  };

  /* Patterns seen across the reference (carry these into the gamified rebuild):
     - INFERRED / AI badges: fields pre-filled from earlier answers (inheritance).
     - Every action = a short wizard ending in "Run workflow" → a job in the Reports panel.
     - Interactive world-map country picker (prime gamification target: GTA-style map).
     - Phase tracker Plan→Launch→Grow→Scale mirrors our pillar ladder. */

  /* ──────────────────────────────────────────────────────────────────────
     THE FULL LAUNCHPAD JOURNEY  (7 sections — the spine of the week)
     login → onboarding → strategic plan → persona → GTM → content → campaign → library
     ────────────────────────────────────────────────────────────────────── */

  const PHASES = [

    /* ===== PHASE 1 — ONBOARDING & INTELLIGENCE  (THIS WEEK'S FOCUS) ===== */
    {
      id: 'onboarding', title: 'Onboarding & Intelligence', status: 'doing',
      note: 'Detailed now. This is what we review with Zay tomorrow.',
      tasks: [

        { id: 'OB-0', status: 'done', title: 'Design the new onboarding guide (host)',
          detail: 'RESOLVED: CAPCOM — Launch Director, comms-HUD/radio handler overlay. ' +
                  'See CHARACTERS.launchDirector. Hands off to Aria at Content.' },

        { id: 'OB-1', status: 'done', title: 'Game-framed login — "Pre-flight Clearance"  (ref 1.png)',
          built: 'js/auth.js + css/auth.css; gated in shell.js via ClarityRoot; wired in ' +
                 'index.html + styles.css. Awaiting sign-off on the gamification feel.',
          inputUX: 'Added per request: (1) CAPCOM reacts live as you type — waveform avatar ' +
                   'activates on focus, contextual lines ("Reading your ID…", "ID confirmed.", ' +
                   '"Access key encrypted."). (2) Per-field verification HUD — "✓ ID VERIFIED" ' +
                   'chip + green field lock on valid email; live ENCRYPTION strength gauge ' +
                   '(5 bars, Weak→Secure) on the access key.',
          detail: 'Real auth (email/password + Google) wrapped as a launch-sequence cold open. ' +
                  'DARK mission-control cinematic; onboarding then returns to light cream.',
          beats: ['Cold open: dark Mission Control panel + boot line (reuse existing loader).',
                  'CAPCOM comms-HUD hails: "Identify yourself, operator." (typewriter).',
                  'Clearance panel (NOT a form): Google = "Authenticate with Google"; ' +
                  'email = "Operator ID"; password = "Access key" (terminal inputs, ember caret); ' +
                  'Sign in = "Request clearance →"; forgot = "Lost your access key?"; ' +
                  'create = "New operator? Enlist".',
                  'On submit: HUD sweep + "CLEARANCE GRANTED" → CAPCOM: "Beginning pre-flight" ' +
                  '→ transition into onboarding Business step.'],
          reuse: 'Tokens/theme, existing dark loader, typewriter+comms pattern from aria.js. ' +
                 'Build the comms-HUD as a REUSABLE component for onboarding + intelligence.' },

        /* "PRE-FLIGHT SEQUENCE" — connected onboarding flow. Locked decisions:
           input mechanic = CAPCOM comms console (chips/cards + terminal inputs, no
           textareas); progress = pre-flight checklist HUD (3 checks tick green);
           reward = CHECK COMPLETE + XP + CAPCOM confirm between steps. Dark theme,
           consistent with login + app. New phase inserted: login → onboarding → app. */

        { id: 'OB-2a', status: 'done', title: 'Onboarding SHELL (Pre-flight Sequence)',
          detail: 'BUILT: js/onboarding.js + css/onboarding.css → window.ClarityOnboarding. ' +
                  'Checklist HUD, reusable CAPCOM comms console, per-step reward beat. ' +
                  'Gated in shell.js ClarityRoot: !authed→login, !onboarded→Onboarding, else app. ' +
                  'Verified in browser, no console errors.' },

        { id: 'OB-2', status: 'review', title: 'Check 01 · Business  (ref 2.png)',
          detail: 'BUILT (v2, one-question-at-a-time briefing): CAPCOM asks ONE sub-question ' +
                  'at a time (Sector → Name → What you run). Answered question animates out and ' +
                  'collapses into a clickable "dossier" chip (edit jumps back, returns to ' +
                  'furthest). Last answer auto-fires the reward beat (CHECK 01 COMPLETE, +40 XP) ' +
                  '→ into app (no dead end). Pattern to reuse for OB-3/OB-4. ' +
                  'NOTE: not yet browser-verified — Chrome extension dropped mid-session.' },

        { id: 'OB-3', status: 'review', title: 'Check 02 · Objectives — "Target Lock" radar  (ref 3.png)',
          detail: 'BUILT (distinct mechanic, chosen from a 6-concept ideation workflow): a ' +
                  'RADAR SCOPE replaces the chips. 6 priorities are contacts you LOCK toward ' +
                  'centre (distance = priority); an editable FIRE CONTROL list ranks them ' +
                  '(chevrons), ambient sweep, ember "primary lock" pop, then an ARMED insignia ' +
                  'beat. Then the 90-day goal as a "designate the target" text question (CAPCOM ' +
                  'face/dossier/reward intact). New "radar" kind in the runner; priorities = ' +
                  'ordered array. +50 XP. Teal theme. Syntax-checked; user tests in browser.' },

        { id: 'OB-4', status: 'review', title: 'Check 03 · Launch — Flight Plan + ignition',
          detail: 'BUILT: when the Launch check renders, a FLIGHT PLAN summary of every answer ' +
                  '(sector / operation / profile / ranked objectives / 90-day target) reveals ' +
                  'row-by-row, each sliding in FROM THE LEFT (staggered). "Initiate launch →" → ' +
                  'a 3·2·1 countdown + Lift-off ignition (ember/gold) → onComplete into the app. ' +
                  'Replaces the temporary bridge; full flow login→…→app now has no dead end. ' +
                  'Syntax-checked; user tests in browser.' },

        { id: 'OB-5', status: 'todo', title: 'Gamify the Intelligence layer (UNDERSTAND)',
          detail: 'Rebuild the reference\'s My Market / My Customers / Competition as game ' +
                  'mechanics. Each "Run workflow" wizard becomes a mission; results feed a ' +
                  'Reports/jobs view (ref 7.png). Mock all outputs.',
          subscreens: ['My Market — "Scan my market" mission (world-map country picker as a ' +
                        'GTA-style territory select, focus chips as objective loadout)',
                       'My Customers — "Sketch my customer" → seeds Persona Studio',
                       'Competition — reuses the scan mission',
                       'Reports/jobs panel — mocked run statuses'] },

        { id: 'OB-6', status: 'todo', title: 'Wire onboarding → next phase',
          detail: 'No dead ends: completing Launch flows into Strategic Plan. Mock all data.' },
      ],
    },

    /* ===== PHASES 2-7 — high-level placeholders (detail as we reach them) ===== */
    {
      id: 'strategic-plan', title: 'Strategic Planning (Intelligence) — ref 4-19.png', status: 'doing',
      note: 'NEXT. Per 2026-06-30 call: "Intelligence" == "Strategic Planning". Build the whole ' +
            'UNDERSTAND layer from images 4-19, gamified in our mission-control style (CAPCOM, ' +
            'teal, no forms, mocked APIs). Persona Studio + GTM are NOT separate phases for now — ' +
            'My Customers / "Sketch my customer" is folded in here as the persona seed.',
      tasks: [
        { id: 'INT-1', status: 'review', title: 'Command Deck / Dashboard  (ref 4.png)',
          detail: 'BUILT: js/intelligence.js + css/intelligence.css → window.ClarityIntel. ' +
                  'Game-like HUB (not sidebar): telemetry bar w/ operator rank+XP (carried from ' +
                  'onboarding), CAPCOM greeting, PRIMARY DIRECTIVE (90-day goal), PLAN→LAUNCH→GROW→' +
                  'SCALE tracker, intel readouts, 4 recon-mission cards (My Market flagged "Start ' +
                  'here"), Recent Ops feed. Mission cards open a briefing placeholder until their ' +
                  'flows are built. Wired in shell.js ClarityRoot (onboarding→deck, profile passed; ' +
                  'old pillar shell set aside). Syntax-checked; user tests in browser.' },
        { id: 'INT-2', status: 'review', title: 'My Market + "Scan my market" mission  (ref 8-12.png)',
          detail: 'BUILT: js/market.js + css/market.css → window.ClarityMarketMission. Flow: brief → ' +
                  'scan wizard [WORLD-MAP territory select + INFERRED "what you sell"; focus chips; ' +
                  'summary] → DEPLOY → scanning cinematic → INTEL REPORT. ' +
                  'Report matches the MVP output (ref context/Market_scan_Category.docx) but IMPROVED ' +
                  '(per call): findings-first, honest DQ dial (sector-varied 74-84%), methodology ' +
                  'tags, executive summary, Key Findings each w/ confidence (High/Med/Low) + source ' +
                  'refs, and a clean Evidence Appendix (7 relevant sources, links) instead of a ' +
                  'link-dump. REAL DOWNLOADABLE FILE: "Download report" generates a genuine Word ' +
                  'file (Market_scan_<category>.doc, MSO-namespaced HTML via Blob) — validated. ' +
                  '+60 XP; updates deck readouts/Recent Ops/XP; "Done ✓"; Re-scan. Mocked. ' +
                  'Syntax-checked; user tests in browser.' },
        { id: 'INT-3', status: 'review', title: 'My Customers + "Sketch my customer"  (ref 13-15.png)',
          detail: 'BUILT: js/customers.js + css/customers.css → window.ClarityCustomersMission. ' +
                  'DISTINCT mechanic = "Target Dossier" persona character-sheet (vs Market map). ' +
                  'Flow: roster of target profiles → sketch [name/call-sign + INFERRED desc → pick ' +
                  'ARCHETYPE (6: risk/performance/cost/status/convenience/community) → Build] → ' +
                  'assembling reveal → persona dossier (avatar, archetype tag, trait bars, ' +
                  'demographics, where-to-find, motivations, fit %). Build several; mark a PRIMARY ' +
                  'target (=MVP best customer). +50 XP/sketch; deck "Customer sketches" readout ' +
                  'shows the real count, Recent Ops + XP update. ' +
                  'ENRICHED to match the MVP "consumer" workflow output (ref context/Automotive_' +
                  'Diagnostic..._Go-to-Market_WT.docx): the dossier card is the hero, then a full ' +
                  'AUDIENCE REPORT — DQ dial, recommendation, audience profile, DEMOGRAPHICS % bars, ' +
                  'psychographics, WTP/pricing, Key findings (confidence + refs), evidence appendix ' +
                  '— archetype+sector flavoured, findings-first. Real downloadable file ' +
                  'Audience_<name>.doc (validated). Mocked. Syntax-checked; user tests.' },
        { id: 'INT-4', status: 'review', title: 'Competition + scan  (ref 16-19.png)',
          detail: 'BUILT: js/competition.js + css/competition.css → window.ClarityCompetitionMission. ' +
                  'REUSES the My Market scan wizard (world map exported from market.js as ' +
                  'window.ClarityScanKit) with competition focus chips. Distinct OUTPUT = a THREAT ' +
                  'BOARD: sector-flavoured named rivals with threat level (High/Med/Low, colour-coded), ' +
                  'share-of-voice bars, pricing, positioning + note; then "the gap" summary, Key ' +
                  'findings (confidence), evidence appendix, DQ dial. Real downloadable file ' +
                  'Competitor_scan_<category>.doc (validated). +60 XP; deck readouts/Recent Ops/XP ' +
                  'update; "Done ✓". Mocked. Syntax-checked; user tests.' },
        { id: 'INT-5', status: 'todo', title: 'Reports / Jobs system  (ref 7.png)',
          detail: 'Every "Run workflow" dispatches a mocked job (queued→running→done) feeding a ' +
                  'reports view. Gamify as deploying a recon scan with progress + reveal.' },
        { id: 'INT-6', status: 'todo', title: '"Try a New Idea" mission  (ref 5-6.png)',
          detail: 'Idea → who is it for (audience INFERRED, price) → run the test. Confirm if in ' +
                  'scope of Intelligence now or deferred.' },
      ],
    },
    {
      id: 'persona', title: 'Persona Studio', status: 'deferred',
      note: 'DEFERRED per 2026-06-30 call — folded into Intelligence (My Customers / Sketch).',
      tasks: [],
    },
    {
      id: 'gtm', title: 'GTM Strategy', status: 'deferred',
      note: 'DEFERRED per 2026-06-30 call — not needed for now.',
      tasks: [],
    },
    {
      id: 'content', title: 'Content Studio  (fix + connect)', status: 'todo',
      note: 'Already partly built (StudioFlow). Aria takes over here.',
      tasks: [{ id: 'CS-1', status: 'todo', title: 'Fix Content Studio',
                detail: 'Repair gaps in existing StudioFlow.' },
              { id: 'CS-2', status: 'todo', title: 'Connect into the journey',
                detail: 'Reachable from GTM completion; Aria handoff lands here.' }],
    },
    {
      id: 'campaign', title: 'Campaign  (fix + connect)', status: 'todo',
      tasks: [{ id: 'CMP-1', status: 'todo', title: 'Fix Campaign flow',
                detail: 'Repair existing CampaignFlow (currently inert in root shell).' },
              { id: 'CMP-2', status: 'todo', title: 'Connect to publishing',
                detail: 'End state = a published campaign. No dead ends.' }],
    },
    {
      id: 'library', title: 'Library', status: 'todo',
      tasks: [{ id: 'LIB-1', status: 'todo', title: 'Library of published work',
        detail: 'Published campaign/content lands here. Mocked items + statuses.' }],
    },
  ];

  /* ──────────────────────────────────────────────────────────────────────
     CROSS-CUTTING  (must hold across every phase)
     ────────────────────────────────────────────────────────────────────── */
  const CROSS_CUTTING = [
    { id: 'X-NUDGE', status: 'todo', title: 'Return nudge → Content Studio',
      detail: 'After Strategic Plan + Persona + GTM are complete, on the NEXT visit the ' +
              'platform proactively says e.g. "Your strategy is ready — we\'ve prepared ' +
              'something on the content side, want to see it?" Pulls user into Content ' +
              'Studio without manual navigation. Build into both versions.' },

    { id: 'X-ARCH', status: 'todo', title: 'Architecture doc (ongoing, for Zay)',
      detail: 'Keep updating. Model comparison table: native vs process platforms — ' +
              'cost, quality, latency per model. Review with Zay.' },

    { id: 'X-NOFORMS', status: 'todo', title: 'No-forms audit',
      detail: 'Every screen passes Owais\'s test: feels like playing, not form-filling.' },

    { id: 'X-NODEADENDS', status: 'todo', title: 'No-dead-ends pass',
      detail: 'Click-through login → published campaign with every button live (mocked).' },
  ];

  /* ──────────────────────────────────────────────────────────────────────
     IMMEDIATE NEXT STEPS  (agreed order with the user)
     ────────────────────────────────────────────────────────────────────── */
  const NEXT = [
    '1. Walk Onboarding&Intelligence images together; finish IMAGE_MAP (4-19).',
    '2. Design the new onboarding guide (OB-0) — ask, don\'t guess.',
    '3. Design + build the game-framed login (OB-1).',
    '4. Then onboarding questions: Business (OB-2) and Goals (OB-3).',
  ];

  return { DIRECTION, METAPHOR, CHARACTERS, IMAGE_MAP, PHASES, CROSS_CUTTING, NEXT };
})();
