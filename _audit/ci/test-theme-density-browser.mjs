import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
await withBrowserFixture(async page => {
  const variants = [['tho', ''], ['tho', 'clay'], ['tho', 'sand'], ['hoa', ''], ['hoa', 'lava'], ['hoa', 'plasma'], ['thuy', ''], ['thuy', 'ocean'], ['thuy', 'mist'], ['moc', ''], ['moc', 'bamboo'], ['moc', 'forest'], ['kim', ''], ['kim', 'steel'], ['kim', 'titanium']];
  const failures = [];
  for (const colorScheme of ['light', 'dark']) for (const contrast of ['no-preference', 'more']) {
    await page.emulateMedia({
      colorScheme,
      contrast
    });
    const result = await page.evaluate(({
      variants,
      colorScheme
    }) => {
      const host = document.getElementById('fixture');
      const densityKeys = ['--cs-density-space-1', '--cs-density-space-2', '--cs-density-space-3', '--cs-density-space-4', '--cs-density-space-5', '--cs-density-space-6', '--cs-density-control-gap', '--cs-component-button-gap', ...['xs', 'sm', 'md', 'lg'].flatMap(size => ['X', 'Y'].map(axis => `--cs-component-button-${size}-padding${axis}`)), '--cs-component-textfield-paddingX', '--cs-component-textfield-paddingY'];
      const compare = (left, right, keys) => keys.flatMap(key => {
        const a = getComputedStyle(left).getPropertyValue(key).trim(),
          b = getComputedStyle(right).getPropertyValue(key).trim();
        return a === b ? [] : [{
          key,
          actual: a,
          expected: b
        }];
      });
      const results = [];
      for (const [element, variant] of variants) for (const theme of ['light', 'dark', 'system']) {
        host.innerHTML = `<div data-theme="${theme}" data-cs-element="${element}" data-cs-variant="${variant}">
          <div id="comfortable"></div>
          <div data-cs-density="compact"><div id="reset" data-cs-density="comfortable"><div id="leaf"></div><div id="compact-again" data-cs-density="compact"></div></div><div id="inherit"></div></div>
          <div id="compact" data-cs-density="compact"></div></div>
          <div id="system" data-theme="system" data-cs-element="${element}" data-cs-variant="${variant}"></div>
          <div id="explicit" data-theme="${colorScheme}" data-cs-element="${element}" data-cs-variant="${variant}"></div>`;
        const get = id => host.querySelector('#' + id);
        const reset = compare(get('reset'), get('comfortable'), densityKeys);
        const leaf = compare(get('leaf'), get('comfortable'), densityKeys);
        const compact = compare(get('compact-again'), get('compact'), densityKeys);
        const inherit = compare(get('inherit'), get('compact'), densityKeys);
        const parity = compare(get('system'), get('explicit'), ['--cs-color-text-muted', '--cs-color-border-default', '--cs-color-text-primary', '--cs-accent-strong', '--cs-component-button-primary-bg', '--cs-component-button-primary-fg']);
        results.push({
          theme,
          element,
          variant,
          reset,
          leaf,
          compact,
          inherit,
          parity
        });
      }
      return results;
    }, {
      variants,
      colorScheme
    });
    for (const row of result) if (['reset', 'leaf', 'compact', 'inherit', 'parity'].some(k => row[k].length)) failures.push({
      colorScheme,
      contrast,
      ...row
    });
  }
  if (failures.length) console.log(JSON.stringify(failures));
  assert.equal(failures.length, 0, 'Density reset/inheritance and explicit/system dark parity failed; details above');
}, {
  browserName: process.env.CS_TEST_BROWSER || 'chromium'
});
console.log('PASS density: complete reset, inheritance and compact re-entry; explicit/system parity across 15 variants, three theme hosts, both OS schemes and contrast preferences (180 scenarios)');
