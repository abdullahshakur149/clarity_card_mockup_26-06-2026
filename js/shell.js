/* shell.js — no sidebar. Linear onboarding bar (4 milestones) at the top.
   Journey: Intelligence → Audience → Tasks → Create (wizard).
   Exposes <ClarityApp/> on window. */
(function () {
'use strict';

const SDS = window.ClarityDesignSystem_29c088;
const { Button, Card, Pill, Dialog, Icon } = SDS;
const SData = window.ClarityData;

/* Strategy pillars shown in the bar (content/campaigns NOT listed) */
const STRATEGY_IDS = ['intelligence', 'audience', 'tasks'];
const STRATEGY     = SData.PILLARS.filter(p => STRATEGY_IDS.includes(p.id));

/* ── Keyframes ─────────────────────────────────────────────────────── */
function GameAnims() {
  return React.createElement('style', null, `
    @keyframes pop-in { 0%{transform:scale(.7)} 60%{transform:scale(1.04)} 100%{transform:scale(1)} }
    @keyframes confetti-fall {
      0%   { transform:translate(0,0) rotate(0deg); opacity:1; }
      100% { transform:translate(var(--dx),var(--dy)) rotate(var(--rot)); opacity:0; }
    }
    @keyframes bar-fill { from{width:0} to{width:var(--w)} }
    @keyframes fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
    @keyframes step-glow {
      0%,100% { box-shadow: 0 0 0 0 var(--step-glow,transparent); }
      50%      { box-shadow: 0 0 0 5px var(--step-glow,transparent); }
    }
    @keyframes rank-pop { 0%{transform:scale(.8);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
    @keyframes ru-fade  { from{opacity:0} to{opacity:1} }
    @keyframes ru-badge { 0%{transform:scale(.4) translateY(30px);opacity:0} 65%{transform:scale(1.12) translateY(-6px);opacity:1} 100%{transform:scale(1) translateY(0);opacity:1} }
    @keyframes ru-label { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
    @keyframes mc-slide { from{opacity:0;transform:translateY(32px) scale(.97)} to{opacity:1;transform:none} }
    @media (prefers-reduced-motion:reduce) { .confetti-piece,.anim-bar,.step-active { animation:none!important; } }
  `);
}

/* ── CountUp ────────────────────────────────────────────────────────── */
function CountUp({ value, run, dur = 900, prefix = '' }) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (!run) { setN(0); return; }
    let raf, start;
    const tick = t => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const safety = setTimeout(() => setN(value), dur + 120);
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); };
  }, [run, value, dur]);
  return React.createElement('span', null, prefix, n);
}

/* ── Confetti ───────────────────────────────────────────────────────── */
function Confetti({ fire, count = 36 }) {
  const pieces = React.useMemo(() => {
    const cols = ['var(--clr-reward)', 'var(--clr-ember)', 'var(--clr-primary-hover)', 'var(--clr-accent)'];
    return Array.from({ length: count }, (_, i) => {
      const ang = Math.PI * 2 * i / count + Math.random() * 0.5;
      const dist = 100 + Math.random() * 180;
      return { dx: Math.cos(ang)*dist+'px', dy: Math.sin(ang)*dist+180+'px', rot: Math.random()*720-360+'deg', col: cols[i%cols.length], delay: Math.random()*0.16, dur: 1.1+Math.random()*0.7, size: 6+Math.random()*7, round: Math.random()>0.5 };
    });
  }, [fire, count]);
  if (!fire) return null;
  return React.createElement('div', { style: { position:'absolute', top:-8, left:'50%', width:0, height:0, pointerEvents:'none', zIndex:5 } },
    pieces.map((p, i) => React.createElement('span', { key: i, className: 'confetti-piece', style: { position:'absolute', width:p.size, height:p.size, background:p.col, borderRadius:p.round?'50%':2, left:-p.size/2, top:0, '--dx':p.dx, '--dy':p.dy, '--rot':p.rot, animation:`confetti-fall ${p.dur}s cubic-bezier(.2,.6,.35,1) ${p.delay}s forwards` } }))
  );
}

