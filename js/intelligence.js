/* ============================================================================
   intelligence.js — "The groundwork" (post-onboarding home, research layer)
   Exposes window.ClarityIntel({ profile }). Journey tone: warm first-person
   guidance, three get-to-know-your-ground steps, then the plan comes together.
   Step flows (Market w/ world-map, Customers, Competition, Reports) live in
   their own modules; unbuilt steps open a friendly placeholder.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }

  var PHASES = ['Plan', 'Launch', 'Grow', 'Scale'];

  var MISSIONS = [
    { id: 'market',      icon: 'Map',   title: 'My Market',      mission: 'Understand your market',      cta: 'Start the research', rec: true,
      desc: 'See your local landscape, who is in it, and what people are asking for.' },
    { id: 'customers',   icon: 'Users', title: 'My Customers',   mission: 'Sketch your customers',       cta: 'Sketch',
      desc: 'Build sharp sketches of exactly who you are selling to.' },
    { id: 'competition', icon: 'Store', title: 'Competition',    mission: 'See who’s already out there', cta: 'Take a look',
      desc: 'See where the others are strong — and where the gaps are.' }
  ];
  var STATS = [
    { id: 'market',      icon: 'Map',   label: 'Market reports' },
    { id: 'customers',   icon: 'Users', label: 'Customer sketches' },
    { id: 'competition', icon: 'Store', label: 'Competitors' }
  ];

  /* the voice of Clarity — unattributed typewriter line (reuses .capcom styles) */
  function Voice(props) {
    var line = props.line;
    var ty = React.useState(''); var typed = ty[0], setTyped = ty[1];
    var dn = React.useState(false); var done = dn[0], setDone = dn[1];
    React.useEffect(function () {
      setTyped(''); setDone(false);
      var i = 0; var iv = setInterval(function () { i++; setTyped(line.slice(0, i)); if (i >= line.length) { clearInterval(iv); setDone(true); } }, 16);
      return function () { clearInterval(iv); };
    }, [line]);
    return e('div', { className: 'capcom' },
      e('div', { className: 'capcom-body' },
        e('div', { className: 'capcom-line' }, typed, !done && e('span', { className: 'pf-cursor' }, '▉'))
      )
    );
  }

  function deckBg() {
    return e('div', { className: 'pf-bg' },
      e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-vignette' }));
  }
  function deckTopbar() {
    return e('div', { className: 'pf-topbar' },
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
        e('span', { className: 'pf-wordmark' }, 'Clarity'),
        e('span', { className: 'pf-hide-sm' }, 'Your journey · The groundwork')
      )
    );
  }

  /* Milestone — fires once when all three groundwork steps are complete */
  function LevelUpOverlay(props) {
    return e('div', { className: 'sp-lu', onClick: props.onClose },
      e('div', { className: 'sp-lu-card', onClick: function (ev) { ev.stopPropagation(); } },
        e('div', { className: 'sp-lu-glow' }),
        [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return e('span', { key: i, className: 'sp-lu-spark s' + i }); }),
        e('div', { className: 'sp-lu-eyebrow' }, 'A milestone'),
        e('div', { className: 'sp-lu-badge' }, e(Icon, { name: 'Trophy', size: 32 })),
        e('div', { className: 'sp-lu-title' }, 'Level up'),
        e('div', { className: 'sp-lu-sub' }, 'The groundwork is done — you know your ground. Your ', e('b', null, 'Strategic Plan'), ' is ready to come together.'),
        e('div', { className: 'sp-lu-actions' },
          e('button', { className: 'pf-cta', onClick: props.onAssemble }, 'Assemble my plan →'),
          e('button', { className: 'sp-lu-later', onClick: props.onClose }, 'Later'))));
  }

  function ClarityIntel(props) {
    var profile = props.profile || {};
    var op = (profile.name || '').trim();
    var goal = (profile.goal || '').trim();

    var savedIdea = props.idea || {};
    var xs = React.useState(savedIdea.xp != null ? savedIdea.xp : 90); var xp = xs[0], setXp = xs[1];   /* per-idea */
    var ds = React.useState(savedIdea.missions || {}); var done = ds[0], setDone = ds[1];   /* completed missions → result */
    var js = React.useState(savedIdea.jobs || []); var jobs = js[0], setJobs = js[1];  /* recent ops feed */
    var as = React.useState(null); var sel = as[0], setSel = as[1];   /* selected mission */
    var lu = React.useState(false); var levelUp = lu[0], setLevelUp = lu[1];   /* recon-complete celebration */
    var reconRef = React.useRef(!!(savedIdea.missions && savedIdea.missions.market && savedIdea.missions.customers && savedIdea.missions.competition));

    function cnt(id) { var d = done[id]; if (!d) return 0; if (d.reports) return d.reports.length; if (d.sketches) return d.sketches.length; return d.count || 1; }
    var counts = { market: cnt('market'), customers: cnt('customers'), competition: cnt('competition') };

    function missionDone(id, title, result) {
      setDone(function (d) { var o = {}; o[id] = result; return Object.assign({}, d, o); });
      setJobs(function (j) { return [{ id: id, title: title }].concat(j); });
      setXp(function (x) { return x + ((result && result.xp) || 0); });
    }

    /* Strategic Plan is locked until all three recon missions are complete */
    var reconComplete = !!(done.market && done.customers && done.competition);
    React.useEffect(function () {
      if (reconComplete && !reconRef.current) setLevelUp(true);
      reconRef.current = reconComplete;
    }, [reconComplete]);

    /* persist this idea's mission state up to the router */
    React.useEffect(function () {
      if (props.onChange) props.onChange({ missions: done, xp: xp, jobs: jobs });
    }, [done, xp, jobs]);

    /* ── My Market recon mission ── */
    if (sel === 'market' && window.ClarityMarketMission) {
      return e(window.ClarityMarketMission, {
        profile: profile, result: done.market || null,
        onComplete: function (r) { if (r && r.xp) { missionDone('market', 'Market research', r); } else { setDone(function (d) { return Object.assign({}, d, { market: r }); }); } },
        onBack: function () { setSel(null); }
      });
    }

    /* ── My Customers recon mission ── */
    if (sel === 'customers' && window.ClarityCustomersMission) {
      return e(window.ClarityCustomersMission, {
        profile: profile, result: done.customers || null,
        onComplete: function (r) {
          if (r.xp) { missionDone('customers', 'Customer sketch · ' + (r.lastName || 'persona'), r); }
          else { setDone(function (d) { return Object.assign({}, d, { customers: r }); }); }  /* primary change — persist only */
        },
        onBack: function () { setSel(null); }
      });
    }

    /* ── Competition recon mission ── */
    if (sel === 'competition' && window.ClarityCompetitionMission) {
      return e(window.ClarityCompetitionMission, {
        profile: profile, result: done.competition || null,
        onComplete: function (r) { if (r && r.xp) { missionDone('competition', 'Competition research', r); } else { setDone(function (d) { return Object.assign({}, d, { competition: r }); }); } },
        onBack: function () { setSel(null); }
      });
    }

    /* ── Strategic Plan capstone (six-category synthesis) — gated on recon complete ── */
    if (sel === 'plan' && (reconComplete || done.plan) && window.ClarityStrategicPlan) {
      return e(window.ClarityStrategicPlan, {
        profile: profile, missions: done, result: done.plan || null,
        onComplete: function (r) { missionDone('plan', 'Strategic Plan', r); },
        onBack: function () { setSel(null); },
        onPersona: props.onPersona
      });
    }

    /* ── Step placeholder (until the other research flows are built) ── */
    if (sel) {
      var m = MISSIONS.filter(function (x) { return x.id === sel; })[0] || {};
      return e('div', { className: 'id-root' }, deckBg(), deckTopbar(),
        e('div', { className: 'id-main' },
          e('button', { className: 'id-back', onClick: function () { setSel(null); } }, '‹ Back'),
          e('div', { className: 'id-briefing' },
            e('div', { className: 'id-brief-ic' }, e(Icon, { name: m.icon, size: 30 })),
            e('div', { className: 'id-eyebrow' }, 'Coming up'),
            e('h2', { className: 'id-brief-title' }, m.mission),
            e(Voice, { line: 'Hang on — the ' + m.title + ' step is still being built.' }),
            e('div', { className: 'id-brief-note' }, 'This part is on its way. Check back soon.')
          )
        )
      );
    }

    /* ── The groundwork (home) ── */
    return e('div', { className: 'id-root' }, deckBg(), deckTopbar(),
      e('div', { className: 'id-main' },
        props.onExit && e('button', { className: 'id-back', onClick: props.onExit }, '‹ Home base'),
        e('div', { className: 'id-head' },
          e('h1', { className: 'id-title' }, 'The groundwork'),
          e('p', { className: 'id-sub' }, 'Get to know your market, your customers and the landscape — then your plan writes itself.')
        ),

        goal && e('div', { className: 'id-directive' },
          e(Icon, { name: 'Target', size: 15 }),
          e('span', { className: 'id-directive-label' }, 'Your goal'),
          e('span', { className: 'id-directive-val' }, goal)
        ),

        /* the three groundwork steps */
        e('div', { className: 'id-section-label' }, 'Three things to learn'),
        e('div', { className: 'id-missions' },
          MISSIONS.map(function (mn) {
            return e('button', { key: mn.id, className: 'id-mission' + (mn.rec ? ' rec' : ''), onClick: function () { setSel(mn.id); } },
              e('div', { className: 'id-mission-top' },
                e('div', { className: 'id-mission-ic' }, e(Icon, { name: mn.icon, size: 20 })),
                e('span', { className: 'id-mission-chip' + (done[mn.id] ? ' ok' : mn.rec ? ' rec' : '') }, done[mn.id] ? 'Done ✓' : mn.rec ? 'Start here' : 'Waiting')
              ),
              e('div', { className: 'id-mission-title' }, mn.title),
              e('div', { className: 'id-mission-sub' }, mn.mission),
              e('div', { className: 'id-mission-desc' }, mn.desc),
              e('div', { className: 'id-mission-cta' }, mn.cta, ' →')
            );
          })
        ),

        /* the plan — where it all comes together (opens after the three steps) */
        e('div', { className: 'id-section-label' }, 'Then it comes together'),
        (function () {
          var unlocked = reconComplete || done.plan;
          var n = (done.market ? 1 : 0) + (done.customers ? 1 : 0) + (done.competition ? 1 : 0);
          return e('button', { className: 'id-mission id-capstone' + (unlocked ? '' : ' locked'), onClick: unlocked ? function () { setSel('plan'); } : undefined },
            e('div', { className: 'id-mission-top' },
              e('div', { className: 'id-mission-ic' }, e(Icon, { name: unlocked ? 'FileText' : 'Lock', size: 20 })),
              e('span', { className: 'id-mission-chip' + (done.plan ? ' ok' : unlocked ? ' rec' : '') }, done.plan ? 'Done ✓' : unlocked ? 'Ready' : 'Opens after the three steps')),
            e('div', { className: 'id-mission-title' }, 'Strategic Plan'),
            e('div', { className: 'id-mission-sub' }, unlocked ? 'Your one combined report' : 'Finish the three steps above and this opens'),
            e('div', { className: 'id-mission-desc' }, unlocked
              ? 'Everything you’ve learned, pulled into one colour-coded plan you can read in a minute.'
              : 'Learn your market, your customers and the landscape — it all comes together here, in one plan.'),
            e('div', { className: 'id-mission-cta' }, unlocked ? ((done.plan ? 'Review' : 'Assemble') + ' →') : (n + ' of 3 done')));
        })(),

        /* what you've done so far */
        e('div', { className: 'id-section-label' }, 'What you’ve done so far'),
        jobs.length === 0
          ? e('div', { className: 'id-ops' }, e(Icon, { name: 'Footprints', size: 16 }), e('span', null, 'Nothing yet — your market is the best place to start.'))
          : e('div', { className: 'id-opslist' },
              jobs.map(function (j, i) {
                return e('div', { key: i, className: 'id-opsrow' },
                  e('span', { className: 'id-ops-ic' }, e(Icon, { name: 'CircleCheck', size: 14 })),
                  e('span', { className: 'id-ops-title' }, j.title),
                  e('span', { className: 'id-ops-status' }, 'Complete'));
              })
            )
      ),
      levelUp && e(LevelUpOverlay, { onAssemble: function () { setLevelUp(false); setSel('plan'); }, onClose: function () { setLevelUp(false); } })
    );
  }

  window.ClarityIntel = ClarityIntel;
})();
