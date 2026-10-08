// CyberSkill emitted-value profile, pinned to DTCG 2025.10 Format + Color.
// This is not a general DTCG reader: $ref, $extends, other types and non-sRGB
// colors must be implemented and tested before this repository emits them.
export const FORMAT = 'https://www.designtokens.org/tr/2025.10/format/';
export const COLOR = 'https://www.designtokens.org/tr/2025.10/color/';
export const TYPES = ['color', 'dimension', 'number', 'duration', 'cubicBezier', 'fontFamily', 'shadow'];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const own = (value, key) => Object.hasOwn(value, key);
const finite = value => typeof value === 'number' && Number.isFinite(value);
const alias = value => typeof value === 'string' && /^\{[^{}]+\}$/.test(value);

export function validateDtcgProfile(document) {
  const errors = [], tokens = new Map(), counts = {};
  const issue = (path, message) => errors.push({path, message});
  function walk(node, path = [], inherited) {
    const label = path.join('.') || '<root>';
    if (!object(node)) { issue(label, 'Expected a token or group object'); return; }
    for (const key of ['$ref', '$extends']) if (own(node, key)) issue(label, `${key} is outside the emitted profile`);
    const type = node.$type ?? inherited;
    if (own(node, '$value')) {
      if (!path.length) { issue(label, 'Document root cannot be a token'); return; }
      tokens.set(label, {value: node.$value, type});
      if (Object.keys(node).some(key => !key.startsWith('$'))) issue(label, 'A token cannot contain child groups/tokens');
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) {
        if (key === '$root') walk(child, [...path, key], type);
        continue;
      }
      if (/[.{}]/.test(key)) issue([...path, key].join('.'), 'Names cannot contain dots or braces');
      walk(child, [...path, key], type);
    }
  }
  walk(document);
  if (!tokens.size) issue('<root>', 'No tokens found');
  function check(value, type, path, stack, singleShadow = false) {
    if (alias(value)) {
      const targetPath = value.slice(1, -1), target = tokens.get(targetPath);
      if (!target) { issue(path, `Unresolved alias ${value}`); return; }
      if (stack.includes(targetPath)) { issue(path, `Alias cycle: ${[...stack, targetPath].join(' -> ')}`); return; }
      if (target.type !== type) { issue(path, `Alias type mismatch: expected ${type}, got ${target.type}`); return; }
      check(target.value, type, path, [...stack, targetPath], singleShadow);
      return;
    }
    const fail = message => issue(path, message);
    if (object(value) && own(value, '$ref')) { fail('$ref is outside the emitted profile'); return; }
    switch (type) {
      case 'color':
        if (!object(value)) { fail('Color requires an object, not a CSS string'); break; }
        if (value.colorSpace !== 'srgb') fail('Emitted color profile requires colorSpace srgb');
        if (!Array.isArray(value.components) || value.components.length !== 3 || !value.components.every(n => n === 'none' || finite(n) && n >= 0 && n <= 1)) fail('sRGB requires three numeric components in [0,1] or none');
        if (own(value, 'alpha') && !(finite(value.alpha) && value.alpha >= 0 && value.alpha <= 1)) fail('Color alpha must be a number in [0,1]');
        if (own(value, 'hex') && !(typeof value.hex === 'string' && /^#[0-9a-f]{6}$/i.test(value.hex))) fail('Color hex fallback must contain six hex digits');
        break;
      case 'dimension':
      case 'duration': {
        const units = type === 'dimension' ? ['px', 'rem'] : ['ms', 's'];
        if (!object(value) || !finite(value.value) || !units.includes(value.unit)) fail(`${type} requires {value: finite number, unit: ${units.join('|')}}`);
        break;
      }
      case 'number': if (!finite(value)) fail('Number requires a finite JSON number'); break;
      case 'cubicBezier':
        if (!Array.isArray(value) || value.length !== 4 || !value.every(finite) || value[0] < 0 || value[0] > 1 || value[2] < 0 || value[2] > 1) fail('Cubic Bezier requires four finite numbers with x coordinates in [0,1]');
        break;
      case 'fontFamily':
        if (!(typeof value === 'string' || Array.isArray(value) && value.every(v => typeof v === 'string'))) fail('Font family requires a string or array of strings');
        break;
      case 'shadow':
        if (Array.isArray(value)) {
          if (singleShadow) { fail('A shadow array entry must resolve to a single shadow object'); break; }
          value.forEach((layer, index) => check(layer, 'shadow', `${path}[${index}]`, stack, true));
        } else if (!object(value)) fail('Shadow requires a structured object or array');
        else {
          check(value.color, 'color', `${path}.color`, stack);
          for (const key of ['offsetX', 'offsetY', 'blur', 'spread']) check(value[key], 'dimension', `${path}.${key}`, stack);
          if (own(value, 'inset') && typeof value.inset !== 'boolean') fail('Shadow inset must be boolean');
        }
        break;
      default: fail(`Type ${String(type)} is outside the emitted profile`);
    }
  }
  for (const [path, token] of tokens) {
    counts[token.type ?? '<missing>'] = (counts[token.type ?? '<missing>'] || 0) + 1;
    check(token.value, token.type, path, [path]);
  }
  return {pass: errors.length === 0, format: FORMAT, color: COLOR, leaves: tokens.size, counts, errors};
}
