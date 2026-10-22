import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
execFileSync(process.execPath,[fileURLToPath(new URL('./check-bundle-freshness.mjs',import.meta.url))],{stdio:'inherit'});
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {mergeTargetProps} from '../../components/_utils/field-association.js';
const order=[];
const merged=mergeTargetProps({className:'owned',style:{color:'red'},onClick:()=>order.push('internal'),role:'combobox'},{className:'caller',style:{padding:1},onClick:()=>order.push('caller'),role:'button',ref:()=>{}},['role']);
merged.onClick();assert.deepEqual(order,['internal','caller']);assert.equal(merged.className,'owned caller');assert.deepEqual(merged.style,{color:'red',padding:1});assert.equal(merged.role,'combobox');assert.equal(merged.ref,undefined);
const unsafe=mergeTargetProps({},JSON.parse('{"__proto__":{"polluted":true},"constructor":"bad","prototype":"bad","children":"bad","dangerouslySetInnerHTML":{"__html":"bad"}}'));assert.deepEqual(Object.keys(unsafe),[]);assert.equal(Object.getPrototypeOf(unsafe),Object.prototype);
for(const onClick of [null,undefined]){let called=false;mergeTargetProps({onClick:()=>{called=true}},{onClick}).onClick();assert(called,'Optional/invalid handlers must never erase internal behavior')}

