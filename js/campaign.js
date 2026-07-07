/* campaign.js — compiled from campaign.jsx (no build step needed) */
(function () {
/* Clarity UI Kit — Campaigns layer.
   The middle ground between the two team proposals. ONE entry ("New campaign" =
   goal + window); right after the goal, a plain-language question — "one idea, lots
   of posts" (Simple, preselected) vs "several ideas at once" (Advanced) — picks the
   depth without jargon. Both depths reuse the same skeleton (batch generate → one
   review grid → clash-aware schedule); Advanced swaps the content-set step for a
   SERIES plan and groups the grid + campaign page by series. Simple users can
   "group into series" progressively. Composes DS primitives. */
const CDS = window.ClarityDesignSystem_29c088;
const {
  Button,
  Card,
  Pill,
  Tag,
  ModalityBadge,
  StatusBadge,
  KpiStat,
  PersonaFit,
  Input,
  ChannelChip,
  Toggle,
  SegmentedTabs,
  ProgressMeter,
  WizardSteps,
  Icon
} = CDS;
const CD = window.ClarityData;

/* ---------- shared bits (mirrors screens.jsx) ---------- */
function CEyebrow({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: '0.01em',
      color: 'var(--clr-muted)',
      marginBottom: 14
    }
  }, children);
}
function CInheritStrip() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      justifyContent: 'center',
      fontSize: 12,
      color: 'var(--clr-muted)',
      background: 'var(--clr-card-2)',
      border: '1px solid var(--clr-border)',
      borderRadius: 10,
      padding: '9px 14px',
      margin: '18px 0 26px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Sparkles",
    size: 13,
    color: "var(--clr-primary-hover)"
  }), " ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--clr-text)',
      fontWeight: 600
    }
  }, "Carrying your strategy"), " \u2014 Persona: The Artisan Loyalist \xB7 market intel & brand voice applied");
}
function CFieldLabel({
  children,
  hint
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--clr-text)',
      margin: '22px 0 8px'
    }
  }, children, hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: 'var(--clr-muted)',
      marginLeft: 6
    }
  }, "\xB7 ", hint));
}
function selectStyle() {
  return {
    width: '100%',
    background: 'var(--clr-card-2)',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--clr-text)',
    font: 'var(--type-body)',
    padding: '10px 12px',
    appearance: 'none'
  };
}
function modColor(m) {
  return `var(--clr-${m === 'text' ? 'text' : m}-mod)`;
}
const MOD_GLYPH = {
  text: 'Type',
  image: 'Image',
  video: 'Video',
  audio: 'Mic'
};

/* ===================== Campaigns home (monitoring + entry) ===================== */
function CampaignsHomeScreen({
  onNew,
  onOpen
}) {
  const behind = CD.CAMPAIGNS.filter(c => c.status !== 'planned' && c.pace < c.target);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1040,
      margin: '0 auto',
      padding: '40px 28px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement(CEyebrow, null, "Campaigns"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-display-xl)',
      color: 'var(--clr-text)',
      margin: 0
    }
  }, "Plan something bigger."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--clr-muted)',
      margin: '14px auto 0',
      maxWidth: 580
    }
  }, "A campaign sits on top of the Content Engine \u2014 one goal, many pieces, coordinated across channels and tracked against a single target.")), behind.length ? /*#__PURE__*/React.createElement(Card, {
    inset: true,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      borderColor: 'var(--clr-warning)',
      marginBottom: 22
    },
    padding: 16,
    radius: "var(--radius-md)"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--clr-warning)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "TriangleAlert",
    size: 17
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--clr-text)',
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("b", null, behind.length, " campaign", behind.length > 1 ? 's' : '', " behind pace"), " \u2014 ", behind.map(c => c.name).join(', '), ". Maker suggests adding a series to catch up.")) : null, /*#__PURE__*/React.createElement(Card, {
    interactive: true,
    accent: "var(--clr-campaign)",
    topBar: true,
    onClick: onNew,
    style: {
      display: 'flex',
      gap: 18,
      alignItems: 'center',
      marginBottom: 34
    },
    padding: 22,
    radius: "var(--radius-lg)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 13,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(181,132,240,0.16)',
      flexShrink: 0,
      color: 'var(--clr-campaign)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Megaphone",
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-display-xs)',
      color: 'var(--clr-text)'
    }
  }, "Start a campaign"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--clr-muted)',
      marginTop: 4,
      lineHeight: 1.5
    }
  }, "Set a goal and window, then tell Maker if it's ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--clr-text)'
    }
  }, "one idea"), " across channels or ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--clr-text)'
    }
  }, "several ideas"), " in parallel. It plans, writes one brief, generates the batch, and schedules with clash warnings built in.")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--clr-campaign)',
      whiteSpace: 'nowrap'
    }
  }, "New campaign \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: '0.01em',
      color: 'var(--clr-muted)',
      marginBottom: 14
    }
  }, "Your campaigns"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
      gap: 16
    }
  }, CD.CAMPAIGNS.map(c => {
    const onTrack = c.pace >= c.target;
    const planned = c.status === 'planned';
    return /*#__PURE__*/React.createElement(Card, {
      key: c.id,
      interactive: true,
      onClick: () => onOpen(c.id),
      padding: 20,
      radius: "var(--radius-md)"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-display-xs)',
        color: 'var(--clr-text)'
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--clr-muted)',
        marginTop: 3
      }
    }, c.goal, " \xB7 ", c.window)), /*#__PURE__*/React.createElement(StatusBadge, {
      status: c.status
    })), !planned && /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '16px 0 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 11,
        color: 'var(--clr-muted)',
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", null, c.kpiLabel, " \xB7 ", onTrack ? 'on track' : 'behind pace'), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)'
      }
    }, c.pace, "% of goal")), /*#__PURE__*/React.createElement(ProgressMeter, {
      value: c.pace,
      target: c.target
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: planned ? 16 : 0
      }
    }, c.series > 0 && /*#__PURE__*/React.createElement(Tag, null, `${c.series} series`), c.pieces > 0 && /*#__PURE__*/React.createElement(Tag, null, `${c.pieces} pieces`), c.chips.map(x => /*#__PURE__*/React.createElement(Tag, {
      key: x
    }, x))));
  })));
}

