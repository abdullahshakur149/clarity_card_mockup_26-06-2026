/* aria.js — Aria AI companion character (replaces clara-briefing.js + clara-coach.js) */
(function () {
  'use strict';

  /* ── Briefing copy per modality ─────────────────────────────────── */
  var BRIEFS = {
    text:  { opener: 'One post. One idea.',         rest: " Let's write something worth reading."              },
    image: { opener: 'One frame stops the scroll.', rest: " Let's make it unmistakable."                       },
    video: { opener: 'Lights on, Director.',        rest: " Your audience is scrolling — let's make them stop." },
    audio: { opener: "Ears up. Mic's hot.",         rest: " Let's put something in their head they won't shake." }
  };

  var ACCENT_MAP = {
    text:  'var(--clr-text-mod)',
    image: 'var(--clr-image-mod)',
    video: 'var(--clr-video-mod)',
    audio: 'var(--clr-audio-mod)'
  };

  /* ── Step-contextual hints (keyed by SFHead h2 title) ───────────── */
  var STEP_HINTS = {
    video: {
      'Format & platform':  "Pick where your audience lives — format follows platform.",
      'Presenter & script': "Your presenter is your brand's face. Choose with intention.",
      'Voiceover':          "The right voice makes people lean in. Trust your gut.",
      'Generate':           "Three options incoming. Trust the fit scores.",
      'Variations preview': "Pick the angle that feels most like your brand.",
      'Preview & edit':     "Almost there. Tweak until it feels exactly right.",
      '_default':           "You're in the zone. Keep building."
    },
    audio: {
      'What are we creating?': "Every great audio piece starts with one clear intention.",
      'Vibe & voice':          "Voice sets the entire mood. Trust your instincts.",
      'Script':                "Here's a starting point — make it yours.",
      'Production':            "These details separate good audio from great audio.",
      'Generate':              "Mixing it all together. This is where it comes alive.",
      'Preview & edit':        "Listen back with fresh ears.",
      '_default':              "Sounding good. Keep building."
    },
    text: {
      'Write the brief': "One idea, sharpened until it cuts. That's all a great post needs.",
      'Generate':        "Generating 3 variations tuned to The Artisan Loyalist...",
      'Preview & edit':  "Read it out loud — if it flows, it lands.",
      '_default':        "Sharp copy starts with a clear idea. You've got this."
    },
    image: {
      'Describe the visual': "The best images stop the scroll before anyone reads a word.",
      'Generate':            "Rendering visuals matched to your brand kit...",
      'Preview & edit':      "Does it look like your brand at a glance? That's the test.",
      '_default':            "Make it unmistakable."
    }
  };

  /* ── Reaction pools ─────────────────────────────────────────────── */
  var CARD_PICKS = [
    "Bold choice. Let's run with it.",
    "That's going to resonate.",
    "Smart move. Locked in.",
    "Your audience will love this.",
    "Strong pick.",
    "That's the energy right there.",
    "Instinct over algorithm — respect.",
    "Sharp. Moving forward."
  ];
  var CHIP_PICKS = [
    "Great tone. Added to the mix.",
    "That vibe fits perfectly.",
    "Sharp instinct.",
    "Layering it in.",
    "The Artisan Loyalist will feel that.",
    "Nice combination building here."
  ];
  var DROPDOWN_PICKS = ["Dialled in.", "Noted. Good call.", "Set. Moving forward.", "Adjusted.", "Got it."];
  var TOGGLE_PICKS   = ["Got it — adjusted.", "Switched. Noted.", "Done. Keeping it tight."];
  var OVERRIDE_LINES = [
    "Heads up — the AI pick scored higher for The Artisan Loyalist. But your call.",
    "My recommendation was tuned to your persona. Worth a second look?",
    "Interesting override. You know your audience — go for it.",
    "That badge was there for a reason. Still yours to decide.",
    "Overriding the recommendation. Bold. Flag it in review if results differ."
  ];

  var CONFETTI = ['#ffc24b','#ff6f4d','#2bd4bb','#34d39e','#a78bfa','#56b6e8'];

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ── Drag position helpers ──────────────────────────────────────── */
  var POS_KEY = 'clarity_aria_pos';
  function loadPos()  { try { var s = localStorage.getItem(POS_KEY); if (s) return JSON.parse(s); } catch(e){} return null; }
  function savePos(p) { try { localStorage.setItem(POS_KEY, JSON.stringify(p)); } catch(e){} }
  function defaultPos() { return { x: window.innerWidth - 380, y: window.innerHeight - 170 }; }
  function clampPos(p) {
    return { x: Math.max(8, Math.min(window.innerWidth  - 120, p.x)),
             y: Math.max(8, Math.min(window.innerHeight - 170, p.y)) };
  }

  /* ── Micro celebration particles ───────────────────────────────── */
  function celebrate(x, y) {
    var host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:9998;overflow:visible;';
    document.body.appendChild(host);
    for (var i = 0; i < 14; i++) {
      var angle = (Math.PI * 2 * i / 14) - Math.PI / 2;
      var dist  = 34 + Math.random() * 28;
      var p     = document.createElement('div');
      var size  = 6 + Math.random() * 6;
      p.style.cssText = [
        'position:absolute', 'left:'+x+'px', 'top:'+y+'px',
        'width:'+size+'px',  'height:'+size+'px',
        'border-radius:'+(Math.random()>0.4?'50%':'3px'),
        'background:'+CONFETTI[i % CONFETTI.length],
        'animation:aria-particle 0.75s cubic-bezier(.2,.6,.35,1) '+(i*0.018)+'s forwards',
        '--ap-dx:'+(Math.cos(angle)*dist)+'px',
        '--ap-dy:'+(Math.sin(angle)*dist - 14)+'px'
      ].join(';');
      host.appendChild(p);
    }
    setTimeout(function(){ if(host.parentNode) host.parentNode.removeChild(host); }, 1000);
  }

  /* ── AI override detection ──────────────────────────────────────── */
  function isOverride(el) {
    var p = el.parentElement;
    if (!p) return false;
    return Array.from(p.children).some(function(s){ return s !== el && s.textContent.includes('AI PICK'); });
  }

  /* ═══════════════════════════════════════════════════════════════════
     ARIA CHARACTER SVG — viewBox 0 0 100 150
     Four expression states controlled by CSS class on the outer wrapper
  ═══════════════════════════════════════════════════════════════════ */
  function AriaCharacter(props) {
    var accent = props.accent || 'var(--clr-primary)';
    var w = props.size || 88;
    var h = Math.round(w * 1.5);

    var e = React.createElement;

    return e('svg', {
      width: w, height: h, viewBox: '0 0 100 150',
      className: 'aria-svg', 'aria-hidden': 'true',
      style: { '--aria-accent': accent }
    },
      /* ── Outfit / body ── */
      e('path', { d: 'M 6 150 L 6 104 Q 18 84 50 82 Q 82 84 94 104 L 94 150 Z', fill: '#0F2B4A' }),
      e('path', { d: 'M 43 85 L 50 97 L 57 85', fill: 'none', stroke: '#94A3B8', strokeWidth: 1.5 }),
      e('path', { d: 'M 6 116 Q 22 106 40 103', fill: 'none', stroke: '#1E4A7A', strokeWidth: 2 }),
      e('path', { d: 'M 94 116 Q 78 106 60 103', fill: 'none', stroke: '#1E4A7A', strokeWidth: 2 }),

      /* ── Neck ── */
      e('rect', { x: 43, y: 74, width: 14, height: 12, rx: 5, fill: '#F2B896' }),

      /* ── Head ── */
      e('ellipse', { cx: 50, cy: 48, rx: 28, ry: 30, fill: '#F2B896' }),

      /* ── Hair ── */
      e('ellipse', { cx: 50, cy: 23, rx: 28, ry: 18, fill: '#1A1A2E' }),
      e('ellipse', { cx: 22, cy: 46, rx: 7, ry: 17, fill: '#1A1A2E' }),
      e('ellipse', { cx: 78, cy: 46, rx: 7, ry: 17, fill: '#1A1A2E' }),
      e('path',    { d: 'M 22 27 Q 50 8 78 27 L 78 40 Q 50 36 22 40 Z', fill: '#1A1A2E' }),

      /* ── Ears (before headset) ── */
      e('ellipse', { cx: 22, cy: 50, rx: 5, ry: 6, fill: '#DF9070' }),
      e('ellipse', { cx: 78, cy: 50, rx: 5, ry: 6, fill: '#DF9070' }),

      /* ── Headset band ── */
      e('path', { d: 'M 22 43 Q 50 13 78 43', stroke: '#0D0D0D', strokeWidth: 5, fill: 'none', strokeLinecap: 'round' }),

      /* ── Headset ear cups ── */
      e('circle', { cx: 22, cy: 50, r: 10, fill: '#0D0D0D' }),
      e('circle', { cx: 22, cy: 50, r: 7,  fill: '#1C1C1C' }),
      e('circle', { cx: 78, cy: 50, r: 10, fill: '#0D0D0D' }),
      e('circle', { cx: 78, cy: 50, r: 7,  fill: '#1C1C1C' }),

      /* ── LED on left ear cup (accent colour) ── */
      e('circle', { cx: 22, cy: 50, r: 2.5, fill: accent }),

      /* ── Boom mic ── */
      e('path',   { d: 'M 22 59 Q 9 67 7 77',  stroke: '#0D0D0D', strokeWidth: 2.5, fill: 'none', strokeLinecap: 'round' }),
      e('circle', { cx: 7, cy: 81, r: 4.5, fill: '#0D0D0D' }),
      e('circle', { cx: 7, cy: 81, r: 2.5, fill: '#1C1C1C' }),
      e('circle', { cx: 7, cy: 81, r: 1,   fill: accent }),

      /* ══════════ FACE: IDLE ══════════ */
      e('g', { className: 'aria-face-idle' },
        e('ellipse', { cx: 38, cy: 50, rx: 8,   ry: 8.5,  fill: 'white' }),
        e('ellipse', { cx: 62, cy: 50, rx: 8,   ry: 8.5,  fill: 'white' }),
        e('circle',  { cx: 39, cy: 51, r: 5,    fill: '#4A90C4' }),
        e('circle',  { cx: 63, cy: 51, r: 5,    fill: '#4A90C4' }),
        e('circle',  { cx: 40, cy: 51, r: 2.8,  fill: '#111' }),
        e('circle',  { cx: 64, cy: 51, r: 2.8,  fill: '#111' }),
        e('circle',  { cx: 41, cy: 49.5, r: 1,  fill: 'white' }),
        e('circle',  { cx: 65, cy: 49.5, r: 1,  fill: 'white' }),
        e('path', { d: 'M 30 38 Q 38 33 46 38', stroke: '#1A1A2E', strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' }),
        e('path', { d: 'M 54 38 Q 62 33 70 38', stroke: '#1A1A2E', strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' }),
        e('path', { d: 'M 40 63 Q 50 71 60 63', stroke: '#C07850', strokeWidth: 2,   fill: 'none', strokeLinecap: 'round' })
      ),

      /* ══════════ FACE: EXCITED ══════════ */
      e('g', { className: 'aria-face-excited' },
        e('ellipse', { cx: 38, cy: 50, rx: 9,   ry: 9.5,  fill: 'white' }),
        e('ellipse', { cx: 62, cy: 50, rx: 9,   ry: 9.5,  fill: 'white' }),
        e('circle',  { cx: 39, cy: 51, r: 5.5,  fill: '#4A90C4' }),
        e('circle',  { cx: 63, cy: 51, r: 5.5,  fill: '#4A90C4' }),
        e('circle',  { cx: 40, cy: 51, r: 3,    fill: '#111' }),
        e('circle',  { cx: 64, cy: 51, r: 3,    fill: '#111' }),
        e('circle',  { cx: 41.2, cy: 49.2, r: 1.2, fill: 'white' }),
        e('circle',  { cx: 65.2, cy: 49.2, r: 1.2, fill: 'white' }),
        e('path', { d: 'M 30 35 Q 38 29 46 35', stroke: '#1A1A2E', strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' }),
        e('path', { d: 'M 54 35 Q 62 29 70 35', stroke: '#1A1A2E', strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' }),
        e('path', { d: 'M 38 63 Q 50 74 62 63', stroke: '#C07850', strokeWidth: 2.2, fill: 'none', strokeLinecap: 'round' }),
        e('ellipse', { cx: 28, cy: 58, rx: 5, ry: 3, fill: '#FFB5A7', opacity: 0.55 }),
        e('ellipse', { cx: 72, cy: 58, rx: 5, ry: 3, fill: '#FFB5A7', opacity: 0.55 })
      ),

      /* ══════════ FACE: THINKING ══════════ */
      e('g', { className: 'aria-face-thinking' },
        e('ellipse', { cx: 38, cy: 50, rx: 8,   ry: 7,    fill: 'white' }),
        e('ellipse', { cx: 62, cy: 50, rx: 8,   ry: 7,    fill: 'white' }),
        e('circle',  { cx: 39, cy: 51, r: 4.5,  fill: '#4A90C4' }),
        e('circle',  { cx: 63, cy: 51, r: 4.5,  fill: '#4A90C4' }),
        e('circle',  { cx: 40, cy: 51, r: 2.5,  fill: '#111' }),
        e('circle',  { cx: 64, cy: 51, r: 2.5,  fill: '#111' }),
        e('circle',  { cx: 41,  cy: 50, r: 0.9, fill: 'white' }),
        e('circle',  { cx: 65,  cy: 50, r: 0.9, fill: 'white' }),
        /* Left brow raised, right normal — quizzical */
        e('path', { d: 'M 30 35 Q 38 29 46 35', stroke: '#1A1A2E', strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' }),
        e('path', { d: 'M 54 39 Q 62 35 70 39', stroke: '#1A1A2E', strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' }),
        e('path', { d: 'M 42 64 Q 50 68 58 64', stroke: '#C07850', strokeWidth: 2,   fill: 'none', strokeLinecap: 'round' }),
        /* Thought bubbles */
        e('circle', { cx: 71, cy: 38, r: 2,   fill: '#CBD5E1' }),
        e('circle', { cx: 76, cy: 32, r: 3,   fill: '#CBD5E1' }),
        e('circle', { cx: 83, cy: 25, r: 4,   fill: '#CBD5E1' })
      ),

      /* ══════════ FACE: CELEBRATING ══════════ */
      e('g', { className: 'aria-face-celebrating' },
        /* Happy squint eyes */
        e('path', { d: 'M 29 50 Q 38 42 47 50', stroke: '#4A90C4', strokeWidth: 3.2, fill: 'none', strokeLinecap: 'round' }),
        e('path', { d: 'M 53 50 Q 62 42 71 50', stroke: '#4A90C4', strokeWidth: 3.2, fill: 'none', strokeLinecap: 'round' }),
        /* High eyebrows */
        e('path', { d: 'M 30 33 Q 38 27 46 33', stroke: '#1A1A2E', strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' }),
        e('path', { d: 'M 54 33 Q 62 27 70 33', stroke: '#1A1A2E', strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' }),
        /* Huge smile */
        e('path', { d: 'M 36 62 Q 50 76 64 62', stroke: '#C07850', strokeWidth: 2.5, fill: 'none', strokeLinecap: 'round' }),
        /* Star shapes */
        e('polygon', { points: '82,16 84,22 90,24 84,26 82,32 80,26 74,24 80,22', fill: accent }),
        e('polygon', { points: '15,22 16.5,27 22,28.5 16.5,30 15,35 13.5,30 8,28.5 13.5,27', fill: accent }),
        /* Big blush */
        e('ellipse', { cx: 27, cy: 59, rx: 7, ry: 4, fill: '#FFB5A7', opacity: 0.65 }),
        e('ellipse', { cx: 73, cy: 59, rx: 7, ry: 4, fill: '#FFB5A7', opacity: 0.65 })
      )
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     ARIA BRIEFING — pre-studio mission card (IGI-style bottom row)
  ═══════════════════════════════════════════════════════════════════ */
  function AriaBriefing(props) {
    var studioKey = props.studioKey;
    var onReady   = props.onReady;
    var brief     = BRIEFS[studioKey] || BRIEFS.text;
    var accent    = ACCENT_MAP[studioKey] || 'var(--clr-primary)';
    var lsKey     = 'clarity_briefed_' + studioKey;
    var fullText  = brief.opener + brief.rest;

    var _tS = React.useState('');   var typed    = _tS[0];    var setTyped    = _tS[1];
    var _dS = React.useState(false); var typeDone = _dS[0];   var setTypeDone = _dS[1];
    var _eS = React.useState(false); var exiting  = _eS[0];   var setExiting  = _eS[1];
    var _xS = React.useState('idle'); var expr     = _xS[0];  var setExpr     = _xS[1];

    function dismiss(markSeen) {
      if (markSeen) try { localStorage.setItem(lsKey, '1'); } catch(e){}
      setExpr('excited');
      setExiting(true);
      setTimeout(onReady, 280);
    }

    React.useEffect(function () {
      var i = 0;
      var iv = setInterval(function () {
        i++;
        setTyped(fullText.slice(0, i));
        if (i >= fullText.length) { clearInterval(iv); setTypeDone(true); setExpr('excited'); }
      }, 14);
      var autoT = null;
      try { if (localStorage.getItem(lsKey)) autoT = setTimeout(function(){ dismiss(false); }, 1800); } catch(e){}
      return function () { clearInterval(iv); if (autoT) clearTimeout(autoT); };
    }, []);

    function renderText() {
      var ol = brief.opener.length;
      if (!typed.length) return React.createElement('span', null, React.createElement('span', { className: 'aria-cursor' }, '|'));
      if (typed.length <= ol) return React.createElement('span', null,
        React.createElement('span', { style: { color: accent, fontWeight: 700 } }, typed),
        React.createElement('span', { className: 'aria-cursor' }, '|')
      );
      return React.createElement('span', null,
        React.createElement('span', { style: { color: accent, fontWeight: 700 } }, brief.opener),
        React.createElement('span', { style: { color: '#1a1a1a' } }, typed.slice(ol)),
        !typeDone && React.createElement('span', { className: 'aria-cursor' }, '|')
      );
    }

    return React.createElement('div', { className: 'aria-backdrop' + (exiting ? ' aria-exiting' : '') },
      React.createElement('div', { className: 'aria-briefing-row' },
        /* Character */
        React.createElement('div', { className: 'aria-' + expr },
          React.createElement(AriaCharacter, { accent: accent, size: 110 })
        ),
        /* Dialogue card */
        React.createElement('div', { className: 'aria-briefing-card' },
          React.createElement('div', { className: 'aria-card-name', style: { color: accent } }, 'Aria'),
          React.createElement('div', { className: 'aria-card-text' }, renderText()),
          React.createElement('div', { className: 'aria-card-actions' },
            React.createElement('button', {
              className: 'aria-btn-primary',
              style: { background: accent },
              onClick: function() { dismiss(true); }
            }, 'Lock in →'),
            React.createElement('button', { className: 'aria-btn-skip', onClick: function(){ dismiss(false); } }, 'Skip')
          )
        )
      )
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     ARIA WIDGET — persistent draggable corner companion
  ═══════════════════════════════════════════════════════════════════ */
  function AriaWidget(props) {
    var studioKey = props.studioKey;
    var accent    = props.accent || 'var(--clr-primary)';

    /* ── Position / drag ── */
    var _pS = React.useState(function(){ return loadPos() || defaultPos(); });
    var pos = _pS[0]; var setPos = _pS[1];
    var isDragging = React.useRef(false);
    var dragOff    = React.useRef({ x: 0, y: 0 });
    var curPos     = React.useRef(pos); curPos.current = pos;
    var _dgS = React.useState(false); var dragging = _dgS[0]; var setDragging = _dgS[1];

    /* ── Expression ── */
    var _exS = React.useState('idle'); var expr = _exS[0]; var setExpr = _exS[1];
    var exprT = React.useRef(null);
    function flashExpr(e, ms) {
      if (exprT.current) clearTimeout(exprT.current);
      setExpr(e);
      exprT.current = setTimeout(function(){ setExpr('idle'); }, ms || 2500);
    }

    /* ── Hint / bubble ── */
    var _hS = React.useState('');     var hint    = _hS[0]; var setHint    = _hS[1];
    var _vS = React.useState(false);  var vis     = _vS[0]; var setVis     = _vS[1];
    var _hdS = React.useState(false); var hiding  = _hdS[0]; var setHiding = _hdS[1];
    var hideT   = React.useRef(null);
    var cooldown = React.useRef(false);

    function showHint(text, ms, ex) {
      if (hideT.current) clearTimeout(hideT.current);
      setHiding(false); setHint(text); setVis(true);
      if (ex) flashExpr(ex, ms || 4500);
      hideT.current = setTimeout(function(){
        setHiding(true);
        setTimeout(function(){ setVis(false); setHiding(false); }, 240);
      }, ms || 4500);
    }

    /* ── Drag helpers ── */
    function startDrag(cx, cy) { isDragging.current = true; setDragging(true); dragOff.current = { x: cx - curPos.current.x, y: cy - curPos.current.y }; }
    function moveDrag(cx, cy)  { if (!isDragging.current) return; var np = clampPos({ x: cx - dragOff.current.x, y: cy - dragOff.current.y }); curPos.current = np; setPos(np); }
    function endDrag()         { if (!isDragging.current) return; isDragging.current = false; setDragging(false); savePos(curPos.current); }

    /* ── Effects ── */
    React.useEffect(function () {
      var mh = STEP_HINTS[studioKey] || {};
      var lastH = '';

      setTimeout(function(){ showHint(mh['_default'] || "Let's make something great.", 5000, 'excited'); }, 500);

      /* Step watcher */
      var obs = new MutationObserver(function(){
        var el = document.querySelector('.sf-step h2');
        if (!el) return;
        var t = el.textContent.trim();
        if (t === lastH) return;
        lastH = t;
        var txt = mh[t] || mh['_default'];
        if (txt) showHint(txt, 5000, 'excited');
      });
      obs.observe(document.body, { childList: true, subtree: true });

      /* Selection listeners */
      function onCard(e) {
        if (cooldown.current || e.target.closest('button')) return;
        if (e.target.closest('[style*="justify-content: space-between"]')) return;
        var card = e.target.closest('div[style*="cursor: pointer"]');
        if (!card) return;
        if (!card.querySelector('div[style*="fontWeight: 600"], div[style*="font-weight: 600"]')) return;
        var ov = isOverride(card);
        showHint(ov ? rand(OVERRIDE_LINES) : rand(CARD_PICKS), 3800, ov ? 'thinking' : 'excited');
        if (!ov) celebrate(e.clientX, e.clientY);
        cooldown.current = true; setTimeout(function(){ cooldown.current = false; }, 600);
      }
      function onChip(e) {
        if (cooldown.current) return;
        var chip = e.target.closest('span[style*="cursor: pointer"]');
        if (!chip || !chip.style.borderRadius) return;
        showHint(rand(CHIP_PICKS), 3200, 'excited');
        celebrate(e.clientX, e.clientY);
        cooldown.current = true; setTimeout(function(){ cooldown.current = false; }, 400);
      }
      function onToggle(e) {
        if (cooldown.current) return;
        var sw = e.target.closest('div[style*="border-radius: 11"]');
        if (!sw) return;
        showHint(rand(TOGGLE_PICKS), 2800, 'idle');
        cooldown.current = true; setTimeout(function(){ cooldown.current = false; }, 400);
      }
      function onSelect(e) {
        if (e.target.tagName !== 'SELECT') return;
        showHint(rand(DROPDOWN_PICKS), 2600, 'excited');
        var r = e.target.getBoundingClientRect();
        celebrate(r.left + r.width / 2, r.top);
      }

      function onMM(e) { moveDrag(e.clientX, e.clientY); }
      function onMU()  { endDrag(); }
      function onTM(e) { if (!isDragging.current) return; e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); }
      function onTE()  { endDrag(); }

      document.addEventListener('click',     onCard,   true);
      document.addEventListener('click',     onChip,   true);
      document.addEventListener('click',     onToggle, true);
      document.addEventListener('change',    onSelect, true);
      document.addEventListener('mousemove', onMM);
      document.addEventListener('mouseup',   onMU);
      document.addEventListener('touchmove', onTM, { passive: false });
      document.addEventListener('touchend',  onTE);

      return function(){
        if (hideT.current)  clearTimeout(hideT.current);
        if (exprT.current)  clearTimeout(exprT.current);
        obs.disconnect();
        document.removeEventListener('click',     onCard,   true);
        document.removeEventListener('click',     onChip,   true);
        document.removeEventListener('click',     onToggle, true);
        document.removeEventListener('change',    onSelect, true);
        document.removeEventListener('mousemove', onMM);
        document.removeEventListener('mouseup',   onMU);
        document.removeEventListener('touchmove', onTM);
        document.removeEventListener('touchend',  onTE);
      };
    }, [studioKey]);

    /* Bubble side flips based on position */
    var onRight = pos.x > window.innerWidth * 0.5;
    var br = onRight ? '14px 14px 4px 14px' : '14px 14px 14px 4px';

    return React.createElement('div', {
      className: 'aria-widget aria-' + expr,
      style: { position:'fixed', left: pos.x+'px', top: pos.y+'px', bottom:'auto', right:'auto',
               flexDirection: onRight ? 'row' : 'row-reverse' }
    },
      /* Dialogue cloud */
      vis && React.createElement('div', { className: 'aria-cloud-wrap' },
        React.createElement('div', {
          className: 'aria-cloud' + (hiding ? ' aria-cloud-hiding' : ''),
          style: { borderRadius: br }
        },
          React.createElement('div', { className: 'aria-cloud-name', style: { color: accent } }, 'Aria'),
          React.createElement('div', { className: 'aria-cloud-text' }, hint)
        )
      ),
      /* Character — drag handle */
      React.createElement('div', {
        className: 'aria-char-wrap' + (dragging ? ' aria-dragging' : ''),
        onMouseDown:  function(e){ e.preventDefault(); startDrag(e.clientX, e.clientY); },
        onTouchStart: function(e){ startDrag(e.touches[0].clientX, e.touches[0].clientY); }
      },
        React.createElement(AriaCharacter, { accent: accent, size: 90 })
      )
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     DIRECTOR'S CALL — one-time cinematic moment on first Content Engine entry
     after all three strategy pillars (Intelligence / Audience / Tasks) are done.
     Props: { earned, goal, strategyCards, onStart }
  ═══════════════════════════════════════════════════════════════════ */
  var DC_LINE = "Strategy locked and loaded. You know exactly who you’re talking to, why they care, and what you need to say. Time to make something they won’t forget.";
  var DC_LS   = 'clarity_director_seen';

  function DirectorsCall(props) {
    var earned         = props.earned || 0;
    var goal           = props.goal   || 650;
    var strategyCards  = props.strategyCards || [];
    var onStart        = props.onStart;

    var _tS = React.useState('');    var typed    = _tS[0];    var setTyped    = _tS[1];
    var _dS = React.useState(false); var typeDone = _dS[0];   var setTypeDone = _dS[1];
    var _eS = React.useState(false); var exiting  = _eS[0];   var setExiting  = _eS[1];
    var _xS = React.useState('celebrating'); var expr = _xS[0]; var setExpr = _xS[1];

    function dismiss() {
      try { localStorage.setItem(DC_LS, '1'); } catch(e) {}
      setExiting(true);
      setTimeout(onStart, 300);
    }

    React.useEffect(function () {
      /* settle from celebrating → excited → idle */
      var t1 = setTimeout(function(){ setExpr('excited'); }, 1600);
      var t2 = setTimeout(function(){ setExpr('idle'); },    3200);

      /* typewriter */
      var i = 0;
      var iv = setInterval(function () {
        i++;
        setTyped(DC_LINE.slice(0, i));
        if (i >= DC_LINE.length) { clearInterval(iv); setTypeDone(true); }
      }, 18);

      return function () { clearInterval(iv); clearTimeout(t1); clearTimeout(t2); };
    }, []);

    var pct = Math.min(100, Math.round(earned / goal * 100));

    return React.createElement('div', {
      className: 'aria-backdrop aria-dc' + (exiting ? ' aria-exiting' : '')
    },
      React.createElement('div', { className: 'aria-dc-row' },
        /* Character — bigger for this cinematic moment */
        React.createElement('div', { className: 'aria-' + expr },
          React.createElement(AriaCharacter, { accent: 'var(--clr-primary)', size: 148 })
        ),
        /* Briefing card */
        React.createElement('div', { className: 'aria-dc-card' },
          React.createElement('div', { className: 'aria-dc-eyebrow' }, "Director’s Call"),
          React.createElement('h2', { className: 'aria-dc-title' }, "Strategy locked.", React.createElement('br', null), "Time to create."),

          /* Strategy proof-points */
          React.createElement('div', { className: 'aria-dc-proof' },
            strategyCards.map(function(c, idx) {
              return React.createElement('div', { className: 'aria-dc-proof-row', key: idx },
                React.createElement('div', { className: 'aria-dc-proof-icon' },
                  /* inline SVG check mark — no Icon dependency */
                  React.createElement('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--clr-primary)', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
                    React.createElement('polyline', { points: '20 6 9 17 4 12' })
                  )
                ),
                React.createElement('div', { className: 'aria-dc-proof-text' },
                  React.createElement('span', { className: 'aria-dc-proof-label' }, c.label, ': '),
                  React.createElement('span', { className: 'aria-dc-proof-val' }, c.title)
                )
              );
            })
          ),

          /* Aria's typewriter line */
          React.createElement('div', { className: 'aria-dc-line' },
            React.createElement('span', { className: 'aria-dc-line-name' }, 'Aria'),
            React.createElement('div', { className: 'aria-dc-line-text' },
              typed,
              !typeDone && React.createElement('span', { className: 'aria-cursor' }, '|')
            )
          ),

          /* Points progress strip */
          React.createElement('div', { className: 'aria-dc-pts' },
            React.createElement('div', { className: 'aria-dc-pts-row' },
              React.createElement('span', null, 'Progress to free Aria access'),
              React.createElement('span', { className: 'aria-dc-pts-num' }, earned, ' / ', goal, ' pts')
            ),
            React.createElement('div', { className: 'aria-dc-bar' },
              React.createElement('div', { className: 'aria-dc-bar-fill', style: { width: pct + '%' } })
            )
          ),

          React.createElement('button', {
            className: 'aria-btn-primary',
            style: { background: 'var(--clr-primary)', marginTop: 20 },
            onClick: dismiss
          }, "Create first piece →")
        )
      )
    );
  }

  /* Check localStorage so the call never fires twice */
  function directorSeen() {
    try { return !!localStorage.getItem(DC_LS); } catch(e) { return false; }
  }

  window.AriaBriefing    = AriaBriefing;
  window.AriaWidget      = AriaWidget;
  window.DirectorsCall   = DirectorsCall;
  window.ariaDirectorSeen = directorSeen;

})();
