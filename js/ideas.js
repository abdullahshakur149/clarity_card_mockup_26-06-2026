/* ============================================================================
   ideas.js — "Your Ideas" home (concept locker) + per-idea "Hub" (4 pillars + Tools).
   Exposes window.ClarityIdeasHome({ ideas, onOpen, onNew }) and
           window.ClarityHub({ idea, onPillar, onBack, onCompare }).
   An idea is the top-level concept; each has its own Hub. Strategic Planning
   inside the Hub is the existing ClarityIntel (recon + plan). Mission-control / teal.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }

  var SECTOR_NAME = { food: 'Food & hospitality', retail: 'Retail & products', creative: 'Creative & services', tech: 'Software & tech', trades: 'Trades & services', other: 'Business' };

  var PILLARS = [
    { id: 'strategic', label: 'Strategic Planning', icon: 'Radar', accent: 'var(--clr-cat-market)', dim: 'var(--clr-cat-market-dim)', desc: 'Scan the market, sketch your customer, scout rivals — then synthesise the plan.', active: true },
    { id: 'persona', label: 'Persona', icon: 'Users', accent: 'var(--clr-persona)', dim: 'var(--clr-persona-dim)', desc: 'Meet your customers as living characters — get to know them and hear them out.', active: true },
    { id: 'gtm', label: 'Go-To-Market', icon: 'Rocket', accent: 'var(--clr-cat-gtm)', dim: 'var(--clr-cat-gtm-dim)', desc: 'Price your play and get your go-to-market moves — then turn them into tasks.', active: true },
    { id: 'tasks', label: 'My Tasks', icon: 'ListChecks', accent: 'var(--clr-cat-customer)', dim: 'var(--clr-cat-customer-dim)', desc: 'Your GTM moves, broken into scheduled, checkable tasks — plus your own.' },
    { id: 'content', label: 'Content Engine', icon: 'Sparkles', accent: 'var(--clr-cat-positioning)', dim: 'var(--clr-cat-positioning-dim)', desc: 'Generate on-brand content and campaigns for the winner.', active: true }
  ];

  function progress(idea) {
    var mi = idea.missions || {};
    return { recon: (mi.market ? 1 : 0) + (mi.customers ? 1 : 0) + (mi.competition ? 1 : 0), hasPlan: !!mi.plan };
  }
  function statusChip(idea) {
    var p = progress(idea);
    if (p.hasPlan) return { label: 'Plan ready', cls: 'ok' };
    if (p.recon >= 3) return { label: 'Ready to assemble', cls: 'rec' };
    if (p.recon > 0) return { label: 'Recon ' + p.recon + '/3', cls: '' };
    return { label: 'New', cls: '' };
  }

  function bg() { return e('div', { className: 'pf-bg' }, e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-grid' }), e('div', { className: 'pf-bg-scan' }), e('div', { className: 'pf-bg-vignette' })); }
  function topbar(sub) {
    return e('div', { className: 'pf-topbar' },
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
        e('span', { className: 'pf-wordmark' }, 'Clarity'),
        e('span', { className: 'pf-hide-sm' }, sub)),
      e('div', { className: 'pf-tele' }, e('span', { className: 'pf-hide-sm' }, 'Guidance: CAPCOM'), e('span', { className: 'pf-live' }, e('i', null), 'Live')));
  }
  function capcom(line) {
    return e('div', { className: 'capcom' },
      e('div', { className: 'capcom-avatar' }, e('i', null), e('i', null), e('i', null), e('i', null), e('i', null)),
      e('div', { className: 'capcom-body' },
        e('div', { className: 'capcom-name' }, e('b', null, 'CAPCOM'), e('span', null, 'Launch Director')),
        e('div', { className: 'capcom-line' }, line)));
  }

  /* ── Your Ideas (home) ── */
  function ClarityIdeasHome(props) {
    var ideas = props.ideas || [], onOpen = props.onOpen, onNew = props.onNew;
    return e('div', { className: 'iq-root' }, bg(), topbar('Mission Control // Your Ideas'),
      e('div', { className: 'iq-main' },
        e('div', { className: 'id-eyebrow' }, 'Concept locker'),
        e('h1', { className: 'iq-title' }, 'Your ideas'),
        capcom(ideas.length > 1 ? 'Pick a concept to work, spin up a new one, or pit two against each other, operator.' : 'Open your concept to keep building — or start a new one so you can compare.'),
        e('div', { className: 'iq-grid' },
          ideas.map(function (idea) {
            var chip = statusChip(idea), pr = progress(idea);
            var score = window.ClarityIdeaScore ? window.ClarityIdeaScore(idea) : null;
            return e('button', { key: idea.id, className: 'iq-card', onClick: function () { onOpen(idea.id); } },
              e('div', { className: 'iq-card-top' },
                e('span', { className: 'iq-card-ic' }, e(Icon, { name: 'Lightbulb', size: 18 })),
                e('span', { className: 'iq-chip ' + chip.cls }, chip.label)),
              e('div', { className: 'iq-card-name' }, idea.name),
              e('div', { className: 'iq-card-meta' }, (SECTOR_NAME[idea.profile && idea.profile.sector] || 'Business') + '  ·  ' + (idea.createdLabel || '')),
              e('div', { className: 'iq-card-foot' },
                e('div', { className: 'iq-prog' }, [0, 1, 2].map(function (n) { return e('span', { key: n, className: 'iq-dot' + (pr.recon > n ? ' on' : '') }); }), e('span', { className: 'iq-prog-l' }, 'recon')),
                (score != null && pr.hasPlan) ? e('div', { className: 'iq-score' }, e('b', null, score), e('span', null, 'score')) : e('div', { className: 'iq-open' }, 'Open →')));
          }),
          e('button', { className: 'iq-card iq-new', onClick: onNew },
            e('span', { className: 'iq-new-ic' }, e(Icon, { name: 'Plus', size: 24 })),
            e('div', { className: 'iq-new-l' }, 'New idea'),
            e('div', { className: 'iq-new-s' }, 'Test another concept'))
        )
      )
    );
  }

  /* ── Hub (per idea) — 4 pillars + Tools ── */
  function ClarityHub(props) {
    var idea = props.idea || {}, onPillar = props.onPillar, onBack = props.onBack, onCompare = props.onCompare;
    var pr = progress(idea);
    return e('div', { className: 'iq-root' }, bg(), topbar('Mission Control // Hub'),
      e('div', { className: 'iq-main' },
        e('button', { className: 'id-back', onClick: onBack }, '‹ Your ideas'),
        e('div', { className: 'id-eyebrow' }, 'Concept hub'),
        e('h1', { className: 'iq-title' }, idea.name),
        capcom('This is ' + idea.name + '. Start with Strategic Planning — the other pillars unlock as the concept firms up.'),
        e('div', { className: 'hub-pillars' },
          PILLARS.map(function (p) {
            var gtmDone = !!(idea.missions && idea.missions.gtm);
            var active = p.id === 'tasks' ? gtmDone : !!p.active;
            var chip = p.id === 'strategic'
              ? (pr.hasPlan ? 'Plan ready' : pr.recon >= 3 ? 'Ready' : pr.recon > 0 ? ('Recon ' + pr.recon + '/3') : 'Start here')
              : p.id === 'persona'
              ? ((idea.personas && idea.personas.length) ? (idea.personas.length + ' in your circle') : 'Meet them')
              : p.id === 'gtm'
              ? (gtmDone ? 'Plan set' : 'Suggest plays')
              : p.id === 'tasks'
              ? (gtmDone ? ((idea.tasks || []).filter(function (t) { return t.done; }).length + '/' + (idea.tasks || []).length + ' done') : 'After GTM')
              : p.id === 'content'
              ? ((idea.content && idea.content.length) ? (idea.content.length + ' made') : 'Make content')
              : 'Soon';
            return e('button', { key: p.id, className: 'hub-pillar' + (active ? '' : ' locked'), style: { '--pl': p.accent, '--pl-dim': p.dim }, onClick: active ? function () { onPillar(p.id); } : undefined },
              e('div', { className: 'hub-pillar-top' },
                e('div', { className: 'hub-pillar-ic' }, e(Icon, { name: active ? p.icon : 'Lock', size: 20 })),
                e('span', { className: 'hub-pillar-chip' + (active ? ' on' : '') }, chip)),
              e('div', { className: 'hub-pillar-label' }, p.label),
              e('div', { className: 'hub-pillar-desc' }, p.desc),
              e('div', { className: 'hub-pillar-cta' }, active ? 'Enter →' : 'Locked'));
          })),
        e('div', { className: 'id-section-label' }, 'Tools'),
        e('button', { className: 'hub-tool', onClick: onCompare },
          e('div', { className: 'hub-tool-ic' }, e(Icon, { name: 'Swords', size: 18 })),
          e('div', { className: 'hub-tool-body' },
            e('div', { className: 'hub-tool-l' }, 'Concept Comparison'),
            e('div', { className: 'hub-tool-s' }, 'Put two ideas head-to-head and let CAPCOM call the stronger concept.')),
          e('div', { className: 'hub-tool-cta' }, 'Open →'))
      )
    );
  }

  window.ClarityIdeasHome = ClarityIdeasHome;
  window.ClarityHub = ClarityHub;
})();
