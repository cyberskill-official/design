import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 for(const lang of ['en','vi']){
  await page.evaluate(lang=>{
   window.drawDate=value=>renderFixture(React.createElement(CS.DatePicker,{value,lang,placeholder:'Choose date'}));
   drawDate(new Date(0));
  },lang);
  const expected=await page.locator('.cs-datepicker__field > span').textContent();
  await page.evaluate(()=>drawDate(0));
  assert.equal(await page.locator('.cs-datepicker__field > span').textContent(),expected,'Timestamp zero must match Date(0) formatting in '+lang);
  assert.equal(await page.locator('.cs-datepicker__field > .ph').count(),0);
  await page.evaluate(()=>drawDate(undefined));
  assert.equal(await page.locator('.cs-datepicker__field > .ph').textContent(),'Choose date');
  await page.evaluate(()=>drawDate(''));
  assert.equal(await page.locator('.cs-datepicker__field > .ph').textContent(),'Choose date');
  await page.evaluate(()=>drawDate(0));
  assert.equal(await page.locator('.cs-datepicker__field > span').textContent(),expected);
 }
 console.log('PASS DatePicker: epoch zero matches Date object in EN/VI; empty and restored value transitions');
 for (const lang of ['en', 'vi']) {
  const fallback = lang === 'en' ? 'Select a date' : 'Chọn ngày';
  for (const [props, name] of [
   [{}, fallback],
   [{label:'Delivery date'}, 'Delivery date'],
   [{placeholder:'Choose delivery day'}, 'Choose delivery day'],
   [{label:'Delivery date',placeholder:'Choose delivery day'}, 'Delivery date'],
   [{label:'',placeholder:''}, fallback],
   [{label:'  ',placeholder:' \t '}, fallback],
   [{label:' ',placeholder:' Choose delivery day '}, 'Choose delivery day'],
  ]) {
   await page.evaluate(({lang,props})=>{
    renderFixture(null);
    window.drawNamedDate=next=>renderFixture(React.createElement(CS.DatePicker,{lang,...props,...next}));
    drawNamedDate({});
   }, {lang,props});
   await page.locator('.cs-datepicker__field').click();
   assert.equal(await page.getByRole('dialog',{name,exact:true}).count(),1,'Open DatePicker must have an accessible name: '+JSON.stringify({lang,props,name}));
   await page.evaluate(()=>drawNamedDate({label:'Updated date'}));
   assert.equal(await page.getByRole('dialog',{name:'Updated date',exact:true}).count(),1,'Name follows live label changes');
   await page.keyboard.press('Escape');
   assert.equal(await page.getByRole('dialog').count(),0);
  }
 }
 await page.evaluate(()=>{
  renderFixture(null);
  window.drawLocaleDate=lang=>renderFixture(React.createElement(CS.DatePicker,{lang}));
  drawLocaleDate('en');
 });
 await page.locator('.cs-datepicker__field').click();
 await page.evaluate(()=>drawLocaleDate('vi'));
 assert.equal(await page.getByRole('dialog',{name:'Chọn ngày',exact:true}).count(),1,'Open dialog follows live language changes');
 console.log('PASS DatePicker dialog names: 14 label/placeholder/default/blank cases, live labels, live EN/VI and Escape');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
