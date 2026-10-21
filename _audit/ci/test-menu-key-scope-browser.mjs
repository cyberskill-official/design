import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const rows = [],
  controls = [],
  tabClosures = [],
  runtime = {
    node: process.version,
    browsers: {},
    reactVersions: {}
  };
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  runtime.browsers[browserName] = page.context().browser().version();
  runtime.reactVersions[browserName] = await page.evaluate(() => React.version);
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  async function mount(lang, nested) {
    await page.evaluate(({
      lang,
      nested
    }) => {
      renderFixture(null);
      window.menuScopeCloses = 0;
      window.menuScopeSelections = [];
      window.menuScopeKeyEvent = null;
      window.removeMenuScopeRecorder?.();
      const recorder = e => {
        if (e.target.id === 'menu-neighbor' && ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) menuScopeKeyEvent = {
          key: e.key,
          isTrusted: e.isTrusted,
          isComposing: e.isComposing,
          keyCode: e.keyCode,
          defaultPrevented: e.defaultPrevented
        };
      };
      window.addEventListener('keydown', recorder);
      window.removeMenuScopeRecorder = () => window.removeEventListener('keydown', recorder);
      const h = React.createElement;
      const content = h(React.Fragment, null, h(CS.Menu, {
        lang,
        trigger: h('button', {
          id: 'menu-scope-opener'
        }, 'Open menu')
      }, h(CS.MenuItem, {
        onClick: () => menuScopeSelections.push('Alpha')
      }, 'Alpha'), h(CS.MenuItem, {
        onClick: () => menuScopeSelections.push('Beta')
      }, 'Beta')), h('textarea', {
        id: 'menu-neighbor',
        'aria-label': 'Neighbor text field',
        defaultValue: 'First line\nSecond line\nThird line'
      }));
      renderFixture(nested ? h(CS.Dialog, {
        open: true,
        title: 'Menu scope parent',
        lang,
        onClose: () => menuScopeCloses++
      }, content) : content);
    }, {
      lang,
      nested
    });
    await page.locator('#menu-scope-opener').focus();
    await page.locator('#menu-scope-opener').press('Enter');
    await page.getByRole('menu').waitFor();
    await page.waitForFunction(() => document.activeElement?.textContent === 'Alpha');
  }
  async function leaveViaTab() {
    await page.keyboard.press(tab);
    assert.equal(await page.locator('#menu-neighbor').evaluate(el => el === document.activeElement), true, 'native Tab exits Menu into adjacent textarea');
    assert.equal(await page.getByRole('menu').count(), 0, 'APG Tab closes the menu');
    tabClosures.push({
      browserName,
      closed: true,
      neighborFocused: true
    });
    await page.locator('#menu-neighbor').evaluate(el => el.setSelectionRange(13, 13));
  }
  const state = () => page.evaluate(() => ({
    activeId: document.activeElement.id,
    activeText: document.activeElement.textContent,
    neighborFocused: document.activeElement === document.getElementById('menu-neighbor'),
    caret: document.getElementById('menu-neighbor').selectionStart,
    menuCount: document.querySelectorAll('[role=menu]').length,
    parentCloses: menuScopeCloses,
    selections: menuScopeSelections,
    event: menuScopeKeyEvent
  }));
  for (const lang of ['en', 'vi']) for (const nested of [false, true]) {
    for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End']) {
      await mount(lang, nested);
      await leaveViaTab();
      // APG Tab closure is checked above. Keep the original regression live:
      // a controlled/pointer focus transfer can leave an open menu visible.
      await mount(lang, nested);
      await page.locator('#menu-neighbor').focus();
      await page.locator('#menu-neighbor').evaluate(el => el.setSelectionRange(13, 13));
      assert.equal(await page.getByRole('menu').count(), 1);
      const before = await state();
      await page.keyboard.press(key);
      const after = await state();
      assert.equal(after.event.isTrusted, true);
      assert.equal(after.event.isComposing, false);
      assert.equal(after.parentCloses, 0);
      assert.deepEqual(after.selections, []);
      assert.equal(after.neighborFocused, true, 'outside native key preserves textarea focus');
      assert.equal(after.event.defaultPrevented, false, 'outside native key is not consumed by Menu');
      assert.equal(after.menuCount, 1, 'open menu must preserve neighboring field navigation');
      rows.push({
        browserName,
        lang,
        nested,
        key,
        before,
        after,
        problem: !after.neighborFocused || after.event.defaultPrevented
      });
    }
    for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End']) {
      await mount(lang, nested);
      await page.keyboard.press('Escape');
      await page.getByRole('menu').waitFor({
        state: 'detached'
      });
      await page.locator('#menu-neighbor').focus();
      await page.locator('#menu-neighbor').evaluate(el => el.setSelectionRange(13, 13));
      await page.keyboard.press(key);
      const after = await state();
      assert.equal(after.neighborFocused, true);
      assert.equal(after.event.defaultPrevented, false);
      assert.equal(after.parentCloses, 0);
      controls.push({
        browserName,
        lang,
        nested,
        key,
        case: 'closed menu preserves neighboring native textarea arrow',
        result: 'pass'
      });
    }
    await mount(lang, nested);
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Beta');
    await page.keyboard.press('ArrowUp');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Alpha');
    await page.keyboard.press('End');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Beta');
    await page.keyboard.press('Home');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Alpha');
    controls.push({
      browserName,
      lang,
      nested,
      case: 'focused menu wrapping arrows and Home/End remain active',
      result: 'pass'
    });
    await page.evaluate(() => {
      renderFixture(null);
      removeMenuScopeRecorder();
    });
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  }
  console.log(`${browserName}: 16 native outside-target observations and20 controls complete`);
}, {
  browserName
});
assert.equal(rows.length, 48);
assert.equal(controls.length, 60);
assert.equal(tabClosures.length, 48);
const failures = rows.filter(row => row.problem).length;
assert.equal(failures, 0);
const report = {
  recordedAt: new Date().toISOString(),
  status: 'completed maintained native-key scope controls',
  cases: 156,
  rows,
  controls,
  tabClosures,
  failures,
  runtime,
  scope: '48 outside-target native arrows/Home/End while menu stays open,48 APG Tab-closure checks and60 closed-field/focused-menu controls in3engines, EN/VI standalone/nested; browser isTrusted observed, not physical hardware/IME, assistive technology, conformance or acceptance.'
};
if (process.env.CS_MENU_KEY_SCOPE_REPORT) writeFileSync(process.env.CS_MENU_KEY_SCOPE_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log('PASS108 Menu native event-target cases plus48 APG Tab-closure checks; physical/AT acceptance separate');
