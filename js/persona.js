/* ============================================================================
   persona.js — "The Circle" (Living Characters). The Persona Hub pillar.
   Exposes window.ClarityPersona({ idea, onChange, onBack }).
   Deliberately DIFFERENT feel from Strategic Planning: warm, human, character-led
   (no CAPCOM). Sub-pillars: Persona Space = The Circle (roster + Genesis create),
   Persona Simulations = The Conversation (interview; canned dialogue deepens with
   trust). Reuses the My Customers dossiers as seeds. Dialogue = window.ClarityPersonaScripts.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }
  function SCRIPTS() { return window.ClarityPersonaScripts || {}; }
  /* prefer idea-grounded dialogue (matched to the idea's offer) over the generic archetype banks */
  function bankFor(archetype, idea) {
    var desc = ((idea && idea.profile && idea.profile.desc) || '').toLowerCase();
    var g = window.ClarityPersonaGrounded || [];
    for (var i = 0; i < g.length; i++) { var m = g[i].match || []; for (var j = 0; j < m.length; j++) { if (m[j] && desc.indexOf(m[j]) >= 0 && g[i].scripts && g[i].scripts[archetype]) return g[i].scripts[archetype]; } }
    return (window.ClarityPersonaScripts || {})[archetype];
  }
  function offerOf(idea) {
    var d = ((idea && idea.profile && idea.profile.desc) || '').trim();
    if (!d) return 'your product';
    /* drop leading greetings/filler, then pull the product noun after an intent verb if present */
    var low = d.toLowerCase().replace(/^((hi|hey|hello|yo|ok|okay|so|um|well|alright|yeah|right)[\s,]+)+/, '');
    var m = low.match(/\b(?:produce|producing|make|making|build|building|sell|selling|launch|create|creating|start|starting|open|run|running|offer|offering)\s+(?:a |an |my |our )?([a-z0-9].{1,44})/);
    var core = m ? m[1] : low;
    /* cut trailing clauses / place / filler */
    core = core.replace(/\b(across|throughout|nationwide|globally|that|which|who|i['’]?m|im|i\s+am|we['’]?re|we\s+are|planning|going|meant|designed|based|for|to|and|so|in)\b.*$/i, '').trim();
    var w = core.split(/\s+/).filter(Boolean); if (w.length > 5) core = w.slice(0, 5).join(' ');
    core = core.replace(/[^\w'’\- ]+$/, '').replace(/\bf1\b/gi, 'F1').replace(/\bsaas\b/gi, 'SaaS').replace(/^(my|our|your)\s+/i, '').trim();
    if (!core || core.length < 2) return 'your product';
    return /^(a|an|the)\b/i.test(core) ? core : 'your ' + core;
  }

  /* ── archetype data (mirrors My Customers; keyed to the dialogue banks) ── */
  var ARCH = {
    'risk-reducer': { label: 'Risk-reducer', icon: 'ShieldCheck', age: 42, blurb: 'Wants proof and guarantees before committing.',
      traits: { 'Price sensitivity': 55, 'Brand loyalty': 82, 'Risk appetite': 22, 'Research depth': 85 },
      channels: ['Reviews & ratings', 'Word-of-mouth', 'Comparison sites'], cares: ['Trust & proof', 'Guarantees', 'Avoiding mistakes'],
      wtp: 'Mid — pays for assurance', greet: 'Before we start — what happens if this goes wrong for me?' },
    'performance': { label: 'Performance-driven', icon: 'Gauge', age: 35, blurb: 'Chases the best result — and pays for it.',
      traits: { 'Price sensitivity': 35, 'Brand loyalty': 60, 'Risk appetite': 55, 'Research depth': 90 },
      channels: ['Niche communities', 'Expert reviews', 'Spec comparisons'], cares: ['Best outcome', 'Specs & results', 'An edge'],
      wtp: 'High — pays for performance', greet: 'I benchmark everything. Show me it actually wins.' },
    'cost': { label: 'Cost-driven', icon: 'Tag', age: 29, blurb: 'Leads with price; loyal while the deal lasts.',
      traits: { 'Price sensitivity': 90, 'Brand loyalty': 35, 'Risk appetite': 50, 'Research depth': 60 },
      channels: ['Search & deal sites', 'Social offers', 'Marketplaces'], cares: ['Value for money', 'Deals', 'Not overpaying'],
      wtp: 'Low — value-led', greet: 'Let’s cut to it — what’s this going to cost me?' },
    'status': { label: 'Status-seeker', icon: 'Sparkles', age: 31, blurb: 'Buys for identity, image and being seen.',
      traits: { 'Price sensitivity': 30, 'Brand loyalty': 55, 'Risk appetite': 45, 'Research depth': 40 },
      channels: ['Instagram / TikTok', 'Influencers', 'Premium press'], cares: ['Identity & prestige', 'Being seen', 'Brand cachet'],
      wtp: 'Mid-high — pays for cachet', greet: 'First impressions matter. Make me look good for choosing you.' },
    'convenience': { label: 'Convenience-first', icon: 'Zap', age: 38, blurb: 'Wants it easy and fast — friction loses the sale.',
      traits: { 'Price sensitivity': 50, 'Brand loyalty': 58, 'Risk appetite': 30, 'Research depth': 35 },
      channels: ['App stores', 'Paid ads', 'One-tap checkout'], cares: ['Speed & ease', 'No friction', 'Reliability'],
      wtp: 'Mid — pays to save effort', greet: 'I’ve got about a minute. Make this easy.' },
    'community': { label: 'Community-led', icon: 'Users', age: 33, blurb: 'Buys into belonging, values and the story.',
      traits: { 'Price sensitivity': 50, 'Brand loyalty': 85, 'Risk appetite': 28, 'Research depth': 55 },
      channels: ['Community groups', 'Local events', 'Instagram'], cares: ['Belonging', 'Shared values', 'The story'],
      wtp: 'Mid — pays for values', greet: 'I buy from people I believe in. Tell me who you are.' }
  };
  var ARCH_ORDER = ['risk-reducer', 'performance', 'cost', 'status', 'convenience', 'community'];
  var NAMES = ['Sam', 'Priya', 'Luca', 'Bea', 'Theo', 'Mia', 'Sven', 'Nova', 'Owen', 'Lena', 'Marco', 'Ivy', 'Dara', 'Cole', 'Asha', 'Finn', 'Rhea', 'Nate', 'Yara', 'Otis'];
  var INTENTS = [
    { key: 'barrier',   unlocks: 'fears', qt: function (o) { return 'What’s the biggest thing stopping you buying ' + o + '?'; } },
    { key: 'current',   unlocks: 'story', qt: function (o) { return 'How do you handle this today, without ' + o + '?'; } },
    { key: 'switch',    unlocks: 'wants', qt: function (o) { return 'What would make you switch to ' + o + '?'; } },
    { key: 'price',     unlocks: 'pays',  qt: function (o) { return 'What would you actually pay for ' + o + '?'; } },
    { key: 'committee', unlocks: 'story', qt: function (o) { return 'Who else is in on the decision to buy ' + o + '?'; } },
    { key: 'regret',    unlocks: 'fears', qt: function (o) { return 'Tell me about a purchase like this you regretted.'; } }
  ];
  var ARCH_WHO = {
    'risk-reducer': 'cautious, proof-led buyer', 'performance': 'results-obsessed buyer who benchmarks everything',
    'cost': 'price-led buyer who compares relentlessly', 'status': 'image-led buyer who buys to be seen',
    'convenience': 'time-poor buyer who wants it effortless', 'community': 'values-led buyer who buys into the story'
  };
  var CHAPTERS = [
    { key: 'story', label: 'Their story' }, { key: 'wants', label: 'What they want' },
    { key: 'fears', label: 'What scares them' }, { key: 'pays', label: 'What they’d pay' }
  ];

  /* ── helpers ── */
  function h32(s) { var h = 2166136261 >>> 0; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
  function faceSeed(s) { return h32(s); }
  function clamp01(t) { return Math.max(0, Math.min(1, t)); }
  function hx(n) { n = Math.round(n).toString(16); return n.length < 2 ? '0' + n : n; }
  function hexLerp(a, b, t) { t = clamp01(t);
    var ar = parseInt(a.slice(1, 3), 16), ag = parseInt(a.slice(3, 5), 16), ab = parseInt(a.slice(5, 7), 16);
    var br = parseInt(b.slice(1, 3), 16), bg = parseInt(b.slice(3, 5), 16), bb = parseInt(b.slice(5, 7), 16);
    return '#' + hx(ar + (br - ar) * t) + hx(ag + (bg - ag) * t) + hx(ab + (bb - ab) * t); }
  function warmth(t) { return hexLerp('#5aa9e6', '#ffb454', (t || 0) / 100); }
  function tierFor(t) { return t >= 67 ? 'candid' : t >= 34 ? 'warm' : 'guarded'; }
  function moodFor(t) { return t >= 80 ? 'open' : t >= 50 ? 'warming' : t >= 25 ? 'neutral' : 'guarded'; }
  function trustLabel(t) { return t >= 100 ? 'Trusts you' : t >= 67 ? 'Confidant' : t >= 34 ? 'Acquaintance' : 'Stranger'; }
  function statusLine(t) { return t >= 100 ? 'Would tell you anything.' : t >= 67 ? 'Trusts you now.' : t >= 34 ? 'Starting to open up.' : t >= 12 ? 'Still sizing you up.' : 'You just met.'; }
  /* Trust Ladder — named rungs; the top rung is earned by fully KNOWING them (understanding) */
  var LADDER = [{ min: 0, label: 'Stranger' }, { min: 34, label: 'Acquaintance' }, { min: 67, label: 'Confidant' }, { min: 100, label: 'Inner Circle' }];
  function rungIndex(p) { var t = p.trust || 0; if (t >= 100 && (p.understanding || 0) >= 100) return 3; if (t >= 67) return 2; if (t >= 34) return 1; return 0; }
  function rungLabel(p) { return LADDER[rungIndex(p)].label; }
  /* questions that visibly "land" before the trust number moves */
  var REACTS = {
    barrier: 'They hold your gaze a second. “…not many people ask me that first.”',
    regret: 'A pause. “I don’t tell that story often.”',
    committee: '“Huh — you actually want to know who really decides.”',
    price: '“Careful. Now you’re getting personal.”'
  };
  var CHAP_INTENTS = { story: ['current', 'committee'], wants: ['switch'], fears: ['barrier', 'regret'], pays: ['price'] };
  function reunionLine(p) {
    var t = p.trust || 0;
    if (t >= 67) return 'You came back — not many do. Good to see you. Where were we?';
    if (t >= 34) return 'Back again? Alright, I’m listening. Pick up where we left off.';
    return 'Oh — it’s you again. Didn’t expect that. Go on, then.';
  }
  function normArch(a) { a = String(a || '').toLowerCase();
    if (a.indexOf('risk') >= 0) return 'risk-reducer'; if (a.indexOf('perf') >= 0) return 'performance';
    if (a.indexOf('cost') >= 0) return 'cost'; if (a.indexOf('status') >= 0) return 'status';
    if (a.indexOf('conven') >= 0) return 'convenience'; if (a.indexOf('commun') >= 0) return 'community'; return 'risk-reducer'; }
  function speak(text) { try { if (!window.speechSynthesis) return; var u = new SpeechSynthesisUtterance(String(text)); u.rate = 1; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } catch (e) {} }

  /* ── emoting SVG portrait ── */
  var SKINS = ['#f1c9a5', '#e7b38a', '#d69b6e', '#c07f4f', '#9c6238', '#7a4a2c'];
  var HAIRS = ['#241c17', '#3f2d20', '#6b4a30', '#a97c46', '#d8c07a', '#8b9199', '#b23a2e'];
  function PersonaFace(props) {
    var seed = (props.seed >>> 0) || 0, mood = props.mood || 'neutral', size = props.size || 64;
    var skin = SKINS[seed % SKINS.length], hair = HAIRS[(seed >> 3) % HAIRS.length], hs = (seed >> 6) % 3;
    var browTilt = mood === 'guarded' ? 3.2 : mood === 'warming' ? -1.2 : mood === 'open' ? -2.4 : 0.2;
    var browY = mood === 'open' ? 20 : mood === 'guarded' ? 23 : 21.5;
    var eyeR = mood === 'guarded' ? 1.7 : mood === 'open' ? 2.6 : 2.2;
    var mouth = mood === 'open' ? 'M22 43 Q32 53 42 43 Q32 48 22 43'
      : mood === 'warming' ? 'M24 44 Q32 50 40 44'
      : mood === 'guarded' ? 'M25 46 Q32 43 39 46'
      : 'M26 45 Q32 47 38 45';
    return e('svg', { viewBox: '0 0 64 64', width: size, height: size, className: 'pn-face' },
      hs === 1 && e('path', { d: 'M15 32 Q15 9 32 9 Q49 9 49 32 L49 52 Q48 41 43 41 L43 27 Q43 18 32 18 Q21 18 21 27 L21 41 Q16 41 15 52 Z', fill: hair, opacity: 0.95 }),
      e('ellipse', { cx: 32, cy: 35, rx: 15.5, ry: 17.5, fill: skin }),
      e('circle', { cx: 17, cy: 35, r: 2.8, fill: skin }), e('circle', { cx: 47, cy: 35, r: 2.8, fill: skin }),
      hs === 2
        ? e('path', { d: 'M19 27 Q21 17 32 17 Q43 17 45 27 Q40 23 32 23 Q24 23 19 27 Z', fill: hair })
        : e('path', { d: 'M18 31 Q17 15 32 15 Q47 15 46 31 Q43 23 32 22 Q21 23 18 31 Z', fill: hair }),
      e('line', { x1: 23, y1: browY + browTilt, x2: 29.5, y2: browY - browTilt, stroke: '#3a2a20', strokeWidth: 1.5, strokeLinecap: 'round' }),
      e('line', { x1: 34.5, y1: browY - browTilt, x2: 41, y2: browY + browTilt, stroke: '#3a2a20', strokeWidth: 1.5, strokeLinecap: 'round' }),
      e('circle', { cx: 26, cy: 31.5, r: eyeR, fill: '#2b2320' }), e('circle', { cx: 38, cy: 31.5, r: eyeR, fill: '#2b2320' }),
      (mood === 'open' || mood === 'warming') && e('g', { opacity: mood === 'open' ? 0.55 : 0.32 },
        e('circle', { cx: 22, cy: 39, r: 3, fill: '#ff8a7a' }), e('circle', { cx: 42, cy: 39, r: 3, fill: '#ff8a7a' })),
      e('path', { d: mouth, stroke: '#7a3f30', strokeWidth: 1.9, fill: mood === 'open' ? '#a85040' : 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
    );
  }

  /* ── model ── */
  function baseState() { return { trust: 0, understanding: 0, mood: 'guarded', chapters: { story: false, wants: false, fears: false, pays: false }, asked: {}, met: false }; }
  function makePersona(archId, nm) {
    var a = ARCH[archId] || ARCH['risk-reducer'];
    var name = nm || NAMES[Math.floor(Math.random() * NAMES.length)];
    var age = a.age + (Math.floor(Math.random() * 9) - 4);
    var p = { id: 'ps_' + slug(name) + '_' + (h32(name + archId + Math.floor(Math.random() * 99999)) % 99999),
      name: name, age: age, archetype: archId, face: faceSeed(name + archId),
      traits: a.traits, channels: a.channels, cares: a.cares, wtp: a.wtp, blurb: a.blurb, greet: a.greet };
    return Object.assign(p, baseState());
  }
  function fromSketch(sk) {
    var archId = normArch(sk.archetype || sk.tag || ''); var a = ARCH[archId] || ARCH['risk-reducer'];
    var p = { id: 'ps_' + slug(sk.name || 'x') + '_' + (h32(String(sk.name)) % 99999),
      name: sk.name || 'Someone', age: sk.age || a.age, archetype: archId, face: faceSeed(String(sk.name)),
      traits: sk.traits || a.traits, channels: sk.channels || a.channels, cares: sk.cares || a.cares,
      wtp: (sk.report && sk.report.wtp && sk.report.wtp.band) || a.wtp, blurb: sk.summary || a.blurb, greet: a.greet };
    return Object.assign(p, baseState());
  }

  function ClarityPersona(props) {
    var idea = props.idea || {}, onBack = props.onBack, onChange = props.onChange;
    var offer = offerOf(idea);

    var seedInit = function () {
      if (idea.personas != null) return idea.personas;
      var sk = (idea.missions && idea.missions.customers && idea.missions.customers.sketches) || [];
      return sk.map(fromSketch);
    };
    var ps = React.useState(seedInit); var personas = ps[0], setPersonas = ps[1];
    var vw = React.useState('circle'); var view = vw[0], setView = vw[1];
    var ci = React.useState(null); var curId = ci[0], setCurId = ci[1];
    var mg = React.useState([]); var msgs = mg[0], setMsgs = mg[1];
    var vc = React.useState(true); var voice = vc[0], setVoice = vc[1];
    var gp = React.useState('pick'); var gstep = gp[0], setGstep = gp[1];
    var ga = React.useState(null); var genArch = ga[0], setGenArch = ga[1];   /* archetype chosen for the new persona */
    var gb = React.useState({ name: '', age: '', desc: '', cares: '', trigger: '' }); var build = gb[0], setBuild = gb[1];  /* sajood's 5 build questions */
    var gr = React.useState(0); var greveal = gr[0], setGreveal = gr[1];
    var newRef = React.useRef(null);
    var bl = React.useState(0); var blip = bl[0], setBlip = bl[1];       /* warmth bloom trigger */
    var rp = React.useState(0); var rungPop = rp[0], setRungPop = rp[1]; /* ember burst on rung-up */
    var ld = React.useState(''); var landed = ld[0], setLanded = ld[1];  /* transient "that landed" caption */
    var landedRef = React.useRef(null);
    var rt = React.useState(false); var returning = rt[0], setReturning = rt[1];  /* "they remember you" */
    var tb = React.useState('talk'); var tab = tb[0], setTab = tb[1];             /* Talk | Notebook */

    React.useEffect(function () { if (onChange) onChange({ personas: personas }); }, [personas]);
    React.useEffect(function () { return function () { try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {} }; }, []);

    function curPersona() { for (var i = 0; i < personas.length; i++) if (personas[i].id === curId) return personas[i]; return null; }
    function updatePersona(id, patch) { setPersonas(function (list) { return list.map(function (p) { return p.id === id ? Object.assign({}, p, patch) : p; }); }); }
    function addPersona(p) { setPersonas(function (list) { return list.concat([p]); }); }

    /* genesis awakening cinematic */
    React.useEffect(function () {
      if (view !== 'genesis' || gstep !== 'awaken' || !newRef.current) return;
      var n = 0; setGreveal(0);
      var iv = setInterval(function () { n++; setGreveal(n); if (n >= 4) clearInterval(iv); }, 520);
      var ts = setTimeout(function () { var np = newRef.current; if (np) speak((bankFor(np.archetype, idea) || {}).greeting || np.greet); }, 1750);
      var td = setTimeout(function () {
        var np = newRef.current;
        setGstep('pick');
        if (np) {
          addPersona(np); newRef.current = null;
          /* land straight in the new persona's conversation, not back on the roster */
          setCurId(np.id); setMsgs([]); setTab('talk'); setReturning(false); setView('conversation');
        } else {
          setView('circle');
        }
      }, 3500);
      return function () { clearInterval(iv); clearTimeout(ts); clearTimeout(td); };
    }, [view, gstep]);

    function startGenesis() { setGstep('pick'); setView('genesis'); }
    /* picking an archetype now opens the build form (sajood's 5 questions) */
    function pickArch(id) { setGenArch(id); setBuild({ name: '', age: '', desc: '', cares: '', trigger: '' }); setGstep('build'); }
    function setBuildField(k, v) { setBuild(function (b) { var o = Object.assign({}, b); o[k] = v; return o; }); }
    function genesisCreate() {
      var id = genArch || 'risk-reducer';
      var b = build || {};
      var name = (b.name || '').trim() || NAMES[Math.floor(Math.random() * NAMES.length)];
      var p = makePersona(id, name);
      if ((b.age || '').trim()) p.age = b.age.trim();
      if ((b.desc || '').trim()) p.blurb = b.desc.trim();
      if ((b.cares || '').trim()) p.mattersMost = b.cares.trim();   /* kept separate; archetype cares chips stay clean */
      if ((b.trigger || '').trim()) p.trigger = b.trigger.trim();
      newRef.current = p; setGstep('awaken');
    }
    function openConversation(id) {
      var p = null; for (var i = 0; i < personas.length; i++) if (personas[i].id === id) p = personas[i];
      setCurId(id); setMsgs([]); setTab('talk'); setReturning(!!(p && p.met)); setView('conversation');
      if (p) { try { updatePersona(id, { lastVisit: Date.now() }); } catch (e) {} }
    }

    function ask(key) {
      var p = curPersona(); if (!p) return;
      var s = bankFor(p.archetype, idea); if (!s || !s.intents || !s.intents[key]) return;
      var it = s.intents[key], meta = null;
      for (var i = 0; i < INTENTS.length; i++) if (INTENTS[i].key === key) { meta = INTENTS[i]; break; }
      var answer = it[tierFor(p.trust)] || it.warm || it.guarded;
      var justAsked = !(p.asked && p.asked[key]);
      var prevRung = rungIndex(p);
      var newTrust = Math.min(100, (p.trust || 0) + 15);
      var chapters = Object.assign({}, p.chapters); chapters[meta.unlocks] = true;
      var asked = Object.assign({}, p.asked || {}); asked[key] = true;
      var uc = 0; for (var c = 0; c < CHAPTERS.length; c++) if (chapters[CHAPTERS[c].key]) uc++;
      var understanding = Math.round(uc / CHAPTERS.length * 100);
      updatePersona(p.id, { trust: newTrust, chapters: chapters, understanding: understanding, mood: moodFor(newTrust), asked: asked, met: true });
      setBlip(function (x) { return x + 1; });   /* warmth ring blooms on every tick */
      if (REACTS[key]) { setLanded(REACTS[key]); if (landedRef.current) clearTimeout(landedRef.current); landedRef.current = setTimeout(function () { setLanded(''); }, 2800); }
      var newRung = rungIndex({ trust: newTrust, understanding: understanding });
      var add = [{ who: 'you', text: meta.qt(offer) }, { who: 'them', text: answer, fragment: justAsked ? it.fragment : null }];
      if (newRung > prevRung) { setRungPop(function (x) { return x + 1; }); add.push({ who: 'system', text: 'You’ve reached ' + LADDER[newRung].label + ' with ' + p.name + '.' }); }
      setMsgs(function (m) { return m.concat(add); });
      if (voice) speak(answer);
    }
    function confess() {
      var p = curPersona(); if (!p) return; var s = bankFor(p.archetype, idea); if (!s) return;
      updatePersona(p.id, { confessed: true });
      setMsgs(function (m) { return m.concat([{ who: 'you', text: 'Level with me — what’s the truth you wouldn’t tell a stranger?' }, { who: 'them', text: s.confession, confession: true }]); });
      if (voice) speak(s.confession);
    }

    function bg() { return e('div', { className: 'pn-bg' }, e('div', { className: 'pn-bg-glow' }), e('div', { className: 'pn-bg-vignette' })); }
    function shell(inner) {
      return e('div', { className: 'pn-root' }, bg(),
        e('div', { className: 'pf-topbar' },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
            e('span', { className: 'pf-wordmark' }, 'Clarity'),
            e('span', { className: 'pf-hide-sm' }, 'Your journey · The Circle')),
          e('div', { className: 'pf-tele' }, e('span', { className: 'pf-hide-sm' }, idea.name || ''))),
        e('div', { className: 'pn-main' }, inner));
    }

    function chapterRow(p) { return e('div', { className: 'pn-chapters' }, CHAPTERS.map(function (c) { return e('span', { key: c.key, className: 'pn-chapter' + (p.chapters[c.key] ? ' lit' : '') }, c.label); })); }
    function portrait(p, size, cls) { return e('div', { className: 'pn-portrait' + (cls ? ' ' + cls : ''), style: { '--ring': warmth(p.trust) } }, e(PersonaFace, { seed: p.face, mood: p.mood, size: size })); }

    /* ── GENESIS ── */
    if (view === 'genesis') {
      if (gstep === 'awaken') {
        var np = newRef.current || {};
        return shell(e('div', { className: 'pn-awakenwrap' },
          e('div', { className: 'pn-awaken pn-r' + Math.min(greveal, 4) },
            e(PersonaFace, { seed: np.face || 0, mood: greveal >= 3 ? 'warming' : greveal >= 2 ? 'neutral' : 'guarded', size: 150 })),
          e('div', { className: 'pn-awaken-cap' }, greveal < 3 ? '…coming to life' : (np.name || 'Someone') + ' is here.'),
          greveal >= 3 && e('div', { className: 'pn-firstwords' }, '“' + ((bankFor(np.archetype, idea) || {}).greeting || np.greet || '') + '”')
        ));
      }
      if (gstep === 'build') {
        var ba = ARCH[genArch] || ARCH['risk-reducer'];
        var bfield = function (label, key, ph, multi) {
          return e('div', { className: 'pn-field' },
            e('label', { className: 'pn-q' }, label),
            multi
              ? e('textarea', { className: 'pf-input pn-input', rows: 2, value: build[key], placeholder: ph, onChange: function (ev) { setBuildField(key, ev.target.value); } })
              : e('input', { className: 'pf-input pn-input', value: build[key], placeholder: ph, onChange: function (ev) { setBuildField(key, ev.target.value); } }));
        };
        return shell(e(React.Fragment, null,
          e('button', { className: 'id-back', onClick: function () { setGstep('pick'); } }, '‹ Choose someone else'),
          e('div', { className: 'pn-eyebrow' }, 'Genesis'),
          e('h1', { className: 'pn-title' }, 'Tell me about them'),
          e('p', { className: 'pn-lead' }, 'A few details bring your ' + String(ba.label || 'customer').toLowerCase() + ' to life. Leave any blank and I’ll fill it in.'),
          e('div', { className: 'pn-build' },
            bfield('What’s your customer’s name?', 'name', 'e.g. Maya Holloway'),
            bfield('How old are they?', 'age', 'e.g. 28–45'),
            bfield('Describe them in one line', 'desc', 'e.g. Local foodie who values quality and shops small'),
            bfield('What matters most to them?', 'cares', 'e.g. They love supporting local businesses', true),
            bfield('What makes them decide to buy?', 'trigger', 'e.g. Seeing a limited batch they don’t want to miss out on', true)),
          e('button', { className: 'pf-cta pn-cta', onClick: genesisCreate }, 'Bring them to life →')
        ));
      }
      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: function () { setView('circle'); } }, '‹ The Circle'),
        e('div', { className: 'pn-eyebrow' }, 'Genesis'),
        e('h1', { className: 'pn-title' }, 'Bring a customer to life'),
        e('p', { className: 'pn-lead' }, 'Choose who steps into the room. They’ll wake up — then you can get to know them.'),
        e('div', { className: 'pn-archgrid' }, ARCH_ORDER.map(function (id) {
          var a = ARCH[id];
          return e('button', { key: id, className: 'pn-arch', onClick: function () { pickArch(id); } },
            e('span', { className: 'pn-arch-ic' }, e(Icon, { name: a.icon, size: 20 })),
            e('div', { className: 'pn-arch-l' }, a.label),
            e('div', { className: 'pn-arch-b' }, a.blurb));
        }))
      ));
    }

    /* ── CONVERSATION ── */
    if (view === 'conversation') {
      var p = curPersona();
      if (!p) return shell(e('button', { className: 'id-back', onClick: function () { setView('circle'); } }, '‹ The Circle'));
      var sc = bankFor(p.archetype, idea) || {};
      var collected = Object.keys(p.asked || {}).length;
      var dossierNode = e('div', { className: 'pn-dossier' },
        p.confessed && e('div', { className: 'pn-keepsake' },
          e('div', { className: 'pn-keepsake-l' }, e(Icon, { name: 'Heart', size: 13 }), 'Told you in confidence'),
          e('div', { className: 'pn-keepsake-t' }, sc.confession || ''),
          e('div', { className: 'pn-keepsake-sig' }, '— ' + p.name)),
        CHAPTERS.map(function (ch) {
          var keys = CHAP_INTENTS[ch.key] || [];
          var frags = keys.filter(function (k) { return p.asked && p.asked[k]; }).map(function (k) { return ((sc.intents || {})[k] || {}).fragment; }).filter(Boolean);
          return e('div', { key: ch.key, className: 'pn-dsec' },
            e('div', { className: 'pn-dsec-h' + (frags.length ? ' lit' : '') }, ch.label),
            frags.length
              ? e('div', { className: 'pn-dcards' }, frags.map(function (f, i) { return e('div', { key: i, className: 'pn-dcard' }, f); }))
              : e('div', { className: 'pn-dempty' }, 'Still getting to know them.'));
        }));
      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: function () { setView('circle'); } }, '‹ The Circle'),
        e('div', { className: 'pn-convhead' },
          e('div', { className: 'pn-livewrap' },
            e('div', { className: 'pn-portrait lg', style: { '--ring': warmth(p.trust) } }, e(PersonaFace, { seed: p.face, mood: p.mood, size: 64 })),
            e('span', { className: 'pn-bloom', key: 'b' + blip }),
            rungPop > 0 && e('span', { className: 'pn-embers', key: 'e' + rungPop }, [0, 1, 2, 3, 4, 5].map(function (n) { return e('i', { key: n, className: 'em em' + n }); }))),
          e('div', { className: 'pn-convid' },
            e('div', { className: 'pn-convname' }, p.name + ', ' + p.age),
            e('div', { className: 'pn-card-arch' }, e(Icon, { name: (ARCH[p.archetype] || {}).icon, size: 12 }), (ARCH[p.archetype] || {}).label)),
          e('button', { className: 'pn-voice' + (voice ? ' on' : ''), onClick: function () { setVoice(!voice); } }, e(Icon, { name: voice ? 'Volume2' : 'VolumeX', size: 14 }), voice ? 'Face-to-face' : 'Muted')),
        e('div', { className: 'pn-scene' },
          'You’re sitting down with ', e('b', null, p.name), ' — a ', (ARCH_WHO[p.archetype] || 'buyer'), ' weighing up ', e('b', null, offer), '. They open up the more you talk.'),
        e('div', { className: 'pn-rel' },
          e('div', { className: 'pn-rel-row' },
            e('span', { className: 'pn-rel-l' }, rungLabel(p)),
            e('div', { className: 'pn-rel-bar' }, e('i', { style: { width: p.trust + '%', background: warmth(p.trust) } })),
            e('span', { className: 'pn-rel-v' }, 'You know ' + p.understanding + '%')),
          chapterRow(p)),
        e('div', { className: 'pn-tabs' },
          e('button', { className: 'pn-tab' + (tab === 'talk' ? ' on' : ''), onClick: function () { setTab('talk'); } }, 'Talk'),
          e('button', { className: 'pn-tab' + (tab === 'notebook' ? ' on' : ''), onClick: function () { setTab('notebook'); } }, e(Icon, { name: 'BookOpen', size: 13 }), ' Notebook', collected > 0 ? (' · ' + collected) : '')),
        tab === 'notebook' ? dossierNode : e(React.Fragment, null,
          landed && e('div', { className: 'pn-landed' }, landed),
          e('div', { className: 'pn-thread' },
            msgs.length === 0 && e('div', { className: 'pn-answerwrap' }, e('div', { className: 'pn-bubble them' }, returning ? reunionLine(p) : (sc.greeting || p.greet))),
            msgs.map(function (m, i) {
              if (m.who === 'system') return e('div', { key: i, className: 'pn-sys' }, e('span', null, m.text));
              if (m.who === 'you') return e('div', { key: i, className: 'pn-bubble you' }, m.text);
              return e('div', { key: i, className: 'pn-answerwrap' },
                e('div', { className: 'pn-bubble them' + (m.confession ? ' confession' : '') }, m.text),
                m.fragment && e('div', { className: 'pn-fragment' }, e(Icon, { name: 'Sparkles', size: 13 }), m.fragment));
            })),
          p.trust >= 100 && e('button', { className: 'pn-confess', onClick: confess }, e(Icon, { name: 'Heart', size: 15 }), 'Ask for the truth they’d never tell a stranger'),
          e('div', { className: 'pn-askhint' }, p.trust >= 34 ? 'They’re opening up — dig deeper.' : 'Ask anything. They warm up the more you talk.'),
          e('div', { className: 'pn-asks' }, INTENTS.map(function (it) {
            return e('button', { key: it.key, className: 'pn-ask', onClick: function () { ask(it.key); } }, it.qt(offer));
          })))
      ));
    }

    /* ── THE CIRCLE (default) ── */
    var roster = personas.slice().sort(function (a, b) { return (b.trust || 0) - (a.trust || 0); });
    var avgTrust = personas.length ? Math.round(personas.reduce(function (s, x) { return s + (x.trust || 0); }, 0) / personas.length) : 0;
    var vouch = personas.filter(function (x) { return (x.trust || 0) >= 67; }).length;
    var hearthLine = vouch >= 1 ? (vouch === 1 ? 'One of them would vouch for you now.' : vouch + ' of them would vouch for you now.') : 'Sit down with someone — they warm up as you talk.';
    return shell(e(React.Fragment, null,
      e('button', { className: 'id-back', onClick: onBack }, '‹ Hub'),
      e('div', { className: 'pn-eyebrow' }, 'The Circle'),
      e('h1', { className: 'pn-title' }, 'The people behind the plan'),
      e('p', { className: 'pn-lead' }, 'Your customers — as people. Sit down, get to know them, and they’ll tell you what the research never could.'),
      personas.length > 0 && e('div', { className: 'pn-hearth' },
        e('div', { className: 'pn-hearth-ring', style: { '--ring': warmth(avgTrust) } }, e('span', null, avgTrust + '%')),
        e('div', null,
          e('div', { className: 'pn-hearth-l' }, 'The Circle’s warmth'),
          e('div', { className: 'pn-hearth-s' }, hearthLine))),
      e('div', { className: 'pn-grid' },
        roster.map(function (p, i) {
          return e('button', { key: p.id, className: 'pn-card', style: { animationDelay: (0.06 * i + 0.12) + 's' }, onClick: function () { openConversation(p.id); } },
            (p.met && (p.understanding || 0) < 100) && e('span', { className: 'pn-pip', title: 'They’ve been thinking about you' }),
            e('div', { className: 'pn-card-top' },
              portrait(p, 56),
              e('div', { className: 'pn-card-id' },
                e('div', { className: 'pn-card-name' }, p.name + ', ' + p.age),
                e('div', { className: 'pn-card-arch' }, e(Icon, { name: (ARCH[p.archetype] || {}).icon || 'User', size: 11 }), (ARCH[p.archetype] || {}).label || p.archetype))),
            e('div', { className: 'pn-card-status' }, statusLine(p.trust)),
            chapterRow(p),
            e('div', { className: 'pn-card-foot' },
              e('span', { className: 'pn-trustlabel' }, rungLabel(p)),
              e('span', { className: 'pn-sit' }, 'Sit down →')));
        }),
        e('button', { className: 'pn-card pn-new', style: { animationDelay: (0.06 * personas.length + 0.12) + 's' }, onClick: startGenesis },
          e('span', { className: 'pn-new-ic' }, e(Icon, { name: 'UserPlus', size: 24 })),
          e('div', { className: 'pn-new-l' }, 'Someone new'),
          e('div', { className: 'pn-new-s' }, 'Bring a customer to life'))
      )
    ));
  }

  window.ClarityPersona = ClarityPersona;
})();
