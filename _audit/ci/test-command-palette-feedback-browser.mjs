import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

const browserName = process.env.CS_BROWSER || 'chromium';
const baselineBundle = process.argv.find(arg => arg.startsWith('--baseline-bundle='))?.slice('--baseline-bundle='.length);
let cases = 0;
await withBrowserFixture(async page => {
  if (baselineBundle) await page.addScriptTag({ content: readFileSync(baselineBundle, 'utf8') });
  for (const width of [320, 390, 1280]) for (const theme of ['light', 'dark']) for (const lang of ['en', 'vi']) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(({ theme, lang }) => {
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('data-theme', theme);
      window.commandSelections = [];
      const h = React.createElement;
      function App() {
        const [open, setOpen] = React.useState(false);
        const [groups, setGroups] = React.useState([
          { label: 'First', items: [{ label: 'Alpha', onSelect: () => commandSelections.push('Alpha') }, { label: 'Beta' }] },
          { label: 'Second', items: [{ label: 'Gamma' }] },
        ]);
        window.setCommandGroups = setGroups;
        return h(React.Fragment, null,
          h('button', { id: 'open-palette', onClick: () => setOpen(true) }, 'Open palette'),
          h(CS.CommandPalette, { open, onClose: () => setOpen(false), groups }));
      }
      renderFixture(h(App));
    }, { theme, lang });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme), theme, 'declared theme is actually applied');
    await page.locator('#open-palette').focus();
    await page.keyboard.press('Enter');
    const input = page.locator('.cs-cmdk__search input');
    await input.waitFor();
    assert.equal(await page.getByRole('status').count(), 1, 'result feedback is exposed');
    const status = page.getByRole('status');
    assert.equal(await status.getAttribute('aria-live'), 'polite');
    assert.equal(await status.getAttribute('aria-atomic'), 'true');
    assert.equal(await status.isVisible(), true, 'feedback is visible for all users');
    await page.evaluate(() => { window.commandStatusNode = document.querySelector('[role="status"]'); });
    const plural = lang === 'vi' ? '3 kết quả' : '3 results';
    const single = lang === 'vi' ? '1 kết quả' : '1 result';
    const empty = lang === 'vi' ? 'Không có kết quả' : 'No results';
    assert.equal(await status.textContent(), plural);
    await input.fill(' BETA ');
    assert.equal(await page.locator('.cs-cmdk__item').count(), 1, 'case and whitespace normalization retained');
    assert.equal(await page.locator('.cs-cmdk__item').textContent(), 'Beta');
    assert.equal(await status.textContent(), single);
    await input.fill('zzz');
    assert.equal(await page.locator('.cs-cmdk__item').count(), 0);
    assert.equal(await status.textContent(), empty);
    assert.equal(await input.evaluate(el => document.activeElement === el), true, 'filtering retains search focus');
    assert.equal(await page.evaluate(() => document.querySelector('[role="status"]') === commandStatusNode), true, 'status region persists across updates');
    await page.keyboard.press('Tab');
    assert.equal(await input.evaluate(el => document.activeElement === el), true, 'empty palette has a contained search tab stop');
    await page.keyboard.press('Shift+Tab');
    assert.equal(await input.evaluate(el => document.activeElement === el), true);
    await page.evaluate(() => document.documentElement.setAttribute('lang', document.documentElement.lang === 'vi' ? 'en' : 'vi'));
    await page.waitForFunction(text => document.querySelector('[role="status"]')?.textContent === text, lang === 'vi' ? 'No results' : 'Không có kết quả');
    await page.evaluate(() => ReactDOM.flushSync(() => setCommandGroups([])));
    await input.fill('');
    assert.equal(await status.textContent(), lang === 'vi' ? 'No results' : 'Không có kết quả', 'empty data is distinguished from populated results');
    await page.evaluate(() => ReactDOM.flushSync(() => setCommandGroups([{ items: [{ label: 'Alpha', onSelect: () => commandSelections.push('Alpha') }] }])));
    assert.equal(await status.textContent(), lang === 'vi' ? '1 result' : '1 kết quả', 'live data updates the count');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Alpha');
    await page.keyboard.press('Enter');
    assert.deepEqual(await page.evaluate(() => commandSelections), ['Alpha'], 'selection emits once');
    assert.equal(await page.getByRole('dialog').count(), 0, 'selection closes the palette');
    await page.waitForFunction(() => document.activeElement.id === 'open-palette');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'open-palette');
    await page.keyboard.press('Enter');
    await page.getByRole('dialog').waitFor();
    assert.equal(await page.getByRole('status').count(), 1, 'reopening creates exactly one status region');
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').count(), 0);
    await page.waitForFunction(() => document.activeElement.id === 'open-palette');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'open-palette');
    assert.equal(await status.count(), 0, 'closed content unmounts');
    await page.evaluate(() => renderFixture(null));
    cases++;
  }
}, { browserName });
console.log(`PASS CommandPalette feedback (${browserName}): ${cases} EN/VI, theme and width cases; empty, singular/plural, live language/data, search focus, keyboard selection, dismissal and reopen. No screen-reader speech certification.`);
