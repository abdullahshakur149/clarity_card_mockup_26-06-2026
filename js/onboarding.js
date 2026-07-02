/* ============================================================================
   onboarding.js — "Tell me about your idea" (gamified intake, journey tone)
   Exposes window.ClarityOnboarding({ onComplete }).

   Client mandate: feel like how Claude/ChatGPT asks for input — ONE open
   prompt, no forms. Type it, SPEAK it (real Web Speech API), or drop a link.
   The game is the RESPONSE: Clarity listens, gets the picture, and lays the
   idea out on cards the user just confirms. Minimum cost: one held mic + tap.

   Flow:  input → getting-the-picture moment → (name follow-up if needed)
          → idea cards → enter
   Extraction is client-side heuristics only (no API). Reuses .pf-* + .capcom
   (the unattributed voice strip) from auth.css; own styles live in
   css/onboarding-decode.css (prefix dt-).
   Output profile {sector,name,desc,audience,goal,priorities} — unchanged
   contract for shell.js ClarityRoot → ClarityIntel.
   ========================================================================== */
(function () {
  'use strict';

  var e = React.createElement;
  function Icon(props) { var NS = window.ClarityDesignSystem_29c088 || {}; return NS.Icon ? e(NS.Icon, props) : null; }

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var XP_AWARD = 50;

  var SECTOR_LABEL = {
    food: 'Food & hospitality', retail: 'Retail & products', creative: 'Creative & services',
    tech: 'Software & tech', trades: 'Trades & local services', other: 'General business'
  };
  var SECTOR_ICON = {
    food: 'Coffee', retail: 'ShoppingBag', creative: 'Palette', tech: 'Cpu', trades: 'Wrench', other: 'Briefcase'
  };
  var SECTOR_KW = {
    food: ['bakery', 'baker', 'bread', 'sourdough', 'pastry', 'pastries', 'cafe', 'café', 'coffee', 'restaurant', 'kitchen', 'catering', 'caterer', 'food', 'chef', 'menu', 'deli', 'brew', 'brewery', 'chocolate', 'patisserie', 'diner', 'eatery', 'meals', 'juice'],
    retail: ['shop', 'store', 'boutique', 'ecommerce', 'e-commerce', 'product', 'products', 'clothing', 'apparel', 'fashion', 'jewelry', 'jewellery', 'candle', 'candles', 'cosmetics', 'skincare', 'beauty', 'goods', 'merch', 'retail', 'dropship', 'handmade', 'crafts', 'label'],
    creative: ['design', 'designer', 'agency', 'studio', 'photographer', 'photography', 'videographer', 'video', 'content', 'marketing', 'branding', 'freelance', 'freelancer', 'consultant', 'consulting', 'copywriter', 'illustrator', 'artist', 'creative', 'portfolio'],
    tech: ['app', 'software', 'saas', 'platform', 'tech', 'ai', 'tool', 'startup', 'developer', 'code', 'api', 'automation', 'dashboard', 'plugin', 'extension', 'b2b', 'fintech'],
    trades: ['plumber', 'plumbing', 'electrician', 'electrical', 'builder', 'building', 'carpenter', 'carpentry', 'cleaning', 'cleaner', 'landscaping', 'landscaper', 'contractor', 'handyman', 'hvac', 'roofing', 'painter', 'painting', 'salon', 'barber', 'spa', 'mechanic', 'repair', 'gardener', 'detailing']
  };

  /* unambiguous product-type words carry more weight than incidental mentions */
  var SECTOR_STRONG = {
    food: ['bakery', 'restaurant', 'cafe', 'café', 'catering', 'patisserie'],
    retail: ['boutique', 'ecommerce', 'e-commerce', 'store'],
    creative: ['agency', 'studio', 'photographer', 'photography'],
    tech: ['saas', 'software', 'platform', 'app'],
    trades: ['plumber', 'electrician', 'contractor', 'hvac', 'carpenter']
  };
  function pickSector(t) {
    t = ' ' + String(t || '').toLowerCase() + ' ';
    var best = 'other', bestN = 0;
    Object.keys(SECTOR_KW).forEach(function (k) {
      var n = 0, strong = SECTOR_STRONG[k] || [];
      SECTOR_KW[k].forEach(function (w) { if (t.indexOf(w) >= 0) n += strong.indexOf(w) >= 0 ? 3 : 1; });
      if (n > bestN) { bestN = n; best = k; }
    });
    return best;
  }
  function titleName(s) {
    return String(s || '').replace(/["“”]/g, '').replace(/[-_.]+/g, ' ').replace(/\s+/g, ' ').trim()
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }
  function shorten(s, words) {
    var p = String(s || '').trim().split(/\s+/);
    return p.length <= words ? String(s || '').trim() : p.slice(0, words).join(' ') + '…';
  }
  function cap(s) { s = String(s || '').trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function extractName(raw) {
    var s = String(raw || '');
    var m = s.match(/\b(?:called|named|call it|it['’]s called|business is|company is|brand is|shop is|studio is)\s+["“]?([A-Za-z0-9][\w&'’.\- ]{1,32}?)["”]?(?:[.,!?]|\s+(?:that|which|and|for|to|where|based)\b|$)/i);
    if (m && m[1]) { var nm = m[1].replace(/^(?:called|named)\s+/i, '').trim(); if (nm) return titleName(nm); }
    m = s.match(/\b(?:run|own|founded|started|launching|building)\s+([A-Z][\w&'’.\-]+(?:\s+[A-Z][\w&'’.\-]+){0,2})\b/);
    if (m && m[1] && !/^(A|An|The|My|Our|This|That)$/i.test(m[1].split(' ')[0])) return m[1].trim();
    return '';
  }
  function extractOffer(t) {
    var s = String(t || '');
    var m = s.match(/\b(?:run|own|sell|selling|make|making|offer|offering|build|building|provide|providing)\s+(?:a |an |my |our )?([a-z][\w'’\- ]{2,38}?)(?:[.,!?]|\s+(?:for|to|that|which|and|so|aimed|serving|business|company|based)\b|$)/i);
    if (m && m[1] && m[1].trim().length > 2) return cap(m[1].trim());
    m = s.match(/\b(?:i['’]?m|i am|we['’]?re|we are)\s+(?:a |an )?([a-z][\w'’\- ]{2,30}?)(?:[.,!?]|\s+(?:in|for|to|that|and|so|based|near|who|doing|mostly|serving)\b|$)/i);
    if (m && m[1] && m[1].trim().length > 2) return cap(m[1].trim());
    m = s.match(/\b([a-z][\w'’\-]+\s+(?:studio|agency|shop|store|boutique|bakery|salon|spa|cafe|café|kitchen|collective|works|clinic|practice|co))\b/i);
    if (m && m[1]) return cap(m[1].trim());
    return shorten(t, 9) || 'Your offer';
  }
  function extractAudience(t, sector) {
    var s = String(t || '');
    var m = s.match(/\b(?:for|serving|aimed at|targeting|sell to|selling to|help|helps|helping)\s+([a-z][\w'’\- ]{3,42}?)(?:[.,!?]|\s+(?:who|that|in|and|so|to|with|near|looking)\b|$)/i);
    if (m && m[1] && m[1].trim().length > 2) return cap(shorten(m[1].trim(), 5));
    var def = { food: 'Local food lovers', retail: 'Online & local shoppers', creative: 'Small businesses & founders', tech: 'Early adopters in your niche', trades: 'Local homeowners', other: 'Your local customers' };
    return def[sector] || def.other;
  }
  function extractGoal(t) {
    t = String(t || '').toLowerCase();
    if (/\b(launch|just start|starting|get started|first customer|first sale|open up|opening)/.test(t)) return 'Launch and land your first customers';
    if (/\b(scale|grow|growth|expand|more customer|more sales|double|bigger)/.test(t)) return 'Grow and reach more customers';
    if (/\b(known|awareness|visible|discover|noticed|brand|audience|following|reach)/.test(t)) return 'Build awareness and get discovered';
    if (/\b(sell|sales|revenue|orders|bookings|leads|conversion)/.test(t)) return 'Drive more sales and leads';
    if (/\b(retain|loyal|repeat|community|keep customer)/.test(t)) return 'Build loyalty and repeat business';
    return 'Get discovered and grow';
  }
  function inferPriorities(sector) {
    var m = {
      food: ['Get discovered locally', 'Win trust', 'Grow repeat orders'],
      retail: ['Get discovered', 'Convert browsers', 'Grow repeat orders'],
      creative: ['Show proof', 'Win trust', 'Get discovered'],
      tech: ['Get discovered', 'Convert signups', 'Retain users'],
      trades: ['Get found locally', 'Win trust', 'Fill the calendar'],
      other: ['Get discovered', 'Win trust', 'Convert interest']
    };
    return m[sector] || m.other;
  }

  function decode(raw) {
    var t = String(raw || '').trim();
    var sector = pickSector(t);
    return {
      sector: sector, sectorLabel: SECTOR_LABEL[sector], name: extractName(t),
      desc: t ? extractOffer(t) : 'Your offer', audience: extractAudience(t, sector),
      goal: extractGoal(t), priorities: inferPriorities(sector), raw: t
    };
  }
  function decodeFromUrl(url) {
    var raw = String(url || '').trim();
    var host = raw.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split(/[\/?#]/)[0] || raw;
    var core = host.split('.')[0] || 'your brand';
    var sector = pickSector(host.replace(/[-_.]/g, ' '));
    return {
      sector: sector, sectorLabel: SECTOR_LABEL[sector], name: titleName(core),
      desc: 'Read from ' + host, audience: extractAudience('', sector),
      goal: 'Build awareness and get discovered', priorities: inferPriorities(sector), raw: raw
    };
  }

  /* what Clarity thinks aloud while it reads what you shared */
  var SCAN = ['Reading what you shared…', 'Picking out what matters…', 'Getting a feel for your world…', 'Placing you among your people…', 'Laying your idea out…'];

  /* the voice of Clarity — unattributed, typewriter line */
  function Voice(props) {
    var line = props.line;
    var ty = React.useState(''); var typed = ty[0], setTyped = ty[1];
    var dn = React.useState(false); var done = dn[0], setDone = dn[1];
    React.useEffect(function () {
      setTyped(''); setDone(false);
      var i = 0; var iv = setInterval(function () { i++; setTyped(line.slice(0, i)); if (i >= line.length) { clearInterval(iv); setDone(true); } }, 16);
      return function () { clearInterval(iv); };
    }, [line]);
    return e('div', { className: 'capcom' },
      e('div', { className: 'capcom-body' },
        e('div', { className: 'capcom-line' }, typed, !done && e('span', { className: 'pf-cursor' }, '▉'))));
  }

  function ClarityOnboarding(props) {
    var onComplete = props.onComplete;

    var vw = React.useState('input');           var view = vw[0], setView = vw[1];
    var md = React.useState(SR ? 'speak' : 'type'); var mode = md[0], setMode = md[1];
    var tx = React.useState('');                 var text = tx[0], setText = tx[1];
    var im = React.useState('');                 var interim = im[0], setInterim = im[1];
    var ls = React.useState(false);              var listening = ls[0], setListening = ls[1];
    var nt = React.useState('');                 var micNote = nt[0], setMicNote = nt[1];
    var lk = React.useState('');                 var link = lk[0], setLink = lk[1];
    var dc = React.useState(null);               var dossier = dc[0], setDossier = dc[1];
    var sc = React.useState(0);                  var scan = sc[0], setScan = sc[1];
    var ed = React.useState(null);               var editing = ed[0], setEditing = ed[1];   /* {key,val} */
    var nm = React.useState('');                 var nameVal = nm[0], setNameVal = nm[1];

    var recRef = React.useRef(null);
    var finalRef = React.useRef('');
    var decodedRef = React.useRef(null);

    /* ── speech ── */
    function startListening() {
      if (!SR) return;
      try {
        var rec = new SR();
        rec.lang = 'en-US'; rec.continuous = true; rec.interimResults = true;
        finalRef.current = '';
        rec.onresult = function (ev) {
          var it = '';
          for (var i = ev.resultIndex; i < ev.results.length; i++) {
            var res = ev.results[i];
            if (res.isFinal) finalRef.current += res[0].transcript + ' ';
            else it += res[0].transcript;
          }
          setInterim(it);
          setText((finalRef.current + it).replace(/\s+/g, ' ').trim());
        };
        rec.onerror = function (ev) {
          setListening(false);
          if (ev && ev.error === 'not-allowed') { setMicNote('Mic access blocked — type or drop a link instead.'); setMode('type'); }
          else if (ev && ev.error === 'no-speech') { setMicNote('Didn’t catch that — hold and speak again, or type.'); }
        };
        rec.onend = function () { setListening(false); setInterim(''); if (finalRef.current) setText(finalRef.current.replace(/\s+/g, ' ').trim()); };
        recRef.current = rec; rec.start(); setListening(true); setMicNote('');
      } catch (err) { setListening(false); }
    }
    function stopListening() { try { if (recRef.current) recRef.current.stop(); } catch (e) {} setListening(false); }
    React.useEffect(function () { return function () { try { if (recRef.current) recRef.current.stop(); } catch (e) {} }; }, []);

    /* ── decode + advance ── */
    function runDecode(src, viaUrl) {
      var d = viaUrl ? decodeFromUrl(src) : decode(src);
      decodedRef.current = d; setDossier(d); setView('decoding');
    }
    React.useEffect(function () {
      if (view !== 'decoding') return;
      var n = 0; setScan(0);
      var iv = setInterval(function () { n++; setScan(n); if (n >= SCAN.length) clearInterval(iv); }, 360);
      var to = setTimeout(function () { var d = decodedRef.current; setView(d && !d.name ? 'name' : 'dossier'); }, 2200);
      return function () { clearInterval(iv); clearTimeout(to); };
    }, [view]);

    function submitName() {
      var v = (nameVal || '').trim();
      var d = Object.assign({}, decodedRef.current, { name: v || 'Your venture' });
      decodedRef.current = d; setDossier(d); setView('dossier');
    }
    function saveEdit() {
      if (!editing) return;
      var patch = {}; patch[editing.key] = editing.val;
      if (editing.key === 'sector') patch.sectorLabel = SECTOR_LABEL[editing.val] || editing.val;
      var d = Object.assign({}, decodedRef.current, patch);
      decodedRef.current = d; setDossier(d); setEditing(null);
    }
    function restart() {
      stopListening(); setText(''); setLink(''); setInterim(''); finalRef.current = '';
      decodedRef.current = null; setDossier(null); setEditing(null); setNameVal('');
      setMode(SR ? 'speak' : 'type'); setView('input');
    }
    function finish() {
      var d = decodedRef.current || dossier || {};
      if (onComplete) onComplete({ sector: d.sector, name: d.name, desc: d.desc, audience: d.audience, goal: d.goal, priorities: d.priorities || [] });
    }

    /* ── frame ── */
    function bg() { return e('div', { className: 'pf-bg' }, e('div', { className: 'pf-bg-glow' }), e('div', { className: 'pf-bg-vignette' })); }
    function shell(inner) {
      return e('div', { className: 'dt-root' }, bg(),
        e('div', { className: 'pf-topbar' },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
            e('span', { className: 'pf-wordmark' }, 'Clarity'),
            e('span', { className: 'pf-hide-sm' }, 'Getting to know you'))),
        e('div', { className: 'dt-main' }, inner));
    }

    /* ── INPUT ── */
    if (view === 'input') {
      var hasText = text.trim().length > 0;
      var panel;
      if (mode === 'speak') {
        panel = e('div', { className: 'dt-speak' },
          e('button', {
            className: 'dt-mic' + (listening ? ' live' : ''),
            onPointerDown: function (ev) { ev.preventDefault(); startListening(); },
            onPointerUp: function () { stopListening(); },
            onPointerLeave: function () { if (listening) stopListening(); },
            onContextMenu: function (ev) { ev.preventDefault(); }
          }, e('span', { className: 'dt-mic-rings' }), e(Icon, { name: 'Mic', size: 30 })),
          e('div', { className: 'dt-mic-hint' }, listening ? 'Listening… release when done' : (hasText ? 'Hold to add more' : 'Hold and tell me about it')),
          (hasText || interim) && e('div', { className: 'dt-transcript' }, text || interim, listening && e('span', { className: 'pf-cursor' }, '▉')),
          micNote && e('div', { className: 'dt-note' }, micNote),
          hasText && e('button', { className: 'pf-cta dt-cta', onClick: function () { stopListening(); runDecode(text, false); } }, 'Take a look ', e(Icon, { name: 'ArrowRight', size: 16 })));
      } else if (mode === 'type') {
        panel = e('div', { className: 'dt-type' },
          e('textarea', { className: 'pf-input dt-textarea', value: text, autoFocus: true, rows: 4,
            placeholder: 'e.g. I run a small-batch sourdough bakery for local families and weekend markets. Trying to get known and grow regular orders.',
            onChange: function (ev) { setText(ev.target.value); } }),
          e('button', { className: 'pf-cta dt-cta', disabled: !hasText, onClick: function () { runDecode(text, false); } }, 'Take a look ', e(Icon, { name: 'ArrowRight', size: 16 })));
      } else {
        panel = e('div', { className: 'dt-link' },
          e('input', { className: 'pf-input dt-linkinput', value: link, autoFocus: true, placeholder: 'yourbusiness.com   ·   or paste a socials link',
            onChange: function (ev) { setLink(ev.target.value); }, onKeyDown: function (ev) { if (ev.key === 'Enter' && link.trim()) runDecode(link, true); } }),
          e('label', { className: 'dt-file' }, e(Icon, { name: 'Paperclip', size: 14 }), 'Attach a deck instead',
            e('input', { type: 'file', style: { display: 'none' }, onChange: function (ev) { var f = ev.target.files && ev.target.files[0]; if (f) runDecode(f.name.replace(/\.[^.]+$/, ''), true); } })),
          e('button', { className: 'pf-cta dt-cta', disabled: !link.trim(), onClick: function () { runDecode(link, true); } }, 'Have a read ', e(Icon, { name: 'ArrowRight', size: 16 })));
      }
      return shell(e(React.Fragment, null,
        e('div', { className: 'dt-eyebrow' }, 'The first step'),
        e('h1', { className: 'dt-title' }, 'Tell me about your idea.'),
        e(Voice, { line: SR ? 'This is the easy part — hold the mic and just talk. No forms, I promise.' : 'Tell me about it in a line or two — I’ll take it from there.' }),
        e('p', { className: 'dt-sub' }, 'What are you building, and who’s it for? One pass — talk it, type it, or drop a link. I’ll pull the rest.'),
        e('div', { className: 'dt-modes' },
          SR && e('button', { className: 'dt-mode' + (mode === 'speak' ? ' on' : ''), onClick: function () { setMode('speak'); } }, e(Icon, { name: 'Mic', size: 14 }), 'Speak'),
          e('button', { className: 'dt-mode' + (mode === 'type' ? ' on' : ''), onClick: function () { stopListening(); setMode('type'); } }, e(Icon, { name: 'Keyboard', size: 14 }), 'Type'),
          e('button', { className: 'dt-mode' + (mode === 'link' ? ' on' : ''), onClick: function () { stopListening(); setMode('link'); } }, e(Icon, { name: 'Link', size: 14 }), 'Drop a link')),
        e('div', { className: 'dt-panel', key: mode }, panel)
      ));
    }

    /* ── GETTING THE PICTURE ── */
    if (view === 'decoding') {
      return shell(e(React.Fragment, null,
        e('div', { className: 'dt-eyebrow' }, 'One moment'),
        e('h1', { className: 'dt-title' }, 'Getting the picture…'),
        e('div', { className: 'dt-decode' },
          e('div', { className: 'dt-decode-scan' }),
          e('div', { className: 'dt-decode-src' }, (decodedRef.current && decodedRef.current.raw) || text || link),
          e('div', { className: 'dt-log' }, SCAN.slice(0, scan).map(function (l, i) { return e('div', { key: i, className: i === scan - 1 ? 'live' : '' }, l); }))
        )
      ));
    }

    /* ── NAME follow-up (only if a name couldn't be extracted) ── */
    if (view === 'name') {
      return shell(e(React.Fragment, null,
        e('div', { className: 'dt-eyebrow' }, 'One quick thing'),
        e('h1', { className: 'dt-title' }, 'What’s it called?'),
        e(Voice, { line: 'Got the picture — I just didn’t catch the name. What do you call it?' }),
        e('div', { className: 'dt-namewrap' },
          e('input', { className: 'pf-input dt-nameinput', value: nameVal, autoFocus: true, placeholder: 'Your business name',
            onChange: function (ev) { setNameVal(ev.target.value); }, onKeyDown: function (ev) { if (ev.key === 'Enter') submitName(); } }),
          e('button', { className: 'pf-cta dt-cta', onClick: submitName }, 'That’s the one ', e(Icon, { name: 'ArrowRight', size: 16 }))),
        e('button', { className: 'dt-skip', onClick: function () { setNameVal(''); submitName(); } }, 'Skip for now')
      ));
    }

    /* ── YOUR IDEA, ON CARDS ── */
    var d = dossier || decodedRef.current || {};
    var fields = [
      { key: 'sector', label: 'Sector', icon: SECTOR_ICON[d.sector] || 'Briefcase', value: d.sectorLabel || SECTOR_LABEL[d.sector] || '—' },
      { key: 'desc', label: 'What you sell', icon: 'Package', value: d.desc || '—' },
      { key: 'audience', label: 'Who it’s for', icon: 'Users', value: d.audience || '—' },
      { key: 'goal', label: 'Your goal', icon: 'Target', value: d.goal || '—' }
    ];
    return shell(e(React.Fragment, null,
      e('div', { className: 'dt-acq' }, e('span', { className: 'dt-acq-stamp' }, 'Your idea, captured'), e('span', { className: 'dt-acq-xp' }, '+ ', XP_AWARD, ' XP')),
      e('h1', { className: 'dt-title' }, d.name || 'Your idea'),
      e(Voice, { line: 'Here’s what I took from that. Fix anything that’s off — otherwise, we’re good to go.' }),
      e('div', { className: 'dt-dossier' },
        fields.map(function (f, i) {
          var isEd = editing && editing.key === f.key;
          return e('div', { key: f.key, className: 'dt-card', style: { animationDelay: (0.09 * i + 0.05) + 's' } },
            e('div', { className: 'dt-card-ic' }, e(Icon, { name: f.icon, size: 18 })),
            e('div', { className: 'dt-card-body' },
              e('div', { className: 'dt-card-label' }, f.label),
              isEd
                ? (f.key === 'sector'
                    ? e('div', { className: 'dt-chips' }, Object.keys(SECTOR_LABEL).map(function (sk) { return e('button', { key: sk, className: 'dt-chip' + (editing.val === sk ? ' on' : ''), onClick: function () { setEditing({ key: 'sector', val: sk }); } }, SECTOR_LABEL[sk]); }))
                    : e('input', { className: 'pf-input dt-cardinput', value: editing.val, autoFocus: true, onChange: function (ev) { setEditing({ key: f.key, val: ev.target.value }); }, onKeyDown: function (ev) { if (ev.key === 'Enter') saveEdit(); } }))
                : e('div', { className: 'dt-card-val' }, f.value)),
            isEd
              ? e('div', { className: 'dt-card-actions' },
                  e('button', { className: 'dt-save', onClick: saveEdit }, e(Icon, { name: 'Check', size: 15 })),
                  e('button', { className: 'dt-cancel', onClick: function () { setEditing(null); } }, e(Icon, { name: 'X', size: 15 })))
              : e('button', { className: 'dt-edit', title: 'Edit', onClick: function () { setEditing({ key: f.key, val: f.key === 'sector' ? d.sector : (f.value === '—' ? '' : f.value) }); } }, e(Icon, { name: 'Pencil', size: 13 }))
          );
        })),
      e('div', { className: 'dt-confirm' },
        e('button', { className: 'pf-cta dt-cta dt-enter', onClick: finish }, 'That’s me — enter Clarity ', e(Icon, { name: 'ArrowRight', size: 16 })),
        e('button', { className: 'dt-restart', onClick: restart }, '↻ Start over'))
    ));
  }

  window.ClarityOnboarding = ClarityOnboarding;
})();
