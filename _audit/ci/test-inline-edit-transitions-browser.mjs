import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], { stdio: 'pipe' });
let cases = 0;
await withBrowserFixture(async page => {
  for (const lang of ['vi', 'en']) for (const theme of ['light', 'dark']) {
    for (const mode of ['uncontrolled', 'callback-only', 'controlled']) for (const nested of [false, true]) {
      const context = `${lang}/${theme}/${mode}/nested=${nested}`;
      await page.evaluate(({ lang, theme, mode, nested }) => {
        window.editChanges = [];
        const e = React.createElement;
        const props = { defaultValue: 'original', lang };
        if (mode !== 'uncontrolled') props.onChange = value => editChanges.push(value);
        if (mode === 'controlled') props.value = 'original';
        const content = e('section', { 'data-theme': theme, lang },
          e(CS.InlineEdit, { ...props, key: [lang, theme, mode, nested].join('-') }),
          e('button', { type: 'button', id: 'edit-next' }, 'Next'));
        renderFixture(nested ? e(CS.Dialog, { open: true, title: 'Editor' }, content) : content);
      }, { lang, theme, mode, nested });
      const view = page.locator('.cs-inline-edit__view');
      const input = page.locator('.cs-inline-edit input');
      const next = page.locator('#edit-next');
      await view.click();
      await input.fill('committed');
      for (const init of [{ key: 'Enter', isComposing: true }, { key: 'Enter', keyCode: 229 }]) {
        await input.dispatchEvent('keydown', { ...init, bubbles: true });
        assert.equal(await input.count(), 1, context + ': IME confirmation must keep editing');
        assert.deepEqual(await page.evaluate(() => editChanges), []);
      }
      await input.press('Enter');
      assert.equal(await input.count(), 0);
      assert.equal(await view.evaluate(element => element === document.activeElement), true, context + ': Enter returns focus to replacement trigger');
      assert.equal(await view.locator('span').textContent(), mode === 'controlled' ? 'original' : 'committed');
      const expected = mode === 'uncontrolled' ? [] : ['committed'];
      assert.deepEqual(await page.evaluate(() => editChanges), expected, context + ': exactly one proposal');
      await view.press('Enter');
      await input.fill('cancelled');
      await input.press('Escape');
      assert.equal(await view.evaluate(element => element === document.activeElement), true, context + ': Escape restores focus');
      assert.deepEqual(await page.evaluate(() => editChanges), expected, context + ': cancellation never commits');
      if (nested) assert.equal(await page.getByRole('dialog').count(), 1, 'child Escape preserves parent');
      await view.press('Enter');
      await input.fill('blurred');
      await next.focus();
      assert.equal(await next.evaluate(element => element === document.activeElement), true, context + ': blur preserves next focus target');
      assert.deepEqual(await page.evaluate(() => editChanges), mode === 'uncontrolled' ? [] : ['committed', 'blurred']);
      await page.evaluate(() => renderFixture(null));
      cases++;
    }
  }
}, { browserName: process.env.CS_TEST_BROWSER || 'chromium' });
console.log(`PASS InlineEdit: ${cases} language/theme/ownership/nesting combinations; Enter, blur, Escape, IME and exact notifications`);