/* ── Meter ──────────────────────────────────────────────────────────── */
function Meter({ pct, color = 'var(--clr-primary)', height = 5 }) {
  return React.createElement('div', { style: { height, borderRadius: height/2, background: 'var(--clr-border)', overflow:'hidden' } },
    React.createElement('div', { style: { height:'100%', width:`${Math.min(100,pct)}%`, background:color, borderRadius:height/2, transition:'width .5s var(--ease)' } })
  );
}

/* ── Rank system ────────────────────────────────────────────────────── */
const RANKS = [
  { min: 0,   label: 'Rookie',          icon: 'Shield',   color: 'var(--clr-muted)' },
  { min: 80,  label: 'Strategist',      icon: 'Target',   color: 'var(--clr-primary)' },
  { min: 180, label: 'Creator',         icon: 'Sparkles', color: 'var(--clr-accent)' },
  { min: 300, label: 'Master',          icon: 'Trophy',   color: 'var(--clr-reward)' },
];
function getRank(pts) {
  return RANKS.slice().reverse().find(r => pts >= r.min) || RANKS[0];
}
function getNextRank(pts) {
  return RANKS.find(r => r.min > pts) || null;
}

/* ── Top onboarding progress bar ────────────────────────────────────── */
function OnboardingBar({ completed, phase, earned }) {
  const goal = SData.CLARA_GOAL;
  const pct  = Math.round(earned / goal * 100);
  const done = earned >= goal;

  /* 4 milestones: 3 strategy pillars + "Create" */
  const milestones = [
    ...STRATEGY,
    { id:'create', label:'Create', icon:'Zap', accent:'var(--clr-pillar-content)', reward: SData.PILLARS.find(p=>p.id==='content')?.reward || 200 }
  ];

  return React.createElement('div', {
    style: {
      background: 'var(--clr-card)', borderBottom: '1px solid var(--clr-border)',
      padding: '0 28px', flexShrink: 0
    }
  },
    React.createElement('div', { style: { display:'flex', alignItems:'center', gap: 10, height: 52 } },
      /* Logo */
      React.createElement('span', { style: { fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:'var(--clr-primary)', marginRight: 8 } }, 'Clarity'),
      /* Rank badge */
      (() => {
        const rank = getRank(earned);
        const next = getNextRank(earned);
        return React.createElement('div', {
          style:{ display:'flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:'var(--radius-pill)', background:`color-mix(in srgb, ${rank.color} 12%, transparent)`, border:`1px solid color-mix(in srgb, ${rank.color} 35%, transparent)`, animation:'rank-pop .4s ease both' }
        },
          React.createElement(Icon, { name: rank.icon, size:12, color: rank.color }),
          React.createElement('span', { style:{ fontSize:11, fontWeight:700, color: rank.color, letterSpacing:'0.04em' } }, rank.label.toUpperCase()),
          next && React.createElement('span', { style:{ fontSize:10, color:'var(--clr-muted)', fontFamily:'var(--font-mono)' } }, `· ${next.min - earned} to ${next.label}`)
        );
      })(),
      /* spacer */
      React.createElement('div', { style:{ flex:1 } }),
      /* Aria unlock badge */
      React.createElement('div', {
        style:{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:'var(--radius-md)', background:'var(--clr-card-2)', border:`1px solid ${done ? 'var(--clr-accent)':'var(--clr-border)'}` }
      },
        React.createElement(Icon, { name: done?'Sparkles':'LockKeyhole', size:13, color: done?'var(--clr-accent)':'var(--clr-primary-hover)' }),
        React.createElement('span', { style:{ fontSize:11.5, fontWeight:600, color:'var(--clr-text)' } }, done ? 'Aria unlocked' : 'Unlock Aria'),
        React.createElement('span', { style:{ fontSize:10, color:'var(--clr-muted)', fontFamily:'var(--font-mono)' } }, earned, '/', goal)
      )
    ),
    /* thin progress line — hidden in create phase */
    phase !== 'create' && React.createElement(Meter, { pct, color: done?'var(--clr-accent)':'var(--clr-primary)', height:2 })
  );
}

/* ── Journey step bar (shown in main content) ───────────────────────── */
function StepBar({ completed, phase, onPhaseChange }) {
  const milestones = [
    ...STRATEGY,
    { id:'create', label:'Create', icon:'Zap', accent:'var(--clr-pillar-content)', reward: SData.PILLARS.find(p=>p.id==='content')?.reward || 200 }
  ];
  return React.createElement('div', {
    style: { padding: '18px 28px 0', background: 'var(--clr-bg)' }
  },
    React.createElement('div', {
      style: { display:'flex', alignItems:'center', gap: 0, maxWidth: 560 }
    },
      milestones.map((m, i) => {
        const isDone      = m.id === 'create' ? !!completed.tasks : !!completed[m.id];
        const isActive    = phase === m.id;
        const isReachable = isDone || isActive;
        const color       = isDone ? m.accent : isActive ? m.accent : 'var(--clr-muted)';
        return React.createElement(React.Fragment, { key: m.id },
          i > 0 && React.createElement('div', {
            style: { flex:1, height:1, background: isDone ? m.accent : 'var(--clr-border)', opacity: isDone ? 0.45 : 0.25, margin: '0 6px', maxWidth: 40 }
          }),
          React.createElement('div', {
            className: isActive ? 'step-active' : '',
            onClick: isReachable && !isActive ? () => onPhaseChange(m.id) : undefined,
            style: {
              display:'flex', alignItems:'center', gap: 6, padding:'5px 11px',
              borderRadius: 'var(--radius-pill)',
              background: isActive ? `color-mix(in srgb, ${m.accent} 14%, transparent)` : isDone ? `color-mix(in srgb, ${m.accent} 8%, transparent)` : 'transparent',
              border: `1px solid ${isActive ? m.accent : isDone ? `color-mix(in srgb, ${m.accent} 28%, transparent)` : 'var(--clr-border)'}`,
              cursor: isReachable && !isActive ? 'pointer' : 'default',
              transition: 'all var(--dur-fast) var(--ease)',
              ...(isActive ? { '--step-glow': `color-mix(in srgb, ${m.accent} 30%, transparent)`, animation: 'step-glow 2s ease-in-out infinite' } : {})
            }
          },
            isDone
              ? React.createElement('span', { style:{display:'flex',color:m.accent} }, React.createElement(Icon, { name:'CheckCircle2', size:13 }))
              : React.createElement('span', { style:{display:'flex',color} }, React.createElement(Icon, { name:m.icon, size:13 })),
            React.createElement('span', { style:{ fontSize:12, fontWeight: isActive||isDone ? 600 : 400, color: isActive||isDone ? 'var(--clr-text)' : 'var(--clr-muted)' } }, m.label),
            !isDone && !isActive && React.createElement('span', { style:{ fontSize:9.5, color:'var(--clr-muted)', fontFamily:'var(--font-mono)' } }, '+', m.reward)
          )
        );
      })
    )
  );
}

/* ── Pillar onboarding screen ────────────────────────────────────────── */
function PillarOnboarding({ pillar, completed, onComplete }) {
  const isDone = completed[pillar.id];
  return React.createElement('div', {
    style:{ maxWidth:540, margin:'0 auto', padding:'100px 28px', textAlign:'center', animation:'fade-up .4s ease both' }
  },
    React.createElement('div', {
      style:{ width:72, height:72, borderRadius:18, background:`color-mix(in srgb, ${pillar.accent} 16%, transparent)`, display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:22, color:pillar.accent }
    }, React.createElement(Icon, { name:pillar.icon, size:32, strokeWidth:1.75 })),
    React.createElement('h1', { style:{ font:'var(--type-display-lg)', color:'var(--clr-text)', margin:0 } }, pillar.label),
    React.createElement('p', { style:{ fontSize:14, color:'var(--clr-muted)', marginTop:12, lineHeight:1.6 } },
      pillar.blurb, '. Work through this step, then mark it complete to earn ',
      React.createElement('b', { style:{ color:'var(--clr-text)' } }, pillar.reward, ' pts'),
      ' and unlock the next step.'
    ),
    React.createElement('div', { style:{ marginTop:30 } },
      isDone
        ? React.createElement(Pill, { tone:'green', dot:true }, 'Completed · ', pillar.reward, ' pts earned')
        : React.createElement(Button, { onClick:()=>onComplete(pillar.id), accent:pillar.accent, style:{ padding:'12px 24px', fontSize:14 } }, 'Mark ', pillar.label, ' complete →')
    )
  );
}

/* ── Rank-up cinematic overlay ───────────────────────────────────────── */
function RankUpOverlay({ rank, onDone }) {
  const [fire, setFire] = React.useState(false);
  React.useEffect(() => {
    const f = setTimeout(() => setFire(true), 80);
    const d = setTimeout(onDone, 2900);
    return () => { clearTimeout(f); clearTimeout(d); };
  }, []);
  return React.createElement('div', {
    onClick: onDone,
    style: { position:'fixed', inset:0, zIndex:9600, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.88)', animation:'ru-fade .25s ease both', cursor:'pointer' }
  },
    React.createElement('div', { style: { textAlign:'center', position:'relative', userSelect:'none' } },
      React.createElement(Confetti, { fire, count: 56 }),
      React.createElement('div', { style: { fontSize:10, fontWeight:800, letterSpacing:'0.22em', color:'var(--clr-primary)', textTransform:'uppercase', marginBottom:22, animation:'ru-label .5s ease .55s both' } }, '— Rank Up —'),
      React.createElement('div', {
        style: { width:100, height:100, borderRadius:28, background:`color-mix(in srgb, ${rank.color} 18%, transparent)`, border:`2px solid color-mix(in srgb, ${rank.color} 45%, transparent)`, display:'inline-flex', alignItems:'center', justifyContent:'center', color:rank.color, marginBottom:22, animation:'ru-badge .6s cubic-bezier(.34,1.56,.64,1) .1s both' }
      }, React.createElement(Icon, { name:rank.icon, size:48, strokeWidth:1.5 })),
      React.createElement('div', { style: { fontSize:38, fontWeight:900, color:'#ffffff', letterSpacing:'-0.02em', lineHeight:1, animation:'ru-label .45s ease .7s both' } }, rank.label.toUpperCase()),
      React.createElement('div', { style: { fontSize:13, color:'rgba(255,255,255,0.45)', marginTop:12, animation:'ru-label .45s ease .85s both' } }, 'A new tier unlocked · tap to continue')
    )
  );
}

/* ── Mission complete screen ─────────────────────────────────────────── */
function MissionComplete({ result, earned, onCreateAnother, onDone }) {
  const [fire, setFire] = React.useState(false);
  const [run,  setRun]  = React.useState(false);
  React.useEffect(() => {
    const f = setTimeout(() => setFire(true), 150);
    const r = setTimeout(() => setRun(true),  300);
    return () => { clearTimeout(f); clearTimeout(r); };
  }, []);
  const rank    = getRank(earned);
  const next    = getNextRank(earned);
  const pct     = Math.round(earned / SData.CLARA_GOAL * 100);
  const bonusXp = 50;
  const statusIcon = result.status === 'published' ? 'CheckCircle2' : result.status === 'draft' ? 'BookmarkCheck' : 'Layers';
  const statusColor = result.status === 'published' ? 'var(--clr-accent)' : result.status === 'draft' ? 'var(--clr-primary)' : 'var(--clr-reward)';

  return React.createElement('div', {
    style: { position:'fixed', inset:0, zIndex:9500, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.82)' }
  },
    React.createElement('div', {
      style: { background:'var(--clr-card)', border:'1px solid var(--clr-border)', borderRadius:24, padding:'32px 30px 28px', width:380, maxWidth:'calc(100vw - 40px)', position:'relative', animation:'mc-slide .45s cubic-bezier(.2,.8,.3,1) both' }
    },
      React.createElement(Confetti, { fire, count: 42 }),
      /* eyebrow */
      React.createElement('div', { style:{ display:'flex', alignItems:'center', gap:8, marginBottom:20 } },
        React.createElement('div', { style:{ width:28, height:28, borderRadius:8, background:`color-mix(in srgb, ${statusColor} 16%, transparent)`, display:'flex', alignItems:'center', justifyContent:'center', color:statusColor } },
          React.createElement(Icon, { name:statusIcon, size:15 })
        ),
        React.createElement('span', { style:{ fontSize:10, fontWeight:800, letterSpacing:'0.18em', textTransform:'uppercase', color:statusColor } },
          result.status === 'published' ? 'Mission Complete' : result.status === 'draft' ? 'Saved to Library' : 'Campaign Created'
        )
      ),
      /* title */
      React.createElement('div', { style:{ fontSize:22, fontWeight:800, color:'var(--clr-text)', lineHeight:1.2, marginBottom:6 } }, result.angle || result.title),
      React.createElement('div', { style:{ fontSize:13, color:'var(--clr-muted)', marginBottom:24 } },
        result.platform ? `Published to ${result.platform}` : 'Saved to your library'
      ),
      /* XP strip */
      React.createElement('div', { style:{ background:'var(--clr-card-2)', border:'1px solid var(--clr-border)', borderRadius:14, padding:'16px 18px', marginBottom:16 } },
        React.createElement('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 } },
          React.createElement('div', { style:{ display:'flex', alignItems:'center', gap:8 } },
            React.createElement('div', { style:{ width:28, height:28, borderRadius:8, background:`color-mix(in srgb, ${rank.color} 14%, transparent)`, display:'flex', alignItems:'center', justifyContent:'center', color:rank.color } },
              React.createElement(Icon, { name:rank.icon, size:14 })
            ),
            React.createElement('span', { style:{ fontSize:12, fontWeight:700, color:rank.color } }, rank.label.toUpperCase())
          ),
          React.createElement('div', { style:{ display:'flex', alignItems:'baseline', gap:4 } },
            React.createElement('span', { style:{ fontSize:18, fontWeight:800, color:'var(--clr-reward)', fontFamily:'var(--font-mono)' } },
              '+', React.createElement(CountUp, { value:bonusXp, run, dur:700 })
            ),
            React.createElement('span', { style:{ fontSize:11, color:'var(--clr-muted)' } }, ' pts')
          )
        ),
        /* progress to Aria */
        React.createElement('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:7 } },
          React.createElement('span', { style:{ fontSize:11, color:'var(--clr-muted)' } },
            pct >= 100 ? 'Aria unlocked ✦' : `${SData.CLARA_GOAL - earned} pts to unlock Aria`
          ),
          React.createElement('span', { style:{ fontSize:11, fontFamily:'var(--font-mono)', color:'var(--clr-muted)' } }, earned, ' / ', SData.CLARA_GOAL)
        ),
        React.createElement(Meter, { pct: run ? Math.min(100, pct) : 0, color: pct>=100?'var(--clr-accent)':'var(--clr-primary)' }),
        next && React.createElement('div', { style:{ fontSize:10.5, color:'var(--clr-muted)', marginTop:8 } },
          `${next.min - earned} pts to ${next.label}`
        )
      ),
      /* Aria quote */
      React.createElement('div', { style:{ fontSize:12.5, color:'var(--clr-muted)', lineHeight:1.6, padding:'12px 14px', background:'var(--clr-card-2)', borderRadius:10, borderLeft:'3px solid var(--clr-primary)', marginBottom:22 } },
        React.createElement('span', { style:{ fontWeight:700, color:'var(--clr-primary)', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', display:'block', marginBottom:4 } }, 'Aria'),
        'Another piece of content for The Artisan Loyalist. Your library is building momentum.'
      ),
      /* CTAs */
      React.createElement('div', { style:{ display:'flex', flexDirection:'column', gap:8 } },
        React.createElement('button', {
          onClick: onCreateAnother,
          style:{ width:'100%', padding:'13px 0', border:'none', borderRadius:10, background:'var(--clr-primary)', color:'#0b0f0e', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-body)' }
        }, 'Create another →'),
        React.createElement('button', {
          onClick: onDone,
          style:{ width:'100%', padding:'10px 0', border:'none', borderRadius:10, background:'transparent', color:'var(--clr-muted)', fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)' }
        }, 'Done')
      )
    )
  );
}

/* ── Main app ────────────────────────────────────────────────────────── */
function ClarityApp() {
  const [completed,     setCompleted]     = React.useState({});
  const [phase,         setPhase]         = React.useState('intelligence'); // intelligence|audience|tasks|create
  const [congrats,      setCongrats]      = React.useState(null);
  const [congratsRun,   setCongratsRun]   = React.useState(false);
  const [directorSeen,  setDirectorSeen]  = React.useState(() => window.ariaDirectorSeen ? window.ariaDirectorSeen() : false);
  const [published,     setPublished]     = React.useState([]);
  const [toast,         setToast]         = React.useState(null);
  const [campFlow,      setCampFlow]      = React.useState(false);
  const [rankUp,        setRankUp]        = React.useState(null);   // rank object when threshold crossed
  const [missionResult, setMissionResult] = React.useState(null);   // publish result for mission-complete screen
  const prevEarnedRef = React.useRef(0);

  const earned = STRATEGY.filter(p => completed[p.id]).reduce((a, p) => a + p.reward, 0);

  /* Detect rank-up when XP changes */
  React.useEffect(() => {
    const prev = prevEarnedRef.current;
    if (earned > prev) {
      const oldRank = getRank(prev);
      const newRank = getRank(earned);
      if (newRank.min !== oldRank.min) setRankUp(newRank);
    }
    prevEarnedRef.current = earned;
  }, [earned]);
  const intelDone = !!completed.intelligence;

  function completePillar(id) {
    if (completed[id]) return;
    const next = { intelligence: 'audience', audience: 'tasks', tasks: 'create' };
    const pillar    = STRATEGY.find(p => p.id === id);
    const newEarned = earned + pillar.reward;
    const nextId    = next[id];
    const nextPl    = SData.PILLARS.find(p => p.id === nextId) || null;

    setCompleted(c => ({ ...c, [id]: true }));
    setCongrats({ pillar, earned: newEarned, next: nextPl, nextPhase: nextId });
    setCongratsRun(false);
    setTimeout(() => setCongratsRun(true), 40);
  }

  function closeCongrats(goNext) {
    const c = congrats;
    setCongrats(null); setCongratsRun(false);
    if (goNext && c) setPhase(c.nextPhase || 'create');
  }

  function handlePublish(result) {
    setPublished(p => [result, ...p]);
    setMissionResult(result);
  }

  const claraPct = Math.round(((congrats ? congrats.earned : earned) / SData.CLARA_GOAL) * 100);

  /* ── main content ── */
  let main;

  if (phase === 'create') {
    if (!directorSeen && window.DirectorsCall) {
      main = React.createElement(window.DirectorsCall, {
        earned, goal: SData.CLARA_GOAL,
        strategyCards: SData.ENGINE_STRATEGY.cards,
        onStart: () => setDirectorSeen(true)
      });
    } else {
      /* Wizard is the creation zone — always starts from modality choice */
      main = React.createElement(window.StudioFlow, {
        studio:    null,
        intelDone: intelDone,
        onExit:    () => {},
        onPublish: handlePublish
      });
    }
  } else {
    const pillar = STRATEGY.find(p => p.id === phase);
    main = React.createElement(PillarOnboarding, {
      pillar, completed, onComplete: completePillar
    });
  }

  return React.createElement('div', {
    style:{ display:'flex', flexDirection:'column', height:'100%', background:'var(--clr-bg)', color:'var(--clr-text)', overflow:'hidden' }
  },
    React.createElement(GameAnims, null),
    /* top bar */
    React.createElement(OnboardingBar, { completed, phase, earned }),
    /* main content */
    React.createElement('div', { style:{ flex:1, overflowY:'auto' } },
      React.createElement(StepBar, { completed, phase, onPhaseChange: setPhase }),
      main
    ),

    /* toast */
    toast && React.createElement('div', {
      style:{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', background:'var(--clr-text)', color:'var(--clr-bg)', padding:'11px 20px', borderRadius:'var(--radius-pill)', fontSize:13, fontWeight:500, zIndex:9999, animation:'fade-up .3s ease both', pointerEvents:'none', whiteSpace:'nowrap' }
    }, toast),

    /* Congratulations dialog */
    React.createElement(Dialog, {
      open: !!congrats, celebrate: true,
      onClose: () => closeCongrats(false),
      icon: React.createElement(Icon, { name:'PartyPopper', size:26, color:'var(--clr-reward)' }),
      title: 'Congratulations!',
      actions: congrats && (congrats.next || congrats.nextPhase === 'create')
        ? React.createElement(React.Fragment, null,
            React.createElement(Button, { variant:'ghost', onClick:()=>closeCongrats(false) }, 'Stay here'),
            React.createElement(Button, { onClick:()=>closeCongrats(true) },
              congrats.nextPhase === 'create' ? 'Start creating →' : `Continue to ${congrats.next.label} →`
            )
          )
        : React.createElement(Button, { onClick:()=>closeCongrats(false) }, 'Done')
    },
      congrats && React.createElement(React.Fragment, null,
        React.createElement(Confetti, { fire: congratsRun }),
        React.createElement('p', { style:{ margin:'0 0 18px', fontSize:14, color:'var(--clr-text)', lineHeight:1.55 } },
          'You completed ', React.createElement('b', null, congrats.pillar.label),
          ' and earned ',
          React.createElement('b', { style:{ color:'var(--clr-reward)' } },
            React.createElement(CountUp, { value: congrats.pillar.reward, run: congratsRun, prefix:'+' }), ' pts'
          ), '.',
          congrats.nextPhase === 'create'
            ? React.createElement(React.Fragment, null, ' Strategy locked — time to create.')
            : congrats.next ? React.createElement(React.Fragment, null, ' ', React.createElement('b', null, congrats.next.label), ' is now unlocked.') : null
        ),
        React.createElement('div', { style:{ background:'var(--clr-card-2)', border:'1px solid var(--clr-border)', borderRadius:'var(--radius-md)', padding:14 } },
          React.createElement('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:9 } },
            React.createElement('span', { style:{ fontSize:12, fontWeight:600, color:'var(--clr-text)', display:'flex', alignItems:'center', gap:6 } },
              claraPct >= 100 && React.createElement(Icon, { name:'Sparkles', size:13, color:'var(--clr-accent)' }),
              claraPct >= 100 ? 'Free access to Aria unlocked' : 'Progress to free Aria access'
            ),
            React.createElement('span', { style:{ fontSize:11, fontFamily:'var(--font-mono)', color:'var(--clr-muted)' } },
              React.createElement(CountUp, { value: congrats.earned, run: congratsRun }), ' / ', SData.CLARA_GOAL
            )
          ),
          React.createElement(Meter, { pct: congratsRun ? claraPct : (congrats.earned - congrats.pillar.reward)/SData.CLARA_GOAL*100, color: claraPct>=100?'var(--clr-accent)':'var(--clr-primary)' }),
          React.createElement('div', { style:{ fontSize:11.5, color:'var(--clr-muted)', marginTop:9 } },
            claraPct >= 100 ? 'Aria is now free to use across every step.' : `${SData.CLARA_GOAL - congrats.earned} more pts to unlock Aria for free.`
          )
        )
      )
    ),

    /* Campaign flow overlay */
    campFlow && React.createElement(window.CampaignFlow, {
      onExit: () => setCampFlow(false),
      onLaunch: () => { setCampFlow(false); }
    }),

    /* Rank-up cinematic */
    rankUp && React.createElement(RankUpOverlay, {
      rank: rankUp,
      onDone: () => setRankUp(null)
    }),

    /* Mission complete screen */
    missionResult && React.createElement(MissionComplete, {
      result:          missionResult,
      earned:          earned,
      onCreateAnother: () => setMissionResult(null),
      onDone:          () => setMissionResult(null)
    }),

    /* Aria floating widget — only during the creation phase */
    phase === 'create' && window.AriaWidget && React.createElement(window.AriaWidget, {
      studioKey: null,
      accent: 'var(--clr-primary)'
    })
  );
}

/* ── Auth gate ───────────────────────────────────────────────────────────
   Pre-flight Clearance (login) shows first. On clearance, the existing app
   mounts fresh. Kept as a separate component so ClarityApp's hook order is
   never affected by the auth boundary. */
/* ── Ideas-aware router ───────────────────────────────────────────────────
   An "idea" is the top-level concept. First visit: login → onboarding (creates
   idea #1) → Strategic Planning. Return visit: login → Your Ideas → an idea's
   Hub (4 pillars + Tools) → a pillar / Concept Comparison. Each idea persists
   its own recon + plan. */
function ClarityRoot() {
  const e = React.createElement;
  const STORE = 'clarity_state_v1';
  const bootRef = React.useRef(null);
  if (bootRef.current === null) {
    try { bootRef.current = JSON.parse(localStorage.getItem(STORE)) || {}; } catch (_) { bootRef.current = {}; }
  }
  const boot = bootRef.current;

  const [authed,    setAuthed]    = React.useState(!!boot.authed);
  const [ideas,     setIdeas]     = React.useState(Array.isArray(boot.ideas) ? boot.ideas : []);
  const [currentId, setCurrentId] = React.useState(null);
  const [view,      setView]      = React.useState('home');    // return visit → Your Ideas list (the start point)
  const [creating,  setCreating]  = React.useState(false);     // onboarding a new idea
  const idRef = React.useRef(boot.nextId || 1);

  /* persist the session so a return visit skips login/onboarding and lands on the hub */
  React.useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify({ authed, ideas, currentId, nextId: idRef.current })); } catch (_) {}
  }, [authed, ideas, currentId]);

  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function dayLabel() { try { const d = new Date(); return MON[d.getMonth()] + ' ' + d.getDate(); } catch (_) { return ''; } }

  function makeIdea(profile) {
    const id = 'idea_' + (idRef.current++);
    const idea = { id, name: (profile && profile.name) || 'Untitled idea', createdLabel: dayLabel(), profile: profile || {}, missions: {}, xp: 90, jobs: [] };
    setIdeas(list => list.concat([idea]));
    setCurrentId(id);
    return idea;
  }
  function updateIdea(id, patch) { setIdeas(list => list.map(i => i.id === id ? Object.assign({}, i, patch) : i)); }
  const idea = ideas.filter(i => i.id === currentId)[0] || null;

  if (!authed) {
    return window.ClarityLogin ? e(window.ClarityLogin, { onAuthed: () => setAuthed(true) }) : null;
  }
  /* first idea, or an explicit "+ New idea" → onboarding (Decode) → Strategic Planning */
  if ((ideas.length === 0 || creating) && window.ClarityOnboarding) {
    return e(window.ClarityOnboarding, {
      onComplete: (profile) => { makeIdea(profile || {}); setCreating(false); setView('strategic'); }
    });
  }
  if (view === 'strategic' && idea && window.ClarityIntel) {
    return e(window.ClarityIntel, {
      key: idea.id, profile: idea.profile, idea: idea,
      onChange: (patch) => updateIdea(idea.id, patch),
      onExit: () => setView('hub')
    });
  }
  if (view === 'tools' && window.ClarityCompare) {
    return e(window.ClarityCompare, { ideas: ideas, currentId: currentId, onBack: () => setView('hub') });
  }
  if (view === 'persona' && idea && window.ClarityPersona) {
    return e(window.ClarityPersona, { key: idea.id, idea: idea, onChange: (patch) => updateIdea(idea.id, patch), onBack: () => setView('hub') });
  }
  if (view === 'hub' && idea && window.ClarityHub) {
    return e(window.ClarityHub, {
      idea: idea,
      onPillar: (p) => { if (p === 'strategic') setView('strategic'); else if (p === 'persona') setView('persona'); },
      onCompare: () => setView('tools'),
      onBack: () => { setCurrentId(null); setView('home'); }
    });
  }
  /* default: Your Ideas home */
  if (window.ClarityIdeasHome) {
    return e(window.ClarityIdeasHome, {
      ideas: ideas,
      onOpen: (id) => { setCurrentId(id); setView('hub'); },
      onNew: () => setCreating(true)
    });
  }
  return e(ClarityApp);
}

window.ClarityApp = ClarityRoot;
})();
