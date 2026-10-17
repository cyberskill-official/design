import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
  await page.evaluate(()=>{
    const e=React.createElement; window.saves=[];window.cancelReset=false;window.resets=0;window.waitValidation=false;
    renderFixture(e(CS.Form,{lang:'en',initialValues:{name:'An',enabled:true},
      rules:{name:'required'},asyncRules:{name:()=>waitValidation?new Promise(resolve=>{window.resolveValidation=resolve}):null},
      onReset:event=>{resets++;if(cancelReset)event.preventDefault()},onSubmit:v=>window.rejectSave?Promise.reject(new Error("Save rejected")):saves.push(v)},
      e(CS.FormField,{label:'Name',name:'name'},e('input',{'aria-label':'Name'})),
      e(CS.FormField,{label:'Enabled',name:'enabled',valueProp:'checked'},e('input',{type:'checkbox','aria-label':'Enabled'})),
      e('input',{name:'plain','aria-label':'Plain',defaultValue:'Original'}),
      e('button',{type:'reset'},'Reset'),e('button',{type:'submit'},'Save')));
  });
  const name=page.getByRole('textbox',{name:'Name',exact:true});
  await name.fill('Binh');await page.getByRole('checkbox').uncheck();await page.getByRole('textbox',{name:'Plain'}).fill('Changed');
  await page.evaluate(()=>cancelReset=true);await page.getByRole('button',{name:'Reset',exact:true}).click();
  assert.equal(await name.inputValue(),'Binh','canceled reset preserves controller');
  assert.equal(await page.getByRole('textbox',{name:'Plain'}).inputValue(),'Changed','canceled reset preserves native field');
  await page.evaluate(()=>cancelReset=false);await page.getByRole('button',{name:'Reset',exact:true}).click();
  assert.equal(await name.inputValue(),'An','reset restores controller seed');
  assert.equal(await page.getByRole('checkbox').isChecked(),true);
  assert.equal(await page.getByRole('textbox',{name:'Plain'}).inputValue(),'Original','native reset remains active');
  await name.fill('');await page.getByRole('button',{name:'Save',exact:true}).click();
  assert.ok(await page.getByRole('alert').count()>0);
  await page.getByRole('button',{name:'Reset',exact:true}).click();assert.equal(await page.getByRole('alert').count(),0,'reset clears internal validation errors');
  await page.evaluate(()=>window.rejectSave=true);
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await page.getByRole('alert').filter({hasText:'Save rejected'}).waitFor();
  await page.getByRole('button',{name:'Reset',exact:true}).click();
  assert.equal(await page.getByRole('alert').count(),0,'reset clears submission failure');
  await page.evaluate(()=>window.rejectSave=false);
  await name.fill('Discarded');await page.evaluate(()=>waitValidation=true);
  await page.getByRole('button',{name:'Save',exact:true}).click();await page.waitForFunction(()=>!!window.resolveValidation);
  await page.evaluate(()=>document.querySelector('form').reset());
  await page.waitForFunction(()=>!document.querySelector('[aria-busy="true"]'));
  assert.equal(await name.inputValue(),'An');
  await page.evaluate(()=>{waitValidation=false;resolveValidation(null)});
  await page.getByRole('button',{name:'Save',exact:true}).click();await page.waitForFunction(()=>saves.length===1);
  assert.deepEqual(await page.evaluate(()=>saves),[{name:'An',enabled:true,plain:'Original'}],'abandoned validation cannot submit stale values');
  assert.equal(await page.evaluate(()=>resets),5);
  console.log('PASS Form reset: controller/native fields, cancellation, errors, pending validation invalidation and submitted seed');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
