import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { sourceDocumentHeaders } from './lib/source-document-headers.mjs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const root = new URL('../../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const title = path => read(path).toString().match(/^# (.*)$/m)[1];
const docCatalog = JSON.parse(read('_audit/docs-catalog.json'));
const expectedPaths = [...docCatalog.entrance, ...docCatalog.pages].map(entry => entry.path).sort();
const localizedPath = (path, language) => language === 'vi'
  ? docCatalog.entrance.find(entry => entry.path === path)?.pathVi || (path.startsWith('docs/') ? 'docs/vi/' + path.slice(5) : path)
  : path;
const viewerHeaders = html => sourceDocumentHeaders('docs/viewer.html', html);
const run = async (page, browserName) => {
  const base = new URL(page.url()).origin;
  await page.route('**/docs/viewer.html*', async route => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: {
        ...response.headers(),
        ...viewerHeaders(await response.text())
      }
    });
  });
  const ready = () => page.waitForFunction(() => document.querySelector('#err').hidden && document.querySelector('#doc').dataset.state === 'ready');
  const fresh = async name => {
    await page.evaluate(() => localStorage.setItem('cs-docs-lang', 'en'));
    await page.goto(`${base}/docs/viewer.html?case=${name}#reader-reset`);
    await ready();
  };
  const nav = path => page.locator(`#navlinks a[data-p="${path}"]`);
  const settled = () => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const current = expected => page.waitForFunction(expected => document.querySelector('#doc h1')?.textContent === expected, expected);
  const hold = async path => {
    let started, release, finished;
    const requested = new Promise(r => started = r),
      gate = new Promise(r => release = r),
      done = new Promise(r => finished = r);
    const networkFinished = page.waitForEvent('requestfinished', {
      predicate: request => new URL(request.url()).pathname === '/' + path
    });
    await page.route('**/' + path, async route => {
      const response = await route.fetch();
      started();
      await gate;
      await route.fulfill({
        response
      });
      finished();
    });
    return {
      requested,
      release: async () => {
        release();
        await done;
        await networkFinished;
        await settled();
      },
      clear: () => page.unroute('**/' + path)
    };
  };
  const languageUi = async language => {
    assert.equal(await page.locator('html').getAttribute('lang'), language);
    assert.equal(await page.locator('#nav').getAttribute('lang'), language);
    assert.equal(await page.locator('.langtog').getAttribute('aria-label'), language === 'vi' ? 'Ngôn ngữ tài liệu' : 'Doc language');
    assert.equal(await page.locator('#docsearch').getAttribute('aria-label'), language === 'vi' ? 'Tìm mọi tài liệu' : 'Search all docs');
    for (const choice of ['en', 'vi']) assert.equal(await page.locator('#lang-' + choice).getAttribute('aria-pressed'), String(choice === language));
  };
  await page.evaluate(() => localStorage.removeItem('cs-docs-lang'));
  await page.goto(`${base}/docs/viewer.html?case=default#README.md`);
  await ready();
  await languageUi('vi');
  await page.evaluate(() => {
    window.__readerInlineProbe = false;
    const script = document.createElement('script');
    script.textContent = 'window.__readerInlineProbe=true';
    document.head.append(script);
    script.remove();
  });
  assert.equal(await page.evaluate(() => window.__readerInlineProbe), false, 'Exact deployment CSP must reject an unauthorized inline script');
  assert.equal(await page.locator('#doc').getAttribute('lang'), 'vi');
  await page.evaluate(() => localStorage.setItem('cs-docs-lang', 'fr'));
  await page.reload();
  await ready();
  await languageUi('vi');
  await page.getByRole('button', {
    name: 'EN',
    exact: true
  }).click();
  await ready();
  await page.reload();
  await ready();
  await languageUi('en');
  await fresh('entrance-language-link');
  await page.locator('#doc a[href="docs/vi/entrypoints/README.md"]').click();
  await ready();
  await languageUi('vi');
  assert.equal(await page.locator('#doc').getAttribute('lang'), 'vi');
  assert.equal(await page.locator('#doc h1').innerText(), title('docs/vi/entrypoints/README.md'));
  for (const example of await page.locator('#doc pre').all()) assert.equal(await example.getAttribute('lang'), 'en', 'Literal source examples retain their language scope');
  await fresh('loading-language');
  await page.getByRole('button', {
    name: 'VI',
    exact: true
  }).click();
  await ready();
  await nav('docs/consuming.md').click();
  await ready();
  const loading = await hold(localizedPath('README.md', 'vi'));
  await nav('README.md').click();
  await loading.requested;
  assert.equal(await page.locator('#doc').innerText(), 'Đang tải…');
  assert.equal(await page.locator('#doc').getAttribute('lang'), 'vi');
  assert.equal(await page.locator('#doc').getAttribute('aria-busy'), 'true');
  await loading.release();
  await ready();
  assert.equal(await page.locator('#doc').getAttribute('lang'), 'vi');
  assert.equal(await page.locator('#doc').getAttribute('aria-busy'), 'false');
  await loading.clear();
  for (const language of ['en', 'vi']) {
    await page.getByRole('button', {
      name: language.toUpperCase(),
      exact: true
    }).click();
    await ready();
    await languageUi(language);
    for (const [query, kind] of [['cs-reader-no-result-z9', 'zero'], ['github_copy_files', 'one'], ['CyberSkill', 'many']]) {
      await page.locator('#docsearch').fill(query);
      await page.waitForFunction(query => document.querySelector('.searchres')?.textContent.includes(query), query);
      const hits = await page.locator('.searchhit').count();
      assert(kind === 'zero' ? hits === 0 : kind === 'one' ? hits === 1 : hits > 1, `${language} ${kind} search`);
      assert.equal(await page.locator('.searchres').innerText(), language === 'vi' ? `${hits} kết quả cho “${query}”` : `${hits} match${hits === 1 ? '' : 'es'} for “${query}”`);
      for (const hit of await page.locator('.searchhit').all()) {
        const path = (await hit.getAttribute('href')).slice(1);
        assert.equal(await hit.locator('.snip').getAttribute('lang'), language, path);
      }
      if (kind === 'many') for (const path of ['README.md', 'SKILL.md', 'llms.txt', 'CONTRIBUTING.md']) assert.equal(await page.locator(`.searchhit[href="#${path}"] .snip`).getAttribute('lang'), language);
    }
    await page.locator('#docsearch').fill('');
    await nav('docs/sync.md').waitFor();
  }
  await page.getByRole('button', {
    name: 'VI',
    exact: true
  }).click();
  await ready();
  for (const path of ['docs/vi/sync.md', 'docs/docs/vi/sync.md']) await page.route('**/' + path, route => route.fulfill({
    status: 404,
    body: 'missing documentation',
    contentType: 'text/plain'
  }));
  await nav('docs/sync.md').click();
  await page.locator('#err').waitFor();
  assert.match(await page.locator('#err').innerText(), /^Không thể tải docs\/vi\/sync\.md/);
  assert.equal(await page.locator('#err').getAttribute('lang'), 'vi');
  assert.equal(await page.locator('#err span').getAttribute('lang'), 'en');
  assert.equal(await page.locator('#doc').getAttribute('data-state'), 'error');
  assert.equal(await page.locator('#doc').getAttribute('aria-busy'), 'false');
  assert.equal(await page.locator('#doc').innerText(), '');
  for (const path of ['docs/vi/sync.md', 'docs/docs/vi/sync.md']) await page.unroute('**/' + path);
  await fresh('routes');
  let routes = 0;
  for (const lang of ['en', 'vi']) {
    // Finish the language-triggered load before subscribing to the next route response.
    // Otherwise its overlapping fetch can satisfy the navigation response waiter.
    await page.getByRole('button', {
      name: lang.toUpperCase(),
      exact: true
    }).click();
    await ready();
    const paths = await page.locator('#navlinks a').evaluateAll(nodes => nodes.map(n => n.dataset.p));
    assert.deepEqual([...paths].sort(), expectedPaths, 'Every catalog route must be present exactly once');
    for (const path of paths) {
      const fetched = localizedPath(path, lang);
      const pending = page.waitForResponse(response => new URL(response.url()).pathname === '/' + fetched);
      await nav(path).click();
      const response = await pending;
      assert.equal(response.status(), 200, fetched);
      assert.equal(createHash('sha256').update(await response.body()).digest('hex'), createHash('sha256').update(read(fetched)).digest('hex'), fetched);
      await ready();
      assert.equal(await page.locator('#doc').getAttribute('lang'), lang, fetched);
      assert.equal(await page.locator('#doc').getAttribute('aria-busy'), 'false');
      assert(await page.locator('#doc').innerText().then(text => text.length > 20), fetched);
      routes++;
    }
  }
  // Actual responses arrive out of order; no source HTML or Markdown is replaced.
  await fresh('navigation');
  let delayed = await hold('docs/sync.md');
  await nav('docs/sync.md').click();
  await delayed.requested;
  await nav('docs/ci-cd.md').click();
  await current(title('docs/ci-cd.md'));
  await delayed.release();
  assert.equal(await page.locator('#doc h1').innerText(), title('docs/ci-cd.md'));
  assert.equal(await page.locator('#err').isVisible(), false);
  await delayed.clear();
  await fresh('language');
  delayed = await hold('docs/ci-cd.md');
  await nav('docs/ci-cd.md').click();
  await delayed.requested;
  await page.getByRole('button', {
    name: 'VI',
    exact: true
  }).click();
  await current(title('docs/vi/ci-cd.md'));
  await delayed.release();
  assert.equal(await page.locator('#doc h1').innerText(), title('docs/vi/ci-cd.md'));
  assert.equal(await page.locator('html').getAttribute('lang'), 'vi');
  assert.equal(await page.locator('#doc').getAttribute('lang'), 'vi');
  assert.equal(await page.locator('#doc').getAttribute('aria-busy'), 'false');
  await delayed.clear();
  // A failed old fetch must not erase the newer document. A current failure
  // still has to show the error; all three documented fallback URLs are denied.
  for (const stale of [true, false]) {
    await fresh(stale ? 'stale-error' : 'current-error');
    let started, release, last;
    const requested = new Promise(r => started = r),
      gate = new Promise(r => release = r),
      completed = new Promise(r => last = r);
    let first = true;
    await page.route('**/docs/sync.md', async route => {
      if (first) {
        first = false;
        started();
        await gate;
      }
      await route.fulfill({
        status: 404,
        body: 'missing documentation',
        contentType: 'text/plain'
      });
    });
    await page.route('**/docs/docs/sync.md', async route => {
      await route.fulfill({
        status: 404,
        body: 'missing documentation',
        contentType: 'text/plain'
      });
      last();
    });
    await nav('docs/sync.md').click();
    await requested;
    if (stale) {
      await nav('docs/ci-cd.md').click();
      await current(title('docs/ci-cd.md'));
    }
    release();
    await completed;
    await settled();
    if (stale) {
      assert.equal(await page.locator('#doc h1').innerText(), title('docs/ci-cd.md'));
      assert.equal(await page.locator('#err').isVisible(), false);
    } else {
      await page.locator('#err').waitFor();
      assert.match(await page.locator('#err').innerText(), /Could not load docs\/sync\.md/);
      assert.equal(await page.locator('#doc').innerText(), '');
    }
    await page.unroute('**/docs/sync.md');
    await page.unroute('**/docs/docs/sync.md');
  }
  // Pending search caches remain local to their captured language. A language
  // change must rerun the current query and ignore the old search's completion.
  await fresh('search-language');
  delayed = await hold('docs/sync.md');
  await page.locator('#docsearch').fill('authoring');
  await delayed.requested;
  await page.getByRole('button', {
    name: 'VI',
    exact: true
  }).click();
  await page.waitForFunction(() => document.querySelector('#navlinks .searchres')?.textContent.includes('authoring'));
  const latest = await page.locator('#navlinks').innerText();
  await delayed.release();
  assert.equal(await page.locator('#navlinks').innerText(), latest);
  assert.equal(await page.locator('html').getAttribute('lang'), 'vi');
  await delayed.clear();
  // Concurrent callers share a complete cache promise, not a partially filled map.
  await fresh('search-latest');
  delayed = await hold('docs/sync.md');
  await page.locator('#docsearch').fill('authoring');
  await delayed.requested;
  await page.locator('#docsearch').fill('compiler');
  await page.waitForTimeout(170);
  assert.equal(await page.locator('#navlinks .searchres').count(), 0);
  await delayed.release();
  await page.waitForFunction(() => document.querySelector('#navlinks .searchres')?.textContent.includes('compiler'));
  assert.equal(await page.locator('#docsearch').inputValue(), 'compiler');
  await delayed.clear();
  await fresh('search-clear');
  delayed = await hold('docs/sync.md');
  await page.locator('#docsearch').fill('authoring');
  await delayed.requested;
  await page.locator('#docsearch').fill('');
  await nav('docs/ci-cd.md').waitFor();
  await delayed.release();
  assert.equal(await page.locator('#navlinks .searchres').count(), 0);
  assert.equal(await page.locator('#navlinks a[data-p]').count(), expectedPaths.length);
  await delayed.clear();
  console.log(`PASS documentation reader ${browserName}: ${routes} EN/VI navigation routes with actual response identities; delayed document/language responses, stale/current failures; search language, latest query/cache completion and clear cases under deployment CSP; fresh/saved/invalid language preference, loading/error/selected state, zero/one/many localized search and source-language metadata. No prose semantics or AT/human acceptance.`);
};
for (const browserName of process.env.CS_TEST_BROWSER ? [process.env.CS_TEST_BROWSER] : ['chromium', 'firefox', 'webkit']) await withBrowserFixture(page => run(page, browserName), {
  browserName
});

