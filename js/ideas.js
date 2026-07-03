/* ============================================================================
   ideas.js — "Your Ideas" home + per-idea "Home base" (pillars + Tools).
   Exposes window.ClarityIdeasHome({ ideas, onOpen, onNew }) and
           window.ClarityHub({ idea, onPillar, onBack, onCompare }).
   An idea is the top-level concept; each has its own home base. Strategic
   Planning inside it is the existing ClarityIntel (groundwork + plan).
   Journey tone / teal.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }

  var SECTOR_NAME = { food: 'Food & hospitality', retail: 'Retail & products', creative: 'Creative & services', tech: 'Software & tech', trades: 'Trades & services', other: 'Business' };

  var PILLARS = [
    { id: 'strategic', label: 'Strategic Planning', icon: 'Map', accent: 'var(--clr-cat-market)', dim: 'var(--clr-cat-market-dim)', desc: 'Get to know your market, your customers and the landscape — then your plan comes together.', active: true },
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
    if (p.recon > 0) return { label: 'Groundwork ' + p.recon + ' of 3', cls: '' };
    return { label: 'New', cls: '' };
  }

  function bg() { return e('div', { className: 'pf-bg' }, e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-vignette' })); }
  function topbar(sub) {
    return e('div', { className: 'pf-topbar' },
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
        e('span', { className: 'pf-wordmark' }, 'Clarity'),
        e('span', { className: 'pf-hide-sm' }, sub)));
  }
  /* the voice of Clarity — unattributed (reuses .capcom styles) */
  function voice(line) {
    return e('div', { className: 'capcom' },
      e('div', { className: 'capcom-body' },
        e('div', { className: 'capcom-line' }, line)));
  }

  /* ── Your Ideas (home) ── */
  function ClarityIdeasHome(props) {
    var ideas = props.ideas || [], onOpen = props.onOpen, onNew = props.onNew;
    return e('div', { className: 'iq-root' }, bg(), topbar('All your ideas'),
      e('div', { className: 'iq-main' },
        e('div', { className: 'id-eyebrow' }, 'Welcome back'),
        e('h1', { className: 'iq-title' }, 'Your ideas'),
        voice(ideas.length > 1 ? 'Pick an idea to keep working on, start a new one — or see how two compare.' : 'Open your idea and keep building — or start a second one to compare.'),
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
                e('div', { className: 'iq-prog' }, [0, 1, 2].map(function (n) { return e('span', { key: n, className: 'iq-dot' + (pr.recon > n ? ' on' : '') }); }), e('span', { className: 'iq-prog-l' }, 'Groundwork')),
                (score != null && pr.hasPlan) ? e('div', { className: 'iq-score' }, e('b', null, score), e('span', null, 'Score')) : e('div', { className: 'iq-open' }, 'Open →')));
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
    var nd = React.useState(false); var nudgeDismissed = nd[0], setNudgeDismissed = nd[1];
    var starterN = (idea.content || []).filter(function (p) { return p && p.starter; }).length;
    var showStarterNudge = starterN > 0 && !idea.starterContentSeen;
    return e('div', { className: 'iq-root' }, bg(), topbar('Your journey · ' + (idea.name || 'Home base')),
      e('div', { className: 'iq-main' },
        e('button', { className: 'id-back', onClick: onBack }, '‹ Your ideas'),
        e('div', { className: 'id-eyebrow' }, 'Home base'),
        e('h1', { className: 'iq-title' }, idea.name),
        voice('This is ' + idea.name + '’s home base. Start with Strategic Planning — everything else builds on it.'),
        showStarterNudge && !nudgeDismissed && e('div', { className: 'hub-nudge' },
          e('div', { className: 'hub-nudge-ic' }, e(Icon, { name: 'Sparkles', size: 16 })),
          e('div', { className: 'hub-nudge-body' },
            e('div', { className: 'hub-nudge-t' }, starterN + ' pieces are drafted from your strategy'),
            e('div', { className: 'hub-nudge-s' }, 'A head start is waiting in the Content Engine — take a look.')),
          e('button', { className: 'hub-nudge-cta', onClick: function () { onPillar('content'); } }, 'Open →'),
          e('button', { className: 'hub-nudge-x', 'aria-label': 'Dismiss', onClick: function () { setNudgeDismissed(true); } }, e(Icon, { name: 'X', size: 14 }))),
        e('div', { className: 'hub-pillars' },
          PILLARS.map(function (p) {
            var mi = idea.missions || {};
            /* unlock chain: Strategic → Persona → GTM → Tasks; Content opens with Persona */
            var planDone = !!mi.plan;
            var personaDone = (idea.personas || []).some(function (x) { return x && x.met; });
            var gtmDone = !!mi.gtm;
            var active =
                p.id === 'strategic' ? true
              : p.id === 'persona'   ? planDone
              : p.id === 'gtm'       ? personaDone
              : p.id === 'content'   ? personaDone
              : p.id === 'tasks'     ? gtmDone
              : !!p.active;
            var chip = p.id === 'strategic'
              ? (pr.hasPlan ? 'Plan ready' : pr.recon >= 3 ? 'Ready' : pr.recon > 0 ? ('Groundwork ' + pr.recon + ' of 3') : 'Start here')
              : p.id === 'persona'
              ? (!planDone ? 'After the plan' : (idea.personas && idea.personas.length) ? (idea.personas.length + ' in your circle') : 'Meet them')
              : p.id === 'gtm'
              ? (!personaDone ? 'After Persona' : gtmDone ? 'Plan set' : 'Suggest plays')
              : p.id === 'tasks'
              ? (!gtmDone ? 'After GTM' : ((idea.tasks || []).filter(function (t) { return t.done; }).length + ' of ' + (idea.tasks || []).length + ' done'))
              : p.id === 'content'
              ? (!personaDone ? 'After Persona' : (showStarterNudge ? (starterN + ' drafts ready') : (idea.content && idea.content.length) ? (idea.content.length + ' made') : 'Make content'))
              : 'Soon';
            var chipHot = p.id === 'content' && showStarterNudge;
            return e('button', { key: p.id, className: 'hub-pillar' + (active ? '' : ' locked') + (chipHot ? ' hot' : ''), style: { '--pl': p.accent, '--pl-dim': p.dim }, onClick: active ? function () { onPillar(p.id); } : undefined },
              e('div', { className: 'hub-pillar-top' },
                e('div', { className: 'hub-pillar-ic' }, e(Icon, { name: active ? p.icon : 'Lock', size: 20 })),
                e('span', { className: 'hub-pillar-chip' + (active ? ' on' : '') + (chipHot ? ' hot' : '') }, chip)),
              e('div', { className: 'hub-pillar-label' }, p.label),
              e('div', { className: 'hub-pillar-desc' }, p.desc),
              e('div', { className: 'hub-pillar-cta' }, active ? 'Enter →' : 'Locked'));
          })),
        e('div', { className: 'id-section-label' }, 'Tools'),
        e('button', { className: 'hub-tool', onClick: onCompare },
          e('div', { className: 'hub-tool-ic' }, e(Icon, { name: 'Scale', size: 18 })),
          e('div', { className: 'hub-tool-body' },
            e('div', { className: 'hub-tool-l' }, 'Concept Comparison'),
            e('div', { className: 'hub-tool-s' }, 'Put two ideas side by side and see which one is stronger today.')),
          e('div', { className: 'hub-tool-cta' }, 'Open →'))
      )
    );
  }

  window.ClarityIdeasHome = ClarityIdeasHome;
  window.ClarityHub = ClarityHub;
})();
