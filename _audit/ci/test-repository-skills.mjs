import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parseSkill, validateLocalReferences, validateRepositorySkills } from '../../scripts/validate-repository-skills.mjs';

const valid = '---\nname: fixture\ndescription: |\n  Use this fixture to validate metadata.\nmetadata:\n  version: "1.0"\n---\nRead [guide](guide.md).\n';
assert.equal(parseSkill(valid, 'fixture').data.name, 'fixture');
for (const invalid of [
  valid.replace('\n---\nRead', '\nRead'),
  valid.replace('description: |\n  Use this fixture to validate metadata.\n', ''),
  valid.replace('name: fixture', 'name: fixture\nname: other'),
  valid.replace('name: fixture', 'name: [fixture'),
  valid.replace('name: fixture', 'name: bad--name'),
  valid.replace('"1.0"', '1.0'),
  valid.replace('Use this fixture to validate metadata.', 'x'.repeat(1025)),
]) assert.throws(() => parseSkill(invalid));
assert.throws(() => parseSkill(valid, 'different'), /directory/);
const root = mkdtempSync(join(tmpdir(), 'cs-skill-contract-'));
try {
  mkdirSync(join(root, 'fixture')); writeFileSync(join(root, 'fixture/guide.md'), 'guide');
  const body = parseSkill(valid).body;
  assert.deepEqual(validateLocalReferences(root, 'fixture/SKILL.md', body), ['fixture/guide.md']);
  assert.throws(() => validateLocalReferences(root, 'fixture/SKILL.md', '[missing](missing.md)'), /missing linked/);
  assert.deepEqual(validateLocalReferences(root, 'fixture/SKILL.md', '[guide][ref]\n[ref]: guide.md\n[web](https://example.invalid)\n```md\n[example](absent.md)\n```'), ['fixture/guide.md']);
  assert.throws(() => validateLocalReferences(root, 'fixture/SKILL.md', '[outside](../../)'), /escapes/);
  execFileSync('git', ['init'], {cwd:root, stdio:'ignore'});
  writeFileSync(join(root, 'SKILL.md'), valid.replace('Read [guide](guide.md).', 'Shared router.'));
  mkdirSync(join(root, 'docs')); writeFileSync(join(root, 'docs/doctrine.md'), 'Contract');
  const adapter = valid.replace('Read [guide](guide.md).', '[Router](../../../SKILL.md) and [contract](../../../docs/doctrine.md).');
  for (const host of ['.agents', '.cursor']) {
    mkdirSync(join(root, host, 'skills/fixture'), {recursive:true});
    writeFileSync(join(root, host, 'skills/fixture/SKILL.md'), adapter);
  }
  assert.equal(validateRepositorySkills(root).length, 3);
  const cursor = join(root, '.cursor/skills/fixture/SKILL.md');
  rmSync(cursor); assert.throws(() => validateRepositorySkills(root), /Missing peer/);
  writeFileSync(cursor, adapter + '\nDifferent instruction.');
  assert.throws(() => validateRepositorySkills(root), /adapter drift/);
  writeFileSync(cursor, adapter);
  rmSync(join(root, '.agents/skills/fixture/SKILL.md'));
  assert.throws(() => validateRepositorySkills(root), /Missing peer/);
} finally { rmSync(root, {recursive:true, force:true}); }
const skills = validateRepositorySkills(fileURLToPath(new URL('../../', import.meta.url)));
console.log(`PASS skill validation: ${skills.length} shipped metadata files; malformed/duplicate/missing YAML, names, metadata types, missing/escaping links and adapter parity.`);
