import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {parse} from '@babel/parser';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,[fileURLToPath(new URL('./check-bundle-freshness.mjs',import.meta.url))],{stdio:'inherit'});
const sourcePath=new URL('../../components/icon/Icon.jsx',import.meta.url);
const ast=parse(readFileSync(sourcePath,'utf8'),{sourceType:'module',plugins:['jsx']});
const declaration=ast.program.body.find(n=>n.type==='ExportNamedDeclaration'&&n.declaration?.declarations?.some(d=>d.id.name==='CS_ICONS')).declaration.declarations.find(d=>d.id.name==='CS_ICONS');
function literal(n){if(['StringLiteral','NumericLiteral','BooleanLiteral','NullLiteral'].includes(n.type))return n.value??null;if(n.type==='ArrayExpression')return n.elements.map(literal);if(n.type==='ObjectExpression')return Object.fromEntries(n.properties.map(p=>{assert(p.type==='ObjectProperty'&&!p.computed);return[p.key.name??p.key.value,literal(p.value)]}));throw Error('Unsupported icon definition: '+n.type)}
export const API_DOMAIN_CASES = { FormField: { valueProp: ['value','checked','pressed'] } };
const icons=literal(declaration.init),receipts=[];
assert.deepEqual(API_DOMAIN_CASES.FormField.valueProp,['value','checked','pressed']);
function same(actual,expected,message){assert.deepEqual(actual,expected,message)}
// The comparator must catch geometry drift, not merely count visible SVG roots.
assert.throws(()=>same([{tag:'path',attrs:{d:'M0 0'}}],[{tag:'path',attrs:{d:'M1 1'}}]));
for(const browserName of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 await page.evaluate(names=>renderFixture(React.createElement('div',null,...names.map(name=>React.createElement(CS.Icon,{key:name,name,label:name,'data-testid':name})),React.createElement(CS.Icon,{name:'unknown-name','data-testid':'unknown'}),React.createElement(CS.Icon,{'data-testid':'missing'}))),Object.keys(icons));
 for(const [name,def] of Object.entries(icons)){
  const svg=page.getByTestId(name);assert.equal(await page.getByRole('img',{name,exact:true}).count(),1);assert.equal(await svg.getAttribute('viewBox'),def.viewBox);
  const primitives=await svg.evaluate(el=>[...el.children].map(child=>({tag:child.localName,attrs:Object.fromEntries([...child.attributes].map(a=>[a.name,a.value]))})));
  const expected=def.els.map(([tag,attrs])=>({tag,attrs:Object.fromEntries(Object.entries(attrs).map(([k,v])=>[k.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()),String(v)]))}));same(primitives,expected,name+' exact geometry');
 }
 for(const id of ['unknown','missing']){assert.equal(await page.getByTestId(id).getAttribute('aria-hidden'),'true');assert.equal(await page.getByTestId(id).getAttribute('focusable'),'false');same(await page.getByTestId(id).innerHTML(),await page.getByTestId('sparkle').innerHTML(),'Unknown/missing name retains sparkle fallback')}
 const axisCases=[];
 for(const component of ['Tabs','SegmentedControl'])for(const orientation of ['horizontal','vertical']){
  await page.evaluate(({component,orientation})=>{window.changes=[];const e=React.createElement;function Controlled(){const[value,set]=React.useState('a');const items=['a','b','c'].map(value=>({value,label:value}));return e(CS[component],{value,onChange:next=>{changes.push(next);set(next)},[component==='Tabs'?'tabs':'options']:items,'aria-label':'API domains','aria-orientation':orientation,style:{flexDirection:orientation==='vertical'?'column':'row'}})}renderFixture(e(Controlled))},{component,orientation});
  const role=component==='Tabs'?'tab':'radio',selection=component==='Tabs'?'aria-selected':'aria-checked',tabs=page.getByRole(role),next=orientation==='vertical'?'ArrowDown':'ArrowRight',prev=orientation==='vertical'?'ArrowUp':'ArrowLeft',wrong=orientation==='vertical'?'ArrowRight':'ArrowDown';
  const verify=async index=>{same(await tabs.evaluateAll((ns,selection)=>ns.map(n=>[n.tabIndex,n.getAttribute(selection),n===document.activeElement]),selection),[0,1,2].map(i=>[i===index?0:-1,String(i===index),i===index]),component+' '+orientation+' selected/focus/roving')};
  await tabs.first().focus();await verify(0);
  for(const[key,index]of [[next,1],[next,2],[next,0],[prev,2],['Home',0],['End',2]]){await page.keyboard.press(key);await verify(index)}
  same(await page.evaluate(()=>changes),['b','c','a','c','a','c']);
  const before=await page.evaluate(()=>changes.slice());await page.keyboard.press(wrong);await verify(2);same(await page.evaluate(()=>changes),before,'Cross-axis key must not select');
  const prevented=await tabs.nth(2).evaluate((el,key)=>!el.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true})),wrong);assert.equal(prevented,false,'Cross-axis keys retain browser behavior');
  axisCases.push({component,orientation,selectionChanges:before});
 }
 await page.evaluate(()=>{window.callbacks=[];window.submissions=[];const e=React.createElement;renderFixture(e(CS.Form,{initialValues:{city:'Hue',accept:true,toggle:false},onSubmit:values=>submissions.push(values)},
  e(CS.FormField,{name:'city',label:'City',hint:'Choose city',valueProp:'value'},e('input',{'data-testid':'value',onChange:event=>callbacks.push(['value',event.target.value])})),
  e(CS.FormField,{name:'accept',label:'Accept',hint:'Accept terms',valueProp:'checked'},e('input',{type:'checkbox','data-testid':'checked',onChange:event=>callbacks.push(['checked',event.target.checked])})),
  e(CS.FormField,{name:'toggle',label:'Notify',hint:'Notify me',valueProp:'pressed'},e(CS.Toggle,{'data-testid':'pressed',onChange:value=>callbacks.push(['pressed',value])},'Notify')),e('button',{type:'submit'},'Submit API')))});
 assert.equal(await page.getByRole('textbox',{name:'City',exact:true}).inputValue(),'Hue');assert.equal(await page.getByRole('checkbox',{name:'Accept',exact:true}).isChecked(),true);
 for(const [id,hint]of [['value','Choose city'],['checked','Accept terms']])assert.equal(await page.getByTestId(id).evaluate(el=>el.getAttribute('aria-describedby').split(' ').map(id=>document.getElementById(id)?.textContent).join(' ')),hint);
 assert.equal(await page.getByTestId('pressed').getAttribute('aria-pressed'),'false');await page.getByTestId('value').fill('Danang');await page.getByTestId('checked').uncheck();await page.getByTestId('pressed').click();assert.equal(await page.getByTestId('pressed').getAttribute('aria-pressed'),'true');
 same(await page.evaluate(()=>callbacks),[['value','Danang'],['checked',false],['pressed',true]],'Child callbacks compose with controller wiring');await page.getByRole('button',{name:'Submit API',exact:true}).click();await page.waitForFunction(()=>submissions.length===1);same(await page.evaluate(()=>submissions),[{city:'Danang',accept:false,toggle:true}]);
 receipts.push({browserName,icons:Object.keys(icons),axisCases,formFieldValueProps:['value','checked','pressed'],status:'passed'});
 console.log(browserName+': all icon primitives, orientation keyboard/selection, and FormField valueProp PASS');
},{browserName});
const inputs=['components/icon/Icon.jsx','components/navigation/Tabs.jsx','components/forms/SegmentedControl.jsx','components/forms/Form.jsx','components/forms/Toggle.jsx','stories/Icon.stories.jsx','stories/Tabs.stories.jsx','stories/SegmentedControl.stories.jsx','_ds_bundle.js','_audit/ci/test-api-domains-browser.mjs'];
const hashes=Object.fromEntries(inputs.map(path=>[path,createHash('sha256').update(readFileSync(new URL('../../'+path,import.meta.url))).digest('hex')]));
mkdirSync(new URL('../../test-results/',import.meta.url),{recursive:true});writeFileSync(new URL('../../test-results/api-domains-browser.json',import.meta.url),JSON.stringify({schemaVersion:1,inputs:hashes,receipts,scope:'Exact named icon SVG definitions, controlled horizontal/vertical roving-selection keys, and FormField controller valueProp/associations/callback composition. No full accessibility certification.'},null,2)+'\n');
