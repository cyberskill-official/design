import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { strings } from '../../components/_i18n/strings.js';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {
  cwd: root,
  stdio: 'pipe'
});
const rows = [],
  runtime = {
    node: process.version,
    browsers: {}
  };
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  runtime.browsers[browserName] = page.context().browser().version();
  runtime.browserReactVersion = await page.evaluate(() => React.version);
  await page.addScriptTag({
    path: root + '/node_modules/axe-core/axe.min.js'
  });
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  const reverseTab = browserName === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab';
  async function mount({
    lang,
    nested = false,
    entry = 'zone',
    control
  }) {
    await page.evaluate(({
      lang,
      nested,
      entry,
      control
    }) => {
      const h = React.createElement;
      window.contextSelects = [];
      window.contextParentCloses = 0;
      const labels = lang === 'vi' ? ['Sao chép', 'Dán', 'Xóa'] : ['Copy', 'Paste', 'Delete'];
      function App() {
        const [items, setItems] = React.useState(control === 'empty' ? [] : control === 'separators' ? ['-'] : ['-', {
          label: labels[0],
          onSelect: () => contextSelects.push(labels[0])
        }, '-', {
          label: labels[1],
          onSelect: () => contextSelects.push(labels[1])
        }, {
          label: labels[2],
          danger: true,
          onSelect: () => contextSelects.push(labels[2])
        }]);
        window.updateContextItems = setItems;
        const child = entry === 'descendant' ? h('button', {
          id: 'context-child',
          onKeyDown: control === 'blocked-key' ? e => e.preventDefault() : undefined,
          onContextMenu: control === 'blocked-context' ? e => e.preventDefault() : undefined
        }, 'Context child') : h('span', null, 'Context content');
        const content = h(React.Fragment, null, h('button', {
          id: 'context-before'
        }, 'Before'), h(CS.ContextMenu, {
          items,
          lang,
          tabIndex: entry === 'descendant' ? -1 : 0
        }, child), h('button', {
          id: 'context-after'
        }, 'After'));
        return nested ? h(CS.Dialog, {
          open: true,
          title: 'Context parent',
          onClose: () => contextParentCloses++
        }, content) : content;
      }
      renderFixture(h(App));
    }, {
      lang,
      nested,
      entry,
      control
    });
    return page.locator(entry === 'descendant' ? '#context-child' : '.cs-ctxmenu-zone');
  }
  async function open(target, method = 'Shift+F10') {
    await target.focus();
    if (method === 'pointer') await target.click({
      button: 'right'
    });else await target.press(method);
    await page.getByRole('menu').waitFor();
  }
  async function checkOpen(lang) {
    const names = lang === 'vi' ? ['Sao chép', 'Dán', 'Xóa'] : ['Copy', 'Paste', 'Delete'];
    assert.equal(await page.getByRole('group', {
      name: strings.ContextMenu[lang].menu,
      exact: true
    }).count(), 1);
    assert.equal(await page.getByRole('menu', {
      name: strings.ContextMenu[lang].menu,
      exact: true
    }).count(), 1);
    assert.equal(await page.getByRole('menuitem').count(), 3);
    assert.equal(await page.getByRole('separator').count(), 2);
    await page.waitForFunction(name => document.activeElement?.textContent === name, names[0]);
    assert.equal(await page.locator('[role=menuitem][tabindex="0"]').count(), 1);
    const axeResult = await page.getByRole('menu').evaluate(async el => {
      const r = await axe.run(el, {
        runOnly: {
          type: 'rule',
          values: ['aria-required-children', 'aria-required-parent', 'aria-allowed-role', 'aria-allowed-attr', 'aria-roles', 'button-name']
        }
      });
      return {
        violations: r.violations.map(v => v.id),
        incomplete: r.incomplete.map(v => v.id)
      };
    });
    assert.deepEqual(axeResult, {
      violations: [],
      incomplete: []
    });
    return names;
  }
  async function cleanup(nested) {
    assert.equal(await page.evaluate(() => contextParentCloses), 0);
    if (nested) {
      assert.equal(await page.getByRole('dialog', {
        name: 'Context parent',
        exact: true
      }).count(), 1);
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => contextParentCloses), 1);
    }
    await page.evaluate(() => renderFixture(null));
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  }
  for (const lang of ['en', 'vi']) for (const nested of [false, true]) for (const entry of ['zone', 'descendant']) for (const method of ['pointer', 'Shift+F10', 'ContextMenu']) {
    const target = await mount({
      lang,
      nested,
      entry
    });
    await page.locator('#context-before').focus();
    await page.keyboard.press(tab);
    assert.equal(await target.evaluate(el => el === document.activeElement), true, 'Native keyboard entry');
    await open(target, method);
    const names = await checkOpen(lang);
    for (const [key, index] of [['ArrowDown', 1], ['ArrowDown', 2], ['ArrowDown', 2], ['ArrowUp', 1], ['Home', 0], ['ArrowUp', 0], ['End', 2], ['Home', 0]]) {
      await page.keyboard.press(key);
      assert.equal(await page.evaluate(() => document.activeElement.textContent), names[index]);
      assert.equal(await page.locator('[role=menuitem][tabindex="0"]').count(), 1);
    }
    await page.keyboard.press('Escape');
    await page.getByRole('menu').waitFor({
      state: 'detached'
    });
    assert.equal(await target.evaluate(el => el === document.activeElement), true, 'Escape returns to opener');
    assert.deepEqual(await page.evaluate(() => contextSelects), []);
    rows.push({
      browserName,
      lang,
      nested,
      entry,
      method,
      case: 'entry/first-focus/navigation/Escape',
      result: 'pass'
    });
    await cleanup(nested);
  }
  for (const lang of ['en', 'vi']) for (const nested of [false, true]) for (const entry of ['zone', 'descendant']) for (const finish of ['Enter', 'Space', 'Tab', 'Shift+Tab']) {
    const target = await mount({
      lang,
      nested,
      entry
    });
    await open(target);
    const names = await checkOpen(lang);
    if (finish === 'Tab' || finish === 'Shift+Tab') await page.keyboard.press(finish === 'Tab' ? tab : reverseTab);else await page.keyboard.press(finish);
    await page.getByRole('menu').waitFor({
      state: 'detached'
    });
    if (finish === 'Tab') assert.equal(await page.evaluate(() => document.activeElement.id), 'context-after', 'Native forward Tab destination preserved');else assert.equal(await target.evaluate(el => el === document.activeElement), true, 'Selection/backward Tab preserves opener');
    assert.deepEqual(await page.evaluate(() => contextSelects), finish === 'Tab' || finish === 'Shift+Tab' ? [] : [names[0]]);
    rows.push({
      browserName,
      lang,
      nested,
      entry,
      finish,
      case: 'selection/native Tab exit',
      result: 'pass'
    });
    await cleanup(nested);
  }
  for (const lang of ['en', 'vi']) for (const control of ['blocked-key', 'blocked-context', 'composing', 'key229', 'empty', 'separators', 'dynamic-empty', 'teardown']) {
    const entry = control.startsWith('blocked') ? 'descendant' : 'zone';
    const target = await mount({
      lang,
      entry,
      control
    });
    await target.focus();
    if (control === 'blocked-key') await target.press('Shift+F10');else if (control === 'blocked-context') await target.click({
      button: 'right'
    });else if (control === 'composing' || control === 'key229') await target.evaluate((el, control) => el.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'F10',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
      isComposing: control === 'composing',
      keyCode: control === 'key229' ? 229 : 0
    })), control);else if (control === 'empty' || control === 'separators') await target.press('Shift+F10');else if (control === 'dynamic-empty') {
      await open(target);
      await checkOpen(lang);
      await page.evaluate(() => updateContextItems([]));
      await page.getByRole('menu').waitFor({
        state: 'detached'
      });
      assert.equal(await target.evaluate(el => el === document.activeElement), true, 'Removed last action returns focus');
    } else {
      await page.evaluate(() => {
        window.contextListenerProbe = {
          add: document.addEventListener,
          remove: document.removeEventListener,
          live: new Map()
        };
        const probe = contextListenerProbe;
        document.addEventListener = function (type, fn, options) {
          if (type === 'keydown' || type === 'click') {
            const key = type + ':' + !!(typeof options === 'boolean' ? options : options?.capture);
            if (!probe.live.has(key)) probe.live.set(key, new Set());
            probe.live.get(key).add(fn);
          }
          return probe.add.call(this, type, fn, options);
        };
        document.removeEventListener = function (type, fn, options) {
          const key = type + ':' + !!(typeof options === 'boolean' ? options : options?.capture);
          probe.live.get(key)?.delete(fn);
          return probe.remove.call(this, type, fn, options);
        };
      });
      try {
        await open(target);
        await checkOpen(lang);
        assert.equal(await page.evaluate(() => [...contextListenerProbe.live.values()].reduce((n, s) => n + s.size, 0)), 3);
        await page.evaluate(() => renderFixture(null));
        assert.equal(await page.evaluate(() => [...contextListenerProbe.live.values()].reduce((n, s) => n + s.size, 0)), 0, 'Owned key/click listeners removed');
      } finally {
        await page.evaluate(() => {
          document.addEventListener = contextListenerProbe.add;
          document.removeEventListener = contextListenerProbe.remove;
          delete window.contextListenerProbe;
        });
      }
    }
    assert.equal(await page.getByRole('menu').count(), 0, control + ' ' + browserName + ' ' + lang);
    assert.deepEqual(await page.evaluate(() => contextSelects), []);
    rows.push({
      browserName,
      lang,
      control,
      case: 'cancellation/empty/dynamic/teardown',
      result: 'pass'
    });
    await cleanup(false);
  }
  console.log(browserName + ': ' + rows.filter(row => row.browserName === browserName).length + ' maintained ContextMenu cases passed');
}, {
  browserName
});
assert.equal(rows.length, 216);
if (process.env.CS_CONTEXT_MENU_REPORT) writeFileSync(process.env.CS_CONTEXT_MENU_REPORT, JSON.stringify({
  recordedAt: new Date().toISOString(),
  status: 'completed',
  rows,
  runtime,
  scope: '216 actual served-bundle EN/VI cases: native keyboard entry, pointer/ContextMenu key/Shift+F10 opening, separators/roving navigation, standalone/nested Escape, selection callbacks, native Tab destinations, cancelled/composing events, empty/dynamic actions and listener teardown. Physical OS shortcut, touch gesture, manual AT and whole-system acceptance remain separate.'
}, null, 2) + '\n');
console.log('PASS 216 maintained ContextMenu keyboard/focus cases');