/* ===================== Campaign flow (overlay wizard) ===================== */
function stepsFor(mode) {
  return ['Goal & audience', 'Brief', 'Launch'];
}
const SERIES_GLYPH = {
  launch: 'Rocket',
  bts: 'Clapperboard',
  patience: 'GraduationCap'
};
/* sajood's Objective options, mapped onto my goals (which carry KPI + target) */
const CAMP_OBJECTIVES = [
  { obj: 'Awareness', goalId: 'awareness', plain: 'Get discovered' },
  { obj: 'Launch', goalId: 'preorders', plain: 'Launch something new' },
  { obj: 'Re-engagement', goalId: 'reengage', plain: 'Win back quiet customers' },
  { obj: 'Promotion', goalId: 'promote', plain: 'Drive a sale or offer' },
  { obj: 'Community', goalId: 'community', plain: 'Build a following' }
];
/* sajood's series content-pattern options */
const CAMP_PATTERNS = ['Custom', 'Awareness Drip', 'Launch Countdown', 'Last Call'];

// Map an existing campaign (CD.CAMPAIGNS shape) back onto the flow's inputs so
// "Edit campaign" can reopen the flow pre-filled with its current settings.
function goalIdFromCampaign(camp) {
  if (!camp) return 'preorders';
  if (camp.goalId) return camp.goalId;
  const g = (camp.goal || '').toLowerCase();
  const byLabel = (CD.GOALS || []).find(x => x.label.toLowerCase().includes(g) || (g && g.includes(x.label.toLowerCase().split(' / ')[0])));
  if (byLabel) return byLabel.id;
  const byObj = CAMP_OBJECTIVES.find(o => o.obj.toLowerCase() === g);
  if (byObj) return byObj.goalId;
  const KW = [
    ['awareness', ['aware', 'leadership', 'authority', 'brand']],
    ['reengage',  ['re-engage', 'reengage', 'win back', 'lapsed', 'retention']],
    ['promote',   ['promo', 'conversion', 'gifting', 'event', 'offer']],
    ['community', ['community', 'followers']],
    ['preorders', ['pre-order', 'preorder', 'sales', 'launch']],
  ];
  for (const [id, words] of KW) if (words.some(w => g.includes(w))) return id;
  return 'preorders';
}
function channelsFromCampaign(camp) {
  const base = {};
  (CD.CHANNELS || []).forEach(ch => { base[ch] = false; });
  let any = false;
  if (camp && camp.chips) camp.chips.forEach(ch => { if (ch in base) { base[ch] = true; any = true; } });
  return any ? base : { LinkedIn: true, Instagram: true, Facebook: true, Email: true, X: false, YouTube: false };
}

