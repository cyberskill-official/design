import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

// Constructor flags are application-handler proxies, not trusted physical IME sessions.
const modes = ['Dialog', 'AlertDialog', 'Drawer', 'CommandPalette', 'emptyDialog', 'context', 'nestedContext', 'portalContext'];
const rows = [], runtime = { node: process.version, browsers: {}, reactVersions: {} };
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  runtime.browsers[browserName] = page.context().browser().version();
  runtime.reactVersions[browserName] = await page.evaluate(() => React.version);
  async function cleanup() {
    await page.evaluate(() => { renderFixture(null); document.getElementById('composition-portal')?.remove(); });
    assert.equal(await page.locator('[aria-modal=true], [role=menu]').count(), 0);
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  }
  async function mount(mode, lang) {
    await cleanup();
    await page.evaluate(({ mode, lang }) => {
      window.compositionCloses = 0;
      window.compositionSelections = [];
      const h = React.createElement;
      const inputs = h(React.Fragment, null,
        h('input', { id: 'composition-first', 'aria-label': 'Composition first', defaultValue: 'Đang viết' }),
        h('input', { id: 'composition-second', 'aria-label': 'Composition second' }));
      const menu = h(React.Fragment, null,
        h('button', { id: 'composition-before' }, 'Before'),
        h(CS.ContextMenu, { lang, items: [{ label: 'Copy', onSelect: () => compositionSelections.push('Copy') }, '-', { label: 'Paste', onSelect: () => compositionSelections.push('Paste') }] }, h('span', null, 'Context content')),
        h('button', { id: 'composition-after' }, 'After'));
      let element;
      if (mode === 'context') element = menu;
      else if (mode === 'portalContext') {
        const host = document.createElement('div');
        host.id = 'composition-portal'; host.style.cssText = 'position:fixed;top:20px;left:20px;z-index:calc(var(--cs-depth-modal) + 1)';
        document.body.append(host);
        element = h(CS.Dialog, { open: true, title: 'Composition parent', lang, onClose: () => compositionCloses++ },
          h('button', { id: 'composition-parent-action' }, 'Parent action'), ReactDOM.createPortal(menu, host));
      } else if (mode === 'nestedContext') element = h(CS.Dialog, { open: true, title: 'Composition parent', lang, onClose: () => compositionCloses++ }, menu);
      else if (mode === 'emptyDialog') element = h(CS.Dialog, { open: true, title: 'Empty composition parent', lang });
      else if (mode === 'AlertDialog') element = h(CS.AlertDialog, { open: true, title: 'Composition alert', lang, onOpenChange: () => compositionCloses++, onConfirm: () => compositionSelections.push('Confirm') }, inputs);
      else if (mode === 'CommandPalette') element = h(CS.CommandPalette, { open: true, lang, onClose: () => compositionCloses++, groups: [{ label: 'Actions', items: [{ label: 'Copy', onSelect: () => compositionSelections.push('Copy') }, { label: 'Paste' }] }] });
      else element = h(CS[mode], { open: true, title: 'Composition parent', lang, onClose: () => compositionCloses++ }, inputs);
      renderFixture(element);
      if (mode === 'CommandPalette') document.querySelector('.cs-cmdk__search input').id = 'composition-first';
    }, { mode, lang });
    if (mode.endsWith('Context') || mode === 'context') {
      await page.locator('.cs-ctxmenu-zone').focus();
      await page.locator('.cs-ctxmenu-zone').press('Shift+F10');
      await page.getByRole('menu').waitFor();
      await page.waitForFunction(() => document.activeElement?.textContent === 'Copy');
    } else if (mode === 'emptyDialog') await page.getByRole('dialog').focus();
    else await page.locator('#composition-first').focus();
  }
  async function dispatch(key, flag, shiftKey) {
    return page.evaluate(async ({ key, flag, shiftKey }) => {
      const target = document.activeElement;
      const event = new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true, isComposing: flag === 'composing', keyCode: flag === 'key229' ? 229 : 0 });
      const dispatched = target.dispatchEvent(event);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      ReactDOM.flushSync(() => {});
      return { key: event.key, isComposing: event.isComposing, keyCode: event.keyCode, isTrusted: event.isTrusted,
        defaultPrevented: event.defaultPrevented, dispatched, sameFocus: document.activeElement === target,
        menus: document.querySelectorAll('[role=menu]').length, closes: compositionCloses, selections: compositionSelections };
    }, { key, flag, shiftKey });
  }
  for (const lang of ['en', 'vi']) for (const mode of modes) {
    const menuMode = mode.endsWith('Context') || mode === 'context';
    for (const flag of ['composing', 'key229']) for (const shiftKey of [false, true]) {
      await mount(mode, lang);
      const observation = await dispatch('Tab', flag, shiftKey);
      assert.equal(observation.isTrusted, false);
      assert.equal(observation.isComposing, flag === 'composing');
      assert.equal(observation.keyCode, flag === 'key229' ? 229 : 0);
      assert.equal(observation.sameFocus, true, `${browserName}/${lang}/${mode}/${flag}: flagged Tab preserves focus`);
      assert.equal(observation.defaultPrevented, false, 'focus handlers leave composition-flagged Tab uncanceled');
      assert.equal(observation.dispatched, true);
      assert.equal(observation.menus, menuMode ? 1 : 0);
      assert.equal(observation.closes, 0); assert.deepEqual(observation.selections, []);
      rows.push({ browserName, lang, mode, flag, shiftKey, case: 'flagged Tab', observation });
    }
    for (const flag of ['composing', 'key229']) {
      await mount(mode, lang);
      const observation = await dispatch('Escape', flag, false);
      assert.equal(observation.sameFocus, true);
      assert.equal(observation.defaultPrevented, false);
      assert.equal(observation.menus, menuMode ? 1 : 0);
      assert.equal(observation.closes, 0); assert.deepEqual(observation.selections, []);
      rows.push({ browserName, lang, mode, flag, case: 'existing flagged Escape', observation });
    }
    for (const shiftKey of [false, true]) {
      await mount(mode, lang);
      await page.evaluate(() => { window.compositionTabOrigin = document.activeElement; });
      await page.keyboard.press((shiftKey ? 'Shift+' : '') + (browserName === 'webkit' ? 'Alt+Tab' : 'Tab'));
      if (menuMode) await page.getByRole('menu').waitFor({ state: 'detached' });
      const observation = await page.evaluate(() => ({ sameFocus: compositionTabOrigin === document.activeElement,
        activeId: document.activeElement.id, activeIsZone: document.activeElement.matches(".cs-ctxmenu-zone"), connected: document.activeElement.isConnected,
        modalOrOwnedPortal: !!document.activeElement.closest('[aria-modal=true], #composition-portal'),
        menus: document.querySelectorAll('[role=menu]').length, closes: compositionCloses, selections: compositionSelections }));
      assert.equal(observation.connected, true);
      assert.equal(observation.sameFocus, mode === 'emptyDialog');
      assert.equal(observation.menus, 0);
      assert.equal(observation.closes, 0); assert.deepEqual(observation.selections, []);
      if (mode !== 'context') assert.equal(observation.modalOrOwnedPortal, true);
      if (mode === 'context' || mode === 'nestedContext') {
        if (shiftKey) assert.equal(observation.activeIsZone, true, 'reverse Tab lands on the actual context zone');
        else assert.equal(observation.activeId, 'composition-after');
      }
      rows.push({ browserName, lang, mode, shiftKey, case: 'ordinary native Tab', observation });
    }
    await cleanup();
  }
  console.log(`${browserName}: ${rows.filter(row => row.browserName === browserName).length} overlay composition/control cases passed`);
}, { browserName });
assert.equal(rows.length, 384);
const report = { recordedAt: new Date().toISOString(), actualState: 'completed', cases: rows.length,
  flaggedTabCases: 192, existingFlaggedEscapeControls: 96, ordinaryNativeTabControls: 96, rows, runtime,
  scope: 'Finite EN/VI application handling of synthetic isComposing/keyCode229 events and ordinary native Tab across four modal families, empty Dialog, standalone/nested/portalled ContextMenu. Not trusted physical OS IME, candidate selection, AT, device or human acceptance.' };
if (process.env.CS_COMPOSITION_REPORT) writeFileSync(process.env.CS_COMPOSITION_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log('PASS 384 overlay composition/control cases; flagged-event handler proxies, physical IME acceptance remains separate');
