import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { buildComponentCssEntries } from '../../scripts/lib/component-css-entries.mjs';
import { componentStylesheets } from '../../styles/components/compose.mjs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { mount, sheet, snapshot, installSettlement, fixtureComponents, proofInputs } from './lib/component-css-browser.mjs';
const root = new URL('../../', import.meta.url);
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const fixtures = JSON.parse(readFileSync(new URL('scripts/fixtures/static-html-reference.json', root))).components;
const {
  manifest,
  outputs
} = buildComponentCssEntries(root.pathname);
for (const [path, text] of outputs) assert.equal(readFileSync(new URL(path, root), 'utf8'), text, 'Stale projection before browser proof');
const evidenceInputs = proofInputs(root.pathname);
let browserVersion;
const results = [];
const keyNames = new Set(['Button', 'TextField', 'Checkbox', 'RadioGroup', 'Switch', 'Toggle', 'SegmentedControl', 'Tabs', 'Menu', 'Popover', 'Tooltip', 'Combobox', 'DatePicker', 'TagInput', 'Drawer', 'AlertDialog', 'Skeleton', 'ProgressBar', 'FileUpload', 'Card', 'DataTable', 'TreeTable', 'Cascader', 'Carousel', 'Tree']);
const configurations = [{
  name: 'default'
}, {
  name: 'dark',
  theme: 'dark'
}, {
  name: 'compact',
  density: 'compact'
}, {
  name: 'coarse',
  coarse: true
}, {
  name: 'reduced',
  reduced: true
}, {
  name: 'forced',
  forced: true,
  reduced: true
}, {
  name: 'element-variant-high',
  theme: 'dark',
  element: 'thuy',
  variant: 'ocean',
  contrast: 'high',
  density: 'compact'
}, {
  name: 'system-dark',
  theme: 'system',
  colorScheme: 'dark'
}];
for (const config of configurations) {
  await withBrowserFixture(async page => {
    browserVersion = page.context().browser().version();
    await installSettlement(page);
    let projection = '',
      sequence = 0;
    await page.route('**/styles/components/fixture.css?*', route => route.fulfill({
      contentType: 'text/css',
      body: projection
    }));
    await page.clock.setFixedTime(new Date('2026-10-20T00:00:00Z'));
    await page.evaluate(config => {
      document.documentElement.dataset.theme = config.theme || 'light';
      document.documentElement.setAttribute('data-cs-density', config.density || 'comfortable');
      document.documentElement.setAttribute('data-cs-contrast', config.contrast || 'standard');
      document.documentElement.setAttribute('data-cs-style', 'liquid-glass');
      if (config.element) document.documentElement.setAttribute('data-cs-element', config.element);
      if (config.variant) document.documentElement.setAttribute('data-cs-variant', config.variant);
    }, config);
    const actual = await page.evaluate(() => ({
      density: getComputedStyle(document.documentElement).getPropertyValue('--cs-density-space-2').trim(),
      coarse: matchMedia('(pointer: coarse)').matches,
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      forced: matchMedia('(forced-colors: active)').matches
    }));
    assert.deepEqual(actual, {
      density: config.density === 'compact' ? '6px' : '8px',
      coarse: !!config.coarse,
      reduced: !!config.reduced,
      forced: !!config.forced
    });
    if (config.element) {
      const accent = await page.evaluate(() => {
        const probe = document.createElement('span');
        probe.style.color = 'var(--cs-accent)';
        document.body.appendChild(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      });
      assert.notEqual(accent, 'rgb(244, 186, 23)', 'Actual water/ocean scope must differ from default ochre');
    }
    for (const fixture of config.name === 'default' ? fixtures : fixtures.filter(item => keyNames.has(item.name))) {
      const names = fixtureComponents(fixture);
      const sheets = componentStylesheets(names);
      projection = sheets.map(path => '@import url("../../' + path + '");').join('\n');
      await sheet(page, '/styles.css');
      await mount(page, fixture);
      await page.evaluate(() => settleInPage());
      const before = await snapshot(page);
      assert(before.length, 'Fixture must actually mount');
      await sheet(page, '/styles/components/fixture.css?v=' + ++sequence);
      const after = await snapshot(page);
      try {
        assert.deepEqual(after, before, `${browserName}/${config.name}/${fixture.name}: component sheet closure changed computed styles`);
      } catch (error) {
        mkdirSync('test-results/component-css', {
          recursive: true
        });
        writeFileSync(`test-results/component-css/${browserName}-failure.json`, JSON.stringify({
          config,
          fixture: fixture.name,
          names,
          sheets,
          before,
          after
        }, null, 2));
        throw error;
      }
      results.push({
        config: config.name,
        component: fixture.name,
        entries: names,
        sheets: sheets.length,
        nodes: before.length,
        status: 'PASS'
      });
      if (results.length % 30 === 0) console.log(browserName, config.name, results.length);
    }
  }, {
    browserName,
    contextOptions: {
      colorScheme: config.colorScheme || 'light',
      hasTouch: !!config.coarse,
      reducedMotion: config.reduced ? 'reduce' : 'no-preference',
      forcedColors: config.forced ? 'active' : 'none',
      viewport: {
        width: 1280,
        height: 900
      }
    }
  });
}
const final = buildComponentCssEntries(root.pathname).manifest;
assert.deepEqual(final.sourceInputs, manifest.sourceInputs, 'Source drift during component CSS proof');
assert.deepEqual(proofInputs(root.pathname), evidenceInputs, 'Rendered bundle/runtime/fixture/test drift during CSS proof');
mkdirSync('test-results/component-css', {
  recursive: true
});
writeFileSync(`test-results/component-css/${browserName}.json`, JSON.stringify({
  status: 'PASS',
  browserName,
  browserVersion,
  evidenceInputs,
  sourceInputs: manifest.sourceInputs,
  results,
  scope: '120 actual static reference mounts plus key axes; composed fixture children use explicit ordered unions. All computed noncustom properties and all before/after pseudo properties. No selector pruning, manual visual/AT certification, or arbitrary caller-class closure.'
}, null, 2) + '\n');
console.log('PASS ' + browserName + ' component CSS ' + results.length + ' comparisons');
