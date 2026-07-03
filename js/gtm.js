/* ============================================================================
   gtm.js — Go-To-Market pillar. Sajood-style context: a 90-day focus question
   (My Plan) + four typed pricing numbers (avg order, market avg [auto-suggested
   from the Market recon], margin, best seller), then Clarity reveals the go-to-
   market MOVES — pricing plays (from where the price lands vs market) + priority-driven plays, each
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

    /* sajood's typed pricing fields (stored as raw strings; parsed for calc) */
    function numOf(v) { var n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? 0 : n; }
    var pr = React.useState(saved && saved.avgOrder != null ? String(saved.avgOrder) : String(market || 40)); var price = pr[0], setPrice = pr[1];
    var ma = React.useState(saved && saved.marketAvg != null ? String(saved.marketAvg) : String(market || 40)); var marketAvg = ma[0], setMarketAvg = ma[1];
    var mg = React.useState(saved && saved.margin != null ? String(saved.margin) : '50'); var margin = mg[0], setMargin = mg[1];
    var bs = React.useState(saved && saved.bestSeller ? saved.bestSeller : ''); var bestSeller = bs[0], setBestSeller = bs[1];
    var pf2 = React.useState(saved && saved.planFocus ? saved.planFocus : ''); var planFocus = pf2[0], setPlanFocus = pf2[1];
    var vw = React.useState(saved ? 'plan' : 'calibrate'); var view = vw[0], setView = vw[1];
    var firstRef = React.useRef(!saved);

    var priceN = numOf(price), marketN = numOf(marketAvg), marginN = numOf(margin);
    var pos = positionOf(priceN, marketN);
    var deltaPct = marketN ? Math.round((priceN - marketN) / marketN * 100) : 0;

    /* compile → plan, persist gtm + XP (once) */
    React.useEffect(function () {
      if (view !== 'running') return;
      var t = setTimeout(function () {
        var moves = genMoves(pos, marginN, profile.priorities);
        var gtmObj = { avgOrder: priceN, margin: marginN, marketAvg: marketN, bestSeller: bestSeller, planFocus: planFocus, unit: mk.unit, position: pos, moves: moves, date: dayLabel(), xp: XP_GTM };
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

    /* ── CONTEXT — sajood's My Plan focus + My Pricing fields ── */
    if (view === 'calibrate') {
      var verdict = marketN
        ? (deltaPct === 0 ? 'right at market' : Math.abs(deltaPct) + '% ' + (deltaPct < 0 ? 'below' : 'above') + ' market') + ' — ' + POS_LABEL[pos]
        : '';
      var pfield = function (label, help, value, onChange, prefix, suffix) {
        return e('div', { className: 'gtm-field' },
          e('div', { className: 'gtm-field-l' }, label),
          e('div', { className: 'gtm-field-help' }, help),
          e('div', { className: 'gtm-input-wrap' },
            prefix ? e('span', { className: 'gtm-input-aff' }, prefix) : null,
            e('input', { className: 'pf-input gtm-num' + (prefix ? ' has-pre' : '') + (suffix ? ' has-suf' : ''), value: value, onChange: onChange }),
            suffix ? e('span', { className: 'gtm-input-aff gtm-input-suf' }, suffix) : null));
      };
      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: onBack }, '‹ Home base'),
        e('h1', { className: 'gtm-title' }, 'Build your go-to-market plan'),
        voice('Based on your research and persona, I’ll turn a few numbers into pricing moves and a 90-day plan.'),

        (profile.priorities && profile.priorities.length) ? e('div', { className: 'gtm-prio' },
          e('span', { className: 'gtm-prio-l' }, 'Priorities'),
          profile.priorities.map(function (p, i) { return e('span', { key: i, className: 'gtm-prio-chip' }, p); })) : null,

        /* My Plan — 90-day focus */
        e('div', { className: 'gtm-focus-wrap' },
          e('label', { className: 'gtm-focus-label' }, 'Anything specific you want to focus on in the next 90 days? ', e('span', { className: 'gtm-optional' }, '(optional)')),
          e('textarea', { className: 'pf-input gtm-focus-input', rows: 2, value: planFocus,
            placeholder: 'e.g. growing weekend foot traffic, landing 3 new wholesale accounts…',
            onChange: function (ev) { setPlanFocus(ev.target.value); } })),

        /* My Pricing — four numbers */
        e('div', { className: 'gtm-sec-l' }, 'A few numbers help me find pricing moves that fit how you actually sell'),
        e('div', { className: 'gtm-price-grid' },
          pfield('Avg order', 'Your typical sale value', price, function (ev) { setPrice(ev.target.value); }, '$'),
          pfield('Market avg', 'Typical for your category · from your competitor scan', marketAvg, function (ev) { setMarketAvg(ev.target.value); }, '$'),
          pfield('Margin', 'Your profit margin', margin, function (ev) { setMargin(ev.target.value); }, null, '%'),
          pfield('Best seller', 'Your top product or service', bestSeller, function (ev) { setBestSeller(ev.target.value); })),
        verdict ? e('div', { className: 'gtm-verdict gtm-' + pos }, e('span', { className: 'gtm-verdict-dot' }), verdict) : null,

        e('button', { className: 'pf-cta gtm-cta', onClick: function () { setView('running'); } }, 'Generate my plan →')
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
    var gtm = saved || { moves: genMoves(pos, marginN, profile.priorities), position: pos, avgOrder: priceN, margin: marginN, unit: mk.unit };
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
