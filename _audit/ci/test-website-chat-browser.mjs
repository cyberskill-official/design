import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const {
  withBrowserFixture
} = await import(pathToFileURL(join(root, '_audit/ci/lib/browser-fixture.mjs')));
const rows = [];
const check = (browser, name, actual, expected) => rows.push({
  browser,
  name,
  actual,
  expected,
  pass: JSON.stringify(actual) === JSON.stringify(expected)
});
for (const browser of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  await page.goto(new URL('/ui_kits/website/chat.html', page.url()).href);
  await page.locator('.lumi-page').waitFor();
  check(browser, 'skip target exists', await page.locator('#main').count(), 1);
  await page.locator('.cs-skip').focus();
  await page.locator('.cs-skip').press('Enter');
  check(browser, 'skip activation focuses main', await page.evaluate(() => document.activeElement.id), 'main');
  check(browser, 'English skip link', await page.locator('.cs-skip').innerText(), 'Skip to content');
  check(browser, 'intro discloses local preview', (await page.locator('.cs-chat-msg__bubble').first().innerText()).includes('scripted preview'), true);
  check(browser, 'prompt overrides false handoff hint', (await page.locator('.cs-prompt__hint').innerText()).includes('does not send'), true);
  const input = page.locator('.cs-prompt__field');
  await input.fill('Reset this pending wish');
  await page.locator('.cs-prompt__bar button').click();
  await page.locator('.cs-typing').waitFor();
  await input.fill('Second pending wish');
  await page.locator('.cs-prompt__bar button').click();
  check(browser, 'two pending caller messages', await page.locator('.cs-chat-msg--user').count(), 2);
  await page.locator('.lumi-new button').click();
  check(browser, 'reset immediately clears typing', await page.locator('.cs-typing').count(), 0);
  await page.waitForTimeout(1400);
  check(browser, 'reset cancels queued reply', await page.locator('.lumi-answer-card').count(), 0);
  const requests = [];
  page.on('request', r => {
    if (r.method() !== 'GET') requests.push(r.method());
  });
  await input.fill('Caller text');
  await page.locator('.cs-prompt__bar button').click();
  await page.locator('.lumi-answer-card').waitFor();
  check(browser, 'handoff explicitly unavailable', await page.locator('.lumi-answer-card button').nth(1).isDisabled(), true);
  check(browser, 'confidence explicitly sample', await page.locator('.cs-confidence__head span').allTextContents(), ['Sample confidence', 'High']);
  check(browser, 'disclosure avoids generated/reviewed claim', await page.locator('.cs-ai-disclosure__badge').innerText(), 'Scripted sample');
  await page.locator('.cs-ai-disclosure__badge').click();
  check(browser, 'disclosure accurately describes script', (await page.locator('.cs-ai-disclosure__details').innerText()).includes('No model or human review'), true);
  await page.keyboard.press('Escape');
  await page.locator('.lumi-answer-card button').last().click();
  check(browser, 'refine focuses composer', await input.evaluate(el => document.activeElement === el), true);
  check(browser, 'submitted draft cleared', await input.inputValue(), '');
  await input.fill('Unsent caller draft');
  const lang = page.locator('.lumi-language');
  check(browser, 'native language toggle exists', await lang.count(), 1);
  if (await lang.count()) {
    await lang.click();
    check(browser, 'Vietnamese document scope', await page.locator('html').getAttribute('lang'), 'vi');
    check(browser, 'Vietnamese skip link', await page.locator('.cs-skip').innerText(), 'Bỏ qua đến nội dung');
    check(browser, 'existing answer follows Vietnamese', (await page.locator('.lumi-answer-card p').innerText()).includes('bản xem trước theo kịch bản'), true);
    check(browser, 'caller draft retained on language change', await input.inputValue(), 'Unsent caller draft');
    check(browser, 'caller text retained', await page.locator('.cs-chat-msg--user .cs-chat-msg__bubble').innerText(), 'Caller text');
    check(browser, 'Vietnamese child localization', await page.locator('.cs-confidence__head span').allTextContents(), ['Độ tin cậy minh họa', 'Cao']);
    await lang.click();
    check(browser, 'English document restored', await page.locator('html').getAttribute('lang'), 'en');
  }
  check(browser, 'chat does not deliver requests', requests, []);
}, {
  browserName: browser,
  contextOptions: {
    viewport: {
      width: 1280,
      height: 900
    }
  }
});
const failures = rows.filter(r => !r.pass).length;
const report = {
  recordedAt: new Date().toISOString(),
  cases: rows.length,
  failures,
  exitCode: failures ? 1 : 0,
  rows,
  scope: 'Actual raw standalone Chat entrypoint in three engines: skip target/name, truthful local script hint/disclosure/sample confidence, cancellation after reset, unavailable handoff, built-in locale and caller text. Finite local controls; not delivery, real OS IME, assistive speech, full responsive or human acceptance.'
};
if (process.env.CS_CHAT_REPORT) writeFileSync(process.env.CS_CHAT_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({
  cases: rows.length,
  failures
}));
process.exitCode = failures ? 1 : 0;
