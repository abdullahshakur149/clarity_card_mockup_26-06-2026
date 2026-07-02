/* ============================================================================
   content.js — wires the already-built Content Engine into the ideas Hub.
   The engine is itself multi-screen; this wrapper hosts its internal navigation
   and maps its contracts onto the idea model:
     • home  (ContentEngineScreen)  → studio (StudioLaunchpad → StudioFlow)
     • home  → campaigns (CampaignsHomeScreen → CampaignFlow → CampaignDetailScreen)
     • intelDone   ← this idea's recon / plan status
     • onPublish   → store the piece on idea.content + award XP (flows to the HUD)
   The "Director's Call" cinematic plays once on first entry. Exposes ClarityContent.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  var SData = window.ClarityData || {};
  var XP_PUBLISH = 40;

  function bg() { return e('div', { className: 'pf-bg' }, e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-grid' }), e('div', { className: 'pf-bg-scan' }), e('div', { className: 'pf-bg-vignette' })); }
  function shell(inner) {
    return e('div', { className: 'id-root ct-root' }, bg(),
      e('div', { className: 'pf-topbar' },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
          e('span', { className: 'pf-wordmark' }, 'Clarity'),
          e('span', { className: 'pf-hide-sm' }, 'Mission Control // Content Engine')),
        e('div', { className: 'pf-tele' }, e('span', { className: 'pf-hide-sm' }, 'Guidance: CAPCOM'), e('span', { className: 'pf-live' }, e('i', null), 'Live'))),
      e('div', { className: 'id-main ct-main' }, inner));
  }

  function ClarityContent(props) {
    var idea = props.idea || {}, onChange = props.onChange, onBack = props.onBack;
    var mi = idea.missions || {};
    var intelDone = !!((mi.market && mi.customers && mi.competition) || mi.plan);

    var vw = React.useState('engine'); var view = vw[0], setView = vw[1];
    var sk = React.useState(null); var studioKey = sk[0], setStudioKey = sk[1];
    var ci = React.useState(null); var campaignId = ci[0], setCampaignId = ci[1];
    var cf = React.useState(false); var campFlow = cf[0], setCampFlow = cf[1];
    var ds = React.useState(function () { return window.ariaDirectorSeen ? window.ariaDirectorSeen() : true; }); var directorSeen = ds[0], setDirectorSeen = ds[1];

    function awardPublish(piece) {
      if (onChange) onChange({ content: (idea.content || []).concat([piece || {}]), xp: (idea.xp || 0) + XP_PUBLISH });
    }
    var overlay = campFlow && window.CampaignFlow && e(window.CampaignFlow, {
      onExit: function () { setCampFlow(false); },
      onLaunch: function () { setCampFlow(false); }
    });

    /* Director's Call — once, on first entry */
    if (!directorSeen && window.DirectorsCall) {
      return shell(e(window.DirectorsCall, {
        earned: idea.xp || 0, goal: SData.CLARA_GOAL || 600,
        strategyCards: (SData.ENGINE_STRATEGY && SData.ENGINE_STRATEGY.cards) || [],
        onStart: function () { setDirectorSeen(true); }
      }));
    }

    /* studio (StudioLaunchpad hosts its own StudioFlow overlay + library) */
    if (view === 'studio' && window.StudioLaunchpad) {
      return shell(e(window.StudioLaunchpad, { studioKey: studioKey, intelDone: intelDone, onBack: function () { setView('engine'); }, onPublish: awardPublish }));
    }

    /* one campaign's detail */
    if (view === 'campaign-detail' && window.CampaignDetailScreen) {
      return shell(e(React.Fragment, null,
        e(window.CampaignDetailScreen, { campaignId: campaignId, justLaunched: false, onBack: function () { setView('campaigns'); }, onDismiss: function () {}, onAddSeries: function () { setCampFlow(true); } }),
        overlay));
    }

    /* campaigns home */
    if (view === 'campaigns' && window.CampaignsHomeScreen) {
      return shell(e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: function () { setView('engine'); } }, '‹ Content Engine'),
        e(window.CampaignsHomeScreen, { onNew: function () { setCampFlow(true); }, onOpen: function (id) { setCampaignId(id); setView('campaign-detail'); } }),
        overlay));
    }

    /* engine home (default) */
    return shell(e(React.Fragment, null,
      e('button', { className: 'id-back', onClick: onBack }, '‹ Back to hub'),
      window.ContentEngineScreen
        ? e(window.ContentEngineScreen, { onCreate: function (k) { setStudioKey(k); setView('studio'); }, onCampaign: function () { setView('campaigns'); } })
        : e('div', { style: { padding: 40, color: 'var(--clr-muted)' } }, 'Content Engine unavailable.'),
      overlay));
  }

  window.ClarityContent = ClarityContent;
})();
