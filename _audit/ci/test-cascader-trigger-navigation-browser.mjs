import assert from 'node:assert/strict';
import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const rows = [],
  guardRows = [],
  runtime = {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    browsers: {},
    react: {}
  };
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  runtime.browsers[browserName] = page.context().browser().version();
  runtime.react[browserName] = await page.evaluate(() => React.version);
  for (const lang of ['en', 'vi']) for (const nested of [false, true]) for (const openKey of ['Enter', 'Space', 'ArrowDown']) {
    await page.evaluate(({
      lang,
      nested
    }) => {
      renderFixture(null);
      window.cascaderEntrySelections = [];
      window.cascaderEntryParentCloses = 0;
      window.cascaderEntryPreventNext = false;
      window.cascaderEntryEvent = null;
      window.removeCascaderEntryRecorder?.();
      const recorder = e => {
        if (e.key === 'ArrowDown') window.cascaderEntryEvent = {
          isTrusted: e.isTrusted,
          isComposing: e.isComposing,
          keyCode: e.keyCode,
          defaultPrevented: e.defaultPrevented
        };
      };
      window.addEventListener('keydown', recorder);
      window.removeCascaderEntryRecorder = () => window.removeEventListener('keydown', recorder);
      const h = React.createElement,
        field = h(CS.Cascader, {
          lang,
          label: 'Cascader keyboard entry',
          nodes: [{
            key: 'alpha',
            label: 'Alpha',
            children: [{
              key: 'alpha-1',
              label: 'Alpha child'
            }]
          }, {
            key: 'beta',
            label: 'Beta'
          }],
          onChange: p => cascaderEntrySelections.push(p)
        });
      const content = h('div', {
        onKeyDownCapture: e => {
          if (window.cascaderEntryPreventNext && e.key === 'ArrowDown') e.preventDefault();
        }
      }, field);
      renderFixture(nested ? h(CS.Dialog, {
        open: true,
        title: 'Keyboard entry parent',
        lang,
        onClose: () => cascaderEntryParentCloses++
      }, content) : content);
    }, {
      lang,
      nested
    });
    const trigger = page.getByRole('button', {
      name: 'Cascader keyboard entry',
      exact: true
    });
    await trigger.focus();
    await page.keyboard.press(openKey);
    await page.getByRole('listbox').first().waitFor();
    const read = () => page.evaluate(() => ({
      activeRole: document.activeElement.getAttribute('role'),
      activeClass: document.activeElement.className,
      activeText: document.activeElement.textContent,
      activeLabel: document.activeElement.getAttribute('aria-label'),
      listboxes: document.querySelectorAll('[role=listbox]').length,
      selections: cascaderEntrySelections,
      parentCloses: cascaderEntryParentCloses,
      event: cascaderEntryEvent
    }));
    const opened = await read();
    for (const flag of ['isComposing', 'keyCode229', 'prevented']) {
      await page.evaluate(flag => {
        cascaderEntryPreventNext = flag === 'prevented';
        const init = {
          key: 'ArrowDown',
          bubbles: true,
          cancelable: true
        };
        if (flag === 'isComposing') init.isComposing = true;
        if (flag === 'keyCode229') init.keyCode = 229;
        document.activeElement.dispatchEvent(new KeyboardEvent('keydown', init));
        cascaderEntryPreventNext = false;
      }, flag);
      const guarded = await read();
      const failed = guarded.activeClass !== opened.activeClass || guarded.activeText !== opened.activeText || guarded.listboxes !== opened.listboxes || guarded.parentCloses !== 0 || guarded.selections.length !== 0 || guarded.event.isTrusted !== false || guarded.event.defaultPrevented !== (flag === 'prevented');
      guardRows.push({
        browserName,
        lang,
        nested,
        openKey,
        flag,
        opened,
        guarded,
        failed
      });
    }
    await page.keyboard.press('ArrowDown');
    const after = await read();
    await page.keyboard.press('Escape');
    await page.getByRole('listbox').first().waitFor({
      state: 'detached'
    });
    const returned = await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Cascader keyboard entry', null, {
      timeout: 3000
    }).then(() => true).catch(() => false);
    const escaped = await read();
    rows.push({
      browserName,
      lang,
      nested,
      openKey,
      opened,
      after,
      escaped,
      returned,
      failed: after.activeRole !== 'option' || after.activeText !== 'Alpha ›' || after.parentCloses !== 0 || after.selections.length !== 0 || !returned || escaped.parentCloses !== 0
    });
    await page.evaluate(() => {
      renderFixture(null);
      removeCascaderEntryRecorder();
    });
  }
}, {
  browserName
});
const paths = ['components/forms/Cascader.jsx', '_audit/ci/test-cascader-key-guards-browser.mjs', '_audit/ci/lib/browser-fixture.mjs', '_audit/ci/test-cascader-trigger-navigation-browser.mjs', '_ds_bundle.js'];
const source = Object.fromEntries(paths.map(p => [p, createHash('sha256').update(readFileSync(new URL('../../' + p, import.meta.url))).digest('hex')]));
const report = {
  recordedAt: new Date().toISOString(),
  runtime,
  source,
  cases: rows.length + guardRows.length,
  nativeEntryCases: rows.length,
  openTriggerGuardCases: guardRows.length,
  failures: [...rows, ...guardRows].filter(r => r.failed).length,
  rows,
  guardRows,
  rootWrites: false,
  scope: 'Keyboard opening followed by ArrowDown from actual received focus; 3 engines x EN/VI x standalone/nested x Enter/Space/ArrowDown. No option focus injection after opening; no speech or human acceptance claim.'
};
if (process.env.CS_CASCADER_ENTRY_REPORT) writeFileSync(process.env.CS_CASCADER_ENTRY_REPORT, JSON.stringify(report, null, 2) + '\n');
assert.equal(report.nativeEntryCases, 36);
assert.equal(report.openTriggerGuardCases, 108);
console.log(JSON.stringify({
  cases: report.cases,
  nativeEntryCases: report.nativeEntryCases,
  openTriggerGuardCases: report.openTriggerGuardCases,
  failures: report.failures,
  runtime
}));
assert.equal(report.failures, 0, 'Cascader keyboard entry must reach options and preserve guards without injected focus');
