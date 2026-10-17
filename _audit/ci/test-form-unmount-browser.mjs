import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
  await page.evaluate(()=>{
    window.saves=[];window.finishValidation=null;window.laterValidators=0;
    window.mountForm=element=>renderFixture(React.createElement(React.StrictMode,null,element));
    mountForm(React.createElement(CS.Form,{initialValues:{name:'old'},asyncRules:{name:()=>new Promise(resolve=>finishValidation=resolve),other:async()=>{laterValidators++;return null}},onSubmit:v=>{saves.push(v)}},React.createElement('button',{type:'submit'},'Save')));
    document.querySelector('form').requestSubmit();
  });
  await page.waitForFunction(()=>finishValidation!==null);
  await page.evaluate(async()=>{
    renderFixture(null);
    finishValidation(null);
    // Drain the validator, runAsyncRules and submit continuation microtasks.
    await new Promise(resolve=>setTimeout(resolve,0));
  });
  assert.deepEqual(await page.evaluate(()=>saves),[],'unmounted form must not launch a late save');
  assert.equal(await page.evaluate(()=>laterValidators),0,'unmounted form must not start another validator');
  await page.evaluate(()=>{
    mountForm(React.createElement(CS.Form,{initialValues:{name:'new'},onSubmit:v=>{saves.push(v)}},React.createElement('button',{type:'submit'},'Save')));
    document.querySelector('form').requestSubmit();
  });
  await page.waitForFunction(()=>saves.length>0);
  assert.deepEqual(await page.evaluate(()=>saves),[{name:'new'}]);
  console.log('PASS Form: unmount invalidates pending validation; a new instance can submit');
},{browserName:process.env.CS_TEST_BROWSER||'chromium',development:process.env.CS_TEST_DEVELOPMENT==='1'});
