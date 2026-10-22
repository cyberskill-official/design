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
  for (const name of ['login', 'settings', 'project']) {
    await page.goto(new URL(`/ui_kits/status-hub/${name}.html`, page.url()).href);
    check(browser, name, 'initial English scope', await page.locator('html').getAttribute('lang'), 'en');
    check(browser, name, 'English skip copy', await page.locator('.cs-skip').textContent(), 'Skip to content');
    await page.locator('.cs-skip').focus();
    await page.locator('.cs-skip').press('Enter');
    check(browser, name, 'skip focus main', await page.evaluate(() => document.activeElement.id), 'main');
    const requests = [];
    page.on('request', r => {
      if (r.method() !== 'GET') requests.push({
        method: r.method(),
        url: r.url()
      });
    });
    if (name === 'login') {
      check(browser, name, 'truthful English auth preview', (await page.locator('.box .sub').textContent()).includes('No authentication request'), true);
      await page.locator('#emailInput').fill('caller@example.invalid');
      await page.locator('input[type=password]').fill('private-local-example');
      await page.locator('#formState').selectOption('invalid');
      check(browser, name, 'invalid error linked', await page.locator('#emailInput').getAttribute('aria-describedby'), 'emailError');
      check(browser, name, 'invalid English email name excludes error copy', await page.getByRole('textbox', {
        name: 'Work email',
        exact: true
      }).count(), 1);
      await page.locator('#formState').selectOption('loading');
    } else if (name === 'settings') {
      check(browser, name, 'truthful English settings preview', (await page.locator('#panel-profile .hint').textContent()).includes('not saved to an account'), true);
      await page.locator('#panel-profile input').nth(0).fill('Caller profile');
      await page.locator('#panel-profile input').nth(1).fill('caller@example.invalid');
      await page.locator('#panel-profile select').first().selectOption('Growth');
    } else {
      check(browser, name, 'truthful English project preview', (await page.locator('.pd-head p').textContent()).includes('does not establish verification or release status'), true);
      check(browser, name, 'sample share unavailable', await page.locator('.pd-actions .cs-button').first().isDisabled(), true);
      check(browser, name, 'actual board destination', await page.locator('.pd-actions .cs-button').last().getAttribute('href'), 'index.html');
    }
    if (name === 'settings') await page.locator('#panel-profile select').last().selectOption({
      label: 'Tiếng Việt'
    });else {
      const toggle = page.locator('[data-preview-language-toggle]');
      check(browser, name, 'native language button exists', await toggle.count(), 1);
      if (await toggle.count()) {
        await toggle.focus();
        await toggle.press('Space');
      }
    }
    await page.evaluate(() => new Promise(r => requestAnimationFrame(r)));
    check(browser, name, 'Vietnamese document scope', await page.locator('html').getAttribute('lang'), 'vi');
    check(browser, name, 'Vietnamese skip copy', await page.locator('.cs-skip').textContent(), 'Bỏ qua đến nội dung');
    check(browser, name, 'Vietnamese theme name', await page.locator('#themeToggle').getAttribute('aria-label'), 'Đổi giao diện');
    if (name === 'login') {
      check(browser, name, 'loading state retained', await page.locator('#formState').inputValue(), 'loading');
      check(browser, name, 'Vietnamese loading button', await page.locator('#submitBtn').textContent(), 'Đang đăng nhập…');
      check(browser, name, 'loading remains disabled', await page.locator('#submitBtn').isDisabled(), true);
      check(browser, name, 'caller email retained', await page.locator('#emailInput').inputValue(), 'caller@example.invalid');
      check(browser, name, 'caller password retained', await page.locator('input[type=password]').inputValue(), 'private-local-example');
      await page.locator('#formState').selectOption('invalid');
      check(browser, name, 'invalid Vietnamese email name excludes error copy', await page.getByRole('textbox', {
        name: 'Email công việc',
        exact: true
      }).count(), 1);
      check(browser, name, 'Vietnamese error copy', await page.locator('#emailError').textContent(), 'Nhập email công việc hợp lệ.');
      await page.locator('#formState').selectOption('error');
      check(browser, name, 'invalid association removed', await page.locator('#emailInput').getAttribute('aria-describedby'), null);
      check(browser, name, 'Vietnamese error banner', await page.locator('#errBanner .cs-alert__title').textContent(), 'Đăng nhập thất bại');
      check(browser, name, 'auxiliary controls explicitly unavailable', await page.locator('#loginForm button[type=button]').evaluateAll(els => els.every(e => e.disabled)), true);
      await page.locator('#formState').selectOption('default');
      await page.locator('#submitBtn').click();
    } else if (name === 'settings') {
      check(browser, name, 'caller profile retained', await page.locator('#panel-profile input').nth(0).inputValue(), 'Caller profile');
      check(browser, name, 'caller email retained', await page.locator('#panel-profile input').nth(1).inputValue(), 'caller@example.invalid');
      check(browser, name, 'squad identity retained', await page.locator('#panel-profile select').first().inputValue(), 'Growth');
      check(browser, name, 'Vietnamese tab labels', await page.locator('[role=tab]').allTextContents(), ['Hồ sơ', 'Thông báo', 'Giao diện', 'Đội ngũ']);
      const tab = page.locator('#tab-profile');
      await tab.focus();
      await tab.press('ArrowRight');
      check(browser, name, 'native tab arrow focus', await page.evaluate(() => document.activeElement.id), 'tab-notifications');
      check(browser, name, 'notification panel visible', await page.locator('#panel-notifications').isVisible(), true);
      check(browser, name, 'localized tablist name', await page.locator('[role=tablist]').getAttribute('aria-label'), 'Các mục cài đặt');
      check(browser, name, 'save unavailable', await page.locator('.actions button').last().isDisabled(), true);
      check(browser, name, 'delete unavailable', await page.locator('.danger button').isDisabled(), true);
      await page.locator('#tab-profile').click();
      await page.locator('.actions button').first().click();
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      check(browser, name, 'reset restores sample profile', await page.locator('#panel-profile input').nth(0).inputValue(), 'Nguyễn Hoàng An');
      check(browser, name, 'reset restores English scope', await page.locator('html').getAttribute('lang'), 'en');
    } else {
      check(browser, name, 'Vietnamese project headings', await page.locator('.pd-grid h2').allTextContents(), ['Công việc', 'Hành trình phát hành này', 'Chi tiết', 'Các lần phát hành gần đây']);
      check(browser, name, 'sample task identities retained', await page.locator('.task .nm').allTextContents(), ['Glass surface bindings', 'Element-pack verifier v2', 'Dark-mode APCA re-check', 'Figma variable sync']);
      check(browser, name, 'sample task language scope', await page.locator('.task .nm').evaluateAll(els => els.map(e => e.lang)), ['en', 'en', 'en', 'en']);
      await page.locator('.pd-actions .cs-button').last().focus();
      await page.locator('.pd-actions .cs-button').last().press('Enter');
      await page.evaluate(() => new Promise(r => requestAnimationFrame(r)));
      check(browser, name, 'native board activation destination', new URL(page.url()).pathname, '/ui_kits/status-hub/index.html');
      if (new URL(page.url()).pathname.endsWith('/index.html')) {
        await page.locator('#root > .sh').waitFor();
        check(browser, name, 'actual board mounts', (await page.locator('button.card').count()) > 0, true);
      }
    }
    check(browser, name, 'no authentication/account/delivery request', requests, []);
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
  scope: 'Raw Login/Settings/Project three-engine finite skip, native language/state/tab/reset/navigation, caller value/sample identity retention, truthful local account/release boundaries and invalid error naming. Not real authentication/account data, all axes, mobile/IME, speech or operator acceptance.'
};
if (process.env.CS_STATUS_SECONDARY_REPORT) writeFileSync(process.env.CS_STATUS_SECONDARY_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({
  cases: rows.length,
  failures
}));
process.exitCode = failures ? 1 : 0;
