import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium';
for(const coarse of [false,true])await withBrowserFixture(async page=>{
 await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});
 await page.evaluate(()=>{
  const h=React.createElement;window.gridEvents=[];
  function Probe(){
   const [selected,setSelected]=React.useState([]),[count,setCount]=React.useState(200),[estimate,setEstimate]=React.useState(36);
   window.gridUpdate=(count,estimate=36)=>{setCount(count);setEstimate(estimate)};
   return h('main',{style:{padding:12,fontSize:16}},h(CS.DataGrid,{caption:'Projects',selectable:true,selected,onSelect:keys=>{gridEvents.push(keys);setSelected(keys)},virtual:true,rowHeight:estimate,height:350,persistKey:'touch-grid-test',columns:[{key:'name',header:'Name',sortable:true},{key:'group',header:'Group',sortable:true}],rows:Array.from({length:count},(_,id)=>({id,name:'Row '+id,group:'G'+id}))}));
  }
  renderFixture(h(Probe));
 });
 const grid=page.locator('.cs-datagrid');
 await page.waitForFunction(()=>Number(document.querySelector('.cs-datagrid').dataset.rowHeight)>36);
 const metrics=()=>grid.evaluate(el=>{
  const rows=[...el.querySelectorAll('tbody tr:not([aria-hidden=true])')];
  return {estimate:Number(el.dataset.rowHeight),heights:rows.map(row=>row.getBoundingClientRect().height),rowCount:Number(el.dataset.rowCount),spacers:[...el.querySelectorAll('tbody tr[aria-hidden=true]')].map(row=>row.getBoundingClientRect().height)};
 });
 let m=await metrics();assert.ok(m.heights.every(height=>Math.abs(height-m.estimate)<1),'Window step must match rendered uniform row height');
 assert.ok(Math.abs(m.spacers.reduce((a,b)=>a+b,0)-(200-m.heights.length)*m.estimate)<1,'Spacers must use the same row step');
 if(coarse){
  for(const selector of ['.cs-datagrid__check','.cs-datagrid__sort','.cs-datagrid__pin']){
   assert.ok((await page.locator(selector).evaluateAll(nodes=>nodes.map(el=>{const r=el.getBoundingClientRect();return r.width>=44&&r.height>=44}))).every(Boolean),selector);
  }
 }
 await grid.evaluate(el=>{el.scrollTop=Number(el.dataset.rowHeight)*100;el.dispatchEvent(new Event('scroll',{bubbles:true}))});
 await page.waitForFunction(()=>{const cell=document.querySelector('tbody tr:not([aria-hidden=true]) td:nth-child(2)');return Number(cell?.textContent.replace('Row ',''))>80});
 m=await metrics();assert.ok(m.heights.length<20,'Virtual body stays bounded');assert.ok(m.heights.every(height=>Math.abs(height-m.estimate)<1));
 // An actually visible label edge selects exactly its row, not a neighbor.
 const target=await grid.evaluate(el=>{
  const bottom=el.getBoundingClientRect().bottom,top=Math.max(el.getBoundingClientRect().top,...[...el.querySelectorAll('thead th')].map(th=>th.getBoundingClientRect().bottom));
  for(const row of el.querySelectorAll('tbody tr:not([aria-hidden=true])')){
   const label=row.querySelector('label'),r=label.getBoundingClientRect();
   if(r.top>=top&&r.bottom<=bottom){const x=r.x+2,y=r.y+r.height/2,hit=document.elementFromPoint(x,y);return {x,y,id:Number(row.querySelector('td:nth-child(2)').textContent.replace('Row ','')),owned:label===hit||label.contains(hit)}}
  }
 });
 assert.ok(target?.owned,'A visible row target edge must receive the pointer');
 if(coarse)await page.touchscreen.tap(target.x,target.y);else await page.mouse.click(target.x,target.y);
 await page.waitForFunction(()=>gridEvents.length===1);assert.deepEqual(await page.evaluate(()=>gridEvents),[[target.id]]);
 await grid.evaluate(el=>{el.scrollTop=0;el.dispatchEvent(new Event('scroll',{bubbles:true}))});
 await page.waitForFunction(()=>document.querySelector('tbody tr:not([aria-hidden=true]) td:nth-child(2)').textContent==='Row 0');
 await page.locator('thead .cs-datagrid__check').click();assert.equal(await page.evaluate(()=>gridEvents.at(-1).length),200);
 await page.locator('.cs-datagrid__sort').first().click();assert.equal(await page.locator('thead th').nth(1).getAttribute('aria-sort'),'ascending');
 await page.locator('.cs-datagrid__pin').last().click();assert.ok((await page.locator('thead th').nth(1).innerText()).startsWith('Group'));
 const original=Number(await grid.getAttribute('data-row-height'));
 await page.locator('main').evaluate(el=>el.style.fontSize='40px');
 await page.waitForFunction(original=>Number(document.querySelector('.cs-datagrid').dataset.rowHeight)>original,original);
 await page.locator('main').evaluate(el=>el.style.fontSize='16px');
 await page.waitForFunction(original=>Math.abs(Number(document.querySelector('.cs-datagrid').dataset.rowHeight)-original)<1,original);
 await page.evaluate(()=>gridUpdate(2));await page.waitForFunction(()=>document.querySelector('.cs-datagrid').dataset.rowCount==='2');
 assert.equal(await page.locator('tbody tr:not([aria-hidden=true])').count(),2);
 await page.evaluate(()=>gridUpdate(0));assert.equal(await page.locator('.cs-table__empty').count(),1);
 await page.evaluate(()=>gridUpdate(120,80));await page.waitForFunction(()=>Number(document.querySelector('.cs-datagrid').dataset.rowHeight)===80);
 m=await metrics();assert.ok(m.heights.every(height=>Math.abs(height-80)<1));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.evaluate(()=>renderFixture(null));
 console.log(`PASS DataGrid ${coarse?'coarse':'fine'}: actual uniform row step, spacers, bounded scroll, edge selection, header actions, ancestor font resize/reset, shrink/empty/regrowth and explicit estimate`);
},{browserName,contextOptions:{viewport:{width:390,height:900},hasTouch:coarse,...(coarse&&browserName!=='firefox'?{isMobile:true}:{})}});
