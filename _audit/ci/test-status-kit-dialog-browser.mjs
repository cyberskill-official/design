import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

const browserName = process.argv.find(arg => arg.startsWith('--browser='))?.slice(10) || 'chromium';
let cases = 0;
await withBrowserFixture(async page => {
  const url = new URL('/ui_kits/status-hub/index.html', page.url()).href;
  for (const width of [320, 1280]) for (const lang of ['en', 'vi']) for (const dark of [false, true]) {
    await page.setViewportSize({width, height: 800});
    await page.goto(url);
    await page.locator('button.card').first().waitFor();
    if (lang === 'vi') await page.getByRole('button', {name: 'Toggle language', exact: true}).click();
    if (dark) await page.getByRole('button', {name: lang === 'vi' ? 'Đổi giao diện' : 'Toggle theme', exact: true}).click();
    for (const lens of ['board', 'table']) {
      await page.getByRole('tab', {name: lens === 'board' ? (lang === 'vi' ? 'Bảng công việc' : 'Board') : (lang === 'vi' ? 'Bảng dữ liệu' : 'Table'), exact: true}).click();
      const opener = page.locator(lens === 'board' ? 'button.card' : 'button.project-open').first();
      const title = await page.locator(lens === 'board' ? 'button.card h3' : 'button.project-open').first().innerText();
      const open = async () => {
        await opener.focus();
        await page.keyboard.press('Enter');
        const dialog = page.getByRole('dialog');
        await dialog.waitFor();
        assert(title.includes(await dialog.getAttribute('aria-label')));
        assert(await dialog.evaluate(el => el.matches(':modal')), 'browser owns modal isolation');
        assert(await dialog.evaluate(el => el.contains(document.activeElement)), 'focus enters drawer');
        await opener.evaluate(el => el.focus());
        assert(await dialog.evaluate(el => el.contains(document.activeElement)), 'background cannot receive focus');
        const close = dialog.getByRole('button', {name: lang === 'vi' ? 'Đóng' : 'Close', exact: true});
        await close.focus();
        for (const key of ['Shift+Tab', 'Tab', 'Tab']) {
          await page.keyboard.press(key);
          // Native dialogs may allow browser-chrome traversal (notably WebKit).
          // While the document has focus, it must remain in the modal subtree.
          assert(await dialog.evaluate(el => !document.hasFocus() || el.contains(document.activeElement)), 'Tab never enters background content');
        }
        await close.focus();
        const box = await dialog.boundingBox();
        assert(box.x >= -1 && box.x + box.width <= width + 1 && box.height <= 801, 'drawer fits viewport');
        const closeBox = await close.boundingBox();
        assert(closeBox.width >= 44 && closeBox.height >= 44, 'close target meets touch floor');
        return {dialog, close, box};
      };
      await open();
      await page.keyboard.press('Escape');
      await page.getByRole('dialog').waitFor({state: 'detached'});
      assert(await opener.evaluate(el => el === document.activeElement), 'Escape restores exact opener');
      const {close} = await open();
      await close.click();
      await page.getByRole('dialog').waitFor({state: 'detached'});
      assert(await opener.evaluate(el => el === document.activeElement), 'close button restores exact opener');
      if (width > 560) {
        const {box} = await open();
        await page.mouse.click(box.x - 10, 100);
        await page.getByRole('dialog').waitFor({state: 'detached'});
        assert(await opener.evaluate(el => el === document.activeElement), 'backdrop restores exact opener');
      }
      cases++;
    }
  }
}, {browserName});
console.log(`PASS Status Hub dialog (${browserName}): ${cases} board/table, EN/VI, light/dark, narrow/desktop cases; keyboard entry, modal isolation, dismissal, focus restoration and close target.`);
