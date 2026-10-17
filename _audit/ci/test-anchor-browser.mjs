import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 await page.evaluate(()=>{
  window.NativeIntersectionObserver=window.IntersectionObserver;
  window.observers=[];
  window.IntersectionObserver=class{constructor(cb){this.cb=cb;this.nodes=[];this.disconnected=false;observers.push(this)}observe(el){this.nodes.push(el)}disconnect(){this.disconnected=true}};
  window.drawAnchor=()=>renderFixture(React.createElement('div',null,React.createElement('section',{id:'a'},'A'),React.createElement('section',{id:'b'},'B'),React.createElement(CS.Anchor,{title:'Contents',items:[{id:'a',label:'A'},{id:'b',label:'B'}]})));
  window.report=entries=>ReactDOM.flushSync(()=>observers.at(-1).cb(entries.map(([id,isIntersecting])=>({target:document.getElementById(id),isIntersecting,boundingClientRect:document.getElementById(id).getBoundingClientRect()}))));
  drawAnchor();
 });
 await page.evaluate(()=>report([['a',true],['b',true]]));
 assert.equal(await page.locator('[aria-current="location"]').textContent(),'A');
 await page.evaluate(()=>report([['a',false]]));
 assert.equal(await page.locator('[aria-current="location"]').textContent(),'B','Leaving notification retains other visible section');
 await page.evaluate(()=>report([['b',false]]));
 assert.equal(await page.locator('[aria-current="location"]').textContent(),'B','No visible section preserves last location');
 await page.evaluate(()=>report([['a',true]]));
 assert.equal(await page.locator('[aria-current="location"]').textContent(),'A');
 await page.evaluate(()=>drawAnchor());
 assert.equal(await page.evaluate(()=>observers[0].disconnected),true,'Replacing observed items disconnects old observer');
 await page.evaluate(()=>renderFixture(null));
 assert.equal(await page.evaluate(()=>observers.every(o=>o.disconnected)),true,'Unmount disconnects observers');
 await page.setViewportSize({width:600,height:600});
 await page.evaluate(()=>{
  window.nativeReports=[];
  window.IntersectionObserver=class extends NativeIntersectionObserver{constructor(cb,options){super((entries,observer)=>{nativeReports.push(entries.map(e=>({id:e.target.id,visible:e.isIntersecting})));cb(entries,observer)},options)}};
  renderFixture(React.createElement('div',{style:{position:'relative',height:2000}},
   React.createElement('section',{id:'native-a',style:{position:'absolute',top:100,height:200}},'A'),
   React.createElement('section',{id:'native-b',style:{position:'absolute',top:150,height:200}},'B'),
   React.createElement(CS.Anchor,{title:'Native contents',items:[{id:'native-a',label:'Native A'},{id:'native-b',label:'Native B'}]})));
  window.scrollTo({top:0,behavior:'instant'});
 });
 await page.waitForFunction(()=>nativeReports.some(batch=>batch.some(e=>e.id==='native-a'&&e.visible)&&batch.some(e=>e.id==='native-b'&&e.visible)));
 assert.equal(await page.locator('[aria-current="location"]').textContent(),'Native A');
 await page.evaluate(()=>window.scrollTo({top:190,behavior:'instant'}));
 await page.waitForFunction(()=>document.querySelector('[aria-current="location"]')?.textContent==='Native B');
 assert.ok(await page.evaluate(()=>nativeReports.some(batch=>batch.some(e=>e.id==='native-a'&&!e.visible)&&!batch.some(e=>e.id==='native-b'))),'Native observer emitted only departing section update');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForFunction(()=>document.querySelector('[aria-current="location"]')?.textContent==='Native A');
 await page.evaluate(()=>renderFixture(null));
 console.log('PASS Anchor: incremental visibility notifications, empty intersection, reentry, observer cleanup and native scrolling');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
