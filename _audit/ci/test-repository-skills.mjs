import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import {createHash} from 'node:crypto';
import { parseSkill, validateLocalReferences, validateRepositorySkills, validateArchivedResources } from '../../scripts/validate-repository-skills.mjs';

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
  // A translated shared router preserves canonical frontmatter; it is not a
  // discoverable skill named after the entrypoints documentation directory.
  mkdirSync(join(root,'docs/vi/entrypoints'),{recursive:true});
  writeFileSync(join(root,'docs/vi/entrypoints/SKILL.md'),valid.replace('Read [guide](guide.md).','[Nguồn](../../../SKILL.md).'));
  assert.equal(validateRepositorySkills(root).length,4);
  mkdirSync(join(root,'docs/vi/unreviewed'),{recursive:true});
  writeFileSync(join(root,'docs/vi/unreviewed/SKILL.md'),valid);
  assert.throws(()=>validateRepositorySkills(root),/Skill name must match/);
  rmSync(join(root,'docs/vi/unreviewed/SKILL.md'));

  const cursor = join(root, '.cursor/skills/fixture/SKILL.md');
  rmSync(cursor); assert.throws(() => validateRepositorySkills(root), /Missing peer|only SKILL.md/);
  writeFileSync(cursor, adapter + '\nDifferent instruction.');
  assert.throws(() => validateRepositorySkills(root), /adapter drift/);
  writeFileSync(cursor, adapter+'\nnpx shadcn add button\n');
  assert.throws(()=>validateRepositorySkills(root),/Installer commands/);
  writeFileSync(cursor,adapter);
  writeFileSync(join(root,'.agents/skills/fixture/install.py'),'not active');
  assert.throws(()=>validateRepositorySkills(root),/only SKILL.md/);
  rmSync(join(root,'.agents/skills/fixture/install.py'));
  writeFileSync(cursor, adapter);
  rmSync(join(root, '.agents/skills/fixture/SKILL.md'));
  assert.throws(() => validateRepositorySkills(root), /Missing peer|only SKILL.md/);
} finally { rmSync(root, {recursive:true, force:true}); }
const repository=fileURLToPath(new URL('../../', import.meta.url));
const skills = validateRepositorySkills(repository);
assert.equal(skills.filter(skill=>skill.file.startsWith('.agents/skills/')).length,7);
assert.equal(skills.filter(skill=>skill.file.startsWith('.cursor/skills/')).length,7);
assert.equal(validateArchivedResources(repository).length,330);
const packed=JSON.parse(execFileSync('npm',['pack','--dry-run','--ignore-scripts','--json'],{cwd:repository,encoding:'utf8'}))[0];
assert(!packed.files.some(file=>file.path.startsWith('vendor/skill-resources/')),'Archived payload must remain outside the npm distribution');
const archive=mkdtempSync(join(tmpdir(),'cs-archive-validation-'));
try {
 const original=Buffer.from('preserved upstream byte fixture');
 const path='vendor/skill-resources/agents/fixture/data.txt';
 mkdirSync(join(archive,'vendor/skill-resources/agents/fixture'),{recursive:true});
 mkdirSync(join(archive,'scripts'));
 writeFileSync(join(archive,path),original);
 writeFileSync(join(archive,'scripts/public-site-policy.json'),JSON.stringify({audiences:{docs:{files:[]}}}));
 const record={sourcePath:'.agents/skills/fixture/data.txt',archivePath:path,bytes:original.length,sha256:createHash('sha256').update(original).digest('hex'),mode:0o644};
 const manifest=join(archive,'vendor/skill-resources/manifest.json');
 writeFileSync(manifest,JSON.stringify({schemaVersion:1,records:[record]}));
 assert.equal(validateArchivedResources(archive).length,1);
 writeFileSync(join(archive,path),'changed');assert.throws(()=>validateArchivedResources(archive),/size changed|bytes changed/);
 writeFileSync(join(archive,path),original);
 writeFileSync(manifest,JSON.stringify({schemaVersion:1,records:[record,record]}));assert.throws(()=>validateArchivedResources(archive),/Duplicate/);
 writeFileSync(manifest,JSON.stringify({schemaVersion:1,records:[{...record,archivePath:'vendor/skill-resources/../outside'}]}));assert.throws(()=>validateArchivedResources(archive),/Unsafe/);
}finally{rmSync(archive,{recursive:true,force:true})}

console.log(`PASS skill validation: ${skills.length} repository routing documents; 330 archived payload files and npm/public exclusion; malformed/duplicate/missing YAML, names, metadata types, missing/escaping links and adapter parity.`);
