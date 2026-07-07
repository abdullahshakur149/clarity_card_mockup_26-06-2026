/* wizard.js — unified Content-Engine wizard (replaces studioflow.js).
   Question flow ported to match the clarity-launchpad reference
   (studio-create/create-flow.js). All modalities share the same 5-step spine:
     1. What     — pick the content type (modality)
     2. Where    — publishing platform
     3. Format   — per-platform format (aspect / dims / limit) + preview
     4. Brief    — creative brief (Strategy + Message) + per-modality controls
     5. Generate — 3 AI variations scored for persona fit, then publish inline
   Exposes window.StudioFlow (drop-in replacement). */
(function () {
'use strict';

const SFDS = window.ClarityDesignSystem_29c088;
const { Button: SFButton, Card: SFCard, Icon: SFIcon, WizardSteps: SFWizard } = SFDS;
const SFD = window.ClarityData;

const SF_MOTIF = { text: 'FileText', image: 'Image', video: 'Clapperboard', audio: 'AudioLines' };
const STEPS = ['Compose', 'Generate'];
const GEN_STEP = 1;

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
  } else if (step >= 0 && platform && PLATFORM_FIT[platform] != null) {
    /* Use the specific per-platform score, nudged slightly per extra step */
    const base  = PLATFORM_FIT[platform];
    const bonus = Math.max(0, step - 1) * 3;
    fit = Math.min(base + 6, base + bonus);
  } else if (step >= 0 && platform) {
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
    }, 'Persona fit')
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

