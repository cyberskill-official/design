import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const engine=process.env.CS_TEST_BROWSER||'chromium',baseline=process.argv.includes('--baseline'),results=[];
const cases=[['TextField','textbox','INPUT'],['Textarea','textbox','TEXTAREA'],['Select','combobox','SELECT'],['NativeSelect','combobox','SELECT'],['Checkbox','checkbox','INPUT'],['Radio','radio','INPUT'],['InputGroup','textbox','DIV']];
await withBrowserFixture(async page=>{
 const render=async(name,extra={})=>{await page.evaluate(({name,extra})=>{
  const options={options:[{value:'a',label:'Alpha'},{value:'b',label:'Beta'}],defaultValue:'a'};
  const props={id:'field-control',label:'Account',description:'Helpful hint',error:'Validation problem',name:'account',defaultValue:'seed',...(['Select','NativeSelect'].includes(name)?options:{}),...(['Checkbox','Radio'].includes(name)?{defaultValue:undefined,value:'yes',defaultChecked:true}:{}),...extra};
  if(name==='NativeSelect'||name==='InputGroup')delete props.description;if(['InputGroup','Checkbox','Radio'].includes(name))delete props.error
  window.labelRefEvents=window.labelRefEvents||[];window.labelRefCallback=window.labelRefCallback||((node)=>{window.labelRefCurrent=node;labelRefEvents.push(node?.tagName||null)});
  window.renderFixture(React.createElement('form',{id:'label-test-form'},React.createElement('span',{id:'external-name'},'External name'),React.createElement('span',{id:'external-description'},'External help'),React.createElement(CS[name],{...props,ref:labelRefCallback})));
 },{name,extra})};
 for(const[name,role,tag]of cases){
  await render(name);const control=page.locator('#field-control');const ax=await control.ariaSnapshot();results.push({name,baselineAX:ax});
  if(baseline)continue;
  assert.equal(await page.getByRole(role,{name:'Account',exact:true}).count(),1,name+': hint/error must not enter accessible name');
  const info=await control.evaluate(el=>({labelledby:el.getAttribute('aria-labelledby'),describedby:el.getAttribute('aria-describedby'),description:[...(el.getAttribute('aria-describedby')||'').split(/\s+/)].filter(Boolean).map(id=>document.getElementById(id)?.textContent).join(' '),refTag:labelRefCurrent.tagName,ids:[...document.querySelectorAll('[id]')].map(n=>n.id)}));assert.equal(info.refTag,tag);assert.equal(info.ids.length,new Set(info.ids).size);assert(info.labelledby,name+' owns an exact label span association');
  if(!['NativeSelect','InputGroup'].includes(name))assert(info.description.includes('Helpful hint'),name+': hint remains description');
  if(['TextField','Textarea','Select','NativeSelect'].includes(name))assert(info.description.includes('Validation problem'),name+': error remains description');
  if(name!=='InputGroup'){await control.evaluate(el=>el.removeAttribute('aria-labelledby'));assert.equal(await page.getByRole(role,{name:'Account',exact:true}).count(),0,name+': removing label association must reproduce contamination');await control.evaluate((el,id)=>el.setAttribute('aria-labelledby',id),info.labelledby)}
  const labelId=info.labelledby;const refEvents=await page.evaluate(()=>labelRefEvents.length);await render(name,{label:'Changed account'});assert.equal(await page.getByRole(role,{name:'Changed account',exact:true}).count(),1);assert.equal(await control.getAttribute('aria-labelledby'),labelId,'Label ID stable across ordinary rerender');assert.equal(await page.evaluate(()=>labelRefEvents.length),refEvents,'Stable ref must not detach on rerender');
  for(const extra of [{'aria-label':'Caller name'},{'aria-labelledby':'external-name'},{'aria-label':'Caller name','aria-labelledby':'external-name'},{'aria-label':null},{'aria-label':undefined},{'aria-labelledby':null},{'aria-labelledby':undefined}]){
   await render(name,extra);const expected=extra['aria-labelledby']?'External name':extra['aria-label']?'Caller name':'Account';assert.equal(await page.getByRole(role,{name:expected,exact:true}).count(),1,name+' caller/nullish precedence');
  }
  for(const key of ['aria-label','aria-labelledby'])for(const value of['','   ']){await render(name,{[key]:value});assert.equal(await control.getAttribute(key),value,name+' preserves explicit empty/invalid naming attrs');}
  await render(name,{label:0,description:0,error:0});assert.equal(await page.getByRole(role,{name:'0',exact:true}).count(),1,name+' numeric zero label');
  await render(name,{required:true,disabled:true});assert(await control.isDisabled());assert.equal(await control.getAttribute('required'),'');assert.equal(await page.getByRole(role,{name:'Account',exact:true}).count(),1);
  if(['TextField','Textarea','InputGroup'].includes(name)){await render(name,{readOnly:true,required:true});assert.equal(await control.getAttribute('readonly'),'');assert.equal(await control.inputValue(),'seed');}
  const duplicateOwn=info.describedby?.split(/\s+/).find(Boolean)||'external-description';await render(name,{'aria-describedby':'external-description external-description '+duplicateOwn});const tokens=(await control.getAttribute('aria-describedby')).trim().split(/\s+/);assert.equal(tokens.length,new Set(tokens).size,name+' describedby duplicates removed');assert(tokens.includes('external-description'));
  await render(name);assert.deepEqual(await page.locator('#label-test-form').evaluate(form=>[...new FormData(form).entries()]),[['account',['Select','NativeSelect'].includes(name)?'a':['Checkbox','Radio'].includes(name)?'yes':'seed']]);
  if(['Checkbox','Radio'].includes(name)){await control.focus();await page.keyboard.press('Space');assert.equal(await control.isChecked(),name==='Radio');}
  else if(['TextField','Textarea','InputGroup'].includes(name)){await control.fill('Edited');assert.equal(await control.inputValue(),'Edited');}else if(['Select','NativeSelect'].includes(name)){await control.selectOption('b');assert.equal(await control.inputValue(),'b');}
  await page.evaluate(()=>renderFixture(null));assert.equal(await page.evaluate(()=>labelRefCurrent),null,'Native/root ref clears on unmount');
  await page.evaluate(name=>renderFixture(React.createElement('div',null,...['First account','Second account'].map(label=>React.createElement(CS[name],{key:label,label,...(!['NativeSelect','InputGroup'].includes(name)?{description:'Hint'}:{}),...(!['Checkbox','Radio','InputGroup'].includes(name)?{error:'Problem'}:{}),...(['Select','NativeSelect'].includes(name)?{options:[{value:'a',label:'Alpha'}]}:{})})))),name);
  for(const label of ['First account','Second account'])assert.equal(await page.getByRole(role,{name:label,exact:true}).count(),1,name+' repeated instances retain distinct exact names');
  const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(node=>node.id));assert.equal(ids.length,new Set(ids).size,name+' generated label/message IDs remain unique');
 }
 // Neighboring label patterns are witnesses, not speculative edits.
 for(const name of ['SearchField','Switch','FileUpload','NumberField']){await page.evaluate(name=>{const props=name==='SearchField'?{placeholder:'Search account'}:name==='Switch'?{label:'Switch account'}:name==='NumberField'?{label:'Number account',description:'Number help',error:'Number problem'}:{title:'Upload account',hint:'Upload help'};renderFixture(React.createElement(CS[name],props))},name);const witnessAX=await page.locator('#fixture').ariaSnapshot();if(!baseline){if(name==='FileUpload'){assert.equal(await page.getByLabel('Upload account',{exact:true}).count(),1);assert.equal(await page.locator('input[type=file]').evaluate(el=>document.getElementById(el.getAttribute('aria-describedby')).textContent),'Upload help')}else assert.equal(await page.getByRole(name==='SearchField'?'searchbox':name==='Switch'?'switch':'spinbutton',{name:name==='SearchField'?'Search account':name==='Switch'?'Switch account':'Number account',exact:true}).count(),1)}results.push({name,witnessAX})}

},{browserName:engine});
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);if(output)writeFileSync(output,JSON.stringify({engine,baseline,sourceBundleSha256:createHash('sha256').update(readFileSync(new URL('../../_ds_bundle.js',import.meta.url))).digest('hex'),results},null,2)+'\n');console.log(JSON.stringify({pass:true,engine,baseline,cases:cases.length}));
