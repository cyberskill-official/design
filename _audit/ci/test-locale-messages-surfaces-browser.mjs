import assert from'node:assert/strict';import{withBrowserFixture}from'./lib/browser-fixture.mjs';
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 await page.goto(origin+'/_audit/story-coverage.html');await page.waitForFunction(()=>window.__storycov);
 const coverage=await page.evaluate(()=>__storycov);assert.equal(coverage.pass,true,JSON.stringify(coverage));
 await page.goto(origin+'/_audit/component-behavior-test.html');await page.waitForFunction(()=>window.__behavior,{},{timeout:120000});
 const behavior=await page.evaluate(()=>__behavior);assert.equal(behavior.pass,true,JSON.stringify(behavior));
 assert(behavior.results.some(row=>row.name==='LocaleProvider — scoped copy update and sibling isolation'&&row.ok));
 console.log('PASS current Atomic catalog coverage and '+behavior.total+' behavior checks including scoped provider update');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
