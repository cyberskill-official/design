// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
// Artifact head standard (UX-002 / B1): ensure <html lang> + <title> from @template.
(() => {
  const base = '../..';
  for (const p of ['dist/styles.min.css']) {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const staticLogo = !!document.querySelector('meta[name="cs-template-library"][content="static-logo"]');
  if (!staticLogo) {
  // Raw <helmet> scripts can execute while the HTML parser is still running,
  // before support.js finishes loading React. The DC runtime mounts them again.
  // Share one load per resolved URL and never evaluate the bundle before React.
  const bundleUrl = new URL(base + '/_ds_bundle.js', document.baseURI).href;
  const loads = window.__csTemplateBundleLoads || (window.__csTemplateBundleLoads = Object.create(null));
  if (!loads[bundleUrl]) {
    loads[bundleUrl] = new Promise((resolve, reject) => {
      const started = Date.now();
      const waitForReact = () => {
        if (typeof window.React?.useLayoutEffect !== 'function' || typeof window.ReactDOM?.createRoot !== 'function') {
          if (Date.now() - started >= 30000) {
            reject(new Error('React and ReactDOM were not ready before loading ' + bundleUrl));
            return;
          }
          setTimeout(waitForReact, 25);
          return;
        }
        const script = document.createElement('script');
        script.src = bundleUrl;
        script.onload = () => {
          // The compiler namespace varies by project; the public alias is stable.
          const key = Object.keys(window).find(k => /^CyberSkillDesignSystem_[0-9a-f]{6}$/.test(k));
          const namespace = key && window[key];
          if (!namespace || namespace.__errors?.length) {
            reject(new Error('Design-system bundle failed to initialize: ' + JSON.stringify(namespace?.__errors || [])));
            return;
          }
          resolve(namespace);
        };
        script.onerror = () => reject(new Error('Failed to load ' + bundleUrl + '; check the base path in ds-base.js'));
        document.head.appendChild(script);
      };
      waitForReact();
    });
  }
  loads[bundleUrl].then(namespace => { window.CyberSkillDS = namespace; })
    .catch(error => console.error('ds-base.js:', error.message));

  }
  const syncOfficialLogos = () => {
    const src = new URL(base + '/assets/logo-mark.svg', document.baseURI).href;
    for (const image of document.querySelectorAll('img[data-cs-official-logo]')) if (image.src !== src) image.src = src;
  };

  // Print documents: PDF (window.print) + editable DOCX toolbar (TASK-IMP-022).
  // Path is relative to this template folder → templates/_vendor/doc-export.js
  if (document.querySelector('meta[name="omelette-owns-print"]')) {
    const ex = document.createElement('script');
    ex.src = '../_vendor/doc-export.js';
    document.head.appendChild(ex);
  }

  const syncLang = () => {
    try {
      const a = document.body?.querySelector('[lang]:not([lang*="{{"])');
      const v = a && a.getAttribute('lang');
      // Ignore unresolved DC holes like {{ langAttr }}
      if (v && v.indexOf('{{') === -1 && document.documentElement.lang !== v) document.documentElement.setAttribute('lang', v);
      else if (!document.documentElement.getAttribute('lang')) document.documentElement.setAttribute('lang', 'en');
    } catch (e) { /* authoring host may sandbox */ }
  };

  const ensureLandmark = () => {
    try {
      const authored = document.querySelector('main, [role="main"]:not([data-cs-auto-main]), #main:not([data-cs-auto-main])');
      if (authored) {
        document.querySelectorAll('[data-cs-auto-main]').forEach(el => {
          el.removeAttribute('role'); el.removeAttribute('data-cs-auto-main');
          if (el.id === 'main') el.removeAttribute('id');
        });
        return true;
      }
      if (document.querySelector('[data-cs-auto-main]')) return true;
      const sheet = document.querySelector('.cs-sheet');
      const desk = document.querySelector('.cs-desk');
      const host = sheet || desk || document.body;
      // Mark the fallback as owned so a later authored main removes it.
      if (!host) return false;
      host.setAttribute('data-cs-auto-main', '');
      if (!host.id) host.id = 'main';
      if (host.tagName !== 'MAIN' && !host.getAttribute('role')) host.setAttribute('role', 'main');
      return true;
    } catch (e) { return false; }
  };
  const ensureHead = () => {
    try {
      if (!document.title || !document.title.trim()) {
        const src = document.documentElement.innerHTML;
        const m = src.match(/@template\s+name="([^"]+)"/);
        if (m) document.title = m[1] + ' · CyberSkill';
      }
      syncLang();
      syncOfficialLogos();
      ensureLandmark();
      const obs = new MutationObserver(() => {
        syncLang();
        syncOfficialLogos();
        if (ensureLandmark()) { /* keep observing lang; landmark is sticky once set */ }
      });
      obs.observe(document.body || document.documentElement, {
        attributes: true,
        attributeFilter: ['lang'],
        childList: true,
        subtree: true,
      });
      // DC helmet mounts after first paint — retry briefly for print sheets.
      let n = 0;
      const tick = () => {
        if (ensureLandmark() || ++n > 20) return;
        setTimeout(tick, 100);
      };
      setTimeout(tick, 50);
    } catch (e) { /* authoring host may sandbox */ }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureHead);
  } else {
    ensureHead();
  }
})();
