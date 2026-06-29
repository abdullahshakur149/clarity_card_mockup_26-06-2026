/* shell.js — compiled from shell.jsx (no build step needed) */
(function () {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Clarity UI Kit — gamified onboarding shell.
   Onboarding ladder: the user starts with ONLY Intelligence enabled; every other
   pillar is disabled. Each pillar has a centered "Mark complete" action — completing
   it pops a Congratulations dialog (points earned + progress toward free access to
   Clara) and unlocks the next pillar in sequence:
     Intelligence → Audience → Tasks → Content Engine → Campaigns
   Sidebar order matches: Content Engine before Campaigns. Composes DS primitives
   + the screens/campaign modules. Exposes <ClarityApp/> on window. */
const SDS = window.ClarityDesignSystem_29c088;
const {
  Button,
  Card,
  Pill,
  Dialog,
  Icon
} = SDS;
const SData = window.ClarityData;
const ORDER = SData.PILLARS.map(p => p.id);

/* ---------- gamification animation kit ---------- */
// Global keyframes, injected once.
function GameAnims() {
  return /*#__PURE__*/React.createElement("style", null, `
    @keyframes pop-in { 0%{transform:scale(.7)} 60%{transform:scale(1.04)} 100%{transform:scale(1)} }
    @keyframes badge-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
    @keyframes ring-spin { to { transform: rotate(360deg); } }
    @keyframes confetti-fall {
      0%   { transform: translate(0,0) rotate(0deg); opacity: 1; }
      100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; }
    }
    @keyframes unlock-pop { 0%{transform:scale(1)} 30%{transform:scale(1.05);background:var(--clr-reward-dim)} 100%{transform:scale(1)} }
    @keyframes sheen { 0%{background-position:-180% 0} 100%{background-position:280% 0} }
    @media (prefers-reduced-motion: reduce) {
      .anim-pop, .anim-badge, .confetti-piece, .unlock-row { animation: none !important; }
    }
  `);
}

// Number that counts up from 0 → value over `dur` ms when `run` flips true.
function CountUp({
  value,
  run,
  dur = 900,
  prefix = '',
  style
}) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (!run) {
      setN(0);
      return;
    }
    let raf, start;
    const tick = t => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const safety = setTimeout(() => setN(value), dur + 120); // guarantee final value even if rAF is throttled
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
  }, [run, value, dur]);
  return /*#__PURE__*/React.createElement("span", {
    style: style
  }, prefix, n);
}

// One-shot confetti burst radiating from center. Renders nothing once spent.
function Confetti({
  fire,
  count = 40
}) {
  const pieces = React.useMemo(() => {
    const cols = ['var(--clr-reward)', 'var(--clr-ember)', 'var(--clr-primary-hover)', 'var(--clr-accent)', 'var(--clr-audio-mod)'];
    return Array.from({
      length: count
    }, (_, i) => {
      const ang = Math.PI * 2 * i / count + Math.random() * 0.5;
      const dist = 120 + Math.random() * 200;
      return {
        dx: Math.cos(ang) * dist + 'px',
        dy: Math.sin(ang) * dist + 220 + 'px',
        rot: Math.random() * 720 - 360 + 'deg',
        col: cols[i % cols.length],
        delay: Math.random() * 0.18,
        dur: 1.1 + Math.random() * 0.8,
        size: 7 + Math.random() * 7,
        round: Math.random() > 0.5
      };
    });
  }, [fire, count]);
  if (!fire) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -8,
      left: '50%',
      width: 0,
      height: 0,
      pointerEvents: 'none',
      zIndex: 5
    }
  }, pieces.map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "confetti-piece",
    style: {
      position: 'absolute',
      width: p.size,
      height: p.size,
      background: p.col,
      borderRadius: p.round ? '50%' : 2,
      left: -p.size / 2,
      top: 0,
      '--dx': p.dx,
      '--dy': p.dy,
      '--rot': p.rot,
      animation: `confetti-fall ${p.dur}s cubic-bezier(.2,.6,.35,1) ${p.delay}s forwards`
    }
  })));
}

