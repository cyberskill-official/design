// `npx cyberskill-design ai-setup`: run with `node --test scripts/*.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const bin = join(dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'cyberskill-design.mjs');
const run = (cwd, ...args) => spawnSync(process.execPath, [bin, ...args], { cwd, encoding: 'utf8' });
const tmp = () => mkdtempSync(join(tmpdir(), 'cs-cli-'));

test('installs all three and is idempotent, keeping the rest of AGENTS.md', () => {
  const dir = tmp();
  writeFileSync(join(dir, 'AGENTS.md'), '# My app\n\nOur rules cost $5 and use $1.\n');
  assert.equal(run(dir, 'ai-setup').status, 0);
  assert.ok(existsSync(join(dir, '.claude/skills/cyberskill-design/SKILL.md')));
  assert.ok(existsSync(join(dir, '.cursor/rules/cyberskill-design.mdc')));
  const once = readFileSync(join(dir, 'AGENTS.md'), 'utf8');
  assert.match(once, /^# My app\n\nOur rules cost \$5 and use \$1\.\n\n<!-- cyberskill-design:start -->/);
  const again = run(dir, 'ai-setup');
  assert.equal(again.status, 0);
  assert.match(again.stdout, /= AGENTS\.md \(up to date\)/);
  assert.equal(readFileSync(join(dir, 'AGENTS.md'), 'utf8'), once);
});

test('--only=cursor and --dry-run', () => {
  const dir = tmp();
  assert.equal(run(dir, 'ai-setup', '--only=cursor', '--dry-run').status, 0);
  assert.ok(!existsSync(join(dir, '.cursor')));
  assert.equal(run(dir, 'ai-setup', '--only', 'cursor').status, 0);
  assert.ok(existsSync(join(dir, '.cursor/rules/cyberskill-design.mdc')) && !existsSync(join(dir, 'AGENTS.md')));
});

test('rejects unknown commands, flags and targets', () => {
  const dir = tmp();
  for (const args of [['setup'], [], ['ai-setup', '--dryrun'], ['ai-setup', '--only', 'claud'], ['ai-setup', '--only'], ['ai-setup', 'extra']]) {
    const r = run(dir, ...args);
    assert.equal(r.status, 1, `${args.join(' ')} should fail`);
    assert.match(r.stderr, /Usage:/);
  }
  assert.ok(!existsSync(join(dir, '.claude')));
});

test('refuses a broken marker section without writing anything', () => {
  const dir = tmp();
  writeFileSync(join(dir, 'AGENTS.md'), '# App\n<!-- cyberskill-design:start -->\nold\n');
  const r = run(dir, 'ai-setup');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /broken cyberskill-design section/);
  assert.ok(!existsSync(join(dir, '.claude')));
});
