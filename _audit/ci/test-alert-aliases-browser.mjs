import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.env.CS_TEST_BROWSER || process.env.CS_BROWSER || 'chromium';
const cases = [
  { props: {}, destructive: false },
  { props: { tone: 'default' }, destructive: false },
  { props: { tone: 'destructive' }, destructive: true },
  { props: { variant: 'default' }, destructive: false },
  { props: { variant: 'destructive' }, destructive: true },
  { props: { tone: 'default', variant: 'destructive' }, destructive: false },
  { props: { tone: 'destructive', variant: 'default' }, destructive: true },
  { props: { tone: 'destructive', variant: 'destructive' }, destructive: true },
  { props: { tone: 'default', variant: 'default' }, destructive: false },
];
const rows = [];
await withBrowserFixture(async page => {
  for (const lang of ['en', 'vi']) for (const [index, sample] of cases.entries()) {
    await page.evaluate(({ sample, index, lang }) => {
      window.aliasEvents = [];
      renderFixture(React.createElement(CS.AlertDialog, {
        ...sample.props, key: lang + index, lang, defaultOpen: true,
        title: 'Alias decision', description: 'The canonical tone wins.',
        onConfirm: () => aliasEvents.push('confirm'),
        onCancel: () => aliasEvents.push('cancel'),
        onOpenChange: value => aliasEvents.push(value),
      }));
    }, { sample, index, lang });
    const panel = page.getByRole('alertdialog', { name: 'Alias decision' });
    await panel.waitFor({ state: 'visible' });
    const expected = sample.destructive ? '.cs-alert-dialog__cancel' : '.cs-alert-dialog__confirm';
    await page.waitForFunction(selector => document.activeElement?.matches(selector), expected);
    assert.equal(await panel.evaluate(node => node.classList.contains('cs-alert-dialog--destructive')), sample.destructive);
    const confirm = panel.locator('.cs-alert-dialog__confirm');
    assert.equal(await confirm.evaluate(node => node.classList.contains('cs-button--danger')), sample.destructive);
    const action = index % 3;
    if (action === 0) await confirm.click();
    else if (action === 1) await panel.locator('.cs-alert-dialog__cancel').click();
    else await page.keyboard.press('Escape');
    await panel.waitFor({ state: 'detached' });
    assert.deepEqual(await page.evaluate(() => aliasEvents), [false, action === 0 ? 'confirm' : 'cancel']);
    rows.push({ lang, props: sample.props, destructive: sample.destructive, initialFocus: expected, action: ['confirm', 'cancel', 'Escape'][action] });
  }
}, { browserName });
const paths = ['components/overlays/AlertDialog.jsx', 'components/overlays/AlertDialog.d.ts', 'components/overlays/AlertDialog.prompt.md', '_ds_bundle.js', '_audit/ci/test-alert-aliases-browser.mjs'];
mkdirSync('test-results/alert-aliases', { recursive: true });
writeFileSync(`test-results/alert-aliases/${browserName}.json`, JSON.stringify({ status: 'PASS', browserName, rows, inputHashes: Object.fromEntries(paths.map(path => [path, createHash('sha256').update(readFileSync(path)).digest('hex')])) }, null, 2) + '\n');
console.log(`PASS ${browserName} AlertDialog alias precedence: ${rows.length} EN/VI combinations, danger paint, initial focus and native confirm/cancel/Escape callbacks`);