function SFPickRow({ icon, label, value, accent, open, onToggle, children }) {
  return React.createElement('div', {
    style: { border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', background: 'var(--clr-card)', marginBottom: 10 }
  },
    React.createElement('div', {
      onClick: onToggle,
      style: { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', cursor: 'pointer', userSelect: 'none' }
    },
      React.createElement(SFIcon, { name: icon, size: 15, color: accent }),
      React.createElement('span', { style: { fontSize: 11, color: 'var(--clr-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 } }, label),
      React.createElement('span', { style: { marginLeft: 'auto', fontSize: 13, color: 'var(--clr-text)', fontWeight: 600 } }, value),
      React.createElement('span', { style: { fontSize: 12, color: accent, marginLeft: 12, fontWeight: 600 } }, open ? 'Done' : 'Change')
    ),
    open && React.createElement('div', { style: { padding: '2px 14px 14px', borderTop: '1px solid var(--clr-border)' } }, children)
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

/* ── Format-step preview helpers (ported from create-flow.js cfFormatPreview) ── */
function sfAspectDims(asp, maxLong) {
  const p = String(asp || '1:1').split(':');
  const rw = parseFloat(p[0]) || 1, rh = parseFloat(p[1]) || 1;
  if (rw >= rh) return { w: maxLong, h: Math.round(maxLong * rh / rw) };
  return { h: maxLong, w: Math.round(maxLong * rw / rh) };
}
function SFFormatPreview(format, platformLabel, accent, recommended, modality) {
  if (!format) {
    return React.createElement('div', {
      style: { textAlign: 'center', color: 'var(--clr-muted)', fontSize: 12.5, padding: '24px 0' }
    }, 'Select a format above to see a preview');
  }
  const meta = [format.id, format.dims || format.dur || format.limit].filter(Boolean).join(' · ');
  const hasAspect = !!format.aspect;
  const dims = hasAspect ? sfAspectDims(format.aspect, modality === 'video' ? 150 : 190) : { w: 240, h: 130 };
  return React.createElement('div', {
    style: { marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 11 }
  },
    React.createElement('div', {
      style: {
        width: dims.w, height: dims.h, borderRadius: 'var(--radius-md)',
        border: '1px solid var(--clr-border)', background: `color-mix(in srgb, ${accent} 10%, var(--clr-card-2))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, position: 'relative'
      }
    },
      hasAspect && React.createElement('span', {
        style: { position: 'absolute', top: 6, right: 8, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--clr-muted)' }
      }, format.aspect),
      platformLabel && React.createElement('span', {
        style: { position: 'absolute', bottom: 6, left: 8, fontSize: 10, color: 'var(--clr-muted)' }
      }, platformLabel),
      React.createElement(SFIcon, { name: SF_MOTIF[modality] || 'Image', size: 26, strokeWidth: 1.6 })
    ),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--clr-text)' } },
      React.createElement('span', null, meta),
      recommended && React.createElement('span', {
        style: { fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--radius-pill)', background: `color-mix(in srgb, ${accent} 18%, transparent)`, color: accent }
      }, 'Recommended')
    )
  );
}

/* ── Brief-step text field (label · note · input/textarea · help) ── */
function SFBriefField({ field, value, onChange, multiline }) {
  const boxStyle = {
    width: '100%', boxSizing: 'border-box', background: 'var(--clr-card-2)',
    border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)',
    color: 'var(--clr-text)', font: 'var(--type-body)'
  };
  return React.createElement('div', null,
    React.createElement('div', {
      style: { font: 'var(--type-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--label-tracking)', color: 'var(--clr-muted)', marginBottom: 7, display: 'flex', gap: 6, alignItems: 'baseline' }
    },
      field.label,
      field.note && React.createElement('span', { style: { textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: 'var(--clr-muted)', fontSize: 11 } }, field.note)
    ),
    multiline
      ? React.createElement('textarea', { value, onChange: e => onChange(e.target.value), placeholder: field.placeholder, rows: 3, style: { ...boxStyle, padding: '10px 12px', resize: 'vertical', lineHeight: 1.5 } })
      : React.createElement('input', { value, onChange: e => onChange(e.target.value), placeholder: field.placeholder, style: { ...boxStyle, padding: '9px 11px' } }),
    field.help && React.createElement('div', { style: { fontSize: 11.5, color: 'var(--clr-muted)', marginTop: 6, lineHeight: 1.4 } }, field.help)
  );
}

/* ── Campaign slide-in layer ──────────────────────────────────────── */
function CampLayer({ variation, platform, studio, accent, onLaunch, onClose }) {
  const MOD_ICON  = { text: 'FileText', image: 'Image', video: 'Clapperboard', audio: 'AudioLines' };
  const CHANNELS  = SFD.CHANNELS;
  const suggestions = SFD.CAMP_SET.slice(0, 3);

  const [name,     setName]     = React.useState('Sourdough Saturday Push');
  const [goalId,   setGoalId]   = React.useState(SFD.GOALS?.[0]?.id || 'preorders');
  const [mode,     setMode]     = React.useState('single');
  const [channels, setChannels] = React.useState({ LinkedIn: true, Instagram: true, Facebook: true, Email: true, X: false, YouTube: false });
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
              title: SFD.CHANNEL_DESC[ch],
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
function StudioFlow({ studio: studioProp, intelDone, onExit, onPublish, onCampaign }) {
  /* studioKey starts null — picked in step 0 modality picker */
  const [studioKey, setStudioKey] = React.useState(studioProp?.key || null);
  const studio = studioKey ? SFD.STUDIOS.find(s => s.key === studioKey) : null;
  const a    = studio ? studio.accent : 'var(--clr-primary)';
  const k    = studioKey;
  const flow = k ? SFD.STUDIO_FLOW[k] : null;
  const rec  = flow ? flow.platforms.find(p => p.rec) || flow.platforms[0] : null;
  const lockedStudio = !!studioProp;

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

  /* ── Step 2: Format picker ── */
  const [fmtIdx, setFmtIdx] = React.useState(0);
  const [pickOpen, setPickOpen] = React.useState(null); // null | 'platform' | 'format' — inline picker reveal

  /* ── Step 3: Creative-brief controls (keyed by control.key) ── */
  const [specVals, setSpecVals] = React.useState({});
  function setSpecVal(key, val) { setSpecVals(v => ({ ...v, [key]: val })); }

  /* ── Step 3: Strategic brief (Strategy + Message cards) ── */
  const BD = SFD.BRIEF.defaults;
  const [bGoal,    setBGoal]    = React.useState(BD.goal);
  const [bWhyNow,  setBWhyNow]  = React.useState(BD.whyNow);
  const [bPersona, setBPersona] = React.useState(BD.persona);
  const [bMessage, setBMessage] = React.useState(BD.message);
  const [bProof,   setBProof]   = React.useState(BD.proof);
  const [bCta,     setBCta]     = React.useState(BD.cta);

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
    setStep(0);
    setPlatform(flow.platforms.find(p => p.rec)?.type || flow.platforms[0].type);
    if (flow.controls) {
      const sv = {};
      flow.controls.forEach(c => {
        if (c.type === 'select')        sv[c.key] = c.default || c.opts[0];
        else if (c.type === 'toggle')   sv[c.key] = c.default || 'On';
        else if (c.type === 'palette')  sv[c.key] = (SFD.BRIEF.palette || [])[0];
        else if (c.type === 'textarea') sv[c.key] = '';
      });
      setSpecVals(sv);
    }
  }, [studioKey]);

  /* when platform changes: re-select the recommended format for that platform */
  React.useEffect(() => {
    if (!flow || !platform) return;
    setFmtIdx((flow.suggested && flow.suggested[platform]) || 0);
  }, [platform]);

  const intelOk     = intelDone || intelOverride;
  const curPlatform = flow ? flow.platforms.find(p => p.type === platform) || rec : null;

  /* Current format object for the selected platform (used by Compose + controls) */
  const curFmt = (flow && flow.formats && flow.formats[platform] ? flow.formats[platform][fmtIdx] : null) || {};

  /* Creative-control renderer (hoisted from the old Brief step so Compose can use it) */
  const ctrlField = (label, node) => React.createElement('div', null,
    React.createElement(SFLabel, null, label), node
  );
  const roBox = (txt) => React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--clr-card-2)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', padding: '9px 11px', fontSize: 13, color: 'var(--clr-text)' }
  }, txt, React.createElement('span', { style: { fontSize: 10, color: 'var(--clr-muted)', border: '1px solid var(--clr-border)', borderRadius: 4, padding: '1px 6px' } }, 'from format'));
  function renderControl(c) {
    const palette = (SFD.BRIEF && SFD.BRIEF.palette) || [];
    const val = specVals[c.key];
    if (c.type === 'select')   return ctrlField(c.label, React.createElement(SFSelect, { value: val || c.default || c.opts[0], onChange: v => setSpecVal(c.key, v), opts: c.opts }));
    if (c.type === 'toggle')   { const on = (val || c.default || 'On') !== 'Off'; return ctrlField(c.label, React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } }, React.createElement(SFSwitch, { on, onClick: () => setSpecVal(c.key, on ? 'Off' : 'On') }), React.createElement('span', { style: { fontSize: 12, color: 'var(--clr-muted)' } }, on ? 'On' : 'Off'))); }
    if (c.type === 'textarea') return ctrlField(c.label, React.createElement(SFTextarea, { value: val || '', onChange: v => setSpecVal(c.key, v), placeholder: c.placeholder, rows: 3 }));
    if (c.type === 'palette')  return ctrlField(c.label, React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } }, palette.map(col => { const on = (val || palette[0]) === col; return React.createElement('div', { key: col, onClick: () => setSpecVal(c.key, col), title: col, style: { width: 26, height: 26, borderRadius: 7, cursor: 'pointer', background: col, boxShadow: on ? `0 0 0 2px var(--clr-bg), 0 0 0 4px ${a}` : 'inset 0 0 0 1px rgba(0,0,0,0.15)' } }); }), React.createElement('span', { style: { fontSize: 10, color: 'var(--clr-muted)' } }, 'brand kit')));
    if (c.type === 'format-id')     return ctrlField(c.label, roBox(curFmt.id || '—'));
    if (c.type === 'format-dur')    return ctrlField(c.label, roBox(curFmt.dur || '—'));
    if (c.type === 'format-aspect') return ctrlField(c.label, roBox((curFmt.aspect || '—') + (curFmt.dims ? ' · ' + curFmt.dims : '')));
    return null;
  }

  const Inherit     = window.InheritStrip ? React.createElement(window.InheritStrip) : null;

  /* Proactive Aria hints on step entry with pre-filled defaults */
  React.useEffect(() => {
    if (!window.ariaShowHint || !curPlatform) return;
    if (step === 1) {
      setTimeout(() => window.ariaShowHint(
        `I've pre-selected ${curPlatform.label} — it has the strongest reach for Maya Holloway based on your strategy. Tap any card to change it.`,
        5500, 'excited'
      ), 400);
    }
  }, [step, studioKey]);


  /* ── Generate helpers ── */
  function startGenerate() {
    setGenerating(true); setVariations(null); setSelected(null);
    setTimeout(() => {
      const vs = flow.angles.slice(0, 3).map((ang, i) => ({
        ...ang, label: ['A','B','C'][i],
        fit: Math.max(72, ang.fit - regen % 2 * 2),
        motif: SF_MOTIF[k]
      }));
      setVariations(vs);
      let best = 0; vs.forEach((v, i) => { if (v.fit > vs[best].fit) best = i; });
      setSelected(best);
      setGenerating(false);
    }, 1400);
  }
  function regenerate() { setRegen(r => r + 1); startGenerate(); }

  function leaveStudio() {
    if (lockedStudio) { onExit(); return; }
    setStudioKey(null);
    setStep(0);
    setVariations(null);
    setSelected(null);
    setGenerating(false);
  }

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
    if (step <= 0) { leaveStudio(); return; }
    setStep(s => s - 1);
  }
  function doPublish(mode, campName) {
    const v = variations[selected];
    const published = mode === 'publish';
    const stats = published
      ? { views: 1200 + Math.floor(Math.random() * 2800), likes: 64 + Math.floor(Math.random() * 180), shares: 8 + Math.floor(Math.random() * 42), clickRate: (2.2 + Math.random() * 3.2).toFixed(1) + '%' }
      : { views: Math.floor(Math.random() * 90), likes: 0, shares: 0, clickRate: '—' };
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date();
    onPublish({
      id:       'c_' + Date.now(),
      studioKey: k,
      title:    v.angle + ' — Sourdough Saturday',
      angle:    v.angle,
      platform: curPlatform ? curPlatform.label : null,
      motif:    SF_MOTIF[k],
      status:   published ? 'published' : mode === 'draft' ? 'draft' : 'review',
      fit:      v.fit,
      date:     months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(),
      toast:    published  ? `Published to ${curPlatform ? curPlatform.label : 'library'} — added to My Library`
              : mode === 'draft'    ? 'Saved as draft — find it in My Library'
              : `Added to "${campName}" — Aria is briefing the remaining pieces`,
      views: stats.views,
      likes: stats.likes,
      shares: stats.shares,
      clickRate: stats.clickRate
    });
  }
  function canNext() { return true; }
  function nextLabel() { return step === GEN_STEP - 1 ? 'Generate →' : 'Continue →'; }

  /* ════ STEP BODIES ════ */

  /* ── STEP 0: Modality picker (standalone wizard entry only) ── */
  if (!studioKey && !lockedStudio) {
    return React.createElement('div', {
      style: { height: '100%', overflowY: 'auto' }
    },
      React.createElement(SFAnims, null),
      React.createElement('div', { style: { maxWidth: 680, margin: '0 auto', padding: '56px 28px 80px' } },
        React.createElement(SFHead, {
          title: 'Select content type',
          sub: 'Choose the format for this piece of content.'
        }),
        React.createElement('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginTop: 10 }
        },
          SFD.STUDIOS.map(s => React.createElement(SFPickCard, {
            key: s.key, on: false, accent: s.accent,
            icon: s.icon,
            title: (SFD.STUDIO_FLOW[s.key] || {}).label || s.name,
            sub: (SFD.STUDIO_FLOW[s.key] || {}).desc || s.tag,
            onClick: () => setStudioKey(s.key)
          }))
        )
      )
    );
  }

  let body = null;

  /* ── Intel gate (shows at step 1 — first real creation step) ── */
  if (!intelOk && step === 0) {
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

  /* ── STEP 0: Compose — message-first, platform/format inline, rest in Advanced ── */
  else if (step === 0) {
    const F      = SFD.BRIEF.fields;
    const fmts   = (flow.formats && flow.formats[platform]) || [];
    const sugIdx = (flow.suggested && flow.suggested[platform]) || 0;
    body = React.createElement(React.Fragment, null,
      React.createElement(SFHead, { title: "What's this about?", sub: 'Tell the maker your message. Everything else is set up for you — change anything you like.' }),
      Inherit,
      /* The one input that matters */
      React.createElement(SFCard, { inset: true, padding: 18, radius: 'var(--radius-md)', style: { display: 'grid', gap: 16, marginBottom: 16 } },
        React.createElement(SFBriefField, {
          field: { label: 'What do you want to say?', note: '— one clear idea', placeholder: 'e.g. Sourdough Saturday is back — 72-hour ferment, limited batch.', help: 'This is the one input that shapes your result the most.' },
          value: bMessage, onChange: setBMessage, multiline: true
        }),
        React.createElement(SFBriefField, {
          field: { label: 'What should they do?', placeholder: 'e.g. Pre-order now — closes Friday.', help: 'The action you want people to take.' },
          value: bCta, onChange: setBCta
        })
      ),
      /* Inline platform pick */
      React.createElement(SFPickRow, {
        icon: 'Send', label: 'Posting to', value: curPlatform ? curPlatform.label : 'Platform', accent: a,
        open: pickOpen === 'platform', onToggle: () => setPickOpen(pickOpen === 'platform' ? null : 'platform')
      },
        React.createElement(SFRecBanner, { rec, accent: a }),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 } },
          flow.platforms.map(p => React.createElement(SFPickCard, {
            key: p.type, on: platform === p.type, accent: a, recBadge: p.rec, icon: p.icon, title: p.label, sub: p.desc,
            onClick: () => setPlatform(p.type)
          }))
        )
      ),
      /* Inline format pick */
      React.createElement(SFPickRow, {
        icon: 'Crop', label: 'Size', value: curFmt.id || 'Format', accent: a,
        open: pickOpen === 'format', onToggle: () => setPickOpen(pickOpen === 'format' ? null : 'format')
      },
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 9 } },
          fmts.map((fmt, i) => {
            const on = i === fmtIdx, sug = i === sugIdx;
            return React.createElement('span', {
              key: fmt.id, onClick: () => setFmtIdx(i),
              style: { cursor: 'pointer', fontSize: 13, padding: '7px 14px', borderRadius: 'var(--radius-pill)', display: 'inline-flex', alignItems: 'center', gap: 7, border: `1px solid ${on ? a : 'var(--clr-border)'}`, background: on ? `color-mix(in srgb, ${a} 14%, transparent)` : 'var(--clr-card-2)', color: on ? 'var(--clr-text)' : 'var(--clr-muted)' }
            }, fmt.id, sug && React.createElement('span', { style: { fontSize: 8.5, fontWeight: 700, padding: '2px 6px', borderRadius: 'var(--radius-pill)', background: a, color: 'var(--clr-bg)' } }, 'RECOMMENDED'));
          })
        )
      ),
      /* Advanced — persona, strategy context, proof, and creative controls */
      React.createElement(SFAdvanced, { open: advOpen, onToggle: () => setAdvOpen(!advOpen), accent: a },
        React.createElement('div', null,
          React.createElement(SFLabel, null, F.persona.label),
          React.createElement(SFSelect, { value: bPersona, onChange: setBPersona, opts: SFD.BRIEF.personas })
        ),
        React.createElement(SFBriefField, { field: F.goal, value: bGoal, onChange: setBGoal }),
        React.createElement(SFBriefField, { field: F.whyNow, value: bWhyNow, onChange: setBWhyNow }),
        React.createElement(SFBriefField, { field: F.proof, value: bProof, onChange: setBProof }),
        (flow.controls || []).map(c => React.createElement('div', { key: c.key }, renderControl(c)))
      ),
      React.createElement(SFFoot, {
        left:  React.createElement(SFButton, { variant: 'outline', onClick: leaveStudio }, lockedStudio ? '← Back' : '← Change type'),
        right: React.createElement(SFButton, { accent: a, onClick: next }, 'Generate →')
      })
    );
  }

  /* ── STEP 4: Write the creative brief (Strategy + Message + controls) ── */
  else if (step === 3) {
    const BF      = SFD.BRIEF;
    const F       = BF.fields;
    const palette = BF.palette || [];

    const pill = (txt) => React.createElement('span', {
      style: { fontSize: 11.5, padding: '4px 10px', borderRadius: 'var(--radius-pill)', background: 'var(--clr-card-2)', border: '1px solid var(--clr-border)', color: 'var(--clr-muted)' }
    }, txt);

    body = React.createElement(React.Fragment, null,
      React.createElement(SFHead, { title: 'Write the creative brief', sub: `${BF.brand} · lock the strategy your generator will execute` }),
      /* context pills */
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 } },
        pill(studio.name),
        pill(curPlatform ? curPlatform.label : 'Platform'),
        pill(curFmt.id || 'Format'),
        React.createElement('span', { style: { fontSize: 12, color: 'var(--clr-muted)' } }, 'Used for all generated variations.')
      ),
      /* Strategy card */
      React.createElement(SFCard, { inset: true, padding: 18, radius: 'var(--radius-md)', style: { display: 'grid', gap: 16, marginBottom: 16 } },
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 13.5, fontWeight: 700, color: 'var(--clr-text)' } }, 'Strategy'),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--clr-muted)', marginTop: 3 } }, 'Define the goal and timing context for this piece of content.')
        ),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 } },
          React.createElement(SFBriefField, { field: F.goal, value: bGoal, onChange: setBGoal }),
          React.createElement(SFBriefField, { field: F.whyNow, value: bWhyNow, onChange: setBWhyNow })
        )
      ),
      /* Message card */
      React.createElement(SFCard, { inset: true, padding: 18, radius: 'var(--radius-md)', style: { display: 'grid', gap: 16, marginBottom: 16 } },
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 13.5, fontWeight: 700, color: 'var(--clr-text)' } }, 'Message'),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--clr-muted)', marginTop: 3 } }, "Who you're talking to, what to say, and what makes it credible.")
        ),
        React.createElement('div', null,
          React.createElement(SFLabel, null, F.persona.label),
          React.createElement(SFSelect, { value: bPersona, onChange: setBPersona, opts: BF.personas }),
          React.createElement('div', { style: { fontSize: 11.5, color: 'var(--clr-muted)', marginTop: 6 } }, F.persona.help)
        ),
        React.createElement(SFBriefField, { field: F.message, value: bMessage, onChange: setBMessage, multiline: true }),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 } },
          React.createElement(SFBriefField, { field: F.proof, value: bProof, onChange: setBProof }),
          React.createElement(SFBriefField, { field: F.cta, value: bCta, onChange: setBCta })
        )
      ),
      /* Creative controls */
      React.createElement(SFCard, { inset: true, padding: 18, radius: 'var(--radius-md)', style: { display: 'grid', gap: 16 } },
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 13.5, fontWeight: 700, color: 'var(--clr-text)' } }, studio.name, ' controls'),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--clr-muted)', marginTop: 3 } }, `Shape how this ${k} is generated.`)
        ),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 } },
          (flow.controls || []).map(c => React.createElement('div', { key: c.key, style: c.type === 'textarea' ? { gridColumn: '1 / -1' } : null }, renderControl(c)))
        )
      ),
      React.createElement(SFFoot, {
        left:  React.createElement(SFButton, { variant: 'outline', onClick: back }, '← Back'),
        right: React.createElement(SFButton, { accent: a, onClick: next }, nextLabel())
      })
    );
  }

  /* ── STEP 3: Format picker (per-platform formats + recommended + preview) ── */
  else if (step === 2) {
    const fmts   = (flow.formats && flow.formats[platform]) || [];
    const sugIdx = (flow.suggested && flow.suggested[platform]) || 0;
    const why    = (flow.suggestWhy && flow.suggestWhy[platform]) || '';
    const curFmt = fmts[fmtIdx] || fmts[0] || null;
    body = React.createElement(React.Fragment, null,
      React.createElement(SFHead, { title: 'Format', sub: `Pre-set to ${curPlatform ? curPlatform.label : 'platform'} standards. Change if needed.` }),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center' } },
        fmts.map((fmt, i) => {
          const on = i === fmtIdx, sug = i === sugIdx;
          return React.createElement('span', {
            key: fmt.id, onClick: () => setFmtIdx(i),
            style: {
              cursor: 'pointer', fontSize: 13, padding: '7px 14px', borderRadius: 'var(--radius-pill)',
              display: 'inline-flex', alignItems: 'center', gap: 7,
              border: `1px solid ${on ? a : 'var(--clr-border)'}`,
              background: on ? `color-mix(in srgb, ${a} 14%, transparent)` : 'var(--clr-card-2)',
              color: on ? 'var(--clr-text)' : 'var(--clr-muted)',
              transition: 'all var(--dur-fast) var(--ease)'
            }
          },
            fmt.id,
            sug && React.createElement('span', {
              style: { fontSize: 8.5, fontWeight: 700, letterSpacing: '0.04em', padding: '2px 6px', borderRadius: 'var(--radius-pill)', background: a, color: 'var(--clr-bg)' }
            }, 'RECOMMENDED')
          );
        })
      ),
      why && React.createElement('div', { style: { textAlign: 'center', fontSize: 12.5, color: 'var(--clr-muted)', marginTop: 12 } }, why),
      SFFormatPreview(curFmt, curPlatform ? curPlatform.label : '', a, fmtIdx === sugIdx, k),
      React.createElement(SFFoot, {
        left:  React.createElement(SFButton, { variant: 'outline', onClick: back }, '← Back'),
        right: React.createElement(SFButton, { accent: a, onClick: next }, nextLabel())
      })
    );
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
          React.createElement('div', { style: { fontSize: 13, color: 'var(--clr-muted)', marginTop: 6 } }, 'Scoring against Maya Holloway')
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
                }, (specVals.visualStyle || 'Casual / UGC')),
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
      onLaunch:  name => {
        setCampLayer(false);
        doPublish('campaign', name);
        if (onCampaign) {
          const g0 = SFD.GOALS && SFD.GOALS[0] ? SFD.GOALS[0] : { id: 'preorders', label: 'Drive pre-orders / sales', kpi: 'Pre-orders', target: 500 };
          const cid = 'c_' + String(name || 'campaign').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          onCampaign({
            id: cid, name: name || 'New campaign', goalId: g0.id, goal: g0.label, status: 'running',
            window: 'Now – open', series: 1, pieces: 1 + SFD.CAMP_SET.slice(0, 3).length,
            kpiLabel: g0.kpi, kpiNow: 0, kpiGoal: g0.target,
            pace: 80, target: 75, daysLeft: 14, reach: '—', pfAvg: variations[selected].fit, published: 0,
            chips: ['Artisan Loyalist', curPlatform ? curPlatform.label : 'Instagram']
          });
        }
      }
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
      React.createElement(SFButton, { variant: 'ghost', size: 'sm', onClick: leaveStudio },
        React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5 } },
          React.createElement(SFIcon, { name: 'RotateCcw', size: 13 }), lockedStudio ? 'Exit wizard' : 'Start over'
        )
      )
    ),
    /* Scrollable body — flex row: fit bar | content */
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'flex-start' } },
      /* Left: compact vertical fit bar — sticky so it stays visible while scrolling */
      React.createElement('div', { style: { position: 'sticky', top: 0, flexShrink: 0, paddingTop: 28 } },
        React.createElement(PersonaFitBar, { step, studioKey, platform, rec, variations, selected })
      ),
      /* Right: wizard content — one step per screen */
      React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' } },
        React.createElement('div', { style: { flex: 1, maxWidth: 760, margin: '0 auto', padding: '28px 24px 56px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: step < GEN_STEP && !generating && selected == null ? 'center' : 'flex-start' } },
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
