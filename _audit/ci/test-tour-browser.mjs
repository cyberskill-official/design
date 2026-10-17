import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 page.setDefaultTimeout(3000);
 await page.evaluate(()=>{
  window.tourClosed=0;
  window.drawTour=(count,open=true)=>renderFixture(React.createElement('div',null,
   React.createElement('button',{id:'target'},'Target'),
   React.createElement(CS.Tour,{open,onClose:()=>tourClosed++,steps:Array.from({length:count},(_,i)=>({target:'#target',title:'Step '+(i+1),body:'Details'}))})));
  drawTour(3);
 });
 await page.getByRole('button',{name:'Next',exact:true}).click();await page.getByRole('button',{name:'Next',exact:true}).click();
 assert.equal(await page.locator('.cs-tour__count').textContent(),'3 / 3');
 await page.evaluate(()=>drawTour(1));
 assert.equal(await page.locator('.cs-tour__count').textContent(),'1 / 1','Shrinking clamps the active step');
 await page.evaluate(()=>drawTour(3));
 assert.equal(await page.locator('.cs-tour__count').textContent(),'1 / 3','Regrowth does not revive the removed index');
 await page.getByRole('button',{name:'Next',exact:true}).click();await page.getByRole('button',{name:'Back',exact:true}).click();
 assert.equal(await page.locator('.cs-tour__count').textContent(),'1 / 3');
 await page.evaluate(()=>drawTour(0));
 assert.equal(await page.getByRole('dialog').count(),0);
 assert.equal(await page.locator('#target').evaluate(el=>el.closest('[inert]')!==null),false,'Empty tour releases modal isolation');
 await page.evaluate(()=>drawTour(2));
 assert.equal(await page.locator('.cs-tour__count').textContent(),'1 / 2');
 await page.getByRole('button',{name:'Next',exact:true}).click();await page.getByRole('button',{name:'Done',exact:true}).click();
 assert.equal(await page.evaluate(()=>tourClosed),1);
 assert.equal(await page.getByRole('dialog').count(),1,'Controlled open requires parent to close');
 await page.evaluate(()=>drawTour(2,false));assert.equal(await page.getByRole('dialog').count(),0);
 await page.evaluate(()=>drawTour(2));await page.waitForFunction(()=>document.querySelector('.cs-tour__count')?.textContent==='1 / 2');
 await page.evaluate(()=>renderFixture(React.createElement(CS.Tour,{open:true,steps:[{target:'#missing',title:React.createElement('span',null,'Rich ',React.createElement('em',null,'title'))}]})));
 assert.equal(await page.getByRole('dialog',{name:'Rich title',exact:true}).count(),1,'ReactNode title names dialog');
 const titleId=await page.getByRole('dialog').getAttribute('aria-labelledby');
 assert.ok(titleId);
 assert.equal(await page.locator(`[id="${titleId}"]`).count(),1,'Dialog references unique rendered title');
 await page.evaluate(()=>{
  renderFixture(React.createElement('div',null,React.createElement('div',{id:'moving',style:{position:'fixed',top:200,left:120,width:80,height:40}},'Target'),React.createElement(CS.Tour,{open:true,steps:[{target:'#moving',title:'Moving target'}]})));
 });
 await page.waitForFunction(()=>parseFloat(document.querySelector('.cs-tour__hole')?.style.top)===194);
 await page.evaluate(()=>{document.getElementById('moving').style.top='300px';document.getElementById('moving').style.width='120px'});
 await page.waitForFunction(()=>{const hole=document.querySelector('.cs-tour__hole');return parseFloat(hole?.style.top)===294&&parseFloat(hole?.style.width)===132});
 await page.evaluate(()=>document.getElementById('moving').remove());
 await page.waitForFunction(()=>!document.querySelector('.cs-tour__hole'));
 await page.evaluate(()=>{const el=document.createElement('div');el.id='moving';el.style.cssText='position:fixed;top:180px;left:90px;width:50px;height:30px';document.body.append(el)});
 await page.waitForFunction(()=>parseFloat(document.querySelector('.cs-tour__hole')?.style.top)===174);
 await page.evaluate(()=>{
  window.geometryReads=0;const el=document.getElementById('moving');const original=el.getBoundingClientRect.bind(el);
  el.getBoundingClientRect=()=>{geometryReads++;return original()};
 });
 await page.waitForFunction(()=>geometryReads>0);
 const stopped=await page.evaluate(async()=>{renderFixture(null);const before=geometryReads;for(let i=0;i<4;i++)await new Promise(requestAnimationFrame);document.getElementById('moving').remove();return geometryReads===before});
 assert.equal(stopped,true,'Unmount cancels geometry measurement');
 console.log('PASS Tour: dynamic shrink, regrowth, empty/repopulate, navigation, controlled close and reopen');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
