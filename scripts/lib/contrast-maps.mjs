// Authored CSS owns this bounded projection. A new contrast role or condition
// needs an explicit adapter contract; do not silently flatten unknown scopes.
import {readFileSync} from 'node:fs';
import postcss from 'postcss';

export const contrastRoles = ['--cs-color-border-default', '--cs-color-text-muted'];
const selectors = {
  light: '[data-cs-contrast="high"]',
  dark: '[data-theme="dark"][data-cs-contrast="high"], [data-cs-contrast="high"][data-theme="dark"]',
  system: '[data-theme="system"][data-cs-contrast="high"], [data-cs-contrast="high"][data-theme="system"]',
};
const normalize = value => value.replace(/\s*,\s*/g, ', ').trim();

export function readContrastMaps(root) {
  const file = new URL('tokens/theme-attributes.css', root);
  const document = postcss.parse(readFileSync(file, 'utf8'), {from: file.pathname});
  const scopes = {};
  document.walkRules(rule => {
    if (!rule.selector.includes('data-cs-contrast')) return;
    const scope = Object.keys(selectors).find(key => selectors[key] === normalize(rule.selector));
    if (!scope || scopes[scope]) throw Error('Unknown or duplicate authored contrast scope: ' + rule.selector);
    const parent = rule.parent;
    const validParent = scope === 'system'
      ? parent.type === 'atrule' && parent.name === 'media' && parent.params.trim() === '(prefers-color-scheme: dark)' && parent.parent.type === 'root'
      : parent.type === 'root';
    if (!validParent) throw Error('Unsupported contrast condition: ' + scope);
    const values = {};
    for (const node of rule.nodes) {
      if (node.type === 'comment') continue;
      if (node.type !== 'decl' || !contrastRoles.includes(node.prop) || Object.hasOwn(values, node.prop) || node.important || !/^#[0-9a-f]{6}$/i.test(node.value)) {
        throw Error('Unsupported contrast declaration in ' + scope);
      }
      values[node.prop] = node.value;
    }
    if (contrastRoles.some(key => !Object.hasOwn(values, key))) throw Error('Missing contrast role in ' + scope);
    scopes[scope] = values;
  });
  if (Object.keys(scopes).length !== 3) throw Error('Missing authored light/dark/system contrast scope');
  if (contrastRoles.some(key => scopes.system[key] !== scopes.dark[key])) throw Error('System-dark contrast differs from dark contrast');
  return {'high-light': scopes.light, 'high-dark': scopes.dark};
}
