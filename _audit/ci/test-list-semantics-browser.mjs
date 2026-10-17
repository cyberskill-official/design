import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 await page.evaluate(()=>{window.activations=0;window.submissions=0;renderFixture(React.createElement('form',{onSubmit:e=>{e.preventDefault();submissions++},style:{width:400}},React.createElement(CS.List,null,React.createElement(CS.ListItem,{title:'Open record',onClick:()=>activations++}),React.createElement(CS.ListItem,{title:'Static record'}))))});
 assert.equal(await page.getByRole('button',{name:'Open record'}).count(),1,'Interactive list item exposes button semantics');
 assert.equal(await page.getByRole('listitem').count(),2,'Both rows retain list semantics');
 const button=page.getByRole('button',{name:'Open record'});
 assert.equal(await button.evaluate(el=>el.parentElement.getAttribute('role')),'listitem');
 await button.focus();await page.keyboard.press('Enter');await page.keyboard.press('Space');await button.click();
 assert.deepEqual(await page.evaluate(()=>[activations,submissions]),[3,0]);
 const widths=await page.locator('.cs-list__item').evaluateAll(rows=>rows.map(el=>el.getBoundingClientRect().width));
 assert.ok(Math.abs(widths[0]-widths[1])<1,'Interactive wrapper preserves row width');
 console.log('PASS ListItem: list and button semantics, Enter/Space/click, form isolation and row width');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
