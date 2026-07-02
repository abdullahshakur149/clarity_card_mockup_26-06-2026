/* ============================================================================
   tasks.js — "My Tasks" pillar. Auto-built from the GTM moves (each move → a few
   concrete steps), auto-scheduled across the next ~3 weeks, and shown as a
   checkable Board or a Calendar. The owner can add their own tasks via a light
   inline quick-add. Completing a task awards XP (flows to the HUD).
     window.ClarityMakeTasks(gtm, profile)  — generator (also called by gtm.js)
     window.ClarityMyTasks({ idea, onChange, onBack })  — the pillar screen
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }

  var XP_TASK = 10;
  var KIND = { pricing: 'var(--clr-cat-gtm)', channel: 'var(--clr-cat-market)', trust: 'var(--clr-cat-positioning)', retention: 'var(--clr-cat-customer)', launch: 'var(--clr-ember)', custom: 'var(--clr-primary)' };
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  var COLS = [{ id: 'todo', label: 'To do' }, { id: 'doing', label: 'In progress' }, { id: 'done', label: 'Done' }];
  var NEXT = { todo: 'doing', doing: 'done', done: 'todo' };
  var ADV_ICON = { todo: 'ArrowRight', doing: 'Check', done: 'RotateCcw' };
  var ADV_TITLE = { todo: 'Start', doing: 'Mark done', done: 'Reopen' };

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function isoOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function today() { try { return new Date(); } catch (_) { return new Date(0); } }
  function shortDate(iso) { if (!iso) return ''; var p = iso.split('-'); return MON[(parseInt(p[1], 10) || 1) - 1] + ' ' + (parseInt(p[2], 10) || 1); }

  /* each GTM move → concrete, checkable steps */
  var STEPS = {
    m_tier: ['Define your good / better / best tiers', 'Set a price for each tier', 'Add the tiers to your menu or site'],
    m_justify: ['List three proofs that justify your price', 'Add a signature touch to your top offer', 'Show that proof on your page'],
    m_bundle: ['Pick 2–3 items for a signature bundle', 'Price the bundle below the sum of parts', 'Feature the bundle on your homepage'],
    m_margin: ['Pick your most-loved item', 'Raise its price 8–12%', 'Watch customer reaction for a week'],
    m_upsell: ['Design one premium add-on', 'Offer it at checkout', 'Track the take-rate for two weeks'],
    p_found: ['Create your Google Business Profile', 'Add 5 photos, hours & contact info', 'Post your first update'],
    p_trust: ['List your last ten happy customers', 'Ask each one for a quick review', 'Add the reviews to your page'],
    p_repeat: ['Design a simple loyalty reward', 'Make a punch card or promo code', 'Tell existing customers about it'],
    p_convert: ['Write a clear first-purchase offer', 'Put it above the fold on your site', 'Give it a two-week deadline'],
    p_book: ['Set up an online booking link', 'Add it to your profile & bio', 'Test the booking flow end-to-end']
  };

  /* moves → scheduled tasks (quick wins first) */
  function makeTasks(gtm, profile) {
    var moves = (gtm && gtm.moves) || [];
    var out = [];
    moves.forEach(function (m) {
      var steps = STEPS[m.id] || [m.title];
      steps.forEach(function (s, si) {
        out.push({ id: m.id + '_' + si, title: s, notes: m.why, kind: m.kind, impact: m.impact, effort: m.effort, status: 'todo', done: false, own: false, sourceMove: m.id });
      });
    });
    var IM = { High: 3, Medium: 2, Low: 1 }, EF = { Low: 3, Medium: 2, High: 1 };
    out.sort(function (a, b) { return ((IM[b.impact] || 2) * 10 + (EF[b.effort] || 2)) - ((IM[a.impact] || 2) * 10 + (EF[a.effort] || 2)); });
    var t0 = today(), off = 1;
    out.forEach(function (t) { t.due = isoOf(addDays(t0, off)); off += (t.effort === 'Low' ? 2 : t.effort === 'High' ? 4 : 3); });
    return out;
  }
  window.ClarityMakeTasks = makeTasks;

  function bg() { return e('div', { className: 'pf-bg' }, e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-grid' }), e('div', { className: 'pf-bg-scan' }), e('div', { className: 'pf-bg-vignette' })); }
  function capcom(line) {
    return e('div', { className: 'capcom' },
      e('div', { className: 'capcom-avatar' }, e('i', null), e('i', null), e('i', null), e('i', null), e('i', null)),
      e('div', { className: 'capcom-body' },
        e('div', { className: 'capcom-name' }, e('b', null, 'CAPCOM'), e('span', null, 'Launch Director')),
        e('div', { className: 'capcom-line' }, line)));
  }
  function shell(inner) {
    return e('div', { className: 'id-root tk-root' }, bg(),
      e('div', { className: 'pf-topbar' },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
          e('span', { className: 'pf-wordmark' }, 'Clarity'),
          e('span', { className: 'pf-hide-sm' }, 'Mission Control // My Tasks')),
        e('div', { className: 'pf-tele' }, e('span', { className: 'pf-hide-sm' }, 'Guidance: CAPCOM'), e('span', { className: 'pf-live' }, e('i', null), 'Live'))),
      e('div', { className: 'id-main' }, inner));
  }

  function kindBadge(kind) { return e('span', { className: 'tk-kind', style: { '--k': KIND[kind] || 'var(--clr-primary)' } }, kind); }

  function taskCard(t, onToggle, onRemove) {
    return e('div', { key: t.id, className: 'tk-card' + (t.done ? ' done' : ''), style: { '--k': KIND[t.kind] || 'var(--clr-primary)' } },
      e('button', { className: 'tk-check', 'aria-label': t.done ? 'Mark not done' : 'Mark done', onClick: function () { onToggle(t.id); } }, t.done && e(Icon, { name: 'Check', size: 13 })),
      e('div', { className: 'tk-body' },
        e('div', { className: 'tk-title' }, t.title),
        e('div', { className: 'tk-meta' },
          kindBadge(t.kind),
          t.own ? e('span', { className: 'tk-own' }, 'yours') : e('span', { className: 'tk-imp ' + String(t.impact).toLowerCase() }, t.impact + ' impact'),
          e('span', { className: 'tk-due' }, e(Icon, { name: 'Calendar', size: 11 }), shortDate(t.due)))),
      e('button', { className: 'tk-x', 'aria-label': 'Remove task', onClick: function () { onRemove(t.id); } }, e(Icon, { name: 'X', size: 13 })));
  }

  function ClarityMyTasks(props) {
    var idea = props.idea || {}, onChange = props.onChange, onBack = props.onBack;
    var gtm = (idea.missions && idea.missions.gtm) || null;
    var tasks = (idea.tasks || []).map(function (t) { var st = t.status || (t.done ? 'done' : 'todo'); return Object.assign({}, t, { status: st, done: st === 'done' }); });

    /* fallback seed (gtm.js already seeds at completion; this covers older ideas) */
    React.useEffect(function () {
      if (gtm && (!idea.tasks || !idea.tasks.length) && window.ClarityMakeTasks && onChange) {
        onChange({ tasks: window.ClarityMakeTasks(gtm, idea.profile || {}) });
      }
    }, []);

    var vw = React.useState('board'); var view = vw[0], setView = vw[1];
    var ad = React.useState(false); var adding = ad[0], setAdding = ad[1];
    var dr = React.useState(''); var draft = dr[0], setDraft = dr[1];
    var wn = React.useState('week'); var when = wn[0], setWhen = wn[1];
    var mo = React.useState(0); var monthOff = mo[0], setMonthOff = mo[1];
    var t0 = today();
    var sd = React.useState(isoOf(t0)); var selDay = sd[0], setSelDay = sd[1];
    var dg = React.useState(null); var dragId = dg[0], setDragId = dg[1];
    var ov = React.useState(null); var overCol = ov[0], setOverCol = ov[1];

    var total = tasks.length, doneN = tasks.filter(function (t) { return t.done; }).length;
    var allDone = total > 0 && doneN === total;
    var pct = total ? Math.round(doneN / total * 100) : 0;

    function persist(next, dxp) { var patch = { tasks: next }; if (dxp) patch.xp = Math.max(0, (idea.xp || 0) + dxp); if (onChange) onChange(patch); }
    function moveTask(id, status) {
      var was = false, nowDone = status === 'done';
      var next = tasks.map(function (t) { if (t.id !== id) return t; was = t.status === 'done'; return Object.assign({}, t, { status: status, done: nowDone }); });
      persist(next, (nowDone && !was) ? XP_TASK : (!nowDone && was) ? -XP_TASK : 0);
    }
    function toggle(id) { var t = tasks.filter(function (x) { return x.id === id; })[0]; if (t) moveTask(id, t.status === 'done' ? 'todo' : 'done'); }
    function remove(id) { persist(tasks.filter(function (t) { return t.id !== id; }), 0); }
    function addOwn() {
      var title = draft.trim(); if (!title) return;
      var off = when === 'week' ? 2 : when === 'next' ? 9 : 16;
      var nt = { id: 'own_' + Date.now(), title: title, notes: 'Your own task', kind: 'custom', impact: 'Medium', effort: 'Medium', status: 'todo', done: false, own: true, due: isoOf(addDays(t0, off)) };
      persist(tasks.concat([nt]), 0); setDraft(''); setWhen('week'); setAdding(false);
    }

    /* header: progress + view toggle */
    function header() {
      return e(React.Fragment, null,
        e('button', { className: 'id-back', onClick: onBack }, '‹ Back to hub'),
        e('div', { className: 'tk-head' },
          e('div', null,
            e('div', { className: 'id-eyebrow' }, 'Pillar · My Tasks'),
            e('h1', { className: 'tk-title-h' }, 'Your launch plan')),
          e('div', { className: 'tk-seg' },
            e('button', { className: 'tk-vt' + (view === 'board' ? ' on' : ''), onClick: function () { setView('board'); } }, e(Icon, { name: 'ListChecks', size: 13 }), 'Board'),
            e('button', { className: 'tk-vt' + (view === 'calendar' ? ' on' : ''), onClick: function () { setView('calendar'); } }, e(Icon, { name: 'CalendarDays', size: 13 }), 'Calendar'))),
        e('div', { className: 'tk-progress' },
          e('div', { className: 'tk-progress-bar' }, e('div', { className: 'tk-progress-fill', style: { width: pct + '%' } })),
          e('div', { className: 'tk-progress-l' }, doneN + ' / ' + total + ' done')),
        allDone && e('div', { className: 'tk-celebrate' }, e(Icon, { name: 'PartyPopper', size: 15 }), 'Plan complete — every play is live. Nice work, operator.'));
    }

    /* quick-add (light inline composer) */
    function quickAdd() {
      if (!adding) return e('button', { className: 'tk-add', onClick: function () { setAdding(true); } }, e(Icon, { name: 'Plus', size: 15 }), 'Add your own task');
      return e('div', { className: 'tk-add-open' },
        e('input', { className: 'tk-add-input', autoFocus: true, value: draft, placeholder: 'What needs doing?', onChange: function (ev) { setDraft(ev.target.value); }, onKeyDown: function (ev) { if (ev.key === 'Enter') addOwn(); if (ev.key === 'Escape') { setAdding(false); setDraft(''); } } }),
        e('div', { className: 'tk-add-when' }, [['week', 'This week'], ['next', 'Next week'], ['later', 'Later']].map(function (w) {
          return e('button', { key: w[0], className: 'tk-when' + (when === w[0] ? ' on' : ''), onClick: function () { setWhen(w[0]); } }, w[1]);
        })),
        e('div', { className: 'tk-add-row' },
          e('button', { className: 'id-back', onClick: function () { setAdding(false); setDraft(''); } }, 'Cancel'),
          e('button', { className: 'pf-cta tk-cta', onClick: addOwn, disabled: !draft.trim() }, 'Add task')));
    }

    /* ── BOARD (kanban: drag-and-drop + click-to-advance) ── */
    if (view === 'board') {
      var byDue = function (a, b) { return (a.due || '') < (b.due || '') ? -1 : 1; };
      function kanbanCard(t) {
        return e('div', { key: t.id, className: 'kb-card' + (dragId === t.id ? ' dragging' : ''), style: { '--k': KIND[t.kind] || 'var(--clr-primary)' },
          draggable: true,
          onDragStart: function (ev) { try { ev.dataTransfer.setData('text/plain', t.id); ev.dataTransfer.effectAllowed = 'move'; } catch (_) {} setDragId(t.id); },
          onDragEnd: function () { setDragId(null); setOverCol(null); } },
          e('div', { className: 'kb-card-top' }, kindBadge(t.kind), t.own ? e('span', { className: 'tk-own' }, 'yours') : e('span', { className: 'tk-imp ' + String(t.impact).toLowerCase() }, t.impact)),
          e('div', { className: 'kb-card-title' }, t.title),
          e('div', { className: 'kb-card-foot' },
            e('span', { className: 'tk-due' }, e(Icon, { name: 'Calendar', size: 11 }), shortDate(t.due)),
            e('div', { className: 'kb-actions' },
              e('button', { className: 'kb-adv', title: ADV_TITLE[t.status], onClick: function () { moveTask(t.id, NEXT[t.status]); } }, e(Icon, { name: ADV_ICON[t.status], size: 13 })),
              e('button', { className: 'tk-x', title: 'Remove', onClick: function () { remove(t.id); } }, e(Icon, { name: 'X', size: 12 })))));
      }
      function column(col) {
        var list = tasks.filter(function (t) { return t.status === col.id; }).sort(byDue);
        return e('div', { key: col.id, className: 'kb-col kb-' + col.id + (overCol === col.id ? ' over' : ''),
          onDragOver: function (ev) { ev.preventDefault(); try { ev.dataTransfer.dropEffect = 'move'; } catch (_) {} if (overCol !== col.id) setOverCol(col.id); },
          onDrop: function (ev) { ev.preventDefault(); var id; try { id = ev.dataTransfer.getData('text/plain'); } catch (_) {} id = id || dragId; if (id) moveTask(id, col.id); setOverCol(null); setDragId(null); } },
          e('div', { className: 'kb-col-h' }, e('span', { className: 'kb-col-l' }, col.label), e('span', { className: 'kb-col-n' }, list.length)),
          e('div', { className: 'kb-col-body' }, list.length ? list.map(kanbanCard) : e('div', { className: 'kb-drop' }, 'Drop here')));
      }
      return shell(e(React.Fragment, null,
        header(),
        capcom('Your launch board. Drag a card across the columns as you work it — or tap the arrow. Add your own tasks anytime.'),
        quickAdd(),
        e('div', { className: 'kb-board' }, COLS.map(column))
      ));
    }

    /* ── CALENDAR ── */
    var base = new Date(t0.getFullYear(), t0.getMonth() + monthOff, 1);
    var year = base.getFullYear(), month = base.getMonth();
    var daysIn = new Date(year, month + 1, 0).getDate();
    var startDow = new Date(year, month, 1).getDay();
    var cells = [];
    for (var b = 0; b < startDow; b++) cells.push(null);
    for (var d = 1; d <= daysIn; d++) cells.push(d);
    var todayIso = isoOf(t0);
    function dayIso(day) { return year + '-' + pad(month + 1) + '-' + pad(day); }
    var selTasks = tasks.filter(function (t) { return t.due === selDay; }).sort(function (a, b) { return a.done - b.done; });

    return shell(e(React.Fragment, null,
      header(),
      capcom('Here’s your plan on a calendar. Tap a day to see what’s due.'),
      quickAdd(),
      e('div', { className: 'tk-cal' },
        e('div', { className: 'tk-cal-head' },
          e('button', { className: 'tk-cal-nav', onClick: function () { setMonthOff(monthOff - 1); } }, e(Icon, { name: 'ChevronLeft', size: 16 })),
          e('span', { className: 'tk-cal-title' }, MON[month] + ' ' + year),
          e('button', { className: 'tk-cal-nav', onClick: function () { setMonthOff(monthOff + 1); } }, e(Icon, { name: 'ChevronRight', size: 16 }))),
        e('div', { className: 'tk-cal-grid' },
          DOW.map(function (dn, i) { return e('span', { key: 'h' + i, className: 'tk-cal-dow' }, dn); }),
          cells.map(function (day, i) {
            if (!day) return e('span', { key: 'b' + i, className: 'tk-cal-cell empty' });
            var iso = dayIso(day);
            var dts = tasks.filter(function (t) { return t.due === iso; });
            var allD = dts.length && dts.every(function (t) { return t.done; });
            return e('button', { key: iso, className: 'tk-cal-cell' + (iso === todayIso ? ' today' : '') + (iso === selDay ? ' sel' : ''), onClick: function () { setSelDay(iso); } },
              e('span', { className: 'tk-cal-d' }, day),
              dts.length ? e('span', { className: 'tk-cal-dots' + (allD ? ' alldone' : '') }, dts.slice(0, 3).map(function (t, di) { return e('i', { key: di, style: { background: KIND[t.kind] || 'var(--clr-primary)' } }); })) : null);
          }))),
      e('div', { className: 'tk-day' },
        e('div', { className: 'tk-day-h' }, shortDate(selDay) + (selDay === todayIso ? ' · Today' : '')),
        selTasks.length ? selTasks.map(function (t) { return taskCard(t, toggle, remove); }) : e('div', { className: 'tk-empty' }, 'Nothing due this day.'))
    ));
  }

  window.ClarityMyTasks = ClarityMyTasks;
})();
