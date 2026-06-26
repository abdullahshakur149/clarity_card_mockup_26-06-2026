/* clara-coach.js — persistent draggable corner companion during studio flow */
(function () {

  /* ── Step-contextual hints ─────────────────────────────────────────── */
  var STEP_HINTS = {
    video: {
      'Format & platform':  "Pick where your audience lives first — format follows platform.",
      'Presenter & script': "Your presenter is your brand's face. Choose with intention.",
      'Voiceover':          "The right voice makes people lean in. Go with your gut.",
      'Generate':           "Three options incoming. Trust the fit scores.",
      'Variations preview': "Pick the angle that feels most like your brand.",
      'Preview & edit':     "Almost there. Tweak until it feels exactly right.",
      '_default':           "You're doing great, Director. Keep going."
    },
    audio: {
      'What are we creating?': "Every great audio piece starts with one clear intention.",
      'Vibe & voice':          "Voice sets the entire mood. Trust your instincts.",
      'Script':                "Clara drafted a starting point — make it yours.",
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

  /* ── Reaction pools ────────────────────────────────────────────────── */
  var CARD_PICKS = [
    "Bold choice. Let's run with it.",
    "Nice. Clara would've picked the same.",
    "That's going to resonate.",
    "Smart move. Locked in.",
    "Your audience will love this.",
    "Strong pick.",
    "That's the energy right there.",
    "Instinct over algorithm — respect."
  ];
  var CHIP_PICKS = [
    "Great tone. Added to the mix.",
    "That vibe fits perfectly.",
    "Sharp instinct.",
    "Layering it in.",
    "Nice combination building here.",
    "The Artisan Loyalist will feel that."
  ];
  var DROPDOWN_PICKS = [
    "Dialled in.",
    "Noted. Good call.",
    "Set. Moving forward.",
    "Adjusted. Nice.",
    "Clara approves."
  ];
  var TOGGLE_PICKS = [
    "Got it — adjusted.",
    "Switched. Noted.",
    "Done. Keeping it tight."
  ];
  var OVERRIDE_LINES = [
    "Heads up — the AI pick scored higher for The Artisan Loyalist. But your call.",
    "Clara's recommendation was tuned to your persona. Worth a second look?",
    "Interesting override. You know your audience — go for it.",
    "That AI badge was there for a reason. Still yours to decide.",
    "Overriding the AI pick. Bold. Just flag it in review if results differ."
  ];

  var CONFETTI_COLORS = ['#ffc24b', '#ff6f4d', '#2bd4bb', '#34d39e', '#a78bfa', '#56b6e8'];

  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ── Position helpers ──────────────────────────────────────────────── */
  var POS_KEY = 'clarity_coach_pos';

  function loadPos() {
    try { var s = localStorage.getItem(POS_KEY); if (s) return JSON.parse(s); } catch (e) {}
    return null;
  }
  function savePos(p) {
    try { localStorage.setItem(POS_KEY, JSON.stringify(p)); } catch (e) {}
  }
  function defaultPos() {
    return { x: window.innerWidth - 132, y: window.innerHeight - 148 };
  }
  function clampPos(p) {
    var W = window.innerWidth, H = window.innerHeight;
    return { x: Math.max(8, Math.min(W - 108, p.x)), y: Math.max(8, Math.min(H - 108, p.y)) };
  }

  /* ── Micro celebration particles ───────────────────────────────────── */
  function celebrate(x, y) {
    var host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:9998;overflow:visible;';
    document.body.appendChild(host);
    var count = 14;
    for (var i = 0; i < count; i++) {
      var angle = (Math.PI * 2 * i / count) - Math.PI / 2;
      var dist = 36 + Math.random() * 30;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist - 16;
      var size = 6 + Math.random() * 6;
      var color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      var p = document.createElement('div');
      p.style.cssText = [
        'position:absolute',
        'left:' + x + 'px', 'top:' + y + 'px',
        'width:' + size + 'px', 'height:' + size + 'px',
        'border-radius:' + (Math.random() > 0.4 ? '50%' : '3px'),
        'background:' + color,
        'animation:cc-particle 0.75s cubic-bezier(.2,.6,.35,1) ' + (i * 0.018) + 's forwards',
        '--cc-dx:' + dx + 'px', '--cc-dy:' + dy + 'px'
      ].join(';');
      host.appendChild(p);
    }
    setTimeout(function () { if (host.parentNode) host.parentNode.removeChild(host); }, 1000);
  }

  function isAIOverride(cardEl) {
    var parent = cardEl.parentElement;
    if (!parent) return false;
    return Array.from(parent.children).some(function (s) {
      return s !== cardEl && s.textContent.includes('AI PICK');
    });
  }

  /* ── Clara avatar SVG (100 × 100) ─────────────────────────────────── */
  function ClaraAvatarSmall(props) {
    var accent = props.accent;
    return React.createElement('svg', {
      width: 100, height: 100, viewBox: '0 0 100 100',
      className: 'cc-avatar-svg', 'aria-hidden': 'true'
    },
      React.createElement('circle', {
        cx: 50, cy: 50, r: 46, fill: 'none',
        stroke: accent, strokeWidth: 1.6, strokeDasharray: '10 6',
        className: 'cc-ring'
      }),
      React.createElement('circle', {
        cx: 50, cy: 50, r: 35,
        fill: 'color-mix(in srgb, ' + accent + ' 14%, var(--clr-card-2))',
        stroke: accent, strokeWidth: 1.2
      }),
      React.createElement('circle', { cx: 39, cy: 47, r: 4, fill: accent }),
      React.createElement('circle', { cx: 61, cy: 47, r: 4, fill: accent }),
      React.createElement('path', {
        d: 'M 39 60 Q 50 70 61 60',
        fill: 'none', stroke: accent, strokeWidth: 2.2, strokeLinecap: 'round'
      })
    );
  }

  /* ── ClaraCoach ────────────────────────────────────────────────────── */
  function ClaraCoach(props) {
    var studioKey = props.studioKey;
    var accent    = props.accent || 'var(--clr-primary)';

    /* Position state */
    var _posS     = React.useState(function () { return loadPos() || defaultPos(); });
    var pos       = _posS[0]; var setPos = _posS[1];

    /* Drag refs (no re-render on drag move) */
    var isDragging  = React.useRef(false);
    var dragOffset  = React.useRef({ x: 0, y: 0 });
    var currentPos  = React.useRef(pos);
    currentPos.current = pos;

    var _draggingS  = React.useState(false); /* only for cursor CSS */
    var dragging    = _draggingS[0]; var setDragging = _draggingS[1];

    /* Hint state */
    var _hintS    = React.useState('');
    var hint      = _hintS[0]; var setHint = _hintS[1];

    var _visS     = React.useState(false);
    var bubbleVis = _visS[0]; var setBubbleVis = _visS[1];

    var _hidingS  = React.useState(false);
    var hiding    = _hidingS[0]; var setHiding = _hidingS[1];

    var hideTimer = React.useRef(null);
    var cooldown  = React.useRef(false);

    function showHint(text, duration) {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setHiding(false);
      setHint(text);
      setBubbleVis(true);
      var ms = duration || 4500;
      hideTimer.current = setTimeout(function () {
        setHiding(true);
        setTimeout(function () { setBubbleVis(false); setHiding(false); }, 240);
      }, ms);
    }

    /* ── Drag handlers ── */
    function startDrag(clientX, clientY) {
      isDragging.current = true;
      setDragging(true);
      dragOffset.current = {
        x: clientX - currentPos.current.x,
        y: clientY - currentPos.current.y
      };
    }
    function moveDrag(clientX, clientY) {
      if (!isDragging.current) return;
      var newPos = clampPos({
        x: clientX - dragOffset.current.x,
        y: clientY - dragOffset.current.y
      });
      currentPos.current = newPos;
      setPos(newPos);
    }
    function endDrag() {
      if (!isDragging.current) return;
      isDragging.current = false;
      setDragging(false);
      savePos(currentPos.current);
    }

    /* ── Effects ── */
    React.useEffect(function () {
      var modHints = STEP_HINTS[studioKey] || {};
      var lastHeading = '';

      var initTimer = setTimeout(function () {
        showHint(modHints['_default'] || "Let's make something great.", 5000);
      }, 500);

      /* Step heading watcher */
      var stepObs = new MutationObserver(function () {
        var el = document.querySelector('.sf-step h2');
        if (!el) return;
        var title = el.textContent.trim();
        if (title === lastHeading) return;
        lastHeading = title;
        var text = modHints[title] || modHints['_default'];
        if (text) showHint(text, 5000);
      });
      stepObs.observe(document.body, { childList: true, subtree: true });

      /* Selection listeners */
      function onCardClick(e) {
        if (cooldown.current) return;
        if (e.target.closest('button')) return;
        if (e.target.closest('[style*="justify-content: space-between"]')) return;
        var card = e.target.closest('div[style*="cursor: pointer"]');
        if (!card) return;
        if (!card.querySelector('div[style*="fontWeight: 600"], div[style*="font-weight: 600"]')) return;
        var override = isAIOverride(card);
        showHint(override ? pickRandom(OVERRIDE_LINES) : pickRandom(CARD_PICKS), 3800);
        if (!override) celebrate(e.clientX, e.clientY);
        cooldown.current = true;
        setTimeout(function () { cooldown.current = false; }, 600);
      }
      function onChipClick(e) {
        if (cooldown.current) return;
        var chip = e.target.closest('span[style*="cursor: pointer"]');
        if (!chip) return;
        if (!chip.style.borderRadius) return;
        showHint(pickRandom(CHIP_PICKS), 3200);
        celebrate(e.clientX, e.clientY);
        cooldown.current = true;
        setTimeout(function () { cooldown.current = false; }, 400);
      }
      function onToggleClick(e) {
        if (cooldown.current) return;
        var sw = e.target.closest('div[style*="border-radius: 11"]');
        if (!sw) return;
        showHint(pickRandom(TOGGLE_PICKS), 2800);
        cooldown.current = true;
        setTimeout(function () { cooldown.current = false; }, 400);
      }
      function onSelectChange(e) {
        if (e.target.tagName !== 'SELECT') return;
        showHint(pickRandom(DROPDOWN_PICKS), 2600);
        var r = e.target.getBoundingClientRect();
        celebrate(r.left + r.width / 2, r.top);
      }

      /* Global drag listeners */
      function onMouseMove(e) { moveDrag(e.clientX, e.clientY); }
      function onMouseUp()    { endDrag(); }
      function onTouchMove(e) {
        if (!isDragging.current) return;
        e.preventDefault();
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
      function onTouchEnd()   { endDrag(); }

      document.addEventListener('click',      onCardClick,   true);
      document.addEventListener('click',      onChipClick,   true);
      document.addEventListener('click',      onToggleClick, true);
      document.addEventListener('change',     onSelectChange, true);
      document.addEventListener('mousemove',  onMouseMove);
      document.addEventListener('mouseup',    onMouseUp);
      document.addEventListener('touchmove',  onTouchMove, { passive: false });
      document.addEventListener('touchend',   onTouchEnd);

      return function () {
        clearTimeout(initTimer);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        stepObs.disconnect();
        document.removeEventListener('click',      onCardClick,   true);
        document.removeEventListener('click',      onChipClick,   true);
        document.removeEventListener('click',      onToggleClick, true);
        document.removeEventListener('change',     onSelectChange, true);
        document.removeEventListener('mousemove',  onMouseMove);
        document.removeEventListener('mouseup',    onMouseUp);
        document.removeEventListener('touchmove',  onTouchMove);
        document.removeEventListener('touchend',   onTouchEnd);
      };
    }, [studioKey]);

    /* Bubble appears on the side closer to screen centre */
    var onRight   = pos.x > window.innerWidth * 0.5;
    var bubbleRadius = onRight ? '16px 16px 4px 16px' : '16px 16px 16px 4px';

    return React.createElement('div', {
      className: 'cc-widget',
      style: {
        position: 'fixed',
        left: pos.x + 'px',
        top:  pos.y + 'px',
        bottom: 'auto', right: 'auto',
        flexDirection: onRight ? 'row' : 'row-reverse'
      }
    },
      /* speech bubble */
      bubbleVis && React.createElement('div', {
        className: 'cc-bubble' + (hiding ? ' cc-hiding' : ''),
        style: { borderRadius: bubbleRadius }
      }, hint),
      /* avatar — drag handle */
      React.createElement('div', {
        className: 'cc-avatar-wrap' + (dragging ? ' cc-dragging' : ''),
        onMouseDown: function (e) {
          e.preventDefault();
          startDrag(e.clientX, e.clientY);
        },
        onTouchStart: function (e) {
          startDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
        React.createElement(ClaraAvatarSmall, { accent: accent })
      )
    );
  }

  window.ClaraCoach = ClaraCoach;
})();