for (const browserName of ['chromium','firefox','webkit']) await withBrowserFixture(async page => {
  await page.evaluate(() => {
    const e=React.createElement;
    window.events=[];
    renderFixture(e('div',null,e('span',{id:'external'},'External name'),e('span',{id:'external-help'},'External help'),
      e(CS.FormField,{label:'City',hint:'Choose city',rootProps:{'data-testid':'field-root'}},e(CS.Combobox,{options:[{value:'hcm',label:'HCM'}],rootProps:{'data-testid':'combo-root',style:{maxWidth:'300px'}},controlProps:{'data-testid':'combo',id:'city','aria-describedby':'external-help external-help',onFocus:()=>events.push('focused'),onKeyDown:()=>events.push('key')}})),
      e(CS.FormField,{label:'Date',error:0,required:true},e(CS.DatePicker,{controlProps:{'data-testid':'date'},rootProps:{'data-testid':'date-root'}})),
      e(CS.FormField,{label:'Seats',hint:0,required:true},e(CS.NumberField,{name:'seats',defaultValue:5,'data-legacy':'input',controlProps:{'data-testid':'number'},rootProps:{'data-testid':'number-root','data-legacy':'root'}})),
      e(CS.FormField,{label:'Native',hint:'Native help',required:true},e('input',{'data-testid':'native'})),
      e(CS.FormField,{label:'Custom',hint:'Custom help'},attrs=>e('input',{...attrs,'data-testid':'custom'})),
      e(CS.Combobox,{label:'Standalone',options:[],description:0,error:'Failure',required:true,controlProps:{'data-testid':'standalone','aria-invalid':false}}),
      e(CS.DatePicker,{required:true,lang:'en',description:'Local date',controlProps:{'data-testid':'standalone-date','aria-label':'Explicit date'}}),
      e(CS.NumberField,{controlProps:{'data-testid':'explicit','aria-labelledby':'external','aria-describedby':'external-help','aria-invalid':'grammar'}})));
  });
  const combo=page.getByTestId('combo');
  assert.equal(await page.getByRole('combobox',{name:'City',exact:true}).count(),1);
  await assert.equal(await combo.getAttribute('id'),'city');
  await assert.equal(await combo.getAttribute('aria-describedby'),'external-help '+await page.getByText('Choose city',{exact:true}).getAttribute('id'));
  await assert.equal(await combo.getAttribute('aria-label'),null);
  await assert.equal(await combo.evaluate(el=>el.getAttribute('aria-labelledby')&&document.getElementById(el.getAttribute('aria-labelledby')).textContent),'City');
  assert.equal(await page.getByTestId('combo-root').getAttribute('data-testid'),'combo-root');
  assert.equal(await page.getByTestId('combo-root').getAttribute('id'),null);
  await combo.focus(); await page.keyboard.press('ArrowDown');
  assert.equal(await combo.getAttribute('aria-expanded'),'true');
  assert.deepEqual(await page.evaluate(()=>events),['focused','key']);
  const date=page.getByTestId('date');
  assert.equal(await date.getAttribute('aria-invalid'),'true');
  assert.equal(await date.getAttribute('aria-required'),null,'Buttons do not support aria-required');
  assert.equal(await date.evaluate(el=>document.getElementById(el.getAttribute('aria-describedby')).textContent),'0');
  await date.click();assert.equal(await page.getByRole('dialog').count(),1);await page.keyboard.press('Escape');
  const number=page.getByTestId('number');
  assert.equal(await number.inputValue(),'5');assert.equal(await number.getAttribute('name'),'seats');assert.equal(await number.getAttribute('required'),'');
  assert.equal(await number.getAttribute('data-legacy'),'input');assert.equal(await page.getByTestId('number-root').getAttribute('data-legacy'),'root');
  assert.equal(await number.evaluate(el=>document.getElementById(el.getAttribute('aria-describedby')).textContent),'0');
  await page.locator('label').filter({hasText:'Native'}).click();assert.equal(await page.getByTestId('native').evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.getByTestId('native').getAttribute('required'),'');
  assert.equal(await page.getByTestId('custom').evaluate(el=>document.getElementById(el.getAttribute('aria-labelledby')).textContent),'Custom');
  assert.equal(await page.getByTestId('standalone').getAttribute('aria-required'),'true');
  assert.equal(await page.getByTestId('standalone').getAttribute('aria-invalid'),'true');
  assert.equal(await page.getByTestId('standalone-date').getAttribute('aria-label'),'Explicit date');
  assert.equal(await page.getByTestId('standalone-date').getAttribute('aria-required'),null);
  assert.match(await page.getByTestId('standalone-date').evaluate(el=>el.getAttribute('aria-describedby').split(' ').map(id=>document.getElementById(id).textContent).join(' ')),/required/i);
  assert.equal(await page.getByTestId('explicit').getAttribute('aria-labelledby'),'external');
  assert.equal(await page.getByTestId('explicit').getAttribute('aria-invalid'),'grammar');
  assert.equal(await page.locator('[id]').evaluateAll(elements=>new Set(elements.map(el=>el.id)).size===elements.length),true);
  await page.evaluate(()=>renderFixture(React.createElement(CS.FormField,{label:'Outer',error:'Outer error'},React.createElement(CS.Combobox,{options:[],error:'Local error',controlProps:{'data-testid':'two-errors'}}))));
  assert.equal(await page.locator('[id]').evaluateAll(elements=>new Set(elements.map(el=>el.id)).size===elements.length),true,'Local and field errors have distinct IDs');
  assert.equal((await page.getByTestId('two-errors').getAttribute('aria-describedby')).split(' ').length,2);
  for(const label of [null,undefined,'','   ',false]) {
    await page.evaluate(label=>renderFixture(React.createElement(CS.FormField,{label},React.createElement(CS.Combobox,{options:[],lang:'en',controlProps:{'data-testid':'unlabelled-field'}}))),label);
    assert.equal(await page.getByTestId('unlabelled-field').getAttribute('aria-labelledby'),null,'Empty FormField labels must not mask fallback names');
    assert.equal(await page.getByTestId('unlabelled-field').getAttribute('aria-label'),'Choose an option');
  }
  await page.evaluate(()=>renderFixture(React.createElement(CS.FormField,{label:0},React.createElement(CS.Combobox,{options:[],controlProps:{'data-testid':'zero-label'}}))));
  assert.equal(await page.getByRole('combobox',{name:'0',exact:true}).count(),1);
  await page.evaluate(()=>renderFixture(React.createElement(CS.FormField,{label:'Codes',hint:'Choose'},React.createElement('div',null,
    React.createElement(CS.Combobox,{options:[],description:'First help',error:'First error',controlProps:{'data-testid':'first-code'}}),
    React.createElement(CS.Combobox,{options:[],description:'Second help',error:'Second error',controlProps:{'data-testid':'second-code'}})))));
  assert.equal(await page.locator('[id]').evaluateAll(elements=>new Set(elements.map(el=>el.id)).size===elements.length),true,'Several controls share field associations without sharing IDs');
  const firstCode=page.getByTestId('first-code'),secondCode=page.getByTestId('second-code');
  assert.notEqual(await firstCode.getAttribute('id'),await secondCode.getAttribute('id'));
  assert.equal(await firstCode.getAttribute('aria-labelledby'),await secondCode.getAttribute('aria-labelledby'));
  for(const [control,local] of [[firstCode,'First'],[secondCode,'Second']])assert.equal(await control.evaluate(el=>el.getAttribute('aria-describedby').split(' ').map(id=>document.getElementById(id).textContent).join('|')),'Choose|'+local+' help|'+local+' error');
  // Dynamic error lifecycle clears only field-owned invalid state and stale descriptions.
  await page.evaluate(()=>{window.updateField=error=>renderFixture(React.createElement(CS.FormField,{label:'Dynamic',hint:'Hint',error},React.createElement(CS.Combobox,{options:[],controlProps:{'data-testid':'dynamic','aria-describedby':'external-help','aria-invalid':'grammar'}})));updateField('Bad')});
  assert.equal(await page.getByTestId('dynamic').getAttribute('aria-invalid'),'true');
  await page.evaluate(()=>updateField(undefined));
  assert.equal(await page.getByTestId('dynamic').getAttribute('aria-invalid'),'grammar');
  assert.match(await page.getByTestId('dynamic').getAttribute('aria-describedby'),/-hint$/);
  await page.evaluate(()=>{window.submissions=[];renderFixture(React.createElement(CS.Form,{onSubmit:values=>submissions.push(values)},React.createElement(CS.NumberField,{name:'seats',defaultValue:5,controlProps:{'data-testid':'submitted-number'}}),React.createElement('button',{type:'submit'},'Submit number')))});
  await page.getByRole('button',{name:'Submit number'}).click();
  await page.waitForFunction(()=>submissions.length===1);
  assert.deepEqual(await page.evaluate(()=>submissions),[{seats:'5'}],'Native number submission remains unchanged');
  await page.evaluate(()=>renderFixture(React.createElement(CS.FormWizard,{steps:[{title:'One'}],rootProps:{'data-testid':'wizard','data-step':99,'aria-busy':true}})));
  assert.equal(await page.getByTestId('wizard').getAttribute('data-step'),'0');assert.equal(await page.getByTestId('wizard').getAttribute('aria-busy'),null);
  await page.evaluate(()=>renderFixture(React.createElement(CS.DatePicker,{controlProps:{'data-testid':'protected-date',type:'submit',role:'checkbox','aria-required':true,onClick:()=>{window.dateClicked=true}}})));
  await page.getByTestId('protected-date').click();assert.equal(await page.getByTestId('protected-date').getAttribute('type'),'button');assert.equal(await page.getByTestId('protected-date').getAttribute('role'),null);assert.equal(await page.getByTestId('protected-date').getAttribute('aria-required'),null);assert.equal(await page.getByRole('dialog').count(),1);assert.equal(await page.evaluate(()=>window.dateClicked),true);await page.keyboard.press('Escape');
  await page.evaluate(()=>renderFixture(React.createElement(CS.NumberField,{defaultValue:7,controlProps:{'data-testid':'protected-number',type:'text',role:'checkbox',value:99,onChange:()=>{throw Error('replaced')}}})));
  assert.equal(await page.getByTestId('protected-number').getAttribute('type'),'number');assert.equal(await page.getByTestId('protected-number').getAttribute('role'),null);assert.equal(await page.getByTestId('protected-number').inputValue(),'7');await page.getByTestId('protected-number').fill('8');assert.equal(await page.getByTestId('protected-number').inputValue(),'8');
  // Runtime attempts to replace owned state/semantics are ignored even outside TS.
  await page.evaluate(()=>renderFixture(React.createElement(CS.Combobox,{disabled:true,options:[],controlProps:{'data-testid':'protected',role:'button',disabled:false,value:'injected','aria-expanded':true,onChange:()=>{throw Error('replaced')}}})));
  assert.equal(await page.getByTestId('protected').getAttribute('role'),'combobox');assert.equal(await page.getByTestId('protected').isDisabled(),true);assert.equal(await page.getByTestId('protected').getAttribute('aria-expanded'),'false');
}, {browserName});
console.log('PASS field associations: three engines, explicit DOM targets, native/custom/composite labels and descriptions, zero errors, required semantics, event composition, protected behavior and dynamic invalid state');
