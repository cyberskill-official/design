import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium';
await withBrowserFixture(async page=>{
 for(const width of [320,1280])for(const density of ['comfortable','compact'])for(const dir of ['ltr','rtl'])for(const initial of [20,50,80])for(const edge of ['left','right']){
  await page.setViewportSize({width,height:500});
  await page.evaluate(({dir,density,initial})=>{renderFixture(null);renderFixture(React.createElement('main',{dir,'data-cs-density':density,style:{padding:12}},React.createElement(CS.Splitter,{initial,start:'Start',end:'End'})))},{dir,density,initial});
  const bar=page.getByRole('separator'),box=await bar.boundingBox();assert.equal(box.width,44);
  const geometry=await page.locator('.cs-splitter').evaluate(el=>{const panes=el.querySelectorAll('.cs-splitter__pane'),bar=el.querySelector('.cs-splitter__bar');return {available:el.clientWidth-bar.getBoundingClientRect().width,start:panes[0].getBoundingClientRect().width,end:panes[1].getBoundingClientRect().width}});
  assert.ok(Math.abs(geometry.start-geometry.available*initial/100)<.1,'Pane percentages exclude the fixed handle');
  assert.ok(Math.abs(geometry.start+geometry.end-geometry.available)<.1);
  const x=edge==='left'?box.x+2:box.x+box.width-2,y=box.y+box.height/2;
  assert.equal(await bar.evaluate((el,{x,y})=>document.elementFromPoint(x,y)===el,{x,y}),true);
  const sign=(initial===80?-1:1)*(dir==='rtl'?-1:1);
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+sign,y);
  let moved=await bar.boundingBox();assert.ok(Math.abs(moved.x-box.x-sign)<.6,'First pixel must move the handle one pixel without a grab-offset jump');
  const delta=geometry.available*.1*sign;await page.mouse.move(x+delta,y);
  moved=await bar.boundingBox();assert.ok(Math.abs(moved.x-box.x-delta)<.6,'Handle follows pointer displacement');
  assert.equal(Number(await bar.getAttribute('aria-valuenow')),initial+(initial===80?-10:10));
  await page.mouse.up();const finalX=moved.x;await page.mouse.move(x,y);
  assert.ok(Math.abs((await bar.boundingBox()).x-finalX)<.1,'Completed drag stops tracking');
 }
},{browserName,contextOptions:{viewport:{width:320,height:500},hasTouch:true,...(browserName==='firefox'?{}:{isMobile:true})}});
console.log('PASS Splitter coarse handles: 48 real pointer drags across widths, densities, LTR/RTL, initial percentages and both handle edges; no grab jump, exact pane allocation and released-pointer cleanup.');
