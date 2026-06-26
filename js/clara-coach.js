/* clara-coach.js — persistent corner companion during studio flow (Approach B) */
(function () {

  /* ── Step-contextual hints (keyed by SFHead h2 title) ─────────────── */
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

  /* When user overrides an AI-recommended card */
  var OVERRIDE_LINES = [
    "Heads up — the AI pick scored higher for The Artisan Loyalist. But your call.",
    "Clara's recommendation was tuned to your persona. Worth a second look?",
    "Interesting override. You know your audience — go for it.",
    "That AI badge was there for a reason. Still yours to decide.",
    "Overriding the AI pick. Bold. Just flag it in review if results differ."
  ];

  /* Celebration particle colours */
  var CONFETTI_COLORS = ['#ffc24b', '#ff6f4d', '#2bd4bb', '#34d39e', '#a78bfa', '#56b6e8'];

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ── Micro celebration — particle burst at click position ──────────── */
  function celebrate(x, y) {
    var host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:9998;overflow:visible;';
    document.body.appendChild(host);
    var count = 12;
    for (var i = 0; i < count; i++) {
      var angle = (Math.PI * 2 * i / count) - Math.PI / 2;
      var dist = 32 + Math.random() * 26;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist - 14;
      var size = 5 + Math.random() * 5;
      var color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      var isRound = Math.random() > 0.4;
      var p = document.createElement('div');
      p.style.cssText = [
        'position:absolute',
        'left:' + x + 'px', 'top:' + y + 'px',
        'width:' + size + 'px', 'height:' + size + 'px',
        'border-radius:' + (isRound ? '50%' : '2px'),
        'background:' + color,
        'animation:cc-particle 0.7s cubic-bezier(.2,.6,.35,1) ' + (i * 0.018) + 's forwards',
        '--cc-dx:' + dx + 'px', '--cc-dy:' + dy + 'px'
      ].join(';');
      host.appendChild(p);
    }
    setTimeout(function () { if (host.parentNode) host.parentNode.removeChild(host); }, 900);
  }

  /* ── Detect if clicking a card that overrides an AI recommendation ── */
  function isAIOverride(cardEl) {
    var parent = cardEl.parentElement;
    if (!parent) return false;
    return Array.from(parent.children).some(function (s) {
      return s !== cardEl && s.textContent.includes('AI PICK');
    });
  }

  /* ── Small Clara SVG (now 76 × 76) ────────────────────────────────── */
  function ClaraAvatarSmall(props) {
    var accent = props.accent;
    return React.createElement('svg', {
      width: 76, height: 76, viewBox: '0 0 76 76',
      className: 'cc-avatar-svg', 'aria-hidden': 'true'
    },
      React.createElement('circle', {
        cx: 38, cy: 38, r: 34, fill: 'none',
        stroke: accent, strokeWidth: 1.4, strokeDasharray: '8 5',
        className: 'cc-ring'
      }),
      React.createElement('circle', {
        cx: 38, cy: 38, r: 26,
        fill: 'color-mix(in srgb, ' + accent + ' 14%, var(--clr-card-2))',
        stroke: accent, strokeWidth: 1
      }),
      React.createElement('circle', { cx: 30, cy: 35, r: 3, fill: accent }),
      React.createElement('circle', { cx: 46, cy: 35, r: 3, fill: accent }),
      React.createElement('path', {
        d: 'M 30 45 Q 38 52 46 45',
        fill: 'none', stroke: accent, strokeWidth: 1.8, strokeLinecap: 'round'
      })
    );
  }

  /* ── ClaraCoach component ──────────────────────────────────────────── */
  function ClaraCoach(props) {
    var studioKey = props.studioKey;
    var accent    = props.accent || 'var(--clr-primary)';

    var _hintS      = React.useState('');
    var hint        = _hintS[0]; var setHint = _hintS[1];

    var _visS       = React.useState(false);
    var bubbleVis   = _visS[0]; var setBubbleVis = _visS[1];

    var _hidingS    = React.useState(false);
    var hiding      = _hidingS[0]; var setHiding = _hidingS[1];

    var hideTimer   = React.useRef(null);
    var cooldown    = React.useRef(false); /* debounce rapid clicks */

    /* Show a hint in the bubble, auto-hide after `duration` ms */
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

    React.useEffect(function () {
      var modHints    = STEP_HINTS[studioKey] || {};
      var lastHeading = '';

      /* Greet on mount */
      var initTimer = setTimeout(function () {
        showHint(modHints['_default'] || "Let's make something great.", 5000);
      }, 500);

      /* ── Step heading watcher ── */
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

      /* ── Selection event listeners ── */

      /* CARD picks */
      function onCardClick(e) {
        if (cooldown.current) return;
        /* Exclude button elements */
        if (e.target.closest('button')) return;
        /* Exclude the exit/cancel/back/next footer buttons */
        if (e.target.closest('[style*="justify-content: space-between"]')) return;

        var card = e.target.closest('div[style*="cursor: pointer"]');
        if (!card) return;
        /* Must have a visible title child (SFPickCard pattern) */
        if (!card.querySelector('div[style*="fontWeight: 600"], div[style*="font-weight: 600"]')) return;

        var override = isAIOverride(card);
        var line = override ? pickRandom(OVERRIDE_LINES) : pickRandom(CARD_PICKS);
        showHint(line, 3800);
        if (!override) celebrate(e.clientX, e.clientY);

        cooldown.current = true;
        setTimeout(function () { cooldown.current = false; }, 600);
      }

      /* CHIP picks */
      function onChipClick(e) {
        if (cooldown.current) return;
        var chip = e.target.closest('span[style*="cursor: pointer"]');
        if (!chip) return;
        /* Must look like a pill chip */
        if (!chip.style.borderRadius && !(chip.getAttribute('style') || '').includes('radius-pill')) return;
        showHint(pickRandom(CHIP_PICKS), 3200);
        celebrate(e.clientX, e.clientY);
        cooldown.current = true;
        setTimeout(function () { cooldown.current = false; }, 400);
      }

      /* SWITCH / TOGGLE clicks */
      function onToggleClick(e) {
        if (cooldown.current) return;
        /* SFSwitch is a div with border-radius:11 */
        var sw = e.target.closest('div[style*="border-radius: 11"]');
        if (!sw) return;
        showHint(pickRandom(TOGGLE_PICKS), 2800);
        cooldown.current = true;
        setTimeout(function () { cooldown.current = false; }, 400);
      }

      /* DROPDOWN changes */
      function onSelectChange(e) {
        if (e.target.tagName !== 'SELECT') return;
        showHint(pickRandom(DROPDOWN_PICKS), 2600);
        celebrate(
          e.target.getBoundingClientRect().left + e.target.offsetWidth / 2,
          e.target.getBoundingClientRect().top
        );
      }

      document.addEventListener('click', onCardClick, true);
      document.addEventListener('click', onChipClick, true);
      document.addEventListener('click', onToggleClick, true);
      document.addEventListener('change', onSelectChange, true);

      return function () {
        clearTimeout(initTimer);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        stepObs.disconnect();
        document.removeEventListener('click', onCardClick, true);
        document.removeEventListener('click', onChipClick, true);
        document.removeEventListener('click', onToggleClick, true);
        document.removeEventListener('change', onSelectChange, true);
      };
    }, [studioKey]);

    return React.createElement('div', { className: 'cc-widget' },
      bubbleVis && React.createElement('div', {
        className: 'cc-bubble' + (hiding ? ' cc-hiding' : '')
      }, hint),
      React.createElement('div', { className: 'cc-avatar-wrap' },
        React.createElement(ClaraAvatarSmall, { accent: accent })
      )
    );
  }

  window.ClaraCoach = ClaraCoach;
})();
