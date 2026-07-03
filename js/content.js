/* ============================================================================
   content.js — wires the already-built Content Engine into the ideas Hub.
   The creation wizard always opens in a full-screen portal — never inline
   with the "Create with Studio" card.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  var SData = window.ClarityData || {};
  var XP_PUBLISH = 40;
  var MOTIF_TO_KEY = { FileText: 'text', Image: 'image', Clapperboard: 'video', AudioLines: 'audio' };

  function ds() { return window.ClarityDesignSystem_29c088 || {}; }
  function Icon(props) { var I = ds().Icon; return I ? e(I, props) : null; }

  function bg() { return e('div', { className: 'pf-bg' }, e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-vignette' })); }
  function shell(inner) {
    return e('div', { className: 'id-root ct-root' }, bg(),
      e('div', { className: 'pf-topbar' },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
          e('span', { className: 'pf-wordmark' }, 'Clarity'),
          e('span', { className: 'pf-hide-sm' }, 'Your journey · Content Engine'))),
      e('div', { className: 'id-main ct-main' }, inner));
  }

  function flowPortal(node) {
    if (typeof document !== 'undefined' && window.ReactDOM && window.ReactDOM.createPortal) {
      return window.ReactDOM.createPortal(node, document.body);
    }
    return node;
  }

  function pieceStudioKey(p) {
    if (!p) return 'text';
    if (p.studioKey) return p.studioKey;
    return MOTIF_TO_KEY[p.motif] || 'text';
  }
  function piecesForStudio(content, studioKey) {
    return (content || []).filter(function (p) { return pieceStudioKey(p) === studioKey; });
  }

  /* Self-contained start card — never embeds StudioFlow */
  function ContentStudioStart(props) {
    var studioKey = props.studioKey;
    var onBack = props.onBack;
    var onStart = props.onStart;
    var onLibrary = props.onLibrary;
    var hasLibrary = props.hasLibrary;
    var Card = ds().Card;
    var Button = ds().Button;
    var s = (SData.STUDIOS || []).filter(function (x) { return x.key === studioKey; })[0] || (SData.STUDIOS && SData.STUDIOS[0]) || { key: studioKey, name: 'Studio', tag: '', accent: 'var(--clr-primary)', icon: 'Sparkles' };

    var cardBody = e(React.Fragment, null,
      e('div', {
        style: {
          position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)',
          width: 320, height: 320,
          background: 'radial-gradient(circle, ' + s.accent + ', transparent 70%)',
          opacity: 0.12, pointerEvents: 'none'
        }
      }),
      e('div', {
        style: {
          width: 60, height: 60, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'color-mix(in srgb, ' + s.accent + ' 18%, transparent)', marginBottom: 18, position: 'relative', color: s.accent
        }
      }, e(Icon, { name: s.icon, size: 28 })),
      e('h2', { style: { font: 'var(--type-display-md)', color: 'var(--clr-text)', margin: 0, position: 'relative' } }, 'Create with Studio ', s.name),
      e('p', { style: { fontSize: 14, color: 'var(--clr-muted)', marginTop: 8, lineHeight: 1.55, position: 'relative' } }, s.tag),
      e('div', {
        style: {
          marginTop: 22, padding: 14, border: '1px dashed var(--clr-border)', borderRadius: 12,
          background: 'var(--clr-card-2)', position: 'relative'
        }
      },
        e('div', { style: { font: 'var(--type-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--label-tracking)', color: 'var(--clr-muted)' } }, 'Auto-applied from your strategy'),
        e('div', { style: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginTop: 10 } },
          ['Persona', 'Market intel', 'GTM strategy'].map(function (c) {
            return e('span', {
              key: c,
              style: {
                display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--clr-text)',
                background: 'color-mix(in srgb, ' + s.accent + ' 14%, var(--clr-card))',
                border: '1px solid color-mix(in srgb, ' + s.accent + ' 35%, transparent)',
                borderRadius: 'var(--radius-pill)', padding: '4px 11px'
              }
            }, e(Icon, { name: 'Check', size: 12, color: s.accent }), c);
          }))),
      e('div', { style: { marginTop: 24, position: 'relative' } },
        Button
          ? e(Button, { accent: s.accent, onClick: onStart }, 'Start creating →')
          : e('button', { className: 'pf-cta mm-cta', onClick: onStart }, 'Start creating →')),
      hasLibrary && e('div', { className: 'ct-studio-liblink', onClick: onLibrary }, 'or browse your library'));

    return e('div', { className: 'ct-studio-start' },
      e('button', { type: 'button', className: 'id-back', onClick: onBack }, '‹ Create content'),
      Card
        ? e(Card, { style: { maxWidth: 540, margin: '24px auto', textAlign: 'center', position: 'relative' }, padding: '44px 38px', radius: 'var(--radius-xl)' }, cardBody)
        : e('div', { className: 'ct-studio-card', style: { maxWidth: 540, margin: '24px auto', textAlign: 'center', position: 'relative' } }, cardBody));
  }

  function ClarityContent(props) {
    var idea = props.idea || {}, onChange = props.onChange, onBack = props.onBack;
    var mi = idea.missions || {};
    var intelDone = !!((mi.market && mi.customers && mi.competition) || mi.plan);
    var returning = !!idea.contentEngineVisited;

    var vw = React.useState(returning ? 'engine' : 'create'); var view = vw[0], setView = vw[1];
    var sk = React.useState(null); var studioKey = sk[0], setStudioKey = sk[1];
    var ci = React.useState(null); var campaignId = ci[0], setCampaignId = ci[1];
    var cf = React.useState(false); var campFlow = cf[0], setCampFlow = cf[1];
    var sp = React.useState(null); var selPiece = sp[0], setSelPiece = sp[1];
    var bf = React.useState(false); var briefOpen = bf[0], setBriefOpen = bf[1];
    var ds2 = React.useState(function () { return window.ariaDirectorSeen ? window.ariaDirectorSeen() : true; }); var directorSeen = ds2[0], setDirectorSeen = ds2[1];

    var studio = studioKey && SData.STUDIOS ? SData.STUDIOS.filter(function (s) { return s.key === studioKey; })[0] : null;

    function markVisited() {
      if (!idea.contentEngineVisited && onChange) onChange({ contentEngineVisited: true });
    }
    function leaveContentEngine() {
      markVisited();
      onBack();
    }
    function awardPublish(piece) {
      if (onChange) onChange({ content: (idea.content || []).concat([piece || {}]), xp: (idea.xp || 0) + XP_PUBLISH });
    }
    function finishPublish(piece) {
      awardPublish(piece);
      setSelPiece(null);
      setView('library');
    }
    function pickStudio(k) {
      setStudioKey(k);
      setSelPiece(null);
      var existing = piecesForStudio(idea.content, k);
      setView(existing.length ? 'library' : 'studio');
    }
    function directorDone() {
      setDirectorSeen(true);
      if (!returning) setView('create');
    }
    function openWizard() {
      setBriefOpen(false);
      setView('flow');
    }

    var overlay = campFlow && window.CampaignFlow && e(window.CampaignFlow, {
      onExit: function () { setCampFlow(false); },
      onLaunch: function () { setCampFlow(false); }
    });

    /* Director's Call — once, on first entry */
    if (!directorSeen && window.DirectorsCall) {
      return e(React.Fragment, null,
        shell(null),
        e(window.DirectorsCall, {
          earned: idea.xp || 0, goal: SData.CLARA_GOAL || 600,
          strategyCards: (SData.ENGINE_STRATEGY && SData.ENGINE_STRATEGY.cards) || [],
          onStart: directorDone
        }));
    }

    /* full-screen creation wizard (portal — never stacked on launchpad) */
    if (view === 'flow' && window.StudioFlow && studioKey) {
      return e(React.Fragment, null,
        shell(null),
        flowPortal(e('div', { className: 'ct-flow-portal' },
          e(window.StudioFlow, {
            studio: studio,
            intelDone: intelDone,
            onExit: function () {
              setView(piecesForStudio(idea.content, studioKey).length ? 'library' : 'studio');
            },
            onPublish: finishPublish
          }),
          window.AriaWidget && e(window.AriaWidget, { studioKey: studioKey, accent: studio ? studio.accent : undefined })
        )));
    }

    /* single piece detail + stats */
    if (view === 'detail' && selPiece && window.StudioContentDetail) {
      return shell(e(window.StudioContentDetail, {
        piece: selPiece,
        studioKey: studioKey,
        onBack: function () { setView('library'); },
        onCreateNew: function () { setView('studio'); }
      }));
    }

    /* saved content cards for this studio type */
    if (view === 'library' && studioKey && window.StudioContentLibrary) {
      return shell(e(window.StudioContentLibrary, {
        studioKey: studioKey,
        pieces: piecesForStudio(idea.content, studioKey),
        onBack: function () { setStudioKey(null); setView('create'); },
        onOpen: function (p) { setSelPiece(p); setView('detail'); },
        onCreateNew: function () { setView('studio'); }
      }));
    }

    /* studio start card — wizard opens via view=flow only */
    if (view === 'studio' && studioKey) {
      return e(React.Fragment, null,
        shell(e(ContentStudioStart, {
          studioKey: studioKey,
          hasLibrary: piecesForStudio(idea.content, studioKey).length > 0,
          onBack: function () {
            setView(piecesForStudio(idea.content, studioKey).length ? 'library' : 'create');
          },
          onStart: function () { setBriefOpen(true); },
          onLibrary: function () { setView('library'); }
        })),
        briefOpen && window.AriaBriefing && e(window.AriaBriefing, {
          studioKey: studioKey,
          onReady: openWizard
        }));
    }

    /* campaign detail */
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

    /* create landing — pick a format */
    if (view === 'create' && window.ContentEngineScreen) {
      return shell(e(window.ContentEngineScreen, {
        onCreate: pickStudio,
        onBack: returning ? function () { setView('engine'); } : null
      }));
    }

    /* engine hub (return visits) */
    return shell(e(React.Fragment, null,
      e('button', { className: 'id-back', onClick: leaveContentEngine }, '‹ Home base'),
      window.ContentEngineHub
        ? e(window.ContentEngineHub, {
          onCreate: function () { setView('create'); },
          onCampaigns: function () { setView('campaigns'); }
        })
        : e('div', { style: { padding: 40, color: 'var(--clr-muted)' } }, 'The Content Engine isn’t available right now.'),
      overlay));
  }

  window.ClarityContent = ClarityContent;
  window.ContentStudioStart = ContentStudioStart;
})();
