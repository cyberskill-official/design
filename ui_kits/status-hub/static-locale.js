/* EN/VI copy for the three static Status Hub previews. Native form values,
 * caller data and theme are independent; language is local and not persisted. */
(function () {
  var root = document.documentElement;
  var toggle = document.querySelector('[data-preview-language-toggle]');
  var select = document.querySelector('[data-preview-language-select]');
  function apply(lang) {
    var vi = lang === 'vi';
    root.lang = vi ? 'vi' : 'en';
    document.querySelectorAll('[data-vi]').forEach(function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.textContent;
      el.textContent = vi ? el.dataset.vi : el.dataset.en;
    });
    document.querySelectorAll('[data-vi-aria-label]').forEach(function (el) {
      if (el.dataset.enAriaLabel === undefined) el.dataset.enAriaLabel = el.getAttribute('aria-label');
      el.setAttribute('aria-label', vi ? el.dataset.viAriaLabel : el.dataset.enAriaLabel);
    });
    if (toggle) toggle.textContent = vi ? 'English' : 'Tiếng Việt';
    if (select) select.value = root.lang;
    document.dispatchEvent(new CustomEvent('cs:status-preview-language', { detail: { lang: root.lang } }));
  }
  window.CSStatusPreviewLocale = { apply: apply };
  if (toggle) toggle.addEventListener('click', function () { apply(root.lang === 'vi' ? 'en' : 'vi'); });
  if (select) select.addEventListener('change', function () { apply(select.value); });
  apply(root.lang);
})();
