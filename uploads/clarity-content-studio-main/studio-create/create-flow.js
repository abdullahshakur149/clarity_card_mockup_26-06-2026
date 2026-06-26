/* Unified creation flow — type → platform → format → brief → generate → edit → publish */
var CreateFlow = (function () {
  var CF_STEPS = ['Type', 'Platform', 'Format', 'Brief', 'Generate', 'Edit', 'Publish'];
  var CF_MODS = [
    { id: 'text', icon: '✍', name: 'Text', desc: 'Posts, captions, email' },
    { id: 'image', icon: '🖼', name: 'Image', desc: 'Feed, story, banners' },
    { id: 'video', icon: '🎬', name: 'Video', desc: 'Reels, shorts, ads' },
    { id: 'audio', icon: '🎙', name: 'Audio', desc: 'Podcast, voiceover' }
  ];
  var CF_PLATFORMS = {
    text: [
      { id: 'LinkedIn', icon: 'in', desc: 'Posts, articles' },
      { id: 'Instagram', icon: '📷', desc: 'Captions, stories' },
      { id: 'X', icon: '𝕏', desc: 'Tweets, threads' },
      { id: 'Email', icon: '✉', desc: 'Newsletters' }
    ],
    image: [
      { id: 'Instagram', icon: '📷', desc: 'Feed, Stories' },
      { id: 'LinkedIn', icon: 'in', desc: 'Banners, carousels' },
      { id: 'Facebook', icon: 'f', desc: 'Reels, feed' },
      { id: 'Pinterest', icon: 'P', desc: 'Pins' }
    ],
    video: [
      { id: 'Instagram', icon: '📷', desc: 'Reels' },
      { id: 'Facebook', icon: 'f', desc: 'Reels, feed' },
      { id: 'YouTube', icon: '▶', desc: 'Shorts, long' },
      { id: 'TikTok', icon: '♪', desc: 'Covers' }
    ],
    audio: [
      { id: 'Spotify', icon: '🎧', desc: 'Podcast' },
      { id: 'Apple', icon: '🍎', desc: 'Podcasts' },
      { id: 'YouTube', icon: '▶', desc: 'Video podcast' }
    ]
  };
  var CF_FORMATS = {
    text: {
      LinkedIn: [{ id: 'Post', limit: '1,300 chars' }, { id: 'Article', limit: '125k chars' }],
      Instagram: [{ id: 'Caption', limit: '2,200 chars' }, { id: 'Story text', limit: '220 chars' }],
      X: [{ id: 'Single tweet', limit: '280 chars' }, { id: 'Thread', limit: '280/tweet' }],
      Email: [{ id: 'Newsletter', limit: 'No limit' }]
    },
    image: {
      Instagram: [{ id: 'Portrait 4:5', aspect: '4:5', dims: '1080×1350' }, { id: 'Feed 1:1', aspect: '1:1', dims: '1080×1080' }, { id: 'Story 9:16', aspect: '9:16', dims: '1080×1920' }],
      LinkedIn: [{ id: 'Banner 1.91:1', aspect: '1.91:1', dims: '1200×627' }, { id: 'Square 1:1', aspect: '1:1', dims: '1200×1200' }],
      Facebook: [{ id: 'Reel cover 9:16', aspect: '9:16', dims: '1080×1920' }, { id: 'Feed 1:1', aspect: '1:1', dims: '1080×1080' }],
      Pinterest: [{ id: 'Pin 2:3', aspect: '4:5', dims: '1000×1500' }]
    },
    video: {
      Instagram: [{ id: 'Reel 9:16', aspect: '9:16', dur: '0:30' }, { id: 'Story 9:16', aspect: '9:16', dur: '0:15' }],
      Facebook: [{ id: 'Reel 9:16', aspect: '9:16', dur: '0:30' }, { id: 'Feed 1:1', aspect: '1:1', dur: '0:45' }],
      YouTube: [{ id: 'Short 9:16', aspect: '9:16', dur: '0:60' }, { id: 'Long 16:9', aspect: '16:9', dur: '3:00' }],
      TikTok: [{ id: 'Cover 9:16', aspect: '9:16', dur: '0:30' }]
    },
    audio: {
      Spotify: [{ id: 'Episode', dur: '25–45 min' }, { id: 'Short clip', dur: '3–5 min' }],
      Apple: [{ id: 'Episode', dur: '25–45 min' }],
      YouTube: [{ id: 'Video podcast', dur: '20–60 min' }]
    }
  };
  var CF_SUGGESTED = {
    'text:LinkedIn': 0, 'text:Instagram': 0, 'text:X': 0, 'text:Email': 0,
    'image:Instagram': 0, 'image:LinkedIn': 0, 'image:Facebook': 0, 'image:Pinterest': 0,
    'video:Instagram': 0, 'video:Facebook': 0, 'video:YouTube': 0, 'video:TikTok': 0,
    'audio:Spotify': 0, 'audio:Apple': 0, 'audio:YouTube': 0
  };
  var CF_TEXT_VARS = [
    { label: 'A', pf: 81, text: 'While ghost kitchens rise and fall, artisan baking keeps winning. Patience isn\'t a trend — it\'s the moat. Sourdough Saturday pre-orders are live.', storyboard: 'Contrarian hook → craft moat → CTA', rationale: 'Uses market gap data — ghost kitchen vs artisan CAGR' },
    { label: 'B', pf: 88, text: 'Hot take: the best food businesses aren\'t chasing trends — they\'re outlasting them.\n\n68% of food-tech startups shuttered since 2023. Artisan bakeries grew 14% CAGR.\n\nSourdough Saturday is back. Pre-orders open now. 🍞', storyboard: 'Hot take → stat proof → urgency CTA', rationale: 'Best PF for Maya — data + authenticity tone' },
    { label: 'C', pf: 74, text: 'Every Saturday: flour, water, time. No shortcuts. Just bread worth waiting for. Sourdough Saturday pre-orders are live — link in bio.', storyboard: 'Ritual → simplicity → soft CTA', rationale: 'Process-story angle from consumer research' }
  ];
  var CF_IMAGE_VARS = [
    { label: 'A', pf: 84, theme: 'bakery', headline: 'Sourdough<br>Saturday', storyboard: 'Hero product · warm light · logo lockup', rationale: 'Matches brand kit colors + weekend urgency' },
    { label: 'B', pf: 91, theme: 'sourdough', headline: 'The Art of<br>Slow Growth', storyboard: 'Full-bleed craft · headline center · accent bar', rationale: 'Highest persona fit — process over convenience' },
    { label: 'C', pf: 76, theme: 'ferment', headline: '72-Hour<br>Cold Ferment', storyboard: 'Behind-the-scenes · text overlay · subtle logo', rationale: 'Consumer research: ferment visuals +34% conversion' }
  ];
  var CF_VIDEO_VARS = [
    { label: 'A', pf: 90, title: 'Hook-first cut', dur: '0:28', storyboard: '0:00 bold claim · 0:08 proof · 0:20 CTA', rationale: 'Scroll-stop hook aligned to persona fear/motivator' },
    { label: 'B', pf: 86, title: 'Story-driven cut', dur: '0:34', storyboard: '0:00 problem · 0:12 bake process · 0:28 payoff', rationale: 'Narrative arc from brief + consumer trigger' },
    { label: 'C', pf: 83, title: 'Process montage', dur: '0:41', storyboard: 'Fast B-roll · captions · music sync', rationale: 'Platform-native reel pacing for ' + 'Instagram' }
  ];
  var CF_AUDIO_VARS = [
    { label: 'A', pf: 87, title: 'Interview + data segment', dur: '27:41', storyboard: 'Intro · interview · data · CTA', rationale: 'Balances warmth with research credibility' },
    { label: 'B', pf: 82, title: 'Solo narrative', dur: '22:15', storyboard: 'Host monologue · 3 chapters · outro', rationale: 'Efficient solo format for weekly cadence' },
    { label: 'C', pf: 79, title: 'Customer story focus', dur: '31:08', storyboard: 'Customer intro · story · community close', rationale: 'Community motivator from consumer research' }
  ];
  var CF_PERSONAS = {
    'Maya Holloway': { name: 'Maya Holloway', seg: 'Local foodie · 28–45 · drives for quality', insight: 'Values authenticity over trends. Responds to process stories and limited-batch urgency.' },
    'Alex Rivera': { name: 'Alex Rivera', seg: 'Growth-stage founder · 32–40 · efficiency-focused', insight: 'Responds to data-backed claims and before/after contrasts. Skeptical of hype.' },
    'All segments': { name: 'All segments', seg: 'Broad reach · mixed demographics', insight: 'Balanced tone — lead with universal craft story, avoid niche jargon.' }
  };
  var CF_GEN_STEPS = ['Applying brand kit…', 'Loading persona context…', 'Generating variations…', 'Scoring persona fit…'];

  function cfPfClass(pf) { return pf >= 70 ? 'green' : pf >= 40 ? 'amber' : 'red'; }
  function cfFlow() { return appState.createFlow; }
  function cfSuggestedIndex(modality, platform) {
    return CF_SUGGESTED[modality + ':' + platform] != null ? CF_SUGGESTED[modality + ':' + platform] : 0;
  }
  function cfApplyFormat(f, idx) {
    var formats = CF_FORMATS[f.modality] && CF_FORMATS[f.modality][f.platform];
    if (!formats || !formats[idx]) return;
    var fmt = formats[idx];
    f.format = fmt.id;
    f.aspect = fmt.aspect || '1:1';
    f.dims = fmt.dims || fmt.dur || fmt.limit || '';
    f.suggestedFormat = idx === cfSuggestedIndex(f.modality, f.platform);
  }
  function cfBriefSignalBar(compact) {
    var b = appState.createBrief;
    var klass = compact ? ' cf-brief-signals-compact' : '';
    return '<div class="cf-brief-signals' + klass + '">'
      + '<div class="cf-brief-signal"><span>Core message</span><strong>' + (b.message || 'No message set') + '</strong></div>'
      + '<div class="cf-brief-signal"><span>Proof</span><strong>' + (b.proof || 'No proof point set') + '</strong></div>'
      + '<div class="cf-brief-signal"><span>CTA</span><strong>' + (b.cta || 'No CTA set') + '</strong></div>'
      + '</div>';
  }

  function init(state) {
    state.createFlow = {
      step: 1, modality: null, platform: null, format: null, aspect: '1:1', dims: '',
      generating: false, genPhase: 0, variation: null, editContent: '',
      published: false, publishMode: null, genStartedAt: null
    };
    state.createdItems = [];
    state.cfPrefs = {
      brandKitLock: true, style: 'Warm craft', tones: ['Warm', 'Authentic'],
      colors: ['#6366f1', '#f59e0b', '#34d399', '#0e1320'],
      voice: 'Hearth Bakery', logoPlacement: 'Bottom-right'
    };
    state.cfPrefDrawerOpen = false;
    state.cfScheduleTime = 'Thu 10:00 AM';
    state.cfCampaign = 'Sourdough Saturday Launch';
    state.cfLibraryFilter = 'all';
    state.cfLibrarySelectedId = null;
    if (!state.createBrief.proof) state.createBrief.proof = '72-hour cold ferment, local flour, limited 120-loaf batch.';
    if (!state.createBrief.cta) state.createBrief.cta = 'Pre-order now — closes Friday at 6 PM.';
  }

  function cfPrefBar() {
    var p = appState.cfPrefs;
    return '<div class="cf-pref-bar"><span>&#9881;</span><span>Preferences: <strong>' + p.style + '</strong> · <strong>' + p.tones.join(', ') + '</strong> · Brand kit ' + (p.brandKitLock ? 'locked' : 'off') + '</span>'
      + '<span class="cf-pref-edit" onclick="cfOpenPrefs()">Edit</span></div>';
  }

  function cfRenderPrefDrawer() {
    var open = appState.cfPrefDrawerOpen;
    var p = appState.cfPrefs;
    var styles = ['Warm craft', 'Dark tech', 'Minimal', 'Bold promo', 'Brand Kit'];
    var tones = ['Warm', 'Authentic', 'Professional', 'Bold', 'Playful'];
    return '<div class="pref-drawer-overlay' + (open ? ' open' : '') + '" onclick="cfClosePrefs()"></div>'
      + '<div class="pref-drawer' + (open ? ' open' : '') + '">'
      + '<div class="pref-drawer-header"><span class="pref-drawer-title">Content Preferences</span><span class="modal-close" onclick="cfClosePrefs()">&#x2715;</span></div>'
      + '<div class="pref-drawer-body">'
      + '<p style="font-size:12px;color:var(--muted);line-height:1.5;">Set once — applied to every generation. Reduces friction on each create flow.</p>'
      + '<div class="cf-field"><label>Visual style</label><select onchange="appState.cfPrefs.style=this.value;renderContent()">'
      + styles.map(function (s) { return '<option' + (p.style === s ? ' selected' : '') + '>' + s + '</option>'; }).join('')
      + '</select></div>'
      + '<div class="cf-field"><label>Brand voice</label><select onchange="appState.cfPrefs.voice=this.value;renderContent()">'
      + ['Hearth Bakery', 'Clarity SaaS', 'Custom'].map(function (s) { return '<option' + (p.voice === s ? ' selected' : '') + '>' + s + '</option>'; }).join('')
      + '</select></div>'
      + '<div class="cf-field"><label>Tone</label><div class="tone-chip-row">'
      + tones.map(function (t) {
          return '<span class="tone-chip' + (p.tones.indexOf(t) >= 0 ? ' active' : '') + '" onclick="cfToggleTone(\'' + t + '\')">' + t + '</span>';
        }).join('')
      + '</div></div>'
      + '<div class="cf-field"><label>Brand colors</label><div class="cf-color-row">'
      + p.colors.map(function (c) {
          return '<div class="cf-color-swatch" style="background:' + c + ';"></div>';
        }).join('')
      + '</div></div>'
      + '<div class="cf-field"><label>Brand Kit lock</label><div style="display:flex;align-items:center;gap:10px;margin-top:4px;">'
      + '<div class="toggle-sw' + (p.brandKitLock ? ' on' : '') + '" onclick="appState.cfPrefs.brandKitLock=!appState.cfPrefs.brandKitLock;renderContent()"><div class="toggle-knob"></div></div>'
      + '<span style="font-size:12px;color:var(--muted);">Enforce colors, logo, typography</span></div></div>'
      + '<button class="btn btn-primary" style="margin-top:8px;" onclick="cfClosePrefs()">Save preferences</button>'
      + '</div></div>';
  }

  function cfIntelRail() {
    var intel = appState.intelligence;
    var brief = appState.createBrief;
    var p = appState.cfPrefs;
    return '<div class="cf-intel-rail">'
      + '<div class="cf-intel-rail-head">● Intelligence active</div>'
      + '<div class="cf-intel-block"><div class="label">Persona</div>'
      + '<div class="cf-intel-persona" id="cf-rail-persona">' + intel.persona.name + '</div>'
      + '<div class="cf-intel-text">' + intel.persona.seg + '</div></div>'
      + '<div class="cf-intel-block"><div class="label">Market</div><div class="cf-intel-text">' + intel.market.whiteSpace + '</div></div>'
      + '<div class="cf-intel-block"><div class="label">Consumer</div><div class="cf-intel-text">' + intel.consumer.trigger + '</div></div>'
      + '<div class="cf-intel-block"><div class="label">Brief</div>'
      + '<div class="cf-intel-text"><strong style="color:var(--text);">' + brief.goal + '</strong><br><br>' + brief.message + '</div></div>'
      + '<div class="cf-intel-block"><div class="label">Preferences</div>'
      + '<div class="cf-intel-text">' + p.style + ' · ' + p.tones[0] + '<br>Brand kit ' + (p.brandKitLock ? 'locked ✓' : 'off') + '</div></div>'
      + '<div class="evidence-item"><div class="evidence-tag research">research</div><div class="evidence-text">' + intel.market.gap + '</div></div>'
      + '<div class="evidence-item"><div class="evidence-tag social">consumer</div><div class="evidence-text">' + intel.consumer.research + '</div></div>'
      + '</div>';
  }

  function cfStepper() {
    var step = cfFlow().step;
    var html = '<div class="cf-stepper-wrap"><div class="wizard-steps">';
    CF_STEPS.forEach(function (lbl, i) {
      var n = i + 1;
      var cls = n < step ? 'done' : n === step ? 'active' : 'pending';
      html += '<div class="wizard-step" style="flex-direction:column;align-items:center;">'
        + '<div class="wiz-dot ' + cls + '">' + (n < step ? '✓' : n) + '</div>'
        + '<div class="wiz-label">' + lbl + '</div></div>';
      if (i < CF_STEPS.length - 1) html += '<div class="wiz-line' + (n < step ? ' done' : '') + '"></div>';
    });
    return html + '</div></div>';
  }

  function cfStepBrief() {
    var brief = appState.createBrief;
    var intel = appState.intelligence;
    var f = cfFlow();
    return '<div class="cf-step-title">Brief</div>'
      + '<div class="cf-step-sub">' + intel.brand + ' · lock the strategy your generator will execute</div>'
      + '<div class="cf-pref-bar" style="margin-bottom:14px;">'
      + '<span class="pill pill-muted">' + (f.modality ? cfPrettyModality(f.modality) : 'Type') + '</span>'
      + '<span class="pill pill-muted">' + (f.platform || 'Platform') + '</span>'
      + '<span class="pill pill-muted">' + (f.format || 'Format') + '</span>'
      + '<span style="color:var(--muted);font-size:12px;">This brief will be used for all generated variations.</span>'
      + '</div>'
      + '<div class="cf-intel-confirm">'
      + '<div class="cf-intel-block"><div class="label">Persona ✓</div><div class="cf-intel-persona" id="cf-persona-name">' + intel.persona.name + '</div><div class="cf-intel-text" id="cf-persona-insight">' + intel.persona.insight + '</div></div>'
      + '<div class="cf-intel-block"><div class="label">Market ✓</div><div class="cf-intel-text">' + intel.market.whiteSpace + '</div></div>'
      + '<div class="cf-intel-block"><div class="label">Consumer ✓</div><div class="cf-intel-text">' + intel.consumer.trigger + '</div></div>'
      + '</div>'
      + cfPrefBar()
      + '<div class="cf-step-title" style="font-size:18px;">Write the creative brief</div>'
      + '<div class="cf-brief-form">'
      + '<div class="cf-brief-row">'
      + '<div class="cf-field"><label>Campaign objective</label><input value="' + brief.goal + '" placeholder="What measurable outcome do we want?" oninput="appState.createBrief.goal=this.value"><div class="cf-field-help">Example: Drive weekend pre-orders from existing Instagram followers.</div></div>'
      + '<div class="cf-field"><label>Why this moment</label><input value="' + brief.whyNow + '" placeholder="Why this campaign now?" oninput="appState.createBrief.whyNow=this.value"><div class="cf-field-help">Example: Summer menu launch + Saturday footfall spike.</div></div>'
      + '</div>'
      + '<div class="cf-field"><label>Primary persona</label><select onchange="cfSetPersona(this.value)">'
      + ['Maya Holloway', 'Alex Rivera', 'All segments'].map(function (p) {
          return '<option' + (brief.persona === p ? ' selected' : '') + '>' + p + '</option>';
        }).join('') + '</select><div class="cf-field-help">Who this message should feel written for.</div></div>'
      + '<div class="cf-field"><label>Core message (single clear sentence)</label>'
      + '<textarea placeholder="What is the one idea the audience must remember?" oninput="appState.createBrief.message=this.value">' + brief.message + '</textarea><div class="cf-field-help">Keep it sharp: offer + differentiator + urgency.</div></div>'
      + '<div class="cf-brief-row">'
      + '<div class="cf-field"><label>Proof points</label><input value="' + (brief.proof || '') + '" placeholder="What makes this claim credible?" oninput="appState.createBrief.proof=this.value"><div class="cf-field-help">Ingredients, process, data, social proof.</div></div>'
      + '<div class="cf-field"><label>Call to action</label><input value="' + (brief.cta || '') + '" placeholder="What exactly should people do next?" oninput="appState.createBrief.cta=this.value"><div class="cf-field-help">Example: Pre-order now. Pickup Saturday 8-11 AM.</div></div>'
      + '</div>'
      + '</div>';
  }

  function cfStepModality() {
    var f = cfFlow();
    var intel = appState.intelligence;
    var brief = appState.createBrief;
    return cfPrefBar()
      + '<div class="cf-handoff">'
      + '<div class="cf-handoff-head">'
      + '<div><div class="cf-handoff-eyebrow">R&D and strategy complete</div><div class="cf-handoff-title">Everything is ready — start creating</div></div>'
      + '<span class="pill pill-green">Intelligence Synced ✓</span>'
      + '</div>'
      + '<div class="cf-handoff-grid">'
      + '<div class="cf-handoff-item"><span>Persona locked</span><strong>' + intel.persona.name + '</strong><em>' + intel.persona.seg + '</em></div>'
      + '<div class="cf-handoff-item"><span>Market signal</span><strong>' + intel.market.whiteSpace + '</strong><em>' + intel.market.gap + '</em></div>'
      + '<div class="cf-handoff-item"><span>Consumer trigger</span><strong>' + intel.consumer.trigger + '</strong><em>Brief goal: ' + brief.goal + '</em></div>'
      + '</div>'
      + '<div class="cf-handoff-foot">'
      + '<span class="pill pill-muted">No extra setup needed</span>'
      + '<span class="pill pill-muted">Brand kit + tone auto-applied</span>'
      + '<span class="pill pill-muted">Estimated time: ~30 sec</span>'
      + '</div>'
      + '</div>'
      + '<div class="cf-step-title">Type</div>'
      + '<div class="cf-step-sub">Choose the content studio you want to use</div>'
      + '<div class="cf-mod-grid">'
      + CF_MODS.map(function (m) {
          return '<div class="cf-mod-tile' + (f.modality === m.id ? ' selected' : '') + '" onclick="cfSelectModality(\'' + m.id + '\')">'
            + '<div class="cf-mod-icon">' + m.icon + '</div>'
            + '<div class="cf-mod-name">' + m.name + '</div>'
            + '<div class="cf-mod-desc">' + m.desc + '</div></div>';
        }).join('')
      + '</div>';
  }

  function cfStepPlatform() {
    var f = cfFlow();
    var plats = CF_PLATFORMS[f.modality] || CF_PLATFORMS.text;
    var platHtml = plats.map(function (p) {
      return '<div class="platform-tile' + (f.platform === p.id ? ' active' : '') + '" onclick="cfSelectPlatform(\'' + p.id + '\')">'
        + '<div class="platform-tile-icon">' + p.icon + '</div>'
        + '<div class="platform-tile-name">' + p.id + '</div>'
        + '<div class="platform-tile-desc">' + p.desc + '</div></div>';
    }).join('');
    return cfPrefBar()
      + '<div class="cf-step-title">Platform</div>'
      + '<div class="cf-step-sub">Pick where this content will be published</div>'
      + '<div class="platform-tile-grid">' + platHtml + '</div>'
      + (f.platform ? '<div class="cf-format-meta"><span class="pill pill-indigo">' + f.platform + ' selected</span></div>' : '');
  }

  function cfStepFormat() {
    var f = cfFlow();
    var formats = (CF_FORMATS[f.modality] && f.platform && CF_FORMATS[f.modality][f.platform]) || [];
    var sugIdx = f.platform ? cfSuggestedIndex(f.modality, f.platform) : 0;
    var fmtHtml = formats.length ? '<div class="format-chip-row" style="margin-top:8px;">'
      + formats.map(function (fmt, i) {
          var sug = i === sugIdx;
          return '<span class="format-chip' + (f.format === fmt.id ? ' active' : '') + (sug ? ' cf-suggested' : '') + '" onclick="cfSelectFormat(' + i + ')">'
            + fmt.id + (sug ? ' ✨' : '') + '</span>';
        }).join('')
      + '</div>'
      + (f.format ? '<div class="cf-format-meta">'
        + '<span class="ch-compliance ok">&#10003; ' + f.format + (f.dims ? ' · ' + f.dims : '') + (f.aspect ? ' · ' + f.aspect : '') + '</span>'
        + (f.suggestedFormat ? '<span class="cf-suggest-badge">✨ AI recommended for ' + f.platform + '</span>' : '')
        + '</div>' : '')
      : '<div class="cf-history-empty" style="padding:24px 0;">Select a platform first to see recommended formats.</div>';
    return cfPrefBar()
      + '<div class="cf-step-title">Format</div>'
      + '<div class="cf-step-sub">Auto-sized to platform standards with smart recommendations</div>'
      + (f.platform ? '<div class="pill pill-muted" style="margin-bottom:10px;">' + f.platform + '</div>' : '')
      + fmtHtml;
  }

  function cfStepGenerateProgress() {
    var f = cfFlow();
    var phase = f.genPhase || 0;
    return '<div class="cf-gen-stage">'
      + '<div class="cf-gen-glow"></div>'
      + '<div class="cf-spin"></div>'
      + '<div class="cf-gen-title">Maker is creating…</div>'
      + '<div class="cf-gen-sub">' + appState.createBrief.persona + ' · ' + f.platform + ' · ' + f.format + '</div>'
      + cfBriefSignalBar(true)
      + '<div class="cf-gen-steps">'
      + CF_GEN_STEPS.map(function (s, i) {
          var cls = i < phase ? 'done' : i === phase ? 'active' : '';
          return '<div class="cf-gen-step ' + cls + '"><span class="cf-gen-step-dot"></span>' + s + '</div>';
        }).join('')
      + '</div>'
      + '<div class="cf-gen-timer">~' + Math.max(5, 28 - phase * 7) + 's remaining</div>'
      + '</div>';
  }

  function cfVariationCard(v, i, f) {
    var body = f.modality === 'text' ? '<div class="variation-card-text">' + v.text.replace(/\n/g, '<br>') + '</div>'
      : f.modality === 'image' && window.StudioImage && StudioImage.renderPreview
        ? '<div class="cf-var-thumb">' + StudioImage.renderPreview(v.theme, f.aspect || '1:1', v.headline, false) + '</div>'
        : f.modality === 'video'
          ? '<div class="cf-video-thumb">▶</div><div class="cf-var-meta">' + v.title + ' · ' + v.dur + '</div>'
          : '<div class="cf-var-meta">' + v.title + ' · ' + v.dur + '</div>';
    return '<div class="variation-card cf-var-card' + (f.variation === i ? ' selected' : '') + '" onclick="cfSelectVariation(' + i + ')">'
      + '<div class="flex-between"><span style="font-weight:600;">Variation ' + v.label + '</span>'
      + '<span class="pf-chip ' + cfPfClass(v.pf) + '"><span class="pf-chip-dot"></span>' + v.pf + ' PF' + (v.pf >= 85 ? ' ★' : '') + '</span></div>'
      + body
      + '<div class="cf-storyboard"><div class="cf-storyboard-label">Storyboard</div><div class="cf-storyboard-text">' + v.storyboard + '</div></div>'
      + '<div class="cf-rationale"><span>Why</span> ' + v.rationale + '</div>'
      + '<button class="btn btn-outline btn-sm" style="width:100%;margin-top:8px;" onclick="event.stopPropagation();cfSelectVariation(' + i + ')">' + (f.variation === i ? 'Selected ✓' : 'Select') + '</button></div>';
  }

  function cfStepGenerate() {
    var f = cfFlow();
    if (f.generating) return cfStepGenerateProgress();
    var vars = f.modality === 'image' ? CF_IMAGE_VARS : f.modality === 'video' ? CF_VIDEO_VARS : f.modality === 'audio' ? CF_AUDIO_VARS : CF_TEXT_VARS;
    return cfPrefBar()
      + '<div class="cf-step-title">Pick a variation</div>'
      + '<div class="cf-step-sub">3 options · persona-scored · storyboard + strategic rationale</div>'
      + cfBriefSignalBar(true)
      + '<div class="variation-grid">' + vars.map(function (v, i) { return cfVariationCard(v, i, f); }).join('') + '</div>'
      + '<button class="btn btn-ghost btn-sm" onclick="cfRegenerate()" style="margin-top:8px;">↻ Regenerate variations</button>';
  }

  function cfStepEdit() {
    var f = cfFlow();
    var vars = f.modality === 'image' ? CF_IMAGE_VARS : f.modality === 'video' ? CF_VIDEO_VARS : f.modality === 'audio' ? CF_AUDIO_VARS : CF_TEXT_VARS;
    var v = f.variation !== null ? vars[f.variation] : vars[1];
    var storyStrip = '<div class="cf-edit-storyboard"><strong>Storyboard:</strong> ' + v.storyboard + ' · <span style="color:var(--muted);">' + v.rationale + '</span></div>';

    if (f.modality === 'text') {
      var text = f.editContent || v.text;
      return cfPrefBar() + '<div class="cf-step-title">Edit your copy</div><div class="cf-step-sub">Live preview · persona fit updates as you type</div>' + storyStrip
        + cfBriefSignalBar(true)
        + '<div class="platform-preview cf-edit-preview">'
        + '<div class="platform-preview-header"><div class="platform-preview-avatar">HB</div>'
        + '<div class="platform-preview-meta"><div class="platform-preview-name">Hearth Bakery</div>'
        + '<div class="platform-preview-sub">' + f.platform + ' · ' + f.format + '</div></div></div>'
        + '<div class="platform-preview-body" contenteditable="true" oninput="cfFlow().editContent=this.innerText">' + text.replace(/\n/g, '<br>') + '</div></div>';
    }
    if (f.modality === 'image' && window.StudioImage && StudioImage.renderPreview) {
      return cfPrefBar() + '<div class="cf-step-title">Edit your visual</div><div class="cf-step-sub">Click headline to edit · brand kit applied</div>' + storyStrip
        + cfBriefSignalBar(true)
        + '<div class="cf-edit-canvas">' + StudioImage.renderPreview(v.theme, f.aspect || '1:1', v.headline, true) + '</div>';
    }
    if (f.modality === 'video') {
      return cfPrefBar() + '<div class="cf-step-title">Refine your cut</div><div class="cf-step-sub">' + v.title + ' · ' + v.dur + '</div>' + storyStrip
        + cfBriefSignalBar(true)
        + '<div class="cf-video-player">▶<span>Preview</span></div>'
        + '<div class="cf-field" style="max-width:480px;margin-top:16px;"><label>Refinement notes</label>'
        + '<textarea placeholder="Punchier hook, add captions…" oninput="cfFlow().editContent=this.value">' + (f.editContent || '') + '</textarea></div>';
    }
    return cfPrefBar() + '<div class="cf-step-title">Edit your episode</div><div class="cf-step-sub">' + v.title + ' · ' + v.dur + '</div>' + storyStrip
      + cfBriefSignalBar(true)
      + '<div class="cf-audio-edit"><div style="font-weight:600;margin-bottom:12px;">Ep 14: ' + appState.createBrief.goal + '</div>'
      + '<div class="cf-waveform">' + [40,65,55,80,45,70,50,75,60,85,48,72,55,78,62,88].map(function(h){ return '<span style="height:'+h+'%"></span>'; }).join('') + '</div></div>';
  }

  function cfStepPublish() {
    var f = cfFlow();
    var vars = f.modality === 'image' ? CF_IMAGE_VARS : f.modality === 'video' ? CF_VIDEO_VARS : f.modality === 'audio' ? CF_AUDIO_VARS : CF_TEXT_VARS;
    var v = f.variation !== null ? vars[f.variation] : vars[1];
    var pf = v.pf;
    var connectors = [
      { name: f.platform, status: 'Connected', ok: true },
      { name: 'Campaign hub', status: 'Ready', ok: true }
    ];
    return cfPrefBar()
      + '<div class="cf-step-title">Review & publish</div>'
      + '<div class="cf-step-sub">' + f.platform + ' · ' + f.format + ' · ' + pf + ' PF · Brand-safe ✓</div>'
      + '<div class="cf-publish-layout">'
      + '<div class="cf-publish-preview card">'
      + '<div class="label">Preview</div>'
      + '<p style="font-size:14px;line-height:1.6;margin:12px 0;">' + (f.modality === 'text' ? (f.editContent || v.text).substring(0, 200) : appState.createBrief.message) + '</p>'
      + '<p style="font-size:12px;color:var(--muted);line-height:1.5;margin:0 0 12px;"><strong style="color:var(--text);">CTA:</strong> ' + (appState.createBrief.cta || 'No CTA') + '</p>'
      + '<div class="cf-storyboard" style="margin-top:12px;"><div class="cf-storyboard-label">Storyboard</div><div class="cf-storyboard-text">' + v.storyboard + '</div></div>'
      + '<div class="cf-storyboard" style="margin-top:8px;"><div class="cf-storyboard-label">Proof Point</div><div class="cf-storyboard-text">' + (appState.createBrief.proof || 'No proof point set') + '</div></div>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">'
      + '<span class="pf-chip ' + cfPfClass(pf) + '"><span class="pf-chip-dot"></span>' + pf + ' PF</span>'
      + '<span class="pill pill-green">Brand kit ✓</span>'
      + '<span class="pill pill-indigo">' + f.platform + '</span></div></div>'
      + '<div class="cf-publish-actions">'
      + '<div class="label">Destinations</div>'
      + connectors.map(function (c) {
          return '<div class="cf-connector' + (c.ok ? ' ok' : '') + '"><span>' + c.name + '</span><span>' + c.status + ' ✓</span></div>';
        }).join('')
      + '<div class="cf-field" style="margin-top:12px;"><label>Campaign</label>'
      + '<select onchange="appState.cfCampaign=this.value">'
      + ['Sourdough Saturday Launch', 'Summer 2026', 'Brand awareness'].map(function (c) {
          return '<option' + (appState.cfCampaign === c ? ' selected' : '') + '>' + c + '</option>';
        }).join('') + '</select></div>'
      + '<div class="cf-field"><label>Schedule</label>'
      + '<select onchange="appState.cfScheduleTime=this.value">'
      + ['Thu 10:00 AM', 'Fri 8:00 AM', 'Sat 9:00 AM', 'Custom…'].map(function (t) {
          return '<option' + (appState.cfScheduleTime === t ? ' selected' : '') + '>' + t + '</option>';
        }).join('') + '</select></div>'
      + '<button class="btn btn-primary cf-pub-btn" onclick="cfPublish(\'now\')">🚀 Publish now</button>'
      + '<button class="btn btn-outline cf-pub-btn" onclick="cfPublish(\'schedule\')">📅 Schedule for ' + appState.cfScheduleTime + '</button>'
      + '<button class="btn btn-outline cf-pub-btn" onclick="cfPublish(\'campaign\')">🗂️ Add to campaign</button>'
      + '<button class="btn btn-ghost cf-pub-btn" onclick="cfPublish(\'draft\')">Save as draft</button>'
      + '</div></div>';
  }

  function cfStepSuccess() {
    var f = cfFlow();
    var elapsed = f.genStartedAt ? Math.round((Date.now() - f.genStartedAt) / 1000) : 28;
    var modeLabel = f.publishMode === 'schedule' ? 'Scheduled for ' + appState.cfScheduleTime
      : f.publishMode === 'campaign' ? 'Added to ' + appState.cfCampaign
      : f.publishMode === 'draft' ? 'Saved as draft' : 'Published to ' + f.platform;
    return '<div class="cf-success">'
      + '<div class="cf-success-ring">✓</div>'
      + '<h2>' + (f.publishMode === 'draft' ? 'Draft saved' : f.publishMode === 'schedule' ? 'Scheduled' : f.publishMode === 'campaign' ? 'Added to campaign' : 'Live') + '</h2>'
      + '<p style="color:var(--muted);margin-bottom:8px;">' + modeLabel + '</p>'
      + '<p class="cf-success-stat">Created in ~' + elapsed + 's · ' + f.modality + ' · ' + f.format + '</p>'
      + '<p style="font-size:12px;color:var(--muted);margin-top:8px;">Saved to Library with rationale, brief, and publish state.</p>'
      + '<div style="display:flex;gap:10px;justify-content:center;margin-top:24px;">'
      + '<button class="btn btn-primary" onclick="cfReset()">Create another</button>'
      + '<button class="btn btn-outline" onclick="cfOpenLibrary()">View library</button>'
      + '</div></div>';
  }

  window.cfOpenPrefs = function () { appState.cfPrefDrawerOpen = true; renderContent(); };
  window.cfClosePrefs = function () { appState.cfPrefDrawerOpen = false; renderContent(); };
  window.cfToggleTone = function (t) {
    var tones = appState.cfPrefs.tones;
    var i = tones.indexOf(t);
    if (i >= 0) { if (tones.length > 1) tones.splice(i, 1); }
    else tones.push(t);
    renderContent();
  };
  window.cfSetPersona = function (val) {
    appState.createBrief.persona = val;
    var p = CF_PERSONAS[val] || CF_PERSONAS['Maya Holloway'];
    appState.intelligence.persona = { name: p.name, seg: p.seg, insight: p.insight };
    var nameEl = document.getElementById('cf-persona-name');
    var insightEl = document.getElementById('cf-persona-insight');
    var railEl = document.getElementById('cf-rail-persona');
    if (nameEl) nameEl.textContent = p.name;
    if (insightEl) insightEl.textContent = p.insight;
    if (railEl) railEl.textContent = p.name;
  };
  window.cfSelectModality = function (id) {
    var f = cfFlow();
    f.modality = id;
    f.platform = null;
    f.format = null;
    f.dims = '';
    f.aspect = '1:1';
    renderContent();
  };
  window.cfSelectPlatform = function (id) {
    var f = cfFlow();
    f.platform = id;
    cfApplyFormat(f, cfSuggestedIndex(f.modality, id));
    renderContent();
  };
  window.cfSelectFormat = function (idx) {
    var f = cfFlow();
    cfApplyFormat(f, idx);
    f.suggestedFormat = idx === cfSuggestedIndex(f.modality, f.platform);
    renderContent();
  };
  window.cfSelectVariation = function (i) { cfFlow().variation = i; renderContent(); };
  window.cfRegenerate = function () {
    var f = cfFlow();
    f.variation = null;
    f.generating = true;
    f.genPhase = 0;
    renderContent();
    cfRunGeneration();
  };
  function cfRunGeneration() {
    var f = cfFlow();
    f.genPhase = 0;
    if (!f.genStartedAt) f.genStartedAt = Date.now();
    var tick = setInterval(function () {
      f.genPhase++;
      renderContent();
      if (f.genPhase >= CF_GEN_STEPS.length) {
        clearInterval(tick);
        setTimeout(function () { f.generating = false; renderContent(); }, 350);
      }
    }, 380);
  }
  window.cfContinue = function () {
    var f = cfFlow();
    if (f.step === 1 && !f.modality) return;
    if (f.step === 1) {
      f.step = 2;
      renderContent(); return;
    }
    if (f.step === 2 && !f.platform) return;
    if (f.step === 2) {
      f.step = 3;
      if (!f.format) cfApplyFormat(f, cfSuggestedIndex(f.modality, f.platform));
      renderContent(); return;
    }
    if (f.step === 3 && !f.format) return;
    if (f.step === 3) {
      f.step = 4;
      renderContent(); return;
    }
    if (f.step === 4) {
      f.step = 5; f.generating = true; f.variation = null; f.genPhase = 0;
      if (!f.genStartedAt) f.genStartedAt = Date.now();
      renderContent(); cfRunGeneration(); return;
    }
    if (f.step === 5 && f.variation === null) return;
    if (f.step === 5) { f.step = 6; renderContent(); return; }
    if (f.step === 6) { f.step = 7; renderContent(); return; }
  };
  window.cfBack = function () {
    var f = cfFlow();
    if (f.step <= 1) return;
    if (f.step === 5) f.generating = false;
    f.step--; renderContent();
  };
  window.cfPublish = function (mode) {
    var f = cfFlow();
    var vars = f.modality === 'image' ? CF_IMAGE_VARS : f.modality === 'video' ? CF_VIDEO_VARS : f.modality === 'audio' ? CF_AUDIO_VARS : CF_TEXT_VARS;
    var selectedIdx = f.variation !== null ? f.variation : 1;
    var selected = vars[selectedIdx];
    var pf = selected ? selected.pf : 88;
    appState.createdItems.unshift({
      id: 'c' + Date.now(), modality: f.modality, platform: f.platform, format: f.format,
      title: appState.createBrief.message.substring(0, 60), pf: pf,
      status: mode === 'draft' ? 'Draft' : mode === 'schedule' ? 'Scheduled' : mode === 'campaign' ? 'In Campaign' : 'Published',
      date: mode === 'schedule' ? appState.cfScheduleTime : 'Just now', campaign: appState.cfCampaign,
      publishMode: mode,
      dims: f.dims,
      aspect: f.aspect,
      theme: selected && selected.theme ? selected.theme : '',
      previewText: f.modality === 'text' ? (f.editContent || (selected && selected.text) || appState.createBrief.message) : appState.createBrief.message,
      storyboard: selected && selected.storyboard ? selected.storyboard : '',
      rationale: selected && selected.rationale ? selected.rationale : '',
      proof: appState.createBrief.proof || '',
      cta: appState.createBrief.cta || ''
    });
    f.publishMode = mode; f.step = 8; renderContent();
  };
  window.cfReset = function () {
    appState.createFlow = {
      step: 1, modality: null, platform: null, format: null, aspect: '1:1', dims: '',
      generating: false, genPhase: 0, variation: null, editContent: '',
      published: false, publishMode: null, genStartedAt: null
    };
    nav('create-flow');
  };
  window.cfOpenLibrary = function () { nav('library'); };
  window.cfOpenHistory = function () { nav('library'); };

  function cfStatusClass(status) {
    var map = { Draft: 'pill-muted', Published: 'pill-green', Scheduled: 'pill-indigo', 'In Campaign': 'pill-amber' };
    return map[status] || 'pill-muted';
  }
  function cfPrettyModality(mod) {
    return mod ? mod.charAt(0).toUpperCase() + mod.slice(1) : '';
  }
  function cfGetLibraryItem(id) {
    for (var i = 0; i < appState.createdItems.length; i++) if (appState.createdItems[i].id === id) return appState.createdItems[i];
    return null;
  }
  function cfLibraryCardThumb(item) {
    if (item.modality === 'image' && window.StudioImage && StudioImage.renderPreview) {
      return '<div class="cf-lib-thumb">' + StudioImage.renderPreview(item.theme || 'sourdough', item.aspect || '1:1', ' ', false) + '</div>';
    }
    if (item.modality === 'video') return '<div class="cf-lib-thumb cf-lib-thumb-video">▶ ' + item.format + '</div>';
    if (item.modality === 'audio') return '<div class="cf-lib-thumb cf-lib-thumb-audio">🎙 ' + item.format + '</div>';
    return '<div class="cf-lib-thumb cf-lib-thumb-text">' + (item.previewText || '').substring(0, 92) + '</div>';
  }
  window.cfSetLibraryFilter = function (filter) {
    appState.cfLibraryFilter = filter;
    appState.cfLibrarySelectedId = null;
    renderContent();
  };
  window.cfOpenLibraryItem = function (id) {
    appState.cfLibrarySelectedId = id;
    renderContent();
  };
  window.cfCloseLibraryItem = function () {
    appState.cfLibrarySelectedId = null;
    renderContent();
  };
  window.cfLibraryAction = function (action, id) {
    var item = cfGetLibraryItem(id);
    if (!item) return;
    if (action === 'duplicate') {
      var copy = JSON.parse(JSON.stringify(item));
      copy.id = 'c' + Date.now();
      copy.title = item.title + ' (Copy)';
      copy.status = 'Draft';
      copy.date = 'Just now';
      appState.createdItems.unshift(copy);
      appState.cfLibrarySelectedId = copy.id;
      renderContent();
      return;
    }
    if (action === 'publish') {
      item.status = 'Published';
      item.date = 'Just now';
      renderContent();
      return;
    }
    if (action === 'schedule') {
      item.status = 'Scheduled';
      item.date = appState.cfScheduleTime;
      renderContent();
      return;
    }
    if (action === 'open' || action === 'regenerate') {
      appState.createFlow = {
        step: action === 'regenerate' ? 5 : 6,
        modality: item.modality,
        platform: item.platform,
        format: item.format,
        aspect: item.aspect || '1:1',
        dims: item.dims || '',
        generating: action === 'regenerate',
        genPhase: 0,
        variation: action === 'regenerate' ? null : 1,
        editContent: item.previewText || '',
        published: false,
        publishMode: null,
        genStartedAt: Date.now()
      };
      nav('create-flow');
      if (action === 'regenerate') cfRunGeneration();
    }
  };

  function cfCanContinue() {
    var f = cfFlow();
    if (f.step === 1) return !!f.modality;
    if (f.step === 2) return !!f.platform;
    if (f.step === 3) return !!f.format;
    if (f.step === 5) return f.variation !== null && !f.generating;
    return true;
  }
  function cfContinueLabel() {
    var f = cfFlow();
    if (f.step === 4) return '✦ Generate';
    if (f.step === 5) return 'Continue to edit';
    if (f.step === 6) return 'Continue to publish';
    return 'Continue';
  }

  function screenCreateFlow() {
    var f = cfFlow();
    if (f.step === 8) {
      return '<div class="cf-screen"><div class="cf-topbar"><div class="cf-brand">Clarity <span>Content Studio</span></div></div>'
        + '<div class="cf-main cf-success-wrap">' + cfStepSuccess() + '</div></div>';
    }
    var content = f.step === 1 ? cfStepModality() : f.step === 2 ? cfStepPlatform() : f.step === 3 ? cfStepFormat()
      : f.step === 4 ? cfStepBrief() : f.step === 5 ? cfStepGenerate() : f.step === 6 ? cfStepEdit() : cfStepPublish();
    var footer = f.step < 7 ? '<div class="cf-footer">'
      + '<button class="btn btn-outline"' + (f.step <= 1 ? ' disabled style="opacity:0.35;"' : '') + ' onclick="cfBack()">← Back</button>'
      + '<div class="cf-footer-mid"><span class="cf-eta">⚡ ~30 sec to publish</span></div>'
      + '<button class="btn btn-primary"' + (cfCanContinue() ? '' : ' disabled style="opacity:0.4;"') + ' onclick="cfContinue()">' + cfContinueLabel() + '</button>'
      + '</div>' : '';
    return '<div class="cf-screen">'
      + '<div class="cf-topbar"><div class="cf-brand">Clarity <span>Content Studio</span></div>'
      + '<div class="cf-topbar-right">'
      + '<span class="create-status"><span class="create-status-dot"></span> ' + appState.intelligence.brand + '</span>'
      + '<button class="btn btn-outline btn-sm" onclick="cfOpenPrefs()">&#9881; Preferences</button>'
      + '</div></div>'
      + '<div class="cf-body"><div class="cf-main">' + cfStepper() + content + '</div>' + cfIntelRail() + '</div>'
      + footer + cfRenderPrefDrawer() + '</div>';
  }

  function cfLibraryDetail(item) {
    if (!item) return '';
    return '<div class="cf-lib-overlay" onclick="cfCloseLibraryItem()"></div>'
      + '<div class="cf-lib-drawer">'
      + '<div class="cf-lib-drawer-head"><div><div class="label">Asset details</div><div class="cf-lib-title">' + item.title + '</div></div><span class="modal-close" onclick="cfCloseLibraryItem()">&#x2715;</span></div>'
      + '<div class="cf-lib-drawer-body">'
      + '<div class="cf-lib-meta-row"><span class="pill ' + cfStatusClass(item.status) + '">' + item.status + '</span><span class="pf-chip green"><span class="pf-chip-dot"></span>' + item.pf + ' PF</span><span class="pill pill-muted">' + item.platform + ' · ' + item.format + '</span></div>'
      + cfLibraryCardThumb(item)
      + '<div class="cf-lib-preview"><div class="label">Preview</div><p>' + (item.previewText || item.title || appState.createBrief.message) + '</p></div>'
      + (item.storyboard ? '<div class="cf-storyboard"><div class="cf-storyboard-label">Storyboard</div><div class="cf-storyboard-text">' + item.storyboard + '</div></div>' : '')
      + (item.rationale ? '<div class="cf-rationale" style="margin-top:8px;"><span>Why</span>' + item.rationale + '</div>' : '')
      + (item.proof ? '<div class="cf-lib-kv"><span>Proof point</span><span>' + item.proof + '</span></div>' : '')
      + (item.cta ? '<div class="cf-lib-kv"><span>CTA</span><span>' + item.cta + '</span></div>' : '')
      + '<div class="cf-lib-kv"><span>Channel</span><span>' + item.platform + '</span></div>'
      + '<div class="cf-lib-kv"><span>Type</span><span>' + cfPrettyModality(item.modality) + '</span></div>'
      + '<div class="cf-lib-kv"><span>Campaign</span><span>' + (item.campaign || 'None') + '</span></div>'
      + '<div class="cf-lib-kv"><span>Last update</span><span>' + item.date + '</span></div>'
      + '</div>'
      + '<div class="cf-lib-drawer-actions">'
      + '<button class="btn btn-primary" onclick="cfLibraryAction(\'open\',\'' + item.id + '\')">Open</button>'
      + '<button class="btn btn-outline" onclick="cfLibraryAction(\'duplicate\',\'' + item.id + '\')">Duplicate</button>'
      + '<button class="btn btn-outline" onclick="cfLibraryAction(\'regenerate\',\'' + item.id + '\')">Regenerate</button>'
      + '<button class="btn btn-outline" onclick="cfLibraryAction(\'publish\',\'' + item.id + '\')">Publish</button>'
      + '<button class="btn btn-outline" onclick="cfLibraryAction(\'schedule\',\'' + item.id + '\')">Schedule</button>'
      + '</div></div>';
  }

  function screenLibrary() {
    var items = appState.createdItems;
    var filter = appState.cfLibraryFilter || 'all';
    var filtered = items.filter(function (it) { return filter === 'all' || it.modality === filter; });
    var cards = filtered.map(function (it) {
      return '<div class="cf-history-card" onclick="cfOpenLibraryItem(\'' + it.id + '\')"><div class="cf-feed-tag">' + cfPrettyModality(it.modality) + ' · ' + it.platform + '</div>'
        + cfLibraryCardThumb(it)
        + '<div style="font-size:14px;font-weight:600;margin:8px 0;line-height:1.4;">' + it.title + '</div>'
        + '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px;">'
        + '<span class="pill ' + cfStatusClass(it.status) + '">' + it.status + '</span>'
        + '<span class="pf-chip green"><span class="pf-chip-dot"></span>' + it.pf + ' PF</span>'
        + '<span class="pill pill-muted">' + it.date + '</span>'
        + '</div></div>';
    }).join('');
    var detail = appState.cfLibrarySelectedId ? cfLibraryDetail(cfGetLibraryItem(appState.cfLibrarySelectedId)) : '';
    return '<div class="screen"><div class="flex-between" style="margin-bottom:18px;">'
      + '<div><h1 class="screen-title">Library</h1><p class="screen-sub">All generated assets, reusable any time</p></div>'
      + '<button class="btn btn-primary" onclick="cfReset()">+ Create new</button></div>'
      + '<div class="cf-lib-filters">'
      + ['all', 'text', 'image', 'video', 'audio'].map(function (mod) {
          return '<span class="format-chip' + (filter === mod ? ' active' : '') + '" onclick="cfSetLibraryFilter(\'' + mod + '\')">' + (mod === 'all' ? 'All' : cfPrettyModality(mod)) + '</span>';
        }).join('')
      + '</div>'
      + (items.length ? (filtered.length ? '<div class="cf-history-grid">' + cards + '</div>' : '<div class="cf-history-empty">No assets match this filter.</div>')
        : '<div class="cf-history-empty">No assets yet.<br><br><button class="btn btn-primary" onclick="cfReset()">Start creating →</button></div>')
      + detail + '</div>';
  }

  return { init: init, screenCreateFlow: screenCreateFlow, screenHistory: screenLibrary, screenLibrary: screenLibrary };
})();

window.screenCreateFlow = function () { return CreateFlow.screenCreateFlow(); };
window.screenHistory = function () { return CreateFlow.screenHistory(); };
window.screenLibrary = function () { return CreateFlow.screenLibrary(); };
