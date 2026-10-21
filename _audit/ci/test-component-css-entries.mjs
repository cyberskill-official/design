import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { buildComponentCssEntries } from '../../scripts/lib/component-css-entries.mjs';
import { componentCssReader } from '../../scripts/lib/component-css-graph.mjs';
import { projectComponentCssEntries } from '../../scripts/generate-component-css-entries.mjs';
const root = new URL('../../', import.meta.url).pathname;
const {
  manifest
} = buildComponentCssEntries(root);
const scratch = mkdtempSync(join(tmpdir(), 'cs-component-css-'));
const results = [];
const localeObservations = [];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function record(name, run) {
  run();
  results.push({
    name,
    status: 'PASS'
  });
}
function mutate(path, transform, run) {
  const absolute = join(scratch, path),
    original = readFileSync(absolute);
  writeFileSync(absolute, transform(original.toString()));
  try {
    run();
  } finally {
    writeFileSync(absolute, original);
  }
}
function sourceMutation(path, transform, run) {
  mutate(path, transform, () => mutate('components/api-index.json', text => {
    const index = JSON.parse(text);
    for (const entry of index.exports.filter(entry => entry.sourcePath === path)) entry.sourceSha256 = sha(readFileSync(join(scratch, path)));
    return JSON.stringify(index);
  }, run));
}
try {
  for (const path of Object.keys(manifest.sourceInputs)) {
    mkdirSync(dirname(join(scratch, path)), {
      recursive: true
    });
    cpSync(join(root, path), join(scratch, path));
  }
  const original = projectComponentCssEntries(scratch);
  record('120 independent source exports and strict original order', () => {
    assert.equal(Object.keys(manifest.components).length, 120);
    for (const row of Object.values(manifest.components)) {
      assert.deepEqual(row.sheets, manifest.sourceOrder.filter(path => row.sheets.includes(path)));
      assert(manifest.sharedSheets.every(path => row.sheets.includes(path)));
      assert(row.sourceSheetBytes <= manifest.fullSourceSheetBytes);
    }
    assert(Object.values(manifest.components).some(row => row.sourceSheetBytes < manifest.fullSourceSheetBytes));
  });
  record('idempotence and checked output membership', () => {
    assert.deepEqual(projectComponentCssEntries(scratch, {
      check: true
    }).outputs, original.outputs);
  });
  record('byte-exact generation under requested locales and forbidden localeCompare', () => {
    const producer = pathToFileURL(join(root, 'scripts/lib/component-css-entries.mjs')).href;
    const worker = `import {buildComponentCssEntries} from ${JSON.stringify(producer)};
      import {createHash} from 'node:crypto';
      String.prototype.localeCompare = () => {throw new Error('Locale-sensitive comparison forbidden');};
      const {outputs} = buildComponentCssEntries(${JSON.stringify(scratch)});
      console.log(JSON.stringify({locale: Intl.DateTimeFormat().resolvedOptions().locale,
        sha256: createHash('sha256').update(outputs.get('styles/components/manifest.json')).digest('hex')}));`;
    const expected = sha(original.outputs.get('styles/components/manifest.json'));
    const observations = [];
    for (const locale of ['en_US.UTF-8', 'cs_CZ.UTF-8']) {
      const result = spawnSync(process.execPath, ['--input-type=module', '-e', worker], {
        env: {...process.env, LC_ALL: locale}, encoding: 'utf8',
      });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      const observed = JSON.parse(result.stdout);
      assert.equal(observed.sha256, expected, 'Locale must not reorder projection bytes');
      observations.push({requested: locale, ...observed});
    }
    // Keep the actual resolved locales, including platforms that retain one
    // system locale. The throwing localeCompare control remains unconditional.
    localeObservations.push(...observations);
  });
  record('missing and stale outputs rejected', () => {
    const path = 'styles/components/Button.css';
    mutate(path, text => text + '/* stale */', () => assert.throws(() => projectComponentCssEntries(scratch, {
      check: true
    }), /Stale/));
    const bytes = readFileSync(join(scratch, path));
    rmSync(join(scratch, path));
    assert.throws(() => projectComponentCssEntries(scratch, {
      check: true
    }), /Missing/);
    writeFileSync(join(scratch, path), bytes);
  });
  record('unknown output rejected before existing bytes change', () => {
    const path = join(scratch, 'styles/components/unowned.css');
    writeFileSync(path, 'unowned');
    const before = readFileSync(join(scratch, 'styles/components/Button.css'));
    assert.throws(() => projectComponentCssEntries(scratch), /Unexpected/);
    assert.deepEqual(readFileSync(join(scratch, 'styles/components/Button.css')), before);
    rmSync(path);
  });
  record('unknown owned class construction becomes explicit full fallback', () => {
    sourceMutation('components/button/Button.jsx', text => text.replace('className={', 'className={window.arbitraryClass + '), () => {
      const row = buildComponentCssEntries(scratch).manifest.components.Button;
      assert.equal(row.kind, 'full-fallback');
      assert(row.fallbacks.some(item => item.reason.includes('Unresolved')));
      assert.deepEqual(row.sheets, manifest.sourceOrder);
    });
  });
  record('opaque React props constructor becomes full fallback', () => {
    sourceMutation('components/button/Button.jsx', text => text + '\nReact.createElement(\"div\", window.makeClasses());\n', () => {
      assert.equal(buildComponentCssEntries(scratch).manifest.components.Button.kind, 'full-fallback');
    });
  });
  record('opaque HTML insertion becomes explicit full fallback', () => {
    sourceMutation('components/button/Button.jsx', text => text + '\nReact.createElement(\"div\", {dangerouslySetInnerHTML: {__html: window.opaqueHtml}});\n', () => {
      assert.equal(buildComponentCssEntries(scratch).manifest.components.Button.kind, 'full-fallback');
    });
  });
  record('internal rest destructuring is not mislabeled as caller class input', () => {
    sourceMutation('components/button/Button.jsx', text => text + '\nconst {ignored, ...generated} = window.ownedAttributes; React.createElement(\"div\", generated);\n', () => {
      assert.equal(buildComponentCssEntries(scratch).manifest.components.Button.kind, 'full-fallback');
    });
  });
  record('dynamic imports become explicit full fallback', () => {
    sourceMutation('components/button/Button.jsx', text => text + '\nimport(window.componentModule);\n', () => {
      assert.equal(buildComponentCssEntries(scratch).manifest.components.Button.kind, 'full-fallback');
    });
  });
  record('reviewed merger drift becomes full fallback', () => {
    mutate('components/_utils/field-association.js', text => text + '\n// class-flow review drift\n', () => {
      assert.equal(buildComponentCssEntries(scratch).manifest.components.Avatar.kind, 'full-fallback');
    });
  });
  record('cx class construction contract drift cannot silently pass', () => {
    mutate('components/_utils/cx.js', text => text.replace('c.filter(Boolean).join(" ")', 'window.customClasses(c)'), () => {
      assert.equal(buildComponentCssEntries(scratch).manifest.components.Button.kind, 'full-fallback');
    });
  });
  record('missing API source member and source hash drift rejected', () => {
    mutate('components/api-index.json', text => {
      const data = JSON.parse(text);
      data.exports = data.exports.filter(entry => entry.name !== 'Button');
      return JSON.stringify(data);
    }, () => assert.throws(() => buildComponentCssEntries(scratch), /membership/));
    mutate('components/button/Button.jsx', text => text + '\n', () => assert.throws(() => buildComponentCssEntries(scratch), /hash is stale/));
  });
  record('new optional global selector promotes entire sheet into foundation', () => {
    mutate('base/ai.css', text => text + '\n.cs-existing, :is(.cs-x, body) { --component-test: 1; }\n', () => {
      const data = buildComponentCssEntries(scratch).manifest;
      assert(data.sharedSheets.includes('base/ai.css'));
      assert(data.sharedReasons.some(row => row.path === 'base/ai.css'));
      assert(Object.values(data.components).every(row => row.sheets.includes('base/ai.css')));
    });
  });
  record('global property registration promotes its entire sheet', () => {
    mutate('base/ai.css', text => text + '\n@property --registered-test { syntax: \"<number>\"; inherits: true; initial-value: 1; }\n', () => {
      const data = buildComponentCssEntries(scratch).manifest;
      assert(data.sharedSheets.includes('base/ai.css'));
      assert(data.sharedReasons.some(row => row.atRules.includes('@property')));
    });
  });
  record('shared class and custom-property/keyframe dependencies close whole sheets', () => {
    mutate('base/ai.css', text => text + '\n.cs-button { --cs-extra-test: 1; animation-name: fixture-key; }\n', () => {
      mutate('base/feedback.css', text => text + '\n.cs-test { color: var(--cs-extra-test); }\n@keyframes fixture-key { from { opacity: 0; } to { opacity: 1; } }\n', () => {
        const data = buildComponentCssEntries(scratch).manifest.components.Button;
        assert(data.sheets.includes('base/ai.css'));
        assert(data.sheets.includes('base/feedback.css'));
      });
    });
  });
  record('unknown manifest import or nested import fails closed', () => {
    mutate('styles.css', text => text + '\n@import url("https://example.com/a.css");\n', () => assert.throws(() => buildComponentCssEntries(scratch), /Unowned/));
    mutate('base/ai.css', text => text + '\n@import url("extra.css");\n', () => assert.throws(() => buildComponentCssEntries(scratch), /Unmodeled/));
  });
  record('input traversal and symlink rejected', () => {
    const reader = componentCssReader(scratch);
    for (const path of ['../outside', '/etc/passwd', 'base/../styles.css', 'base\\ai.css', './styles.css']) assert.throws(() => reader.read(path), /Unsafe/);
    const path = join(scratch, 'base/ai.css'),
      bytes = readFileSync(path);
    rmSync(path);
    symlinkSync(join(scratch, 'base/data.css'), path);
    assert.throws(() => buildComponentCssEntries(scratch), /symlink/);
    rmSync(path);
    writeFileSync(path, bytes);
  });
  record('output symlink rejected before any write', () => {
    const path = join(scratch, 'styles/components/Button.css'),
      bytes = readFileSync(path);
    rmSync(path);
    symlinkSync(join(scratch, 'styles/components/Card.css'), path);
    assert.throws(() => projectComponentCssEntries(scratch), /Unsafe/);
    rmSync(path);
    writeFileSync(path, bytes);
  });
  const compose = await import(pathToFileURL(join(scratch, 'styles/components/compose.mjs')));
  record('dependency-free ordered composition and invalid names', () => {
    const paths = compose.componentStylesheets(['Button', 'Card', 'Button']);
    const expected = new Set([...manifest.components.Button.sheets, ...manifest.components.Card.sheets]);
    assert.deepEqual(paths, manifest.sourceOrder.filter(path => expected.has(path)));
    assert.deepEqual(compose.componentStylesheets([]), manifest.sharedSheets);
    for (const input of [['__proto__'], ['constructor'], ['Missing'], [3], 'Button']) assert.throws(() => compose.componentStylesheets(input), /Unknown|array/);
  });
  record('all asset bytes included and mutations invalidate freshness', () => {
    assert(manifest.assets.length > 0);
    for (const path of manifest.assets) assert.equal(manifest.sourceInputs[path], sha(readFileSync(join(root, path))));
    const path = manifest.assets[0];
    const original = readFileSync(join(scratch, path));
    writeFileSync(join(scratch, path), Buffer.concat([original, Buffer.from([0])]));
    assert.throws(() => projectComponentCssEntries(scratch, {
      check: true
    }), /Stale/);
    writeFileSync(join(scratch, path), original);
  });
  mkdirSync(join(root, 'test-results/component-css'), {
    recursive: true
  });
  writeFileSync(join(root, 'test-results/component-css/static.json'), JSON.stringify({
    status: 'PASS',
    nodeVersion: process.version,
    testSha256: sha(readFileSync(new URL(import.meta.url))),
    localeObservations,
    sourceInputs: manifest.sourceInputs,
    results
  }, null, 2) + '\n');
  console.log('PASS component CSS entries: ' + results.length + ' meaningful contract/mutation checks');
} finally {
  rmSync(scratch, {
    recursive: true,
    force: true
  });
}
