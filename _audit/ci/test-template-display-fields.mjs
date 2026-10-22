import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';
import { parse as parseJavaScript } from '@babel/parser';
import { projectTemplateDisplayFields } from '../../scripts/generate-template-display-fields.mjs';

const source = JSON.parse(readFileSync('scripts/template-display-fields.json', 'utf8'));
const sha = value => createHash('sha256').update(value).digest('hex');
function allNodes(node, result = []) {
  result.push(node);
  for (const child of node.childNodes || []) allNodes(child, result);
  if (node.content) allNodes(node.content, result);
  return result;
}
function restore(html, entry) {
  const doc = parse(html, { sourceCodeLocationInfo: true }), edits = [];
  for (const field of entry.fields) for (const target of field.targets) {
    const node = target.path.reduce((node, part) => part === 'content' ? node.content : node.childNodes[part], doc);
    const location = target.kind === 'percent-width' ? node.sourceCodeLocation.startTag : node.sourceCodeLocation;
    edits.push({ start: location.startOffset, end: location.endOffset, value: target.rawDefault });
  }
  for (const edit of edits.sort((a, b) => b.start - a.start)) html = html.slice(0, edit.start) + edit.value + html.slice(edit.end);
  return html.replace(/\/\* @generated display-content:defaults \*\/[\s\S]*?\/\* @endgenerated display-content:defaults \*\//, '').replace(' data-content-schema="./content-schema.json"', '');
}
function fixture(entries = source.templates.slice(0, 2)) {
  const root = mkdtempSync(join(tmpdir(), 'cs-display-fields-negative-'));
  for (const path of ['scripts', '_audit/ci/fixtures']) mkdirSync(join(root, path), { recursive: true });
  const model = { ...source, templates: structuredClone(entries) };
  for (const entry of entries) {
    mkdirSync(join(root, 'templates', entry.template), { recursive: true });
    const original = restore(readFileSync(entry.path, 'utf8'), entry);
    assert.equal(sha(original), entry.baselineSha256);
    writeFileSync(join(root, entry.path), original);
    if (entry.preservedSchema) writeFileSync(join(root, 'templates', entry.template, 'content-schema.json'), entry.preservedSchema.source);
  }
  writeFileSync(join(root, 'scripts/template-display-fields.json'), JSON.stringify(model));
  writeFileSync(join(root, '_audit/ci/fixtures/template-content-bindings.json'), readFileSync('_audit/ci/fixtures/template-content-bindings.json'));
  return { root, model, save() { writeFileSync(join(root, 'scripts/template-display-fields.json'), JSON.stringify(model)); } };
}
const negatives = [];
function rejects(name, mutate, entries) {
  const test = fixture(entries);
  try {
    const paths = [...test.model.templates.map(entry => entry.path), '_audit/ci/fixtures/template-content-bindings.json'];
    const before = Object.fromEntries(paths.map(path => [path, sha(readFileSync(join(test.root, path)))]));
    mutate(test); test.save();
    assert.throws(() => projectTemplateDisplayFields(test.root), undefined, name);
    for (const path of paths) assert.equal(sha(readFileSync(join(test.root, path))), before[path], name + ': rejection must not partially write earlier outputs');
    negatives.push(name);
  } finally { rmSync(test.root, { recursive: true, force: true }); }
}
rejects('unknown target path', test => { test.model.templates.at(-1).fields[0].targets[0].path = [999]; });
rejects('non-text target', test => { test.model.templates.at(-1).fields[0].targets[0].path.pop(); });
rejects('duplicate target', test => { const field = test.model.templates.at(-1).fields[0]; field.targets.push(structuredClone(field.targets[0])); });
rejects('duplicate field', test => { const entry = test.model.templates.at(-1); entry.fields.push(structuredClone(entry.fields[0])); });
rejects('prototype field', test => { test.model.templates.at(-1).fields[0].id = '__proto__'; });
rejects('changed raw source', test => { test.model.templates.at(-1).fields[0].targets[0].rawDefault = 'different'; });
rejects('unrelated source drift', test => { test.model.templates.at(-1).baselineSha256 = '0'.repeat(64); });
rejects('traversal output', test => { test.model.templates.at(-1).path = 'templates/../outside.dc.html'; });
rejects('invalid maxLength', test => { test.model.templates.at(-1).fields[0].maxLength = 4097; });
rejects('dangling output symlink', test => {
  const target = join(test.root, 'outside.json'), entry = test.model.templates.at(-1);
  symlinkSync(target, join(test.root, 'templates', entry.template, 'content-schema.json'));
  try { projectTemplateDisplayFields(test.root); assert.fail('Dangling symlink accepted'); } catch (error) { assert.match(String(error), /Unsafe display output/); }
  assert(!existsSync(target), 'Outside dangling target must not be created');
});
const contextual = source.templates.find(entry => entry.fields.some(field => field.targets.some(target => target.prefix || target.suffix)));
const preserved = source.templates.find(entry => entry.preservedSchema);
assert(contextual && preserved, 'Real inline-context and pre-existing-schema fixtures required');
const contextTarget = test => test.model.templates[0].fields.flatMap(field => field.targets).find(target => target.prefix || target.suffix);
rejects('inline prefix drift', test => { contextTarget(test).prefix = 'changed '; }, [contextual]);
rejects('inline context HTML injection', test => { contextTarget(test).suffix = '<img src=x>'; }, [contextual]);
rejects('inline context binding injection', test => { contextTarget(test).suffix = '{{ unknown }}'; }, [contextual]);
rejects('preserved schema identity drift', test => { test.model.templates[0].preservedSchema.source += ' '; }, [preserved]);
rejects('preserved source schema mutation', test => { writeFileSync(join(test.root, 'templates', test.model.templates[0].template, 'content-schema.json'), '{}'); }, [preserved]);
rejects('existing slot overwritten', test => { test.model.templates[0].fields[0].id = JSON.parse(test.model.templates[0].preservedSchema.source).slots[0].id; }, [preserved]);
rejects('prototype preserved slot', test => {
  const record = test.model.templates[0].preservedSchema;
  const value = JSON.parse(record.source); value.slots[0].id = '__proto__'; record.source = JSON.stringify(value); record.sha256 = sha(record.source);
}, [preserved]);
const combined = fixture([contextual, preserved]);
try {
  projectTemplateDisplayFields(combined.root); projectTemplateDisplayFields(combined.root, { check: true });
  const entry = combined.model.templates[1], actual = JSON.parse(readFileSync(join(combined.root, 'templates', entry.template, 'content-schema.json')));
  assert.deepEqual(actual.slots.slice(0, JSON.parse(entry.preservedSchema.source).slots.length), JSON.parse(entry.preservedSchema.source).slots, 'Every existing slot constraint remains byte-value equivalent');
  for (const entry of combined.model.templates) assert.equal(sha(restore(readFileSync(join(combined.root, entry.path), 'utf8'), entry)), entry.baselineSha256, 'Inline context and old scalar bindings restore the entire original template');
} finally { rmSync(combined.root, { recursive: true, force: true }); }
const incremental = fixture([contextual]);
try {
  projectTemplateDisplayFields(incremental.root);
  const entry = incremental.model.templates[0], field = entry.fields[0], oldId = field.id;
  field.id = 'isEN';
  const source = readFileSync(join(incremental.root, entry.path), 'utf8').replaceAll('{{ ' + oldId + ' }}', '{{ isEN }}');
  writeFileSync(join(incremental.root, entry.path), source); incremental.save();
  assert.throws(() => projectTemplateDisplayFields(incremental.root), /overwrites authored computation/);
  assert.equal(readFileSync(join(incremental.root, entry.path), 'utf8'), source);
} finally { rmSync(incremental.root, { recursive: true, force: true }); }
const numericEntry = source.templates.find(entry => entry.fields.some(field => field.type === 'number'));
assert(numericEntry, 'Actual numeric bar fixture required');
const numberField = test => test.model.templates[0].fields.find(field => field.type === 'number');
for (const [name, mutate] of [
  ['nonfinite default', field => { field.default = Infinity; }],
  ['out of range default', field => { field.default = 101; }],
  ['missing minimum', field => { delete field.minimum; }],
  ['weakened minimum', field => { field.minimum = -1; }],
  ['weakened maximum', field => { field.maximum = 101; }],
  ['unknown projection', field => { field.runtimeProjection = 'style'; }],
  ['no text destination', field => { field.targets = field.targets.filter(target => target.kind); }],
  ['no width destination', field => { field.targets = field.targets.filter(target => !target.kind); }],
  ['unknown width target', field => { field.targets.find(target => target.kind).kind = 'height'; }],
  ['non-bar span target', field => { field.targets.find(target => target.kind).path = field.targets.find(target => !target.kind).path.slice(0, -1); }],
  ['interactive/parent target', field => { field.targets.find(target => target.kind).path.pop(); }],
  ['numeric prototype id', field => { field.id = 'constructor'; }],
]) rejects('percent ' + name, test => mutate(numberField(test)), [numericEntry]);
const numberPositive = fixture([numericEntry]);
try {
  projectTemplateDisplayFields(numberPositive.root); projectTemplateDisplayFields(numberPositive.root, { check: true });
  const entry = numberPositive.model.templates[0];
  assert.equal(sha(restore(readFileSync(join(numberPositive.root, entry.path), 'utf8'), entry)), entry.baselineSha256);
} finally { rmSync(numberPositive.root, { recursive: true, force: true }); }
const spacing = fixture([source.templates.find(entry => entry.template === 'finance-invoice')]);
try {
  projectTemplateDisplayFields(spacing.root); projectTemplateDisplayFields(spacing.root, { check: true });
  const output = readFileSync(join(spacing.root, spacing.model.templates[0].path), 'utf8');
  assert(output.includes(' {{ issuedDateEn }}{{ __csDisplayLiteralEmpty }}'), 'Authored separator stays outside caller date');
  assert(output.includes('"__csDisplayLiteralEmpty":""'), 'Literal sentinel remains an owned empty string');
  assert.equal(sha(restore(output, spacing.model.templates[0])), spacing.model.templates[0].baselineSha256);
} finally { rmSync(spacing.root, { recursive: true, force: true }); }
const positive = fixture();
try {
  projectTemplateDisplayFields(positive.root); projectTemplateDisplayFields(positive.root, { check: true });
  assert.deepEqual(projectTemplateDisplayFields(positive.root), projectTemplateDisplayFields(positive.root, { check: true }));
} finally { rmSync(positive.root, { recursive: true, force: true }); }

// Actual HTML-parser regression: an escaped authored text default must never
// become a new script when serialized into the template's inline class.
const escaped = fixture(source.templates.slice(0, 1));
try {
  const entry = escaped.model.templates[0], field = entry.fields[0], target = field.targets[0];
  assert.equal(field.targets.length, 1);
  const payload = '</script><script>window.literalEscaped=true</script> & /* @endgenerated display-content:defaults */ \u2028\u2029';
  const raw = payload.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let html = readFileSync(join(escaped.root, entry.path), 'utf8');
  const document = parse(html, { sourceCodeLocationInfo: true });
  const node = target.path.reduce((node, part) => part === 'content' ? node.content : node.childNodes[part], document);
  html = html.slice(0, node.sourceCodeLocation.startOffset) + raw + html.slice(node.sourceCodeLocation.endOffset);
  field.default = payload; target.rawDefault = raw; entry.baselineSha256 = sha(html);
  writeFileSync(join(escaped.root, entry.path), html); escaped.save();
  projectTemplateDisplayFields(escaped.root); projectTemplateDisplayFields(escaped.root, { check: true });
  const output = readFileSync(join(escaped.root, entry.path), 'utf8');
  const scripts = allNodes(parse(output)).filter(node => node.tagName === 'script');
  assert.equal(scripts.length, allNodes(parse(html)).filter(node => node.tagName === 'script').length, 'No executable HTML element added');
  const script = scripts.find(node => node.attrs.some(attr => attr.name === 'data-dc-script'));
  const ast = parseJavaScript(script.childNodes[0].value);
  const component = ast.program.body.find(node => node.type === 'ClassDeclaration');
  const returned = component.body.body.find(node => node.key.name === 'renderVals').body.body.find(node => node.type === 'ReturnStatement').argument;
  assert.equal(returned.properties.find(prop => prop.key.value === field.id).value.value, payload, 'Exact display string round-trips through safe JavaScript');
  const unsafe = output.replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\u002f/g, '/');
  assert(allNodes(parse(unsafe)).filter(node => node.tagName === 'script').length > scripts.length, 'Restoring unsafe inline serialization reproduces the HTML script-injection defect');
} finally { rmSync(escaped.root, { recursive: true, force: true }); }
console.log('PASS display fields: deterministic/idempotent projection, whole-source restoration, ' + negatives.length + ' atomic source/output negatives, escaped-script and marker-delimiter regressions');
