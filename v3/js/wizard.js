/* wizard.js — unified 5-step studio wizard (replaces studioflow.js)
   All modalities share the same 5-step spine:
     1. Platform  — where does this piece live?
     2. Brief     — the core idea / script
     3. Production — voice / style / specs
     4. Generate  — 3 AI variations scored for persona fit
     5. Preview   — refine + publish / schedule / campaign (inline)
   Exposes window.StudioFlow (drop-in replacement). */
(function () {
'use strict';

const SFDS = window.ClarityDesignSystem_29c088;
const { Button: SFButton, Card: SFCard, Icon: SFIcon, WizardSteps: SFWizard } = SFDS;
const SFD = window.ClarityData;

const SF_MOTIF = { text: 'FileText', image: 'Image', video: 'Clapperboard', audio: 'AudioLines' };
const STEPS = ['What?', 'Where?', 'Format', 'Brief', 'Generate'];
const GEN_STEP = 4;

/* ── Keyframes injected once ──────────────────────────────────────── */
function SFAnims() {
  return React.createElement('style', null, `
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

/* ── Per-platform persona fit scores for The Artisan Loyalist ─────── */
const PLATFORM_FIT = {
  /* image */
  'ig-feed':    88,  /* best — visual craft, aspirational stills */
  'ig-story':   71,  /* good — ephemeral, less craft emphasis */
  'fb-ad':      46,  /* weak — broad audience, not craft-led */
  'poster':     55,  /* moderate — visual but wrong distribution */
  'pinterest':  78,  /* good — discovery, aspirational */
  /* video */
  'ig-reel':    86,  /* best — lifestyle short-form */
  'yt-short':   68,  /* decent — less persona overlap */
  'tiktok':     62,  /* ok — younger skew, less artisan resonance */
  /* text */
  'email':      84,  /* best — owned audience, high loyalty */
  'linkedin':   66,  /* moderate — professional, less warmth */
  'blog':       73,  /* good — long-form craft storytelling */
  /* audio */
  'podcast':    82,  /* best — trust-building, loyalist listens */
  'voiceover':  60,  /* moderate */
  'audio-ad':   44,  /* weakest — interruptive format */
};

/* ── Persona fit live bar ─────────────────────────────────────────── */
function PersonaFitBar({ step, studioKey, platform, rec, variations, selected }) {
  if (!studioKey) return null;

  let fit;
  if (selected != null && variations && variations[selected]) {
    /* Variation chosen — use its real fit score */
    fit = variations[selected].fit;
  } else if (step >= 1 && platform && PLATFORM_FIT[platform] != null) {
    /* Use the specific per-platform score, nudged slightly per extra step */
    const base  = PLATFORM_FIT[platform];
    const bonus = Math.max(0, step - 1) * 3;
    fit = Math.min(base + 6, base + bonus);
  } else if (step >= 1 && platform) {
    fit = rec && platform === rec.type ? 74 : 52;
  } else {
    /* Just picked a modality */
    fit = 38;
  }

  const color = fit >= 85 ? 'var(--clr-accent)' : fit >= 68 ? 'var(--clr-primary)' : 'var(--clr-primary-hover)';

  return React.createElement('div', {
    style: {
      width: 32, flexShrink: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '0 0 10px', gap: 8,
      height: 200
    }
  },
    /* percentage */
    React.createElement('span', {
      style: { fontSize: 9, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }
    }, fit + '%'),
    /* vertical track */
    React.createElement('div', {
      style: { flex: 1, width: 3, borderRadius: 2, background: 'var(--clr-border)', position: 'relative', overflow: 'hidden' }
    },
      React.createElement('div', {
        style: {
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: fit + '%', background: color, borderRadius: 2,
          transition: 'height .7s cubic-bezier(.2,.8,.3,1), background .4s ease'
        }
      })
    ),
    /* rotated label */
    React.createElement('span', {
      style: {
        fontSize: 7.5, fontWeight: 700, color: 'var(--clr-muted)',
        textTransform: 'uppercase', letterSpacing: '0.07em',
        writingMode: 'vertical-rl', transform: 'rotate(180deg)',
        whiteSpace: 'nowrap'
      }
    }, 'Loyalist fit')
  );
}

/* ── Shared primitives ────────────────────────────────────────────── */
function SFLabel({ children, hint }) {
  return React.createElement('div', {
    style: {
      display: 'flex', alignItems: 'center', gap: 6,
      font: 'var(--type-label-xs)', fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: 'var(--label-tracking)', color: 'var(--clr-muted)', marginBottom: 8
    }
  }, children, hint && React.createElement(SFIcon, { name: 'Sparkles', size: 11, color: 'var(--clr-primary-hover)' }));
}

function SFSelect({ value, onChange, opts }) {
  return React.createElement('select', {
    value, onChange: e => onChange(e.target.value),
    style: {
      width: '100%', background: 'var(--clr-card-2)', border: '1px solid var(--clr-border)',
      borderRadius: 'var(--radius-sm)', color: 'var(--clr-text)', font: 'var(--type-body)',
      padding: '9px 11px', appearance: 'none'
    }
  }, opts.map(o => React.createElement('option', { key: o }, o)));
}

function SFTextarea({ value, onChange, placeholder, rows = 4 }) {
  return React.createElement('textarea', {
    value, onChange: e => onChange(e.target.value), placeholder, rows,
    style: {
      width: '100%', background: 'var(--clr-card-2)', border: '1px solid var(--clr-border)',
      borderRadius: 'var(--radius-sm)', color: 'var(--clr-text)', font: 'var(--type-body)',
      padding: '10px 12px', resize: 'vertical', lineHeight: 1.5
    }
  });
}

function SFChips({ opts, sel, onToggle, accent }) {
  return React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
    opts.map(o => {
      const on = sel.indexOf(o) >= 0;
      return React.createElement('span', {
        key: o, onClick: () => onToggle(o),
        style: {
          cursor: 'pointer', fontSize: 12.5, padding: '5px 12px',
          borderRadius: 'var(--radius-pill)',
          border: `1px solid ${on ? accent : 'var(--clr-border)'}`,
          background: on ? `color-mix(in srgb, ${accent} 16%, transparent)` : 'var(--clr-card-2)',
          color: on ? 'var(--clr-text)' : 'var(--clr-muted)',
          transition: 'all var(--dur-fast) var(--ease)'
        }
      }, o);
    })
  );
}

function SFSwitch({ on, onClick }) {
  return React.createElement('div', {
    onClick,
    style: {
      width: 40, height: 22, borderRadius: 11, flexShrink: 0,
      background: on ? 'var(--clr-primary)' : 'var(--clr-border)',
      position: 'relative', cursor: 'pointer',
      transition: 'background var(--dur-fast) var(--ease)'
    }
  }, React.createElement('div', {
    style: {
      position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18,
      borderRadius: '50%', background: '#fff',
      transition: 'left var(--dur-fast) var(--ease)'
    }
  }));
}

function SFPickCard({ on, accent, recBadge, title, sub, icon, onClick }) {
  return React.createElement('div', {
    onClick,
    style: {
      position: 'relative', cursor: 'pointer', textAlign: 'left',
      padding: '13px 14px', borderRadius: 'var(--radius-md)',
      border: `1px solid ${on ? accent : 'var(--clr-border)'}`,
      background: on ? `color-mix(in srgb, ${accent} 12%, transparent)` : 'var(--clr-card)',
      transition: 'all var(--dur-fast) var(--ease)'
    }
  },
    recBadge && React.createElement('span', {
      style: {
        position: 'absolute', top: -8, right: 8, fontSize: 9, fontWeight: 700,
        letterSpacing: '0.05em', padding: '2px 7px', borderRadius: 'var(--radius-pill)',
        background: accent, color: 'var(--clr-bg)'
      }
    }, 'AI PICK'),
    icon && React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, color: accent }
    },
      React.createElement(SFIcon, { name: icon, size: 16 }),
      React.createElement('div', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--clr-text)' } }, title)
    ),
    !icon && React.createElement('div', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--clr-text)' } }, title),
    sub && React.createElement('div', { style: { fontSize: 11.5, color: 'var(--clr-muted)', marginTop: icon ? 0 : 3, lineHeight: 1.4 } }, sub)
  );
}

function SFFoot({ left, right }) {
  return React.createElement('div', {
    style: {
      display: 'flex', justifyContent: 'space-between',
      marginTop: 34, paddingTop: 22, borderTop: '1px solid var(--clr-border)'
    }
  }, left, right || React.createElement('span', null));
}

function SFToggleRow({ label, on, onClick }) {
  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }
  },
    React.createElement('span', { style: { fontSize: 13, color: 'var(--clr-text)' } }, label),
    React.createElement(SFSwitch, { on, onClick })
  );
}

function SFAdvanced({ open, onToggle, children, accent }) {
  return React.createElement('div', {
    style: {
      marginTop: 14, border: '1px solid var(--clr-border)',
      borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--clr-card)'
    }
  },
    React.createElement('div', {
      onClick: onToggle,
      style: { display: 'flex', alignItems: 'center', gap: 9, padding: '12px 15px', cursor: 'pointer', userSelect: 'none' }
    },
      React.createElement('span', { style: { color: accent, display: 'flex' } },
        React.createElement(SFIcon, { name: 'SlidersHorizontal', size: 15 })
      ),
      React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: 'var(--clr-text)', flex: 1 } }, 'Advanced options'),
      React.createElement('span', { style: { fontSize: 11, color: 'var(--clr-muted)' } }, open ? 'Hide' : 'Optional · fine-tune'),
      React.createElement('span', {
        style: { color: 'var(--clr-muted)', display: 'flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease)' }
      }, React.createElement(SFIcon, { name: 'ChevronDown', size: 16 }))
    ),
    open && React.createElement('div', {
      style: { padding: '4px 15px 16px', display: 'grid', gap: 14, borderTop: '1px solid var(--clr-border)' }
    }, children)
  );
}

function SFHead({ title, sub }) {
  return React.createElement('div', { style: { textAlign: 'center', marginBottom: 22 } },
    React.createElement('h2', { className: 'sf-step', style: { font: 'var(--type-display-md)', color: 'var(--clr-text)', margin: 0 } }, title),
    React.createElement('p', {
      style: { fontSize: 14, color: 'var(--clr-muted)', marginTop: 8, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }
    }, sub)
  );
}

/* ── AI-rec banner shared by platform steps ───────────────────────── */
function SFRecBanner({ rec, accent }) {
  if (!rec || !rec.reason) return null;
  return React.createElement(SFCard, {
    inset: true,
    style: { display: 'flex', gap: 11, alignItems: 'flex-start', borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`, marginBottom: 16 },
    padding: 14, radius: 'var(--radius-md)'
  },
    React.createElement('span', { style: { color: accent, display: 'flex' } }, React.createElement(SFIcon, { name: 'Sparkles', size: 16 })),
    React.createElement('div', { style: { fontSize: 13, color: 'var(--clr-text)', lineHeight: 1.5 } },
      React.createElement('b', null, 'AI recommends ', rec.label), ' — ', rec.reason, ' Tap any option to override.'
    )
  );
}

