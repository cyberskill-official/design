import fs from 'node:fs';
import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const runtime = fs.readFileSync(process.env.CS_TEMPLATE_CONTROL_RUNTIME || new URL('../../templates/_vendor/support.js', import.meta.url), 'utf8');
const results = [];
const ordinary = '<main><sc-for list="{{ rows }}" as="r"><p class="record">{{ r.name }}</p></sc-for><span id="literal" title="<sc-for>">{{ literal }}</span></main>';
const table = '<table id="records"><thead><tr><th>Name</th><sc-if value="{{ second }}"><th>Extra</th></sc-if></tr></thead><tbody><sc-if value="{{ show }}"><sc-for list="{{ rows }}" as="r"><tr><td>{{ r.name }}</td><sc-if value="{{ second }}"><td>{{ r.extra }}</td></sc-if></tr></sc-for></sc-if></tbody></table><span id="literal" title="<sc-for>">{{ literal }}</span>';
const svg = '<svg width="100" height="40"><sc-for list="{{ rows }}" as="r"><circle class="dot" cx="{{ r.n }}" cy="10" r="2"></circle></sc-for></svg>';
function html(origin, markup, changed = false) {
  return '<!doctype html><html><head><script src="' + origin + '/_vendor/react/react.production.min.js"></script><script src="' + origin + '/_vendor/react/react-dom.production.min.js"></script><script src="' + origin + '/templates/_vendor/support.js"></script></head><body><x-dc><helmet><style>:root{--literal-control:"<sc-for>"}</style></helmet>' + markup + '</x-dc><script type="text/x-dc" data-dc-script data-props=\'{"count":{"default":2},"show":{"default":true},"second":{"default":true}}\'>class Component extends DCLogic {renderVals(){return {show:this.props.show,second:this.props.second,rows:Array.from({length:this.props.count},(_,i)=>({n:i+1,name:"Row "+(i+1),extra:"Extra "+(i+1)})),literal:"<sc-for>"};}}' + (changed ? '\n// changed source' : '') + '</script></body></html>';
}
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  await page.route('**/support.js', r => r.fulfill({
    contentType: 'text/javascript',
    body: runtime
  }));
  const wait = () => page.waitForFunction(() => window.__dcRootName?.() && document.querySelector('[data-sc-name]'));
  let calls = 0;
  const ordinaryUrl = origin + '/__source_probe/ordinary.dc.html';
  await page.route(ordinaryUrl, r => {
    calls++;
    return r.fulfill({
      contentType: 'text/html',
      body: html(origin, ordinary)
    });
  });
  await page.goto(ordinaryUrl);
  await wait();
  assert.equal(await page.locator('.record').count(), 2);
  assert.equal(calls, 1);
  assert.equal(await page.locator('#literal').textContent(), '<sc-for>');
  results.push({
    browserName,
    case: 'ordinary-http-no-extra-request',
    pass: true
  });
  calls = 0;
  const tableUrl = origin + '/__source_probe/table.dc.html';
  await page.route(tableUrl, r => {
    calls++;
    return r.fulfill({
      contentType: 'text/html',
      body: html(origin, table)
    });
  });
  await page.goto(tableUrl);
  await wait();
  const states = [{
    count: 2,
    show: true,
    second: true
  }, {
    count: 3,
    show: true,
    second: false
  }, {
    count: 3,
    show: false,
    second: false
  }, {
    count: 0,
    show: true,
    second: true
  }, {
    count: 1,
    show: true,
    second: true
  }];
  for (const state of states) {
    await page.evaluate(state => window.__dcSetProps(window.__dcRootName(), state), state);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const expected = state.show ? state.count : 0;
    assert.equal(await page.locator('#records tbody tr').count(), expected);
    assert.equal(await page.locator('#records thead th').count(), state.second ? 2 : 1);
    assert.equal(await page.locator('#records tbody td').count(), expected * (state.second ? 2 : 1));
    assert.equal(await page.locator('#literal').textContent(), '<sc-for>');
    assert.equal(await page.locator('#literal').getAttribute('title'), '<sc-for>');
    assert.equal(calls, 2);
    results.push({
      browserName,
      case: 'dynamic-table-conditional',
      state,
      pass: true
    });
  }
  for (const failure of ['unavailable', 'changed', 'host-count', 'network-abort']) {
    let count = 0;
    const url = origin + '/__source_probe/' + failure + '.dc.html';
    await page.route(url, r => {
      count++;
      if (failure === 'network-abort' && count > 1) return r.abort('failed');
      return r.fulfill({
        status: failure === 'unavailable' && count > 1 ? 404 : 200,
        contentType: 'text/html',
        body: failure === 'host-count' && count > 1 ? html(origin, table).replace('</body>', '<x-dc><p>Changed source root</p></x-dc></body>') : html(origin, table, failure === 'changed' && count > 1)
      });
    });
    await page.goto(url);
    await page.locator('.sc-logic-error').waitFor();
    assert.equal(await page.locator('[data-sc-name]').count(), 0);
    assert.match(await page.locator('.sc-logic-error').textContent(), failure === 'unavailable' || failure === 'network-abort' ? /Unable to read original/ : failure === 'host-count' ? /host count changed/ : /source changed/);
    assert.equal(count, 2);
    results.push({
      browserName,
      case: 'source-' + failure + '-fails-closed',
      pass: true
    });
  }
  for (const [name, markup, broken, selector, count] of [['ordinary', ordinary, false, '.record', 2], ['materialized', '<table id="records"><tbody><tr><td>Ready A</td></tr><tr><td>Ready B</td></tr></tbody></table>', false, '#records tbody tr', 2], ['damaged-table', table, true, null, 0]]) {
    const blobUrl = await page.evaluate(body => URL.createObjectURL(new Blob([body], {
      type: 'text/html'
    })), html(origin, markup));
    await page.goto(blobUrl);
    if (broken) {
      await page.locator('.sc-logic-error').waitFor();
      assert.equal(await page.locator('[data-sc-name]').count(), 0);
      assert.match(await page.locator('.sc-logic-error').textContent(), /HTTP\(S\) preview/);
    } else {
      await wait();
      assert.equal(await page.locator(selector).count(), count);
    }
    results.push({
      browserName,
      case: 'non-http-' + name,
      pass: true
    });
  }
  const mixedUrl = origin + '/__source_probe/mixed.dc.html';
  await page.route(mixedUrl, r => r.fulfill({
    contentType: 'text/html',
    body: html(origin, table + svg)
  }));
  await page.goto(mixedUrl);
  await wait();
  assert.equal(await page.locator('#records tbody tr').count(), 2);
  assert.equal(await page.locator('svg .dot').count(), 2);
  results.push({
    browserName,
    case: 'mixed-svg-and-table-controls',
    pass: true
  });
  console.log(browserName, 'boundarycases', results.filter(r => r.browserName === browserName).length);
}, {
  browserName
});
assert.equal(results.length, 42);
if (process.env.CS_TEMPLATE_CONTROL_BOUNDARY_REPORT) fs.writeFileSync(process.env.CS_TEMPLATE_CONTROL_BOUNDARY_REPORT, JSON.stringify({
  results,
  scope: 'Sharedruntime boundarycontrols. NonHTTPtests use same-originblobURLs with React/support supplied overloopbackHTTP: DOMfallback behavior only, not full offlineassetclosure/export/host/native/operatoracceptance.'
}, null, 2) + '\n', {
  flag: 'wx'
});
