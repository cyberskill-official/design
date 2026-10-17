import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 await page.evaluate(()=>{
  window.drawSteps=(current,count=3)=>renderFixture(React.createElement(CS.Steps,{current,steps:Array.from({length:count},(_,i)=>({title:'Step '+i,n:i,body:0}))}));drawSteps(0);
 });
 assert.equal(await page.locator('[aria-current="step"]').count(),1,'Current step is programmatically exposed');
 assert.equal(await page.locator('.cs-step__marker').first().textContent(),'0','Explicit zero marker is preserved');
 assert.equal(await page.locator('.cs-step__body').first().textContent(),'0','Numeric body content is preserved');
 await page.evaluate(()=>drawSteps(1));
 assert.equal(await page.locator('[aria-current="step"] .cs-step__title').textContent(),'Step 1');
 assert.equal(await page.locator('[aria-current="step"]').count(),1);
 assert.equal(await page.locator('.cs-step--done').count(),1);
 await page.evaluate(()=>drawSteps(3));
 assert.equal(await page.locator('[aria-current]').count(),0,'Completed sequence has no current item');
 assert.equal(await page.locator('.cs-step--done').count(),3);
 await page.evaluate(()=>drawSteps(0,0));assert.equal(await page.getByRole('listitem').count(),0);
 console.log('PASS Steps: current semantics, live transitions, zero ReactNode values, completed and empty sequences');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
