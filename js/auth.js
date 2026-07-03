/* ============================================================================
   auth.js — the welcome screen. Journey tone: Clarity itself greets you in
   warm first person (no CAPCOM, no clearance fiction) over real auth fields.
   Exposes window.ClarityLogin.
   Plain globals, React.createElement (no build step) — matches the codebase.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) {
    var NS = window.ClarityDesignSystem_29c088 || {};
    return NS.Icon ? e(NS.Icon, props) : null;
  }

  /* What Clarity says (first person, unattributed) */
  var LINES = {
    hailSignin: "Good to see you. Sign in and we'll pick up right where you left off.",
    hailEnlist: "Welcome in. Tell me your name, set a password, and I'll take care of the rest.",
    needCreds:  "Just your email and password, and you're in.",
    needCall:   'One small thing — what should I call you?',
    running:    'One moment — opening things up for you…',
    welcome:    "You're in. Let's pick your journey back up."
  };

  /* Google "G" mark */
  function GoogleG() {
    return e('svg', { width: 17, height: 17, viewBox: '0 0 48 48', 'aria-hidden': true },
      e('path', { fill: '#FFC107', d: 'M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z' }),
      e('path', { fill: '#FF3D00', d: 'M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z' }),
      e('path', { fill: '#4CAF50', d: 'M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.6 16.2 44 24 44z' }),
      e('path', { fill: '#1976D2', d: 'M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.4 36.3 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z' })
    );
  }

  function ClarityLogin(props) {
    var onAuthed = props.onAuthed;

    var s = React.useState('signin'); var mode = s[0], setMode = s[1];   // signin | enlist
    var em = React.useState('');      var email = em[0], setEmail = em[1];
    var pw = React.useState('');      var pass = pw[0], setPass = pw[1];
    var cs = React.useState('');      var callsign = cs[0], setCallsign = cs[1];
    var sp = React.useState(false);   var showPass = sp[0], setShowPass = sp[1];
    var ph = React.useState('form');  var phase = ph[0], setPhase = ph[1]; // form | seq | granted
    var ac = React.useState(false);   var active = ac[0], setActive = ac[1];
    var fc = React.useState(null);    var focused = fc[0], setFocused = fc[1]; // 'call' | 'id' | 'key' | null

    /* ── Live field state (drives the gentle reactions) ── */
    var emailValid  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    var keyLen      = pass.length;
    var keyStrength = keyLen === 0 ? 0 : keyLen < 4 ? 1 : keyLen < 6 ? 2 : keyLen < 8 ? 3 : keyLen < 11 ? 4 : 5;
    var keyLabel    = ['—', 'Too short', 'Getting there', 'Not bad', 'Strong', 'Rock solid'][keyStrength];
    var keyColor    = keyStrength <= 1 ? 'var(--clr-danger)' : keyStrength <= 3 ? 'var(--clr-warning)' : 'var(--clr-accent)';
    var listening   = active || focused !== null;

    /* Typewriter for the spoken line */
    var tg = React.useState(LINES.hailSignin); var target = tg[0], setTarget = tg[1];
    var ty = React.useState('');               var typed = ty[0], setTyped = ty[1];
    var dn = React.useState(false);            var done = dn[0], setDone = dn[1];

    function say(text, isActive) {
      if (text === target) { setActive(!!isActive); return; }  /* don't re-type the same line */
      setTarget(text); setActive(!!isActive);
    }

    /* Clarity reacts to focus */
    function focusId()  { setFocused('id');   if (!emailValid)     say("Your email goes there — whenever you're ready.", true); }
    function focusKey() { setFocused('key');  if (keyStrength < 2) say('And a password — something only you would know.', true); }
    function focusCall(){ setFocused('call'); say('Your name first — whatever people actually call you.', true); }
    function blurField(){ setFocused(null);   setActive(false); }

    /* Clarity reacts when a field settles (once per transition) */
    var prevEmailValid = React.useRef(false);
    React.useEffect(function () {
      if (phase === 'form' && emailValid && !prevEmailValid.current) say('Got it — thanks.', true);
      prevEmailValid.current = emailValid;
    }, [emailValid, phase]);

    var prevKeyReady = React.useRef(false);
    var keyReady = keyStrength >= 2;
    React.useEffect(function () {
      if (phase === 'form' && keyReady && !prevKeyReady.current) say("That'll do nicely.", true);
      prevKeyReady.current = keyReady;
    }, [keyReady, phase]);

    React.useEffect(function () {
      setTyped(''); setDone(false);
      var i = 0;
      var iv = setInterval(function () {
        i++; setTyped(target.slice(0, i));
        if (i >= target.length) { clearInterval(iv); setDone(true); }
      }, 18);
      return function () { clearInterval(iv); };
    }, [target]);

    /* Mode switch re-greets */
    function switchMode(m) {
      setMode(m);
      say(m === 'signin' ? LINES.hailSignin : LINES.hailEnlist, false);
    }

    /* Sign-in sequence — a single filling progress line, no checklist */
    React.useEffect(function () {
      if (phase !== 'seq') return;
      var t = setTimeout(function () { setPhase('granted'); say(LINES.welcome, true); }, 1950);
      return function () { clearTimeout(t); };
    }, [phase]);

    React.useEffect(function () {
      if (phase !== 'granted') return;
      var t = setTimeout(function () { if (onAuthed) onAuthed(); }, 1750);
      return function () { clearTimeout(t); };
    }, [phase]);

    function beginSignin() { say(LINES.running, true); setPhase('seq'); }

    function submit() {
      if (mode === 'enlist' && !callsign.trim()) { say(LINES.needCall, false); return; }
      if (!email.trim() || !pass.trim())          { say(LINES.needCreds, false); return; }
      beginSignin();
    }
    function onKey(ev) { if (ev.key === 'Enter') submit(); }

    /* ── Render ── */
    return e('div', { className: 'pf-root' },
      /* backdrop */
      e('div', { className: 'pf-bg' },
        e('div', { className: 'pf-bg-glow' }),
        e('div', { className: 'pf-bg-vignette' })
      ),

      /* top bar */
      e('div', { className: 'pf-topbar' },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
          e('span', { className: 'pf-wordmark' }, 'Clarity'),
          e('span', { className: 'pf-hide-sm' }, 'Welcome')
        )
      ),

      /* card */
      e('div', { className: 'pf-console' },

        e('div', { className: 'pf-stage' },
          mode === 'signin'
            ? e(React.Fragment, null, 'Welcome ', e('b', null, 'back'))
            : e(React.Fragment, null, 'Start your ', e('b', null, 'journey'))
        ),

        /* the voice of Clarity */
        e('div', { className: 'capcom' + (listening ? '' : ' idle') },
          e('div', { className: 'capcom-body' },
            e('div', { className: 'capcom-line' },
              typed, !done && e('span', { className: 'pf-cursor' }, '▉')
            )
          )
        ),

        /* Google */
        e('button', { className: 'pf-google', onClick: beginSignin },
          e(GoogleG, null), 'Continue with Google'
        ),

        e('div', { className: 'pf-divider' }, 'or use your email'),

        /* Name (sign-up only) */
        mode === 'enlist' && e('div', { className: 'pf-field' },
          e('div', { className: 'pf-label' },
            e('span', null, 'Your name')
          ),
          e('div', { className: 'pf-input-wrap' },
            e(Icon, { name: 'UserRound', size: 15 }),
            e('input', {
              className: 'pf-input', value: callsign, onKeyDown: onKey,
              onFocus: focusCall, onBlur: blurField,
              onChange: function (ev) { setCallsign(ev.target.value); },
              placeholder: 'What do people call you?', autoComplete: 'off'
            })
          )
        ),

        /* Email */
        e('div', { className: 'pf-field' },
          e('div', { className: 'pf-label' },
            e('span', null, 'Email'),
            emailValid
              ? e('span', { className: 'pf-verified ok' },
                  e(Icon, { name: 'CircleCheck', size: 11 }), 'Looks good')
              : email.trim()
                ? e('span', { className: 'pf-verified pending' }, e('i', null), 'Keep typing…')
                : null
          ),
          e('div', { className: 'pf-input-wrap' + (emailValid ? ' ok' : '') },
            e(Icon, { name: 'Mail', size: 15 }),
            e('input', {
              className: 'pf-input', type: 'email', value: email, onKeyDown: onKey,
              onFocus: focusId, onBlur: blurField,
              onChange: function (ev) { setEmail(ev.target.value); },
              placeholder: 'you@example.com', autoComplete: 'username'
            })
          )
        ),

        /* Password */
        e('div', { className: 'pf-field' },
          e('div', { className: 'pf-label' },
            e('span', null, 'Password'),
            mode === 'signin' && e('a', null, 'Forgot your password?')
          ),
          e('div', { className: 'pf-input-wrap' },
            e(Icon, { name: 'KeyRound', size: 15 }),
            e('input', {
              className: 'pf-input', type: showPass ? 'text' : 'password', value: pass, onKeyDown: onKey,
              onFocus: focusKey, onBlur: blurField,
              onChange: function (ev) { setPass(ev.target.value); },
              placeholder: '••••••••', autoComplete: 'current-password'
            }),
            e('button', { className: 'pf-reveal', onClick: function () { setShowPass(!showPass); } },
              showPass ? 'Hide' : 'Show')
          ),
          /* strength meter — only when choosing a new password */
          mode === 'enlist' && e('div', { className: 'pf-enc' },
            e('span', { className: 'pf-enc-label' }, 'Strength'),
            e('div', { className: 'pf-enc-bars' },
              [0, 1, 2, 3, 4].map(function (i) {
                var on = i < keyStrength;
                return e('div', {
                  key: i, className: 'pf-enc-bar',
                  style: on ? { background: keyColor } : null
                });
              })
            ),
            e('span', { className: 'pf-enc-pct', style: { color: keyStrength ? keyColor : 'var(--clr-faint)' } }, keyLabel)
          )
        ),

        /* CTA */
        e('button', { className: 'pf-cta', onClick: submit },
          mode === 'signin' ? 'Sign in →' : 'Create my account →'
        ),

        /* footer */
        e('div', { className: 'pf-foot' },
          mode === 'signin'
            ? e(React.Fragment, null, 'New here? ',
                e('b', { onClick: function () { switchMode('enlist'); } }, 'Create an account'))
            : e(React.Fragment, null, 'Already have an account? ',
                e('b', { onClick: function () { switchMode('signin'); } }, 'Sign in'))
        ),

        /* signing-in overlay — just the line that fills, no checklist */
        phase === 'seq' && e('div', { className: 'pf-seq' },
          e('div', { className: 'pf-seq-bar' }, e('i', null))
        ),

        /* welcome overlay */
        phase === 'granted' && e('div', { className: 'pf-granted' },
          e('div', { className: 'pf-stamp' }, "You're in."),
          e('div', { className: 'pf-granted-sub' },
            mode === 'enlist' && callsign.trim()
              ? 'Lovely to meet you, ' + callsign.trim() + ". Let's take a look at your idea…"
              : 'Welcome back. Your ideas are right where you left them…'
          )
        )
      )
    );
  }

  window.ClarityLogin = ClarityLogin;
})();
