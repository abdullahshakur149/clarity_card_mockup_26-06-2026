/* clara-coach.js — persistent corner companion during studio flow (Approach B) */
(function () {

  /* Hints keyed by the exact h2 title SFHead renders per step */
  var HINTS = {
    video: {
      'Format & platform':   "Pick where your audience lives first — format follows platform.",
      'Presenter & script':  "Your presenter is your brand's face. Choose with intention.",
      'Voiceover':           "The right voice makes people lean in. Go with your gut.",
      'Generate':            "Three options incoming. Trust the fit scores.",
      'Variations preview':  "Pick the angle that feels most like your brand.",
      'Preview & edit':      "Almost there. Tweak until it feels right.",
      '_default':            "You're doing great, Director. Keep going."
    },
    audio: {
      'What are we creating?': "Every great audio piece starts with one clear intention.",
      'Vibe & voice':          "Voice sets the entire mood. Trust your instincts.",
      'Script':                "Clara's drafted something — make it yours.",
      'Production':            "The details are what separate good audio from great audio.",
      'Generate':              "Mixing it all together. This is where it comes alive.",
      'Preview & edit':        "Listen back with fresh ears.",
      '_default':              "Sounding good. Keep building."
    },
    text: {
      'Write the brief':  "One idea, sharpened until it cuts. That's all a great post needs.",
      'Generate':         "Generating 3 variations tuned to The Artisan Loyalist...",
      'Preview & edit':   "Read it out loud — if it flows, it lands.",
      '_default':         "Sharp copy starts with a clear idea. You've got this."
    },
    image: {
      'Describe the visual': "The best images stop the scroll before anyone reads a word.",
      'Generate':            "Rendering visuals matched to your brand kit...",
      'Preview & edit':      "Does it look like your brand at a glance? That's the test.",
      '_default':            "Make it unmistakable."
    }
  };

  /* Small Clara SVG avatar (56 × 56) */
  function ClaraAvatarSmall(props) {
    var accent = props.accent;
    return React.createElement('svg', {
      width: 56, height: 56, viewBox: '0 0 56 56',
      className: 'cc-avatar-svg',
      'aria-hidden': 'true'
    },
      /* rotating dashed ring */
      React.createElement('circle', {
        cx: 28, cy: 28, r: 25,
        fill: 'none',
        stroke: accent,
        strokeWidth: 1.2,
        strokeDasharray: '6 4',
        className: 'cc-ring'
      }),
      /* face bg */
      React.createElement('circle', {
        cx: 28, cy: 28, r: 19,
        fill: 'color-mix(in srgb, ' + accent + ' 14%, var(--clr-card-2))',
        stroke: accent,
        strokeWidth: 0.8
      }),
      /* eyes */
      React.createElement('circle', { cx: 22, cy: 26, r: 2.2, fill: accent }),
      React.createElement('circle', { cx: 34, cy: 26, r: 2.2, fill: accent }),
      /* smile */
      React.createElement('path', {
        d: 'M 22 33 Q 28 38 34 33',
        fill: 'none',
        stroke: accent,
        strokeWidth: 1.4,
        strokeLinecap: 'round'
      })
    );
  }

  /* ClaraCoach — persistent corner widget */
  function ClaraCoach(props) {
    var studioKey = props.studioKey;
    var accent    = props.accent || 'var(--clr-primary)';

    var _hintS      = React.useState('');
    var hint        = _hintS[0];
    var setHint     = _hintS[1];

    var _visS       = React.useState(false);
    var bubbleVis   = _visS[0];
    var setBubbleVis = _visS[1];

    var _hidingS    = React.useState(false);
    var hiding      = _hidingS[0];
    var setHiding   = _hidingS[1];

    var hideTimerRef = React.useRef(null);

    function showHint(text) {
      /* cancel any pending hide */
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      setHiding(false);
      setHint(text);
      setBubbleVis(true);
      /* auto-hide after 4.5s with a fade-out */
      hideTimerRef.current = setTimeout(function () {
        setHiding(true);
        setTimeout(function () {
          setBubbleVis(false);
          setHiding(false);
        }, 220);
      }, 4500);
    }

    React.useEffect(function () {
      var modHints    = HINTS[studioKey] || {};
      var lastHeading = '';

      /* Greet on mount */
      var initTimer = setTimeout(function () {
        showHint(modHints['_default'] || "Let's make something great.");
      }, 500);

      /* Watch for step heading changes */
      var obs = new MutationObserver(function () {
        var el = document.querySelector('.sf-step h2');
        if (!el) return;
        var title = el.textContent.trim();
        if (title === lastHeading) return;
        lastHeading = title;
        var text = modHints[title] || modHints['_default'];
        if (text) showHint(text);
      });
      obs.observe(document.body, { childList: true, subtree: true, characterData: true });

      return function () {
        clearTimeout(initTimer);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        obs.disconnect();
      };
    }, [studioKey]);

    return React.createElement('div', { className: 'cc-widget' },
      /* speech bubble — to the left of avatar */
      bubbleVis && React.createElement('div', {
        className: 'cc-bubble' + (hiding ? ' cc-hiding' : '')
      }, hint),
      /* avatar */
      React.createElement('div', { className: 'cc-avatar-wrap' },
        React.createElement(ClaraAvatarSmall, { accent: accent })
      )
    );
  }

  window.ClaraCoach = ClaraCoach;
})();
