import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, cpSync, symlinkSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { validateSharedLayouts, projectSharedLayout, pixelReferenceStatus } from '../../scripts/lib/template-shared-layouts.mjs';
const source = validateSharedLayouts(JSON.parse(readFileSync('scripts/template-shared-layouts-source.json'))),
  root = resolve('.'),
  run = (cwd, args = []) => spawnSync(process.execPath, ['scripts/generate-template-shared-layouts.mjs', ...args], {
    cwd,
    encoding: 'utf8'
  });
assert.equal(run(root, ['--check']).status, 0);
const before = source.templates.map(e => readFileSync(e.path, 'utf8'));
for (const [e, i] of source.templates.map((e, i) => [e, i])) assert.equal(projectSharedLayout(before[i], e, source.styles).html, before[i]);
let negatives = 0;
for (const mutate of [s => s.styles.footerLink.color = 'url(javascript:bad)', s => s.styles.invitationTitle.margin = '1px;display:none', s => s.templates[0].path = '../outside', s => s.templates.push(s.templates[0]), s => s.templates[0].owners[0].path = [999], s => s.templates[0].owners[0].text = '<b>new markup</b>', s => s.templates[0].owners[0].attributes.onclick = 'bad()']) {
  const bad = structuredClone(source);
  mutate(bad);
  assert.throws(() => {
    validateSharedLayouts(bad);
    bad.templates.forEach((e, i) => projectSharedLayout(before[i], e, bad.styles));
  });
  negatives++;
}
let getters = 0;
const accessor = structuredClone(source);
Object.defineProperty(accessor, 'styles', {
  get() {
    getters++;
    return {};
  }
});
assert.throws(() => validateSharedLayouts(accessor));
assert.equal(getters, 0);
const nestedAccessor = structuredClone(source);
Object.defineProperty(nestedAccessor.templates[0].owners[0].attributes, 'class', {
  get() {
    getters++;
    return 'bad';
  },
  enumerable: true,
  configurable: true
});
assert.throws(() => validateSharedLayouts(nestedAccessor));
assert.equal(getters, 0);
negatives++;
const scratch = mkdtempSync(join(tmpdir(), 'cs-shared-layout-test-'));
try {
  symlinkSync(join(root, 'node_modules'), join(scratch, 'node_modules'), 'dir');
  for (const p of ['scripts/generate-template-shared-layouts.mjs', 'scripts/lib/template-shared-layouts.mjs', 'scripts/template-shared-layouts-source.json', ...source.templates.map(e => e.path)]) {
    mkdirSync(dirname(join(scratch, p)), {
      recursive: true
    });
    cpSync(p, join(scratch, p));
  }
  const changed = structuredClone(source);
  changed.styles.footerLink.color = 'var(--cs-accent-bright)';
  changed.styles.invitationTitle['font-size'] = '31px';
  writeFileSync(join(scratch, 'scripts/template-shared-layouts-source.json'), JSON.stringify(changed));
  assert.notEqual(run(scratch, ['--check']).status, 0);
  assert.equal(run(scratch).status, 0);
  for (const [e, i] of source.templates.map((e, i) => [e, i])) assert.equal(readFileSync(join(scratch, e.path), 'utf8'), projectSharedLayout(before[i], e, changed.styles).html);
  const last = source.templates.at(-1).path;
  writeFileSync(join(scratch, last), readFileSync(join(scratch, last), 'utf8').replace('href="#" style="color:', 'href="changed" style="color:'));
  const snapshot = source.templates.map(e => readFileSync(join(scratch, e.path), 'utf8'));
  assert.notEqual(run(scratch).status, 0);
  assert.deepEqual(source.templates.map(e => readFileSync(join(scratch, e.path), 'utf8')), snapshot, 'Later ownership failure cannot partially write earlier outputs');
  negatives++;
  rmSync(join(scratch, last));
  const outside = join(scratch, 'never.html');
  symlinkSync(outside, join(scratch, last));
  assert.notEqual(run(scratch).status, 0);
  assert(!existsSync(outside));
  assert.deepEqual(source.templates.slice(0, -1).map(e => readFileSync(join(scratch, e.path), 'utf8')), snapshot.slice(0, -1));
  negatives++;
  rmSync(join(scratch, source.templates.at(-1).path));
  rmSync(join(scratch, 'templates/tech-release-notes'), {
    recursive: true
  });
  const external = join(scratch, 'external');
  mkdirSync(external);
  writeFileSync(join(external, 'TechReleaseNotes.dc.html'), before.at(-1));
  symlinkSync(external, join(scratch, 'templates/tech-release-notes'), 'dir');
  assert.notEqual(run(scratch).status, 0);
  assert.equal(readFileSync(join(external, 'TechReleaseNotes.dc.html'), 'utf8'), before.at(-1));
  negatives++;
} finally {
  rmSync(scratch, {
    recursive: true,
    force: true
  });
}
console.log('PASS five shared native layouts:20 exact owners, full-source byte identity, actual role-style propagation, no text/attribute/runtime writes, accessor rejection and ' + negatives + ' metadata/ownership/atomic/symlink negatives');
const a = {
    screen: 'a'.repeat(64),
    print: 'b'.repeat(64)
  },
  b = {
    screen: 'c'.repeat(64),
    print: 'd'.repeat(64)
  };
assert.equal(pixelReferenceStatus(a, a), 'passed');
assert.equal(pixelReferenceStatus(a, a, [b]), 'unverified-reference-unstable');
assert.throws(() => pixelReferenceStatus(a, b, [a, a, a]), /Stable original/);
assert.throws(() => pixelReferenceStatus(a, b, []), /Stable original/);
assert.equal(pixelReferenceStatus(a, b, [a, b]), 'unverified-reference-unstable');
assert.throws(() => pixelReferenceStatus(a, b, [a, a, a, b]));
console.log('PASS pixel oracle: exact stable references required; demonstrated unstable same-input controls remain unverified, never a pixel pass');
