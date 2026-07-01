/* ============================================================================
   onboarding.js — "Pre-flight Sequence" (gamified onboarding, CAPCOM-led)
   Exposes window.ClarityOnboarding({ onComplete }). Reuses CAPCOM comms-HUD +
   .pf-* input styles from auth.css.

   Generic multi-check runner. Each check asks ONE sub-question at a time
   (cards / chips / text); answered questions launch up and collapse into a
   "dossier" chip (click to edit). Completing a check fires a reward beat, then
   advances to the next. Check 03 (Launch) has no sub-questions yet, so finishing
   Check 02 bridges into the app (no dead end) until Launch is built.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) {
    var NS = window.ClarityDesignSystem_29c088 || {};
    return NS.Icon ? e(NS.Icon, props) : null;
  }

  /* CAPCOM emotive face — shown on typing questions, reacts to the user. */
  function CapcomFace(props) {
    var mood = props.mood || 'neutral';
    var C = '#d8fff7';  /* light mint — reads on the teal avatar */
    var eyes;
    if (mood === 'grin') {
      eyes = [ e('path', { key: 'l', d: 'M10 18 Q14 13 18 18', stroke: C, strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' }),
               e('path', { key: 'r', d: 'M22 18 Q26 13 30 18', stroke: C, strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' }) ];
    } else if (mood === 'sad') {
      eyes = [ e('g', { key: 'l', className: 'eye' }, e('circle', { cx: 14, cy: 19, r: 2.6, fill: C }), e('path', { d: 'M10 14 Q14 13 18 15.5', stroke: C, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round' })),
               e('g', { key: 'r', className: 'eye' }, e('circle', { cx: 26, cy: 19, r: 2.6, fill: C }), e('path', { d: 'M22 15.5 Q26 13 30 14', stroke: C, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round' })) ];
    } else {
      eyes = [ e('circle', { key: 'l', className: 'eye', cx: 14, cy: 18, r: 3, fill: C }),
               e('circle', { key: 'r', className: 'eye', cx: 26, cy: 18, r: 3, fill: C }) ];
    }
    var mouth = mood === 'grin' ? 'M10 24 Q20 34 30 24 Q20 28 10 24'
              : mood === 'happy' ? 'M13 25 Q20 31 27 25'
              : mood === 'sad' ? 'M13 29 Q20 23 27 29'
              : 'M14 27 Q20 29 26 27';
    return e('svg', { className: 'capcom-face', width: 30, height: 30, viewBox: '0 0 40 40' },
      eyes,
      e('path', { d: mouth, stroke: C, strokeWidth: 2.2, fill: mood === 'grin' ? C : 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }),
      mood === 'grin' && e('g', { key: 'b' },
        e('circle', { cx: 8, cy: 24, r: 2.3, fill: '#ff8568', opacity: 0.5 }),
        e('circle', { cx: 32, cy: 24, r: 2.3, fill: '#ff8568', opacity: 0.5 }))
    );
  }

  var HAPPY = ["You're doing great.", 'Looking good — keep going.', "Nice, I'm reading you.", "That's it. Keep it coming."];
  var SAD   = ["Don't stop now…", 'Still with me, operator?', "I'm waiting on you…"];
  var NICE  = ['Nice.', 'Logged. Good work.', 'Copy that.'];
  function rand(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* radar geometry — scope is a 300×300 box, centre (150,150).
     Bearing is fixed per contact (index); range (distance from centre) = priority rank. */
  function polarXY(r, angleDeg) { var a = angleDeg * Math.PI / 180; return [150 + r * Math.cos(a), 150 + r * Math.sin(a)]; }
  function rankRadius(k) { return 40 + (k - 1) * 15; }   /* rank 1 (primary) nearest centre */
  var PERIM_R = 124;                                      /* unlocked contacts sit on the rim */

  /* ── Option banks ──────────────────────────────────────────────────────── */
  var TYPES = [
    { id: 'food',     label: 'Food & Hospitality', icon: 'UtensilsCrossed', line: 'Food & hospitality. Copy — people always need feeding.' },
    { id: 'retail',   label: 'Retail & Products',  icon: 'ShoppingBag',     line: 'Retail. Got it — product is your engine.' },
    { id: 'creative', label: 'Creative & Services',icon: 'Palette',         line: 'Creative & services. Noted — you sell craft.' },
    { id: 'tech',     label: 'Tech & Software',    icon: 'Laptop',          line: 'Tech & software. Copy — scalable territory.' },
    { id: 'trades',   label: 'Trades & Local',     icon: 'Hammer',          line: 'Trades & local. Solid — boots-on-the-ground operation.' },
    { id: 'other',    label: 'Other',              icon: 'Shapes',          line: 'Other. Understood — we will map it as we go.' }
  ];
  var PRIORITIES = [
    { id: 'customers', label: 'Get more customers',    short: 'Customers',   line: 'Growth. The right call early on.' },
    { id: 'found',     label: 'Get found online',      short: 'Get found',   line: "Visibility. Can't buy what they can't find." },
    { id: 'launch',    label: 'Launch a new product',  short: 'New product', line: "A launch. Now we're talking." },
    { id: 'community', label: 'Build a loyal community', short: 'Community',  line: 'Loyalty. The long game — I like it.' },
    { id: 'repeat',    label: 'Increase repeat orders', short: 'Repeat',     line: 'Retention. Cheaper than chasing new ones.' },
    { id: 'test',      label: 'Test a new idea',       short: 'Test idea',   line: 'Experiment. Smart operators test first.' }
  ];

  /* ── Checks ────────────────────────────────────────────────────────────── */
  var CHECKS = [
    {
      id: 'business', n: '01', label: 'Business', title: 'Business Profile', xp: 40,
      reward: function (a) { return (a.name || '').trim() ? a.name.trim() + ' is on file. Stand by for the next check…' : 'Business profile locked. Stand by…'; },
      subs: [
        { id: 'sector', kind: 'cards', sec: 'Sector', options: TYPES,
          ask: 'Check one. Put your operation on file — what field are you in?' },
        { id: 'name', kind: 'text', sec: 'Operation name', icon: 'Radio',
          ask: 'Good. What do we call this operation?', placeholder: 'e.g. Hearth Bakery' },
        { id: 'desc', kind: 'text', sec: 'What you run', icon: 'FileText',
          ask: 'Last thing — describe what you do in one line.', placeholder: 'one line — e.g. artisan sourdough, local & online' }
      ]
    },
    {
      id: 'objectives', n: '02', label: 'Objectives', title: 'Mission Objectives', xp: 50,
      reward: function () { return 'Objectives locked in. Plotting your trajectory…'; },
      subs: [
        { id: 'priorities', kind: 'radar', sec: 'Locked objectives', min: 1, options: PRIORITIES,
          confirm: 'Arm objectives →',
          ask: "Sensor sweep is live — six contacts on scope. Lock the objectives you'll fly toward. Closest to centre is your top priority." },
        { id: 'goal', kind: 'text', sec: 'Primary target · 90 days', icon: 'Crosshair',
          ask: 'Primary locked. Designate the target — what does hitting your #1 objective look like in 90 days?', placeholder: 'e.g. 200 repeat customers by launch week' }
      ]
    },
    { id: 'launch', n: '03', label: 'Launch', title: 'Launch' }   /* finale — built next */
  ];

  /* ── Check 03 · Launch — flight-plan summary (staggered left reveal) + ignition ── */
  function LaunchSummary(props) {
    var answers = props.answers || {};
    var onLaunch = props.onLaunch;
    var ig = React.useState(false); var igniting = ig[0], setIgniting = ig[1];
    var cd = React.useState(3);     var count = cd[0], setCount = cd[1];

    function launch() {
      if (igniting) return;
      setIgniting(true);
      var n = 3; setCount(3);
      var iv = setInterval(function () {
        n--;
        if (n >= 1) { setCount(n); }
        else { clearInterval(iv); setCount(0); setTimeout(function () { if (onLaunch) onLaunch(answers); }, 1100); }
      }, 800);
    }

    var sectorLabel = (TYPES.filter(function (t) { return t.id === answers.sector; })[0] || {}).label || '—';
    var prios = (answers.priorities || []).map(function (id, i) {
      var o = PRIORITIES.filter(function (p) { return p.id === id; })[0] || {};
      return (i + 1) + '. ' + (o.label || '');
    });
    var rows = [
      { icon: 'Compass',    label: 'Sector',               val: sectorLabel },
      { icon: 'Radio',      label: 'Operation',            val: answers.name || '—' },
      { icon: 'FileText',   label: 'Profile',              val: answers.desc || '—' },
      { icon: 'ListChecks', label: 'Objectives',           val: prios.length ? prios.join('     ') : '—', mono: true },
      { icon: 'Target',     label: 'Primary target · 90d', val: answers.goal || '—' }
    ];

    return e('div', { className: 'ob-console ob-launch' },
      e('span', { className: 'pf-corner tl' }), e('span', { className: 'pf-corner tr' }),
      e('span', { className: 'pf-corner bl' }), e('span', { className: 'pf-corner br' }),
      e('div', { className: 'ob-stagelabel' }, 'Check 03 · ', e('b', null, 'Flight Plan')),
      e('div', { className: 'capcom' },
        e('div', { className: 'capcom-avatar' }, e('i', null), e('i', null), e('i', null), e('i', null), e('i', null)),
        e('div', { className: 'capcom-body' },
          e('div', { className: 'capcom-name' }, e('b', null, 'CAPCOM'), e('span', null, 'Launch Director')),
          e('div', { className: 'capcom-line' }, 'All checks complete. This is your flight plan — confirm and we launch.')
        )
      ),
      e('div', { className: 'ob-flight' },
        rows.map(function (r, i) {
          return e('div', { key: i, className: 'ob-frow' + (r.mono ? ' mono' : ''), style: { animationDelay: (0.13 * i + 0.15) + 's' } },
            e('span', { className: 'ob-frow-ic' }, e(Icon, { name: r.icon, size: 15 })),
            e('span', { className: 'ob-frow-label' }, r.label),
            e('span', { className: 'ob-frow-val' }, r.val)
          );
        })
      ),
      e('button', { className: 'pf-cta ob-launch-btn', style: { animationDelay: (0.13 * rows.length + 0.3) + 's' }, onClick: launch }, 'Initiate launch →'),
      igniting && e('div', { className: 'ob-ignite' },
        count > 0
          ? e('div', { className: 'ob-count', key: count }, count)
          : e('div', { className: 'ob-liftoff' }, e(Icon, { name: 'Rocket', size: 34 }), 'Lift-off')
      )
    );
  }

  function ClarityOnboarding(props) {
    var onComplete = props.onComplete;

    var ci = React.useState(0);     var checkIndex = ci[0], setCheckIndex = ci[1];
    var an = React.useState({});    var answers = an[0], setAnswers = an[1];

    var sp = React.useState(0);     var step = sp[0], setStep = sp[1];
    var mx = React.useState(0);     var maxReached = mx[0], setMaxReached = mx[1];
    var ex = React.useState(false); var exiting = ex[0], setExiting = ex[1];
    var lk = React.useState(false); var locking = lk[0], setLocking = lk[1];
    var fc = React.useState(null);  var focused = fc[0], setFocused = fc[1];
    var ph = React.useState('form');var phase = ph[0], setPhase = ph[1];
    var ac = React.useState(false); var active = ac[0], setActive = ac[1];
    var md = React.useState('neutral'); var mood = md[0], setMood = md[1];
    var bb = React.useState(null);       var bubble = bb[0], setBubble = bb[1];
    var ar = React.useState(false);      var arming = ar[0], setArming = ar[1];   // radar "arm" beat

    var check = CHECKS[checkIndex];
    var subs  = check.subs || [];
    var sub   = subs[step] || {};

    var ciRef = React.useRef(0); ciRef.current = checkIndex;
    var stepRef = React.useRef(0); stepRef.current = step;
    var maxRef  = React.useRef(0); maxRef.current  = maxReached;
    var inputRef = React.useRef(null);
    var idleRef = React.useRef(null);

    /* CAPCOM typewriter */
    var tg = React.useState(CHECKS[0].subs[0].ask); var target = tg[0], setTarget = tg[1];
    var tp = React.useState('');                    var typed = tp[0], setTyped = tp[1];
    var dn = React.useState(false);                 var done = dn[0], setDone = dn[1];

    function say(text, isActive) {
      if (text === target) { setActive(!!isActive); return; }
      setTarget(text); setActive(!!isActive);
    }
    React.useEffect(function () {
      setTyped(''); setDone(false);
      var i = 0;
      var iv = setInterval(function () {
        i++; setTyped(target.slice(0, i));
        if (i >= target.length) { clearInterval(iv); setDone(true); }
      }, 18);
      return function () { clearInterval(iv); };
    }, [target]);

    /* On sub-question (or check) change: CAPCOM asks it + focus text inputs */
    React.useEffect(function () {
      if (phase !== 'form') return;
      var cc = CHECKS[checkIndex];
      if (!cc.subs) return;                 /* Launch check has no sub-questions */
      var s = cc.subs[step];
      if (idleRef.current) clearTimeout(idleRef.current);
      setBubble(null); setMood('neutral');
      say(s.ask, false);
      if (s.kind === 'text' && inputRef.current) inputRef.current.focus();
    }, [step, checkIndex]);

    var listening = active || focused !== null;

    /* typing reactions */
    function bumpTyping() {
      setMood('happy');
      setBubble(function (b) { return (b && HAPPY.indexOf(b) >= 0) ? b : rand(HAPPY); });
      if (idleRef.current) clearTimeout(idleRef.current);
      idleRef.current = setTimeout(function () { setMood('sad'); setBubble(rand(SAD)); }, 1600);
    }
    function clearIdle() { if (idleRef.current) clearTimeout(idleRef.current); }

    /* advance after the launch animation, honouring edit-jumps */
    function doAdvance() {
      var s = stepRef.current, m = maxRef.current;
      if (s < m) { setStep(m); return; }
      if (s >= subs.length - 1) { completeCheck(); return; }
      setMaxReached(s + 1); setStep(s + 1);
    }
    function commitStep(opts) {
      opts = opts || {};
      if (opts.line) say(opts.line, true);
      setLocking(true);
      setTimeout(function () {
        setLocking(false);
        setExiting(true);
        setTimeout(function () { setExiting(false); doAdvance(); }, 620);
      }, opts.pre || 320);
    }

    /* answer handlers */
    function pickCard(opt) { setAnswers(function (a) { var o = {}; o[sub.id] = opt.id; return Object.assign({}, a, o); }); commitStep({ line: opt.line, pre: 820 }); }
    function toggleChip(opt) {
      var cur = (answers[sub.id] || []).slice();
      var ix = cur.indexOf(opt.id);
      if (ix >= 0) { cur.splice(ix, 1); setActive(true); }
      else { cur.push(opt.id); say(opt.line, true); }
      setAnswers(function (a) { var o = {}; o[sub.id] = cur; return Object.assign({}, a, o); });
    }
    function confirmChips() {
      var cur = answers[sub.id] || [];
      if (cur.length < (sub.min || 1)) return;
      commitStep({ pre: 260 });
    }
    function setText(id, v) { setAnswers(function (a) { var o = {}; o[id] = v; return Object.assign({}, a, o); }); }

    /* radar (Check 02) — lock targets by range, rank via Fire Control, then ARM */
    function lockTarget(o) {
      var cur = (answers[sub.id] || []).slice();
      if (cur.indexOf(o.id) >= 0) return;
      var first = cur.length === 0;
      cur.push(o.id);
      setText(sub.id, cur);
      say(first ? o.line + ' Primary contact.' : o.line, true);
    }
    function unlockTarget(id) { setText(sub.id, (answers[sub.id] || []).filter(function (x) { return x !== id; })); setActive(true); }
    function moveRank(id, dir) {
      var cur = (answers[sub.id] || []).slice();
      var i = cur.indexOf(id); if (i < 0) return;
      var j = i + dir; if (j < 0 || j >= cur.length) return;
      var t = cur[i]; cur[i] = cur[j]; cur[j] = t;
      setText(sub.id, cur);
    }
    function armObjectives() {
      if ((answers[sub.id] || []).length < (sub.min || 1)) return;
      setArming(true);
      say('Targets locked. Trajectory armed.', true);
      setTimeout(function () { setArming(false); commitStep({ pre: 0 }); }, 660);
    }
    function submitText() {
      var val = (answers[sub.id] || '').trim();
      if (!val) return;
      clearIdle();
      setMood('grin'); setBubble(rand(NICE));
      commitStep({ pre: 600 });
    }
    function editStep(i) { setStep(i); }

    function completeCheck() { say(check.reward(answers), true); setPhase('reward'); }
    React.useEffect(function () {
      if (phase !== 'reward') return;
      var t = setTimeout(function () {
        var c = ciRef.current, next = CHECKS[c + 1];
        if (next) {
          setCheckIndex(c + 1); setStep(0); setMaxReached(0);
          setExiting(false); setLocking(false); setBubble(null); setMood('neutral'); setFocused(null);
          setPhase('form');    /* advances into the next check (incl. the Launch finale) */
        } else if (onComplete) {
          onComplete(answers);
        }
      }, 2100);
      return function () { clearTimeout(t); };
    }, [phase]);

    /* dossier chip value for a completed sub-question */
    function chipVal(s) {
      var v = answers[s.id];
      if (s.kind === 'cards') { var o = s.options.filter(function (x) { return x.id === v; })[0]; return o ? o.label : ''; }
      if (s.kind === 'chips') { if (!v || !v.length) return ''; return s.options.filter(function (o) { return v.indexOf(o.id) >= 0; }).map(function (o) { return o.label; }).join(', '); }
      if (s.kind === 'radar') {
        if (!v || !v.length) return '';
        var f = (s.options.filter(function (o) { return o.id === v[0]; })[0] || {}).label || '';
        return v.length > 1 ? f + '  +' + (v.length - 1) : f;
      }
      return v;
    }

    /* ── Render ── */
    return e('div', { className: 'ob-root' },
      e('div', { className: 'pf-bg' },
        e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-grid' }),
        e('div', { className: 'pf-bg-scan' }), e('div', { className: 'pf-bg-vignette' })
      ),

      e('div', { className: 'pf-topbar' },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
          e('span', { className: 'pf-wordmark' }, 'Clarity'),
          e('span', { className: 'pf-hide-sm' }, 'Mission Control // Pre-flight Sequence')
        ),
        e('div', { className: 'pf-tele' },
          e('span', { className: 'pf-hide-sm' }, 'Guidance: CAPCOM'),
          e('span', { className: 'pf-live' }, e('i', null), 'Live')
        )
      ),

      e('div', { className: 'ob-stage' },

        /* checklist HUD */
        e('div', { className: 'ob-checklist' },
          CHECKS.map(function (c, i) {
            var state = i < checkIndex ? 'done' : i === checkIndex ? 'active' : 'todo';
            return e(React.Fragment, { key: c.id },
              i > 0 && e('div', { className: 'ob-check-conn' + (i <= checkIndex ? ' lit' : '') }),
              e('div', { className: 'ob-check ' + state },
                e('div', { className: 'ob-check-dot' },
                  state === 'done' ? e(Icon, { name: 'Check', size: 14 }) : c.n
                ),
                e('div', { className: 'ob-check-meta' },
                  e('div', { className: 'ob-check-label' }, c.label),
                  e('div', { className: 'ob-check-status' },
                    state === 'done' ? 'Complete' : state === 'active' ? 'In progress' : 'Standby')
                )
              )
            );
          })
        ),

        /* console (question checks) */
        check.subs && e('div', { className: 'ob-console' },
          e('span', { className: 'pf-corner tl' }), e('span', { className: 'pf-corner tr' }),
          e('span', { className: 'pf-corner bl' }), e('span', { className: 'pf-corner br' }),

          e('div', { className: 'ob-stagelabel' }, 'Check ', check.n, ' · ', e('b', null, check.title)),

          /* dossier trail */
          step > 0 && e('div', { className: 'ob-trail' },
            subs.map(function (s, i) {
              if (i >= step || !chipVal(s)) return null;
              return e('button', { key: s.id, className: 'ob-chip', onClick: function () { editStep(i); } },
                e('span', { className: 'ob-chip-ic' }, e(Icon, { name: 'CircleCheck', size: 14 })),
                e('span', { className: 'ob-chip-label' }, s.sec),
                e('span', { className: 'ob-chip-val' }, chipVal(s)),
                e('span', { className: 'ob-chip-edit' }, 'Edit')
              );
            })
          ),

          /* CAPCOM comms-HUD — face on typing questions, waveform otherwise */
          e('div', { className: 'capcom' + (listening ? '' : ' idle') },
            e('div', { className: 'capcom-avatar' + (sub.kind === 'text' ? ' is-face' : '') },
              sub.kind === 'text'
                ? e(CapcomFace, { mood: mood, key: mood })
                : e(React.Fragment, null, e('i', null), e('i', null), e('i', null), e('i', null), e('i', null))
            ),
            e('div', { className: 'capcom-body' },
              e('div', { className: 'capcom-name' },
                e('b', null, 'CAPCOM'), e('span', null, 'Launch Director')
              ),
              e('div', { className: 'capcom-line' },
                bubble != null
                  ? bubble
                  : e(React.Fragment, null, typed, !done && e('span', { className: 'pf-cursor' }, '▉'))
              )
            )
          ),

          /* the current question (animated swap) */
          e('div', { className: 'ob-q' + (exiting ? ' exiting' : '') + (locking ? ' locking' : ''), key: checkIndex + '-' + step },
            e('div', { className: 'ob-sec' }, e('span', { className: 'pf-prompt' }, '>'), sub.sec),

            sub.kind === 'cards'
              ? e('div', { className: 'ob-cards' },
                  sub.options.map(function (t) {
                    return e('button', { key: t.id, className: 'ob-card' + (answers[sub.id] === t.id ? ' sel' : ''), onClick: function () { pickCard(t); } },
                      e('span', { className: 'ob-card-ic' }, e(Icon, { name: t.icon, size: 19 })),
                      e('span', { className: 'ob-card-label' }, t.label)
                    );
                  })
                )
              : sub.kind === 'radar'
              ? e('div', { className: 'ob-radar' + (arming ? ' arming' : '') },
                  /* radar scope */
                  e('div', { className: 'ob-scope' },
                    e('svg', { className: 'ob-rings', viewBox: '0 0 300 300' },
                      e('circle', { cx: 150, cy: 150, r: 124 }),
                      e('circle', { cx: 150, cy: 150, r: 100 }),
                      e('circle', { cx: 150, cy: 150, r: 70 }),
                      e('circle', { cx: 150, cy: 150, r: 40 }),
                      e('line', { x1: 150, y1: 26, x2: 150, y2: 274 }),
                      e('line', { x1: 26, y1: 150, x2: 274, y2: 150 }),
                      e('circle', { className: 'ob-core', cx: 150, cy: 150, r: 3 })
                    ),
                    e('div', { className: 'ob-sweep' }),
                    sub.options.map(function (o, i) {
                      var arrIx = (answers[sub.id] || []).indexOf(o.id);
                      var isLocked = arrIx >= 0, rank = arrIx + 1;
                      var xy = polarXY(isLocked ? rankRadius(rank) : PERIM_R, i * 60 - 90);
                      return e('button', {
                        key: o.id, title: o.label,
                        className: 'ob-blip' + (isLocked ? ' locked' : '') + (isLocked && rank === 1 ? ' primary' : ''),
                        style: { left: (xy[0] / 300 * 100) + '%', top: (xy[1] / 300 * 100) + '%' },
                        onClick: function () { isLocked ? unlockTarget(o.id) : lockTarget(o); }
                      },
                        e('span', { className: 'ob-blip-dot' }, isLocked ? e('span', { className: 'ob-blip-rank' }, rank) : null),
                        e('span', { className: 'ob-blip-label' }, o.short)
                      );
                    }),
                    arming && e('div', { className: 'ob-armed' }, e(Icon, { name: 'ShieldCheck', size: 16 }), 'Armed')
                  ),
                  /* fire control rank list */
                  e('div', { className: 'ob-fc' },
                    e('div', { className: 'ob-fc-title' }, 'Fire Control'),
                    (answers[sub.id] || []).length === 0
                      ? e('div', { className: 'ob-fc-empty' }, 'No targets locked.', e('br', null), 'Tap a contact to lock it.')
                      : (answers[sub.id] || []).map(function (id, idx) {
                          var arr = answers[sub.id];
                          var o = sub.options.filter(function (x) { return x.id === id; })[0] || {};
                          return e('div', { key: id, className: 'ob-fc-row' + (idx === 0 ? ' primary' : '') },
                            e('span', { className: 'ob-fc-rank' }, idx + 1),
                            e('span', { className: 'ob-fc-label' }, o.label),
                            e('span', { className: 'ob-fc-ctrl' },
                              e('button', { className: 'ob-fc-btn', disabled: idx === 0, onClick: function () { moveRank(id, -1); } }, e(Icon, { name: 'ChevronUp', size: 13 })),
                              e('button', { className: 'ob-fc-btn', disabled: idx === arr.length - 1, onClick: function () { moveRank(id, 1); } }, e(Icon, { name: 'ChevronDown', size: 13 })),
                              e('button', { className: 'ob-fc-btn x', onClick: function () { unlockTarget(id); } }, e(Icon, { name: 'X', size: 13 }))
                            )
                          );
                        }),
                    e('button', { className: 'ob-confirm ob-arm', onClick: armObjectives, disabled: (answers[sub.id] || []).length < (sub.min || 1) }, sub.confirm || 'Arm objectives →')
                  )
                )
              : sub.kind === 'chips'
              ? e('div', null,
                  e('div', { className: 'ob-chips' },
                    sub.options.map(function (o) {
                      var on = (answers[sub.id] || []).indexOf(o.id) >= 0;
                      return e('button', { key: o.id, className: 'ob-opt' + (on ? ' sel' : ''), onClick: function () { toggleChip(o); } }, o.label);
                    })
                  ),
                  e('button', { className: 'ob-confirm', onClick: confirmChips, disabled: (answers[sub.id] || []).length < (sub.min || 1) },
                    sub.confirm || 'Continue →')
                )
              : e('div', { className: 'pf-input-wrap' },
                  e(Icon, { name: sub.icon, size: 15 }),
                  e('input', {
                    ref: inputRef, className: 'pf-input', value: answers[sub.id] || '',
                    onFocus: function () { setFocused(sub.id); clearIdle(); setMood('neutral'); setBubble(null); },
                    onBlur: function () { setFocused(null); setActive(false); clearIdle(); setMood('neutral'); setBubble(null); },
                    onChange: function (ev) { setText(sub.id, ev.target.value); bumpTyping(); },
                    onKeyDown: function (ev) { if (ev.key === 'Enter') submitText(); },
                    placeholder: sub.placeholder, autoComplete: 'off'
                  }),
                  e('button', { className: 'ob-go', onClick: submitText, disabled: !(answers[sub.id] || '').trim() }, '→')
                )
          )
        ),

        /* Launch finale (Check 03 — no sub-questions) */
        !check.subs && e(LaunchSummary, { answers: answers, onLaunch: onComplete })
      ),

      /* reward beat */
      phase === 'reward' && e('div', { className: 'ob-reward' },
        e('div', { className: 'pf-stamp' }, 'Check ', check.n, ' · Complete'),
        e('div', { className: 'ob-xp' }, '+ ', check.xp, ' XP'),
        e('div', { className: 'ob-reward-sub' }, check.reward(answers))
      )
    );
  }

  window.ClarityOnboarding = ClarityOnboarding;
})();
