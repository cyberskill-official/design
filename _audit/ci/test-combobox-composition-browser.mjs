import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

// Constructor flags test application handlers, not trusted physical OS IME sessions.
const rows = [],
  controls = [],
  runtime = {
    node: process.version,
    browsers: {},
    reactVersions: {}
  };
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  runtime.browsers[browserName] = page.context().browser().version();
  runtime.reactVersions[browserName] = await page.evaluate(() => React.version);
  async function mount(lang, nested) {
    await page.evaluate(({
      lang,
      nested
    }) => {
      renderFixture(null);
      window.comboboxSelections = [];
      window.comboboxParentCloses = 0;
      const h = React.createElement;
      function App() {
        const [value, setValue] = React.useState(undefined);
        const field = h(CS.Combobox, {
          label: 'Composition field',
          lang,
          value,
          onChange: next => {
            comboboxSelections.push(next);
            setValue(next);
          },
          options: [{
            value: 'a',
            label: 'Alpha'
          }, {
            value: 'b',
            label: 'Beta'
          }, {
            value: 'g',
            label: 'Gamma'
          }]
        });
        return nested ? h(CS.Dialog, {
          open: true,
          title: 'Composition parent',
          lang,
          onClose: () => comboboxParentCloses++
        }, field) : field;
      }
      renderFixture(h(App));
    }, {
      lang,
      nested
    });
    await page.getByRole('combobox').focus();
    await page.getByRole('listbox').waitFor();
    await page.getByRole('combobox').press('ArrowDown');
    assert.equal(await page.getByRole('combobox').evaluate(el => document.getElementById(el.getAttribute('aria-activedescendant'))?.textContent), 'Beta');
  }
  const state = () => page.getByRole('combobox').evaluate(el => ({
    expanded: el.getAttribute('aria-expanded'),
    activeId: el.getAttribute('aria-activedescendant'),
    activeText: document.getElementById(el.getAttribute('aria-activedescendant'))?.textContent,
    value: el.value,
    focused: el === document.activeElement,
    selections: comboboxSelections,
    parentCloses: comboboxParentCloses
  }));
  async function flagged(key, flag) {
    const before = await state();
    const event = await page.getByRole('combobox').evaluate(async (el, {
      key,
      flag
    }) => {
      const e = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
        isComposing: flag === 'composing',
        keyCode: flag === 'key229' ? 229 : 0
      });
      const dispatched = el.dispatchEvent(e);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      ReactDOM.flushSync(() => {});
      return {
        key: e.key,
        isComposing: e.isComposing,
        keyCode: e.keyCode,
        isTrusted: e.isTrusted,
        defaultPrevented: e.defaultPrevented,
        dispatched
      };
    }, {
      key,
      flag
    });
    return {
      before,
      event,
      after: await state()
    };
  }
  for (const lang of ['en', 'vi']) for (const nested of [false, true]) {
    for (const flag of ['composing', 'key229']) for (const key of ['ArrowDown', 'ArrowUp', 'Enter']) {
      await mount(lang, nested);
      const observation = await flagged(key, flag);
      assert.equal(observation.event.isTrusted, false);
      assert.equal(observation.event.isComposing, flag === 'composing');
      assert.equal(observation.event.keyCode, flag === 'key229' ? 229 : 0);
      assert.equal(observation.after.focused, true);
      assert.equal(observation.after.parentCloses, 0);
      const problem = observation.event.defaultPrevented || observation.after.activeId !== observation.before.activeId || observation.after.expanded !== observation.before.expanded || observation.after.selections.length > 0;
      assert.equal(problem, false, `${browserName}/${lang}/${nested}/${flag}/${key}: flagged key preserves highlight/open state and emits no selection`);
      assert.deepEqual(observation.after, observation.before);
      rows.push({
        browserName,
        lang,
        nested,
        flag,
        key,
        observation,
        problem
      });
    }
    for (const flag of ['composing', 'key229']) {
      await mount(lang, nested);
      const observation = await flagged('Escape', flag);
      assert.deepEqual(observation.after, observation.before);
      assert.equal(observation.event.defaultPrevented, false);
      controls.push({
        browserName,
        lang,
        nested,
        flag,
        case: 'existing flagged Escape guard',
        result: 'pass'
      });
    }
    for (const key of ['ArrowDown', 'ArrowUp', 'Enter']) {
      await mount(lang, nested);
      await page.getByRole('combobox').press(key);
      const after = await state();
      assert.equal(after.focused, true);
      assert.equal(after.parentCloses, 0);
      if (key === 'Enter') {
        assert.deepEqual(after.selections, ['b']);
        assert.equal(after.expanded, 'false');
        assert.equal(after.value, 'Beta');
      } else {
        assert.deepEqual(after.selections, []);
        assert.equal(after.expanded, 'true');
        assert.equal(after.activeText, key === 'ArrowDown' ? 'Gamma' : 'Alpha');
      }
      controls.push({
        browserName,
        lang,
        nested,
        key,
        case: 'ordinary native navigation/selection',
        result: 'pass'
      });
    }
    await mount(lang, nested);
    await page.getByRole('combobox').fill('Be');
    assert.equal(await page.getByRole('option').count(), 1);
    assert.equal((await state()).activeText, 'Beta');
    assert.deepEqual((await state()).selections, []);
    controls.push({
      browserName,
      lang,
      nested,
      case: 'ordinary typing/filtering',
      result: 'pass'
    });
    await page.evaluate(() => renderFixture(null));
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  }
  console.log(`${browserName}: 24 flagged observations and 24 controls completed`);
}, {
  browserName
});
assert.equal(rows.length, 72);
assert.equal(controls.length, 72);
const failures = rows.filter(row => row.problem).length;
const report = {
  recordedAt: new Date().toISOString(),
  status: 'completed maintained flagged-event controls',
  cases: rows.length + controls.length,
  rows,
  controls,
  failures,
  runtime,
  scope: '72 synthetic composition/keyCode229 arrow/Enter guards and72 existing flagged Escape/native navigation/selection/typing controls; actual served Combobox EN/VI standalone/nested. Application-handler proxies only, not trusted physical OS IME/candidate-selection, conformance, AT/device or human acceptance.'
};
assert.equal(failures, 0);
if (process.env.CS_COMBOBOX_COMPOSITION_REPORT) writeFileSync(process.env.CS_COMBOBOX_COMPOSITION_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log('PASS 144 Combobox composition/control cases; physical OS IME acceptance remains separate');
