import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 page.setDefaultTimeout(3000);
 for(const [name,prefix] of [['Alert','alert'],['Toast','toast'],['Result','result'],['EmptyState','empty']]){
  await page.evaluate(name=>renderFixture(React.createElement(CS[name],{title:0,actions:0},0)),name);
  assert.equal(await page.locator(`.cs-${prefix}__title`).textContent(),'0',`${name} title`);
  assert.equal(await page.locator(`.cs-${prefix}__body`).textContent(),'0',`${name} body`);
  if(['Result','EmptyState'].includes(name))assert.equal(await page.locator(`.cs-${prefix}__actions`).textContent(),'0',`${name} actions`);
  for(const empty of [null,false,'']){
   await page.evaluate(([name,empty])=>renderFixture(React.createElement(CS[name],{title:empty,actions:empty},empty)),[name,empty]);
   assert.equal(await page.locator(`.cs-${prefix}__body`).count(),0,`${name} empty body stays absent`);
   if(['Alert','Toast'].includes(name))assert.equal(await page.locator(`.cs-${prefix}__title`).count(),0,`${name} empty title stays absent`);
  }
 }
 await page.evaluate(()=>{
  window.dismissed=0;window.dismissTag=null;
  renderFixture(React.createElement(CS.ToastStack,{lang:'vi'},React.createElement(CS.Alert,{onDismiss:event=>{dismissed++;dismissTag=event.currentTarget.tagName}},'Notice')));
 });
 assert.equal(await page.getByRole('region',{name:'Thông báo'}).count(),1);
 await page.locator('.cs-alert__dismiss').click();
 assert.deepEqual(await page.evaluate(()=>[dismissed,dismissTag]),[1,'BUTTON']);
 assert.equal(await page.locator('.cs-alert').count(),1,'Dismiss callback leaves removal to parent');
 console.log('PASS feedback ReactNode content: zero titles/bodies/actions and existing empty-content behavior');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
