/* ============================================================================
   gtm.js — Go-To-Market pillar. Zero-forms: auto-feeds the market average from
   the Market research, the owner CALIBRATES price + margin on tactile dials
   (no typed fields), then Clarity reveals the go-to-market MOVES — pricing
   plays (from where the price lands vs market) + priority-driven plays, each
   with Impact/Effort. Completing it awards XP and stores idea.missions.gtm.moves,
   which the My Tasks pillar turns into scheduled tasks. Journey tone.
     window.ClarityGTM({ idea, onChange, onBack })
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }

  var XP_GTM = 70;
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function dayLabel() { try { var d = new Date(); return MON[d.getMonth()] + ' ' + d.getDate(); } catch (_) { return ''; } }
  function fmtPrice(n, unit) { return '$' + (Math.round(n * 100) / 100) + (unit || ''); }

  /* market average + unit, pulled from the primary Market recon (backward-compatible) */
  function marketFrom(idea) {
    var RP = window.ClarityReports, mi = (idea && idea.missions) || {};
    var mkt = RP ? RP.primary(mi.market) : mi.market;
    var avgStr = (mkt && mkt.stats && mkt.stats.avg) || '';
    var num = parseFloat(String(avgStr).replace(/[^0-9.]/g, ''));
    var unitM = String(avgStr).match(/\/[a-z]+/i);
    return { avg: (num && !isNaN(num)) ? num : 0, unit: unitM ? unitM[0] : '' };
  }

  function positionOf(price, market) { if (!market) return 'at-market'; var r = price / market; return r < 0.9 ? 'value' : r > 1.12 ? 'premium' : 'at-market'; }
  var POS_LABEL = { value: 'a value play', 'at-market': 'at market', premium: 'a premium play' };
  var KIND = { pricing: 'var(--clr-cat-gtm)', channel: 'var(--clr-cat-market)', trust: 'var(--clr-cat-positioning)', retention: 'var(--clr-cat-customer)', launch: 'var(--clr-ember)' };

  /* one play per selected onboarding priority (keyword-matched) */
  function priorityPlay(p) {
    var s = (p || '').toLowerCase();
    if (/discover|found|online|seen/.test(s)) return { id: 'p_found', kind: 'channel', title: 'Claim your local search presence', why: 'From your priority “' + p + '”: fill out your Google Business Profile — photos, hours, a few posts. It’s where local buyers look first.', impact: 'High', effort: 'Low' };
    if (/trust|proof|review/.test(s)) return { id: 'p_trust', kind: 'trust', title: 'Collect five fresh reviews', why: 'From your priority “' + p + '”: ask your last ten happy customers. Social proof is what converts hesitant first-timers.', impact: 'Medium', effort: 'Low' };
    if (/repeat|retain|loyal/.test(s)) return { id: 'p_repeat', kind: 'retention', title: 'Launch a simple loyalty loop', why: 'From your priority “' + p + '”: a punch card or 5th-visit reward turns one-off buyers into regulars.', impact: 'Medium', effort: 'Low' };
    if (/convert|signup|browser|interest/.test(s)) return { id: 'p_convert', kind: 'channel', title: 'Sharpen your first offer', why: 'From your priority “' + p + '”: a clear, time-boxed first-purchase offer converts the on-the-fence browsers.', impact: 'Medium', effort: 'Medium' };
    if (/calendar|fill|book/.test(s)) return { id: 'p_book', kind: 'launch', title: 'Open two-tap online booking', why: 'From your priority “' + p + '”: every friction point costs you a job — let people book in seconds.', impact: 'High', effort: 'Medium' };
    return { id: 'p_' + s.replace(/[^a-z]+/g, '').slice(0, 8), kind: 'channel', title: 'Double down on: ' + p, why: 'From your priority “' + p + '”: pick one channel and post consistently for two weeks.', impact: 'Medium', effort: 'Medium' };
  }

  function genMoves(pos, margin, priorities) {
    var moves = [];
    if (pos === 'value') moves.push({ id: 'm_tier', kind: 'pricing', title: 'Add tiered packages', why: 'You’re priced below market — good/better/best tiers capture more budgets without discounting your core.', impact: 'High', effort: 'Medium' });
    else if (pos === 'premium') moves.push({ id: 'm_justify', kind: 'pricing', title: 'Justify the premium', why: 'You sit above market — make the price obvious: a signature experience, visible proof, or a guarantee.', impact: 'High', effort: 'Medium' });
    else moves.push({ id: 'm_bundle', kind: 'pricing', title: 'Introduce a signature bundle', why: 'You’re at market — a distinctive bundle lifts perceived value and average order without a price war.', impact: 'Medium', effort: 'Low' });
    if (margin < 40) moves.push({ id: 'm_margin', kind: 'pricing', title: 'Lift your entry price 8–12%', why: 'A ' + margin + '% margin is thin — a modest rise on your most-loved item protects profit with little churn risk.', impact: 'Medium', effort: 'Low' });
    else moves.push({ id: 'm_upsell', kind: 'pricing', title: 'Add a premium upsell', why: 'A healthy ' + margin + '% margin gives you room — a premium add-on lifts average order at almost no cost.', impact: 'Medium', effort: 'Low' });
    (priorities || []).slice(0, 2).forEach(function (p) { moves.push(priorityPlay(p)); });
    var seen = {}; return moves.filter(function (m) { if (seen[m.id]) return false; seen[m.id] = true; return true; });
  }

  function bg() { return e('div', { className: 'pf-bg' }, e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-vignette' })); }
  /* the voice of Clarity — unattributed (reuses .capcom styles) */
  function voice(line) {
    return e('div', { className: 'capcom' },
      e('div', { className: 'capcom-body' },
        e('div', { className: 'capcom-line' }, line)));
  }
  function shell(inner) {
    return e('div', { className: 'id-root gtm-root' }, bg(),
      e('div', { className: 'pf-topbar' },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
          e('span', { className: 'pf-wordmark' }, 'Clarity'),
          e('span', { className: 'pf-hide-sm' }, 'Your journey · Go-To-Market'))),
      e('div', { className: 'id-main' }, inner));
  }

  function badge(label, level) {
    return e('span', { className: 'gtm-badge ' + String(level).toLowerCase() }, level, e('b', null, label));
  }

  function ClarityGTM(props) {
    var idea = props.idea || {}, onChange = props.onChange, onBack = props.onBack;
    var profile = idea.profile || {};
    var mk = marketFrom(idea);
    var market = mk.avg || 0;
    var saved = (idea.missions && idea.missions.gtm) || null;

    var pr = React.useState(saved ? saved.avgOrder : (market || 40)); var price = pr[0], setPrice = pr[1];
    var mg = React.useState(saved ? saved.margin : 50); var margin = mg[0], setMargin = mg[1];
    var vw = React.useState(saved ? 'plan' : 'calibrate'); var view = vw[0], setView = vw[1];
    var firstRef = React.useRef(!saved);

    var pos = positionOf(price, market);
    var deltaPct = market ? Math.round((price - market) / market * 100) : 0;

    /* compile → plan, persist gtm + XP (once) */
    React.useEffect(function () {
      if (view !== 'running') return;
      var t = setTimeout(function () {
        var moves = genMoves(pos, margin, profile.priorities);
        var gtmObj = { avgOrder: price, margin: margin, marketAvg: market, unit: mk.unit, position: pos, moves: moves, date: dayLabel(), xp: XP_GTM };
        var patch = { missions: Object.assign({}, idea.missions, { gtm: gtmObj }) };
        if (firstRef.current) {
          patch.xp = (idea.xp || 0) + XP_GTM;
          /* auto-build the task plan from these moves (the My Tasks pillar) */
          if (window.ClarityMakeTasks && !(idea.tasks && idea.tasks.length)) patch.tasks = window.ClarityMakeTasks(gtmObj, profile);
          /* draft a few starter pieces so the Content Engine is never empty */
          if (window.ClarityMakeStarterContent && !(idea.content && idea.content.length)) {
            patch.content = window.ClarityMakeStarterContent(gtmObj, profile);
            patch.starterContentSeeded = true;
          }
          firstRef.current = false;
        }
        if (onChange) onChange(patch);
        setView('plan');
      }, 1700);
      return function () { clearTimeout(t); };
    }, [view]);

    /* ── CALIBRATE ── */
    if (view === 'calibrate') {
      var lo = market ? Math.round(market * 0.5 * 10) / 10 : 5;
      var hi = market ? Math.round(market * 2) : 200;
      var step = market > 200 ? 5 : market > 20 ? 1 : 0.1;
      var verdict = market
        ? (deltaPct === 0 ? 'right at market' : Math.abs(deltaPct) + '% ' + (deltaPct < 0 ? 'below' : 'above') + ' market') + ' — ' + POS_LABEL[pos]
        : 'set your price — look at My Market first and I’ll load the average';
      var bandPct = market ? Math.max(4, Math.min(96, Math.round((price - lo) / (hi - lo) * 100))) : 50;

      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: onBack }, '‹ Home base'),
        e('h1', { className: 'gtm-title' }, 'Price your play'),
        voice(market
          ? 'Your research is in — the market average is loaded. Dial in your price and margin, and I’ll suggest your go-to-market moves.'
          : 'Dial in your price and margin and I’ll suggest your moves. Tip: look at My Market first and I’ll load the market average for you.'),

        /* auto-loaded context (only the pills that have real data) */
        (market || profile.goal) ? e('div', { className: 'gtm-ctx' },
          market ? e('div', { className: 'gtm-pill' }, e('span', { className: 'gtm-pill-l' }, 'Market avg'), e('span', { className: 'gtm-pill-v' }, fmtPrice(market, mk.unit) + ' · from your research')) : null,
          profile.goal && e('div', { className: 'gtm-pill' }, e('span', { className: 'gtm-pill-l' }, 'Your goal'), e('span', { className: 'gtm-pill-v' }, profile.goal))) : null,
        (profile.priorities && profile.priorities.length) ? e('div', { className: 'gtm-prio' },
          e('span', { className: 'gtm-prio-l' }, 'Priorities'),
          profile.priorities.map(function (p, i) { return e('span', { key: i, className: 'gtm-prio-chip' }, p); })) : null,

        /* price dial */
        e('div', { className: 'gtm-dial' },
          e('div', { className: 'gtm-dial-head' }, e('span', { className: 'gtm-dial-l' }, 'Your average order'), e('span', { className: 'gtm-dial-v' }, fmtPrice(price, mk.unit))),
          e('div', { className: 'gtm-track' },
            market && e('span', { className: 'gtm-track-mid', style: { left: Math.max(4, Math.min(96, Math.round((market - lo) / (hi - lo) * 100))) + '%' } }, 'market avg'),
            e('input', { className: 'gtm-range', type: 'range', min: lo, max: hi, step: step, value: price, onChange: function (ev) { setPrice(parseFloat(ev.target.value)); } })),
          e('div', { className: 'gtm-verdict gtm-' + pos }, e('span', { className: 'gtm-verdict-dot' }), verdict)),

        /* margin dial */
        e('div', { className: 'gtm-dial' },
          e('div', { className: 'gtm-dial-head' }, e('span', { className: 'gtm-dial-l' }, 'Your margin'), e('span', { className: 'gtm-dial-v' }, margin + '%')),
          e('div', { className: 'gtm-track' },
            e('input', { className: 'gtm-range', type: 'range', min: 10, max: 90, step: 1, value: margin, onChange: function (ev) { setMargin(parseInt(ev.target.value, 10)); } })),
          e('div', { className: 'gtm-verdict ' + (margin < 40 ? 'gtm-value' : 'gtm-at-market') }, e('span', { className: 'gtm-verdict-dot' }), margin < 40 ? 'thin — protect profit' : 'healthy — room to invest')),

        e('button', { className: 'pf-cta gtm-cta', onClick: function () { setView('running'); } }, 'Work out my moves →')
      ));
    }

    /* ── RUNNING ── */
    if (view === 'running') {
      return shell(e(React.Fragment, null,
        e('h1', { className: 'gtm-title' }, 'Calling your plays…'),
        voice('Weighing your price against the market — and against what you said matters most…'),
        e('div', { className: 'gtm-compile' },
          e('div', { className: 'gtm-compile-ic' }, e(Icon, { name: 'Rocket', size: 30 })),
          e('div', { className: 'gtm-compile-bar' }, e('i', null)))
      ));
    }

    /* ── PLAN (moves) ── */
    var gtm = saved || { moves: genMoves(pos, margin, profile.priorities), position: pos, avgOrder: price, margin: margin, unit: mk.unit };
    var moves = gtm.moves || [];
    return shell(e(React.Fragment, null,
      e('button', { className: 'id-back', onClick: onBack }, '‹ Home base'),
      e('div', { className: 'mm-acq gtm-acq' }, e('span', { className: 'mm-acq-stamp' }, 'Your go-to-market is set'), e('span', { className: 'mm-acq-xp' }, '+', XP_GTM, ' XP')),
      voice('Here’s your go-to-market play. Each move is a lever — and My Tasks has already turned them into a schedule for you.'),

      e('div', { className: 'gtm-summary' },
        e('span', { className: 'gtm-summary-k' }, 'Priced ' + (POS_LABEL[gtm.position] || 'at market')),
        e('span', null, fmtPrice(gtm.avgOrder, gtm.unit) + '  ·  ' + gtm.margin + '% margin'),
        profile.goal && e('span', { className: 'gtm-summary-goal' }, 'Working toward ' + profile.goal)),

      e('div', { className: 'gtm-moves' }, moves.map(function (m, i) {
        return e('div', { key: m.id, className: 'gtm-move', style: { '--k': KIND[m.kind] || 'var(--clr-cat-gtm)', animationDelay: (0.07 * i) + 's' } },
          e('div', { className: 'gtm-move-h' }, e('span', { className: 'gtm-move-n' }, 'Move ' + (i + 1)), e('span', { className: 'gtm-move-kind' }, m.kind.charAt(0).toUpperCase() + m.kind.slice(1))),
          e('div', { className: 'gtm-move-title' }, m.title),
          e('div', { className: 'gtm-move-why' }, m.why),
          e('div', { className: 'gtm-move-badges' }, badge('impact', m.impact), badge('effort', m.effort)));
      })),

      e('div', { className: 'gtm-nextnote' }, e(Icon, { name: 'CalendarClock', size: 14 }), 'Next: My Tasks has these moves laid out as a scheduled action plan.'),
      e('div', { className: 'mm-row' },
        e('button', { className: 'id-back', onClick: function () { setView('calibrate'); } }, '↻ Re-calibrate'),
        e('button', { className: 'pf-cta gtm-cta', onClick: onBack }, 'Back to home base →'))
    ));
  }

  window.ClarityGTM = ClarityGTM;
})();
