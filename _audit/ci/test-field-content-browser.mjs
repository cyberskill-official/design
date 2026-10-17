import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 for(const name of ['TextField','Textarea','Select','NativeSelect']) {
  const description=name!=='NativeSelect';
  await page.evaluate(({name,description})=>renderFixture(React.createElement('div',null,
   React.createElement('span',{id:'external'},'External help'),
   React.createElement(CS[name],{label:0,error:0,...(description?{description:0}:{}),'aria-describedby':'external','aria-invalid':false,options:name.includes('Select')?[{value:'a',label:'A'}]:undefined})
  )),{name,description});
  assert.equal(await page.locator('.cs-field__label').textContent(),'0',name+' zero label');
  assert.equal(await page.getByRole('alert').count(),1,name+' zero error must render');
  assert.equal(await page.getByRole('alert').textContent(),'0');
  const control=page.locator('.cs-field__control');
  assert.equal(await control.getAttribute('aria-invalid'),'true');
  assert.equal(await page.locator('.cs-field.is-invalid').count(),1);
  const refs=await control.evaluate(el=>el.getAttribute('aria-describedby').split(/\s+/).map(id=>document.getElementById(id)?.textContent));
  assert.deepEqual(refs,description?['External help','0','0']:['External help','0']);
  for(const empty of [null,false,'']) {
   await page.evaluate(({name,empty})=>renderFixture(React.createElement(CS[name],{label:empty,error:empty,description:empty,'aria-invalid':'grammar','aria-describedby':'caller'})),{name,empty});
   assert.equal(await page.getByRole('alert').count(),0);
   assert.equal(await page.locator('.cs-field__description').count(),0);
   assert.equal(await page.locator('.is-invalid').count(),0);
   assert.equal(await page.locator('.cs-field__control').getAttribute('aria-invalid'),'grammar');
   assert.equal(await page.locator('.cs-field__control').getAttribute('aria-describedby'),'caller');
  }
 }
 for(const name of ['Checkbox','Radio']) {
  await page.evaluate(name=>renderFixture(React.createElement(CS[name],{label:'Choice',description:0})),name);
  assert.equal(await page.locator(name==='Checkbox'?'.cs-check__desc':'.cs-radio__desc').textContent(),'0');
 }
 await page.evaluate(()=>renderFixture(React.createElement(CS.RadioGroup,{legend:0,options:[{value:'a',label:'A',description:0}]})));
 assert.equal(await page.getByRole('group',{name:'0'}).count(),1);
 assert.equal(await page.locator('.cs-radio__desc').textContent(),'0');
 console.log('PASS field ReactNode content: seven exports preserve zero; four fields retain error styling, invalid state and description references; empty messages preserve caller ARIA');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
