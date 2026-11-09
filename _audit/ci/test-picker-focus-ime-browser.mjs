import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], { stdio: 'pipe' });

let cases = 0;
await withBrowserFixture(async (page) => {
  for (const lang of ['vi', 'en']) {
    for (const theme of ['light', 'dark']) {
      const ctx = `${lang}/${theme}`;
      await page.evaluate(({ lang, theme }) => {
        window.events = {
          date: [],
          tree: [],
          cascader: [],
          color: [],
          searchCleared: 0,
          combo: [],
          tags: [],
          mentions: [],
          prompts: [],
        };
        const e = React.createElement;
        function Harness() {
          const [date, setDate] = React.useState(new Date(2026, 6, 18));
          const [tree, setTree] = React.useState('web');
          const [casc, setCasc] = React.useState(['vn', 'hcm']);
          const [color, setColor] = React.useState('#F4BA17');
          const [combo, setCombo] = React.useState('tho');
          return e('section', { 'data-theme': theme, lang },
            e(CS.DatePicker, {
              id: 'dp-test',
              lang,
              label: 'Date',
              value: date,
              onChange: (d) => { window.events.date.push(d?.getDate()); setDate(d); },
            }),
            e(CS.TreeSelect, {
              id: 'ts-test',
              lang,
              label: 'Squad',
              value: tree,
              nodes: [{ key: 'platform', label: 'Platform', children: [{ key: 'web', label: 'Web' }, { key: 'api', label: 'API' }] }],
              onChange: (k) => { window.events.tree.push(k); setTree(k); },
            }),
            e(CS.Cascader, {
              id: 'cas-test',
              lang,
              label: 'Region',
              value: casc,
              nodes: [{ key: 'vn', label: 'Vietnam', children: [{ key: 'hcm', label: 'HCMC' }, { key: 'hn', label: 'Hanoi' }] }],
              onChange: (p) => { window.events.cascader.push(p.join('/')); setCasc(p); },
            }),
            e(CS.ColorPicker, {
              id: 'cp-test',
              lang,
              label: 'Accent',
              value: color,
              onChange: (c) => { window.events.color.push(c); setColor(c); },
            }),
            e(CS.SearchField, {
              id: 'sf-test',
              lang,
              defaultValue: 'CyberSkill',
              onClear: () => { window.events.searchCleared++; },
            }),
            e(CS.Combobox, {
              id: 'cb-test',
              lang,
              label: 'Element',
              value: combo,
              options: [
                { value: 'tho', label: 'Thổ' },
                { value: 'moc', label: 'Mộc' },
                { value: 'thuy', label: 'Thủy' },
              ],
              onChange: (v) => { window.events.combo.push(v); setCombo(v); },
            }),
            e(CS.TagInput, {
              id: 'ti-test',
              lang,
              label: 'Tags',
              defaultValue: ['design'],
              onChange: (arr) => { window.events.tags.push(arr); },
            }),
            e(CS.Mentions, {
              lang,
              'aria-label': 'Mentions',
              users: ['lumi', 'stephen'],
              onChange: (v) => { window.events.mentions.push(v); },
            }),
            e(CS.PromptInput, {
              lang,
              'aria-label': 'Prompt',
              onSubmit: (v) => { window.events.prompts.push(v); },
            }),
          );
        }
        renderFixture(e(Harness));
      }, { lang, theme });

      // 1. DatePicker: open via click -> Escape restores focus; open via click -> select day restores focus
      const dpTrigger = page.locator('.cs-datepicker__field');
      await dpTrigger.click();
      assert.equal(await page.locator('.cs-datepicker__pop').count(), 1, `${ctx}: DatePicker opens`);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.cs-datepicker__pop').count(), 0, `${ctx}: DatePicker Escape closes`);
      assert.equal(await dpTrigger.evaluate((el) => el === document.activeElement), true, `${ctx}: DatePicker Escape restores trigger focus`);

      await dpTrigger.click();
      await page.locator('.cs-datepicker__pop button[data-day="15"]').click();
      assert.equal(await page.locator('.cs-datepicker__pop').count(), 0, `${ctx}: DatePicker day selection closes`);
      assert.equal(await dpTrigger.evaluate((el) => el === document.activeElement), true, `${ctx}: DatePicker day selection restores trigger focus`);

      // 2. TreeSelect: open via click -> Escape restores focus; open via click -> leaf click restores focus
      const tsTrigger = page.locator('.cs-treeselect .cs-treeselect__field');
      await tsTrigger.click();
      assert.equal(await page.locator('.cs-treeselect__pop').count(), 1, `${ctx}: TreeSelect opens`);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.cs-treeselect__pop').count(), 0, `${ctx}: TreeSelect Escape closes`);
      assert.equal(await tsTrigger.evaluate((el) => el === document.activeElement), true, `${ctx}: TreeSelect Escape restores trigger focus`);

      await tsTrigger.click();
      await page.locator('.cs-treeselect__pop .cs-tree__label', { hasText: 'API' }).click();
      assert.equal(await page.locator('.cs-treeselect__pop').count(), 0, `${ctx}: TreeSelect leaf selection closes`);
      assert.equal(await tsTrigger.evaluate((el) => el === document.activeElement), true, `${ctx}: TreeSelect leaf selection restores trigger focus`);

      // 3. Cascader: open via click -> Escape restores focus; open via click -> leaf option click restores focus
      const casTrigger = page.locator('.cs-cascader .cs-treeselect__field');
      await casTrigger.click();
      assert.equal(await page.locator('.cs-cascader__pop').count(), 1, `${ctx}: Cascader opens`);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.cs-cascader__pop').count(), 0, `${ctx}: Cascader Escape closes`);
      assert.equal(await casTrigger.evaluate((el) => el === document.activeElement), true, `${ctx}: Cascader Escape restores trigger focus`);

      await casTrigger.click();
      await page.locator('.cs-cascader__pop .cs-cascader__opt', { hasText: 'Hanoi' }).click();
      assert.equal(await page.locator('.cs-cascader__pop').count(), 0, `${ctx}: Cascader leaf selection closes`);
      assert.equal(await casTrigger.evaluate((el) => el === document.activeElement), true, `${ctx}: Cascader leaf selection restores trigger focus`);

      // 4. ColorPicker: open via click -> IME Enter in hex input stays open -> real Enter commits & restores focus
      const cpTrigger = page.locator('.cs-colorpicker__field');
      await cpTrigger.click();
      const hexInput = page.locator('.cs-colorpicker__hex input');
      await hexInput.fill('#45210E');
      for (const init of [{ key: 'Enter', isComposing: true }, { key: 'Enter', keyCode: 229 }]) {
        await hexInput.dispatchEvent('keydown', { ...init, bubbles: true });
        assert.equal(await page.locator('.cs-colorpicker__pop').count(), 1, `${ctx}: ColorPicker IME Enter must not close`);
      }
      await hexInput.press('Enter');
      assert.equal(await page.locator('.cs-colorpicker__pop').count(), 0, `${ctx}: ColorPicker Enter commits and closes`);
      assert.equal(await cpTrigger.evaluate((el) => el === document.activeElement), true, `${ctx}: ColorPicker Enter restores trigger focus`);

      // 5. SearchField: clicking clear button clears text and restores focus to searchbox input
      const sfInput = page.locator('.cs-search input[role="searchbox"]');
      const sfClear = page.locator('.cs-search__clear');
      await sfClear.click();
      assert.equal(await sfInput.inputValue(), '', `${ctx}: SearchField clear empties value`);
      assert.equal(await sfInput.evaluate((el) => el === document.activeElement), true, `${ctx}: SearchField clear restores input focus`);

      // 6. Combobox: IME Enter does not pick; real Enter picks and keeps input focus
      const cbInput = page.locator('.cs-combobox input[role="combobox"]');
      await cbInput.click();
      await cbInput.press('ArrowDown');
      for (const init of [{ key: 'Enter', isComposing: true }, { key: 'Enter', keyCode: 229 }]) {
        await cbInput.dispatchEvent('keydown', { ...init, bubbles: true });
        assert.equal(await page.locator('.cs-combobox__popup').count(), 1, `${ctx}: Combobox IME Enter must not pick`);
      }
      await cbInput.press('Enter');
      assert.equal(await page.locator('.cs-combobox__popup').count(), 0, `${ctx}: Combobox Enter picks and closes`);
      assert.equal(await cbInput.evaluate((el) => el === document.activeElement), true, `${ctx}: Combobox Enter preserves input focus`);

      // 7. TagInput: IME Enter does not add tag; real Enter adds tag and keeps input focus
      const tiInput = page.locator('.cs-taginput input');
      await tiInput.fill('vietnam');
      for (const init of [{ key: 'Enter', isComposing: true }, { key: 'Enter', keyCode: 229 }]) {
        await tiInput.dispatchEvent('keydown', { ...init, bubbles: true });
        assert.equal(await tiInput.inputValue(), 'vietnam', `${ctx}: TagInput IME Enter must not commit tag`);
      }
      await tiInput.press('Enter');
      assert.equal(await tiInput.inputValue(), '', `${ctx}: TagInput Enter commits tag`);
      assert.equal(await tiInput.evaluate((el) => el === document.activeElement), true, `${ctx}: TagInput Enter preserves input focus`);

      // 8. Mentions: typing @lu opens popup; IME Enter does not pick; real Enter picks @lumi
      const menArea = page.locator('.cs-mentions textarea');
      await menArea.fill('Hello @lu');
      assert.equal(await page.locator('.cs-mentions__pop').count(), 1, `${ctx}: Mentions popup opens`);
      for (const init of [{ key: 'Enter', isComposing: true }, { key: 'Enter', keyCode: 229 }]) {
        await menArea.dispatchEvent('keydown', { ...init, bubbles: true });
        assert.equal(await page.locator('.cs-mentions__pop').count(), 1, `${ctx}: Mentions IME Enter must not pick`);
      }
      await menArea.press('Enter');
      assert.equal(await page.locator('.cs-mentions__pop').count(), 0, `${ctx}: Mentions Enter picks user`);
      assert.equal(await menArea.inputValue(), 'Hello @lumi ', `${ctx}: Mentions inserts @lumi`);

      // 9. PromptInput: IME Enter does not submit; real Enter submits and keeps textarea focus
      const prArea = page.locator('.cs-prompt__field');
      await prArea.fill('Xin chào Lumi');
      for (const init of [{ key: 'Enter', isComposing: true }, { key: 'Enter', keyCode: 229 }]) {
        await prArea.dispatchEvent('keydown', { ...init, bubbles: true });
      }
      assert.deepEqual(await page.evaluate(() => window.events.prompts), [], `${ctx}: PromptInput IME Enter must not submit`);
      await prArea.press('Enter');
      assert.deepEqual(await page.evaluate(() => window.events.prompts), ['Xin chào Lumi'], `${ctx}: PromptInput Enter submits`);
      assert.equal(await prArea.evaluate((el) => el === document.activeElement), true, `${ctx}: PromptInput Enter preserves textarea focus`);

      await page.evaluate(() => renderFixture(null));
      cases++;
    }
  }
}, { browserName: process.env.CS_TEST_BROWSER || 'chromium' });

console.log(`PASS picker focus & IME suite: ${cases} language/theme combinations across 9 interactive controls`);