/* ---------- progress ring (gamification) ---------- */
function Ring({
  pct,
  color,
  size = 26,
  glow = false
}) {
  const r = (size - 4) / 2,
    c = 2 * Math.PI * r;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)',
      flexShrink: 0,
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--clr-border)",
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: color,
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: c * (1 - pct / 100),
    style: {
      transition: 'stroke-dashoffset .7s cubic-bezier(.3,.8,.3,1)',
      filter: glow ? `drop-shadow(0 0 4px ${color})` : 'none'
    }
  }));
}

/* ---------- linear meter ---------- */
function Meter({
  pct,
  color = 'var(--clr-primary)',
  height = 8
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      borderRadius: height / 2,
      background: 'var(--clr-border)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${Math.min(100, pct)}%`,
      background: color,
      borderRadius: height / 2,
      transition: 'width .5s var(--ease)'
    }
  }));
}

/* ---------- one pillar row (supports nesting) ---------- */
function PillarRow({
  pl,
  depth,
  active,
  unlocked,
  isDone,
  onNav,
  popping,
  glow
}) {
  const nested = depth > 0;
  const ringSize = nested ? 22 : 26;
  const iconSize = nested ? 12 : 14;
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onNav(pl.id),
    className: popping ? 'unlock-row' : '',
    title: unlocked ? '' : 'Recommended after earlier pillars — click to see why',
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: nested ? '7px 16px 7px 40px' : '9px 16px',
      cursor: 'pointer',
      position: 'relative',
      opacity: unlocked ? 1 : 0.5,
      animation: popping ? 'unlock-pop .7s var(--ease)' : undefined,
      background: active === pl.id ? 'var(--clr-primary-dim)' : 'transparent',
      transition: 'background var(--dur-fast) var(--ease), opacity var(--dur-fast) var(--ease)'
    }
  }, active === pl.id && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      background: 'var(--clr-primary)',
      borderRadius: '0 2px 2px 0'
    }
  }), nested && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 24,
      top: -2,
      width: 11,
      height: 'calc(50% + 2px)',
      borderLeft: '1px solid var(--clr-border-strong)',
      borderBottom: '1px solid var(--clr-border-strong)',
      borderBottomLeftRadius: 6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Ring, {
    pct: isDone ? 100 : 0,
    color: pl.accent,
    size: ringSize,
    glow: glow
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      color: active === pl.id ? 'var(--clr-text)' : 'var(--clr-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: pl.icon,
    size: iconSize,
    strokeWidth: 2
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: active === pl.id ? 'var(--clr-text)' : 'var(--clr-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, pl.label, !unlocked && /*#__PURE__*/React.createElement(Icon, {
    name: "Lock",
    size: 11,
    color: "var(--clr-faint)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: isDone ? 'var(--clr-accent)' : 'var(--clr-muted)',
      marginTop: 1,
      fontFamily: 'var(--font-mono)',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, isDone && /*#__PURE__*/React.createElement(Icon, {
    name: "Check",
    size: 11
  }), isDone ? `complete · ${pl.reward} pts` : `+${pl.reward} pts`)));
}

/* ---------- sidebar ---------- */
function Sidebar({
  active,
  completed,
  isUnlocked,
  onNav,
  earned,
  justUnlocked,
  justCompleted
}) {
  const pct = Math.round(earned / SData.CLARA_GOAL * 100);
  const done = earned >= SData.CLARA_GOAL;
  const topPillars = SData.PILLARS.filter(p => !p.parent);
  const childrenOf = id => SData.PILLARS.filter(p => p.parent === id);
  const rowProps = pl => ({
    pl,
    active,
    unlocked: isUnlocked(pl.id),
    isDone: !!completed[pl.id],
    onNav,
    popping: justUnlocked === pl.id,
    glow: justCompleted === pl.id
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 240,
      minWidth: 240,
      height: '100%',
      background: 'var(--clr-card)',
      borderRight: '1px solid var(--clr-border)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 18px 18px',
      borderBottom: '1px solid var(--clr-border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 28,
      fontWeight: 700,
      color: 'var(--clr-primary)',
      lineHeight: 1
    }
  }, "Clarity"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      color: 'var(--clr-muted)',
      marginTop: 6
    }
  }, "Content OS")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: 'var(--clr-muted)',
      padding: '16px 16px 6px'
    }
  }, "The four pillars"), topPillars.map(pl => /*#__PURE__*/React.createElement(React.Fragment, {
    key: pl.id
  }, /*#__PURE__*/React.createElement(PillarRow, _extends({}, rowProps(pl), {
    depth: 0
  })), childrenOf(pl.id).map(ch => /*#__PURE__*/React.createElement(PillarRow, _extends({
    key: ch.id
  }, rowProps(ch), {
    depth: 1
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 14,
      padding: 14,
      background: 'var(--clr-card-2)',
      border: `1px solid ${done ? 'var(--clr-accent)' : 'var(--clr-border)'}`,
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--clr-text)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: done ? 'Sparkles' : 'LockKeyhole',
    size: 13,
    color: done ? 'var(--clr-accent)' : 'var(--clr-primary-hover)'
  }), done ? 'Clara unlocked' : 'Unlock Clara'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--clr-muted)',
      fontFamily: 'var(--font-mono)'
    }
  }, earned, "/", SData.CLARA_GOAL)), /*#__PURE__*/React.createElement(Meter, {
    pct: pct,
    color: done ? 'var(--clr-accent)' : 'var(--clr-primary)',
    height: 5
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: 'var(--clr-muted)',
      marginTop: 7
    }
  }, done ? 'Free access to Clara is yours' : `${SData.CLARA_GOAL - earned} pts to free access`)));
}

