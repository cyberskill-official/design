import assert from 'node:assert/strict';
import { parse } from 'parse5';
const own = (o, keys) => {
  assert(o && Object.getPrototypeOf(o) === Object.prototype);
  assert.deepEqual(Reflect.ownKeys(o).sort(), [...keys].sort());
  for (const k of keys) assert(Object.hasOwn(Object.getOwnPropertyDescriptor(o, k), 'value'), 'Accessor metadata forbidden');
};
const dense = a => {
  assert(Array.isArray(a) && Object.getPrototypeOf(a) === Array.prototype);
  assert.equal(Reflect.ownKeys(a).length, a.length + 1);
  for (let i = 0; i < a.length; i++) assert(Object.hasOwn(Object.getOwnPropertyDescriptor(a, String(i)) || {}, 'value'), 'Dense data array required');
  return a;
};
const attrs = n => Object.fromEntries(n.attrs.map(a => [a.name, a.value]));
const walk = (n, a = []) => {
  a.push(n);
  for (const c of n.childNodes || []) walk(c, a);
  return a;
};
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes || []).map(text).join('');
const children = n => (n.childNodes || []).filter(c => c.tagName || c.nodeName === '#text' && c.value.trim());
const cssFields = {
  footerLink: ['color'],
  invitationEyebrow: ['position', 'font-size', 'font-weight', 'text-transform', 'letter-spacing', 'color'],
  invitationTitle: ['position', 'font-size', 'font-weight', 'letter-spacing', 'margin'],
  invitationSubtitle: ['position', 'font-size', 'opacity', 'margin']
};
export function styleText(role, style) {
  assert(Object.hasOwn(cssFields, role));
  own(style, cssFields[role]);
  const rules = {
    'color': /^var\(--cs-(?:color-link|accent-bright)\)$/,
    'position': /^relative$/,
    'font-size': /^(?:[89]|[1-6]\d|7[0-2])px$/,
    'font-weight': /^[1-9]00$/,
    'text-transform': /^uppercase$/,
    'letter-spacing': /^-?0\.\d{1,3}em$/,
    'margin': /^(?:0|\d{1,2}px)(?: (?:0|\d{1,2}px)){0,3}$/,
    'opacity': /^(?:0\.\d{1,3}|1)$/
  };
  return cssFields[role].map(k => {
    assert(typeof style[k] === 'string' && rules[k].test(style[k]), 'Bounded CSS property ' + k);
    return k + ':' + style[k];
  }).join(';');
}
export function validateSharedLayouts(source) {
  own(source, ['schemaVersion', 'styles', 'templates']);
  assert.equal(source.schemaVersion, 1);
  own(source.styles, Object.keys(cssFields));
  for (const role of Object.keys(cssFields)) styleText(role, source.styles[role]);
  dense(source.templates);
  assert.equal(source.templates.length, 5);
  const paths = new Set();
  for (const e of source.templates) {
    own(e, ['template', 'path', 'branchIndex', 'owners']);
    assert(/^[a-z0-9-]+$/.test(e.template));
    assert(new RegExp('^templates/' + e.template + '/[A-Za-z]+\\.dc\\.html$').test(e.path));
    assert(!paths.has(e.path));
    paths.add(e.path);
    assert(Number.isInteger(e.branchIndex) && e.branchIndex >= 0 && e.branchIndex < 10);
    dense(e.owners);
    assert(e.owners.length >= 2);
    const locations = new Set();
    for (const o of e.owners) {
      own(o, ['language', 'path', 'tag', 'role', 'attributes', 'text']);
      assert(['en', 'vi'].includes(o.language));
      dense(o.path);
      assert(o.path.every(n => Number.isInteger(n) && n >= 0));
      assert(['a', 'div', 'h1', 'p'].includes(o.tag));
      assert(Object.hasOwn(cssFields, o.role));
      assert.equal(o.tag, {
        footerLink: 'a',
        invitationEyebrow: 'div',
        invitationTitle: 'h1',
        invitationSubtitle: 'p'
      }[o.role]);
      assert(o.attributes && Object.getPrototypeOf(o.attributes) === Object.prototype);
      own(o.attributes, Object.keys(o.attributes));
      assert(Object.keys(o.attributes).every(k => ['class', 'href'].includes(k)));
      assert(Object.values(o.attributes).every(v => typeof v === 'string'));
      assert(typeof o.text === 'string' && o.text.length < 4096);
      const k = o.language + ':' + o.path.join('.');
      assert(!locations.has(k));
      locations.add(k);
    }
  }
  return source;
}
function branch(nodes, index, language) {
  const flag = language === 'en' ? 'isEN' : 'isVN',
    branches = nodes.filter(n => n.tagName === 'sc-if' && attrs(n).value === '{{ ' + flag + ' }}');
  assert(branches[index], 'Exact language branch owner missing');
  let base = branches[index];
  if (language === 'vi') {
    const cs = children(base);
    assert.equal(cs.length, 1);
    base = cs[0];
    assert.equal(base.tagName, 'div');
    assert.deepEqual(attrs(base), {
      lang: 'vi',
      style: 'display:contents'
    });
  }
  return base;
}
export function projectSharedLayout(html, entry, styles) {
  const nodes = walk(parse(html, {
      sourceCodeLocationInfo: true
    })),
    edits = [],
    owners = [];
  for (const o of entry.owners) {
    let n = branch(nodes, entry.branchIndex, o.language);
    for (const index of o.path) {
      n = n.childNodes?.[index];
      assert(n, 'Exact native owner path missing');
    }
    assert.equal(n.tagName, o.tag);
    const current = attrs(n),
      style = current.style;
    delete current.style;
    assert.deepEqual(current, o.attributes, 'Non-style native attributes changed');
    assert.equal(text(n), o.text, 'Owned localized data or binding changed');
    assert(!n.childNodes.some(c => c.tagName), 'Plain native text owner required');
    const span = n.sourceCodeLocation?.attrs?.style;
    assert(span, 'Style source location missing');
    edits.push({
      start: span.startOffset,
      end: span.endOffset,
      value: 'style="' + styleText(o.role, styles[o.role]) + '"'
    });
    owners.push({
      language: o.language,
      role: o.role,
      line: n.sourceCodeLocation.startLine
    });
  }
  let output = html;
  for (const e of edits.sort((a, b) => b.start - a.start)) output = output.slice(0, e.start) + e.value + output.slice(e.end);
  return {
    html: output,
    owners
  };
}

/** A pixel mismatch cannot pass: unstable original controls produce an explicit unverified verdict. */
export function pixelReferenceStatus(baseline, projected, references = []) {
  const pair = p => {
    own(p, ['screen', 'print']);
    for (const value of Object.values(p)) assert(typeof value === 'string' && /^[a-f0-9]{64}$/.test(value));
  };
  pair(baseline);
  pair(projected);
  dense(references);
  assert(references.length <= 3);
  references.forEach(pair);
  const same = (a, b) => a.screen === b.screen && a.print === b.print;
  if (references.some(p => !same(p, baseline))) return 'unverified-reference-unstable';
  assert(same(baseline, projected), 'Stable original reference requires exact projected pixels');
  return 'passed';
}