// Real browser privacy profiles: no storage API or source monkeypatches.
for (const [browserName, launchOptions] of [['chromium', {
  args: ['--disable-local-storage']
}], ['firefox', {
  firefoxUserPrefs: {
    'dom.storage.enabled': false
  }
}]]) {
  if (process.env.CS_TEST_BROWSER && process.env.CS_TEST_BROWSER !== browserName) continue;
  await withBrowserFixture(async page => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = new URL(page.url()).origin;
    await page.route('**/docs/viewer.html*', async route => {
      const response = await route.fetch();
      await route.fulfill({
        response,
        headers: {
          ...response.headers(),
          ...viewerHeaders(await response.text())
        }
      });
    });
    const ready = () => page.waitForFunction(() => document.querySelector('#doc')?.dataset.state === 'ready' && document.querySelector('#err').hidden);
    await page.goto(`${base}/docs/viewer.html?case=storage-disabled#docs/consuming.md`);
    await ready();
    assert.equal(await page.evaluate(() => localStorage), null, 'Profile must actually disable storage');
    assert.equal(await page.locator('html').getAttribute('lang'), 'vi');
    assert.equal(await page.locator('#doc').getAttribute('lang'), 'vi');
    assert.equal(await page.locator('#navlinks a').count(), expectedPaths.length);
    await page.getByRole('button', {
      name: 'EN',
      exact: true
    }).click();
    await ready();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('#doc h1').innerText(), title('docs/consuming.md'));
    await page.locator('#docsearch').fill('github_copy_files');
    await page.waitForFunction(() => document.querySelector('.searchres')?.textContent === '1 match for “github_copy_files”');
    await page.locator('.searchhit').click();
    await page.waitForFunction(expected => document.querySelector('#doc h1')?.textContent === expected, title('docs/sync.md'));
    await page.reload();
    await ready();
    assert.equal(await page.locator('html').getAttribute('lang'), 'vi');
    assert.equal(await page.locator('#doc').getAttribute('lang'), 'vi');
    assert.deepEqual(errors, []);
    console.log(`PASS documentation reader ${browserName} actual storage-disabled profile: default, language selection, guide navigation/search and reload without persistence. No WebKit privacy policy or AT claim.`);
  }, {
    browserName,
    launchOptions
  });
}
