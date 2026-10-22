import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../../', import.meta.url));
const {
  withBrowserFixture
} = await import('./lib/browser-fixture.mjs');
const rows = [];
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  for (const kind of ['zero', 'string', 'rich', 'empty', 'false', 'null']) {
    const actual = await page.evaluate(kind => {
      let label = kind === 'zero' ? 0 : kind === 'string' ? 'or' : kind === 'rich' ? React.createElement('strong', null, 'or') : kind === 'empty' ? '' : kind === 'false' ? false : null;
      renderFixture(React.createElement(CS.Divider, {
        label
      }));
      let el = document.getElementById('fixture').firstElementChild;
      return {
        tag: el.tagName,
        text: el.textContent,
        role: el.getAttribute('role'),
        className: el.className
      };
    }, kind);
    const expected = ['zero', 'string', 'rich'].includes(kind) ? {
      tag: 'DIV',
      text: kind === 'zero' ? '0' : 'or'
    } : {
      tag: 'HR',
      text: ''
    };
    rows.push({
      browserName,
      kind,
      actual,
      expected,
      pass: actual.tag === expected.tag && actual.text === expected.text
    });
  }
}, {
  browserName
});
const sha = p => createHash('sha256').update(readFileSync(join(root, p))).digest('hex'),
  failures = rows.filter(x => !x.pass).length;
const report = {
  recordedAt: new Date().toISOString(),
  sourceRoot: root,
  sourceFiles: Object.fromEntries(['components/data/Divider.jsx', 'components/data/Divider.d.ts', 'components/data/Divider.prompt.md', '_ds_bundle.js', '_audit/ci/lib/browser-fixture.mjs'].map(p => [p, sha(p)])),
  cases: rows.length,
  failures,
  exitCode: failures ? 1 : 0,
  rows,
  scope: 'Actual zero/string/rich/empty label rendering in three engines. Only numeric-zero failure is at issue; no exhaustive ARIA, visual or manual acceptance.'
};
console.log(JSON.stringify({
  cases: rows.length,
  failures
}));
process.exitCode = report.exitCode;
