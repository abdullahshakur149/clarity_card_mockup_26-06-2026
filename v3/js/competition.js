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
  var CATEGORY = { name: 'My Competition', eyebrow: 'Competitor report', accent: 'var(--clr-cat-competitor)', accentDim: 'var(--clr-cat-competitor-dim)' };
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
  /* personalized, plain-voice verdict per sector (the 5-second read) */
  var VERDICT = {
    food: 'Based on the scan, the competition is fragmented and beatable — no single bakery owns the category locally, and the strongest player wins on walk-in habit, not story. Your gap is clear: behind-the-craft content plus an owned-audience pre-order loop. Almost nobody nearby does it well, so that is where you take share.',
    retail: 'Based on the scan, two or three DTC brands dominate search while everyone else fights over the niche. Going head-on is a losing game; your gap is sharp niche positioning plus an email/SMS owned-audience loop and limited drops — the retention play the leaders under-use locally.',
    creative: 'Based on the scan, the market is barbelled — cheap marketplaces at one end, premium agencies at the other — and the mid-market is wide open. Neither side owns “clear outcome + speed + point of view.” Productised packages with visible case studies are your wedge.',
    tech: 'Based on the scan, two incumbents own the head term and most of the paid share. You will not win on feature parity; your gap is a sharply-scoped wedge, best-in-class onboarding and “alternative to” content that peels off the users they are too broad to serve well.',
    trades: 'Based on the scan, the field is fragmented and reputation decides it — and most rivals are slow to respond and weak on reviews. Your gap is a fast-response, review-led local presence with before/after proof. It is the cheapest edge here and almost nobody runs it properly.',
    other: 'Based on the scan, no competitor owns a clear position — the field is muddled and share is unstable. That is the opening: a consistent, well-told position plus an owned audience differentiates fast in a market where everyone else blends together.'
  };
  function buildReport(profile, regions) {
    var s = SECTORS[profile.sector] || SECTORS.other;
    var top = s.competitors.filter(function (c) { return c.threat === 'High'; })[0] || s.competitors[0] || {};
    var takeaways = ['Top threat — ' + top.name + ' holds ' + top.sov + '% share of voice: ' + top.note]
      .concat(s.findings.map(function (f) { return f.q + ' — ' + f.text; }));
    return { xp: XP, category: s.category, region: regionNames(regions), dq: s.dq, date: fmtDate(),
      reportType: 'competitive', sources: EVIDENCE.length, depth: 'Standard (3 queries)',
      verdict: VERDICT[profile.sector] || VERDICT.other, takeaways: takeaways,
      summary: s.summary, competitors: s.competitors, findings: s.findings, evidence: EVIDENCE };
  }

  /* ── Real downloadable competitor report ── */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
  function reportHtml(r, theme) {
    var dark = theme !== 'light';
    var P = dark
      ? { bg: '#0f1614', ink: '#edf2f0', soft: '#93a09c', faint: '#6b7773', hair: '#263230', panel: '#161f1c', accent: '#f2685f' }
      : { bg: '#f6f4ee', ink: '#1d2321', soft: '#5f6a66', faint: '#8b938f', hair: '#e4dfd4', panel: '#efece3', accent: '#d64a41' };
    function threatColor(t) { t = String(t).toLowerCase(); if (dark) return t === 'high' ? '#ff8568' : t === 'medium' ? '#f5a623' : '#34d39e'; return t === 'high' ? '#b23a30' : t === 'medium' ? '#a9720f' : '#12876f'; }
    function conf(c) { c = String(c).toLowerCase(); if (dark) return c === 'high' ? '#34d39e' : c === 'medium' ? '#f5a623' : '#ff8568'; return c === 'high' ? '#12876f' : c === 'medium' ? '#a9720f' : '#a8532c'; }
    var serif = "Georgia,'Times New Roman',serif"; var sans = "'Segoe UI','Helvetica Neue',Arial,sans-serif";
    function sec(l) { return '<p style="margin:26px 0 12px;padding-top:15px;border-top:1px solid ' + P.hair + ';font-family:' + sans + ';font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:' + P.faint + '">' + l + '</p>'; }
    var takes = r.takeaways.map(function (t) { return '<p style="margin:0 0 10px;font-family:' + sans + ';font-size:14px;line-height:1.5;color:' + P.ink + '"><span style="color:' + P.accent + '">&#9670;</span>&nbsp;&nbsp;' + esc(t) + '</p>'; }).join('');
    var comps = r.competitors.map(function (c) {
      return '<div style="border:1px solid ' + P.hair + ';border-radius:10px;padding:12px 14px;margin:0 0 10px;background:' + P.panel + '">'
        + '<p style="margin:0 0 5px;font-family:' + sans + ';font-size:14px;color:' + P.ink + '"><b>' + esc(c.name) + '</b> &nbsp;<span style="font-size:11px;color:' + threatColor(c.threat) + '">' + esc(c.threat) + ' threat</span> &nbsp;<span style="font-size:11px;color:' + P.soft + '">' + esc(c.price) + ' &middot; ' + c.sov + '% share of voice</span></p>'
        + '<p style="margin:0 0 3px;font-family:' + sans + ';font-size:13px;color:' + P.ink + '">' + esc(c.positioning) + '</p>'
        + '<p style="margin:0;font-family:' + sans + ';font-size:12.5px;color:' + P.soft + '">' + esc(c.note) + '</p></div>';
    }).join('');
    var find = r.findings.map(function (x) { return '<p style="margin:14px 0 3px;font-family:' + sans + ';font-size:14px;font-weight:600;color:' + P.ink + '">' + esc(x.q) + ' &nbsp;<span style="font-weight:normal;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:' + conf(x.conf) + '">' + esc(x.conf) + ' confidence</span></p><p style="margin:0;font-family:' + sans + ';font-size:13px;line-height:1.55;color:' + P.soft + '">' + esc(x.text) + '</p>'; }).join('');
    var srcs = r.evidence.map(function (x) { return '<p style="margin:0 0 6px;font-family:' + sans + ';font-size:12px;color:' + P.soft + '"><span style="font-family:Consolas,monospace;color:' + P.accent + '">' + esc(x.domain) + '</span> &mdash; ' + esc(x.topic) + ' &mdash; <a href="' + esc(x.url) + '" style="color:' + P.accent + '">' + esc(x.url) + '</a></p>'; }).join('');
    return '<html xmlns:o="urn:schemas-microsoft-office:office" xmlns:w="urn:schemas-microsoft-office:office:word" xmlns="http://www.w3.org/TR/REC-html40">'
      + '<head><meta charset="utf-8"><title>Competitor report — ' + esc(r.category) + '</title></head>'
      + '<body style="margin:0;background:' + P.bg + '">'
      + '<div style="background:' + P.bg + ';color:' + P.ink + ';padding:42px 48px;max-width:700px;font-family:' + sans + '">'
      + '<p style="margin:0 0 8px;font-family:Consolas,monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:' + P.accent + '">Competitor report</p>'
      + '<h1 style="margin:0 0 8px;font-family:' + serif + ';font-size:34px;font-weight:normal;color:' + P.ink + '">' + esc(r.category) + '</h1>'
      + '<p style="margin:0;font-family:' + sans + ';font-size:12px;color:' + P.faint + '">' + esc(r.date) + ' &nbsp;&middot;&nbsp; ' + esc(r.region) + ' &nbsp;&middot;&nbsp; ' + r.competitors.length + ' competitors mapped &nbsp;&middot;&nbsp; Prepared by Clarity</p>'
      + '<div style="height:3px;background:' + P.accent + ';margin:20px 0 24px"></div>'
      + '<p style="margin:0 0 10px;font-family:Consolas,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:' + P.faint + '">The verdict</p>'
      + '<p style="margin:0;font-family:' + serif + ';font-size:20px;line-height:1.45;color:' + P.ink + '">' + esc(r.verdict) + '</p>'
      + sec('What we found') + takes
      + sec('Threat board') + comps
      + sec('Key findings') + find
      + sec('How solid is this?') + '<p style="margin:0;font-family:' + sans + ';font-size:13px;line-height:1.55;color:' + P.soft + '"><b style="color:' + P.ink + '">Solid read — ' + r.dq + '% data quality.</b> Built from ' + r.evidence.length + ' independent sources across category structure, share of voice and pricing.</p>'
      + sec('Sources') + srcs
      + '</div></body></html>';
  }
  function downloadReport(r, theme) {
    try {
      var blob = new Blob(['﻿', reportHtml(r, theme)], { type: 'application/msword' });
      var url = URL.createObjectURL(blob); var a = document.createElement('a');
      a.href = url; a.download = 'Competitor_report_' + slug(r.category) + '.doc';
      document.body.appendChild(a); a.click();
      setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 200);
    } catch (err) {}
  }

  function ClarityCompetitionMission(props) {
    var profile = props.profile || {}, onComplete = props.onComplete, onBack = props.onBack;
    var WorldMap = kit().WorldMap, REGIONS = kit().REGIONS || [];

    /* report history: seed from the saved mission state (backward-compatible) */
    var RP = window.ClarityReports;
    var seed = (RP ? RP.list(props.result) : (props.result ? [props.result] : []))
      .map(function (rep, i) { return rep.id ? rep : Object.assign({}, rep, { id: 'seed_' + i }); });
    var initPrimary = (props.result && props.result.primaryId) || (seed[0] && seed[0].id) || null;

    var rsL = React.useState(seed);          var reports = rsL[0], setReports = rsL[1];
    var pmS = React.useState(initPrimary);   var primaryId = pmS[0], setPrimaryId = pmS[1];
    var vw = React.useState(seed.length ? 'roster' : 'brief'); var view = vw[0], setView = vw[1];
    var slS = React.useState(initPrimary);   var sel = slS[0], setSel = slS[1];
    var idRef = React.useRef(1);
    var sp = React.useState(0);   var step = sp[0], setStep = sp[1];
    var rg = React.useState([]);  var regions = rg[0], setRegions = rg[1];
    var fo = React.useState(['rivals', 'positioning', 'sov']); var foci = fo[0], setFoci = fo[1];
    var rv = React.useState(0);   var revealed = rv[0], setRevealed = rv[1];
    var tv = React.useState('dark'); var theme = tv[0], setTheme = tv[1];  /* report reader mode (dark by default) */

    var soldWhat = (profile.desc || 'your product').trim();
    function toggleRegion(id) { setRegions(function (a) { return a.indexOf(id) >= 0 ? a.filter(function (x) { return x !== id; }) : a.concat([id]); }); }
    function toggleFocus(id) { setFoci(function (a) { return a.indexOf(id) >= 0 ? a.filter(function (x) { return x !== id; }) : a.concat([id]); }); }

    React.useEffect(function () {
      if (view !== 'running') return;
      var n = 0; setRevealed(0);
      var iv = setInterval(function () { n++; setRevealed(n); if (n >= SCAN_LOG.length) clearInterval(iv); }, 440);
      var t = setTimeout(function () {
        var rep = buildReport(profile, regions);
        rep.id = 'cmp_' + (idRef.current++); rep.status = 'ready';
        var next = reports.concat([rep]);
        setReports(next); setPrimaryId(rep.id); setSel(rep.id); setView('result');
        if (onComplete) onComplete({ xp: rep.xp, reports: next, primaryId: rep.id });  /* new scout → primary */
      }, 2900);
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

    /* ── ROSTER — browse past competitor scouts ── */
    if (view === 'roster') {
      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: onBack }, '‹ Back to deck'),
        capcom('Your competitor scouts, operator. Open one, run another, or set which read feeds your plan.'),
        window.ClarityReportRoster && e(window.ClarityReportRoster, {
          eyebrow: 'Recon mission · Competition', title: 'Your competitor scouts', accent: CATEGORY.accent,
          reports: reports, primaryId: primaryId, fallbackTitle: 'Competitor scan', newLabel: 'Run another scout →',
          onOpen: function (id) { setSel(id); setView('result'); },
          onNew: function () { setRegions([]); setStep(0); setView('scan'); },
          onSetPrimary: function (id) { setPrimaryId(id); if (onComplete) onComplete({ xp: 0, reports: reports, primaryId: id }); }
        })
      ));
    }

    /* ── RESULT — clean-document competitor report (verdict-first) ── */
    var r = reports.filter(function (x) { return x.id === sel; })[0] || (RP && RP.primary({ reports: reports, primaryId: primaryId })) || buildReport(profile, regions);
    function toggleTheme() { setTheme(function (t) { return t === 'light' ? 'dark' : 'light'; }); }

    /* report sections handed to the shared viewer (accordion / tabs) */
    var sections = [
      { id: 'verdict', label: 'The verdict', node: e('p', { className: 'rc-verdict' }, r.verdict) },
      { id: 'found', label: 'What we found', node: e('ul', { className: 'rc-takeaways' }, r.takeaways.map(function (t, i) {
        return e('li', { key: i, className: 'rc-take', style: { animationDelay: (0.06 * i + 0.05) + 's' } }, e('span', { className: 'rc-take-mk' }), e('span', { className: 'rc-take-t' }, t));
      })) },
      { id: 'detail', label: 'The detail', node: e('div', { className: 'rc-block' },
        e('div', { className: 'rc-subhead' }, 'Threat board'),
        r.competitors.map(function (c, i) {
          return e('div', { key: i, className: 'rc-comp' },
            e('div', { className: 'rc-comp-head' },
              e('span', { className: 'rc-comp-name' }, c.name),
              e('span', { className: 'rc-threat ' + c.threat.toLowerCase() }, c.threat + ' threat'),
              e('span', { className: 'rc-comp-price' }, c.price)),
            e('div', { className: 'rc-bar-row' },
              e('span', { className: 'rc-bar-l' }, 'Share of voice'),
              e('div', { className: 'rc-bar-track' }, e('i', { style: { width: c.sov + '%' } })),
              e('span', { className: 'rc-bar-v' }, c.sov + '%')),
            e('div', { className: 'rc-comp-pos' }, c.positioning),
            e('div', { className: 'rc-comp-note' }, c.note));
        })) },
      { id: 'trust', label: 'How solid is this?', node: e('div', { className: 'rc-trust' },
        e('div', { className: 'rc-dq', style: { background: 'conic-gradient(var(--rc-accent) ' + (r.dq * 3.6) + 'deg, var(--rc-hair) 0)' } }, e('div', { className: 'rc-dq-in' }, e('b', null, r.dq + '%'))),
        e('p', { className: 'rc-trust-t' }, e('b', null, 'Solid read.'), ' Built from ' + r.evidence.length + ' independent sources across category structure, share of voice and pricing.')) },
      { id: 'sources', label: 'Sources', node: e('div', { className: 'rc-sources' }, r.evidence.map(function (ev, i) {
        return e('a', { key: i, className: 'rc-source', href: ev.url, target: '_blank', rel: 'noreferrer' }, e('span', { className: 'rc-source-d' }, ev.domain), e('span', { className: 'rc-source-t' }, ev.topic), e(Icon, { name: 'ExternalLink', size: 12 }));
      })) }
    ];

    return shell(e(React.Fragment, null,
      e('button', { className: 'id-back', onClick: function () { setView('roster'); } }, '‹ All scans'),
      e('div', { className: 'mm-acq' }, e('span', { className: 'mm-acq-stamp' }, 'Intel Acquired'), e('span', { className: 'mm-acq-xp' }, '+ ', r.xp, ' XP')),
      capcom('Scout complete — the plain read is up top, the full threat board sits underneath.'),

      e('div', { className: 'rc-doc rc-' + theme, style: { '--rc-accent': CATEGORY.accent, '--rc-accent-dim': CATEGORY.accentDim } },
        e('div', { className: 'rc-bar' },
          e('div', { className: 'rc-bar-cat' }, e('span', { className: 'rc-dot' }), CATEGORY.name),
          e('div', { className: 'rc-bar-tools' },
            e('button', { className: 'rc-tool', onClick: toggleTheme, title: 'Toggle reading mode' }, e(Icon, { name: theme === 'light' ? 'Moon' : 'Sun', size: 14 }), theme === 'light' ? 'Night' : 'Day'),
            e('button', { className: 'rc-tool rc-tool-dl', onClick: function () { downloadReport(r, theme); } }, e(Icon, { name: 'Download', size: 14 }), 'Download'))),

        e('div', { className: 'rc-mast' },
          e('div', { className: 'rc-eyebrow' }, CATEGORY.eyebrow),
          e('h1', { className: 'rc-h1' }, r.category),
          e('div', { className: 'rc-mast-meta' }, r.date + '  ·  ' + r.region + '  ·  ' + r.competitors.length + ' competitors mapped')),
        e('div', { className: 'rc-rule' }),

        /* sections rendered as accordion / tabs by the shared viewer */
        window.ClarityReportBody && e(window.ClarityReportBody, { sections: sections, stats: [
          { value: '' + r.competitors.length, label: 'Direct competitors', note: r.competitors.filter(function (c) { return c.threat === 'High'; }).length + ' high threat', tone: r.competitors.filter(function (c) { return c.threat === 'High'; }).length >= 2 ? 'warn' : 'neutral' },
          { value: r.competitors[0] ? r.competitors[0].sov + '%' : '—', label: 'Top rival share', note: r.competitors[0] ? r.competitors[0].name : '—', tone: 'warn' },
          { value: '' + r.dq, label: 'Confidence score', note: r.dq >= 80 ? 'Solid read' : 'Workable', tone: r.dq >= 80 ? 'good' : 'neutral' }
        ], storeKey: 'competition:' + ((profile && profile.name) || 'idea') + ':' + (r.id || 'r') })
      ),

      e('div', { className: 'mm-row' },
        e('button', { className: 'id-back', onClick: function () { setView('roster'); } }, '‹ All scans'),
        (sel !== primaryId) && e('button', { className: 'id-back', onClick: function () { setPrimaryId(sel); if (onComplete) onComplete({ xp: 0, reports: reports, primaryId: sel }); } }, '★ Make primary'),
        e('button', { className: 'pf-cta mm-cta', onClick: function () { setRegions([]); setStep(0); setView('scan'); } }, 'Run another scout →'))
    ));
  }

  window.ClarityCompetitionMission = ClarityCompetitionMission;
})();
