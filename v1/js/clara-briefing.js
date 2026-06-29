/* clara-briefing.js — animated mission briefing card shown before each studio */
(function () {

  /* Dialogue + accent colour per studio modality */
  var BRIEFS = {
    text: {
      accent: 'var(--clr-text-mod)',
      opener: 'One post. One idea.',
      rest:   ' Let\'s write something worth reading.'
    },
    image: {
      accent: 'var(--clr-image-mod)',
      opener: 'One frame stops the scroll.',
      rest:   ' Let\'s make it unmistakable.'
    },
    video: {
      accent: 'var(--clr-video-mod)',
      opener: 'Lights on, Director.',
      rest:   ' Your audience is scrolling — let\'s make them stop.'
    },
    audio: {
      accent: 'var(--clr-audio-mod)',
      opener: 'Ears up. Mic\'s hot.',
      rest:   ' Let\'s put something in their head they won\'t shake.'
    }
  };

  /* ── ClaraAvatar — inline SVG with animated glow ring ── */
  function ClaraAvatar(props) {
    var accent = props.accent;
    return React.createElement('div', { className: 'cb-avatar-wrap' },
      React.createElement('svg', {
        width: 96, height: 96, viewBox: '0 0 96 96',
        className: 'cb-avatar-svg',
        'aria-hidden': 'true'
      },
        /* rotating dashed ring */
        React.createElement('circle', {
          cx: 48, cy: 48, r: 44,
          fill: 'none',
          stroke: accent,
          strokeWidth: 1.5,
          strokeDasharray: '10 6',
          className: 'cb-ring'
        }),
        /* face background */
        React.createElement('circle', {
          cx: 48, cy: 48, r: 34,
          fill: 'color-mix(in srgb, ' + accent + ' 14%, var(--clr-card-2))',
          stroke: accent,
          strokeWidth: 1
        }),
        /* left eye */
        React.createElement('circle', { cx: 38, cy: 45, r: 3.5, fill: accent }),
        /* right eye */
        React.createElement('circle', { cx: 58, cy: 45, r: 3.5, fill: accent }),
        /* smile arc */
        React.createElement('path', {
          d: 'M 39 55 Q 48 63 57 55',
          fill: 'none',
          stroke: accent,
          strokeWidth: 2,
          strokeLinecap: 'round'
        })
      )
    );
  }

  /* ── ClaraBriefing — main component ── */
  function ClaraBriefing(props) {
    var studioKey = props.studioKey;
    var onReady   = props.onReady;
    var brief     = BRIEFS[studioKey] || BRIEFS.text;
    var fullText  = brief.opener + brief.rest;
    var lsKey     = 'clarity_briefed_' + studioKey;

    var _typedState  = React.useState('');
    var typed        = _typedState[0];
    var setTyped     = _typedState[1];

    var _doneState   = React.useState(false);
    var typeDone     = _doneState[0];
    var setTypeDone  = _doneState[1];

    var _exitState   = React.useState(false);
    var exiting      = _exitState[0];
    var setExiting   = _exitState[1];

    /* Dismiss: begin exit animation then call onReady after 220ms */
    function dismiss(markSeen) {
      if (markSeen) {
        try { localStorage.setItem(lsKey, '1'); } catch (e) {}
      }
      setExiting(true);
      setTimeout(onReady, 220);
    }

    React.useEffect(function () {
      /* Typewriter */
      var i = 0;
      var interval = setInterval(function () {
        i += 1;
        setTyped(fullText.slice(0, i));
        if (i >= fullText.length) {
          clearInterval(interval);
          setTypeDone(true);
        }
      }, 12);

      /* Auto-dismiss on repeat visits (localStorage key already set) */
      var autoTimer = null;
      try {
        if (localStorage.getItem(lsKey)) {
          autoTimer = setTimeout(function () { dismiss(false); }, 1800);
        }
      } catch (e) {}

      return function () {
        clearInterval(interval);
        if (autoTimer) clearTimeout(autoTimer);
      };
    }, []);

    /* Render dialogue: bold accent opener + regular white continuation */
    function renderDialogue() {
      var openerLen = brief.opener.length;

      if (typed.length === 0) {
        return React.createElement('span', null,
          React.createElement('span', { className: 'cb-cursor' }, '|')
        );
      }
      if (typed.length <= openerLen) {
        return React.createElement('span', null,
          React.createElement('span', { style: { color: brief.accent, fontWeight: 700 } }, typed),
          React.createElement('span', { className: 'cb-cursor' }, '|')
        );
      }
      return React.createElement('span', null,
        React.createElement('span', { style: { color: brief.accent, fontWeight: 700 } }, brief.opener),
        React.createElement('span', { style: { color: 'var(--clr-text)' } }, typed.slice(openerLen)),
        !typeDone && React.createElement('span', { className: 'cb-cursor' }, '|')
      );
    }

    return React.createElement('div', {
      className: 'cb-backdrop' + (exiting ? ' cb-exiting' : '')
    },
      React.createElement('div', { className: 'cb-card' },
        React.createElement(ClaraAvatar, { accent: brief.accent }),
        React.createElement('div', { className: 'cb-dialogue' }, renderDialogue()),
        React.createElement('div', { className: 'cb-actions' },
          React.createElement('button', {
            className: 'cb-btn-primary',
            style: { background: brief.accent },
            onClick: function () { dismiss(true); }
          }, 'Lock in →'),
          React.createElement('button', {
            className: 'cb-btn-skip',
            onClick: function () { dismiss(false); }
          }, 'Skip')
        )
      )
    );
  }

  window.ClaraBriefing = ClaraBriefing;
})();
