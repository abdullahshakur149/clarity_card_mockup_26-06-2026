/* ============================================================================
   xphud.js — the always-on player HUD. A single fixed pill (top-right) that
   shows the GLOBAL level + XP (summed across every idea) on every screen, and
   count-ups + glows whenever XP is earned anywhere. Mounted ONCE inside
   ClarityRoot so it survives every view swap. Exposes window.ClarityXPHud.
   Reads the router's `ideas` state — no API, no extra persistence.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }

  /* Global level ladder — rescaled so the summed total still feels earned.
     (one idea fully reconned ≈ 260 XP → Strategist; two ≈ Creator.) */
  var RANKS = [
    { min: 0,   lvl: 1, label: 'Rookie',     icon: 'Shield',   color: 'var(--clr-muted)' },
    { min: 150, lvl: 2, label: 'Strategist', icon: 'Target',   color: 'var(--clr-primary-hover)' },
    { min: 400, lvl: 3, label: 'Creator',    icon: 'Sparkles', color: 'var(--clr-accent)' },
    { min: 800, lvl: 4, label: 'Master',     icon: 'Trophy',   color: 'var(--clr-reward)' }
  ];
  function rankFor(xp) { var r = RANKS[0]; for (var i = 0; i < RANKS.length; i++) if (xp >= RANKS[i].min) r = RANKS[i]; return r; }
  function nextRank(xp) { for (var i = 0; i < RANKS.length; i++) if (RANKS[i].min > xp) return RANKS[i]; return null; }
  function fmt(n) { return ('' + (n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  /* progress ring around the rank icon */
  function Ring(pct, color, size) {
    var sw = 2.5, r = (size - sw) / 2, c = 2 * Math.PI * r;
    var off = c * (1 - Math.max(0, Math.min(100, pct)) / 100), cx = size / 2;
    return e('svg', { className: 'xph-ring', width: size, height: size, viewBox: '0 0 ' + size + ' ' + size },
      e('circle', { cx: cx, cy: cx, r: r, fill: 'none', stroke: 'var(--clr-border)', strokeWidth: sw }),
      e('circle', { cx: cx, cy: cx, r: r, fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round',
        strokeDasharray: c.toFixed(2), strokeDashoffset: off.toFixed(2),
        transform: 'rotate(-90 ' + cx + ' ' + cx + ')', style: { transition: 'stroke-dashoffset .6s var(--ease)' } }));
  }

  function ClarityXPHud(props) {
    var ideas = props.ideas || [], currentId = props.currentId;
    var total = ideas.reduce(function (a, i) { return a + (i.xp || 0); }, 0);

    var ov = React.useState(false); var open = ov[0], setOpen = ov[1];
    var sv = React.useState(total); var shown = sv[0], setShown = sv[1];   /* animated display value */
    var gv = React.useState(null);  var gain = gv[0], setGain = gv[1];     /* {amount,key,rankUp,rankLabel} */
    var prevRef = React.useRef(total);
    var keyRef  = React.useRef(1);

    /* count-up + glow whenever the global total rises */
    React.useEffect(function () {
      var prev = prevRef.current;
      if (total === prev) return;
      if (total < prev) { setShown(total); prevRef.current = total; return; }
      var up = rankFor(total).min !== rankFor(prev).min;
      setGain({ amount: total - prev, key: keyRef.current++, rankUp: up, rankLabel: rankFor(total).label });
      var from = prev, to = total, dur = 850, start = 0, raf = 0;
      prevRef.current = total;
      function tick(t) { if (!start) start = t; var p = Math.min(1, (t - start) / dur); setShown(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); }
      raf = requestAnimationFrame(tick);
      var safety = setTimeout(function () { setShown(to); }, dur + 140);
      var ungain = setTimeout(function () { setGain(null); }, up ? 1900 : 1400);
      return function () { cancelAnimationFrame(raf); clearTimeout(safety); clearTimeout(ungain); };
    }, [total]);

    var cur = rankFor(total), nxt = nextRank(total);
    var pct = nxt ? Math.round((total - cur.min) / (nxt.min - cur.min) * 100) : 100;
    var toNext = nxt ? nxt.min - total : 0;
    var sorted = ideas.slice().sort(function (a, b) { return (b.xp || 0) - (a.xp || 0); });

    return e('div', { className: 'xph-root' },
      /* collapsed pill — always visible */
      e('button', { className: 'xph-pill', onClick: function () { setOpen(function (o) { return !o; }); }, 'aria-label': 'Your level and XP', title: 'Your level and XP' },
        e('span', { className: 'xph-ring-wrap' },
          Ring(pct, cur.color, 30),
          e('span', { className: 'xph-ico', style: { color: cur.color } }, e(Icon, { name: cur.icon, size: 14 }))),
        e('span', { className: 'xph-meta' },
          e('span', { className: 'xph-top' },
            e('span', { className: 'xph-lvl' }, 'Lv.' + cur.lvl),
            e('span', { className: 'xph-rank', style: { color: cur.color } }, cur.label)),
          e('span', { className: 'xph-xp' }, fmt(shown), ' XP')),
        e('span', { className: 'xph-caret' }, e(Icon, { name: open ? 'ChevronUp' : 'ChevronDown', size: 13 })),
        gain && e('span', { className: 'xph-glow' + (gain.rankUp ? ' up' : ''), key: 'glow' + gain.key }),
        gain && e('span', { className: 'xph-mote' + (gain.rankUp ? ' up' : ''), key: 'mote' + gain.key },
          gain.rankUp ? ('Level up · ' + gain.rankLabel) : ('+' + gain.amount + ' XP'))),

      /* expanded panel */
      open && e('div', { className: 'xph-backdrop', onClick: function () { setOpen(false); } }),
      open && e('div', { className: 'xph-panel' },
        e('div', { className: 'xph-panel-head' },
          e('span', { className: 'xph-panel-ico', style: { color: cur.color, background: 'color-mix(in srgb, ' + cur.color + ' 16%, transparent)' } }, e(Icon, { name: cur.icon, size: 17 })),
          e('div', { className: 'xph-panel-id' },
            e('div', { className: 'xph-panel-rank', style: { color: cur.color } }, cur.label),
            e('div', { className: 'xph-panel-lvl' }, 'Level ' + cur.lvl)),
          e('div', { className: 'xph-panel-xp' }, fmt(total), e('span', null, ' XP'))),

        e('div', { className: 'xph-prog' },
          e('div', { className: 'xph-prog-bar' }, e('div', { className: 'xph-prog-fill', style: { width: pct + '%', background: cur.color } })),
          e('div', { className: 'xph-prog-label' }, nxt ? (fmt(toNext) + ' XP to Level ' + nxt.lvl + ' · ' + nxt.label) : 'Top level reached ✦')),

        e('div', { className: 'xph-break' },
          e('div', { className: 'xph-break-h' }, 'XP by idea'),
          sorted.length
            ? sorted.map(function (i) {
                return e('div', { key: i.id, className: 'xph-prow' + (i.id === currentId ? ' cur' : '') },
                  e('span', { className: 'xph-prow-dot' }),
                  e('span', { className: 'xph-prow-name' }, i.name || 'Untitled idea'),
                  e('span', { className: 'xph-prow-xp' }, fmt(i.xp || 0), ' XP'));
              })
            : e('div', { className: 'xph-prow-empty' }, 'Start an idea to earn XP.')),

        e('div', { className: 'xph-hint' }, e(Icon, { name: 'Zap', size: 12 }), 'Earn more — do the groundwork, meet a customer, or compare two ideas.'))
    );
  }

  window.ClarityXPHud = ClarityXPHud;
})();
