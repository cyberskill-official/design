import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 const failures=[];
 for(const value of [0,null,false,'']){
  await page.evaluate(value=>renderFixture(React.createElement(CS.NavigationMenu,{key:String(value),items:[{label:'Services',panel:[{label:'Item',desc:value}]}]})),value);
  await page.getByRole('button',{name:'Services'}).click();
  const descriptions=await page.locator('.cs-navmenu__card small').allTextContents();
  if(JSON.stringify(descriptions)!==JSON.stringify(value===0?['0']:[])) failures.push({value,descriptions});
 }
 await page.route('**/fallback-content-broken',route=>route.fulfill({status:404,body:''}));
 await page.evaluate(()=>renderFixture(React.createElement(CS.Image,{src:'/fallback-content-broken',fallback:0})));
 await page.locator('.cs-image__fallback').waitFor();
 if(await page.locator('.cs-image__fallback').textContent()!=='0') failures.push('Image replaces zero with default art');
 for(const value of [null,false,'']){
  await page.evaluate(value=>renderFixture(React.createElement(CS.Image,{src:'/fallback-content-broken',fallback:value})),value);
  assert.equal(await page.locator('.cs-image__fallback > svg').count(),1,'Existing empty fallback keeps default art');
 }
 await page.evaluate(()=>renderFixture(React.createElement(CS.Image,{src:'/fallback-content-broken',fallback:React.createElement('b',null,'Unavailable')})));
 assert.equal(await page.locator('.cs-image__fallback > b').textContent(),'Unavailable');
 assert.deepEqual(failures,[],'Declared ReactNode description/fallback must preserve zero');
 console.log('PASS remaining content: NavigationMenu description and Image zero/rich/empty fallback transitions');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
