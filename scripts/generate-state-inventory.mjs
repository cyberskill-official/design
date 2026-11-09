// Conservative source census. Observations locate implicit machines; they do
// not infer reachability, resolve data flow, or certify runtime behavior.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import { parse as parseHTML } from 'parse5';
import postcss from 'postcss';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const hash = text => createHash('sha256').update(text).digest('hex');
const hookNames = new Set(['useState', 'useReducer', 'useRef', 'useEffect', 'useLayoutEffect', 'useClientLayoutEffect', 'useSyncExternalStore']);
const lifecycleCalls = new Set(['addEventListener', 'removeEventListener', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame', 'cancelAnimationFrame', 'observe', 'disconnect', 'subscribe', 'unsubscribe', 'matchMedia', 'focus', 'blur', 'setAttribute', 'removeAttribute', 'toggleAttribute', 'setItem', 'removeItem', 'pushState', 'replaceState', 'dispatchEvent']);
const stateAttributes = /^(?:aria-(?:expanded|selected|checked|pressed|busy|current|disabled|hidden|activedescendant)|data-(?:state|open|step|theme|cs-element|cs-style)|disabled|checked|selected|inert|hidden|open|value|defaultValue|defaultChecked)$/;
function walk(node, visit, ancestors = []) {
  if (!node || typeof node !== 'object') return;
  if (node.type) visit(node, ancestors);
  for (const [key, value] of Object.entries(node)) {
    if (['loc', 'tokens', 'comments', 'parent'].includes(key)) continue;
    if (Array.isArray(value)) for (const child of value) walk(child, visit, [...ancestors, node]);
    else if (value && typeof value === 'object') walk(value, visit, [...ancestors, node]);
  }
}
function ownerOf(ancestors) {
  return ancestors.filter(node => /Function(?:Declaration|Expression)$|ArrowFunctionExpression|ClassMethod|ObjectMethod/.test(node.type)).map(node => {
    const parent = ancestors[ancestors.indexOf(node) - 1];
    return node.id?.name || node.key?.name || (parent?.type === 'VariableDeclarator' ? parent.id.name : null) || '<callback>';
  }).join(' / ') || '<module>';
}
export function scanJavaScript(source, lineOffset = 0) {
  const ast = parse(source, { sourceType: 'unambiguous', plugins: ['jsx'], allowReturnOutsideFunction: true });
  const observations = [];
  const emit = (kind, node, ancestors, detail) => observations.push({ kind, line: node.loc.start.line + lineOffset, owner: ownerOf(ancestors), ...detail });
  const text = node => source.slice(node.start, node.end);
  walk(ast, (node, ancestors) => {
    if (['CallExpression', 'OptionalCallExpression', 'NewExpression'].includes(node.type)) {
      const name = node.callee.name || node.callee.property?.name;
      const expression = text(node);
      if (hookNames.has(name)) {
        const declaration = ancestors.at(-1);
        emit('hook', node, ancestors, { name, binding: declaration?.type === 'VariableDeclarator' ? text(declaration.id) : null, expression });
      } else if (lifecycleCalls.has(name) || /Observer$/.test(name || '') || (node.callee.object?.property?.name === 'classList' && ['add', 'remove', 'toggle', 'replace'].includes(name))) {
        emit('lifecycle-or-dom-call', node, ancestors, { name, expression });
      } else if (/^set[A-Z]|^dispatch$/.test(name || '') || ['push', 'pop', 'shift', 'unshift', 'splice', 'set', 'add', 'delete', 'clear'].includes(name)) {
        emit('possible-transition-call', node, ancestors, { name, expression });
      }
    }
    if (['AssignmentExpression', 'UpdateExpression'].includes(node.type)) emit('mutation', node, ancestors, { expression: text(node) });
    if (node.type === 'VariableDeclaration' && node.kind === 'let') for (const declaration of node.declarations) emit('mutable-binding', declaration, ancestors, { expression: text(declaration) });
    if (node.type === 'JSXAttribute') {
      const name = node.name.name;
      if (/^on[A-Z]/.test(name)) emit('event-binding', node, ancestors, { name, expression: text(node) });
      else if (stateAttributes.test(name)) emit('state-output', node, ancestors, { name, expression: text(node) });
    }
    if (['ObjectProperty', 'ObjectMethod'].includes(node.type)) {
      const name = node.key.name || node.key.value || '';
      if (/^on[A-Z]/.test(name)) emit('event-binding', node, ancestors, { name, expression: text(node) });
      else if (stateAttributes.test(name)) emit('state-output', node, ancestors, { name, expression: text(node) });
    }
    if (node.type === 'AwaitExpression') emit('async-boundary', node, ancestors, { expression: text(node) });
  });
  return observations;
}
export function scanHTML(source) {
  const document = parseHTML(source, { sourceCodeLocationInfo: true });
  const observations = [];
  const walkHTML = node => {
    const loc = node.sourceCodeLocation;
    if (node.tagName === 'script' && !node.attrs.some(attr => attr.name === 'src')) {
      const type = node.attrs.find(attr => attr.name === 'type')?.value || '';
      const code = node.childNodes.map(child => child.value || '').join('');
      const isDC = node.attrs.some(attr => attr.name === 'data-props');
      if (isDC || ['', 'module', 'text/javascript', 'application/javascript', 'text/babel'].includes(type)) {
        if (code.trim()) observations.push(...scanJavaScript(code, loc.startTag.endLine - 1));
      }
      if (isDC) observations.push({ kind: 'template-props', line: loc.startLine, owner: '<template>', expression: node.attrs.find(attr => attr.name === 'data-props').value });
    }
    if (node.tagName === 'style') {
      const css = node.childNodes.map(child => child.value || '').join('');
      observations.push(...scanCSS(css).map(row => ({ ...row, line: row.line + loc.startTag.endLine - 1 })));
    }
    for (const attr of node.attrs || []) {
      if (/^on[a-z]|^data-cs-on-/.test(attr.name) || stateAttributes.test(attr.name) || attr.name === 'sc-if') {
        observations.push({ kind: /^(?:on|data-cs-on-)/.test(attr.name) ? 'event-binding' : 'state-output', line: loc?.attrs?.[attr.name]?.startLine || loc?.startLine || 1, owner: '<markup>', name: attr.name, expression: attr.value });
      }
    }
    for (const child of node.childNodes || []) walkHTML(child);
    if (node.content) walkHTML(node.content);
  };
  walkHTML(document);
  return observations;
}
export function scanCSS(source) {
  const observations = [];
  postcss.parse(source).walkRules(rule => {
    if (/:(?:hover|focus|active|checked|disabled|valid|invalid|open)|\[(?:aria-|data-|disabled|checked|open)|\.(?:is-|has-)/.test(rule.selector)) observations.push({ kind: 'css-state-selector', line: rule.source.start.line, owner: '<css>', expression: rule.selector });
  });
  return observations;
}
function filesUnder(directory) {
  return readdirSync(new URL(directory + '/', root), { withFileTypes: true }).flatMap(entry => {
    const path = directory + '/' + entry.name;
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}
export function buildInventory() {
  const paths = new Set([
    ...['components', 'ui_kits', 'guidelines', 'stories', '.storybook'].flatMap(filesUnder).filter(path => /\.(?:jsx?|mjs|cjs|html)$/.test(path)),
    ...filesUnder('templates').filter(path => path.endsWith('.dc.html')),
    ...filesUnder('scripts/template-runtime').filter(path => /\.(?:js|mjs)$/.test(path)),
    ...filesUnder('docs').filter(path => /\.(?:js|html)$/.test(path)),
    ...['base', 'tokens'].flatMap(filesUnder).filter(path => path.endsWith('.css')),
    'templates/_vendor/doc-export.js', 'index.html', 'dashboard.html', 'thumbnail.html', '_esm/cs.mjs', 'styles/components/compose.mjs',
  ]);
  // Resolve generated runtime surfaces to their authored primitives instead of
  // counting 85 byte-identical copies as independent state machines.
  const sources = [...paths].sort().map(path => {
    const source = read(path);
    let observations;
    try { observations = path.endsWith('.html') ? scanHTML(source) : path.endsWith('.css') ? scanCSS(source) : scanJavaScript(source); }
    catch (error) { throw Error(`${path}: ${error.message}`, { cause: error }); }
    observations.sort((a, b) => a.line - b.line || a.kind.localeCompare(b.kind, 'en'));
    return { path, sha256: hash(source), observations };
  });
  const counts = {};
  for (const source of sources) for (const observation of source.observations) counts[observation.kind] = (counts[observation.kind] || 0) + 1;
  return {
    schemaVersion: 1,
    generator: { path: 'scripts/generate-state-inventory.mjs', sha256: hash(read('scripts/generate-state-inventory.mjs')) },
    interpretation: 'Conservative source observations, NOT a complete semantic state-machine model or a runtime acceptance receipt. Hooks, mutations, setters, handlers, outputs and lifecycle calls can overlap or be stateless. No call graph or data-flow resolution is claimed. All parse failures are fatal.',
    scope: { included: ['components', 'ui_kits', 'guidelines', 'stories', '.storybook', 'templates/**/*.dc.html', 'scripts/template-runtime', 'templates/_vendor/doc-export.js', 'docs browser scripts/HTML', 'base CSS', 'tokens CSS', 'root HTML, legacy loader and style composer'], excluded: ['generated bundles/compiled ESM', 'per-template runtime copies (authored primitives scanned)', 'third-party/vendor code', 'build/CI scripts and audit tools', 'native example apps', 'external consumer application state'], limitations: ['Dynamic/aliased hook and setter calls, runtime-generated code, CSS animation keyframes, browser-native transitions and external stores may require additional manual analysis.', 'HTML event attributes and template props are source text, not executed or assumed to be writable.', 'CSS selectors indicate visual state surfaces, not necessarily independent machines.'] },
    summary: { scannedSources: sources.length, sourcesWithObservations: sources.filter(source => source.observations.length).length, observationsByKind: counts },
    sources,
  };
}
export function renderIndex(inventory) {
  const lines = ['# Danh mục trạng thái / State inventory', '', 'Generated by `node scripts/generate-state-inventory.mjs`; verify with `--check`.', '', 'Dữ kiện nguồn, không phải chứng nhận hành vi. / Source observations, not behavior certification.', '', '[Reviewed models and decisions](state-machine-review.md) · [Machine-readable evidence](state-machines.json)', '', `Scanned **${inventory.summary.scannedSources}** sources; **${inventory.summary.sourcesWithObservations}** contain candidate state observations. Every scanned source, including zero-observation files, is hashed in JSON.`, '', 'No semantic completeness is claimed. See JSON `scope` for exclusions and limitations.', '', '| Nguồn / Source | Hooks | Mutations + possible setters | Event bindings | Async + lifecycle | State outputs + CSS |', '|---|---:|---:|---:|---:|---:|'];
  for (const source of inventory.sources.filter(source => source.observations.length)) {
    const count = kinds => source.observations.filter(observation => kinds.includes(observation.kind)).length;
    lines.push(`| [${source.path}](../${source.path}) | ${count(['hook'])} | ${count(['mutation', 'mutable-binding', 'possible-transition-call'])} | ${count(['event-binding'])} | ${count(['async-boundary', 'lifecycle-or-dom-call'])} | ${count(['state-output', 'css-state-selector', 'template-props'])} |`);
  }
  return lines.join('\n') + '\n';
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.slice(2).some(arg => arg !== '--check')) throw Error('Usage: generate-state-inventory.mjs [--check]');
  const inventory = buildInventory();
  for (const [path, output] of [['_audit/state-machines.json', JSON.stringify(inventory, null, 2) + '\n'], ['_audit/state-machines.md', renderIndex(inventory)]]) {
    if (process.argv.includes('--check')) { if (read(path) !== output) throw Error(`Stale ${path}; run node scripts/generate-state-inventory.mjs`); }
    else writeFileSync(new URL(path, root), output);
  }
  console.log(`PASS state census: ${inventory.summary.scannedSources} sources, ${inventory.summary.sourcesWithObservations} with observations; semantic completeness remains unverified`);
}
