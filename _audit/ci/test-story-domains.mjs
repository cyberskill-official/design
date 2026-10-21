import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { declaredOptionsFromSource } from '../../scripts/lib/story-domain-options.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
execFileSync(process.execPath, [resolve(root, 'scripts/generate-story-domains.mjs'), '--check'], {
  stdio: 'inherit'
});
const source = 'import {DECLARED_DOMAINS as domains} from "./declared-domains.mjs"; const VALUES=domains.Button.variant; export default {argTypes:{variant:{options:VALUES}}};';
assert.deepEqual(declaredOptionsFromSource(source, 'variant', root), ['primary', 'secondary', 'tertiary', 'ghost', 'danger', 'danger-ghost']);
for (const edit of [s => s.replace('./declared-domains.mjs', './unreviewed.mjs'), s => s.replace('domains.Button.variant', 'domains.Button[window.unreviewed]'), s => s.replace('domains.Button.variant', 'getUnreviewedOptions()')]) assert.equal(declaredOptionsFromSource(edit(source), 'variant', root), null, 'Untrusted expressions/imports are not executed or accepted');
assert.throws(() => declaredOptionsFromSource(source.replace('domains.Button.variant', 'domains.Missing.variant'), 'variant', root), /Unknown declared story domain/);
const scratch = mkdtempSync(join(tmpdir(), 'cs-story-domains-'));
try {
  for (const path of ['scripts/generate-story-domains.mjs', 'scripts/lib/typescript-api.mjs', 'scripts/lib/declaration-domains.mjs', '_esm', 'components', 'stories/declared-domains.mjs']) {
    mkdirSync(resolve(scratch, path, '..'), {
      recursive: true
    });
    cpSync(resolve(root, path), resolve(scratch, path), {
      recursive: true
    });
  }
  symlinkSync(resolve(root, 'node_modules'), join(scratch, 'node_modules'), 'dir');
  const run = check => spawnSync(process.execPath, [join(scratch, 'scripts/generate-story-domains.mjs'), ...(check ? ['--check'] : [])], {
    encoding: 'utf8'
  });
  assert.equal(run(true).status, 0);
  const path = join(scratch, 'components/button/Button.d.ts'),
    original = readFileSync(path, 'utf8'),
    generated = join(scratch, 'stories/declared-domains.mjs'),
    before = readFileSync(generated, 'utf8');
  assert(original.includes('"danger-ghost"'));
  writeFileSync(path, original.replace('"danger-ghost"', '"danger-ghost" | "new-fixture-value"'));
  let result = run(true);
  assert.notEqual(result.status, 0, 'Added declaration literal invalidates generated domains');
  assert.equal(readFileSync(generated, 'utf8'), before, 'Read-only check cannot rewrite output');
  assert.equal(run(false).status, 0);
  assert(readFileSync(generated, 'utf8').includes('new-fixture-value'), 'Regeneration projects new declaration literal');
  writeFileSync(path, original);
  assert.equal(run(false).status, 0);
  const valid = readFileSync(generated, 'utf8');
  writeFileSync(generated, valid.replace('"danger-ghost"', '"unknown-fixture-value"'));
  assert.notEqual(run(true).status, 0, 'Modified generated options rejected');
  writeFileSync(generated, valid);
  writeFileSync(path, original + '\n// source drift\n');
  assert.throws(() => declaredOptionsFromSource(source, 'variant', scratch), /Declared story domains stale/, 'Even unchanged domain values retain source identity');
} finally {
  rmSync(scratch, {
    recursive: true,
    force: true
  });
}
console.log('PASS declaration-derived CSF domains: trusted literal-only resolution, added-value regeneration, read-only drift rejection and untrusted expression/import negatives');
