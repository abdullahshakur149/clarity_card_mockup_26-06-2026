/* ============================================================================
   customers.js — "My Customers" recon mission (Sketch my customer).  ref 13-15.png
   Exposes window.ClarityCustomersMission({ profile, result, onComplete, onBack }).
   Distinct mechanic vs My Market: a "Target Dossier" / persona character-sheet
   builder. Flow: roster → sketch (name + INFERRED desc → pick archetype) →
   building reveal → persona dossier (traits, channels, motivations, fit %) with a
   real downloadable persona file. Build several; mark a Primary target. Mocked.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }

  var XP = 50;
  var ARCHETYPES = [
    { id: 'risk',        label: 'Risk-reducer',       tag: 'RISK-REDUCER', icon: 'ShieldCheck', age: 42, fit: 88,
      blurb: 'Wants safety, proof and guarantees before committing.', demo: '40s · settled · reputation over novelty',
      traits: { 'Price sensitivity': 55, 'Brand loyalty': 82, 'Risk appetite': 22, 'Research depth': 85 },
      channels: ['Reviews & ratings', 'Word-of-mouth', 'Comparison sites'], cares: ['Trust & proof', 'Guarantees / returns', 'Avoiding mistakes'] },
    { id: 'performance', label: 'Performance-driven', tag: 'PERFORMANCE', icon: 'Gauge', age: 35, fit: 84,
      blurb: 'Chases the best result — and will pay for it.', demo: '30s · ambitious · outcome-obsessed',
      traits: { 'Price sensitivity': 35, 'Brand loyalty': 60, 'Risk appetite': 55, 'Research depth': 90 },
      channels: ['Niche communities', 'YouTube / expert reviews', 'Spec comparisons'], cares: ['Best outcome', 'Specs & results', 'An edge over others'] },
    { id: 'cost',        label: 'Cost-driven',        tag: 'COST-DRIVEN', icon: 'Tag', age: 29, fit: 76,
      blurb: 'Leads with price; loyal only while the deal lasts.', demo: 'late 20s · budget-conscious · comparison shopper',
      traits: { 'Price sensitivity': 90, 'Brand loyalty': 35, 'Risk appetite': 50, 'Research depth': 60 },
      channels: ['Search & deal sites', 'Social offers', 'Marketplaces'], cares: ['Value for money', 'Deals & discounts', 'Not overpaying'] },
    { id: 'status',      label: 'Status-seeker',      tag: 'STATUS', icon: 'Sparkles', age: 31, fit: 80,
      blurb: 'Buys for identity, image and being seen.', demo: '30s · image-led · early adopter',
      traits: { 'Price sensitivity': 30, 'Brand loyalty': 55, 'Risk appetite': 45, 'Research depth': 40 },
      channels: ['Instagram / TikTok', 'Influencers', 'Premium press'], cares: ['Identity & prestige', 'Being seen', 'Brand cachet'] },
    { id: 'convenience', label: 'Convenience-first',  tag: 'CONVENIENCE', icon: 'Zap', age: 38, fit: 82,
      blurb: 'Wants it easy and fast — friction loses the sale.', demo: '30s–40s · time-poor · mobile-first',
      traits: { 'Price sensitivity': 50, 'Brand loyalty': 58, 'Risk appetite': 30, 'Research depth': 35 },
      channels: ['App stores / marketplaces', 'Paid ads', 'One-tap checkout'], cares: ['Speed & ease', 'No friction', 'Reliability'] },
    { id: 'community',   label: 'Community-led',      tag: 'COMMUNITY', icon: 'Users', age: 33, fit: 86,
      blurb: 'Buys into belonging, values and the story.', demo: '30s · values-driven · brand advocate',
      traits: { 'Price sensitivity': 50, 'Brand loyalty': 85, 'Risk appetite': 28, 'Research depth': 55 },
      channels: ['Community groups', 'Local events', 'Instagram'], cares: ['Belonging', 'Shared values', 'The story behind it'] }
  ];
  var BUILD_LOG = ['> PROFILING TARGET…', '> MAPPING MOTIVATIONS…', '> LOCATING CHANNELS…', '> SCORING FIT…', '> DOSSIER READY'];

  /* call-sign generator — turns naming into a pick/shuffle mechanic */
  var CS_NAMES = ['Sam', 'Priya', 'Luca', 'Bea', 'Theo', 'Mia', 'Sven', 'Nova', 'Owen', 'Lena', 'Marco', 'Ivy', 'Dara', 'Cole', 'Asha', 'Finn'];
  var CS_DESC = {
    food:     ['Saturday-market', 'Sourdough', 'Farmers-market', 'Sunday-brunch', 'Artisan'],
    retail:   ['Bargain', 'Boutique', 'Drop-day', 'Window-shopper', 'Wishlist'],
    creative: ['Brief-in-hand', 'Portfolio', 'Referral', 'Founder', 'Studio'],
    tech:     ['Power-user', 'Early-adopter', 'Free-tier', 'Integration', 'Founder'],
    trades:   ['Same-week', 'Local', 'Emergency', 'Referral', 'Repeat'],
    other:    ['Weekend', 'First-time', 'Premium', 'Repeat', 'High-intent']
  };
  var CS_GENERIC = ['Loyal', 'Weekend', 'First-time', 'Premium', 'Repeat', 'Word-of-mouth', 'High-intent'];
  function genCallsigns(profile) {
    var ds = (CS_DESC[profile.sector] || []).concat(CS_GENERIC);
    var out = [], used = {}, guard = 0;
    while (out.length < 6 && guard++ < 200) {
      var cs = ds[Math.floor(Math.random() * ds.length)] + ' ' + CS_NAMES[Math.floor(Math.random() * CS_NAMES.length)];
      if (!used[cs]) { used[cs] = 1; out.push(cs); }
    }
    return out;
  }

  function buildPersona(profile, name, archId) {
    var a = ARCHETYPES.filter(function (x) { return x.id === archId; })[0] || ARCHETYPES[0];
    return { id: archId + '_' + name, name: name, age: a.age, archetype: a.label, tag: a.tag, icon: a.icon,
      summary: a.blurb, demo: a.demo, traits: a.traits, channels: a.channels, cares: a.cares, fit: a.fit, xp: XP };
  }

  /* ── Real downloadable persona file ── */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
  function personaHtml(p, profile) {
    var traits = Object.keys(p.traits).map(function (k) { return '<tr><td>' + esc(k) + '</td><td>' + p.traits[k] + ' / 100</td></tr>'; }).join('');
    return '<html xmlns:o="urn:schemas-microsoft-office:office" xmlns:w="urn:schemas-microsoft-office:office:word" xmlns="http://www.w3.org/TR/REC-html40">'
      + '<head><meta charset="utf-8"><title>Customer persona — ' + esc(p.name) + '</title></head>'
      + '<body style="font-family:Calibri,Arial,sans-serif;color:#111;max-width:720px">'
      + '<h1 style="margin-bottom:2px">' + esc(p.name) + ', ' + p.age + '</h1>'
      + '<p style="color:#666;margin:0">Customer persona · ' + esc(p.archetype) + ' · Fit ' + p.fit + '%</p>'
      + '<p style="color:#666;margin:2px 0 10px">Generated by the Clarity agent platform' + (profile && profile.name ? ' · ' + esc(profile.name) : '') + '</p>'
      + '<h2>Snapshot</h2><p>' + esc(p.summary) + '</p><p><b>Demographics:</b> ' + esc(p.demo) + '</p>'
      + '<h2>Traits</h2><table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-size:12px">' + traits + '</table>'
      + '<h2>Where to find them</h2><p>' + esc(p.channels.join(' · ')) + '</p>'
      + '<h2>What they care about</h2><p>' + esc(p.cares.join(' · ')) + '</p>'
      + '</body></html>';
  }
  function downloadPersona(p, profile) {
    try {
      var blob = new Blob(['﻿', personaHtml(p, profile)], { type: 'application/msword' });
      var url = URL.createObjectURL(blob); var a = document.createElement('a');
      a.href = url; a.download = 'Customer_persona_' + slug(p.name) + '.doc';
      document.body.appendChild(a); a.click();
      setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 200);
    } catch (err) {}
  }

  /* ── Audience report (mirrors the MVP "consumer" workflow doc, improved) ── */
  function fmtDate() { try { var M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; var d = new Date(); return M[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); } catch (e) { return 'July 1, 2026'; } }
  function interp(s, ctx, name) { return String(s).replace(/\{sector\}/g, ctx.name).replace(/\{market\}/g, ctx.market).replace(/\{price\}/g, ctx.price).replace(/\{name\}/g, name); }
  var SECTOR_CTX = {
    food:     { name: 'artisan food & bakery', market: 'a mature, steadily-growing premium niche', price: '$6–8 per premium item' },
    retail:   { name: 'independent retail',     market: 'a crowded but navigable DTC market',       price: '$25–35 AOV' },
    creative: { name: 'creative services',      market: 'a fragmented, referral-led services market', price: '$500–1,500 / project' },
    tech:     { name: 'SaaS / software',        market: 'a competitive, expanding category',         price: '$15–39 / mo' },
    trades:   { name: 'local trades & services', market: 'a high-intent local market',               price: '$90–180 / job' },
    other:    { name: 'your market',            market: 'a fragmented market with steady demand',     price: 'a value-tested price' }
  };
  var AUDIENCE_EVIDENCE = [
    { id: 'e_01', domain: 'pewresearch.org',   topic: 'Audience behaviour & media use',      url: 'https://www.pewresearch.org/' },
    { id: 'e_02', domain: 'mckinsey.com',      topic: 'Willingness-to-pay & pricing study',  url: 'https://www.mckinsey.com/' },
    { id: 'e_03', domain: 'trends.google.com', topic: 'Search intent & channel signals',     url: 'https://trends.google.com/' },
    { id: 'e_04', domain: 'statista.com',      topic: 'Demographics & category spend',       url: 'https://www.statista.com/' },
    { id: 'e_05', domain: 'nielsen.com',       topic: 'Channel reach & engagement',          url: 'https://www.nielsen.com/' },
    { id: 'e_06', domain: 'gartner.com',       topic: 'Buyer journey & decision drivers',    url: 'https://www.gartner.com/' }
  ];
  var REP = {
    risk: { dq: 82, profileExtra: 'They research deeply, read the fine print, and stay loyal once trust is earned.',
      table: { size: 'The cautious “show-me-it-works” majority — large and steady', roles: 'Primary decision-maker + a trusted referrer', cadence: 'Considered; researches before each purchase' },
      demographics: [{ label: 'Age', rows: [{ label: '25–34', pct: 20 }, { label: '35–49', pct: 50 }, { label: '50+', pct: 30 }] }, { label: 'Buying posture', rows: [{ label: 'Proof-led', pct: 65 }, { label: 'Balanced', pct: 25 }, { label: 'Impulsive', pct: 10 }] }],
      psychographics: ['Wants proof before committing — reviews, references, guarantees', 'Low tolerance for downside; fears choosing wrong', 'Reads reviews and the fine print thoroughly', 'Loyal once trust is earned; slow to switch'],
      wtp: { band: 'Mid — pays for assurance', note: 'Pays a premium for warranties, support and track record; unproven discounts read as risky. Benchmark {price}.' },
      recommendation: 'Lead with proof — reviews, guarantees and a visible track record — and remove downside at every step. In {sector} ({market}), the safe-choice framing converts the cautious majority.',
      findings: [{ q: 'What moves them', conf: 'High', refs: ['e_01', 'e_06'], text: 'Trust signals (reviews, guarantees, referrals) outweigh price; remove downside and the sale follows.' }, { q: 'Willingness to pay', conf: 'Medium', refs: ['e_02'], text: 'Pays a premium for assurance; unproven discounting can backfire by signalling risk.' }, { q: 'Best channels', conf: 'High', refs: ['e_03', 'e_05'], text: 'Review platforms, word-of-mouth and comparison content; case studies do the heavy lifting.' }, { q: 'How to convert', conf: 'High', refs: ['e_06'], text: 'Guarantees, testimonials and a clear support promise make the safe choice obvious.' }] },
    performance: { dq: 84, profileExtra: 'They benchmark obsessively and will pay for the best outcome.',
      table: { size: 'A discerning, high-value minority', roles: 'Hands-on evaluator who often drives the decision', cadence: 'Deliberate; evaluates specs and proof first' },
      demographics: [{ label: 'Age', rows: [{ label: '25–34', pct: 38 }, { label: '35–49', pct: 45 }, { label: '50+', pct: 17 }] }, { label: 'Spend tier', rows: [{ label: 'Premium', pct: 55 }, { label: 'Mid', pct: 35 }, { label: 'Budget', pct: 10 }] }],
      psychographics: ['Chases the best result; specs and proof matter', 'Skeptical of marketing claims — wants data', 'Early adopter of tools that give an edge', 'Will pay more for measurable performance'],
      wtp: { band: 'High — pays for performance', note: 'Low price sensitivity when results are proven; benchmark {price} but premium tiers convert.' },
      recommendation: 'Win on demonstrable performance — specs, comparisons and proof. In {sector} ({market}), a credible “best outcome” case justifies premium pricing.',
      findings: [{ q: 'What moves them', conf: 'High', refs: ['e_06', 'e_03'], text: 'Demonstrable results and specs beat price; proof and comparisons convert.' }, { q: 'Willingness to pay', conf: 'High', refs: ['e_02'], text: 'Low price sensitivity when performance is proven; premium tiers are accepted.' }, { q: 'Best channels', conf: 'Medium', refs: ['e_03', 'e_05'], text: 'Niche communities, expert reviews and detailed comparison content.' }, { q: 'How to convert', conf: 'High', refs: ['e_06'], text: 'Lead with benchmarks, trials and head-to-head proof, not lifestyle messaging.' }] },
    cost: { dq: 78, profileExtra: 'They compare relentlessly and switch the moment a better deal appears.',
      table: { size: 'A large, price-led segment', roles: 'Self-directed shopper; quick to decide on price', cadence: 'Frequent, deal-driven' },
      demographics: [{ label: 'Age', rows: [{ label: '18–24', pct: 30 }, { label: '25–34', pct: 42 }, { label: '35+', pct: 28 }] }, { label: 'Price sensitivity', rows: [{ label: 'High', pct: 70 }, { label: 'Medium', pct: 22 }, { label: 'Low', pct: 8 }] }],
      psychographics: ['Leads with price; hunts for the best deal', 'Low switching cost — loyalty lasts as long as the discount', 'Comparison-shops across sites quickly', 'Responds to urgency and limited offers'],
      wtp: { band: 'Low — value-led', note: 'Anchors to the cheapest credible option; bundles and clear value beat raw discounting. Benchmark {price}.' },
      recommendation: 'Compete on clear value, not just price — bundles, transparent pricing and urgency. In {sector} ({market}), make the value obvious and the deal easy.',
      findings: [{ q: 'What moves them', conf: 'High', refs: ['e_03'], text: 'Price and clear value dominate; deals and urgency drive action.' }, { q: 'Willingness to pay', conf: 'Medium', refs: ['e_02'], text: 'Low and elastic; bundles lift order value without straight discounting.' }, { q: 'Best channels', conf: 'High', refs: ['e_03', 'e_04'], text: 'Search, deal/offer placements, marketplaces and social promos.' }, { q: 'How to convert', conf: 'Medium', refs: ['e_03'], text: 'Transparent pricing, bundles and time-boxed offers reduce comparison drop-off.' }] },
    status: { dq: 79, profileExtra: 'They buy for identity and signal — being seen matters as much as the product.',
      table: { size: 'A trend-led, image-conscious segment', roles: 'Individual buyer influenced by social proof', cadence: 'Impulse + aspiration-driven' },
      demographics: [{ label: 'Age', rows: [{ label: '18–24', pct: 34 }, { label: '25–34', pct: 44 }, { label: '35+', pct: 22 }] }, { label: 'Influence source', rows: [{ label: 'Social / influencer', pct: 58 }, { label: 'Peers', pct: 27 }, { label: 'Brand', pct: 15 }] }],
      psychographics: ['Buys for identity, image and belonging to the “in” group', 'Influenced heavily by creators and peers', 'Values aesthetics and brand cachet over specs', 'Early to share and be seen with new things'],
      wtp: { band: 'Mid-high — pays for cachet', note: 'Pays for prestige and aesthetics; perceived exclusivity raises WTP. Benchmark {price}.' },
      recommendation: 'Sell identity and aesthetics — make them look good for choosing you. In {sector} ({market}), creator-led proof and limited editions drive desire.',
      findings: [{ q: 'What moves them', conf: 'Medium', refs: ['e_05', 'e_03'], text: 'Identity, aesthetics and social proof; being seen drives the purchase.' }, { q: 'Willingness to pay', conf: 'Medium', refs: ['e_02'], text: 'Elevated for prestige and exclusivity; premium and limited drops convert.' }, { q: 'Best channels', conf: 'High', refs: ['e_05', 'e_03'], text: 'Instagram / TikTok, influencers and premium press; visual-first.' }, { q: 'How to convert', conf: 'Medium', refs: ['e_05'], text: 'Creator collabs, social proof and scarcity (limited editions) raise desire.' }] },
    convenience: { dq: 80, profileExtra: 'They want it easy and fast — any friction loses the sale.',
      table: { size: 'A broad, time-poor mainstream segment', roles: 'Busy buyer who defaults to the easiest option', cadence: 'Frequent; low-deliberation' },
      demographics: [{ label: 'Age', rows: [{ label: '25–34', pct: 36 }, { label: '35–49', pct: 42 }, { label: '50+', pct: 22 }] }, { label: 'Device', rows: [{ label: 'Mobile-first', pct: 68 }, { label: 'Desktop', pct: 22 }, { label: 'In-person', pct: 10 }] }],
      psychographics: ['Prioritises speed and ease over everything', 'Abandons at the first sign of friction', 'Defaults to the most convenient option', 'Values reliability and predictability'],
      wtp: { band: 'Mid — pays to save effort', note: 'Pays a small premium for speed and ease; friction, not price, is the main barrier. Benchmark {price}.' },
      recommendation: 'Remove friction end-to-end — fast, mobile-first, one-tap. In {sector} ({market}), the easiest option wins more often than the cheapest.',
      findings: [{ q: 'What moves them', conf: 'High', refs: ['e_03'], text: 'Speed and ease; friction is the primary reason they drop off.' }, { q: 'Willingness to pay', conf: 'Medium', refs: ['e_02'], text: 'Will pay a modest premium to save time and effort.' }, { q: 'Best channels', conf: 'Medium', refs: ['e_04', 'e_03'], text: 'Marketplaces, app stores and paid ads with one-tap paths.' }, { q: 'How to convert', conf: 'High', refs: ['e_03'], text: 'Cut steps: fast checkout, mobile-first, clear defaults, instant confirmation.' }] },
    community: { dq: 83, profileExtra: 'They buy into belonging, shared values and the story behind the brand.',
      table: { size: 'A loyal, values-led core', roles: 'Engaged member who advocates and refers', cadence: 'Recurring; relationship-driven' },
      demographics: [{ label: 'Age', rows: [{ label: '25–34', pct: 40 }, { label: '35–49', pct: 42 }, { label: '50+', pct: 18 }] }, { label: 'Engagement', rows: [{ label: 'Advocate', pct: 48 }, { label: 'Active', pct: 34 }, { label: 'Casual', pct: 18 }] }],
      psychographics: ['Buys into belonging and shared values', 'Highly loyal and refers others', 'Cares about the story and people behind it', 'Engages with community and events'],
      wtp: { band: 'Mid — pays for values & story', note: 'Pays for authenticity and belonging; loyalty lowers price sensitivity over time. Benchmark {price}.' },
      recommendation: 'Build belonging — story, values and community. In {sector} ({market}), an engaged core compounds via referrals and repeat purchases.',
      findings: [{ q: 'What moves them', conf: 'High', refs: ['e_01', 'e_05'], text: 'Belonging, shared values and a genuine story; community drives loyalty.' }, { q: 'Willingness to pay', conf: 'Medium', refs: ['e_02'], text: 'Loyalty lowers price sensitivity; members pay for authenticity over time.' }, { q: 'Best channels', conf: 'High', refs: ['e_05', 'e_03'], text: 'Community groups, events and Instagram; founder/people-led content.' }, { q: 'How to convert', conf: 'High', refs: ['e_01'], text: 'Tell the story, involve the community, reward advocacy and referrals.' }] }
  };

  function buildAudience(profile, name, archId) {
    var p = buildPersona(profile, name, archId);
    var rep = REP[archId] || REP.risk;
    var ctx = SECTOR_CTX[profile.sector] || SECTOR_CTX.other;
    p.report = {
      dq: rep.dq, reportType: 'consumer', date: fmtDate(),
      subtitle: 'What motivates ' + name + ', how much they will pay, and where to reach them.',
      profile: name + ' is your core ' + ctx.name + ' buyer — ' + p.summary.charAt(0).toLowerCase() + p.summary.slice(1) + ' ' + rep.profileExtra,
      table: rep.table, demographics: rep.demographics, psychographics: rep.psychographics,
      wtp: { band: rep.wtp.band, note: interp(rep.wtp.note, ctx, name) },
      recommendation: interp(rep.recommendation, ctx, name),
      findings: rep.findings.map(function (f) { return { q: f.q, conf: f.conf, refs: f.refs, text: interp(f.text, ctx, name) }; }),
      evidence: AUDIENCE_EVIDENCE, sources: AUDIENCE_EVIDENCE.length, depth: 'Standard (3 queries)'
    };
    return p;
  }

  function audienceHtml(p, profile) {
    var r = p.report;
    var demo = r.demographics.map(function (g) { return '<h3 style="margin:12px 0 4px">' + esc(g.label) + '</h3><table border="1" cellspacing="0" cellpadding="5" style="border-collapse:collapse;font-size:12px">' + g.rows.map(function (x) { return '<tr><td>' + esc(x.label) + '</td><td>' + x.pct + '%</td></tr>'; }).join('') + '</table>'; }).join('');
    var psy = '<ul>' + r.psychographics.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    var find = r.findings.map(function (x) { return '<h3 style="margin:12px 0 2px">' + esc(x.q) + ' <span style="font-weight:normal;color:#777;font-size:11px">(' + esc(x.conf) + ' confidence)</span></h3><p style="margin:2px 0">' + esc(x.text) + '</p><p style="margin:2px 0;color:#888;font-size:11px">Sources: ' + esc(x.refs.join(', ')) + '</p>'; }).join('');
    var ev = r.evidence.map(function (x) { return '<p style="margin:3px 0;font-size:11px">' + esc(x.id) + ' — <b>' + esc(x.domain) + '</b> — ' + esc(x.topic) + ' — <a href="' + esc(x.url) + '">' + esc(x.url) + '</a></p>'; }).join('');
    return '<html xmlns:o="urn:schemas-microsoft-office:office" xmlns:w="urn:schemas-microsoft-office:office:word" xmlns="http://www.w3.org/TR/REC-html40">'
      + '<head><meta charset="utf-8"><title>Audience — ' + esc(p.name) + '</title></head>'
      + '<body style="font-family:Calibri,Arial,sans-serif;color:#111;max-width:720px">'
      + '<h1 style="margin-bottom:2px">' + esc(p.name) + ', ' + p.age + ' — ' + esc(p.archetype) + ' — Audience & WTP</h1>'
      + '<p style="color:#666;margin:0">' + esc(r.subtitle) + '</p>'
      + '<p style="color:#666;margin:2px 0 10px">Generated by the Clarity agent platform · ' + esc(r.date) + ' · Report type: ' + esc(r.reportType) + ' · Overall DQ: ' + r.dq + '%</p>'
      + '<h2>Audience Profile</h2><p>' + esc(r.profile) + '</p>'
      + '<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-size:12px;margin:6px 0"><tr style="background:#f1f5f9"><td><b>Audience size</b></td><td><b>Primary roles</b></td><td><b>Procurement cadence</b></td></tr><tr><td>' + esc(r.table.size) + '</td><td>' + esc(r.table.roles) + '</td><td>' + esc(r.table.cadence) + '</td></tr></table>'
      + '<h3>Demographics</h3>' + demo
      + '<h3>Psychographics</h3>' + psy
      + '<h2>Executive Summary</h2><p>' + esc(r.recommendation) + '</p><p><b>Willingness to pay:</b> ' + esc(r.wtp.band) + ' — ' + esc(r.wtp.note) + '</p>'
      + '<h2>Key findings</h2>' + find
      + '<h2>Evidence appendix</h2>' + ev
      + '</body></html>';
  }
  function downloadAudience(p, profile) {
    try {
      var blob = new Blob(['﻿', audienceHtml(p, profile)], { type: 'application/msword' });
      var url = URL.createObjectURL(blob); var a = document.createElement('a');
      a.href = url; a.download = 'Audience_' + slug(p.name) + '.doc';
      document.body.appendChild(a); a.click();
      setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 200);
    } catch (err) {}
  }

  function ClarityCustomersMission(props) {
    var profile = props.profile || {}, onComplete = props.onComplete, onBack = props.onBack;
    var seeded = (props.result && props.result.sketches) || [];

    var vw = React.useState('roster'); var view = vw[0], setView = vw[1];
    var sk = React.useState(seeded);   var sketches = sk[0], setSketches = sk[1];
    var pr = React.useState((props.result && props.result.primary) || (seeded[0] && seeded[0].name) || null); var primary = pr[0], setPrimary = pr[1];
    var st = React.useState(0);        var step = st[0], setStep = st[1];
    var nm = React.useState('');       var name = nm[0], setName = nm[1];
    var ar = React.useState(null);     var arch = ar[0], setArch = ar[1];
    var cur = React.useState(null);    var current = cur[0], setCurrent = cur[1];  // persona being viewed
    var rv = React.useState(0);        var revealed = rv[0], setRevealed = rv[1];
    var sg = React.useState(function () { return genCallsigns(profile); }); var suggestions = sg[0], setSuggestions = sg[1];

    function startSketch() { setName(''); setArch(null); setStep(0); setSuggestions(genCallsigns(profile)); setView('sketch'); }

    var inferred = (profile.desc || 'your core customer').trim();

    React.useEffect(function () {
      if (view !== 'building') return;
      var n = 0; setRevealed(0);
      var iv = setInterval(function () { n++; setRevealed(n); if (n >= BUILD_LOG.length) clearInterval(iv); }, 360);
      var t = setTimeout(function () {
        var p = buildAudience(profile, name.trim(), arch);
        var nextList = sketches.concat([p]);
        var nextPrimary = primary || p.name;
        setSketches(nextList); setPrimary(nextPrimary); setCurrent(p); setView('result');
        if (onComplete) onComplete({ xp: XP, count: nextList.length, sketches: nextList, primary: nextPrimary, lastName: p.name });
      }, 1900);
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
            e('span', { className: 'pf-hide-sm' }, 'Mission Control // Recon · My Customers')),
          e('div', { className: 'pf-tele' }, e('span', { className: 'pf-hide-sm' }, 'Guidance: CAPCOM'), e('span', { className: 'pf-live' }, e('i', null), 'Live'))),
        e('div', { className: 'id-main' }, inner));
    }

    function DossierCard(p, mini) {
      return e('div', { className: 'cu-card' + (mini ? ' mini' : '') + (p.name === primary ? ' primary' : '') },
        e('div', { className: 'cu-card-head' },
          e('div', { className: 'cu-avatar' }, (p.name || '?').charAt(0).toUpperCase()),
          e('div', { className: 'cu-id' },
            e('div', { className: 'cu-name' }, p.name, ', ', p.age),
            e('div', { className: 'cu-tag' }, e(Icon, { name: p.icon, size: 11 }), p.tag)),
          e('div', { className: 'cu-fit' }, p.fit, '%', e('span', null, 'fit'))),
        !mini && e(React.Fragment, null,
          e('p', { className: 'cu-summary' }, p.summary),
          e('div', { className: 'cu-traits' },
            Object.keys(p.traits).map(function (k) {
              return e('div', { key: k, className: 'cu-trait' },
                e('div', { className: 'cu-trait-l' }, e('span', null, k), e('span', null, p.traits[k])),
                e('div', { className: 'cu-trait-bar' }, e('i', { style: { width: p.traits[k] + '%' } })));
            })),
          e('div', { className: 'cu-grid' },
            e('div', { className: 'cu-block' }, e('div', { className: 'cu-block-l' }, 'Demographics'), e('div', { className: 'cu-block-v' }, p.demo)),
            e('div', { className: 'cu-block' }, e('div', { className: 'cu-block-l' }, 'Where to find them'), e('div', { className: 'cu-chips' }, p.channels.map(function (c, i) { return e('span', { key: i, className: 'cu-chip' }, c); }))),
            e('div', { className: 'cu-block' }, e('div', { className: 'cu-block-l' }, 'What they care about'), e('div', { className: 'cu-chips' }, p.cares.map(function (c, i) { return e('span', { key: i, className: 'cu-chip' }, c); }))))));
    }

    /* ── ROSTER ── */
    if (view === 'roster') {
      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: onBack }, '‹ Back to deck'),
        e('div', { className: 'id-eyebrow' }, 'Recon mission · My Customers'),
        e('h1', { className: 'mm-title' }, 'Target profiles'),
        capcom(sketches.length ? 'Your target roster, operator. Build more, or set your primary.' : 'No targets on file yet. Sketch the customer you are really flying for.'),
        sketches.length === 0
          ? e('div', { className: 'cu-empty' }, e(Icon, { name: 'UserPlus', size: 26 }), e('span', null, 'No target profiles yet.'))
          : e('div', { className: 'cu-roster' },
              sketches.map(function (p, i) {
                return e('button', { key: i, className: 'cu-rostercard' + (p.name === primary ? ' primary' : ''), onClick: function () { setCurrent(p); setView('result'); } },
                  p.name === primary && e('span', { className: 'cu-primary-badge' }, 'Primary'),
                  DossierCard(p, true));
              })),
        e('button', { className: 'pf-cta mm-cta', onClick: startSketch }, sketches.length ? 'Sketch another →' : 'Sketch a customer →')
      ));
    }

    /* ── SKETCH WIZARD ── */
    if (view === 'sketch') {
      var node;
      if (step === 0) {
        var picked = suggestions.indexOf(name) >= 0;
        node = e(React.Fragment, null,
          capcom('Every target needs a call-sign. Recruit one I drafted — shuffle for more, or coin your own.'),
          e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), 'Target call-sign',
            e('button', { className: 'cu-shuffle', onClick: function () { setSuggestions(genCallsigns(profile)); } }, e(Icon, { name: 'Shuffle', size: 12 }), ' Shuffle')),
          e('div', { className: 'cu-callsigns' },
            suggestions.map(function (cs) {
              return e('button', { key: cs, className: 'cu-callsign' + (name === cs ? ' sel' : ''), onClick: function () { setName(cs); } },
                e('span', { className: 'cu-cs-badge' }, e(Icon, { name: 'Tag', size: 13 })),
                e('span', { className: 'cu-cs-name' }, cs));
            })),
          e('div', { className: 'cu-coin' },
            e('span', { className: 'cu-coin-l' }, 'Or coin your own'),
            e('div', { className: 'pf-input-wrap' }, e(Icon, { name: 'PenLine', size: 15 }),
              e('input', { className: 'pf-input', value: picked ? '' : name, placeholder: 'e.g. Saturday-market Sam',
                onChange: function (ev) { setName(ev.target.value); }, onKeyDown: function (ev) { if (ev.key === 'Enter' && name.trim()) setStep(1); } }))),
          e('div', { className: 'mm-inferred' }, e(Icon, { name: 'Sparkles', size: 13 }), e('span', { className: 'mm-inferred-l' }, 'Describe them'), e('span', { className: 'mm-inferred-v' }, inferred), e('span', { className: 'mm-inferred-badge' }, 'Inferred')),
          e('button', { className: 'pf-cta mm-cta', onClick: function () { setStep(1); }, disabled: !name.trim() }, 'Continue →'));
      } else {
        node = e(React.Fragment, null,
          capcom('What drives them? Pick their archetype — it shapes the whole dossier.'),
          e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), 'Archetype'),
          e('div', { className: 'cu-archs' },
            ARCHETYPES.map(function (a) {
              return e('button', { key: a.id, className: 'cu-arch' + (arch === a.id ? ' sel' : ''), onClick: function () { setArch(a.id); } },
                e('span', { className: 'cu-arch-ic' }, e(Icon, { name: a.icon, size: 18 })),
                e('span', { className: 'cu-arch-label' }, a.label),
                e('span', { className: 'cu-arch-blurb' }, a.blurb));
            })),
          e('div', { className: 'mm-row' },
            e('button', { className: 'id-back', onClick: function () { setStep(0); } }, '‹ Call-sign'),
            e('button', { className: 'pf-cta mm-cta', onClick: function () { setView('building'); }, disabled: !arch }, 'Build the sketch →')));
      }
      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: function () { setView('roster'); } }, '‹ Roster'),
        e('div', { className: 'id-eyebrow' }, 'Recon mission · My Customers'),
        e('div', { className: 'mm-steps' }, ['Call-sign', 'Archetype'].map(function (s, i) { return e('span', { key: s, className: 'mm-step' + (i === step ? ' on' : '') + (i < step ? ' done' : '') }, (i + 1) + ' ' + s); })),
        e('div', { className: 'mm-panel', key: step }, node)));
    }

    /* ── BUILDING ── */
    if (view === 'building') {
      return shell(e(React.Fragment, null,
        e('div', { className: 'id-eyebrow' }, 'Recon mission · My Customers'),
        e('h1', { className: 'mm-title' }, 'Building the sketch…'),
        capcom('Profiling your target, operator. Reading motivations and channels…'),
        e('div', { className: 'cu-building' }, e('div', { className: 'cu-build-scan' })),
        e('div', { className: 'mm-log' }, BUILD_LOG.slice(0, revealed).map(function (l, i) { return e('div', { key: i, className: i === revealed - 1 ? 'live' : '' }, l); })),
        e('div', { className: 'mm-bar' }, e('i', null))));
    }

    /* ── RESULT (dossier) ── */
    var p = current || sketches[0];
    if (!p) { return shell(e('button', { className: 'id-back', onClick: function () { setView('roster'); } }, '‹ Roster')); }
    var r = p.report;
    function metaTag(l, v) { return e('span', { className: 'mm-rtag' }, e('b', null, l), v); }
    function sec(t) { return e('div', { className: 'mm-sec' }, e('span', { className: 'pf-prompt' }, '>'), t); }
    return shell(e(React.Fragment, null,
      e('button', { className: 'id-back', onClick: function () { setView('roster'); } }, '‹ Roster'),
      e('div', { className: 'mm-acq' }, e('span', { className: 'mm-acq-stamp' }, 'Target Profiled'), e('span', { className: 'mm-acq-xp' }, '+ ', XP, ' XP')),
      e('h1', { className: 'mm-title' }, 'Customer dossier'),
      capcom('Dossier complete — and a full audience report to match. Download it or build another.'),
      DossierCard(p, false),

      r && e(React.Fragment, null,
        e('div', { className: 'mm-rephead', style: { marginTop: 18 } },
          e('div', { className: 'mm-dq', style: { background: 'conic-gradient(var(--clr-primary-hover) ' + (r.dq * 3.6) + 'deg, var(--clr-border) 0)' } },
            e('div', { className: 'mm-dq-in' }, e('span', { className: 'mm-dq-num' }, r.dq + '%'), e('span', { className: 'mm-dq-l' }, 'Data quality'))),
          e('div', { className: 'mm-repmeta' },
            e('div', { className: 'mm-repmeta-title' }, 'Audience report — ' + p.name),
            e('div', { className: 'mm-repmeta-sub' }, r.subtitle),
            e('div', { className: 'mm-rtags' }, metaTag('Report ', r.reportType), metaTag('Sources ', r.sources), metaTag('Depth ', 'Standard'), metaTag('WTP ', r.wtp.band))),
          e('button', { className: 'pf-cta mm-cta mm-dl', onClick: function () { downloadAudience(p, profile); } }, e(Icon, { name: 'Download', size: 15 }), ' Download report')),

        sec('Recommendation'), e('p', { className: 'mm-summary-box' }, r.recommendation),
        sec('Audience profile'), e('p', { className: 'cu-profile' }, r.profile),
        sec('Demographics'),
        e('div', { className: 'cu-demo' }, r.demographics.map(function (g, gi) {
          return e('div', { key: gi, className: 'cu-demo-group' },
            e('div', { className: 'cu-demo-title' }, g.label),
            g.rows.map(function (row, ri) {
              return e('div', { key: ri, className: 'cu-demo-row' },
                e('span', { className: 'cu-demo-l' }, row.label),
                e('div', { className: 'cu-demo-bar' }, e('i', { style: { width: row.pct + '%' } })),
                e('span', { className: 'cu-demo-p' }, row.pct + '%'));
            }));
        })),
        e('div', { className: 'cu-twocol' },
          e('div', null, sec('Psychographics'), e('ul', { className: 'cu-psy' }, r.psychographics.map(function (x, i) { return e('li', { key: i }, x); }))),
          e('div', null, sec('Willingness to pay'), e('div', { className: 'cu-wtp' }, e('div', { className: 'cu-wtp-band' }, r.wtp.band), e('div', { className: 'cu-wtp-note' }, r.wtp.note)))),
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
        }))
      ),

      e('div', { className: 'mm-row', style: { marginTop: 16 } },
        p.name !== primary
          ? e('button', { className: 'id-back', onClick: function () { setPrimary(p.name); if (onComplete) onComplete({ xp: 0, count: sketches.length, sketches: sketches, primary: p.name, lastName: p.name }); } }, '★ Set as primary')
          : e('span', { className: 'cu-isprimary' }, '★ Primary target'),
        e('button', { className: 'pf-cta mm-cta', onClick: startSketch }, 'Sketch another →')),
      e('button', { className: 'id-back', style: { marginTop: 16 }, onClick: onBack }, '‹ Back to Command Deck')
    ));
  }

  window.ClarityCustomersMission = ClarityCustomersMission;
})();
