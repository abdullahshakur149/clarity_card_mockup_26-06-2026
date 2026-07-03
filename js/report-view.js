/* ============================================================================
   report-view.js — shared reader for the recon reports. Renders a report's
   sections in one of two viewer modes with a toggle:
     • Accordion — collapsible rows, the verdict open by default
     • Tabs      — one section at a time, the verdict first
   Each section earns a "Viewed" badge once the reader reaches its END — an
   IntersectionObserver watches an end-of-section sentinel, so a short section
   counts after a brief dwell while a long one counts only when you scroll to the
   bottom. A "N of M read" counter tracks the whole report. Viewed + layout state
   is session-level (survives navigation, resets on reload). Lives inside .rc-doc,
   so it inherits the report's accent + Day/Night theme. Exposes ClarityReportBody.
     props: { sections: [{ id, label, node }], storeKey }
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }

  var STORE = 'clarity_report_view';
  function loadView() { try { var v = localStorage.getItem(STORE); return v === 'tabs' ? 'tabs' : 'accordion'; } catch (_) { return 'accordion'; } }
  function saveView(v) { try { localStorage.setItem(STORE, v); } catch (_) {} }

  /* viewed-state is session-level: a window store keyed per report, so badges
     survive navigating away and back, but a fresh reload starts clean. */
  function viewedStore() { window.__clarityReportViewed = window.__clarityReportViewed || {}; return window.__clarityReportViewed; }
  function loadViewed(key) { var s = viewedStore()[key]; return s ? Object.assign({}, s) : {}; }

  /* renders an invisible end-of-section anchor; fires onSeen once it has been in
     view for a short dwell (so a flash while fast-scrolling doesn't count). */
  function Sentinel(props) {
    var ref = React.useRef(null);
    React.useEffect(function () {
      if (props.done) return;
      if (typeof IntersectionObserver === 'undefined') { var ft = setTimeout(props.onSeen, 1200); return function () { clearTimeout(ft); }; }
      var el = ref.current; if (!el) return;
      var timer = null;
      var io = new IntersectionObserver(function (entries) {
        var vis = entries[0] && entries[0].isIntersecting;
        if (vis) { if (!timer) timer = setTimeout(function () { timer = null; props.onSeen(); }, props.dwell || 700); }
        else if (timer) { clearTimeout(timer); timer = null; }
      }, { root: null, threshold: 0.01 });
      io.observe(el);
      return function () { if (timer) clearTimeout(timer); io.disconnect(); };
    }, [props.done]);
    return e('div', { className: 'rc-seen-anchor', ref: ref, 'aria-hidden': 'true' });
  }

  function ClarityReportBody(props) {
    var sections = props.sections || [];
    var storeKey = props.storeKey || 'report';
    var accordionOnly = !!props.accordionOnly;   /* Strategic Plan: accordion, no toggle */
    var firstId = sections.length ? sections[0].id : null;

    var vv = React.useState(accordionOnly ? 'accordion' : loadView()); var view = vv[0], setView = vv[1];
    var oo = React.useState(function () { var o = {}; if (firstId) o[firstId] = true; return o; }); var open = oo[0], setOpen = oo[1];  /* accordion — verdict open */
    var aa = React.useState(firstId); var active = aa[0], setActive = aa[1];  /* tabs — verdict first */
    var wv = React.useState(function () { return loadViewed(storeKey); }); var viewed = wv[0], setViewed = wv[1];
    var stats = props.stats || [];
    var op = React.useState(!stats.length); var opened = op[0], setOpened = op[1];   /* glance first, full report on demand */

    React.useEffect(function () { viewedStore()[storeKey] = viewed; }, [viewed, storeKey]);

    function pickView(v) { setView(v); saveView(v); }
    function toggle(id) { setOpen(function (x) { var o = Object.assign({}, x); o[id] = !o[id]; return o; }); }
    function markViewed(id) { setViewed(function (v) { if (v[id]) return v; var o = Object.assign({}, v); o[id] = true; return o; }); }
    var activeSec = sections.filter(function (s) { return s.id === active; })[0] || sections[0] || null;

    var total = sections.length;
    var seen = sections.filter(function (s) { return viewed[s.id]; }).length;
    var allSeen = total > 0 && seen === total;

    var statsNode = stats.length ? e('div', { className: 'rc-ov' }, stats.map(function (s, i) {
      return e('div', { key: i, className: 'rc-ov-card' },
        e('div', { className: 'rc-ov-v' }, s.value),
        e('div', { className: 'rc-ov-l' }, s.label),
        s.note ? e('div', { className: 'rc-ov-n ' + (s.tone || 'neutral') }, s.note) : null);
    })) : null;

    var full = e(React.Fragment, null,
      /* progress counter (left) + view toggle (right) */
      e('div', { className: 'rc-view-bar' },
        e('span', { className: 'rc-seen-count' + (allSeen ? ' done' : '') },
          allSeen ? e(React.Fragment, null, e(Icon, { name: 'CheckCheck', size: 13 }), 'All ' + total + ' read')
                  : (seen + ' of ' + total + ' read')),
        !accordionOnly && e('div', { className: 'rc-seg', role: 'tablist', 'aria-label': 'Report layout' },
          e('button', { className: 'rc-vt' + (view === 'accordion' ? ' on' : ''), onClick: function () { pickView('accordion'); } },
            e(Icon, { name: 'Rows3', size: 13 }), 'Accordion'),
          e('button', { className: 'rc-vt' + (view === 'tabs' ? ' on' : ''), onClick: function () { pickView('tabs'); } },
            e(Icon, { name: 'PanelTop', size: 13 }), 'Tabs'))),

      view === 'accordion'
        ? e('div', { className: 'rc-acc' }, sections.map(function (s) {
            var isOpen = !!open[s.id];
            return e('div', { key: s.id, className: 'rc-acc-item' + (isOpen ? ' open' : '') },
              e('button', { className: 'rc-acc-head', onClick: function () { toggle(s.id); }, 'aria-expanded': isOpen ? 'true' : 'false' },
                e('span', { className: 'rc-acc-label' }, s.label),
                e('span', { className: 'rc-acc-head-r' },
                  viewed[s.id] && e('span', { className: 'rc-seen' }, e(Icon, { name: 'Check', size: 11 }), 'Viewed'),
                  e('span', { className: 'rc-acc-chev' }, e(Icon, { name: 'ChevronDown', size: 17 })))),
              isOpen && e('div', { className: 'rc-acc-body' }, s.node,
                e(Sentinel, { done: !!viewed[s.id], onSeen: function () { markViewed(s.id); } })));
          }))
        : e('div', { className: 'rc-tabwrap' },
            e('div', { className: 'rc-tabs', role: 'tablist' }, sections.map(function (s) {
              return e('button', { key: s.id, className: 'rc-tab' + (s.id === active ? ' on' : ''), role: 'tab', 'aria-selected': s.id === active ? 'true' : 'false', onClick: function () { setActive(s.id); } },
                s.label, viewed[s.id] && e('span', { className: 'rc-tab-seen' }, e(Icon, { name: 'Check', size: 11 })));
            })),
            activeSec && e('div', { className: 'rc-tabpanel', key: activeSec.id, role: 'tabpanel' }, activeSec.node,
              e(Sentinel, { done: !!viewed[activeSec.id], onSeen: function () { markViewed(activeSec.id); } })))
    );

    return e('div', { className: 'rc-view' },
      statsNode,
      stats.length ? e('div', { className: 'rc-seeall-wrap' },
        e('button', { className: 'rc-seeall' + (opened ? ' open' : ''), onClick: function () { setOpened(!opened); } },
          opened ? 'Hide the full report' : 'See the full report',
          e(Icon, { name: opened ? 'ChevronUp' : 'ChevronDown', size: 15 }))) : null,
      opened ? full : null);
  }

  window.ClarityReportBody = ClarityReportBody;

  /* ClarityReportRoster — the "past scans" list a mission shows on landing.
     Browse any report, run another, or star which one feeds the Plan + Compare.
     props: { reports, primaryId, accent, eyebrow, title, newLabel, fallbackTitle,
              onOpen(id), onNew(), onSetPrimary(id) } */
  function ClarityReportRoster(props) {
    var reports = props.reports || [], primaryId = props.primaryId;
    return e('div', { className: 'rr', style: { '--rr-accent': props.accent || 'var(--clr-primary)' } },
      e('div', { className: 'rr-head' },
        e('div', null,
          e('div', { className: 'rr-eyebrow' }, props.eyebrow || 'Your research'),
          e('h1', { className: 'rr-title' }, props.title || 'Your reports')),
        e('button', { className: 'pf-cta mm-cta', onClick: props.onNew }, props.newLabel || 'Run a fresh look →')),
      e('div', { className: 'rr-list' }, reports.map(function (rep) {
        var isP = rep.id === primaryId;
        return e('div', { key: rep.id, className: 'rr-card' + (isP ? ' primary' : '') },
          e('button', { className: 'rr-card-main', onClick: function () { props.onOpen(rep.id); } },
            e('div', { className: 'rr-card-top' },
              e('span', { className: 'rr-card-title' }, rep.region || rep.category || props.fallbackTitle || 'Report'),
              e('span', { className: 'rr-status ' + (rep.status === 'generating' ? 'generating' : 'ready') }, e('i', null), rep.status === 'generating' ? 'Generating…' : 'Ready')),
            e('div', { className: 'rr-card-verdict' }, rep.verdict || ''),
            e('div', { className: 'rr-card-meta' }, (rep.date || '') + (isP ? '  ·  Primary — feeds your Plan' : ''))),
          e('button', { className: 'rr-star' + (isP ? ' on' : ''), title: isP ? 'Primary report' : 'Make this the primary', 'aria-label': 'Set primary', onClick: function () { props.onSetPrimary(rep.id); } },
            e(Icon, { name: 'Star', size: 15 })));
      })));
  }

  window.ClarityReportRoster = ClarityReportRoster;
})();
