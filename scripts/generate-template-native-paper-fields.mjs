import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, lstatSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';
import { resolve, posix } from 'node:path';
import { parse as parseJS } from '@babel/parser';
function safePath(path, allowMissing = false) {
  assert(typeof path === 'string' && /^[A-Za-z0-9_./-]+$/.test(path) && path === posix.normalize(path) && !posix.isAbsolute(path) && !path.split('/').some(part => part === '..' || part === '.'), 'Unsafe native paper path');
  const parts = path.split('/');
  let absolute = process.cwd();
  for (let index = 0; index < parts.length; index++) {
    absolute = resolve(absolute, parts[index]);
    let stat;
    try {
      stat = lstatSync(absolute);
    } catch (error) {
      assert(allowMissing && index === parts.length - 1 && error.code === 'ENOENT', 'Missing native paper path');
      return absolute;
    }
    assert(!stat.isSymbolicLink(), 'Symlink native paper input/output forbidden');
    assert(index === parts.length - 1 ? stat.isFile() : stat.isDirectory(), 'Unexpected native paper path kind');
  }
  return absolute;
}
const read = path => readFileSync(safePath(path), 'utf8'),
  check = process.argv.includes('--check'),
  source = JSON.parse(read('scripts/template-native-paper-fields.json'));
assert(process.argv.slice(2).every(x => x === '--check'));
assert.equal(source.schemaVersion, 1);
assert(Array.isArray(source.templates) && source.templates.length > 0);
assert.equal(new Set(source.templates.map(entry => entry.template)).size, source.templates.length, 'Duplicate native paper template');
assert.equal(new Set(source.templates.map(entry => entry.path)).size, source.templates.length, 'Duplicate native paper path');
const hash = s => createHash('sha256').update(s).digest('hex'),
  attr = (n, k) => n.attrs?.find(a => a.name === k)?.value,
  text = n => n.nodeName === '#text' ? n.value : (n.childNodes || []).map(text).join(''),
  walk = (n, out = []) => {
    out.push(n);
    for (const c of n.childNodes || []) walk(c, out);
    if (n.content) walk(n.content, out);
    return out;
  };
const outputs = new Map(),
  fixturePath = '_audit/ci/fixtures/template-content-bindings.json',
  fixture = JSON.parse(read(fixturePath));
