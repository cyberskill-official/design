import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page => {
  const errors=[]; page.on('pageerror', error=>errors.push(error.message));
  await page.evaluate(()=>{
    window.drawAccordion=(allowMultiple,items=3)=>renderFixture(React.createElement(CS.Accordion,{
      allowMultiple,items:Array.from({length:items},(_,i)=>({title:'Section '+i,content:'Content '+i}))
    }));
    drawAccordion(false);
  });
  const buttons=page.locator('.cs-accordion__trigger');
  const states=()=>buttons.evaluateAll(xs=>xs.map(x=>x.getAttribute('aria-expanded')));
  assert.deepEqual(await states(),['true','false','false']);
  await page.evaluate(()=>drawAccordion(true));
  assert.deepEqual(await states(),['true','false','false'],'single to multiple retains the open section without crashing');
  await buttons.nth(1).click();
  assert.deepEqual(await states(),['true','true','false']);
  await page.evaluate(()=>drawAccordion(false));
  assert.deepEqual(await states(),['true','false','false'],'multiple to single retains the first opened section');
  await page.evaluate(()=>drawAccordion(true));
  assert.deepEqual(await states(),['true','false','false'],'discarded open sections must not reopen after another mode switch');
  await buttons.nth(0).click();
  assert.deepEqual(await states(),['false','false','false']);
  await page.evaluate(()=>drawAccordion(false));
  assert.deepEqual(await states(),['false','false','false']);
  await buttons.nth(2).press('Enter');
  assert.deepEqual(await states(),['false','false','true']);
  await page.evaluate(()=>drawAccordion(true,0));
  assert.equal(await buttons.count(),0);
  assert.deepEqual(errors,[]);
  console.log('PASS Accordion mode transitions: retained selection, single-open normalization, no stale reopening, empty collection and keyboard');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
