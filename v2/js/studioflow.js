/* studioflow.js — compiled from studioflow.jsx (no build step needed) */
(function () {
/* Clarity UI Kit — enriched Content-Engine create flow.
   Modality-specific question screens (modeled on the studio modules), then a
   shared Generate → Preview → Publish tail. Strategy (idea/persona/market) is
   inherited, so we never re-ask it — we ask only what each modality needs:
     • Text  — one rich brief (angle · message · tone · CTA · hashtags)
     • Image — one rich brief (use case · prompt · style · aspect · brand-kit lock)
     • Audio — Goal → Voice & vibe → Script → Production  (full step-by-step)
     • Video — Format → Avatar + script → Voiceover        (full step-by-step)
   Edge case: trying to Generate before Intelligence is complete shows a Clara
   gate (nudge, not a hard block). Exposes window.StudioFlow. */
const SFDS = window.ClarityDesignSystem_29c088;
const {
  Button: SFButton,
  Card: SFCard,
  Pill: SFPill,
  Icon: SFIcon,
  WizardSteps: SFWizard,
  SegmentedTabs: SFTabs
} = SFDS;
const SFD = window.ClarityData;
const SF_MOTIF = {
  text: 'FileText',
  image: 'Image',
  video: 'Clapperboard',
  audio: 'AudioLines'
};

/* ---------- studio flow animation keyframes (injected once) ---------- */
function SFAnims() {
  return /*#__PURE__*/React.createElement("style", null, `
    @keyframes sf-step-in { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:none} }
    @keyframes sf-card-in { 0%{opacity:0;transform:translateY(14px) scale(.98)} 100%{opacity:1;transform:none} }
    @keyframes sf-shimmer { 0%{background-position:-180% 0} 100%{background-position:280% 0} }
    @keyframes sf-pulse-dot { 0%,100%{opacity:.35} 50%{opacity:1} }
    .sf-skeleton {
      background: linear-gradient(100deg, var(--clr-card-2) 30%, var(--clr-card-hover) 50%, var(--clr-card-2) 70%);
      background-size: 220% 100%;
      animation: sf-shimmer 1.3s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .sf-step, .sf-reveal, .sf-skeleton { animation: none !important; }
    }
  `);
}

/* ---------- small shared controls ---------- */
function SFLabel({
  children,
  hint
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--type-label-xs)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--label-tracking)',
      color: 'var(--clr-muted)',
      marginBottom: 8
    }
  }, children, hint && /*#__PURE__*/React.createElement(SFIcon, {
    name: "Sparkles",
    size: 11,
    color: "var(--clr-primary-hover)"
  }));
}
function SFSelect({
  value,
  onChange,
  opts
}) {
  return /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: e => onChange(e.target.value),
    style: {
      width: '100%',
      background: 'var(--clr-card-2)',
      border: '1px solid var(--clr-border)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--clr-text)',
      font: 'var(--type-body)',
      padding: '9px 11px',
      appearance: 'none'
    }
  }, opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o
  }, o)));
}
function SFTextarea({
  value,
  onChange,
  placeholder,
  rows = 4
}) {
  return /*#__PURE__*/React.createElement("textarea", {
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder,
    rows: rows,
    style: {
      width: '100%',
      background: 'var(--clr-card-2)',
      border: '1px solid var(--clr-border)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--clr-text)',
      font: 'var(--type-body)',
      padding: '10px 12px',
      resize: 'vertical',
      lineHeight: 1.5
    }
  });
}
function SFChips({
  opts,
  sel,
  onToggle,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, opts.map(o => {
    const on = sel.indexOf(o) >= 0;
    return /*#__PURE__*/React.createElement("span", {
      key: o,
      onClick: () => onToggle(o),
      style: {
        cursor: 'pointer',
        fontSize: 12.5,
        padding: '5px 12px',
        borderRadius: 'var(--radius-pill)',
        border: `1px solid ${on ? accent : 'var(--clr-border)'}`,
        background: on ? `color-mix(in srgb, ${accent} 16%, transparent)` : 'var(--clr-card-2)',
        color: on ? 'var(--clr-text)' : 'var(--clr-muted)',
        transition: 'all var(--dur-fast) var(--ease)'
      }
    }, o);
  }));
}
function SFSwitch({
  on,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      width: 40,
      height: 22,
      borderRadius: 11,
      background: on ? 'var(--clr-primary)' : 'var(--clr-border)',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background var(--dur-fast) var(--ease)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 2,
      left: on ? 20 : 2,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      transition: 'left var(--dur-fast) var(--ease)'
    }
  }));
}
/* selectable card grid (voices, avatars, goals) */
function SFPickCard({
  on,
  accent,
  recBadge,
  title,
  sub,
  icon,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      position: 'relative',
      cursor: 'pointer',
      textAlign: 'left',
      padding: '13px 14px',
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${on ? accent : 'var(--clr-border)'}`,
      background: on ? `color-mix(in srgb, ${accent} 12%, transparent)` : 'var(--clr-card)',
      transition: 'all var(--dur-fast) var(--ease)'
    }
  }, recBadge && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -8,
      right: 8,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.05em',
      padding: '2px 7px',
      borderRadius: 'var(--radius-pill)',
      background: accent,
      color: 'var(--clr-bg)'
    }
  }, "AI PICK"), icon && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 5,
      color: accent
    }
  }, /*#__PURE__*/React.createElement(SFIcon, {
    name: icon,
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--clr-text)'
    }
  }, title)), !icon && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--clr-text)'
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--clr-muted)',
      marginTop: icon ? 0 : 3,
      lineHeight: 1.4
    }
  }, sub));
}
function SFFoot({
  left,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 34,
      paddingTop: 22,
      borderTop: '1px solid var(--clr-border)'
    }
  }, left, right || /*#__PURE__*/React.createElement("span", null));
}
/* labeled toggle row for advanced boolean options */
function SFToggleRow({
  label,
  on,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--clr-text)'
    }
  }, label), /*#__PURE__*/React.createElement(SFSwitch, {
    on: on,
    onClick: onClick
  }));
}
/* collapsible "Advanced options" disclosure — keeps novices uncluttered, gives specialists depth */
function SFAdvanced({
  open,
  onToggle,
  children,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      border: '1px solid var(--clr-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--clr-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onToggle,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '12px 15px',
      cursor: 'pointer',
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(SFIcon, {
    name: "SlidersHorizontal",
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--clr-text)',
      flex: 1
    }
  }, "Advanced options"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--clr-muted)'
    }
  }, open ? 'Hide' : 'Optional · fine-tune'), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--clr-muted)',
      display: 'flex',
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease)'
    }
  }, /*#__PURE__*/React.createElement(SFIcon, {
    name: "ChevronDown",
    size: 16
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 15px 16px',
      display: 'grid',
      gap: 14,
      borderTop: '1px solid var(--clr-border)'
    }
  }, children));
}

/* ---------- main flow ---------- */
function StudioFlow({
  studio,
  intelDone,
  onExit,
  onPublish
}) {
  const a = studio.accent;
  const k = studio.key;
  const flow = SFD.STUDIO_FLOW[k];
  const rec = flow.platforms.find(p => p.rec) || flow.platforms[0];

  // step list per modality
  const STEPS = k === 'audio' ? ['Goal', 'Voice', 'Script', 'Production', 'Generate', 'Preview', 'Publish'] : k === 'video' ? ['Format', 'Avatar & script', 'Voiceover', 'Generate', 'Preview', 'Publish'] : ['Brief', 'Generate', 'Preview', 'Publish'];
  const genStep = k === 'audio' ? 4 : k === 'video' ? 3 : 1;
  const [step, setStep] = React.useState(0);
  const [generating, setGenerating] = React.useState(false);
  const [variations, setVariations] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [refine, setRefine] = React.useState('');
  const [regen, setRegen] = React.useState(0);
  const [intelOverride, setIntelOverride] = React.useState(false);

  // text
  const [tAngle, setTAngle] = React.useState(SFD.TEXT_BRIEF.angle.opts[0]);
  const [tMsg, setTMsg] = React.useState('');
  const [tTones, setTTones] = React.useState(['Warm']);
  const [tCtaOn, setTCtaOn] = React.useState(true);
  const [tCta, setTCta] = React.useState(SFD.TEXT_BRIEF.ctas[0]);
  const [tTags, setTTags] = React.useState(true);
  // image
  const [iUse, setIUse] = React.useState(SFD.IMAGE_BRIEF.useCase.opts[0]);
  const [iPrompt, setIPrompt] = React.useState('');
  const [iStyles, setIStyles] = React.useState(['Editorial craft']);
  const [iRatio, setIRatio] = React.useState(flow.specs[0].opts[0]);
  const [iBrand, setIBrand] = React.useState(true);
  // audio
  const [aGoal, setAGoal] = React.useState('podcast');
  const goalCfg = SFD.AUDIO_GOALS.find(g => g.id === aGoal) || SFD.AUDIO_GOALS[0];
  const [aVoice, setAVoice] = React.useState(goalCfg.voice);
  const [aVibes, setAVibes] = React.useState(['Conversational', 'Warm']);
  const [aScript, setAScript] = React.useState('');
  const [aMusic, setAMusic] = React.useState(goalCfg.music);
  const [aExpr, setAExpr] = React.useState(55);
  const [aPace, setAPace] = React.useState(goalCfg.pace);
  const [aAcou, setAAcou] = React.useState(goalCfg.acoustics);
  // video
  const [vPlatform, setVPlatform] = React.useState(rec.type);
  const [vMode, setVMode] = React.useState('avatar'); // avatar | broll
  const [vAvatar, setVAvatar] = React.useState('mia');
  const [vScript, setVScript] = React.useState('');
  const [vVoice, setVVoice] = React.useState('aria');
  const [vAspect, setVAspect] = React.useState(flow.specs[0].opts[0]);
  const [vRes, setVRes] = React.useState(flow.specs[1].opts[0]);
  const [vStyle, setVStyle] = React.useState('Professional');
  const [vPacing, setVPacing] = React.useState(SFD.VIDEO_CONTROLS.pacing[0]);
  const [vHook, setVHook] = React.useState(SFD.VIDEO_CONTROLS.hook[0]);
  const [vMusic, setVMusic] = React.useState(SFD.VIDEO_CONTROLS.music[0]);
  const [vCaptions, setVCaptions] = React.useState(true);

  // advanced disclosure (per-modality optional questions)
  const [advOpen, setAdvOpen] = React.useState(false);
  // text adv
  const [txLen, setTxLen] = React.useState(SFD.ADV.text.length.opts[1]);
  const [txRead, setTxRead] = React.useState(SFD.ADV.text.reading.opts[1]);
  const [txPov, setTxPov] = React.useState(SFD.ADV.text.pov.opts[0]);
  const [txEmoji, setTxEmoji] = React.useState(false);
  const [txKw, setTxKw] = React.useState('');
  // image adv
  const [imLight, setImLight] = React.useState(SFD.ADV.image.lighting.opts[0]);
  const [imComp, setImComp] = React.useState(SFD.ADV.image.composition.opts[0]);
  const [imColor, setImColor] = React.useState(SFD.ADV.image.colorDir.opts[0]);
  const [imNeg, setImNeg] = React.useState('');
  // audio adv
  const [auSpk, setAuSpk] = React.useState(SFD.ADV.audio.speakers.opts[0]);
  const [auIntro, setAuIntro] = React.useState(true);
  const [auChap, setAuChap] = React.useState(false);
  const [auPron, setAuPron] = React.useState('');
  // video adv
  const [viLen, setViLen] = React.useState(SFD.ADV.video.length.opts[2]);
  const [viBroll, setViBroll] = React.useState(SFD.ADV.video.broll.opts[1]);
  const [viLower, setViLower] = React.useState(true);
  const [viSting, setViSting] = React.useState(true);
  const [viSub, setViSub] = React.useState(SFD.ADV.video.subtitle.opts[0]);
  const curPlatform = k === 'video' ? flow.platforms.find(p => p.type === vPlatform) || rec : rec;
  const intelOk = intelDone || intelOverride;
  function startGenerate() {
    setStep(genStep);
    setGenerating(true);
    setVariations(null);
    setSelected(null);
    setTimeout(() => {
      const labels = ['A', 'B', 'C'];
      setVariations(flow.angles.slice(0, 3).map((ang, i) => ({
        ...ang,
        label: labels[i],
        fit: Math.max(72, ang.fit - regen % 2 * 2),
        motif: SF_MOTIF[k]
      })));
      setGenerating(false);
    }, 1400);
  }
  function regenerate() {
    setRegen(r => r + 1);
    startGenerate();
  }
  function goGenerate() {
    if (!intelOk) {
      setStep(genStep);
      setGenerating(false);
      setVariations(null);
      return;
    }
    startGenerate();
  }
  function next() {
    if (step === genStep - 1) {
      goGenerate();
      return;
    }
    setStep(s => s + 1);
  }
  function back() {
    if (step === genStep) setGenerating(false);
    setStep(s => Math.max(0, s - 1));
  }
  function doPublish(mode) {
    const v = variations[selected];
    onPublish({
      title: v.angle + ' — Sourdough Saturday',
      motif: SF_MOTIF[k],
      status: mode === 'publish' ? 'published' : mode === 'schedule' ? 'scheduled' : 'review',
      toast: mode === 'publish' ? `Published to ${curPlatform.label} — added to My Library` : mode === 'schedule' ? 'Scheduled — added to My Library' : 'Added to campaign — sent for review'
    });
  }

  // step validity for the Next button
  function canNext() {
    if (k === 'audio') {
      if (step === 2) return aScript.trim().length > 0; // Script
    }
    if (k === 'video') {
      if (step === 1 && vMode === 'avatar') return vScript.trim().length > 0; // Avatar & script
      if (step === 1 && vMode === 'broll') return vScript.trim().length > 0;
    }
    if (step === genStep) return selected != null && !generating;
    return true;
  }
  function nextLabel() {
    if (step === genStep - 1) return 'Generate →';
    if (step === genStep) return 'Preview & edit →';
    if (step === genStep + 1) return 'Use this →';
    return 'Continue →';
  }
  const Inherit = window.InheritStrip ? React.createElement(window.InheritStrip) : null;
  const overlay = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: 'var(--clr-bg)',
    display: 'flex',
    flexDirection: 'column'
  };

  /* ===== step bodies ===== */
  let body = null;

  // ---- Research gate — shown UP FRONT, before any questions, if Intelligence
  //      isn't complete. Nudge, not a hard block. ----
  if (!intelOk && step === 0) {
    body = /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 480,
        margin: '40px auto 0',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 64,
        height: 64,
        borderRadius: 16,
        background: 'var(--clr-warning-dim)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--clr-warning)',
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement(SFIcon, {
      name: "Lightbulb",
      size: 30
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--type-display-md)',
        color: 'var(--clr-text)',
        margin: 0
      }
    }, "Research recommended first"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--clr-muted)',
        marginTop: 12,
        lineHeight: 1.6
      }
    }, "You haven't completed ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--clr-text)'
      }
    }, "Intelligence"), " yet. It loads your persona, market and brand voice into every step \u2014 so creating without it means weaker results. We recommend finishing Intelligence first, but it's your call."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        marginTop: 26
      }
    }, /*#__PURE__*/React.createElement(SFButton, {
      variant: "outline",
      onClick: () => setIntelOverride(true)
    }, "Create anyway"), /*#__PURE__*/React.createElement(SFButton, {
      accent: a,
      onClick: onExit
    }, "Complete Intelligence first \u2192")));
  }
  // ---- TEXT brief ----
  else if (k === 'text' && step === 0) {
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SFHead, {
      title: "Write the brief",
      sub: "Strategy is loaded \u2014 just shape this one piece. Clara fills the rest."
    }), Inherit, /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      padding: 18,
      radius: "var(--radius-md)",
      style: {
        display: 'grid',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Topic angle"), /*#__PURE__*/React.createElement(SFSelect, {
      value: tAngle,
      onChange: setTAngle,
      opts: SFD.TEXT_BRIEF.angle.opts
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "What should it say?"), /*#__PURE__*/React.createElement(SFTextarea, {
      value: tMsg,
      onChange: setTMsg,
      placeholder: "Describe this post in plain English \u2014 the one idea it must land\u2026"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Tone"), /*#__PURE__*/React.createElement(SFChips, {
      opts: SFD.TEXT_BRIEF.tones,
      sel: tTones,
      accent: a,
      onToggle: o => setTTones(s => s.indexOf(o) >= 0 ? s.filter(x => x !== o) : [...s, o])
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Call to action"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(SFSwitch, {
      on: tCtaOn,
      onClick: () => setTCtaOn(v => !v)
    }), tCtaOn ? /*#__PURE__*/React.createElement(SFSelect, {
      value: tCta,
      onChange: setTCta,
      opts: SFD.TEXT_BRIEF.ctas
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--clr-muted)'
      }
    }, "No CTA"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Hashtags"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(SFSwitch, {
      on: tTags,
      onClick: () => setTTags(v => !v)
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--clr-muted)'
      }
    }, tTags ? 'Auto-suggest' : 'Off'))))), /*#__PURE__*/React.createElement(SFAdvanced, {
      open: advOpen,
      onToggle: () => setAdvOpen(v => !v),
      accent: a
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.text.length.label), /*#__PURE__*/React.createElement(SFSelect, {
      value: txLen,
      onChange: setTxLen,
      opts: SFD.ADV.text.length.opts
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.text.reading.label), /*#__PURE__*/React.createElement(SFSelect, {
      value: txRead,
      onChange: setTxRead,
      opts: SFD.ADV.text.reading.opts
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.text.pov.label), /*#__PURE__*/React.createElement(SFSelect, {
      value: txPov,
      onChange: setTxPov,
      opts: SFD.ADV.text.pov.opts
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.text.keywords.label), /*#__PURE__*/React.createElement(SFTextarea, {
      value: txKw,
      onChange: setTxKw,
      placeholder: SFD.ADV.text.keywords.placeholder,
      rows: 2
    })), /*#__PURE__*/React.createElement(SFToggleRow, {
      label: "Use emoji",
      on: txEmoji,
      onClick: () => setTxEmoji(v => !v)
    })), /*#__PURE__*/React.createElement(SFFoot, {
      left: /*#__PURE__*/React.createElement(SFButton, {
        variant: "outline",
        onClick: onExit
      }, "Cancel"),
      right: /*#__PURE__*/React.createElement(SFButton, {
        accent: a,
        onClick: next
      }, nextLabel())
    }));
  }
  // ---- IMAGE brief ----
  else if (k === 'image' && step === 0) {
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SFHead, {
      title: "Describe the visual",
      sub: "Strategy and brand kit are loaded \u2014 tell us what to picture."
    }), Inherit, /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      padding: 18,
      radius: "var(--radius-md)",
      style: {
        display: 'grid',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Use case"), /*#__PURE__*/React.createElement(SFSelect, {
      value: iUse,
      onChange: setIUse,
      opts: SFD.IMAGE_BRIEF.useCase.opts
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Describe the visual"), /*#__PURE__*/React.createElement(SFTextarea, {
      value: iPrompt,
      onChange: setIPrompt,
      placeholder: "A warm hero image for Sourdough Saturday \u2014 rustic bakery, golden crust, morning light\u2026"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Style references"), /*#__PURE__*/React.createElement(SFChips, {
      opts: SFD.IMAGE_BRIEF.styles,
      sel: iStyles,
      accent: a,
      onToggle: o => setIStyles(s => s.indexOf(o) >= 0 ? s.filter(x => x !== o) : [...s, o])
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        alignItems: 'end'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Aspect ratio"), /*#__PURE__*/React.createElement(SFSelect, {
      value: iRatio,
      onChange: setIRatio,
      opts: flow.specs[0].opts
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Brand kit lock"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(SFSwitch, {
      on: iBrand,
      onClick: () => setIBrand(v => !v)
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--clr-muted)'
      }
    }, iBrand ? 'Colors, logo, type enforced' : 'Off'))))), /*#__PURE__*/React.createElement(SFAdvanced, {
      open: advOpen,
      onToggle: () => setAdvOpen(v => !v),
      accent: a
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.image.lighting.label), /*#__PURE__*/React.createElement(SFSelect, {
      value: imLight,
      onChange: setImLight,
      opts: SFD.ADV.image.lighting.opts
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.image.composition.label), /*#__PURE__*/React.createElement(SFSelect, {
      value: imComp,
      onChange: setImComp,
      opts: SFD.ADV.image.composition.opts
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.image.colorDir.label), /*#__PURE__*/React.createElement(SFSelect, {
      value: imColor,
      onChange: setImColor,
      opts: SFD.ADV.image.colorDir.opts
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.image.negative.label), /*#__PURE__*/React.createElement(SFTextarea, {
      value: imNeg,
      onChange: setImNeg,
      placeholder: SFD.ADV.image.negative.placeholder,
      rows: 2
    }))), /*#__PURE__*/React.createElement(SFFoot, {
      left: /*#__PURE__*/React.createElement(SFButton, {
        variant: "outline",
        onClick: onExit
      }, "Cancel"),
      right: /*#__PURE__*/React.createElement(SFButton, {
        accent: a,
        onClick: next
      }, nextLabel())
    }));
  }
  // ---- AUDIO: Goal ----
  else if (k === 'audio' && step === 0) {
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SFHead, {
      title: "What are we creating?",
      sub: "Pick a goal and Maker pre-tunes the voice, music and pacing. You stay the director."
    }), Inherit, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
        gap: 12
      }
    }, SFD.AUDIO_GOALS.map(g => /*#__PURE__*/React.createElement(SFPickCard, {
      key: g.id,
      on: aGoal === g.id,
      accent: a,
      icon: g.icon,
      title: g.label,
      sub: g.desc,
      onClick: () => {
        setAGoal(g.id);
        setAVoice(g.voice);
        setAMusic(g.music);
        setAPace(g.pace);
        setAAcou(g.acoustics);
      }
    }))), /*#__PURE__*/React.createElement(SFFoot, {
      left: /*#__PURE__*/React.createElement(SFButton, {
        variant: "outline",
        onClick: onExit
      }, "Cancel"),
      right: /*#__PURE__*/React.createElement(SFButton, {
        accent: a,
        onClick: next
      }, nextLabel())
    }));
  }
  // ---- AUDIO: Voice & vibe ----
  else if (k === 'audio' && step === 1) {
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SFHead, {
      title: "Vibe & voice",
      sub: `Approve Maker's picks for a ${goalCfg.label.toLowerCase()} — or swap them.`
    }), /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      padding: 18,
      radius: "var(--radius-md)"
    }, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Voice \xB7 tap to override"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
        gap: 10
      }
    }, SFD.VOICES.map(v => /*#__PURE__*/React.createElement(SFPickCard, {
      key: v.id,
      on: aVoice === v.id,
      accent: a,
      recBadge: v.id === goalCfg.voice,
      title: v.name,
      sub: v.desc,
      onClick: () => setAVoice(v.id)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 18
      }
    }, /*#__PURE__*/React.createElement(SFLabel, null, "Vibe tones"), /*#__PURE__*/React.createElement(SFChips, {
      opts: SFD.AUDIO_VIBES,
      sel: aVibes,
      accent: a,
      onToggle: o => setAVibes(s => s.indexOf(o) >= 0 ? s.filter(x => x !== o) : [...s, o])
    }))), /*#__PURE__*/React.createElement(SFFoot, {
      left: /*#__PURE__*/React.createElement(SFButton, {
        variant: "outline",
        onClick: back
      }, "\u2190 Back"),
      right: /*#__PURE__*/React.createElement(SFButton, {
        accent: a,
        onClick: next
      }, nextLabel())
    }));
  }
  // ---- AUDIO: Script ----
  else if (k === 'audio' && step === 2) {
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SFHead, {
      title: "Script",
      sub: "Paste it, let Maker draft it, or upload a file \u2014 then edit freely."
    }), /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      padding: 18,
      radius: "var(--radius-md)"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(SFButton, {
      variant: "outline",
      size: "sm",
      onClick: () => setAScript(`HOST: Welcome back. Today we're up at 4am to find out what really happens before the doors open — flour, water, time, and a 72-hour cold ferment.`)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(SFIcon, {
      name: "Sparkles",
      size: 13
    }), "Draft with AI")), /*#__PURE__*/React.createElement(SFButton, {
      variant: "outline",
      size: "sm"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(SFIcon, {
      name: "Upload",
      size: 13
    }), "Upload file"))), /*#__PURE__*/React.createElement(SFTextarea, {
      value: aScript,
      onChange: setAScript,
      placeholder: "Paste or write your script here\u2026",
      rows: 9
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--clr-muted)',
        marginTop: 8
      }
    }, "Accepts .pdf, .docx, .txt \xB7 ", aScript ? aScript.length + ' characters' : 'no script yet')), /*#__PURE__*/React.createElement(SFFoot, {
      left: /*#__PURE__*/React.createElement(SFButton, {
        variant: "outline",
        onClick: back
      }, "\u2190 Back"),
      right: /*#__PURE__*/React.createElement(SFButton, {
        accent: a,
        disabled: !canNext(),
        onClick: next
      }, nextLabel())
    }));
  }
  // ---- AUDIO: Production ----
  else if (k === 'audio' && step === 3) {
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SFHead, {
      title: "Production",
      sub: "Maker did the technical heavy lifting. Tweak anything before we generate."
    }), /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      padding: 18,
      radius: "var(--radius-md)",
      style: {
        display: 'grid',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Background music"), /*#__PURE__*/React.createElement(SFSelect, {
      value: aMusic,
      onChange: setAMusic,
      opts: SFD.AUDIO_PRODUCTION.music
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Pacing"), /*#__PURE__*/React.createElement(SFSelect, {
      value: aPace,
      onChange: setAPace,
      opts: SFD.AUDIO_PRODUCTION.pace
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        alignItems: 'end'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Acoustics"), /*#__PURE__*/React.createElement(SFSelect, {
      value: aAcou,
      onChange: setAAcou,
      opts: SFD.AUDIO_PRODUCTION.acoustics
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Expressiveness \xB7 ", aExpr), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "0",
      max: "100",
      value: aExpr,
      onChange: e => setAExpr(+e.target.value),
      style: {
        width: '100%',
        accentColor: a
      }
    })))), /*#__PURE__*/React.createElement(SFAdvanced, {
      open: advOpen,
      onToggle: () => setAdvOpen(v => !v),
      accent: a
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.audio.speakers.label), /*#__PURE__*/React.createElement(SFSelect, {
      value: auSpk,
      onChange: setAuSpk,
      opts: SFD.ADV.audio.speakers.opts
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.audio.pronounce.label), /*#__PURE__*/React.createElement(SFTextarea, {
      value: auPron,
      onChange: setAuPron,
      placeholder: SFD.ADV.audio.pronounce.placeholder,
      rows: 2
    })), /*#__PURE__*/React.createElement(SFToggleRow, {
      label: "Intro & outro",
      on: auIntro,
      onClick: () => setAuIntro(v => !v)
    }), /*#__PURE__*/React.createElement(SFToggleRow, {
      label: "Chapter markers",
      on: auChap,
      onClick: () => setAuChap(v => !v)
    })), /*#__PURE__*/React.createElement(SFFoot, {
      left: /*#__PURE__*/React.createElement(SFButton, {
        variant: "outline",
        onClick: back
      }, "\u2190 Back"),
      right: /*#__PURE__*/React.createElement(SFButton, {
        accent: a,
        onClick: next
      }, nextLabel())
    }));
  }
  // ---- VIDEO: Format ----
  else if (k === 'video' && step === 0) {
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SFHead, {
      title: "Format & platform",
      sub: "Pick where this lands \u2014 it sets the aspect and resolution. Your strategy is already loaded."
    }), Inherit, /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      style: {
        display: 'flex',
        gap: 11,
        alignItems: 'flex-start',
        borderColor: `color-mix(in srgb, ${a} 40%, transparent)`,
        marginBottom: 16
      },
      padding: 14,
      radius: "var(--radius-md)"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: a,
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(SFIcon, {
      name: "Sparkles",
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--clr-text)',
        lineHeight: 1.5
      }
    }, /*#__PURE__*/React.createElement("b", null, "AI recommends ", rec.label), " \u2014 ", rec.reason, " Tap any option to override.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
        gap: 10
      }
    }, flow.platforms.map(p => /*#__PURE__*/React.createElement(SFPickCard, {
      key: p.type,
      on: vPlatform === p.type,
      accent: a,
      recBadge: p.rec,
      icon: p.icon,
      title: p.label,
      onClick: () => setVPlatform(p.type)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Aspect ratio"), /*#__PURE__*/React.createElement(SFSelect, {
      value: vAspect,
      onChange: setVAspect,
      opts: flow.specs[0].opts
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Resolution"), /*#__PURE__*/React.createElement(SFSelect, {
      value: vRes,
      onChange: setVRes,
      opts: flow.specs[1].opts
    }))), /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      padding: 18,
      radius: "var(--radius-md)",
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Visual style"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }
    }, SFD.VIDEO_CONTROLS.style.map(o => {
      const on = vStyle === o;
      return /*#__PURE__*/React.createElement("span", {
        key: o,
        onClick: () => setVStyle(o),
        style: {
          cursor: 'pointer',
          fontSize: 12.5,
          padding: '6px 13px',
          borderRadius: 'var(--radius-pill)',
          border: `1px solid ${on ? a : 'var(--clr-border)'}`,
          background: on ? `color-mix(in srgb, ${a} 16%, transparent)` : 'var(--clr-card)',
          color: on ? 'var(--clr-text)' : 'var(--clr-muted)',
          transition: 'all var(--dur-fast) var(--ease)'
        }
      }, o);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12,
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Pacing"), /*#__PURE__*/React.createElement(SFSelect, {
      value: vPacing,
      onChange: setVPacing,
      opts: SFD.VIDEO_CONTROLS.pacing
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Hook style"), /*#__PURE__*/React.createElement(SFSelect, {
      value: vHook,
      onChange: setVHook,
      opts: SFD.VIDEO_CONTROLS.hook
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Music"), /*#__PURE__*/React.createElement(SFSelect, {
      value: vMusic,
      onChange: setVMusic,
      opts: SFD.VIDEO_CONTROLS.music
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement(SFSwitch, {
      on: vCaptions,
      onClick: () => setVCaptions(v => !v)
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--clr-muted)'
      }
    }, "Burn-in captions ", vCaptions ? '· on' : '· off'))), /*#__PURE__*/React.createElement(SFAdvanced, {
      open: advOpen,
      onToggle: () => setAdvOpen(v => !v),
      accent: a
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.video.length.label), /*#__PURE__*/React.createElement(SFSelect, {
      value: viLen,
      onChange: setViLen,
      opts: SFD.ADV.video.length.opts
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.video.broll.label), /*#__PURE__*/React.createElement(SFSelect, {
      value: viBroll,
      onChange: setViBroll,
      opts: SFD.ADV.video.broll.opts
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, SFD.ADV.video.subtitle.label), /*#__PURE__*/React.createElement(SFSelect, {
      value: viSub,
      onChange: setViSub,
      opts: SFD.ADV.video.subtitle.opts
    })), /*#__PURE__*/React.createElement(SFToggleRow, {
      label: "On-screen text / lower-thirds",
      on: viLower,
      onClick: () => setViLower(v => !v)
    }), /*#__PURE__*/React.createElement(SFToggleRow, {
      label: "Brand intro sting",
      on: viSting,
      onClick: () => setViSting(v => !v)
    })), /*#__PURE__*/React.createElement(SFFoot, {
      left: /*#__PURE__*/React.createElement(SFButton, {
        variant: "outline",
        onClick: onExit
      }, "Cancel"),
      right: /*#__PURE__*/React.createElement(SFButton, {
        accent: a,
        onClick: next
      }, nextLabel())
    }));
  }
  // ---- VIDEO: Avatar & script ----
  else if (k === 'video' && step === 1) {
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SFHead, {
      title: "Presenter & script",
      sub: "Choose how your video is fronted, then give it words to say."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(SFTabs, {
      value: vMode,
      onChange: setVMode,
      tabs: [{
        id: 'avatar',
        label: 'AI Avatar'
      }, {
        id: 'broll',
        label: 'B-roll / footage'
      }]
    })), vMode === 'avatar' ? /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      padding: 18,
      radius: "var(--radius-md)"
    }, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Pick a presenter"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
        gap: 10
      }
    }, SFD.AVATARS.map(av => {
      const on = vAvatar === av.id;
      return /*#__PURE__*/React.createElement("div", {
        key: av.id,
        onClick: () => setVAvatar(av.id),
        style: {
          cursor: 'pointer',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${on ? av.accent : 'var(--clr-border)'}`,
          background: on ? `color-mix(in srgb, ${av.accent} 10%, transparent)` : 'var(--clr-card)',
          overflow: 'hidden',
          transition: 'all var(--dur-fast) var(--ease)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          aspectRatio: '1/1',
          background: `color-mix(in srgb, ${av.accent} 18%, var(--clr-card-2))`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: av.accent
        }
      }, /*#__PURE__*/React.createElement(SFIcon, {
        name: "User",
        size: 34,
        strokeWidth: 1.5
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '9px 11px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--clr-text)'
        }
      }, av.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: 'var(--clr-muted)',
          marginTop: 2
        }
      }, av.role)));
    }))) : /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      padding: 18,
      radius: "var(--radius-md)",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: a,
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(SFIcon, {
      name: "Clapperboard",
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--clr-muted)',
        lineHeight: 1.5
      }
    }, "Maker will assemble brand-safe stock B-roll and motion graphics from your script \u2014 no on-screen presenter.")), /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      padding: 18,
      radius: "var(--radius-md)",
      style: {
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement(SFLabel, null, "Script ", vMode === 'avatar' ? '· what the avatar says' : '· voiceover copy'), /*#__PURE__*/React.createElement(SFButton, {
      variant: "ghost",
      size: "sm",
      onClick: () => setVScript('Stop paying full price for bread that was frozen weeks ago. Every Saturday we cold-ferment for 72 hours, stone-bake at dawn, and sell out by noon. Pre-order now — link below.')
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(SFIcon, {
      name: "Sparkles",
      size: 13
    }), "Draft with AI"))), /*#__PURE__*/React.createElement(SFTextarea, {
      value: vScript,
      onChange: setVScript,
      placeholder: "Write the script the presenter will deliver\u2026",
      rows: 5
    })), /*#__PURE__*/React.createElement(SFFoot, {
      left: /*#__PURE__*/React.createElement(SFButton, {
        variant: "outline",
        onClick: back
      }, "\u2190 Back"),
      right: /*#__PURE__*/React.createElement(SFButton, {
        accent: a,
        disabled: !canNext(),
        onClick: next
      }, nextLabel())
    }));
  }
  // ---- VIDEO: Voiceover ----
  else if (k === 'video' && step === 2) {
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SFHead, {
      title: "Voiceover",
      sub: vMode === 'avatar' ? "Pick the voice your avatar speaks with." : 'Pick the narration voice for your footage.'
    }), /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      padding: 18,
      radius: "var(--radius-md)"
    }, /*#__PURE__*/React.createElement(SFLabel, {
      hint: true
    }, "Voice \xB7 tap to choose"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
        gap: 10
      }
    }, SFD.VOICES.map(v => /*#__PURE__*/React.createElement(SFPickCard, {
      key: v.id,
      on: vVoice === v.id,
      accent: a,
      recBadge: v.id === 'aria',
      title: v.name,
      sub: v.desc,
      onClick: () => setVVoice(v.id)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        color: 'var(--clr-muted)'
      }
    }, /*#__PURE__*/React.createElement(SFButton, {
      variant: "outline",
      size: "sm"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(SFIcon, {
      name: "Play",
      size: 12
    }), "Hear a 5-sec sample")), "using the ", SFD.VOICES.find(v => v.id === vVoice).name, " voice")), /*#__PURE__*/React.createElement(SFFoot, {
      left: /*#__PURE__*/React.createElement(SFButton, {
        variant: "outline",
        onClick: back
      }, "\u2190 Back"),
      right: /*#__PURE__*/React.createElement(SFButton, {
        accent: a,
        onClick: next
      }, nextLabel())
    }));
  }
  // ---- GENERATE (gate / loading / variations preview) ----
  else if (step === genStep) {
    if (!intelOk) {
      body = /*#__PURE__*/React.createElement("div", {
        style: {
          maxWidth: 460,
          margin: '40px auto 0',
          textAlign: 'center'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'var(--clr-warning-dim)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--clr-warning)',
          marginBottom: 20
        }
      }, /*#__PURE__*/React.createElement(SFIcon, {
        name: "Lightbulb",
        size: 30
      })), /*#__PURE__*/React.createElement("h2", {
        style: {
          font: 'var(--type-display-md)',
          color: 'var(--clr-text)',
          margin: 0
        }
      }, "Research recommended first"), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 14,
          color: 'var(--clr-muted)',
          marginTop: 12,
          lineHeight: 1.6
        }
      }, "You haven't completed ", /*#__PURE__*/React.createElement("b", {
        style: {
          color: 'var(--clr-text)'
        }
      }, "Intelligence"), " yet. Generating without it means weaker persona fit and messaging. We recommend finishing Intelligence first \u2014 but it's your call."), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          marginTop: 26
        }
      }, /*#__PURE__*/React.createElement(SFButton, {
        variant: "outline",
        onClick: () => {
          setIntelOverride(true);
          startGenerate();
        }
      }, "Generate anyway"), /*#__PURE__*/React.createElement(SFButton, {
        accent: a,
        onClick: onExit
      }, "Complete Intelligence first \u2192")));
    } else if (generating) {
      body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: 'center',
          marginBottom: 20
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 15,
          color: 'var(--clr-text)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          gap: 3
        }
      }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
        key: i,
        style: {
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: a,
          animation: `sf-pulse-dot 1s ease-in-out ${i * 0.16}s infinite`
        }
      }))), "Maker is generating ", studio.name.toLowerCase(), " variations\u2026"), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          color: 'var(--clr-muted)',
          marginTop: 6
        }
      }, "Scoring against The Artisan Loyalist")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 14
        }
      }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          border: '1px solid var(--clr-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'var(--clr-card)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "sf-skeleton",
        style: {
          aspectRatio: '4/3'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '12px 13px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "sf-skeleton",
        style: {
          height: 11,
          width: '70%',
          borderRadius: 4
        }
      }), /*#__PURE__*/React.createElement("div", {
        className: "sf-skeleton",
        style: {
          height: 9,
          width: '100%',
          borderRadius: 4,
          marginTop: 9
        }
      }), /*#__PURE__*/React.createElement("div", {
        className: "sf-skeleton",
        style: {
          height: 9,
          width: '85%',
          borderRadius: 4,
          marginTop: 6
        }
      }))))));
    } else {
      body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SFHead, {
        title: k === 'video' ? 'Variations preview' : 'Generate',
        sub: "Three options scored for persona fit. Pick one to preview and refine."
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 14,
          marginTop: 6
        }
      }, (variations || []).map((v, i) => {
        const on = selected === i;
        return /*#__PURE__*/React.createElement(SFCard, {
          key: i,
          interactive: true,
          onClick: () => setSelected(i),
          padding: 0,
          radius: "var(--radius-md)",
          className: "sf-reveal",
          style: {
            overflow: 'hidden',
            borderColor: on ? a : 'var(--clr-border)',
            boxShadow: on ? `0 0 0 1px ${a}` : undefined,
            animation: `sf-card-in .4s cubic-bezier(.2,.7,.3,1) ${i * 0.09}s both`
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            aspectRatio: '4/3',
            background: `color-mix(in srgb, ${a} 14%, var(--clr-card-2))`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: a,
            position: 'relative'
          }
        }, /*#__PURE__*/React.createElement(SFIcon, {
          name: v.motif,
          size: 34,
          strokeWidth: 1.75
        }), k === 'video' && /*#__PURE__*/React.createElement("span", {
          style: {
            position: 'absolute',
            top: 8,
            left: 8,
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--clr-card)',
            color: 'var(--clr-muted)',
            border: '1px solid var(--clr-border)'
          }
        }, vStyle, " \xB7 ", vMode === 'avatar' ? SFD.AVATARS.find(x => x.id === vAvatar).name : 'B-roll'), /*#__PURE__*/React.createElement("span", {
          style: {
            position: 'absolute',
            bottom: 8,
            right: 8,
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: 'var(--radius-pill)',
            background: v.fit >= 85 ? 'var(--clr-accent-dim)' : 'var(--clr-card)',
            color: v.fit >= 85 ? 'var(--clr-accent)' : 'var(--clr-muted)',
            border: '1px solid var(--clr-border)'
          }
        }, v.fit, "% fit")), /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '12px 13px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--clr-text)'
          }
        }, "Variation ", v.label, " \xB7 ", v.angle), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 12,
            color: 'var(--clr-muted)',
            marginTop: 5,
            lineHeight: 1.45
          }
        }, v.desc)));
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: 'center',
          marginTop: 14
        }
      }, /*#__PURE__*/React.createElement(SFButton, {
        variant: "ghost",
        size: "sm",
        onClick: regenerate
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6
        }
      }, /*#__PURE__*/React.createElement(SFIcon, {
        name: "RefreshCw",
        size: 13
      }), "Regenerate variations"))), /*#__PURE__*/React.createElement(SFFoot, {
        left: /*#__PURE__*/React.createElement(SFButton, {
          variant: "outline",
          onClick: back
        }, "\u2190 Back"),
        right: /*#__PURE__*/React.createElement(SFButton, {
          accent: a,
          disabled: selected == null,
          onClick: () => setStep(genStep + 1)
        }, nextLabel())
      }));
    }
  }
  // ---- PREVIEW & EDIT ----
  else if (step === genStep + 1) {
    const v = variations[selected];
    const selName = (arr, id) => {
      const x = arr.find(e => e.id === id);
      return x ? x.name : '';
    };
    let editFields = null;
    if (k === 'text') {
      editFields = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Topic angle"), /*#__PURE__*/React.createElement(SFSelect, {
        value: tAngle,
        onChange: setTAngle,
        opts: SFD.TEXT_BRIEF.angle.opts
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Tone"), /*#__PURE__*/React.createElement(SFChips, {
        opts: SFD.TEXT_BRIEF.tones,
        sel: tTones,
        accent: a,
        onToggle: o => setTTones(s => s.indexOf(o) >= 0 ? s.filter(x => x !== o) : [...s, o])
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement(SFSwitch, {
        on: tCtaOn,
        onClick: () => setTCtaOn(x => !x)
      }), tCtaOn ? /*#__PURE__*/React.createElement(SFSelect, {
        value: tCta,
        onChange: setTCta,
        opts: SFD.TEXT_BRIEF.ctas
      }) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          color: 'var(--clr-muted)'
        }
      }, "No CTA")));
    } else if (k === 'image') {
      editFields = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Use case"), /*#__PURE__*/React.createElement(SFSelect, {
        value: iUse,
        onChange: setIUse,
        opts: SFD.IMAGE_BRIEF.useCase.opts
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Style references"), /*#__PURE__*/React.createElement(SFChips, {
        opts: SFD.IMAGE_BRIEF.styles,
        sel: iStyles,
        accent: a,
        onToggle: o => setIStyles(s => s.indexOf(o) >= 0 ? s.filter(x => x !== o) : [...s, o])
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          alignItems: 'end'
        }
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Aspect ratio"), /*#__PURE__*/React.createElement(SFSelect, {
        value: iRatio,
        onChange: setIRatio,
        opts: flow.specs[0].opts
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(SFSwitch, {
        on: iBrand,
        onClick: () => setIBrand(x => !x)
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11.5,
          color: 'var(--clr-muted)'
        }
      }, "Brand kit"))));
    } else if (k === 'audio') {
      editFields = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Voice"), /*#__PURE__*/React.createElement(SFSelect, {
        value: selName(SFD.VOICES, aVoice),
        onChange: n => {
          const x = SFD.VOICES.find(e => e.name === n);
          if (x) setAVoice(x.id);
        },
        opts: SFD.VOICES.map(e => e.name)
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Music"), /*#__PURE__*/React.createElement(SFSelect, {
        value: aMusic,
        onChange: setAMusic,
        opts: SFD.AUDIO_PRODUCTION.music
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Pacing"), /*#__PURE__*/React.createElement(SFSelect, {
        value: aPace,
        onChange: setAPace,
        opts: SFD.AUDIO_PRODUCTION.pace
      }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Acoustics"), /*#__PURE__*/React.createElement(SFSelect, {
        value: aAcou,
        onChange: setAAcou,
        opts: SFD.AUDIO_PRODUCTION.acoustics
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Expressiveness \xB7 ", aExpr), /*#__PURE__*/React.createElement("input", {
        type: "range",
        min: "0",
        max: "100",
        value: aExpr,
        onChange: e => setAExpr(+e.target.value),
        style: {
          width: '100%',
          accentColor: a
        }
      })));
    } else {
      // video
      editFields = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Platform"), /*#__PURE__*/React.createElement(SFSelect, {
        value: curPlatform.label,
        onChange: label => {
          const p = flow.platforms.find(x => x.label === label);
          if (p) setVPlatform(p.type);
        },
        opts: flow.platforms.map(p => p.label)
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Visual style"), /*#__PURE__*/React.createElement(SFSelect, {
        value: vStyle,
        onChange: setVStyle,
        opts: SFD.VIDEO_CONTROLS.style
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Pacing"), /*#__PURE__*/React.createElement(SFSelect, {
        value: vPacing,
        onChange: setVPacing,
        opts: SFD.VIDEO_CONTROLS.pacing
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Hook"), /*#__PURE__*/React.createElement(SFSelect, {
        value: vHook,
        onChange: setVHook,
        opts: SFD.VIDEO_CONTROLS.hook
      }))), vMode === 'avatar' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Presenter"), /*#__PURE__*/React.createElement(SFSelect, {
        value: selName(SFD.AVATARS, vAvatar),
        onChange: n => {
          const x = SFD.AVATARS.find(e => e.name === n);
          if (x) setVAvatar(x.id);
        },
        opts: SFD.AVATARS.map(e => e.name)
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          alignItems: 'end'
        }
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SFLabel, null, "Voiceover"), /*#__PURE__*/React.createElement(SFSelect, {
        value: selName(SFD.VOICES, vVoice),
        onChange: n => {
          const x = SFD.VOICES.find(e => e.name === n);
          if (x) setVVoice(x.id);
        },
        opts: SFD.VOICES.map(e => e.name)
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(SFSwitch, {
        on: vCaptions,
        onClick: () => setVCaptions(x => !x)
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11.5,
          color: 'var(--clr-muted)'
        }
      }, "Captions"))));
    }
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SFHead, {
      title: "Preview & edit",
      sub: "Refine the copy, change any choice you made, or regenerate with your notes."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 18,
        marginTop: 6,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(SFCard, {
      padding: 0,
      radius: "var(--radius-md)",
      style: {
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '4/3',
        background: `color-mix(in srgb, ${a} 16%, var(--clr-card-2))`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        position: 'relative',
        color: a
      }
    }, /*#__PURE__*/React.createElement(SFIcon, {
      name: v.motif,
      size: 48,
      strokeWidth: 1.5
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        fontSize: 11,
        color: 'var(--clr-text)',
        background: 'var(--clr-card)',
        border: '1px solid var(--clr-border)',
        borderRadius: 'var(--radius-pill)',
        padding: '4px 11px'
      }
    }, v.angle, " \xB7 ", curPlatform.label))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      padding: 14,
      radius: "var(--radius-md)"
    }, /*#__PURE__*/React.createElement(SFLabel, null, "Your selections \xB7 editable"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 12
      }
    }, editFields)), /*#__PURE__*/React.createElement(SFCard, {
      inset: true,
      padding: 14,
      radius: "var(--radius-md)"
    }, /*#__PURE__*/React.createElement(SFLabel, null, "Refine this draft"), /*#__PURE__*/React.createElement(SFTextarea, {
      value: refine,
      onChange: setRefine,
      placeholder: "e.g. punchier hook, warmer close, add the Friday cut-off\u2026",
      rows: 3
    }), /*#__PURE__*/React.createElement(SFButton, {
      variant: "outline",
      size: "sm",
      onClick: regenerate,
      style: {
        width: '100%',
        marginTop: 10,
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(SFIcon, {
      name: "RefreshCw",
      size: 13
    }), "Regenerate with changes"))))), /*#__PURE__*/React.createElement(SFFoot, {
      left: /*#__PURE__*/React.createElement(SFButton, {
        variant: "outline",
        onClick: () => setStep(genStep)
      }, "\u2190 Variations"),
      right: /*#__PURE__*/React.createElement(SFButton, {
        accent: a,
        onClick: () => setStep(genStep + 2)
      }, nextLabel())
    }));
  }
  // ---- PUBLISH ----
  else {
    const v = variations[selected];
    const pubOpt = (icon, t, sub, mode) => /*#__PURE__*/React.createElement(SFCard, {
      interactive: true,
      onClick: () => doPublish(mode),
      padding: 18,
      radius: "var(--radius-md)",
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        color: a
      }
    }, /*#__PURE__*/React.createElement(SFIcon, {
      name: icon,
      size: 24
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--clr-text)',
        marginTop: 8
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--clr-muted)',
        marginTop: 3
      }
    }, sub));
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SFHead, {
      title: "Publish",
      sub: `Your ${studio.name.toLowerCase()} is ready. Ship it, schedule it, or drop it into a campaign.`
    }), /*#__PURE__*/React.createElement(SFCard, {
      style: {
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        margin: '6px 0 22px'
      },
      padding: 16,
      radius: "var(--radius-lg)"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 64,
        height: 64,
        borderRadius: 12,
        background: `color-mix(in srgb, ${a} 16%, var(--clr-card-2))`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: a
      }
    }, /*#__PURE__*/React.createElement(SFIcon, {
      name: v.motif,
      size: 30
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--clr-text)'
      }
    }, v.angle, " \u2014 Sourdough Saturday"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--clr-muted)',
        marginTop: 4
      }
    }, "Variation ", v.label, " \xB7 ", curPlatform.label))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 12
      }
    }, pubOpt('Rocket', 'Publish now', `Push live to ${curPlatform.label}`, 'publish'), pubOpt('CalendarClock', 'Schedule', 'Queue for later', 'schedule'), pubOpt('FolderPlus', 'Add to campaign', 'Send for review', 'campaign')), /*#__PURE__*/React.createElement(SFFoot, {
      left: /*#__PURE__*/React.createElement(SFButton, {
        variant: "outline",
        onClick: () => setStep(genStep + 1)
      }, "\u2190 Back")
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: overlay
  }, /*#__PURE__*/React.createElement(SFAnims, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 24px',
      borderBottom: '1px solid var(--clr-border)',
      flexShrink: 0
    }
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
  }, "Studio ", studio.name), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'normal',
      color: a
    }
  }, "New ", studio.name.toLowerCase())), /*#__PURE__*/React.createElement(SFButton, {
    variant: "outline",
    size: "sm",
    onClick: onExit
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(SFIcon, {
    name: "X",
    size: 13
  }), "Exit"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto',
      padding: '28px 24px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 30
    }
  }, !(!intelOk && step === 0) && /*#__PURE__*/React.createElement(SFWizard, {
    steps: STEPS,
    current: step + 1
  })), /*#__PURE__*/React.createElement("div", {
    key: `${step}-${generating ? 'g' : ''}-${variations ? 'v' : ''}-${intelOk ? 'ok' : 'gate'}`,
    className: "sf-step",
    style: {
      animation: 'sf-step-in .34s cubic-bezier(.2,.7,.3,1) both'
    }
  }, body))));
}
function SFHead({
  title,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-display-md)',
      color: 'var(--clr-text)',
      margin: 0
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--clr-muted)',
      marginTop: 8,
      maxWidth: 520,
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: 1.5
    }
  }, sub));
}
window.StudioFlow = StudioFlow;
})();
