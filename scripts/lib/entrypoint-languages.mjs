import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, lstatSync } from 'node:fs';
import { resolve, dirname, posix } from 'node:path';
import { createHash } from 'node:crypto';
export const entrypoints = ['README.md', 'SKILL.md', 'AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'CONTRIBUTING.md', 'llms.txt', 'MAINTAINERS.md', 'SECURITY.md'];
export const generatedEntrypoints = [{
  source: 'DESIGN.md',
  mirror: 'docs/vi/entrypoints/DESIGN.md',
  generator: 'scripts/generate-design-md.mjs'
}];
const begin = '<!-- BEGIN GENERATED ENTRY LANGUAGE ROUTE v1 -->';
const end = '<!-- END GENERATED ENTRY LANGUAGE ROUTE v1 -->';
const digest = value => createHash('sha256').update(value).digest('hex');
export function entryRoute(path) {
  assert(entrypoints.includes(path), 'Unknown entrance route');
  const target = 'docs/vi/entrypoints/' + path;
  return begin + '\n**Tiếng Việt:** [Đọc hướng dẫn đầy đủ](' + target + ') · **English:** full original guidance follows below.\n' + end + '\n\n';
}
export function stripEntryRoute(text) {
  const starts = text.split(begin).length - 1,
    ends = text.split(end).length - 1;
  if (!starts && !ends) return text;
  assert(starts === 1 && ends === 1, 'Ambiguous entrance language route');
  const start = text.indexOf(begin),
    stop = text.indexOf(end) + end.length;
  assert(start < stop && text.slice(stop).startsWith('\n\n'), 'Invalid entrance route boundary');
  return text.slice(0, start) + text.slice(stop + 2);
}
export function routeEntry(text, path) {
  const source = stripEntryRoute(text);
  const frontmatter = source.match(/^---\n[\s\S]*?\n---\n\n/);
  const offset = frontmatter?.[0].length || 0;
  return source.slice(0, offset) + entryRoute(path) + source.slice(offset);
}
const fences = text => [...text.matchAll(/^```[^\n]*\n[\s\S]*?^```[ \t]*$/gm)].map(match => match[0]);
const inlineCodes = text => [...text.matchAll(/`([^`\n]+)`/g)].map(match => match[1]).sort();
function destinations(text, path) {
  return [...text.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map(match => {
    const target = match[1];
    if (/^(?:[a-z]+:|#|\/)/i.test(target)) return target;
    return posix.normalize(posix.join(posix.dirname(path), target));
  });
}
export function validateEntryPair(root, row) {
  assert(entrypoints.includes(row.source) && row.mirror === 'docs/vi/entrypoints/' + row.source, 'Unexpected entrance/mirror membership');
  for (const path of [row.source, row.mirror]) {
    let current = resolve(root);
    for (const part of path.split('/')) {
      current = resolve(current, part);
      assert(!lstatSync(current).isSymbolicLink(), 'Symlink entrance language input');
    }
  }
  const english = stripEntryRoute(readFileSync(resolve(root, row.source), 'utf8'));
  const vi = readFileSync(resolve(root, row.mirror), 'utf8');
  assert.equal(digest(english), row.sourceSha256, 'Unreviewed entrance source drift: ' + row.source);
  assert.equal(digest(vi), row.mirrorSha256, 'Unreviewed entrance translation drift: ' + row.mirror);
  assert(/[À-ỹĐđ]/u.test(vi), 'Missing Vietnamese entrance content');
  assert.deepEqual(fences(vi), fences(english), 'Entrance code-fence drift');
  assert.deepEqual(inlineCodes(vi), inlineCodes(english), 'Entrance inline-code drift');
  assert.deepEqual(destinations(vi, row.mirror), destinations(english, row.source), 'Entrance Markdown destination drift');
  const metadata = text => text.match(/^---\n[\s\S]*?\n---\n/)?.[0] || '';
  assert.equal(metadata(vi), metadata(english), 'Machine-readable entrance metadata must remain literal');
  return english;
}
export function generateEntrypointLanguages(root, {
  check = false
} = {}) {
  const inventory = JSON.parse(readFileSync(resolve(root, 'scripts/entrypoint-language-source.json'), 'utf8'));
  assert.equal(inventory.schemaVersion, 1);
  assert.deepEqual(inventory.generatedEntries, generatedEntrypoints, 'Complete generated entrance membership required');
  assert.deepEqual(inventory.entries.map(row => row.source), entrypoints, 'Complete ordered entrance language membership required');
  const outputs = inventory.entries.map(row => {
    const source = validateEntryPair(root, row);
    const current = readFileSync(resolve(root, row.source), 'utf8');
    return {
      path: row.source,
      current,
      output: routeEntry(source, row.source)
    };
  });
  const changed = outputs.filter(row => row.current !== row.output);
  if (check) assert.equal(changed.length, 0, 'Stale entrance language routes');else for (const row of changed) writeFileSync(resolve(root, row.path), row.output);
  return {
    entries: outputs.length,
    changed: changed.length,
    codeAndLinksPreserved: true
  };
}
