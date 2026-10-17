import assert from 'node:assert/strict';
import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname, basename, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

// Agent Skills specification: https://agentskills.io/specification
// Root SKILL.md is a shared repository router, not a discovery-directory skill.
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

export function validateRepositorySkills(root) {
  const files = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0'))]
    .filter(path => (path === 'SKILL.md' || path.endsWith('/SKILL.md')) && existsSync(resolve(root, path))).sort();
  assert(files.includes('SKILL.md'), 'Shared repository entrypoint is missing');
  const skills = files.map(file => {
    const text = readFileSync(resolve(root, file), 'utf8');
    const { data, body } = parseSkill(text, file === 'SKILL.md' ? undefined : basename(dirname(file)));
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
  console.log(`PASS repository skills: ${skills.length} metadata documents and linked local resources; host adapter parity. Host execution and behavioral acceptance are separate.`);
}