/* ---------- onboarding pillar screen (the not-yet-built pillars) ---------- */
function PillarOnboarding({
  pillar,
  completed,
  onComplete
}) {
  const isDone = completed[pillar.id];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 540,
      margin: '0 auto',
      padding: '110px 28px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      height: 72,
      borderRadius: 18,
      background: `color-mix(in srgb, ${pillar.accent} 16%, transparent)`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 22,
      color: pillar.accent
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: pillar.icon,
    size: 32,
    strokeWidth: 1.75
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-display-lg)',
      color: 'var(--clr-text)',
      margin: 0
    }
  }, pillar.label), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--clr-muted)',
      marginTop: 12,
      lineHeight: 1.6
    }
  }, pillar.blurb, ". Work through this step, then mark it complete to earn ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--clr-text)'
    }
  }, pillar.reward, " pts"), " and unlock the next pillar."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, isDone ? /*#__PURE__*/React.createElement(Pill, {
    tone: "green",
    dot: true
  }, "Completed \xB7 ", pillar.reward, " pts earned") : /*#__PURE__*/React.createElement(Button, {
    onClick: () => onComplete(pillar.id),
    accent: pillar.accent,
    style: {
      padding: '12px 24px',
      fontSize: 14
    }
  }, "Mark ", pillar.label, " complete \u2192")));
}

/* ---------- completion bar for the built-out workspaces ---------- */
function CompletionBar({
  pillar,
  onComplete
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 20px',
      background: 'var(--clr-card-2)',
      borderBottom: '1px solid var(--clr-border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: pillar.accent,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: pillar.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 13,
      color: 'var(--clr-muted)'
    }
  }, "You're exploring ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--clr-text)'
    }
  }, pillar.label), ". Mark it complete to earn ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--clr-text)'
    }
  }, pillar.reward, " pts"), pillar.id === 'content' ? ' and unlock Campaigns.' : ' toward free Clara access.'), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onComplete(pillar.id),
    accent: pillar.accent
  }, "Mark complete"));
}

