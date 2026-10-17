import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{cwd:root,stdio:'pipe'});
const cases=[
 {id:'label-en',props:{'aria-label':'Profile preview'},name:'Profile preview'},
 {id:'label-vi',props:{'aria-label':'Thông tin hồ sơ'},name:'Thông tin hồ sơ'},
 {id:'heading',props:{'aria-labelledby':'panel-heading'},name:'Visible profile'},
 {id:'precedence',props:{'aria-labelledby':'panel-heading','aria-label':'Fallback preview'},name:'Visible profile'},
 {id:'missing',props:{},invalid:true},{id:'empty',props:{'aria-label':''},invalid:true},
 {id:'whitespace',props:{'aria-label':'  '},invalid:true},{id:'broken-reference',props:{'aria-labelledby':'missing-heading'},invalid:true},
];
const rows=[],runtime={node:process.version,browsers:{}};
for(const browserName of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 runtime.browsers[browserName]=page.context().browser().version();
 await page.addScriptTag({path:root+'/node_modules/axe-core/axe.min.js'});
 for(const component of ['HoverCard','Popover'])for(const item of cases)for(const nested of [false,true]){
  await page.evaluate(({component,item,nested})=>{
   window.parentCloses=0;const h=React.createElement;
   const child=h(CS[component],{key:component+item.id+nested,trigger:h('button',null,'Open preview'),openDelay:0,closeDelay:0,...item.props},h('h2',{id:'panel-heading'},h('span',null,'Visible'),' profile'),h('button',{id:'panel-action'},'Profile action'));
   renderFixture(nested?h(CS.Dialog,{open:true,title:'Parent',onClose:()=>parentCloses++},child):child);
  },{component,item,nested});
  const trigger=page.getByRole('button',{name:'Open preview',exact:true});await trigger.focus();if(component==='Popover')await trigger.press('Enter');
  const selector=component==='HoverCard'?'.cs-hovercard__panel':'.cs-popover__panel';await page.locator(selector).waitFor();
  const result=await page.evaluate(async selector=>{const result=await axe.run(document.querySelector(selector),{runOnly:{type:'rule',values:['aria-dialog-name']}});return{violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),incomplete:result.incomplete.map(v=>v.id),axeVersion:axe.version};},selector);
  assert.deepEqual(result.incomplete,[]);
  assert.equal(result.violations.length,item.invalid?1:0,component+'/'+item.id+'/'+nested);
  if(!item.invalid)assert.equal(await page.getByRole('dialog',{name:item.name,exact:true}).count(),1,'Resolved accessible name');
  await page.locator('#panel-action').focus();await page.keyboard.press('Escape');
   // A native Escape listener schedules React state; verify its committed DOM result.
   await page.locator(selector).waitFor({state:'detached',timeout:1000});
   assert.equal(await page.locator(selector).count(),0);
  await page.waitForFunction(()=>document.activeElement?.textContent==='Open preview');
  assert.equal(await page.evaluate(()=>parentCloses),0,'Child Escape preserves parent');
  if(nested){await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>parentCloses),1);}
  rows.push({browserName,component,case:item.id,nested,expectedInvalid:!!item.invalid,...result,result:'pass'});await page.evaluate(()=>renderFixture(null));
 }
 console.log(browserName+': '+rows.filter(row=>row.browserName===browserName).length+' candidate cases passed');
},{browserName});
assert.equal(rows.length,96);
if(process.env.CS_DIALOG_PANEL_NAME_REPORT)writeFileSync(process.env.CS_DIALOG_PANEL_NAME_REPORT,JSON.stringify({recordedAt:new Date().toISOString(),status:'completed',rows,runtime,scope:'96 maintained dialog naming and nested Escape checks against the actual served component bundle; invalid author names remain invalid. Manual AT/whole component acceptance separate.'},null,2)+'\n');
console.log('PASS 96 maintained dialog panel naming cases');
