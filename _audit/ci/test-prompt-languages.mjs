import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { generatePromptLanguages, authoredPrompt, englishPrompt, digest, languageFence, projectPrompt } from '../../scripts/generate-prompt-languages.mjs';
const temp = mkdtempSync(join(tmpdir(), 'cs-prompt-language-'));
const source = '**Example** — a native input. Preserve `value`.\n\n```jsx\n<Example value="English fixture" />\n```\n\nKeyboard: Enter submits.\n\n';
const translated = ['**Example** — một ô nhập native. Giữ nguyên `value`.', 'Bàn phím: Enter gửi.'];
const blocks = [source.split('\n\n')[0], 'Keyboard: Enter submits.'];
const paths = ['components/one/Example.prompt.md', 'components/two/Other.prompt.md'];
const write = (path, value) => {
  mkdirSync(join(temp, path, '..'), {
    recursive: true
  });
  writeFileSync(join(temp, path), value);
};
const inventory = {
  schemaVersion: 1,
  prompts: paths.map(path => ({
    path,
    authoredSha256: digest(source),
    blocks: blocks.map(digest)
  })),
  blocks: Object.fromEntries(blocks.map((text, index) => [digest(text), {
    source: text,
    vi: translated[index],
    translationMethod: 'authored-faithful-vi',
    owners: paths
  }]))
};
const install = value => write('scripts/prompt-language-source.json', JSON.stringify(value));
const reset = () => {
  for (const path of paths) write(path, source);
  install(inventory);
};
const rejected = (label, mutate, pattern) => {
  reset();
  const changed = structuredClone(inventory);
  mutate(changed);
  install(changed);
  const before = paths.map(path => readFileSync(join(temp, path), 'utf8'));
  assert.throws(() => generatePromptLanguages(temp), pattern, label);
  assert.deepEqual(paths.map(path => readFileSync(join(temp, path), 'utf8')), before, label + ' must write no prompt');
};
try {
  write('_ds_manifest.json', JSON.stringify({
    components: [{
      name: 'Example',
      kind: 'component',
      sourcePath: 'components/one/Example.jsx'
    }, {
      name: 'Other',
      kind: 'component',
      sourcePath: 'components/two/Other.jsx'
    }]
  }));
  const shortSource = 'See `source.md`.\n';
  const shortBlock = shortSource.trim(),
    shortKey = digest(shortBlock);
  const short = projectPrompt(temp, paths[0], shortSource, {
    path: paths[0],
    authoredSha256: digest(shortSource),
    blocks: [shortKey]
  }, {
    [shortKey]: {
      source: shortBlock,
      vi: 'Xem `source.md`.',
      translationMethod: 'authored-faithful-vi'
    }
  });
  assert(short.output.includes('Xem `source.md`.'), 'Valid short Vietnamese need not contain a diacritic or padding');
  reset();
  assert.equal(generatePromptLanguages(temp).changed, 2);
  for (const path of paths) {
    const actual = readFileSync(join(temp, path), 'utf8');
    assert(actual.startsWith(languageFence.begin));
    assert.equal(englishPrompt(actual), source, 'Every original English byte remains literal');
    assert.equal(authoredPrompt(actual), source);
    assert(actual.includes('```jsx\n<Example value="English fixture" />\n```'));
    assert(actual.indexOf('## Tiếng Việt') < actual.indexOf('## English'));
  }
  assert.equal(generatePromptLanguages(temp, {
    check: true
  }).changed, 0);
  assert.equal(generatePromptLanguages(temp).changed, 0);
  rejected('missing prompt', value => value.prompts.pop(), /prompt language entries/);
  rejected('missing prose translation', value => delete value.blocks[digest(blocks[1])], /Missing Vietnamese/);
  rejected('empty translation', value => {
    value.blocks[digest(blocks[1])].vi = ' ';
  }, /Missing Vietnamese/);
  rejected('English fallback', value => {
    value.blocks[digest(blocks[1])].vi = blocks[1];
  }, /Untranslated/);
  rejected('English relabeled as preserved VI', value => {
    value.blocks[digest(blocks[1])].vi = blocks[1];
    value.blocks[digest(blocks[1])].translationMethod = 'preserved-authored-vi';
  }, /Untranslated/);
  rejected('technical token drift', value => {
    value.blocks[digest(blocks[0])].vi = translated[0].replace('`value`', '`defaultValue`');
  }, /inline-code drift/);
  rejected('fence injection', value => {
    value.blocks[digest(blocks[1])].vi += '\n```jsx\n<button />\n```';
  }, /inject owned fences/);
  rejected('owner drift', value => {
    value.blocks[digest(blocks[1])].owners = [paths[0]];
  }, /owner membership/);
  rejected('unknown review method', value => {
    value.blocks[digest(blocks[1])].translationMethod = 'unreviewed';
  }, /review method/);
  rejected('orphan translation', value => {
    value.blocks[digest('unknown')] = {
      source: 'unknown',
      vi: 'Không dùng',
      translationMethod: 'authored-faithful-vi',
      owners: []
    };
  }, /Orphan translation/);
  reset();
  write(paths[1], source + 'Future guidance.\n');
  const prior = readFileSync(join(temp, paths[0]), 'utf8');
  assert.throws(() => generatePromptLanguages(temp), /English prompt drift/);
  assert.equal(readFileSync(join(temp, paths[0]), 'utf8'), prior, 'Late drift is atomic across prompts');
  reset();
  const unclosed = source + '```jsx\n<Example />\n';
  write(paths[1], unclosed);
  const brokenFence = structuredClone(inventory);
  brokenFence.prompts[1].authoredSha256 = digest(unclosed);
  install(brokenFence);
  assert.throws(() => generatePromptLanguages(temp), /Unsupported or unclosed code fence/);
  assert.equal(readFileSync(join(temp, paths[0]), 'utf8'), source, 'Unclosed code failure writes no earlier output');
  reset();
  write('components/extra/Unregistered.prompt.md', source);
  assert.throws(() => generatePromptLanguages(temp), /public component inventory/);
  rmSync(join(temp, 'components/extra'), {
    recursive: true
  });
  reset();
  assert.throws(() => generatePromptLanguages(temp, {
    check: true
  }), /Stale Vietnamese/);
  assert.throws(() => englishPrompt(languageFence.begin + '\n' + source), /Ambiguous/);
  const outside = join(temp, 'outside.md');
  writeFileSync(outside, 'outside sentinel');
  rmSync(join(temp, paths[0]));
  symlinkSync(outside, join(temp, paths[0]));
  assert.throws(() => generatePromptLanguages(temp), /Symlink prompt/);
  assert.equal(readFileSync(outside, 'utf8'), 'outside sentinel');
  console.log('PASS VI-first prompt projection: exact English/code preservation, idempotence, complete membership and 16 atomic drift/translation/ownership counterproofs');
} finally {
  rmSync(temp, {
    recursive: true,
    force: true
  });
}
if (process.argv.includes('--current')) console.log(JSON.stringify(generatePromptLanguages(resolve('.'), {
  check: true
})));