/* ── Campaign slide-in layer ──────────────────────────────────────── */
function CampLayer({ variation, platform, studio, accent, onLaunch, onClose }) {
  const MOD_ICON  = { text: 'FileText', image: 'Image', video: 'Clapperboard', audio: 'AudioLines' };
  const CHANNELS  = ['Instagram', 'LinkedIn', 'TikTok', 'Email', 'YouTube'];
  const suggestions = SFD.CAMP_SET.slice(0, 3);

  const [name,     setName]     = React.useState('Sourdough Saturday Push');
  const [goalId,   setGoalId]   = React.useState(SFD.GOALS?.[0]?.id || 'preorders');
  const [mode,     setMode]     = React.useState('single');
  const [channels, setChannels] = React.useState({ Instagram: true, LinkedIn: true, TikTok: true, Email: true, YouTube: false });
  const [startDate, setStartDate] = React.useState('');
  const [endDate,   setEndDate]   = React.useState('');

  const goals = SFD.GOALS || [];
  const goal  = goals.find(g => g.id === goalId) || goals[0];

  const inputStyle = {
    width: '100%', background: 'var(--clr-card-2)', border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--clr-text)', font: 'var(--type-body)',
    padding: '10px 12px', boxSizing: 'border-box'
  };
  const sectionLabel = (txt) => React.createElement('div', {
    style: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }
  }, txt);

  return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
      background: 'var(--clr-bg)', animation: 'sf-step-in .28s ease both'
    }
  },
      /* header */
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid var(--clr-border)', flexShrink: 0 }
      },
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 18, fontWeight: 700, color: 'var(--clr-text)' } }, 'Add to campaign'),
          React.createElement('div', { style: { fontSize: 12.5, color: 'var(--clr-muted)', marginTop: 3 } }, 'Aria briefs the remaining pieces from your strategy automatically.')
        ),
        React.createElement('button', {
          onClick: onClose,
          style: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', display: 'flex', padding: 4 }
        }, React.createElement(SFIcon, { name: 'X', size: 20 }))
      ),

      /* ── scrollable content ── */
      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '20px 24px' } },

        /* ── Piece 1: Your creation ── */
        React.createElement('div', {
          style: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: 8 }
        }, 'Piece 1 · Your creation'),
        React.createElement('div', {
          style: {
            display: 'flex', gap: 12, alignItems: 'center',
            padding: '12px 14px', borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${accent}`,
            background: `color-mix(in srgb, ${accent} 8%, transparent)`,
            marginBottom: 20
          }
        },
          React.createElement('div', {
            style: { width: 42, height: 42, borderRadius: 10, flexShrink: 0,
              background: `color-mix(in srgb, ${accent} 22%, transparent)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }
          }, React.createElement(SFIcon, { name: MOD_ICON[studio.key] || 'FileText', size: 19 })),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--clr-text)' } }, variation.angle),
            React.createElement('div', { style: { fontSize: 11.5, color: 'var(--clr-muted)', marginTop: 2 } },
              studio.name, ' · ', platform.label, ' · ', variation.fit, '% persona fit')
          ),
          React.createElement('span', {
            style: { fontSize: 10, fontWeight: 700, color: accent, border: `1px solid ${accent}`, borderRadius: 4, padding: '2px 8px' }
          }, 'Ready')
        ),

        /* ── Aria Suggested pieces ── */
        React.createElement('div', {
          style: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--clr-muted)', marginBottom: 6 }
        }, 'Aria Suggested · ', suggestions.length, ' more pieces'),
        React.createElement('div', { style: { fontSize: 12, color: 'var(--clr-muted)', marginBottom: 10 } },
          'Briefed automatically from your strategy and persona — ready to generate once the campaign launches.'
        ),
        suggestions.map((s, i) =>
          React.createElement('div', { key: i,
            style: {
              display: 'flex', gap: 12, alignItems: 'center',
              padding: '12px 14px', borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--clr-border)',
              background: 'var(--clr-card)',
              marginBottom: 8
            }
          },
            React.createElement('div', {
              style: { width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                background: 'var(--clr-card-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-muted)' }
            }, React.createElement(SFIcon, { name: MOD_ICON[s.mod] || 'FileText', size: 18 })),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--clr-text)' } }, 'Piece ', i + 2, ' · ', s.platform),
              React.createElement('div', { style: { fontSize: 11.5, color: 'var(--clr-muted)', marginTop: 2 } },
                s.type, ' · ', s.hint || (s.count + ' variation' + (s.count > 1 ? 's' : '')))
            ),
            React.createElement('span', {
              style: { fontSize: 10, fontWeight: 600, color: 'var(--clr-muted)', border: '1px solid var(--clr-border)', borderRadius: 4, padding: '2px 8px' }
            }, 'Draft')
          )
        ),

        /* ── Divider ── */
        React.createElement('div', { style: { borderTop: '1px solid var(--clr-border)', margin: '20px 0' } }),

        /* ── Campaign name ── */
        React.createElement(SFLabel, null, 'Campaign name'),
        React.createElement('input', {
          value: name, onChange: e => setName(e.target.value),
          style: { ...inputStyle, marginBottom: 16 }
        }),

        /* ── Goal ── */
        goals.length > 0 && React.createElement(React.Fragment, null,
          React.createElement(SFLabel, null, 'Goal'),
          React.createElement('select', {
            value: goalId, onChange: e => setGoalId(e.target.value),
            style: { ...inputStyle, marginBottom: 16, appearance: 'none' }
          }, goals.map(g => React.createElement('option', { key: g.id, value: g.id }, g.label)))
        ),

        /* ── Dates ── */
        React.createElement('div', { style: { display: 'flex', gap: 12, marginBottom: 16 } },
          React.createElement('div', { style: { flex: 1 } },
            React.createElement(SFLabel, null, 'Start date'),
            React.createElement('input', { type: 'date', value: startDate, onChange: e => setStartDate(e.target.value), style: inputStyle })
          ),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement(SFLabel, null, 'End date'),
            React.createElement('input', { type: 'date', value: endDate, onChange: e => setEndDate(e.target.value), style: inputStyle })
          )
        ),

        /* ── Channels ── */
        React.createElement(SFLabel, { hint: 'Aria generates a piece for each selected channel' }, 'Where to post?'),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 } },
          CHANNELS.map(ch =>
            React.createElement('span', {
              key: ch,
              onClick: () => setChannels(p => ({ ...p, [ch]: !p[ch] })),
              style: {
                cursor: 'pointer', padding: '6px 13px', borderRadius: 20, fontSize: 12.5, fontWeight: 500,
                border: channels[ch] ? `1.5px solid ${accent}` : '1.5px solid var(--clr-border)',
                background: channels[ch] ? `color-mix(in srgb, ${accent} 12%, transparent)` : 'var(--clr-card)',
                color: channels[ch] ? accent : 'var(--clr-muted)',
                transition: 'all 140ms ease'
              }
            }, ch)
          )
        ),

        /* ── Series type ── */
        React.createElement(SFLabel, { hint: 'Not sure? Start with one idea — you can split into series later' }, 'What are you working on?'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 } },
          [
            { key: 'single', icon: 'Lightbulb', title: 'One idea, lots of posts', desc: 'Aria spreads a single message across your channels — one coordinated set.' },
            { key: 'multi',  icon: 'Layers',    title: 'Several ideas at once',  desc: 'Run multiple series in parallel — each its own idea, all under one goal.' }
          ].map(opt =>
            React.createElement('div', {
              key: opt.key,
              onClick: () => setMode(opt.key),
              style: {
                cursor: 'pointer', padding: '14px 14px', borderRadius: 'var(--radius-md)',
                border: mode === opt.key ? `1.5px solid ${accent}` : '1.5px solid var(--clr-border)',
                background: mode === opt.key ? `color-mix(in srgb, ${accent} 8%, transparent)` : 'var(--clr-card)',
                transition: 'all 140ms ease'
              }
            },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 } },
                React.createElement(SFIcon, { name: opt.icon, size: 14, color: mode === opt.key ? accent : 'var(--clr-muted)' }),
                React.createElement('span', { style: { fontSize: 12.5, fontWeight: 700, color: mode === opt.key ? accent : 'var(--clr-text)' } }, opt.title)
              ),
              React.createElement('div', { style: { fontSize: 11.5, color: 'var(--clr-muted)', lineHeight: 1.45 } }, opt.desc)
            )
          )
        )
      ),

      /* ── footer ── */
      React.createElement('div', {
        style: { padding: '16px 24px', borderTop: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: 'var(--clr-card)' }
      },
        React.createElement('span', { style: { fontSize: 12, color: 'var(--clr-muted)', display: 'flex', alignItems: 'center', gap: 5 } },
          React.createElement(SFIcon, { name: 'Zap', size: 12 }), '+150 pts toward Aria access'
        ),
        React.createElement('div', { style: { display: 'flex', gap: 10 } },
          React.createElement(SFButton, { variant: 'outline', onClick: onClose }, 'Cancel'),
          React.createElement(SFButton, { accent: accent, onClick: () => onLaunch(name) }, 'Launch campaign →')
        )
      )
  );
}

