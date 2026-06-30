/* screens.js — compiled from screens.jsx (no build step needed) */
(function () {
/* Clarity UI Kit — screen recreations. Compose the design-system primitives.
   Exposes screens on window for the kit index pages. */
const DS = window.ClarityDesignSystem_29c088;
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
  SidebarItem,
  Dialog,
  ProgressMeter,
  WizardSteps,
  Icon
} = DS;
const D = window.ClarityData;

/* ---------- small shared bits ---------- */
function Eyebrow({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--label-tracking-wide)',
      color: 'var(--clr-muted)',
      marginBottom: 14
    }
  }, children);
}
function FieldLabel({
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
function InheritStrip() {
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

/* ---------- Your strategy panel ---------- */
function StrategyPanel() {
  const s = D.ENGINE_STRATEGY;
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 34
    },
    padding: 18,
    radius: "var(--radius-lg)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--label-tracking)',
      color: 'var(--clr-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Sparkles",
    size: 13,
    color: "var(--clr-primary-hover)"
  }), "Your strategy \xB7 ", s.brand), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--clr-primary-hover)',
      cursor: 'pointer'
    }
  }, "Edit strategy")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 12
    }
  }, s.cards.map(c => /*#__PURE__*/React.createElement(Card, {
    key: c.label,
    inset: true,
    padding: 14,
    radius: "var(--radius)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.icon,
    size: 15,
    color: "var(--clr-primary-hover)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label-xs)',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 'var(--label-tracking)',
      color: 'var(--clr-muted)'
    }
  }, c.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--clr-text)',
      marginBottom: 4
    }
  }, c.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--clr-muted)',
      lineHeight: 1.5
    }
  }, c.body)))));
}

/* ---------- Content Engine home ---------- */
function ContentEngineScreen({
  onCreate,
  onCampaign
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 980,
      margin: '0 auto',
      padding: '48px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Content Engine"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-display-xl)',
      color: 'var(--clr-text)',
      margin: 0
    }
  }, "Let's make something that lands."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--clr-muted)',
      margin: '14px auto 0',
      maxWidth: 560
    }
  }, "Your strategy is already loaded. Pick a format for a single piece, or plan a coordinated push from Campaigns.")), /*#__PURE__*/React.createElement(StrategyPanel, null), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-display-sm)',
      color: 'var(--clr-text)',
      textAlign: 'center',
      marginBottom: 16
    }
  }, "What do you want to create?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 14
    }
  }, D.STUDIOS.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.key,
    interactive: true,
    topBar: true,
    accent: s.accent,
    onClick: () => onCreate(s.key),
    padding: "20px 18px",
    radius: "var(--radius-md)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 11,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `color-mix(in srgb, ${s.accent} 16%, transparent)`,
      marginBottom: 12,
      color: s.accent
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-display-xs)',
      color: 'var(--clr-text)'
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--clr-muted)',
      marginTop: 5,
      lineHeight: 1.45,
      minHeight: 52
    }
  }, s.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: s.accent
    }
  }, "Start \u2192"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontSize: 13,
      color: 'var(--clr-muted)'
    }
  }, "Planning a multi-piece push?\u00a0", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--clr-campaign)',
      fontWeight: 600,
      cursor: 'pointer'
    },
    onClick: () => onCampaign('campaign')
  }, "Go to Campaigns \u2192")));
}

