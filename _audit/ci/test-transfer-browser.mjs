import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 await page.evaluate(()=>{
  window.changes=[];
  window.draw=items=>renderFixture(React.createElement(CS.Transfer,{lang:'en',items,value:[],onChange:v=>changes.push(v)}));
  draw([{key:'a',label:'Alpha'},{key:'b',label:'Beta'}]);
 });
 const alpha=page.getByRole('checkbox',{name:'Alpha'});
 await alpha.focus();await page.keyboard.press('Space');
 assert.equal(await alpha.isChecked(),true);
 assert.equal(await alpha.evaluate(el=>document.activeElement===el),true,'Selection must preserve checkbox DOM and focus');
 await page.keyboard.press('Space');assert.equal(await alpha.isChecked(),false);
 await page.keyboard.press('Space');
 await page.evaluate(()=>draw([{key:'b',label:'Beta'}]));
 await page.locator('.cs-transfer__ops button').first().click();
 assert.deepEqual(await page.evaluate(()=>changes),[],'Removed checked items cannot be emitted');
 await page.evaluate(()=>draw([{key:'a',label:'Alpha'},{key:'b',label:'Beta'}]));
 assert.equal(await page.getByRole('checkbox',{name:'Alpha',exact:true}).isChecked(),false,'Reintroduced item has no stale selection');
 await page.evaluate(()=>{
  function Controlled(){const [value,set]=React.useState([]);return React.createElement(CS.Transfer,{lang:'en',items:[{key:'',label:'Empty'},{key:'__proto__',label:'Prototype'}],value,onChange:v=>{changes.push(v);set(v)}})}
  renderFixture(React.createElement(Controlled));
 });
 await page.getByRole('checkbox',{name:'Empty'}).check();await page.getByRole('checkbox',{name:'Prototype'}).check();
 await page.locator('.cs-transfer__ops button').first().click();
 assert.deepEqual(await page.evaluate(()=>changes.at(-1)),['','__proto__']);
 assert.equal(await page.locator('.cs-transfer__list').last().getByRole('checkbox').count(),2);
 assert.equal(await page.getByRole('checkbox',{checked:true}).count(),0);
 await page.getByRole('checkbox',{name:'Empty'}).check();
 await page.locator('.cs-transfer__ops button').last().click();
 assert.deepEqual(await page.evaluate(()=>changes.at(-1)),['__proto__']);
 assert.equal(await page.locator('.cs-transfer__list').first().getByRole('checkbox',{name:'Empty'}).count(),1);
 console.log('PASS Transfer: stable checkbox focus, dynamic selection pruning, controlled moves and arbitrary string keys');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
