import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectTemplates } from '../../scripts/generate-template-inventory.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const actual = collectTemplates(root);
assert.equal(actual.templates.length, 85);
assert.equal(actual.kits.length, 3);
const schemas = actual.templates.filter(t => t.contentSchema);
const adopted = JSON.parse(readFileSync(join(root, '_audit/ci/fixtures/template-content-bindings.json'))).templates;
assert.deepEqual(schemas.map(t => [t.contentSchema.path, t.contentSchema.slots.map(s => s.id).sort()]).sort(), adopted.map(t => [t.path, t.slots.map(s => s.id).sort()]).sort(), 'Exact authored schema/slot adoption membership');
assert(actual.templates.find(t => t.path === 'templates/marketing-page/MarketingPage.dc.html').contentSchema.slots.some(s => s.id === 'heroImagePlaceholder'));
for (const path of ['templates/marketing-social-kit/MarketingSocialKit.dc.html', 'templates/marketing-case-study/MarketingCaseStudy.dc.html', 'templates/culture-event-invite/CultureEventInvite.dc.html']) {
  const slots = actual.templates.find(t => t.path === path).contentSchema.slots;
  const targetCount = path.includes('marketing-social-kit/') ? 3 : 1;
  const runtimeTargets = ['placeholder', 'placeholder-vi'].flatMap(attribute => Array.from({
    length: targetCount
  }, () => ({
    tag: 'image-slot',
    attribute
  })));
  assert.deepEqual(slots.filter(slot => slot.id === 'imagePlaceholder'), [{
    id: 'imagePlaceholder',
    type: 'text',
    label: 'Image authoring placeholder',
    maxLength: 80,
    runtimeBinding: 'validated-text-content',
    runtimeTargets,
    minLength: 1,
    semanticReason: 'Preserve a nonempty accessible name or visible control/section label.'
  }], 'Localized image copy must retain exact validated scalar target membership, length and nonempty name guards');
}
for (const template of schemas) {
  const declared = new Set(template.declaredProps.flatMap(props => Object.keys(props)));
  const authored = JSON.parse(readFileSync(join(root, template.contentSchema.path), 'utf8'));
  for (const slot of template.contentSchema.slots) {
    const source = authored.slots.find(item => item.id === slot.id);
    assert.equal(slot.runtimeBinding, ['text', 'number', 'structured'].includes(source.runtimeBinding) && template.contentBinding ? 'validated-' + source.runtimeBinding + '-content' : declared.has(slot.id) ? 'declared-prop_requires-runtime-verification' : 'not-a-declared-runtime-prop');
  }
}
// The sole currently adopted scalar number is an explicit finite native-bar
// contract. Merely broadening the classifier must not validate arbitrary numbers.
function assertNumericAdoption(inventory) {
  const numbers = inventory.templates.flatMap(template => (template.contentSchema?.slots || [])
    .filter(slot => slot.type === 'number' || slot.runtimeBinding === 'validated-number-content')
    .map(slot => ({ path: template.path, slot })));
  assert.deepEqual(numbers, [{
    path: 'templates/delivery-status-email/DeliveryStatusEmail.dc.html',
    slot: {
      id: 'completionPercent', type: 'number', label: 'Completion percent (0–100)',
      required: true, minimum: 0, maximum: 100,
      runtimeBinding: 'validated-number-content', runtimeProjection: 'percent-width',
      runtimeTargets: [
        { tag: 'span', attribute: 'data-dc-percent-width' },
        { tag: 'span', attribute: 'data-dc-percent-width' }
      ]
    }
  }], 'Only the exact authored finite percent slot is classified as adopted numeric content');
}
assertNumericAdoption(actual);
assert(actual.templates.every(t => t.runtime === 'in-repository-browser-interpreter' && t.contentOwner === null && t.verification.exports === 'archetype-and-run-dependent' && t.capabilityEvidence.bootstrap === '_audit/ci/test-template-bootstrap-browser.mjs'));
const temp = mkdtempSync(join(tmpdir(), 'cs-template-inventory-'));
try {
  for (const path of ['templates', 'ui_kits', '_ds_manifest.json']) cpSync(join(root, path), join(temp, path), {
    recursive: true
  });
  const numericPath = join(temp, 'templates/delivery-status-email/content-schema.json');
  const numericSource = readFileSync(numericPath, 'utf8');
  for (const mutate of [
    slot => { slot.maximum = 101; },
    slot => { slot.type = 'text'; },
    slot => { slot.runtimeProjection = 'records'; },
    slot => { slot.runtimeTargets[0].tag = 'button'; }
  ]) {
    const invalid = JSON.parse(numericSource);
    mutate(invalid.slots.find(slot => slot.id === 'completionPercent'));
    writeFileSync(numericPath, JSON.stringify(invalid));
    assert.throws(() => assertNumericAdoption(collectTemplates(temp)), /finite percent slot/);
    writeFileSync(numericPath, numericSource);
  }
  // Hash changes cannot hide behind unchanged catalog metadata.
  const path = join(temp, actual.templates[0].path),
    source = readFileSync(path, 'utf8');
  writeFileSync(path, source + '\n<!-- changed -->');
  assert.notEqual(collectTemplates(temp).templates[0].sha256, actual.templates[0].sha256);
  writeFileSync(path, source.replace('data-props="', 'data-props="INVALID'));
  assert.throws(() => collectTemplates(temp), SyntaxError);
  writeFileSync(path, source);
  writeFileSync(join(temp, 'templates/unlisted.dc.html'), '<x-dc></x-dc>');
  assert.throws(() => collectTemplates(temp), /coverage mismatch/);
  rmSync(join(temp, 'templates/unlisted.dc.html'));
  rmSync(path);
  assert.throws(() => collectTemplates(temp), /coverage mismatch/);
} finally {
  rmSync(temp, {
    recursive: true,
    force: true
  });
}
console.log('PASS template inventory: all 85 templates, three kits, freshness and malformed/missing/unlisted source rejection');
