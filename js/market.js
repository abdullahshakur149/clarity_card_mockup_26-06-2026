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
  /* per-report category identity (signature accent for quick visual scanning) */
  var CATEGORY = { name: 'My Market', eyebrow: 'Market report', accent: 'var(--clr-cat-market)', accentDim: 'var(--clr-cat-market-dim)' };

  /* sector-flavoured report bank (mocked, findings-first, honest DQ) */
  var SECTORS = {
    food: { category: 'Artisan food & bakery', dq: 84, stats: { competitors: 7, avg: '$6.40', signals: 4 },
      summary: 'A growing premium niche within a mature category: independents are winning share from mass-produced incumbents on provenance, craft and story. Demand is healthy and local — the constraint is differentiation and capacity, not interest.',
      verdict: 'Based on the research we ran, your artisan bakery has a real shot. Locally, people genuinely want proper, hand-crafted bread — and they’ll pay a premium for it — yet almost nobody nearby tells a convincing craft story. The demand is already there; your only real job is to stand out. Lead with your craft and the people behind it, and this works.',
      takeaways: [
        'People want it — interest in local, artisan and sourdough baking is up ~18% this year, and it peaks on weekends.',
        'The gap is wide open — 5–8 bakeries sit within ~5km, but hardly any tell a real story about how they bake.',
        'They’ll pay more — premium loaves comfortably hold $6–8 when the craft is visible.',
        'Your edge — “behind-the-craft” content (the people, the 4am bake) beats plain product photos every time.'
      ],
      findings: [
        { q: 'Market size & growth', conf: 'Medium', refs: ['e_01', 'e_02'], text: 'The premium/artisan baked-goods segment is mature but steadily expanding (mid-single-digit % CAGR), with independents outpacing the broader category as consumers trade up on quality and provenance.' },
        { q: 'Demand signals', conf: 'High', refs: ['e_03', 'e_04'], text: 'Search and social interest in “local bakery”, “sourdough” and “artisan” is up ~18% YoY, concentrated on weekends and around holidays — strong, repeatable local intent.' },
        { q: 'Competition', conf: 'Medium', refs: ['e_05', 'e_07'], text: 'The local set is fragmented — typically 5–8 independents within ~5km plus supermarket bakery aisles. Few tell a compelling behind-the-craft story, leaving a clear positioning gap.' },
        { q: 'Pricing benchmarks', conf: 'Medium', refs: ['e_06'], text: 'Premium loaves benchmark at ~$6–8 (specialty/sourdough at the top end). Customers tolerate the premium when craft and provenance are visible.' },
        { q: 'Opportunity', conf: 'High', refs: ['e_03', 'e_04'], text: '“Behind-the-craft” content (process, people, the 4am bake) outperforms product-only posts; owned channels (email, IG) convert best for pre-orders and standing weekly orders.' }
      ] },
    retail: { category: 'Independent retail & products', dq: 82, stats: { competitors: 11, avg: '$28', signals: 4 },
      summary: 'A crowded but navigable market where discovery and retention beat raw reach. DTC-savvy independents win with limited drops, bundles and a sharp owned-audience strategy.',
      verdict: 'Based on what we found, your product idea can absolutely work — but winning here is about being discovered and keeping people, not shouting the loudest. Demand is steady and shoppers are actively looking; the brands that win build a small, loyal audience and give them reasons to come back. Do that and you don’t need the biggest budget in the room.',
      takeaways: [
        'People are looking — online discovery is driving ~22% more qualified visits, mostly on mobile.',
        'Crowded but beatable — a couple of big names dominate search; everyone else competes on niche and service.',
        'Bundles lift spend — typical orders sit around $25–35, and bundles or limited drops raise that without discounting.',
        'Your edge — an email/SMS audience you own converts far better than chasing paid reach.'
      ],
      findings: [
        { q: 'Market size & growth', conf: 'Medium', refs: ['e_01', 'e_02'], text: 'Independent/DTC retail continues to grow modestly overall, with category winners concentrating share through brand and community rather than price.' },
        { q: 'Demand signals', conf: 'High', refs: ['e_03'], text: 'Online discovery is driving ~22% more qualified visits; “near me” and brand-name search intent is rising, especially on mobile.' },
        { q: 'Competition', conf: 'Medium', refs: ['e_07', 'e_05'], text: 'Two to three DTC brands typically dominate category search; the long tail competes on niche and service. SEO and retargeting are under-exploited by smaller players.' },
        { q: 'Pricing benchmarks', conf: 'Medium', refs: ['e_06'], text: 'Average order value benchmarks around $25–35; bundles and limited editions lift AOV and urgency without discounting the core line.' },
        { q: 'Opportunity', conf: 'High', refs: ['e_03', 'e_04'], text: 'Limited drops, bundles and an email/SMS owned-audience loop are the highest-ROI moves; content showing product in real use converts best.' }
      ] },
    creative: { category: 'Creative & services', dq: 79, stats: { competitors: 9, avg: '$850/project', signals: 3 },
      summary: 'A trust-led services market where portfolio and proof win work. Demand for combined brand+content packages is rising; price pressure comes from marketplaces, not local peers.',
      verdict: 'Based on the research, your services idea is viable and the trend is moving your way — clients increasingly want a combined brand-and-content package rather than one-off jobs. Price pressure comes from cheap marketplaces, not the studios next door, so you win on proof and point of view, not on being the cheapest. Show real results and this holds up.',
      takeaways: [
        'Demand is shifting to bundles — clients want “brand + content” together, not one-off deliverables.',
        'Referrals and portfolio win the work — not the lowest price.',
        'Marketplaces undercut on price but rarely on outcomes — that is your opening.',
        'Your edge — productised packages plus visible case studies cut sales friction and lift your rate.'
      ],
      findings: [
        { q: 'Market size & growth', conf: 'Low', refs: ['e_02'], text: 'Hard to size precisely (fragmented, project-based), but demand for outcome-oriented brand+content packages is clearly expanding among SMBs.' },
        { q: 'Demand signals', conf: 'Medium', refs: ['e_03', 'e_04'], text: 'Inbound intent skews to “brand + content” bundles over one-off deliverables; referrals and portfolio discovery drive most qualified leads.' },
        { q: 'Competition', conf: 'Medium', refs: ['e_07'], text: 'Freelancer marketplaces undercut on price but rarely on outcomes; differentiation comes from a clear point of view and visible results.' },
        { q: 'Pricing benchmarks', conf: 'Medium', refs: ['e_06'], text: 'Project pricing benchmarks ~$500–1,500 for SMB brand/content work; retainers stabilise revenue and signal seniority.' },
        { q: 'Opportunity', conf: 'High', refs: ['e_03'], text: 'Portfolio-led IG/site presence and case studies convert best; productised packages reduce sales friction and raise perceived value.' }
      ] },
    tech: { category: 'SaaS / software', dq: 80, stats: { competitors: 14, avg: '$29/mo', signals: 4 },
      summary: 'A competitive but expandable category where niche tooling and founder-led distribution beat head-on feature wars. Content and community drive efficient signups.',
      verdict: 'Based on what we found, your software idea has genuine room — the specific need you solve is growing fast (~30% a year), even though the broader category is busy. You will not win a head-on feature war with the incumbents, but a sharply-focused wedge and genuinely better onboarding gets you in the door. Pick your niche and this works.',
      takeaways: [
        'The need is growing — search for your specific use-case is up ~31% this year.',
        'Two incumbents own the main search term — so go around them with a sharp, narrow wedge.',
        'Pricing is proven — entry tiers sit ~$15–39/mo, and annual plans lift lifetime value a lot.',
        'Your edge — founder-led content and “alternative to” pages drive the cheapest signups.'
      ],
      findings: [
        { q: 'Market size & growth', conf: 'Medium', refs: ['e_01', 'e_02'], text: 'The broader category is large and growing; the addressable niche is smaller but expanding ~30% YoY as workflows specialise.' },
        { q: 'Demand signals', conf: 'High', refs: ['e_03', 'e_04'], text: 'Search demand for the specific use-case is up ~31% YoY; intent clusters around integrations, pricing and “alternative to” queries.' },
        { q: 'Competition', conf: 'Medium', refs: ['e_07'], text: 'Two incumbents own the head term; the opening is a sharply-scoped wedge and superior onboarding rather than feature parity.' },
        { q: 'Pricing benchmarks', conf: 'Medium', refs: ['e_06'], text: 'Entry tiers benchmark ~$15–39/mo; usage- and seat-based hybrids are common. Annual plans lift LTV materially.' },
        { q: 'Opportunity', conf: 'High', refs: ['e_03'], text: 'Founder-led content, “alternative to” comparison pages and a free tier drive the most efficient signups; community compounds retention.' }
      ] },
    trades: { category: 'Local trades & services', dq: 81, stats: { competitors: 6, avg: '$120/job', signals: 3 },
      summary: 'A high-intent local market won on trust and proximity. “Near me” demand is rising; reviews, response time and visible workmanship beat advertising spend.',
      verdict: 'Based on the research, your idea is on solid ground — local demand is high-intent and rising, and it is won on trust and speed, not on advertising. Most competitors still lean on word-of-mouth and do not run a tight reviews-and-photos engine, which is exactly where you can pull ahead. Respond fast, show your work, and this wins.',
      takeaways: [
        '“Near me” intent is rising — and it is overwhelmingly same-week and on mobile.',
        'Speed wins — how fast you reply strongly predicts whether you land the job.',
        'The gap — few rivals run a steady reviews + before/after content engine.',
        'Your edge — a reviews flywheel and a strong Google Business profile beat ad spend.'
      ],
      findings: [
        { q: 'Market size & growth', conf: 'Medium', refs: ['e_02', 'e_05'], text: 'Steady local demand tied to housing activity and seasonality; little category disruption, so share is won on reputation and reliability.' },
        { q: 'Demand signals', conf: 'High', refs: ['e_03'], text: '“Near me” search intent is climbing and is overwhelmingly mobile and same-week; speed-to-respond strongly predicts win rate.' },
        { q: 'Competition', conf: 'Medium', refs: ['e_05', 'e_07'], text: 'Word-of-mouth still dominates; few local competitors run a tight reviews + before/after content engine, which is the clearest edge.' },
        { q: 'Pricing benchmarks', conf: 'Medium', refs: ['e_06'], text: 'Typical job values benchmark ~$90–180 depending on scope; transparent quoting and fast callbacks reduce price sensitivity.' },
        { q: 'Opportunity', conf: 'High', refs: ['e_03'], text: 'A reviews flywheel plus before/after posts and a Google Business presence win trust; responding within minutes is the cheapest growth lever.' }
      ] },
    other: { category: 'General market', dq: 74, stats: { competitors: 8, avg: '$—', signals: 3 },
      summary: 'A fragmented market with steady, seasonally-peaking demand. With limited category-specific data, the safest edge is an owned audience and a clear, repeatable offer.',
      verdict: 'Based on what we found, your idea is workable — demand is steady with seasonal peaks, and the field is fragmented with no dominant player, which leaves clear room for a consistent, well-positioned brand. There is less category data to lean on here, so the safest path is to build an audience you own and lead with one simple, repeatable offer. Do that and you have a real foothold.',
      takeaways: [
        'Demand is steady with seasonal spikes — time your launches to those peaks.',
        'No one dominates — the field is fragmented, so a clearly-positioned brand can stand out.',
        'Less data to lean on — test 2–3 price points with your own audience before committing.',
        'Your edge — an owned email/social audience outperforms paid in fragmented markets.'
      ],
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
      summary: s.summary, verdict: s.verdict, takeaways: s.takeaways, stats: s.stats, findings: s.findings, evidence: evidence };
  }

  /* ── Real downloadable Word file ── */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
  function buildWordHtml(r, theme) {
    var dark = theme !== 'light';                       /* dark by default, matches the screen */
    var P = dark
      ? { bg: '#0f1614', ink: '#edf2f0', soft: '#93a09c', faint: '#6b7773', hair: '#263230', accent: '#2bd4bb' }
      : { bg: '#f6f4ee', ink: '#1d2321', soft: '#5f6a66', faint: '#8b938f', hair: '#e4dfd4', accent: '#0f9e88' };
    function conf(c) { c = String(c).toLowerCase();
      if (dark) return c === 'high' ? '#34d39e' : c === 'medium' ? '#f5a623' : '#ff8568';
      return c === 'high' ? '#12876f' : c === 'medium' ? '#a9720f' : '#a8532c'; }
    var serif = "Georgia,'Times New Roman',serif";
    var sans = "'Segoe UI','Helvetica Neue',Arial,sans-serif";
    function sec(label) {
      return '<p style="margin:26px 0 12px;padding-top:15px;border-top:1px solid ' + P.hair + ';font-family:' + sans
        + ';font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:' + P.faint + '">' + label + '</p>';
    }
    var takes = r.takeaways.map(function (t) {
      return '<p style="margin:0 0 10px;font-family:' + sans + ';font-size:14px;line-height:1.5;color:' + P.ink + '">'
        + '<span style="color:' + P.accent + '">&#9670;</span>&nbsp;&nbsp;' + esc(t) + '</p>';
    }).join('');
    var finds = r.findings.map(function (x) {
      return '<p style="margin:16px 0 3px;font-family:' + sans + ';font-size:14px;font-weight:600;color:' + P.ink + '">'
        + esc(x.q) + ' &nbsp;<span style="font-weight:normal;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:'
        + conf(x.conf) + '">' + esc(x.conf) + ' confidence</span></p>'
        + '<p style="margin:0;font-family:' + sans + ';font-size:13px;line-height:1.55;color:' + P.soft + '">' + esc(x.text) + '</p>';
    }).join('');
    var srcs = r.evidence.map(function (x) {
      return '<p style="margin:0 0 6px;font-family:' + sans + ';font-size:12px;color:' + P.soft + '">'
        + '<span style="font-family:Consolas,monospace;color:' + P.accent + '">' + esc(x.domain) + '</span> &mdash; ' + esc(x.topic)
        + ' &mdash; <a href="' + esc(x.url) + '" style="color:' + P.accent + '">' + esc(x.url) + '</a></p>';
    }).join('');
    return '<html xmlns:o="urn:schemas-microsoft-office:office" xmlns:w="urn:schemas-microsoft-office:office:word" xmlns="http://www.w3.org/TR/REC-html40">'
      + '<head><meta charset="utf-8"><title>Market report — ' + esc(r.category) + '</title></head>'
      + '<body style="margin:0;background:' + P.bg + '">'
      + '<div style="background:' + P.bg + ';color:' + P.ink + ';padding:42px 48px;max-width:700px;font-family:' + sans + '">'
      + '<p style="margin:0 0 8px;font-family:Consolas,monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:' + P.accent + '">Market report</p>'
      + '<h1 style="margin:0 0 8px;font-family:' + serif + ';font-size:34px;font-weight:normal;color:' + P.ink + '">' + esc(r.category) + '</h1>'
      + '<p style="margin:0;font-family:' + sans + ';font-size:12px;color:' + P.faint + '">' + esc(r.date) + ' &nbsp;&middot;&nbsp; ' + esc(r.region) + ' &nbsp;&middot;&nbsp; Prepared by Clarity</p>'
      + '<div style="height:3px;background:' + P.accent + ';margin:20px 0 24px"></div>'
      + '<p style="margin:0 0 10px;font-family:Consolas,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:' + P.faint + '">The verdict</p>'
      + '<p style="margin:0;font-family:' + serif + ';font-size:20px;line-height:1.45;color:' + P.ink + '">' + esc(r.verdict) + '</p>'
      + sec('What we found') + takes
      + sec('The detail')
      + '<p style="margin:0 0 14px;font-family:' + sans + ';font-size:13px;color:' + P.soft + '">Competitors: <b style="color:' + P.ink + '">' + esc(r.stats.competitors) + '</b> &nbsp;&middot;&nbsp; Avg price: <b style="color:' + P.ink + '">' + esc(r.stats.avg) + '</b> &nbsp;&middot;&nbsp; Demand signals: <b style="color:' + P.ink + '">' + esc(r.stats.signals) + '</b></p>'
      + finds
      + sec('How solid is this?')
      + '<p style="margin:0;font-family:' + sans + ';font-size:13px;line-height:1.55;color:' + P.soft + '"><b style="color:' + P.ink + '">Solid read &mdash; ' + r.dq + '% data quality.</b> Drawn from ' + r.evidence.length + ' independent sources across market size, live demand and pricing. The &ldquo;High confidence&rdquo; findings are the ones to bank on; treat the rest as strong signals.</p>'
      + sec('Sources') + srcs
      + '</div></body></html>';
  }
  function downloadReport(r, theme) {
    try {
      var blob = new Blob(['﻿', buildWordHtml(r, theme)], { type: 'application/msword' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'Market_report_' + slug(r.category) + '.doc';
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
    var tv = React.useState('dark'); var theme = tv[0], setTheme = tv[1];  /* report reader mode (dark by default) */

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

    /* ── RESULT — clean-document report (verdict-first, human voice) ── */
    var r = result || buildReport(profile, regions);
    function toggleTheme() { setTheme(function (t) { return t === 'light' ? 'dark' : 'light'; }); }
    return shell(e(React.Fragment, null,
      e('button', { className: 'id-back', onClick: onBack }, '‹ Back to deck'),
      /* the game reward moment wraps the document */
      e('div', { className: 'mm-acq' }, e('span', { className: 'mm-acq-stamp' }, 'Intel Acquired'), e('span', { className: 'mm-acq-xp' }, '+ ', r.xp, ' XP')),
      capcom('Scan complete — here is the read on your market. Plain version up top; the detail sits underneath if you want it.'),

      /* ── the report document ── */
      e('div', { className: 'rc-doc rc-' + theme, style: { '--rc-accent': CATEGORY.accent, '--rc-accent-dim': CATEGORY.accentDim } },

        /* toolbar: category tag + reader controls */
        e('div', { className: 'rc-bar' },
          e('div', { className: 'rc-bar-cat' }, e('span', { className: 'rc-dot' }), CATEGORY.name),
          e('div', { className: 'rc-bar-tools' },
            e('button', { className: 'rc-tool', onClick: toggleTheme, title: 'Toggle reading mode' },
              e(Icon, { name: theme === 'light' ? 'Moon' : 'Sun', size: 14 }), theme === 'light' ? 'Night' : 'Day'),
            e('button', { className: 'rc-tool rc-tool-dl', onClick: function () { downloadReport(r, theme); } },
              e(Icon, { name: 'Download', size: 14 }), 'Download'))),

        /* masthead */
        e('div', { className: 'rc-mast' },
          e('div', { className: 'rc-eyebrow' }, CATEGORY.eyebrow),
          e('h1', { className: 'rc-h1' }, r.category),
          e('div', { className: 'rc-mast-meta' }, r.date + '  ·  ' + r.region + '  ·  Prepared by Clarity')),
        e('div', { className: 'rc-rule' }),

        /* verdict — the hero, in plain human voice */
        e('div', { className: 'rc-kicker' }, 'The verdict'),
        e('p', { className: 'rc-verdict' }, r.verdict),

        /* what we found — plain takeaways */
        e('div', { className: 'rc-sec' }, 'What we found'),
        e('ul', { className: 'rc-takeaways' },
          r.takeaways.map(function (t, i) {
            return e('li', { key: i, className: 'rc-take', style: { animationDelay: (0.06 * i + 0.05) + 's' } },
              e('span', { className: 'rc-take-mk' }), e('span', { className: 'rc-take-t' }, t));
          })),

        /* the detail — demoted below the answer */
        e('div', { className: 'rc-sec' }, 'The detail'),
        e('div', { className: 'rc-stats' },
          [['Competitors', r.stats.competitors], ['Avg price', r.stats.avg], ['Demand signals', r.stats.signals]].map(function (s, i) {
            return e('div', { key: i, className: 'rc-stat' }, e('div', { className: 'rc-stat-v' }, s[1]), e('div', { className: 'rc-stat-l' }, s[0]));
          })),
        e('div', { className: 'rc-findings' },
          r.findings.map(function (f, i) {
            return e('div', { key: i, className: 'rc-finding' },
              e('div', { className: 'rc-finding-h' },
                e('span', { className: 'rc-finding-q' }, f.q),
                e('span', { className: 'rc-conf ' + f.conf.toLowerCase() }, f.conf + ' confidence')),
              e('p', { className: 'rc-finding-t' }, f.text));
          })),

        /* how solid is this — trust, reframed in plain words */
        e('div', { className: 'rc-sec' }, 'How solid is this?'),
        e('div', { className: 'rc-trust' },
          e('div', { className: 'rc-dq', style: { background: 'conic-gradient(var(--rc-accent) ' + (r.dq * 3.6) + 'deg, var(--rc-hair) 0)' } },
            e('div', { className: 'rc-dq-in' }, e('b', null, r.dq + '%'))),
          e('p', { className: 'rc-trust-t' }, e('b', null, 'Solid read.'),
            ' Drawn from ' + r.evidence.length + ' independent sources across market size, live demand and pricing — the “High confidence” findings above are the ones to bank on; treat the rest as strong signals.')),

        /* sources */
        e('div', { className: 'rc-sec' }, 'Sources'),
        e('div', { className: 'rc-sources' },
          r.evidence.map(function (ev, i) {
            return e('a', { key: i, className: 'rc-source', href: ev.url, target: '_blank', rel: 'noreferrer' },
              e('span', { className: 'rc-source-d' }, ev.domain),
              e('span', { className: 'rc-source-t' }, ev.topic),
              e(Icon, { name: 'ExternalLink', size: 12 }));
          }))
      ),

      e('div', { className: 'mm-row' },
        e('button', { className: 'id-back', onClick: function () { setResult(null); setView('scan'); setStep(0); } }, '↻ Re-scan'),
        e('button', { className: 'pf-cta mm-cta', onClick: onBack }, 'Back to Command Deck →'))
    ));
  }

  window.ClarityMarketMission = ClarityMarketMission;
  /* shared scan kit so other recon missions (Competition) can reuse the world map */
  window.ClarityScanKit = { WorldMap: WorldMap, REGIONS: REGIONS };
})();
