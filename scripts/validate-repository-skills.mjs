import assert from 'node:assert/strict';
import { readFileSync, existsSync, realpathSync, readdirSync, lstatSync } from 'node:fs';
import {createHash} from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { resolve, dirname, basename, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

// Agent Skills specification: https://agentskills.io/specification
// Root SKILL.md and its declared Vietnamese entrypoint mirror are shared
// repository routers, not discovery-directory skills.
export function parseSkill(text, expectedName) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  assert(match, 'Skill requires closed YAML frontmatter');
  const doc = parseDocument(match[1], { uniqueKeys: true });
  assert.equal(doc.errors.length, 0, doc.errors.map(error => error.message).join('\n'));
  const data = doc.toJS({ maxAliasCount: 100 });
  assert(data && typeof data === 'object' && !Array.isArray(data), 'Skill metadata must be a mapping');
  assert(typeof data.name === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.name) && data.name.length <= 64, 'Invalid skill name');
  if (expectedName) assert.equal(data.name, expectedName, 'Skill name must match its discovery directory');
  assert(typeof data.description === 'string' && data.description.trim() && data.description.length <= 1024, 'Invalid skill description');
  for (const key of ['license', 'compatibility', 'allowed-tools']) {
    if (key in data) assert(typeof data[key] === 'string' && data[key].trim(), `Invalid ${key}`);
  }
  if (data.compatibility) assert(data.compatibility.length <= 500, 'Compatibility exceeds 500 characters');
  if ('metadata' in data) {
    assert(data.metadata && typeof data.metadata === 'object' && !Array.isArray(data.metadata), 'Invalid metadata map');
    assert(Object.values(data.metadata).every(value => typeof value === 'string'), 'Metadata values must be strings');
  }
  assert(match[2].trim(), 'Skill body is empty');
  return { data, body: match[2] };
}

