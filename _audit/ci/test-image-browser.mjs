import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 await page.route('**/image-contract/*',route=>route.request().url().endsWith('/broken')?route.fulfill({status:404,body:''}):route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="red"/></svg>'}));
 await page.evaluate(()=>{
  window.drawImage=(src,preview=true)=>renderFixture(React.createElement(CS.Image,{src:'/image-contract/'+src,alt:'Sample',preview}));
  drawImage('broken');
 });
 await page.locator('.cs-image__fallback').waitFor();
 await page.evaluate(()=>drawImage('valid'));
 await page.waitForFunction(()=>document.querySelector('.cs-image.is-zoomable img')?.complete,{},{timeout:3000});
 assert.equal(await page.locator('.cs-image__fallback').count(),0,'New src recovers after failure');
 await page.getByRole('button',{name:'Preview image: Sample'}).click();
 await page.getByRole('dialog').waitFor();
 await page.evaluate(()=>drawImage('valid',false));
 assert.equal(await page.getByRole('dialog').count(),0,'Disabling preview closes existing modal');
 await page.evaluate(()=>drawImage('valid',true));
 assert.equal(await page.getByRole('dialog').count(),0,'Re-enabling preview does not reopen');
 await page.getByRole('button',{name:'Preview image: Sample'}).click();
 await page.evaluate(()=>drawImage('other'));
 assert.equal(await page.getByRole('dialog').count(),0,'Changing source closes preview');
 await page.waitForFunction(()=>document.querySelector('.cs-image.is-zoomable img')?.complete);
 await page.evaluate(()=>drawImage('broken'));
 await page.locator('.cs-image__fallback').waitFor();
 assert.equal(await page.getByRole('button').count(),0,'Failed source is not previewable');
 console.log('PASS Image: failed-source recovery, replacement, preview disable/re-enable and source-change closure');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