for (const entry of source.templates) {
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.template));
  assert(/^templates\/[a-z0-9-]+\/[A-Za-z][A-Za-z0-9]*\.dc\.html$/.test(entry.path));
  assert(/^[a-f0-9]{64}$/.test(entry.baselineSha256));
  assert(entry.path.startsWith('templates/' + entry.template + '/') && entry.path.endsWith('.dc.html'));
  assert(entry.fields.length && new Set(entry.fields.map(x => x.id)).size === entry.fields.length);
  let html = read(entry.path);
  const nodes = walk(parse(html, {
      sourceCodeLocationInfo: true
    })),
    script = nodes.find(n => n.tagName === 'script' && attr(n, 'data-dc-script') !== undefined);
  assert(script);
  const edits = [];
  for (const field of entry.fields) {
    assert(/^[a-z][A-Za-z0-9]+$/.test(field.id));
    assert(typeof field.default === 'string' && /^\.+$/.test(field.default) && field.default.length <= 256, 'Exact bounded dotted fill default');
    assert(typeof field.anchorLabel === 'string' && field.anchorLabel.trim() && field.anchorLabel.length <= 256, 'Exact authored bilingual label required');
    assert(typeof field.rowLabel === 'string' && field.rowLabel.trim(), 'Display label required');
    assert.equal(field.maxLength, 256);
    assert(!['constructor', 'prototype', '__proto__'].includes(field.id));
    const rows = nodes.filter(n => {
      if (n.tagName !== 'tr') return false;
      const cells = (n.childNodes || []).filter(c => c.tagName === 'td');
      return cells.length === 2 && text(cells[0]).replace(/\s+/gu, ' ').trim() === field.anchorLabel && walk(cells[1]).some(c => c.tagName === 'span' && attr(c, 'style') === 'background:var(--cs-doc-fill);padding:0 3px');
    });
    assert.equal(rows.length, 1, 'Unique authored bilingual row: ' + entry.template + '/' + field.id);
    const cells = rows[0].childNodes.filter(n => n.tagName === 'td');
    assert.equal(cells.length, 2);
    assert(text(cells[0]).replace(/\s+/gu, ' ').trim() === field.anchorLabel);
    const spans = walk(cells[1]).filter(n => n.tagName === 'span' && attr(n, 'style') === 'background:var(--cs-doc-fill);padding:0 3px');
    assert.equal(spans.length, 1, 'Exact single fill-only target');
    const target = spans[0];
    assert.equal(target.childNodes.length, 1);
    const node = target.childNodes[0];
    assert.equal(node.nodeName, '#text');
    assert([field.default, '{{ ' + field.id + ' }}'].includes(node.value), 'Owned fill value drift');
    edits.push({
      start: node.sourceCodeLocation.startOffset,
      end: node.sourceCodeLocation.endOffset,
      value: '{{ ' + field.id + ' }}'
    });
  }
  const jsNode = script.childNodes[0],
    js = jsNode.value,
    ast = parseJS(js),
    cls = ast.program.body.find(n => n.type === 'ClassDeclaration' && n.id.name === 'Component');
  assert(cls);
  const method = cls.body.body.find(n => n.key.name === 'renderVals');
  assert(method);
  const returns = method.body.body.filter(n => n.type === 'ReturnStatement');
  assert.equal(returns.length, 1);
  const object = returns[0].argument;
  assert.equal(object.type, 'ObjectExpression');
  const start = '/* @generated native-paper-content:defaults */',
    end = '/* @endgenerated native-paper-content:defaults */';
  const fields = entry.fields.map(f => JSON.stringify(f.id) + ':' + JSON.stringify(f.default)).join(',') + ',';
  let expected = js;
  if (js.includes(start)) {
    assert.equal(js.split(start).length, 2);
    assert.equal(js.split(end).length, 2);
    const a = js.indexOf(start),
      b = js.indexOf(end) + end.length;
    expected = js.slice(0, a) + start + fields + end + js.slice(b);
  } else {
    assert(!entry.fields.some(f => object.properties.some(p => p.key?.name === f.id || p.key?.value === f.id)), 'Cannot overwrite authored values');
    expected = js.slice(0, object.start + 1) + start + fields + end + js.slice(object.start + 1);
  }
  edits.push({
    start: jsNode.sourceCodeLocation.startOffset,
    end: jsNode.sourceCodeLocation.endOffset,
    value: expected
  });
  for (const edit of edits.sort((a, b) => b.start - a.start)) html = html.slice(0, edit.start) + edit.value + html.slice(edit.end);
  const restored = html.replace(/\{\{ ([A-Za-z][A-Za-z0-9]*) \}\}/g, (m, id) => entry.fields.some(f => f.id === id) ? entry.fields.find(f => f.id === id).default : m).replace(/\/\* @generated native-paper-content:defaults \*\/[\s\S]*?\/\* @endgenerated native-paper-content:defaults \*\//, '').replace(' data-content-schema="./content-schema.json"', '');
  assert.equal(hash(restored), entry.baselineSha256, 'Full original document restoration must match: no unrelated legal/markup/default changes');
  if (attr(script, 'data-content-schema') === undefined) html = html.replace(/(<script\b[^>]*data-dc-script[^>]*)(>)/, (m, a, b) => a + ' data-content-schema="./content-schema.json"' + b);else assert.equal(attr(script, 'data-content-schema'), './content-schema.json');
  const schemaPath = 'templates/' + entry.template + '/content-schema.json',
    schema = {
      $schemaVersion: '2.0',
      template: entry.template,
      slots: entry.fields.map(f => ({
        id: f.id,
        type: 'text',
        label: f.rowLabel,
        maxLength: f.maxLength,
        required: true,
        runtimeBinding: 'text'
      }))
    };
  outputs.set(entry.path, html);
  outputs.set(schemaPath, JSON.stringify(schema, null, 2) + '\n');
  const prior = fixture.templates.find(t => t.template === entry.template);
  const projected = {
    template: entry.template,
    path: schemaPath,
    slots: schema.slots.map(s => ({
      id: s.id,
      declaredType: s.type,
      projection: s.runtimeBinding
    }))
  };
  if (prior) Object.assign(prior, projected);else fixture.templates.push(projected);
}
fixture.templates.sort((a, b) => a.template.localeCompare(b.template));
const slots = fixture.templates.flatMap(t => t.slots);
fixture.scope = `Explicit adoption of all ${slots.length} declared source slots: ${slots.filter(s => s.projection === 'text').length} scalar plain-text bindings, ${slots.filter(s => s.projection === 'number').length} finite numeric percent bindings and ${slots.filter(s => s.projection === 'structured').length} bounded structured display models. Exact target/model metadata preserve authored controls, functions and offline runtime copies.`;
outputs.set(fixturePath, JSON.stringify(fixture, null, 2) + '\n');
for (const path of outputs.keys()) safePath(path, true);
for (const [path, value] of outputs) {
  if (check) assert(existsSync(path) && read(path) === value, 'Stale native paper fields: ' + path);else writeFileSync(path, value);
}
console.log('PASS native paper field ' + (check ? 'freshness' : 'generation') + ':' + source.templates.flatMap(entry => entry.fields).length + ' exact fill-only fields in' + source.templates.length + ' bilingual papers; full baseline restoration.');
