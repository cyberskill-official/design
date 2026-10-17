import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 const failures=[];
 const expect=async(selector,text,label)=>{
  const values=await page.locator(selector).allTextContents();
  if(JSON.stringify(values)!==JSON.stringify(text)) failures.push({label,actual:values,expected:text});
 };
 await page.evaluate(()=>renderFixture(React.createElement(CS.FormField,{label:'Field',error:0,hint:'Hint'},React.createElement('input'))));
 await expect('.cs-formfield__error',['0'],'zero error');
 await expect('.cs-formfield__hint',[],'error suppresses hint');
 if(await page.locator('.has-error').count()!==1) failures.push('zero error lacks error class');
 await page.evaluate(()=>renderFixture(React.createElement(CS.FormField,{label:'Field',hint:0},React.createElement('input'))));
 await expect('.cs-formfield__hint',['0'],'zero hint');
 for(const content of [0,null,false,'']){
  await page.evaluate(content=>renderFixture(React.createElement(CS.Switch,{label:content,lang:'en'})),content);
  await expect('.cs-switch__label',content===0?['0']:[],'switch label');
  if(content===0 && await page.getByRole('switch',{name:'0',exact:true}).count()!==1) failures.push('switch name must use zero label');
  if(content!==0 && !(await page.getByRole('switch').getAttribute('aria-label'))) failures.push('empty switch needs fallback');
  await page.evaluate(content=>renderFixture(React.createElement(CS.PromptInput,{hint:content})),content);
  await expect('.cs-prompt__hint',content===0?['0']:[],'prompt hint');
  await page.evaluate(content=>renderFixture(React.createElement(CS.SegmentedControl,{options:[{value:'a',label:'A',icon:content}],value:'a'})),content);
  await expect('[role=tab] > span',content===0?['0']:[],'nested icon');
  await page.evaluate(content=>renderFixture(React.createElement(CS.Form,{initialValues:{items:[]}},React.createElement(CS.FormFieldArray,{name:'items',label:content},()=>null))),content);
  await expect('.cs-form-array > .cs-formfield__label',content===0?['0']:[],'array label');
 }
 await page.evaluate(()=>renderFixture(React.createElement(CS.Form,{errors:{field:'Context error'}},React.createElement(CS.FormField,{name:'field',label:'Field',error:0,hint:'Hint'},React.createElement('input')))));
 await expect('.cs-formfield__error',['0'],'explicit zero overrides context error');
 for(const empty of [null,false,'']){
  await page.evaluate(empty=>renderFixture(React.createElement(CS.FormField,{label:'Field',error:empty,hint:0},React.createElement('input'))),empty);
  await expect('.cs-formfield__error',[],'empty error');
  await expect('.cs-formfield__hint',['0'],'empty error permits zero hint');
 }
 await page.evaluate(()=>renderFixture(React.createElement(CS.PromptInput,{lang:'en'})));
 assert.ok((await page.locator('.cs-prompt__hint').textContent()).trim(),'undefined hint retains locale default');
 await page.evaluate(()=>renderFixture(React.createElement(CS.Switch,{label:0,'aria-label':'Explicit'})));
 assert.equal(await page.getByRole('switch',{name:'Explicit'}).count(),1);
 assert.deepEqual(failures,[],'Derived/nested ReactNode content must preserve zero and naming/error precedence');
 console.log('PASS derived content: FormField error/hint precedence, array label, Switch naming, PromptInput fallback and nested segmented icon');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