/* ═══════════════════════════════════════════════════════════════════
   UNIFIED STUDIO FLOW — 5 steps, all modalities
═══════════════════════════════════════════════════════════════════ */
function StudioFlow({ studio: studioProp, intelDone, onExit, onPublish }) {
  /* studioKey starts null — picked in step 0 modality picker */
  const [studioKey, setStudioKey] = React.useState(studioProp?.key || null);
  const studio = studioKey ? SFD.STUDIOS.find(s => s.key === studioKey) : null;
  const a    = studio ? studio.accent : 'var(--clr-primary)';
  const k    = studioKey;
  const flow = k ? SFD.STUDIO_FLOW[k] : null;
  const rec  = flow ? flow.platforms.find(p => p.rec) || flow.platforms[0] : null;

  /* ── Navigation ── */
  const [step, setStep] = React.useState(0);

  /* ── Generate ── */
  const [generating, setGenerating] = React.useState(false);
  const [variations,  setVariations] = React.useState(null);
  const [selected,    setSelected]   = React.useState(null);
  const [refine,      setRefine]     = React.useState('');
  const [regen,       setRegen]      = React.useState(0);
  const [intelOverride, setIntelOverride] = React.useState(false);
  const [campLayer,    setCampLayer]    = React.useState(false);

  /* ── Step 1: Platform ── */
  const [platform,  setPlatform]  = React.useState(rec?.type || null);
  /* Audio uses goals as platform */
  const [aGoal, setAGoal] = React.useState('podcast');
  const goalCfg = SFD.AUDIO_GOALS.find(g => g.id === aGoal) || SFD.AUDIO_GOALS[0];

  /* ── Step 1: Brief ── */
  const [tAngle,  setTAngle]  = React.useState(SFD.TEXT_BRIEF.angle.opts[0]);
  const [tMsg,    setTMsg]    = React.useState('');
  const [tTones,  setTTones]  = React.useState(['Warm']);
  const [iPrompt, setIPrompt] = React.useState('');
  const [iStyles, setIStyles] = React.useState(['Editorial craft']);
  const [aScript, setAScript] = React.useState('');
  const [aVibes,  setAVibes]  = React.useState(['Conversational', 'Warm']);
  const [vScript, setVScript] = React.useState('');
  const [vMode,   setVMode]   = React.useState('avatar');
  const [vAvatar, setVAvatar] = React.useState('mia');

  /* ── Step 2: Production ── */
  const [tCtaOn, setTCtaOn] = React.useState(true);
  const [tCta,   setTCta]   = React.useState(SFD.TEXT_BRIEF.ctas[0]);
  const [tTags,  setTTags]  = React.useState(true);
  const [iUse,   setIUse]   = React.useState(SFD.IMAGE_BRIEF.useCase.opts[0]);
  const [iRatio, setIRatio] = React.useState('1:1');
  const [iBrand, setIBrand] = React.useState(true);
  const [aVoice, setAVoice] = React.useState(goalCfg.voice);
  const [aMusic, setAMusic] = React.useState(goalCfg.music);
  const [aPace,  setAPace]  = React.useState(goalCfg.pace);
  const [aAcou,  setAAcou]  = React.useState(goalCfg.acoustics);
  const [aExpr,  setAExpr]  = React.useState(55);
  const [vVoice, setVVoice] = React.useState('aria');
  const [vStyle, setVStyle] = React.useState('Professional');
  const [vPacing,setVPacing]= React.useState(SFD.VIDEO_CONTROLS.pacing[0]);
  const [vHook,  setVHook]  = React.useState(SFD.VIDEO_CONTROLS.hook[0]);
  const [vMusic, setVMusic] = React.useState(SFD.VIDEO_CONTROLS.music[0]);
  const [vCaptions, setVCaptions] = React.useState(true);
  const [vAspect,   setVAspect]   = React.useState('9:16');

  /* ── Advanced ── */
  const [advOpen, setAdvOpen] = React.useState(false);
  const [txLen,   setTxLen]   = React.useState(SFD.ADV.text.length.opts[1]);
  const [txRead,  setTxRead]  = React.useState(SFD.ADV.text.reading.opts[1]);
  const [txPov,   setTxPov]   = React.useState(SFD.ADV.text.pov.opts[0]);
  const [txEmoji, setTxEmoji] = React.useState(false);
  const [txKw,    setTxKw]    = React.useState('');
  const [imLight, setImLight] = React.useState(SFD.ADV.image.lighting.opts[0]);
  const [imComp,  setImComp]  = React.useState(SFD.ADV.image.composition.opts[0]);
  const [imColor, setImColor] = React.useState(SFD.ADV.image.colorDir.opts[0]);
  const [imNeg,   setImNeg]   = React.useState('');
  const [auSpk,   setAuSpk]   = React.useState(SFD.ADV.audio.speakers.opts[0]);
  const [auIntro, setAuIntro] = React.useState(true);
  const [auChap,  setAuChap]  = React.useState(false);
  const [auPron,  setAuPron]  = React.useState('');
  const [viLen,   setViLen]   = React.useState(SFD.ADV.video.length.opts[2]);
  const [viBroll, setViBroll] = React.useState(SFD.ADV.video.broll.opts[1]);
  const [viLower, setViLower] = React.useState(true);
  const [viSting, setViSting] = React.useState(true);
  const [viSub,   setViSub]   = React.useState(SFD.ADV.video.subtitle.opts[0]);

  /* when modality is chosen: advance to step 1 + seed flow-dependent defaults */
  React.useEffect(() => {
    if (!flow) return;
    setStep(1);
    setPlatform(flow.platforms.find(p => p.rec)?.type || flow.platforms[0].type);
    if (flow.specs && flow.specs[0]) {
      setIRatio(flow.specs[0].opts[0]);
      setVAspect(flow.specs[0].opts[0]);
    }
  }, [studioKey]);

  const intelOk     = intelDone || intelOverride;
  const curPlatform = flow ? flow.platforms.find(p => p.type === platform) || rec : null;
  const Inherit     = window.InheritStrip ? React.createElement(window.InheritStrip) : null;

  /* Proactive Aria hints on step entry with pre-filled defaults */
  React.useEffect(() => {
    if (!window.ariaShowHint || !curPlatform) return;
    if (step === 1) {
      setTimeout(() => window.ariaShowHint(
        `I've pre-selected ${curPlatform.label} — it has the strongest reach for The Artisan Loyalist based on your strategy. Tap any card to change it.`,
        5500, 'excited'
      ), 400);
    }
  }, [step, studioKey]);


  /* ── Generate helpers ── */
  function startGenerate() {
    setGenerating(true); setVariations(null); setSelected(null);
    setTimeout(() => {
      setVariations(flow.angles.slice(0, 3).map((ang, i) => ({
        ...ang, label: ['A','B','C'][i],
        fit: Math.max(72, ang.fit - regen % 2 * 2),
        motif: SF_MOTIF[k]
      })));
      setGenerating(false);
    }, 1400);
  }
  function regenerate() { setRegen(r => r + 1); startGenerate(); }

  function next() {
    if (step === GEN_STEP - 1) {
      setStep(GEN_STEP);
      if (intelOk) startGenerate();
      return;
    }
    setStep(s => s + 1);
  }
  function back() {
    if (step === GEN_STEP) setGenerating(false);
    if (step <= 1) { setStudioKey(null); return; }
    setStep(s => s - 1);
  }
  function doPublish(mode, campName) {
    const v = variations[selected];
    onPublish({
      title:    v.angle + ' — Sourdough Saturday',
      angle:    v.angle,
      platform: curPlatform ? curPlatform.label : null,
      motif:    SF_MOTIF[k],
      status:   mode === 'publish' ? 'published' : mode === 'draft' ? 'draft' : 'review',
      toast:    mode === 'publish'  ? `Published to ${curPlatform ? curPlatform.label : 'library'} — added to My Library`
              : mode === 'draft'    ? 'Saved as draft — find it in My Library'
              : `Added to "${campName}" — Aria is briefing the remaining pieces`
    });
  }
  function canNext() {
    if (k === 'audio' && step === 3) return aScript.trim().length > 0;
    if (k === 'video' && step === 3) return vScript.trim().length > 0;
    return true;
  }
  function nextLabel() {
    if (step === GEN_STEP - 1) return 'Generate →';
    return 'Continue →';
  }

  /* ════ STEP BODIES ════ */

  /* ── STEP 0: Modality picker (no wizard chrome) ── */
  if (!studioKey) {
    return React.createElement('div', {
      style: { height: '100%', overflowY: 'auto' }
    },
      React.createElement(SFAnims, null),
      React.createElement('div', { style: { maxWidth: 680, margin: '0 auto', padding: '56px 28px 80px' } },
        React.createElement(SFHead, {
          title: 'What are you making?',
          sub: 'Pick a format and the studio tunes itself for your platform and persona.'
        }),
        React.createElement('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginTop: 10 }
        },
          SFD.STUDIOS.map(s => React.createElement(SFPickCard, {
            key: s.key, on: false, accent: s.accent,
            icon: s.icon, title: s.name, sub: s.tag,
            onClick: () => setStudioKey(s.key)
          }))
        )
      )
    );
  }

  let body = null;

  /* ── Intel gate (shows at step 1 — first real creation step) ── */
  if (!intelOk && step === 1) {
    body = React.createElement('div', { style: { maxWidth: 480, margin: '40px auto 0', textAlign: 'center' } },
      React.createElement('div', {
        style: {
          width: 64, height: 64, borderRadius: 16, background: 'var(--clr-warning-dim)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--clr-warning)', marginBottom: 20
        }
      }, React.createElement(SFIcon, { name: 'Lightbulb', size: 30 })),
      React.createElement('h2', { style: { font: 'var(--type-display-md)', color: 'var(--clr-text)', margin: 0 } }, 'Research recommended first'),
      React.createElement('p', { style: { fontSize: 14, color: 'var(--clr-muted)', marginTop: 12, lineHeight: 1.6 } },
        "You haven't completed ", React.createElement('b', { style: { color: 'var(--clr-text)' } }, 'Intelligence'),
        " yet. It loads your persona, market and brand voice into every step — so creating without it means weaker results. We recommend finishing Intelligence first, but it's your call."
      ),
      React.createElement('div', { style: { display: 'flex', gap: 10, justifyContent: 'center', marginTop: 26 } },
        React.createElement(SFButton, { variant: 'outline', onClick: () => setIntelOverride(true) }, 'Create anyway'),
        React.createElement(SFButton, { accent: a, onClick: onExit }, 'Complete Intelligence first →')
      )
    );
  }

  /* ── STEP 1: Platform (Where?) ── */
  else if (step === 1) {
    if (k === 'audio') {
      body = React.createElement(React.Fragment, null,
        React.createElement(SFHead, { title: 'What kind of audio?', sub: "Pick a goal and Maker pre-tunes voice, music and pacing. You stay the director." }),
        Inherit,
        React.createElement('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }
        }, SFD.AUDIO_GOALS.map(g =>
          React.createElement(SFPickCard, {
            key: g.id, on: aGoal === g.id, accent: a,
            icon: g.icon, title: g.label, sub: g.desc,
            onClick: () => { setAGoal(g.id); setAVoice(g.voice); setAMusic(g.music); setAPace(g.pace); setAAcou(g.acoustics); }
          })
        )),
        React.createElement(SFFoot, {
          left:  React.createElement(SFButton, { variant: 'outline', onClick: () => setStudioKey(null) }, '← Change format'),
          right: React.createElement(SFButton, { accent: a, onClick: next }, nextLabel())
        })
      );
    } else {
      body = React.createElement(React.Fragment, null,
        React.createElement(SFHead, {
          title: 'Where does this live?',
          sub: 'Pick the platform — format, specs and persona fit are tuned automatically.'
        }),
        Inherit,
        React.createElement(SFRecBanner, { rec, accent: a }),
        React.createElement('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }
        }, flow.platforms.map(p =>
          React.createElement(SFPickCard, {
            key: p.type, on: platform === p.type, accent: a,
            recBadge: p.rec, icon: p.icon, title: p.label,
            onClick: () => setPlatform(p.type)
          })
        )),
        k === 'video' && React.createElement('div', {
          style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }
        },
          React.createElement('div', null, React.createElement(SFLabel, { hint: true }, 'Aspect ratio'), React.createElement(SFSelect, { value: vAspect, onChange: setVAspect, opts: flow.specs[0].opts })),
          React.createElement('div', null, React.createElement(SFLabel, { hint: true }, 'Resolution'), React.createElement(SFSelect, { value: undefined, onChange: () => {}, opts: flow.specs[1].opts }))
        ),
        React.createElement(SFFoot, {
          left:  React.createElement(SFButton, { variant: 'outline', onClick: () => setStudioKey(null) }, '← Change format'),
          right: React.createElement(SFButton, { accent: a, onClick: next }, nextLabel())
        })
      );
    }
  }

  /* ── STEP 3: Brief ── */
  else if (step === 3) {
    if (k === 'text') {
      body = React.createElement(React.Fragment, null,
        React.createElement(SFHead, { title: 'Write the brief', sub: "Strategy is loaded — shape this one piece. Aria fills the rest." }),
        React.createElement(SFCard, { inset: true, padding: 18, radius: 'var(--radius-md)', style: { display: 'grid', gap: 16 } },
          React.createElement('div', null,
            React.createElement(SFLabel, { hint: true }, 'Topic angle'),
            React.createElement(SFSelect, { value: tAngle, onChange: setTAngle, opts: SFD.TEXT_BRIEF.angle.opts })
          ),
          React.createElement('div', null,
            React.createElement(SFLabel, null, 'What should it say?'),
            React.createElement(SFTextarea, { value: tMsg, onChange: setTMsg, placeholder: "Describe this post in plain English — the one idea it must land…" })
          ),
          React.createElement('div', null,
            React.createElement(SFLabel, null, 'Tone'),
            React.createElement(SFChips, { opts: SFD.TEXT_BRIEF.tones, sel: tTones, accent: a, onToggle: o => setTTones(s => s.indexOf(o) >= 0 ? s.filter(x => x !== o) : [...s, o]) })
          )
        ),
        React.createElement(SFFoot, {
          left:  React.createElement(SFButton, { variant: 'outline', onClick: back }, '← Back'),
          right: React.createElement(SFButton, { accent: a, onClick: next }, nextLabel())
        })
      );
    } else if (k === 'image') {
      body = React.createElement(React.Fragment, null,
        React.createElement(SFHead, { title: 'Describe the visual', sub: "Strategy and brand kit are loaded — tell us what to picture." }),
        React.createElement(SFCard, { inset: true, padding: 18, radius: 'var(--radius-md)', style: { display: 'grid', gap: 16 } },
          React.createElement('div', null,
            React.createElement(SFLabel, null, 'Describe the visual'),
            React.createElement(SFTextarea, { value: iPrompt, onChange: setIPrompt, placeholder: "A warm hero image for Sourdough Saturday — rustic bakery, golden crust, morning light…" })
          ),
          React.createElement('div', null,
            React.createElement(SFLabel, null, 'Style references'),
            React.createElement(SFChips, { opts: SFD.IMAGE_BRIEF.styles, sel: iStyles, accent: a, onToggle: o => setIStyles(s => s.indexOf(o) >= 0 ? s.filter(x => x !== o) : [...s, o]) })
          )
        ),
        React.createElement(SFFoot, {
          left:  React.createElement(SFButton, { variant: 'outline', onClick: back }, '← Back'),
          right: React.createElement(SFButton, { accent: a, onClick: next }, nextLabel())
        })
      );
    } else if (k === 'audio') {
      body = React.createElement(React.Fragment, null,
        React.createElement(SFHead, { title: 'Script', sub: "Paste it, let Aria draft it, or upload a file — then edit freely." }),
        React.createElement(SFCard, { inset: true, padding: 18, radius: 'var(--radius-md)', style: { display: 'grid', gap: 14 } },
          React.createElement('div', { style: { display: 'flex', gap: 10 } },
            React.createElement(SFButton, {
              variant: 'outline', size: 'sm',
              onClick: () => setAScript('HOST: Welcome back. Today we\'re up at 4am to find out what really happens before the doors open — flour, water, time, and a 72-hour cold ferment.')
            },
              React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
                React.createElement(SFIcon, { name: 'Sparkles', size: 13 }), 'Draft with AI'
              )
            )
          ),
          React.createElement(SFTextarea, { value: aScript, onChange: setAScript, placeholder: "Paste or write your script here…", rows: 7 }),
          React.createElement('div', null,
            React.createElement(SFLabel, null, 'Vibe tones'),
            React.createElement(SFChips, { opts: SFD.AUDIO_VIBES, sel: aVibes, accent: a, onToggle: o => setAVibes(s => s.indexOf(o) >= 0 ? s.filter(x => x !== o) : [...s, o]) })
          )
        ),
        React.createElement(SFFoot, {
          left:  React.createElement(SFButton, { variant: 'outline', onClick: back }, '← Back'),
          right: React.createElement(SFButton, { accent: a, disabled: !canNext(), onClick: next }, nextLabel())
        })
      );
    } else {
      /* video */
      body = React.createElement(React.Fragment, null,
        React.createElement(SFHead, { title: 'Script & presenter', sub: "Write what gets said, then choose how the video is fronted." }),
        /* Presenter mode toggle via cards */
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 } },
          React.createElement('div', {
            onClick: () => setVMode('avatar'),
            style: {
              cursor: 'pointer', padding: '11px 14px', borderRadius: 'var(--radius-md)',
              border: `1px solid ${vMode === 'avatar' ? a : 'var(--clr-border)'}`,
              background: vMode === 'avatar' ? `color-mix(in srgb, ${a} 12%, transparent)` : 'var(--clr-card)',
              display: 'flex', alignItems: 'center', gap: 9, transition: 'all var(--dur-fast) var(--ease)'
            }
          },
            React.createElement(SFIcon, { name: 'User', size: 16, color: a }),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--clr-text)' } }, 'AI Avatar'),
              React.createElement('div', { style: { fontSize: 11, color: 'var(--clr-muted)' } }, 'On-screen presenter')
            )
          ),
          React.createElement('div', {
            onClick: () => setVMode('broll'),
            style: {
              cursor: 'pointer', padding: '11px 14px', borderRadius: 'var(--radius-md)',
              border: `1px solid ${vMode === 'broll' ? a : 'var(--clr-border)'}`,
              background: vMode === 'broll' ? `color-mix(in srgb, ${a} 12%, transparent)` : 'var(--clr-card)',
              display: 'flex', alignItems: 'center', gap: 9, transition: 'all var(--dur-fast) var(--ease)'
            }
          },
            React.createElement(SFIcon, { name: 'Clapperboard', size: 16, color: a }),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--clr-text)' } }, 'B-roll / footage'),
              React.createElement('div', { style: { fontSize: 11, color: 'var(--clr-muted)' } }, 'No on-screen presenter')
            )
          )
        ),
        vMode === 'avatar' && React.createElement(SFCard, { inset: true, padding: 14, radius: 'var(--radius-md)', style: { marginBottom: 14 } },
          React.createElement(SFLabel, { hint: true }, 'Pick a presenter'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10 } },
            SFD.AVATARS.map(av => {
              const on = vAvatar === av.id;
              return React.createElement('div', {
                key: av.id, onClick: () => setVAvatar(av.id),
                style: {
                  cursor: 'pointer', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                  border: `1px solid ${on ? av.accent : 'var(--clr-border)'}`,
                  background: on ? `color-mix(in srgb, ${av.accent} 10%, transparent)` : 'var(--clr-card)',
                  transition: 'all var(--dur-fast) var(--ease)'
                }
              },
                React.createElement('div', {
                  style: {
                    aspectRatio: '1/1',
                    background: `color-mix(in srgb, ${av.accent} 18%, var(--clr-card-2))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: av.accent
                  }
                }, React.createElement(SFIcon, { name: 'User', size: 28, strokeWidth: 1.5 })),
                React.createElement('div', { style: { padding: '8px 10px' } },
                  React.createElement('div', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--clr-text)' } }, av.name),
                  React.createElement('div', { style: { fontSize: 10.5, color: 'var(--clr-muted)', marginTop: 1 } }, av.role)
                )
              );
            })
          )
        ),
        React.createElement(SFCard, { inset: true, padding: 14, radius: 'var(--radius-md)' },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 } },
            React.createElement(SFLabel, null, 'Script · what ', vMode === 'avatar' ? 'the avatar' : 'the voiceover', ' says'),
            React.createElement(SFButton, {
              variant: 'ghost', size: 'sm',
              onClick: () => setVScript('Stop paying full price for bread that was frozen weeks ago. Every Saturday we cold-ferment for 72 hours, stone-bake at dawn, and sell out by noon. Pre-order now — link below.')
            },
              React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
                React.createElement(SFIcon, { name: 'Sparkles', size: 13 }), 'Draft with AI'
              )
            )
          ),
          React.createElement(SFTextarea, { value: vScript, onChange: setVScript, placeholder: "Write the script…", rows: 5 })
        ),
        React.createElement(SFFoot, {
          left:  React.createElement(SFButton, { variant: 'outline', onClick: back }, '← Back'),
          right: React.createElement(SFButton, { accent: a, disabled: !canNext(), onClick: next }, nextLabel())
        })
      );
    }
  }

  /* ── STEP 2: Format (auto-suggested specs) ── */
  else if (step === 2) {
    if (k === 'text') {
      body = React.createElement(React.Fragment, null,
        React.createElement(SFHead, { title: 'Fine-tune the output', sub: "Set the CTA and hashtag preference — or leave them on auto." }),
        React.createElement(SFCard, { inset: true, padding: 18, radius: 'var(--radius-md)', style: { display: 'grid', gap: 16 } },
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 } },
            React.createElement('div', null,
              React.createElement(SFLabel, null, 'Call to action'),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                React.createElement(SFSwitch, { on: tCtaOn, onClick: () => setTCtaOn(v => !v) }),
                tCtaOn
                  ? React.createElement(SFSelect, { value: tCta, onChange: setTCta, opts: SFD.TEXT_BRIEF.ctas })
                  : React.createElement('span', { style: { fontSize: 12, color: 'var(--clr-muted)' } }, 'No CTA')
              )
            ),
            React.createElement('div', null,
              React.createElement(SFLabel, null, 'Hashtags'),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                React.createElement(SFSwitch, { on: tTags, onClick: () => setTTags(v => !v) }),
                React.createElement('span', { style: { fontSize: 12, color: 'var(--clr-muted)' } }, tTags ? 'Auto-suggest' : 'Off')
              )
            )
          )
        ),
        React.createElement(SFAdvanced, { open: advOpen, onToggle: () => setAdvOpen(v => !v), accent: a },
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
            React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.text.length.label), React.createElement(SFSelect, { value: txLen, onChange: setTxLen, opts: SFD.ADV.text.length.opts })),
            React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.text.reading.label), React.createElement(SFSelect, { value: txRead, onChange: setTxRead, opts: SFD.ADV.text.reading.opts }))
          ),
          React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.text.pov.label), React.createElement(SFSelect, { value: txPov, onChange: setTxPov, opts: SFD.ADV.text.pov.opts })),
          React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.text.keywords.label), React.createElement(SFTextarea, { value: txKw, onChange: setTxKw, placeholder: SFD.ADV.text.keywords.placeholder, rows: 2 })),
          React.createElement(SFToggleRow, { label: 'Use emoji', on: txEmoji, onClick: () => setTxEmoji(v => !v) })
        ),
        React.createElement(SFFoot, {
          left:  React.createElement(SFButton, { variant: 'outline', onClick: back }, '← Back'),
          right: React.createElement(SFButton, { accent: a, onClick: next }, nextLabel())
        })
      );
    } else if (k === 'image') {
      body = React.createElement(React.Fragment, null,
        React.createElement(SFHead, { title: 'Set the specs', sub: "Aspect ratio, brand kit lock, and any fine-tuning." }),
        React.createElement(SFCard, { inset: true, padding: 18, radius: 'var(--radius-md)', style: { display: 'grid', gap: 16 } },
          React.createElement('div', null, React.createElement(SFLabel, { hint: true }, 'Use case'), React.createElement(SFSelect, { value: iUse, onChange: setIUse, opts: SFD.IMAGE_BRIEF.useCase.opts })),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'end' } },
            React.createElement('div', null, React.createElement(SFLabel, { hint: true }, 'Aspect ratio'), React.createElement(SFSelect, { value: iRatio, onChange: setIRatio, opts: flow.specs[0].opts })),
            React.createElement('div', null,
              React.createElement(SFLabel, null, 'Brand kit lock'),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                React.createElement(SFSwitch, { on: iBrand, onClick: () => setIBrand(v => !v) }),
                React.createElement('span', { style: { fontSize: 12, color: 'var(--clr-muted)' } }, iBrand ? 'Colors, logo, type enforced' : 'Off')
              )
            )
          )
        ),
        React.createElement(SFAdvanced, { open: advOpen, onToggle: () => setAdvOpen(v => !v), accent: a },
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
            React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.image.lighting.label), React.createElement(SFSelect, { value: imLight, onChange: setImLight, opts: SFD.ADV.image.lighting.opts })),
            React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.image.composition.label), React.createElement(SFSelect, { value: imComp, onChange: setImComp, opts: SFD.ADV.image.composition.opts }))
          ),
          React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.image.colorDir.label), React.createElement(SFSelect, { value: imColor, onChange: setImColor, opts: SFD.ADV.image.colorDir.opts })),
          React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.image.negative.label), React.createElement(SFTextarea, { value: imNeg, onChange: setImNeg, placeholder: SFD.ADV.image.negative.placeholder, rows: 2 }))
        ),
        React.createElement(SFFoot, {
          left:  React.createElement(SFButton, { variant: 'outline', onClick: back }, '← Back'),
          right: React.createElement(SFButton, { accent: a, onClick: next }, nextLabel())
        })
      );
    } else if (k === 'audio') {
      body = React.createElement(React.Fragment, null,
        React.createElement(SFHead, { title: 'Production', sub: `Maker pre-tuned these for a ${goalCfg.label.toLowerCase()} — override anything.` }),
        React.createElement(SFCard, { inset: true, padding: 18, radius: 'var(--radius-md)', style: { display: 'grid', gap: 14 } },
          React.createElement(SFLabel, { hint: true }, 'Voice · tap to override'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 } },
            SFD.VOICES.map(v =>
              React.createElement(SFPickCard, { key: v.id, on: aVoice === v.id, accent: a, recBadge: v.id === goalCfg.voice, title: v.name, sub: v.desc, onClick: () => setAVoice(v.id) })
            )
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 } },
            React.createElement('div', null, React.createElement(SFLabel, { hint: true }, 'Music'), React.createElement(SFSelect, { value: aMusic, onChange: setAMusic, opts: SFD.AUDIO_PRODUCTION.music })),
            React.createElement('div', null, React.createElement(SFLabel, { hint: true }, 'Pacing'), React.createElement(SFSelect, { value: aPace, onChange: setAPace, opts: SFD.AUDIO_PRODUCTION.pace }))
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
            React.createElement('div', null, React.createElement(SFLabel, { hint: true }, 'Acoustics'), React.createElement(SFSelect, { value: aAcou, onChange: setAAcou, opts: SFD.AUDIO_PRODUCTION.acoustics })),
            React.createElement('div', null,
              React.createElement(SFLabel, null, 'Expressiveness · ', aExpr),
              React.createElement('input', { type: 'range', min: '0', max: '100', value: aExpr, onChange: e => setAExpr(+e.target.value), style: { width: '100%', accentColor: a } })
            )
          )
        ),
        React.createElement(SFAdvanced, { open: advOpen, onToggle: () => setAdvOpen(v => !v), accent: a },
          React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.audio.speakers.label), React.createElement(SFSelect, { value: auSpk, onChange: setAuSpk, opts: SFD.ADV.audio.speakers.opts })),
          React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.audio.pronounce.label), React.createElement(SFTextarea, { value: auPron, onChange: setAuPron, placeholder: SFD.ADV.audio.pronounce.placeholder, rows: 2 })),
          React.createElement(SFToggleRow, { label: 'Intro & outro', on: auIntro, onClick: () => setAuIntro(v => !v) }),
          React.createElement(SFToggleRow, { label: 'Chapter markers', on: auChap, onClick: () => setAuChap(v => !v) })
        ),
        React.createElement(SFFoot, {
          left:  React.createElement(SFButton, { variant: 'outline', onClick: back }, '← Back'),
          right: React.createElement(SFButton, { accent: a, onClick: next }, nextLabel())
        })
      );
    } else {
      /* video production */
      body = React.createElement(React.Fragment, null,
        React.createElement(SFHead, { title: 'Production', sub: "Style, voice and pacing — make it feel like your brand." }),
        React.createElement(SFCard, { inset: true, padding: 18, radius: 'var(--radius-md)', style: { display: 'grid', gap: 14 } },
          React.createElement(SFLabel, { hint: true }, 'Visual style'),
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
            SFD.VIDEO_CONTROLS.style.map(o => {
              const on = vStyle === o;
              return React.createElement('span', {
                key: o, onClick: () => setVStyle(o),
                style: {
                  cursor: 'pointer', fontSize: 12.5, padding: '6px 13px', borderRadius: 'var(--radius-pill)',
                  border: `1px solid ${on ? a : 'var(--clr-border)'}`,
                  background: on ? `color-mix(in srgb, ${a} 16%, transparent)` : 'var(--clr-card)',
                  color: on ? 'var(--clr-text)' : 'var(--clr-muted)',
                  transition: 'all var(--dur-fast) var(--ease)'
                }
              }, o);
            })
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 } },
            React.createElement('div', null, React.createElement(SFLabel, { hint: true }, 'Pacing'), React.createElement(SFSelect, { value: vPacing, onChange: setVPacing, opts: SFD.VIDEO_CONTROLS.pacing })),
            React.createElement('div', null, React.createElement(SFLabel, { hint: true }, 'Hook style'), React.createElement(SFSelect, { value: vHook, onChange: setVHook, opts: SFD.VIDEO_CONTROLS.hook })),
            React.createElement('div', null, React.createElement(SFLabel, { hint: true }, 'Music'), React.createElement(SFSelect, { value: vMusic, onChange: setVMusic, opts: SFD.VIDEO_CONTROLS.music }))
          ),
          React.createElement(SFLabel, { hint: true }, 'Voiceover'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 } },
            SFD.VOICES.map(v =>
              React.createElement(SFPickCard, { key: v.id, on: vVoice === v.id, accent: a, recBadge: v.id === 'aria', title: v.name, sub: v.desc, onClick: () => setVVoice(v.id) })
            )
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 } },
            React.createElement(SFSwitch, { on: vCaptions, onClick: () => setVCaptions(v => !v) }),
            React.createElement('span', { style: { fontSize: 12.5, color: 'var(--clr-muted)' } }, 'Burn-in captions ', vCaptions ? '· on' : '· off')
          )
        ),
        React.createElement(SFAdvanced, { open: advOpen, onToggle: () => setAdvOpen(v => !v), accent: a },
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
            React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.video.length.label), React.createElement(SFSelect, { value: viLen, onChange: setViLen, opts: SFD.ADV.video.length.opts })),
            React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.video.broll.label), React.createElement(SFSelect, { value: viBroll, onChange: setViBroll, opts: SFD.ADV.video.broll.opts }))
          ),
          React.createElement('div', null, React.createElement(SFLabel, null, SFD.ADV.video.subtitle.label), React.createElement(SFSelect, { value: viSub, onChange: setViSub, opts: SFD.ADV.video.subtitle.opts })),
          React.createElement(SFToggleRow, { label: 'On-screen text / lower-thirds', on: viLower, onClick: () => setViLower(v => !v) }),
          React.createElement(SFToggleRow, { label: 'Brand intro sting', on: viSting, onClick: () => setViSting(v => !v) })
        ),
        React.createElement(SFFoot, {
          left:  React.createElement(SFButton, { variant: 'outline', onClick: back }, '← Back'),
          right: React.createElement(SFButton, { accent: a, onClick: next }, nextLabel())
        })
      );
    }
  }

  /* ── STEP 3: Generate ── */
  else if (step === GEN_STEP) {
    if (!intelOk) {
      body = React.createElement('div', { style: { maxWidth: 460, margin: '40px auto 0', textAlign: 'center' } },
        React.createElement('div', {
          style: { width: 64, height: 64, borderRadius: 16, background: 'var(--clr-warning-dim)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-warning)', marginBottom: 20 }
        }, React.createElement(SFIcon, { name: 'Lightbulb', size: 30 })),
        React.createElement('h2', { style: { font: 'var(--type-display-md)', color: 'var(--clr-text)', margin: 0 } }, 'Research recommended first'),
        React.createElement('p', { style: { fontSize: 14, color: 'var(--clr-muted)', marginTop: 12, lineHeight: 1.6 } },
          "You haven't completed ", React.createElement('b', { style: { color: 'var(--clr-text)' } }, 'Intelligence'),
          " yet. Generating without it means weaker persona fit and messaging."
        ),
        React.createElement('div', { style: { display: 'flex', gap: 10, justifyContent: 'center', marginTop: 26 } },
          React.createElement(SFButton, { variant: 'outline', onClick: () => { setIntelOverride(true); startGenerate(); } }, 'Generate anyway'),
          React.createElement(SFButton, { accent: a, onClick: onExit }, 'Complete Intelligence first →')
        )
      );
    } else if (generating) {
      body = React.createElement(React.Fragment, null,
        React.createElement('div', { style: { textAlign: 'center', marginBottom: 20 } },
          React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15, color: 'var(--clr-text)' } },
            React.createElement('span', { style: { display: 'inline-flex', gap: 3 } },
              [0,1,2].map(i => React.createElement('span', { key: i, style: { width: 6, height: 6, borderRadius: '50%', background: a, animation: `sf-pulse-dot 1s ease-in-out ${i*0.16}s infinite` } }))
            ),
            'Maker is generating ', studio.name.toLowerCase(), ' variations…'
          ),
          React.createElement('div', { style: { fontSize: 13, color: 'var(--clr-muted)', marginTop: 6 } }, 'Scoring against The Artisan Loyalist')
        ),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 } },
          [0,1,2].map(i => React.createElement('div', {
            key: i, style: { border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--clr-card)' }
          },
            React.createElement('div', { className: 'sf-skeleton', style: { aspectRatio: '4/3' } }),
            React.createElement('div', { style: { padding: '12px 13px' } },
              React.createElement('div', { className: 'sf-skeleton', style: { height: 11, width: '70%', borderRadius: 4 } }),
              React.createElement('div', { className: 'sf-skeleton', style: { height: 9, width: '100%', borderRadius: 4, marginTop: 9 } }),
              React.createElement('div', { className: 'sf-skeleton', style: { height: 9, width: '85%', borderRadius: 4, marginTop: 6 } })
            )
          ))
        )
      );
    } else {
      body = React.createElement(React.Fragment, null,
        React.createElement(SFHead, { title: 'Variations', sub: 'Three options scored for persona fit. Pick one to preview.' }),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginTop: 6 } },
          (variations || []).map((v, i) => {
            const on = selected === i;
            return React.createElement(SFCard, {
              key: i, interactive: true, onClick: () => setSelected(i),
              padding: 0, radius: 'var(--radius-md)', className: 'sf-reveal',
              style: {
                overflow: 'hidden',
                borderColor: on ? a : 'var(--clr-border)',
                boxShadow: on ? `0 0 0 1px ${a}` : undefined,
                animation: `sf-card-in .4s cubic-bezier(.2,.7,.3,1) ${i * 0.09}s both`
              }
            },
              React.createElement('div', {
                style: {
                  aspectRatio: '4/3', background: `color-mix(in srgb, ${a} 14%, var(--clr-card-2))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: a, position: 'relative'
                }
              },
                React.createElement(SFIcon, { name: v.motif, size: 34, strokeWidth: 1.75 }),
                k === 'video' && React.createElement('span', {
                  style: { position: 'absolute', top: 8, left: 8, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--radius-pill)', background: 'var(--clr-card)', color: 'var(--clr-muted)', border: '1px solid var(--clr-border)' }
                }, vStyle, ' · ', vMode === 'avatar' ? (SFD.AVATARS.find(x => x.id === vAvatar) || {}).name || 'Avatar' : 'B-roll'),
                React.createElement('span', {
                  style: { position: 'absolute', bottom: 8, right: 8, fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--radius-pill)', background: v.fit >= 85 ? 'var(--clr-accent-dim)' : 'var(--clr-card)', color: v.fit >= 85 ? 'var(--clr-accent)' : 'var(--clr-muted)', border: '1px solid var(--clr-border)' }
                }, v.fit, '% fit')
              ),
              React.createElement('div', { style: { padding: '12px 13px' } },
                React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: 'var(--clr-text)' } }, 'Variation ', v.label, ' · ', v.angle),
                React.createElement('div', { style: { fontSize: 12, color: 'var(--clr-muted)', marginTop: 5, lineHeight: 1.45 } }, v.desc)
              )
            );
          })
        ),
        React.createElement('div', { style: { textAlign: 'center', marginTop: 14 } },
          React.createElement(SFButton, { variant: 'ghost', size: 'sm', onClick: regenerate },
            React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
              React.createElement(SFIcon, { name: 'RefreshCw', size: 13 }), 'Regenerate variations'
            )
          )
        ),
        /* Inline publish options — appear once a variation is selected */
        selected != null && React.createElement('div', {
          style: { marginTop: 24, borderTop: '1px solid var(--clr-border)', paddingTop: 20, animation: 'sf-step-in .3s ease both' }
        },
          React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 6 } }, "What's next?"),
          React.createElement('div', { style: { fontSize: 12.5, color: 'var(--clr-muted)', marginBottom: 16 } }, `Your ${studio.name.toLowerCase()} is ready. Refine it or choose a destination.`),
          React.createElement(SFCard, { inset: true, padding: 14, radius: 'var(--radius-md)', style: { marginBottom: 14 } },
            React.createElement(SFLabel, null, 'Refine this draft'),
            React.createElement(SFTextarea, { value: refine, onChange: setRefine, placeholder: "e.g. punchier hook, warmer close, add the Friday cut-off…", rows: 3 }),
            React.createElement(SFButton, {
              variant: 'outline', size: 'sm', onClick: regenerate,
              style: { width: '100%', marginTop: 10, justifyContent: 'center' }
            },
              React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
                React.createElement(SFIcon, { name: 'RefreshCw', size: 13 }), 'Regenerate with changes'
              )
            )
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 } },
            /* Publish now */
            React.createElement(SFCard, {
              interactive: true, onClick: () => doPublish('publish'),
              padding: 16, radius: 'var(--radius-md)', style: { textAlign: 'center' }
            },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'center', color: a } }, React.createElement(SFIcon, { name: 'Rocket', size: 22 })),
              React.createElement('div', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--clr-text)', marginTop: 7 } }, 'Publish now'),
              React.createElement('div', { style: { fontSize: 11.5, color: 'var(--clr-muted)', marginTop: 3 } }, `Push live to ${curPlatform ? curPlatform.label : 'your platform'}`)
            ),
            /* Add to campaign */
            React.createElement(SFCard, {
              interactive: true, onClick: () => setCampLayer(true),
              padding: 16, radius: 'var(--radius-md)', style: { textAlign: 'center' }
            },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'center', color: a } }, React.createElement(SFIcon, { name: 'FolderPlus', size: 22 })),
              React.createElement('div', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--clr-text)', marginTop: 7 } }, 'Add to campaign'),
              React.createElement('div', { style: { fontSize: 11.5, color: 'var(--clr-muted)', marginTop: 3 } }, 'AI scaffolds the rest')
            ),
            /* Save as draft */
            React.createElement(SFCard, {
              interactive: true, onClick: () => doPublish('draft'),
              padding: 16, radius: 'var(--radius-md)', style: { textAlign: 'center' }
            },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'center', color: a } }, React.createElement(SFIcon, { name: 'BookmarkCheck', size: 22 })),
              React.createElement('div', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--clr-text)', marginTop: 7 } }, 'Save as draft'),
              React.createElement('div', { style: { fontSize: 11.5, color: 'var(--clr-muted)', marginTop: 3 } }, 'Continue editing later')
            )
          )
        ),
        React.createElement(SFFoot, {
          left: React.createElement(SFButton, { variant: 'outline', onClick: back }, '← Back'),
          right: selected == null ? React.createElement('span', { style: { fontSize: 12.5, color: 'var(--clr-muted)' } }, 'Select a variation') : null
        })
      );
    }
  }

  /* ── Campaign screen (full page, not a modal) ── */
  if (campLayer && variations && selected != null) {
    return React.createElement(CampLayer, {
      variation: variations[selected],
      platform:  curPlatform,
      studio:    studio,
      accent:    a,
      onClose:   () => setCampLayer(false),
      onLaunch:  name => { setCampLayer(false); doPublish('campaign', name); }
    });
  }

  /* ── Wrapper ── */
  return React.createElement('div', {
    style: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }
  },
    React.createElement(SFAnims, null),
    /* Header bar */
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid var(--clr-border)', flexShrink: 0 }
    },
      React.createElement('div', { style: { fontSize: 13, color: 'var(--clr-muted)' } },
        React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--clr-text)', marginRight: 8 } }, 'Studio ', studio ? studio.name : ''),
        React.createElement('em', { style: { fontStyle: 'normal', color: a } }, 'New ', studio ? studio.name.toLowerCase() : '')
      ),
      React.createElement(SFButton, { variant: 'ghost', size: 'sm', onClick: () => { setStudioKey(null); setStep(1); setVariations(null); setSelected(null); setGenerating(false); } },
        React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5 } },
          React.createElement(SFIcon, { name: 'RotateCcw', size: 13 }), 'Start over'
        )
      )
    ),
    /* Scrollable body — flex row: fit bar | content */
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'flex-start' } },
      /* Left: compact vertical fit bar — sticky so it stays visible while scrolling */
      React.createElement('div', { style: { position: 'sticky', top: 0, flexShrink: 0, paddingTop: 28 } },
        React.createElement(PersonaFitBar, { step, studioKey, platform, rec, variations, selected })
      ),
      /* Right: wizard content */
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { maxWidth: 760, margin: '0 auto', padding: '28px 24px 56px' } },
          /* Wizard steps bar */
          !(!intelOk && step === 1) && React.createElement('div', { style: { marginBottom: 30 } },
            React.createElement(SFWizard, { steps: STEPS, current: step + 1 })
          ),
          /* Step content */
          React.createElement('div', {
            key: `${step}-${generating ? 'g' : variations ? 'v' : 'e'}-${intelOk ? 'ok' : 'gate'}`,
            className: 'sf-step',
            style: { animation: 'sf-step-in .34s cubic-bezier(.2,.7,.3,1) both' }
          }, body)
        )
      )
    )
  );
}

window.StudioFlow = StudioFlow;
})();
