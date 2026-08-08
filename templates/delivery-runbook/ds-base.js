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

  const syncLang = () => {
    try {
      const a = document.querySelector('[lang]');
      const v = a && a.getAttribute('lang');
      // Ignore unresolved DC holes like {{ langAttr }}
      if (v && v.indexOf('{{') === -1) document.documentElement.setAttribute('lang', v);
      else if (!document.documentElement.getAttribute('lang')) document.documentElement.setAttribute('lang', 'en');
    } catch (e) { /* authoring host may sandbox */ }
  };
  const ensureHead = () => {
    try {
      if (!document.title || !document.title.trim()) {
        const src = document.documentElement.innerHTML;
        const m = src.match(/@template\s+name="([^"]+)"/);
        if (m) document.title = m[1] + ' · CyberSkill';
      }
      syncLang();
      const obs = new MutationObserver(syncLang);
      obs.observe(document.body || document.documentElement, {
        attributes: true,
        attributeFilter: ['lang'],
        subtree: true,
      });
    } catch (e) { /* authoring host may sandbox */ }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureHead);
  } else {
    ensureHead();
  }
})();
