/* ============================================================================
   compare.js — "Concept Comparison" tool (the USP). Two ideas' Strategic Plans
   head-to-head, with a deterministic score per category and a CAPCOM verdict on
   the stronger concept. Exposes window.ClarityCompare({ ideas, currentId, onBack })
   and window.ClarityIdeaScore(idea) (a composite 0-100, reused by the ideas home).
   Scoring is derived from each idea's REAL recon numbers — mocked, no API.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }

  var CATS = [
    { id: 'market', title: 'Market Snapshot', hex: '#22c9db' },
    { id: 'positioning', title: 'Your Positioning', hex: '#a78bfa' },
    { id: 'competitor', title: 'Competitor Intelligence', hex: '#f2685f' },
    { id: 'customer', title: 'Your Ideal Customer', hex: '#34d39e' },
    { id: 'gtm', title: 'Go-To-Market', hex: '#f5a623' },
    { id: 'risk', title: 'Risk & Confidence', hex: '#9aa7a3' }
  ];
  var CAT_ON = { market: 'demand', positioning: 'positioning', competitor: 'a less crowded field', customer: 'customer fit', gtm: 'go-to-market', risk: 'confidence' };
  var CAT_ADV = { market: 'a bigger demand tailwind', positioning: 'a clearer positioning gap', competitor: 'a less crowded field', customer: 'stronger customer fit', gtm: 'a sharper go-to-market', risk: 'lower risk and higher confidence' };

  function primaryPersona(cust) { if (!cust || !cust.sketches) return null; return cust.sketches.filter(function (s) { return s.name === cust.primary; })[0] || cust.sketches[0]; }
  function clampV(v) { return Math.max(20, Math.min(96, Math.round(v))); }
  function categoryScores(idea) {
    var mi = idea.missions || {}, RP = window.ClarityReports;
    var market = RP ? RP.primary(mi.market) : mi.market, comp = RP ? RP.primary(mi.competition) : mi.competition, plan = mi.plan, persona = primaryPersona(mi.customers);
    var rivals = (comp && comp.competitors) || [];
    var top = rivals.filter(function (c) { return c.threat === 'High'; })[0] || rivals[0] || { sov: 35 };
    var topSoV = (typeof top.sov === 'number') ? top.sov : 35;
    var mDq = (market && market.dq) || 78, cDq = (comp && comp.dq) || 78, fit = (persona && persona.fit) || 80;
    var overall = (plan && plan.dq) || Math.round((mDq + cDq + ((persona && persona.report && persona.report.dq) || 80)) / 3);
    return {
      market: clampV(mDq),
      positioning: clampV(52 + (38 - topSoV)),
      competitor: clampV(100 - topSoV),
      customer: clampV(fit),
      gtm: clampV(64 + fit / 8),
      risk: clampV(overall)
    };
  }
  function composite(s) { var k = Object.keys(s); return Math.round(k.reduce(function (a, x) { return a + s[x]; }, 0) / k.length); }
  function ideaScore(idea) { return composite(categoryScores(idea)); }
  window.ClarityIdeaScore = ideaScore;

  /* the real number behind each category score — shown under every row */
  function evidence(idea) {
    var mi = idea.missions || {}, RP = window.ClarityReports;
    var market = (RP ? RP.primary(mi.market) : mi.market) || {}, comp = (RP ? RP.primary(mi.competition) : mi.competition) || {}, plan = mi.plan || {};
    var p = primaryPersona(mi.customers) || {}, sc = categoryScores(idea);
    var rivals = comp.competitors || [];
    var top = rivals.filter(function (c) { return c.threat === 'High'; })[0] || rivals[0] || { sov: 35 };
    return {
      market: (market.dq || 78) + ' demand index',
      positioning: (top.sov || 35) + '% held by top rival',
      competitor: rivals.length + ' rivals · leader ' + (top.sov || 35) + '%',
      customer: (p.fit || 80) + '% fit · ' + (p.name || 'core buyer'),
      gtm: 'reach readiness ' + sc.gtm,
      risk: (plan.dq || sc.risk) + ' confidence'
    };
  }

  function makeVerdict(a, b, sa, sb) {
    var ca = composite(sa), cb = composite(sb);
    var tie = ca === cb;
    var win = ca >= cb ? a : b, lose = ca >= cb ? b : a;
    var ws = ca >= cb ? sa : sb, ls = ca >= cb ? sb : sa;
    var diffs = CATS.map(function (c) { return { id: c.id, d: ws[c.id] - ls[c.id] }; });
    var winAdv = diffs.filter(function (x) { return x.d > 0; }).sort(function (x, y) { return y.d - x.d; }).slice(0, 2).map(function (x) { return CAT_ADV[x.id]; });
    var loseBest = diffs.filter(function (x) { return x.d < 0; }).sort(function (x, y) { return x.d - y.d; })[0];
    var text;
    if (tie) {
      text = 'It is dead level. ' + a.name + ' and ' + b.name + ' score the same overall — split the difference on which risk you would rather take, or run more recon to break the tie.';
    } else {
      text = win.name + ' is the stronger concept';
      text += winAdv.length ? ' — ' + winAdv.join(' and ') + '.' : '.';
      if (loseBest) text += ' ' + lose.name + ' wins on ' + CAT_ON[loseBest.id] + ', but it is not enough to close the gap.';
    }
    return { text: text, winnerId: tie ? null : win.id, ca: ca, cb: cb };
  }

  function bg() { return e('div', { className: 'pf-bg' }, e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-grid' }), e('div', { className: 'pf-bg-scan' }), e('div', { className: 'pf-bg-vignette' })); }
  function shell(inner) {
    return e('div', { className: 'iq-root' }, bg(),
      e('div', { className: 'pf-topbar' },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
          e('span', { className: 'pf-wordmark' }, 'Clarity'),
          e('span', { className: 'pf-hide-sm' }, 'Mission Control // Tools · Concept Comparison')),
        e('div', { className: 'pf-tele' }, e('span', { className: 'pf-hide-sm' }, 'Guidance: CAPCOM'), e('span', { className: 'pf-live' }, e('i', null), 'Live'))),
      e('div', { className: 'iq-main' }, inner));
  }

  /* two hardcoded demo concepts so the comparison always has something to show */
  var DEMO = [
    { id: 'demo_hearth', name: 'Hearth Bakery', profile: { sector: 'food', name: 'Hearth Bakery', desc: 'artisan sourdough bakery' },
      missions: {
        market: { dq: 84 },
        competition: { dq: 81, competitors: [
          { name: 'Crumb & Co.', threat: 'High', sov: 34, price: '$$' },
          { name: 'Daily Loaf', threat: 'Medium', sov: 22, price: '$' },
          { name: 'Maison Levain', threat: 'Medium', sov: 18, price: '$$$' },
          { name: 'Supermarket bakery', threat: 'Low', sov: 26, price: '$' }] },
        customers: { primary: 'Community Nova', sketches: [{ name: 'Community Nova', fit: 86, archetype: 'Community-led', report: { dq: 83 } }] },
        plan: { dq: 83 }
      } },
    { id: 'demo_copperline', name: 'Copperline Coffee', profile: { sector: 'retail', name: 'Copperline Coffee', desc: 'small-batch coffee roastery' },
      missions: {
        market: { dq: 86 },
        competition: { dq: 80, competitors: [
          { name: 'BeanBox', threat: 'High', sov: 44, price: '$$' },
          { name: 'Blue Bottle', threat: 'High', sov: 28, price: '$$$' },
          { name: 'Local roasters', threat: 'Medium', sov: 16, price: '$$' },
          { name: 'Supermarket beans', threat: 'Low', sov: 12, price: '$' }] },
        customers: { primary: 'Priya', sketches: [{ name: 'Priya', fit: 88, archetype: 'Convenience-first', report: { dq: 84 } }] },
        plan: { dq: 82 }
      } }
  ];

  function ClarityCompare(props) {
    var ideas = props.ideas || [], currentId = props.currentId, onBack = props.onBack;
    var real = ideas.filter(function (i) { var m = i.missions || {}; return m.market && m.customers && m.competition; });
    var eligible = real.length >= 2 ? real : DEMO;   /* fall back to the two demo concepts so Compare always renders */
    var ids = eligible.map(function (i) { return i.id; });
    var defA = ids.indexOf(currentId) >= 0 ? currentId : ids[0] || null;
    var defB = ids.filter(function (id) { return id !== defA; })[0] || null;

    var av = React.useState(defA); var selA = av[0], setSelA = av[1];
    var bv = React.useState(defB); var selB = bv[0], setSelB = bv[1];

    function pickA(id) { if (id === selB) setSelB(selA); setSelA(id); }
    function pickB(id) { if (id === selA) setSelA(selB); setSelB(id); }
    function byId(id) { return eligible.filter(function (i) { return i.id === id; })[0] || null; }

    /* not enough comparable ideas */
    if (eligible.length < 2) {
      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: onBack }, '‹ Hub'),
        e('div', { className: 'id-eyebrow' }, 'Tools · Concept Comparison'),
        e('h1', { className: 'iq-title' }, 'Head-to-head'),
        e('div', { className: 'cmp-empty' },
          e('div', { className: 'cmp-empty-ic' }, e(Icon, { name: 'Swords', size: 26 })),
          e('div', { className: 'cmp-empty-t' }, 'You need two concepts with finished recon to compare.'),
          e('div', { className: 'cmp-empty-s' }, eligible.length === 1
            ? 'One concept is ready. Create another idea and run its three recon missions, then come back to pit them head-to-head.'
            : 'Run all three recon missions on at least two ideas, then come back — CAPCOM will call the stronger concept.'))
      ));
    }

    var A = byId(selA), B = byId(selB);
    var sa = categoryScores(A), sb = categoryScores(B);
    var evA = evidence(A), evB = evidence(B);
    var verdict = makeVerdict(A, B, sa, sb);
    var aWins = CATS.filter(function (c) { return sa[c.id] > sb[c.id]; }).length;
    var bWins = CATS.filter(function (c) { return sb[c.id] > sa[c.id]; }).length;

    function picker(label, sel, onPick) {
      return e('div', { className: 'cmp-picker' },
        e('span', { className: 'cmp-picker-l' }, label),
        e('div', { className: 'cmp-picker-chips' }, eligible.map(function (i) {
          return e('button', { key: i.id, className: 'cmp-chip' + (i.id === sel ? ' on' : ''), onClick: function () { onPick(i.id); } }, i.name);
        })));
    }

    return shell(e(React.Fragment, null,
      e('button', { className: 'id-back', onClick: onBack }, '‹ Hub'),
      e('div', { className: 'id-eyebrow' }, 'Tools · Concept Comparison'),
      e('h1', { className: 'iq-title' }, 'Head-to-head'),

      e('div', { className: 'cmp-pickers' }, picker('Concept A', selA, pickA), picker('Concept B', selB, pickB)),

      /* scoreboard */
      e('div', { className: 'cmp-board' },
        e('div', { className: 'cmp-side' + (verdict.winnerId === A.id ? ' win' : '') },
          e('div', { className: 'cmp-side-name' }, A.name),
          e('div', { className: 'cmp-side-score' }, verdict.ca),
          verdict.winnerId === A.id && e('div', { className: 'cmp-side-tag' }, 'Winner')),
        e('div', { className: 'cmp-vs' }, 'VS'),
        e('div', { className: 'cmp-side' + (verdict.winnerId === B.id ? ' win' : '') },
          e('div', { className: 'cmp-side-name' }, B.name),
          e('div', { className: 'cmp-side-score' }, verdict.cb),
          verdict.winnerId === B.id && e('div', { className: 'cmp-side-tag' }, 'Winner'))),

      /* AI verdict */
      e('div', { className: 'cmp-verdict' },
        e('div', { className: 'cmp-verdict-ic' }, e(Icon, { name: 'Sparkles', size: 15 })),
        e('div', null, e('div', { className: 'cmp-verdict-l' }, 'CAPCOM verdict'), e('div', { className: 'cmp-verdict-t' }, verdict.text))),

      /* per-category rows */
      e('div', { className: 'cmp-rows' }, CATS.map(function (c) {
        var va = sa[c.id], vb = sb[c.id], winA = va > vb, winB = vb > va;
        return e('div', { key: c.id, className: 'cmp-row', style: { '--c': c.hex } },
          e('div', { className: 'cmp-cell a' + (winA ? ' win' : '') },
            e('span', { className: 'cmp-cell-v' }, va), winA && e('span', { className: 'cmp-arrow' }, '▲')),
          e('div', { className: 'cmp-cat', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 } },
            e('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } }, e('span', { className: 'cmp-cat-dot' }), c.title),
            e('div', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, fontFamily: '"DM Mono", ui-monospace, monospace' } },
              e('span', { style: { color: winA ? c.hex : 'rgba(230,240,238,.5)' } }, evA[c.id]),
              e('span', { style: { opacity: .3 } }, '·'),
              e('span', { style: { color: winB ? c.hex : 'rgba(230,240,238,.5)' } }, evB[c.id]))),
          e('div', { className: 'cmp-cell b' + (winB ? ' win' : '') },
            winB && e('span', { className: 'cmp-arrow' }, '▲'), e('span', { className: 'cmp-cell-v' }, vb)));
      })),

      e('div', { className: 'cmp-tally' }, e('b', null, A.name), ' ', e('span', { className: 'cmp-tally-n' }, aWins), ' — ', e('span', { className: 'cmp-tally-n' }, bWins), ' ', e('b', null, B.name)),

      e('button', { className: 'id-back', style: { marginTop: 18 }, onClick: onBack }, '‹ Back to Hub')
    ));
  }

  window.ClarityCompare = ClarityCompare;
})();
