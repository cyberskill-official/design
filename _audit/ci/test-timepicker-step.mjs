import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { buildSync } from 'esbuild';
import { parseFragment } from 'parse5';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const args = process.argv.slice(2);
assert(args.every(arg => arg === '--ssr-only' || /^--browser=(chromium|firefox|webkit)$/.test(arg)), 'Unknown option');
const browserName = args.find(arg => arg.startsWith('--browser='))?.split('=')[1] || 'chromium';
const cases = [
  // Keep the formerly accepted fraction first: it reproduces the failure
  // without needing to run a pathological tiny-step loop on the old source.
  { name: 'fraction', expression: '0.5', count: 48, last: '23:30' },
  { name: 'tiny fraction', expression: '1e-12', count: 48, last: '23:30' },
  { name: 'fraction above one', expression: '1.5', count: 48, last: '23:30' },
  { name: 'zero', expression: '0', count: 48, last: '23:30' },
  { name: 'negative', expression: '-5', count: 48, last: '23:30' },
  { name: 'not a number', expression: 'NaN', count: 48, last: '23:30' },
  { name: 'positive infinity', expression: 'Infinity', count: 48, last: '23:30' },
  { name: 'negative infinity', expression: '-Infinity', count: 48, last: '23:30' },
  { name: 'beyond a day', expression: '1441', count: 48, last: '23:30' },
  { name: 'default', expression: 'undefined', count: 48, last: '23:30' },
  { name: 'one minute', expression: '1', count: 1440, last: '23:59' },
  { name: 'nondividing integer', expression: '7', count: 206, last: '23:55' },
  { name: 'quarter hour', expression: '15', count: 96, last: '23:45' },
  { name: 'half hour', expression: '30', count: 48, last: '23:30' },
  { name: 'whole day', expression: '1440', count: 1, last: '00:00' },
];
function checkOptions(values, item, environment) {
  const label = `${environment}: ${item.name}`;
  assert.equal(values.length, item.count, label + ' option count');
  assert.equal(values[0], '00:00', label + ' first option');
  assert.equal(values.at(-1), item.last, label + ' last option');
  assert.equal(new Set(values).size, values.length, label + ' duplicate options');
  assert(values.every(value => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)), label + ' valid HH:MM values');
  assert(values.every((value, i) => !i || values[i - 1] < value), label + ' chronological order');
}

const temporary = mkdtempSync(join(tmpdir(), 'cs-timepicker-step-'));
try {
  const runner = join(temporary, 'render.cjs');
  // Run each source-render case in a bounded child so a regression cannot hang
  // the parent suite or consume unbounded memory before its assertion runs.
  const built = buildSync({
    stdin: {
      contents: `import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import { TimePicker } from './components/forms/TimePicker.jsx';
const values = [${cases.map(item => item.expression).join(',')}];
process.stdout.write(renderToStaticMarkup(React.createElement(TimePicker, { step: values[Number(process.argv[2])], lang: 'en' })));`,
      resolveDir: root, loader: 'js',
    },
    bundle: true, platform: 'node', format: 'cjs', write: false,
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  writeFileSync(runner, built.outputFiles[0].contents);
  for (const [index, item] of cases.entries()) {
    const result = spawnSync(process.execPath, ['--max-old-space-size=128', runner, String(index)], {
      encoding: 'utf8', timeout: 5000, maxBuffer: 2 * 1024 * 1024,
    });
    assert.equal(result.status, 0, `SSR ${item.name}: render must finish within bounds: ${result.error || result.stderr}`);
    const values = [];
    const visit = node => {
      if (node.tagName === 'option') values.push(node.attrs.find(attr => attr.name === 'value')?.value);
      for (const child of node.childNodes || []) visit(child);
    };
    visit(parseFragment(result.stdout));
    checkOptions(values, item, 'source SSR');
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
console.log(`PASS TimePicker source SSR: ${cases.length} bounded step cases with valid ordered HH:MM output`);

if (!args.includes('--ssr-only')) {
  await withBrowserFixture(async page => {
    // Install only known numeric cases in the page; no evaluation of user data.
    await page.evaluate(values => {
      window.timeSteps = values.map(value => value === 'NaN' ? NaN : value === 'Infinity' ? Infinity : value === '-Infinity' ? -Infinity : value === 'undefined' ? undefined : Number(value));
      window.timeChanges = [];
    }, cases.map(item => item.expression));
    for (const [index, item] of cases.entries()) {
      await page.evaluate(index => renderFixture(React.createElement(CS.TimePicker, {
        step: timeSteps[index], lang: 'en', value: '00:00', onChange: value => timeChanges.push(value),
      })), index);
      const values = await page.locator('option').evaluateAll(options => options.map(option => option.value));
      checkOptions(values, item, browserName + ' bundle');
      assert.equal(await page.locator('select').inputValue(), '00:00');
    }
    await page.evaluate(() => renderFixture(React.createElement(CS.TimePicker, {
      step: 15, value: '09:00', lang: 'en', onChange: value => timeChanges.push(value),
    })));
    await page.getByRole('combobox', { name: 'Time', exact: true }).selectOption('10:15');
    assert.deepEqual(await page.evaluate(() => timeChanges), ['10:15'], 'Selection emits one HH:MM value');
    assert.equal(await page.locator('select').inputValue(), '09:00', 'Controlled value awaits parent acceptance');
    await page.evaluate(() => renderFixture(React.createElement(CS.TimePicker, {
      step: 15, value: '10:15', disabled: true, lang: 'en',
    })));
    assert.equal(await page.locator('select').inputValue(), '10:15', 'Parent update controls selection');
    assert(await page.locator('select').isDisabled(), 'Native disabled behavior preserved');
  }, { browserName });
  console.log(`PASS TimePicker ${browserName}: ${cases.length} bundle cases, callback/controlled selection and disabled state`);
}
