#!/usr/bin/env node
/**
 * Every required operator/entrance doc must have:
 *  - a Storybook Docs (or Release Notes) sidebar title
 *  - a docs/viewer.html nav entry
 * Storybook must publish `docs/` via staticDirs and entrance files at `/`.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const catalog = JSON.parse(read('_audit/docs-catalog.json'));
const tracked = JSON.parse(read('_audit/docs-tracked.json')).tracked || [];
const enDocs = readdirSync(join(root, 'docs')).filter((f) => f.endsWith('.md')).sort();

const catalogPaths = new Set([
  ...catalog.entrance.map((p) => p.path),
  ...catalog.pages.map((p) => p.path),
]);
const catalogStories = new Set([
  ...catalog.entrance.map((p) => p.story),
  ...catalog.pages.map((p) => p.story),
  ...catalog.curated.map((p) => p.story),
]);

for (const name of enDocs) {
  assert(catalogPaths.has('docs/' + name), `docs/${name} missing from docs-catalog.json pages`);
}
for (const name of tracked) {
  assert(catalogPaths.has('docs/' + name), `tracked ${name} missing from catalog`);
}
for (const ent of ['README.md', 'SKILL.md', 'llms.txt', 'CONTRIBUTING.md']) {
  assert(catalog.entrance.some((p) => p.path === ent), `entrance ${ent} missing from catalog`);
}
assert(catalog.pages.some((p) => p.path === 'docs/doctrine.md'), 'doctrine.md in catalog');

const viewer = read('docs/viewer.html');
const viewerPaths = [...viewer.matchAll(/\['([^']+\.(?:md|txt))'/g)].map((m) => m[1]);
const viewerSet = new Set(viewerPaths);
for (const path of catalogPaths) {
  assert(viewerSet.has(path), `viewer nav missing ${path}`);
}

const storyFiles = [];
function walkStories(dir) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) walkStories(p);
    else if (/\.(mdx|jsx|tsx|js)$/.test(name.name)) storyFiles.push(p);
  }
}
walkStories(join(root, 'stories'));
const storyBlob = storyFiles.map((p) => readFileSync(p, 'utf8')).join('\n');

const STORY_GROUPS = ['Docs/Start', 'Docs/Guides', 'Docs/Maintainers', 'Release Notes'];
function storyCovered(title) {
  if (storyBlob.includes(`<Meta title="${title}" />`) || storyBlob.includes(`<Meta title='${title}' />`)) {
    return true;
  }
  for (const group of STORY_GROUPS) {
    if (!title.startsWith(group + '/')) continue;
    const leaf = title.slice(group.length + 1);
    const hasGroup =
      storyBlob.includes(`title: '${group}'`) ||
      storyBlob.includes(`title: "${group}"`);
    const hasLeaf =
      storyBlob.includes(`name: '${leaf}'`) ||
      storyBlob.includes(`name: "${leaf}"`);
    if (hasGroup && hasLeaf) return true;
  }
  return false;
}

const missingStories = [...catalogStories].filter((t) => !storyCovered(t));
assert(missingStories.length === 0, 'Storybook missing titles: ' + missingStories.join(', '));

const main = read('.storybook/main.js');
assert(/from:\s*['"]\.\.\/docs['"]/.test(main) || /to:\s*['"]\/docs['"]/.test(main), 'Storybook staticDirs must publish docs/');
for (const ent of ['README.md', 'SKILL.md', 'llms.txt', 'CONTRIBUTING.md']) {
  assert(main.includes(`'/${ent}'`) || main.includes(`"/${ent}"`), `dsRootFilesPlugin must publish /${ent}`);
}

const preview = read('.storybook/preview.jsx');
for (const needle of ['Start', 'Guides', 'Maintainers', 'Library', 'Doctrine']) {
  assert(preview.includes(`'${needle}'`) || preview.includes(`"${needle}"`), `storySort missing ${needle}`);
}

console.log('PASS test-docs-storybook-coverage', {
  docs: enDocs.length,
  stories: catalogStories.size,
  viewer: catalogPaths.size,
});
