import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, lstatSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { parse, parseFragment } from 'parse5';
import { parse as parseJavaScript } from '@babel/parser';

const digest = value => createHash('sha256').update(value).digest('hex');
const attribute = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const begin = '/* @generated display-content:defaults */';
const end = '/* @endgenerated display-content:defaults */';
const literalEmpty = '__csDisplayLiteralEmpty';
const inlineLiteral = value => JSON.stringify(value).replace(/\//g, '\\u002f').replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
function existingStat(path) {
  try { return lstatSync(path); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}
function nodes(node, result = []) {
  result.push(node);
  for (const child of node.childNodes || []) nodes(child, result);
  if (node.content) nodes(node.content, result);
  return result;
}
function targetNode(document, path) {
  assert(Array.isArray(path) && path.length && path.every(part => part === 'content' || Number.isSafeInteger(part) && part >= 0), 'Invalid display target path');
  let node = document;
  for (const part of path) {
    node = part === 'content' ? node.content : node.childNodes?.[part];
    assert(node, 'Missing authored display target');
  }
  assert.equal(node.nodeName, '#text', 'Display targets must be text nodes');
  for (let parent = node.parentNode; parent; parent = parent.parentNode) {
    assert(!['script', 'style', 'title', 'textarea', 'option'].includes(parent.tagName), 'Display target is not body prose');
  }
  return node;
}
function textLiteral(raw) {
  assert(typeof raw === 'string' && !raw.includes('{{'), 'Invalid literal display context');
  const fragment = parseFragment(raw);
  assert(fragment.childNodes.every(node => node.nodeName === '#text'), 'Display context must remain literal text');
  return fragment.childNodes.map(node => node.value).join('');
}
function edit(text, edits) {
  const ordered = [...edits].sort((a, b) => b.start - a.start);
  for (let index = 1; index < ordered.length; index++) assert(ordered[index].end <= ordered[index - 1].start, 'Overlapping display targets');
  for (const item of ordered) text = text.slice(0, item.start) + item.value + text.slice(item.end);
  return text;
}

/** Exact observed display data only: no arithmetic, legal interpretation or URLs. */
export function projectTemplateDisplayFields(root, { check = false } = {}) {
  root = resolve(root);
  const read = path => {
    assert(typeof path === 'string' && /^[A-Za-z0-9_.\/-]+$/.test(path) && !path.split('/').some(part => !part || part === '.' || part === '..'), 'Unsafe display source path');
    let current = root;
    for (const part of path.split('/')) {
      current = join(current, part);
      assert(!lstatSync(current).isSymbolicLink(), 'Display source symlink');
    }
    assert(lstatSync(current).isFile());
    return readFileSync(current, 'utf8');
  };
  const source = JSON.parse(read('scripts/template-display-fields.json'));
  assert.equal(source.schemaVersion, 1);
  assert(source.templates.length && new Set(source.templates.map(item => item.template)).size === source.templates.length, 'Duplicate display template');
  const fixturePath = '_audit/ci/fixtures/template-content-bindings.json';
  const fixture = JSON.parse(read(fixturePath));
  const outputs = new Map();
  for (const entry of source.templates) {
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.template));
    assert(new RegExp('^templates/' + entry.template + '/[A-Za-z][A-Za-z0-9]*\\.dc\\.html$').test(entry.path));
    assert(/^[a-f0-9]{64}$/.test(entry.baselineSha256));
    assert(entry.fields.length && new Set(entry.fields.map(field => field.id)).size === entry.fields.length, 'Duplicate display field');
    const html = read(entry.path), document = parse(html, { sourceCodeLocationInfo: true });
    const scripts = nodes(document).filter(node => node.tagName === 'script' && attribute(node, 'data-dc-script') !== undefined);
    assert.equal(scripts.length, 1, 'One owned template script required');
    const script = scripts[0], jsNode = script.childNodes[0], js = jsNode.value;
    const ast = parseJavaScript(js);
    const component = ast.program.body.find(node => node.type === 'ClassDeclaration' && node.id.name === 'Component');
    const method = component?.body.body.find(node => node.key.name === 'renderVals');
    const returns = method?.body.body.filter(node => node.type === 'ReturnStatement');
    assert.equal(returns?.length, 1, 'One direct renderVals return required');
    const object = returns[0].argument;
    assert.equal(object.type, 'ObjectExpression');
    const projected = [], restored = [], targets = new Set();
    let needsLiteralEmpty = false;
    for (const field of entry.fields) {
      assert(/^[a-z][A-Za-z0-9]+$/.test(field.id) && !['constructor', 'prototype', '__proto__'].includes(field.id));
      assert(typeof field.label === 'string' && field.label.trim());
      const numeric = field.type === 'number';
      if (numeric) {
        assert(Number.isFinite(field.default) && field.default >= 0 && field.default <= 100, 'Invalid percent default');
        assert.equal(field.minimum, 0); assert.equal(field.maximum, 100); assert.equal(field.runtimeProjection, 'percent-width');
        assert(field.targets.some(target => target.kind === 'percent-width') && field.targets.some(target => target.kind === undefined), 'Percent needs observed text and width destinations');
      } else {
        assert(field.type === undefined || field.type === 'text', 'Unsupported scalar display type');
        assert(typeof field.default === 'string' && field.default.trim() && !field.default.includes('{{'));
        assert(Number.isSafeInteger(field.maxLength) && field.maxLength >= field.default.length && field.maxLength <= 4096);
      }
      assert(field.targets.length, 'A display field needs observed destinations');
      for (const target of field.targets) {
        const key = JSON.stringify(target.path);
        assert(!targets.has(key), 'Duplicate display target'); targets.add(key);
        if (target.kind !== undefined) {
          assert(numeric && target.kind === 'percent-width', 'Unknown display projection target');
          assert(Array.isArray(target.path) && target.path.length && target.path.every(part => Number.isSafeInteger(part) && part >= 0), 'Invalid percent target path');
          const node = target.path.reduce((node, part) => node.childNodes?.[part], document);
          assert(node?.tagName === 'span' && node.childNodes.length === 0 && node.parentNode?.tagName === 'div', 'Percent target must be an empty native bar span');
          assert(node.attrs.every(attr => ['style', 'data-dc-percent-width'].includes(attr.name)), 'Percent target cannot own other attributes or handlers');
          const style = attribute(node, 'style') || '';
          assert(style.split(';').some(value => value.trim() === 'width:' + field.default + '%') && /(?:^|;)display:block(?:;|$)/.test(style) && /(?:^|;)height:100%(?:;|$)/.test(style), 'Percent target lacks its authored bar geometry');
          assert(/(?:^|;)overflow:hidden(?:;|$)/.test(attribute(node.parentNode, 'style') || ''), 'Percent target needs its authored clipping track');
          assert(typeof target.rawDefault === 'string' && target.rawDefault.startsWith('<span ') && target.rawDefault.endsWith('>') && !target.rawDefault.includes('data-dc-percent-width'), 'Invalid original percent target');
          const location = node.sourceCodeLocation.startTag, raw = html.slice(location.startOffset, location.endOffset);
          const value = target.rawDefault.slice(0, -1) + ' data-dc-percent-width="{{ ' + field.id + ' }}">';
          assert(raw === target.rawDefault || raw === value, 'Percent source geometry changed');
          projected.push({ start: location.startOffset, end: location.endOffset, value });
          restored.push({ start: location.startOffset, end: location.endOffset, value: target.rawDefault });
          continue;
        }
        const node = targetNode(document, target.path), location = node.sourceCodeLocation;
        const prefix = target.prefix ?? '', suffix = target.suffix ?? '';
        const decodedPrefix = textLiteral(prefix), decodedSuffix = textLiteral(suffix);
        // A second owned empty binding avoids the legacy DSL's trim-on-whole-
        // binding rule without changing existing runtime interpolation semantics.
        const literal = (prefix || suffix) && !(decodedPrefix + decodedSuffix).trim();
        needsLiteralEmpty ||= !!literal;
        const sentinel = literal ? '{{ ' + literalEmpty + ' }}' : '';
        const placeholder = prefix + '{{ ' + field.id + ' }}' + sentinel + suffix;
        assert([decodedPrefix + field.default + decodedSuffix, decodedPrefix + '{{ ' + field.id + ' }}' + sentinel + decodedSuffix].includes(node.value), 'Authored display value changed');
        assert(typeof target.rawDefault === 'string');
        const raw = html.slice(location.startOffset, location.endOffset);
        assert.equal(textLiteral(target.rawDefault), decodedPrefix + field.default + decodedSuffix, 'Display context does not match the observed original text');
        assert(target.rawDefault.startsWith(prefix) && target.rawDefault.endsWith(suffix), 'Raw display context changed');
        assert(raw === target.rawDefault || raw === placeholder, 'Raw display source changed');
        projected.push({ start: location.startOffset, end: location.endOffset, value: placeholder });
        restored.push({ start: location.startOffset, end: location.endOffset, value: target.rawDefault });
      }
    }
    const fenceStart = js.indexOf(begin), fenceEnd = js.indexOf(end);
    for (const field of [...entry.fields, ...(needsLiteralEmpty ? [{ id: literalEmpty }] : [])]) assert(!object.properties.some(prop =>
      (prop.key?.name ?? prop.key?.value) === field.id && !(fenceStart >= 0 && prop.start > fenceStart && prop.end <= fenceEnd)
    ), 'Display field overwrites authored computation');
    const defaults = [...entry.fields.map(field => inlineLiteral(field.id) + ':' + inlineLiteral(field.default)), ...(needsLiteralEmpty ? [inlineLiteral(literalEmpty) + ':""'] : [])].join(',') + ',';
    let nextJavaScript;
    if (js.includes(begin)) {
      assert.equal(js.split(begin).length, 2); assert.equal(js.split(end).length, 2);
      const a = js.indexOf(begin), b = js.indexOf(end) + end.length;
      nextJavaScript = js.slice(0, a) + begin + defaults + end + js.slice(b);
      restored.push({ start: jsNode.sourceCodeLocation.startOffset, end: jsNode.sourceCodeLocation.endOffset, value: js.slice(0, a) + js.slice(b) });
    } else {
      assert(!entry.fields.some(field => object.properties.some(prop => (prop.key?.name ?? prop.key?.value) === field.id)), 'Display field overwrites authored computation');
      nextJavaScript = js.slice(0, object.start + 1) + begin + defaults + end + js.slice(object.start + 1);
    }
    const restoredHtml = edit(html, restored).replace(' data-content-schema="./content-schema.json"', '');
    assert.equal(digest(restoredHtml), entry.baselineSha256, 'Whole original template restoration failed');
    projected.push({ start: jsNode.sourceCodeLocation.startOffset, end: jsNode.sourceCodeLocation.endOffset, value: nextJavaScript });
    let nextHtml = edit(html, projected);
    const currentSchema = attribute(script, 'data-content-schema');
    if (currentSchema === undefined) nextHtml = nextHtml.replace(/(<script\b[^>]*data-dc-script[^>]*)(>)/, '$1 data-content-schema="./content-schema.json"$2');
    else assert.equal(currentSchema, './content-schema.json');
    const schemaPath = 'templates/' + entry.template + '/content-schema.json';
    let preserved = { $schemaVersion: '2.0', template: entry.template, slots: [] };
    if (entry.preservedSchema !== undefined) {
      assert.equal(typeof entry.preservedSchema.source, 'string', 'Preserved schema requires exact source');
      assert.equal(digest(entry.preservedSchema.source), entry.preservedSchema.sha256, 'Preserved schema source identity changed');
      preserved = JSON.parse(entry.preservedSchema.source);
      assert.equal(preserved.$schemaVersion, '2.0'); assert.equal(preserved.template, entry.template);
      assert(Array.isArray(preserved.slots) && preserved.slots.length, 'Preserved schema needs existing slots');
      assert(new Set(preserved.slots.map(slot => slot.id)).size === preserved.slots.length, 'Duplicate preserved slot');
      for (const slot of preserved.slots) {
        assert(/^[a-z][A-Za-z0-9]+$/.test(slot.id) && !['constructor', 'prototype', '__proto__'].includes(slot.id), 'Invalid preserved slot');
        assert.equal(slot.type, 'text'); assert.equal(slot.runtimeBinding, 'text');
        assert(!entry.fields.some(field => field.id === slot.id), 'Display field replaces an existing slot');
        assert(object.properties.some(prop => (prop.key?.name ?? prop.key?.value) === slot.id), 'Preserved slot lacks its authored render value');
      }
    }
    const schema = { ...preserved, slots: [...preserved.slots, ...entry.fields.map(field => field.type === 'number' ? {
      id: field.id, type: 'number', label: field.label, required: true, minimum: 0, maximum: 100,
      runtimeBinding: 'number', runtimeProjection: 'percent-width',
      runtimeTargets: field.targets.filter(target => target.kind === 'percent-width').map(() => ({ tag: 'span', attribute: 'data-dc-percent-width' }))
    } : ({ id: field.id, type: 'text', label: field.label, maxLength: field.maxLength, required: true, runtimeBinding: 'text' }))] };
    if (entry.preservedSchema !== undefined) {
      const current = read(schemaPath);
      assert(current === entry.preservedSchema.source || current === JSON.stringify(schema, null, 2) + '\n', 'Existing schema source changed');
    }
    outputs.set(entry.path, nextHtml); outputs.set(schemaPath, JSON.stringify(schema, null, 2) + '\n');
    const record = { template: entry.template, path: schemaPath, slots: schema.slots.map(slot => ({ id: slot.id, declaredType: slot.type, projection: slot.runtimeBinding, ...(slot.runtimeTargets ? { runtimeTargets: slot.runtimeTargets } : {}) })) };
    const prior = fixture.templates.find(item => item.template === entry.template);
    if (prior) Object.assign(prior, record); else fixture.templates.push(record);
  }
  fixture.templates.sort((a, b) => a.template < b.template ? -1 : a.template > b.template ? 1 : 0);
  const slots = fixture.templates.flatMap(item => item.slots);
  fixture.scope = `Explicit adoption of all ${slots.length} declared source slots: ${slots.filter(slot => slot.projection === 'text').length} scalar plain-text bindings, ${slots.filter(slot => slot.projection === 'number').length} finite numeric percent bindings and ${slots.filter(slot => slot.projection === 'structured').length} bounded structured display models. Exact target/model metadata preserve authored controls, functions and offline runtime copies.`;
  outputs.set(fixturePath, JSON.stringify(fixture, null, 2) + '\n');
  for (const path of outputs.keys()) {
    const parts = path.split('/'); let current = root;
    for (const part of parts.slice(0, -1)) { current = join(current, part); assert(lstatSync(current).isDirectory() && !lstatSync(current).isSymbolicLink(), 'Unsafe display output parent'); }
    const stat = existingStat(join(root, path));
    if (stat) assert(stat.isFile() && !stat.isSymbolicLink(), 'Unsafe display output');
  }
  // All source, target, restoration and destination checks precede any write.
  for (const [path, value] of outputs) {
    if (check) assert.equal(read(path), value, 'Stale display field output: ' + path);
    else writeFileSync(join(root, path), value);
  }
  return { templates: source.templates.length, fields: source.templates.reduce((sum, entry) => sum + entry.fields.length, 0), outputs: [...outputs.keys()] };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert(process.argv.slice(2).every(value => value === '--check'));
  console.log('PASS observed template display fields ' + JSON.stringify(projectTemplateDisplayFields(fileURLToPath(new URL('../', import.meta.url)), { check: process.argv.includes('--check') })));
}
