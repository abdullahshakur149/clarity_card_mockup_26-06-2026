/* ============================================================================
   report-render.js — renders sajood's ported report content (window.SajoodReports)
   into section nodes for Clarity's shared report viewer (ClarityReportBody), so
   the Accordion/Tabs toggle + pre-report stat cards are preserved and only the
   section content becomes sajood's exact tables, cards, chips and findings.
   Exposes window.ClarityReportSections = { market, customers, competition }.
   ========================================================================== */
(function () {
  'use strict';
  var e = React.createElement;
  var F = React.Fragment;

  /* ---------- shared render bits ---------- */
  function dataTable(headers, rows, widths) {
    var w = widths || headers.map(function () { return 1; });
    var grid = w.map(function (n) { return n + 'fr'; }).join(' ');
    return e('div', { className: 'sr-table' },
      e('div', { className: 'sr-trow sr-thead', style: { gridTemplateColumns: grid } },
        headers.map(function (h, i) { return e('div', { key: i, className: 'sr-cell sr-cell-h' }, h); })),
      rows.map(function (r, ri) {
        return e('div', { key: ri, className: 'sr-trow', style: { gridTemplateColumns: grid } },
          r.map(function (cell, ci) { return e('div', { key: ci, className: 'sr-cell', 'data-label': headers[ci] }, cell); }));
      }));
  }
  function callout(headline, body, opts) {
    opts = opts || {};
    return e('div', { className: 'sr-card' + (opts.accent ? ' sr-card-accent' : '') },
      opts.icon ? e('div', { className: 'sr-card-ic' }, opts.icon) : null,
      e('div', { className: 'sr-card-b' },
        headline ? e('div', { className: 'sr-card-h' }, headline) : null,
        e('div', { className: 'sr-card-t' }, body)));
  }
  function chipRow(items) { return e('div', { className: 'sr-chips' }, (items || []).map(function (c, i) { return e('span', { key: i, className: 'sr-chip' }, c); })); }
  function bulletList(items, mark) {
    return e('div', { className: 'sr-bullets' }, (items || []).map(function (b, i) {
      return e('div', { key: i, className: 'sr-bullet' + (mark ? ' ' + mark.cls : '') }, e('span', { className: 'sr-bullet-mk' }, mark ? mark.glyph : ''), e('span', null, b));
    }));
  }
  function para(t) { return e('p', { className: 'sr-p' }, t); }
  function overviewText(t) { return e('p', { className: 'sr-overview' }, t); }
  function subhead(t) { return e('div', { className: 'sr-subhead' }, t); }
  function findingsList(list) {
    return e('div', { className: 'sr-findings' }, (list || []).map(function (f, i) {
      return e('div', { key: i, className: 'sr-finding' },
        e('span', { className: 'sr-finding-n' }, i + 1),
        e('div', { className: 'sr-finding-b' },
          e('div', { className: 'sr-finding-h' }, f.headline),
          e('div', { className: 'sr-finding-t' }, f.body)));
    }));
  }
  function sourceList(list) {
    return e('div', { className: 'sr-sources' }, (list || []).map(function (s, i) {
      return e('div', { key: i, className: 'sr-source' },
        e('div', { className: 'sr-source-m' },
          e('div', { className: 'sr-source-pub' }, s.pub),
          e('div', { className: 'sr-source-snip' }, '“' + s.snippet + '”')),
        e('div', { className: 'sr-source-conf' }, s.confidence + ' confidence'));
    }));
  }
  function segRow(l, v) { return e('div', { className: 'sr-mini-row' }, e('span', null, l), e('b', null, v)); }
  function splitFirst(text) { var idx = (text || '').indexOf('. '); if (idx === -1) return { headline: text || '', rest: '' }; return { headline: text.slice(0, idx + 1), rest: text.slice(idx + 2) }; }

  /* ---------- MARKET ---------- */
  function market(d) {
    return [
      { id: 'market', label: 'The Market', node: e(F, null,
        dataTable(['Dimension', 'Finding', 'Confidence'], d.marketTable.map(function (r) { return [r.dim, r.finding, r.confidence]; }), [1, 3, 1]),
        overviewText(d.overview),
        callout(d.trend.headline, d.trend.body, { icon: d.trend.icon, accent: true }),
        callout('Market size: ' + d.marketSize.figure, d.marketSize.interpretation)) },
      { id: 'opportunity', label: 'The Opportunity', node: e(F, null,
        e('div', { className: 'sr-opp-h' }, d.gap.headline),
        para(d.gap.body),
        bulletList(d.gap.reasons),
        dataTable(['Opportunity', 'Size estimate', 'Difficulty'], d.gap.oppTable.map(function (r) { return [r.opportunity, r.size, r.difficulty]; })),
        callout('What this means for you', d.gap.action, { accent: true })) },
      { id: 'buyers', label: 'Who’s Already Buying', node: e(F, null,
        chipRow(d.buyers.chips),
        overviewText(d.buyers.driver),
        dataTable(['Age', 'Revenue range', 'Share'], d.buyers.demoTable.map(function (r) { return [r.age, r.revenueRange, r.percentShare]; })),
        subhead('Psychographics'),
        e('div', { className: 'sr-minis' }, (d.buyers.psychographics || []).map(function (p, i) {
          return e('div', { key: i, className: 'sr-mini' }, e('div', { className: 'sr-mini-h' }, p.label), e('div', { className: 'sr-mini-t' }, p.desc));
        }))) },
      { id: 'competitors', label: 'Your Competitors', node: e(F, null,
        dataTable(['Competitor', 'Strength', 'Weakness', 'Price range'], d.competitors.map(function (c) { return [c.name, c.strength, c.weakness, c.priceRange || '—']; })),
        callout('The gap they’re leaving open', d.competitorGapNote, { accent: true })) },
      { id: 'findings', label: 'Key Findings', node: findingsList(d.findings) },
      { id: 'sources', label: 'Sources', node: sourceList((d.evidence || []).concat(d.sourcesMore || [])) }
    ];
  }

  /* ---------- CUSTOMERS ---------- */
  function driverCol(items, cls) {
    return e('div', { className: 'sr-drivers' }, (items || []).map(function (it, i) {
      return e('div', { key: i, className: 'sr-driver ' + cls },
        e('div', { className: 'sr-driver-top' }, e('span', { className: 'sr-driver-f' }, it.factor), e('span', { className: 'sr-driver-w' }, it.weight + '/10')),
        e('div', { className: 'sr-driver-q' }, '“' + it.quote + '”'));
    }));
  }
  function customers(d) {
    return [
      { id: 'buying', label: 'Who’s Buying', node: e(F, null,
        chipRow(d.demographics.chips),
        overviewText(d.demographics.summary),
        dataTable(['Age', 'Revenue range', 'Share'], (d.demographics.table || []).map(function (r) { return [r.age, r.revenueRange, r.percentShare]; })),
        subhead('Persona snapshots'),
        e('div', { className: 'sr-minis' }, (d.personas || []).map(function (p, i) {
          return e('div', { key: i, className: 'sr-mini' },
            e('div', { className: 'sr-mini-h' }, p.name),
            e('div', { className: 'sr-mini-sub' }, p.role + ' · Age ' + p.age),
            e('div', { className: 'sr-mini-t' }, p.desc),
            segRow('Willing to pay', p.wtpRange));
        }))) },
      { id: 'need', label: 'What They Need', node: e(F, null,
        dataTable(['Job', 'Type', 'Importance', 'Satisfaction', 'Opportunity'],
          (d.jtbdTable || []).map(function (r) { var opp = r.importance + Math.max(r.importance - r.satisfaction, 0); return [r.job, r.type, r.importance + '/10', r.satisfaction + '/10', String(opp)]; }), [3, 1, 1, 1, 1]),
        callout(null, e(F, null, e('b', null, 'How to read Opportunity Score: '), 'Importance + (Importance − Satisfaction), out of 20. Jobs scoring 15+ are the highest-leverage — customers say these matter a lot, but feel underserved today.'))) },
      { id: 'decide', label: 'How They Decide', node:
        dataTable(['Stage', 'Goal', 'Channel', 'Friction', 'KPI'], (d.journey || []).map(function (j) { return [j.stage, j.goal, j.channel, j.friction, j.kpi]; }), [1, 2, 2, 2, 1]) },
      { id: 'drives', label: 'What Drives Them', node: e('div', { className: 'sr-dual' },
        e('div', { className: 'sr-dual-col' }, subhead('Drivers'), driverCol(d.drivers, 'up')),
        e('div', { className: 'sr-dual-col' }, subhead('Barriers'), driverCol(d.barriers, 'down'))) },
      { id: 'segments', label: 'Customer Segments', node: e('div', { className: 'sr-minis' }, (d.segments || []).map(function (s, i) {
        return e('div', { key: i, className: 'sr-mini' },
          e('div', { className: 'sr-mini-h' }, s.name),
          segRow('Size', (s.size || '—') + ' of base'),
          segRow('Willing to pay', s.wtp),
          segRow('Retention', s.retention),
          segRow('Attractiveness', s.attractiveness || '—'),
          e('div', null, (s.triggers || []).map(function (t, ti) { return e('div', { key: ti, className: 'sr-trigger' }, '“' + t + '”'); })));
      })) },
      { id: 'sources', label: 'Sources', node: sourceList((d.evidence || []).concat(d.sourcesMore || [])) }
    ];
  }

  /* ---------- COMPETITION ---------- */
  function positioningMap(m) {
    if (!m) return null;
    function dot(c, isYou) {
      var tp = 100 - c.y, lp = c.x, lbl;
      if (lp >= 68) lbl = { right: 'calc(' + (100 - lp) + '% + 12px)', top: 'calc(' + tp + '% - 9px)' };
      else if (lp <= 32) lbl = { left: 'calc(' + lp + '% + 12px)', top: 'calc(' + tp + '% - 9px)' };
      else lbl = { left: lp + '%', top: 'calc(' + tp + '% + 11px)', transform: 'translateX(-50%)' };
      return e(F, { key: c.name },
        isYou ? e('div', { className: 'sr-map-ring', style: { left: lp + '%', top: tp + '%' } }) : null,
        e('div', { className: 'sr-map-dot' + (isYou ? ' you' : ''), style: { left: lp + '%', top: tp + '%' } }),
        e('div', { className: 'sr-map-lbl' + (isYou ? ' you' : ''), style: lbl }, c.name));
    }
    return e('div', { className: 'sr-map-wrap' },
      e('div', { className: 'sr-map-yaxis' }, e('span', null, 'High'), e('span', { className: 'sr-map-axname' }, m.yLabel), e('span', null, 'Low')),
      e('div', { className: 'sr-map-col' },
        e('div', { className: 'sr-map-field' },
          e('div', { className: 'sr-map-hline' }), e('div', { className: 'sr-map-vline' }),
          (m.competitors || []).map(function (c) { return dot(c, false); }),
          m.you ? dot({ name: 'You', x: m.you.x, y: m.you.y }, true) : null),
        e('div', { className: 'sr-map-xaxis' }, e('span', null, 'Low'), e('span', { className: 'sr-map-axname' }, m.xLabel), e('span', null, 'High'))));
  }
  function competition(d) {
    return [
      { id: 'landscape', label: 'The Landscape', node: e(F, null,
        overviewText(d.overview),
        positioningMap(d.map),
        dataTable(['Player', 'Position', 'Threat level'], (d.summaryTable || []).map(function (r) { return [r.player, r.position, r.threat]; }))) },
      { id: 'players', label: 'Key Players', node: e('div', { className: 'sr-minis' }, (d.players || []).map(function (p, i) {
        var strengths = p.strengths || (p.strength ? [p.strength] : []);
        var weaknesses = p.weaknesses || (p.weakness ? [p.weakness] : []);
        return e('div', { key: i, className: 'sr-mini' },
          e('div', { className: 'sr-mini-h' }, p.name),
          e('div', { className: 'sr-mini-t' }, p.desc || p.pos),
          e('div', { className: 'sr-sw-l' }, 'Strengths'),
          bulletList(strengths, { cls: 'up', glyph: '▲' }),
          e('div', { className: 'sr-sw-l' }, 'Weaknesses'),
          bulletList(weaknesses, { cls: 'down', glyph: '▼' }),
          segRow('Price range', p.priceRange || '—'));
      })) },
      { id: 'win', label: 'Where You Win', node: (function () {
        var ws = splitFirst(d.whitespace);
        return e(F, null,
          e('div', { className: 'sr-opp-h' }, ws.headline),
          ws.rest ? para(ws.rest) : null,
          dataTable(['Advantage', 'Why it matters', 'How to activate'], (d.winTable || []).map(function (r) { return [r.advantage, r.why, r.how]; }), [1, 1, 2]),
          callout('What to do with this', d.whitespaceAction, { accent: true }));
      })() },
      { id: 'risk', label: 'Risk Factors', node:
        dataTable(['Risk', 'Likelihood', 'Impact', 'Mitigation'], (d.riskTable || []).map(function (r) { return [r.risk, r.likelihood + '/5', r.impact + '/5', r.mitigation]; }), [2, 1, 1, 2]) },
      { id: 'sources', label: 'Sources', node: sourceList((d.evidence || []).concat(d.sourcesMore || [])) }
    ];
  }

  function pick(map, sector) { return (map && (map[sector] || map.other)) || null; }
  window.ClarityReportSections = {
    market: market, customers: customers, competition: competition,
    forReport: function (report, sector) {
      var data = pick(window.SajoodReports && window.SajoodReports[report], sector);
      if (!data) return null;
      return (report === 'market' ? market : report === 'customers' ? customers : competition)(data);
    }
  };
})();
