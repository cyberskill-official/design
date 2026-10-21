import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const root = new URL('../../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const sha = text => createHash('sha256').update(text).digest('hex');
const dtcg = read('tokens/tokens.dtcg.json'),
  css = read('tokens/tokens.json');
const cssRows = Object.entries(JSON.parse(css)).filter(([scope]) => !scope.startsWith('$')).reduce((total, [, groups]) => total + Object.values(groups).reduce((count, bag) => count + Object.keys(bag).length, 0), 0);
const report = {
  sourceHashes: Object.fromEntries(['tokens/viewer.html', 'tokens/tokens.dtcg.json', 'tokens/tokens.json'].map(path => [path, sha(read(path))])),
  cases: [],
  scope: 'Actual browser fetch/source switching, loading/error recovery, mode consistency and keyboard copy fallback focus. Responses controlled at the browser route; an additional signal-stripped fetch adapter proves latest-generation ownership even when cancellation cannot stop a response. Clipboard/execCommand observers are memory-only; no OS clipboard integration or human/AT acceptance.'
};
for (const browserName of process.env.CS_TEST_BROWSER ? [process.env.CS_TEST_BROWSER] : ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  const base = new URL(page.url()).origin;
  const ready = async source => {
    await page.waitForFunction(source => window.__csTokensViewer?.state === 'ready' && window.__csTokensViewer.source === source, source);
    assert.equal(await page.locator('#raw').textContent(), source === 'tokens.json' ? css : dtcg);
    assert.equal(await page.locator('#tablePanel').getAttribute('aria-busy'), 'false');
  };
  await page.goto(base + '/tokens/viewer.html');
  await ready('tokens.dtcg.json');
  for (const ignoreAbort of [false, true]) {
    await page.evaluate(ignoreAbort => {
      window.__csViewerFetch = window.__csViewerFetch || window.fetch;
      window.__csViewerSettled = 0;
      window.fetch = async (input, options) => {
        try {
          return await window.__csViewerFetch(input, ignoreAbort ? {
            ...options,
            signal: undefined
          } : options);
        } finally {
          window.__csViewerSettled++;
        }
      };
    }, ignoreAbort);
    let resolveHeld, release, done;
    const held = new Promise(resolve => resolveHeld = resolve),
      gate = new Promise(resolve => release = resolve),
      completed = new Promise(resolve => done = resolve);
    await page.route('**/tokens/tokens.json', async route => {
      resolveHeld();
      await gate;
      try {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: css
        });
      } catch (error) {
        if (ignoreAbort) throw error;
      } finally {
        done();
      }
    });
    await page.locator('#source').selectOption('tokens.json');
    await held;
    assert.equal(await page.locator('#tbody tr').count(), 0);
    assert.equal(await page.locator('#raw').textContent(), '');
    assert.equal(await page.locator('#tablePanel').getAttribute('aria-busy'), 'true');
    assert.equal(await page.locator('#sourceStatus').isVisible(), true);
    assert.equal(await page.locator('#empty').isVisible(), false);
    await page.locator('#modeRaw').click();
    assert.equal(await page.evaluate(() => __csTokensViewer.mode), 'raw');
    await page.locator('#source').selectOption('tokens.dtcg.json');
    await ready('tokens.dtcg.json');
    release();
    await completed;
    await page.waitForFunction(() => window.__csViewerSettled === 2);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await ready('tokens.dtcg.json');
    assert.equal(await page.locator('#source').inputValue(), 'tokens.dtcg.json');
    assert.equal(await page.locator('#raw').isVisible(), true);
    report.cases.push({
      browserName,
      case: 'late response',
      ignoreAbort,
      selected: 'tokens.dtcg.json',
      displayedRawSha: sha(await page.locator('#raw').textContent())
    });
    await page.unroute('**/tokens/tokens.json');
    await page.locator('#modeTable').click();
  }
  await page.evaluate(() => window.fetch = window.__csViewerFetch);
  for (const failure of ['HTTP500', 'network', 'invalid JSON']) {
    await page.route('**/tokens/tokens.json', route => failure === 'network' ? route.abort('failed') : route.fulfill({
      status: failure === 'HTTP500' ? 500 : 200,
      contentType: 'application/json',
      body: failure === 'HTTP500' ? '{"error":"sentinel"}' : '{invalid'
    }));
    await page.locator('#source').selectOption('tokens.json');
    await page.waitForFunction(() => window.__csTokensViewer?.state === 'error');
    assert.equal(await page.locator('#sourceError').isVisible(), true);
    assert.match(await page.locator('#sourceError').textContent(), /Could not load tokens\.json.*Select another source to retry/);
    if (failure === 'HTTP500') assert.match(await page.locator('#sourceError').textContent(), /HTTP 500/);
    assert.equal(await page.locator('#tbody tr').count(), 0);
    assert.equal(await page.locator('#raw').textContent(), '');
    assert.equal(await page.locator('#chips button').count(), 0);
    assert.equal(await page.locator('#empty').isVisible(), false);
    assert.equal(await page.locator('#tablePanel').getAttribute('aria-busy'), 'false');
    assert.equal(await page.locator('#sourceStatus').isVisible(), false);
    report.cases.push({
      browserName,
      case: failure,
      rows: 0,
      error: await page.locator('#sourceError').textContent()
    });
    await page.unroute('**/tokens/tokens.json');
    await page.locator('#source').selectOption('tokens.dtcg.json');
    await ready('tokens.dtcg.json');
    assert.equal(await page.locator('#sourceError').isVisible(), false);
  }
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: async () => {
        throw Error('blocked');
      }
    }
  }));
  for (const outcome of ['success', 'false', 'throw']) {
    await page.evaluate(outcome => {
      window.__csTokensLastCopy = null;
      window.__csFallback = [];
      document.execCommand = command => {
        window.__csFallback.push({
          command,
          value: document.activeElement.value
        });
        if (outcome === 'throw') throw Error('blocked fallback');
        return outcome === 'success';
      };
    }, outcome);
    const target = page.locator('#tbody .copy').first();
    await target.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => window.__csTokensLastCopy);
    assert.equal(await target.evaluate(el => document.activeElement === el), true);
    assert.equal(await page.locator('textarea').count(), 0);
    assert.equal(await page.evaluate(() => __csTokensLastCopy.ok), outcome === 'success');
    assert.equal(await page.evaluate(() => __csTokensViewer.lastCopied), await target.getAttribute('data-v'));
    assert.deepEqual(await page.evaluate(() => __csFallback), [{
      command: 'copy',
      value: await target.getAttribute('data-v')
    }]);
    assert.match(await page.locator('#toast').textContent(), outcome === 'success' ? /^Copied path$/ : /^Could not copy\. Select the token text and copy it manually\.$/);
    report.cases.push({
      browserName,
      case: 'keyboard copy fallback',
      outcome,
      focusRetained: true,
      message: await page.locator('#toast').textContent()
    });
  }
  for (const destination of ['q', 'modeRaw', 'source']) {
    await page.locator('#modeTable').click();
    if ((await page.locator('#source').inputValue()) !== 'tokens.dtcg.json') await page.locator('#source').selectOption('tokens.dtcg.json');
    await ready('tokens.dtcg.json');
    await page.evaluate(() => {
      window.__csTokensLastCopy = null;
      window.__csRejectCopy = null;
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: () => new Promise((resolve, reject) => window.__csRejectCopy = reject)
        }
      });
      document.execCommand = () => false;
    });
    const target = page.locator('#tbody .copy').first();
    await target.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => window.__csRejectCopy);
    await page.locator('#' + destination).focus();
    if (destination === 'modeRaw') await page.keyboard.press('Enter');
    if (destination === 'source') {
      await page.locator('#source').selectOption('tokens.json');
      await ready('tokens.json');
    }
    await page.evaluate(() => __csRejectCopy(Error('delayed denial')));
    await page.waitForFunction(() => window.__csTokensLastCopy);
    assert.equal(await page.evaluate(() => document.activeElement.id), destination, 'A delayed clipboard denial must preserve the latest user focus');
    assert.equal(await page.locator('textarea').count(), 0);
    report.cases.push({
      browserName,
      case: 'delayed copy denial',
      destination,
      latestFocusRetained: true
    });
  }
  await page.locator('#modeTable').click();
  if ((await page.locator('#source').inputValue()) !== 'tokens.json') await page.locator('#source').selectOption('tokens.json');
  await ready('tokens.json');
  assert.equal(await page.locator('#tbody tr').count(), cssRows);
  assert.equal(await page.locator('#sourceError').isVisible(), false);
  report.cases.push({
    browserName,
    case: 'successful recovery',
    source: 'tokens.json',
    rows: cssRows
  });
}, {
  browserName
});
const output = process.argv.find(arg => arg.startsWith('--evidence='))?.slice(11) || process.env.CS_TOKEN_VIEWER_LIFECYCLE_EVIDENCE;
if (output) writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