/* ---------- app ---------- */
function ClarityApp() {
  const [active, setActive] = React.useState('intelligence'); // onboarding starts on Intelligence
  const [completed, setCompleted] = React.useState({}); // pillar id -> true
  const [congrats, setCongrats] = React.useState(null); // { pillar, earned, next }
  const [congratsRun, setCongratsRun] = React.useState(false); // triggers count-up + confetti
  const [justUnlocked, setJustUnlocked] = React.useState(null); // pillar id to pop in the sidebar
  const [justCompleted, setJustCompleted] = React.useState(null); // pillar id whose ring glows as it draws
  const [nudge, setNudge] = React.useState(null); // { clicked, prereq } recommendation
  const [acknowledged, setAcknowledged] = React.useState({}); // pillar ids the user chose to enter early
  const [view, setView] = React.useState('engine'); // engine | studio | campaigns | campaign-detail
  const [studioKey, setStudioKey] = React.useState('text');
  const [campaignId, setCampaignId] = React.useState('c1');
  const [campFlow, setCampFlow] = React.useState(false);
  const [justLaunched, setJustLaunched] = React.useState(false);

  // A pillar is unlocked if it's first, or the previous pillar in ORDER is completed.
  function isUnlocked(id) {
    const i = ORDER.indexOf(id);
    return i === 0 || !!completed[ORDER[i - 1]];
  }
  const earned = SData.PILLARS.filter(p => completed[p.id]).reduce((a, p) => a + p.reward, 0);
  // The next pillar the user should complete in the recommended order.
  const firstIncomplete = () => ORDER.find(id => !completed[id]);

  // Navigate to a pillar's workspace (no gating — caller decides whether to nudge first).
  function enter(id) {
    setActive(id);
    if (id === 'content') setView('engine');else if (id === 'campaigns') setView('campaigns');
  }

  // Clicking a pillar: if it's ahead of the recommended order and not yet acknowledged,
  // show the recommendation dialog (nudge, never block). Otherwise go straight in.
  function navPillar(id) {
    if (!isUnlocked(id) && !acknowledged[id]) {
      const prereq = SData.PILLARS.find(p => p.id === firstIncomplete());
      setNudge({
        clicked: id,
        prereq
      });
      return;
    }
    enter(id);
  }
  function completePillar(id) {
    if (completed[id]) return;
    const next = {
      ...completed,
      [id]: true
    };
    setCompleted(next);
    const pillar = SData.PILLARS.find(p => p.id === id);
    const newEarned = SData.PILLARS.filter(p => next[p.id]).reduce((a, p) => a + p.reward, 0);
    const i = ORDER.indexOf(id);
    const nextPl = i + 1 < ORDER.length ? SData.PILLARS[i + 1] : null;
    setCongrats({
      pillar,
      earned: newEarned,
      next: nextPl
    });
    setCongratsRun(false);
    setTimeout(() => setCongratsRun(true), 40); // kick count-up + confetti (reliable when tab is focused)
    setJustCompleted(id);
    setTimeout(() => setJustCompleted(null), 1400);
    if (nextPl) {
      setJustUnlocked(nextPl.id);
      setTimeout(() => setJustUnlocked(null), 1200);
    }
  }
  function closeCongrats(goNext) {
    const c = congrats;
    setCongrats(null);
    setCongratsRun(false);
    if (goNext && c && c.next) navPillar(c.next.id);
  }
  const activePillar = SData.PILLARS.find(p => p.id === active);
  const claraPct = Math.round((congrats ? congrats.earned : earned) / SData.CLARA_GOAL * 100);
  let main;
  if (active === 'content') {
    if (view === 'studio') main = /*#__PURE__*/React.createElement(StudioLaunchpad, {
      studioKey: studioKey,
      intelDone: !!completed.intelligence,
      onBack: () => setView('engine')
    });else main = /*#__PURE__*/React.createElement(ContentEngineScreen, {
      onCreate: k => {
        setStudioKey(k);
        setView('studio');
      },
      onCampaign: () => navPillar('campaigns')
    });
  } else if (active === 'campaigns') {
    if (view === 'campaign-detail') main = /*#__PURE__*/React.createElement(CampaignDetailScreen, {
      campaignId: campaignId,
      justLaunched: justLaunched,
      onBack: () => {
        setView('campaigns');
        setJustLaunched(false);
      },
      onDismiss: () => setJustLaunched(false),
      onAddSeries: () => setCampFlow(true)
    });else main = /*#__PURE__*/React.createElement(CampaignsHomeScreen, {
      onNew: () => setCampFlow(true),
      onOpen: id => {
        setCampaignId(id);
        setJustLaunched(false);
        setView('campaign-detail');
      }
    });
  } else {
    main = /*#__PURE__*/React.createElement(PillarOnboarding, {
      pillar: activePillar,
      completed: completed,
      onComplete: completePillar
    });
  }

  // Workspaces (content/campaigns) get a completion bar until marked done.
  const showBar = (active === 'content' || active === 'campaigns') && !completed[active];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      background: 'var(--clr-bg)',
      color: 'var(--clr-text)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(GameAnims, null), /*#__PURE__*/React.createElement(Sidebar, {
    active: active,
    completed: completed,
    isUnlocked: isUnlocked,
    onNav: navPillar,
    earned: earned,
    justUnlocked: justUnlocked,
    justCompleted: justCompleted
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }
  }, showBar && /*#__PURE__*/React.createElement(CompletionBar, {
    pillar: activePillar,
    onComplete: completePillar
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      overflowY: 'auto'
    }
  }, main)), /*#__PURE__*/React.createElement(Dialog, {
    open: !!congrats,
    celebrate: true,
    onClose: () => closeCongrats(false),
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "PartyPopper",
      size: 26,
      color: "var(--clr-reward)"
    }),
    title: "Congratulations!",
    actions: congrats && congrats.next ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => closeCongrats(false)
    }, "Stay here"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => closeCongrats(true)
    }, "Continue to ", congrats.next.label, " \u2192")) : /*#__PURE__*/React.createElement(Button, {
      onClick: () => closeCongrats(false)
    }, "Done")
  }, congrats && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Confetti, {
    fire: congratsRun
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 18px',
      fontSize: 14,
      color: 'var(--clr-text)',
      lineHeight: 1.55
    }
  }, "You completed ", /*#__PURE__*/React.createElement("b", null, congrats.pillar.label), " and earned ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--clr-reward)'
    }
  }, /*#__PURE__*/React.createElement(CountUp, {
    value: congrats.pillar.reward,
    run: congratsRun,
    prefix: "+"
  }), " points"), ".", congrats.next ? /*#__PURE__*/React.createElement(React.Fragment, null, " ", /*#__PURE__*/React.createElement("b", null, congrats.next.label), " is now unlocked.") : /*#__PURE__*/React.createElement(React.Fragment, null, " You've finished every pillar!")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--clr-card-2)',
      border: '1px solid var(--clr-border)',
      borderRadius: 'var(--radius-md)',
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--clr-text)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, claraPct >= 100 && /*#__PURE__*/React.createElement(Icon, {
    name: "Sparkles",
    size: 13,
    color: "var(--clr-accent)"
  }), claraPct >= 100 ? 'Free access to Clara unlocked' : 'Progress to free Clara access'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      color: 'var(--clr-muted)'
    }
  }, /*#__PURE__*/React.createElement(CountUp, {
    value: congrats.earned,
    run: congratsRun
  }), " / ", SData.CLARA_GOAL)), /*#__PURE__*/React.createElement(Meter, {
    pct: congratsRun ? claraPct : (congrats.earned - congrats.pillar.reward) / SData.CLARA_GOAL * 100,
    color: claraPct >= 100 ? 'var(--clr-accent)' : 'var(--clr-primary)'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--clr-muted)',
      marginTop: 9
    }
  }, claraPct >= 100 ? 'Clara is now free to use across every pillar.' : `${SData.CLARA_GOAL - congrats.earned} more points to unlock Clara for free.`)))), /*#__PURE__*/React.createElement(Dialog, {
    open: !!nudge,
    onClose: () => setNudge(null),
    icon: nudge && /*#__PURE__*/React.createElement(Icon, {
      name: nudge.prereq.icon,
      size: 20,
      color: "var(--clr-primary-hover)"
    }),
    title: "A quick recommendation",
    actions: nudge && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => {
        const c = nudge;
        setNudge(null);
        setAcknowledged(a => ({
          ...a,
          [c.clicked]: true
        }));
        enter(c.clicked);
      }
    }, "Continue anyway"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        const c = nudge;
        setNudge(null);
        enter(c.prereq.id);
      }
    }, "Complete ", nudge.prereq.label, " first \u2192"))
  }, nudge && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: 'var(--clr-text)',
      lineHeight: 1.55
    }
  }, "We recommend completing ", /*#__PURE__*/React.createElement("b", null, nudge.prereq.label), " first for better results \u2014 each pillar sharpens the one after it. You're free to jump ahead, but the recommended order gets you the strongest output", nudge.prereq.id === 'intelligence' ? ' and the most points toward free Clara access' : '', ".")), campFlow && /*#__PURE__*/React.createElement(CampaignFlow, {
    onExit: () => setCampFlow(false),
    onLaunch: () => {
      setCampFlow(false);
      setCampaignId('c1');
      setActive('campaigns');
      setView('campaign-detail');
      setJustLaunched(true);
    }
  }));
}
window.ClarityApp = ClarityApp;
})();
