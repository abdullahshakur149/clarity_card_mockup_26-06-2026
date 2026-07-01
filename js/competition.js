/* ============================================================================
   competition.js — "Competition" recon mission (Scout the competition). ref 16-19.png
   Exposes window.ClarityCompetitionMission({ profile, result, onComplete, onBack }).
   Reuses the My Market scan wizard (world-map territory + focus + deploy + scanning),
   but produces a distinct THREAT BOARD of named rivals + a competitor report with a
   real downloadable file. Mocked. Mission-control / teal.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }
  function kit() { return window.ClarityScanKit || {}; }

  var XP = 60;
  var FOCI = [
    { id: 'rivals',      label: 'Top competitors' },
    { id: 'positioning', label: 'Positioning' },
    { id: 'pricing',     label: 'Pricing' },
    { id: 'sov',         label: 'Share of voice' },
    { id: 'gaps',        label: 'Gaps & openings' }
  ];
  var SCAN_LOG = [
    '> ACQUIRING SATELLITE UPLINK…',
    '> IDENTIFYING COMPETITORS…',
    '> MAPPING POSITIONING…',
    '> BENCHMARKING PRICING…',
    '> MEASURING SHARE OF VOICE…',
    '> COMPILING THREAT BOARD…'
  ];
  var EVIDENCE = [
    { id: 'e_01', domain: 'statista.com',      topic: 'Category structure & shares',        url: 'https://www.statista.com/' },
    { id: 'e_03', domain: 'trends.google.com', topic: 'Brand search interest',              url: 'https://trends.google.com/' },
    { id: 'e_05', domain: 'g2.com',            topic: 'Competitor reviews & positioning',   url: 'https://www.g2.com/' },
    { id: 'e_06', domain: 'crunchbase.com',    topic: 'Competitor funding & scale',         url: 'https://www.crunchbase.com/' },
    { id: 'e_07', domain: 'similarweb.com',    topic: 'Competitor traffic & share of voice', url: 'https://www.similarweb.com/' }
  ];
  var SECTORS = {
    food: { category: 'Artisan food & bakery', dq: 81,
      summary: 'A fragmented local set with no dominant brand — the gap is honest behind-the-craft storytelling and a tighter owned-audience pre-order loop.',
      competitors: [
        { name: 'Crumb & Co.', threat: 'High', sov: 34, price: '$$', positioning: 'Established local favourite; strong walk-in trade', note: 'Weak online storytelling — beatable on content.' },
        { name: 'Daily Loaf', threat: 'Medium', sov: 22, price: '$', positioning: 'Value/volume player; supermarket-adjacent', note: 'Competes on price, not craft.' },
        { name: 'Maison Levain', threat: 'Medium', sov: 18, price: '$$$', positioning: 'Premium patisserie; aspirational', note: 'Higher price; narrower audience.' },
        { name: 'Supermarket bakery', threat: 'Low', sov: 26, price: '$', positioning: 'Convenience & price', note: 'No craft credibility.' }
      ],
      findings: [
        { q: 'Market structure', conf: 'High', refs: ['e_01', 'e_07'], text: 'Fragmented — no single brand owns the category locally; share is split across 4–6 players.' },
        { q: 'Where they win', conf: 'Medium', refs: ['e_07'], text: 'Incumbents win on walk-in convenience and habit, not on story or online presence.' },
        { q: 'Your gap', conf: 'High', refs: ['e_03', 'e_05'], text: 'Behind-the-craft content + an owned-audience pre-order loop is under-served — the clearest wedge.' }
      ] },
    retail: { category: 'Independent retail', dq: 80,
      summary: 'A few DTC brands dominate search; the long tail competes on niche. The opening is SEO + retargeting + a sharper owned-audience loop the leaders under-use locally.',
      competitors: [
        { name: 'NorthSupply Co.', threat: 'High', sov: 38, price: '$$', positioning: 'Category leader; owns head search terms', note: 'Strong SEO — flank on niche, not head-on.' },
        { name: 'Drop House', threat: 'Medium', sov: 24, price: '$$$', positioning: 'Hype / limited-drops brand', note: 'Wins on scarcity & community.' },
        { name: 'ValueMart', threat: 'Medium', sov: 21, price: '$', positioning: 'Price-led marketplace seller', note: 'Competes on price; weak brand.' },
        { name: 'Local boutiques', threat: 'Low', sov: 17, price: '$$', positioning: 'Service & curation', note: 'Limited online reach.' }
      ],
      findings: [
        { q: 'Market structure', conf: 'High', refs: ['e_07', 'e_01'], text: 'Top-heavy: 2–3 DTC brands concentrate search and paid share; a long tail competes on niche.' },
        { q: 'Where they win', conf: 'Medium', refs: ['e_07'], text: 'Leaders win on SEO, retargeting and brand; smaller players lack a retention loop.' },
        { q: 'Your gap', conf: 'High', refs: ['e_03'], text: 'Niche positioning + email/SMS owned-audience + limited drops is under-exploited locally.' }
      ] },
    creative: { category: 'Creative services', dq: 78,
      summary: 'Marketplaces undercut on price but not on outcomes. A clear point of view + productised packages + case studies is the wedge against both freelancers and agencies.',
      competitors: [
        { name: 'Freelance marketplaces', threat: 'High', sov: 40, price: '$', positioning: 'Commodity freelance pool', note: 'Cheap but low trust/outcomes.' },
        { name: 'Brandcraft Agency', threat: 'Medium', sov: 26, price: '$$$', positioning: 'Full-service agency; premium', note: 'Slow & expensive — beat on speed/value.' },
        { name: 'Solo specialists', threat: 'Medium', sov: 20, price: '$$', positioning: 'Niche experts via referral', note: 'Strong but capacity-limited.' },
        { name: 'DIY / AI tools', threat: 'Low', sov: 14, price: '$', positioning: 'Templates & AI tools', note: 'Good-enough at the low end only.' }
      ],
      findings: [
        { q: 'Market structure', conf: 'Medium', refs: ['e_07'], text: 'Barbelled: cheap marketplaces at one end, premium agencies at the other; the mid-market is open.' },
        { q: 'Where they win', conf: 'Medium', refs: ['e_07'], text: 'Marketplaces win on price; agencies on breadth. Neither owns “outcome + speed + clear POV”.' },
        { q: 'Your gap', conf: 'High', refs: ['e_06'], text: 'Productised packages with visible case studies capture the under-served mid-market.' }
      ] },
    tech: { category: 'SaaS / software', dq: 80,
      summary: 'Two incumbents own the head term; the play is a sharply-scoped wedge + superior onboarding + founder-led content, not feature parity.',
      competitors: [
        { name: 'IncumbentOne', threat: 'High', sov: 42, price: '$$', positioning: 'Market leader; broad platform', note: 'Owns the head term; bloated — wedge on focus.' },
        { name: 'IncumbentTwo', threat: 'High', sov: 30, price: '$$$', positioning: 'Enterprise-grade challenger', note: 'Strong but heavy/expensive for SMBs.' },
        { name: 'Open-source alt', threat: 'Medium', sov: 16, price: 'Free', positioning: 'Self-host / free tier', note: 'Wins price-sensitive devs; weak support.' },
        { name: 'New entrants', threat: 'Low', sov: 12, price: '$', positioning: 'Point solutions', note: 'Fragmented; no distribution yet.' }
      ],
      findings: [
        { q: 'Market structure', conf: 'High', refs: ['e_07', 'e_01'], text: 'Concentrated at the top: 2 incumbents hold the head term and most paid share.' },
        { q: 'Where they win', conf: 'Medium', refs: ['e_07'], text: 'Incumbents win on brand + breadth; they are slow and broad, leaving niches open.' },
        { q: 'Your gap', conf: 'High', refs: ['e_06', 'e_03'], text: 'A scoped wedge + best-in-class onboarding + “alternative to” content beats parity.' }
      ] },
    trades: { category: 'Local trades & services', dq: 80,
      summary: 'Word-of-mouth dominates and few competitors run a reviews + before/after engine. A fast-response, review-led local presence is the cheapest edge.',
      competitors: [
        { name: 'EstablishedCo', threat: 'High', sov: 36, price: '$$', positioning: 'Long-standing local incumbent', note: 'Reputation lead; slow to respond online.' },
        { name: 'Franchise crew', threat: 'Medium', sov: 24, price: '$$$', positioning: 'Branded franchise; premium', note: 'Pricey; less personal.' },
        { name: 'Handyman pool', threat: 'Medium', sov: 22, price: '$', positioning: 'Cheap, informal operators', note: 'Price-led; inconsistent quality.' },
        { name: 'Lead-gen marketplaces', threat: 'Low', sov: 18, price: '$', positioning: 'Lead platforms', note: 'Commoditised leads.' }
      ],
      findings: [
        { q: 'Market structure', conf: 'Medium', refs: ['e_05', 'e_07'], text: 'Fragmented and local; reputation and proximity decide share more than spend.' },
        { q: 'Where they win', conf: 'High', refs: ['e_07'], text: 'Incumbents win on word-of-mouth and trust; most are weak on reviews / response speed.' },
        { q: 'Your gap', conf: 'High', refs: ['e_03'], text: 'A reviews flywheel + before/after content + minutes-not-hours response wins trust fast.' }
      ] },
    other: { category: 'General market', dq: 74,
      summary: 'A fragmented set with no dominant player. With limited data, the edge is a clearly-positioned, consistent brand and an owned audience.',
      competitors: [
        { name: 'Established player', threat: 'Medium', sov: 30, price: '$$', positioning: 'Largest current share', note: 'Generalist — beatable on focus.' },
        { name: 'Niche challenger', threat: 'Medium', sov: 24, price: '$$', positioning: 'Specialised offering', note: 'Loyal but small audience.' },
        { name: 'Budget option', threat: 'Medium', sov: 26, price: '$', positioning: 'Price-led', note: 'Competes on cost.' },
        { name: 'Fringe / new', threat: 'Low', sov: 20, price: '—', positioning: 'Emerging entrants', note: 'Untested; worth watching.' }
      ],
      findings: [
        { q: 'Market structure', conf: 'Low', refs: ['e_07'], text: 'Fragmented with no clear leader; share is spread and unstable.' },
        { q: 'Where they win', conf: 'Low', refs: ['e_07'], text: 'No competitor owns a clear position — an opening for sharp positioning.' },
        { q: 'Your gap', conf: 'Medium', refs: ['e_03'], text: 'A consistent, well-told position + owned audience differentiates in a muddled field.' }
      ] }
  };

  function fmtDate() { try { var M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; var d = new Date(); return M[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); } catch (e) { return 'July 1, 2026'; } }
  function regionNames(regions) {
    var R = kit().REGIONS || [];
    return regions && regions.length ? regions.map(function (id) { return (R.filter(function (r) { return r.id === id; })[0] || {}).label; }).join(', ') : 'Global';
  }
  function buildReport(profile, regions) {
    var s = SECTORS[profile.sector] || SECTORS.other;
    return { xp: XP, category: s.category, region: regionNames(regions), dq: s.dq, date: fmtDate(),
      reportType: 'competitive', sources: EVIDENCE.length, depth: 'Standard (3 queries)',
      summary: s.summary, competitors: s.competitors, findings: s.findings, evidence: EVIDENCE };
  }

  /* ── Real downloadable competitor report ── */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
  function reportHtml(r) {
    var comp = '<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-size:12px;margin:6px 0"><tr style="background:#f1f5f9"><td><b>Competitor</b></td><td><b>Threat</b></td><td><b>Share of voice</b></td><td><b>Pricing</b></td><td><b>Positioning</b></td></tr>'
      + r.competitors.map(function (c) { return '<tr><td>' + esc(c.name) + '</td><td>' + esc(c.threat) + '</td><td>' + c.sov + '%</td><td>' + esc(c.price) + '</td><td>' + esc(c.positioning) + '</td></tr>'; }).join('') + '</table>';
    var find = r.findings.map(function (x) { return '<h3 style="margin:12px 0 2px">' + esc(x.q) + ' <span style="font-weight:normal;color:#777;font-size:11px">(' + esc(x.conf) + ' confidence)</span></h3><p style="margin:2px 0">' + esc(x.text) + '</p><p style="margin:2px 0;color:#888;font-size:11px">Sources: ' + esc(x.refs.join(', ')) + '</p>'; }).join('');
    var ev = r.evidence.map(function (x) { return '<p style="margin:3px 0;font-size:11px">' + esc(x.id) + ' — <b>' + esc(x.domain) + '</b> — ' + esc(x.topic) + ' — <a href="' + esc(x.url) + '">' + esc(x.url) + '</a></p>'; }).join('');
    return '<html xmlns:o="urn:schemas-microsoft-office:office" xmlns:w="urn:schemas-microsoft-office:office:word" xmlns="http://www.w3.org/TR/REC-html40">'
      + '<head><meta charset="utf-8"><title>Competitor scan — ' + esc(r.category) + '</title></head>'
      + '<body style="font-family:Calibri,Arial,sans-serif;color:#111;max-width:720px">'
      + '<h1 style="margin-bottom:2px">Competitor scan — ' + esc(r.category) + '</h1>'
      + '<p style="color:#666;margin:0">Generated by the Clarity agent platform · ' + esc(r.date) + '</p>'
      + '<p style="color:#666;margin:2px 0 10px">Report type: ' + esc(r.reportType) + ' · Overall DQ: ' + r.dq + '% · Territory: ' + esc(r.region) + '</p>'
      + '<h2>Executive summary</h2><p>' + esc(r.summary) + '</p>'
      + '<h2>Threat board</h2>' + comp
      + '<h2>Key findings</h2>' + find
      + '<h2>Evidence appendix</h2>' + ev + '</body></html>';
  }
  function downloadReport(r) {
    try {
      var blob = new Blob(['﻿', reportHtml(r)], { type: 'application/msword' });
      var url = URL.createObjectURL(blob); var a = document.createElement('a');
      a.href = url; a.download = 'Competitor_scan_' + slug(r.category) + '.doc';
      document.body.appendChild(a); a.click();
      setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 200);
    } catch (err) {}
  }

  function ClarityCompetitionMission(props) {
    var profile = props.profile || {}, onComplete = props.onComplete, onBack = props.onBack;
    var WorldMap = kit().WorldMap, REGIONS = kit().REGIONS || [];

    var vw = React.useState(props.result ? 'result' : 'brief'); var view = vw[0], setView = vw[1];
    var sp = React.useState(0);   var step = sp[0], setStep = sp[1];
    var rg = React.useState([]);  var regions = rg[0], setRegions = rg[1];
    var fo = React.useState(['rivals', 'positioning', 'sov']); var foci = fo[0], setFoci = fo[1];
    var rs = React.useState(props.result || null); var result = rs[0], setResult = rs[1];
    var rv = React.useState(0);   var revealed = rv[0], setRevealed = rv[1];

    var soldWhat = (profile.desc || 'your product').trim();
    function toggleRegion(id) { setRegions(function (a) { return a.indexOf(id) >= 0 ? a.filter(function (x) { return x !== id; }) : a.concat([id]); }); }
    function toggleFocus(id) { setFoci(function (a) { return a.indexOf(id) >= 0 ? a.filter(function (x) { return x !== id; }) : a.concat([id]); }); }

    React.useEffect(function () {
      if (view !== 'running') return;
      var n = 0; setRevealed(0);
      var iv = setInterval(function () { n++; setRevealed(n); if (n >= SCAN_LOG.length) clearInterval(iv); }, 440);
      var t = setTimeout(function () { var r = buildReport(profile, regions); setResult(r); setView('result'); if (onComplete) onComplete(r); }, 2900);
      return function () { clearInterval(iv); clearTimeout(t); };
    }, [view]);

    function bg() { return e('div', { className: 'pf-bg' }, e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-grid' }), e('div', { className: 'pf-bg-scan' }), e('div', { className: 'pf-bg-vignette' })); }
    function capcom(line) {
      return e('div', { className: 'capcom' },
        e('div', { className: 'capcom-avatar' }, e('i', null), e('i', null), e('i', null), e('i', null), e('i', null)),
        e('div', { className: 'capcom-body' }, e('div', { className: 'capcom-name' }, e('b', null, 'CAPCOM'), e('span', null, 'Launch Director')), e('div', { className: 'capcom-line' }, line)));
    }
    function shell(inner) {
      return e('div', { className: 'id-root' }, bg(),
        e('div', { className: 'pf-topbar' },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } }, e('span', { className: 'pf-wordmark' }, 'Clarity'), e('span', { className: 'pf-hide-sm' }, 'Mission Control // Recon · Competition')),
          e('div', { className: 'pf-tele' }, e('span', { className: 'pf-hide-sm' }, 'Guidance: CAPCOM'), e('span', { className: 'pf-live' }, e('i', null), 'Live'))),
        e('div', { className: 'id-main' }, inner));
    }

    /* ── BRIEF ── */
    if (view === 'brief') {
      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: onBack }, '‹ Back to deck'),
        e('div', { className: 'id-eyebrow' }, 'Recon mission · Competition'),
        e('h1', { className: 'mm-title' }, 'Scout the competition'),
        capcom('No competitive intel yet, operator. Run a recon scan and I will map the threat board.'),
        e('div', { className: 'mm-statgrid' }, [['Competitors', '—'], ['Top threat', '—'], ['Avg pricing', '—'], ['Open gaps', '0']].map(function (s, i) { return e('div', { key: i, className: 'mm-stat' }, e('div', { className: 'mm-stat-l' }, s[0]), e('div', { className: 'mm-stat-v dim' }, s[1])); })),
        e('button', { className: 'pf-cta mm-cta', onClick: function () { setView('scan'); setStep(0); } }, 'Run scan →')));
    }

    /* ── SCAN WIZARD (reuses the world map) ── */
    if (view === 'scan') {
      var node;
      if (step === 0) {
        node = e(React.Fragment, null,
          capcom('Where should I scout? Mark the territory — tap regions on the map.'),
          e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), 'Territory'),
          WorldMap ? e(WorldMap, { selected: regions, onToggle: toggleRegion, scanning: false }) : e('div', { className: 'mm-chosen-empty' }, 'Map unavailable.'),
          e('div', { className: 'mm-chosen' }, regions.length === 0 ? e('span', { className: 'mm-chosen-empty' }, 'No regions marked yet.') : regions.map(function (id) { var r = REGIONS.filter(function (x) { return x.id === id; })[0] || {}; return e('span', { key: id, className: 'mm-tag' }, r.label, e('button', { onClick: function () { toggleRegion(id); } }, '×')); })),
          e('div', { className: 'mm-inferred' }, e(Icon, { name: 'Sparkles', size: 13 }), e('span', { className: 'mm-inferred-l' }, 'What you sell'), e('span', { className: 'mm-inferred-v' }, soldWhat), e('span', { className: 'mm-inferred-badge' }, 'Inferred')),
          e('button', { className: 'pf-cta mm-cta', onClick: function () { setStep(1); }, disabled: regions.length === 0 }, 'Confirm territory →'));
      } else if (step === 1) {
        node = e(React.Fragment, null,
          capcom('What should the scout look for? Pick your recon focus.'),
          e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), 'Recon focus'),
          e('div', { className: 'mm-foci' }, FOCI.map(function (f) { var on = foci.indexOf(f.id) >= 0; return e('button', { key: f.id, className: 'ob-opt' + (on ? ' sel' : ''), onClick: function () { toggleFocus(f.id); } }, f.label); })),
          e('div', { className: 'mm-row' }, e('button', { className: 'id-back', onClick: function () { setStep(0); } }, '‹ Territory'), e('button', { className: 'pf-cta mm-cta', onClick: function () { setStep(2); }, disabled: foci.length === 0 }, 'Confirm focus →')));
      } else {
        node = e(React.Fragment, null,
          capcom('Recon parameters locked. Deploy the scout when ready, operator.'),
          e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), 'Scan summary'),
          e('div', { className: 'mm-summary' },
            e('div', { className: 'mm-srow' }, e('span', null, 'Territory'), e('b', null, regions.length + ' region' + (regions.length > 1 ? 's' : '') + ' · ' + regionNames(regions))),
            e('div', { className: 'mm-srow' }, e('span', null, 'Focus'), e('b', null, foci.map(function (id) { return (FOCI.filter(function (x) { return x.id === id; })[0] || {}).label; }).join(' · '))),
            e('div', { className: 'mm-srow' }, e('span', null, 'Category'), e('b', null, soldWhat))),
          e('div', { className: 'mm-row' }, e('button', { className: 'id-back', onClick: function () { setStep(1); } }, '‹ Focus'), e('button', { className: 'pf-cta mm-cta', onClick: function () { setView('running'); } }, 'Deploy scout →')));
      }
      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: onBack }, '‹ Abort'),
        e('div', { className: 'id-eyebrow' }, 'Recon mission · Competition'),
        e('div', { className: 'mm-steps' }, ['Territory', 'Focus', 'Deploy'].map(function (s, i) { return e('span', { key: s, className: 'mm-step' + (i === step ? ' on' : '') + (i < step ? ' done' : '') }, (i + 1) + ' ' + s); })),
        e('div', { className: 'mm-panel', key: step }, node)));
    }

    /* ── RUNNING ── */
    if (view === 'running') {
      return shell(e(React.Fragment, null,
        e('div', { className: 'id-eyebrow' }, 'Recon mission · Competition'),
        e('h1', { className: 'mm-title' }, 'Scouting…'),
        WorldMap && e(WorldMap, { selected: regions, onToggle: function () {}, scanning: true }),
        e('div', { className: 'mm-log' }, SCAN_LOG.slice(0, revealed).map(function (l, i) { return e('div', { key: i, className: i === revealed - 1 ? 'live' : '' }, l); })),
        e('div', { className: 'mm-bar' }, e('i', null))));
    }

    /* ── RESULT — threat board + competitor report ── */
    var r = result || buildReport(profile, regions);
    function metaTag(l, v) { return e('span', { className: 'mm-rtag' }, e('b', null, l), v); }
    function sec(t) { return e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), t); }
    var topThreat = (r.competitors.filter(function (c) { return c.threat === 'High'; })[0] || r.competitors[0] || {}).name;
    return shell(e(React.Fragment, null,
      e('button', { className: 'id-back', onClick: onBack }, '‹ Back to deck'),
      e('div', { className: 'mm-acq' }, e('span', { className: 'mm-acq-stamp' }, 'Intel Acquired'), e('span', { className: 'mm-acq-xp' }, '+ ', r.xp, ' XP')),
      e('h1', { className: 'mm-title' }, 'Competitive intel'),
      capcom('Scout complete. Here is the threat board — who you are up against and where the gaps are.'),

      e('div', { className: 'mm-rephead' },
        e('div', { className: 'mm-dq', style: { background: 'conic-gradient(var(--clr-primary-hover) ' + (r.dq * 3.6) + 'deg, var(--clr-border) 0)' } },
          e('div', { className: 'mm-dq-in' }, e('span', { className: 'mm-dq-num' }, r.dq + '%'), e('span', { className: 'mm-dq-l' }, 'Data quality'))),
        e('div', { className: 'mm-repmeta' },
          e('div', { className: 'mm-repmeta-title' }, 'Competitor scan — ' + r.category),
          e('div', { className: 'mm-repmeta-sub' }, 'Top threat: ' + topThreat + ' · ' + r.competitors.length + ' competitors mapped'),
          e('div', { className: 'mm-rtags' }, metaTag('Report ', 'competitive'), metaTag('Sources ', r.sources), metaTag('Depth ', 'Standard'), metaTag('Territory ', r.region))),
        e('button', { className: 'pf-cta mm-cta mm-dl', onClick: function () { downloadReport(r); } }, e(Icon, { name: 'Download', size: 15 }), ' Download report')),

      sec('The gap'), e('p', { className: 'mm-summary-box' }, r.summary),

      sec('Threat board'),
      e('div', { className: 'co-board' }, r.competitors.map(function (c, i) {
        return e('div', { key: i, className: 'co-comp' },
          e('div', { className: 'co-comp-head' },
            e('span', { className: 'co-name' }, c.name),
            e('span', { className: 'co-threat ' + c.threat.toLowerCase() }, c.threat + ' threat'),
            e('span', { className: 'co-price' }, c.price)),
          e('div', { className: 'co-sov' },
            e('span', { className: 'co-sov-l' }, 'Share of voice'),
            e('div', { className: 'co-sov-bar' }, e('i', { style: { width: c.sov + '%' } })),
            e('span', { className: 'co-sov-p' }, c.sov + '%')),
          e('div', { className: 'co-pos' }, c.positioning),
          e('div', { className: 'co-note' }, c.note));
      })),

      sec('Key findings'),
      e('div', { className: 'mm-findings' }, r.findings.map(function (f, i) {
        return e('div', { key: i, className: 'mm-finding', style: { animationDelay: (0.06 * i + 0.05) + 's' } },
          e('div', { className: 'mm-finding-top' }, e('span', { className: 'mm-finding-q' }, f.q), e('span', { className: 'mm-conf ' + f.conf.toLowerCase() }, f.conf + ' confidence')),
          e('p', { className: 'mm-finding-text' }, f.text),
          e('div', { className: 'mm-finding-refs' }, 'Sources: ' + f.refs.join(', ')));
      })),

      sec('Evidence appendix · ' + r.evidence.length + ' sources'),
      e('div', { className: 'mm-evidence' }, r.evidence.map(function (ev, i) {
        return e('a', { key: i, className: 'mm-evrow', href: ev.url, target: '_blank', rel: 'noreferrer' },
          e('span', { className: 'mm-ev-id' }, ev.id), e('span', { className: 'mm-ev-domain' }, ev.domain), e('span', { className: 'mm-ev-topic' }, ev.topic), e(Icon, { name: 'ExternalLink', size: 12 }));
      })),

      e('div', { className: 'mm-row' },
        e('button', { className: 'id-back', onClick: function () { setResult(null); setView('scan'); setStep(0); } }, '↻ Re-scan'),
        e('button', { className: 'pf-cta mm-cta', onClick: onBack }, 'Back to Command Deck →'))
    ));
  }

  window.ClarityCompetitionMission = ClarityCompetitionMission;
})();
