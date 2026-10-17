import assert from 'node:assert/strict';
import { applyTheme } from './lib/pixel-theme.mjs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  for (const mode of ['missing-api', 'null-root', 'missing-root', 'ignored-update', 'nested-only', 'throwing-update']) {
    await page.setContent('<main data-sc-name="Fixture"><section data-theme="light">'+(mode === 'nested-only' ? '<aside data-theme="dark">Nested</aside>' : '')+'</section></main>');
    await page.evaluate(mode => {
      delete window.__dcRootName; delete window.__dcSetProps;
      if (mode === 'missing-api') return;
      window.__dcRootName = () => mode === 'null-root' ? null : mode === 'missing-root' ? 'Absent' : 'Fixture';
      window.__dcSetProps = () => { if (mode === 'throwing-update') throw Error('Injected setter failure'); };
    }, mode);
    await assert.rejects(applyTheme(page, 'dark', { timeout: 200 }), mode + ' must fail before capture');
    assert.equal(await page.locator('section').getAttribute('data-theme'), 'light');
  }
  await page.evaluate(() => {
    window.__dcRootName = () => 'Fixture';
    window.__dcSetProps = (_, { theme }) => setTimeout(() => document.querySelector('section').setAttribute('data-theme', theme), 50);
  });
  await applyTheme(page, 'dark');
  assert.equal(await page.locator('section').getAttribute('data-theme'), 'dark');
  await applyTheme({}, undefined); // Un-themed targets do not require a DC runtime.

  await page.goto(origin + '/templates/dashboard/Dashboard.dc.html', { waitUntil: 'networkidle' });
  await applyTheme(page, 'dark');
  assert.equal(await page.locator('[data-sc-name] > [data-theme]').first().getAttribute('data-theme'), 'dark');
  await applyTheme(page, 'light');
  assert.equal(await page.locator('[data-sc-name] > [data-theme]').first().getAttribute('data-theme'), '');
});
console.log('PASS pixel theme prerequisites: six rejected failure states, delayed application, un-themed target, real Dashboard dark/light');
