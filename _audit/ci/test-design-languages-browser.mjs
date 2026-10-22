import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
for (const browserName of process.env.CS_TEST_BROWSER ? [process.env.CS_TEST_BROWSER] : ['chromium', 'firefox', 'webkit']) {
  await withBrowserFixture(async page => {
    const base = new URL(page.url()).origin;
    const verdict = async () => {
      await page.goto(base + '/_audit/design-md-parity.html');
      await page.waitForFunction(() => window.__designmd);
      return page.evaluate(() => window.__designmd);
    };
    const good = await verdict();
    assert.equal(good.pass, true, JSON.stringify(good));
    const pattern = '**/docs/vi/entrypoints/DESIGN.md';
    await page.route(pattern, async route => {
      const response = await route.fetch();
      const source = await response.text();
      assert(source.includes('Không ánh xạ lại'));
      await route.fulfill({response, body: source.replace('Không ánh xạ lại', 'Cho phép ánh xạ lại')});
    });
    const proseDrift = await verdict();
    assert.equal(proseDrift.pass, false, 'A translated immutable-rule change must fail the real browser gate');
    assert(proseDrift.failed.includes('byte-identical to a fresh regeneration'));
    await page.unroute(pattern);
    await page.route(pattern, async route => {
      const response = await route.fetch();
      const source = await response.text();
      const changed = source.replace(/^(\| `--cs-[^`]+` \| `)[^`]+`/m, '$1wrong-value`');
      assert.notEqual(changed, source);
      await route.fulfill({response, body: changed});
    });
    const valueDrift = await verdict();
    assert.equal(valueDrift.pass, false, 'A VI-only token mutation must fail');
    assert(valueDrift.failed.includes('every DTCG token value quoted in DESIGN.md matches'));
    console.log('PASS ' + browserName + ' shared DESIGN gate: current EN/VI pass; actual VI immutable prose and token-value mutations reject');
  }, {browserName});
}
