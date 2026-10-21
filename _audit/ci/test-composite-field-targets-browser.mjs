import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const cases = [
  ['Cascader', {nodes:[{key:'vn',label:'Vietnam'}]}, '.cs-cascader', '.cs-treeselect__field'],
  ['TreeSelect', {nodes:[{key:'vn',label:'Vietnam'}]}, '.cs-treeselect', '.cs-treeselect__field'],
  ['TagInput', {}, '.cs-field', '.cs-taginput input'],
  ['ColorPicker', {}, '.cs-colorpicker', '.cs-colorpicker__field'],
  ['Rating', {}, '.cs-rating', '.cs-rating'],
  ['InputOTP', {length:4}, '.cs-otp', '.cs-otp'],
];
await withBrowserFixture(async page => {
 for (const [kind, props, root, target] of cases) {
  await page.evaluate(({kind,props}) => {
   window.events=[];
   window.drawComposite=(feedback=true)=>renderFixture(React.createElement(React.Fragment,null,
    React.createElement('span',{id:'external-label'},'External field'),
    React.createElement('span',{id:'external-help'},'External help'),
    React.createElement(CS[kind], {key:kind,...props,lang:'en',required:true,
      description:feedback?'Local help':undefined,error:feedback?'Wrong':undefined,
      rootProps:{'data-root':'yes',className:'custom-root'},
      controlProps:{id:'logical-control','data-control':'yes',className:'custom-control',
        'aria-labelledby':'external-label','aria-describedby':'external-help','aria-invalid':false,
        role:'invalid-role',type:'submit',name:'should-not-serialize',value:'replace',required:true,
        'aria-required':false,'aria-expanded':'invalid',onClick:()=>events.push('click'),onKeyDown:()=>events.push('key')},
      onChange:value=>events.push(value)})));
   drawComposite();
  },{kind,props});
  const control=page.locator(target).first();
  assert.equal(await page.locator(root).first().getAttribute('data-root'),'yes',kind+' root target');
  assert.equal(await control.getAttribute('data-control'),'yes',kind+' control target');
  assert.equal(await control.getAttribute('id'),'logical-control');
  assert.equal(await control.getAttribute('aria-labelledby'),'external-label');
  assert.equal(await control.getAttribute('aria-invalid'),'true');
  assert.equal(await control.getAttribute('name'),null,kind+' no native serialization');
  const ids=(await control.getAttribute('aria-describedby')).split(/\s+/);
  assert.ok(ids.includes('external-help')&&ids.includes('logical-control-description')&&ids.includes('logical-control-error'));
  assert.ok(await page.evaluate(ids=>ids.every(id=>!!document.getElementById(id)),ids));
  assert.notEqual(await control.getAttribute('role'),'invalid-role');
  if (['Cascader','TreeSelect','ColorPicker'].includes(kind)) {
   assert.equal(await control.getAttribute('type'),'button');
   assert.equal(await control.getAttribute('aria-required'),null);
   await control.click();
   assert.equal(await control.getAttribute('aria-expanded'),'true');
   assert.deepEqual(await page.evaluate(()=>events),['click']);
  }
  if (kind==='TagInput') {
   assert.equal(await control.getAttribute('required'),null);
   assert.equal(await control.getAttribute('aria-required'),'true');
   await control.fill('One');await control.press('Enter');
   assert.deepEqual(await page.evaluate(()=>events),[['One'],'key']);
  }
  if (kind==='Rating') {
   assert.equal(await control.getAttribute('aria-required'),'true');
   await page.locator('.cs-rating button').first().focus();
   await page.locator('.cs-rating button').first().press('ArrowRight');
   assert.deepEqual(await page.evaluate(()=>events),[2,'key']);
   assert.equal(await page.locator('.cs-rating [aria-checked="true"]').count(),1);
  }
  if (kind==='InputOTP') {
   assert.equal(await control.getAttribute('aria-required'),null);
   assert.equal(await page.locator('.cs-otp input[required], .cs-otp input[name]').count(),0);
   const digitIds=await page.locator('.cs-otp input').evaluateAll(inputs=>inputs.map(x=>x.id));
   assert.equal(new Set(digitIds).size,4);
   assert.equal(await page.locator('.cs-otp input').first().getAttribute('aria-labelledby'),'external-label logical-control-digit-1');
   assert.equal(await page.locator('.cs-otp input').first().getAttribute('aria-invalid'),'true');
   await page.locator('.cs-otp input').first().fill('1');
   assert.deepEqual(await page.evaluate(()=>events),['1']);
   assert.equal(await page.locator('.cs-otp input').nth(1).evaluate(x=>x===document.activeElement),true);
   assert.equal(await page.locator('#logical-control-required').count(),1);
  }
  await page.evaluate(()=>drawComposite(false));
  assert.equal(await control.getAttribute('aria-invalid'),'false');
  assert.equal(await page.locator('#logical-control-error').count(),0);
  console.log('PASS '+kind+': explicit target bags, feedback composition, owned semantics and events');
 }
 for(const [kind,props,,target]of cases){
  await page.evaluate(({kind,props})=>renderFixture(React.createElement(CS.FormField,{label:'Account field',hint:'Context help',error:'Context error',required:true},React.createElement(CS[kind],{key:kind,...props,lang:'en'}))),{kind,props});
  const control=page.locator(target).first();
  assert.ok(await control.getAttribute('id'),kind+' inherits FormField target ID');
  const names=(await control.getAttribute('aria-labelledby')).split(/\s+/);
  assert.equal(await page.locator('[id="'+names[0]+'"]').textContent(),'Account field *');
  assert.equal(await control.getAttribute('aria-invalid'),'true');
  const refs=(await control.getAttribute('aria-describedby')).split(/\s+/);
  assert.ok(await page.evaluate(ids=>ids.every(id=>!!document.getElementById(id)),refs));
  console.log('PASS '+kind+': FormField label/error/requirement associations');
  await page.evaluate(({kind,props})=>renderFixture(React.createElement(CS.FormField,{label:'Context label'},React.createElement(CS[kind],{key:kind,...props,label:'Explicit label',lang:'en'}))),{kind,props});
  if(kind==='TagInput'){
   const local=await control.getAttribute('aria-labelledby');
   assert.equal(await page.locator('[id=\"'+local+'\"]').textContent(),'Explicit label');
  }else{
   assert.ok((await control.getAttribute('aria-label'))?.startsWith('Explicit label'),kind+' explicit label beats context fallback');
   assert.equal(await control.getAttribute('aria-labelledby'),null);
  }

 }
 await page.evaluate(()=>renderFixture(React.createElement(CS.InputOTP,{length:2,lang:'en',controlProps:{'aria-label':'Login verification'}})));
 assert.equal(await page.locator('.cs-otp input').first().getAttribute('aria-label'),'Login verification 1/2');
 console.log('PASS OTP: explicit group name also names each positioned digit');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
