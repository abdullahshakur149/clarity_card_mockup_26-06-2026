/* ============================================================================
   market.js — "My Market" recon mission (Scan my market).  ref 8-12.png
   Exposes window.ClarityMarketMission({ profile, result, onComplete, onBack }).
   Flow: brief → scan wizard (world-map territory + focus + deploy) → scanning
   cinematic → INTEL REPORT (findings-first, honest DQ, evidence appendix) with a
   real downloadable Word file. Mocked outputs. Mission-control / teal.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }

  /* Stylised low-poly continents (viewBox 0 0 480 240) — tactical territory select */
  var REGIONS = [
    { id: 'na', label: 'North America', lx: 100, ly: 74,  points: '60,40 120,32 150,55 140,78 150,96 120,100 95,118 80,100 64,108 52,80 58,58' },
    { id: 'sa', label: 'South America', lx: 140, ly: 170, points: '118,130 150,128 165,150 158,180 138,210 122,198 116,165' },
    { id: 'eu', label: 'Europe',        lx: 262, ly: 62,  points: '240,48 280,44 292,58 286,74 262,82 244,72 236,58' },
    { id: 'af', label: 'Africa',        lx: 278, ly: 135, points: '250,92 300,90 312,128 292,170 262,178 246,150 244,116' },
    { id: 'as', label: 'Asia',          lx: 372, ly: 70,  points: '300,38 400,32 440,55 432,90 380,108 330,100 304,80 296,56' },
    { id: 'oc', label: 'Oceania',       lx: 418, ly: 184, points: '392,168 436,162 448,186 422,202 396,194' }
  ];
  var FOCI = [
    { id: 'demand',  label: 'Demand signals' },
    { id: 'competitors', label: 'Competitors' },
    { id: 'pricing', label: 'Pricing benchmarks' },
    { id: 'trends',  label: 'Local trends' }
  ];
  var SCAN_LOG = [
    '> ACQUIRING SATELLITE UPLINK…',
    '> MAPPING SELECTED TERRITORY…',
    '> TRIANGULATING COMPETITORS…',
    '> READING DEMAND SIGNALS…',
    '> SYNTHESISING FINDINGS…',
    '> COMPILING INTEL DOSSIER…'
  ];
  var XP = 60;

  /* sector-flavoured report bank (mocked, findings-first, honest DQ) */
  var SECTORS = {
    food: { category: 'Artisan food & bakery', dq: 84, stats: { competitors: 7, avg: '$6.40', signals: 4 },
      summary: 'A growing premium niche within a mature category: independents are winning share from mass-produced incumbents on provenance, craft and story. Demand is healthy and local — the constraint is differentiation and capacity, not interest.',
      findings: [
        { q: 'Market size & growth', conf: 'Medium', refs: ['e_01', 'e_02'], text: 'The premium/artisan baked-goods segment is mature but steadily expanding (mid-single-digit % CAGR), with independents outpacing the broader category as consumers trade up on quality and provenance.' },
        { q: 'Demand signals', conf: 'High', refs: ['e_03', 'e_04'], text: 'Search and social interest in “local bakery”, “sourdough” and “artisan” is up ~18% YoY, concentrated on weekends and around holidays — strong, repeatable local intent.' },
        { q: 'Competition', conf: 'Medium', refs: ['e_05', 'e_07'], text: 'The local set is fragmented — typically 5–8 independents within ~5km plus supermarket bakery aisles. Few tell a compelling behind-the-craft story, leaving a clear positioning gap.' },
        { q: 'Pricing benchmarks', conf: 'Medium', refs: ['e_06'], text: 'Premium loaves benchmark at ~$6–8 (specialty/sourdough at the top end). Customers tolerate the premium when craft and provenance are visible.' },
        { q: 'Opportunity', conf: 'High', refs: ['e_03', 'e_04'], text: '“Behind-the-craft” content (process, people, the 4am bake) outperforms product-only posts; owned channels (email, IG) convert best for pre-orders and standing weekly orders.' }
      ] },
    retail: { category: 'Independent retail & products', dq: 82, stats: { competitors: 11, avg: '$28', signals: 4 },
      summary: 'A crowded but navigable market where discovery and retention beat raw reach. DTC-savvy independents win with limited drops, bundles and a sharp owned-audience strategy.',
      findings: [
        { q: 'Market size & growth', conf: 'Medium', refs: ['e_01', 'e_02'], text: 'Independent/DTC retail continues to grow modestly overall, with category winners concentrating share through brand and community rather than price.' },
        { q: 'Demand signals', conf: 'High', refs: ['e_03'], text: 'Online discovery is driving ~22% more qualified visits; “near me” and brand-name search intent is rising, especially on mobile.' },
        { q: 'Competition', conf: 'Medium', refs: ['e_07', 'e_05'], text: 'Two to three DTC brands typically dominate category search; the long tail competes on niche and service. SEO and retargeting are under-exploited by smaller players.' },
        { q: 'Pricing benchmarks', conf: 'Medium', refs: ['e_06'], text: 'Average order value benchmarks around $25–35; bundles and limited editions lift AOV and urgency without discounting the core line.' },
        { q: 'Opportunity', conf: 'High', refs: ['e_03', 'e_04'], text: 'Limited drops, bundles and an email/SMS owned-audience loop are the highest-ROI moves; content showing product in real use converts best.' }
      ] },
    creative: { category: 'Creative & services', dq: 79, stats: { competitors: 9, avg: '$850/project', signals: 3 },
      summary: 'A trust-led services market where portfolio and proof win work. Demand for combined brand+content packages is rising; price pressure comes from marketplaces, not local peers.',
      findings: [
        { q: 'Market size & growth', conf: 'Low', refs: ['e_02'], text: 'Hard to size precisely (fragmented, project-based), but demand for outcome-oriented brand+content packages is clearly expanding among SMBs.' },
        { q: 'Demand signals', conf: 'Medium', refs: ['e_03', 'e_04'], text: 'Inbound intent skews to “brand + content” bundles over one-off deliverables; referrals and portfolio discovery drive most qualified leads.' },
        { q: 'Competition', conf: 'Medium', refs: ['e_07'], text: 'Freelancer marketplaces undercut on price but rarely on outcomes; differentiation comes from a clear point of view and visible results.' },
        { q: 'Pricing benchmarks', conf: 'Medium', refs: ['e_06'], text: 'Project pricing benchmarks ~$500–1,500 for SMB brand/content work; retainers stabilise revenue and signal seniority.' },
        { q: 'Opportunity', conf: 'High', refs: ['e_03'], text: 'Portfolio-led IG/site presence and case studies convert best; productised packages reduce sales friction and raise perceived value.' }
      ] },
    tech: { category: 'SaaS / software', dq: 80, stats: { competitors: 14, avg: '$29/mo', signals: 4 },
      summary: 'A competitive but expandable category where niche tooling and founder-led distribution beat head-on feature wars. Content and community drive efficient signups.',
      findings: [
        { q: 'Market size & growth', conf: 'Medium', refs: ['e_01', 'e_02'], text: 'The broader category is large and growing; the addressable niche is smaller but expanding ~30% YoY as workflows specialise.' },
        { q: 'Demand signals', conf: 'High', refs: ['e_03', 'e_04'], text: 'Search demand for the specific use-case is up ~31% YoY; intent clusters around integrations, pricing and “alternative to” queries.' },
        { q: 'Competition', conf: 'Medium', refs: ['e_07'], text: 'Two incumbents own the head term; the opening is a sharply-scoped wedge and superior onboarding rather than feature parity.' },
        { q: 'Pricing benchmarks', conf: 'Medium', refs: ['e_06'], text: 'Entry tiers benchmark ~$15–39/mo; usage- and seat-based hybrids are common. Annual plans lift LTV materially.' },
        { q: 'Opportunity', conf: 'High', refs: ['e_03'], text: 'Founder-led content, “alternative to” comparison pages and a free tier drive the most efficient signups; community compounds retention.' }
      ] },
    trades: { category: 'Local trades & services', dq: 81, stats: { competitors: 6, avg: '$120/job', signals: 3 },
      summary: 'A high-intent local market won on trust and proximity. “Near me” demand is rising; reviews, response time and visible workmanship beat advertising spend.',
      findings: [
        { q: 'Market size & growth', conf: 'Medium', refs: ['e_02', 'e_05'], text: 'Steady local demand tied to housing activity and seasonality; little category disruption, so share is won on reputation and reliability.' },
        { q: 'Demand signals', conf: 'High', refs: ['e_03'], text: '“Near me” search intent is climbing and is overwhelmingly mobile and same-week; speed-to-respond strongly predicts win rate.' },
        { q: 'Competition', conf: 'Medium', refs: ['e_05', 'e_07'], text: 'Word-of-mouth still dominates; few local competitors run a tight reviews + before/after content engine, which is the clearest edge.' },
        { q: 'Pricing benchmarks', conf: 'Medium', refs: ['e_06'], text: 'Typical job values benchmark ~$90–180 depending on scope; transparent quoting and fast callbacks reduce price sensitivity.' },
        { q: 'Opportunity', conf: 'High', refs: ['e_03'], text: 'A reviews flywheel plus before/after posts and a Google Business presence win trust; responding within minutes is the cheapest growth lever.' }
      ] },
    other: { category: 'General market', dq: 74, stats: { competitors: 8, avg: '$—', signals: 3 },
      summary: 'A fragmented market with steady, seasonally-peaking demand. With limited category-specific data, the safest edge is an owned audience and a clear, repeatable offer.',
      findings: [
        { q: 'Market size & growth', conf: 'Low', refs: ['e_02'], text: 'Category is broad and hard to size precisely; expect steady demand with seasonal peaks rather than rapid structural growth.' },
        { q: 'Demand signals', conf: 'Medium', refs: ['e_03'], text: 'Search interest is stable with periodic spikes; align launches and promotions to those peaks for outsized return.' },
        { q: 'Competition', conf: 'Low', refs: ['e_07'], text: 'The competitive set is fragmented with no dominant player — an opening for a clearly-positioned, consistent brand.' },
        { q: 'Pricing benchmarks', conf: 'Low', refs: ['e_06'], text: 'Limited public pricing data; test 2–3 price points with your owned audience before committing.' },
        { q: 'Opportunity', conf: 'Medium', refs: ['e_03'], text: 'An owned audience (email/social) consistently outperforms paid for fragmented markets; lead with one repeatable, well-told offer.' }
      ] }
  };

  function fmtDate() {
    try {
      var M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var d = new Date(); return M[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    } catch (e) { return 'June 30, 2026'; }
  }
  function buildEvidence(category) {
    return [
      { id: 'e_01', domain: 'statista.com',    topic: 'Category market size & growth — ' + category, url: 'https://www.statista.com/outlook/' },
      { id: 'e_02', domain: 'ibisworld.com',   topic: 'Industry research report — ' + category,       url: 'https://www.ibisworld.com/united-states/' },
      { id: 'e_03', domain: 'trends.google.com', topic: 'Search-demand trend (12-month)',              url: 'https://trends.google.com/trends/' },
      { id: 'e_04', domain: 'deloitte.com',    topic: 'Consumer & sector outlook 2026',               url: 'https://www.deloitte.com/us/en/insights/' },
      { id: 'e_05', domain: 'census.gov',      topic: 'Regional business & household spend',          url: 'https://www.census.gov/data/' },
      { id: 'e_06', domain: 'mckinsey.com',    topic: 'Pricing & willingness-to-pay benchmarks',      url: 'https://www.mckinsey.com/industries/' },
      { id: 'e_07', domain: 'similarweb.com',  topic: 'Competitor traffic & channel mix',             url: 'https://www.similarweb.com/' }
    ];
  }
  function buildReport(profile, regions) {
    var s = SECTORS[profile.sector] || SECTORS.other;
    var region = regions && regions.length
      ? regions.map(function (id) { return (REGIONS.filter(function (r) { return r.id === id; })[0] || {}).label; }).join(', ')
      : 'Global';
    var evidence = buildEvidence(s.category);
    return { xp: XP, category: s.category, region: region, dq: s.dq, date: fmtDate(),
      sources: evidence.length, depth: 'Standard (3 queries)', sections: s.findings.length,
      summary: s.summary, stats: s.stats, findings: s.findings, evidence: evidence };
  }

  /* ── Real downloadable Word file ── */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
  function buildWordHtml(r) {
    var f = r.findings.map(function (x) {
      return '<h3 style="margin:14px 0 2px">' + esc(x.q) + ' <span style="font-weight:normal;color:#777;font-size:11px">(' + esc(x.conf) + ' confidence)</span></h3>'
        + '<p style="margin:2px 0">' + esc(x.text) + '</p>'
        + '<p style="margin:2px 0;color:#888;font-size:11px">Sources: ' + esc(x.refs.join(', ')) + '</p>';
    }).join('');
    var ev = r.evidence.map(function (x) {
      return '<p style="margin:3px 0;font-size:11px">' + esc(x.id) + ' — <b>' + esc(x.domain) + '</b> — ' + esc(x.topic) + ' — <a href="' + esc(x.url) + '">' + esc(x.url) + '</a></p>';
    }).join('');
    return '<html xmlns:o="urn:schemas-microsoft-office:office" xmlns:w="urn:schemas-microsoft-office:office:word" xmlns="http://www.w3.org/TR/REC-html40">'
      + '<head><meta charset="utf-8"><title>Market scan — ' + esc(r.category) + '</title></head>'
      + '<body style="font-family:Calibri,Arial,sans-serif;color:#111;max-width:720px">'
      + '<h1 style="margin-bottom:2px">Market scan — ' + esc(r.category) + '</h1>'
      + '<p style="color:#666;margin:0">Generated by the Clarity agent platform · ' + esc(r.date) + '</p>'
      + '<p style="color:#666;margin:2px 0 10px">Report type: market · Overall DQ: ' + r.dq + '% · Territory: ' + esc(r.region) + '</p>'
      + '<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-size:12px;margin:8px 0">'
      + '<tr style="background:#f1f5f9"><td><b>Sources</b></td><td><b>Depth</b></td><td><b>DQ overall</b></td><td><b>Sections</b></td></tr>'
      + '<tr><td>' + r.sources + '</td><td>' + esc(r.depth) + '</td><td>' + r.dq + '%</td><td>' + r.sections + '</td></tr></table>'
      + '<h2>Executive summary</h2><p>' + esc(r.summary) + '</p>'
      + '<h2>Key findings</h2>' + f
      + '<h2>Evidence appendix</h2>' + ev
      + '</body></html>';
  }
  function downloadReport(r) {
    try {
      var blob = new Blob(['﻿', buildWordHtml(r)], { type: 'application/msword' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'Market_scan_' + slug(r.category) + '.doc';
      document.body.appendChild(a); a.click();
      setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 200);
    } catch (err) { /* no-op in the mockup */ }
  }

  /* ── World map ── */
  function WorldMap(props) {
    var selected = props.selected, onToggle = props.onToggle, scanning = props.scanning;
    return e('div', { className: 'mm-mapwrap' },
      e('svg', { className: 'mm-map' + (scanning ? ' scanning' : ''), viewBox: '0 0 480 240' },
        [80, 160, 240, 320, 400].map(function (x) { return e('line', { key: 'v' + x, className: 'mm-grat', x1: x, y1: 0, x2: x, y2: 240 }); }),
        [48, 96, 144, 192].map(function (y) { return e('line', { key: 'h' + y, className: 'mm-grat', x1: 0, y1: y, x2: 480, y2: y }); }),
        REGIONS.map(function (r) {
          var on = selected.indexOf(r.id) >= 0;
          return e('g', { key: r.id, className: 'mm-region' + (on ? ' sel' : ''), onClick: function () { onToggle(r.id); } },
            e('polygon', { points: r.points }),
            e('text', { x: r.lx, y: r.ly, className: 'mm-region-label' }, r.label));
        })
      ),
      scanning && e('div', { className: 'mm-sweep' })
    );
  }

  function ClarityMarketMission(props) {
    var profile = props.profile || {}, onComplete = props.onComplete, onBack = props.onBack;

    var vw = React.useState(props.result ? 'result' : 'brief'); var view = vw[0], setView = vw[1];
    var sp = React.useState(0);   var step = sp[0], setStep = sp[1];
    var rg = React.useState([]);  var regions = rg[0], setRegions = rg[1];
    var fo = React.useState(['demand', 'competitors', 'pricing']); var foci = fo[0], setFoci = fo[1];
    var rs = React.useState(props.result || null); var result = rs[0], setResult = rs[1];
    var rv = React.useState(0);   var revealed = rv[0], setRevealed = rv[1];

    var soldWhat = (profile.desc || 'your product').trim();

    function toggleRegion(id) { setRegions(function (a) { return a.indexOf(id) >= 0 ? a.filter(function (x) { return x !== id; }) : a.concat([id]); }); }
    function toggleFocus(id) { setFoci(function (a) { return a.indexOf(id) >= 0 ? a.filter(function (x) { return x !== id; }) : a.concat([id]); }); }

    React.useEffect(function () {
      if (view !== 'running') return;
      var n = 0; setRevealed(0);
      var iv = setInterval(function () { n++; setRevealed(n); if (n >= SCAN_LOG.length) clearInterval(iv); }, 440);
      var t = setTimeout(function () {
        var r = buildReport(profile, regions);
        setResult(r); setView('result');
        if (onComplete) onComplete(r);
      }, 2900);
      return function () { clearInterval(iv); clearTimeout(t); };
    }, [view]);

    function bg() { return e('div', { className: 'pf-bg' }, e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-grid' }), e('div', { className: 'pf-bg-scan' }), e('div', { className: 'pf-bg-vignette' })); }
    function capcom(line) {
      return e('div', { className: 'capcom' },
        e('div', { className: 'capcom-avatar' }, e('i', null), e('i', null), e('i', null), e('i', null), e('i', null)),
        e('div', { className: 'capcom-body' },
          e('div', { className: 'capcom-name' }, e('b', null, 'CAPCOM'), e('span', null, 'Launch Director')),
          e('div', { className: 'capcom-line' }, line)));
    }
    function shell(inner) {
      return e('div', { className: 'id-root' }, bg(),
        e('div', { className: 'pf-topbar' },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
            e('span', { className: 'pf-wordmark' }, 'Clarity'),
            e('span', { className: 'pf-hide-sm' }, 'Mission Control // Recon · My Market')),
          e('div', { className: 'pf-tele' }, e('span', { className: 'pf-hide-sm' }, 'Guidance: CAPCOM'), e('span', { className: 'pf-live' }, e('i', null), 'Live'))),
        e('div', { className: 'id-main' }, inner));
    }

    /* ── BRIEF ── */
    if (view === 'brief') {
      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: onBack }, '‹ Back to deck'),
        e('div', { className: 'id-eyebrow' }, 'Recon mission · My Market'),
        e('h1', { className: 'mm-title' }, 'Scan the market'),
        capcom('No market intel yet, operator. Run a recon scan — I will come back with findings, not just links.'),
        e('div', { className: 'mm-statgrid' },
          [['Category', '—'], ['Competitors', '—'], ['Avg price', '—'], ['Signals', '0']].map(function (s, i) {
            return e('div', { key: i, className: 'mm-stat' }, e('div', { className: 'mm-stat-l' }, s[0]), e('div', { className: 'mm-stat-v dim' }, s[1]));
          })),
        e('button', { className: 'pf-cta mm-cta', onClick: function () { setView('scan'); setStep(0); } }, 'Run scan →')
      ));
    }

    /* ── SCAN WIZARD ── */
    if (view === 'scan') {
      var stepNode;
      if (step === 0) {
        stepNode = e(React.Fragment, null,
          capcom('Where do you operate? Mark your territory — tap regions on the map.'),
          e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), 'Territory'),
          e(WorldMap, { selected: regions, onToggle: toggleRegion, scanning: false }),
          e('div', { className: 'mm-chosen' },
            regions.length === 0
              ? e('span', { className: 'mm-chosen-empty' }, 'No regions marked yet.')
              : regions.map(function (id) { var r = REGIONS.filter(function (x) { return x.id === id; })[0]; return e('span', { key: id, className: 'mm-tag' }, r.label, e('button', { onClick: function () { toggleRegion(id); } }, '×')); })),
          e('div', { className: 'mm-inferred' }, e(Icon, { name: 'Sparkles', size: 13 }), e('span', { className: 'mm-inferred-l' }, 'What you sell'), e('span', { className: 'mm-inferred-v' }, soldWhat), e('span', { className: 'mm-inferred-badge' }, 'Inferred')),
          e('button', { className: 'pf-cta mm-cta', onClick: function () { setStep(1); }, disabled: regions.length === 0 }, 'Confirm territory →'));
      } else if (step === 1) {
        stepNode = e(React.Fragment, null,
          capcom('What should the scan look for? Pick your recon focus.'),
          e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), 'Recon focus'),
          e('div', { className: 'mm-foci' },
            FOCI.map(function (f) { var on = foci.indexOf(f.id) >= 0; return e('button', { key: f.id, className: 'ob-opt' + (on ? ' sel' : ''), onClick: function () { toggleFocus(f.id); } }, f.label); })),
          e('div', { className: 'mm-row' },
            e('button', { className: 'id-back', onClick: function () { setStep(0); } }, '‹ Territory'),
            e('button', { className: 'pf-cta mm-cta', onClick: function () { setStep(2); }, disabled: foci.length === 0 }, 'Confirm focus →')));
      } else {
        stepNode = e(React.Fragment, null,
          capcom('Recon parameters locked. Deploy the scan when ready, operator.'),
          e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), 'Scan summary'),
          e('div', { className: 'mm-summary' },
            e('div', { className: 'mm-srow' }, e('span', null, 'Territory'), e('b', null, regions.length + ' region' + (regions.length > 1 ? 's' : '') + ' · ' + regions.map(function (id) { return (REGIONS.filter(function (x) { return x.id === id; })[0] || {}).label; }).join(', '))),
            e('div', { className: 'mm-srow' }, e('span', null, 'Focus'), e('b', null, foci.map(function (id) { return (FOCI.filter(function (x) { return x.id === id; })[0] || {}).label; }).join(' · '))),
            e('div', { className: 'mm-srow' }, e('span', null, 'Category'), e('b', null, soldWhat))),
          e('div', { className: 'mm-row' },
            e('button', { className: 'id-back', onClick: function () { setStep(1); } }, '‹ Focus'),
            e('button', { className: 'pf-cta mm-cta', onClick: function () { setView('running'); } }, 'Deploy scan →')));
      }
      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: onBack }, '‹ Abort'),
        e('div', { className: 'id-eyebrow' }, 'Recon mission · My Market'),
        e('div', { className: 'mm-steps' }, ['Territory', 'Focus', 'Deploy'].map(function (s, i) { return e('span', { key: s, className: 'mm-step' + (i === step ? ' on' : '') + (i < step ? ' done' : '') }, (i + 1) + ' ' + s); })),
        e('div', { className: 'mm-panel', key: step }, stepNode)));
    }

    /* ── RUNNING ── */
    if (view === 'running') {
      return shell(e(React.Fragment, null,
        e('div', { className: 'id-eyebrow' }, 'Recon mission · My Market'),
        e('h1', { className: 'mm-title' }, 'Scanning…'),
        e(WorldMap, { selected: regions, onToggle: function () {}, scanning: true }),
        e('div', { className: 'mm-log' }, SCAN_LOG.slice(0, revealed).map(function (l, i) { return e('div', { key: i, className: i === revealed - 1 ? 'live' : '' }, l); })),
        e('div', { className: 'mm-bar' }, e('i', null))));
    }

    /* ── RESULT — intel report (findings-first) ── */
    var r = result || buildReport(profile, regions);
    function metaTag(l, v) { return e('span', { className: 'mm-rtag' }, e('b', null, l), v); }
    return shell(e(React.Fragment, null,
      e('button', { className: 'id-back', onClick: onBack }, '‹ Back to deck'),
      e('div', { className: 'mm-acq' }, e('span', { className: 'mm-acq-stamp' }, 'Intel Acquired'), e('span', { className: 'mm-acq-xp' }, '+ ', r.xp, ' XP')),
      e('h1', { className: 'mm-title' }, 'Market intel report'),
      capcom('Scan complete. Findings first, sources in the appendix — and the full report is yours to download.'),

      /* report header: DQ dial + meta + download */
      e('div', { className: 'mm-rephead' },
        e('div', { className: 'mm-dq', style: { background: 'conic-gradient(var(--clr-primary-hover) ' + (r.dq * 3.6) + 'deg, var(--clr-border) 0)' } },
          e('div', { className: 'mm-dq-in' }, e('span', { className: 'mm-dq-num' }, r.dq + '%'), e('span', { className: 'mm-dq-l' }, 'Data quality'))),
        e('div', { className: 'mm-repmeta' },
          e('div', { className: 'mm-repmeta-title' }, 'Market scan — ' + r.category),
          e('div', { className: 'mm-repmeta-sub' }, 'Generated by Clarity · ' + r.date),
          e('div', { className: 'mm-rtags' }, metaTag('Report ', 'market'), metaTag('Sources ', r.sources), metaTag('Depth ', 'Standard'), metaTag('Territory ', r.region))),
        e('button', { className: 'pf-cta mm-cta mm-dl', onClick: function () { downloadReport(r); } }, e(Icon, { name: 'Download', size: 15 }), ' Download report')
      ),

      /* executive summary */
      e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), 'Executive summary'),
      e('p', { className: 'mm-summary-box' }, r.summary),

      /* quick stat strip */
      e('div', { className: 'mm-statgrid' },
        [['Category', r.stats ? r.category : '—'], ['Competitors', r.stats.competitors], ['Avg price', r.stats.avg], ['Signals', r.stats.signals]].map(function (s, i) {
          return e('div', { key: i, className: 'mm-stat' }, e('div', { className: 'mm-stat-l' }, s[0]), e('div', { className: 'mm-stat-v' }, s[1]));
        })),

      /* key findings */
      e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), 'Key findings'),
      e('div', { className: 'mm-findings' },
        r.findings.map(function (f, i) {
          return e('div', { key: i, className: 'mm-finding', style: { animationDelay: (0.07 * i + 0.1) + 's' } },
            e('div', { className: 'mm-finding-top' },
              e('span', { className: 'mm-finding-q' }, f.q),
              e('span', { className: 'mm-conf ' + f.conf.toLowerCase() }, f.conf + ' confidence')),
            e('p', { className: 'mm-finding-text' }, f.text),
            e('div', { className: 'mm-finding-refs' }, 'Sources: ' + f.refs.join(', ')));
        })),

      /* evidence appendix */
      e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), 'Evidence appendix · ' + r.evidence.length + ' sources'),
      e('div', { className: 'mm-evidence' },
        r.evidence.map(function (ev, i) {
          return e('a', { key: i, className: 'mm-evrow', href: ev.url, target: '_blank', rel: 'noreferrer' },
            e('span', { className: 'mm-ev-id' }, ev.id),
            e('span', { className: 'mm-ev-domain' }, ev.domain),
            e('span', { className: 'mm-ev-topic' }, ev.topic),
            e(Icon, { name: 'ExternalLink', size: 12 }));
        })),

      e('div', { className: 'mm-row' },
        e('button', { className: 'id-back', onClick: function () { setResult(null); setView('scan'); setStep(0); } }, '↻ Re-scan'),
        e('button', { className: 'pf-cta mm-cta', onClick: onBack }, 'Back to Command Deck →'))
    ));
  }

  window.ClarityMarketMission = ClarityMarketMission;
  /* shared scan kit so other recon missions (Competition) can reuse the world map */
  window.ClarityScanKit = { WorldMap: WorldMap, REGIONS: REGIONS };
})();
