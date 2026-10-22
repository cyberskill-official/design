import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { buildComponentCssEntries } from '../../scripts/lib/component-css-entries.mjs';
import { componentStylesheets } from '../../styles/components/compose.mjs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { sheet, snapshot, installSettlement, proofInputs } from './lib/component-css-browser.mjs';
const root = new URL('../../', import.meta.url);
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const {
  manifest,
  outputs
} = buildComponentCssEntries(root.pathname);
for (const [path, text] of outputs) assert.equal(readFileSync(new URL(path, root), 'utf8'), text, 'Stale CSS entry before interactions');
const names = ['Card', 'Button', 'TextField', 'Checkbox', 'SegmentedControl', 'Combobox', 'Popover', 'TagInput'];
const selectedSheets = componentStylesheets(names);
const evidenceInputs = proofInputs(root.pathname);
let browserVersion;
const results = [];
const configs = [{
  name: 'fine-light'
}, {
  name: 'fine-dark',
  theme: 'dark'
}, {
  name: 'coarse',
  coarse: true
}, {
  name: 'forced',
  forced: true
}];
for (const config of configs) {
  await withBrowserFixture(async page => {
    browserVersion = page.context().browser().version();
    await installSettlement(page);
    let activeSheets = selectedSheets,
      sequence = 0;
    await page.route('**/styles/components/interactions.css?*', route => route.fulfill({
      contentType: 'text/css',
      body: activeSheets.map(path => '@import url("../../' + path + '");').join('\n')
    }));
    await page.evaluate(config => {
      document.documentElement.dataset.theme = config.theme || 'light';
      const h = React.createElement;
      function Fixture() {
        const [value, setValue] = React.useState('a');
        return h('div', {
          'data-component-fixture': ''
        }, h(CS.Card, {
          title: 'Composed card'
        }, h(CS.Button, {
          id: 'css-action'
        }, 'CSS action')), h(CS.Button, {
          disabled: true
        }, 'Disabled action'), h(CS.TextField, {
          label: 'Invalid field',
          error: 'Required value',
          'aria-invalid': true
        }), h(CS.Checkbox, {
          label: 'Disabled checkbox',
          disabled: true
        }), h(CS.TagInput, {
          label: 'Disabled tags',
          value: ['retained'],
          disabled: true
        }), h(CS.SegmentedControl, {
          'aria-label': 'Choice',
          value,
          onChange: setValue,
          options: [{
            value: 'a',
            label: 'Alpha'
          }, {
            value: 'b',
            label: 'Beta'
          }]
        }), h(CS.Combobox, {
          label: 'Portaled choice',
          options: [{
            value: 'a',
            label: 'One'
          }, {
            value: 'b',
            label: 'Two'
          }]
        }), h(CS.Popover, {
          label: 'Popup action'
        }, h('input', {
          'aria-label': 'Popup input',
          defaultValue: 'entered'
        })), h('span', {
          id: 'css-hidden',
          className: 'cs-sr-only'
        }, 'Accessible text'));
      }
      renderFixture(h(Fixture));
    }, config);
    assert.equal(await page.evaluate(() => matchMedia('(pointer: coarse)').matches), !!config.coarse);
    assert.equal(await page.evaluate(() => matchMedia('(forced-colors: active)').matches), !!config.forced);
    assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true);
    async function compare(name) {
      await page.evaluate(() => settleInPage());
      const before = await snapshot(page);
      const current = await page.locator('link[rel="stylesheet"]').getAttribute('href');
      await sheet(page, current === '/styles.css' ? '/styles/components/interactions.css?v=' + ++sequence : '/styles.css');
      const after = await snapshot(page);
      assert.deepEqual(after, before, browserName + '/' + config.name + '/' + name);
      results.push({
        config: config.name,
        state: name,
        nodes: before.length,
        status: 'PASS'
      });
    }
    const button = page.getByRole('button', {
      name: 'CSS action',
      exact: true
    });
    await button.focus();
    assert.equal(await button.evaluate(el => el.matches(':focus-visible')), true);
    assert.notEqual(await button.evaluate(el => getComputedStyle(el).outlineStyle), 'none');
    assert.equal(await page.getByRole('button', {
      name: 'Disabled action'
    }).isDisabled(), true);
    assert.equal(await page.getByText('Required value', {
      exact: true
    }).count(), 1);
    await compare('native-focus-disabled-error-committed-tags');
    await button.hover();
    await compare('actual-hover');
    const combo = page.getByRole('combobox', {
      name: 'Portaled choice',
      exact: true
    });
    await combo.focus();
    await page.keyboard.press('ArrowDown');
    await page.getByRole('listbox').waitFor();
    const panel = page.locator('[data-cs-floating-root]').filter({
      has: page.getByRole('option', {
        name: 'Two',
        exact: true
      })
    });
    assert.equal(await panel.count(), 1);
    assert.equal(await panel.evaluate(el => el.parentElement === document.body), true);
    await compare('open-highlighted-body-portal');
    await page.keyboard.press('Escape');
    assert.equal(await combo.getAttribute('aria-expanded'), 'false');
    const radios = page.getByRole('radio');
    await radios.first().focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await radios.nth(1).getAttribute('aria-checked'), 'true');
    await compare('actual-keyboard-selected-radio');
    if (config.coarse) {
      const sizes = await radios.evaluateAll(elements => elements.map(el => ({
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height
      })));
      assert(sizes.every(size => size.width >= 44 && size.height >= 44));
    }
    // A real missing dependency must fail the same computed-style oracle.
    await sheet(page, '/styles.css');
    await page.evaluate(() => settleInPage());
    const complete = await snapshot(page);
    activeSheets = selectedSheets.filter(path => path !== 'base/controls.css');
    await sheet(page, '/styles/components/interactions.css?v=' + ++sequence);
    await assert.rejects(async () => assert.deepEqual(await snapshot(page), complete), undefined, 'Removing actual control dependency must change computed paint/geometry');
    activeSheets = selectedSheets;
    await sheet(page, '/styles/components/interactions.css?v=' + ++sequence);
    assert.deepEqual(await snapshot(page), complete, 'Restored closure returns exact computed values');
    results.push({
      config: config.name,
      state: 'missing-controls-negative',
      status: 'PASS'
    });
  }, {
    browserName,
    contextOptions: {
      hasTouch: !!config.coarse,
      forcedColors: config.forced ? 'active' : 'none',
      reducedMotion: 'reduce',
      viewport: {
        width: 1280,
        height: 900
      }
    }
  });
}
assert.deepEqual(buildComponentCssEntries(root.pathname).manifest.sourceInputs, manifest.sourceInputs, 'Source drift during interaction proof');
assert.deepEqual(proofInputs(root.pathname), evidenceInputs, 'Rendered bundle/runtime/fixture/test drift during CSS proof');
mkdirSync('test-results/component-css', {
  recursive: true
});
writeFileSync(`test-results/component-css/${browserName}-interactions.json`, JSON.stringify({
  status: 'PASS',
  browserName,
  browserVersion,
  evidenceInputs,
  sourceInputs: manifest.sourceInputs,
  entries: names,
  results,
  scope: 'Actual native focus, hover, disabled/error states, selected radio, body portal, fine/coarse/forced/reduced contexts and missing-controls negative. No manual visual/AT acceptance.'
}, null, 2) + '\n');
console.log('PASS ' + browserName + ' component CSS ' + results.length + ' interaction/negative comparisons');
