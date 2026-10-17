import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 await page.evaluate(()=>{window.drawSplitter=props=>renderFixture(React.createElement(CS.Splitter,{start:'Start',end:'End',lang:'en',...props}));drawSplitter({initial:95,min:20,max:80})});
 const bar=page.getByRole('separator');
 // Native document pointer handlers schedule React updates. Observe rendered
 // completion for positive cases and allow that queue to render before negatives.
 const settlePointerUpdate=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 assert.equal(await bar.getAttribute('aria-valuenow'),'80','Initial value respects bounds');
 await page.evaluate(()=>drawSplitter({min:30,max:60}));
 assert.equal(await bar.getAttribute('aria-valuenow'),'60','Changed bounds apply immediately');
 await bar.focus();await page.keyboard.press('ArrowLeft');
 assert.equal(await bar.getAttribute('aria-valuenow'),'58');
 await bar.dispatchEvent('pointerdown',{pointerId:1,button:0,clientX:100});
 await page.evaluate(()=>document.dispatchEvent(new PointerEvent('pointercancel',{pointerId:1,bubbles:true})));
 await page.evaluate(()=>document.dispatchEvent(new PointerEvent('pointermove',{pointerId:1,clientX:0,bubbles:true})));
 await settlePointerUpdate();
 assert.equal(await bar.getAttribute('aria-valuenow'),'58','Canceled drag cannot resize');
 await bar.dispatchEvent('pointerdown',{pointerId:3,button:0,clientX:100});
 await page.evaluate(()=>document.dispatchEvent(new PointerEvent('pointermove',{pointerId:4,clientX:0,bubbles:true})));
 await settlePointerUpdate();
 assert.equal(await bar.getAttribute('aria-valuenow'),'58','Unrelated pointer cannot resize');
 await page.evaluate(()=>document.dispatchEvent(new PointerEvent('pointermove',{pointerId:3,clientX:-10000,bubbles:true})));
 await page.waitForFunction(()=>document.querySelector('[role=separator]').getAttribute('aria-valuenow')==='30');
 assert.equal(await bar.getAttribute('aria-valuenow'),'30','Active pointer clamps at minimum');
 await page.evaluate(()=>document.dispatchEvent(new PointerEvent('pointerup',{pointerId:3,bubbles:true})));
 await page.evaluate(()=>document.dispatchEvent(new PointerEvent('pointermove',{pointerId:3,clientX:10000,bubbles:true})));
 await settlePointerUpdate();
 assert.equal(await bar.getAttribute('aria-valuenow'),'30','Completed drag cannot resize');
 await bar.dispatchEvent('pointerdown',{pointerId:2,button:0,clientX:100});
 await page.evaluate(()=>renderFixture(null));
 await page.evaluate(()=>document.dispatchEvent(new PointerEvent('pointermove',{pointerId:2,clientX:200,bubbles:true})));
 // Fixture rejects any uncaught browser error after unmount.
 for(const dir of ['ltr','rtl']) {
  await page.evaluate(dir=>renderFixture(React.createElement('div',{dir,key:dir},React.createElement(CS.Splitter,{start:'Start',end:'End',initial:50}))),dir);
  assert.equal(await bar.getAttribute('aria-orientation'),'vertical','Divider is vertical');
  await bar.focus();await page.keyboard.press('ArrowLeft');
  assert.equal(await bar.getAttribute('aria-valuenow'),dir==='rtl'?'52':'48','ArrowLeft moves the divider visually left');
  const grip=await bar.boundingBox();
  const startValue=Number(await bar.getAttribute('aria-valuenow'));
  await bar.dispatchEvent('pointerdown',{pointerId:8,button:0,clientX:grip.x+grip.width/2});
  await page.locator('.cs-splitter').evaluate((el,{dir,startValue,x})=>{
    const bar=el.querySelector('[role=separator]'),available=el.clientWidth-bar.getBoundingClientRect().width;
    const target=dir==='rtl'?75:25;
    document.dispatchEvent(new PointerEvent('pointermove',{pointerId:8,clientX:x+(target-startValue)*available/100*(dir==='rtl'?-1:1),bubbles:true}));
  },{dir,startValue,x:grip.x+grip.width/2});
  await page.waitForFunction(expected=>document.querySelector('[role=separator]').getAttribute('aria-valuenow')===expected,dir==='rtl'?'75':'25');
  assert.equal(await bar.getAttribute('aria-valuenow'),dir==='rtl'?'75':'25','Pointer uses logical start edge');
  await page.evaluate(()=>document.dispatchEvent(new PointerEvent('pointerup',{pointerId:8,bubbles:true})));
  assert.equal(await bar.evaluate(el=>{const e=new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true});el.dispatchEvent(e);return e.defaultPrevented}),true,'Resize arrows suppress page scrolling');
 }
 console.log('PASS Splitter: initial/dynamic bounds, keyboard resize, pointer cancellation and unmount cleanup');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
