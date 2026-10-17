import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
const failures=[];
await withBrowserFixture(async page=>{
  for(const kind of ['Form','FormWizard']){
    try {
      await page.evaluate(kind=>{
        window.calls=[];window.settle=null;
        const callback=values=>{calls.push(values);return new Promise((resolve,reject)=>{settle={resolve,reject}})};
        renderFixture(kind==='Form'
          ?React.createElement(CS.Form,{lang:'en',initialValues:{name:'snapshot'},onSubmit:callback},React.createElement('input',{'aria-label':'Query',defaultValue:'original'}),React.createElement('button',{type:'submit'},'Save'))
          :React.createElement(CS.FormWizard,{lang:'en',initialValues:{name:'snapshot'},steps:[{title:'Review',render:()=>React.createElement('input',{'aria-label':'Query',defaultValue:'original'})}],onComplete:callback}));
        window.fireSubmit=()=>kind==='Form'?document.querySelector('form').requestSubmit():document.querySelector('.cs-form-wizard__nav button:last-child').click();
        document.querySelector('input').focus();
        fireSubmit();
      },kind);
      await page.waitForFunction(()=>calls.length>0);
      const root=page.locator(kind==='Form'?'.cs-form':'.cs-form-wizard');
      assert.equal(await root.getAttribute('aria-busy'),'true',kind+' stays busy while callback promise is pending');
      assert.equal(await page.getByRole('textbox',{name:'Query'}).isDisabled(),true,'native fields are disabled during save');
      await page.keyboard.type('should not be entered');
      assert.equal(await page.getByRole('textbox',{name:'Query'}).inputValue(),'original');
      await page.evaluate(()=>{fireSubmit();fireSubmit()});
      assert.equal(await page.evaluate(()=>calls.length),1,'pending callback blocks duplicate submissions');
      await page.evaluate(()=>settle.resolve());
      await page.waitForFunction(()=>!document.querySelector('[aria-busy="true"]'));
      assert.equal(await page.getByRole('textbox',{name:'Query'}).isDisabled(),false);
      await page.evaluate(()=>fireSubmit());await page.waitForFunction(()=>calls.length===2);
      await page.evaluate(()=>settle.reject(new Error('Save failed; retry')));
      await page.waitForFunction(()=>!document.querySelector('[aria-busy="true"]'));
      assert.equal(await page.getByRole('alert').innerText().then(s=>s.includes('Save failed; retry')),true);
      await page.evaluate(()=>fireSubmit());await page.waitForFunction(()=>calls.length===3);
      await page.evaluate(()=>settle.resolve());
      await page.waitForFunction(()=>!document.querySelector('[aria-busy="true"]'));
      assert.equal(await page.getByRole('alert').count(),0);
      assert.deepEqual(await page.evaluate(()=>calls),Array(3).fill({name:'snapshot'}));
      console.log('PASS '+kind+': async completion lock, rejection summary, retry and submitted snapshot');
    } catch(error){failures.push(kind+': '+error.message)}
  }
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
assert.deepEqual(failures,[],failures.join('\n'));
