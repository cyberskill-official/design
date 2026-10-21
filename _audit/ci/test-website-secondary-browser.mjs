import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const {
  withBrowserFixture
} = await import(pathToFileURL(join(root, '_audit/ci/lib/browser-fixture.mjs')));
const rows = [];
const check = (browser, page, name, actual, expected) => rows.push({
  browser,
  page,
  name,
  actual,
  expected,
  pass: JSON.stringify(actual) === JSON.stringify(expected)
});
for (const browser of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  for (const name of ['work', 'careers']) {
    await page.evaluate(() => localStorage.removeItem('cs_site_lang'));
    await page.goto(new URL(`/ui_kits/website/${name}.html`, page.url()).href);
    check(browser, name, 'initial English scope', await page.locator('html').getAttribute('lang'), 'en');
    check(browser, name, 'English skip name', await page.locator('.cs-skip').innerText(), 'Skip to content');
    await page.locator('.cs-skip').focus();
    await page.locator('.cs-skip').press('Enter');
    check(browser, name, 'skip focuses main', await page.evaluate(() => document.activeElement.id), 'main');
    check(browser, name, 'Services href', await page.locator('.nav a').first().getAttribute('href'), 'index.html#services');
    check(browser, name, 'Contact href', await page.locator('.nav a').last().getAttribute('href'), 'index.html#contact');
    await page.locator('#langToggle').focus();
    await page.locator('#langToggle').press('Enter');
    check(browser, name, 'native language activation', await page.locator('html').getAttribute('lang'), 'vi');
    check(browser, name, 'Vietnamese skip name', await page.locator('.cs-skip').innerText(), 'Bỏ qua đến nội dung');
    check(browser, name, 'Vietnamese theme name', await page.locator('#themeToggle').getAttribute('aria-label'), 'Đổi giao diện');
    await page.locator('#themeToggle').focus();
    await page.locator('#themeToggle').press('Space');
    check(browser, name, 'native theme activation', await page.locator('html').getAttribute('data-theme'), 'dark');
    if (name === 'work') {
      check(browser, name, 'Vietnamese sample heading', await page.locator('h1').innerText(), 'Những điều ước minh họa');
      check(browser, name, 'Vietnamese non-delivery copy', await page.locator('.band p').innerText(), 'Thử bản xem trước liên hệ. Bản mẫu này chưa gửi lời nhắn.');
      check(browser, name, 'Vietnamese sample result', await page.locator('.results .n').nth(2).innerText(), 'Bản mẫu');
      check(browser, name, 'contact demo destination', await page.locator('.band a').getAttribute('href'), 'index.html#contact');
    } else {
      check(browser, name, 'Vietnamese sample roles', await page.locator('.sec-alt .eyebrow').textContent(), 'Vị trí minh họa');
      check(browser, name, 'Vietnamese built-in role titles', await page.locator('.role h3').allTextContents(), ['Kỹ sư sản phẩm cấp cao', 'Kỹ sư hệ thống thiết kế', 'Nhà thiết kế sản phẩm AI', 'Trưởng nhóm tăng trưởng sáng lập']);
      check(browser, name, 'four localized demo destinations', await page.locator('.role a').evaluateAll(els => els.map(e => ({
        href: e.getAttribute('href'),
        text: e.textContent
      }))), Array(4).fill({
        href: 'index.html#contact',
        text: 'Xem bản mẫu liên hệ →'
      }));
    }
    await page.reload();
    check(browser, name, 'stored locale restored', await page.locator('html').getAttribute('lang'), 'vi');
    await page.locator('#langToggle').click();
    check(browser, name, 'English scope restored', await page.locator('html').getAttribute('lang'), 'en');
    check(browser, name, 'English theme name restored', await page.locator('#themeToggle').getAttribute('aria-label'), 'Toggle theme');
    if (name === 'work') {
      check(browser, name, 'English non-delivery copy', await page.locator('.band p').innerText(), 'Try the contact preview. This sample does not send a message.');
      check(browser, name, 'English sample work disclosed', (await page.locator('.work-hero p').innerText()).startsWith('Illustrative interface content.'), true);
    } else check(browser, name, 'English sample hiring disclosed', (await page.locator('.car-hero p').innerText()).includes('does not verify open vacancies or accept applications'), true);
  }
}, {
  browserName: browser,
  contextOptions: {
    viewport: {
      width: 1280,
      height: 900
    }
  }
});
const failures = rows.filter(x => !x.pass).length;
const report = {
  recordedAt: new Date().toISOString(),
  cases: rows.length,
  failures,
  exitCode: failures ? 1 : 0,
  rows,
  scope: 'Raw Work/Careers finite three-engine native skip/language/theme, localized builtins/sample copy, stored locale and home section hrefs. Not actual company case results, SLA, job availability, application delivery, all content/axes or speech/operator acceptance.'
};
if (process.env.CS_WEBSITE_SECONDARY_REPORT) writeFileSync(process.env.CS_WEBSITE_SECONDARY_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({
  cases: rows.length,
  failures
}));
process.exitCode = failures ? 1 : 0;
