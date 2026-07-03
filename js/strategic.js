/* ============================================================================
   strategic.js — "Strategic Plan" (the capstone synthesis).
   Exposes window.ClarityStrategicPlan({ profile, missions, result, onComplete, onBack }).

   The client's six-category output: Market Snapshot (cyan) · Your Positioning
   (purple) · Competitor Intelligence (red) · Your Ideal Customer (green) ·
   Go-To-Market (amber) · Risk & Confidence (grey). Categories COMPILE one at a
   time behind a progress bar, then each shows a header + one 5-second summary
   line + expandable detail. Every number carries a context clause. Reading on
   screen is primary; "Download PDF" prints a clean plan. Mocked, sector-flavored;
   auto-enriches from completed recon (persona name, top rival) when present.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }
  function lcfirst(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }
  function fmtDate() { try { var M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; var d = new Date(); return M[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); } catch (e) { return 'July 1, 2026'; } }
  var XP = 100;

  /* the six categories — colors are the client's system (see colors.css) */
  var CATS = [
    { id: 'market',      title: 'Market Snapshot',        icon: 'Map',         accent: 'var(--clr-cat-market)',      dim: 'var(--clr-cat-market-dim)',      hex: '#22c9db', log: 'Compiling market snapshot' },
    { id: 'positioning', title: 'Your Positioning',       icon: 'Compass',     accent: 'var(--clr-cat-positioning)', dim: 'var(--clr-cat-positioning-dim)', hex: '#a78bfa', log: 'Fixing your positioning' },
    { id: 'competitor',  title: 'Competitor Intelligence',icon: 'Store',       accent: 'var(--clr-cat-competitor)',  dim: 'var(--clr-cat-competitor-dim)',  hex: '#f2685f', log: 'Mapping the competition' },
    { id: 'customer',    title: 'Your Ideal Customer',    icon: 'Users',       accent: 'var(--clr-cat-customer)',    dim: 'var(--clr-cat-customer-dim)',    hex: '#34d39e', log: 'Profiling your buyer' },
    { id: 'gtm',         title: 'Go-To-Market',           icon: 'Rocket',      accent: 'var(--clr-cat-gtm)',         dim: 'var(--clr-cat-gtm-dim)',         hex: '#f5a623', log: 'Drafting go-to-market' },
    { id: 'risk',        title: 'Risk & Confidence',      icon: 'ShieldAlert', accent: 'var(--clr-cat-risk)',        dim: 'var(--clr-cat-risk-dim)',        hex: '#9aa7a3', log: 'Scoring risk & confidence' }
  ];

  var SECTOR_TITLE = { food: 'Artisan food & bakery', retail: 'Independent retail', creative: 'Creative services', tech: 'SaaS / software', trades: 'Local trades & services', other: 'Your market' };

  /* stat detail item {k,v,ctx} → "k: v — ctx" (v is the number/fact, ctx the "so what"). Plain strings render as bullets. */
  var STRATPLAN = {
    food: { dq: 82,
      market: { summary: 'A rising ~$4.2M local niche — big enough to be profitable, small enough for one strong brand to own.', detail: [
        { k: 'Market size', v: '~$4.2M locally', ctx: 'a profitable niche, and small enough that one clear brand can own a segment' },
        { k: 'Demand', v: '+18% YoY', ctx: 'a real, rising tailwind — and it concentrates on weekends and holidays' },
        { k: 'Price', v: '$6–8 a loaf', ctx: 'a premium customers will pay when the craft is visible' } ] },
      positioning: { summary: 'Win on story, not price — nobody nearby owns “craft + provenance.”', detail: [
        'The gap is a believable behind-the-craft story — the people, the process, the 4am bake.',
        'Sit above the supermarket aisle and alongside (not below) the premium patisserie.',
        { k: 'Pricing room', v: 'top of the $6–8 band', ctx: 'defensible once the story justifies it' } ] },
      competitor: { summary: 'Fragmented field, no dominant brand — the leader wins on habit, not story.', detail: [
        { k: 'Top threat', v: 'Crumb & Co. · 34% SoV', ctx: 'strong walk-in trade but weak online — beatable on content' },
        { k: 'Field', v: '5–8 rivals within ~5km', ctx: 'share is split; no one owns the category' },
        'Almost none run a real owned-audience pre-order loop — your opening.' ] },
      customer: { summary: 'A community-led local — loyal, values-driven, and refers others.', detail: [
        { k: 'Fit', v: '86%', ctx: 'the tightest match to a craft, story-led bakery' },
        'They buy into belonging and the story — and pay more once they trust you.',
        'Find them in local community groups, at markets and on Instagram.' ] },
      gtm: { summary: 'Lead with behind-the-craft content on owned channels; open pre-orders early.', detail: [
        { k: 'Best channel', v: 'email + Instagram', ctx: 'owned audience converts ~3× better than product-only posts for pre-orders' },
        'First move: a weekly “bake drop” with pre-orders to build a standing order base.',
        'Reviews + a Google Business profile compound local trust cheaply.' ] },
      risk: { summary: 'Confidence is solid; the real risk is differentiation, not demand.', detail: [
        { k: 'Overall confidence', v: '82%', ctx: 'good coverage across market size, demand and pricing' },
        { k: 'Biggest risk', v: 'blending in', ctx: 'if you don’t tell the story you get pulled into a price war you can’t win' },
        { k: 'Watch', v: 'capacity', ctx: 'demand spikes on weekends — plan bake capacity before you promote hard' } ] } },

    retail: { dq: 80,
      market: { summary: 'A crowded but navigable DTC market — discovery and retention beat raw reach.', detail: [
        { k: 'Demand', v: '+22% qualified visits', ctx: 'discovery is rising, and it is mostly on mobile' },
        { k: 'Avg order', v: '$25–35', ctx: 'bundles lift this without discounting the core line' },
        'Category winners concentrate share through brand and community, not price.' ] },
      positioning: { summary: 'Own a sharp niche the big DTC brands are too broad to serve.', detail: [
        'Go around the category leaders, not head-on — they own the head search terms.',
        { k: 'Edge', v: 'limited drops + bundles', ctx: 'create urgency and lift order value without a discount habit' },
        'A distinct point of view beats a wider catalogue.' ] },
      competitor: { summary: 'Top-heavy — 2–3 DTC brands own search; a long tail competes on niche.', detail: [
        { k: 'Top threat', v: 'NorthSupply Co. · 38% SoV', ctx: 'owns head terms and SEO — flank on niche, not head-on' },
        'Smaller players under-use retargeting and an owned-audience loop.',
        { k: 'Field', v: '2–3 leaders + long tail', ctx: 'niche and service are where the tail wins' } ] },
      customer: { summary: 'A discovery-led, mobile-first shopper — won by being found and kept.', detail: [
        { k: 'Fit', v: '82%', ctx: 'a convenience/status-leaning buyer' },
        'Actively looking on mobile; abandons at the first sign of friction.',
        'Reach them via search, social offers and an email/SMS loop.' ] },
      gtm: { summary: 'Build an owned email/SMS audience; use limited drops to convert and retain.', detail: [
        { k: 'Best channel', v: 'email/SMS + retargeting', ctx: 'owned audience converts far better than chasing paid reach' },
        'First move: a launch drop with a waitlist to seed the list.',
        'Bundles raise order value; reviews reduce first-purchase risk.' ] },
      risk: { summary: 'Confidence is good; the risk is getting lost, not lack of demand.', detail: [
        { k: 'Overall confidence', v: '80%', ctx: 'solid across demand, order value and channel data' },
        { k: 'Biggest risk', v: 'discovery', ctx: 'a great product nobody finds — SEO + an owned audience is the fix' },
        { k: 'Watch', v: 'discount habit', ctx: 'over-discounting trains buyers to wait for the sale' } ] } },

    creative: { dq: 79,
      market: { summary: 'A fragmented, referral-led services market shifting toward brand+content bundles.', detail: [
        { k: 'Project value', v: '$500–1,500', ctx: 'typical SMB brand/content work; retainers stabilise revenue' },
        'Demand is moving from one-off jobs to combined packages.',
        'Hard to size precisely, but clearly expanding among SMBs.' ] },
      positioning: { summary: 'Own “clear outcome + speed + point of view” — the mid-market nobody serves.', detail: [
        'Marketplaces undercut on price, agencies on breadth; the middle is open.',
        { k: 'Edge', v: 'productised packages', ctx: 'reduce sales friction and raise perceived value vs hourly billing' },
        'A visible point of view and case studies beat a lower rate.' ] },
      competitor: { summary: 'Barbelled — cheap marketplaces vs premium agencies; the mid-market is wide open.', detail: [
        { k: 'Top threat', v: 'Freelance marketplaces · 40% SoV', ctx: 'cheap but low trust and outcomes — beat them on proof' },
        'Agencies win on breadth but are slow and expensive.',
        'Neither owns outcome + speed + a clear POV.' ] },
      customer: { summary: 'An outcome-driven SMB founder — buys proof, not lifestyle messaging.', detail: [
        { k: 'Fit', v: '84%', ctx: 'wants demonstrable results and a clear return' },
        'Referrals and portfolio win the work; price is secondary.',
        'Reach them via niche communities, referrals and a strong portfolio site.' ] },
      gtm: { summary: 'Lead with case studies and productised packages; let the portfolio sell.', detail: [
        { k: 'Best channel', v: 'portfolio + referrals', ctx: 'converts best; case studies do the heavy lifting' },
        'First move: package your top service into a fixed-scope offer.',
        'Retainers stabilise revenue and signal seniority.' ] },
      risk: { summary: 'Confidence is moderate; the risk is being seen as a commodity.', detail: [
        { k: 'Overall confidence', v: '79%', ctx: 'services are fragmented and harder to size precisely' },
        { k: 'Biggest risk', v: 'commoditisation', ctx: 'without a clear POV you compete with $5 marketplaces' },
        { k: 'Watch', v: 'capacity', ctx: 'referral-led growth is lumpy — protect delivery quality' } ] } },

    tech: { dq: 80,
      market: { summary: 'A competitive but expanding category — the specific use-case is growing ~30% a year.', detail: [
        { k: 'Niche growth', v: '~30% YoY', ctx: 'smaller than the broad category but expanding fast as workflows specialise' },
        { k: 'Search intent', v: '+31% YoY', ctx: 'clustered on integrations, pricing and “alternative to” queries' },
        { k: 'Entry price', v: '$15–39/mo', ctx: 'annual plans lift lifetime value materially' } ] },
      positioning: { summary: 'Win with a sharply-scoped wedge + superior onboarding, not feature parity.', detail: [
        'Two incumbents own the head term — go around them, not through them.',
        { k: 'Edge', v: 'best-in-class onboarding', ctx: 'time-to-value beats feature count for a wedge product' },
        '“Alternative to” positioning peels off underserved users.' ] },
      competitor: { summary: 'Concentrated at the top — 2 incumbents hold the head term and most paid share.', detail: [
        { k: 'Top threat', v: 'IncumbentOne · 42% SoV', ctx: 'broad and bloated — wedge on focus' },
        'An open-source alternative wins price-sensitive devs but is weak on support.',
        'Incumbents are slow and broad, leaving niches open.' ] },
      customer: { summary: 'A performance-driven early adopter — pays for an edge and wants data.', detail: [
        { k: 'Fit', v: '84%', ctx: 'benchmarks obsessively; skeptical of marketing claims' },
        'Proof and trials convert; feature lists do not.',
        'Reach them via founder-led content, niche communities and comparison pages.' ] },
      gtm: { summary: 'Founder-led content + a free tier + “alternative to” pages drive efficient signups.', detail: [
        { k: 'Best channel', v: 'founder-led content', ctx: 'drives the cheapest signups; community compounds retention' },
        'First move: ship an “alternative to [incumbent]” page and a free tier.',
        'Annual plans and strong onboarding lift lifetime value.' ] },
      risk: { summary: 'Confidence is good; the risk is a too-narrow wedge and incumbent response.', detail: [
        { k: 'Overall confidence', v: '80%', ctx: 'solid on demand and pricing signals' },
        { k: 'Biggest risk', v: 'wedge too narrow', ctx: 'scope tightly, but leave yourself a path to expand' },
        { k: 'Watch', v: 'incumbent copy', ctx: 'onboarding and community are harder to copy than features' } ] } },

    trades: { dq: 80,
      market: { summary: 'A high-intent local market won on trust and speed — “near me” demand is rising.', detail: [
        { k: 'Job value', v: '$90–180', ctx: 'transparent quoting reduces price sensitivity' },
        { k: 'Demand', v: '“near me”, mostly mobile', ctx: 'same-week intent — speed to respond predicts win rate' },
        'Little category disruption — reputation and reliability decide share.' ] },
      positioning: { summary: 'Be the fast-responding, review-led local pro with visible proof.', detail: [
        'Most rivals lean on word-of-mouth and are slow online — that’s the opening.',
        { k: 'Edge', v: 'minutes-not-hours response', ctx: 'the cheapest growth lever; it strongly predicts winning the job' },
        'Before/after proof builds trust faster than advertising.' ] },
      competitor: { summary: 'Fragmented and local — reputation and proximity beat ad spend.', detail: [
        { k: 'Top threat', v: 'EstablishedCo · 36% SoV', ctx: 'a reputation lead, but slow to respond online' },
        'Most rivals are weak on reviews and response speed.',
        'Lead-gen marketplaces commoditise — own the relationship instead.' ] },
      customer: { summary: 'A risk-reducing local homeowner — wants proof, guarantees and reliability.', detail: [
        { k: 'Fit', v: '88%', ctx: 'cautious; reads reviews and wants a guarantee' },
        'Trust signals and fast callbacks close the job.',
        'Reach them via Google, reviews and word-of-mouth.' ] },
      gtm: { summary: 'Build a reviews flywheel + before/after content; respond within minutes.', detail: [
        { k: 'Best channel', v: 'Google Business + reviews', ctx: 'wins local trust cheaply and improves ranking' },
        'First move: automate a review request after every job.',
        'Fast callbacks and transparent quotes reduce price shopping.' ] },
      risk: { summary: 'Confidence is good; the risk is response speed, not demand.', detail: [
        { k: 'Overall confidence', v: '80%', ctx: 'steady, well-understood local demand' },
        { k: 'Biggest risk', v: 'slow response', ctx: 'leads go cold fast — minutes matter' },
        { k: 'Watch', v: 'seasonality', ctx: 'demand tracks housing activity and weather' } ] } },

    other: { dq: 74,
      market: { summary: 'A fragmented market with steady, seasonally-peaking demand and no dominant player.', detail: [
        { k: 'Demand', v: 'steady + seasonal spikes', ctx: 'time launches to the peaks for outsized return' },
        { k: 'Data', v: 'limited category data', ctx: 'test 2–3 price points with your own audience before committing' },
        'No dominant player — an opening for a clear, consistent brand.' ] },
      positioning: { summary: 'Own a clear, consistent position in a muddled field.', detail: [
        'No competitor owns a clear spot — that’s your opening.',
        { k: 'Edge', v: 'one repeatable offer', ctx: 'clarity beats breadth in a fragmented market' },
        'An owned audience differentiates fast where others blend in.' ] },
      competitor: { summary: 'Fragmented with no clear leader — share is spread and unstable.', detail: [
        { k: 'Top threat', v: 'Established player · ~30% SoV', ctx: 'a generalist — beatable on focus' },
        'Niche challengers are loyal but small.',
        'No one owns a clear position.' ] },
      customer: { summary: 'Your most repeatable segment — start narrow, then widen.', detail: [
        'Run My Customers to put a real fit score on this — it sharpens fast.',
        'Lead with one clearly-defined buyer, not everyone.',
        'Reach them where they already gather — owned channels first.' ] },
      gtm: { summary: 'Build an owned audience and lead with one simple, repeatable offer.', detail: [
        { k: 'Best channel', v: 'owned email/social', ctx: 'outperforms paid in fragmented markets' },
        'First move: define one offer and one audience, then test it.',
        'Align promotions to seasonal demand peaks.' ] },
      risk: { summary: 'Confidence is moderate; the risk is spreading too thin.', detail: [
        { k: 'Overall confidence', v: '74%', ctx: 'limited category-specific data' },
        { k: 'Biggest risk', v: 'lack of focus', ctx: 'one clear offer beats many half-offers' },
        { k: 'Watch', v: 'price', ctx: 'test before committing — little public pricing data' } ] } }
  };

  /* chart-data helpers */
  function priceToX(p) { p = String(p || '').toLowerCase(); if (p.indexOf('$$$') >= 0) return 0.82; if (p.indexOf('$$') >= 0) return 0.55; if (p.indexOf('free') >= 0) return 0.12; if (p.indexOf('$') >= 0) return 0.3; return 0.5; }
  function threatToY(t, i) { t = String(t || '').toLowerCase(); var base = t === 'high' ? 0.34 : t === 'medium' ? 0.44 : 0.26; return Math.max(0.12, Math.min(0.6, base + (i % 2 ? 0.05 : -0.05))); }
  function genTrend(dq) { var a = []; var base = 32 + (dq % 12); for (var i = 0; i < 12; i++) { a.push(Math.round(base + i * (2.3 + (dq % 5) * 0.35) + (i % 3 === 1 ? 3 : 0) - (i % 4 === 2 ? 2 : 0))); } return a; }

  function buildPlan(profile, missions) {
    var sector = profile.sector || 'other';
    var bank = STRATPLAN[sector] || STRATPLAN.other;
    var m = missions || {};
    var RP = window.ClarityReports;
    var mkt = RP ? RP.primary(m.market) : m.market, comp = RP ? RP.primary(m.competition) : m.competition, cust = m.customers;

    /* real primary persona + real rivals when the recon has been run */
    var persona = null;
    if (cust && cust.sketches && cust.sketches.length) persona = cust.sketches.filter(function (s) { return s.name === cust.primary; })[0] || cust.sketches[0];
    var rivals = (comp && comp.competitors) ? comp.competitors : null;

    /* overall confidence = average of the DQs actually gathered */
    var dqs = []; if (mkt && mkt.dq) dqs.push(mkt.dq); if (comp && comp.dq) dqs.push(comp.dq); if (persona && persona.report) dqs.push(persona.report.dq);
    var overall = dqs.length ? Math.round(dqs.reduce(function (a, b) { return a + b; }, 0) / dqs.length) : bank.dq;

    function chartFor(id) {
      if (id === 'market') return { type: 'trend', points: genTrend(bank.dq), growth: '+18%', caption: 'search & demand interest, last 12 months — a real, rising tailwind.' };
      if (id === 'competitor') {
        var bars = (rivals || []).map(function (c) { return { label: c.name, value: c.sov, threat: c.threat }; });
        if (!bars.length) bars = [{ label: 'Leader', value: 36, threat: 'High' }, { label: 'Challenger', value: 24, threat: 'Medium' }, { label: 'Budget', value: 22, threat: 'Medium' }, { label: 'Fringe', value: 18, threat: 'Low' }];
        return { type: 'sov', bars: bars, caption: 'share of voice — who owns attention today.' };
      }
      if (id === 'positioning') {
        var rv = (rivals || []).slice(0, 4).map(function (c, i) { return { label: c.name, x: priceToX(c.price), y: threatToY(c.threat, i) }; });
        if (!rv.length) rv = [{ label: 'Leader', x: 0.55, y: 0.32 }, { label: 'Budget', x: 0.3, y: 0.22 }, { label: 'Premium', x: 0.82, y: 0.4 }];
        return { type: 'map', xlabel: 'Price', ylabel: 'Distinctiveness', you: { x: 0.5, y: 0.82 }, rivals: rv };
      }
      if (id === 'customer') {
        var traits = persona && persona.traits ? Object.keys(persona.traits).map(function (k) { return { label: k, value: persona.traits[k] }; }) : [{ label: 'Brand loyalty', value: 82 }, { label: 'Price sensitivity', value: 45 }, { label: 'Research depth', value: 70 }];
        return { type: 'traits', bars: traits, fit: persona ? persona.fit : 84, caption: 'what makes them tick — and how well they fit your offer.' };
      }
      if (id === 'gtm') {
        var chans = (persona && persona.channels) ? persona.channels : ['Owned email/social', 'Community', 'Search'];
        var vals = [86, 72, 61, 52];
        var bars2 = chans.slice(0, 4).map(function (c, i) { return { label: c, value: vals[i] || 50 }; });
        return { type: 'channels', bars: bars2, caption: 'where your buyer actually converts — lead with the top one.' };
      }
      var risks = (bank.risk.detail || []).filter(function (d) { return typeof d === 'object' && (d.k === 'Biggest risk' || d.k === 'Watch'); })
        .map(function (d) { return { label: d.k + ': ' + d.v, severity: d.k === 'Biggest risk' ? 'high' : 'medium' }; });
      return { type: 'gauge', confidence: overall, risks: risks, caption: 'how much to trust this — and what to keep an eye on.' };
    }

    var cats = CATS.map(function (c) {
      var block = bank[c.id] || { summary: '', detail: [] };
      var summary = block.summary;
      if (c.id === 'customer' && persona) summary = 'Your primary target is ' + persona.name + ' — ' + lcfirst(block.summary);
      return { id: c.id, title: c.title, icon: c.icon, accent: c.accent, dim: c.dim, hex: c.hex, summary: summary, detail: block.detail, chart: chartFor(c.id) };
    });
    var biz = (profile.name || '').trim();
    return { xp: XP, sector: sector, category: SECTOR_TITLE[sector] || 'Your market', biz: biz, dq: overall, date: fmtDate(), cats: cats };
  }

  /* ── Download to PDF — a clean printable plan the browser saves as PDF ── */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function detailHtml(items) {
    return items.map(function (d) {
      if (typeof d === 'string') return '<p style="margin:0 0 8px;padding-left:16px;position:relative;font-size:13px;line-height:1.5;color:#4b5563">&#9642;&nbsp;&nbsp;' + esc(d) + '</p>';
      return '<p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#4b5563"><b style="color:#111">' + esc(d.k) + ':</b> <b>' + esc(d.v) + '</b> — ' + esc(d.ctx) + '</p>';
    }).join('');
  }
  function planPrintHtml(plan) {
    var body = plan.cats.map(function (c) {
      return '<section style="border-left:4px solid ' + c.hex + ';padding:2px 0 2px 16px;margin:0 0 22px;page-break-inside:avoid">'
        + '<p style="margin:0 0 3px;font-family:Consolas,monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:' + c.hex + '">' + esc(c.title) + '</p>'
        + '<p style="margin:0 0 10px;font-family:Georgia,serif;font-size:18px;line-height:1.35;color:#111">' + esc(c.summary) + '</p>'
        + detailHtml(c.detail) + '</section>';
    }).join('');
    return '<html><head><meta charset="utf-8"><title>Strategic Plan — ' + esc(plan.category) + '</title></head>'
      + '<body style="font-family:\'Segoe UI\',Helvetica,Arial,sans-serif;color:#111;max-width:720px;margin:32px auto;padding:0 24px">'
      + '<p style="margin:0 0 6px;font-family:Consolas,monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#15b8a0">Strategic Plan</p>'
      + '<h1 style="margin:0 0 6px;font-family:Georgia,serif;font-size:30px;font-weight:normal">' + esc(plan.biz || plan.category) + '</h1>'
      + '<p style="margin:0 0 26px;font-size:12px;color:#6b7280">' + esc(plan.category) + ' &nbsp;&middot;&nbsp; ' + esc(plan.date) + ' &nbsp;&middot;&nbsp; ' + plan.dq + '% overall confidence &nbsp;&middot;&nbsp; Prepared by Clarity</p>'
      + body
      + '<p style="margin:26px 0 0;font-size:11px;color:#9ca3af">Generated by the Clarity agent platform. Figures are directional estimates — validate before acting.</p>'
      + '</body></html>';
  }
  function downloadPlan(plan) {
    try {
      var w = window.open('', '_blank');
      if (!w) return;
      w.document.write(planPrintHtml(plan));
      w.document.close(); w.focus();
      setTimeout(function () { try { w.print(); } catch (e) {} }, 350);
    } catch (err) {}
  }

  function catById(plan, id) {
    return plan.cats.filter(function (c) { return c.id === id; })[0] || null;
  }
  function detailVal(cat, key) {
    if (!cat) return null;
    for (var i = 0; i < cat.detail.length; i++) {
      var d = cat.detail[i];
      if (typeof d === 'object' && d.k === key) return d.v;
    }
    return null;
  }
  function planOverviewStats(plan) {
    var market = catById(plan, 'market');
    var customer = catById(plan, 'customer');
    var gtm = catById(plan, 'gtm');
    var fit = customer && customer.chart ? customer.chart.fit : null;
    var growth = market && market.chart ? market.chart.growth : detailVal(market, 'Demand');
    var topChan = gtm && gtm.chart && gtm.chart.bars && gtm.chart.bars[0] ? gtm.chart.bars[0].label : detailVal(gtm, 'Best channel');
    return [
      { value: plan.dq + '%', label: 'Overall confidence', note: plan.dq >= 80 ? 'Solid read' : 'Workable', tone: plan.dq >= 80 ? 'good' : 'neutral' },
      fit ? { value: fit + '%', label: 'Customer fit', note: fit >= 80 ? 'Strong match' : 'Good match', tone: fit >= 80 ? 'good' : 'neutral' } : null,
      growth ? { value: growth, label: 'Market demand', note: '12-month trend', tone: 'good' } : null,
      topChan ? { value: topChan, label: 'Top channel', note: 'best reach', tone: 'good' } : null
    ].filter(Boolean);
  }
  function renderCatDetail(c) {
    return c.detail.map(function (d, i) {
      if (typeof d === 'string') return e('div', { key: i, className: 'sp-bullet' }, d);
      return e('div', { key: i, className: 'sp-stat' }, e('b', null, d.k + ': '), e('span', { className: 'v' }, d.v), ' — ' + d.ctx);
    });
  }
  function planSections(plan) {
    return plan.cats.map(function (c) {
      return {
        id: c.id,
        label: c.title,
        node: e(React.Fragment, null,
          e('p', { className: 'rc-verdict' }, c.summary),
          e('div', { className: 'sp-cat-in-doc', style: { '--sp-accent': c.accent, '--sp-accent-dim': c.dim } },
            e(PlanChart, { chart: c.chart }),
            renderCatDetail(c)))
      };
    });
  }

  /* the voice of Clarity — unattributed typewriter line (reuses .capcom styles) */
  function Voice(props) {
    var line = props.line;
    var ty = React.useState(''); var typed = ty[0], setTyped = ty[1];
    var dn = React.useState(false); var done = dn[0], setDone = dn[1];
    React.useEffect(function () { setTyped(''); setDone(false); var i = 0; var iv = setInterval(function () { i++; setTyped(line.slice(0, i)); if (i >= line.length) { clearInterval(iv); setDone(true); } }, 16); return function () { clearInterval(iv); }; }, [line]);
    return e('div', { className: 'capcom' },
      e('div', { className: 'capcom-body' },
        e('div', { className: 'capcom-line' }, typed, !done && e('span', { className: 'pf-cursor' }, '▉'))));
  }

  /* one signature chart per category — all plain SVG/CSS, coloured by --sp-accent */
  function PlanChart(props) {
    var c = props.chart; if (!c) return null;
    if (c.type === 'trend') {
      var pts = c.points, w = 280, h = 58, mx = Math.max.apply(null, pts), mn = Math.min.apply(null, pts), rg = (mx - mn) || 1, st = w / (pts.length - 1);
      var d = pts.map(function (v, i) { return (i ? 'L' : 'M') + (i * st).toFixed(1) + ' ' + (h - 4 - (v - mn) / rg * (h - 12)).toFixed(1); }).join(' ');
      var lx = (pts.length - 1) * st, ly = h - 4 - (pts[pts.length - 1] - mn) / rg * (h - 12);
      return e('div', { className: 'sp-chart' },
        e('svg', { className: 'sp-spark', viewBox: '0 0 ' + w + ' ' + h, preserveAspectRatio: 'none' },
          e('path', { className: 'sp-spark-area', d: d + ' L' + w + ' ' + h + ' L0 ' + h + ' Z' }),
          e('path', { className: 'sp-spark-line', d: d }),
          e('circle', { className: 'sp-spark-dot', cx: lx, cy: ly, r: 3.5 })),
        e('div', { className: 'sp-chart-cap' }, e('b', null, c.growth + ' over 12 months'), ' — ' + c.caption));
    }
    if (c.type === 'sov' || c.type === 'channels') {
      var max = Math.max.apply(null, c.bars.map(function (b) { return b.value; })) || 100;
      return e('div', { className: 'sp-chart' },
        e('div', { className: 'sp-barlist' }, c.bars.map(function (b, i) {
          return e('div', { key: i, className: 'sp-barrow' },
            e('span', { className: 'sp-barl' }, b.label),
            e('div', { className: 'sp-bartrack' }, e('i', { className: b.threat ? 'th-' + String(b.threat).toLowerCase() : '', style: { width: (b.value / max * 100) + '%' } })),
            e('span', { className: 'sp-barv' }, b.value + '%'));
        })),
        e('div', { className: 'sp-chart-cap' }, c.caption));
    }
    if (c.type === 'traits') {
      return e('div', { className: 'sp-chart' },
        e('div', { className: 'sp-traitwrap' },
          e('div', { className: 'sp-barlist sp-grow' }, c.bars.map(function (b, i) {
            return e('div', { key: i, className: 'sp-barrow' },
              e('span', { className: 'sp-barl' }, b.label),
              e('div', { className: 'sp-bartrack' }, e('i', { style: { width: b.value + '%' } })),
              e('span', { className: 'sp-barv' }, b.value));
          })),
          e('div', { className: 'sp-gauge', style: { background: 'conic-gradient(var(--sp-accent) ' + (c.fit * 3.6) + 'deg, var(--clr-border) 0)' } }, e('div', { className: 'sp-gauge-in' }, e('b', null, c.fit + '%'), e('span', null, 'fit')))),
        e('div', { className: 'sp-chart-cap' }, c.caption));
    }
    if (c.type === 'map') {
      var W = 280, H = 188, pad = 30;
      var PX = function (x) { return pad + x * (W - 2 * pad); };
      var PY = function (y) { return (H - pad) - y * (H - 2 * pad); };
      return e('div', { className: 'sp-chart' },
        e('svg', { className: 'sp-map', viewBox: '0 0 ' + W + ' ' + H },
          e('line', { className: 'sp-map-ax', x1: PX(0.5), y1: pad - 8, x2: PX(0.5), y2: H - pad + 8 }),
          e('line', { className: 'sp-map-ax', x1: pad - 8, y1: PY(0.5), x2: W - pad + 8, y2: PY(0.5) }),
          c.rivals.map(function (r, i) {
            return e('g', { key: i },
              e('circle', { className: 'sp-map-rival', cx: PX(r.x), cy: PY(r.y), r: 5 }),
              e('text', { className: 'sp-map-label', x: PX(r.x) + 8, y: PY(r.y) + 3.5 }, r.label.length > 12 ? r.label.slice(0, 11) + '…' : r.label));
          }),
          e('circle', { className: 'sp-map-you', cx: PX(c.you.x), cy: PY(c.you.y), r: 7 }),
          e('text', { className: 'sp-map-you-l', x: PX(c.you.x) + 10, y: PY(c.you.y) + 4 }, 'You'),
          e('text', { className: 'sp-map-axl', x: W - pad + 6, y: PY(0.5) + 3, textAnchor: 'end' }, c.xlabel + ' →'),
          e('text', { className: 'sp-map-axl', x: PX(0.5) + 6, y: pad - 1 }, '↑ ' + c.ylabel)),
        e('div', { className: 'sp-chart-cap' }, 'the open space (upper area) is your gap — distinctive where rivals aren’t.'));
    }
    /* gauge (risk) */
    return e('div', { className: 'sp-chart' },
      e('div', { className: 'sp-riskwrap' },
        e('div', { className: 'sp-gauge', style: { background: 'conic-gradient(var(--sp-accent) ' + (c.confidence * 3.6) + 'deg, var(--clr-border) 0)' } }, e('div', { className: 'sp-gauge-in' }, e('b', null, c.confidence + '%'), e('span', null, 'sure'))),
        e('div', { className: 'sp-risklist' }, c.risks.map(function (r, i) {
          return e('div', { key: i, className: 'sp-riskrow' }, e('span', { className: 'sp-riskdot ' + r.severity }), r.label);
        }))),
      e('div', { className: 'sp-chart-cap' }, c.caption));
  }

  function ClarityStrategicPlan(props) {
    var profile = props.profile || {}, missions = props.missions, onComplete = props.onComplete, onBack = props.onBack, onPersona = props.onPersona;
    var initial = props.result || null;
    var planRef = React.useRef(initial);
    if (!planRef.current) planRef.current = buildPlan(profile, missions);
    var plan = planRef.current;

    var vw = React.useState(initial ? 'plan' : 'compiling'); var view = vw[0], setView = vw[1];
    var tv = React.useState('dark'); var theme = tv[0], setTheme = tv[1];
    var firedRef = React.useRef(false);

    var INPUTS = [
      { id: 'market', label: 'My Market', hex: '#22c9db', icon: 'Radar', live: !!(missions && missions.market) },
      { id: 'customers', label: 'My Customers', hex: '#34d39e', icon: 'Users', live: !!(missions && missions.customers) },
      { id: 'competition', label: 'My Competition', hex: '#f2685f', icon: 'Crosshair', live: !!(missions && missions.competition) }
    ];

    React.useEffect(function () {
      if (view !== 'compiling') return;
      var to = setTimeout(function () { setView('plan'); if (onComplete && !firedRef.current) { firedRef.current = true; onComplete(plan); } }, INPUTS.length * 900 + 1000);
      return function () { clearTimeout(to); };
    }, [view]);

    function bg() { return e('div', { className: 'pf-bg' }, e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-vignette' })); }
    function toggleTheme() { setTheme(function (t) { return t === 'light' ? 'dark' : 'light'; }); }
    function shell(inner) {
      return e('div', { className: 'id-root' }, bg(),
        e('div', { className: 'pf-topbar' },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
            e('span', { className: 'pf-wordmark' }, 'Clarity'),
            e('span', { className: 'pf-hide-sm' }, 'Your journey · Strategic Plan'))),
        e('div', { className: 'id-main' }, inner));
    }

    /* ── COMPILING — just the line that fills while the plan comes together ── */
    if (view === 'compiling') {
      return shell(e(React.Fragment, null,
        e('div', { className: 'id-eyebrow' }, 'One moment'),
        e('h1', { className: 'sp-title' }, 'Gathering what you’ve learned…'),
        e(Voice, { line: 'Bringing in everything you learned — your market, your customers, the landscape.' }),
        e('div', { className: 'mm-bar' }, e('i', null))
      ));
    }

    /* ── PLAN ── */
    var draftSketches = (missions && missions.customers && missions.customers.sketches) || [];
    var draftN = draftSketches.length;
    var sections = planSections(plan);
    var stats = planOverviewStats(plan);
    var storeKey = 'strategic:' + (plan.biz || plan.category || 'plan');

    return shell(e(React.Fragment, null,
      e('button', { className: 'id-back', onClick: onBack }, '‹ The groundwork'),
      e('div', { className: 'mm-acq' }, e('span', { className: 'mm-acq-stamp' }, 'Your plan has come together'), e('span', { className: 'mm-acq-xp' }, '+', plan.xp, ' XP')),
      e(Voice, { line: 'Done — here’s the read on your plan. The plain version is up top; the detail sits underneath if you want it.' }),

      draftN > 0 && e('div', { className: 'sp-persona-cue' },
        e('div', { className: 'sp-persona-cue-ic' }, e(Icon, { name: 'Sparkles', size: 18 })),
        e('div', { className: 'sp-persona-cue-body' },
          e('div', { className: 'sp-persona-cue-t' }, 'We’ve drafted your personas'),
          e('div', { className: 'sp-persona-cue-s' }, 'From your customer research, ' + draftN + ' ' + (draftN > 1 ? 'people are' : 'person is') + ' ready to meet — talk to them and they come to life.')),
        onPersona && e('button', { className: 'pf-cta sp-persona-cue-cta', onClick: onPersona }, 'Meet them ', e(Icon, { name: 'ArrowRight', size: 15 }))),

      e('div', { className: 'rc-doc rc-' + theme, style: { '--rc-accent': 'var(--clr-primary-hover)', '--rc-accent-dim': 'var(--clr-primary-dim)' } },
        e('div', { className: 'rc-bar' },
          e('div', { className: 'rc-bar-cat' }, e('span', { className: 'rc-dot' }), 'Strategic Plan'),
          e('div', { className: 'rc-bar-tools' },
            e('button', { className: 'rc-tool', onClick: toggleTheme, title: 'Toggle reading mode' },
              e(Icon, { name: theme === 'light' ? 'Moon' : 'Sun', size: 14 }), theme === 'light' ? 'Night' : 'Day'),
            e('button', { className: 'rc-tool rc-tool-dl', onClick: function () { downloadPlan(plan); } },
              e(Icon, { name: 'Download', size: 14 }), 'Download'))),

        e('div', { className: 'rc-mast' },
          e('div', { className: 'rc-eyebrow' }, 'Strategic Plan'),
          e('h1', { className: 'rc-h1' }, plan.biz || plan.category),
          e('div', { className: 'rc-mast-meta' }, plan.category + '  ·  ' + plan.date + '  ·  Prepared by Clarity')),
        e('div', { className: 'rc-rule' }),

        window.ClarityReportBody && e(window.ClarityReportBody, { sections: sections, stats: stats, storeKey: storeKey })
      ),

      e('button', { className: 'id-back', style: { marginTop: 16 }, onClick: onBack }, 'Back to the groundwork →')
    ));
  }

  window.ClarityStrategicPlan = ClarityStrategicPlan;
})();