/* ---------- Studio launchpad (Create | My Library) ---------- */
function StudioLaunchpad({
  studioKey,
  intelDone,
  onBack
}) {
  const s = D.STUDIOS.find(x => x.key === studioKey) || D.STUDIOS[0];
  const [tab, setTab] = React.useState('create');
  const [flow, setFlow] = React.useState(false);
  const [briefing, setBriefing] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [extra, setExtra] = React.useState([]); // pieces published this session

  function publish(piece) {
    setExtra(p => [piece, ...p]);
    setFlow(false);
    setTab('library');
    setToast(piece.toast);
    setTimeout(() => setToast(null), 2600);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 980,
      margin: '0 auto',
      padding: '28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--clr-muted)',
      cursor: 'pointer'
    },
    onClick: onBack
  }, "\u2039 Content Engine")), tab === 'create' ? /*#__PURE__*/React.createElement(Card, {
    style: {
      maxWidth: 540,
      margin: '24px auto',
      textAlign: 'center',
      position: 'relative'
    },
    padding: "44px 38px",
    radius: "var(--radius-xl)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '-40%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 320,
      height: 320,
      background: `radial-gradient(circle, ${s.accent}, transparent 70%)`,
      opacity: 0.12,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 60,
      borderRadius: 16,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `color-mix(in srgb, ${s.accent} 18%, transparent)`,
      marginBottom: 18,
      position: 'relative',
      color: s.accent
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 28
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-display-md)',
      color: 'var(--clr-text)',
      margin: 0,
      position: 'relative'
    }
  }, "Create with Studio ", s.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--clr-muted)',
      marginTop: 8,
      lineHeight: 1.55,
      position: 'relative'
    }
  }, s.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      padding: 14,
      border: '1px dashed var(--clr-border)',
      borderRadius: 12,
      background: 'var(--clr-card-2)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label-xs)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--label-tracking)',
      color: 'var(--clr-muted)'
    }
  }, "Auto-applied from your strategy"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 10
    }
  }, ['Persona', 'Market intel', 'GTM strategy'].map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 12,
      color: 'var(--clr-text)',
      background: `color-mix(in srgb, ${s.accent} 14%, var(--clr-card))`,
      border: `1px solid color-mix(in srgb, ${s.accent} 35%, transparent)`,
      borderRadius: 'var(--radius-pill)',
      padding: '4px 11px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Check",
    size: 12,
    color: s.accent
  }), c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    accent: s.accent,
    onClick: () => setBriefing(true)
  }, "Start creating \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 12,
      color: 'var(--clr-muted)',
      cursor: 'pointer'
    },
    onClick: () => setTab('library')
  }, "or browse your library")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, extra.map((ex, i) => /*#__PURE__*/React.createElement(Card, {
    key: 'new' + i,
    padding: 0,
    radius: "var(--radius)",
    style: {
      overflow: 'hidden',
      borderColor: 'var(--clr-accent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '16/9',
      background: `color-mix(in srgb, ${s.accent} 16%, var(--clr-card-2))`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: s.accent
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ex.motif,
    size: 30
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--clr-text)'
    }
  }, ex.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(ModalityBadge, {
    modality: s.key
  }), /*#__PURE__*/React.createElement(StatusBadge, {
    status: ex.status
  }))))), s.ex.map((ex, i) => /*#__PURE__*/React.createElement(Card, {
    key: ex,
    padding: 0,
    radius: "var(--radius)",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '16/9',
      background: `color-mix(in srgb, ${s.accent} 12%, var(--clr-card-2))`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: s.accent,
      opacity: 0.6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 30
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--clr-text)'
    }
  }, ex, " for The Artisan Loyalist"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(ModalityBadge, {
    modality: s.key
  }), /*#__PURE__*/React.createElement(StatusBadge, {
    status: i === 0 ? 'published' : i === 1 ? 'scheduled' : 'draft'
  })))))), briefing && window.AriaBriefing && React.createElement(window.AriaBriefing, {
    studioKey: studioKey,
    onReady: function() { setBriefing(false); setFlow(true); }
  }), flow && window.StudioFlow && React.createElement(window.StudioFlow, {
    studio: s,
    intelDone: intelDone,
    onExit: () => setFlow(false),
    onPublish: publish
  }), flow && window.AriaWidget && React.createElement(window.AriaWidget, {
    studioKey: studioKey,
    accent: s.accent
  }), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1100,
      background: 'var(--clr-text)',
      color: 'var(--clr-bg)',
      fontSize: 13,
      fontWeight: 600,
      padding: '11px 18px',
      borderRadius: 'var(--radius-pill)',
      boxShadow: '0 8px 28px rgba(0,0,0,0.4)'
    }
  }, toast));
}
Object.assign(window, {
  ContentEngineScreen,
  StudioLaunchpad,
  StrategyPanel,
  InheritStrip,
  Eyebrow,
  FieldLabel
});
})();
