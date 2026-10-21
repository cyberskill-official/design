import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, lstatSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promptParts } from './generate-prompt-api.mjs';
export const languageFence = {
  begin: '<!-- BEGIN GENERATED VI PROMPT v1 -->',
  end: '<!-- END GENERATED VI PROMPT v1 -->'
};
export const digest = value => createHash('sha256').update(value).digest('hex');
const read = (root, path) => readFileSync(resolve(root, path), 'utf8');

/** Remove only our owned prefix. English guidance and API fences retain every byte. */
export function englishPrompt(source) {
  const starts = source.split(languageFence.begin).length - 1;
  const ends = source.split(languageFence.end).length - 1;
  if (!starts && !ends) return source;
  assert(starts === 1 && ends === 1 && source.startsWith(languageFence.begin), 'Ambiguous prompt language fence');
  const stop = source.indexOf(languageFence.end) + languageFence.end.length;
  assert(source.slice(stop).startsWith('\n'), 'Missing language-prefix separator');
  return source.slice(stop + 1);
}
export function authoredPrompt(source) {
  const parts = promptParts(englishPrompt(source));
  return parts.before + parts.after;
}

/** Existing examples are literal; only non-fenced prose paragraphs are translated. */
export function proseParts(body) {
  const parts = body.split(/(^```[^\n]*\n[\s\S]*?^```[ \t]*$)/gm);
  assert(parts.filter((_, index) => index % 2).every(part => part.startsWith('```')), 'Invalid code-fence projection');
  for (let index = 0; index < parts.length; index += 2) {
    assert(!/^\s*(?:```|~~~)/m.test(parts[index]), 'Unsupported or unclosed code fence');
  }
  return parts;
}
export function promptMembership(root) {
  const manifest = JSON.parse(read(root, '_ds_manifest.json'));
  const paths = [...new Set(manifest.components.filter(entry => entry.kind === 'component').map(entry => entry.sourcePath.replace(/\.jsx$/, '.prompt.md')))].sort();
  assert(paths.length > 0, 'Empty component prompt inventory');
  const actual = [];
  const walk = path => {
    const stat = lstatSync(resolve(root, path));
    assert(!stat.isSymbolicLink(), 'Symlink prompt source: ' + path);
    if (stat.isDirectory()) for (const name of readdirSync(resolve(root, path)).sort()) walk(path + '/' + name);else if (path.endsWith('.prompt.md')) actual.push(path);
  };
  walk('components');
  assert.deepEqual(actual.sort(), paths, 'Every authored component prompt must belong to the public component inventory');
  return paths;
}
function inlineCode(source) {
  return [...source.matchAll(/`([^`\n]+)`/g)].map(match => match[1]).sort();
}
export function projectPrompt(root, path, source, record, blocks) {
  assert.equal(record.path, path);
  const english = englishPrompt(source),
    body = authoredPrompt(english);
  assert.equal(record.authoredSha256, digest(body), 'Unreviewed English prompt drift: ' + path);
  const seen = [];
  const translated = proseParts(body).map((part, index) => {
    if (index % 2) return part;
    return part.split(/(\n\s*\n)/).map(piece => {
      const text = piece.trim();
      if (!text) return piece;
      const key = digest(text),
        row = blocks[key];
      assert(row && row.source === text && typeof row.vi === 'string' && row.vi.trim(), 'Missing Vietnamese translation: ' + path + ' ' + key);
      assert(row.vi !== text || row.translationMethod === 'preserved-authored-vi' && /[À-ỹĐđ]/u.test(text), 'Untranslated Vietnamese prose: ' + path + ' ' + key);
      assert(!row.vi.includes(languageFence.begin) && !row.vi.includes(languageFence.end) && !row.vi.includes('```'), 'Translation cannot inject owned fences');
      assert.deepEqual(inlineCode(row.vi), inlineCode(text), 'Technical inline-code drift: ' + path + ' ' + key);
      seen.push(key);
      return piece.replace(text, row.vi);
    }).join('');
  }).join('');
  assert.deepEqual(seen, record.blocks, 'Prompt paragraph membership/order drift: ' + path);
  assert.deepEqual(proseParts(translated).filter((_, i) => i % 2), proseParts(body).filter((_, i) => i % 2), 'Code examples must remain literal');
  const prefix = [languageFence.begin, '## Tiếng Việt', '', '<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->', translated.trim(), '', '## English', languageFence.end, ''].join('\n');
  return {
    output: prefix + english,
    keys: seen
  };
}
export function generatePromptLanguages(root, {
  check = false
} = {}) {
  const inventory = JSON.parse(read(root, 'scripts/prompt-language-source.json'));
  assert.equal(inventory.schemaVersion, 1);
  const paths = promptMembership(root);
  assert.deepEqual(inventory.prompts.map(row => row.path), paths, 'Missing, extra or reordered prompt language entries');
  const used = new Set(),
    owners = new Map(),
    outputs = [];
  for (const [key, row] of Object.entries(inventory.blocks)) {
    assert.equal(digest(row.source), key, 'Translation source key drift');
    assert(['reviewed-exact-contract-template', 'authored-faithful-vi', 'preserved-authored-vi'].includes(row.translationMethod), 'Unknown translation review method');
  }
  for (const record of inventory.prompts) {
    const source = read(root, record.path);
    const projection = projectPrompt(root, record.path, source, record, inventory.blocks);
    for (const key of projection.keys) {
      used.add(key);
      if (!owners.has(key)) owners.set(key, []);
      owners.get(key).push(record.path);
    }
    outputs.push({
      path: record.path,
      source,
      output: projection.output
    });
  }
  assert.deepEqual([...used].sort(), Object.keys(inventory.blocks).sort(), 'Orphan translation or missing paragraph');
  for (const [key, paths] of owners) assert.deepEqual(inventory.blocks[key].owners, paths, 'Translation owner membership drift');
  const changed = outputs.filter(row => row.source !== row.output);
  if (check) assert.equal(changed.length, 0, 'Stale Vietnamese prompt projection: ' + changed.map(row => row.path).join(', '));else for (const row of changed) writeFileSync(resolve(root, row.path), row.output);
  return {
    prompts: paths.length,
    translatedParagraphs: used.size,
    changed: changed.length
  };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2),
    at = args.indexOf('--root');
  const root = at < 0 ? resolve(dirname(fileURLToPath(import.meta.url)), '..') : resolve(args[at + 1]);
  console.log(JSON.stringify(generatePromptLanguages(root, {
    check: args.includes('--check')
  })));
}
