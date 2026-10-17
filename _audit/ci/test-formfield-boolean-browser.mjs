import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
const failures=[];
await withBrowserFixture(async page=>{
  for(const kind of ['Checkbox','Switch','Toggle'])for(const initial of [true,false,undefined]){
    try {
      await page.evaluate(({kind,initial})=>{
        window.observed=[];window.submitted=[];
        renderFixture(React.createElement(CS.Form,{key:kind+String(initial),lang:'en',initialValues:initial===undefined?{}:{selected:initial},onSubmit:v=>{submitted.push(v)}},
          React.createElement(CS.FormField,{label:'Selection',name:'selected',valueProp:kind==='Toggle'?'pressed':'checked'},
            React.createElement(CS[kind],{label:kind,lang:'en',onChange:v=>observed.push(v?.target?v.target.checked:v)},kind==='Toggle'?'Bold':null))));
      },{kind,initial});
      const control=page.locator(kind==='Toggle'?'.cs-toggle':'input');
      const current=()=>kind==='Toggle'?control.getAttribute('aria-pressed'):control.isChecked().then(String);
      assert.equal(await current(),String(initial??false),kind+' initial boolean');
      await control.press('Space');
      assert.equal(await current(),String(!(initial??false)));
      await page.evaluate(()=>document.querySelector('form').requestSubmit());
      await page.waitForFunction(()=>submitted.length===1);
      assert.deepEqual(await page.evaluate(()=>observed),[!(initial??false)]);
      assert.equal(await page.evaluate(()=>submitted[0].selected),!(initial??false));
      console.log('PASS FormField '+kind+' initial '+String(initial)+': state, keyboard, observer and boolean payload');
    } catch(error){failures.push(kind+'/'+String(initial)+': '+error.message)}
  }
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
assert.deepEqual(failures,[],failures.join('\n'));
