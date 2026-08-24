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
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onload = () => {
    // Expose a STABLE, project-id-independent alias. The compiler names the bundle
    // global CyberSkillDesignSystem_<6-hex-project-id>, which changes whenever this
    // system is re-imported into another project. Templates/cards read window.CyberSkillDS
    // so no file ever has to be rewritten on re-import.
    const k = Object.keys(window).find((k) => /^CyberSkillDesignSystem_[0-9a-f]{6}$/.test(k));
    if (k) window.CyberSkillDS = window[k];
  };
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);

  // Print documents: PDF (window.print) + editable DOCX toolbar (TASK-IMP-022).
  // Path is relative to this template folder → templates/_vendor/doc-export.js
  if (document.querySelector('meta[name="omelette-owns-print"]')) {
    const ex = document.createElement('script');
    ex.src = '../_vendor/doc-export.js';
    document.head.appendChild(ex);
  }

  const syncLang = () => {
    try {
      const a = document.querySelector('[lang]');
      const v = a && a.getAttribute('lang');
      // Ignore unresolved DC holes like {{ langAttr }}
      if (v && v.indexOf('{{') === -1) document.documentElement.setAttribute('lang', v);
      else if (!document.documentElement.getAttribute('lang')) document.documentElement.setAttribute('lang', 'en');
    } catch (e) { /* authoring host may sandbox */ }
  };

  const ensureLandmark = () => {
    try {
      if (document.querySelector('main, [role="main"], #main')) return true;
      const sheet = document.querySelector('.cs-sheet');
      const desk = document.querySelector('.cs-desk');
      const host = sheet || desk || document.body;
      if (!host) return false;
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
      ensureLandmark();
      const obs = new MutationObserver(() => {
        syncLang();
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
