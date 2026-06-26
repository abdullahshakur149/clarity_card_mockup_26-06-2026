/* Campaign flow (SMB Launchpad style) */
var CampaignFlow = (function () {
  var CP_STEPS = ['Goal & Timing', 'Platforms', 'Asset Mix', 'Brief', 'Generate', 'Edit', 'Publish'];
  var CP_OBJECTIVES = ['Awareness', 'Launch', 'Re-engagement', 'Promotion', 'Community'];
  var CP_PLATFORMS = [
    { id: 'LinkedIn', icon: 'in', desc: 'B2B reach' },
    { id: 'Instagram', icon: '📷', desc: 'Visual + stories' },
    { id: 'Facebook', icon: 'f', desc: 'Broad local audience' },
    { id: 'Email', icon: '✉', desc: 'Owned audience' },
    { id: 'X', icon: '𝕏', desc: 'Real-time updates' },
    { id: 'YouTube', icon: '▶', desc: 'Long + short video' }
  ];
  var CP_BUNDLE_RULES = {
    LinkedIn: [{ key: 'li-post', label: 'LinkedIn posts', count: 3 }],
    Instagram: [{ key: 'ig-image', label: 'Instagram hero images', count: 1 }, { key: 'ig-story', label: 'Instagram stories', count: 2 }],
    Facebook: [{ key: 'fb-post', label: 'Facebook posts', count: 2 }],
    Email: [{ key: 'email', label: 'Emails', count: 2 }],
    X: [{ key: 'x-post', label: 'X posts', count: 4 }],
    YouTube: [{ key: 'yt-video', label: 'YouTube videos', count: 1 }]
  };

  function cpSeedSampleAssets(platforms, startDate, message, allApproved, limits) {
    var assets = [];
    var seqMap = {};
    var day = 0;
    limits = limits || {};
    platforms.forEach(function (platform) {
      var defs = CP_BUNDLE_RULES[platform] || [{ key: 'generic', label: platform + ' assets', count: 2 }];
      defs.forEach(function (d) {
        var max = limits[platform + ':' + d.key];
        var count = typeof max === 'number' ? max : d.count;
        for (var i = 1; i <= count; i++) {
          var sk = platform + '|' + d.label;
          seqMap[sk] = (seqMap[sk] || 0) + 1;
          var approved = allApproved !== false ? true : assets.length % 3 !== 0;
          assets.push({
            id: 'sample-' + platform + '-' + d.key + '-' + i,
            platform: platform,
            label: d.label,
            seq: seqMap[sk],
            title: message.substring(0, 72),
            content: message,
            status: approved ? 'Ready' : 'Needs edit',
            approved: approved,
            scheduledDate: approved ? cpAddDays(startDate, day++) : null
          });
        }
      });
    });
    return assets;
  }

  var CP_SAMPLE_CAMPAIGNS = [
    {
      id: 'sample-summer-launch',
      name: 'Summer Launch Sprint',
      goal: 'Launch',
      startDate: '2026-07-01',
      endDate: '2026-07-14',
      status: 'Scheduled',
      isSample: true,
      platforms: ['LinkedIn', 'Instagram', 'Email', 'X'],
      brief: {
        shared: {
          objective: 'Drive pre-orders for the summer sourdough line',
          persona: 'Maya Holloway — local food enthusiast, 28–45',
          message: 'Our summer sourdough drop is here — 72-hour cold ferment, local flour, limited 120-loaf batch.',
          proof: '4.9★ from 200+ local reviews · sold out in 4 hours last drop',
          cta: 'Pre-order now — closes Friday at 6 PM'
        }
      },
      assets: cpSeedSampleAssets(
        ['LinkedIn', 'Instagram', 'Email', 'X'],
        '2026-07-01',
        'Our summer sourdough drop is here — 72-hour cold ferment, local flour, limited 120-loaf batch.',
        true
      )
    },
    {
      id: 'sample-weekend-reengage',
      name: 'Weekend Re-engagement Push',
      goal: 'Re-engagement',
      startDate: '2026-07-20',
      endDate: '2026-07-31',
      status: 'Draft',
      isSample: true,
      platforms: ['Facebook', 'Instagram', 'Email', 'X'],
      brief: {
        shared: {
          objective: 'Win back lapsed weekend shoppers with a limited offer',
          persona: 'Weekend regulars who have not ordered in 30+ days',
          message: 'We miss you at the counter — come back this weekend for 15% off your favorite loaf.',
          proof: 'Last month 340 customers returned with this offer',
          cta: 'Show this post at checkout · valid Sat–Sun only'
        }
      },
      assets: cpSeedSampleAssets(
        ['Facebook', 'Instagram', 'Email', 'X'],
        '2026-07-20',
        'We miss you at the counter — come back this weekend for 15% off your favorite loaf.',
        false,
        { 'X:x-post': 1 }
      )
    },
    {
      id: 'sample-bakery-stories',
      name: 'Bakery Community Stories',
      goal: 'Community',
      startDate: '2026-08-03',
      endDate: '2026-08-18',
      status: 'Live',
      isSample: true,
      platforms: ['Instagram', 'Facebook', 'YouTube', 'LinkedIn', 'X'],
      brief: {
        shared: {
          objective: 'Highlight local suppliers and behind-the-scenes craft',
          persona: 'Neighborhood followers who value local sourcing',
          message: 'Meet the farmers behind our flour — a short series on the people who make every loaf possible.',
          proof: '3-part story arc · 12k combined views on pilot episode',
          cta: 'Follow for episode 2 dropping Thursday'
        }
      },
      assets: cpSeedSampleAssets(
        ['Instagram', 'Facebook', 'YouTube', 'LinkedIn', 'X'],
        '2026-08-03',
        'Meet the farmers behind our flour — a short series on the people who make every loaf possible.',
        true,
        { 'X:x-post': 1 }
      )
    }
  ];
  CP_SAMPLE_CAMPAIGNS.forEach(function (c) { c.totalAssets = c.assets.length; });

  var CP_SAMPLE_INTELLIGENCE = {
    brand: 'Hearth Bakery',
    persona: {
      name: 'Maya Holloway',
      seg: 'Local foodie · 28–45 · drives for quality',
      insight: 'Values authenticity over trends. Responds to process stories and limited-batch urgency.'
    },
    market: {
      whiteSpace: 'Artisan craft vs ghost-kitchen convenience — competitors sell speed, Hearth sells patience.',
      gap: '68% of food-tech startups shuttered since 2023; artisan bakeries grew 14% CAGR.',
      trend: 'Slow food · local sourcing · behind-the-scenes content'
    },
    consumer: {
      trigger: 'Fear of missing the batch. Motivator: feeling part of a community, not a transaction.',
      research: 'Pre-order conversion lifts 34% when ferment process is shown. Peak engagement Sat 8–11am.'
    }
  };

  function cpHasIntelligence() {
    var intel = appState.intelligence;
    if (!intel) return false;
    if (!intel.persona || !intel.persona.name) return false;
    if (!intel.market || !intel.market.whiteSpace) return false;
    if (!intel.consumer || !intel.consumer.trigger) return false;
    return true;
  }
  function cpSampleIntelligence() {
    return JSON.parse(JSON.stringify(CP_SAMPLE_INTELLIGENCE));
  }
  function cpBriefFromIntelligence(state) {
    var intel = state.intelligence || {};
    var baseBrief = state.createBrief || {};
    var persona = intel.persona || {};
    var personaLabel = persona.name
      ? persona.name + (persona.seg ? ' — ' + persona.seg : '')
      : (baseBrief.persona || 'Maya Holloway');
    return {
      objective: baseBrief.goal || 'Drive weekend pre-orders',
      persona: personaLabel,
      message: baseBrief.message || '',
      proof: baseBrief.proof || (intel.market && intel.market.gap) || '72-hour cold ferment, local flour, limited 120-loaf batch.',
      cta: baseBrief.cta || 'Pre-order now — closes Friday at 6 PM.'
    };
  }
  function cpHandoffBlock(intel, brief, objective) {
    return '<div class="cf-handoff">'
      + '<div class="cf-handoff-head">'
      + '<div><div class="cf-handoff-eyebrow">R&D and strategy complete</div><div class="cf-handoff-title">Everything is ready — plan this campaign</div></div>'
      + '<span class="pill pill-green">Intelligence Synced ✓</span>'
      + '</div>'
      + '<div class="cf-handoff-grid">'
      + '<div class="cf-handoff-item"><span>Persona locked</span><strong>' + intel.persona.name + '</strong><em>' + intel.persona.seg + '</em></div>'
      + '<div class="cf-handoff-item"><span>Market signal</span><strong>' + intel.market.whiteSpace + '</strong><em>' + intel.market.gap + '</em></div>'
      + '<div class="cf-handoff-item"><span>Consumer trigger</span><strong>' + intel.consumer.trigger + '</strong><em>Campaign goal: ' + (objective || brief.goal || 'Not set') + '</em></div>'
      + '</div>'
      + '<div class="cf-handoff-foot">'
      + '<span class="pill pill-muted">Strategy synced to campaign</span>'
      + '<span class="pill pill-muted">Persona applied across channels</span>'
      + '<span class="pill pill-muted">Brief pre-seeded from research</span>'
      + '</div>'
      + '</div>';
  }
  function cpIntelGateBlock() {
    return '<div class="cp-step-title">Campaign setup</div>'
      + '<div class="cp-step-sub">Intelligence context is required before campaign planning can begin.</div>'
      + '<div class="card cp-intel-gate">'
      + '<div class="cp-intel-gate-title">Research is required before content generation</div>'
      + '<p class="cp-intel-gate-copy">Please complete Intelligence setup first so the content engine can generate output for the right audience and business goal.</p>'
      + '<div class="cp-intel-gate-actions">'
      + '<button class="btn btn-primary" onclick="campaignStartIntelligenceSetup()">Start Intelligence Setup</button>'
      + '<button class="btn btn-outline" onclick="campaignUseSampleIntelligence()">Use Sample Intelligence for Demo</button>'
      + '</div></div>';
  }
  function cpApplyBriefFromIntelligence() {
    cpFlow().brief.shared = cpBriefFromIntelligence(appState);
  }

  function cpFlow() { return appState.campaignFlow; }
  function cpTodayStr() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function cpAddDays(dateStr, days) {
    var d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) d = new Date(cpTodayStr() + 'T00:00:00');
    d.setDate(d.getDate() + days);
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function cpFmtDate(dateStr) {
    if (!dateStr) return 'No date';
    var d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    var mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
    return mon + ' ' + d.getDate();
  }
  function cpFreshFlow(state) {
    return {
      step: 1,
      name: 'Summer Launch Sprint',
      objective: 'Launch',
      startDate: '2026-07-01',
      endDate: '2026-07-14',
      platforms: [],
      assetMix: [],
      mixInitialized: false,
      brief: {
        shared: cpBriefFromIntelligence(state),
        overrides: {}
      },
      batchGenerating: false,
      batchDone: 0,
      batchTotal: 0,
      generatedAssets: [],
      editingAssetId: null,
      editDraft: null
    };
  }
  function init(state) {
    if (!state.campaigns) state.campaigns = [];
    state.campaignUI = { mode: 'home', selectedId: null };
    state.campaignFlow = cpFreshFlow(state);
  }

  function cpDefaultMixCards(platform) {
    var defs = CP_BUNDLE_RULES[platform] || [{ key: 'generic', label: platform + ' assets', count: 2 }];
    return defs.map(function (d) {
      return {
        id: platform + '-' + d.key,
        platform: platform,
        label: d.label,
        count: d.count
      };
    });
  }

  function cpEnsureDefaultMix() {
    var f = cpFlow();
    if (!f.platforms.length) {
      f.assetMix = [];
      return;
    }
    if (!f.mixInitialized) {
      var seeded = [];
      f.platforms.forEach(function (p) { seeded = seeded.concat(cpDefaultMixCards(p)); });
      f.assetMix = seeded;
      f.mixInitialized = true;
    }
  }

  function cpStepper() {
    var step = cpFlow().step;
    var html = '<div class="cf-stepper-wrap"><div class="wizard-steps">';
    CP_STEPS.forEach(function (label, i) {
      var n = i + 1;
      var cls = n < step ? 'done' : n === step ? 'active' : 'pending';
      html += '<div class="wizard-step" style="flex-direction:column;align-items:center;">'
        + '<div class="wiz-dot ' + cls + '">' + (n < step ? '✓' : n) + '</div>'
        + '<div class="wiz-label">' + label + '</div></div>';
      if (i < CP_STEPS.length - 1) html += '<div class="wiz-line' + (n < step ? ' done' : '') + '"></div>';
    });
    return html + '</div></div>';
  }

  function cpStepGoalTiming() {
    if (!cpHasIntelligence()) return cpIntelGateBlock();
    var f = cpFlow();
    var intel = appState.intelligence;
    var brief = appState.createBrief || {};
    return cpHandoffBlock(intel, brief, f.objective)
      + '<div class="cp-step-title">Campaign setup</div>'
      + '<div class="cp-step-sub">Define goal and timing for this campaign.</div>'
      + '<div class="cp-form">'
      + '<div class="cp-field"><label>Campaign name</label><input value="' + f.name + '" oninput="campaignSetField(\'name\',this.value)"></div>'
      + '<div class="cp-field"><label>Objective</label><select onchange="campaignSetField(\'objective\',this.value)">'
      + CP_OBJECTIVES.map(function (o) { return '<option' + (f.objective === o ? ' selected' : '') + '>' + o + '</option>'; }).join('')
      + '</select></div>'
      + '<div class="cp-row">'
      + '<div class="cp-field"><label>Start date</label><input type="date" value="' + f.startDate + '" onchange="campaignSetField(\'startDate\',this.value)"></div>'
      + '<div class="cp-field"><label>End date</label><input type="date" value="' + f.endDate + '" onchange="campaignSetField(\'endDate\',this.value)"></div>'
      + '</div></div>';
  }

  function cpStepPlatforms() {
    var f = cpFlow();
    return '<div class="cp-step-title">Platforms</div>'
      + '<div class="cp-step-sub">Pick one or more channels for this campaign.</div>'
      + '<div class="platform-tile-grid">'
      + CP_PLATFORMS.map(function (p) {
          var active = f.platforms.indexOf(p.id) >= 0;
          return '<div class="platform-tile' + (active ? ' active' : '') + '" onclick="campaignTogglePlatform(\'' + p.id + '\')">'
            + '<div class="platform-tile-icon">' + p.icon + '</div>'
            + '<div class="platform-tile-name">' + p.id + '</div>'
            + '<div class="platform-tile-desc">' + p.desc + '</div>'
            + '</div>';
        }).join('')
      + '</div>'
      + (f.platforms.length ? '<div class="cp-pill-row">' + f.platforms.map(function (p) { return '<span class="pill pill-indigo">' + p + '</span>'; }).join('') + '</div>' : '');
  }

  function cpStepAssetMix() {
    var f = cpFlow();
    cpEnsureDefaultMix();
    return '<div class="cp-step-title">Asset mix</div>'
      + '<div class="cp-step-sub">Suggested bundle based on selected platforms. You can adjust counts.</div>'
      + (f.assetMix.length ? '<div class="cp-mix-grid">'
        + f.assetMix.map(function (item, idx) {
            return '<div class="cp-mix-card">'
              + '<div class="flex-between"><span class="cp-mix-platform">' + item.platform + '</span>'
              + '<button class="cp-remove" onclick="campaignRemoveMix(' + idx + ')">×</button></div>'
              + '<div class="cp-mix-label">' + item.label + '</div>'
              + '<div class="cp-stepper">'
              + '<button onclick="campaignChangeMix(' + idx + ', -1)">−</button>'
              + '<span>' + item.count + '</span>'
              + '<button onclick="campaignChangeMix(' + idx + ', 1)">+</button>'
              + '</div>'
              + '</div>';
          }).join('')
        + '</div>'
        : '<div class="cf-history-empty" style="padding:28px 0;">Select at least one platform first.</div>');
  }

  function cpPlaceholderStep(title, text) {
    return '<div class="cp-step-title">' + title + '</div><div class="cp-step-sub">' + text + '</div>'
      + '<div class="card"><p style="font-size:13px;color:var(--muted);line-height:1.6;">This step is intentionally left for the next implementation pass.</p></div>';
  }

  window.campaignSetField = function (key, val) { cpFlow()[key] = val; renderContent(); };
  window.campaignTogglePlatform = function (id) {
    var f = cpFlow();
    var had = f.platforms.indexOf(id) >= 0;
    var idx = f.platforms.indexOf(id);
    if (idx >= 0) f.platforms.splice(idx, 1);
    else f.platforms.push(id);

    // Preserve user edits/removals for unchanged platforms.
    // Only the changed platform gets recalculated.
    if (had) {
      f.assetMix = f.assetMix.filter(function (item) { return item.platform !== id; });
      delete f.brief.overrides[id];
    } else {
      f.assetMix = f.assetMix.concat(cpDefaultMixCards(id));
      f.mixInitialized = true;
      if (!f.brief.overrides[id]) {
        f.brief.overrides[id] = { expanded: false, fields: {} };
      }
    }
    if (!f.platforms.length) f.mixInitialized = false;
    renderContent();
  };
  window.campaignChangeMix = function (idx, delta) {
    var f = cpFlow();
    if (!f.assetMix[idx]) return;
    f.assetMix[idx].count = Math.max(1, f.assetMix[idx].count + delta);
    renderContent();
  };
  window.campaignRemoveMix = function (idx) {
    var f = cpFlow();
    f.assetMix.splice(idx, 1);
    renderContent();
  };

  function cpEnsureOverride(platform) {
    var f = cpFlow();
    if (!f.brief.overrides[platform]) f.brief.overrides[platform] = { expanded: false, fields: {} };
    return f.brief.overrides[platform];
  }
  window.campaignSetBriefShared = function (field, value) {
    var f = cpFlow();
    f.brief.shared[field] = value;
    renderContent();
  };
  window.campaignToggleBriefOverride = function (platform) {
    var o = cpEnsureOverride(platform);
    o.expanded = !o.expanded;
    renderContent();
  };
  window.campaignSetBriefOverride = function (platform, field, value) {
    var o = cpEnsureOverride(platform);
    o.fields[field] = value;
    renderContent();
  };
  function cpResolveBriefForPlatform(platform) {
    var f = cpFlow();
    var shared = f.brief.shared;
    var override = (f.brief.overrides[platform] && f.brief.overrides[platform].fields) || {};
    return {
      objective: override.objective || shared.objective,
      persona: override.persona || shared.persona,
      message: override.message || shared.message,
      proof: override.proof || shared.proof,
      cta: override.cta || shared.cta
    };
  }
  window.campaignGetBriefForPlatform = function (platform) {
    return cpResolveBriefForPlatform(platform);
  };
  function cpExpandAssetPlan() {
    var f = cpFlow();
    var list = [];
    f.assetMix.forEach(function (item) {
      for (var i = 0; i < item.count; i++) {
        list.push({
          id: item.id + '-' + (i + 1),
          platform: item.platform,
          label: item.label,
          index: i + 1,
          count: item.count,
          brief: window.campaignGetBriefForPlatform(item.platform)
        });
      }
    });
    return list;
  }
  function cpBuildGeneratedAsset(planItem) {
    var brief = planItem.brief || {};
    return {
      id: 'ga-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
      platform: planItem.platform,
      label: planItem.label,
      title: (brief.message || 'Campaign asset').substring(0, 72),
      content: brief.message || '',
      status: 'Ready',
      approved: false,
      brief: brief,
      seq: planItem.index,
      totalForType: planItem.count
    };
  }
  function cpStatusPill(status) {
    if (status === 'Ready') return 'pill-green';
    if (status === 'Needs edit') return 'pill-amber';
    return 'pill-red';
  }
  function cpGetGeneratedAsset(id) {
    var list = cpFlow().generatedAssets;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function cpStartBatchGenerate() {
    var f = cpFlow();
    var plan = cpExpandAssetPlan();
    f.generatedAssets = [];
    f.batchTotal = plan.length;
    f.batchDone = 0;
    f.batchGenerating = true;
    f.editingAssetId = null;
    f.editDraft = null;
    if (!plan.length) { f.batchGenerating = false; return; }
    var idx = 0;
    var timer = setInterval(function () {
      if (idx >= plan.length) {
        clearInterval(timer);
        f.batchGenerating = false;
        renderContent();
        return;
      }
      f.generatedAssets.push(cpBuildGeneratedAsset(plan[idx]));
      f.batchDone = idx + 1;
      idx++;
      renderContent();
    }, 260);
  }

  function cpSharedBriefFields(data) {
    return '<div class="cp-field"><label>Objective</label><input value="' + (data.objective || '') + '" oninput="campaignSetBriefShared(\'objective\',this.value)"></div>'
      + '<div class="cp-field"><label>Persona</label><input value="' + (data.persona || '') + '" oninput="campaignSetBriefShared(\'persona\',this.value)"></div>'
      + '<div class="cp-field"><label>Message</label><textarea oninput="campaignSetBriefShared(\'message\',this.value)">' + (data.message || '') + '</textarea></div>'
      + '<div class="cp-row">'
      + '<div class="cp-field"><label>Proof</label><input value="' + (data.proof || '') + '" oninput="campaignSetBriefShared(\'proof\',this.value)"></div>'
      + '<div class="cp-field"><label>CTA</label><input value="' + (data.cta || '') + '" oninput="campaignSetBriefShared(\'cta\',this.value)"></div>'
      + '</div>';
  }

  function cpOverrideBriefFields(platform, data) {
    return '<div class="cp-field"><label>Objective</label><input value="' + (data.objective || '') + '" oninput="campaignSetBriefOverride(\'' + platform + '\',\'objective\',this.value)"></div>'
      + '<div class="cp-field"><label>Persona</label><input value="' + (data.persona || '') + '" oninput="campaignSetBriefOverride(\'' + platform + '\',\'persona\',this.value)"></div>'
      + '<div class="cp-field"><label>Message</label><textarea oninput="campaignSetBriefOverride(\'' + platform + '\',\'message\',this.value)">' + (data.message || '') + '</textarea></div>'
      + '<div class="cp-row">'
      + '<div class="cp-field"><label>Proof</label><input value="' + (data.proof || '') + '" oninput="campaignSetBriefOverride(\'' + platform + '\',\'proof\',this.value)"></div>'
      + '<div class="cp-field"><label>CTA</label><input value="' + (data.cta || '') + '" oninput="campaignSetBriefOverride(\'' + platform + '\',\'cta\',this.value)"></div>'
      + '</div>';
  }

  function cpStepBrief() {
    var f = cpFlow();
    var shared = f.brief.shared;
    var platforms = f.platforms;
    return '<div class="cp-step-title">Brief</div>'
      + '<div class="cp-step-sub">Set one shared default brief for the campaign, then optionally tweak per platform.</div>'
      + '<div class="card cp-brief-card">'
      + '<div class="label">Shared campaign brief</div>'
      + '<div class="cp-form">'
      + cpSharedBriefFields(shared)
      + '</div>'
      + '</div>'
      + (platforms.length
        ? '<div class="cp-override-list">' + platforms.map(function (p) {
            var o = cpEnsureOverride(p);
            var resolved = cpResolveBriefForPlatform(p);
            var fields = o.fields || {};
            var hasEdits = Object.keys(fields).length > 0;
            return '<div class="card cp-override-card">'
              + '<div class="flex-between">'
              + '<div><div class="label">Optional override</div><div class="cp-override-title">Tweak for ' + p + '</div></div>'
              + '<div style="display:flex;align-items:center;gap:8px;">'
              + (hasEdits ? '<span class="pill pill-green">Edited</span>' : '<span class="pill pill-muted">Using shared</span>')
              + '<button class="btn btn-outline btn-sm" onclick="campaignToggleBriefOverride(\'' + p + '\')">' + (o.expanded ? 'Collapse' : 'Expand') + '</button>'
              + '</div></div>'
              + (o.expanded
                ? '<div class="cp-form cp-override-fields">'
                  + cpOverrideBriefFields(p, resolved)
                  + '</div>'
                : '')
              + '</div>';
          }).join('') + '</div>'
        : '');
  }

  function cpStepGenerate() {
    var f = cpFlow();
    var total = f.batchTotal || cpExpandAssetPlan().length;
    var done = f.batchDone || 0;
    var progressText = 'Generating ' + done + ' of ' + total + ' assets...';
    var preview = f.generatedAssets.slice(0, 6);
    if (f.batchGenerating) {
      return '<div class="cp-step-title">Generate</div>'
        + '<div class="cp-step-sub">Batch generation using campaign brief defaults and per-platform overrides.</div>'
        + '<div class="cf-gen-stage">'
        + '<div class="cf-gen-glow"></div>'
        + '<div class="cf-spin"></div>'
        + '<div class="cf-gen-title">Building campaign assets</div>'
        + '<div class="cf-gen-sub">' + progressText + '</div>'
        + '<div class="cp-batch-progress"><div class="cp-batch-progress-fill" style="width:' + (total ? Math.round((done / total) * 100) : 0) + '%;"></div></div>'
        + '<div class="cp-batch-meta">' + (total ? Math.round((done / total) * 100) : 0) + '% complete</div>'
        + '</div>';
    }
    return '<div class="cp-step-title">Generate</div>'
      + '<div class="cp-step-sub">Batch generation complete. Assets are ready for review.</div>'
      + '<div class="card">'
      + '<div class="flex-between"><div><div class="label">Generation summary</div><div style="font-size:18px;font-weight:600;">' + done + ' / ' + total + ' assets generated</div></div>'
      + '<button class="btn btn-outline btn-sm" onclick="cpRegenerateBatch()">↻ Regenerate batch</button></div>'
      + cpGeneratedOverviewGrid(preview, false)
      + '</div>';
  }

  window.cpRegenerateBatch = function () {
    cpStartBatchGenerate();
    renderContent();
  };
  function cpGeneratedOverviewGrid(list, interactive) {
    var cards = list.map(function (a) {
      var approveBtn = interactive
        ? (a.approved
          ? '<button class="btn btn-outline btn-sm" onclick="campaignUnapproveAsset(\'' + a.id + '\',event)">Unapprove</button>'
          : '<button class="btn btn-primary btn-sm" onclick="campaignApproveAsset(\'' + a.id + '\',event)"' + (a.status !== 'Ready' ? ' disabled style="opacity:0.5;"' : '') + '>Approve</button>')
        : '';
      return '<div class="cp-generated-card' + (interactive ? ' interactive' : '') + '"' + (interactive ? ' onclick="campaignOpenAssetEditor(\'' + a.id + '\')"' : '') + '>'
        + '<div class="cp-generated-top"><span class="pill pill-indigo">' + a.platform + '</span><span class="pill ' + cpStatusPill(a.status) + '">' + a.status + '</span></div>'
        + '<div class="cp-generated-title">' + a.label + ' #' + a.seq + '</div>'
        + '<div class="cp-generated-msg">' + (a.content || a.brief.message || '').substring(0, 110) + '</div>'
        + '<div class="cp-generated-foot" style="display:flex;justify-content:space-between;align-items:center;gap:8px;">'
        + (a.approved ? '<span class="pill pill-green">Approved</span>' : '<span class="pill pill-muted">Pending approval</span>')
        + approveBtn
        + '</div>'
        + '</div>';
    }).join('');
    return '<div class="cp-generated-grid">' + cards + '</div>';
  }
  window.campaignBulkApproveReady = function () {
    var f = cpFlow();
    f.generatedAssets.forEach(function (a) {
      if (a.status === 'Ready') a.approved = true;
    });
    renderContent();
  };
  window.campaignApproveAsset = function (id, ev) {
    if (ev) ev.stopPropagation();
    var a = cpGetGeneratedAsset(id);
    if (!a) return;
    if (a.status !== 'Ready') return;
    a.approved = true;
    renderContent();
  };
  window.campaignUnapproveAsset = function (id, ev) {
    if (ev) ev.stopPropagation();
    var a = cpGetGeneratedAsset(id);
    if (!a) return;
    a.approved = false;
    renderContent();
  };
  window.campaignOpenAssetEditor = function (id) {
    var f = cpFlow();
    var asset = cpGetGeneratedAsset(id);
    if (!asset) return;
    f.editingAssetId = id;
    f.editDraft = {
      title: asset.title || '',
      content: asset.content || '',
      status: asset.status || 'Ready'
    };
    renderContent();
  };
  window.campaignCloseAssetEditor = function () {
    var f = cpFlow();
    f.editingAssetId = null;
    f.editDraft = null;
    renderContent();
  };
  window.campaignSetEditDraft = function (key, value) {
    var f = cpFlow();
    if (!f.editDraft) return;
    f.editDraft[key] = value;
    renderContent();
  };
  window.campaignSaveAssetEditor = function () {
    var f = cpFlow();
    var asset = cpGetGeneratedAsset(f.editingAssetId);
    if (!asset || !f.editDraft) return;
    asset.title = f.editDraft.title;
    asset.content = f.editDraft.content;
    asset.status = f.editDraft.status;
    f.editingAssetId = null;
    f.editDraft = null;
    renderContent();
  };
  function cpStepEdit() {
    var f = cpFlow();
    if (f.editingAssetId) {
      var d = f.editDraft || { title: '', content: '', status: 'Ready' };
      return '<div class="cp-step-title">Edit asset</div>'
        + '<div class="cp-step-sub">Single-item edit view. Save to return to campaign grid.</div>'
        + '<div class="cp-edit-layout">'
        + '<div class="card cp-edit-main">'
        + '<div class="cp-field"><label>Asset title</label><input value="' + (d.title || '') + '" oninput="campaignSetEditDraft(\'title\',this.value)"></div>'
        + '<div class="cp-field"><label>Content</label><textarea oninput="campaignSetEditDraft(\'content\',this.value)">' + (d.content || '') + '</textarea></div>'
        + '</div>'
        + '<div class="card cp-edit-rail">'
        + '<div class="label">Status</div>'
        + '<div class="cp-status-row">'
        + ['Ready', 'Needs edit', 'Flagged'].map(function (s) {
            return '<button class="btn btn-outline btn-sm' + (d.status === s ? ' active' : '') + '" onclick="campaignSetEditDraft(\'status\',\'' + s + '\')">' + s + '</button>';
          }).join('')
        + '</div>'
        + '<div style="display:flex;gap:8px;margin-top:16px;">'
        + '<button class="btn btn-outline" onclick="campaignCloseAssetEditor()">Back to grid</button>'
        + '<button class="btn btn-primary" onclick="campaignSaveAssetEditor()">Save</button>'
        + '</div>'
        + '</div></div>';
    }
    return '<div class="cp-step-title">Edit</div>'
      + '<div class="cp-step-sub">Review campaign assets. Open any item for single-asset edit.</div>'
      + '<div class="card">'
      + '<div class="flex-between"><div><div class="label">Overview</div><div style="font-size:18px;font-weight:600;">' + f.generatedAssets.length + ' assets generated</div></div>'
      + '<button class="btn btn-outline btn-sm" onclick="campaignBulkApproveReady()">Approve all Ready</button></div>'
      + '<div style="margin:10px 0 12px;display:flex;gap:8px;flex-wrap:wrap;"><span class="pill pill-green">' + cpApprovedAssets().length + ' approved</span><span class="pill pill-muted">' + (f.generatedAssets.length - cpApprovedAssets().length) + ' pending</span></div>'
      + cpGeneratedOverviewGrid(f.generatedAssets, true)
      + '</div>';
  }

  function cpApprovedAssets() {
    return cpFlow().generatedAssets.filter(function (a) { return a.approved; });
  }
  function cpEnsurePublishDefaults() {
    var f = cpFlow();
    var start = f.startDate || cpTodayStr();
    cpApprovedAssets().forEach(function (a, i) {
      if (!a.scheduledDate) a.scheduledDate = cpAddDays(start, i);
    });
  }
  function cpConflictMap() {
    var map = {};
    cpApprovedAssets().forEach(function (a) {
      if (!a.scheduledDate) return;
      var key = a.platform + '|' + a.scheduledDate;
      if (!map[key]) map[key] = [];
      map[key].push(a);
    });
    var onlyConflicts = {};
    Object.keys(map).forEach(function (k) {
      if (map[k].length > 1) onlyConflicts[k] = map[k];
    });
    return onlyConflicts;
  }
  function cpHasConflict(asset, conflicts) {
    if (!asset.scheduledDate) return null;
    var key = asset.platform + '|' + asset.scheduledDate;
    return conflicts[key] ? conflicts[key] : null;
  }
  window.campaignSetAssetDate = function (id, dateVal) {
    var a = cpGetGeneratedAsset(id);
    if (!a) return;
    a.scheduledDate = dateVal;
    renderContent();
  };
  window.campaignAutoSpread = function () {
    var f = cpFlow();
    var conflicts = cpConflictMap();
    var conflictedPlatforms = {};
    Object.keys(conflicts).forEach(function (k) {
      conflictedPlatforms[k.split('|')[0]] = true;
    });
    Object.keys(conflictedPlatforms).forEach(function (platform) {
      var list = cpApprovedAssets().filter(function (a) { return a.platform === platform; });
      if (!list.length) return;
      list.sort(function (a, b) {
        var da = a.scheduledDate || '';
        var db = b.scheduledDate || '';
        return da < db ? -1 : da > db ? 1 : (a.id < b.id ? -1 : 1);
      });
      var base = list[0].scheduledDate || f.startDate || cpTodayStr();
      list.forEach(function (a, i) { a.scheduledDate = cpAddDays(base, i); });
    });
    renderContent();
  };
  function cpCampaignStatusForPublish() {
    var today = cpTodayStr();
    var approved = cpApprovedAssets();
    if (!approved.length) return 'Draft';
    var anyLive = approved.some(function (a) { return a.scheduledDate && a.scheduledDate <= today; });
    return anyLive ? 'Live' : 'Scheduled';
  }
  function cpCampaignStatusForCard(c) {
    var today = cpTodayStr();
    if (c.status === 'Live' && c.endDate && c.endDate < today) return 'Done';
    return c.status || 'Draft';
  }
  window.campaignPublishFinal = function () {
    var f = cpFlow();
    var approved = cpApprovedAssets();
    if (!approved.length) return;
    var status = cpCampaignStatusForPublish();
    var campaign = {
      id: 'cmp-' + Date.now(),
      name: f.name,
      goal: f.objective,
      startDate: f.startDate,
      endDate: f.endDate,
      status: status,
      totalAssets: approved.length,
      platforms: f.platforms.slice(),
      brief: JSON.parse(JSON.stringify(f.brief)),
      assets: f.generatedAssets.map(function (a) {
        return {
          id: a.id,
          platform: a.platform,
          label: a.label,
          title: a.title,
          status: a.status,
          approved: !!a.approved,
          scheduledDate: a.scheduledDate || null
        };
      })
    };
    appState.campaigns.unshift(campaign);
    appState.campaignUI.mode = 'detail';
    appState.campaignUI.selectedId = campaign.id;
    appState.campaignFlow = cpFreshFlow(appState);
    renderContent();
  };
  function cpStepPublish() {
    cpEnsurePublishDefaults();
    var approved = cpApprovedAssets();
    var conflicts = cpConflictMap();
    var hasConflicts = Object.keys(conflicts).length > 0;
    return '<div class="cp-step-title">Publish</div>'
      + '<div class="cp-step-sub">Schedule approved assets by platform and date before publishing campaign.</div>'
      + (approved.length ? '<div class="card">'
        + '<div class="flex-between"><div><div class="label">Approved assets</div><div style="font-size:18px;font-weight:600;">' + approved.length + ' items ready to schedule</div></div>'
        + (hasConflicts ? '<button class="btn btn-outline btn-sm" onclick="campaignAutoSpread()">Auto-spread schedule</button>' : '<span class="pill pill-green">No conflicts</span>')
        + '</div>'
        + '<div class="cp-publish-list">'
        + approved.map(function (a) {
            var conflictList = cpHasConflict(a, conflicts);
            return '<div class="cp-publish-row">'
              + '<div class="cp-publish-main"><div class="cp-generated-title">' + a.label + ' #' + a.seq + '</div><div class="cp-generated-msg">' + a.platform + ' · ' + (a.title || '').substring(0, 80) + '</div></div>'
              + '<div class="cp-publish-date"><input type="date" value="' + (a.scheduledDate || '') + '" onchange="campaignSetAssetDate(\'' + a.id + '\',this.value)"></div>'
              + '</div>'
              + (conflictList ? '<div class="cp-conflict">Two ' + a.platform + ' posts on ' + cpFmtDate(a.scheduledDate) + ', consider spacing these out.</div>' : '');
          }).join('')
        + '</div>'
        + '<div style="display:flex;justify-content:flex-end;margin-top:12px;"><button class="btn btn-primary" onclick="campaignPublishFinal()">Publish campaign</button></div>'
        + '</div>'
        : '<div class="card"><div class="cf-history-empty" style="padding:16px 0 6px;">No approved assets yet. Go back to Edit and approve items first.</div>'
          + '<div style="display:flex;justify-content:center;gap:10px;padding-bottom:10px;">'
          + '<button class="btn btn-outline" onclick="campaignBack()">Back to Edit</button>'
          + '<button class="btn btn-primary" onclick="campaignBulkApproveReady()">Approve all Ready now</button>'
          + '</div></div>');
  }

  function canContinue() {
    if (!cpHasIntelligence()) return false;
    var f = cpFlow();
    if (f.step === 1) return !!f.name && !!f.objective && !!f.startDate && !!f.endDate;
    if (f.step === 2) return f.platforms.length > 0;
    if (f.step === 3) return f.assetMix.length > 0;
    if (f.step === 4) return !!f.brief.shared.objective && !!f.brief.shared.persona && !!f.brief.shared.message;
    if (f.step === 5) return !f.batchGenerating && f.generatedAssets.length > 0;
    if (f.step === 6) return !f.editingAssetId && cpApprovedAssets().length > 0;
    if (f.step === 7) return false;
    return true;
  }
  function cpContinueLabel() {
    var s = cpFlow().step;
    if (s === 4) return 'Generate batch';
    if (s === 5) return 'Continue to edit';
    if (s === 6) return 'Continue to publish';
    return 'Continue';
  }

  window.campaignBack = function () {
    var f = cpFlow();
    if (f.step > 1) { f.step--; renderContent(); }
  };
  window.campaignContinue = function () {
    var f = cpFlow();
    if (!canContinue()) return;
    if (f.step < 7) {
      f.step++;
      if (f.step === 5) cpStartBatchGenerate();
      renderContent();
    }
  };
  window.campaignStartFlow = function () {
    appState.campaignFlow = cpFreshFlow(appState);
    appState.campaignUI.mode = 'flow';
    appState.campaignUI.selectedId = null;
    renderContent();
  };
  window.campaignUseSampleIntelligence = function () {
    appState.intelligence = cpSampleIntelligence();
    cpApplyBriefFromIntelligence();
    renderContent();
  };
  window.campaignStartIntelligenceSetup = function () {
    alert('Intelligence setup is outside this mockup. Use "Use Sample Intelligence for Demo" to load research context and continue.');
  };
  window.campaignOpenDetail = function (id) {
    appState.campaignUI.mode = 'detail';
    appState.campaignUI.selectedId = id;
    renderContent();
  };
  window.campaignBackHome = function () {
    appState.campaignUI.mode = 'home';
    appState.campaignUI.selectedId = null;
    renderContent();
  };
  function cpGetCampaignById(id) {
    var list = appState.campaigns || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    for (var j = 0; j < CP_SAMPLE_CAMPAIGNS.length; j++) if (CP_SAMPLE_CAMPAIGNS[j].id === id) return CP_SAMPLE_CAMPAIGNS[j];
    return null;
  }
  function cpCampaignPlatforms(c) {
    if (c.platforms && c.platforms.length) return c.platforms;
    var seen = {};
    var out = [];
    (c.assets || []).forEach(function (a) {
      if (!seen[a.platform]) { seen[a.platform] = true; out.push(a.platform); }
    });
    return out;
  }
  function cpGroupAssetsByPlatform(assets) {
    var map = {};
    (assets || []).forEach(function (a) {
      if (!map[a.platform]) map[a.platform] = [];
      map[a.platform].push(a);
    });
    return map;
  }
  function cpDetailAssetCard(a) {
    return '<div class="cp-generated-card">'
      + '<div class="cp-generated-top"><span class="pill pill-indigo">' + a.platform + '</span><span class="pill ' + cpStatusPill(a.status) + '">' + a.status + '</span></div>'
      + '<div class="cp-generated-title">' + a.label + (a.seq ? ' #' + a.seq : '') + '</div>'
      + '<div class="cp-generated-msg">' + (a.content || a.title || '').substring(0, 110) + '</div>'
      + '<div class="cp-generated-foot" style="display:flex;justify-content:space-between;align-items:center;gap:8px;">'
      + (a.approved ? '<span class="pill pill-green">Approved</span>' : '<span class="pill pill-muted">Pending approval</span>')
      + '<span class="pill pill-muted">' + (a.scheduledDate ? cpFmtDate(a.scheduledDate) : 'Not scheduled') + '</span>'
      + '</div></div>';
  }
  function cpScreenDetail() {
    var c = cpGetCampaignById(appState.campaignUI.selectedId);
    if (!c) return cpScreenHome();
    var status = cpCampaignStatusForCard(c);
    var platforms = cpCampaignPlatforms(c);
    var grouped = cpGroupAssetsByPlatform(c.assets || []);
    var approvedCount = (c.assets || []).filter(function (a) { return a.approved; }).length;
    var brief = (c.brief && c.brief.shared) || {};
    var sampleBadge = c.isSample ? '<span class="pill pill-muted" style="margin-left:8px;">Sample</span>' : '';
    var platformKpis = platforms.map(function (p) {
      var count = (grouped[p] || []).length;
      return '<div class="card cp-platform-kpi"><div class="label">' + p + '</div><div class="cp-kpi-val" style="font-size:20px;">' + count + '</div><div class="cp-campaign-meta">' + count + ' asset' + (count === 1 ? '' : 's') + '</div></div>';
    }).join('');
    var platformSections = platforms.map(function (p) {
      var items = grouped[p] || [];
      return '<div class="cp-detail-platform-section">'
        + '<div class="flex-between" style="margin-bottom:10px;"><div class="label">' + p + '</div><span class="pill pill-indigo">' + items.length + ' posts</span></div>'
        + '<div class="cp-generated-grid">' + items.map(cpDetailAssetCard).join('') + '</div>'
        + '</div>';
    }).join('');
    return '<div class="screen"><div class="flex-between" style="margin-bottom:18px;">'
      + '<div><h1 class="screen-title">' + c.name + sampleBadge + '</h1><p class="screen-sub">' + c.goal + ' · ' + cpFmtDate(c.startDate) + ' to ' + cpFmtDate(c.endDate) + '</p></div>'
      + '<div style="display:flex;gap:8px;"><button class="btn btn-outline" onclick="campaignBackHome()">← Campaigns</button><button class="btn btn-primary" onclick="campaignStartFlow()">+ New campaign</button></div>'
      + '</div>'
      + '<div class="cp-detail-kpis cp-detail-kpis-wide">'
      + '<div class="card"><div class="label">Status</div><div class="cp-kpi-val">' + status + '</div></div>'
      + '<div class="card"><div class="label">Total assets</div><div class="cp-kpi-val">' + c.totalAssets + '</div></div>'
      + '<div class="card"><div class="label">Approved</div><div class="cp-kpi-val">' + approvedCount + '</div></div>'
      + '<div class="card"><div class="label">Platforms</div><div class="cp-kpi-val">' + platforms.length + '</div></div>'
      + '</div>'
      + (platforms.length ? '<div class="card" style="margin-top:12px;"><div class="label">Channel mix</div><div class="cp-detail-platforms">' + platforms.map(function (p) { return '<span class="pill pill-indigo">' + p + '</span>'; }).join('') + '</div><div class="cp-platform-kpi-grid" style="margin-top:12px;">' + platformKpis + '</div></div>' : '')
      + (brief.message ? '<div class="card cp-detail-brief" style="margin-top:12px;"><div class="label">Campaign brief</div>'
        + '<div class="cp-brief-summary"><div><span class="cp-brief-key">Objective</span>' + (brief.objective || '—') + '</div>'
        + '<div><span class="cp-brief-key">Persona</span>' + (brief.persona || '—') + '</div>'
        + '<div><span class="cp-brief-key">Message</span>' + (brief.message || '—') + '</div>'
        + '<div class="cp-row" style="margin-top:8px;"><div><span class="cp-brief-key">Proof</span>' + (brief.proof || '—') + '</div>'
        + '<div><span class="cp-brief-key">CTA</span>' + (brief.cta || '—') + '</div></div></div></div>' : '')
      + '<div class="card" style="margin-top:12px;"><div class="label">All posts by platform</div>'
      + '<div class="cp-detail-platform-sections">' + platformSections + '</div>'
      + '</div></div>';
  }
  function cpScreenHome() {
    var campaigns = appState.campaigns || [];
    var sample = CP_SAMPLE_CAMPAIGNS;
    var header = '<div class="flex-between" style="margin-bottom:18px;">'
      + '<div><h1 class="screen-title">Campaigns</h1><p class="screen-sub">Plan, generate, edit, and publish campaign assets in one flow</p></div>'
      + '<button class="btn btn-primary" onclick="campaignStartFlow()">+ Create campaign</button></div>';
    if (!campaigns.length) {
      return '<div class="screen">' + header
        + '<div class="cp-home-hero">'
        + '<div class="cp-home-hero-title">No campaigns yet</div>'
        + '<p class="cp-home-hero-sub">Start your first campaign to coordinate goals, channel mix, asset generation, editing, and scheduling from one place.</p>'
        + '</div>'
        + '<div class="label" style="margin-top:16px;">Sample campaigns</div>'
        + '<div class="cp-campaign-list">'
        + sample.map(function (c) {
            return '<div class="cp-campaign-card" onclick="campaignOpenDetail(\'' + c.id + '\')">'
              + '<div class="flex-between"><div class="cp-campaign-name">' + c.name + '</div><span class="pill ' + (c.status === 'Live' ? 'pill-green' : c.status === 'Scheduled' ? 'pill-indigo' : 'pill-muted') + '">' + c.status + '</span></div>'
              + '<div class="cp-campaign-meta">' + c.goal + ' · ' + cpFmtDate(c.startDate) + ' to ' + cpFmtDate(c.endDate) + '</div>'
              + '<div class="cp-campaign-meta">' + c.totalAssets + ' assets · ' + cpCampaignPlatforms(c).join(', ') + '</div>'
              + '</div>';
          }).join('')
        + '</div></div>';
    }
    return '<div class="screen">' + header
      + '<div class="screen-sub" style="margin-bottom:12px;">Manage active and scheduled campaigns</div>'
      + '<div class="cp-campaign-list">'
      + campaigns.map(function (c) {
          var status = cpCampaignStatusForCard(c);
          return '<div class="cp-campaign-card" onclick="campaignOpenDetail(\'' + c.id + '\')">'
            + '<div class="flex-between"><div class="cp-campaign-name">' + c.name + '</div><span class="pill ' + (status === 'Done' ? 'pill-muted' : status === 'Live' ? 'pill-green' : 'pill-indigo') + '">' + status + '</span></div>'
            + '<div class="cp-campaign-meta">' + c.goal + ' · ' + cpFmtDate(c.startDate) + ' to ' + cpFmtDate(c.endDate) + '</div>'
            + '<div class="cp-campaign-meta">' + c.totalAssets + ' assets' + (cpCampaignPlatforms(c).length ? ' · ' + cpCampaignPlatforms(c).join(', ') : '') + '</div>'
            + '</div>';
        }).join('')
      + '</div></div>';
  }
  function cpScreenFlow() {
    var f = cpFlow();
    var content = f.step === 1 ? cpStepGoalTiming()
      : f.step === 2 ? cpStepPlatforms()
      : f.step === 3 ? cpStepAssetMix()
      : f.step === 4 ? cpStepBrief()
      : f.step === 5 ? cpStepGenerate()
      : f.step === 6 ? cpStepEdit()
      : cpStepPublish();
    return '<div class="cf-screen">'
      + '<div class="cf-topbar"><div class="cf-brand">Clarity <span>Content Studio</span></div>'
      + '<div class="cf-topbar-right"><span class="create-status"><span class="create-status-dot"></span> '
      + (cpHasIntelligence() && appState.intelligence.brand ? appState.intelligence.brand + ' · ' : '')
      + 'Campaign Builder</span></div></div>'
      + '<div class="cp-body"><div class="cp-main">' + cpStepper() + content + '</div></div>'
      + '<div class="cf-footer">'
      + '<button class="btn btn-outline"' + (f.step <= 1 ? ' disabled style="opacity:0.35;"' : '') + ' onclick="campaignBack()">← Back</button>'
      + '<div class="cf-footer-mid"><span class="cf-eta">Campaign flow · 7 steps</span></div>'
      + (f.step < 7 ? '<button class="btn btn-primary"' + (canContinue() ? '' : ' disabled style="opacity:0.4;"') + ' onclick="campaignContinue()">' + cpContinueLabel() + '</button>' : '<button class="btn btn-outline" onclick="campaignBackHome()">Back to campaigns</button>')
      + '</div>'
      + '</div>';
  }

  function screenCampaign() {
    var ui = appState.campaignUI || { mode: 'home' };
    if (ui.mode === 'flow') return cpScreenFlow();
    if (ui.mode === 'detail') return cpScreenDetail();
    return cpScreenHome();
  }

  return { init: init, screenCampaign: screenCampaign };
})();

window.screenCampaign = function () { return CampaignFlow.screenCampaign(); };
