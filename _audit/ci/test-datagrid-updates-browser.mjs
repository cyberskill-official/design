import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
const failures=[];
await withBrowserFixture(async page=>{
 for(const mode of ['forced-shrink','automatic-shrink','filtered']){
  try{
   await page.evaluate(mode=>{
    window.gridRows=Array.from({length:200},(_,i)=>({id:i,name:'Row '+i,group:i<90?'keep':'drop'}));
    window.drawGrid=({rows=gridRows,filterText='',height=200}={})=>renderFixture(React.createElement(CS.DataGrid,{key:mode,rows,filterText,filterKeys:['group'],virtual:mode==='forced-shrink',height,lang:'en',columns:[{key:'name',header:'Name',sortable:true}]}));
    drawGrid();
   },mode);
   const grid=page.locator('.cs-datagrid');
   await grid.evaluate(el=>{el.scrollTop=6000;el.dispatchEvent(new Event('scroll',{bubbles:true}))});
   await page.waitForFunction(()=>Number(document.querySelector('tbody tr:not([aria-hidden="true"])')?.textContent.match(/Row (\d+)/)?.[1])>80);
   await page.evaluate(mode=>drawGrid(mode==='filtered'?{filterText:'keep'}:{rows:gridRows.slice(0,mode==='forced-shrink'?2:90)}),mode);
   const count=mode==='forced-shrink'?2:90;
   await page.waitForFunction(()=>document.querySelector('.cs-datagrid').dataset.rowCount!=='200');
   const visible=await page.locator('tbody tr:not([aria-hidden="true"])').allTextContents();
   assert.ok(visible.length>0,'nonempty data became a blank window');
   for(const text of visible){const id=Number(text.match(/Row (\d+)/)?.[1]);assert.ok(Number.isInteger(id)&&id>=0&&id<count,'window contains a stale row: '+text)}
   assert.equal(await grid.getAttribute('data-virtual'),'true','case must continue exercising virtualization');
   assert.ok(visible.length<=14,'window remains bounded');
   await page.evaluate(()=>drawGrid({rows:[]}));
   assert.equal(await grid.getAttribute('data-row-count'),'0');
   assert.equal(await page.locator('.cs-table__empty').count(),1);
   await page.evaluate(()=>drawGrid({rows:gridRows.slice(0,40),height:400}));
   assert.ok((await page.locator('tbody').innerText()).includes('Row '),'regrowth restores rows');
   console.log('PASS DataGrid '+mode+' → empty → regrowth');
  }catch(e){failures.push(mode+': '+e.message)}
 }
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
assert.deepEqual(failures,[],failures.join('\n'));
