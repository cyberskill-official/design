// Browser-only source reconstruction, independent of the Node token exporter.
// CSSOM parses authored declarations; runtime checks below also exercise bindings.
const exportedRole = token => /^--cs-accent(?:-|$)/.test(token) || ['--cs-color-text-accent','--cs-color-link'].includes(token);
const elementPattern = /^\[data-cs-element="([a-z]+)"\](?:\[data-cs-variant="([a-z]+)"\])?$/;
const darkPattern = /^\[data-theme="dark"\]\[data-cs-element="([a-z]+)"\](?:\[data-cs-variant="([a-z]+)"\])?$/;
function branches(selector) {
  const result = [];
  let start = 0, depth = 0, quote, escaped = false;
  for (let i = 0; i < selector.length; i++) {
    const c = selector[i];
    if (escaped) { escaped = false; continue; }
    if (c === '\\') { escaped = true; continue; }
    if (quote) { if (c === quote) quote = undefined; continue; }
    if (c === '"' || c === "'") quote = c;
    else if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    else if (c === ',' && depth === 0) { result.push(selector.slice(start, i).trim()); start = i + 1; }
  }
  result.push(selector.slice(start).trim());
  return result;
}
export function readElementCssPacks(css) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  const packs = {};
  for (const rule of sheet.cssRules) {
    // Conditional/system/interplay rules are not independently authored packs.
    if (rule.type !== CSSRule.STYLE_RULE) continue;
    for (const selector of branches(rule.selectorText)) {
      const light = selector.match(elementPattern), dark = selector.match(darkPattern);
      const match = light || dark;
      if (!match) continue;
      const key = match[1] + '|' + (match[2] || '');
      const pack = packs[key] ||= { el: match[1], va: match[2] || '', light: {}, dark: {} };
      for (const name of rule.style) {
        const value = rule.style.getPropertyValue(name).trim();
        const publicName = name.replace(/^--_cs-(?:light|dark)-/, '--cs-');
        if (!exportedRole(publicName)) continue;
        if (name.startsWith('--_cs-light-') && light) pack.light['--cs-' + name.slice('--_cs-light-'.length)] = value;
        else if (name.startsWith('--_cs-dark-') && light) pack.dark['--cs-' + name.slice('--_cs-dark-'.length)] = value;
        else if (name.startsWith('--cs-')) (dark ? pack.dark : pack.light)[name] = value;
      }
    }
  }
  const expected = ['--cs-accent','--cs-accent-strong','--cs-accent-bright','--cs-accent-on','--cs-accent-on-strong','--cs-accent-tint','--cs-accent-ink','--cs-accent-glow','--cs-accent-grad-a','--cs-accent-grad-b','--cs-color-text-accent','--cs-color-link'].sort();
  for (const [key, pack] of Object.entries(packs)) for (const theme of ['light','dark']) {
    if (JSON.stringify(Object.keys(pack[theme]).sort()) !== JSON.stringify(expected)) throw Error('Incomplete or unknown elemental source roles: '+key+' '+theme);
  }
  return packs;
}
export function elementRuntimeDrift(packs) {
  const drift = [], host = document.createElement('div');
  host.style.display = 'none';
  document.body.append(host);
  try {
    for (const [key, pack] of Object.entries(packs)) for (const theme of ['light', 'dark', 'system']) {
      const palette = theme === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
      const node = document.createElement('div');
      node.dataset.theme = theme;
      node.setAttribute('data-cs-element', pack.el);
      if (pack.va) node.setAttribute('data-cs-variant', pack.va);
      node.setAttribute('data-cs-contrast', 'standard');
      host.append(node);
      const style = getComputedStyle(node);
      for (const [token, expected] of Object.entries(pack[palette])) {
        const actual = style.getPropertyValue(token).trim();
        if (actual !== expected) drift.push({ key, theme, token, expected, actual });
      }
      node.remove();
    }
  } finally { host.remove(); }
  return drift;
}
