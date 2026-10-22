import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import postcss from 'postcss';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const root=new URL('../../',import.meta.url),read=path=>readFileSync(new URL(path,root),'utf8');
const hash=value=>createHash('sha256').update(value).digest('hex');
const contract=JSON.parse(read('_audit/ci/fixtures/g31-spacing-roles.json'));
const baseline=read(contract.baseline),current=read(contract.source),flattened=read('dist/styles.min.css');
assert.equal(hash(baseline),contract.baselineSha256,'Frozen before-edit CSS must retain its source identity');
const ast=postcss.parse(current);
for(const role of contract.roles){const found=[];ast.walkRules(rule=>{if(rule.selector===role.selector)rule.walkDecls(role.property,decl=>found.push(decl.value))});assert.deepEqual(found,[role.after],role.role+': expected existing spacing-token references');}
const output=fileURLToPath(new URL('test-results/spacing-roles/',root));mkdirSync(output,{recursive:true});
const results=[];
for(const browserName of ['chromium','firefox','webkit'])for(const coarse of [false,true])await withBrowserFixture(async page=>{
 let mode='baseline';
 await page.route('**/base/controls.css',route=>mode==='baseline'?route.fulfill({status:200,contentType:'text/css',body:baseline}):route.continue());
 await page.route('**/styles.css',route=>mode==='flattened'?route.fulfill({status:200,contentType:'text/css',body:flattened}):route.continue());
 const origin=new URL(page.url()).origin;
 async function render(next){
  mode=next;await page.goto(origin+'/');
  await page.evaluate(()=>{
   const name=Object.keys(window).find(key=>/^CyberSkillDesignSystem_[a-f0-9]{6}$/.test(key));window.CS=window[name];if(CS.__errors.length)throw Error('Bundle load failed');
   const e=React.createElement;const examples=[
    ['Button-xs',e(CS.Button,{size:'xs'},'Action'),'.cs-button'],['Button-sm',e(CS.Button,{size:'sm'},'Action'),'.cs-button'],['Button-md',e(CS.Button,null,'Action'),'.cs-button'],['Button-lg',e(CS.Button,{size:'lg'},'Action'),'.cs-button'],
    ['TextField',e(CS.TextField,{label:'Text'}),'input'],['Textarea',e(CS.Textarea,{label:'Text',rows:2}),'textarea'],['Select',e(CS.Select,{label:'Select',options:[{value:'a',label:'Alpha'}]}),'select'],['NativeSelect',e(CS.NativeSelect,{label:'Select',options:[{value:'a',label:'Alpha'}]}),'select'],['Mentions',e(CS.Mentions,{users:['User']}),'textarea'],
    ['NumberField',e(CS.NumberField,{label:'Number'}),'input'],['SearchField',e(CS.SearchField,null),'.cs-search'],['Combobox',e(CS.Combobox,{options:[],label:'Choose'}),'input'],['DatePicker',e(CS.DatePicker,{label:'Date'}),'button'],['TagInput',e(CS.TagInput,{label:'Tags'}),'.cs-taginput'],
    ['FormWizard-next',e(CS.FormWizard,{steps:[{title:'One'}]}),'.cs-form-wizard__nav button:last-child'],['ButtonGroup-child',e(CS.ButtonGroup,null,e(CS.Button,null,'One')),'.cs-button'],
    ['CardBody',e(CS.Card,null,e(CS.CardBody,null,'Content')),'.cs-card__body'],['DataTable-cell',e(CS.DataTable,{columns:[{key:'name',label:'Name'}],rows:[{id:'a',name:'Alpha'}]}),'td'],['Tabs-button',e(CS.Tabs,{tabs:[{value:'a',label:'Alpha'}],value:'a'}),'button'],
    ['TagInput-draft',e(CS.TagInput,{label:'Tags'}),'input'],['Calendar-root',e(CS.Calendar,{value:new Date(2026,9,20)}),'.cs-cal'],['Form-root',e(CS.Form,null,e('input',{'aria-label':'Form input'})),'.cs-form'],['Form-summary',e(CS.Form,{errors:{field:'Validation failed'}},e('input',{'aria-label':'Form input'})),'.cs-form__summary'],
   ];window.spacingExamples=examples.map(([name,,selector])=>({name,selector}));
   const scopes=[['default',null],['comfortable','comfortable'],['compact','compact'],['inherited',null,'compact'],['reset','comfortable','compact'],['reentry','compact','comfortable','compact']];
   const nodes=scopes.map(([name,density,parent,grandparent])=>{let node=e('div',{'data-spacing-scope':name,'data-cs-density':density,style:{width:360}},...examples.map(([name,component])=>e('section',{'data-example':name,key:name,style:{marginBottom:12}},component)));if(parent)node=e('div',{'data-cs-density':parent},node);if(grandparent)node=e('div',{'data-cs-density':grandparent},node);return node;});
   const fixtureRoot=ReactDOM.createRoot(document.getElementById('fixture'));ReactDOM.flushSync(()=>fixtureRoot.render(e('div',{style:{display:'grid',gridTemplateColumns:'repeat(3, 360px)',gap:16}},...nodes)));
  });
  await page.evaluate(()=>document.fonts.ready);
  return page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-spacing-scope]')].map(scope=>[scope.dataset.spacingScope,Object.fromEntries(spacingExamples.map(({name,selector})=>{
   const element=scope.querySelector('[data-example="'+name+'"] '+selector),s=getComputedStyle(element),r=element.getBoundingClientRect();
   const properties=['paddingTop','paddingRight','paddingBottom','paddingLeft','rowGap','columnGap','marginTop','marginRight','marginBottom','marginLeft','minHeight','minWidth','fontFamily','fontSize','lineHeight','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','borderRadius','outlineWidth','outlineOffset'];
   return [name,{...Object.fromEntries(properties.map(p=>[p,s[p]])),x:r.x,y:r.y,width:r.width,height:r.height}];
  }))])));
 }
 const pointer=await page.evaluate(()=>({coarse:matchMedia('(pointer:coarse)').matches,fine:matchMedia('(pointer:fine)').matches}));assert.equal(pointer.coarse,coarse,browserName+': requested pointer mode must actually match');
 const before=await render('baseline');let comparisons=0;const modeResults=[];
 for(const next of ['source','flattened']){
  const after=await render(next);assert.deepEqual(after,before,browserName+'/'+(coarse?'coarse':'fine')+'/'+next+': rendered geometry/styles changed');comparisons+=Object.keys(after).length*spacingTargetCount(after);
  // Token mutations prove these declarations consume the existing tokens in both distributions.
  await page.evaluate(()=>{for(const scope of document.querySelectorAll('[data-spacing-scope]'))for(const [name,value]of Object.entries({'--cs-space-1':'5px','--cs-space-2':'11px','--cs-space-3':'15px','--cs-space-4':'19px'}))scope.style.setProperty(name,value)});
  const mutated=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-spacing-scope]')].map(scope=>{const get=(name,selector,prop)=>getComputedStyle(scope.querySelector('[data-example="'+name+'"] '+selector))[prop];return [scope.dataset.spacingScope,{
   searchGap:get('SearchField','.cs-search','columnGap'),comboLeading:get('Combobox','input','paddingLeft'),comboTrailing:get('Combobox','input','paddingRight'),tagContainer:get('TagInput','.cs-taginput','paddingLeft'),tagDraft:get('TagInput-draft','input','paddingLeft'),calendar:get('Calendar-root','.cs-cal','paddingTop'),dateGap:get('DatePicker','button','columnGap'),dateBlock:get('DatePicker','button','paddingTop'),dateInline:get('DatePicker','button','paddingLeft'),formGap:get('Form-root','.cs-form','rowGap'),summaryBlock:get('Form-summary','.cs-form__summary','paddingTop'),summaryInline:get('Form-summary','.cs-form__summary','paddingRight'),
  }]})));
  for(const [scope,value]of Object.entries(mutated))assert.deepEqual(value,{searchGap:'11px',comboLeading:'15px',comboTrailing:'34px',tagContainer:'11px',tagDraft:'5px',calendar:'15px',dateGap:'11px',dateBlock:'11px',dateInline:'15px',formGap:'19px',summaryBlock:'15px',summaryInline:'14px'},next+'/'+scope+': spacing token resolution/retained clearances');
  modeResults.push({mode:next,renderedTargets:Object.keys(after).length*spacingTargetCount(after),tokenResolutionScopes:Object.keys(mutated).length});
 }
 if(coarse)for(const [scope,targets]of Object.entries(before))for(const name of ['Button-xs','Button-sm','Button-md','Button-lg','TextField','Select','NativeSelect','SearchField','Combobox','DatePicker','TagInput'])assert(targets[name].height>=44,scope+'/'+name+': coarse target floor');
 const row={browser:browserName,pointer:coarse?'coarse':'fine',modes:modeResults,baselineTargetCount:Object.keys(before).length*spacingTargetCount(before),pass:true};results.push(row);writeFileSync(output+'/'+browserName+'-'+row.pointer+'.json',JSON.stringify({baseline:before,...row},null,2)+'\n');console.log('PASS spacing roles '+browserName+'/'+row.pointer+': '+comparisons+' baseline/current comparisons plus source+flattened token interventions');
},{browserName,contextOptions:{hasTouch:coarse,viewport:{width:1280,height:900}}});
function spacingTargetCount(snapshot){return Object.keys(Object.values(snapshot)[0]).length;}
assert.equal(read(contract.source),current,'Source CSS changed during comparison');assert.equal(read('dist/styles.min.css'),flattened,'Flattened CSS changed during comparison');
assert.equal(results.length,6,'Every engine/pointer context must complete');
const receipt={schemaVersion:1,node:process.version,pass:true,sourceArtifactsUnchanged:true,scope:'Exact rendered baseline preservation for 23 targets across six default/density/inherited/reset scopes, all3engines fine/coarse, source+flattened; token mutation proof, no expanded compact promise',hashes:{baseline:hash(baseline),source:hash(current),flattened:hash(flattened)},results};writeFileSync(output+'/receipt.json',JSON.stringify(receipt,null,2)+'\n');