function CampaignFlow({
  onExit,
  onLaunch,
  editCampaign
}) {
  const editing = !!editCampaign;
  const [step, setStep] = React.useState(0);
  const [mode, setMode] = React.useState('single'); // 'single' = one idea (preselected) · 'multi' = several ideas
  const [name, setName] = React.useState(editing ? editCampaign.name : 'Summer Pre-order Push');
  const [goalId, setGoalId] = React.useState(editing ? goalIdFromCampaign(editCampaign) : 'preorders');
  const goal = CD.GOALS.find(g => g.id === goalId) || CD.GOALS[0];
  const [target, setTarget] = React.useState(editing && editCampaign.kpiGoal ? editCampaign.kpiGoal : goal.target);
  const [channels, setChannels] = React.useState(editing ? channelsFromCampaign(editCampaign) : {
    LinkedIn: true,
    Instagram: true,
    Facebook: true,
    Email: true,
    X: false,
    YouTube: false
  });
  const [set, setSet] = React.useState(CD.CAMP_SET.map(s => ({
    ...s
  })));
  const [seriesPlan, setSeriesPlan] = React.useState(CD.CAMP_SERIES_PLAN.map(s => ({
    ...s
  })));
  const [perPlatform, setPerPlatform] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [approved, setApproved] = React.useState({});
  const [spaced, setSpaced] = React.useState(false);
  const [advOpen, setAdvOpen] = React.useState(false);
  // sajood's campaign questions: timing + brief fields
  const [startDate, setStartDate] = React.useState('');
  const [startTime, setStartTime] = React.useState('09:00');
  const [endDate,   setEndDate]   = React.useState('');
  const [endTime,   setEndTime]   = React.useState('17:00');
  const [bPersona,  setBPersona]  = React.useState('Maya Holloway');
  const [bMessage,  setBMessage]  = React.useState('Sourdough Saturday is back — drive pre-orders before Friday by leading with craft and proof: the 72-hour cold ferment, real customer stories, the 4am bakers. Warm, confident, never salesy.');
  const [bProof,    setBProof]    = React.useState('72-hour cold ferment · sells out by noon · 5-star regulars');
  const [bCta,      setBCta]      = React.useState('Pre-order now');
  const isMulti = mode === 'multi';
  const totalPieces = isMulti ? seriesPlan.reduce((a, s) => a + s.posts, 0) : set.reduce((a, s) => a + s.count, 0);
  const batch = CD.CAMP_BATCH;
  const steps = stepsFor(mode);
  function buildCampaign() {
    const selectedChannels = CD.CHANNELS.filter(ch => channels[ch]);
    const id = editing && editCampaign.id ? editCampaign.id : 'c_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return {
      id, name, goalId, goal: goal.label, status: 'running',
      window: (startDate || 'Now') + ' – ' + (endDate || 'open'),
      series: isMulti ? seriesPlan.length : 1, pieces: totalPieces,
      kpiLabel: goal.kpi, kpiNow: 0, kpiGoal: Number(target) || goal.target,
      pace: 80, target: 75, daysLeft: 14, reach: '—', pfAvg: 0, published: 0,
      chips: ['Artisan Loyalist'].concat(selectedChannels.slice(0, 2))
    };
  }
  function changeGoal(id) {
    setGoalId(id);
    const g = CD.GOALS.find(x => x.id === id);
    if (g) setTarget(g.target);
  }
  function bump(id, d) {
    setSet(prev => prev.map(s => s.id === id ? {
      ...s,
      count: Math.max(0, s.count + d)
    } : s));
  }
  function bumpSeries(id, d) {
    setSeriesPlan(prev => prev.map(s => s.id === id ? {
      ...s,
      posts: Math.max(1, s.posts + d)
    } : s));
  }
  function removeSeries(id) {
    setSeriesPlan(prev => prev.filter(s => s.id !== id));
  }
  function renameSeries(id, val) {
    setSeriesPlan(prev => prev.map(s => s.id === id ? { ...s, name: val } : s));
  }
  function setSeriesPattern(id, val) {
    setSeriesPlan(prev => prev.map(s => s.id === id ? { ...s, pattern: val } : s));
  }
  function go(n) {
    setStep(n);
  }

  // step 4 fake batch progress
  React.useEffect(() => {
    if (step !== 2) return;
    setProgress(0);
    const t = setInterval(() => setProgress(p => {
      if (p >= 100) {
        clearInterval(t);
        return 100;
      }
      return p + 4;
    }), 60);
    return () => clearInterval(t);
  }, [step]);
  const overlay = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: 'var(--clr-bg)',
    display: 'flex',
    flexDirection: 'column'
  };
  const top = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 24px',
    borderBottom: '1px solid var(--clr-border)',
    flexShrink: 0
  };
  let body;
  if (step === 0) {
    const clashChannels = CD.CHANNELS;
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--type-display-md)',
        color: 'var(--clr-text)',
        margin: 0,
        textAlign: 'center'
      }
    }, editing ? "Edit campaign" : "Start a campaign"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--clr-muted)',
        textAlign: 'center',
        marginTop: 8
      }
    }, editing ? "Update this campaign's goal, timing and channels \u2014 then save." : "A campaign is a goal with a deadline. Tell Maker the target \u2014 it builds the plan to hit it."), /*#__PURE__*/React.createElement(CInheritStrip, null), /*#__PURE__*/React.createElement(Input, {
      label: "Campaign name",
      value: name,
      onChange: e => setName(e.target.value)
    }), /*#__PURE__*/React.createElement(CFieldLabel, null, "Objective"), /*#__PURE__*/React.createElement("select", {
      style: selectStyle(),
      value: goalId,
      onChange: e => changeGoal(e.target.value)
    }, CAMP_OBJECTIVES.map(o => /*#__PURE__*/React.createElement("option", {
      key: o.goalId,
      value: o.goalId
    }, o.plain || o.obj))), /*#__PURE__*/React.createElement(CFieldLabel, {
      hint: "Maker suggests a content set from these"
    }, "Where to post?"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }
    }, clashChannels.map(ch => /*#__PURE__*/React.createElement(ChannelChip, {
      key: ch,
      selected: channels[ch],
      title: CD.CHANNEL_DESC[ch],
      onClick: () => setChannels(p => ({
        ...p,
        [ch]: !p[ch]
      }))
    }, ch))), /*#__PURE__*/React.createElement(CFieldLabel, {
      hint: "Not sure? Start with one idea \u2014 you can split into series later"
    }, "What are you working on?"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(IntentCard, {
      on: mode === 'single',
      glyph: "Lightbulb",
      title: "One idea, lots of posts",
      desc: "Maker spreads a single message across your channels \u2014 one coordinated set.",
      onClick: () => setMode('single')
    }), /*#__PURE__*/React.createElement(IntentCard, {
      on: mode === 'multi',
      glyph: "Layers",
      title: "Several ideas at once",
      desc: "Run multiple series in parallel \u2014 each its own idea, all under one goal.",
      onClick: () => setMode('multi')
    })), /*#__PURE__*/React.createElement(FlowFoot, {
      left: /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        onClick: onExit
      }, "Cancel"),
      right: /*#__PURE__*/React.createElement(Button, {
        onClick: () => go(1)
      }, "Write the brief →")
    }));
  } else if (step === 991) {
    body = isMulti ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--type-display-md)',
        color: 'var(--clr-text)',
        margin: 0,
        textAlign: 'center'
      }
    }, "Maker planned ", seriesPlan.length, " series"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--clr-muted)',
        textAlign: 'center',
        marginTop: 8
      }
    }, seriesPlan.length, " series \xB7 ", totalPieces, " posts toward your goal. Each series is one idea told as a set \u2014 drop any, or tune the count."), /*#__PURE__*/React.createElement(CInheritStrip, null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, seriesPlan.map(s => /*#__PURE__*/React.createElement(Card, {
      key: s.id,
      inset: true,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      },
      padding: 16,
      radius: "var(--radius-md)"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--clr-primary-dim)',
        flexShrink: 0,
        color: 'var(--clr-campaign)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: SERIES_GLYPH[s.id] || 'Layers',
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("input", {
      value: s.name,
      placeholder: "Series name",
      onChange: e => renameSeries(s.id, e.target.value),
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--clr-text)',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px dashed var(--clr-border)',
        outline: 'none',
        fontFamily: 'inherit',
        padding: '1px 0',
        minWidth: 0,
        maxWidth: 200
      }
    }), s.mods.map(m => /*#__PURE__*/React.createElement(ModalityBadge, {
      key: m,
      modality: m
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("select", {
      value: s.pattern,
      onChange: e => setSeriesPattern(s.id, e.target.value),
      style: {
        fontSize: 12,
        color: 'var(--clr-muted)',
        background: 'var(--clr-card-2)',
        border: '1px solid var(--clr-border)',
        borderRadius: 6,
        padding: '3px 7px',
        fontFamily: 'inherit',
        cursor: 'pointer'
      }
    }, (CAMP_PATTERNS.indexOf(s.pattern) >= 0 ? CAMP_PATTERNS : [s.pattern].concat(CAMP_PATTERNS)).map(pt => /*#__PURE__*/React.createElement("option", {
      key: pt,
      value: pt
    }, pt))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--clr-muted)'
      }
    }, s.hint))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Stepper, {
      value: s.posts,
      onMinus: () => bumpSeries(s.id, -1),
      onPlus: () => bumpSeries(s.id, 1)
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => removeSeries(s.id),
      title: "Remove series",
      style: {
        width: 28,
        height: 28,
        borderRadius: 7,
        border: '1px solid var(--clr-border)',
        background: 'transparent',
        color: 'var(--clr-muted)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "X",
      size: 14
    })))))), /*#__PURE__*/React.createElement(FlowFoot, {
      left: /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        onClick: () => go(0)
      }, "\u2190 Back"),
      right: /*#__PURE__*/React.createElement(Button, {
        onClick: () => go(2)
      }, "Write one brief \u2192")
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--type-display-md)',
        color: 'var(--clr-text)',
        margin: 0,
        textAlign: 'center'
      }
    }, "Maker suggests ", totalPieces, " pieces"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--clr-muted)',
        textAlign: 'center',
        marginTop: 8
      }
    }, "Based on your channels and goal. Tune the counts \u2014 drop anything you don't need."), /*#__PURE__*/React.createElement(CInheritStrip, null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, set.map(s => /*#__PURE__*/React.createElement(Card, {
      key: s.id,
      inset: true,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      },
      padding: 16,
      radius: "var(--radius-md)"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `color-mix(in srgb, ${modColor(s.mod)} 16%, transparent)`,
        flexShrink: 0,
        color: modColor(s.mod)
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: MOD_GLYPH[s.mod],
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--clr-text)'
      }
    }, s.platform), /*#__PURE__*/React.createElement(ModalityBadge, {
      modality: s.mod
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--clr-muted)',
        marginTop: 3
      }
    }, s.type, " \xB7 ", s.hint)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Stepper, {
      value: s.count,
      onMinus: () => bump(s.id, -1),
      onPlus: () => bump(s.id, 1)
    }))))), /*#__PURE__*/React.createElement(FlowFoot, {
      left: /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        onClick: () => go(0)
      }, "\u2190 Back"),
      right: /*#__PURE__*/React.createElement(Button, {
        onClick: () => go(2)
      }, "Write one brief \u2192")
    }));
  } else if (step === 1) {
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--type-display-md)',
        color: 'var(--clr-text)',
        margin: 0,
        textAlign: 'center'
      }
    }, "One brief for the whole campaign"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--clr-muted)',
        textAlign: 'center',
        marginTop: 8
      }
    }, "Write it once. Maker adapts the angle for every channel \u2014 tweak per platform only if you need to."), /*#__PURE__*/React.createElement(CInheritStrip, null), /*#__PURE__*/React.createElement(Input, {
      label: "Persona",
      value: bPersona,
      onChange: e => setBPersona(e.target.value)
    }), /*#__PURE__*/React.createElement(Input, {
      as: "textarea",
      label: "Message",
      value: bMessage,
      onChange: e => setBMessage(e.target.value),
      style: {
        height: 100
      }
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Proof",
      value: bProof,
      onChange: e => setBProof(e.target.value)
    }), /*#__PURE__*/React.createElement(Input, {
      label: "CTA",
      value: bCta,
      onChange: e => setBCta(e.target.value)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement(Toggle, {
      checked: perPlatform,
      onChange: () => setPerPlatform(!perPlatform)
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--clr-text)'
      }
    }, isMulti ? 'Tweak the brief per series' : 'Tweak the brief per platform'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--clr-muted)'
      }
    }, "Off by default \u2014 one brief keeps the campaign coherent."))), perPlatform && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginTop: 16
      }
    }, (isMulti ? seriesPlan.map(s => ({
      key: s.id,
      mod: s.mods[0],
      label: s.name
    })) : set.filter(s => s.count > 0).map(s => ({
      key: s.id,
      mod: s.mod,
      label: s.platform
    }))).map(row => /*#__PURE__*/React.createElement(Card, {
      key: row.key,
      inset: true,
      padding: 12,
      radius: "var(--radius)",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(ModalityBadge, {
      modality: row.mod
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--clr-text)',
        flex: 1
      }
    }, row.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--clr-primary-hover)',
        cursor: 'pointer'
      }
    }, "Add a note \u2192")))), /*#__PURE__*/React.createElement(FlowFoot, {
      left: /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        onClick: () => go(0)
      }, "\u2190 Back"),
      right: /*#__PURE__*/React.createElement(Button, {
        onClick: () => go(2)
      }, "Generate ", totalPieces, " pieces \u2192")
    }));
  } else if (step === 993) {
    const done = progress >= 100;
    body = /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        paddingTop: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 64,
        height: 64,
        borderRadius: 16,
        background: 'var(--clr-primary-dim)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        color: 'var(--clr-primary-hover)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: done ? 'Sparkles' : 'Zap',
      size: 30
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--type-display-md)',
        color: 'var(--clr-text)',
        margin: 0
      }
    }, done ? 'Your batch is ready' : 'Maker is generating your batch'), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--clr-muted)',
        marginTop: 8,
        maxWidth: 460,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    }, done ? `${totalPieces} pieces drafted in your brand voice, each scored for persona fit.` : 'One run for the whole campaign — in your brand voice, with persona fit scored before anything schedules.'), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 420,
        margin: '28px auto 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 12,
        color: 'var(--clr-muted)',
        marginBottom: 8,
        fontFamily: 'var(--font-body)'
      }
    }, /*#__PURE__*/React.createElement("span", null, Math.min(Math.round(progress / 100 * totalPieces), totalPieces), " of ", totalPieces, " pieces"), /*#__PURE__*/React.createElement("span", null, Math.min(progress, 100), "%")), /*#__PURE__*/React.createElement(ProgressMeter, {
      value: Math.min(progress, 100),
      tone: "indigo",
      height: 8
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 28
      }
    }, /*#__PURE__*/React.createElement(Button, {
      disabled: !done,
      onClick: () => go(4)
    }, done ? 'Review the batch →' : 'Generating…')));
  } else if (step === 994) {
    const approvedCount = Object.values(approved).filter(Boolean).length;
    const card = (b, i) => {
      const ok = approved[i];
      return /*#__PURE__*/React.createElement(Card, {
        key: i,
        padding: 0,
        radius: "var(--radius-md)",
        style: {
          overflow: 'hidden',
          borderColor: ok ? 'var(--clr-accent)' : 'var(--clr-border)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          aspectRatio: '16/7',
          background: `color-mix(in srgb, ${modColor(b.mod)} 12%, var(--clr-card-2))`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: modColor(b.mod)
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: MOD_GLYPH[b.mod],
        size: 28,
        strokeWidth: 1.75
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '12px 14px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--clr-text)',
          lineHeight: 1.4,
          minHeight: 36
        }
      }, b.title), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(Tag, null, b.channel), /*#__PURE__*/React.createElement(PersonaFit, {
        score: b.pf
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 8,
          marginTop: 12
        }
      }, /*#__PURE__*/React.createElement(Button, {
        variant: ok ? 'primary' : 'outline',
        size: "sm",
        onClick: () => setApproved(p => ({
          ...p,
          [i]: !p[i]
        })),
        accent: "var(--clr-accent)"
      }, ok ? /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "Check",
        size: 13,
        strokeWidth: 2.5
      }), "Approved") : 'Approve'), /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm"
      }, "Fix"))));
    };
    const grid = items => /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2,1fr)',
        gap: 14,
        marginTop: 16
      }
    }, items.map(({
      b,
      i
    }) => card(b, i)));
    const indexed = batch.map((b, i) => ({
      b,
      i
    }));
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--type-display-md)',
        color: 'var(--clr-text)',
        margin: 0,
        textAlign: 'center'
      }
    }, "Review the batch"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--clr-muted)',
        textAlign: 'center',
        marginTop: 8
      }
    }, "Approve what's good, fix what isn't. ", approvedCount, " of ", batch.length, " approved."), isMulti ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22
      }
    }, seriesPlan.map(s => {
      const items = indexed.filter(({
        b
      }) => b.series === s.id);
      if (!items.length) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: s.id,
        style: {
          marginBottom: 22
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 2
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--clr-campaign)',
          display: 'flex'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: SERIES_GLYPH[s.id] || 'Layers',
        size: 15
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--clr-text)'
        }
      }, s.name), /*#__PURE__*/React.createElement(Tag, null, items.length, " ", items.length > 1 ? 'pieces' : 'piece'), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          color: 'var(--clr-muted)'
        }
      }, "\xB7 ", s.pattern)), grid(items));
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, grid(indexed), /*#__PURE__*/React.createElement(Card, {
      inset: true,
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        marginTop: 20
      },
      padding: 14,
      radius: "var(--radius-md)"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--clr-campaign)',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Layers",
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 12.5,
        color: 'var(--clr-muted)'
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--clr-text)'
      }
    }, "Juggling more than one idea?"), " Group these into named series to track each thread on its own."), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      onClick: () => setMode('multi')
    }, "Group into series"))), /*#__PURE__*/React.createElement(FlowFoot, {
      left: /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        onClick: () => go(3)
      }, "\u2190 Back"),
      right: /*#__PURE__*/React.createElement(Button, {
        onClick: () => go(5)
      }, "Schedule the campaign \u2192")
    }));
  } else {
    const rows = CD.CAMP_SCHEDULE.map((r, i) => ({
      ...r,
      clash: r.clash && !spaced,
      time: r.clash && spaced ? 'Tue Jun 3 · 9:00 AM' : r.time
    }));
    const hasClash = rows.some(r => r.clash);
    body = progress < 100
      ? /*#__PURE__*/React.createElement(React.Fragment, null,
          /*#__PURE__*/React.createElement("h2", { style: { font: 'var(--type-display-md)', color: 'var(--clr-text)', margin: 0, textAlign: 'center' } }, "Building your campaign"),
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 14, color: 'var(--clr-muted)', textAlign: 'center', marginTop: 8 } }, "Maker is writing your pieces and placing them across the window."),
          /*#__PURE__*/React.createElement("div", { style: { marginTop: 28 } }, /*#__PURE__*/React.createElement(ProgressMeter, { value: progress })))
      : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--type-display-md)',
        color: 'var(--clr-text)',
        margin: 0,
        textAlign: 'center'
      }
    }, "Here's your campaign"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--clr-muted)',
        textAlign: 'center',
        marginTop: 8
      }
    }, "Every piece is placed across your window. Maker flags clashes on the same channel and day."), hasClash && /*#__PURE__*/React.createElement(Card, {
      inset: true,
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        borderColor: 'var(--clr-warning)',
        margin: '20px 0 4px'
      },
      padding: 14,
      radius: "var(--radius-md)"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--clr-warning)',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "TriangleAlert",
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 13,
        color: 'var(--clr-text)'
      }
    }, "Two Instagram pieces go out on ", /*#__PURE__*/React.createElement("b", null, "Mon Jun 2"), ". They'll compete for the same audience."), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => setSpaced(true)
    }, "Space them out")), spaced && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        color: 'var(--clr-accent)',
        margin: '16px 0 4px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Check",
      size: 13
    }), "Spaced out \u2014 the second Instagram piece moved to Tue Jun 3."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginTop: 18
      }
    }, rows.map((r, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      inset: true,
      padding: 12,
      radius: "var(--radius)",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderColor: r.clash ? 'var(--clr-warning)' : 'var(--clr-border)'
      }
    }, /*#__PURE__*/React.createElement(ModalityBadge, {
      modality: r.mod
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--clr-text)',
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, r.title), /*#__PURE__*/React.createElement(Tag, null, r.channel), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontFamily: 'var(--font-body)',
        color: r.clash ? 'var(--clr-warning)' : 'var(--clr-muted)',
        whiteSpace: 'nowrap'
      }
    }, r.time)))), /*#__PURE__*/React.createElement(FlowFoot, {
      left: /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        onClick: () => go(4)
      }, "\u2190 Back"),
      right: /*#__PURE__*/React.createElement(Button, {
        onClick: () => onLaunch(buildCampaign()),
        accent: "var(--clr-campaign)"
      }, editing ? "Save changes \u2192" : "Launch campaign \u2192")
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: overlay
  }, /*#__PURE__*/React.createElement("div", {
    style: top
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--clr-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      color: 'var(--clr-text)',
      marginRight: 8
    }
  }, "Campaign"), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'normal',
      color: 'var(--clr-campaign)'
    }
  }, isMulti ? 'Several ideas' : 'One idea')), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: onExit
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 13
  }), "Exit"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      padding: '28px 24px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement(WizardSteps, {
    steps: steps,
    current: step + 1
  })), body)));
}
function FlowFoot({
  left,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 36,
      paddingTop: 22,
      borderTop: '1px solid var(--clr-border)'
    }
  }, left, right);
}
function Stepper({
  value,
  onMinus,
  onPlus
}) {
  const btn = {
    width: 28,
    height: 28,
    borderRadius: 7,
    border: '1px solid var(--clr-border)',
    background: 'var(--clr-card)',
    color: 'var(--clr-text)',
    fontSize: 16,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: onMinus
  }, "\u2212"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--clr-text)',
      width: 18,
      textAlign: 'center'
    }
  }, value), /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: onPlus
  }, "+"));
}
function IntentCard({
  on,
  glyph,
  title,
  desc,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      cursor: 'pointer',
      padding: 16,
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${on ? 'var(--clr-campaign)' : 'var(--clr-border)'}`,
      background: on ? 'rgba(192,132,252,0.10)' : 'var(--clr-card)',
      transition: 'all var(--dur-fast) var(--ease)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--clr-campaign)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: glyph,
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--clr-text)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      width: 16,
      height: 16,
      borderRadius: '50%',
      border: `2px solid ${on ? 'var(--clr-campaign)' : 'var(--clr-border)'}`,
      background: on ? 'var(--clr-campaign)' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--clr-bg)'
    }
  }, on ? /*#__PURE__*/React.createElement(Icon, {
    name: "Check",
    size: 11,
    strokeWidth: 3
  }) : null)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--clr-muted)',
      lineHeight: 1.45
    }
  }, desc));
}

/* ===================== Campaign detail (the campaign's own page) ===================== */
function CampaignDetailScreen({
  campaignId,
  justLaunched,
  onBack,
  onDismiss,
  onAddSeries,
  onEdit
}) {
  const c = CD.CAMPAIGNS.find(x => x.id === campaignId) || CD.CAMPAIGNS[0];
  const onTrack = c.pace >= c.target;
  const planned = c.status === 'planned';
  const pieces = CD.CAMP_BATCH;
  const [grouped, setGrouped] = React.useState(true);
  const seriesList = CD.CAMP_SERIES_PLAN;
  const statusOf = i => i < c.published ? 'published' : i < c.published + 2 ? 'scheduled' : 'draft';
  const pieceRow = (p, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    inset: true,
    padding: 12,
    radius: "var(--radius)",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      color: 'var(--clr-muted)',
      width: 28
    }
  }, "#", i + 1), /*#__PURE__*/React.createElement(ModalityBadge, {
    modality: p.mod
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--clr-text)',
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, p.title), /*#__PURE__*/React.createElement(Tag, null, p.channel), /*#__PURE__*/React.createElement(PersonaFit, {
    score: p.pf
  }), /*#__PURE__*/React.createElement(StatusBadge, {
    status: statusOf(i)
  }));
  const indexed = pieces.map((p, i) => ({
    p,
    i
  }));
  /* only stat tiles with real data render — no placeholder dashes or zeros */
  const kpiTiles = [c.published > 0 && /*#__PURE__*/React.createElement(KpiStat, {
    key: "published",
    label: "Pieces published",
    value: c.published,
    mono: true,
    delta: `${c.pieces - c.published} in progress`
  }), !planned && c.reach !== '—' && /*#__PURE__*/React.createElement(KpiStat, {
    key: "reach",
    label: "Reach",
    value: c.reach,
    delta: '▲ this window'
  }), c.pfAvg > 0 && /*#__PURE__*/React.createElement(KpiStat, {
    key: "fit",
    label: "Avg persona fit",
    value: c.pfAvg,
    mono: true,
    deltaTone: c.pfAvg < 80 ? 'amber' : undefined,
    delta: "minimum 65"
  }), c.series > 0 && /*#__PURE__*/React.createElement(KpiStat, {
    key: "series",
    label: "Series",
    value: c.series,
    delta: "in this campaign"
  })].filter(Boolean);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1040,
      margin: '0 auto',
      padding: '28px 28px 56px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--clr-muted)',
      cursor: 'pointer'
    },
    onClick: onBack
  }, "\u2039 Campaigns"), justLaunched && /*#__PURE__*/React.createElement(Card, {
    inset: true,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      borderColor: 'var(--clr-campaign)',
      margin: '16px 0 4px'
    },
    padding: 16,
    radius: "var(--radius-md)"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--clr-campaign)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Rocket",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--clr-text)'
    }
  }, "Campaign launched \u2014 ", pieces.length, " pieces scheduled and tracking"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--clr-muted)',
      marginTop: 2
    }
  }, "Maker will flag the moment you fall behind pace. Nothing re-entered \u2014 your strategy carried through.")), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: onDismiss
  }, "Got it")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
      margin: '18px 0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-display-lg)',
      color: 'var(--clr-text)',
      margin: 0
    }
  }, c.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--clr-muted)',
      marginTop: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, c.goal, " \xB7 ", c.window, " ", /*#__PURE__*/React.createElement(StatusBadge, {
    status: c.status
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: onEdit
  }, "Edit campaign"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: onAddSeries
  }, "+ Add pieces"))), !planned && /*#__PURE__*/React.createElement(Card, {
    padding: 22,
    radius: "var(--radius-lg)",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: '0.01em',
      color: 'var(--clr-muted)'
    }
  }, c.kpiLabel, " \xB7 pace to goal"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-display-lg)',
      color: 'var(--clr-text)',
      marginTop: 4,
      fontFamily: 'var(--font-mono)'
    }
  }, fmt(c.kpiNow || 0), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      color: 'var(--clr-muted)'
    }
  }, "of ", fmt(c.kpiGoal || 100)))), /*#__PURE__*/React.createElement(Pill, {
    tone: planned ? 'muted' : onTrack ? 'green' : 'amber',
    dot: true
  }, planned ? 'Not started' : onTrack ? 'On track' : 'Behind pace', !planned && ` · ${c.daysLeft}d left`)), /*#__PURE__*/React.createElement(ProgressMeter, {
    value: c.pace,
    target: c.target,
    height: 9
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--clr-muted)',
      marginTop: 10
    }
  }, c.pace, "% of goal reached \xB7 target pace marker at ", c.target, "%", onTrack || planned ? '' : ' — Maker suggests adding pieces to catch up')), kpiTiles.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${kpiTiles.length},1fr)`,
      gap: 14,
      marginBottom: 20
    }
  }, kpiTiles) : null, /*#__PURE__*/React.createElement(Card, {
    inset: true,
    padding: 14,
    radius: "var(--radius-md)",
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--clr-accent)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShieldCheck",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 12.5,
      color: 'var(--clr-muted)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--clr-text)'
    }
  }, "Guardrails on"), " \u2014 pieces need a persona fit of 65 or better to schedule \xB7 no more than two posts per channel a day \xB7 same-day clash warnings on."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--clr-primary-hover)',
      cursor: 'pointer'
    }
  }, "Adjust")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: '0.01em',
      color: 'var(--clr-muted)'
    }
  }, "Pieces in this campaign"), /*#__PURE__*/React.createElement(SegmentedTabs, {
    value: grouped ? 'series' : 'flat',
    onChange: v => setGrouped(v === 'series'),
    tabs: [{
      id: 'series',
      label: 'By series'
    }, {
      id: 'flat',
      label: 'Flat'
    }]
  })), grouped ? seriesList.map(s => {
    const items = indexed.filter(({
      p
    }) => p.series === s.id);
    if (!items.length) return null;
    const done = items.filter(({
      i
    }) => statusOf(i) === 'published').length;
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--clr-campaign)',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: SERIES_GLYPH[s.id] || 'Layers',
      size: 15
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: 'var(--clr-text)'
      }
    }, s.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: 'var(--clr-muted)'
      }
    }, s.pattern), /*#__PURE__*/React.createElement(Tag, null, done, " of ", items.length, " published")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, items.map(({
      p,
      i
    }) => pieceRow(p, i))));
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, indexed.map(({
    p,
    i
  }) => pieceRow(p, i))));
}
function fmt(n) {
  n = Number(n) || 0;
  return n >= 1000 ? Math.round(n / 100) / 10 + 'K' : '' + n;
}
Object.assign(window, {
  CampaignsHomeScreen,
  CampaignFlow,
  CampaignDetailScreen
});
})();
