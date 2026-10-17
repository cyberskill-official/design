import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
await withBrowserFixture(async page => {
  await page.evaluate(() => {
    const h = React.createElement;
    function App() {
      const [open, setOpen] = React.useState(true);
      return h(CS.Dialog, { open, title: 'Tooltip host', onClose: () => setOpen(false) },
        h('p', { id: 'help' }, 'Existing help'),
        h(CS.Tooltip, { label: 'First description' }, h('button', { id: 'first', 'aria-describedby': 'help' }, 'First')),
        h(CS.Tooltip, { label: 'Second description' }, h('button', { id: 'second' }, 'Second')));
    }
    renderFixture(h(App));
  });
  const first = page.locator('#first');
  await first.focus();
  const ids = (await first.getAttribute('aria-describedby')).split(' ');
  assert.equal(ids[0], 'help');
  assert.equal(ids.length, 2);
  assert.notEqual(ids[1], await page.locator('#second').getAttribute('aria-describedby'));
  assert.equal(await page.getByRole('tooltip').textContent(), 'First description');
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('tooltip').count(), 0);
  assert.equal(await page.getByRole('dialog').count(), 1, 'Tooltip Escape preserves Dialog');
  assert.ok(await first.evaluate(el => el === document.activeElement), 'Escape leaves trigger focus');
  await page.locator('#second').focus();
  assert.equal(await page.getByRole('tooltip').textContent(), 'Second description');
  await page.keyboard.press('Escape');
  await first.hover();
  await page.getByRole('tooltip').waitFor();
  await page.getByRole('tooltip').hover();
  assert.equal(await page.getByRole('tooltip').count(), 1, 'bubble remains hoverable');
  await page.mouse.move(0, 0);
  assert.equal(await page.getByRole('tooltip').count(), 0);
  assert.deepEqual((await first.getAttribute('aria-describedby')).split(' '), ids, 'IDs stable across reopening');
}, { browserName: process.env.CS_TEST_BROWSER || 'chromium' });
console.log('PASS Tooltip: descriptions, unique/stable IDs, focus, hoverable bubble, Escape and nested Dialog');
