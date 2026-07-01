/* ============================================================================
   intelligence.js — "Command Deck" (post-onboarding home, Intelligence layer)
   Exposes window.ClarityIntel({ profile }). Mission-control / CAPCOM / teal.
   Reimagines the reference Dashboard (4.png) as a game-like recon hub. Mission
   flows (Market scan w/ world-map, Customers, Competition, Try-a-New-Idea,
   Reports) are built next; mission cards currently open a briefing placeholder.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }

  var RANKS = [{ min: 0, label: 'Rookie' }, { min: 80, label: 'Strategist' }, { min: 180, label: 'Creator' }, { min: 300, label: 'Master' }];
  function rankFor(xp) { var r = RANKS[0]; for (var i = 0; i < RANKS.length; i++) if (xp >= RANKS[i].min) r = RANKS[i]; return r; }

  var PHASES = ['Plan', 'Launch', 'Grow', 'Scale'];

  var MISSIONS = [
    { id: 'market',      icon: 'Radar',     title: 'My Market',      mission: 'Scan the market',        cta: 'Run scan', rec: true,
      desc: 'Map your local landscape, competitors and live demand signals.' },
    { id: 'customers',   icon: 'Users',     title: 'My Customers',   mission: 'Sketch your customers',  cta: 'Sketch',
      desc: 'Build sharp sketches of exactly who you are selling to.' },
    { id: 'competition', icon: 'Crosshair', title: 'Competition',    mission: 'Scout the competition', cta: 'Scout',
      desc: 'Size up who you are up against — and where the gaps are.' },
    { id: 'idea',        icon: 'Lightbulb', title: 'Try a New Idea', mission: 'Pressure-test a concept', cta: 'Test',
      desc: 'Stress-test an idea with your audience before you build it.' }
  ];
  var STATS = [
    { id: 'market',      icon: 'Radar',     label: 'Market scans' },
    { id: 'customers',   icon: 'Users',     label: 'Customer sketches' },
    { id: 'competition', icon: 'Crosshair', label: 'Competitors' },
    { id: 'idea',        icon: 'Lightbulb', label: 'Ideas tested' }
  ];

  /* CAPCOM comms strip with a typewriter line (reuses .capcom styles) */
  function Capcom(props) {
    var line = props.line;
    var ty = React.useState(''); var typed = ty[0], setTyped = ty[1];
    var dn = React.useState(false); var done = dn[0], setDone = dn[1];
    React.useEffect(function () {
      setTyped(''); setDone(false);
      var i = 0; var iv = setInterval(function () { i++; setTyped(line.slice(0, i)); if (i >= line.length) { clearInterval(iv); setDone(true); } }, 16);
      return function () { clearInterval(iv); };
    }, [line]);
    return e('div', { className: 'capcom' },
      e('div', { className: 'capcom-avatar' }, e('i', null), e('i', null), e('i', null), e('i', null), e('i', null)),
      e('div', { className: 'capcom-body' },
        e('div', { className: 'capcom-name' }, e('b', null, 'CAPCOM'), e('span', null, 'Launch Director')),
        e('div', { className: 'capcom-line' }, typed, !done && e('span', { className: 'pf-cursor' }, '▉'))
      )
    );
  }

  function deckBg() {
    return e('div', { className: 'pf-bg' },
      e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-grid' }),
      e('div', { className: 'pf-bg-scan' }), e('div', { className: 'pf-bg-vignette' }));
  }
  function deckTopbar(rank, xp) {
    return e('div', { className: 'pf-topbar' },
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
        e('span', { className: 'pf-wordmark' }, 'Clarity'),
        e('span', { className: 'pf-hide-sm' }, 'Mission Control // Command Deck')
      ),
      e('div', { className: 'pf-tele' },
        e('div', { className: 'id-rank' }, e(Icon, { name: 'Shield', size: 12 }),
          e('span', null, rank.label.toUpperCase()), e('span', { className: 'id-rank-xp' }, xp, ' XP')),
        e('span', { className: 'pf-hide-sm' }, 'Guidance: CAPCOM'),
        e('span', { className: 'pf-live' }, e('i', null), 'Live')
      )
    );
  }

  function ClarityIntel(props) {
    var profile = props.profile || {};
    var op = (profile.name || '').trim();
    var goal = (profile.goal || '').trim();

    var xs = React.useState(90); var xp = xs[0], setXp = xs[1];       /* seeded from onboarding (40+50) */
    var ds = React.useState({}); var done = ds[0], setDone = ds[1];   /* completed missions → result */
    var js = React.useState([]); var jobs = js[0], setJobs = js[1];  /* recent ops feed */
    var as = React.useState(null); var sel = as[0], setSel = as[1];   /* selected mission */

    var rank = rankFor(xp);
    function cnt(id) { return done[id] ? (done[id].count || 1) : 0; }
    var counts = { market: cnt('market'), customers: cnt('customers'), competition: cnt('competition'), idea: cnt('idea') };

    function missionDone(id, title, result) {
      setDone(function (d) { var o = {}; o[id] = result; return Object.assign({}, d, o); });
      setJobs(function (j) { return [{ id: id, title: title }].concat(j); });
      setXp(function (x) { return x + ((result && result.xp) || 0); });
    }

    /* ── My Market recon mission ── */
    if (sel === 'market' && window.ClarityMarketMission) {
      return e(window.ClarityMarketMission, {
        profile: profile, result: done.market || null,
        onComplete: function (r) { missionDone('market', 'Market scan', r); },
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
        onComplete: function (r) { missionDone('competition', 'Competitor scan', r); },
        onBack: function () { setSel(null); }
      });
    }

    /* ── Mission briefing placeholder (until the other recon flows are built) ── */
    if (sel) {
      var m = MISSIONS.filter(function (x) { return x.id === sel; })[0] || {};
      return e('div', { className: 'id-root' }, deckBg(), deckTopbar(rank, xp),
        e('div', { className: 'id-main' },
          e('button', { className: 'id-back', onClick: function () { setSel(null); } }, '‹ Back to deck'),
          e('div', { className: 'id-briefing' },
            e('div', { className: 'id-brief-ic' }, e(Icon, { name: m.icon, size: 30 })),
            e('div', { className: 'id-eyebrow' }, 'Recon mission'),
            e('h2', { className: 'id-brief-title' }, m.mission),
            e(Capcom, { line: 'Stand by — the ' + m.title + ' recon flow is coming online next, operator.' }),
            e('div', { className: 'id-brief-note' }, 'This mission is being prepped. Hang tight.')
          )
        )
      );
    }

    /* ── Command Deck ── */
    var greet = (op ? op + ' is on the board. ' : '') + 'Strategy first, operator — run recon and gather intel before we build.';
    return e('div', { className: 'id-root' }, deckBg(), deckTopbar(rank, xp),
      e('div', { className: 'id-main' },
        e('div', { className: 'id-head' },
          e('div', { className: 'id-eyebrow' }, 'Mission Control // Command Deck'),
          e('h1', { className: 'id-title' }, 'Command Deck'),
          e('p', { className: 'id-sub' }, 'Strategy first. Run recon, gather intel, then we build.')
        ),

        e(Capcom, { line: greet }),

        goal && e('div', { className: 'id-directive' },
          e(Icon, { name: 'Target', size: 15 }),
          e('span', { className: 'id-directive-label' }, 'Primary directive'),
          e('span', { className: 'id-directive-val' }, goal)
        ),

        /* journey tracker */
        e('div', { className: 'id-journey' },
          e('div', { className: 'id-journey-head' }, e('span', null, 'Your journey'), e('span', { className: 'id-journey-phase' }, 'Phase · Plan')),
          e('div', { className: 'id-phases' },
            PHASES.map(function (p, i) {
              return e('div', { key: p, className: 'id-phase' + (i === 0 ? ' active' : '') },
                e('div', { className: 'id-phase-bar' }), e('span', { className: 'id-phase-label' }, p));
            })
          )
        ),

        /* intel readouts */
        e('div', { className: 'id-stats' },
          STATS.map(function (s) {
            return e('div', { key: s.id, className: 'id-stat' },
              e('div', { className: 'id-stat-top' }, e(Icon, { name: s.icon, size: 14 }), e('span', null, s.label)),
              e('div', { className: 'id-stat-num' }, counts[s.id] || 0));
          })
        ),

        /* recon missions */
        e('div', { className: 'id-section-label' }, 'Recon missions'),
        e('div', { className: 'id-missions' },
          MISSIONS.map(function (mn) {
            return e('button', { key: mn.id, className: 'id-mission' + (mn.rec ? ' rec' : ''), onClick: function () { setSel(mn.id); } },
              e('div', { className: 'id-mission-top' },
                e('div', { className: 'id-mission-ic' }, e(Icon, { name: mn.icon, size: 20 })),
                e('span', { className: 'id-mission-chip' + (done[mn.id] ? ' ok' : mn.rec ? ' rec' : '') }, done[mn.id] ? 'Done ✓' : mn.rec ? 'Start here' : 'Not run')
              ),
              e('div', { className: 'id-mission-title' }, mn.title),
              e('div', { className: 'id-mission-sub' }, mn.mission),
              e('div', { className: 'id-mission-desc' }, mn.desc),
              e('div', { className: 'id-mission-cta' }, mn.cta, ' →')
            );
          })
        ),

        /* recent ops */
        e('div', { className: 'id-section-label' }, 'Recent ops'),
        jobs.length === 0
          ? e('div', { className: 'id-ops' }, e(Icon, { name: 'Radio', size: 16 }), e('span', null, 'No scans run yet — deploy a recon mission to gather intel.'))
          : e('div', { className: 'id-opslist' },
              jobs.map(function (j, i) {
                return e('div', { key: i, className: 'id-opsrow' },
                  e('span', { className: 'id-ops-ic' }, e(Icon, { name: 'CircleCheck', size: 14 })),
                  e('span', { className: 'id-ops-title' }, j.title),
                  e('span', { className: 'id-ops-status' }, 'Complete'));
              })
            )
      )
    );
  }

  window.ClarityIntel = ClarityIntel;
})();
