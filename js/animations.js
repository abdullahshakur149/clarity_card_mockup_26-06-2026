/* animations.js — GSAP screen/step transitions + first-visit loader */
(function () {

  /* ── 1. Loader: first-visit only ─────────────────────────────────── */
  (function initLoader() {
    // Skip immediately if user has visited before
    try {
      if (localStorage.getItem('clarity_seen')) {
        var l = document.getElementById('clarity-loader');
        if (l) l.style.display = 'none';
        return;
      }
    } catch (e) {}

    var _start = Date.now(), MIN = 3200;

    function dismiss() {
      var l = document.getElementById('clarity-loader');
      if (!l || l._done) return;
      l._done = true;
      try { localStorage.setItem('clarity_seen', '1'); } catch (e) {}
      var wait = Math.max(0, MIN - (Date.now() - _start));
      setTimeout(function () {
        l.classList.add('cl-hiding');
        setTimeout(function () { if (l.parentNode) l.parentNode.removeChild(l); }, 700);
      }, wait);
    }

    function watchRoot() {
      var root = document.getElementById('root');
      if (!root) { setTimeout(watchRoot, 100); return; }
      if (root.children.length) { dismiss(); return; }
      var obs = new MutationObserver(function () {
        if (root.children.length) { obs.disconnect(); dismiss(); }
      });
      obs.observe(root, { childList: true });
    }
    watchRoot();
    // safety fallback
    setTimeout(dismiss, 6000); 
  })();

  /* ── 2. GSAP transitions ──────────────────────────────────────────── */
  function bootGsap() {
    if (typeof gsap === 'undefined') { setTimeout(bootGsap, 60); return; }

    var _step = null, _screen = null;

    function sg(els, opts) {
      var a = Array.from(els || []).filter(Boolean);
      if (!a.length) return;
      gsap.from(a, Object.assign({ clearProps: 'transform,opacity' }, opts));
    }

    function animStep(el) {
      if (el === _step) return;
      _step = el;
      el.style.animation = 'none';
      gsap.fromTo(el,
        { opacity: 0, y: 22, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'power3.out',
          clearProps: 'transform,opacity,scale',
          onComplete: function () {
            sg(el.querySelectorAll('[class*="grid"] > div, [style*="display: grid"] > div'),
              { opacity: 0, y: 16, scale: 0.93, duration: 0.3, stagger: 0.07, ease: 'back.out(1.3)' });
            sg(el.querySelectorAll('select, textarea, input[type="range"]'),
              { opacity: 0, y: 10, duration: 0.25, stagger: 0.07, ease: 'power2.out', delay: 0.05 });
            sg(el.querySelectorAll('[class*="pill"], [style*="border-radius: 99"]'),
              { opacity: 0, x: -5, duration: 0.18, stagger: 0.035, ease: 'power2.out', delay: 0.1 });
          }
        });
    }

    function animScreen(el) {
      if (!el || el === _screen) return;
      _screen = el;
      gsap.fromTo(el,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.3, ease: 'power2.out',
          clearProps: 'transform,opacity',
          onComplete: function () {
            sg(el.querySelectorAll('[style*="display: grid"] > div'),
              { opacity: 0, y: 16, scale: 0.96, duration: 0.3, stagger: 0.07, ease: 'power2.out' });
          }
        });
    }

    // Animate current content out when a sidebar nav item is clicked
    document.addEventListener('click', function (e) {
      var sb = document.querySelector('[style*="width: 240px"]');
      if (!sb) return;
      var row = e.target.closest('[style*="cursor: pointer"]');
      if (!row || !sb.contains(row)) return;
      var wrap = document.querySelector('[style*="overflowY: auto"]') ||
                 document.querySelector('[style*="overflow-y: auto"]');
      var cur = wrap && wrap.firstElementChild;
      if (cur) gsap.to(cur, { opacity: 0, y: -10, duration: 0.13, ease: 'power2.in' });
    }, true);

    var busy = false;
    new MutationObserver(function () {
      if (busy) return;
      busy = true;
      requestAnimationFrame(function () {
        busy = false;
        // Don't animate while loader is still showing
        if (document.getElementById('clarity-loader')) return;
        var step = document.querySelector('.sf-step');
        if (step) { animStep(step); return; }
        var wrap = document.querySelector('[style*="overflowY: auto"]') ||
                   document.querySelector('[style*="overflow-y: auto"]');
        animScreen(wrap && wrap.firstElementChild);
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
  bootGsap();

})();
