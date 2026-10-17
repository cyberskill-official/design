import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  await page.route('**/_ds_manifest.json', route => route.fulfill({ json: { templates: [] } }));
  await page.goto(`${origin}/_audit/theme-overflow.html`);
  await page.waitForFunction(() => window.__theme);
  assert.equal(await page.evaluate(() => window.__theme.pass), false, 'An empty manifest cannot pass');
  const result = await page.evaluate(async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const doc = frame.contentDocument;
    doc.body.innerHTML = '<main data-theme="dark" style="background:#fff;color:#eee;font:16px Arial">' +
      Array.from({ length: 9 }, (_, i) => `<div>Repeated label</div>`).join('') +
      '<div style="display:none"><p>Hidden text</p></div></main>';
    const first = measure(doc);
    const all = stableMeasurement(first, measure(doc));
    const oldFirst = first.fails[0];
    doc.querySelector('main > div').style.color = '#000';
    const second = measure(doc);
    const stable = stableMeasurement(first, second);
    const labelKeys = [nodeKey(doc.querySelectorAll('main > div')[1]), nodeKey(doc.querySelectorAll('main > div')[2])];
    const contrastVerdict = verdict({ ...all, name: 'Board · Meeting deck' });
    frame.remove();
    return { count: all.failN, stableCount: stable.failN, oldFirstSurvived: stable.fails.some(x => x.key === oldFirst.key), labelKeys,
      contrastVerdict, missingDark: verdict({ expectsDark: true, dark: false, over: 0, failN: 0 }),
      loadError: verdict({ error: 'timeout', failN: 0 }),
      emptyDark: verdict({ expectsDark: true, dark: true, checked: 0, failN: 0 }),
      measureError: measure({ defaultView: null }),
      lightOnly: verdict({ expectsDark: false, dark: false, over: 0, failN: 0 }) };
  });
  assert.equal(result.count, 9, 'All leaf div failures must count beyond the six displayed examples');
  assert.equal(result.stableCount, 8);
  assert.equal(result.oldFirstSurvived, false);
  assert.notEqual(...result.labelKeys);
  assert.equal(result.contrastVerdict.fail, true, 'Formerly waived template names cannot suppress a failure');
  assert.equal(result.contrastVerdict.reviewed, false);
  assert.equal(result.missingDark.fail, true);
  assert.equal(result.loadError.fail, true);
  assert.equal(result.emptyDark.fail, true);
  assert.ok(result.measureError.error, 'Measurement exceptions must be errors, not fake contrast nodes');
  assert.equal(result.lightOnly.fail, false);

  // Exercise the actual async iframe path: a declared theme that ignores updates must fail.
  await page.route('**/theme-fixture.html', route => route.fulfill({ contentType: 'text/html', body: `<!doctype html>
    <style>:root { --cs-color-brand-umber:#45210e; }</style><div data-sc-name="Fixture" data-theme="light">Fixture</div>
    <script data-props='{"theme":{"options":["light","dark"]}}'></script>
    <script>window.__dcRootName=()=>"Fixture";window.__dcSetProps=()=>{};</script>` }));
  const missingTheme = await page.evaluate(async () => verdict(await probeOne('/theme-fixture.html')));
  assert.equal(missingTheme.themeFail, true);
  assert.equal(missingTheme.fail, true);

  await page.unroute('**/_ds_manifest.json');
  await page.route('**/_ds_manifest.json', route => route.fulfill({ json: { templates: [
    { name: 'Board · Meeting deck', entryPath: 'contrast-fixture.html' }
  ] } }));
  await page.route('**/contrast-fixture.html', route => route.fulfill({ contentType: 'text/html', body: `<!doctype html>
    <style>:root { --cs-color-brand-umber:#45210e; } body { margin:0;background:#fff;color:#eee; }</style>
    <main data-sc-name="Fixture" data-theme="dark">${'<div>Repeated label</div>'.repeat(9)}</main>
    <script data-props='{"theme":{"options":["light","dark"]}}'></script>
    <script>window.__dcRootName=()=>"Fixture";window.__dcSetProps=()=>{};</script>` }));
  await page.goto(`${origin}/_audit/theme-overflow.html`);
  await page.waitForFunction(() => window.__theme);
  const aggregate = await page.evaluate(() => window.__theme);
  assert.equal(aggregate.pass, false, 'Full gate must reject a previously waived template');
  assert.equal(aggregate.results[0].failN, 9, 'Aggregate keeps total failures');
  assert.equal(aggregate.results[0].fails.length, 6, 'Display cap is applied only after verdict');
  assert.deepEqual(aggregate.reviewed, []);
});
console.log('PASS theme gate: no blanket waiver, complete failure counts, stable node identity, hidden text, missing dark, empty manifest and errors');