/** Check linked file destinations, not code examples or arbitrary prose paths. */
export function validateLocalReferences(root, file, body) {
  const prose = body.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
  const destinations = [
    ...[...prose.matchAll(/!?\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/g)].map(match => match[1] || match[2]),
    ...[...prose.matchAll(/^\s*\[[^\]]+\]:\s*(?:<([^>]+)>|(\S+))/gm)].map(match => match[1] || match[2]),
  ];
  const repository = realpathSync(root);
  const local = [];
  for (const destination of destinations) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(destination)) continue;
    const path = decodeURIComponent(destination.split(/[?#]/)[0]);
    if (!path) continue;
    assert(!path.startsWith('/'), `Use repository-relative skill reference: ${destination}`);
    const target = resolve(root, dirname(file), path);
    assert(existsSync(target), `${file}: missing linked resource ${destination}`);
    const resolved = realpathSync(target);
    assert(resolved === repository || resolved.startsWith(repository + sep), `${file}: reference escapes repository`);
    local.push(relative(root, target));
  }
  return local;
}

/** Discovery directories may contain routing documents only, never installer payloads. */
export function validateDiscoveryTree(root) {
  for (const host of ['.agents', '.cursor']) {
    const path = resolve(root, host, 'skills');
    if (!existsSync(path)) continue;
    for (const entry of readdirSync(path, {withFileTypes:true})) {
      assert(entry.isDirectory() && !entry.isSymbolicLink(), 'Discovery entries must be skill directories');
      const directory = resolve(path,entry.name), children = readdirSync(directory);
      assert.deepEqual(children,['SKILL.md'], 'Skill discovery directories contain only SKILL.md routers');
      assert(!lstatSync(resolve(directory,'SKILL.md')).isSymbolicLink(), 'Linked discovery router');
      const text = readFileSync(resolve(directory,'SKILL.md'),'utf8');
      assert(!/\bnpx\s+|\b(?:npm|pnpm|yarn|bun|pip3?|uv|brew)\s+(?:install|i|add|dlx|exec|x)\b|(?:shadcn_add|tailwind_config_gen)\.py/i.test(text), 'Installer commands are forbidden in skill routers');
    }
  }
}
/** Retained-resource bytes are provenance, not distribution or license approval. */
export function validateArchivedResources(root) {
  const base = realpathSync(root), archive = resolve(base,'vendor/skill-resources');
  const manifest = JSON.parse(readFileSync(resolve(archive,'manifest.json'),'utf8'));
  assert.equal(manifest.schemaVersion,1);assert(Array.isArray(manifest.records)&&manifest.records.length,'Missing archived resource records');
  const sources=new Set(),destinations=new Set();
  for(const record of manifest.records){
    assert(/^\.(agents|cursor)\/skills\/[a-z0-9-]+\//.test(record.sourcePath),'Invalid archived origin');
    assert(record.sourcePath.split('/').every(part=>part&&part!=='.'&&part!=='..'),'Unsafe archived origin');
    assert(record.archivePath.startsWith('vendor/skill-resources/'),'Invalid archive path');
    assert(record.archivePath.split('/').every(part=>part&&part!=='.'&&part!=='..'),'Unsafe archive path');
    assert(!sources.has(record.sourcePath)&&!destinations.has(record.archivePath),'Duplicate archived resource');sources.add(record.sourcePath);destinations.add(record.archivePath);
    assert(!existsSync(resolve(base,record.sourcePath)),'Archived resource remains in discovery');
    const path=resolve(base,record.archivePath),actual=realpathSync(path);
    assert(actual.startsWith(archive+sep)&&!lstatSync(path).isSymbolicLink(),'Archive resource escapes storage');
    const bytes=readFileSync(path);
    assert.equal(bytes.length,record.bytes,'Archived resource size changed');
    assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256,'Archived resource bytes changed');
    assert.equal(lstatSync(path).mode&0o111,record.mode&0o111,'Archived executable bit changed');
  }
  const walk=folder=>readdirSync(folder,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(resolve(folder,entry.name)):[relative(base,resolve(folder,entry.name))]);
  const payload=walk(archive).filter(path=>!['vendor/skill-resources/README.md','vendor/skill-resources/manifest.json'].includes(path));
  assert.deepEqual(payload.sort(),[...destinations].sort(),'Unrecorded or missing archived payload');
  const policy=JSON.parse(readFileSync(resolve(base,'scripts/public-site-policy.json'),'utf8'));
  assert(Object.values(policy.audiences).every(audience=>audience.files.every(path=>!path.startsWith('vendor/skill-resources/'))),'Archive must remain excluded from public website');
  return manifest.records;
}

export function validateRepositorySkills(root) {
  validateDiscoveryTree(root);
  const files = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0'))]
    .filter(path => (path === 'SKILL.md' || path.endsWith('/SKILL.md')) && existsSync(resolve(root, path))).sort();
  assert(files.includes('SKILL.md'), 'Shared repository entrypoint is missing');
  const skills = files.map(file => {
    const text = readFileSync(resolve(root, file), 'utf8');
    const { data, body } = parseSkill(text, ['SKILL.md', 'docs/vi/entrypoints/SKILL.md'].includes(file) ? undefined : basename(dirname(file)));
    return { file, name: data.name, localReferences: validateLocalReferences(root, file, body) };
  });
  for (const skill of skills.filter(skill => /^\.(agents|cursor)\/skills\//.test(skill.file))) {
    const mirror = skill.file.startsWith('.agents/') ? skill.file.replace(/^\.agents\//, '.cursor/') : skill.file.replace(/^\.cursor\//, '.agents/');
    assert(files.includes(mirror), `Missing peer skill adapter: ${mirror}`);
    assert.equal(readFileSync(resolve(root, skill.file), 'utf8'), readFileSync(resolve(root, mirror), 'utf8'), `Host adapter drift: ${skill.name}`);
    assert(skill.localReferences.includes('SKILL.md') && skill.localReferences.includes('docs/doctrine.md'), `Missing canonical routing: ${skill.name}`);
  }
  return skills;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const skills = validateRepositorySkills(root);
  const archived = validateArchivedResources(root);
  console.log(`PASS repository skills: ${skills.length} routing documents, ${archived.length} preserved archived resources; local links, router-only discovery and host adapter parity. Host execution and behavioral acceptance are separate.`);
}
