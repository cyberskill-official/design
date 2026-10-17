import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
await withBrowserFixture(async page => {
  const base = new URL('/docs/viewer.html', page.url()).href;
  for (const [path, language, expected] of [
    ['README.md', 'en', '123 exports'],
    ['docs/conventions.md', 'en', '119 component exports'],
    ['docs/conventions.md', 'vi', '119 export component'],
    ['docs/figma.md', 'en', '175 typed base tokens'],
    ['docs/figma.md', 'vi', '175 token cơ sở có kiểu'],
  ]) {
    await page.goto(base + '#' + path);
    await page.waitForFunction(path => document.title.includes(path) && document.querySelector('#doc')?.dataset.state === 'ready', path);
    await page.locator('#lang-' + language).click();
    await page.waitForFunction(() => document.querySelector('#doc')?.dataset.state === 'ready');
    await page.waitForFunction(expected => document.querySelector('#doc')?.textContent.includes(expected), expected);
    assert.equal(await page.locator('#err').isVisible(), false);
    assert(!(await page.locator('#doc').innerText()).includes('cs-count:'), path + ': marker leaked');
  }
  await page.locator('#lang-en').click();
  await page.waitForFunction(() => document.querySelector('#doc')?.dataset.state === 'ready');
  await page.locator('#docsearch').fill('123');
  await page.waitForFunction(() => document.querySelectorAll('.searchhit').length > 0);
  const search = await page.locator('#navlinks').innerText();
  assert(search.includes('123')); assert(!search.includes('cs-count:'), 'Search snippets must hide count metadata');
  await page.route('**/README.md', route => route.fulfill({ contentType: 'text/plain', body: '# Fixture\n<!-- cs-count:publicExports -->123<!-- /cs-count --> exports\n<img src=x onerror="window.markerExecuted=true">' }));
  await page.goto(base + '#README.md');
  await page.waitForFunction(() => document.querySelector('#doc')?.textContent.includes('Fixture'));
  assert((await page.locator('#doc').innerText()).includes('123 exports'));
  assert.equal(await page.locator('#doc img').count(), 0, 'Marker cleanup must not enable arbitrary HTML');
  assert.equal(await page.evaluate(() => window.markerExecuted), undefined);
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
console.log('PASS reference viewer: README and EN/VI guides render counts, search hides markers, arbitrary HTML remains escaped');
